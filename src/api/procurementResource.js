import http from './request.js'
let path = {	
	searchDrawData:'dynamic_analysis/search_draw_data',				//烫画搜索框	
	fillGoodsList:'dynamic_analysis/fill_goods_list',				//烫画补货列表
	drawGoodsList:'dynamic_analysis/draw_goods_list',				//烫画商品明细
	
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
	whiteGoodsCollectList:'dynamic_analysis/white_goods_collect_list',		//白坯款商品编码列表-汇总
	whiteGoodsCollectListExport:'dynamic_analysis/white_goods_collect_list_export',	//白坯款商品编码列表导出-汇总
	fillGoodsCollectList:'dynamic_analysis/fill_goods_collect_list',		//烫画补货列表-汇总
	fillGoodsCollectListExport:'dynamic_analysis/fill_goods_collect_list_export',	//烫画补货列表导出-汇总
	drawGoodsCollectList:'dynamic_analysis/draw_goods_collect_list',		//烫画商品明细-汇总
	drawGoodsCollectListExport:'dynamic_analysis/draw_goods_collect_list_export',	//烫画商品明细导出-汇总

	twoOrderTotalNum:'purchase_order/two_order_total_num',						//每日下单采购总数
	searchWhiteData:'dynamic_analysis/search_white_data',						//白坯搜索框
	twoWhiteGysOrder:'purchase_order/two_white_gys_order',						//供应商下单表
	twoWhiteGysOrderExport:'purchase_order/two_white_gys_order_export',			//供应商下单表导出
	
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
	//白坯款商品编码列表-汇总
	whiteGoodsCollectList(params){
		return http.get(path.whiteGoodsCollectList, params)
	},
	//白坯款商品编码列表导出-汇总
	whiteGoodsCollectListExport(params){
		return http.get(path.whiteGoodsCollectListExport, params)
	},
	//烫画补货列表-汇总
	fillGoodsCollectList(params){
		return http.get(path.fillGoodsCollectList, params)
	},
	//烫画补货列表导出-汇总
	fillGoodsCollectListExport(params){
		return http.get(path.fillGoodsCollectListExport, params)
	},
	//烫画商品明细-汇总
	drawGoodsCollectList(params){
		return http.get(path.drawGoodsCollectList, params)
	},
	//烫画商品明细导出-汇总
	drawGoodsCollectListExport(params){
		return http.get(path.drawGoodsCollectListExport, params)
	},

	//每日下单采购总数
	twoOrderTotalNum(params){
		return http.get(path.twoOrderTotalNum, params)
	},
	//白坯搜索框
	searchWhiteData(params){
		return http.get(path.searchWhiteData, params)
	},
	//供应商下单表
	twoWhiteGysOrder(params){
		return http.get(path.twoWhiteGysOrder, params)
	},
	//供应商下单表导出
	twoWhiteGysOrderExport(params){
		return http.get(path.twoWhiteGysOrderExport, params)
	},
}









