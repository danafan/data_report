import http from './request.js'
let path = {	
	searchDrawData:'dynamic_analysis/search_draw_data',		//烫画搜索框	
	fillGoodsList:'dynamic_analysis/fill_goods_list',		//烫画补货列表
	drawGoodsList:'dynamic_analysis/draw_goods_list',		//烫画商品明细
	searchWhiteData:'dynamic_analysis/search_white_data',	//白坯搜索框
	whiteGoodsList:'dynamic_analysis/white_goods_list',		//白坯款商品编码列表
	
}						
export default{
	//烫画搜索框
	searchDrawData(params){
		return http.get(path.searchDrawData, params)
	},
	//烫画补货列表
	fillGoodsList(params){
		return http.get(path.fillGoodsList, params)
	},
	//烫画商品明细
	drawGoodsList(params){
		return http.get(path.drawGoodsList, params)
	},
	//白坯搜索框
	searchWhiteData(params){
		return http.get(path.searchWhiteData, params)
	},
	//白坯款商品编码列表
	whiteGoodsList(params){
		return http.get(path.whiteGoodsList, params)
	},
}









