$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$python = Join-Path $root "nupia_studio\.venv\Scripts\python.exe"

if (-not (Test-Path $python)) {
    $python = Join-Path $root ".tools\Python312\python.exe"
}

if (-not (Test-Path $python)) {
    throw "Falta el entorno de Nupia Studio. Ejecuta primero 01_instalar_requisitos.bat."
}

Set-Location (Join-Path $root "nupia_studio")
& $python -m editor.run_editor
