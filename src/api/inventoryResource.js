import http from './request.js'
let path = {	
	stockList:'stock/list',										//库存情况汇总
	shopList:'stock/shoplist',									//店铺列表
	stockEdit:'stock/edit',										//提交反馈
	editLog:'stock/edit_log',									//历史跟踪反馈列表
	stockImport:'stock/import',									//导入
}						
export default{
	//库存情况汇总
	stockList(params){
		return http.get(path.stockList, params)
	},
	//店铺列表
	shopList(params){
		return http.get(path.shopList, params)
	},
	//提交反馈
	stockEdit(params){
		return http.post(path.stockEdit, params)
	},
	//历史跟踪反馈列表
	editLog(params){
		return http.get(path.editLog, params)
	},
	//导入
	stockImport(params){
		return http.post(path.stockImport, params)
	},
}









