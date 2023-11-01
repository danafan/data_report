import http from './request.js'
let path = {	
	offShelfList:'offshelf/kslist',					//下架款筛选列表
	offShelfExport:'offshelf/export',				//【下架款登记-去重】-导入接口
	uploadResult:'offshelf/upload_result',			//批量上传执行结果-导入
	offShelfDjList:'offshelf/list',					//下架款登记列表-去重
	exportUnique:'offshelf/export_unique',			//去重导出
	offshelfAll:'offshelf/all',						//下架款登记列表-明细
	offshelfAdd:'offshelf/add',						//标记
	exportDetailed:'offshelf/export_detailed',		//明细导出
	ysggList:'offshelf/ysgg',						//所有颜色规格列表
	offshelfDel:'offshelf/del',						//删除
	ajaxShops:'offshelf/ajax_shops',				//获取店铺列表
	dpksList:'offshelf/dpks_list',					//款式编码对应店铺款式编码列表
	ajaxZxr:'offshelf/ajaxZxr',						//获取执行人列表
	offshelfTj:'offshelf/tj',						//店铺下架统计表
	exportTj:'offshelf/export_tj',					//店铺下架统计表导出
	searchList:'offshelf/search_list',				//信息管控查询条件列表
	violationList:'offshelf/violation_list',		//信息管控列表
	violationUp:'offshelf/violation_up',			//违规截图上传
	violationDealUp:'offshelf/violation_deal_up',	//处理结果截图上传
	violationCheck:'offshelf/violation_check',		//审核
	violationAnalysis:'offshelf/violation_analysis',//违规统计
	violationExport:'offshelf/violation_export',	//信息管控列表导出
	violationShopName:'offshelf/violation_shop_name',	//店铺列表
	gsViolationSearch:'offshelf/gs_violation_search',	//获取工商违规-下拉筛选项接口
	gsViolationImport:'offshelf/gs_violation_import',	//工商违规-违规记录导入接口
	gsViolation:'offshelf/gs_violation',				//工商违规记录列表
	addGsViolation:'offshelf/add_gs_violation',			//工商违规-创建违规记录接口
	editGsViolation:'offshelf/edit_gs_violation',		//工商违规-编辑违规记录
	delGsViolation:'offshelf/del_gs_violation',			//工商违规-删除违规记录
	gsViolationExport:'offshelf/gs_violation_export',	//工商违规记录导出
	exportViolation:'offshelf/violation_order_export',	//违规订单导出
	delOffKsbm:'offshelf/del_off_ksbm',					//删除下架款

	
}						
export default{
	//下架款筛选列表
	offShelfList(params){
		return http.get(path.offShelfList, params)
	},
	//【下架款登记-去重】-导入接口
	offShelfExport(params){
		return http.post(path.offShelfExport, params)
	},
	// 批量上传执行结果-导入
	uploadResult(params){
		return http.post(path.uploadResult, params)
	},
	//下架款登记列表（去重）
	offShelfDjList(params){
		return http.get(path.offShelfDjList, params)
	},
	//去重导出
	exportUnique(params){
		return http.post(path.exportUnique, params)
	},
	//下架款登记列表（明细）
	offshelfAll(params){
		return http.get(path.offshelfAll, params)
	},
	//明细导出
	exportDetailed(params){
		return http.post(path.exportDetailed, params)
	},
	//所有颜色规格列表
	ysggList(params){
		return http.get(path.ysggList, params)
	},
	//标记
	offshelfAdd(params){
		return http.post(path.offshelfAdd, params)
	},
	//下架款登记列表（明细删除）
	offshelfDel(params){
		return http.post(path.offshelfDel, params)
	},
	//获取店铺列表
	ajaxShops(params){
		return http.get(path.ajaxShops, params)
	},
	//款式编码对应店铺款式编码列表
	dpksList(params){
		return http.get(path.dpksList, params)
	},
	//获取执行人列表
	ajaxZxr(params){
		return http.get(path.ajaxZxr, params)
	},
	//店铺下架统计表
	offshelfTj(params){
		return http.get(path.offshelfTj, params)
	},
	//店铺下架统计表导出
	exportTj(params){
		return http.post(path.exportTj, params)
	},
	//信息管控查询条件列表
	searchList(params){
		return http.get(path.searchList, params)
	},
	//信息管控列表
	violationList(params){
		return http.get(path.violationList, params)
	},
	//违规截图上传
	violationUp(params){
		return http.post(path.violationUp, params)
	},
	//处理结果截图上传
	violationDealUp(params){
		return http.post(path.violationDealUp, params)
	},
	//审核
	violationCheck(params){
		return http.post(path.violationCheck, params)
	},
	//违规统计
	violationAnalysis(params){
		return http.get(path.violationAnalysis, params)
	},
	//信息管控列表导出
	violationExport(params){
		return http.get(path.violationExport, params)
	},
	//店铺列表
	violationShopName(params){
		return http.get(path.violationShopName, params)
	},
	//工商违规-下拉筛选项接口
	gsViolationSearch(params){
		return http.get(path.gsViolationSearch, params)
	},
	//工商违规-违规记录导入接口
	gsViolationImport(params){
		return http.post(path.gsViolationImport, params)
	},
	//工商违规记录列表
	gsViolation(params){
		return http.get(path.gsViolation, params)
	},
	//工商违规-创建违规记录接口
	addGsViolation(params){
		return http.post(path.addGsViolation, params)
	},
	//工商违规-编辑违规记录
	editGsViolationGet(params){
		return http.get(path.editGsViolation, params)
	},
	//工商违规-编辑违规记录
	editGsViolationPost(params){
		return http.post(path.editGsViolation, params)
	},
	//工商违规-删除违规记录
	delGsViolation(params){
		return http.post(path.delGsViolation, params)
	},
	//工商违规记录导出
	gsViolationExport(params){
		return http.post(path.gsViolationExport, params)
	},
	//违规订单导出
	exportViolation(params){
		return http.post(path.exportViolation, params)
	},
	//删除下架款
	delOffKsbm(params){
		return http.post(path.delOffKsbm, params)
	},
}









