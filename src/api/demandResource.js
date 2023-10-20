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
	stockEdit:'stock/edit',							//编辑今日反馈
	editLog:'stock/edit_log',						//查看历史反馈
	deforeWsList:'supplier/top_50_list',			//3店铺Top50列表
	deforeWsExport:'supplier/top_50_list_export',	//3店铺Top50列表导出
	shopNoDeliverList:'supply_chain/shop_no_deliver_list',	//店铺待发货列表
	shopNoDeliverExport:'supply_chain/shop_no_deliver_export',	//店铺待发货列表导出
	supplierSend:'supplier/send',					//店铺发货情况
	sendChart:'supplier/send_chart',				//店铺发货情况图表
	ckSend:'supplier/ck_send',						//仓库发货情况
	ckList:'supplier/ck',							//仓库列表
	companyDeptKsList:'supplier/company_dept_ks_list',	//公司,事业部上新
	companyDeptKsExport:'supplier/company_dept_ks_list_export',	//公司,事业部导出
	xmbKsList:'supplier/dept_ks_list',					//项目部数据
	storeKsList:'supplier/shop_ks_list',				//店铺数据
	styleKsList:'supplier/shop_ks_detail',				//店铺款式上新
	shopKsDetailExport:'supplier/shop_ks_detail_export',	//店铺款式上新导出
	supplierList:'supplier/gys_ks_list',				//供应商
	saSupplierList:'supplier/sa_ks_list',				//sa供应商
	statisticalSearch:'supplier/statistical_search',	//烫画片使用情况统计搜索条件
	statisticalList:'supplier/statistical_list',		//统计列表
	updateStock:'supplier/update_stock',				//填写安全库存
	garmentList:'supplier/garment_list',				//成衣列表
	statisticalListExport:'supplier/statistical_list_export',	//成衣列表导出
	deerShop:'common/deer_shop',						//无权限店铺列表（top50/top200专用）
	ajaxCoreGys:'Common/ajaxBoardAllGys',					//供应商列表
	boardGysInfo:'supply_chain/board_gys_info',			//供应商看板-头部汇总信息
	getGysWeekMonthTotal:'supply_chain/get_gys_weekmonth_total',	//供应商看板 本月本周销量和环比
	getGysWeekMonthChart:'supply_chain/get_gys_weekmonth_table',	//供应商看板-本月本周销量图表
	getGysKsbmList:'supply_chain/get_gys_ksbm_list',				//供应商看板-款式编码列表
	getGysKsbmExport:'supply_chain/get_gys_ksbm_export',			//款式编码列表导出
	getGysSkuList:'supply_chain/get_gys_sku_list',					//下钻列表
	getKsbmFhqk:'supply_chain/get_ksbm_fhqk',						//二部内部款列表
	getKsbmFhqkExport:'supply_chain/get_ksbm_fhqk_export',			//二部内部款列表导出
	getEbzhkTwo:'supply_chain/get_ebzhk_two',						//二部下面的表格
	getEbzhkTwoExport:'supply_chain/get_ebzhk_two_export',			//二部下面的表格导出
	sendFhlChart:'supplier/send_fhl_chart',							//仓库发货图表-7天发货率和订单数
	ksbmSend:'supplier/send_ksbm',									//款式编码维度
	sendKsbmExport:'supplier/send_ksbm_export',						//款式编码维度（导出）
	sendDpKsbm:'supplier/send_dp_ksbm',								//店铺款式编码维度列表
	sendDpKsbmExport:'supplier/send_dp_ksbm_export',				//店铺款式编码维度列表(导出)
	sendSupplier:'supplier/send_supplier',							//供应商维度列表接口
	sendSupplierExport:'supplier/send_supplier_export',				//供应商维度列表(导出)
	ajaxGysArea:'supplier/ajax_gys_area',							//ajax获取供应商对应地区列表
	kssxLineChart:'supplier/kssx_line_chart',						//供应商市场维度-折线图
	kssxCrossplot:'supplier/kssx_crossplot',						//供应商市场维度-交叉图
	kssxList:'supplier/kssx_list',									//供应商市场维度-明细
	kssxExport:'supplier/kssx_export',								//供应商市场维度-明细导出
	ajaxSetting:'jst_ksbm_sku/ajax_setting',						//款式编码获取参数配置
	ksbmList:'jst_ksbm_sku/ksbm_list',								//款式编码款式列表
	exportKsbm:'jst_ksbm_sku/export_ksbm',							//款式编码导出
	importKsbm:'jst_ksbm_sku/import_ksbm',							//款式编码导入
	delKsbm:'jst_ksbm_sku/del_ksbm',								//删除款式
	editKsbm:'jst_ksbm_sku/edit_ksbm',								//查看/编辑款式编码
	addKsbm:'jst_ksbm_sku/add_ksbm',								//添加款式编码
	skuList:'jst_ksbm_sku/sku_list',								//sku列表
	ajaxJstSupplier:'Common/ajaxJstSupplier',						//聚水潭供应商
	addSpec:'jst_ksbm_sku/add_spec',								//增加sku资料
	settingList:'jst_ksbm_sku/setting_list',						//资料配置列表
	addSetting:'jst_ksbm_sku/add_setting',							//添加资料配置项
	editSetting:'jst_ksbm_sku/edit_setting',						//编辑资料配置项
	delSetting:'jst_ksbm_sku/del_setting',							//删除资料配置项
	syncJst:'jst_ksbm_sku/sync_jst',								//同步聚水潭
	grabSkuExport:'supply_chain/grab_sku_export',					//导出缺货sku
	ajaxTopSpmc:'common/ajax_mc',									//款式top200获取品类列表
			
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
	//编辑今日反馈
	stockEdit(params){
		return http.post(path.stockEdit, params)
	},
	//查看历史反馈
	editLog(params){
		return http.get(path.editLog, params)
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
	//公司,事业部导出
	companyDeptKsExport(params){
		return http.get(path.companyDeptKsExport, params)
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
	//店铺款式上新导出
	shopKsDetailExport(params){
		return http.get(path.shopKsDetailExport, params)
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
	//供应商列表
	ajaxCoreGys(params){
		return http.get(path.ajaxCoreGys, params)
	},
	//供应商看板-头部汇总信息
	boardGysInfo(params){
		return http.get(path.boardGysInfo, params)
	},
	//供应商看板 本月本周销量和环比
	getGysWeekMonthTotal(params){
		return http.get(path.getGysWeekMonthTotal, params)
	},
	//供应商看板-本月本周销量图表
	getGysWeekMonthChart(params){
		return http.get(path.getGysWeekMonthChart, params)
	},
	//供应商看板-款式编码列表
	getGysKsbmList(params){
		return http.get(path.getGysKsbmList, params)
	},
	//款式编码列表导出
	getGysKsbmExport(params){
		return http.post(path.getGysKsbmExport, params)
	},
	//下钻列表
	getGysSkuList(params){
		return http.get(path.getGysSkuList, params)
	},
	//二部内部款
	getKsbmFhqk(params){
		return http.get(path.getKsbmFhqk, params)
	},
	//二部内部款导出
	getKsbmFhqkExport(params){
		return http.post(path.getKsbmFhqkExport, params)
	},
	//二部下面的表格
	getEbzhkTwo(params){
		return http.get(path.getEbzhkTwo, params)
	},
	//二部下面的表格导出
	getEbzhkTwoExport(params){
		return http.post(path.getEbzhkTwoExport, params)
	},
	//仓库发货图表-7天发货率和订单数
	sendFhlChart(params){
		return http.get(path.sendFhlChart, params)
	},
	//款式编码维度
	ksbmSend(params){
		return http.get(path.ksbmSend, params)
	},
	//款式编码维度导出
	sendKsbmExport(params){
		return http.post(path.sendKsbmExport, params)
	},
	//店铺款式编码维度列表
	sendDpKsbm(params){
		return http.get(path.sendDpKsbm, params)
	},
	//店铺款式编码维度列表（导出）
	sendDpKsbmExport(params){
		return http.post(path.sendDpKsbmExport, params)
	},
	//供应商维度列表接口
	sendSupplier(params){
		return http.get(path.sendSupplier, params)
	},
	//供应商维度列表
	sendSupplierExport(params){
		return http.post(path.sendSupplierExport, params)
	},
	//ajax获取供应商对应地区列表
	ajaxGysArea(params){
		return http.get(path.ajaxGysArea, params)
	},
	//供应商市场维度-折线图
	kssxLineChart(params){
		return http.get(path.kssxLineChart, params)
	},
	//供应商市场维度-交叉图
	kssxCrossplot(params){
		return http.get(path.kssxCrossplot, params)
	},
	//供应商市场维度-明细
	kssxList(params){
		return http.get(path.kssxList, params)
	},
	//供应商市场维度-明细导出
	kssxExport(params){
		return http.post(path.kssxExport, params)
	},
	//款式编码获取参数配置
	ajaxSetting(params){
		return http.get(path.ajaxSetting, params)
	},
	//款式编码款式列表
	ksbmList(params){
		return http.get(path.ksbmList, params)
	},
	//款式编码导出
	exportKsbm(params){
		return http.post(path.exportKsbm, params)
	},
	//款式编码导入
	importKsbm(params){
		return http.post(path.importKsbm, params)
	},
	//删除款式编码
	delKsbm(params){
		return http.post(path.delKsbm, params)
	},
	//查看款式编码
	editKsbmGet(params){
		return http.get(path.editKsbm, params)
	},
	//编辑款式编码
	editKsbmPost(params){
		return http.post(path.editKsbm, params)
	},
	//添加款式编码
	addKsbm(params){
		return http.post(path.addKsbm, params)
	},
	//sku列表
	skuList(params){
		return http.get(path.skuList, params)
	},
	//聚水潭供应商
	ajaxJstSupplier(params){
		return http.get(path.ajaxJstSupplier, params)
	},
	//增加sku资料
	addSpec(params){
		return http.post(path.addSpec, params)
	},
	//资料配置列表
	settingList(params){
		return http.get(path.settingList, params)
	},
	//添加资料配置项
	addSetting(params){
		return http.post(path.addSetting, params)
	},
	//编辑资料配置项
	editSetting(params){
		return http.post(path.editSetting, params)
	},
	//删除资料配置项
	delSetting(params){
		return http.post(path.delSetting, params)
	},
	//同步聚水潭
	syncJst(params){
		return http.post(path.syncJst, params)
	},
	//导出缺货sku
	grabSkuExport(params){
		return http.post(path.grabSkuExport, params)
	},
	//款式top200获取商品名称列表
	ajaxTopSpmc(params){
		return http.get(path.ajaxTopSpmc, params)
	},
}









