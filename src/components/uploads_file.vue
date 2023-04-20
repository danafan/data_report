<template>
	<div class="img_list">
		<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
			<img class="img" :src="item.domain + item.urls">
			<div class="modal" v-if="item.is_del == true">
				<img src="../static/deleteImg.png" @click="deteleFile(item.urls,index)">
			</div>
		</div>
		<div class="imgBox" v-if="show_img.length < max_num && !onlyView">
			<img class="upload_icon" src="../static/upload_icon.png">
			<div class="upload_text">上传图片</div>
			<input type="file" ref="imgUpload" class="upload_file" accept="image/*" :multiple="multiple" @change="uploadFn">
		</div>
	</div>
</template>
<script>
	import resource from '../api/auditResource.js'
	export default{
		data(){
			return{
				show_img:[],		//当前已上传的图片列表
			}
		},
		props:{
			//当前默认的图片列表
			current_images:{
				type:Array,
				default:()=>[]
			},
			//最多图片数量
			max_num:{
				type:Number,
				default:1
			},
			//是否只读
			onlyView:{
				type:Boolean,
				default:false
			},
			//是否多选
			multiple:{
				type:Boolean,
				default:true
			},
		},
		created(){
			this.show_img = this.current_images;
			console.log(this.show_img)
		},
		methods:{
			// 上传图片
			uploadFn(){
				if (this.$refs.imgUpload.files.length > 0) {
					let files = this.$refs.imgUpload.files;
					if(this.multiple == true){
						if(this.show_img.length + this.$refs.imgUpload.files.length > this.max_num){
							this.$refs.imgUpload.value = null;
							this.$message.warning(`图片最多不超过${this.max_num}张`);
							return;
						}
					}
					for(var i = 0;i < files.length;i ++){
						resource.uploadImage({image:files[i]}).then(res => {
							this.$refs.imgUpload.value = null;
							if(res.data.code == 1){
								let data = res.data.data;
								data['is_del'] = false;
								this.show_img.push(data);
								//向组件传递参数
								this.callbackFn(this.show_img);
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
				
			},
			//删除文件
			deteleFile(url,index){
				resource.delImage({url:url}).then(res => {
					if(res.data.code == 1){
						this.show_img.splice(index,1);
						//向组件传递参数
						this.callbackFn(this.show_img);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//向组件传递参数
			callbackFn(){
				let arr = this.show_img.map(item => {
					return item.urls;
				})
				this.$emit('callback',arr)
			}
		}
	}
</script>
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
.img_list{
	display:flex;
	flex-wrap: wrap;
	.dialog_img{
		margin-right: 10px;
		margin-bottom: 10px;
		position: relative;
		width: 120px;
		height: 120px;
		.img{
			width: 100%;
			height: 100%;
		}
		.modal{
			background: rgba(0,0,0,.6);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			img{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				display:block;
				width: 30px;
				height: 30px;
			}
		}
	}
}
</style>