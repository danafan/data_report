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
			<el-form-item label="项目部：">
				<el-select v-model="dept_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in dept_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="exportTable" v-if="button_list.export == 1">全部导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="ks_data.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column :prop="item.row_field_name" :label="item.row_name" align="center" v-for="item in ks_title_list"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="ks_data.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
<script>
	import {lastXDate,getCurrentDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/auditResource.js'
	import commonResource from '../../../api/resource.js'
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
				date:[getCurrentDate(),getCurrentDate()],	
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				dept_list:[],			//项目部列表
				dept_ids:[],			//选中的项目部
				ks_title_list:[],
				ks_data:{},
			}
		},
		created(){
			//项目部列表
			this.getDeptList();
			//获取列表
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
				resource.projectDept().then(res => {
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
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					dept_id:this.dept_ids.join(','),
					type:this.type,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.zeroCost(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.ks_title_list = res.data.data.title_list;
						this.ks_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			}
			
		}
	}
</script>










