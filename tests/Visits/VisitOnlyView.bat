echo off
set yy=%date:~-4%
set mm=%date:~-7,2%
set dd=%date:~-10,2%
set tt=%TIME%
set /a ttt=%tt:~0,2%
IF %ttt% LSS 10 (
 SET hh=0%ttt%) else (
SET hh=%ttt%)
SET min=%tt:~3,2%
SET sec=%tt:~6,2%
set folder=AutoTest\tests\reports\SuperAgent\%yy%%mm%%dd%
MD D:\%folder%
MD D:\%folder%\images & d:&& cd D:\AutoTest\Debug && tests -r -host http://192.168.106.66:8088 -ep main D:\AutoTest\tests\SuperAgent\Visits\VisitOnlyView.js D:\%folder%\Visit_%hh%_%min%_%sec%.txt D:\%folder%\images && pause
