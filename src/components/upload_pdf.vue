<template>
	<div>
		<div class="imgBox" v-if="fileName == '' && !onlyView">
			<el-button size="medium">选择上传pdf<i class="el-icon-upload el-icon--right"></i></el-button>
			<input type="file" ref="pdfUpload" class="upload_file" accept="application/pdf" @change="uploadPdf">
		</div>
		<el-tag :closable="!onlyView" @close="deteleFile" v-else>{{`${!fileName?'未上传':fileName}`}}</el-tag>
	</div>
</template>
<style lang="less" scoped>
	.imgBox{
		position: relative;
		width:136px;
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
			//文件名称
			fileName:{
				type:String,
			default:''
			},
			//是否只读
			onlyView:{
				type:Boolean,
			default:false
			}
		},
		methods:{
			//上传pdf
			uploadPdf(){
				if (this.$refs.pdfUpload.files.length > 0) {
					let files = this.$refs.pdfUpload.files;
					resource.uploadImage({image:files[0],type:5}).then(res => {
						this.$refs.pdfUpload.value = null;
						if(res.data.code == 1){
							this.$emit('callbackFn',res.data.data.urls);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//删除文件
			deteleFile(){
				resource.delImage({url:this.fileName}).then(res => {
					if(res.data.code == 1){
						this.$emit('callbackFn','');
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},

		}


	}
</script>