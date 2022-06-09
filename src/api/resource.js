import http from './request.js'
let path = {	
	messageList:'message/list',										//获取消息列表
	messageRead:'message/read',										//读取消息
	unreadnum:'message/unreadnum',									//未读消息数
	dingLogin:'ding_login',											//钉钉获取用户信息
	login:'login',													//浏览器获取用户信息
	quit:'quit',													//推出
	getMenu:'access/mymenu',										//获取所有菜单列表
	jsapi:'jsapi',													//获取用户权限
	ajaxViewDept:'Common/ajaxViewDept',								//部门列表
	ajaxViewStore:'Common/ajaxViewShop',							//店铺列表
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
	boardShop:'board/shop',											//店铺看板(店铺日数据)
	boardPeriodShop:'board/period_shop',							//店铺看板(店铺期间数据)
	targetFinish:'board/targetFinish',								//目标完成情况
	boardFlow:'board/flow',											//流量看板（店铺日数据）
	boardPeriodFlow:'board/period_flow',							//流量看板（店铺期间数据）
	ajaxllly:'Common/ajaxllly',										//流量来源列表
	getDaymx:'board/daymx',											//访客流量分布（日）
	getDayly:'board/dayly',											//访客流量来源（日）
	getWeekmx:'board/weekmx',										//访客流量分布（周）
	getWeekly:'board/weekly',										//访客流量来源（周）
	getPeriodDaymx:'board/period_daymx',							//访客流量分布（日，店铺期间数据）
	getPeriodDayly:'board/period_dayly',							//访客流量来源（日，店铺期间数据）
	getPeriodWeekmx:'board/period_weekmx',							//访客流量分布（周，店铺期间数据）
	getPeriodWeekly:'board/period_weekly',							//访客流量来源（周，店铺期间数据）
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
	skuDetail:'decision/skudetail',									//商品管理下钻
	decisionCancel:'decision/cancel',								//决策管理取消
	decisionUpload:'decision/upload',								//上传批量查询（商品管理）
	commonoPerator:'Common/operator',								//操作人列表
	batchSet:'decision/batchset',									//批量更新内部核价
	annualVolume:'annual/volume',									//销售数量报表
	ksbmExport:'decision/ksbmExport',								//商品信息管理导出
	ksExport:'ksinfo/ksexport',										//货品性质管理导出
	setColumns:'buffer/setcolumns',									//设置自定义列
	dayUpload:'buffer/dayupload',									//上传店铺数据
	trialExport:'trial/trialexport',								//试销管理导出
	replenishExport:'replenish/replenishexport',					//补货管理导出
	stopExport:'stop/stopexport',									//停止进货管理导出
	clearExport:'clear/clearexport',								//清理管理导出
	annualReturn:'annual/return',									//退货数据报表
	ajaxSpid:'common/ajaxSpid',										//商品id
	dpAnalysis:'annual/dp_analysis',								//单品分析-指标汇总
	dayDpAnalysis:'annual/day_dp_Analysis',							//单品分析-每日分析下面的折线图
	annualDpzt:'annual/dp_zt',										//每日分析-整体数据
	annualDpSearch:'annual/dp_search',								//每日分析-搜索系列
	annualDpZtc:'annual/dp_ztc',									//每日分析-直通车系列
	annualDpCjtj:'annual/dp_cjtj',									//每日分析-超级推荐系列
	ztExport:'annual/zt_export',									//整体数据导出
	searchExport:'annual/search_export',							//搜索系列导出
	ztcExport:'annual/ztc_export',									//直通车导出
	cjtjExport:'annual/cjtj_export',								//超级推荐系列导出
	ajaxYongyou:'common/ajaxYongyou',								//用友店铺列表
	ajaxXmdl:'common/ajaxXmdl',										//项目大类列表
	ajaxXmmc:'common/ajaxXmmc',										//项目名称列表
	yxfyList:'yxfy/list',											//营销费用分析报告
	ajaxPlat:'common/ajaxPlat',										//平台列表
	recentSales:'PerformanceReport/recent_sales',					//店铺近期销售额趋势
	ajaxProvince:'common/ajaxProvince',								//所有省份列表
	areaSale:'areasale/sales',										//销售数据
	areasaleReturn:'areasale/return',								//退款指标
	areasaleYt:'areasale/yt',										//鱼塘指标
	ajaxCity:'common/ajaxCity',										//所有城市列表
	weatherData:'weather/list',										//全国天气数据分析图表接口
	weatherTableList:'weather/tablelist',							//底部天气数据表格
	ajaxCompany:'common/ajaxCompany',								//获取公司列表
	ajaxPp:'common/ajaxPp',											//获取品牌列表
	specialSetting:'buffer/specialSetting',							//特殊权限设置
	targetCompleteChart:'PerformanceReport/targetChart',			//目标完成报告报（仪表盘折线图）
	targetTable:'PerformanceReport/target',							//目标完成报告报（表格）
	pcChartData:'fish/chart',										//鱼塘近一年图表数据
	fishStatistics:'fish/statistics',								//鱼塘频次统计下面三个表格
	bufferDlearDept:'buffer/clear_dept',							//清理款部门导入接口
	getCkwz:'stock_analysis/get_ckwz',								//仓库位置列表
	stockAnalysis:'stock_analysis/index',							//库存分析（页面左侧部分）
	stockAnalysisKs:'stock_analysis/ks',							//款式分析（页面右上部分）
	stockAnalysisKsList:'stock_analysis/ks_list',					//款式列表
	dynamicAnalysisIndex:'dynamic_analysis/index',					//库存动态分析顶部表格列表
	dynamicAnalysisList:'dynamic_analysis/list',					//库存动态分析底部表格列表
	getShopCard:'shop_info/shop_card',								//获取资料卡片信息
	getShopTrend:'shop_info/shop_trend',							//获取资料图表
	shopDetailCard:'shop_info/shop_detail_card',					//商品资料列表
	clearBatch:'dynamic_analysis/clear_batch',						//清仓汇总（批次列表）
	dynamicAnalysisClear:'dynamic_analysis/clear',					//清仓汇总展示	
	clearChart:'dynamic_analysis/clear_chart',						//清仓汇总-清仓，折价趋势图

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
	//钉钉获取用户信息
	dingLogin(params){
		return http.get(path.dingLogin, params)
	},
	//浏览器获取用户信息
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
		return http.post(path.trialList, params)
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
		return http.post(path.replenishList, params)
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
		return http.post(path.stopList, params)
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
		return http.post(path.clearList, params)
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
		return http.post(path.ksInfoList, params)
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
	//店铺看板（店铺日数据）
	boardShop(params){
		return http.get(path.boardShop, params)
	},	
	//店铺看板（店铺期间数据）
	boardPeriodShop(params){
		return http.get(path.boardPeriodShop, params)
	},	
	//目标完成情况
	targetFinish(params){
		return http.get(path.targetFinish, params)
	},	
	//流量看板（店铺日数据）
	boardFlow(params){
		return http.get(path.boardFlow, params)
	},		
	//流量看板（店铺期间数据）
	boardPeriodFlow(params){
		return http.get(path.boardPeriodFlow, params)
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
	//访客流量分布（日,店铺期间数据）	
	getPeriodDaymx(params){
		return http.get(path.getPeriodDaymx, params)
	},
	//访客流量来源（日,店铺期间数据）		
	getPeriodDayly(params){
		return http.get(path.getPeriodDayly, params)
	},
	//访客流量分布（周,店铺期间数据）
	getPeriodWeekmx(params){
		return http.get(path.getPeriodWeekmx, params)
	},
	//访客流量来源（周,店铺期间数据）
	getPeriodWeekly(params){
		return http.get(path.getPeriodWeekly, params)
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
		return http.post(path.decisionSku, params)
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
	//商品管理下钻
	skuDetail(params){
		return http.get(path.skuDetail, params)
	},
	//决策管理取消
	decisionCancel(params){
		return http.post(path.decisionCancel, params)
	},
	//上传批量查询（商品管理）
	decisionUpload(params){
		return http.post(path.decisionUpload, params)
	},
	//操作人列表
	commonoPerator(params){
		return http.get(path.commonoPerator, params)
	},
	//批量更新内部核价
	batchSet(params){
		return http.post(path.batchSet, params)
	},
	//销售数量报表
	annualVolume(params){
		return http.get(path.annualVolume, params)
	},
	//商品信息管理导出
	ksbmExport(params){
		return http.post(path.ksbmExport, params)
	},
	//货品性质管理导出
	ksExport(params){
		return http.post(path.ksExport, params)
	},
	//设置自定义列
	setColumns(params){
		return http.post(path.setColumns, params)
	},
	//上传店铺数据
	dayUpload(params){
		return http.post(path.dayUpload, params)
	},
	//试销管理导出
	trialExport(params){
		return http.post(path.trialExport, params)
	},
	//补货管理导出
	replenishExport(params){
		return http.post(path.replenishExport, params)
	},
	//停止进货管理导出
	stopExport(params){
		return http.post(path.stopExport, params)
	},
	//清理管理导出
	clearExport(params){
		return http.post(path.clearExport, params)
	},
	//退货数据报表
	annualReturn(params){
		return http.get(path.annualReturn, params)
	},
	//商品ID列表
	ajaxSpid(params){
		return http.get(path.ajaxSpid, params)
	},
	//单品分析-指标汇总
	dpAnalysis(params){
		return http.get(path.dpAnalysis, params)
	},
	//单品分析—每日分析下面的折线图
	dayDpAnalysis(params){
		return http.get(path.dayDpAnalysis, params)
	},
	//每日分析-整体数据
	annualDpzt(params){
		return http.get(path.annualDpzt, params)
	},
	//每日分析-搜索系列
	annualDpSearch(params){
		return http.get(path.annualDpSearch, params)
	},
	//每日分析-直通车系列
	annualDpZtc(params){
		return http.get(path.annualDpZtc, params)
	},
	//每日分析-超级推荐系列
	annualDpCjtj(params){
		return http.get(path.annualDpCjtj, params)
	},
	//整体数据导出
	ztExport(params){
		return http.get(path.ztExport, params)
	},
	//搜索导出
	searchExport(params){
		return http.get(path.searchExport, params)
	},
	//直通车导出
	ztcExport(params){
		return http.get(path.ztcExport, params)
	},
	//超级推荐导出
	cjtjExport(params){
		return http.get(path.cjtjExport, params)
	},
	//用友店铺列表
	ajaxYongyou(params){
		return http.get(path.ajaxYongyou, params)
	},
	//项目大类列表
	ajaxXmdl(params){
		return http.get(path.ajaxXmdl, params)
	},
	//项目名称列表
	ajaxXmmc(params){
		return http.get(path.ajaxXmmc, params)
	},
	//营销费用分析报告
	yxfyList(params){
		return http.get(path.yxfyList, params)
	},
	//平台列表
	ajaxPlat(params){
		return http.get(path.ajaxPlat, params)
	},
	//店铺近期销售额趋势
	recentSales(params){
		return http.get(path.recentSales, params)
	},
	//所有省份列表
	ajaxProvince(params){
		return http.get(path.ajaxProvince, params)
	},
	//销售数据
	areaSale(params){
		return http.get(path.areaSale, params)
	},
	//退款指标
	areasaleReturn(params){
		return http.get(path.areasaleReturn, params)
	},
	//鱼塘指标
	areasaleYt(params){
		return http.get(path.areasaleYt, params)
	},
	//所有城市列表
	ajaxCity(params){
		return http.get(path.ajaxCity, params)
	},
	//全国天气数据分析图表接口
	weatherData(params){
		return http.get(path.weatherData, params)
	},
	//底部天气数据表格接
	weatherTableList(params){
		return http.get(path.weatherTableList, params)
	},
	//获取公司列表
	ajaxCompany(params){
		return http.get(path.ajaxCompany, params)
	},
	//获取品牌列表
	ajaxPp(params){
		return http.get(path.ajaxPp, params)
	},
	//特殊权限设置（get）
	specialSettingGet(params){
		return http.get(path.specialSetting, params)
	},
	//特殊权限设置（post）
	specialSettingPost(params){
		return http.post(path.specialSetting, params)
	},
	//目标完成报告报表
	targetCompleteChart(params){
		return http.get(path.targetCompleteChart, params)
	},
	//目标完成报告报表（表格）
	targetTable(params){
		return http.get(path.targetTable, params)
	},
	//鱼塘近一年图表数据
	pcChartData(params){
		return http.get(path.pcChartData, params)
	},
	//鱼塘频次统计下面表格
	fishStatistics(params){
		return http.get(path.fishStatistics, params)
	},
	//清理款部门导入接口
	bufferDlearDept(params){
		return http.post(path.bufferDlearDept, params)
	},
	//仓库位置列表
	getCkwz(params){
		return http.get(path.getCkwz, params)
	},
	//库存分析（页面左侧部分）
	stockAnalysis(params){
		return http.get(path.stockAnalysis, params)
	},
	//款式分析（页面右上部分）
	stockAnalysisKs(params){
		return http.get(path.stockAnalysisKs, params)
	},
	//款式列表
	stockAnalysisKsList(params){
		return http.get(path.stockAnalysisKsList, params)
	},
	//库存动态分析顶部表格列表
	dynamicAnalysisIndex(params){
		return http.get(path.dynamicAnalysisIndex, params)
	},
	//库存动态分析底部表格列表
	dynamicAnalysisList(params){
		return http.get(path.dynamicAnalysisList, params)
	},
	//获取卡片信息
	getShopCard(params){
		return http.get(path.getShopCard, params)
	},
	//获取资料图表
	getShopTrend(params){
		return http.get(path.getShopTrend, params)
	},
	//商品资料列表
	shopDetailCard(params){
		return http.get(path.shopDetailCard, params)
	},
	//清仓汇总（批次列表）
	clearBatch(params){
		return http.get(path.clearBatch, params)
	},
	//清仓汇总展示
	dynamicAnalysisClear(params){
		return http.get(path.dynamicAnalysisClear, params)
	},
	//清仓汇总-清仓，折价趋势图
	clearChart(params){
		return http.get(path.clearChart, params)
	},
}









