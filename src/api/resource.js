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
	feedBack:'kpi/feedback',										//提交反馈
	editKpi:'kpi/edit',												//编辑kpi		
	confirmKpi:'kpi/confirm',										//确认kpi
	passKpi:'kpi/pass',												//通过kpi	
	scoreKpi:'kpi/score',											//评分	
	exportKpi:'kpi/export',											//获取打印列表
	userList:'user/list',											//权限用户列表
	userInfo:'user/info',											//获取用户详情
	userSet:'user/set',												//用户设置
	menuRoleList:'menurole/list',									//获取权限列表
	addMenuRole:'menurole/add',										//新增访问权限
	editMenuRole:'menurole/edit',									//编辑访问权限
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
	//添加kpi（get）
	addKpiGet(params){
		return http.get(path.addKpi, params)
	},
	//添加kpi（post）
	addKpiPost(params){
		return http.post(path.addKpi, params)
	},
	//提交反馈
	feedBack(params){
		return http.post(path.feedBack, params)
	},
	//编辑kpi（get）
	editKpiGet(params){
		return http.get(path.editKpi, params)
	},
	//编辑kpi（post）
	editKpiPost(params){
		return http.post(path.editKpi, params)
	},
	//确认kpi
	confirmKpi(params){
		return http.post(path.confirmKpi, params)
	},
	//通过kpi
	passKpi(params){
		return http.post(path.passKpi, params)
	},
	//评分
	scoreKpi(params){
		return http.post(path.scoreKpi, params)
	},
	//获取打印列表
	exportKpi(params){
		return http.get(path.exportKpi, params)
	},
	//权限用户列表
	userList(params){
		return http.get(path.userList, params)
	},
	// 用户详情
	userInfo(params){
		return http.get(path.userInfo, params)
	},
	//用户设置(get)
	userSetGet(params){
		return http.get(path.userSet, params)
	},
	//用户设置(post)
	userSetPost(params){
		return http.post(path.userSet, params)
	},
	//获取权限列表
	menuRoleList(params){
		return http.get(path.menuRoleList, params)
	},
	//新增访问权限
	addMenuRole(params){
		return http.post(path.addMenuRole, params)
	},
	//编辑访问权限
	editMenuRole(params){
		return http.post(path.editMenuRole, params)
	},
}









