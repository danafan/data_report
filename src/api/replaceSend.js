import http from './request.js'
let path = {	
	orderList:'replacesend/order_list',					//订单列表
	orderSkuExport:'replacesend/order_sku_export',		//订单列表导出
	returnGoods:'replacesend/return_goods',				//退货列表
	dfOrderTotal:'replacesend/df_order_total',			//代发系统看板-头部汇总统计
	dfShopKsbmGys:'replacesend/df_shop_ksbm_gys',		//店铺、商品、供应商代发排行
	dfShopKsbmGysExport:'replacesend/df_shop_ksbm_gys_export',	//店铺、商品、供应商代发排行导出
	dfAverageDelivery:'replacesend/df_average_delivery',	//代发看板发货平均时效统计
	dfAverageDeliveryExport:'replacesend/df_average_delivery_export',	//代发看板发货平均时效统计导出
	dfOverTime:'replacesend/df_over_time',					//代发系统看板超时未发统计
	dfOverTimeExport:'replacesend/df_over_time_export',		//代发系统看板超时未发统计导出
}						
export default{
	//订单列表
	orderList(params){
		return http.get(path.orderList, params)
	},
	//订单列表导出
	orderSkuExport(params){
		return http.get(path.orderSkuExport, params)
	},
	//退货列表
	returnGoods(params){
		return http.get(path.returnGoods, params)
	},
	//代发系统看板-头部汇总统计
	dfOrderTotal(params){
		return http.get(path.dfOrderTotal, params)
	},
	//店铺、商品、供应商代发排行
	dfShopKsbmGys(params){
		return http.get(path.dfShopKsbmGys, params)
	},
	//店铺、商品、供应商代发排行导出
	dfShopKsbmGysExport(params){
		return http.post(path.dfShopKsbmGysExport, params)
	},
	//代发看板发货平均时效统计
	dfAverageDelivery(params){
		return http.get(path.dfAverageDelivery, params)
	},
	//代发看板发货平均时效统计导出
	dfAverageDeliveryExport(params){
		return http.post(path.dfAverageDeliveryExport, params)
	},
	//代发系统看板超时未发统计
	dfOverTime(params){
		return http.get(path.dfOverTime, params)
	},
	//代发系统看板超时未发统计导出
	dfOverTimeExport(params){
		return http.post(path.dfOverTimeExport, params)
	},
	
}









