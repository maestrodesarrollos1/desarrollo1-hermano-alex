from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from .catalog import TemplateDefinition


class ProjectServiceError(RuntimeError):
    pass


PROJECT_MANIFEST = "nupia-project.json"
PROJECT_GITIGNORE = "node_modules/\ndist/\n.vite/\n.env\n"


def create_project(projects_root: Path, template: TemplateDefinition, name: str) -> Path:
    slug = _slugify(name)
    if not slug:
        raise ProjectServiceError("El nombre del proyecto no contiene caracteres validos.")
    destination = (projects_root / slug).resolve()
    if destination.exists():
        raise ProjectServiceError(f"Ya existe el proyecto '{slug}'.")

    projects_root.mkdir(parents=True, exist_ok=True)
    shutil.copytree(template.descriptor_path.parent, destination, ignore=_copy_ignore)
    (destination / "fotos").mkdir(exist_ok=True)
    (destination / ".gitignore").write_text(PROJECT_GITIGNORE, encoding="utf-8", newline="\n")
    manifest = {
        "version": 1,
        "name": name.strip(),
        "templateId": template.template_id,
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "photosDirectory": "fotos",
    }
    (destination / PROJECT_MANIFEST).write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n"
    )
    return destination


def init_git_repository(project_directory: Path, author_name: str) -> str:
    _run_git(project_directory, "init")
    _run_git(project_directory, "checkout", "-B", "main")
    _run_git(project_directory, "config", "user.name", author_name.strip() or "Nupia Studio")
    _run_git(project_directory, "config", "user.email", _author_email(author_name))
    _run_git(project_directory, "add", "-A")
    committed = _run_git(project_directory, "commit", "-m", "Initial Nupia project", check=False)
    if committed.returncode and "nothing to commit" not in (committed.stdout + committed.stderr).lower():
        raise ProjectServiceError(_command_error(committed))
    return "Repositorio Git local preparado."


def publish_to_github(project_directory: Path, username: str, token: str, repository_name: str) -> str:
    username = username.strip()
    token = token.strip()
    repository_name = _slugify(repository_name)
    if not username or not token or not repository_name:
        raise ProjectServiceError("Usuario, token y nombre del repositorio son obligatorios.")

    remote = _git_remote(project_directory)
    if not remote:
        remote = _create_github_repository(token, repository_name)
        _run_git(project_directory, "remote", "add", "origin", remote)

    _run_git(project_directory, "add", "-A")
    commit = _run_git(project_directory, "commit", "-m", "Update wedding website", check=False)
    if commit.returncode and "nothing to commit" not in (commit.stdout + commit.stderr).lower():
        raise ProjectServiceError(_command_error(commit))

    _push_with_temporary_token(project_directory, username, token)
    return remote


def _copy_ignore(_directory: str, names: list[str]) -> set[str]:
    return {name for name in names if name in {"node_modules", "dist", ".vite", "vite-dev.out", "vite-dev.err"}}


def _slugify(value: str) -> str:
    import re

    normalized = re.sub(r"[^a-z0-9]+", "-", value.lower().strip())
    return normalized.strip("-")[:64]


def _author_email(author_name: str) -> str:
    slug = _slugify(author_name) or "nupia"
    return f"{slug}@users.noreply.github.com"


def _run_git(project_directory: Path, *arguments: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    try:
        result = subprocess.run(
            ["git", *arguments], cwd=project_directory, capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
    except OSError as exc:
        raise ProjectServiceError("No se encontro Git. Ejecuta primero 01_instalar_requisitos.bat.") from exc
    if check and result.returncode:
        raise ProjectServiceError(_command_error(result))
    return result


def _git_remote(project_directory: Path) -> str:
    result = _run_git(project_directory, "remote", "get-url", "origin", check=False)
    return result.stdout.strip() if result.returncode == 0 else ""


def _create_github_repository(token: str, name: str) -> str:
    request = urllib.request.Request(
        "https://api.github.com/user/repos",
        data=json.dumps({"name": name, "private": True, "auto_init": False}).encode("utf-8"),
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "User-Agent": "Nupia-Studio",
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ProjectServiceError(f"GitHub rechazo la creacion del repositorio: {detail}") from exc
    except OSError as exc:
        raise ProjectServiceError(f"No se pudo conectar con GitHub: {exc}") from exc
    clone_url = str(payload.get("clone_url", ""))
    if not clone_url:
        raise ProjectServiceError("GitHub no devolvio la URL del repositorio.")
    return clone_url


def _push_with_temporary_token(project_directory: Path, username: str, token: str) -> None:
    with tempfile.TemporaryDirectory(prefix="nupia-git-") as temp_dir:
        askpass = Path(temp_dir) / "askpass.cmd"
        askpass.write_text(
            "@echo off\r\n"
            "echo %1 | findstr /I \"username\" >nul && (echo %NUPIA_GIT_USERNAME%) || (echo %NUPIA_GIT_TOKEN%)\r\n",
            encoding="ascii",
            newline="\r\n",
        )
        environment = os.environ.copy()
        environment.update(
            {
                "GIT_ASKPASS": str(askpass),
                "GIT_TERMINAL_PROMPT": "0",
                "NUPIA_GIT_TOKEN": token,
                "GIT_USERNAME": username,
            }
        )
        result = subprocess.run(
            ["git", "push", "-u", "origin", "main"],
            cwd=project_directory,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            env=environment,
        )
    if result.returncode:
        raise ProjectServiceError(_command_error(result))


def _command_error(result: subprocess.CompletedProcess[str]) -> str:
    output = (result.stderr or result.stdout).strip()
    return output or "Git no pudo completar la operacion."
