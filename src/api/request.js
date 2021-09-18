import axios from './index'
import md5 from 'js-md5';
import { Message } from 'element-ui';

//中间处理
export function middleWare(params,type) { 
  var target = {
    ding_user_id:!localStorage.getItem("ding_user_id")?'':localStorage.getItem("ding_user_id"),
    login_token:!localStorage.getItem("login_token")?'':localStorage.getItem("login_token"),
    secret_key:!localStorage.getItem("secret_key")?'':localStorage.getItem("secret_key"),
    timestamp:((new Date()).getTime()/1000).toString().split('.')[0]
  };
  console.log(target)
  // 生成签名
  var create_sign = {...params,...target};
  var keys = [];        // 所有键名
  var sort_obj = {};    // 排好序的参数对象
  
  // 键名数组
  for(let key of Object.keys(create_sign)){ 
    keys.push(key);
  }
  // 键名排序
  var sort_keys = keys.sort(); 
  sort_keys.map(item => {
    let val = create_sign[item];
    sort_obj[item] = val;
  })
  var sign_arr = [];
  for(let key in sort_obj){
    // sign_arr.push(`${key}=${sort_obj[key]}`);
    if(key != 'file'){
      sign_arr.push(`${key}=${sort_obj[key]}`);
    }
  }
  
  //sign
  var sign = md5(sign_arr.join('&'));
  //token
  var Base64 = require('js-base64').Base64;
  var token_obj = {...target,...{sign:sign}};
  var token = Base64.encode(JSON.stringify(token_obj));
  //组织参数
  // var req = {...params,...{sign:sign,token:token}};
  var req = {...params,...{sign:sign,admin_id:'15262575868677723',token:token}};
  var get_arr = [];
  //post请求参数
  var form = new FormData();
  for(let key in req){
    form.append(key, req[key]);
    get_arr.push(`${key}=${req[key]}`);
  }
  //get请求参数
  var get_str = get_arr.join('&');
  return type == 'get'?get_str:form;
}

export default {
  post(path, params={}){
    var form = middleWare(params,'post');
    return axios.post(`${path}`, form);
  },
  get(path, params={}){
    var str = middleWare(params,'get');
    return axios.get(`${path}?${str}`);
  }
}
