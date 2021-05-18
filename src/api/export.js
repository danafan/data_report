import { MessageBox,Message } from 'element-ui';
import {middleWare} from './request.js'

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
			　export_json_to_excel(tHeader, data, data_obj.table_title);
		})
	}).catch(() => {
		Message({
			type: 'info',
			message: '取消导出'
		});          
	});
}

export function exportUp(url){
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

