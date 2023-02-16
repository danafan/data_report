<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="类型：">
				<el-select v-model="type" clearable placeholder="请选择类型">
					<el-option label="档口" :value="1"></el-option>
					<el-option label="非档口" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ksbm_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入新编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="项目部">
				<el-select v-model="dept_ids" clearable multiple filterable reserve-keyword placeholder="请输入新编码" collapse-tags>
					<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="title">部门降本报表</div>
			<el-button type="primary" plain size="small" @click="exportFn('1')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<div class="dept_row">
			<el-table size="small" :data="dept_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="deptSortChange" max-height="220px" v-loading="loading">
				<el-table-column :prop="item.row_field_name" :label="item.row_name" align="center" :sortable="item.is_sort?'custom':false" v-for="item in dept_title_list"></el-table-column>
			</el-table>
			<div class="total_box">
				<div style="font-size: 18px;font-weight: bold">合计：</div>
				<div>降本款式：{{dept_total.num}}</div>
				<div>降本价格：{{dept_total.hjjb}}</div>
			</div>
		</div>
		
		<div class="buts" style="margin-top: 10px">
			<div class="title">款式降本报表</div>
			<el-button type="primary" plain size="small" @click="exportFn('2')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="ks_data.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column :prop="item.row_field_name" :label="item.row_name" align="center" :sortable="item.is_sort?'custom':false" show-overflow-tooltip v-for="item in ks_title_list"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="ks_data.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title{
		font-size: 14px;
		font-weight: bold;
	}
}
.dept_row{
	display: flex;
	.total_box{
		width: 200px;
		height: 220px;
		font-size:16px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
	}
}
</style>
<script>
	import {lastXDate,getCurrentDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/auditResource.js'
	import commonResource from '../../../api/resource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				loading:false,
				type:"",
				pickerOptions: {
					shortcuts: [{
						text: '近七天',
						onClick(picker) {
							const start = lastXDate(7);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '近半月',
						onClick(picker) {
							const start = lastXDate(15);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近一月',
						onClick(picker) {
							const start = lastXDate(30);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近三月',
						onClick(picker) {
							const start = lastXDate(90);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										//时间区间
				date:[],	
				page:1,
				pagesize:10,
				ks_sort:"",
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				dept_list:[],			//项目部列表
				dept_ids:[],			//选中的项目部
				ks_title_list:[],
				ks_data:{},
				dept_sort:"",
				dept_title_list:[],
				dept_data:[],
				dept_total:{}
			}
		},
		created(){
			//项目部列表
			this.getDeptList();
			//获取列表(部门)
			this.jbDept();
			//获取列表（款式）
			this.getData();
		},
		methods:{
			//款式编码列表
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ksbm_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//项目部列表
			getDeptList(){
				commonResource.ajaxOperationCenterDept().then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			getList(){
				this.page = 1;
				//获取列表(部门)
				this.jbDept();
				//获取列表
				this.getData();
			},
			//获取列表(部门)
			jbDept(){
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					dept_id:this.dept_ids.join(','),
					type:this.type,
					sort:this.dept_sort,
				}
				this.loading = true;
				resource.jbDept(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dept_title_list = res.data.data.title_list;
						this.dept_data = res.data.data.table_data;
						this.dept_total = res.data.data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表(款式)
			getData(){
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					dept_id:this.dept_ids.join(','),
					type:this.type,
					sort:this.ks_sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.jbKs(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.ks_title_list = res.data.data.title_list;
						this.ks_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFn(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(type == '1'){
						let arg = {
							ksbm:this.select_ksbm_ids.join(','),
							start_date:this.date && this.date.length> 0?this.date[0]:"",
							end_date:this.date && this.date.length> 0?this.date[1]:"",
							dept_id:this.dept_ids.join(','),
							type:this.type,
							sort:this.dept_sort,
						}
						resource.jbDeptExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'部门降本报表');
							}
						})
					}else{
						let arg = {
							ksbm:this.select_ksbm_ids.join(','),
							start_date:this.date && this.date.length> 0?this.date[0]:"",
							end_date:this.date && this.date.length> 0?this.date[1]:"",
							dept_id:this.dept_ids.join(','),
							type:this.type,
							sort:this.ks_sort,
						}
						resource.jbKsExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'款式降本报表');
							}
						})
					}
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.ks_sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.ks_sort = "";
				}   
				this.getData();
			},
			//排序（部门）
			deptSortChange({ column, prop, order }) {  
				if(order){
					this.dept_sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.dept_sort = "";
				}   
				this.jbDept();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				this.page = 1;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			}
			
		}
	}
</script>










