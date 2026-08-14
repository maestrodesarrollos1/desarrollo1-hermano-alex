$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$config = Get-Content (Join-Path $root "config\plantillas.json") -Raw | ConvertFrom-Json

function Install-CommandIfMissing {
    param([string]$Command, [string]$WingetId, [string]$Name)

    if (Get-Command $Command -ErrorAction SilentlyContinue) {
        Write-Host "OK  $Name"
        return
    }
    if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
        throw "Falta $Name y Winget no esta disponible. Instala $Name manualmente y vuelve a ejecutar este lanzador."
    }
    Write-Host "Instalando $Name..."
    winget install --exact --id $WingetId --accept-package-agreements --accept-source-agreements
    if (-not (Get-Command $Command -ErrorAction SilentlyContinue)) {
        throw "$Name se ha instalado, pero aun no esta disponible en PATH. Cierra esta ventana y vuelve a abrir 01_instalar_requisitos.bat."
    }
}

Write-Host ""
Write-Host "Nupia - preparacion del entorno" -ForegroundColor DarkGreen
Install-CommandIfMissing "git" "Git.Git" "Git"
Install-CommandIfMissing "node" "OpenJS.NodeJS.LTS" "Node.js LTS"
Install-CommandIfMissing "npm" "OpenJS.NodeJS.LTS" "npm"
Install-CommandIfMissing "py" "Python.Python.3.12" "Python 3.12"

$venvPython = Join-Path $root "nupia_studio\.venv\Scripts\python.exe"
if (-not (Test-Path $venvPython)) {
    Write-Host "Creando entorno de Nupia Studio..."
    & py -3.12 -m venv (Join-Path $root "nupia_studio\.venv")
}
& $venvPython -m pip install --upgrade pip
& $venvPython -m pip install -r (Join-Path $root "nupia_studio\editor\requirements.txt")

$packagePaths = @($config.corporate.path) + @($config.templates | ForEach-Object { $_.path })
foreach ($relativePath in $packagePaths) {
    $sourcePath = Join-Path $root $relativePath
    if (-not (Test-Path (Join-Path $sourcePath "package.json"))) {
        throw "No existe package.json en $relativePath"
    }
    Write-Host "Instalando dependencias: $relativePath"
    if (Test-Path (Join-Path $sourcePath "package-lock.json")) {
        npm ci --prefix $sourcePath
    } else {
        npm install --prefix $sourcePath
    }
}

Write-Host ""
Write-Host "Todo listo. Usa 02_abrir_plantilla.bat o 03_abrir_nupia_studio.bat." -ForegroundColor Green
