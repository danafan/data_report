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

	twoOrderTotalNum:'purchase_order/two_order_total_num',						//每日下单采购总数(二部)
	searchWhiteData:'dynamic_analysis/search_white_data',						//白坯搜索框
	twoWhiteGysOrder:'purchase_order/two_white_gys_order',						//供应商下单表(二部)
	twoWhiteGysOrderExport:'purchase_order/two_white_gys_order_export',			//供应商下单表导出(二部)
	twoWhiteKsOrderExport:'purchase_order/two_white_ks_order_export',			//白坯款式编码下单表导出(二部)
	twoWhiteKsOrder:'purchase_order/two_white_ks_order',						//白坯款式编码下单表(二部)
	twoWhiteBmOrder:'purchase_order/two_white_bm_order',						//白胚商品编码下单表(二部)
	twoWhiteBmOrderExport:'purchase_order/two_white_bm_order_export',			//白胚商品编码下单表导出(二部)
	fourOrderTotalNum:'purchase_order/four_order_total_num',						//每日下单采购总数(四部)
	fourWhiteGysOrder:'purchase_order/four_white_gys_order',						//供应商下单表(四部)
	fourWhiteGysOrderExport:'purchase_order/four_white_gys_order_export',			//供应商下单表导出(四部)
	fourWhiteKsOrderExport:'purchase_order/four_white_ks_order_export',				//白坯款式编码下单表导出(四部)
	fourWhiteKsOrder:'purchase_order/four_white_ks_order',							//白坯款式编码下单表(四部)
	fourWhiteBmOrder:'purchase_order/four_white_bm_order',							//白胚商品编码下单表(四部)
	fourWhiteBmOrderExport:'purchase_order/four_white_bm_order_export',				//白胚商品编码下单表导出(四部)
	twoDrawGoodsList:'purchase_order/two_draw_goods_list',						//烫画款商品明细(二部)
	twoDrawGoodsExport:'purchase_order/two_draw_goods_export',					//烫画款商品明细导出(二部)
	fourDrawGoodsList:'purchase_order/four_draw_goods_list',						//烫画款商品明细(四部)
	fourDrawGoodsExport:'purchase_order/four_draw_goods_export',					//烫画款商品明细导出(四部)
	
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
	//白坯款式编码下单表导出
	twoWhiteKsOrderExport(params){
		return http.get(path.twoWhiteKsOrderExport, params)
	},
	//白坯款式编码下单表
	twoWhiteKsOrder(params){
		return http.get(path.twoWhiteKsOrder, params)
	},
	//白胚商品编码下单表
	twoWhiteBmOrder(params){
		return http.get(path.twoWhiteBmOrder, params)
	},
	//白胚商品编码下单表导出
	twoWhiteBmOrderExport(params){
		return http.get(path.twoWhiteBmOrderExport, params)
	},
	//每日下单采购总数
	fourOrderTotalNum(params){
		return http.get(path.fourOrderTotalNum, params)
	},
	//供应商下单表
	fourWhiteGysOrder(params){
		return http.get(path.fourWhiteGysOrder, params)
	},
	//供应商下单表导出
	fourWhiteGysOrderExport(params){
		return http.get(path.fourWhiteGysOrderExport, params)
	},
	//白坯款式编码下单表导出
	fourWhiteKsOrderExport(params){
		return http.get(path.fourWhiteKsOrderExport, params)
	},
	//白坯款式编码下单表
	fourWhiteKsOrder(params){
		return http.get(path.fourWhiteKsOrder, params)
	},
	//白胚商品编码下单表
	fourWhiteBmOrder(params){
		return http.get(path.fourWhiteBmOrder, params)
	},
	//白胚商品编码下单表导出
	fourWhiteBmOrderExport(params){
		return http.get(path.fourWhiteBmOrderExport, params)
	},

	//烫画款商品明细
	twoDrawGoodsList(params){
		return http.get(path.twoDrawGoodsList, params)
	},
	//烫画款商品明细导出
	twoDrawGoodsExport(params){
		return http.get(path.twoDrawGoodsExport, params)
	},
	//烫画款商品明细
	fourDrawGoodsList(params){
		return http.get(path.fourDrawGoodsList, params)
	},
	//烫画款商品明细导出
	fourDrawGoodsExport(params){
		return http.get(path.fourDrawGoodsExport, params)
	},
}









