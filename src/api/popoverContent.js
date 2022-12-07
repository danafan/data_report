let list = {
	//营销费用经营管控（经营状况趋势图）
	jyzkqst_list:[
	"1.横坐标：发货日期",
	"2.指标解释：",
	"GMV：包含刷单的销售金额",
	"GMV(排刷单)：排除刷单的销售金额",
	"销售收入-已发货：即销售收入，销售收入=销售发货金额-售后退款金额-线下退款金额预估+冲减收入",
	"毛利额：销售收入-销售成本，其中:销售收入=销售发货金额-售后退款金额-线下退款金额预估+冲减收入；销售成本=发货成本-退货进仓成本预估+成本差异金额",
	"实际-营销费用：店铺后台获取的实际花费金额",
	"毛利率：（销售收入-销售成本）/销售收入",
	"营销费用占比：实际营销费用/销售收入，淘系C店参考线定为15%，天猫定为20%，高于则标记红色",
	"贡献毛利率：贡献毛益/销售收入，贡献毛益=毛利额-实际营销费用-事业部费用-项目部费用-店铺团队费用"],
	//营销费用经营管控（项目部-销售收入圆形图）
	xmb_xssryxt_list:[
	"1.维度：项目部",
	"2.指标解释：",
	"销售收入：销售发货金额-售后退款金额-线下退款金额预估+冲减收入"],
	//营销费用经营管控（店铺-销售收入圆形图）
	dp_xssryxt_list:[
	"1.维度：店铺",
	"2.指标解释：",
	"销售收入：销售发货金额-售后退款金额-线下退款金额预估+冲减收入"],
	//营销费用经营管控（事业部项目部--营销费用投产情况）
	sybxmbyxfytcqk:[
	'1.维度：项目部',
	'2.指标解释：',
	'GMV：包含刷单的销售金额',
	'GMV(排刷单)：排除刷单的销售金额',
	'鱼塘金额：刷单的销售金额',
	'鱼塘金额占比：刷单销售金额/GMV',
	'退款率：售前售后退款/GMV（排刷单）',
	'销售收入-已发货：即销售收入，销售收入=销售发货金额-售后退款金额-线下退款金额预估+冲减收入',
	'销售收入-未发货：即销售收入（未发货），指的是订单状态为发货中(打单拣货)、已付款待审核和异常的订单的销售金额',
	'毛利率：（销售收入-销售成本）/销售收入',
	'充值-营销费用：财务每日做账的充值金额',
	'实际-营销费用：店铺后台获取的实际花费金额',
	'差额-营销费用：充值营销费用-实际营销费用，由于店铺帐号有余额，存在充值金额大于实际花费金额情况',
	'ROI：GMV/实际营销费用',
	'营销费用占比：实际营销费用/销售收入',
	'鱼塘开支：包含鱼塘快递，鱼塘佣金，买家秀佣金，淘宝客佣金，海外刷单佣金',
	'鱼塘开支占比：鱼塘开支/实际营销费用',
	'毛利额：销售收入-销售成本，其中:销售收入=销售发货金额-售后退款金额-线下退款金额预估+冲减收入；销售成本=发货成本-退货进仓成本预估+成本差异金额',
	'毛利率-营销费用占比：（毛利额-实际营销费用）/销售收入',
	'报销费用：包含事业部费用，项目部费用',
	'贡献毛益：毛利额-实际营销费用-事业部费用-项目部费用-店铺团队费用',
	'贡献毛益率：贡献毛益/销售收入',
	'鱼塘订单：鱼塘订单的原始线上订单号数',
	'发货订单：发货订单的原始线上订单号数',
	'未发货订单：未发货订单的原始线上订单号数',
	'多件订单占比：一线上订单号里购买多件的单量占比',
	'拆分订单占比：一线上订单号拆分多快递单发货的单量占比'
	],
	//款式Top200
	top_lb:[
	'1.维度：款式编码',
	'2.指标解释：',
	'款式编码：剔除乎达、代运营、赠品和福袋',
	'7天日均销量：剔除特殊单，付款日期前7天日均销量',
	'30天销量：剔除特殊单，付款日期前30天总销量',
	'7天毛利率：剔除特殊单，付款日期前7天，(销售金额-销售数量*审计成本)/销售金额',
	'15天实退率：剔除特殊单，付款日期前15天，实际退货的销售数量/实际发货的销售数量',
	'7天到货率：下单日期为近7天的入库数量/采购数量',
	'7天到货率(排除备货)：排除备货后，下单日期近7天的入库数量/采购数量',
	'前三天销量：剔除特殊单，付款日期往前第三天前的销量',
	'前二天销量：剔除特殊单，付款日期往前第二天前的销量',
	'前一天销量：剔除特殊单，付款日期往前第一天前的销量',
	'主卖店铺：剔除特殊单，取前7天销售数量最大的店铺作为该款式的主卖店铺，若销售数量相等，取销售金额最大的店铺',
	'前三天到货数：往前三天到货数',
	'前两天到货数：往前两天到货数',
	'前一天到货数：往前一天到货数',
	'现有库存：当天早上7:30生成的箱及仓位库存',
	'缺货数：每个sku的商品库存中的订单占有大于库存的部分定义为sku的缺货数，再按照款式编码聚合生成款式的缺货数'
	],
	//3店铺Top50
	top_ws:[
	'1.维度：店铺名称和款式编码，有些指标是款式编码维度会单独标注',
	'2.指标解释：',
	'店铺名称：三个店铺分别是:mystery8090、胖胖哥旗舰店和棉致男装旗舰店',
	'款式编码：剔除赠品和福袋',
	'7天毛利率：剔除特殊单，付款日期前7天，(销售金额-销售数量*审计成本)/销售金额',
	'15天实退率：剔除特殊单，付款日期前15天，实际退货的销售数量/实际发货的销售数量',
	'7天到货率：下单日期为近7天的入库数量/采购数量（款式编码维度）',
	'7天到货率(排除备货)：排除备货后，下单日期近7天的入库数量/采购数量（款式编码维度）',
	'3天发货率：付款日期近3天订单状态为已发货的单量/总订单量',
	'前三天销量：剔除特殊单，付款日期往前第三天前的销量',
	'前两天销量：剔除特殊单，付款日期往前第二天前的销量',
	'前一天销量：剔除特殊单，付款日期往前第一天前的销量',
	'全公司前一天销量：剔除特殊单，付款日期往前第一天前的销量（款式编码维度）',
	'前三天到货数：前三天到货数（款式编码维度）',
	'前两天到货数：前两天到货数（款式编码维度）',
	'前一天到货数：前一天到货数（款式编码维度）',
	'进货仓库存：商品库存中的进货仓库存（款式编码维度）',
	'箱及仓位库存：当天早上7:30生成的箱及仓位库存（款式编码维度）',
	'缺货数：每个sku的商品库存中的订单占有大于库存的部分定义为sku的缺货数，再按照款式编码聚合生成款式的缺货数',
	],
	//每日业绩分析
	daily_performance:[
	'1.维度：发货日期',
	'2.指标解释：',
	'销售收入预估：销售发货金额-售后退款金额-线下退款金额预估+冲减收入',
	'线下退款金额预估：线下退款金额预估',
	'销售收入日目标：发货日期当天的销售收入日目标',
	'日目标累计：销售收入日目标，发货日期从上往下累计加总',
	'日销售收入完成率：销售收入预估/销售收入日目标累计',
	'销售收入月目标：销售收入月目标',
	'月度销售收入完成率：销售收入预估/销售收入月目标',
	'毛利率月目标：毛利额月目标/销售收入月目标',
	'预估毛利率：毛利额预估/销售收入预估',
	'营销费用率月目标：营销费用月目标/销售收入月目标',
	'预估营销费用率：营销费用预估/销售收入预估',
	'返现费用预估：买一送一费用',
	'贡献毛益月目标：贡献毛益月目标',
	'贡献毛益日目标：贡献毛益日目标累计',
	'贡献毛益预估：毛利额-营销费用-买一送一费用-店铺团队费用-项目部分摊费用-事业部分摊费用',
	'贡献毛益率月目标：贡献毛益率月目标',
	'贡献毛益率预估：贡献毛益预估/销售收入预估',
	'月目标-贡献毛益完成率：贡献毛益预估/贡献毛益月目标',
	'日累计-贡献毛益完成率：贡献毛益预估/贡献毛益日目标累计'
	],
	//销售收入预估
	xssryg:[
	'销售收入预估：销售发货金额-售后退款金额-线下退款金额预估+冲减收入',
	'销售收入月目标：销售收入月目标',
	'月度完成率：销售收入预估/销售收入月目标',
	'日累计-销售收入：销售收入日目标累计',
	'周期内完成率：销售收入预估/销售收入日目标累计'
	],
	//营销费用预估
	yxfyyg:[
	'营销费用预估：财务用友系统计算的营销费用',
	'营销费用月目标：营销费用月目标',
	'月度使用率：营销费用预估/营销费用月目标',
	'日累计-营销费用：营销费用日目标累计',
	'周期内使用率：营销费用预估/营销费用日目标累计'
	],
	//预估值-贡献毛益
	ygz_gxmy:[
	'预估值-贡献毛益：毛利额-营销费用-买一送一费用-店铺团队费用-项目部分摊费用-事业部分摊费用',
	'贡献毛益月目标：贡献毛益月目标',
	'月度完成率：贡献毛益预估/贡献毛益月目标',
	'日累计-贡献毛益：贡献毛益日目标累计',
	'周期内完成率：贡献毛益预估/贡献毛益日目标累计'
	],
	//预估值-贡献毛益率
	ygz_gxmyl:[
	'预估值-贡献毛益率：贡献毛益预估/销售收入预估',
	'贡献毛益率月目标：贡献毛益月目标/销售收入月目标',
	'日累计-贡献毛益率：贡献毛益日目标/销售收入日目标'
	],
	//净利润预估
	jlryg:[
	'净利润预估：毛利额-营销费用-买一送一费用-店铺团队费用-项目部分摊费用-事业部分摊费用-公摊费用预估-客服费用预估-物流类费用预估'
	],
	//业绩分析(运营)
	performance_analysis:[
	'1.维度：店铺',
	'2.指标解释：',
	'月目标-销售收入：销售收入月目标',
	'日累计-销售收入：销售收入日目标累计',
	'销售收入预估：销售发货金额-售后退款金额-线下退款金额预估+冲减收入',
	'月目标-销售收入完成率：销售收入预估/销售收入月目标',
	'客单价：销售收入预估 / 成功发货单量预估',
	'成功发货单量：原始线上订单发货单量 - 当天退货单',
	'发货单量：按照快递发货单量计算',
	'日累计-销售收入完成率：销售收入预估/销售收入日目标累计',
	'月毛利率目标：毛利额月目标/销售收入月目标',
	'预估毛利率：毛利额预估/销售收入预估',
	'月目标-营销费用率：营销费用月目标/销售收入月目标',
	'营销费用预估：财务用友系统计算的营销费用',
	'预估营销费用率：营销费用预估/销售收入预估',
	'返现费用预估：买一送一费用',
	'月目标-贡献毛益：贡献毛益月目标',
	'日累计-贡献毛益：贡献毛益日目标累计',
	'贡献毛益预估：毛利额-营销费用-买一送一费用-店铺团队费用-项目部分摊费用-事业部分摊费用',
	'月目标-贡献毛益率：贡献毛益月目标/销售收入月目标',
	'贡献毛益率预估：贡献毛益预估/销售收入预估',
	'月目标-贡献毛益完成率：贡献毛益预估/贡献毛益月目标',
	'日累计-贡献毛益完成率：贡献毛益预估/贡献毛益日目标累计'
	],
	//营销周报
	week_data:[
	'1.维度：店铺',
	'2.指标解释：',
	'销售收入预估：销售发货金额-售后退款金额-线下退款金额预估+冲减收入',
	'销售成本预估：发货成本-退货进仓成本预估+成本差异金额',
	'营销费用预估：营销费用',
	'毛利额: 销售收入预估-销售成本预估',
	'物流类费用预估：当月:海外平台（发货单量*50） 、抖音平台 （发货单量*6）、其余平台（发货单量*4） ； 往月:按照各个平台的实际物流费用占销售收入的比率预估；代运营店铺、得物无物流费用',
	'事业部分摊费用预估：归属于整个事业部分摊的费用',
	'项目部分摊费用预估：归属于整个项目部分摊的费用',
	'店铺团队费用预估：归属于店铺团队分摊的费用',
	'客服费用：淘系售后按0.8*售后接待量，淘系售前按2000*线数+售前转化销售收入*1%，拼多多按0.4*接待量',
	'公摊费用：除运营中心、客服中心外其他部门所有人员工资奖金社保福利招聘培训费等其他费用',
	'公摊费用_旧：淘系店铺分摊规则:所有公摊费用金额-拼多多分摊金额-新项目部对应公摊费用金额后剩余金额，按公司淘系店铺按发货快递数分摊',
	'店铺其他费用预估：',
	'净利润预估：毛利额-营销费用-买一送一费用-店铺团队费用-项目部分摊费用-事业部分摊费用-公摊费用预估-客服费用预估-物流类费用预估',
	'净利润率：净利润预估/销售收入预估'
	],
	//烫画片使用统计
	thp_use:[
	'1.维度：烫画片商品编码',
	'2.指标解释：',
	'烫画片商品编码：唯一键',
	'箱及库存：当天早上7:30生成的箱及仓位库存',
	'三天销量：依据烫画片商品编码对应的成衣商品编码计算的前三天使用量',
	'七天销量：依据烫画片商品编码对应的成衣商品编码计算的前七天使用量',
	'建议备货数：需要业务自己计算并添加写入',
	'前一天建议备货数：前一天建议备货数',
	'前两天建议备货数：前两天建议备货数',
	'前三天建议备货数：前三天建议备货数'
	],
	//烫画片销售统计
	thp_sales:[
	'1.维度：烫画片商品编码',
	'2.指标解释：',
	'成衣商品编码：一个成衣商品编码对应多个烫画片商品编码',
	'前三天销量：成衣商品编码的近三天销量(剔除发货前售后)',
	'前七天销量：成衣商品编码的近七天销量(剔除发货前售后)',
	'烫画片商品编码：一个烫画片商品编码对应多个成衣商品编码'
	],
	//鱼塘频次分析
	ytpc:[
	'1.维度：做单频次',
	'2.指标解释：',
	'买家账号统计：按照做单频次对买家账号去重求和',
	'买家账号占比：单条买家账号在所有当前表内的全部买家账号之和的占比',
	'SD量：按照做单频次对鱼塘单量求和',
	'SD占比：单条SD量在所有当前表内的全部SD量之和的占比'
	],
	//五单以上的鱼塘账号
	wdyszh:[
	'1.维度：买家账号和店铺名称',
	'2.指标解释：',
	'SD量：按照买家账号和店铺名称对鱼塘单量求和',
	'SD占比：单条SD量在所有当前表内的全部SD量之和的占比'
	],
	dpyttj:[
	'1.维度：店铺名称',
	'2.指标解释：',
	'买家SD账号：按照店铺名称对买家账号去重求和',
	'店铺SD量：按照店铺名称对鱼塘单量求和'
	],
	//退货率-部门每日明细
	thl_bmmrmx:[
	'1.维度：部门和统计日期，该表只展示最近30天的数据',
	'2.指标解释：',
	'统计日期：真实GMV按照付款日期计算；退款金额按照售后确认日期计算',
	'退货率：退款金额/真实GMV金额，其中:退款金额包括发货前退货金额和发货后退货金额，真实GMV金额指的是排除刷单的销售金额'
	],
	//退货率-部门累加
	thl_bmlj:[
	'1.维度：部门和统计日期，该表只展示最近30天的数据',
	'2.指标解释：',
	'统计日期：真实GMV按照付款日期计算；退款金额按照售后确认日期计算；指标计算从昨天往前推的第30天开始累加',
	'退货率：退款金额/真实GMV金额，其中:退款金额包括发货前退货金额和发货后退货金额，真实GMV金额指的是排除刷单的销售金额'
	],
}
export default list;