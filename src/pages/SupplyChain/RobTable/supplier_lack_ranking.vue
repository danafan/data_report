<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="export_row">
			<div class="update_time">更新时间：{{dataObj.update_time}}</div>
			<el-button type="primary" plain size="mini" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" ref="multipleTable" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="630px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="tableSortChange" v-loading="loading">
			<el-table-column prop="gys" label="供应商" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="qhs" label="缺货数" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="3_xssl" label="3天销量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="7_xssl" label="7天销量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.export_row{
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom:5px;
	.update_time{
		color: red;
		font-size: 14px; 
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				pagesize:10,
				page:1,
				table_sort:"",
				dataObj:{},
				loading:false
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//表格排序    
			tableSortChange({ column, prop, order }) {  
				if(order){
					this.table_sort = prop + '-' + (order == 'ascending'?'1':'0');
				}else{
					this.table_sort = "";
				}
				this.getList();
			}, 
			//获取列表
			getList(){		
				let arg = {
					gys:this.select_gys_ids.join(','),
					page:this.page,
					pagesize:this.pagesize,
					sort:this.table_sort
				}
				this.loading = true;
				demandResource.supplierShortageRanking(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出
			exportFile(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						gys:this.select_gys_ids.join(','),
						sort:this.table_sort
					}
					demandResource.supplierShortageRankingExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'供应商缺货排行');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			}
		}
	}
</script>