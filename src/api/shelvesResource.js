import http from './request.js'
let path = {	
	offShelfList:'offshelf/kslist',					//下架款筛选列表
	offShelfExport:'offshelf/export',				//【下架款登记-去重】-导入接口
	offShelfDjList:'offshelf/list',					//下架款登记列表-去重
	offshelfAll:'offshelf/all',						//下架款登记列表-明细
	ysggList:'offshelf/ysgg',						//所有颜色规格列表
	offshelfAdd:'offshelf/add',						//录入
	offshelfDel:'offshelf/del',						//删除
	ajaxShops:'offshelf/ajax_shops',				//获取店铺列表
	dpksList:'offshelf/dpks_list',					//款式编码对应店铺款式编码列表
	
}						
export default{
	//下架款筛选列表
	offShelfList(params){
		return http.get(path.offShelfList, params)
	},
	//【下架款登记-去重】-导入接口
	offShelfExport(params){
		return http.post(path.offShelfExport, params)
	},
	//下架款登记列表（去重）
	offShelfDjList(params){
		return http.get(path.offShelfDjList, params)
	},
	//下架款登记列表（明细）
	offshelfAll(params){
		return http.get(path.offshelfAll, params)
	},
	//所有颜色规格列表
	ysggList(params){
		return http.get(path.ysggList, params)
	},
	//录入
	offshelfAdd(params){
		return http.post(path.offshelfAdd, params)
	},
	//下架款登记列表（明细删除）
	offshelfDel(params){
		return http.post(path.offshelfDel, params)
	},
	//获取店铺列表
	ajaxShops(params){
		return http.get(path.ajaxShops, params)
	},
	//款式编码对应店铺款式编码列表
	dpksList(params){
		return http.get(path.dpksList, params)
	},
}









