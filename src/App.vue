<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  // import resource from './api/resource.js'
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
      this.$router.push('/store_results')
      // resource.checkLogin().then(res => {
      //   if(res.data.code != 10000){
      //     let tab = sessionStorage.getItem("tab");
      //     if(!tab || tab == '/'){
      //       this.$router.push('/trade_order')
      //     }else{
      //       this.$router.push(tab)
      //     }
      //   }else{
      //     this.$message.warning(res.data.msg)
      //   }
      // })
    },
    methods: {
      reload () {
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }

  }
</script>
