import http from './request.js'
let path = {	
	login:'login',													//获取用户id
	quit:'quit',													//推出
	getMenu:'access/mymenu',										//获取所有菜单列表
	jsapi:'jsapi',													//获取用户权限
	ajaxViewDept:'Common/ajaxViewDept',								//部门列表
	ajaxViewStore:'Common/ajaxViewShop',							//店铺列表
	performanceReport:'PerformanceReport/index',					//业绩分析
	dayAnalysis:'PerformanceReport/DayAnalysis',					//每日业绩
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
	accessList:'access/accesslist',									//权限列表
	getMainMenus:'access/getmainmenus',								//获取菜单列表
	getController:'access/getcontrollers',							//获取所有控制器
	getMethods:'access/getmethods',									//控制器下所有方法列表
	ajaxAccess:'access/ajaxaccess',									//选择权限按钮列表
	addAccess:'access/add',											//添加权限
	getAccessInfo:'access/getinfo',									//权限信息获取
	delAccess:'access/del',											//删除权限
	editAccess:'access/edit',										//编辑权限
}					
export default{
	//获取用户id
	login(params){
		return http.post(path.login, params)
	},
	//用户推出
	quit(params){
		return http.post(path.quit, params)
	},
	//获取所有菜单列表
	getMenu(params){
		return http.get(path.getMenu, params)
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
	//权限列表
	accessList(params){
		return http.get(path.accessList, params)
	},
	//获取菜单列表
	getMainMenus(params){
		return http.get(path.getMainMenus, params)
	},
	//获取所有控制器
	getControllers(params){
		return http.get(path.getController, params)
	},
	//控制器下所有方法列表
	getMethods(params){
		return http.get(path.getMethods, params)
	},
	//选择权限按钮列表
	ajaxAccess(params){
		return http.get(path.ajaxAccess, params)
	},
	//添加权限
	addAccess(params){
		return http.post(path.addAccess, params)
	},
	//权限信息获取
	getAccessInfo(params){
		return http.get(path.getAccessInfo, params)
	},
	//删除权限
	delAccess(params){
		return http.post(path.delAccess, params)
	},
	//编辑权限
	editAccess(params){
		return http.post(path.editAccess, params)
	},
}









