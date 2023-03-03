<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
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
    methods: {
      //单独页面刷新
      reload () {
        this.isRouterAlive = false
        this.$nextTick( () => {
          this.isRouterAlive = true
        })
      }
    }

  }
</script>