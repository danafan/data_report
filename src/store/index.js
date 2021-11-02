import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import resource from '../api/resource.js'
import * as dd from 'dingtalk-jsapi';


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  
    menu_list:[],           //所有菜单列表
    permissions_tab:'',     //权限当前选中tab
    current_tab:'',         //当前选中的tab
    is_ding_talk:dd.env.platform == 'notinDingTalk',      //是否钉钉环境
  },
  mutations: {
    // 导航列表
    menuList (state, list) {  
      state.menu_list = list;
    },
    //权限当前选中tab
    checkPerTab (state, tab) {  
      state.permissions_tab = tab;
    },
    //当前选中的tab
    currentTab (state, current_tab) {  
      state.current_tab = current_tab;
    }
  },
  actions: {
    
  }

})
export default store;

