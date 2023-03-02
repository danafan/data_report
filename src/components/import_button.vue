<template>
	<div class="ml-10">
		<el-button type="primary" plain size="small" @click="import_dialog = true">
			导入
			<i class="el-icon-upload el-icon--right"></i>
		</el-button>
		<!-- 导入 -->
		<el-dialog title="导入" :visible.sync="import_dialog" width="30%">
			<div class="down_box">
				<el-button type="primary" plain size="small" @click="downTemplate">下载模版<i class="el-icon-download el-icon--right"></i></el-button>
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="import_dialog = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				import_dialog:false,		//导入弹窗
			}
		},
		props:{
			//导入模版地址
			tempUrl:{
				type:String,
				default:""
			}
		},
		methods:{
			//下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/${this.tempUrl}`);
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let file = this.$refs.csvUpload.files[0];
					this.$emit('importFn',file);
				}
			},
			//清空
			clearValue(){
				this.$refs.csvUpload.value = null;
				this.import_dialog = false;
			}
		}
	}
</script>
<style lang="less" scoped>
.down_box{
	display:flex;
	.upload_box{
		margin-left: 10px;
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
}
</style>

