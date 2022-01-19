import http from './request.js'
let path = {	
	storeList:'shop_relation/list',				//店铺列表
	
}						
export default{
	//店铺列表
	storeList(params){
		return http.get(path.storeList, params)
	}
}









