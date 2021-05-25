<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  import * as dd from 'dingtalk-jsapi';
  import watermark from './api/watermark.js'
  import resource from './api/resource.js'
  export default {
    provide () {
      return {
        reload: this.reload
      }
    },
    data () {
      return {
        isRouterAlive: true
      }
    },
    created(){
      this.$router.push('/home'); 
      //获取code
      // this.GetCode();
    },
    methods: {
      //获取code
      GetCode(){
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            corpId: "ding7828fff434921f5b",
            onSuccess: res =>{
                //获取钉钉用户信息
                let code = res.code;
                //获取用户id
                this.GetUserId(code);
              },
              onFail : err => {
                alert('dd error: ' + JSON.stringify(err));
              }
            });
        });
      },
      //获取用户信息
      GetUserId(code){
        resource.login({code:code}).then(res => {
          if(res.data.code == 1){
            let login_token = res.data.data.login_token;
            localStorage.setItem('login_token',login_token);
            let ding_user_name = res.data.data.ding_user_name;
            localStorage.setItem('ding_user_name',ding_user_name);
            let ding_user_id = res.data.data.ding_user_id;
            localStorage.setItem('ding_user_id',ding_user_id);
            watermark.set(ding_user_name,ding_user_id);
            let secret_key = res.data.data.secret_key;
            localStorage.setItem('secret_key',secret_key);
            this.$router.push('/home');
          }else{
            this.$message.warning(res.data.msg);
          }
        })
      },
      //单独页面刷新
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }

  }
</script>
