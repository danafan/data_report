import Vue from 'vue'
import Router from 'vue-router'

//登录页
const login = resolve=>require(['@/pages/login'],resolve)
//首页
const home = resolve=>require(['@/pages/home'],resolve)
//重点核心指标
const focus_core = resolve=>require(['@/pages/FocusCore/focus_core'],resolve)
//业绩指标
const store_data = resolve=>require(['@/pages/Results/StoreResults/store_data'],resolve)
const store_results = resolve=>require(['@/pages/Results/store_results'],resolve)
const category_analysis = resolve=>require(['@/pages/Results/category_analysis'],resolve)
const performance = resolve=>require(['@/pages/Results/performance'],resolve)
//缓冲机制
const test_market = resolve=>require(['@/pages/Buffer/test_market'],resolve)
const supplement = resolve=>require(['@/pages/Buffer/supplement'],resolve)
const stop_replenish = resolve=>require(['@/pages/Buffer/stop_replenish'],resolve)
const clear_goods = resolve=>require(['@/pages/Buffer/clear_goods'],resolve)
const property_rights = resolve=>require(['@/pages/Buffer/property_rights'],resolve)
const report_page = resolve=>require(['@/pages/Buffer/report_page'],resolve)
const goods_nature = resolve=>require(['@/pages/Buffer/goods_nature'],resolve)
const inventory_info = resolve=>require(['@/pages/Buffer/inventory_info'],resolve)
//审计管理
const audit_index = resolve=>require(['@/pages/Audit/audit_index'],resolve)
const report_index = resolve=>require(['@/pages/Audit/report_index'],resolve)
const account_store = resolve=>require(['@/pages/Audit/account_store'],resolve)
//权限
const permssions_index = resolve=>require(['@/pages/Permissions/permissions_index'],resolve)
const role_user = resolve=>require(['@/pages/Permissions/PermissionTabs/role_user'],resolve)
const data_role_user = resolve=>require(['@/pages/Permissions/PermissionTabs/data_role_user'],resolve)
//表单管理
const data_fill = resolve=>require(['@/pages/FormData/data_fill'],resolve)
const data_management = resolve=>require(['@/pages/FormData/form_data/data_management'],resolve)
const commit_data = resolve=>require(['@/pages/FormData/my_commit/submit_log/commit_data'],resolve)
//下架款登记反馈
const shelves_feedback = resolve=>require(['@/pages/ShelvesFeedBack/shelves_feedback'],resolve)
const illegal_control = resolve=>require(['@/pages/ShelvesFeedBack/illegal_control'],resolve)
const violation = resolve=>require(['@/pages/ShelvesFeedBack/violation'],resolve)
//店铺信息
const store_info = resolve=>require(['@/pages/StoreInfo/store_info'],resolve)
//运营中心
const new_data = resolve=>require(['@/pages/Operations/GoodsInfo/new_data'],resolve)    //上新数据
const delivery_data = resolve=>require(['@/pages/Operations/GoodsInfo/delivery_data'],resolve)    //款式销量
const goods_cate = resolve=>require(['@/pages/Operations/GoodsInfo/goods_cate'],resolve)    //商品品类
const goods_analysis = resolve=>require(['@/pages/Operations/GoodsInfo/goods_analysis'],resolve)    //商品分析
const operations_data_analysis = resolve=>require(['@/pages/Operations/operations_data_analysis'],resolve)    //数据分析
const refund_status = resolve=>require(['@/pages/Operations/refund_status'],resolve)    //退款情况看板
const pdd_sales = resolve=>require(['@/pages/Operations/pdd_sales'],resolve)    //拼多多销售统计
const dyy_shop_data = resolve=>require(['@/pages/Operations/dyy_shop_data'],resolve)    //代运营店铺数据
const sales_subject_analysis = resolve=>require(['@/pages/Operations/sales_subject_analysis'],resolve)    //销售主题分析
//目标销售额管理
const store_sales_forecast = resolve=>require(['@/pages/TargetSales/storeSalesForecast/store_sales_forecast'],resolve)   //店长销售收入预估表
const create_target = resolve=>require(['@/pages/TargetSales/storeSalesForecast/create_target'],resolve)   //店铺填报
const audit_dept = resolve=>require(['@/pages/TargetSales/auditDept/audit_dept'],resolve)   //审核表（项目部审核店铺）
const sales_forecast_dept = resolve=>require(['@/pages/TargetSales/auditDept/sales_forecast_dept'],resolve)   //销售额预估表（项目部）
const store_target = resolve=>require(['@/pages/TargetSales/auditDept/components/store_target'],resolve)   //拆分店铺（项目部）
const audit_division = resolve=>require(['@/pages/TargetSales/auditDivision/audit_division'],resolve)   //审核表（事业部审核项目部）
const sales_forecast_division = resolve=>require(['@/pages/TargetSales/auditDivision/sales_forecast_division'],resolve)   //销售额预估表（事业部
const dept_target = resolve=>require(['@/pages/TargetSales/auditDivision/dept_target'],resolve)   //拆分项目部（事业部）
const audit_manager = resolve=>require(['@/pages/TargetSales/auditManager/audit_manager'],resolve)   //审核表（总经理）
const dept_target_manager = resolve=>require(['@/pages/TargetSales/auditManager/dept_target'],resolve)   //拆分项目部（总经理）
//数据导出
const data_export = resolve=>require(['@/pages/DataExport/data_export'],resolve)   //采购入库
//得物缓冲机制
const dw_delivery = resolve=>require(['@/pages/DwDelivery/dw_delivery'],resolve)   //得物发货情况分析
const er_dept = resolve=>require(['@/pages/ProcurementOrder/er_dept'],resolve)
const si_dept = resolve=>require(['@/pages/ProcurementOrder/si_dept'],resolve)
const purchase_summary = resolve=>require(['@/pages/ProcurementOrder/purchase_summary'],resolve)
const lack_feekback = resolve=>require(['@/pages/ProcurementOrder/lack_feekback'],resolve)
// 供应链中心
const demand_report = resolve=>require(['@/pages/SupplyChain/demand_report'],resolve)
const created_demand = resolve=>require(['@/pages/SupplyChain/DemandReport/created_demand'],resolve)
const procurement_info = resolve=>require(['@/pages/SupplyChain/DemandReport/procurement_info'],resolve)
const supplier_ranking = resolve=>require(['@/pages/SupplyChain/supplier_ranking'],resolve)    //供应商排行
const inventory_summary = resolve=>require(['@/pages/SupplyChain/inventory_summary'],resolve)
const no_the_new = resolve=>require(['@/pages/SupplyChain/no_the_new'],resolve)
const rob_table = resolve=>require(['@/pages/SupplyChain/rob_table'],resolve)
const focus_follow_style = resolve=>require(['@/pages/SupplyChain/focus_follow_style'],resolve)
const delivery_situation = resolve=>require(['@/pages/SupplyChain/delivery_situation'],resolve)
const store_new_style = resolve=>require(['@/pages/SupplyChain/store_new_style'],resolve)
const thp_table = resolve=>require(['@/pages/SupplyChain/thp_table'],resolve)
const erdept_internal = resolve=>require(['@/pages/SupplyChain/erdept_internal'],resolve)
const style_code = resolve=>require(['@/pages/SupplyChain/style_code'],resolve)
const delist_data = resolve=>require(['@/pages/SupplyChain/delist_data'],resolve)
//代发系统
const replace_send = resolve=>require(['@/pages/ReplaceSend/index'],resolve)
//人效看板
const human_effect = resolve=>require(['@/pages/HumanEffect/human_effect'],resolve)

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/login',name:"登录", component: login},
  {
    path: '/',
    component: home,
    name:"首页",
    children:[
    { path: '/focus_core',name:"重点核心指标", component: focus_core},
    { path: '/store_data',name:"店铺日数据", component: store_data},
    { path: '/store_results',name:"店铺业绩", component: store_results},
    { path: '/category_analysis',name:"品类分析", component: category_analysis},
    { path: '/performance_index',name:"推广绩效", component: performance},
    { path: '/test_market',name:"试销管理", component: test_market},
    { path: '/supplement',name:"补货管理", component: supplement},
    { path: '/stop_replenish',name:"停止进货", component: stop_replenish},
    { path: '/clear_goods',name:"清货管理", component: clear_goods},
    { path: '/property_rights',name:"货品性质权限", component: property_rights},
    { path: '/report_page',name:"分析报告", component: report_page},
    { path: '/goods_nature',name:"货品性质管理", component: goods_nature},
    { path: '/inventory_info',name:"", component: inventory_info},
    { path: '/audit_index',name:"成本管理", component: audit_index},
    { path: '/report_index',name:"报表管理", component: report_index},
    { path: '/account_store',name:"账号店铺余额", component: account_store},
    { path: '/permssions_index',name:"权限管理", component: permssions_index},
    { path: '/role_user',name:"角色人员", component: role_user},
    { path: '/data_role_user',name:"数据权限人员", component: data_role_user},
    { path: '/data_fill',name:"数据填报", component: data_fill,meta:{keepAlive:true}},
    { path: '/data_management',name:"数据管理", component: data_management},
    { path: '/commit_data',name:"表单数据", component: commit_data},
    { path: '/shelves_feedback',name:"下架款登记反馈", component: shelves_feedback},
    { path: '/illegal_control',name:"店铺违规管控", component: illegal_control},
    { path: '/violation',name:"工商违规", component: violation},
    { path: '/store_info',name:"店铺信息", component: store_info},
    { path: '/new_data',name:"上新数据", component: new_data},
    { path: '/delivery_data',name:"发货数据", component: delivery_data},
    { path: '/operations_data_analysis',name:"运营中心数据分析", component: operations_data_analysis},
    { path: '/refund_status',name:"退款情况看板", component: refund_status},
    { path: '/pdd_sales',name:"拼多多销售统计", component: pdd_sales},
    { path: '/dyy_shop_data',name:"代运营店铺数据", component: dyy_shop_data},
    { path: '/sales_subject_analysis',name:"销售主题分析", component: sales_subject_analysis},
    { path: '/goods_cate',name:"商品分类", component: goods_cate},
    { path: '/goods_analysis',name:"商品分析", component: goods_analysis},
    { path: '/supplier_ranking',name:"供应商排行", component: supplier_ranking},
    { path: '/inventory_summary',name:"商品库存信息", component: inventory_summary},
    { path: '/no_the_new',name:"公共款店铺上新情况", component: no_the_new},
    { path: '/rob_table',name:"抢货报表", component: rob_table},
    { path: '/focus_follow_style',name:"重点跟进款式", component: focus_follow_style},
    { path: '/delivery_situation',name:"仓库发货情况统计", component: delivery_situation},
    { path: '/store_new_style',name:"店铺款式上新", component: store_new_style},
    { path: '/thp_table',name:"烫画片使用报表", component: thp_table},
    { path: '/erdept_internal',name:"二部内部款", component: erdept_internal},
    { path: '/style_code',name:"商品编码", component: style_code},
    { path: '/delist_data',name:"下架款数据", component: delist_data},
    { path: '/replace_send',name:"代发系统", component: replace_send},
    { path: '/store_sales_forecast',name:"店长销售收入预估", meta:{
        isUseCache:false,
        keepAlive:true
    },component: store_sales_forecast}, // 店长销售收入预估
    { path: '/create_target',name:"店铺填报", component: create_target}, // 店长填报
    { path: '/audit_dept',name:"审核表（项目部审核店铺）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: audit_dept},
    { path: '/sales_forecast_dept',name:"销售额预估表（项目部）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: sales_forecast_dept},
    { path: '/store_target',name:"拆分店铺", component: store_target},
    { path: '/audit_division',name:"审核表（事业部审核项目部）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: audit_division},
    { path: '/sales_forecast_division',name:"销售额预估表（事业部）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: sales_forecast_division},
    { path: '/dept_target',name:"拆分项目部（事业部）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: dept_target},
    { path: '/audit_manager',name:"审核表（总经理）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: audit_manager},
    { path: '/dept_target_manager',name:"审核表（总经理）", meta:{
        isUseCache:false,
        keepAlive:true
    },component: dept_target_manager},
    { path: '/data_export',name:"数据导出", component: data_export},
    { path: '/dw_delivery',name:"得物发货情况分析", component: dw_delivery},
    { path: '/er_dept',name:"得物采购下单（二部）", component: er_dept},
    { path: '/si_dept',name:"得物采购下单（四部）", component: si_dept},
    { path: '/purchase_summary',name:"得物采购报货", component: purchase_summary},
    { path: '/lack_feekback',name:"得物-缺货跟踪情况", component: lack_feekback},
    { path: '/demand_report',name:"运营需求报表", meta:{
        isUseCache:false,
        keepAlive:true
    }, component: demand_report},
    { path: '/created_demand',name:"新建外采需求", component: created_demand},
    { path: '/procurement_info',name:"运营外采信息", component: procurement_info},
    { path: '/human_effect',name:"人效看板", component: human_effect},

    ]
}
]
})
// 路由跳转前的钩子
// router.beforeEach(function (to, from, next) {
//   let path = to.fullPath;
//   sessionStorage.setItem("tab",path);
//   next()
// })
// router.beforeEach((to,from,next)=>{
//   if(to.matched.some(res=>res.meta.isLogin)){//判断是否需要登录
//     if (sessionStorage['username']) {
//       next();
//     }else{
//       next({
//         path:"/login",
//         query:{
//           redirect:to.fullPath
//         }
//       });
//     }
//   }else{
//     next()
//   }
// });




const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router;