from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import socket
import sys
from pathlib import Path
from typing import Any

from PySide6.QtCore import QObject, QPoint, QRectF, QProcess, QThread, QTimer, Qt, QUrl, Signal, Slot
from PySide6.QtGui import (
    QAction,
    QColor,
    QCloseEvent,
    QDesktopServices,
    QFont,
    QIcon,
    QPainter,
    QPalette,
    QPen,
    QPixmap,
)
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QColorDialog,
    QComboBox,
    QFileDialog,
    QFormLayout,
    QFrame,
    QGroupBox,
    QHBoxLayout,
    QInputDialog,
    QLabel,
    QLineEdit,
    QMainWindow,
    QMenu,
    QMessageBox,
    QPlainTextEdit,
    QPushButton,
    QScrollArea,
    QSizePolicy,
    QSplitter,
    QToolBar,
    QToolButton,
    QVBoxLayout,
    QWidget,
)
from PySide6.QtWebEngineWidgets import QWebEngineView
from PySide6.QtWebChannel import QWebChannel

from .builder import TemplateBuilder, write_json_atomic
from .catalog import CatalogError, FieldDefinition, TemplateDefinition, discover_templates
from .component_catalog import (
    ComponentExistsError,
    ComponentFormatError,
    InstalledComponent,
    component_states,
    download_component,
    install_component,
    load_components,
    rebuild_generated_catalog,
    set_component_enabled,
    set_component_states,
)


REPO_ROOT = Path(__file__).resolve().parents[1]

COMPONENT_PREVIEWS = {
    "sections.intro": ("Introducción animada", "Sobre con los nombres y una apertura animada."),
    "sections.story": ("Historia", "Bloque editorial con imagen, título y párrafos."),
    "sections.countdown": ("Cuenta atrás", "Contadores destacados para días, horas, minutos y segundos."),
    "sections.schedule": ("Cronograma y lugares", "Línea temporal del evento y tarjetas de ubicaciones."),
    "sections.faq": ("Preguntas frecuentes", "Acordeón de preguntas y respuestas para invitados."),
    "sections.messages": ("Mensajes", "Formulario y espacio para mensajes de las personas invitadas."),
    "sections.rsvp": ("Confirmación RSVP", "Llamada visual con información y botón de confirmación."),
    "sections.cookies": ("Aviso de cookies", "Barra inferior para informar y gestionar el consentimiento."),
}

PALETTE_PRESETS = (
    (
        "Bosque elegante",
        {"theme.primaryDark": "#0F3D2E", "theme.primary": "#2E7D59", "theme.soft": "#DDF0E1", "theme.text": "#1F5E46"},
    ),
    (
        "Rosa romántica",
        {"theme.primaryDark": "#4A2435", "theme.primary": "#A4526D", "theme.soft": "#F5DDE6", "theme.text": "#5A3441"},
    ),
    (
        "Terracota cálida",
        {"theme.primaryDark": "#5B2C1F", "theme.primary": "#B65F3C", "theme.soft": "#F2D8CA", "theme.text": "#6C3A2B"},
    ),
    (
        "Azul noche",
        {"theme.primaryDark": "#102A43", "theme.primary": "#2F5D8A", "theme.soft": "#DCE8F5", "theme.text": "#203B55"},
    ),
    (
        "Lavanda",
        {"theme.primaryDark": "#3D315B", "theme.primary": "#7668A6", "theme.soft": "#E7E1F2", "theme.text": "#4E4568"},
    ),
    (
        "Arena natural",
        {"theme.primaryDark": "#3F382F", "theme.primary": "#9A7B54", "theme.soft": "#EDE4D8", "theme.text": "#51483D"},
    ),
    (
        "Minimalista",
        {"theme.primaryDark": "#222222", "theme.primary": "#666666", "theme.soft": "#E8E8E8", "theme.text": "#333333"},
    ),
)


class ComponentPreviewCanvas(QWidget):
    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.component_key = "sections.story"
        self.setFixedHeight(142)

    def set_component(self, key: str) -> None:
        self.component_key = key
        self.update()

    def paintEvent(self, _event: object) -> None:
        painter = QPainter(self)
        painter.setRenderHint(QPainter.RenderHint.Antialiasing)
        canvas = QRectF(5, 5, self.width() - 10, self.height() - 10)
        painter.setPen(QPen(QColor("#C9DCCF"), 1))
        painter.setBrush(QColor("#FCFEFC"))
        painter.drawRoundedRect(canvas, 8, 8)
        dark, primary, soft, ink = map(QColor, ("#123B2B", "#2E7D59", "#DDF0E1", "#547060"))

        def block(rect: QRectF, color: QColor, radius: float = 3) -> None:
            painter.setPen(Qt.PenStyle.NoPen)
            painter.setBrush(color)
            painter.drawRoundedRect(rect, radius, radius)

        key = self.component_key
        if key == "sections.intro":
            block(QRectF(55, 28, 165, 88), QColor("#EAF6EC"), 5)
            painter.setPen(QPen(primary, 2))
            painter.drawLine(QPoint(55, 28), QPoint(138, 82))
            painter.drawLine(QPoint(220, 28), QPoint(138, 82))
            painter.drawEllipse(QPoint(138, 76), 14, 14)
        elif key in {"sections.story", "variant:split"}:
            block(QRectF(24, 24, 100, 94), soft, 4)
            block(QRectF(144, 31, 93, 9), dark, 3)
            block(QRectF(144, 57, 105, 5), ink, 2)
            block(QRectF(144, 70, 96, 5), ink, 2)
            block(QRectF(144, 83, 108, 5), ink, 2)
        elif key == "variant:feature":
            block(QRectF(62, 25, 152, 9), dark, 3)
            block(QRectF(44, 52, 188, 5), ink, 2)
            block(QRectF(55, 65, 166, 5), ink, 2)
            block(QRectF(96, 91, 84, 23), primary, 4)
        elif key == "sections.countdown":
            block(QRectF(72, 25, 132, 10), dark, 3)
            for index in range(4):
                x = 24 + index * 61
                block(QRectF(x, 55, 50, 48), soft, 5)
                block(QRectF(x + 13, 67, 24, 9), primary, 2)
                block(QRectF(x + 16, 85, 18, 4), ink, 2)
        elif key == "sections.schedule":
            painter.setPen(QPen(QColor("#B9D1C0"), 2))
            painter.drawLine(QPoint(57, 24), QPoint(57, 117))
            for index in range(4):
                y = 29 + index * 27
                painter.setBrush(primary)
                painter.setPen(Qt.PenStyle.NoPen)
                painter.drawEllipse(QPoint(57, y), 5, 5)
                block(QRectF(80, y - 4, 46, 7), dark, 2)
                block(QRectF(135, y - 4, 90, 7), soft, 2)
        elif key in {"sections.faq", "variant:cards"}:
            for index in range(4):
                y = 22 + index * 25
                block(QRectF(26, y, 224, 18), QColor("#F0F6F1"), 3)
                block(QRectF(38, y + 6, 120, 5), ink, 2)
                block(QRectF(228, y + 5, 7, 7), primary, 2)
        elif key == "sections.messages":
            block(QRectF(39, 22, 198, 12), dark, 3)
            block(QRectF(39, 48, 198, 46), QColor("#F0F6F1"), 4)
            block(QRectF(39, 104, 78, 18), primary, 4)
        elif key in {"sections.rsvp", "variant:banner"}:
            block(QRectF(18, 17, 240, 110), dark, 6)
            block(QRectF(78, 37, 120, 10), QColor("#FFFFFF"), 3)
            block(QRectF(54, 61, 168, 5), QColor("#A9C7B4"), 2)
            block(QRectF(91, 88, 94, 23), primary, 4)
        elif key == "variant:quote":
            painter.setPen(QPen(primary, 3))
            painter.drawLine(QPoint(39, 25), QPoint(39, 114))
            block(QRectF(61, 35, 168, 8), dark, 3)
            block(QRectF(61, 57, 181, 5), ink, 2)
            block(QRectF(61, 71, 164, 5), ink, 2)
            block(QRectF(61, 94, 72, 5), primary, 2)
        else:
            block(QRectF(18, 88, 240, 34), QColor("#F0F6F1"), 5)
            block(QRectF(31, 101, 128, 6), ink, 2)
            block(QRectF(193, 97, 50, 14), primary, 3)


