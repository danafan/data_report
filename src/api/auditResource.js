import http from './request.js'
let path = {	
	ajaxKsbm:'audit/ajaxKsbm',										//款式编码列表
	ajaxSupplierKsbm:'audit/ajaxSupplierKsbm',						//供应商款号
	ajaxSupplier:'audit/ajaxSupplier',								//供应商列表
	totalAudit:'audit/total',										//总成本表
	editRemark:'audit/edit_remark',									//修改备注
	editBatch:'audit/edit_batch',									//修改批发价
	editSupplier:'audit/edit_supplier',								//修改供应商
	auditLogs:'audit/logs',											//修改记录列表
	logDetail:'audit/log_detail',									//修改记录详情
	auidtLog:'audit/auidt_log',										//审核表列表
	auidtItem:'audit/auidt',										//审核
	noZeroCost:'audit/no_zero_cost',								//调价表列表
	uploadImage:'audit/uploadimage',								//上传图片
	delImage:'audit/delimage',										//删除图片
	auditApply:'audit/apply',										//调价表申请调价
	zeroCost:'audit/zero_cost',										//首次议价表列表
	zeroApply:'audit/zeroapply',									//首次议价表申请调价
	ksbmDetail:'audit/ksbm_detail',									//款式详情
	auditSetting:'audit/setting',									//审计权限
	overTimeTable:'audit/overtime',									//超时表
	uploadExcel:'audit/uploadexcel',								//上传表格
	importGoods:'audit/import_goods',								//批量导入
	offShelf:'audit/off_shelf',										//下架
	onShelf:'audit/on_shelf',										//上架
	editOneSupplier:'audit/edit_one_supplier',						//修改单个款式的供应商接口
}						
export default{
	//款式编码列表
	ajaxKsbm(params){
		return http.get(path.ajaxKsbm, params)
	},
	//供应商款号列表
	ajaxSupplierKsbm(params){
		return http.get(path.ajaxSupplierKsbm, params)
	},
	//供应商列表
	ajaxSupplier(params){
		return http.get(path.ajaxSupplier, params)
	},
	//总成本表
	totalAudit(params){
		return http.get(path.totalAudit, params)
	},
	//修改备注
	editRemark(params){
		return http.post(path.editRemark, params)
	},
	//修改批发价
	editBatch(params){
		return http.post(path.editBatch, params)
	},
	//修改供应商
	editSupplier(params){
		return http.post(path.editSupplier, params)
	},
	//修改记录列表
	auditLogs(params){
		return http.get(path.auditLogs, params)
	},
	//修改记录详情
	logDetail(params){
		return http.get(path.logDetail, params)
	},
	//审核表列表
	auidtLog(params){
		return http.get(path.auidtLog, params)
	},
	//审核
	auidtItem(params){
		return http.post(path.auidtItem, params)
	},
	//调价表列表
	noZeroCost(params){
		return http.get(path.noZeroCost, params)
	},
	//上传图片
	uploadImage(params){
		return http.post(path.uploadImage, params)
	},
	//删除图片
	delImage(params){
		return http.post(path.delImage, params)
	},
	//调价表申请调价
	auditApply(params){
		return http.post(path.auditApply, params)
	},
	//首次议价表列表
	zeroCost(params){
		return http.get(path.zeroCost, params)
	},
	//首次议价表申请调价
	zeroApply(params){
		return http.post(path.zeroApply, params)
	},
	//款式详情
	ksbmDetail(params){
		return http.get(path.ksbmDetail, params)
	},
	//审计权限
	auditGetSetting(params){
		return http.get(path.auditSetting, params)
	},
	//提交审计权限
	auditPostSetting(params){
		return http.post(path.auditSetting, params)
	},
	//超时表
	overTimeTable(params){
		return http.get(path.overTimeTable, params)
	},
	//上传表格
	uploadExcel(params){
		return http.post(path.uploadExcel, params)
	},
	//批量导入
	importGoods(params){
		return http.post(path.importGoods, params)
	},
	//下架
	offShelf(params){
		return http.post(path.offShelf, params)
	},
	//上架
	onShelf(params){
		return http.post(path.onShelf, params)
	},
	//修改单个款式的供应商接口
	editOneSupplier(params){
		return http.post(path.editOneSupplier, params)
	},
}









