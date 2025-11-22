@echo off
echo Starting CineMatch...

:: Start Backend
start "CineMatch Backend" cmd /k "cd CineMatch-Backend && npm install && npm start"

:: Start Frontend
start "CineMatch Frontend" cmd /k "cd CineMatch-Frontend && npm run dev"

echo CineMatch is starting in two new windows!