class ComponentPreviewPopup(QFrame):
    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent, Qt.WindowType.ToolTip | Qt.WindowType.FramelessWindowHint)
        self.setObjectName("componentPreviewPopup")
        self.setAttribute(Qt.WidgetAttribute.WA_ShowWithoutActivating)
        self.setFixedSize(300, 228)
        layout = QVBoxLayout(self)
        layout.setContentsMargins(12, 12, 12, 12)
        layout.setSpacing(5)
        self.title = QLabel()
        self.title.setObjectName("componentPreviewTitle")
        self.description = QLabel()
        self.description.setObjectName("componentPreviewDescription")
        self.description.setWordWrap(True)
        self.canvas = ComponentPreviewCanvas()
        layout.addWidget(self.title)
        layout.addWidget(self.description)
        layout.addWidget(self.canvas)

    def show_component(
        self,
        key: str,
        menu: QMenu,
        metadata: tuple[str, str, str] | None = None,
    ) -> None:
        if metadata:
            title, description, preview_key = metadata
        else:
            title, description = COMPONENT_PREVIEWS.get(key, (key, "Vista previa del componente."))
            preview_key = key
        self.title.setText(title)
        self.description.setText(description)
        self.canvas.set_component(preview_key)
        menu_origin = menu.mapToGlobal(QPoint(0, 0))
        target = QPoint(menu_origin.x() - self.width() - 12, menu_origin.y())
        screen = QApplication.screenAt(menu_origin)
        if screen:
            available = screen.availableGeometry()
            if target.x() < available.left():
                target.setX(menu_origin.x() + menu.width() + 12)
            target.setY(max(available.top() + 8, min(target.y(), available.bottom() - self.height() - 8)))
        self.move(target)
        self.show()


class CheckableMenu(QMenu):
    def mouseReleaseEvent(self, event: object) -> None:
        position = event.position().toPoint()
        action = self.actionAt(position)
        if action and action.isCheckable():
            action.trigger()
            return
        super().mouseReleaseEvent(event)


class ComponentDropdown(QWidget):
    values_changed = Signal()
    component_hovered = Signal(str)
    custom_component_toggled = Signal(str, bool)
    preview_closed = Signal()

    def __init__(
        self,
        fields: list[FieldDefinition],
        values: dict[str, Any],
        installed_components: list[InstalledComponent] | None = None,
        parent: QWidget | None = None,
    ):
        super().__init__(parent)
        self.actions: dict[str, QAction] = {}
        self.preview_metadata: dict[str, tuple[str, str, str]] = {}
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(7)
        self.button = QToolButton()
        self.button.setObjectName("componentDropdown")
        self.button.setToolButtonStyle(Qt.ToolButtonStyle.ToolButtonTextBesideIcon)
        self.button.setPopupMode(QToolButton.ToolButtonPopupMode.InstantPopup)
        self.button.setArrowType(Qt.ArrowType.DownArrow)
        self.button.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Fixed)
        self.button.setMinimumWidth(0)
        self.menu = CheckableMenu(self.button)
        self.preview = ComponentPreviewPopup(self)
        for field in fields:
            action = self.menu.addAction(field.label)
            action.setCheckable(True)
            action.setData(field.key)
            action.setChecked(bool(values.get(field.key, field.default)))
            action.toggled.connect(lambda _checked, key=field.key: self._changed(key))
            self.actions[field.key] = action
        if fields and installed_components:
            self.menu.addSeparator()
        for component in installed_components or []:
            key = f"custom:{component.component_id}"
            action = self.menu.addAction(f"{component.name}  ·  .compt")
            action.setCheckable(True)
            action.setData(key)
            action.setChecked(component.enabled)
            action.toggled.connect(lambda _checked, action_key=key: self._changed(action_key))
            self.actions[key] = action
            self.preview_metadata[key] = (component.name, component.description, f"variant:{component.variant}")
        self.menu.hovered.connect(self._hovered)
        self.menu.aboutToHide.connect(self._closed)
        self.button.setMenu(self.menu)
        hint = QLabel("Abre el desplegable para activar componentes. Pasa el ratón para ver cada diseño.")
        hint.setObjectName("controlHint")
        hint.setWordWrap(True)
        layout.addWidget(self.button)
        layout.addWidget(hint)
        self._update_text()

    def value(self, key: str) -> bool:
        return self.actions[key].isChecked()

    def custom_states(self) -> dict[str, bool]:
        return {
            key.removeprefix("custom:"): action.isChecked()
            for key, action in self.actions.items()
            if key.startswith("custom:")
        }

    def set_values(self, values: dict[str, Any]) -> None:
        for key, action in self.actions.items():
            if key.startswith("custom:"):
                continue
            action.blockSignals(True)
            action.setChecked(bool(values.get(key, False)))
            action.blockSignals(False)
        self._update_text()

    def _changed(self, key: str) -> None:
        self._update_text()
        if key.startswith("custom:"):
            self.custom_component_toggled.emit(key.removeprefix("custom:"), self.actions[key].isChecked())
        else:
            self.values_changed.emit()

    def _update_text(self) -> None:
        active = sum(action.isChecked() for action in self.actions.values())
        self.button.setText(f"Componentes · {active} activos")

    def _hovered(self, action: QAction) -> None:
        if action.isSeparator() or action.data() is None:
            return
        key = str(action.data())
        self.preview.show_component(key, self.menu, self.preview_metadata.get(key))
        self.component_hovered.emit(key)

    def _closed(self) -> None:
        self.preview.hide()
        self.preview_closed.emit()


def palette_icon(colors: list[str]) -> QIcon:
    pixmap = QPixmap(92, 24)
    pixmap.fill(Qt.GlobalColor.transparent)
    painter = QPainter(pixmap)
    painter.setRenderHint(QPainter.RenderHint.Antialiasing)
    width = pixmap.width() / len(colors)
    for index, color in enumerate(colors):
        painter.fillRect(QRectF(index * width, 2, width + 1, 20), QColor(color))
    painter.setPen(QPen(QColor("#B8C8BC"), 1))
    painter.drawRoundedRect(QRectF(0.5, 1.5, 91, 21), 4, 4)
    painter.end()
    return QIcon(pixmap)


