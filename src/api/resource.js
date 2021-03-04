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
	menuRoleInfo:'menurole/info',									//角色详情
	menuRoleDel:'menurole/del',										//删除角色
	menuRoleUsers:'menurole/users',									//角色对应用户列表
	menuRoleSetting:'menurole/set',									//用户设置
	menuRoleUsrInfo:'menurole/useinfo',								//用户详情
	moveUser:'menurole/moveuser',									//删除角色下的用户
	dataRoleList:'datarole/list',									//数据权限列表
	addDataRole:'datarole/add',										//新增数据角色
	editDataRole:'datarole/edit',									//编辑数据角色
	delDataRole:'datarole/del',										//删除数据角色
	dataRoleInfo:'datarole/info',									//角色详情
	dataRoleUser:'datarole/users',									//数据角色对应用户列表
	setDataRole:'datarole/set',										//数据角色用户设置
	dataRoleUseInfo:'datarole/useinfo',								//数据权限用户详情
	dataRoleMoveUser:'datarole/moveuser',							//数据权限删除用户
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
	//新增访问权限(get)
	addMenuRoleGet(params){
		return http.get(path.addMenuRole, params)
	},
	//新增访问权限(post)
	addMenuRolePost(params){
		return http.post(path.addMenuRole, params)
	},
	//编辑访问权限(get)
	editMenuRoleGet(params){
		return http.get(path.editMenuRole, params)
	},
	//编辑访问权限(post)
	editMenuRolePost(params){
		return http.post(path.editMenuRole, params)
	},
	//角色详情
	menuRoleInfo(params){
		return http.get(path.menuRoleInfo, params)
	},
	//删除角色
	menuRoleDel(params){
		return http.post(path.menuRoleDel, params)
	},
	//角色用户列表
	menuRoleUsers(params){
		return http.get(path.menuRoleUsers, params)
	},
	//设置用户（get）
	menuRoleSettingGet(params){
		return http.get(path.menuRoleSetting, params)
	},
	//设置用户（post）
	menuRoleSettingPost(params){
		return http.post(path.menuRoleSetting, params)
	},
	//用户详情
	menuRoleUsrInfo(params){
		return http.get(path.menuRoleUsrInfo, params)
	},
	//删除角色下的用户
	moveUser(params){
		return http.post(path.moveUser, params)
	},
	//数据权限角色列表
	dataRoleList(params){
		return http.get(path.dataRoleList, params)
	},
	//新增数据权限（get）
	addDataRoleGet(params){
		return http.get(path.addDataRole, params)
	},
	//新增数据权限（post）
	addDataRolePost(params){
		return http.post(path.addDataRole, params)
	},
	//编辑数据角色（get）
	editDataRoleGet(params){
		return http.get(path.editDataRole, params)
	},
	//编辑数据角色（post）
	editDataRolePost(params){
		return http.post(path.editDataRole, params)
	},
	//删除数据角色
	delDataRole(params){
		return http.post(path.delDataRole, params)
	},
	//数据权限详情
	dataRoleInfo(params){
		return http.get(path.dataRoleInfo, params)
	},
	//数据角色对应用户列表
	dataRoleUser(params){
		return http.get(path.dataRoleUser, params)
	},
	//数据权限用户设置(get)
	setDataRoleGet(params){
		return http.get(path.setDataRole, params)
	},
	//数据权限用户设置(post)
	setDataRolePost(params){
		return http.post(path.setDataRole, params)
	},
	//数据权限用户详情
	dataRoleUseInfo(params){
		return http.get(path.dataRoleUseInfo, params)
	},
	//用户权限删除用户
	dataRoleMoveUser(params){
		return http.post(path.dataRoleMoveUser, params)
	},
}









