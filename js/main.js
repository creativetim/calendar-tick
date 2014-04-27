$(document).ready(function() {
  init_settings();
});

// author: Guido Socher except for getWeekNumber.

//--------------------------
/**
 * Author of getWeekNumber function: Thomas Rabaix
 *
 * Small corrections by Guido Socher
 *
 * return the Week Number of a gregorian date using the ISO 8601 format
 * Algorithm from http://personal.ecu.edu/mccartyr/ISOwdALG.txt , Rick McCarty
 *
 * ISO 8601 specifies that Week 01 of the year is the week containing
 * the first Thursday; Monday is Weekday 1, Sunday is Weekday 7;
 */
var isoHelper = {
    getWeekNumber: function(ddate) {
        // 1. Convert input to Y M D
        var Y = ddate.getFullYear();
        var M = ddate.getMonth();
        var D = ddate.getDay();
       
        // 4. Find the DayOfYearNumber for Y M D
        var DayOfYearNumber = isoHelper.findDayOfYearNumber(ddate);
       
        // 5. Find the Jan1Weekday for Y (Monday=1, Sunday=7)
        var Jan1Weekday = isoHelper.findJan1Weekday(ddate);
       
        // 6. Find the Weekday for Y M D
        var WeekDay = isoHelper.findDayWeek(ddate);
       
        // 7. Find if Y M D falls in YearNumber Y-1, WeekNumber 52 or 53
        var YearNumber = Y;
        var WeekNumber = 0;
        if((DayOfYearNumber <= (8 - Jan1Weekday)) && (Jan1Weekday > 4)) {
            YearNumber = Y - 1
            ddate.setFullYear(YearNumber); // set the correct year for the isLeapYear
            if((Jan1Weekday == 5) || (Jan1Weekday == 6 && isoHelper.isLeapYear(ddate))) {
                WeekNumber = 53;
            } else {
                WeekNumber = 52;
            }
            ddate.setFullYear(Y); // undo the chage in the ddate object
        }

        // 8. Find if Y M D falls in YearNumber Y+1, WeekNumber 1
        if(YearNumber == Y) {
            var I;
            if(isoHelper.isLeapYear(ddate)) {
                I = 366;
            } else {
                I = 365
            }
           
            if ((I - DayOfYearNumber) < (4 - WeekDay)) {
                YearNumber = Y + 1;
                WeekNumber = 1;
            }
        }
       
        // 9. Find if Y M D falls in YearNumber Y, WeekNumber 1 through 53
        if(YearNumber == Y) {
            var J;
            J = DayOfYearNumber + (7 - WeekDay) + (Jan1Weekday - 1)
            WeekNumber = J / 7;
            if(Jan1Weekday > 4 ) {
                WeekNumber -= 1;
            }
        }

        return WeekNumber;
    },
    isLeapYear: function(ddate) {
        var Y = ddate.getFullYear();
        if ((Y % 4) == 0 && (Y % 100) != 0) {
            return true;
        }
        if((Y % 400) == 0) {
            return true;
        }
        return false;
    },
    findDayOfYearNumber: function(ddate) {
        var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
       
        var day = ddate.getDate() + months[ddate.getMonth()];
        // only for march and onwards in leap years: 
        if(isoHelper.isLeapYear(ddate) && ddate.getMonth() > 1) {
            day++;
        }
       
        return day;
    },
    findJan1Weekday: function(ddate) {
        var d = new Date(ddate.getFullYear(), 0, 1);
        // convert from 0=sun .. 1=mon
        // to 1=mon to 7=sun
        return(isoHelper.findDayWeek(d));
    },
    findDayWeek: function (ddate) {
        var WeekDay = ddate.getDay();
        if(WeekDay == 0) {
            WeekDay = 7;
        }
       
        return WeekDay;
    }
}
// date object has month in range 0..11
function dayspermonth(ddate) {
    var days;
    var dayinmonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30 ,31];
    days=dayinmonth[ddate.getMonth()];
    if(isoHelper.isLeapYear(ddate) && ddate.getMonth() == 1) {
        days++;
    }
    return(days);
}
//--------------------------
function padd_num_zero(toadd)
{
    var tmp=toadd.toString();
    if (tmp.length <2){
        tmp="0"+tmp;
    }
    return(tmp);
}
//--------------------------
// called at load of html page
function init_settings(){
    var f=document.yearcal;
    var dateobj = new Date();
    var wday = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
    f.todaydate.value="Today is: "+wday[dateobj.getDay()]+", "+dateobj.getFullYear()+"-"+padd_num_zero((dateobj.getMonth()+1))+"-"+padd_num_zero(dateobj.getDate())+" [yyyy-mm-dd]";
    calsettoday(f);   
}
//--------------------------
function calsettoday(cform)
{
    var dateobj = new Date();
    cform.y.value=dateobj.getFullYear();
    fillmcal_txt_form(dateobj.getFullYear());
}
function updatecal(cform)
{
    var yyyy;
    // error handling:
    cform.y.value.replace(/[^0-9]/g,"");
    yyyy=parseInt(cform.y.value);
    if (isNaN(yyyy) || yyyy < 1 || yyyy > 9999){
        cform.y.value=Number.NaN;
        return(1);
    }
    cform.y.value=yyyy;
    fillmcal_txt_form(yyyy);
}
function yearmins(cform)
{
    var yyyy;
    // error handling:
    cform.y.value.replace(/[^0-9]/g,"");
    yyyy=parseInt(cform.y.value);
    if (isNaN(yyyy) || yyyy < 1 || yyyy > 9999){
        cform.y.value=Number.NaN;
        return(1);
    }
    yyyy--;
    if (yyyy<1){
        yyyy=1;
    }
    cform.y.value=yyyy;
    fillmcal_txt_form(yyyy);
}
function yearplus(cform)
{
    var yyyy;
    // error handling:
    cform.y.value.replace(/[^0-9]/g,"");
    yyyy=parseInt(cform.y.value);
    if (isNaN(yyyy) || yyyy < 1 || yyyy > 9999){
        cform.y.value=Number.NaN;
        return(1);
    }
    yyyy++;
    if (yyyy>9999){
        yyyy=9999;
    }
    cform.y.value=yyyy;
    fillmcal_txt_form(yyyy);
}
//--------------------------
function padd_num_2(toadd)
{
    var tmp=toadd.toString();
    if (tmp.length <2){
        tmp=" "+tmp;
    }
    return(tmp);
}
//--------------------------
// mm=0..11
function fillmcal_txt(yyyy,mm)
{
    var dd=1;
    var wdayIso;
    var wnum;
    var dperm;
    var line;
    var tdelem;
    var printdd=0;
    var row;
    var resultstr="";
    var dateobj = new Date(yyyy,mm,dd); 
    var today = new Date(); 
    var today_y=today.getFullYear();
    var today_m=today.getMonth(); // 0..11
    var today_d=today.getDate();
    var m2str = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
    resultstr=resultstr.concat(m2str[mm]+" "+yyyy+"\n");
    resultstr=resultstr.concat("WK | Mo Tu We Th Fr Sa Su");
    wdayIso=dateobj.getDay();
    // convert from sun=0 to mon=0 (iso 8601):
    wnum=isoHelper.getWeekNumber(dateobj);
    wdayIso--;
    if (wdayIso<0){
        wdayIso=6;
    }
    // dbg:
    //alert("wdayIso:"+wdayIso+" wnum:"+wnum+" "+yyyy+"-"+mm+"-"+dd);
    dperm=dayspermonth(dateobj);
    line=0;
    while(line<6){
        line++;
        row=0;
        resultstr=resultstr.concat("\n");
        while(row<9){
            if (row==0){
                if (printdd<2){
                    dateobj.setDate(dd);
                    wnum=isoHelper.getWeekNumber(dateobj);
                    // put week number
                    resultstr=resultstr.concat(padd_num_2(wnum));
                }else{
                    // no more dates in this row
                    resultstr=resultstr.concat("  ");
                }
                row++;
                continue;
            }
            // the empty row:
            if (row==1){
                if (printdd != 2){
                    resultstr=resultstr.concat(" | ");
                }
                row++;
                continue;
            }
            if (printdd==0 && row-2 == wdayIso){
                // start of printing
                printdd=1;
            }
            if (printdd == 1){
                // put a * where today is
                if (yyyy==today_y && mm ==today_m && dd==today_d){
                    resultstr=resultstr.concat(padd_num_2(dd));
                    resultstr=resultstr.concat("*");
                }else{
                    resultstr=resultstr.concat(padd_num_2(dd));
                    resultstr=resultstr.concat(" ");
                }
                dd++;
            }else{
                resultstr=resultstr.concat("   ");
            }
            if (dd>dperm){
                // end of printing days for this month
                printdd=2;
            }
            row++;
        }
    }
    return(resultstr);
}
//--------------------------
function fillmcal_txt_form(y)
{
    var m=0;
    while(m<12){
        document.getElementsByName("caltxt"+m)[0].value=fillmcal_txt(y,m);
        m++;
    }
}
//--------------------------