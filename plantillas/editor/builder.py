from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any

from .catalog import TemplateDefinition, nest_values


class BuildError(RuntimeError):
    pass


def write_json_atomic(path: Path, payload: dict[str, Any]) -> None:
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


class TemplateBuilder:
    def __init__(self, template: TemplateDefinition):
        self.template = template

    def prepare_preview(self, flat_values: dict[str, Any]) -> dict[str, Any]:
        prepared = dict(flat_values)
        for field in self.template.fields:
            if field.kind == "image":
                prepared[field.key] = self._stage_image(field.key, str(prepared.get(field.key, "")))
        nested = nest_values(prepared)
        write_json_atomic(self.template.values_path, nested)
        return nested

    def export(self, parent_directory: Path, flat_values: dict[str, Any]) -> Path:
        self.prepare_preview(flat_values)
        npm = shutil.which("npm.cmd" if os.name == "nt" else "npm")
        if not npm:
            raise BuildError("No se encontró npm. Instala Node.js y vuelve a intentarlo.")

        try:
            result = subprocess.run(
                [npm, "run", "build"],
                cwd=self.template.source_path,
                capture_output=True,
                text=True,
                encoding="utf-8",
                errors="replace",
                timeout=300,
                check=False,
            )
        except (OSError, subprocess.TimeoutExpired) as exc:
            raise BuildError(f"No se pudo compilar la plantilla: {exc}") from exc

        if result.returncode != 0:
            details = (result.stderr or result.stdout or "Error desconocido").strip()
            raise BuildError(f"La compilación terminó con errores:\n\n{details[-4000:]}")

        dist_path = self.template.source_path / "dist"
        if not dist_path.is_dir():
            raise BuildError("La compilación no creó la carpeta dist.")

        parent_directory.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d-%H%M%S")
        destination = parent_directory / f"{self.template.template_id}-export-{timestamp}"
        counter = 2
        while destination.exists():
            destination = parent_directory / f"{self.template.template_id}-export-{timestamp}-{counter}"
            counter += 1
        shutil.copytree(dist_path, destination)
        return destination

    def _stage_image(self, field_key: str, raw_value: str) -> str:
        value = raw_value.strip()
        if not value or value.startswith(("http://", "https://", "data:")):
            return value

        source = Path(value).expanduser().resolve()
        if value.startswith("/") and not source.is_file():
            return value
        if not source.is_file():
            return ""

        extension = source.suffix.lower() or ".bin"
        digest = hashlib.sha1(str(source).encode("utf-8")).hexdigest()[:10]
        safe_key = re.sub(r"[^a-zA-Z0-9_-]+", "-", field_key).strip("-")
        filename = f"{safe_key}-{digest}{extension}"
        assets_path = self.template.source_path / "public" / "editor-assets"
        assets_path.mkdir(parents=True, exist_ok=True)
        destination = assets_path / filename
        if not destination.exists() or source.stat().st_mtime_ns > destination.stat().st_mtime_ns:
            shutil.copy2(source, destination)
        return f"/editor-assets/{filename}"
