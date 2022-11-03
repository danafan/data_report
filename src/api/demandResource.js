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
	onIndexExport:'supplier/on_index_export',	//公共款上新情况导出
	grabGoods:'supply_chain/grab_goods',		//抢货报表
	grabGoodsExport:'supply_chain/grab_goods_export',	//抢货报表导出
	grabGoodsSku:'supply_chain/grab_goods_sku',	//抢货报表下钻
	supplierShortageRanking:'supply_chain/supplier_shortage_ranking',	//供应商缺货排行
	supplierShortageRankingExport:'supply_chain/supplier_shortage_ranking_export',	//供应商缺货排行导出
	deforeLbList:'supplier/top_200_list',			//款式Top200列表
	deforeLbExport:'supplier/top_200_list_export',	//款式Top200列表导出
	deforeWsList:'supplier/top_50_list',			//3店铺Top50列表
	deforeWsExport:'supplier/top_50_list_export',	//3店铺Top50列表导出
	shopNoDeliverList:'supply_chain/shop_no_deliver_list',	//店铺待发货列表
	shopNoDeliverExport:'supply_chain/shop_no_deliver_export',	//店铺待发货列表导出
	supplierSend:'supplier/send',					//店铺发货情况
	sendChart:'supplier/send_chart',				//店铺发货情况图表
	ckSend:'supplier/ck_send',						//仓库发货情况
	ckList:'supplier/ck',							//仓库列表
	companyDeptKsList:'supplier/company_dept_ks_list',	//公司,事业部上新
	xmbKsList:'supplier/dept_ks_list',					//项目部数据
	storeKsList:'supplier/shop_ks_list',				//店铺数据
	styleKsList:'supplier/shop_ks_detail',				//店铺款式上新
	supplierList:'supplier/gys_ks_list',				//供应商
	saSupplierList:'supplier/sa_ks_list',				//sa供应商
	statisticalSearch:'supplier/statistical_search',	//烫画片使用情况统计搜索条件
	statisticalList:'supplier/statistical_list',		//统计列表
	updateStock:'supplier/update_stock',				//填写安全库存
	garmentList:'supplier/garment_list',				//成衣列表
	statisticalListExport:'supplier/statistical_list_export',	//成衣列表导出
	deerShop:'common/deer_shop',						//无权限店铺列表（top50/top200专用）
	boardGysInfo:'supply_chain/board_gys_info',			//供应商看板-头部汇总信息
	getGysWeekmonthTotal:'supply_chain/get_gys_weekmonth_total',	//供应商看板 本月本周销量和环比
	getGysWeekMonthChart:'supply_chain/get_gys_weekmonth_table',	//供应商看板-本月本周销量图表
	getGysKsbmList:'supply_chain/get_gys_ksbm_list',				//供应商看板-款式编码列表
	
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
	//公用款上新情况导出
	onIndexExport(params){
		return http.get(path.onIndexExport, params)
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
	//店铺待发货列表
	shopNoDeliverList(params){
		return http.get(path.shopNoDeliverList, params)
	},
	//店铺待发货列表导出
	shopNoDeliverExport(params){
		return http.post(path.shopNoDeliverExport, params)
	},
	//店铺发货情况
	supplierSend(params){
		return http.get(path.supplierSend, params)
	},
	//店铺发货情况图表
	sendChart(params){
		return http.get(path.sendChart, params)
	},
	//仓库发货情况
	ckSend(params){
		return http.get(path.ckSend, params)
	},
	//仓库列表
	ckList(params){
		return http.get(path.ckList, params)
	},
	//公司,事业部上新
	companyDeptKsList(params){
		return http.get(path.companyDeptKsList, params)
	},
	//项目部数据
	xmbKsList(params){
		return http.get(path.xmbKsList, params)
	},
	//店铺数据
	storeKsList(params){
		return http.get(path.storeKsList, params)
	},
	//店铺款式上新
	styleKsList(params){
		return http.get(path.styleKsList, params)
	},
	//供应商
	supplierList(params){
		return http.get(path.supplierList, params)
	},
	//sa供应商
	saSupplierList(params){
		return http.get(path.saSupplierList, params)
	},
	//烫画片使用情况统计搜索条件
	statisticalSearch(params){
		return http.get(path.statisticalSearch, params)
	},
	//统计列表
	statisticalList(params){
		return http.get(path.statisticalList, params)
	},
	//填写安全库存
	updateStock(params){
		return http.post(path.updateStock, params)
	},
	//成衣列表
	garmentList(params){
		return http.get(path.garmentList, params)
	},
	//成衣列表导出
	statisticalListExport(params){
		return http.get(path.statisticalListExport, params)
	},
	//无权限店铺列表
	deerShop(params){
		return http.get(path.deerShop, params)
	},
	//供应商看板-头部汇总信息
	boardGysInfo(params){
		return http.get(path.boardGysInfo, params)
	},
	//供应商看板 本月本周销量和环比
	getGysWeekmonthTotal(params){
		return http.get(path.getGysWeekmonthTotal, params)
	},
	//供应商看板-本月本周销量图表
	getGysWeekMonthChart(params){
		return http.get(path.getGysWeekMonthChart, params)
	},
	//供应商看板-款式编码列表
	getGysKsbmList(params){
		return http.get(path.getGysKsbmList, params)
	},
	
}









