import http from './request.js'
let path = {	
	getDepts:'targesalemanage/get_depts',							//获取部门列表
	getShops:'targesalemanage/get_shops',							//获取店铺列表
	getShopInfo:'targesalemanage/get_shop_info',					//获取店铺详情
	lastYearData:'targesalemanage/last_year_data',					//获取去年同期数据
	ajaxUser:'common/ajaxUser',										//获取店长列表
	addShopTarget:'targesalemanage/add_shop_target',				//创建店铺目标
}						
export default{
	//获取部门列表
	getDepts(params){
		return http.get(path.getDepts, params)
	},
	//获取店铺列表
	getShops(params){
		return http.get(path.getShops, params)
	},
	//获取店铺详情
	getShopInfo(params){
		return http.get(path.getShopInfo, params)
	},
	//获取去年同期数据
	lastYearData(params){
		return http.get(path.lastYearData, params)
	},
	//获取店长列表
	ajaxUser(params){
		return http.get(path.ajaxUser, params)
	},
	//创建店铺目标
	addShopTarget(params){
		return http.post(path.addShopTarget, params)
	},
}









