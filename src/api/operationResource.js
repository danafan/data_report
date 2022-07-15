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
	getGysOutStock:'operate/get_gys_outStock',		//供应商缺货排行
	gysOutstockExport:'operate/gys_outstock_export',//供应商缺货排行导出
	getKsSalenum:'operate/get_ks_salenum',			//款式销量排行
	ksSalenumExport:'operate/ks_salenum_export',	//款式销量排行导出
	getKsOutstock:'operate/get_ks_outstock',		//款式缺货排行
	ksOutstockExport:'operate/ks_outstock_export',	//款式缺货排行导出
	selectType:'operate/select_type',				//查询条件列表
	operateIndex:'operate/index',					//商品品类列表
	operateEdit:'operate/edit',						//商品品类编辑
	operateExport:'operate/export',					//商品品类列表导出
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
	//供应商缺货排行
	getGysOutStock(params){
		return http.get(path.getGysOutStock, params)
	},
	//供应商缺货排行导出
	gysOutstockExport(params){
		return http.post(path.gysOutstockExport, params)
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
}









