import http from './request.js'
let path = {	
	getmainmenus:'admin/mymenulist',					//获取所有主菜单
	login:'admin/login',										//登录
	quit:'admin/quit',											//退出登录
	index:"index/index",												//账户概览和待处理事务
	orderList:'order/list',										//交易订单
	accountchange:'storebill/accountchange',					//资金流水
	getsignenterprise:'servicesubject/getsignenterprise',		//查看签约企业
	getcontract:'user/getcontract',								//查看用户已签约的协议
	receiptList:'order/receiptlist',							//电子回单
	hangList:'order/hanglist',									//挂起订单
	batchInfo:'order/batchinfo',								//获取批次信息（第二步）
	batchOrderList:'order/batchorderlist',						//批次订单列表（第二步下面）
	batchList:'order/batchlist',								//批量打款记录
	cancel:'order/cancel',										//取消打款
	cancelwithdraw:'storebill/cancelwithdraw',					//取消提现
	editOrder:'order/edit',										//修改信息
	editPayMoney:'order/editpaymoney',							//修改打款金额
	orderDetail:'order/detail',									//订单详情
	adjustList:'order/adjustlist',								//调单记录
	adjustDetail:'order/adjustdetail',							//调单记录详情
	adjustcheck:'order/adjustcheck',							//审核调单记录
	storeInfo:'store/getstoreinfo',								//商铺信息
	withdraw:'storebill/withdraw',								//提现
	rechargeRecord:'storebill/rechargerecord',					//充值记录
	transFerrecord:'storebill/transferrecord',					//转账付款、转账收款账户
	serviceChargeRecord:'storebill/servicechargerecord',		//服务费记录
	invoiceCategoryList:'invoicecategory/index',				//发票类目列表
	startStop:'invoicecategory/catestartstop',					//操作发票起停用
	editInvoiceCategory:'invoicecategory/editcategory',			//编辑发票类目
	createInvoice:'invoicecategory/addcategory',				//新增发票类目
	applyList:'invoice/applylist',								//发票记录列表
	applyDetail:'invoice/detail',								//发票详情
	invoiceList:'invoice/invoicelist',							//已开发票列表
	invoiceInput:'invoice/inputcode',							//发票单号录入
	userList:'user/userlist',									//签约用户列表
	getInfo:'user/getuserinfo',									//获取签约用户信息
	receiveRecord:'user/receiverecord',							//用户收款记录
	relievesign:'user/relievesign',								//解约
	storeList:'store/storelist',								//商户列表
	storestartstop:'store/storestartstop',
	storeGetinvoice:'store/getstoreinvoice',					//获取开票信息详情
	getsub:'store/getstoresubscription',						//获取签约信息
	getremind:'store/getstoreremind',							//获取提醒设置详情
	addeditremind:'store/addeditstoreremind',					//编辑添加提醒设置
	addeditsub:'store/addeditstoresubscription',				//编辑添加签约信息
	addEditInvoice:'store/addeitstoreinvoice',					//开票信息
	editStoreInfo:'store/editstoreinfo',						//商户信息	
	addstoreinfo:'store/addstoreinfo',							//创建商户
	getarea:'store/getarea',									//获取地址
	uploadImage:'admin/uploadimage',							//上传图片	
	delImage:'admin/delimage',										//删除图片
	storestatistics:'storestatistics/index',						//商户数据
	getUnrelationStore:'storerelation/getunrelationstore',			//可用的商户列表
	relationlist:'storerelation/relationlist',						//关联关系列表
	addrelation:'storerelation/addrelation',						//创建商户关联关系
	editrelation:'storerelation/editrelation',						//编辑商户关联关系
	delrelation:'storerelation/delrelation',						//删除商户关联关系
	persionaltax:'persionaltax/index',								//个税扣缴明细
	uploadtax:'persionaltax/uploadtax',								//上传个税扣缴明细
	ajaxstorelist:'persionaltax/ajaxstorelist',						//获取商户列表
	letterslist:'message/letterslist',								//函件通知列表
	getletters:'message/getletters',								//函件详情
	createlLetters:'message/createletters',							//创建函件
	noticeList:'message/noticelist',								//公告列表
	getNotice:'message/getnotice',									//公告详情
	createNotice:'message/createnotice',							//创建公告
	getConfig:'config/getconfig',									//系统基础配置
	ervicesubject:'servicesubject/list',							//综合服务主体列表
	servicesubject:'servicesubject/getdetail',						//获取综合服务主体详情
	createServicesubject:'servicesubject/create',					//创建综合服务主体第一步
	createnuonuouser:'servicesubject/createnuonuouser',				//创建综合服务主体第二步
	uploadcontract:'servicesubject/uploadcontract',					//创建综合服务主体第三步
	servicesubjectEdit:'servicesubject/edit',						//编辑综合服务主体
	editServicerate:'config/editservicerate',						//编辑服务费计费模式
	editmoneylimit:'config/editmoneylimit',							//编辑限额信息
	adminIndex:'admin/index',										//管理员列表
	getaccesslist:'access/getaccesslist',							//获取权限列表（添加或修改角色）
	adminAdd:'admin/add',											//创建普通管理员接口
	adminEdit:'admin/edit',											//编辑普通管理员
	adminStartStop:'admin/startstop',								//管理员设置
	getMainMenus:'access/getmainmenus',								//获取所有主菜单
	getControllers:'access/getcontrollers',							//获取所有控制器
	getMethods:'access/getmethods',									//获取某控制器中所有方法
	accessList:'access/accesslist',									//获取权限列表（单独页面展示使用）
	getaccessinfo:'access/getinfo',									//权限信息获取
	delaccess:'access/del',											//权限删除
	addaccess:'access/add',											//权限添加
	editaccess:'access/edit',										//权限修改
	systemBankIndex:'systembank/index',								//银行卡设置首页
	editMasterBank:'systembank/editmasterbank',						//编辑提现总卡
	delBank:'systembank/delbank',									//删除打款卡
	editPaybank:'systembank/editpaybank',							//编辑打款卡


}				
export default{
	//获取所有主菜单
	getmainmenus(params){
		return http.get(path.getmainmenus, params)
	},
	//登录
	login(params){
		return http.post(path.login, params)
	},
	//验证登录
	checkLogin(params){
		return http.get(path.login, params)
	},
	//退出登录
	quit(params){
		return http.get(path.quit, params)
	},
	//账户概览和待处理事务
	index(params){
		return http.get(path.index, params)
	},
	//交易订单
	orderList(params){
		return http.get(path.orderList, params)
	},
	//资金流水
	accountchange(params){
		return http.get(path.accountchange, params)
	},
	//查看签约企业
	getsignenterprise(params){
		return http.get(path.getsignenterprise, params)
	},
	//查看用户已签约的协议
	getcontract(params){
		return http.get(path.getcontract, params)
	},
	//电子回单
	receiptList(params){
		return http.get(path.receiptList, params)
	},
	//挂起订单
	hangList(params){
		return http.get(path.hangList, params)
	},
	//获取批次信息（第二步）
	batchInfo(params){
		return http.get(path.batchInfo, params)
	},
	//批次订单列表
	batchOrderList(params){
		return http.get(path.batchOrderList, params)
	},
	//批量打款记录
	batchList(params){
		return http.get(path.batchList, params)
	},
	//取消打款
	cancel(params){
		return http.post(path.cancel, params)
	},
	//取消提现
	cancelwithdraw(params){
		return http.post(path.cancelwithdraw, params)
	},
	//修改信息
	editOrder(params){
		return http.post(path.editOrder, params)
	},
	//修改打款金额
	editPayMoney(params){
		return http.post(path.editPayMoney, params)
	},
	//订单详情
	orderDetail(params){
		return http.get(path.orderDetail, params)
	},
	//调单记录
	adjustList(params){
		return http.get(path.adjustList, params)
	},
	//调单记录详情
	adjustDetail(params){
		return http.get(path.adjustDetail, params)
	},
	//审核调单记录
	adjustcheck(params){
		return http.post(path.adjustcheck, params)
	},
	//商铺详情
	storeInfo(params){
		return http.get(path.storeInfo, params)
	},
	//提现
	withdraw(params){
		return http.post(path.withdraw, params)
	},
	//充值记录
	rechargeRecord(params){
		return http.get(path.rechargeRecord, params)
	},
	//转账付款、转账收款账户
	transFerrecord(params){
		return http.get(path.transFerrecord, params)
	},
	//服务费记录
	serviceChargeRecord(params){
		return http.get(path.serviceChargeRecord, params)
	},
	// 发票类目列表
	invoiceCategoryList(params){
		return http.get(path.invoiceCategoryList, params)
	},
	// 操作发票启停用
	startStop(params){
		return http.post(path.startStop, params)
	},
	//编辑发票信息
	editInvoiceCategory(params){
		return http.post(path.editInvoiceCategory, params)
	},
	//新增发票类目
	createInvoice(params){
		return http.post(path.createInvoice, params)
	},
	//发票申请记录
	applyList(params){
		return http.get(path.applyList, params)
	},
	//获取发票详情
	applyDetail(params){
		return http.get(path.applyDetail, params)
	},
	//已开发票列表
	invoiceList(params){
		return http.get(path.invoiceList, params)
	},
	//发票单号录入
	invoiceInput(params){
		return http.post(path.invoiceInput, params)
	},
	//签约用户列表
	userList(params){
		return http.get(path.userList, params)
	},
	//获取签约用户信息
	getInfo(params){
		return http.get(path.getInfo, params)
	},
	//用户收款记录
	receiveRecord(params){
		return http.get(path.receiveRecord, params)
	},
	//解约
	relievesign(params){
		return http.post(path.relievesign, params)
	},
	//商户列表
	storeList(params){
		return http.get(path.storeList, params)
	},
	//启用停用商户
	storestartstop(params){
		return http.post(path.storestartstop, params)
	},
	//获取开票信息详情
	storeGetinvoice(params){
		return http.get(path.storeGetinvoice, params)
	},
	//获取签约信息
	getsub(params){
		return http.get(path.getsub, params)
	},
	//获取提醒设置详情
	getremind(params){
		return http.get(path.getremind, params)
	},
	//编辑新增提醒设置(get)
	addEditRemindGet(params){
		return http.get(path.addeditremind, params)
	},
	//编辑新增提醒设置(post)
	addEditRemindPost(params){
		return http.post(path.addeditremind, params)
	},
	//编辑新增签约信息(get)
	addEditSubGet(params){
		return http.get(path.addeditsub, params)
	},
	//编辑新增签约信息(post)
	addEditSubPost(params){
		return http.post(path.addeditsub, params)
	},
	//编辑新增开票信息（get）
	addEditInvoiceGet(params){
		return http.get(path.addEditInvoice, params)
	},
	//编辑新增开票信息（post）
	addEditInvoicePost(params){
		return http.post(path.addEditInvoice, params)
	},
	//商户信息(get)
	editStoreInfoGet(params){
		return http.get(path.editStoreInfo, params)
	},
	//商户信息(post)
	editStoreInfoPost(params){
		return http.post(path.editStoreInfo, params)
	},
	//创建商户
	addstoreinfo(params){
		return http.post(path.addstoreinfo, params)
	},
	//获取地址
	getarea(params){
		return http.get(path.getarea, params)
	},
	//上传图片
	uploadImage(params){
		return http.post(path.uploadImage, params)
	},
	//删除图片
	delImage(params){
		return http.post(path.delImage, params)
	},
	//商户数据
	storestatistics(params){
		return http.get(path.storestatistics, params)
	},
	//获取可用的商户列表或者编辑关联商户
	getUnrelationStore(params){
		return http.get(path.getUnrelationStore, params)
	},
	//关联关系列表
	relationlist(params){
		return http.get(path.relationlist, params)
	},
	//创建商户关联关系
	addrelation(params){
		return http.post(path.addrelation, params)
	},
	//编辑商户关联关系
	editrelation(params){
		return http.post(path.editrelation, params)
	},
	//删除商户关联关系
	delrelation(params){
		return http.post(path.delrelation, params)
	},
	//个税扣缴明细
	persionaltax(params){
		return http.get(path.persionaltax, params)
	},
	//上传个税扣缴明细
	uploadtax(params){
		return http.post(path.uploadtax, params)
	},
	//获取商户列表
	ajaxstorelist(params){
		return http.get(path.ajaxstorelist, params)
	},
	//函件通知列表
	letterslist(params){
		return http.get(path.letterslist, params)
	},
	//函件详情
	getletters(params){
		return http.get(path.getletters, params)
	},
	//创建函件
	createlLetters(params){
		return http.post(path.createlLetters, params)
	},
	//公告列表
	noticeList(params){
		return http.get(path.noticeList, params)
	},
	//公告详情
	getNotice(params){
		return http.get(path.getNotice, params)
	},
	//创建公告
	createNotice(params){
		return http.post(path.createNotice, params)
	},
	//系统基础配置
	getConfig(params){
		return http.get(path.getConfig, params)
	},
	//综合服务主体列表
	ervicesubject(params){
		return http.get(path.ervicesubject, params)
	},
	//综合服务主体详情
	servicesubject(params){
		return http.get(path.servicesubject, params)
	},
	//创建综合服务主体第一步
	createServicesubject(params){
		return http.post(path.createServicesubject, params)
	},
	//创建综合服务主体第二步
	createnuonuouser(params){
		return http.post(path.createnuonuouser, params)
	},
	//创建综合服务主体第三步
	uploadcontract(params){
		return http.post(path.uploadcontract, params)
	},
	//编辑综合服务主体
	servicesubjectEdit(params){
		return http.post(path.servicesubjectEdit, params)
	},
	//编辑服务费计费模式
	editServicerate(params){
		return http.post(path.editServicerate, params)
	},
	//编辑限额信息
	editmoneylimit(params){
		return http.post(path.editmoneylimit, params)
	},
	//管理员列表
	adminIndex(params){
		return http.get(path.adminIndex, params)
	},
	//获取权限列表（添加或修改角色）
	getaccesslist(params){
		return http.get(path.getaccesslist, params)
	},
	//创建普通管理员接口
	adminAdd(params){
		return http.post(path.adminAdd, params)
	},
	//编辑普通管理员接口(post)
	adminEdit(params){
		return http.post(path.adminEdit, params)
	},
	//编辑普通管理员接口(get)
	adminEditGet(params){
		return http.get(path.adminEdit, params)
	},
	//管理员设置
	adminStartStop(params){
		return http.post(path.adminStartStop, params)
	},
	//获取所有主菜单
	getMainMenus(params){
		return http.get(path.getMainMenus, params)
	},
	//获取所有控制器
	getControllers(params){
		return http.get(path.getControllers, params)
	},
	//获取某控制器中所有方法
	getMethods(params){
		return http.get(path.getMethods, params)
	},
	//获取权限列表（单独页面展示使用）
	accessList(params){
		return http.get(path.accessList, params)
	},
	//权限信息获取
	getaccessinfo(params){
		return http.get(path.getaccessinfo, params)
	},
	//权限删除
	delaccess(params){
		return http.get(path.delaccess, params)
	},
	//权限添加
	addaccess(params){
		return http.post(path.addaccess, params)
	},
	//权限修改
	editaccess(params){
		return http.post(path.editaccess, params)
	},
	//银行卡设置首页信息
	systemBankIndex(params){
		return http.get(path.systemBankIndex, params)
	},
	//编辑体现总卡
	editMasterBankGet(params){
		return http.get(path.editMasterBank, params)
	},
	//编辑体现总卡
	editMasterBankPost(params){
		return http.post(path.editMasterBank, params)
	},
	//删除打款卡
	delBank(params){
		return http.post(path.delBank, params)
	},
	//编辑打款卡
	editPaybankGet(params){
		return http.get(path.editPaybank, params)
	},
	//编辑打款卡
	editPaybankPost(params){
		return http.post(path.editPaybank, params)
	},
}









