import http from './request.js'
let path = {	
	promoteKpiChart:'annual/promote_kpi_chart',			//推广绩效综合看板柱状图
	scatterChart:'annual/promote_kpi_bubble_chart',		//推广绩效综合看板和个人绩效看板气泡图
	promoteKpiDpList:'annual/promote_kpi_dp_list',		//推广绩效综合看板 汇总数据
	promoteKpiDpExport:'annual/promote_kpi_dp_export',	//推广绩效综合看板 汇总数据导出
	userPromoteTotal:'annual/user_promote_total',		//个人绩效看板-个人信息-柱状图-饼图
	userPromoteDpList:'annual/user_promote_dp_list',	//个人绩效看板汇总数据
	userPromoteDpExport:'annual/user_promote_dp_export',//个人绩效看板汇总数据导出
}							
export default{
	//推广绩效综合看板和个人绩效看板气泡图
	scatterChart(params){
		return http.get(path.scatterChart, params)
	},
	//推广绩效综合看板柱状图
	promoteKpiChart(params){
		return http.get(path.promoteKpiChart, params)
	},
	//推广绩效综合看板 汇总数据
	promoteKpiDpList(params){
		return http.get(path.promoteKpiDpList, params)
	},
	//推广绩效综合看板 汇总数据导出
	promoteKpiDpExport(params){
		return http.post(path.promoteKpiDpExport, params)
	},
	//个人绩效看板-个人信息-柱状图-饼图
	userPromoteTotal(params){
		return http.get(path.userPromoteTotal, params)
	},
	//个人绩效看板汇总数据
	userPromoteDpList(params){
		return http.get(path.userPromoteDpList, params)
	},
	//个人绩效看板汇总数据导出
	userPromoteDpExport(params){
		return http.post(path.userPromoteDpExport, params)
	},
}









