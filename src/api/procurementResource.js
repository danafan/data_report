import http from './request.js'
let path = {	
	searchDrawData:'dynamic_analysis/search_draw_data',				//烫画搜索框	
	fillGoodsList:'dynamic_analysis/fill_goods_list',				//烫画补货列表
	drawGoodsList:'dynamic_analysis/draw_goods_list',				//烫画商品明细
	searchWhiteData:'dynamic_analysis/search_white_data',			//白坯搜索框
	whiteGoodsList:'dynamic_analysis/white_goods_list',				//白坯款商品编码列表
	whiteGoodsListExport:'dynamic_analysis/white_goods_list_export',//白坯款商品编码列表导出
	fillGoodsListExport:'dynamic_analysis/fill_goods_list_export',	//烫画补货列表导出
	drawGoodsListExport:'dynamic_analysis/draw_goods_list_export',	//烫画商品明细导出
	drawGoodsTotal:'dynamic_analysis/draw_goods_total',				//烫画总计
	whiteGoodsTotal:'dynamic_analysis/white_goods_total',			//白坯总计
	fillGoodsListFour:'dynamic_analysis/fill_goods_list_four',				//烫画补货列表
	drawGoodsListFour:'dynamic_analysis/draw_goods_list_four',				//烫画商品明细
	whiteGoodsListFour:'dynamic_analysis/white_goods_list_four',				//白坯款商品编码列表
	whiteGoodsListExportFour:'dynamic_analysis/white_goods_list_export_four',//白坯款商品编码列表导出
	fillGoodsListExportFour:'dynamic_analysis/fill_goods_list_export_four',	//烫画补货列表导出
	drawGoodsListExportFour:'dynamic_analysis/draw_goods_list_export_four',	//烫画商品明细导出
	drawGoodsTotalFour:'dynamic_analysis/draw_goods_total_four',				//烫画总计
	whiteGoodsTotalFour:'dynamic_analysis/white_goods_total_four',			//白坯总计
	
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
	//白坯款商品编码列表导出
	whiteGoodsListExport(params){
		return http.get(path.whiteGoodsListExport, params)
	},
	//烫画补货列表导出
	fillGoodsListExport(params){
		return http.get(path.fillGoodsListExport, params)
	},
	//烫画商品明细导出
	drawGoodsListExport(params){
		return http.get(path.drawGoodsListExport, params)
	},
	//烫画总计
	drawGoodsTotal(params){
		return http.get(path.drawGoodsTotal, params)
	},
	//白坯总计
	whiteGoodsTotal(params){
		return http.get(path.whiteGoodsTotal, params)
	},
	//烫画补货列表
	fillGoodsListFour(params){
		return http.get(path.fillGoodsListFour, params)
	},
	//烫画商品明细
	drawGoodsListFour(params){
		return http.get(path.drawGoodsListFour, params)
	},
	//白坯款商品编码列表
	whiteGoodsListFour(params){
		return http.get(path.whiteGoodsListFour, params)
	},
	//白坯款商品编码列表导出
	whiteGoodsListExportFour(params){
		return http.get(path.whiteGoodsListExportFour, params)
	},
	//烫画补货列表导出
	fillGoodsListExportFour(params){
		return http.get(path.fillGoodsListExportFour, params)
	},
	//烫画商品明细导出
	drawGoodsListExportFour(params){
		return http.get(path.drawGoodsListExportFour, params)
	},
	//烫画总计
	drawGoodsTotalFour(params){
		return http.get(path.drawGoodsTotalFour, params)
	},
	//白坯总计
	whiteGoodsTotalFour(params){
		return http.get(path.whiteGoodsTotalFour, params)
	},
}









