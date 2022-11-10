<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货日期:">
				<el-date-picker v-model="date" :clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_data" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='680' @sort-change="sortChange" v-loading="loading">
			<el-table-column :label="i.label" :prop="i.prop" align="center" v-for="i in column_list" :width="i.width" show-overflow-tooltip :sortable="i.sort?'custom':false">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.label" placement="top-start">
						<div class="text_content">{{i.label}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row[i.prop]}}</div>
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
	import resource from '../../api/demandResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate,lastXDate} from '../../api/nowMonth.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				date:[lastXDate(7),getNowDate()],					//提报日期
				page:1,
				pagesize:10,
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
				},	 										//时间区间
				column_list:[{
					label:'原供应商',
					width:"120",
					prop:'ygys'
				},{
					label:'原供应商款号',
					prop:'ygyshh'
				},{
					label:'原款式编码',
					width:"120",
					prop:'yksbm'
				},{
					label:'现供应商',
					width:"120",
					prop:'xgys'
				},{
					label:'现供应商款号',
					prop:'xgyshh'
				},{
					label:'现款式编码',
					width:"120",
					prop:'xksbm'
				},{
					label:'原发货量',
					width:"120",
					sort:true,
					prop:'old_fhsl'
				},{
					label:'现发货量',
					width:"120",
					sort:true,
					prop:'new_fhsl'
				},{
					label:'现款式发货占比',
					sort:true,
					prop:'new_fhsl_zb'
				},{
					label:'原成本',
					width:"120",
					prop:'ycb'
				},{
					label:'现成本',
					width:"120",
					prop:'xcb'
				},{
					label:'降本额',
					width:"120",
					sort:true,
					prop:'jbe'
				}],
				table_data:[],
				total:0,
				loading:false,
				sort:""
			}
		},
		created(){
			//获取列表数据
			this.getData();
		},
		methods:{
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.sort = "";
				}   
				this.getData();
			}, 
			//获取列表数据
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.getKsbmFhqk(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_data = data.data;
						this.total = data.total;
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
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
						sort:this.sort,
					}
					resource.getKsbmFhqkExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'二部内部款');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}
		}
	}
</script>
<style type="text/css">
.el-table th>.cell{
	display: flex!important;
	align-items: center!important;
	justify-content: center!important;
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







