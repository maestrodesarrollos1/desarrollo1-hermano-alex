@echo off
pushd "%~dp0.."
set "PROJECT_ROOT=%CD%"
popd
cd /d "%~dp0"
set "PATH=%PROJECT_ROOT%\.tools\node-v24.18.0-win-x64;%PROJECT_ROOT%\.tools\Python312;%PROJECT_ROOT%\.tools\Python312\Scripts;%PATH%"
"%PROJECT_ROOT%\.tools\Python312\python.exe" -m editor.run_editor --check
if errorlevel 1 pause
