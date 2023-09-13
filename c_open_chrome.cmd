@echo off 
set base=%~dp0
cmd /k "cd /d %base% & Chrome.lnk http://127.0.0.1:8118/login.html"