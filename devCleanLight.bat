@ECHO off
set /p pathName=Bitte geben Sie den Pfad ein: %=%
@echo gulp devCleanLight --path="%pathName%"
Start gulp devCleanLight --path="%pathName%"
