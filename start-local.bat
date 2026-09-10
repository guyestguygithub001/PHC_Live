@echo off
echo =======================================================
echo Starting PHC Live
echo =======================================================
echo.
echo 1. Starting Backend (Clinic Server) on port 3001...
start "PHC Backend" cmd /k "cd clinic-server && echo Starting Go Server... && go run ."

echo 2. Starting Frontend (Clinic App) on port 5173...
start "PHC Frontend" cmd /k "cd clinic-app && echo Starting React App... && npm run dev"

echo.
echo Both systems are starting up! 
echo If you don't have internet, the backend will automatically detect it
echo and switch to "Offline In-Memory Mode".
echo.
echo You can close this window. To stop the servers, close the two new windows that opened.
pause
