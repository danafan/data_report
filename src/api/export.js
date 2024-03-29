import { MessageBox,Message } from 'element-ui';
import {middleWare} from './request.js'
import * as dd from 'dingtalk-jsapi';
import store from '../store/index.js'
import axios from './index.js'

import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

function formatJson(filterVal, jsonData) {
	return jsonData.map(v => filterVal.map(j => v[j]))
}
export function exportExcel(data_obj,is_multi) {
	MessageBox.confirm('确认导出?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		if(is_multi === true){	//多级表头加合并单元格
			require.ensure([], () => {
				　const { export_json_to_excel_2 } = require('../vendor/Export2Excel.js')
				　const multiHeader = [data_obj.multiHeader];
				const header = data_obj.header;
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
				const merges = [
					"A1:A2",
					"B1:B2"
					]
				export_json_to_excel_2({multiHeader,header:header, data,merges, filename:data_obj.filename + "-" + tadayDate});
			})

		}else{
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
		}
	}).catch(() => {
		Message({
			type: 'info',
			message: '取消导出'
		});          
	});
}

function exportSet(url,req,code){
	//验证参数加密
	var val_get_str = middleWare({...req,...{export_flag:1}},'get');
	//导出参数加密
	let arg = {
		export_flag:2
	}
	if(!!code){
		arg.code = code;
	}
	var get_str = middleWare({...req,...arg},'get');

	var val_open_url = `${location.origin}/api/${url}?${val_get_str}`;//验证
	var open_url = `${location.origin}/api/${url}?${get_str}`;//导出

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
		var new_url = url;
		var arg = {};
		if(url.indexOf('?') > -1){
			//处理url
			new_url = url.split('?')[0];
			//处理参数
			let req_arr = url.split('?')[1].split('&');
			req_arr.map(item => {
				arg[item.split('=')[0]] = item.split('=')[1];
			});
		}
		if(!!store.state.is_ding_talk){  //钉钉
        	//获取code
			dd.ready(() => {
				dd.runtime.permission.requestAuthCode({
					corpId: "ding7828fff434921f5b",
					onSuccess: res =>{
                		//获取钉钉用户信息
						let code = res.code;
						exportSet(new_url,arg,code);
					},
					onFail : err => {
						alert('dd error: ' + JSON.stringify(err));
					}
				});
			});
		}else{
			exportSet(new_url,arg);
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


//自定义导出表格，直接导出
export function exportTable(ele,name){
	MessageBox.confirm('确认导出?', '提示', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning'
	}).then(() => {
		const wb = XLSX.utils.table_to_book(ele, {raw:true})
		const wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST:true, type: 'array'})
		FileSaver.saveAs(
			new Blob([wbout],{type: 'application/octet-stream'}),
			`${name}.xlsx`,
			)
	}).catch(() => {
		Message({
			type: 'info',
			message: '取消导出'
		});          
	});
}

