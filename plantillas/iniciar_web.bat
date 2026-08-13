@echo off
pushd "%~dp0.."
set "PROJECT_ROOT=%CD%"
popd
cd /d "%~dp0boda-elegante\source"
set "PATH=%PROJECT_ROOT%\.tools\node-v24.18.0-win-x64;%PATH%"
echo Abriendo plantilla en http://localhost:8080/es
echo.
"%PROJECT_ROOT%\.tools\node-v24.18.0-win-x64\npm.cmd" run dev
if errorlevel 1 pause
