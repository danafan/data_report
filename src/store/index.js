import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";
import resource from '../api/resource.js'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {  
    menu_list:[]
  },
  mutations: {
    // 导航列表
    menuList (state, list) {  // store中的数据只能通过commit mutation来改变
      state.menu_list = list;
    }
  },
  actions: {
    
  }

})
export default store;