class PaletteDropdown(QWidget):
    values_changed = Signal()

    def __init__(self, fields: list[FieldDefinition], values: dict[str, Any], parent: QWidget | None = None):
        super().__init__(parent)
        self.keys = [field.key for field in fields]
        self.values = {field.key: str(values.get(field.key, field.default)) for field in fields}
        self.swatches: dict[str, QPushButton] = {}
        layout = QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.setSpacing(9)
        self.combo = QComboBox()
        self.combo.setObjectName("paletteDropdown")
        self.combo.setIconSize(QPixmap(92, 24).size())
        for name, palette in PALETTE_PRESETS:
            self.combo.addItem(palette_icon(list(palette.values())), name, palette)
        self.combo.addItem("Personalizada", "custom")
        self.combo.currentIndexChanged.connect(self._preset_changed)
        layout.addWidget(self.combo)

        swatch_layout = QHBoxLayout()
        swatch_layout.setContentsMargins(0, 0, 0, 0)
        swatch_layout.setSpacing(7)
        labels = ("Oscuro", "Principal", "Suave", "Texto")
        for key, label_text in zip(self.keys, labels, strict=False):
            column = QVBoxLayout()
            column.setSpacing(3)
            label = QLabel(label_text)
            label.setObjectName("swatchLabel")
            label.setAlignment(Qt.AlignmentFlag.AlignCenter)
            button = QPushButton()
            button.setObjectName("colorSwatchButton")
            button.setToolTip(f"Editar {label_text.lower()}")
            button.setFixedHeight(34)
            button.clicked.connect(lambda _checked=False, color_key=key: self._choose_color(color_key))
            self.swatches[key] = button
            column.addWidget(label)
            column.addWidget(button)
            swatch_layout.addLayout(column, 1)
        layout.addLayout(swatch_layout)
        hint = QLabel("Elige una paleta o pulsa una muestra para personalizar un color.")
        hint.setObjectName("controlHint")
        hint.setWordWrap(True)
        layout.addWidget(hint)
        self.set_values(self.values)

    def value(self, key: str) -> str:
        return self.values[key]

    def set_values(self, values: dict[str, Any]) -> None:
        for key in self.keys:
            if key in values:
                self.values[key] = str(values[key]).upper()
        matching_index = self.combo.count() - 1
        for index in range(len(PALETTE_PRESETS)):
            preset = self.combo.itemData(index)
            if all(str(preset.get(key, "")).upper() == self.values.get(key, "").upper() for key in self.keys):
                matching_index = index
                break
        self.combo.blockSignals(True)
        self.combo.setCurrentIndex(matching_index)
        self.combo.blockSignals(False)
        self._update_swatches()

    def _preset_changed(self, index: int) -> None:
        preset = self.combo.itemData(index)
        if not isinstance(preset, dict):
            return
        self.values.update({key: str(value).upper() for key, value in preset.items() if key in self.keys})
        self._update_swatches()
        self.values_changed.emit()

    def _choose_color(self, key: str) -> None:
        initial = QColor(self.values.get(key, "#2E7D59"))
        color = QColorDialog.getColor(initial, self, "Personaliza la paleta")
        if not color.isValid():
            return
        self.values[key] = color.name().upper()
        self.combo.blockSignals(True)
        self.combo.setCurrentIndex(self.combo.count() - 1)
        self.combo.blockSignals(False)
        self._update_swatches()
        self.values_changed.emit()

    def _update_swatches(self) -> None:
        for key, button in self.swatches.items():
            color = self.values.get(key, "#FFFFFF")
            button.setStyleSheet(
                f"QPushButton {{ background: {color}; border: 2px solid #FFFFFF; border-radius: 6px; }}"
                "QPushButton:hover { border: 2px solid #2E7D59; }"
            )


class PreviewBridge(QObject):
    field_selected = Signal(str)
    field_edited = Signal(str, str, bool)
    component_visible = Signal(str)

    @Slot(str)
    def selectField(self, key: str) -> None:  # Qt WebChannel conserva nombres camelCase.
        self.field_selected.emit(key)

    @Slot(str, str, bool)
    def editField(self, key: str, value: str, committed: bool) -> None:
        self.field_edited.emit(key, value, committed)

    @Slot(str)
    def selectComponent(self, key: str) -> None:
        self.component_visible.emit(key)


class ExportWorker(QThread):
    completed = Signal(str)
    failed = Signal(str)

    def __init__(self, builder: TemplateBuilder, parent: Path, values: dict[str, Any]):
        super().__init__()
        self.builder = builder
        self.parent = parent
        self.values = values

    def run(self) -> None:
        try:
            destination = self.builder.export(self.parent, self.values)
        except Exception as exc:  # El error se muestra en el hilo de interfaz.
            self.failed.emit(str(exc))
        else:
            self.completed.emit(str(destination))


