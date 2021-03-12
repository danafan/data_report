import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import resource from '../api/resource.js'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  
    menu_list:[],           //所有菜单列表
    permissions_tab:'',     //权限当前选中tab
  },
  mutations: {
    // 导航列表
    menuList (state, list) {  
      state.menu_list = list;
    },
    //权限当前选中tab
    checkPerTab (state, tab) {  
      state.permissions_tab = tab;
    }
  },
  actions: {
    
  }

})
export default store;

