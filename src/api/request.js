import axios from './index'
import md5 from 'js-md5';

//中间处理
export function middleWare(params,type) { 

  for(let k in params){
    if(typeof(params[k])=='string' && params[k] != ""){
      params[k] = params[k].toString().replace(/(^\s*)|(\s*$)/g,"");
    }
  }

  var ding_user_id = !localStorage.getItem("ding_user_id")?'':localStorage.getItem("ding_user_id");
  var login_token = !localStorage.getItem("login_token")?'':localStorage.getItem("login_token");
  var secret_key = !localStorage.getItem("secret_key")?'':localStorage.getItem("secret_key");

  // 生成签名
  var sign_target = {
    ding_user_id:ding_user_id,
    login_token:login_token,
    secret_key:secret_key,
    timestamp:((new Date()).getTime()/1000).toString().split('.')[0]
  }
  var create_sign = {...params,...sign_target};
  var keys = [];        // 所有键名
  var sort_obj = {};    // 排好序的参数对象
  
  // 键名数组
  for(let key of Object.keys(create_sign)){ 
    keys.push(key);
  }
  // 键名排序
  var sort_keys = keys.sort(); 
  sort_keys.map(item => {
    var val = create_sign[item];
    sort_obj[item] = val;
  })
  var sign_arr = [];
  for(let key in sort_obj){
    if(key != 'image' &&
     key != 'file' && 
     key.indexOf('remark') == -1 && 
     key != "refuse_reason" && 
     key != "version_describe" && 
     key != "without_describe" && 
     key != "special_content" && 
     key != "operation_remark"){
      sign_arr.push(`${key}=${sort_obj[key]}`);
    }
  }
  //sign
  var sign = md5(sign_arr.join('&'));

  //token
  var token_target = {
    login_token:login_token,
    secret_key:secret_key,
    timestamp:((new Date()).getTime()/1000).toString().split('.')[0]
  } 
  var Base64 = require('js-base64').Base64; 
  var token_obj = {...token_target,...{sign:sign}};
  var token = Base64.encode(JSON.stringify(token_obj));
  
  //组织参数
  var req = {...params,...{sign:sign,token:token}};
  // var req = {...params,...{sign:sign,admin_id:'16161349938228000',token:token}};   //审计
  // var req = {...params,...{sign:sign,admin_id:'16242415743283525',token:token}};   //运营
  // var req = {...params,...{sign:sign,admin_id:'15262575868677723',token:token}};   //普通
  // var req = {...params,...{sign:sign,admin_id:'016050173120277413',token:token}};  //老板
  // var req = {...params,...{sign:sign,admin_id:'2217',token:token}};                //超级店长
  // var req = {...params,...{sign:sign,admin_id:'16161349938228000',token:token}};   //店长
  // var req = {...params,...{sign:sign,admin_id:'16145614211961146',token:token}};   //总经理
  // var req = {...params,...{sign:sign,admin_id:'16206259129094905',token:token}};   //事业部
  // var req = {...params,...{sign:sign,admin_id:'16161349938228000',token:token}};   //项目部

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
