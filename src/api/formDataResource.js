import http from './request.js'
let path = {	
	formList:'form/list',					//表单列表接口
	ajaxUser:'common/ajaxUser',				//获取钉钉用户列表	
	formAdd:'form/add',						//创建/复制表单	
	formEdit:'form/edit',					//编辑表单	
	formDel:'form/del',						//删除表单
	formTableList:'formtable/list',			//数据管理列表
	formTableHearder:'formtable/hearder',	//数据管理头部信息
	processList:'formtable/process_list',	//进度详情列表
	formtableFilters:'formtable/filters',	//获取表单筛选项
	formTableAdd:'formtable/add',			//添加数据
	formtableEdit:'formtable/edit',			//编辑数据
	formtableDel:'formtable/del',			//删除数据
	formtableClear:'formtable/clear',		//清空数据
	formtableImport:'formtable/import',		//批量上传
	formSend:'form/send',					//提醒未提交人
	submitLog:'form/submit_log',			//我的提交（已提交）
	submitData:'form/submit_data',			//提交记录对应的数据列表
}						
export default{
	//表单列表接口
	formList(params){
		return http.get(path.formList, params)
	},
	//获取钉钉用户列表	
	ajaxUser(params){
		return http.get(path.ajaxUser, params)
	},
	//创建表单和复制表单	
	formAdd(params){
		return http.post(path.formAdd, params)
	},
	//编辑表单（get）
	formEditGet(params){
		return http.get(path.formEdit, params)
	},
	//编辑表单（post）	
	formEditPost(params){
		return http.post(path.formEdit, params)
	},
	//删除表单	
	formDel(params){
		return http.post(path.formDel, params)
	},
	//数据管理列表
	formTableList(params){
		return http.get(path.formTableList, params)
	},
	//数据管理头部信息
	formTableHearder(params){
		return http.get(path.formTableHearder, params)
	},
	//进度详情列表
	processList(params){
		return http.get(path.processList, params)
	},
	//获取表单筛选项
	formtableFilters(params){
		return http.get(path.formtableFilters, params)
	},
	//添加数据（get）
	formTableAddGet(params){
		return http.get(path.formTableAdd, params)
	},
	//添加数据（post）
	formTableAddPost(params){
		return http.post(path.formTableAdd, params)
	},
	//编辑数据（get）
	formtableEditGet(params){
		return http.get(path.formtableEdit, params)
	},
	//编辑数据（post）
	formtableEditPost(params){
		return http.post(path.formtableEdit, params)
	},
	//删除数据
	formtableDel(params){
		return http.post(path.formtableDel, params)
	},
	//清空数据
	formtableClear(params){
		return http.post(path.formtableClear, params)
	},
	//批量上传
	formtableImport(params){
		return http.post(path.formtableImport, params)
	},
	//提醒未提交人
	formSend(params){
		return http.post(path.formSend, params)
	},
	//我的提交（已提交）
	submitLog(params){
		return http.get(path.submitLog, params)
	},
	//提交记录对应的数据列表
	submitData(params){
		return http.get(path.submitData, params)
	},
}









