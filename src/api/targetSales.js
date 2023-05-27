import http from './request.js'
let path = {	
	getDepts:'targesalemanage/get_depts',							//获取部门列表
	getShops:'targesalemanage/get_shops',							//获取店铺列表
	getReferenceShops:'targesalemanage/get_reference_shops',		//获取参考店铺列表
	getShopInfo:'targesalemanage/get_shop_info',					//获取店铺详情
	lastYearData:'targesalemanage/last_year_data',					//获取去年同期数据
	ajaxUser:'common/ajaxUser',										//获取店长列表
	addShopTarget:'targesalemanage/add_shop_target',				//创建店铺目标
	shopTargetList:'targesalemanage/shop_target_list',				//店长目标列表
	editShopTarget:'targesalemanage/edit_shop_target',				//编辑店铺目标
	cancelShopLog:'targesalemanage/cancel_shop_log',				//作废
	shopTargetInfo:'targesalemanage/shop_target_info',				//店长目标详情
	auditLog:'targesalemanage/audit_log',							//审批流程
	shopTargetCheck:'targesalemanage/shop_target_check',			//审核店铺
	mergeTarget:'targesalemanage/merge_target',						//合并提交
	projectTargetList:'targesalemanage/project_target_list',		//项目部目标
	projectTargetInfo:'targesalemanage/project_target_info',		//项目部目标详情
	projectTargetCheck:'targesalemanage/project_target_check',		//项目部目标审核
	businessTargetList:'targesalemanage/business_target_list',		//事业部目标列表
	businessTargetInfo:'targesalemanage/business_target_info',		//事业部目标详情
	businessTargetCheck:'targesalemanage/business_target_check',	//事业部目标审核
	targesalemanageShopExport:'targesalemanage/shop_export',		//店铺月目标导出
	targesalemanageDayExport:'targesalemanage/day_export',			//店铺日目标导出
	getLastMonthData:'targesalemanage/get_last_month_data',			//获取店铺上月实际数据
}						
export default{
	//获取部门列表
	getDepts(params){
		return http.get(path.getDepts, params)
	},
	//获取店铺列表
	getShops(params){
		return http.get(path.getShops, params)
	},
	//获取参考店铺列表
	getReferenceShops(params){
		return http.get(path.getReferenceShops, params)
	},
	//获取店铺详情
	getShopInfo(params){
		return http.get(path.getShopInfo, params)
	},
	//获取去年同期数据
	lastYearData(params){
		return http.get(path.lastYearData, params)
	},
	//获取店长列表
	ajaxUser(params){
		return http.get(path.ajaxUser, params)
	},
	//创建店铺目标
	addShopTarget(params){
		return http.post(path.addShopTarget, params)
	},
	//店长目标列表
	shopTargetList(params){
		return http.get(path.shopTargetList, params)
	},
	//编辑店铺目标(get)
	editShopTargetGet(params){
		return http.get(path.editShopTarget, params)
	},
	//编辑店铺目标(post)
	editShopTargetPost(params){
		return http.post(path.editShopTarget, params)
	},
	//作废
	cancelShopLog(params){
		return http.post(path.cancelShopLog, params)
	},
	//店长目标详情
	shopTargetInfo(params){
		return http.get(path.shopTargetInfo, params)
	},
	//审批流程
	auditLog(params){
		return http.get(path.auditLog, params)
	},
	//审核店铺
	shopTargetCheck(params){
		return http.post(path.shopTargetCheck, params)
	},
	//合并提交
	mergeTarget(params){
		return http.post(path.mergeTarget, params)
	},
	//项目部目标
	projectTargetList(params){
		return http.get(path.projectTargetList, params)
	},
	//项目部目标详情
	projectTargetInfo(params){
		return http.get(path.projectTargetInfo, params)
	},
	//项目部目标审核
	projectTargetCheck(params){
		return http.post(path.projectTargetCheck, params)
	},
	//事业部目标列表
	businessTargetList(params){
		return http.get(path.businessTargetList, params)
	},
	//事业部目标详情
	businessTargetInfo(params){
		return http.get(path.businessTargetInfo, params)
	},
	//事业部目标审核
	businessTargetCheck(params){
		return http.post(path.businessTargetCheck, params)
	},
	//店铺月目标导出
	targesalemanageShopExport(params){
		return http.post(path.targesalemanageShopExport, params)
	},
	//店铺日目标导出
	targesalemanageDayExport(params){
		return http.post(path.targesalemanageDayExport, params)
	},
	//获取店铺上月实际数据
	getLastMonthData(params){
		return http.get(path.getLastMonthData, params)
	},
}









