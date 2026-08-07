@echo off
cd /d "%~dp0.."
python -m editor.run_editor
if errorlevel 1 pause
