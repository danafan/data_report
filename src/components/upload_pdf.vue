<template>
	<div>
		<div class="imgBox" v-if="fileName == '' && !onlyView">
			<el-button size="medium">选择上传pdf<i class="el-icon-upload el-icon--right"></i></el-button>
			<input type="file" ref="pdfUpload" class="upload_file" accept="application/pdf" @change="uploadPdf">
		</div>
		<el-tag class="custom_tag" :closable="!onlyView" @close="deteleFile" v-else>
			<el-tooltip class="item" effect="dark" :content="`${!fileName?'未上传':fileName}`" placement="top">
				<div class="file_name">{{`${!fileName?'未上传':fileName}`}}</div>
			</el-tooltip>
		</el-tag>
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
	.custom_tag{
		display: flex;
		align-items: center;
	}
	.file_name{
		width: 224px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow:ellipsis;
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
			//文件url
			fileUrl:{
				type:String,
			default:''
			},
			//是否只读
			onlyView:{
				type:Boolean,
			default:false
			},
			//是否上传原文件名
			nameType:{
				type:String,
			default:'0'
			}
		},
		methods:{
			//上传pdf
			uploadPdf(){
				if (this.$refs.pdfUpload.files.length > 0) {
					let files = this.$refs.pdfUpload.files;
					var name = files[0].name;
					resource.uploadImage({image:files[0],name_type:this.nameType,type:5}).then(res => {
						this.$refs.pdfUpload.value = null;
						if(res.data.code == 1){
							let arg = {
								name:this.nameType == '1'?name:res.data.data.urls,
								urls:res.data.data.urls
							}
							this.$emit('callbackFn',arg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//删除文件
			deteleFile(){
				resource.delImage({url:this.fileUrl}).then(res => {
					if(res.data.code == 1){
						this.$emit('callbackFn',null);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},

		}


	}
</script>