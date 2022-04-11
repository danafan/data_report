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
}









