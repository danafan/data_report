<template>
	<div>
		<el-form size="small" class="demo-form-inline">
			<el-form-item label="缓冲机制-所有部门数据权限">
				<el-select v-model="special_list" clearable multiple filterable reserve-keyword placeholder="请选择">
					<el-option v-for="i in user_data" :key="i.ding_user_id" :label="i.ding_user_name" :value="i.ding_user_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-button type="primary" size="small" @click="save">保存</el-button>
		</el-form>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import form_data_resource from '../../../api/formDataResource.js'
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				user_data:[],		//钉钉用户列表
				special_list:[],	//选中的权限列表
			}
		},
		created(){
			//获取钉钉用户列表
			this.ajaxUser();
		},
		methods:{
			//获取钉钉用户列表
			ajaxUser(){
				form_data_resource.ajaxUser().then(res => {
					if(res.data.code == 1){
						this.user_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				}).then(() => {
					//获取详情
					this.specialSettingGet();
				});
			},
			//获取详情
			specialSettingGet(){
				resource.specialSettingGet().then(res => {
					if(res.data.code == 1){
						this.special_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//保存
			save(){
				this.$confirm('确认保存?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let req = {
						buffer_manager:this.special_list.join(',')
					}
					resource.specialSettingPost(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			}

		}
	}
</script>
















