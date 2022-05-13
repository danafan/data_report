<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="事业部：">
				<el-select v-model="dept_name" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="事业二部" value="事业二部"></el-option>
					<el-option label="事业四部" value="事业四部"></el-option>
					<el-option label="新兴事业部" value="新兴事业部"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="dpmc" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.jst_code" :label="item.shop_name" :value="item.jst_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="查询时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-table size="small" :data="dept_list" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column width="100" prop="dept_name" label="事业部" align="center"></el-table-column>
				<el-table-column width="120" prop="num" label="未下架款式数量" align="center"></el-table-column>
			</el-table>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column show-overflow-tooltip prop="dept_name" label="事业部" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip prop="dpmc" label="店铺名称" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip prop="shopowner_name" label="店长" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip prop="num" label="未下架款式数量" align="center"></el-table-column>
			<el-table-column show-overflow-tooltip prop="xjfzr" label="下架负责人" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20,40]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
}
</style>
<script>
	import resource from '../../api/shelvesResource.js'
	import {exportPost} from '../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				page:1,
				pagesize:40,
				store_list:[],	//所有店铺列表
				dpmc:[],		//选中的店铺列表
				dept_name:"",	//事业部名称
				date:[getCurrentDate(),getNowDate()],		//查询日期
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
				dataObj:{},				//返回数据
				dept_list:[]
			}
		},
		created(){
			//获取列表
			this.getList();
			//获取店铺列表
			this.getStoreList();
		},
		methods:{
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dpmc:this.dpmc.join(','),
						dept_name:this.dept_name,
						start_time:this.date && this.date.length > 0?this.date[0]:"",
						end_time:this.date && this.date.length > 0?this.date[1]:"",
					}
					resource.exportTj(arg).then(res => {
						exportPost("\ufeff" + res.data,'店铺下架统计表');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//获取店铺列表
			getStoreList(){
				resource.ajaxShops({type:'1'}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				let arg = {
					dpmc:this.dpmc.join(','),
					dept_name:this.dept_name,
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
				}
				resource.offshelfTj(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data.shop_list;
						this.dept_list = res.data.data.dept_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
		}
	}
</script>