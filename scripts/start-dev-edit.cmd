@echo off
cd /d "%~dp0.."
rem BROWSER=none: react-scripts soll nicht selbst localhost:3000 oeffnen
set BROWSER=none
rem Server laeuft ohne Fenster weiter; beenden: Prozess auf Port 3000/3001 killen
powershell -NoProfile -Command "Start-Process cmd -ArgumentList '/c npm start' -WindowStyle Hidden"

:wait
curl -s -o nul http://localhost:3000 || (timeout /t 2 /nobreak >nul & goto wait)
start "" http://localhost:3000/dev-edit-recipes/
