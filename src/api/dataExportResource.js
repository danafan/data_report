import http from './request.js'
let path = {	
	ajaxWms:'dataexport/ajaxwms',					//ajax仓库列表
	purinList:'dataexport/purinList',				//采购入库列表
	purinExport:'dataexport/purin_export',			//采购入库数据导出接口
	financeInventory:'dataexport/finance_inventory',//库存信息（财务列表）
	financeInventoryExport:'dataexport/finance_inventory_export',	//库存信息导出（财务列表）

	
}						
export default{
	//ajax仓库列表
	ajaxWms(params){
		return http.get(path.ajaxWms, params)
	},
	//采购入库列表
	purinList(params){
		return http.get(path.purinList, params)
	},
	//采购入库数据导出接口
	purinExport(params){
		return http.post(path.purinExport, params)
	},
	//库存信息（财务列表）
	financeInventory(params){
		return http.get(path.financeInventory, params)
	},
	//库存信息导出（财务列表）
	financeInventoryExport(params){
		return http.post(path.financeInventoryExport, params)
	},
	
}









