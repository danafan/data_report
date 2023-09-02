import http from './request.js'
let path = {	
	ksbmList:'newonshelf/ajsx_ks',					//获取款式编码
	newOnshelfList:'newonshelf/list',				//获取上新数据列表
	newOnshelfExport:'newonshelf/export',			//上新数据导出
	operateFhSale:'operate/fh_sale',				//款式销量（发货）接口
	fhSaleExport:'operate/fh_sale_export',			//款式销量（发货）数据导出接口
	operateFkSale:'operate/fk_sale',				//款式销量（付款）接口
	fkSaleExport:'operate/fk_sale_export',			//款式销量（付款）数据导出接口
	saleAnalysisTable:'operate/sale_analysis_table',//数据分析/销售分析表格
	saleAnalysisChart:'operate/sale_analysis_chart',//数据分析/销售分析图表
	dataStatistics:'operate/data_statistics',		//数据分析/数据统计
	incomeAnalysisDelivery:'operate/income_analysis_delivery',	//收入分析
	getGysSalenum:'operate/get_gys_salenum',		//供应商销量排行
	gysSalenumExport:'operate/gys_salenum_export',	//供应商销量排行导出
	getKsSalenum:'operate/get_ks_salenum',			//款式销量排行
	ksSalenumExport:'operate/ks_salenum_export',	//款式销量排行导出
	getKsOutstock:'operate/get_ks_outstock',		//款式缺货排行
	ksOutstockExport:'operate/ks_outstock_export',	//款式缺货排行导出
	selectType:'operate/select_type',				//查询条件列表
	operateIndex:'operate/index',					//商品品类列表
	operateEdit:'operate/edit',						//商品品类编辑
	operateExport:'operate/export',					//商品品类列表导出
	monthlyDailyNumber:'operate/monthly_daily_number',	//月度日均单数
	jstOrderAnalyse:'operate/jstOrderAnalyse',			//订单分析-图表
	orderYesterday:'operate/order_yesterday',			//店铺昨日订单数
	mlAnalysisTop:'ml_analysis/top',				//毛利分析--头部汇总数据列表	
	mlStore:'ml_analysis/ml_store',					//毛利分析--店铺分组数据列表
	mlCpfl:'ml_analysis/ml_cpfl',					//毛利分析--品类分组数据列表
	mlStoreCpfl:'ml_analysis/ml_store_cpfl',		//毛利分析--店铺品类分组数据列表
	mlKs:'ml_analysis/ml_ks',						//毛利分析--款式分组数据列表
	mlGys:'ml_analysis/ml_gys',						//毛利分析--供应商分组数据列表
	mlColor:'ml_analysis/ml_color',					//毛利分析--颜色分组数据列表
	mlSize:'ml_analysis/ml_size',					//毛利分析--颜色分组数据列表
	mlExport:'ml_analysis/ml_export',
	deptPlatformGmvList:'supplier/dept_platform_gmv_list',	//部门、平台GMV详情
	cpflGmvList:'supplier/cpfl_gmv_list',			//品类GMV详情
	goodsDetails:'supplier/goods_details',			//店铺商品明细
	stockRate:'supply_chain/stock/rate',			//库存占比
	stockSelect:'supply_chain/stock/select',		//供应商库存分析检索列表
	stockDetail:'supply_chain/stock/detail',		//明细表
	exportDetail:'supply_chain/stock/export_detail',//明细表导出
	stockEdit:'supply_chain/stock/edit',			//编辑明细
	distriBution:'supply_chain/stock/distribution',	//库存分布情况图表
	thlChart:'supplier/lj_thl_chart',					//退货率图表
	accountAdd:'supplier/account_add',					//添加账号
	accountList:'supplier/account_list',				//查看账号列表
	accountDel:'supplier/account_del',					//删除账号
	usedRecord:'supplier/used_record',					//使用记录
	loginLog:'supplier/log_statistics',					//登录统计
	loginRecord:'supplier/log',							//登录明细
	getDefaultPassword:'supplier/get_default_password',	//获取账号默认密码
	returnBoardTable:'supplier/return_board_table',		//公司京东抖音退款表格
	exportReturnBoardTable:'supplier/export_return_board_table',	//公司京东抖音退款表格导出
	importData:'supply_chain/stock/import_data',		//库存分析导入
	pddDeptSales:'audit/pdd_dept_sales',				//拼多多项目部销售统计
	goodsDetailsExport:'supplier/goods_details_export',	//退款情况看板（店铺商品明细导出）
	dayDhlChart:'supplier_arraival/day_dhl_chart',		//到货率每日波动和采购数量仓库分布
	ksbmPurchaseList:'supplier_arraival/ksbm_purchase_list',	//档口到货统计-款式采购明细
	gysPurchaseList:'supplier_arraival/gys_purchase_list',		//档口到货统计-供应商采购明细
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
	//款式销量（发货）接口
	operateFhSale(params){
		return http.get(path.operateFhSale, params)
	},
	//款式销量（发货）数据导出接口
	fhSaleExport(params){
		return http.post(path.fhSaleExport, params)
	},
	//款式销量（付款）接口
	operateFkSale(params){
		return http.get(path.operateFkSale, params)
	},
	//款式销量（付款）数据导出接口
	fkSaleExport(params){
		return http.post(path.fkSaleExport, params)
	},
	//数据分析/销售分析表格
	saleAnalysisTable(params){
		return http.get(path.saleAnalysisTable, params)
	},
	//数据分析/销售分析图表
	saleAnalysisChart(params){
		return http.get(path.saleAnalysisChart, params)
	},
	//数据分析/数据统计
	dataStatistics(params){
		return http.get(path.dataStatistics, params)
	},
	//收入分析
	incomeAnalysisDelivery(params){
		return http.get(path.incomeAnalysisDelivery, params)
	},
	//供应商销量
	getGysSalenum(params){
		return http.get(path.getGysSalenum, params)
	},
	//供应商销量排行导出
	gysSalenumExport(params){
		return http.post(path.gysSalenumExport, params)
	},
	//款式销量排行
	getKsSalenum(params){
		return http.get(path.getKsSalenum, params)
	},
	//款式销量排行导出
	ksSalenumExport(params){
		return http.post(path.ksSalenumExport, params)
	},
	//款式缺货排行
	getKsOutstock(params){
		return http.get(path.getKsOutstock, params)
	},
	//款式缺货排行导出
	ksOutstockExport(params){
		return http.post(path.ksOutstockExport, params)
	},
	//查询条件列表
	selectType(params){
		return http.get(path.selectType, params)
	},
	//商品品类列表
	operateIndex(params){
		return http.get(path.operateIndex, params)
	},
	//商品品类编辑
	operateEdit(params){
		return http.post(path.operateEdit, params)
	},
	//商品品类列表导出
	operateExport(params){
		return http.get(path.operateExport, params)
	},
	//月度日均单数
	monthlyDailyNumber(params){
		return http.get(path.monthlyDailyNumber, params)
	},
	//订单分析-图表
	jstOrderAnalyse(params){
		return http.get(path.jstOrderAnalyse, params)
	},
	//店铺昨日订单数
	orderYesterday(params){
		return http.get(path.orderYesterday, params)
	},
	//毛利分析--头部汇总数据列表
	mlAnalysisTop(params){
		return http.get(path.mlAnalysisTop, params)
	},
	//毛利分析--店铺分组数据列表
	mlStore(params){
		return http.get(path.mlStore, params)
	},
	//毛利分析--品类分组数据列表
	mlCpfl(params){
		return http.get(path.mlCpfl, params)
	},
	//毛利分析--店铺品类分组数据列表
	mlStoreCpfl(params){
		return http.get(path.mlStoreCpfl, params)
	},
	//毛利分析--款式分组数据列表
	mlKs(params){
		return http.get(path.mlKs, params)
	},
	//毛利分析--供应商分组数据列表
	mlGys(params){
		return http.get(path.mlGys, params)
	},
	//毛利分析--颜色分组数据列表
	mlColor(params){
		return http.get(path.mlColor, params)
	},
	//毛利分析--颜色分组数据列表
	mlSize(params){
		return http.get(path.mlSize, params)
	},
	//毛利分析导出
	mlExport(params){
		return http.post(path.mlExport, params)
	},
	// 部门、平台GMV详情
	deptPlatformGmvList(params){
		return http.get(path.deptPlatformGmvList, params)
	},
	//品类GMV详情
	cpflGmvList(params){
		return http.get(path.cpflGmvList, params)
	},
	//店铺商品明细
	goodsDetails(params){
		return http.get(path.goodsDetails, params)
	},
	//库存占比
	stockRate(params){
		return http.get(path.stockRate, params)
	},
	//供应商库存分析检索列表
	stockSelect(params){
		return http.get(path.stockSelect, params)
	},
	//明细表
	stockDetail(params){
		return http.get(path.stockDetail, params)
	},
	//明细导出
	exportDetail(params){
		return http.get(path.exportDetail, params)
	},
	//编辑明细
	stockEdit(params){
		return http.post(path.stockEdit, params)
	},
	//库存分布情况图表
	distriBution(params){
		return http.get(path.distriBution, params)
	},
	//退货率图表
	thlChart(params){
		return http.get(path.thlChart, params)
	},
	//添加账号
	accountAdd(params){
		return http.post(path.accountAdd, params)
	},
	//查看账号列表
	accountList(params){
		return http.get(path.accountList, params)
	},
	//删除账号
	accountDel(params){
		return http.post(path.accountDel, params)
	},
	//使用记录
	usedRecord(params){
		return http.get(path.usedRecord, params)
	},
	//登录统计
	loginLog(params){
		return http.get(path.loginLog, params)
	},
	//登录明细
	loginRecord(params){
		return http.get(path.loginRecord, params)
	},
	//获取账号默认密码
	getDefaultPassword(params){
		return http.get(path.getDefaultPassword, params)
	},
	//公司京东抖音退款表格
	returnBoardTable(params){
		return http.get(path.returnBoardTable, params)
	},
	//公司京东抖音退款表格导出
	exportReturnBoardTable(params){
		return http.post(path.exportReturnBoardTable, params)
	},
	//库存分析导入
	importData(params){
		return http.post(path.importData, params)
	},
	//拼多多项目部销售统计
	pddDeptSales(params){
		return http.get(path.pddDeptSales, params)
	},
	//店铺商品明细导出
	goodsDetailsExport(params){
		return http.post(path.goodsDetailsExport, params)
	},
	//到货率每日波动和采购数量仓库分布
	dayDhlChart(params){
		return http.get(path.dayDhlChart, params)
	},
	//档口到货统计-款式采购明细
	ksbmPurchaseList(params){
		return http.get(path.ksbmPurchaseList, params)
	},
	//档口到货统计-供应商采购明细
	gysPurchaseList(params){
		return http.get(path.gysPurchaseList, params)
	},
}









