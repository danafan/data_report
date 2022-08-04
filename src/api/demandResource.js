import http from './request.js'
let path = {	
	demandList:'supply_chain/index',			//需求列表
	supplyChainAdd:'supply_chain/add',			//创建
	supplyChainInfo:'supply_chain/info',		//获取详情
	supplyChainEdit:'supply_chain/edit',		//编辑
	supplyChainCate:'supply_chain/cate',		//获取类目列表
	searchList:'supply_chain/search_list',		//查询条件列表
	supplyChainAudit:'supply_chain/audit',		//审核
	supplyChainExport:'supply_chain/export',	//导出
	
}						
export default{
	//需求列表
	demandList(params){
		return http.get(path.demandList, params)
	},
	//创建
	supplyChainAdd(params){
		return http.post(path.supplyChainAdd, params)
	},
	//获取详情
	supplyChainInfo(params){
		return http.get(path.supplyChainInfo, params)
	},
	//编辑
	supplyChainEdit(params){
		return http.post(path.supplyChainEdit, params)
	},
	//获取类目列表
	supplyChainCate(params){
		return http.get(path.supplyChainCate, params)
	},
	//查询条件列表
	searchList(params){
		return http.get(path.searchList, params)
	},
	//审核
	supplyChainAudit(params){
		return http.post(path.supplyChainAudit, params)
	},
	//导出
	supplyChainExport(params){
		return http.get(path.supplyChainExport, params)
	},
	
}








