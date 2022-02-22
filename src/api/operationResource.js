import http from './request.js'
let path = {	
	ksbmList:'newonshelf/ajsx_ks',					//获取款式编码
	newOnshelfList:'newonshelf/list',				//获取上新数据列表
	newOnshelfExport:'newonshelf/export',			//上新数据导出
	operateKsale:'operate/ks_sale',					//发货数据列表
	deliverExport:'operate/deliver_export',			//发货数据导出
}						
export default{
	//获取款式编码
	ksbmList(params){
		return http.get(path.ksbmList, params)
	},
	//获取上新数据列表
	newOnshelfList(params){
		return http.get(path.newOnshelfList, params)
	},
	//上新数据导出
	newOnshelfExport(params){
		return http.post(path.newOnshelfExport, params)
	},
	//发货数据列表
	operateKsale(params){
		return http.get(path.operateKsale, params)
	},
	//发货数据导出
	deliverExport(params){
		return http.post(path.deliverExport, params)
	},
}









