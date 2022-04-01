import Vue from 'vue'
import Router from 'vue-router'

const home = resolve=>require(['@/pages/home'],resolve)
//业绩指标
const store_data = resolve=>require(['@/pages/Results/StoreResults/store_data'],resolve)
const store_results = resolve=>require(['@/pages/Results/store_results'],resolve)
const category_analysis = resolve=>require(['@/pages/Results/category_analysis'],resolve)
//缓冲机制
const test_market = resolve=>require(['@/pages/Buffer/test_market'],resolve)
const supplement = resolve=>require(['@/pages/Buffer/supplement'],resolve)
const stop_replenish = resolve=>require(['@/pages/Buffer/stop_replenish'],resolve)
const clear_goods = resolve=>require(['@/pages/Buffer/clear_goods'],resolve)
const property_rights = resolve=>require(['@/pages/Buffer/property_rights'],resolve)
const report_page = resolve=>require(['@/pages/Buffer/report_page'],resolve)
const goods_nature = resolve=>require(['@/pages/Buffer/goods_nature'],resolve)
//审计管理
const audit_index = resolve=>require(['@/pages/Audit/audit_index'],resolve)
//库存情况汇总
const inventory_summary = resolve=>require(['@/pages/Inventory/inventory_summary'],resolve)
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
//店铺信息
const store_info = resolve=>require(['@/pages/StoreInfo/store_info'],resolve)
//运营中心
const new_data = resolve=>require(['@/pages/Operations/GoodsInfo/new_data'],resolve)    //上新数据
const delivery_data = resolve=>require(['@/pages/Operations/GoodsInfo/delivery_data'],resolve)    //发货数据
const operations_data_analysis = resolve=>require(['@/pages/Operations/operations_data_analysis'],resolve)    //发货数据
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
Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/',
    component: home,
    children:[
    { path: '/store_data',name:"店铺日数据", component: store_data},
    { path: '/store_results',name:"店铺业绩", component: store_results},
    { path: '/category_analysis',name:"品类分析", component: category_analysis},
    { path: '/test_market',name:"试销管理", component: test_market},
    { path: '/supplement',name:"补货管理", component: supplement},
    { path: '/stop_replenish',name:"停止进货", component: stop_replenish},
    { path: '/clear_goods',name:"清货管理", component: clear_goods},
    { path: '/property_rights',name:"货品性质权限", component: property_rights},
    { path: '/report_page',name:"分析报告", component: report_page},
    { path: '/goods_nature',name:"货品性质管理", component: goods_nature},
    { path: '/audit_index',name:"审计管理", component: audit_index},
    { path: '/inventory_summary',name:"库存情况汇总", component: inventory_summary},
    { path: '/permssions_index',name:"权限管理", component: permssions_index},
    { path: '/role_user',name:"角色人员", component: role_user},
    { path: '/data_role_user',name:"数据权限人员", component: data_role_user},
    { path: '/data_fill',name:"数据填报", component: data_fill,meta:{keepAlive:true}},
    { path: '/data_management',name:"数据管理", component: data_management},
    { path: '/commit_data',name:"表单数据", component: commit_data},
    { path: '/shelves_feedback',name:"下架款登记", component: shelves_feedback},
    { path: '/store_info',name:"店铺信息", component: store_info},
    { path: '/new_data',name:"上新数据", component: new_data},
    { path: '/delivery_data',name:"发货数据", component: delivery_data},
    { path: '/operations_data_analysis',name:"运营中心数据分析", component: operations_data_analysis},
    { path: '/store_sales_forecast',name:"店长销售收入预估", component: store_sales_forecast}, // 店长销售收入预估
    { path: '/create_target',name:"店铺填报", component: create_target}, // 店长填报
    { path: '/audit_dept',name:"审核表（项目部审核店铺）", component: audit_dept},
    { path: '/sales_forecast_dept',name:"销售额预估表（项目部）", component: sales_forecast_dept},
    { path: '/store_target',name:"拆分店铺", component: store_target},
    { path: '/audit_division',name:"审核表（事业部审核项目部）", component: audit_division},
    { path: '/sales_forecast_division',name:"销售额预估表（事业部）", component: sales_forecast_division},
    { path: '/dept_target',name:"拆分项目部（事业部）", component: dept_target},
    { path: '/audit_manager',name:"审核表（总经理）", component: audit_manager},
    { path: '/dept_target_manager',name:"审核表（总经理）", component: dept_target_manager}
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