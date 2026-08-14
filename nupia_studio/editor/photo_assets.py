from __future__ import annotations

import re
import shutil
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from .catalog import TemplateDefinition


SUPPORTED_IMAGE_EXTENSIONS = {".avif", ".jpg", ".jpeg", ".png", ".webp"}


@dataclass(frozen=True)
class PhotoImportResult:
    values: dict[str, Any]
    imported_slots: tuple[str, ...]
    ignored_files: tuple[str, ...]


def import_photo_folder(
    source_directory: Path,
    template: TemplateDefinition,
    values: dict[str, Any],
) -> PhotoImportResult:
    """Copies convention-based photos into the active template and returns updated values."""
    source_directory = source_directory.resolve()
    if not source_directory.is_dir():
        raise ValueError("La carpeta de fotos no existe.")

    supported_fields = {field.key for field in template.fields if field.kind == "image"}
    destination = template.source_path / "public" / "project-photos"
    destination.mkdir(parents=True, exist_ok=True)
    updated = dict(values)
    imported: list[str] = []
    ignored: list[str] = []

    for source in sorted(source_directory.iterdir()):
        if not source.is_file():
            continue
        if source.suffix.lower() not in SUPPORTED_IMAGE_EXTENSIONS:
            ignored.append(source.name)
            continue
        slot = _slot_for_stem(source.stem)
        if not slot:
            ignored.append(source.name)
            continue
        key = f"images.{slot}"
        if key not in supported_fields:
            ignored.append(source.name)
            continue

        output_name = f"{slot}{source.suffix.lower()}"
        shutil.copy2(source, destination / output_name)
        public_path = f"/project-photos/{output_name}"
        updated[key] = public_path
        if slot == "landing" and "images.hero" in supported_fields:
            updated["images.hero"] = public_path
        imported.append(slot)

    return PhotoImportResult(updated, tuple(imported), tuple(ignored))


def _slot_for_stem(stem: str) -> str | None:
    normalized = re.sub(r"[^a-z0-9]+", "", stem.lower())
    aliases = {
        "landing": "landing",
        "portada": "landing",
        "hero": "landing",
        "historia1": "historia1",
        "historia2": "historia2",
        "despedida": "despedida",
        "final": "despedida",
    }
    if normalized in aliases:
        return aliases[normalized]
    gallery = re.fullmatch(r"(?:galeria|gallery|foto|photo)([1-6])", normalized)
    return f"galeria{gallery.group(1)}" if gallery else None
