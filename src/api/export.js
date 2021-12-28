import { MessageBox,Message } from 'element-ui';
import {middleWare} from './request.js'
import * as dd from 'dingtalk-jsapi';
import store from '../store/index.js'
import axios from './index.js'

function formatJson(filterVal, jsonData) {
	return jsonData.map(v => filterVal.map(j => v[j]))
}
export function exportExcel(data_obj) {
	MessageBox.confirm('确认导出?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		require.ensure([], () => {
			　const { export_json_to_excel } = require('../vendor/Export2Excel.js')
			　const tHeader = data_obj.table_title_list;
			　const filterVal = data_obj.field_name_list;
			　const list = data_obj.data_list;
			　const data = formatJson(filterVal,list);
			let today = new Date();
			let tadayDate =
			today.getFullYear() +
			"-" +
			(today.getMonth() + 1) +
			"-" +
			today.getDate();
			　export_json_to_excel(tHeader, data, data_obj.table_title + "-" + tadayDate);
		})
	}).catch(() => {
		Message({
			type: 'info',
			message: '取消导出'
		});          
	});
}

function exportSet(url,req){
	var get_str = middleWare(req,'get');

	var val_open_url = '';	//验证
	var open_url = '';		//导出

	if(url.indexOf('?') > -1){
		let req_arr = url.split('?')[1].split('&');
		req_arr.map(item => {
			req[item.split('=')[0]] = item.split('=')[1];
		})
		val_open_url = `${location.origin}/api/${url.split('?')[0]}?${get_str}&export_flag=1`;//验证
		open_url = `${location.origin}/api/${url.split('?')[0]}?${get_str}&export_flag=2`;//导出
	}else{
		val_open_url = `${location.origin}/api/${url}?${get_str}&export_flag=1`;//验证
		open_url = `${location.origin}/api/${url}?${get_str}&export_flag=2`;//导出
	}
	//导出前验证
	axios.get(val_open_url).then(res => {
		if(res.data.code == 1){
			window.open(open_url);
		}else{
			Message({
				type: 'warning',
				message: res.data.msg
			});
		}
	})
}

export function exportUp(url){
	MessageBox.confirm('确认导出?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		if(!!store.state.is_ding_talk){  //钉钉
        	//获取code
        	dd.ready(() => {
        		dd.runtime.permission.requestAuthCode({
        			corpId: "ding7828fff434921f5b",
        			onSuccess: res =>{
                		//获取钉钉用户信息
                		let code = res.code;
                		exportSet(url,{code:code});
                	},
                	onFail : err => {
                		alert('dd error: ' + JSON.stringify(err));
                	}
                });
        	});
        }else{
        	exportSet(url,{});
        }
    }).catch(() => {
    	Message({
    		type: 'info',
    		message: '取消导出'
    	});          
    });
}

export function exportPost(data,name){
	const blob = new Blob([data], {type: 'text/csv,charset=UTF-8'})
	let today = new Date();
	let tadayDate =
	today.getFullYear() +
	"-" +
	(today.getMonth() + 1) +
	"-" +
	today.getDate();
	const fileName = name + '-' + tadayDate + '.csv'
	const elink = document.createElement('a')
	elink.download = fileName
	elink.style.display = 'none'
	elink.href = URL.createObjectURL(blob)
	document.body.appendChild(elink)
	elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
}

