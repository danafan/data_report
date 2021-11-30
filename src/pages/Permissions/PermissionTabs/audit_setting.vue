<template>
	<div class="aduit_box">
		<el-form size="small" class="demo-form-inline">
			<el-form-item label="财务部">
				<el-select v-model="finance_list.selected" clearable multiple filterable reserve-keyword placeholder="请选择">
					<el-option v-for="i in finance_list.users" :key="i.ding_user_id" :label="i.ding_user_name" :value="i.ding_user_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item :label="item.dept_name" v-for="item in list">
				<el-select v-model="item.selected" clearable multiple filterable reserve-keyword placeholder="请选择">
					<el-option v-for="i in item.users" :key="i.ding_user_id" :label="i.ding_user_name" :value="i.ding_user_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-button type="primary" size="small" @click="save">保存</el-button>
		</el-form>
	</div>
</template>
<style lang="less" scoped>
.aduit_box{
	max-height: 750px;
	overflow-y: scroll;
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				finance_list:{},	//财务权限
				list:[],			//审计权限
			}
		},
		created(){
			this.getInfo();
		},
		methods:{
			//获取详情
			getInfo(){
				resource.auditGetSetting().then(res => {
					if(res.data.code == 1){
						this.finance_list = res.data.data.finance_list;
						this.list = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//提交
			save(){
				this.$confirm('确认保存?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var dept_users_arr = [];
					this.list.map(item => {
						if(item.selected.length > 0){
							let dept_user = item.dept_id + '-' + item.selected.join('_');
							dept_users_arr.push(dept_user);
						}
					});
					let arg = {
						dept_users:	dept_users_arr.join(','),
						finance_users:this.finance_list.selected
					};
					resource.auditPostSetting(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						//获取详情
						this.getInfo();
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
















