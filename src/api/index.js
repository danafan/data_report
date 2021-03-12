import axios from 'axios'
import router from '../router/index.js'
import { Message,Loading } from 'element-ui';
const baseURL = `${location.origin}/api/`;
// 创建axios实例，可以自定义配置
const instance = axios.create({
  baseURL,
});
let loading;
let loadCount = 0;
let loadingArray=[]; 
function startLoading() {
  loadCount++;
  loading = Loading.service({
    target: '.main',
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(255, 255, 255, 0.6)',
    spinner: 'el-icon-loading'
  })
  loadingArray.push(loading)
}

function endLoading() {
  loadCount--;
  if (!loadCount) { 
    loadingArray.forEach(item =>item.close()) 
  } 
}

instance.interceptors.request.use(
  config => {
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbl9pZCI6IjE1MzU5NDE0NTEwNjU0MDEwIiwiaXNzIjoiYWRtaW4iLCJpYXQiOjE2MTU1NDE3MDMsImV4cCI6MTYxNTU1NjEwMywibmJmIjoxNjE1NTQxNzAzLCJzdWIiOiJEYXRhQ2VudGVyIiwianRpIjoiNDFhY2E4ZGNkYjNiOGRiMjE5YThlM2IwOTQ5Njc0NTIifQ.2WXNdqoCNQpsIJ977h9wboisKUWCc3zDaUc-HROgpUg";
    config.headers.Token = token;

    // if(localStorage.getItem('token')){
    //     config.headers.Token = localStorage.getItem('token');
    // }
    startLoading();
    return config
  },error => {
    endLoading()
    return Promise.reject(error)
  })
instance.interceptors.response.use(response => {
  endLoading()
  switch (response.data.code) {
    case 10000:
    localStorage.clear();
    router.replace("/login");
  }
  return response;
},function (error) {
  endLoading()
  if (error.response) {
    switch (error.response.status) {
      case 404:
      window.alert('参数错误');
      break;
      case 500:
      window.alert('服务器故障');
      break;
      case 504:
      window.alert('没有网络');
      break;
    }
  }
});

export default instance;