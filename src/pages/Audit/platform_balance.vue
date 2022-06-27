<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker
      v-model="date"
      type="month"
      value-format="yyyy-MM"
      placeholder="选择月">
    </el-date-picker>
				<!-- <el-date-picker v-model="date" type="date" clearable value-format="yyyy-MM" placeholder="选择日期" :append-to-body="false">
				</el-date-picker> -->
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="title">平台汇总<span>（每两天更新一次）</span></div>
		<el-table ref="multipleTable" size="small" :data="platform_total.list" tooltip-effect="dark" style="width: 100%">
			<el-table-column :prop="item.field" :label="item.name" align="center" v-for="item in platform_total.title" show-overflow-tooltip>
				<template slot-scope="scope">
					<div >{{scope.row[item.field]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="title">事业部汇总<span>（每两天更新一次）</span></div>
		<el-table ref="multipleTable" size="small" :data="dept_total.list" tooltip-effect="dark" style="width: 100%">
			<el-table-column :prop="item.field" :label="item.name" align="center" v-for="item in dept_total.title" show-overflow-tooltip>
				<template slot-scope="scope">
					<div >{{scope.row[item.field]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="title">店铺明细<span>（每两天更新一次）</span></div>
		<el-table ref="multipleTable" size="small" :data="table_data.data" tooltip-effect="dark" style="width: 100%" @sort-change="sortChange">
			<el-table-column :prop="item.field" :label="item.name" :sortable="item.is_sort == 1?'custom':false" align="center" v-for="item in title_list" show-overflow-tooltip>
				<template slot-scope="scope">
					<div >{{scope.row[item.field]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="table_data.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.title{
	margin-bottom: 15px;
	margin-top: 15px;
	font-size: 14px;
	color: #333;
	font-weight: bold;
	span{
		font-size: 12px;
		color: red;
	}
}
</style>
<script>
	import resource from '../../api/auditResource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				plat_list:[],			//平台列表
				select_plat_ids:"",		//选中的平台列表
				dataObj:{},				//返回数据
				table_data:{},			//最底部表格
				title_list:[],			//最底部表格表头
				dept_total:{},			//部门汇总
				platform_total:{},		//平台汇总
				sort_field:"",
				sort_type:"",
				date:"",
			}
		},
		created(){
			//平台列表
			this.ajaxPlatform();
		},
		methods:{
			//平台列表
			ajaxPlatform(){
				resource.ajaxPlatform().then(res => {
					if(res.data.code == 1){
						this.plat_list = res.data.data;
						this.select_plat_ids = this.plat_list[0];
						//获取列表
						this.getData();
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
					platform:this.select_plat_ids,
					sort_field:this.sort_field,
					sort_type:this.sort_type,
					date:this.date,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.platformBalanceData(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.table_data = data.list;
						this.title_list = data.title;
						this.dept_total = data.dept_total;
						this.platform_total = data.platform_total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
			sortChange(column){
				this.sort_field = column.prop;
				this.sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
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
			}
			
		}
	}
</script>










