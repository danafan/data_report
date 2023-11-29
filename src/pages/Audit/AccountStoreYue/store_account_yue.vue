<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" :popper-append-to-body="false" filterable reserve-keyword placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="title">平台汇总<span>（每日更新一次）</span></div>
		<el-table ref="multipleTable" size="small" :data="platform_total.list" tooltip-effect="dark" style="width: 100%" v-loading="loading">
			<el-table-column :prop="item.field" :label="item.name" align="center" v-for="item in platform_total.title" show-overflow-tooltip>
				<template slot-scope="scope">
					<div >{{scope.row[item.field]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="title">各平台汇总<span>（每日更新一次）</span></div>
		<el-table ref="multipleTable" size="small" :data="dept_total.list" tooltip-effect="dark" style="width: 100%" v-loading="loading">
			<el-table-column :prop="item.field" :label="item.name" align="center" v-for="item in dept_total.title" show-overflow-tooltip>
				<template slot-scope="scope">
					<div >{{scope.row[item.field]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="buts">
			<div class="title">店铺明细<span>（每日更新一次）</span><span>（店铺总数：{{total_shop_num}}；今日更新：{{today_shop_num}}）</span></div>
			<el-button type="primary" plain size="small" @click="exportFile" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table ref="multipleTable" size="small" :data="table_data.data" tooltip-effect="dark" style="width: 100%" @sort-change="sortChange" v-loading="loading">
			<el-table-column :prop="item.field" :label="item.name" :sortable="item.is_sort == 1?'custom':false" align="center" v-for="item in title_list" show-overflow-tooltip>
				<template slot-scope="scope">
					<div :class="[{'red_color':item.field == 'qmye' && parseFloat(scope.row[item.field]) > 1000},{'green_color':item.field == 'yebhts' && scope.row.yebhts >= 30}]">{{scope.row[item.field]}}</div>
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
.buts{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
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
.red_color{
	color: red;
}
.green_color{
	color: green;
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {exportPost} from '../../../api/export.js'
	import {getNowDate} from '../../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
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
				total_shop_num:0,		//店铺总数
				today_shop_num:0,		//今日更新店铺数
				sort_field:"",
				sort_type:"",
				date:getNowDate(),
				button_list:{},			//导出按钮
				loading:false
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
				this.sort_field = "";
				this.sort_type = "";
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					platform:this.select_plat_ids,
					sort_field:this.sort_field,
					sort_type:this.sort_type,
					date:this.date?this.date:'',
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.platformBalanceData(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_data = data.list;
						this.title_list = data.title;
						this.dept_total = data.dept_total;
						this.platform_total = data.platform_total;
						this.total_shop_num = data.total_shop_num;//店铺总数
						this.today_shop_num	= data.today_shop_num;//今日更新店铺数
						this.button_list = data.button_list;
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
			},
			//导出
			exportFile(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						platform:this.select_plat_ids,
						sort_field:this.sort_field,
						sort_type:this.sort_type,
						date:this.date?this.date:''
					}
					resource.platformBalanceExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'店铺明细');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			
		}
	}
</script>










