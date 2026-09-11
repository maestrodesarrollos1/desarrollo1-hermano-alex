@echo off
setlocal
cd /d "%~dp0source"
if exist "..\..\..\.tools\node-v24.18.0-win-x64\node.exe" set "PATH=%CD%\..\..\..\.tools\node-v24.18.0-win-x64;%PATH%"
if not exist "node_modules\vite\bin\vite.js" (
  echo Faltan dependencias. Ejecuta npm ci dentro de la carpeta source.
  pause
  exit /b 1
)
echo Vista previa: http://127.0.0.1:8080/es
call npm run dev -- --host 127.0.0.1 --port 8080 --strictPort
pause
