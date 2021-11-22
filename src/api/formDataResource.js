import http from './request.js'
let path = {	
	formList:'form/list',				//表单列表接口
	ajaxUser:'common/ajaxUser',			//获取钉钉用户列表	
	formAdd:'form/add',					//创建/复制表单	
	formEdit:'form/edit',				//编辑表单	
	formDel:'form/del',					//删除表单
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
}









