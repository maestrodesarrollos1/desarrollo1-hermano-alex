from __future__ import annotations

import json
import os
import re
import tempfile
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from .catalog import discover_templates


FORMAT_NAME = "plantilla-compt"
FORMAT_VERSION = 2
MAX_COMPONENT_BYTES = 512_000
ALLOWED_VARIANTS = {"feature", "split", "quote", "banner", "cards"}
ALLOWED_SLOTS = {"after-hero", "before-rsvp", "after-rsvp"}
ALLOWED_TOP_LEVEL_KEYS = {
    "format",
    "formatVersion",
    "id",
    "name",
    "version",
    "description",
    "author",
    "variant",
    "slot",
    "height",
    "enabled",
    "code",
}


class ComponentFormatError(ValueError):
    pass


class ComponentExistsError(ComponentFormatError):
    pass


@dataclass(frozen=True)
class InstalledComponent:
    component_id: str
    name: str
    description: str
    variant: str
    slot: str
    height: int
    enabled: bool
    path: Path
    payload: dict[str, Any]

    def generated_payload(self) -> dict[str, Any]:
        return {
            "id": self.component_id,
            "name": self.name,
            "description": self.description,
            "variant": self.variant,
            "slot": self.slot,
            "height": self.height,
            "enabled": self.enabled,
            "code": self.payload["code"],
        }


def load_components(repo_root: Path) -> tuple[list[InstalledComponent], list[str]]:
    components_dir = repo_root.resolve() / "componentes"
    components: list[InstalledComponent] = []
    errors: list[str] = []
    if not components_dir.is_dir():
        return components, errors
    seen_ids: set[str] = set()
    for path in sorted(components_dir.glob("*.compt")):
        try:
            component = parse_component(path.read_bytes(), path)
            if component.component_id in seen_ids:
                errors.append(f"{path.name}: id repetido '{component.component_id}'")
                continue
            seen_ids.add(component.component_id)
            components.append(component)
        except (OSError, ComponentFormatError) as exc:
            errors.append(f"{path.name}: {exc}")
    return components, errors


