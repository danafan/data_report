import http from './request.js'
let path = {	
	deliverDewuTotal:'deliver/dewu_total',	//得物发货情况统计
	dewuOrder:'deliver/dewu_order',			//得物发货情明细
	dewuOrderExport:'deliver/dewu_order_export',	//得物发货情明细导出
	dewuSku:'deliver/dewu_sku',				//得物发货情订单明细
	dewuSkuExport:'deliver/dewu_sku_export',	//得物发货情订单明细导出
	ajaxShops:'deliver/ajax_shops',			//ajax获取得物店铺店铺id
	
}						
export default{
	//得物发货情况统计
	deliverDewuTotal(params){
		return http.get(path.deliverDewuTotal, params)
	},
	//得物发货情明细
	dewuOrder(params){
		return http.get(path.dewuOrder, params)
	},
	//得物发货情明细导出
	dewuOrderExport(params){
		return http.get(path.dewuOrderExport, params)
	},
	//得物发货情订单明细
	dewuSku(params){
		return http.get(path.dewuSku, params)
	},
	//得物发货情订单明细导出
	dewuSkuExport(params){
		return http.get(path.dewuSkuExport, params)
	},
	//ajax获取得物店铺店铺id
	ajaxShops(params){
		return http.get(path.ajaxShops, params)
	},
	
}









