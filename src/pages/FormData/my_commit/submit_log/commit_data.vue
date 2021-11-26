<template>
	<div>
		<el-button icon="el-icon-arrow-left" size="small" @click="$router.go(-1)">返回</el-button>
		<div class="title">{{form_name}}</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column :prop="item.column_name" :label="item.title" align="center" v-for="item in dataObj.title_list"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style scoped lang="less">
.title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-size: 16px;
	font-weight: bold;
}
</style>
<script>
	import resource from '../../../../api/formDataResource.js'
	export default{
		data(){
			return{
				log_id:"",
				form_id:"",
				form_name:"",
				page:1,
				pagesize:10,
				dataObj:{}
			}
		},
		created(){
			this.log_id = this.$route.query.log_id;
			this.form_id = this.$route.query.form_id;
			this.form_name = this.$route.query.form_name;
			this.submitData();
		},
		methods:{
			//获取列表
			submitData(){
				let arg = {
					log_id:this.log_id,
					form_id:this.form_id,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.submitData(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.submitData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.submitData();
			},
		}
	}
</script>