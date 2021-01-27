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
      // this.$router.push('/store_results');
      //获取code
      this.GetCode();
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
      //获取用户id
      GetUserId(code){
        resource.login({code:code}).then(res => {
          if(res.data.code == 1){
            let user_id = res.data.data.user_id;
            let ding_user_name = res.data.data.ding_user_name;
            let ding_user_id = res.data.data.ding_user_id;
            watermark.set(ding_user_name,ding_user_id)
            //获取用户权限
            this.GetUserApi(user_id);
          }else{
            this.$message.warning(res.data.msg);
          }
        })
      },
      //获取用户权限
      GetUserApi(user_id){
        resource.jsapi({ding_user_id:user_id}).then(res => {
          if(res.data.code == 1){
           this.$router.push('/store_results');
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
