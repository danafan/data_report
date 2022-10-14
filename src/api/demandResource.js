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
	turnHead:'supply_chain/turn_head',			//转接提交
	delayDeal:'supply_chain/delay_deal',		//延期解决
	confirmStatus:'supply_chain/confirm_status',//确认状态
	turnReply:'supply_chain/turn_reply',		//负责人回复
	onDeptIndex:'supplier/on_dept_index',		//事业部上架统计
	onStoreIndex:'supplier/on_store_index',		//店铺上架统计
	newIndex:'supplier/on_index',				//公用款上新情况
	grabGoods:'supply_chain/grab_goods',		//抢货报表
	grabGoodsExport:'supply_chain/grab_goods_export',	//抢货报表导出
	grabGoodsSku:'supply_chain/grab_goods_sku',	//抢货报表下钻
	supplierShortageRanking:'supply_chain/supplier_shortage_ranking',	//供应商缺货排行
	supplierShortageRankingExport:'supply_chain/supplier_shortage_ranking_export',	//供应商缺货排行导出
	deforeLbList:'supplier/top_200_list',			//款式Top200列表
	deforeLbExport:'supplier/top_200_list_export',	//款式Top200列表导出
	deforeWsList:'supplier/top_50_list',			//3店铺Top50列表
	deforeWsExport:'supplier/top_50_list_export',	//3店铺Top50列表导出
	
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
	//转接提交
	turnHead(params){
		return http.post(path.turnHead, params)
	},
	//延期解决
	delayDeal(params){
		return http.post(path.delayDeal, params)
	},
	//确认状态
	confirmStatus(params){
		return http.post(path.confirmStatus, params)
	},
	//负责人回复
	turnReply(params){
		return http.post(path.turnReply, params)
	},
	//事业部上架统计
	onDeptIndex(params){
		return http.get(path.onDeptIndex, params)
	},
	//店铺上架统计
	onStoreIndex(params){
		return http.get(path.onStoreIndex, params)
	},
	//公用款上新情况
	newIndex(params){
		return http.get(path.newIndex, params)
	},
	//抢货报表
	grabGoods(params){
		return http.get(path.grabGoods, params)
	},
	//抢货报表导出
	grabGoodsExport(params){
		return http.post(path.grabGoodsExport, params)
	},
	//抢货报表下钻
	grabGoodsSku(params){
		return http.get(path.grabGoodsSku, params)
	},
	//供应商缺货排行
	supplierShortageRanking(params){
		return http.get(path.supplierShortageRanking, params)
	},
	//供应商缺货排行导出
	supplierShortageRankingExport(params){
		return http.post(path.supplierShortageRankingExport, params)
	},
	//款式Top200列表
	deforeLbList(params){
		return http.get(path.deforeLbList, params)
	},
	//款式Top200列表导出
	deforeLbExport(params){
		return http.get(path.deforeLbExport, params)
	},
	//3店铺Top50列表
	deforeWsList(params){
		return http.get(path.deforeWsList, params)
	},
	//3店铺Top50列表导出
	deforeWsExport(params){
		return http.get(path.deforeWsExport, params)
	},
	
}









