import http from './request.js'
let path = {	
	login:'login',													//获取用户id
	jsapi:'jsapi',													//获取用户权限
	ajaxViewDept:'Common/ajaxViewDept',								//部门列表
	ajaxViewStore:'Common/ajaxViewShop',							//店铺列表
	performanceReport:'PerformanceReport/index',					//业绩分析
	dayAnalysis:'PerformanceReport/DayAnalysis',					//每日业绩
	kpiList:'kpi/list',												//绩效考核列表
	ajaxUser:'common/ajaxUser',										//查询所有用户
	kpiDetail:'kpi/detail',											//kpi详情
	addKpi:'kpi/add',												//添加kpi
}				
export default{
	//获取用户id
	login(params){
		return http.post(path.login, params)
	},
	//获取用户权限
	jsapi(params){
		return http.get(path.jsapi, params)
	},
	//部门列表
	ajaxViewDept(params){
		return http.get(path.ajaxViewDept, params)
	},
	//店铺列表
	ajaxViewStore(params){
		return http.get(path.ajaxViewStore, params)
	},
	//业绩分析
	performanceReport(params){
		return http.get(path.performanceReport, params)
	},
	//每日业绩
	dayAnalysis(params){
		return http.get(path.dayAnalysis, params)
	},
	//绩效考核列表
	kpiList(params){
		return http.get(path.kpiList, params)
	},
	//查询所有用户
	ajaxUser(params){
		return http.get(path.ajaxUser, params)
	},
	//查看kpi详情
	kpiDetail(params){
		return http.get(path.kpiDetail, params)
	},
	//添加kpi
	addKpi(params){
		return http.get(path.addKpi, params)
	},
}









