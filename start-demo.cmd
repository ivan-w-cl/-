@echo off
rem Liverpool Student Map: run the student website, the booking expert console and the server on this computer.
rem Needs Node.js 18 or newer (https://nodejs.org).
cd /d "%~dp0"
where node >nul 2>nul || (echo Please install Node.js 18 or newer from https://nodejs.org & pause & exit /b 1)
if "%SITE_DIR%"=="" set SITE_DIR=web-live
echo Student website:        http://localhost:8765/
echo Booking expert console: http://localhost:8765/adviser.html  (password: 123456 unless ADMIN_PASSWORD is set)
echo Phones on the same Wi-Fi: use this computer's IP address instead of localhost. Press Ctrl+C to stop.
node web-original\consult-server\server.js
pause
