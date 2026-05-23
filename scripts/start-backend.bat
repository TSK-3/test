@echo off
setlocal
cd /d "%~dp0..\backend"
set CARBONX_DEV_AUTH=1
if "%CARBONX_SMS_MODE%"=="" set CARBONX_SMS_MODE=console
..\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8001
