import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import resource from '../api/resource.js'
import * as dd from 'dingtalk-jsapi';


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  
    menu_list:[],           //所有菜单列表
    current_tab:'',         //当前选中的tab
    is_ding_talk:dd.env.platform != 'notInDingTalk',      //是否钉钉环境（默认是）
    dept_list:[],           //缓冲机制部门列表
    pl_list:[],             //缓冲机制品类列表
  },
  mutations: {
    // 导航列表
    menuList (state, list) {  
      state.menu_list = list;
    },
    //当前选中的tab
    currentTab (state, current_tab) {  
      state.current_tab = current_tab;
    },
    // 部门列表
    setDeptList (state, list) {  
      state.dept_list = list;
    },
    // 品类列表
    setPlList (state, list) {  
      state.pl_list = list;
    },
  },
  actions: {
    
  }

})
export default store;