class EditorWindow(QMainWindow):
    def __init__(self, templates: list[TemplateDefinition]):
        super().__init__()
        self.templates = templates
        self.template = templates[0]
        self.builder = TemplateBuilder(self.template)
        self.widgets: dict[str, QWidget] = {}
        self.loading_form = False
        self.server_ready = False
        self.preview_port = 0
        self.project_path: Path | None = None
        self.export_worker: ExportWorker | None = None
        self.selected_editor_key: str | None = None
        self.component_picker: ComponentDropdown | None = None
        self.palette_picker: PaletteDropdown | None = None

        self.preview_process = QProcess(self)
        self.preview_process.setProcessChannelMode(QProcess.ProcessChannelMode.MergedChannels)
        self.preview_process.readyReadStandardOutput.connect(self._read_server_output)
        self.preview_process.finished.connect(self._server_stopped)

        self.preview_debounce = QTimer(self)
        self.preview_debounce.setSingleShot(True)
        self.preview_debounce.setInterval(350)
        self.preview_debounce.timeout.connect(self._write_preview)

        self.retry_timer = QTimer(self)
        self.retry_timer.setSingleShot(True)
        self.retry_timer.timeout.connect(self._load_preview_url)

        self.setWindowTitle("Personalizador de plantillas")
        self.setMinimumSize(1100, 720)
        self.resize(1500, 900)
        self._create_toolbar()
        self._create_content()
        self._apply_styles()
        self._select_template(0)

    def _create_toolbar(self) -> None:
        toolbar = QToolBar("Proyecto", self)
        toolbar.setMovable(False)
        toolbar.setToolButtonStyle(Qt.ToolButtonStyle.ToolButtonTextOnly)
        self.addToolBar(toolbar)

        for label, shortcut, callback in (
            ("Nuevo", "Ctrl+N", self.reset_project),
            ("Abrir", "Ctrl+O", self.open_project),
            ("Guardar", "Ctrl+S", self.save_project),
        ):
            action = QAction(label, self)
            action.setShortcut(shortcut)
            action.triggered.connect(callback)
            toolbar.addAction(action)

        toolbar.addSeparator()
        refresh = QAction("Actualizar vista", self)
        refresh.setShortcut("Ctrl+R")
        refresh.triggered.connect(self.refresh_preview)
        toolbar.addAction(refresh)

        toolbar.addSeparator()
        self.export_action = QAction("Exportar web", self)
        self.export_action.triggered.connect(self.export_site)
        toolbar.addAction(self.export_action)

        toolbar.addSeparator()
        import_component = QAction("Añadir componente", self)
        import_component.setToolTip("Instalar un archivo .compt desde el equipo o una URL HTTPS")
        import_component.triggered.connect(self.add_component)
        toolbar.addAction(import_component)

    def _create_content(self) -> None:
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.setChildrenCollapsible(False)
        self.setCentralWidget(splitter)

        sidebar = QWidget()
        sidebar.setObjectName("editorPanel")
        sidebar.setMinimumWidth(370)
        sidebar.setMaximumWidth(560)
        sidebar_layout = QVBoxLayout(sidebar)
        sidebar_layout.setContentsMargins(18, 18, 18, 18)
        sidebar_layout.setSpacing(12)

        title = QLabel("Personaliza tu web")
        title.setObjectName("editorTitle")
        sidebar_layout.addWidget(title)

        template_label = QLabel("PLANTILLA ACTIVA")
        template_label.setObjectName("templateLabel")
        sidebar_layout.addWidget(template_label)

        self.template_combo = QComboBox()
        for template in self.templates:
            self.template_combo.addItem(template.name, template.template_id)
        self.template_combo.currentIndexChanged.connect(self._select_template)
        sidebar_layout.addWidget(self.template_combo)

        self.description_label = QLabel()
        self.description_label.setWordWrap(True)
        self.description_label.setObjectName("description")
        sidebar_layout.addWidget(self.description_label)

        self.palette_group = QGroupBox("Paleta de colores")
        self.palette_group.setObjectName("pinnedPalette")
        self.palette_layout = QVBoxLayout(self.palette_group)
        self.palette_layout.setContentsMargins(10, 12, 10, 10)
        sidebar_layout.addWidget(self.palette_group)

        visual_hint = QLabel("✦ Haz clic en un texto de la vista previa y escribe directamente sobre él.")
        visual_hint.setWordWrap(True)
        visual_hint.setObjectName("visualHint")
        sidebar_layout.addWidget(visual_hint)

        self.form_container = QWidget()
        self.form_container.setObjectName("formContainer")
        self.form_layout = QVBoxLayout(self.form_container)
        self.form_layout.setContentsMargins(0, 4, 5, 4)
        self.form_layout.setSpacing(16)

        self.form_scroll = QScrollArea()
        self.form_scroll.setWidgetResizable(True)
        self.form_scroll.setFrameShape(QFrame.Shape.NoFrame)
        self.form_scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.form_scroll.viewport().setObjectName("formViewport")
        self.form_scroll.setWidget(self.form_container)
        sidebar_layout.addWidget(self.form_scroll, 1)

        self.status_label = QLabel("Preparando previsualización…")
        self.status_label.setWordWrap(True)
        self.status_label.setObjectName("status")
        sidebar_layout.addWidget(self.status_label)

        preview_frame = QWidget()
        preview_frame.setObjectName("previewPanel")
        preview_layout = QVBoxLayout(preview_frame)
        preview_layout.setContentsMargins(0, 0, 0, 0)
        preview_layout.setSpacing(0)
        preview_header = QLabel("VISTA PREVIA  ·  pasa el cursor por un texto para editarlo")
        preview_header.setObjectName("previewHeader")
        preview_layout.addWidget(preview_header)
        self.web_view = QWebEngineView()
        self.web_view.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)
        self.web_view.loadFinished.connect(self._preview_loaded)
        self.preview_bridge = PreviewBridge(self)
        self.preview_bridge.field_selected.connect(self._select_field_from_preview)
        self.preview_bridge.field_edited.connect(self._edit_field_from_preview)
        self.preview_bridge.component_visible.connect(self._scroll_settings_for_component)
        self.web_channel = QWebChannel(self.web_view.page())
        self.web_channel.registerObject("editorBridge", self.preview_bridge)
        self.web_view.page().setWebChannel(self.web_channel)
        self.web_view.setHtml(
            "<main style='font:16px system-ui;display:grid;place-items:center;height:100vh;color:#315c49'>"
            "Iniciando la previsualización…</main>"
        )
        preview_layout.addWidget(self.web_view)

        splitter.addWidget(preview_frame)
        splitter.addWidget(sidebar)
        splitter.setSizes([1050, 450])

    def _apply_styles(self) -> None:
        self.setStyleSheet(
            """
            QMainWindow { background: #eef3ef; }
            QWidget#editorPanel { background: #f4f8f5; border-left: 1px solid #ccdbd0; }
            QWidget#previewPanel { background: #dfe7e1; }
            QToolBar { background: #ffffff; border-bottom: 1px solid #dce8df; spacing: 5px; padding: 7px; }
            QToolButton { padding: 7px 12px; border-radius: 5px; color: #163e2e; }
            QToolButton:hover { background: #eaf5ed; }
            QLabel#editorTitle { font-size: 22px; font-weight: 700; color: #123b2b; background: transparent; }
            QLabel#templateLabel { color: #254F3D; background: transparent; font-size: 11px; font-weight: 700; }
            QLabel#description { color: #5a7165; padding-bottom: 4px; }
            QLabel#visualHint { color: #174a35; background: #dff1e4; border: 1px solid #bed8c5;
                                border-radius: 7px; padding: 10px; font-weight: 600; }
            QLabel#previewHeader { color: #315c49; background: #eef4ef; border-bottom: 1px solid #cad8ce;
                                   padding: 9px 14px; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
            QLabel#status { color: #315c49; background: #e8f3eb; border-radius: 6px; padding: 9px; }
            QWidget#formContainer, QWidget#formViewport { background: #f4f8f5; color: #173e2f; }
            QGroupBox { font-weight: 700; color: #173e2f; border: 1px solid #ceddd2; border-radius: 9px;
                        margin-top: 17px; padding: 17px 12px 13px 12px; background: #ffffff; }
            QGroupBox::title { subcontrol-origin: margin; subcontrol-position: top left; left: 10px;
                               color: #174a35; background: #e8f3eb; border: 1px solid #c9ddce;
                               border-radius: 5px; padding: 3px 9px; }
            QLabel#fieldLabel { color: #254f3d; background: transparent; font-size: 12px; font-weight: 600;
                                padding: 2px 1px 0 1px; }
            QLabel#controlHint { color: #71877A; background: transparent; font-size: 11px; padding: 1px; }
            QLabel#componentError { color: #8A3E36; background: #FBEDEB; border: 1px solid #E8C5C0;
                                    border-radius: 5px; padding: 7px; font-size: 11px; }
            QLabel#swatchLabel { color: #4C6959; background: transparent; font-size: 10px; font-weight: 600; }
            QLineEdit, QPlainTextEdit, QComboBox { color: #173e2f; border: 1px solid #bfcfc3; border-radius: 6px;
                                                  padding: 8px; background: #ffffff;
                                                  selection-color: #ffffff; selection-background-color: #2e7d59; }
            QLineEdit { min-height: 20px; }
            QLineEdit::placeholder, QPlainTextEdit::placeholder { color: #7a9184; }
            QComboBox { min-height: 23px; padding-right: 24px; }
            QComboBox QAbstractItemView { color: #173e2f; background: #ffffff; border: 1px solid #bfcfc3;
                                          selection-color: #ffffff; selection-background-color: #2e7d59; }
            QLineEdit:focus, QPlainTextEdit:focus, QComboBox:focus { border-color: #2e7d59; }
            QLineEdit[editorSelected="true"], QPlainTextEdit[editorSelected="true"] {
                border: 2px solid #2e7d59; background: #f0fbf3;
            }
            QCheckBox { color: #254f3d; background: transparent; spacing: 9px; padding: 5px 2px; font-weight: 600; }
            QToolButton#componentDropdown { color: #173e2f; background: #E8F3EB; border: 1px solid #B9D1C0;
                                            border-radius: 7px; padding: 10px 12px; font-weight: 700; text-align: left; }
            QToolButton#componentDropdown:hover { background: #DDEEE2; border-color: #2E7D59; }
            QToolButton#componentDropdown[componentCurrent="true"] { border: 2px solid #2E7D59; background: #D7ECDE; }
            QComboBox#paletteDropdown { min-height: 32px; font-weight: 700; }
            QMenu { color: #173e2f; background: #FFFFFF; border: 1px solid #BFD2C4; padding: 6px; }
            QMenu::item { color: #254F3D; background: transparent; padding: 8px 30px 8px 10px; border-radius: 4px; }
            QMenu::item:selected { color: #123B2B; background: #E2F1E6; }
            QMenu::indicator { width: 16px; height: 16px; }
            QFrame#componentPreviewPopup { color: #173e2f; background: #FFFFFF; border: 1px solid #AFC8B6;
                                           border-radius: 9px; }
            QLabel#componentPreviewTitle { color: #123B2B; background: transparent; font-size: 15px; font-weight: 700; }
            QLabel#componentPreviewDescription { color: #5A7165; background: transparent; font-size: 11px; }
            QPushButton { border: 1px solid #bfd2c4; border-radius: 5px; padding: 8px 10px; background: #f6faf7; color: #173e2f; }
            QPushButton:hover { background: #e8f3eb; }
            QScrollArea { color: #173e2f; background: #f4f8f5; border: none; }
            QScrollBar:vertical { background: #edf3ee; width: 10px; margin: 0; }
            QScrollBar::handle:vertical { background: #b7cabe; min-height: 32px; border-radius: 5px; }
            QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical { height: 0; }
            QSplitter::handle { background: #c9d8cd; width: 2px; }
            """
        )

    def _clear_form(self) -> None:
        self.selected_editor_key = None
        self.component_picker = None
        self.palette_picker = None
        while self.palette_layout.count():
            palette_item = self.palette_layout.takeAt(0)
            palette_widget = palette_item.widget()
            if palette_widget:
                palette_widget.deleteLater()
        self.palette_group.setVisible(False)
        while self.form_layout.count():
            item = self.form_layout.takeAt(0)
            widget = item.widget()
            if widget:
                widget.deleteLater()
        self.widgets.clear()

    def _select_template(self, index: int) -> None:
        if index < 0 or index >= len(self.templates):
            return
        self._stop_server()
        self.template = self.templates[index]
        self.builder = TemplateBuilder(self.template)
        self.project_path = None
        self.description_label.setText(self.template.description)
        self._build_form(self.template.current_values())
        self._write_preview()
        self._start_server()

    def _build_form(self, values: dict[str, Any]) -> None:
        self.loading_form = True
        self._clear_form()
        groups: dict[str, list[FieldDefinition]] = {}
        for field in self.template.fields:
            groups.setdefault(field.group, []).append(field)
        installed_components, component_errors = load_components(REPO_ROOT)
        has_component_group = False

        for group_name, fields in groups.items():
            is_component_group = all(field.kind == "boolean" for field in fields)
            is_palette_group = all(field.kind == "color" for field in fields)
            if is_palette_group:
                picker = PaletteDropdown(fields, values)
                picker.values_changed.connect(self._field_changed)
                self.palette_picker = picker
                for field in fields:
                    self.widgets[field.key] = picker
                self.palette_layout.addWidget(picker)
                self.palette_group.setVisible(True)
                continue
            visible_group_name = "Componentes" if is_component_group else group_name
            group = QGroupBox(visible_group_name)
            layout = QFormLayout(group)
            layout.setFieldGrowthPolicy(QFormLayout.FieldGrowthPolicy.AllNonFixedFieldsGrow)
            layout.setRowWrapPolicy(QFormLayout.RowWrapPolicy.WrapAllRows)
            layout.setLabelAlignment(Qt.AlignmentFlag.AlignLeft | Qt.AlignmentFlag.AlignBottom)
            layout.setFormAlignment(Qt.AlignmentFlag.AlignTop)
            layout.setHorizontalSpacing(8)
            layout.setVerticalSpacing(7)
            if is_component_group:
                has_component_group = True
                picker = ComponentDropdown(fields, values, installed_components)
                picker.values_changed.connect(self._field_changed)
                picker.component_hovered.connect(self._preview_component_hovered)
                picker.custom_component_toggled.connect(self._toggle_custom_component)
                picker.preview_closed.connect(self._clear_component_preview)
                self.component_picker = picker
                for field in fields:
                    self.widgets[field.key] = picker
                layout.addRow(picker)
                self.form_layout.addWidget(group)
                if component_errors:
                    error_label = QLabel("No se cargaron: " + " · ".join(component_errors))
                    error_label.setObjectName("componentError")
                    error_label.setWordWrap(True)
                    layout.addRow(error_label)
                continue
            for field in fields:
                widget = self._create_field_widget(field, values.get(field.key, field.default))
                self.widgets[field.key] = widget
                label = f"{field.label}{' *' if field.required else ''}"
                if field.kind == "boolean":
                    layout.addRow(widget)
                else:
                    label_widget = QLabel(label)
                    label_widget.setObjectName("fieldLabel")
                    label_widget.setWordWrap(True)
                    layout.addRow(label_widget, widget)
            self.form_layout.addWidget(group)
        if not has_component_group:
            group = QGroupBox("Componentes compartidos")
            layout = QVBoxLayout(group)
            picker = ComponentDropdown([], values, installed_components)
            picker.values_changed.connect(self._field_changed)
            picker.component_hovered.connect(self._preview_component_hovered)
            picker.custom_component_toggled.connect(self._toggle_custom_component)
            picker.preview_closed.connect(self._clear_component_preview)
            self.component_picker = picker
            layout.addWidget(picker)
            if component_errors:
                error_label = QLabel("No se cargaron: " + " · ".join(component_errors))
                error_label.setObjectName("componentError")
                error_label.setWordWrap(True)
                layout.addWidget(error_label)
            self.form_layout.addWidget(group)
        self.form_layout.addStretch(1)
        self.loading_form = False

    def _create_field_widget(self, field: FieldDefinition, value: Any) -> QWidget:
        if field.kind == "boolean":
            widget = QCheckBox(field.label)
            widget.setChecked(bool(value))
            widget.toggled.connect(self._field_changed)
            return widget

        if field.kind == "textarea":
            widget = QPlainTextEdit(str(value or ""))
            widget.setMinimumHeight(82)
            widget.setMaximumHeight(130)
            widget.textChanged.connect(self._field_changed)
            return widget

        if field.kind in {"color", "image"}:
            container = QWidget()
            layout = QHBoxLayout(container)
            layout.setContentsMargins(0, 0, 0, 0)
            layout.setSpacing(6)
            line = QLineEdit(str(value or ""))
            line.setObjectName("value")
            line.textChanged.connect(self._field_changed)
            button = QPushButton("Elegir…")
            if field.kind == "color":
                button.clicked.connect(lambda _checked=False, target=line: self._choose_color(target))
                line.setPlaceholderText("#2E7D59")
            else:
                button.clicked.connect(lambda _checked=False, target=line: self._choose_image(target))
                line.setPlaceholderText("Selecciona una imagen JPG, PNG o WebP")
            layout.addWidget(line, 1)
            layout.addWidget(button)
            return container

        widget = QLineEdit(str(value or ""))
        if field.kind == "url":
            widget.setPlaceholderText("https://…")
        elif field.kind == "datetime":
            widget.setPlaceholderText("AAAA-MM-DDTHH:MM")
        widget.textChanged.connect(self._field_changed)
        return widget

    def _choose_color(self, line: QLineEdit) -> None:
        initial = QColor(line.text()) if QColor.isValidColor(line.text()) else QColor("#2E7D59")
        color = QColorDialog.getColor(initial, self, "Selecciona un color")
        if color.isValid():
            line.setText(color.name().upper())

    def _choose_image(self, line: QLineEdit) -> None:
        path, _ = QFileDialog.getOpenFileName(
            self,
            "Selecciona una imagen",
            str(Path.home()),
            "Imágenes (*.jpg *.jpeg *.png *.webp *.gif *.avif);;Todos los archivos (*)",
        )
        if path:
            line.setText(path)

    def _field_changed(self, *_args: object) -> None:
        if not self.loading_form:
            self.status_label.setText("Aplicando cambios…")
            self.preview_debounce.start()

    def _select_field_from_preview(self, key: str) -> None:
        widget = self.widgets.get(key)
        if widget is None:
            return
        if self.selected_editor_key:
            previous = self.widgets.get(self.selected_editor_key)
            if previous is not None:
                previous.setProperty("editorSelected", False)
                previous.style().unpolish(previous)
                previous.style().polish(previous)
        self.selected_editor_key = key
        widget.setProperty("editorSelected", True)
        widget.style().unpolish(widget)
        widget.style().polish(widget)
        self.form_scroll.ensureWidgetVisible(widget, 20, 90)
        field = next((item for item in self.template.fields if item.key == key), None)
        self.status_label.setText(f"Editando visualmente: {field.label if field else key}")

    def _edit_field_from_preview(self, key: str, value: str, committed: bool) -> None:
        widget = self.widgets.get(key)
        if widget is None:
            return
        normalized = value.replace("\r\n", "\n").replace("\u00a0", " ")
        self.loading_form = True
        if isinstance(widget, QPlainTextEdit):
            if widget.toPlainText() != normalized:
                widget.setPlainText(normalized)
        elif isinstance(widget, QLineEdit):
            if widget.text() != normalized:
                widget.setText(normalized)
        self.loading_form = False
        if committed:
            self.status_label.setText("Guardando el texto editado…")
            self.preview_debounce.start()

    def _scroll_settings_for_component(self, component_key: str) -> None:
        field_by_component = {
            "hero": "hero.eyebrow",
            "story": "story.title",
            "countdown": "event.dateIso",
            "schedule": "event.venue",
            "rsvp": "rsvp.noteTitle",
            "footer": "couple.partner1",
        }
        field_key = field_by_component.get(component_key)
        if field_key and field_key in self.widgets:
            if self.component_picker:
                self.component_picker.button.setProperty("componentCurrent", False)
                self.component_picker.button.style().unpolish(self.component_picker.button)
                self.component_picker.button.style().polish(self.component_picker.button)
            self._select_field_from_preview(field_key)
            self.status_label.setText(f"Ajustes sincronizados con: {component_key}")
            return
        if self.component_picker:
            self.component_picker.button.setProperty("componentCurrent", True)
            self.component_picker.button.style().unpolish(self.component_picker.button)
            self.component_picker.button.style().polish(self.component_picker.button)
            self.form_scroll.ensureWidgetVisible(self.component_picker, 20, 130)
            label = component_key.removeprefix("custom:").replace("-", " ")
            self.status_label.setText(f"Componente visible: {label}")

    def _preview_component_hovered(self, key: str) -> None:
        if key.startswith("custom:"):
            component_id = key.removeprefix("custom:")
            action = self.component_picker.actions.get(key) if self.component_picker else None
            title = action.text().replace("  ·  .compt", "") if action else component_id
        else:
            component_id = ""
            title = COMPONENT_PREVIEWS.get(key, (key, ""))[0]
        if not self.component_picker or not self.component_picker.value(key):
            self.status_label.setText(f"Vista de {title} · actívalo para verlo en la página")
            self._clear_component_preview(update_status=False)
            return
        selectors = {
            "sections.intro": "#hero",
            "sections.story": "#sobre-nosotros",
            "sections.countdown": "#countdown",
            "sections.schedule": "#cronograma",
            "sections.faq": "#preguntas-frecuentes",
            "sections.messages": "#mensajes",
            "sections.rsvp": "#confirmar-asistencia",
            "sections.cookies": "#cookie-consent",
        }
        selector = f"#custom-component-{component_id}" if component_id else selectors.get(key)
        if not selector:
            return
        script = f"""
        (() => {{
          document.querySelectorAll('.template-component-hover').forEach((node) =>
            node.classList.remove('template-component-hover'));
          const target = document.querySelector({json.dumps(selector)});
          if (!target) return false;
          target.classList.add('template-component-hover');
          target.scrollIntoView({{ behavior: 'smooth', block: 'center' }});
          return true;
        }})()
        """
        self.web_view.page().runJavaScript(script)
        self.status_label.setText(f"Vista previa del componente: {title}")

    def _toggle_custom_component(self, component_id: str, enabled: bool) -> None:
        try:
            set_component_enabled(REPO_ROOT, component_id, enabled)
        except (OSError, ComponentFormatError) as exc:
            QMessageBox.critical(self, "No se pudo actualizar", str(exc))
            return
        state = "activado" if enabled else "desactivado"
        self.status_label.setText(f"Componente {state}: {component_id}")
        if self.server_ready:
            QTimer.singleShot(450, self.web_view.reload)

    def _clear_component_preview(self, update_status: bool = True) -> None:
        self.web_view.page().runJavaScript(
            "document.querySelectorAll('.template-component-hover').forEach((node) => "
            "node.classList.remove('template-component-hover'));"
        )
        if update_status and self.server_ready:
            self.status_label.setText("Previsualización conectada · haz clic en un texto")

    def _widget_value(self, key: str, widget: QWidget) -> Any:
        if isinstance(widget, ComponentDropdown):
            return widget.value(key)
        if isinstance(widget, PaletteDropdown):
            return widget.value(key)
        if isinstance(widget, QCheckBox):
            return widget.isChecked()
        if isinstance(widget, QPlainTextEdit):
            return widget.toPlainText()
        if isinstance(widget, QLineEdit):
            return widget.text()
        line = widget.findChild(QLineEdit, "value")
        return line.text() if line else ""

    def current_values(self) -> dict[str, Any]:
        return {key: self._widget_value(key, widget) for key, widget in self.widgets.items()}

    def _set_values(self, values: dict[str, Any]) -> None:
        self.loading_form = True
        configured_custom_widgets: set[int] = set()
        for field in self.template.fields:
            widget = self.widgets.get(field.key)
            if not widget:
                continue
            value = values.get(field.key, field.default)
            if isinstance(widget, (ComponentDropdown, PaletteDropdown)):
                if id(widget) not in configured_custom_widgets:
                    widget.set_values(values)
                    configured_custom_widgets.add(id(widget))
            elif isinstance(widget, QCheckBox):
                widget.setChecked(bool(value))
            elif isinstance(widget, QPlainTextEdit):
                widget.setPlainText(str(value or ""))
            elif isinstance(widget, QLineEdit):
                widget.setText(str(value or ""))
            else:
                line = widget.findChild(QLineEdit, "value")
                if line:
                    line.setText(str(value or ""))
        self.loading_form = False
        self.preview_debounce.start()

    def _write_preview(self) -> None:
        try:
            self.builder.prepare_preview(self.current_values())
        except (OSError, CatalogError) as exc:
            self.status_label.setText(f"No se pudieron aplicar los cambios: {exc}")
            return
        self.status_label.setText("Cambios aplicados")
        if self.server_ready:
            QTimer.singleShot(450, self.web_view.reload)

    def _start_server(self) -> None:
        node = shutil.which("node.exe" if os.name == "nt" else "node")
        vite = self.template.source_path / "node_modules" / "vite" / "bin" / "vite.js"
        if not node:
            self.status_label.setText("Falta Node.js para activar la previsualización.")
            return
        if not vite.is_file():
            relative_source = self.template.source_path.relative_to(REPO_ROOT)
            self.status_label.setText(
                f"Faltan dependencias: ejecuta npm install --prefix {relative_source} antes de abrir el editor."
            )
            return
        self.preview_port = self._find_free_port()
        self.server_ready = False
        self.preview_process.setWorkingDirectory(str(self.template.source_path))
        self.preview_process.setProgram(node)
        self.preview_process.setArguments(
            [str(vite), "--host", "127.0.0.1", "--port", str(self.preview_port), "--strictPort"]
        )
        self.preview_process.start()
        if not self.preview_process.waitForStarted(5000):
            self.status_label.setText("No se pudo iniciar Vite para la previsualización.")
            return
        self.status_label.setText("Iniciando servidor de previsualización…")
        self.retry_timer.start(900)

    def _stop_server(self) -> None:
        self.retry_timer.stop()
        self.server_ready = False
        if self.preview_process.state() != QProcess.ProcessState.NotRunning:
            self.preview_process.terminate()
            if not self.preview_process.waitForFinished(2500):
                self.preview_process.kill()
                self.preview_process.waitForFinished(1000)

    def _read_server_output(self) -> None:
        output = bytes(self.preview_process.readAllStandardOutput()).decode("utf-8", errors="replace")
        if "Local:" in output or "ready in" in output:
            self.retry_timer.start(150)

    def _load_preview_url(self) -> None:
        if self.preview_process.state() == QProcess.ProcessState.Running:
            url = QUrl(f"http://127.0.0.1:{self.preview_port}{self.template.preview_path}")
            self.web_view.load(url)

    def _preview_loaded(self, successful: bool) -> None:
        if successful and self.web_view.url().scheme().startswith("http"):
            self.server_ready = True
            self.status_label.setText("Previsualización conectada · haz clic en un texto")
            self._install_visual_editor()
        elif self.preview_process.state() == QProcess.ProcessState.Running and not self.server_ready:
            self.retry_timer.start(650)

    def _install_visual_editor(self) -> None:
        script = r"""
        (() => {
          if (window.__templateVisualEditorInstalled) return;
          window.__templateVisualEditorInstalled = true;

          const style = document.createElement('style');
          style.id = 'template-visual-editor-style';
          style.textContent = `
            [data-editor-key] {
              cursor: text !important;
              border-radius: 4px;
              transition: outline-color 150ms ease, background-color 150ms ease, box-shadow 150ms ease;
            }
            [data-editor-key]:hover {
              outline: 2px dashed #35a86b !important;
              outline-offset: 5px;
              background-color: rgba(225, 250, 233, .2) !important;
            }
            [data-editor-key].template-editor-active {
              outline: 3px solid #22a45a !important;
              outline-offset: 5px;
              background-color: rgba(225, 250, 233, .16) !important;
              box-shadow: 0 0 0 7px rgba(34, 164, 90, .13) !important;
            }
            [data-editor-key][contenteditable="true"] { min-width: 1ch; }
            .template-component-hover {
              outline: 4px solid #28a861 !important;
              outline-offset: -4px;
              box-shadow: inset 0 0 0 8px rgba(40, 168, 97, .14) !important;
            }
          `;
          document.head.appendChild(style);

          const channelScript = document.createElement('script');
          channelScript.src = 'qrc:///qtwebchannel/qwebchannel.js';
          channelScript.onload = () => {
            new QWebChannel(qt.webChannelTransport, (channel) => {
              window.__templateEditorBridge = channel.objects.editorBridge;
              window.__templateSyncSettings?.();
            });
          };
          document.head.appendChild(channelScript);

          const editableFromEvent = (event) => event.target.closest?.('[data-editor-key]');
          const valueOf = (element) => {
            const value = element.dataset.editorMultiline === 'true' ? element.innerText : element.textContent;
            return value.replace(/\r\n/g, '\n');
          };

          document.addEventListener('click', (event) => {
            const element = editableFromEvent(event);
            if (!element) return;
            if (element.closest('a, button')) event.preventDefault();
            event.stopPropagation();
            document.querySelectorAll('.template-editor-active').forEach((node) => {
              if (node !== element) {
                node.classList.remove('template-editor-active');
                node.removeAttribute('contenteditable');
              }
            });
            element.classList.add('template-editor-active');
            element.setAttribute('contenteditable', 'true');
            element.setAttribute('spellcheck', 'true');
            window.__templateEditorBridge?.selectField(element.dataset.editorKey);
            element.focus({ preventScroll: true });
          }, true);

          document.addEventListener('input', (event) => {
            const element = editableFromEvent(event);
            if (!element) return;
            window.__templateEditorBridge?.editField(element.dataset.editorKey, valueOf(element), false);
          }, true);

          document.addEventListener('keydown', (event) => {
            const element = editableFromEvent(event);
            if (!element) return;
            const multiline = element.dataset.editorMultiline === 'true';
            if (event.key === 'Enter' && !multiline) {
              event.preventDefault();
              element.blur();
            }
            if (event.key === 'Escape') {
              event.preventDefault();
              element.blur();
            }
          }, true);

          document.addEventListener('focusout', (event) => {
            const element = editableFromEvent(event);
            if (!element) return;
            window.__templateEditorBridge?.editField(element.dataset.editorKey, valueOf(element), true);
            element.removeAttribute('contenteditable');
          }, true);

          let settingsScrollScheduled = false;
          let lastVisibleComponent = '';
          const syncSettingsToScroll = () => {
            settingsScrollScheduled = false;
            const components = [...document.querySelectorAll('[data-editor-component]')];
            if (!components.length) return;
            const marker = window.innerHeight * 0.34;
            const visible = components
              .map((element) => ({ element, rect: element.getBoundingClientRect() }))
              .filter(({ rect }) => rect.bottom > 0 && rect.top < window.innerHeight)
              .sort((a, b) => Math.abs(a.rect.top - marker) - Math.abs(b.rect.top - marker))[0];
            const key = visible?.element.dataset.editorComponent;
            if (!key || key === lastVisibleComponent) return;
            lastVisibleComponent = key;
            window.__templateEditorBridge?.selectComponent(key);
          };
          window.__templateSyncSettings = syncSettingsToScroll;
          window.addEventListener('scroll', () => {
            if (settingsScrollScheduled) return;
            settingsScrollScheduled = true;
            requestAnimationFrame(syncSettingsToScroll);
          }, { passive: true });
          setTimeout(syncSettingsToScroll, 120);
        })();
        """
        self.web_view.page().runJavaScript(script)

    def _server_stopped(self, _exit_code: int, _status: QProcess.ExitStatus) -> None:
        if not self.server_ready and not self.retry_timer.isActive():
            self.status_label.setText("El servidor de previsualización está detenido.")

    @staticmethod
    def _find_free_port() -> int:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            sock.bind(("127.0.0.1", 0))
            return int(sock.getsockname()[1])

    def refresh_preview(self) -> None:
        self._write_preview()
        if self.server_ready:
            self.web_view.reload()
        elif self.preview_process.state() == QProcess.ProcessState.NotRunning:
            self._start_server()

    def reset_project(self) -> None:
        answer = QMessageBox.question(
            self,
            "Nuevo proyecto",
            "¿Quieres recuperar todos los valores iniciales de esta plantilla?",
        )
        if answer == QMessageBox.StandardButton.Yes:
            self.project_path = None
            self._set_values(self.template.defaults)
            self.setWindowTitle("Personalizador de plantillas")

    def add_component(self) -> None:
        chooser = QMessageBox(self)
        chooser.setWindowTitle("Añadir componente .compt")
        chooser.setText("¿Desde dónde quieres instalar el componente?")
        file_button = chooser.addButton("Desde archivo", QMessageBox.ButtonRole.ActionRole)
        internet_button = chooser.addButton("Desde Internet", QMessageBox.ButtonRole.ActionRole)
        chooser.addButton(QMessageBox.StandardButton.Cancel)
        chooser.exec()
        clicked = chooser.clickedButton()
        if clicked is file_button:
            path_text, _ = QFileDialog.getOpenFileName(
                self,
                "Selecciona un componente",
                str(REPO_ROOT / "componentes"),
                "Componente de plantilla (*.compt)",
            )
            if not path_text:
                return
            path = Path(path_text)
            try:
                raw = path.read_bytes()
            except OSError as exc:
                QMessageBox.critical(self, "No se pudo leer", str(exc))
                return
            self._install_component_bytes(raw, path.name)
        elif clicked is internet_button:
            url, accepted = QInputDialog.getText(
                self,
                "Instalar desde Internet",
                "URL HTTPS directa del archivo .compt:",
            )
            if not accepted or not url.strip():
                return
            self.status_label.setText("Descargando y validando componente…")
            QApplication.processEvents()
            try:
                raw = download_component(url.strip())
            except ComponentFormatError as exc:
                QMessageBox.critical(self, "Descarga rechazada", str(exc))
                return
            self._install_component_bytes(raw, url.strip())

    def _install_component_bytes(self, raw: bytes, source_name: str) -> None:
        try:
            component = install_component(REPO_ROOT, raw, source_name)
        except ComponentExistsError as exc:
            answer = QMessageBox.question(
                self,
                "Componente existente",
                f"{exc}. ¿Quieres reemplazarlo con esta versión?",
            )
            if answer != QMessageBox.StandardButton.Yes:
                return
            try:
                component = install_component(REPO_ROOT, raw, source_name, overwrite=True)
            except (OSError, ComponentFormatError) as replace_error:
                QMessageBox.critical(self, "Componente no válido", str(replace_error))
                return
        except (OSError, ComponentFormatError) as exc:
            QMessageBox.critical(self, "Componente no válido", str(exc))
            return

        values = self.current_values()
        self._build_form(values)
        self.status_label.setText(f"Componente instalado y activado: {component.name}")
        if self.server_ready:
            QTimer.singleShot(450, self.web_view.reload)

    def save_project(self) -> None:
        initial = str(self.project_path or (REPO_ROOT / f"proyecto-{self.template.template_id}.json"))
        path_text, _ = QFileDialog.getSaveFileName(self, "Guardar proyecto", initial, "Proyecto JSON (*.json)")
        if not path_text:
            return
        path = Path(path_text)
        if path.suffix.lower() != ".json":
            path = path.with_suffix(".json")

        values = self.current_values()
        assets_dir = path.parent / f"{path.stem}_assets"
        for field in self.template.fields:
            if field.kind != "image":
                continue
            image_value = str(values.get(field.key, "")).strip()
            source = Path(image_value).expanduser() if image_value else None
            if source and source.is_file():
                assets_dir.mkdir(parents=True, exist_ok=True)
                safe_name = re.sub(r"[^a-zA-Z0-9._-]+", "-", source.name)
                destination = assets_dir / safe_name
                shutil.copy2(source, destination)
                values[field.key] = destination.relative_to(path.parent).as_posix()

        write_json_atomic(
            path,
            {
                "version": 1,
                "templateId": self.template.template_id,
                "values": values,
                "components": component_states(REPO_ROOT),
            },
        )
        self.project_path = path
        self.setWindowTitle(f"{path.stem} — Personalizador de plantillas")
        self.status_label.setText(f"Proyecto guardado: {path.name}")

    def open_project(self) -> None:
        path_text, _ = QFileDialog.getOpenFileName(self, "Abrir proyecto", str(REPO_ROOT), "Proyecto JSON (*.json)")
        if not path_text:
            return
        path = Path(path_text)
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            template_id = str(payload["templateId"])
            values = dict(payload["values"])
            saved_components = dict(payload.get("components", {}))
        except (OSError, json.JSONDecodeError, KeyError, TypeError, ValueError) as exc:
            QMessageBox.critical(self, "Proyecto no válido", f"No se pudo abrir el proyecto:\n\n{exc}")
            return

        template_index = next(
            (index for index, template in enumerate(self.templates) if template.template_id == template_id),
            -1,
        )
        if template_index < 0:
            QMessageBox.critical(self, "Plantilla no disponible", f"No existe la plantilla '{template_id}'.")
            return
        if template_index != self.template_combo.currentIndex():
            self.template_combo.setCurrentIndex(template_index)

        for field in self.template.fields:
            if field.kind != "image":
                continue
            image_value = str(values.get(field.key, ""))
            candidate = path.parent / image_value
            if image_value and not Path(image_value).is_absolute() and candidate.is_file():
                values[field.key] = str(candidate.resolve())

        if saved_components:
            try:
                set_component_states(REPO_ROOT, saved_components)
            except (OSError, ComponentFormatError) as exc:
                QMessageBox.warning(self, "Componentes incompletos", str(exc))
        merged_values = {**self.template.defaults, **values}
        self._build_form(merged_values)
        self._write_preview()
        self.project_path = path
        self.setWindowTitle(f"{path.stem} — Personalizador de plantillas")
        self.status_label.setText(f"Proyecto abierto: {path.name}")

    def export_site(self) -> None:
        parent_text = QFileDialog.getExistingDirectory(self, "Carpeta donde guardar la exportación", str(REPO_ROOT))
        if not parent_text:
            return
        self._write_preview()
        self.export_action.setEnabled(False)
        self.status_label.setText("Compilando y exportando…")
        self.export_worker = ExportWorker(self.builder, Path(parent_text), self.current_values())
        self.export_worker.completed.connect(self._export_completed)
        self.export_worker.failed.connect(self._export_failed)
        self.export_worker.finished.connect(lambda: self.export_action.setEnabled(True))
        self.export_worker.start()

    def _export_completed(self, destination: str) -> None:
        self.status_label.setText(f"Web exportada: {destination}")
        message = QMessageBox(self)
        message.setWindowTitle("Exportación terminada")
        message.setText("La web compilada se ha exportado correctamente.")
        message.setInformativeText(destination)
        open_button = message.addButton("Abrir carpeta", QMessageBox.ButtonRole.ActionRole)
        message.addButton(QMessageBox.StandardButton.Close)
        message.exec()
        if message.clickedButton() is open_button:
            QDesktopServices.openUrl(QUrl.fromLocalFile(destination))

    def _export_failed(self, details: str) -> None:
        self.status_label.setText("La exportación ha fallado.")
        QMessageBox.critical(self, "Error de exportación", details)

    def closeEvent(self, event: QCloseEvent) -> None:
        if self.export_worker and self.export_worker.isRunning():
            QMessageBox.information(
                self,
                "Exportación en curso",
                "Espera a que termine la exportación antes de cerrar la aplicación.",
            )
            event.ignore()
            return
        self._stop_server()
        event.accept()


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Editor visual de plantillas web")
    parser.add_argument("--check", action="store_true", help="Valida el entorno sin abrir la interfaz")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        templates = discover_templates(REPO_ROOT)
    except CatalogError as exc:
        print(f"Error de catálogo: {exc}", file=sys.stderr)
        return 1

    component_catalog_error: str | None = None
    try:
        rebuild_generated_catalog(REPO_ROOT)
    except (OSError, ComponentFormatError) as exc:
        component_catalog_error = str(exc)

    if args.check:
        npm = shutil.which("npm.cmd" if os.name == "nt" else "npm")
        print(f"Catálogo correcto: {len(templates)} plantilla(s)")
        print(f"PySide6: disponible")
        print(f"npm: {npm or 'no encontrado'}")
        for template in templates:
            print(f"- {template.name}: {len(template.fields)} campos")
        if component_catalog_error:
            print(f"Componentes: error: {component_catalog_error}")
        else:
            installed, _errors = load_components(REPO_ROOT)
            print(f"Componentes .compt: {len(installed)}")
        return 0 if npm and not component_catalog_error else 1

    app = QApplication(sys.argv[:1])
    app.setStyle("Fusion")
    app.setFont(QFont("Segoe UI", 10))
    palette = QPalette()
    palette.setColor(QPalette.ColorRole.Window, QColor("#F4F8F5"))
    palette.setColor(QPalette.ColorRole.WindowText, QColor("#173E2F"))
    palette.setColor(QPalette.ColorRole.Base, QColor("#FFFFFF"))
    palette.setColor(QPalette.ColorRole.AlternateBase, QColor("#EEF4EF"))
    palette.setColor(QPalette.ColorRole.Text, QColor("#173E2F"))
    palette.setColor(QPalette.ColorRole.Button, QColor("#F6FAF7"))
    palette.setColor(QPalette.ColorRole.ButtonText, QColor("#173E2F"))
    palette.setColor(QPalette.ColorRole.Highlight, QColor("#2E7D59"))
    palette.setColor(QPalette.ColorRole.HighlightedText, QColor("#FFFFFF"))
    palette.setColor(QPalette.ColorRole.PlaceholderText, QColor("#7A9184"))
    app.setPalette(palette)
    app.setApplicationName("Personalizador de plantillas")
    app.setOrganizationName("Plantillas locales")
    window = EditorWindow(templates)
    window.show()
    return app.exec()
