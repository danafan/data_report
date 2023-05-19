import { MessageBox,Message } from 'element-ui';
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

//导入文件获取文件内容
export function importExcel(file,key){
	return new Promise( (resolve, reject) => {
		var reader = new FileReader();
		FileReader.prototype.readAsBinaryString = (file) => {
			var binary = "";
			var wb; 
			var outdata
			var reader = new FileReader();
			reader.onload = (e) => {
				var bytes = new Uint8Array(reader.result);
				var length = bytes.byteLength;
				for (var i = 0; i < length; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				wb = XLSX.read(binary, {
					type: "binary"
				});
				outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
				let is_clear = false;
				if(outdata.length == 0){
					Message.warning('表格为空!');
					is_clear = true;
				}else{
					if(outdata[0].hasOwnProperty(key)){
						is_clear = false;
					}else{
						Message.warning(`该表格不包含${key}列!`);
						is_clear = true;
					}
				}
				let arg = {
					outdata:outdata,
					is_clear:is_clear
				}
				resolve(arg);
			};
			reader.readAsArrayBuffer(file);
		};
		reader.readAsBinaryString(file);
	});
}

