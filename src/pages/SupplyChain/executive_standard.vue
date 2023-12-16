<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="标准名称：">
				<el-input v-model="search" clearable placeholder="请输入标准名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="exportFn" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="executive_standard" max_height="630" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack" :button_list="button_list"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handleCurrentChange"/>
	</div>
</template>
<script>
	import demandResource from '../../api/demandResource.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import CustomTable from '../../components/custom_table.vue'
	import PageWidget from '../../components/pagination_widget.vue'
	export default{
		data(){
			return{
				search:"",									//标准名称
				sort:"",
				page:1,
				pagesize:20,
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,
				button_list:{},
				loading:false,
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//获取列表
			getData(){
				let arg = {
					search:this.search,
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.standardList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
						this.button_list = data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序回调
			sortCallBack(sort){
				this.sort = sort;
                //获取列表
				this.getData();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						search:this.search,
						sort:this.sort,
					}
					demandResource.standardExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'商品执行标准');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}
		},
		components:{
			CustomTable,
			PageWidget
		}
	}
</script>
<style type="text/css">
	.el-tooltip__popper{
		max-width: 350px;
	}
</style>
<style lang="less" scoped>
	.buts{
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>










