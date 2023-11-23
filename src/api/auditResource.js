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
	logsExport:'audit/logs_export',									//修改记录列表导出
	logDetail:'audit/audit_detail',									//审核表详情
	editLogDetail:'audit/edit_log_detail',							//修改记录表详情
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
	auditChart:'audit/chart',										//数据分析
	ytReportTotal:'audit/yt_report_total',							//审计SD分析-头部汇总数据接口
	ytReport:'audit/yt_report',										//审计SD分析-表格数据接口
	ytReportExport:'audit/yt_report_export',						//审计SD分析-表格导出接口
	zeroLogExport:'audit/zero_log_export',							//调价记录导出接口
	ajaxPlatform:'audit/ajaxPlatform',								//平台列表
	platformBalanceData:'audit/platform_balance_data',				//平台金额信息
	platformBalanceExport:'audit/platform_balance_export',			//店铺账户余额导出
	importYkb:'audit/import_ykb',									//易快报导入
	feedbackList:'audit/feedback_list',								//反馈表
	feedbackDetail:'audit/feedback_detail',
	feedbackExport:'audit/feedback_export',							//反馈表导出
	auditFeedback:'audit/audit_feedback',							//审核反馈
	addFeedback:'audit/add_feedback',								//申请反馈
	alipayAccounts:'audit/alipay_accounts',							//获取所有支付宝账号列表
	alipayBill:'audit/alipay_bill',									//支付宝账单
	alipayBillExport:'audit/alipay_bill_export',					//支付宝账单导出
	supplierIndex:'supplier/index',									//供应商列表
	supplierExport:'supplier/export',								//供应商列表导出
	supplierDel:'supplier/delete',									//删除供应商
	supplierEdit:'supplier/edit',									//编辑供应商
	supplierAdd:'supplier/add',										//添加供应商
	supplierImport:'supplier/import',								//导入供应商
	editFlagList:'supplier/edit_flag_list',							//修改内容列表
	editIndex:'supplier/edit_index',								//修改记录表 
	supplierCheck:'supplier/check',									//审核
	auditWait:'audit/wait',											//待调价表	
	waitExport:'audit/wait_export',									//待调价表导出
	waitApply:'audit/wait_apply',									//提交调价
	handOver:'audit/hand_over',										//提交转交	
	noNeed:'audit/no_need',											//无需调价
	jbKs:'audit/jb_ks',												//降本数据报表
	jbKsExport:'audit/jb_ks_export',								//降本数据报表导出
	jbDept:'audit/jb_dept',											//降本数据报表（部门）
	jbDeptExport:'audit/jb_dept_export',							//降本数据报表（部门）导出
	storeSdReport:'audit/store_sd_report',							//审计刷单情况
	storeSdReportExport:'audit/store_sd_report_export',				//审计刷单情况导出
	storeSdTotal:'audit/store_sd_total',							//店铺款式刷单情况-报表头部汇总
	storeSdSpbm:'audit/store_sd_spbm',								//店铺款式刷单情况-商品编码下钻
	ytTransmit:'audit/yt_transmit',									//提交转交
	ytHandleDetail:'audit/yt_handle_detail',						//SD处理反馈和SD表详情
	ytHandleList:'audit/yt_handle_list',							//SD处理反馈表
	ytHandle:'audit/yt_handle',										//提交处理
	ytSudit:'audit/yt_audit',										//提交审核
	pddMonthBill:'audit/pdd_month_bill',							//拼多多账单
	pddMonthBillExport:'audit/pdd_month_bill_export',				//拼多多账单导出
	pddBalance:'audit/pdd_balance',									//拼多多账单余额
	pddBalanceExport:'audit/pdd_balance_export',					//拼多多账单余额导出
	dyBill:'audit/dy_bill',											//抖音账单
	dyBillExport:'audit/dy_bill_export',							//抖音账单导出
	dyBalance:'audit/dy_balance',									//抖音账单余额
	dyBalanceExport:'audit/dy_balance_export',						//抖音账单余额导出
	jdBill:'audit/jd_bill',											//京东账单
	jdBillExport:'audit/jd_bill_export',							//京东账单导出
	ksxdBill:'audit/ksxd_bill',								//快手小店资金账单
	ksxdBillExport:'audit/ksxd_bill_export',				//快手小店资金账单导出
	ksxdBillSz:'audit/ksxd_bill_sz',						//快手小店收支明细
	ksxdBillSzExport:'audit/ksxd_bill_sz_export',			//快手小店收支明细导出
	ksxdBillDetail:'audit/ksxd_bill_detail',				//快手小店资金账单明细
	ksxdBillDetailExport:'audit/ksxd_bill_detail_export',	//快手小店资金账单明细导出
	xhsBill:'audit/xhs_bill',								//小红书账单
	xhsBillExport:'audit/xhs_bill_export',					//小红书账单导出
	ajaxJdBillShops:'audit/ajax_jd_bill_shops',				//ajax京东账单-店铺列表
	ytSendOrder:'audit/yt_send_order',						//sd报表批量导入内部订单号
	editSupplierKsbm:'audit/edit_supplier_ksbm',			//单独修改供应商款号
	batchApply:'audit/batch_apply',							//调价表-批量导入申请调价接口
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
	//修改记录列表导出
	logsExport(params){
		return http.post(path.logsExport, params)
	},
	//审核表详情
	logDetail(params){
		return http.get(path.logDetail, params)
	},
	//修改记录表详情
	editLogDetail(params){
		return http.get(path.editLogDetail, params)
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
	//数据分析
	auditChart(params){
		return http.get(path.auditChart, params)
	},
	//审计SD分析-头部汇总数据接口
	ytReportTotal(params){
		return http.get(path.ytReportTotal, params)
	},
	//审计SD分析-表格数据接口
	ytReport(params){
		return http.get(path.ytReport, params)
	},
	//审计SD分析-表格导出接口
	ytReportExport(params){
		return http.post(path.ytReportExport, params)
	},
	//调价记录导出接口
	zeroLogExport(params){
		return http.post(path.zeroLogExport, params)
	},
	//平台列表
	ajaxPlatform(params){
		return http.get(path.ajaxPlatform, params)
	},
	//平台金额信息
	platformBalanceData(params){
		return http.get(path.platformBalanceData, params)
	},
	//店铺账户余额导出
	platformBalanceExport(params){
		return http.post(path.platformBalanceExport, params)
	},
	//易快报导入
	importYkb(params){
		return http.post(path.importYkb, params)
	},
	//反馈表
	feedbackList(params){
		return http.get(path.feedbackList, params)
	},
	//反馈表详情
	feedbackDetail(params){
		return http.get(path.feedbackDetail, params)
	},
	//反馈表导出
	feedbackExport(params){
		return http.post(path.feedbackExport, params)
	},
	//审核反馈
	auditFeedback(params){
		return http.post(path.auditFeedback, params)
	},
	//申请反馈
	addFeedback(params){
		return http.post(path.addFeedback, params)
	},
	//获取所有支付宝账号列表
	alipayAccounts(params){
		return http.get(path.alipayAccounts, params)
	},
	//支付宝账单
	alipayBill(params){
		return http.get(path.alipayBill, params)
	},
	//支付宝账单导出
	alipayBillExport(params){
		return http.post(path.alipayBillExport, params)
	},
	//供应商列表
	supplierIndex(params){
		return http.get(path.supplierIndex, params)
	},
	//供应商列表导出
	supplierExport(params){
		return http.get(path.supplierExport, params)
	},
	//删除供应商
	supplierDel(params){
		return http.get(path.supplierDel, params)
	},
	//编辑供应商
	supplierEdit(params){
		return http.post(path.supplierEdit, params)
	},
	//添加供应商
	supplierAdd(params){
		return http.post(path.supplierAdd, params)
	},
	//导入供应商
	supplierImport(params){
		return http.post(path.supplierImport, params)
	},
	//修改内容列表
	editFlagList(params){
		return http.get(path.editFlagList, params)
	},
	//修改记录表
	editIndex(params){
		return http.get(path.editIndex, params)
	},
	//审核
	supplierCheck(params){
		return http.post(path.supplierCheck, params)
	},
	//待调价表
	auditWait(params){
		return http.get(path.auditWait, params)
	},
	//待调价表导出
	waitExport(params){
		return http.get(path.waitExport, params)
	},
	//提交调价
	waitApply(params){
		return http.post(path.waitApply, params)
	},
	//提交转交
	handOver(params){
		return http.post(path.handOver, params)
	},
	//无需调价
	noNeed(params){
		return http.post(path.noNeed, params)
	},
	//降本数据报表
	jbKs(params){
		return http.get(path.jbKs, params)
	},
	//降本数据报表导出
	jbKsExport(params){
		return http.post(path.jbKsExport, params)
	},
	//降本数据报表（部门）
	jbDept(params){
		return http.get(path.jbDept, params)
	},
	//降本数据报表（部门）导出
	jbDeptExport(params){
		return http.post(path.jbDeptExport, params)
	},
	//审计刷单情况
	storeSdReport(params){
		return http.get(path.storeSdReport, params)
	},
	//审计刷单情况导出
	storeSdReportExport(params){
		return http.post(path.storeSdReportExport, params)
	},
	//店铺款式刷单情况-报表头部汇总
	storeSdTotal(params){
		return http.get(path.storeSdTotal, params)
	},
	//店铺款式刷单情况-商品编码下钻
	storeSdSpbm(params){
		return http.get(path.storeSdSpbm, params)
	},
	//提交转交
	ytTransmit(params){
		return http.post(path.ytTransmit, params)
	},
	//SD处理反馈和SD表详情
	ytHandleDetail(params){
		return http.get(path.ytHandleDetail, params)
	},
	//SD处理反馈表
	ytHandleList(params){
		return http.get(path.ytHandleList, params)
	},
	//提交处理
	ytHandle(params){
		return http.post(path.ytHandle, params)
	},
	//提交审核
	ytSudit(params){
		return http.post(path.ytSudit, params)
	},
	//拼多多账单
	pddMonthBill(params){
		return http.get(path.pddMonthBill, params)
	},
	//拼多多账单导出
	pddMonthBillExport(params){
		return http.post(path.pddMonthBillExport, params)
	},
	//拼多多账单余额
	pddBalance(params){
		return http.get(path.pddBalance, params)
	},
	//拼多多账单余额导出
	pddBalanceExport(params){
		return http.post(path.pddBalanceExport, params)
	},
	//抖音账单
	dyBill(params){
		return http.get(path.dyBill, params)
	},
	//抖音账单导出
	dyBillExport(params){
		return http.post(path.dyBillExport, params)
	},
	//抖音账单余额
	dyBalance(params){
		return http.get(path.dyBalance, params)
	},
	//抖音账单余导出
	dyBalanceExport(params){
		return http.post(path.dyBalanceExport, params)
	},
	//京东账单
	jdBill(params){
		return http.get(path.jdBill, params)
	},
	//京东账单导出
	jdBillExport(params){
		return http.post(path.jdBillExport, params)
	},
	//快手小店资金账单
	ksxdBill(params){
		return http.get(path.ksxdBill, params)
	},
	//快手小店资金账单导出
	ksxdBillExport(params){
		return http.post(path.ksxdBillExport, params)
	},
	//快手小店收支明细
	ksxdBillSz(params){
		return http.get(path.ksxdBillSz, params)
	},
	//快手小店收支明细导出
	ksxdBillSzExport(params){
		return http.post(path.ksxdBillSzExport, params)
	},
	//快手小店资金账单明细
	ksxdBillDetail(params){
		return http.get(path.ksxdBillDetail, params)
	},
	//快手小店资金账单明细导出
	ksxdBillDetailExport(params){
		return http.post(path.ksxdBillDetailExport, params)
	},
	//小红书账单
	xhsBill(params){
		return http.get(path.xhsBill, params)
	},
	//小红书账单导出
	xhsBillExport(params){
		return http.post(path.xhsBillExport, params)
	},
	//ajax京东账单-店铺列表
	ajaxJdBillShops(params){
		return http.get(path.ajaxJdBillShops, params)
	},
	//sd报表批量导入内部订单号
	ytSendOrder(params){
		return http.post(path.ytSendOrder, params)
	},
	//单独修改供应商款号
	editSupplierKsbm(params){
		return http.post(path.editSupplierKsbm, params)
	},
	//调价表-批量导入申请调价接口
	batchApply(params){
		return http.post(path.batchApply, params)
	},
}









