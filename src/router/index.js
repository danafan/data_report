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
Vue.use(Router)

const router = new Router({
  routes: [
  {
    path: '/home',
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