<template>
	<div class="upload_box pointer">
		<el-button type="primary" plain size="small" class="pointer">
			{{button_name}}
			<i class="el-icon-upload el-icon--right"></i>
		</el-button>
		<input type="file" ref="csvUpload" class="upload_file pointer" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
	</div>
</template>
<script type="text/javascript">
	import {importExcel} from '../utils/tool.js'
	export default{
		props:{
			//按钮名称
			button_name:{
				type:String,
			default:""
			},
			table_key:{
				type:String,
			default:""
			},
		},
		methods:{
			//批量导入内部订单号
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					importExcel(files[0],this.table_key).then(res => {
						this.clearInput();
						if(!res.is_clear){
							let nbddh_arr = [];
							res.outdata.map(item => {
								nbddh_arr.push(item[this.table_key])
							})
							this.$emit('importCallBack',nbddh_arr);
						}
					})
				}
			},
			//清除input内容
			clearInput(){
				this.$refs.csvUpload.value = null;
			}
		}
	}
</script>
<style lang="less" scoped>
	.upload_box{
		margin-left: 10px;
		margin-right: 10px;
		position: relative;
		.upload_file{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
</style>
