import http from './request.js'
let path = {	
	orderList:'replacesend/order_list',					//订单列表
	returnGoods:'replacesend/return_goods',				//退货列表
}						
export default{
	//订单列表
	orderList(params){
		return http.get(path.orderList, params)
	},
	//退货列表
	returnGoods(params){
		return http.get(path.returnGoods, params)
	},
	
}









