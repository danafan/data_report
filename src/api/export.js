import { MessageBox,Message } from 'element-ui';

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

