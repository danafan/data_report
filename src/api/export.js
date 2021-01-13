import { MessageBox,Message } from 'element-ui';

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
			let admin_id = localStorage.getItem("admin_id");
			let secret_key = localStorage.getItem("secret_key");
			let login_token = localStorage.getItem("token");
			let timestamp = ((new Date()).getTime()/1000).toString().split('.')[0];
			if(!!admin_id){
				req.admin_id = admin_id;
				req.login_token = login_token;
				req.timestamp = timestamp;
				req.random = Math.random();
			}
			let str = '';
			let arr = [];
			for(let a of Object.keys(req)){
				arr.push(a);
			}
			let arrSort = arr.sort();
			for(let b of arrSort){
				let val = req[b];
				str += `${b}=${val}&`;
			}
			let secret = `secret_key=${secret_key}`;
			let sign = md5(str + secret);
			str += `sign=${sign}`
			let open_url = `${location.origin}/store/${url.split('?')[0]}?${str}`;
			window.open(open_url);
		}).catch(() => {
			Message({
				type: 'info',
				message: '取消导出'
			});          
		});
	}
}
