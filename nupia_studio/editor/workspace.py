from __future__ import annotations

from pathlib import Path


WORKSPACE_ROOT = Path(__file__).resolve().parents[2]
TEMPLATES_ROOT = WORKSPACE_ROOT / "plantillas"
PROJECTS_ROOT = WORKSPACE_ROOT / "proyectos"
CONFIG_ROOT = WORKSPACE_ROOT / "config"
PALETTES_PATH = CONFIG_ROOT / "paletas.json"


def ensure_workspace_directories() -> None:
    PROJECTS_ROOT.mkdir(parents=True, exist_ok=True)
    CONFIG_ROOT.mkdir(parents=True, exist_ok=True)
