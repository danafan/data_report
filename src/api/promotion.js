import http from './request.js'
let path = {	
	promoteKpiChart:'annual/promote_kpi_chart',			//推广绩效综合看板柱状图
	scatterChart:'annual/promote_kpi_bubble_chart',		//推广绩效综合看板和个人绩效看板气泡图
	promoteKpiDpList:'annual/promote_kpi_dp_list',		//推广绩效综合看板 汇总数据
	userPromoteTotal:'annual/user_promote_total',		//个人绩效看板-个人信息-柱状图-饼图
	userPromoteDpList:'annual/user_promote_dp_list',	//个人绩效看板汇总数据
	dpPromoteGroupList:'annual/dp_promote_group_list',	//店铺、项目部、推广负责人、品类、供应商ROI表格
	dpPromoteGroupExport:'annual/dp_promote_group_export',	//店铺、项目部、推广负责人、品类、供应商ROI表格导出
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
	//个人绩效看板-个人信息-柱状图-饼图
	userPromoteTotal(params){
		return http.get(path.userPromoteTotal, params)
	},
	//个人绩效看板汇总数据
	userPromoteDpList(params){
		return http.get(path.userPromoteDpList, params)
	},
	//店铺、项目部、推广负责人、品类、供应商ROI表格
	dpPromoteGroupList(params){
		return http.get(path.dpPromoteGroupList, params)
	},
	//店铺、项目部、推广负责人、品类、供应商ROI表格导出
	dpPromoteGroupExport(params){
		return http.post(path.dpPromoteGroupExport, params)
	},
}









