<template>
	<div>
		<el-table :data="tableObj.data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" style="width: 100%" size="small" v-loading="loading">
			<el-table-column prop="form_name" label="表单名" align="center"></el-table-column>
			<el-table-column sortable prop="add_time" label="最近提交时间" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="表单创建者" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getLog(scope.row)">查看记录</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="tableObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style scoped lang="less">

</style>
<script>
	import resource from '../../../api/formDataResource.js'
	export default{
		data(){
			return{
				page:1,
				page_size:10,
				tableObj:{},
				loading:false
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		props:{
			name:{
				type:String,
				default:""
			}
		},
		methods:{
			//搜索
			search(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//表格分页
			handleSizeChange(val) {
				this.page_size = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					name:this.name,
					page:this.page,
					pagesize:this.page_size
				}
				this.loading = true;
				resource.submitLog(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.tableObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看记录
			getLog(item){
				let log_id = item.log_id;
				let form_id = item.form_id;
				let form_name = item.form_name;
				this.$router.push(`/commit_data?log_id=${log_id}&form_id=${form_id}&form_name=${form_name}`)
			}
		}
	}
</script>