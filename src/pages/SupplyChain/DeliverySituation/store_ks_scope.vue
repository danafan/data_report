<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="统计日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-input v-model="gyshh" clearable placeholder="请输入供应商货号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="指标解释" keys="dpkswd" :update_time="update_time"/>
			<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" max_height="650" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		data(){
			return{
				dept_name:[],								//项目部
				pl:[],										//平台
				shop_code:[],								//店铺
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
				date:[getNowDate(),getNowDate()],			//时间区间
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gyshh:"",
				page:1,			//店铺分页
				pagesize:10,			//店铺分页
				sort:"",
				loading:false,
				table_data:[],
				title_list:[],
				total:0,
				update_time:"",
				d:1
			}
		},
		created(){
			//获取数据
			this.getData();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			searchFn(){
				this.title_list = [];
				this.sort = "";
				this.handlePageChange(1);
			},
			//获取数据
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					ksbm:this.select_ks_ids.join(','),
					gyshh:this.gyshh,
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				this.loading = true;
				demandResource.sendDpKsbm(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
						this.update_time = data.update_time;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
						ksbm:this.select_ks_ids.join(','),
						gyshh:this.gyshh,
						platform:this.pl.join(','),
						dept_id:this.dept_name.join(','),
						shop_id:this.shop_code.join(','),
						sort:this.sort
					}
					demandResource.sendDpKsbmExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'仓库发货情况统计-店铺款式维度');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
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
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
		},
		components:{
			PopoverWidget,
			CustomTable,
			PageWidget,
			dps
		}
	}
</script>
<style lang="less" scoped>
</style>