import http from './request.js'
let path = {	
	messageList:'message/list',										//获取消息列表
	messageRead:'message/read',										//读取消息
	unreadnum:'message/unreadnum',									//未读消息数
	login:'login',													//获取用户id
	quit:'quit',													//推出
	getMenu:'access/mymenu',										//获取所有菜单列表
	jsapi:'jsapi',													//获取用户权限
	ajaxViewDept:'Common/ajaxViewDept',								//部门列表
	ajaxViewStore:'Common/ajaxViewShop',							//店铺列表
	ajaxCpfl:'ajaxCpfl',											//商品品类列表
	performanceReport:'PerformanceReport/index',					//业绩分析
	dayAnalysis:'PerformanceReport/DayAnalysis',					//每日业绩
	fishList:'fish/list',											//鱼塘分析报表
	userList:'user/list',											//权限用户列表
	userInfo:'user/info',											//获取用户详情
	userSet:'user/set',												//用户设置
	menuRoleList:'menurole/list',									//获取权限列表
	addMenuRole:'menurole/add',										//新增访问权限
	editMenuRole:'menurole/edit',									//编辑访问权限
	menuRoleInfo:'menurole/info',									//角色详情
	menuRoleDel:'menurole/del',										//删除角色
	menuRoleUsers:'menurole/users',									//角色对应用户列表
	menuRoleSetting:'menurole/set',									//用户设置
	menuRoleUsrInfo:'menurole/useinfo',								//用户详情
	moveUser:'menurole/moveuser',									//删除角色下的用户
	dataRoleList:'datarole/list',									//数据权限列表
	addDataRole:'datarole/add',										//新增数据角色
	editDataRole:'datarole/edit',									//编辑数据角色
	delDataRole:'datarole/del',										//删除数据角色
	dataRoleInfo:'datarole/info',									//角色详情
	dataRoleUser:'datarole/users',									//数据角色对应用户列表
	setDataRole:'datarole/set',										//数据角色用户设置
	dataRoleUseInfo:'datarole/useinfo',								//数据权限用户详情
	dataRoleMoveUser:'datarole/moveuser',							//数据权限删除用户
	accessList:'access/accesslist',									//权限列表
	getMainMenus:'access/getmainmenus',								//获取菜单列表
	getController:'access/getcontrollers',							//获取所有控制器
	getMethods:'access/getmethods',									//控制器下所有方法列表
	ajaxAccess:'access/ajaxaccess',									//选择权限按钮列表
	addAccess:'access/add',											//添加权限
	getAccessInfo:'access/getinfo',									//权限信息获取
	delAccess:'access/del',											//删除权限
	editAccess:'access/edit',										//编辑权限
	trialList:'buffer/triallist',									//试销管理列表
	trialTry:'trial/try',											//试
	trialReplenish:'trial/replenish',								//补
	trialStop:'trial/stop',											//停
	trialClear:'trial/clear',										//清
	ajaxPl:'Common/ajaxPl',											//产品分类（筛选条件）
	ajaxGys:'Common/ajaxGys',										//供应商列表
	ajaxGyshh:'Common/ajaxGyshh',									//供应商货号
	ajaxKsbm:'Common/ajaxKsbm',										//款式编码
	ajaxBd:'Common/ajaxBd',											//波段
	replenishList:'buffer/replenishlist',							//补货管理列表
	replenishTry:'replenish/try',									//补货试
	replenishStop:'replenish/stop',									//补货停
	replenishClear:'replenish/clear',								//补货清
	modify:'replenish/modify',										//修正数量
	replenishSet:'replenish/set',									//内部核价
	replenishDetail:'replenish/detail',								//下钻
	stopList:'buffer/stoplist',										//停止进货管理列表
	stopTry:'stop/try',												//停止进货试
	stopReplenish:'stop/replenish',									//停止进货补
	stopClear:'stop/clear',											//停止进货补
	stopDetail:'stop/detail',										//停止进货下钻
	clearList:'buffer/clearlist',									//清货管理列表
	clearTry:'clear/try',											//清货管理试
	clearReplenish:'clear/replenish',								//清货管理补
	clearStop:'clear/stop',											//清货管理停
	ajaxYyjc:'Common/ajaxYyjc',										//运营决策列表
	ajaxCgjc:'Common/ajaxCgjc',										//采购决策列表
	clearDetail:'clear/detail',										//清货管理详情
	hpxzList:'buffer/hpxzlist',										//货品性质权限
	hpxzTry:'hpxz/try',												//货品性质权限-试
	hpxzReplenish:'hpxz/replenish',									//货品性质权限-补
	hpxzStop:'hpxz/stop',											//货品性质权限-停
	hpxzClear:'hpxz/clear',											//货品性质权限-清
	reportList:'bufferreport/list',									//款式列表
	shopSale:'bufferreport/shopsale',								//店铺销量图表
	plsale:'bufferreport/plsale',									//店铺品类图表
	kssale:'bufferreport/kssale',									//款式销量图表
	daySale:'bufferreport/daysale',									//每日销量图表
	shopPromotion:'bufferreport/shoppromotion',						//店铺推广费用
	catePromotion:'bufferreport/catepromotion',						//直通车推广费用
	ksPromotion:'bufferreport/kspromotion',							//款式推广费用
	shopcb:'bufferreport/shopcb',									//店铺销售成本图表
	shopplcb:'bufferreport/plcb',									//品类销售成本图表
	shopkscb:'bufferreport/kscb',									//款式销售成本图表
	plkc:'bufferreport/plkc',										//品类库存图表
	kskc:'bufferreport/kskc',										//款式库存及到货情况
	rks:'bufferreport/rks',											//入库数
	hpxz:'bufferreport/hpxz',										//货品性质占比
	hpxzks:'bufferreport/hpxzks',									//货品性质对应店铺款式数量
	shopUnsaLable:'bufferreport/shopunsalable',						//店铺滞销款数据
	plkcunSalable:'bufferreport/plkcunsalable',						//滞销款式库存
	plunsaLableMoney:'bufferreport/plunsalablemoney',				//滞销款式金额
	gysbj:'buffer/gysbj',											//供应商报价列表
	addGp:'buffer/addgp',											//填写供应商报价
	matchTime:'buffer/match',										//档口配齐时间表
	addMatch:'buffer/add_match',									//填写档口配齐时间
	zngList:'buffer/zng',											//转内供款式表
	ksInfoList:'buffer/ksinfolist',									//款式信息管理列表
	ksInfoTry:'ksinfo/try',											//款式信息管理列表-试
	ksInfoReplenish:'ksinfo/replenish',								//款式信息管理列表-补
	ksInfoStop:'ksinfo/stop',										//款式信息管理列表-停
	ksInfoClear:'ksinfo/clear',										//款式信息管理列表-清
	ksinfoModify:'ksinfo/modify',									//款式信息管理列表-修正数量
	ksinfoSet:'ksinfo/set',											//款式信息管理列表-设置内部核价
	ksinfoDetail:'ksinfo/detail',									//款式信息管理列表-下钻
	boardShop:'board/shop',											//店铺看板
	targetFinish:'board/targetFinish',								//目标完成情况
	boardFlow:'board/flow',											//流量看板（表格）
	ajaxllly:'Common/ajaxllly',										//流量来源列表
	getDaymx:'board/daymx',											//访客流量来源（日）
	getDayly:'board/dayly',											//访客流量明细（日）
	getWeekly:'board/weekly',										//访客流量来源（周）
	getWeekmx:'board/weekmx',										//访客流量明细（周）
	ajaxReportsJxrrq:'Common/ajaxreportsjxrrq',						//获取分析报告的写入日期
	trialSetXjrq:'trial/setxjrq',									//设置下架日期（试销）
	setXjrq:'replenish/setxjrq',									//设置下架日期（补货）
	stopSetXjrq:'stop/setxjrq',										//设置下架日期（停止进货）
	clearSetXjrq:'clear/setxjrq',									//设置下架日期（清货）
	hpxzSetXjrq:'hpxz/setxjrq',										//设置下架日期（货品性质权限）
	ksInfoSetXjrq:'ksinfo/setxjrq',									//设置下架日期（款式信息）
	modifySkuNum:'replenish/modifyskunum',							//补货下钻修正sku数量
	ksinfoModifySkunum:'ksinfo/modifyskunum',						//款式信息修正sku数量
	cleanprogress:'bufferreport/cleanprogress',						//清理进度图表
	annualAmount:'annual/amount',									//销售金额报表
	ajaxMs:'Common/ajaxMs',											//获取买手列表
	ajaxCgy:'Common/ajaxCgy',										//采购员列表
	ajaxCgxz:'Common/ajaxCgxz',										//采购性质列表
	ajaxXkfs:'Common/ajaxXkfs',										//选款方式列表
	ajaxSjs:'Common/ajaxSjs',										//设计师列表
	ajaxGdy:'Common/ajaxGdy',										//跟单员列表
	ajaxJgd:'Common/ajaxJgd',										//价格带列表
	decisionSku:'decision/sku',										//商品管理列表
	ajaxSpbm:'Common/ajaxSpbm',										//商品编码
	editSku:'decision/editsku',										//商品管理编辑
	decisionAdd:'decision/add',										//导入到决策管理
	decisionList:'decision/decision',								//决策管理列表
	editDecision:'decision/editdecision',							//决策管理编辑
	decisionConfirm:'decision/confirm',								//决策管理确认
	ajaxDecisionKs:'Common/ajaxDecisionKs',							//款式列表（决策）
	ajaxDecisionGyshh:'Common/ajaxDecisionGyshh',					//供应商货号（决策）
	ajaxDecisionGys:'Common/ajaxDecisionGys',						//供应商（决策）
	ajaxDecisionPlList:'Common/ajaxDecisionPlList',					//品类（决策）

}					
export default{
	//获取消息列表
	messageList(params){
		return http.get(path.messageList, params)
	},
	//读取消息
	messageRead(params){
		return http.post(path.messageRead, params)
	},
	//未读消息数
	unreadnum(params){
		return http.get(path.unreadnum, params)
	},
	//获取用户id
	login(params){
		return http.post(path.login, params)
	},
	//用户推出
	quit(params){
		return http.post(path.quit, params)
	},
	//获取所有菜单列表
	getMenu(params){
		return http.get(path.getMenu, params)
	},
	//获取用户权限
	jsapi(params){
		return http.get(path.jsapi, params)
	},
	//部门列表
	ajaxViewDept(params){
		return http.get(path.ajaxViewDept, params)
	},
	//店铺列表
	ajaxViewStore(params){
		return http.get(path.ajaxViewStore, params)
	},
	//品类列表
	ajaxCpfl(params){
		return http.get(path.ajaxCpfl, params)
	},
	//业绩分析
	performanceReport(params){
		return http.get(path.performanceReport, params)
	},
	//每日业绩
	dayAnalysis(params){
		return http.get(path.dayAnalysis, params)
	},
	//鱼塘分析报表
	fishList(params){
		return http.get(path.fishList, params)
	},
	//权限用户列表
	userList(params){
		return http.get(path.userList, params)
	},
	// 用户详情
	userInfo(params){
		return http.get(path.userInfo, params)
	},
	//用户设置(get)
	userSetGet(params){
		return http.get(path.userSet, params)
	},
	//用户设置(post)
	userSetPost(params){
		return http.post(path.userSet, params)
	},
	//获取权限列表
	menuRoleList(params){
		return http.get(path.menuRoleList, params)
	},
	//新增访问权限(get)
	addMenuRoleGet(params){
		return http.get(path.addMenuRole, params)
	},
	//新增访问权限(post)
	addMenuRolePost(params){
		return http.post(path.addMenuRole, params)
	},
	//编辑访问权限(get)
	editMenuRoleGet(params){
		return http.get(path.editMenuRole, params)
	},
	//编辑访问权限(post)
	editMenuRolePost(params){
		return http.post(path.editMenuRole, params)
	},
	//角色详情
	menuRoleInfo(params){
		return http.get(path.menuRoleInfo, params)
	},
	//删除角色
	menuRoleDel(params){
		return http.post(path.menuRoleDel, params)
	},
	//角色用户列表
	menuRoleUsers(params){
		return http.get(path.menuRoleUsers, params)
	},
	//设置用户（get）
	menuRoleSettingGet(params){
		return http.get(path.menuRoleSetting, params)
	},
	//设置用户（post）
	menuRoleSettingPost(params){
		return http.post(path.menuRoleSetting, params)
	},
	//用户详情
	menuRoleUsrInfo(params){
		return http.get(path.menuRoleUsrInfo, params)
	},
	//删除角色下的用户
	moveUser(params){
		return http.post(path.moveUser, params)
	},
	//数据权限角色列表
	dataRoleList(params){
		return http.get(path.dataRoleList, params)
	},
	//新增数据权限（get）
	addDataRoleGet(params){
		return http.get(path.addDataRole, params)
	},
	//新增数据权限（post）
	addDataRolePost(params){
		return http.post(path.addDataRole, params)
	},
	//编辑数据角色（get）
	editDataRoleGet(params){
		return http.get(path.editDataRole, params)
	},
	//编辑数据角色（post）
	editDataRolePost(params){
		return http.post(path.editDataRole, params)
	},
	//删除数据角色
	delDataRole(params){
		return http.post(path.delDataRole, params)
	},
	//数据权限详情
	dataRoleInfo(params){
		return http.get(path.dataRoleInfo, params)
	},
	//数据角色对应用户列表
	dataRoleUser(params){
		return http.get(path.dataRoleUser, params)
	},
	//数据权限用户设置(get)
	setDataRoleGet(params){
		return http.get(path.setDataRole, params)
	},
	//数据权限用户设置(post)
	setDataRolePost(params){
		return http.post(path.setDataRole, params)
	},
	//数据权限用户详情
	dataRoleUseInfo(params){
		return http.get(path.dataRoleUseInfo, params)
	},
	//用户权限删除用户
	dataRoleMoveUser(params){
		return http.post(path.dataRoleMoveUser, params)
	},
	//权限列表
	accessList(params){
		return http.get(path.accessList, params)
	},
	//获取菜单列表
	getMainMenus(params){
		return http.get(path.getMainMenus, params)
	},
	//获取所有控制器
	getControllers(params){
		return http.get(path.getController, params)
	},
	//控制器下所有方法列表
	getMethods(params){
		return http.get(path.getMethods, params)
	},
	//选择权限按钮列表
	ajaxAccess(params){
		return http.get(path.ajaxAccess, params)
	},
	//添加权限
	addAccess(params){
		return http.post(path.addAccess, params)
	},
	//权限信息获取
	getAccessInfo(params){
		return http.get(path.getAccessInfo, params)
	},
	//删除权限
	delAccess(params){
		return http.post(path.delAccess, params)
	},
	//编辑权限
	editAccess(params){
		return http.post(path.editAccess, params)
	},
	//试销管理列表
	trialList(params){
		return http.get(path.trialList, params)
	},
	//试
	trialTry(params){
		return http.post(path.trialTry, params)
	},
	//补
	trialReplenish(params){
		return http.post(path.trialReplenish, params)
	},
	//停
	trialStop(params){
		return http.post(path.trialStop, params)
	},
	//清
	trialClear(params){
		return http.post(path.trialClear, params)
	},
	//产品分类
	ajaxPl(params){
		return http.get(path.ajaxPl, params)
	},
	//供应商列表
	ajaxGys(params){
		return http.get(path.ajaxGys, params)
	},
	//供应商货号
	ajaxGyshh(params){
		return http.get(path.ajaxGyshh, params)
	},
	//产品编码
	ajaxKsbm(params){
		return http.get(path.ajaxKsbm, params)
	},
	//波段列表
	ajaxBd(params){
		return http.get(path.ajaxBd, params)
	},
	//补货管理列表
	replenishList(params){
		return http.get(path.replenishList, params)
	},
	//补货试
	replenishTry(params){
		return http.post(path.replenishTry, params)
	},				
	//补货停					
	replenishStop(params){
		return http.post(path.replenishStop, params)
	},					
	//补货清				
	replenishClear(params){
		return http.post(path.replenishClear, params)
	},		
	//修正数量	
	modify(params){
		return http.post(path.modify, params)
	},		
	//内部核价
	replenishSet(params){
		return http.post(path.replenishSet, params)
	},
	//下钻
	replenishDetail(params){
		return http.get(path.replenishDetail, params)
	},	
	//停止进货管理列表
	stopList(params){
		return http.get(path.stopList, params)
	},			
	//停止进货试
	stopTry(params){
		return http.post(path.stopTry, params)
	},		
	//停止进货补		
	stopReplenish(params){
		return http.post(path.stopReplenish, params)
	},
	//停止进货清		
	stopClear(params){
		return http.post(path.stopClear, params)
	},		
	//停止进货下钻
	stopDetail(params){
		return http.get(path.stopDetail, params)
	},	
	//清货管理列表	
	clearList(params){
		return http.get(path.clearList, params)
	},		
	//清货管理试
	clearTry(params){
		return http.post(path.clearTry, params)
	},						
	//清货管理补					
	clearReplenish(params){
		return http.post(path.clearReplenish, params)
	},				
	//清货管理停				
	clearStop(params){
		return http.post(path.clearStop, params)
	},	
	//运营决策列表
	ajaxYyjc(params){
		return http.get(path.ajaxYyjc, params)
	},							
	//采购决策列表				
	ajaxCgjc(params){
		return http.get(path.ajaxCgjc, params)
	},											
	//清货管理详情
	clearDetail(params){
		return http.get(path.clearDetail, params)
	},		
	//货品性质权限列表
	hpxzList(params){
		return http.get(path.hpxzList, params)
	},		
	//货品性质权限-试				
	hpxzTry(params){
		return http.post(path.hpxzTry, params)
	},					
	//货品性质权限-补							
	hpxzReplenish(params){
		return http.post(path.hpxzReplenish, params)
	},					
	//货品性质权限-停				
	hpxzStop(params){
		return http.post(path.hpxzStop, params)
	},			
	//货品性质权限-清									
	hpxzClear(params){
		return http.post(path.hpxzClear, params)
	},		
	//款式列表
	reportList(params){
		return http.get(path.reportList, params)
	},		
	//店铺销量图表
	shopSale(params){
		return http.get(path.shopSale, params)
	},	
	//店铺品类图表	
	plsale(params){
		return http.get(path.plsale, params)
	},	
	//款式销量图表	
	kssale(params){
		return http.get(path.kssale, params)
	},
	//每日销量图表
	daySale(params){
		return http.get(path.daySale, params)
	},		
	//店铺推广费用
	shopPromotion(params){
		return http.get(path.shopPromotion, params)
	},		
	//直通车推广费用
	catePromotion(params){
		return http.get(path.catePromotion, params)
	},		
	//款式推广费用
	ksPromotion(params){
		return http.get(path.ksPromotion, params)
	},			
	//店铺销售成本图表
	shopcb(params){
		return http.get(path.shopcb, params)
	},					
	//品类销售成本图表				
	shopplcb(params){
		return http.get(path.shopplcb, params)
	},		
	//款式销售成本图表								
	shopkscb(params){
		return http.get(path.shopkscb, params)
	},
	//品类库存列表		
	plkc(params){
		return http.get(path.plkc, params)
	},
	//款式库存及到货情况			
	kskc(params){
		return http.get(path.kskc, params)
	},
	//入库数
	rks(params){
		return http.get(path.rks, params)
	},
	//货品性质占比		
	hpxz(params){
		return http.get(path.hpxz, params)
	},
	//货品性质对应店铺款式数量
	hpxzks(params){
		return http.get(path.hpxzks, params)
	},		
	//店铺滞销款数据
	shopUnsaLable(params){
		return http.get(path.shopUnsaLable, params)
	},		
	//滞销款式库存		
	plkcunSalable(params){
		return http.get(path.plkcunSalable, params)
	},			
	//滞销款式金额			
	plunsaLableMoney(params){
		return http.get(path.plunsaLableMoney, params)
	},	
	//供应商报价列表	
	gysbj(params){
		return http.get(path.gysbj, params)
	},	
	//填写供应商报价	
	addGp(params){
		return http.post(path.addGp, params)
	},
	//档口配齐时间表	
	matchTime(params){
		return http.get(path.matchTime, params)
	},
	//填写档口配齐时间
	addMatch(params){
		return http.post(path.addMatch, params)
	},
	//转内供款式表
	zngList(params){
		return http.get(path.zngList, params)
	},
	//款式信息管理列表
	ksInfoList(params){
		return http.get(path.ksInfoList, params)
	},
	//款式信息管理列表-试
	ksInfoTry(params){
		return http.post(path.ksInfoTry, params)
	},					
	//款式信息管理列表-补						
	ksInfoReplenish(params){
		return http.post(path.ksInfoReplenish, params)
	},							
	//款式信息管理列表-停	
	ksInfoStop(params){
		return http.post(path.ksInfoStop, params)
	},							
	//款式信息管理列表-清			
	ksInfoClear(params){
		return http.post(path.ksInfoClear, params)
	},		
	//修正数量	
	ksinfoModify(params){
		return http.post(path.ksinfoModify, params)
	},		
	//设置内部核价	
	ksinfoSet(params){
		return http.post(path.ksinfoSet, params)
	},	
	//下钻
	ksinfoDetail(params){
		return http.get(path.ksinfoDetail, params)
	},	
	//店铺看板
	boardShop(params){
		return http.get(path.boardShop, params)
	},		
	//目标完成情况
	targetFinish(params){
		return http.get(path.targetFinish, params)
	},	
	//流量看板（表格）
	boardFlow(params){
		return http.get(path.boardFlow, params)
	},		
	//流量来源列表	
	ajaxllly(params){
		return http.get(path.ajaxllly, params)
	},
	//访客流量来源（日）	
	getDaymx(params){
		return http.get(path.getDaymx, params)
	},
	//访客流量明细（日）		
	getDayly(params){
		return http.get(path.getDayly, params)
	},
	//访客流量来源（周）
	getWeekly(params){
		return http.get(path.getWeekly, params)
	},
	//访客流量明细（周）
	getWeekmx(params){
		return http.get(path.getWeekmx, params)
	},
	//获取分析报告写入日期
	ajaxReportsJxrrq(params){
		return http.get(path.ajaxReportsJxrrq, params)
	},
	//设置下架日期（试销）
	trialSetXjrq(params){
		return http.post(path.trialSetXjrq, params)
	},
	//设置下架日期（补货）
	setXjrq(params){
		return http.post(path.setXjrq, params)
	},
	//设置下架日期（停止进货）
	stopSetXjrq(params){
		return http.post(path.stopSetXjrq, params)
	},
	//设置下架日期（清货）
	clearSetXjrq(params){
		return http.post(path.clearSetXjrq, params)
	},
	//设置下架日期（货品性质权限）
	hpxzSetXjrq(params){
		return http.post(path.hpxzSetXjrq, params)
	},
	//设置下架日期（款式信息）
	ksInfoSetXjrq(params){
		return http.post(path.ksInfoSetXjrq, params)
	},
	//补货下钻修正数量
	modifySkuNum(params){
		return http.post(path.modifySkuNum, params)
	},
	//款式信息下钻修正数量
	ksinfoModifySkunum(params){
		return http.post(path.ksinfoModifySkunum, params)
	},
	//清理进度图表
	cleanProgress(params){
		return http.get(path.cleanprogress, params)
	},
	//销售金额报表
	annualAmount(params){
		return http.get(path.annualAmount, params)
	},
	//获取买手列表
	ajaxMs(params){
		return http.get(path.ajaxMs, params)
	},
	//采购员列表
	ajaxCgy(params){
		return http.get(path.ajaxCgy, params)
	},
	//采购性质列表
	ajaxCgxz(params){
		return http.get(path.ajaxCgxz, params)
	},
	//选款方式列表
	ajaxXkfs(params){
		return http.get(path.ajaxXkfs, params)
	},
	//设计师列表
	ajaxSjs(params){
		return http.get(path.ajaxSjs, params)
	},
	//跟单员列表
	ajaxGdy(params){
		return http.get(path.ajaxGdy, params)
	},
	//价格带列表
	ajaxJgd(params){
		return http.get(path.ajaxJgd, params)
	},
	//商品管理列表
	decisionSku(params){
		return http.get(path.decisionSku, params)
	},
	//商品编码
	ajaxSpbm(params){
		return http.get(path.ajaxSpbm, params)
	},
	//商品管理编辑
	editSku(params){
		return http.post(path.editSku, params)
	},
	//导入到决策管理
	decisionAdd(params){
		return http.post(path.decisionAdd, params)
	},
	//决策管理列表
	decisionList(params){
		return http.get(path.decisionList, params)
	},
	//决策管理编辑
	editDecision(params){
		return http.post(path.editDecision, params)
	},
	//决策管理确认
	decisionConfirm(params){
		return http.post(path.decisionConfirm, params)
	},
	//款式列表（决策）
	ajaxDecisionKs(params){
		return http.get(path.ajaxDecisionKs, params)
	},
	//供应商货号（决策）
	ajaxDecisionGyshh(params){
		return http.get(path.ajaxDecisionGyshh, params)
	},
	//供应商（决策）
	ajaxDecisionGys(params){
		return http.get(path.ajaxDecisionGys, params)
	},
	//品类（决策）
	ajaxDecisionPlList(params){
		return http.get(path.ajaxDecisionPlList, params)
	},
}









