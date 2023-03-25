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
	dfShopGysList:'replacesend/df_shop_gys_list',			//代发系统店铺/供应商明细表接口
	dfShopGysExport:'replacesend/df_shop_gys_export',		//代发系统店铺/供应商明细表导出
	todayChart:'replacesend/df_chart_today',				//今天代发订单图表
	monthChart:'replacesend/df_chart_month',				//30天代发订单图表
	ksbmFeedbackList:'replacesend/ksbm_feedback_list',		//反馈列表
	getFeedbackInfo:'replacesend/get_ksbm_feedback_info',	//获取反馈详情
	handleKsbmFeedback:'replacesend/handle_ksbm_feedback',	//提交处理
	ksbmFeedbackExport:'replacesend/ksbm_feedback_export',	//反馈列表导出
	addKsbmFeedback:'replacesend/add_ksbm_feedback',		//提交反馈
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
	//代发系统店铺/供应商明细表接口
	dfShopGysList(params){
		return http.get(path.dfShopGysList, params)
	},
	//代发系统店铺/供应商明细表导出
	dfShopGysExport(params){
		return http.post(path.dfShopGysExport, params)
	},
	//今天代发订单图表
	todayChart(params){
		return http.get(path.todayChart, params)
	},
	//30天代发订单图表
	monthChart(params){
		return http.get(path.monthChart, params)
	},
	//代发反馈列表
	ksbmFeedbackList(params){
		return http.get(path.ksbmFeedbackList, params)
	},
	//获取反馈详情
	getFeedbackInfo(params){
		return http.get(path.getFeedbackInfo, params)
	},
	//处理反馈
	handleKsbmFeedback(params){
		return http.post(path.handleKsbmFeedback, params)
	},
	//反馈列表导出
	ksbmFeedbackExport(params){
		return http.post(path.ksbmFeedbackExport, params)
	},
	//创建反馈
	addKsbmFeedback(params){
		return http.post(path.addKsbmFeedback, params)
	},
}









