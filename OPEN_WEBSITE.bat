@echo off
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
    echo Node.js is not installed. Please install it from https://nodejs.org then run this file again.
    pause
    exit /b
)

if not exist "node_modules" (
    echo Installing required packages, please wait...
    call npm install
)

start "" "http://localhost:3000"
call npm start
