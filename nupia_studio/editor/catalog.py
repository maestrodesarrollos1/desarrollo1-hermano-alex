from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


SUPPORTED_FIELD_TYPES = {"text", "textarea", "datetime", "url", "color", "image", "boolean"}


@dataclass(frozen=True)
class FieldDefinition:
    key: str
    label: str
    kind: str
    default: Any
    group: str
    required: bool = False


@dataclass(frozen=True)
class TemplateDefinition:
    template_id: str
    name: str
    description: str
    descriptor_path: Path
    source_path: Path
    preview_path: str
    values_path: Path
    fields: tuple[FieldDefinition, ...]

    @property
    def defaults(self) -> dict[str, Any]:
        return {field.key: field.default for field in self.fields}

    def current_values(self) -> dict[str, Any]:
        values = self.defaults
        if self.values_path.is_file():
            try:
                stored = flatten_values(json.loads(self.values_path.read_text(encoding="utf-8")))
            except (OSError, json.JSONDecodeError):
                stored = {}
            values.update({key: value for key, value in stored.items() if key in values})
        return values


class CatalogError(ValueError):
    pass


def flatten_values(values: dict[str, Any], prefix: str = "") -> dict[str, Any]:
    flattened: dict[str, Any] = {}
    for key, value in values.items():
        dotted_key = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            flattened.update(flatten_values(value, dotted_key))
        else:
            flattened[dotted_key] = value
    return flattened


def nest_values(values: dict[str, Any]) -> dict[str, Any]:
    nested: dict[str, Any] = {}
    for dotted_key, value in values.items():
        cursor = nested
        parts = dotted_key.split(".")
        for part in parts[:-1]:
            child = cursor.setdefault(part, {})
            if not isinstance(child, dict):
                raise CatalogError(f"La clave '{dotted_key}' entra en conflicto con otra clave.")
            cursor = child
        cursor[parts[-1]] = value
    return nested


def discover_templates(repo_root: Path) -> list[TemplateDefinition]:
    repo_root = repo_root.resolve()
    templates: list[TemplateDefinition] = []

    for descriptor_path in sorted(repo_root.glob("*/template.json")):
        templates.append(_read_template(repo_root, descriptor_path))

    if not templates:
        raise CatalogError("No se encontraron plantillas con un archivo template.json.")
    return templates


def _read_template(repo_root: Path, descriptor_path: Path) -> TemplateDefinition:
    try:
        data = json.loads(descriptor_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        raise CatalogError(f"No se puede leer {descriptor_path}: {exc}") from exc

    for key in ("id", "name", "source", "valuesFile", "fields"):
        if key not in data:
            raise CatalogError(f"Falta '{key}' en {descriptor_path}.")

    source_path = (descriptor_path.parent / str(data["source"])).resolve()
    if not source_path.is_relative_to(repo_root):
        raise CatalogError(f"La plantilla '{data['id']}' apunta fuera del proyecto.")
    if not (source_path / "package.json").is_file():
        raise CatalogError(f"La plantilla '{data['id']}' no contiene package.json.")

    values_path = (source_path / str(data["valuesFile"])).resolve()
    if not values_path.is_relative_to(source_path):
        raise CatalogError(f"valuesFile de '{data['id']}' apunta fuera de su código fuente.")

    fields: list[FieldDefinition] = []
    seen_keys: set[str] = set()
    raw_fields = data["fields"]
    if not isinstance(raw_fields, list):
        raise CatalogError(f"'fields' debe ser una lista en {descriptor_path}.")

    for raw in raw_fields:
        if not isinstance(raw, dict):
            raise CatalogError(f"Hay un campo inválido en {descriptor_path}.")
        field_key = str(raw.get("key", "")).strip()
        kind = str(raw.get("type", "")).strip()
        if not field_key or "." not in field_key:
            raise CatalogError(f"Clave de campo inválida: '{field_key}'.")
        if field_key in seen_keys:
            raise CatalogError(f"La clave '{field_key}' está repetida.")
        if kind not in SUPPORTED_FIELD_TYPES:
            raise CatalogError(f"Tipo no compatible '{kind}' en '{field_key}'.")
        seen_keys.add(field_key)
        fields.append(
            FieldDefinition(
                key=field_key,
                label=str(raw.get("label", field_key)),
                kind=kind,
                default=raw.get("default", False if kind == "boolean" else ""),
                group=str(raw.get("group", "General")),
                required=bool(raw.get("required", False)),
            )
        )

    preview_path = str(data.get("previewPath", "/"))
    if not preview_path.startswith("/"):
        preview_path = f"/{preview_path}"

    return TemplateDefinition(
        template_id=str(data["id"]),
        name=str(data["name"]),
        description=str(data.get("description", "")),
        descriptor_path=descriptor_path.resolve(),
        source_path=source_path,
        preview_path=preview_path,
        values_path=values_path,
        fields=tuple(fields),
    )
