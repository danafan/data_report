import { MessageBox,Message } from 'element-ui';
import md5 from 'js-md5';

import {middleWare} from './request.js'

export default{
	exportUp(url){
		MessageBox.confirm('确认导出?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			let req = {};
			let req_arr = url.split('?')[1].split('&');
			req_arr.map(item => {
				req[item.split('=')[0]] = item.split('=')[1];
			})
      let get_str = middleWare(req,'get');
      let open_url = `${location.origin}/api/${url.split('?')[0]}?${get_str}`;
      window.open(open_url);
    }).catch(() => {
     Message({
      type: 'info',
      message: '取消导出'
    });          
   });
  }
}
