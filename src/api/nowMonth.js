var now = new Date(); 				//当前日期  
var nowDay = now.getDate(); 		//当前日 
var nowMonth = now.getMonth(); 		//当前月 
var nowYear = now.getYear(); 		//当前年 
const nowTime = now.getTime()
nowYear += (nowYear < 2000) ? 1900 : 0; 

//获得本月的开始日期 
export function getMonthStartDate(){
	var monthStartDate; 
	if(nowDay == 1){
		monthStartDate = new Date(nowYear, nowMonth - 1, 1);
	}else{
		monthStartDate = new Date(nowYear, nowMonth, 1);
	}
	return formatDate(monthStartDate); 
}
//获得本周的开始日期 
export function getWeekStartDate(){
const day = now.getDay() > 0 ? now.getDay() : 7 // 表示当前是周几
const oneDayTime = 24 * 60 * 60 * 1000 // 一天的总ms
// 本周一时间戳
const MondayTime = nowTime - (day - 1) * oneDayTime
// 格式化时间
const monday = new Date(MondayTime)
// 可以通过自定义函数（format）格式化时间戳
return formatDate(monday)
}
//获得前几年
export function getLastYear(n){ 
	return (nowYear-n).toString();
}
//获得本年
export function getCurrentYear(){ 
	return nowYear.toString();
}
//获得上月
export function getLastMonth(){ 
	var currentMonth = new Date(nowYear, nowMonth, 1); 
	var myyear = currentMonth.getFullYear(); 
	var mymonth = currentMonth.getMonth(); 
	if(mymonth < 10){ 
		mymonth = "0" + mymonth; 
	} 
	return (myyear+"-"+mymonth);
}
//获得本月
export function getCurrentMonth(){ 
	var currentMonth = new Date(nowYear, nowMonth, 1); 
	var myyear = currentMonth.getFullYear(); 
	var mymonth = currentMonth.getMonth()+1; 
	if(mymonth < 10){ 
		mymonth = "0" + mymonth; 
	} 
	return (myyear+"-"+mymonth);
}
//获得下个月
export function getNextMonth(){ 
	var currentMonth = new Date(nowYear, nowMonth, 1); 
	var myyear = currentMonth.getFullYear(); 
	var mymonth = currentMonth.getMonth()+2; 
	if(mymonth < 10){ 
		mymonth = "0" + mymonth; 
	} 
	return (myyear+"-"+mymonth);
}
//获取某日期的前几日日期
export function getNextDate(date, day,t) { 
	　　var dd = new Date(date);
	　　dd.setDate(dd.getDate() + day);
	　　var y = dd.getFullYear();
	　　var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
	　　var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
	if(t){
		return y + '-' + m + "-" + d;
	}else{
		return m + "-" + d;
	}
	　　
}
//获取某一天
export function getSomeDay(c_d,num){
	let day = new Date(c_d);
	day.setTime(day.getTime()+num*24*60*60*1000);
	var someDate = new Date(day);
	return formatDate(someDate); 
}
//获得昨日日期（包括上月末日期）
export function getCurrentDate(num){
	var day1 = new Date();
	if(num){
		day1.setTime(day1.getTime()-num*24*60*60*1000);
	}else{
		day1.setTime(day1.getTime()-24*60*60*1000);
	}
	var currentDate = new Date(day1);
	return formatDate(currentDate); 
}
//获得今日
export function getNowDate(t){
	// var day7 = new Date();
	// day7.setTime(day7.getTime()-24*60*60*1000);
	// var currentDate = new Date(day1);
	return formatDate(new Date(),t); 
}
//获得30天以前的日期
export function lastMonthDate(){
	var day2 = new Date();
	day2.setTime(day2.getTime()-720*60*60*1000);
	var currentDate = new Date(day2);
	return formatDate(currentDate); 
}

//获得某天以前的日期
export function lastXDate(x,t){
	let num = x*24;
	var dayx = new Date();
	dayx.setTime(dayx.getTime()-num*60*60*1000);
	var currentDate = new Date(dayx);
	return formatDate(currentDate,t); 
}
//获得某月的开始日期 
export function getNullMonthStartDate(month){ 
	var nullMonthStartDate = new Date(nowYear, month-1, 1); 
	return formatDate(nullMonthStartDate); 
}
//获得前某月的开始日期 
export function getLastMonthStartDate(month_num){ 
	var lastMonthStartDate = new Date(nowYear, nowMonth - month_num, 1); 
	return formatDate(lastMonthStartDate); 
}
//获得前某月的结束日期 
export function getLastMonthEndDate(month_num){ 
	var lastMonthEndDate = new Date(nowYear, nowMonth - month_num, 0); 
	return formatDate(lastMonthEndDate); 
}
export function thousands(num){
	return num.toLocaleString();
}
//格式化日期
function formatDate(date,t) { 
	var myyear = date.getFullYear(); 
	var mymonth = date.getMonth()+1; 
	var myweekday = date.getDate(); 
	var hour = date.getHours(); // 时
  	var minutes = date.getMinutes(); // 分
  	var seconds = date.getSeconds() //秒
  	if(mymonth < 10){ 
  		mymonth = "0" + mymonth; 
  	} 
  	if(myweekday < 10){ 
  		myweekday = "0" + myweekday; 
  	}
  	if(hour < 10){ 
  		hour = "0" + hour; 
  	}
  	if(minutes < 10){ 
  		minutes = "0" + minutes; 
  	}
  	if(seconds < 10){ 
  		seconds = "0" + seconds; 
  	}
  	if(t){
  		return (myyear + "-" + mymonth + "-" + myweekday + ' ' + hour + ":" + minutes + ":" + seconds);
  	}else{
  		return (myyear + "-" + mymonth + "-" + myweekday);
  	}
  	
  }
//获取月日期信息
  export function getMonthInfo(year,month){
  	let callObj = {
  		monthDayNum:mGetDate(year,month),
  		year:year,
  		month:month
  	}
  	return callObj;
  }
// 获取当月天数
  function mGetDate(y,m){
  	var thisDate = new Date(y,m,0);  
  	return thisDate.getDate();
  }
// 获取星期
  export function getWeek(dateString) {
  	var dateArray = dateString.split("-");
  	var date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
  	return "日一二三四五六".charAt(date.getDay());
  }

//获取两个日期间的所有日期
  export function getEveryDay(stime, etime) {
  	//初始化日期列表，数组
    var diffdate = new Array();
    var i=0;
    //开始日期小于等于结束日期,并循环
    while(stime<=etime){
        diffdate[i] = stime;
        
        //获取开始日期时间戳
        var stime_ts = new Date(stime).getTime();
        
        //增加一天时间戳后的日期
        var next_date = stime_ts + (24*60*60*1000);
        
        //拼接年月日，这里的月份会返回（0-11），所以要+1
        var next_dates_y = new Date(next_date).getFullYear()+'-';
        var next_dates_m = (new Date(next_date).getMonth()+1 < 10)?'0'+(new Date(next_date).getMonth()+1)+'-':(new Date(next_date).getMonth()+1)+'-';
        var next_dates_d = (new Date(next_date).getDate() < 10)?'0'+new Date(next_date).getDate():new Date(next_date).getDate();
 
        stime = next_dates_y+next_dates_m+next_dates_d;
        
        //增加数组key
        i++;
    }
    return diffdate;
  }



