import http from './request.js'
let path = {	
	storeList:'shop_relation/list',				//店铺列表
	shopExport:'shop_relation/shop_export',		//导出
	
}						
export default{
	//店铺列表
	storeList(params){
		return http.get(path.storeList, params)
	},
	//导出
	shopExport(params){
		return http.post(path.shopExport, params)
	},
}









