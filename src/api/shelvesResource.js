import http from './request.js'
let path = {	
	offShelfList:'offshelf/kslist',					//下架款筛选列表
	offShelfSet:'offshelf/export',					//转为下架款
	offShelfDjList:'offshelf/list',					//下架款登记列表
	
}						
export default{
	//下架款筛选列表
	offShelfList(params){
		return http.get(path.offShelfList, params)
	},
	//转为下架款
	offShelfSet(params){
		return http.post(path.offShelfSet, params)
	},
	//下架款登记列表
	offShelfDjList(params){
		return http.get(path.offShelfDjList, params)
	},
}









