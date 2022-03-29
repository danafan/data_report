var now = new Date(); 				//当前日期  
var nowDay = now.getDate(); 		//当前日 
var nowMonth = now.getMonth(); 		//当前月 
var nowYear = now.getYear(); 		//当前年 
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
//获得昨日日期（包括上月末日期）
export function getCurrentDate(){
	var day1 = new Date();
	day1.setTime(day1.getTime()-24*60*60*1000);
	var currentDate = new Date(day1);
	return formatDate(currentDate); 
}
//获得今日
export function getNowDate(){
	// var day7 = new Date();
	// day7.setTime(day7.getTime()-24*60*60*1000);
	// var currentDate = new Date(day1);
	return formatDate(new Date()); 
}
//获得30天以前的日期
export function lastMonthDate(){
	var day2 = new Date();
	day2.setTime(day2.getTime()-720*60*60*1000);
	var currentDate = new Date(day2);
	return formatDate(currentDate); 
}

//获得某天以前的日期
export function lastXDate(x){
	let num = x*24;
	var dayx = new Date();
	dayx.setTime(dayx.getTime()-num*60*60*1000);
	var currentDate = new Date(dayx);
	return formatDate(currentDate); 
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
function formatDate(date) { 
	var myyear = date.getFullYear(); 
	var mymonth = date.getMonth()+1; 
	var myweekday = date.getDate(); 
	if(mymonth < 10){ 
		mymonth = "0" + mymonth; 
	} 
	if(myweekday < 10){ 
		myweekday = "0" + myweekday; 
	}
	return (myyear+"-"+mymonth + "-" + myweekday);
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