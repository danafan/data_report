import http from './request.js'
let path = {	
	twoOrderTotalNum:'purchase_order/two_order_total_num',						//每日下单采购总数(二部)
	searchWhiteData:'purchase_order/search_white_data',							//白坯对照搜索框
	searchDrawData:'purchase_order/search_draw_data',							//烫画明细-白坯下单搜索框
	searchWhiteHglData:'purchase_order/search_white_hgl_data',					//白坯合格率搜索框
	twoWhiteGysOrder:'purchase_order/two_white_gys_order',						//供应商下单表(二部)
	twoWhiteGysOrderExport:'purchase_order/two_white_gys_order_export',			//供应商下单表导出(二部)
	twoWhiteKsOrderExport:'purchase_order/two_white_ks_order_export',			//白坯款式编码下单表导出(二部)
	twoWhiteKsOrder:'purchase_order/two_white_ks_order',						//白坯款式编码下单表(二部)
	twoWhiteBmOrder:'purchase_order/two_white_bm_order',						//白胚商品编码下单表(二部)
	twoWhiteBmOrderExport:'purchase_order/two_white_bm_order_export',			//白胚商品编码下单表导出(二部)
	fourOrderTotalNum:'purchase_order/four_order_total_num',					//每日下单采购总数(四部)
	fourWhiteGysOrder:'purchase_order/four_white_gys_order',					//供应商下单表(四部)
	fourWhiteGysOrderExport:'purchase_order/four_white_gys_order_export',		//供应商下单表导出(四部)
	fourWhiteKsOrderExport:'purchase_order/four_white_ks_order_export',			//白坯款式编码下单表导出(四部)
	fourWhiteKsOrder:'purchase_order/four_white_ks_order',						//白坯款式编码下单表(四部)
	fourWhiteBmOrder:'purchase_order/four_white_bm_order',						//白胚商品编码下单表(四部)
	fourWhiteBmOrderExport:'purchase_order/four_white_bm_order_export',			//白胚商品编码下单表导出(四部)
	twoDrawGoodsList:'purchase_order/two_draw_goods_list',						//烫画款商品明细(二部)
	twoDrawGoodsExport:'purchase_order/two_draw_goods_export',					//烫画款商品明细导出(二部)
	fourDrawGoodsList:'purchase_order/four_draw_goods_list',					//烫画款商品明细(四部)
	fourDrawGoodsExport:'purchase_order/four_draw_goods_export',				//烫画款商品明细导出(四部)
	twoDrawContrastList:'purchase_order/two_draw_contrast_list',				//白坯烫画对照表(二部)
	twoDrawContrastExport:'purchase_order/two_draw_contrast_export',			//白坯烫画对照表导出(二部)
	fourDrawContrastList:'purchase_order/four_draw_contrast_list',				//白坯烫画对照表(四部)
	fourDrawContrastExport:'purchase_order/four_draw_contrast_export',			//白坯烫画对照表导出(四部)
	twoWhiteHglList:'purchase_order/two_white_hgl_list',						//白坯合格率(二部)
	fourWhiteHglList:'purchase_order/four_white_hgl_list',						//白坯合格率(四部)
	twoWhiteHglExport:'purchase_order/two_white_hgl_export',					//白坯合格率导出(二部)
	fourWhiteHglExport:'purchase_order/four_white_hgl_export',					//白坯合格率导出(四部)
	orderTotalNum:'purchase_order/order_total_num',								//每日下单采购总数（汇总）
	whiteGysOrder:'purchase_order/white_gys_order',								//供应商下单表（汇总）
	whiteGysOrderExport:'purchase_order/white_gys_order_export',				//供应商下单表导出（汇总）
	whiteKsOrder:'purchase_order/white_ks_order',								//白坯款式编码下单表（汇总）
	whiteKsOrderExport:'purchase_order/white_ks_order_export',					//白坯款式编码下单表导出（汇总）
	whiteBmOrder:'purchase_order/white_bm_order',								//白胚商品编码下单表(汇总)
	whiteBmOrderExport:'purchase_order/white_bm_order_export',					//白胚商品编码下单表导出(汇总)
	drawGoodsList:'purchase_order/draw_goods_list',								//烫画款商品明细表(汇总)
	drawGoodsExport:'purchase_order/draw_goods_export',							//烫画款商品明细表导出（汇总）
	drawContrastList:'purchase_order/draw_contrast_list',						//白坯烫画对照表(汇总)
	drawContrastExport:'purchase_order/draw_contrast_export',					//白坯烫画对照表导出(汇总)
	whiteHglList:'purchase_order/white_hgl_list',								//白坯合格率(汇总)
	whiteHglExport:'purchase_order/white_hgl_export',							//白坯合格率导出(汇总)
	shortageFeedback:'purchase_order/shortage_feedback',						//缺货反馈
	shortageFeedbackExport:'purchase_order/shortage_feedback_export',			//缺货反馈导出
	shortageRecordList:'purchase_order/shortage_record_list',					//记录详情
	shortageRecordSave:'purchase_order/shortage_record_save',					//修改
	searchShortage:'purchase_order/search_shortage',							//查询条件
			
}						
export default{
	//每日下单采购总数
	twoOrderTotalNum(params){
		return http.get(path.twoOrderTotalNum, params)
	},
	//白坯搜索框
	searchWhiteData(params){
		return http.get(path.searchWhiteData, params)
	},
	//烫画明细-白坯下单搜索框
	searchDrawData(params){
		return http.get(path.searchDrawData, params)
	},
	//白坯合格率搜索框
	searchWhiteHglData(params){
		return http.get(path.searchWhiteHglData, params)
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
	//白坯烫画对照表
	twoDrawContrastList(params){
		return http.get(path.twoDrawContrastList, params)
	},
	//白坯烫画对照表导出
	twoDrawContrastExport(params){
		return http.get(path.twoDrawContrastExport, params)
	},
	//白坯烫画对照表
	fourDrawContrastList(params){
		return http.get(path.fourDrawContrastList, params)
	},
	//白坯烫画对照表导出
	fourDrawContrastExport(params){
		return http.get(path.fourDrawContrastExport, params)
	},
	//白坯合格率
	twoWhiteHglList(params){
		return http.get(path.twoWhiteHglList, params)
	},
	//白坯合格率
	fourWhiteHglList(params){
		return http.get(path.fourWhiteHglList, params)
	},
	//白坯合格率导出
	twoWhiteHglExport(params){
		return http.get(path.twoWhiteHglExport, params)
	},
	//白坯合格率导出
	fourWhiteHglExport(params){
		return http.get(path.fourWhiteHglExport, params)
	},
	//每日下单采购总数（汇总）
	orderTotalNum(params){
		return http.get(path.orderTotalNum, params)
	},
	//供应商下单表（汇总）
	whiteGysOrder(params){
		return http.get(path.whiteGysOrder, params)
	},
	//供应商下单表导出（汇总）
	whiteGysOrderExport(params){
		return http.get(path.whiteGysOrderExport, params)
	},
	//白坯款式编码下单表（汇总）
	whiteKsOrder(params){
		return http.get(path.whiteKsOrder, params)
	},
	//白坯款式编码下单表导出（汇总）
	whiteKsOrderExport(params){
		return http.get(path.whiteKsOrderExport, params)
	},
	//白胚商品编码下单表（汇总）
	whiteBmOrder(params){
		return http.get(path.whiteBmOrder, params)
	},
	//白胚商品编码下单表导出（汇总）
	whiteBmOrderExport(params){
		return http.get(path.whiteBmOrderExport, params)
	},
	//烫画款商品明细表（汇总）
	drawGoodsList(params){
		return http.get(path.drawGoodsList, params)
	},
	//烫画款商品明细表导出（汇总）
	drawGoodsExport(params){
		return http.get(path.drawGoodsExport, params)
	},
	//白坯烫画对照表（汇总）
	drawContrastList(params){
		return http.get(path.drawContrastList, params)
	},
	//白坯烫画对照表导出（汇总）
	drawContrastExport(params){
		return http.get(path.drawContrastExport, params)
	},
	//白坯合格率（汇总）
	whiteHglList(params){
		return http.get(path.whiteHglList, params)
	},
	//白坯合格率导出（汇总）
	whiteHglExport(params){
		return http.get(path.whiteHglExport, params)
	},
	//缺货反馈
	shortageFeedback(params){
		return http.get(path.shortageFeedback, params)
	},
	//缺货反馈导出
	shortageFeedbackExport(params){
		return http.get(path.shortageFeedbackExport, params)
	},
	//记录详情
	shortageRecordList(params){
		return http.get(path.shortageRecordList, params)
	},
	//修改
	shortageRecordSave(params){
		return http.post(path.shortageRecordSave, params)
	},
	//查询列表
	searchShortage(params){
		return http.get(path.searchShortage, params)
	},
}