def parse_component(raw: bytes, source: Path | str = "componente.compt") -> InstalledComponent:
    if len(raw) > MAX_COMPONENT_BYTES:
        raise ComponentFormatError("el archivo supera el límite de 500 KB")
    try:
        payload = json.loads(raw.decode("utf-8-sig"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ComponentFormatError(f"JSON no válido: {exc}") from exc
    if not isinstance(payload, dict):
        raise ComponentFormatError("la raíz debe ser un objeto JSON")

    unknown = set(payload) - ALLOWED_TOP_LEVEL_KEYS
    if unknown:
        raise ComponentFormatError(f"claves no admitidas: {', '.join(sorted(unknown))}")
    if (
        payload.get("format") != FORMAT_NAME
        or not isinstance(payload.get("formatVersion"), int)
        or isinstance(payload.get("formatVersion"), bool)
        or payload.get("formatVersion") != FORMAT_VERSION
    ):
        raise ComponentFormatError(f"se requiere format='{FORMAT_NAME}' y formatVersion={FORMAT_VERSION}")

    component_id = _short_string(payload, "id", 48)
    if not re.fullmatch(r"[a-z][a-z0-9-]{2,47}", component_id):
        raise ComponentFormatError("id debe usar minúsculas, números y guiones, comenzando por una letra")
    name = _short_string(payload, "name", 80)
    description = _short_string(payload, "description", 240)
    _short_string(payload, "version", 24)
    if "author" in payload:
        _short_string(payload, "author", 80)
    variant = _short_string(payload, "variant", 20)
    slot = _short_string(payload, "slot", 20)
    if variant not in ALLOWED_VARIANTS:
        raise ComponentFormatError(f"variant debe ser uno de: {', '.join(sorted(ALLOWED_VARIANTS))}")
    if slot not in ALLOWED_SLOTS:
        raise ComponentFormatError(f"slot debe ser uno de: {', '.join(sorted(ALLOWED_SLOTS))}")

    height = payload.get("height", 420)
    if not isinstance(height, int) or isinstance(height, bool) or not 180 <= height <= 1200:
        raise ComponentFormatError("height debe ser un número entero entre 180 y 1200")
    code = payload.get("code")
    if not isinstance(code, dict) or set(code) != {"html", "css", "js"}:
        raise ComponentFormatError("code debe contener siempre y únicamente html, css y js")
    for code_key, maximum in (("html", 80_000), ("css", 80_000), ("js", 120_000)):
        value = code.get(code_key)
        if not isinstance(value, str) or not value.strip():
            raise ComponentFormatError(f"code.{code_key} debe ser texto no vacío")
        if len(value) > maximum:
            raise ComponentFormatError(f"code.{code_key} supera el límite de {maximum} caracteres")
    if "<script" in code["html"].lower():
        raise ComponentFormatError("las etiquetas script deben ir en code.js, no en code.html")
    if "</style" in code["css"].lower():
        raise ComponentFormatError("code.css contiene un cierre style no permitido")
    if "enabled" in payload and not isinstance(payload["enabled"], bool):
        raise ComponentFormatError("enabled debe ser true o false")
    payload["enabled"] = payload.get("enabled", True)
    path = Path(source) if isinstance(source, Path) else Path(str(source))
    return InstalledComponent(
        component_id=component_id,
        name=name,
        description=description,
        variant=variant,
        slot=slot,
        height=height,
        enabled=payload["enabled"],
        path=path,
        payload=payload,
    )


def install_component(repo_root: Path, raw: bytes, source_name: str, overwrite: bool = False) -> InstalledComponent:
    parsed = parse_component(raw, source_name)
    components_dir = repo_root.resolve() / "componentes"
    components_dir.mkdir(parents=True, exist_ok=True)
    installed, errors = load_components(repo_root)
    if errors:
        raise ComponentFormatError("; ".join(errors))
    existing = next((component for component in installed if component.component_id == parsed.component_id), None)
    destination = existing.path if existing else components_dir / f"{parsed.component_id}.compt"
    if existing and not overwrite:
        raise ComponentExistsError(f"ya existe un componente con id '{parsed.component_id}'")
    payload = dict(parsed.payload)
    payload["enabled"] = True
    _write_json_atomic(destination, payload)
    rebuild_generated_catalog(repo_root)
    return parse_component(destination.read_bytes(), destination)


def download_component(url: str) -> bytes:
    parsed = urlparse(url.strip())
    if parsed.scheme != "https" or not parsed.netloc:
        raise ComponentFormatError("la dirección debe ser una URL HTTPS")
    request = urllib.request.Request(url, headers={"User-Agent": "PlantillaComponentEditor/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=15) as response:
            final_url = urlparse(response.geturl())
            if final_url.scheme != "https":
                raise ComponentFormatError("la descarga fue redirigida fuera de HTTPS")
            declared_size = int(response.headers.get("Content-Length", "0") or 0)
            if declared_size > MAX_COMPONENT_BYTES:
                raise ComponentFormatError("el archivo supera el límite de 500 KB")
            raw = response.read(MAX_COMPONENT_BYTES + 1)
    except ComponentFormatError:
        raise
    except Exception as exc:
        raise ComponentFormatError(f"no se pudo descargar: {exc}") from exc
    if len(raw) > MAX_COMPONENT_BYTES:
        raise ComponentFormatError("el archivo supera el límite de 500 KB")
    return raw


def set_component_enabled(repo_root: Path, component_id: str, enabled: bool) -> None:
    components, errors = load_components(repo_root)
    if errors:
        raise ComponentFormatError("; ".join(errors))
    component = next((item for item in components if item.component_id == component_id), None)
    if component is None:
        raise ComponentFormatError(f"no existe el componente '{component_id}'")
    payload = dict(component.payload)
    payload["enabled"] = bool(enabled)
    _write_json_atomic(component.path, payload)
    rebuild_generated_catalog(repo_root)


def set_component_states(repo_root: Path, states: dict[str, Any]) -> None:
    components, _errors = load_components(repo_root)
    for component in components:
        if component.component_id in states and component.enabled != bool(states[component.component_id]):
            payload = dict(component.payload)
            payload["enabled"] = bool(states[component.component_id])
            _write_json_atomic(component.path, payload)
    rebuild_generated_catalog(repo_root)


def component_states(repo_root: Path) -> dict[str, bool]:
    components, _errors = load_components(repo_root)
    return {component.component_id: component.enabled for component in components}


def rebuild_generated_catalog(repo_root: Path) -> list[Path]:
    components, errors = load_components(repo_root)
    if errors:
        raise ComponentFormatError("; ".join(errors))
    payload = [component.generated_payload() for component in components]
    outputs: list[Path] = []
    for template in discover_templates(repo_root):
        output = template.source_path / "src" / "generated" / "installed-components.json"
        _write_json_atomic(output, payload)
        outputs.append(output)
    return outputs


def _short_string(payload: dict[str, Any], key: str, maximum: int) -> str:
    value = payload.get(key)
    if not isinstance(value, str) or not value.strip() or len(value.strip()) > maximum:
        raise ComponentFormatError(f"'{key}' debe ser texto no vacío de hasta {maximum} caracteres")
    return value.strip()


def _write_json_atomic(path: Path, payload: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    handle, temporary_name = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=path.parent)
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(handle, "w", encoding="utf-8", newline="\n") as stream:
            json.dump(payload, stream, ensure_ascii=False, indent=2)
            stream.write("\n")
        os.replace(temporary_path, path)
    finally:
        temporary_path.unlink(missing_ok=True)
