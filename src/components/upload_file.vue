<template>
	<div>
		<div class="imgBox">
			<img class="upload_icon" src="../static/upload_icon.png">
			<div class="upload_text">上传{{is_csv?'表格':'图片'}}</div>
			<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv" v-if="is_csv">
			<input type="file" ref="imgUpload" class="upload_file" accept="image/*" multiple @change="uploadFn" v-else>
		</div>
	</div>
</template>
<style lang="less" scoped>
.imgBox{
	border:1px solid #D9D9D9;
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content:center;
	align-items:center;
	width: 120px;
	height: 120px;
	color: #666666;
	.upload_icon{
		width: 40px;
		height: 40px;
	}
	.upload_text{
		font-size: 12px;
	}
	.upload_file {
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
<script>
	import resource from '../api/auditResource.js'
	export default{
		props:{
			current_num:{
				type:Number,
				default:0
			},
			max_num:{
				type:Number,
				default:1
			},
			is_csv:{
				type:Boolean,
				default:false
			},
			is_max:{
				type:Boolean,
				default:true
			}
		},
		methods:{
			// 上传图片
			uploadFn(){
				if (this.$refs.imgUpload.files.length > 0) {
					let files = this.$refs.imgUpload.files;
					if(this.is_max == true){
						if(this.current_num + this.$refs.imgUpload.files.length > this.max_num){
							this.$refs.imgUpload.value = null;
							this.$message.warning(`图片最多不超过${this.max_num}张`);
							return;
						}
					}
					// if(this.current_num + this.$refs.imgUpload.files.length > 9 && this.is_max == true){
					// 	this.$refs.imgUpload.value = null;
					// 	this.$message.warning('图片最多不超过9张');
					// 	return;
					// }
					for(var i = 0;i < files.length;i ++){
						resource.uploadImage({image:files[i]}).then(res => {
							this.$refs.imgUpload.value = null;
							if(res.data.code == 1){
								this.$emit('callbackFn',{
									file:res.data.data
								});
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
			//上传表格
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.uploadExcel({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							this.$emit('callbackFn',{
								file:res.data.data
							});
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}

		}


	}
</script>