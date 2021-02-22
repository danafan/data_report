import Vue from 'vue'
import Router from 'vue-router'

const home = resolve=>require(['@/pages/home'],resolve)
//业务参考
const store_data = resolve=>require(['@/pages/Business/store_data'],resolve)
//业绩指标
const store_results = resolve=>require(['@/pages/Results/store_results'],resolve)
const run_weekly = resolve=>require(['@/pages/Results/run_weekly'],resolve)
const performance = resolve=>require(['@/pages/Results/performance'],resolve)
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
    { path: '/performance',name:"个人绩效", component: performance},
    ]
  }
  ]
})
// 路由跳转前的钩子
router.beforeEach(function (to, from, next) {
  let path = to.fullPath;
  sessionStorage.setItem("tab",path);
  next()
})
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router;