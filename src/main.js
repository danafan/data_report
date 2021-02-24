import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
 import Print from 'vue-print-nb'

Vue.use(ElementUI);
Vue.use(Print);
Vue.prototype.judgmentMoney = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
// Vue.prototype.judgmentMoney = /^0{1}[.]?$|^[1-9]\d*([.]{1}[0-9]{1,2})?$/;//费率正则（最多两位小数且前面不能多0）
// Vue.prototype.captcha = `${location.origin}/admin/admin/captcha`;		//获取验证码前缀
// Vue.prototype.qn_url = 'http://img.gxk8090.com/';						//七牛云图片前缀前缀
new Vue({
  render: h => h(App),
  router
}).$mount('#app')
