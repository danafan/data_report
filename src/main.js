import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import store from './store'
import VueContextMenu from 'vue-contextmenu'

Vue.use(VueContextMenu)
Vue.use(ElementUI);

Vue.prototype.judgmentMoney = /^[\-\+]?(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
Vue.prototype.judgmentQfw = /(?=(?!(\b))(\d{3})+$)/g;//费率正则（最多两位小数且前面不能多0）
Vue.prototype.isNumber = /^[0-9]+.?[0-9]*/; //判断是否是数字。
Vue.prototype.isPrice = /^(([0-9]+)|([0-9]+\.[0-9]{0,2}))$/;	//正数且最多两位小数

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
