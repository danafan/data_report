<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item>
				<el-input style="width: 200px" v-model="keyword" placeholder="档口号/结算档口号/收款账号"></el-input>
			</el-form-item>
			<el-form-item label="发货日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" size="small">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_data" size="small" style="width:100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}"  :cell-style="{'text-align':'center'}" v-loading="loading">
			<el-table-column :label="item.title" :prop="item.field_name" v-for="item in title_list" show-overflow-tooltip :render-header="renderHeader">
				<template slot-scope="scope">
					<div>{{scope.row[item.field_name]}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="140" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small">编辑</el-button>
					<el-button type="text" size="small" @click="deleteFn(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		
	</div>
</template>
<script>
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				keyword:"",						//搜索关键字
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 							
				date:[],						//引入时间
				page:1,
				pagesize:10,
				title_list:[],					//表头数据
				table_data:[],					//表格数据
				total:0,
				loading:false
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//顶部悬浮
			renderHeader(h, data) {
				return h("span", [
					h(
						"el-tooltip",
						{
							attrs: {
								class: "item",
								effect: "dark",
								content: data.column.label,
								placement: "top",
							},
						},
						[h("span", data.column.label)]
						),
					]);
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
			},
			//获取列表
			getList(){
				let arg = {
					keyword:this.keyword,
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.supplierIndex(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除
			deleteFn(id){
				this.$confirm('确认删除该供应商?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						id:id
					}
					resource.supplierDel(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						keyword:this.keyword,
						start_time:this.date && this.date.length> 0?this.date[0]:"",
						end_time:this.date && this.date.length> 0?this.date[1]:""
					}
					resource.supplierExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'供应商列表');
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
<style lang="less" scoped>
.buts{
	margin-top: 15px;
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>