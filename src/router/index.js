import Vue from 'vue'
import Router from 'vue-router'

const home = resolve=>require(['@/pages/home'],resolve)
//业务参考
const store_data = resolve=>require(['@/pages/Business/store_data'],resolve)
//业绩指标
const store_results = resolve=>require(['@/pages/Results/store_results'],resolve)
const run_weekly = resolve=>require(['@/pages/Results/run_weekly'],resolve)
//缓冲机制
const test_market = resolve=>require(['@/pages/Buffer/test_market'],resolve)
const supplement = resolve=>require(['@/pages/Buffer/supplement'],resolve)
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
    { path: '/run_weekly',name:"运营周报", component: run_weekly},
    { path: '/test_market',name:"试销管理", component: test_market},
    { path: '/supplement',name:"补货管理", component: supplement},
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