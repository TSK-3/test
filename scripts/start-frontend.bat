@echo off
setlocal
cd /d "%~dp0.."
set VITE_API_URL=http://127.0.0.1:8001
npm run dev -- --host 127.0.0.1 --port 5173
