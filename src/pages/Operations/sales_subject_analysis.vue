<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="付款日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<dps @callBack="checkReq"></dps>
			<!-- <el-form-item label="事业部：">
				<el-select v-model="dept_ids" multiple filterable collapse-tags reserve-keyword clearable placeholder="全部" @change="ajaxShops">
					<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="store_ids" clearable multiple filterable reserve-keyword collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item> -->
			<el-form-item label="品类：">
				<el-select v-model="mc_ids" clearable multiple filterable remote reserve-keyword :remote-method="ajaxTopSpmc" collapse-tags placeholder="全部">
					<el-option v-for="item in mc_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="ksbm_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex jse mb-15" v-if="button_list.export == 1">
			<el-button type="primary" plain size="mini" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="sales_subject_analysis" max_height="620px" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import CustomTable from '../../components/custom_table.vue'
	import PageWidget from '../../components/pagination_widget.vue'
	import operationResource from '../../api/operationResource.js'
	import commonResource from '../../api/resource.js'
	import demandResource from '../../api/demandResource.js'
	import dps from '../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				// dept_list:[],								//事业部列表
				dept_ids:[],								//选中的事业部
				platform_ids:[],								//平台列表
				// store_list:[],								//店铺列表
				store_ids:[],								//选中的店铺列表
				mc_list:[],									//品类列表
				mc_ids:[],									//选中的品类列表
				gys_list:[],								//供应商列表
				gys_ids:[],									//选中的供应商
				ksbm_list:[],								//款式编码列表
				ksbm_ids:[],								//选中的款式编码
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
				date:[getMonthStartDate(),getLastMonthEndDate(-1)],			//时间区间
				search:"",									//款式编码/商品编码
				page:1,
				pagesize:10,
				sort:"",									//排序
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,									//数据总数
				button_list:{},
				loading:false,
			}
		},
		created(){
			//部门列表
			// this.getDept();
			// 获取店铺
			// this.ajaxShops();
			//获取数据
			this.getData();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_ids = reqObj.select_department_ids;
				this.platform_ids = reqObj.select_plat_ids;
				this.store_ids = reqObj.select_store_ids;
			},
			//部门列表
			// getDept(){
			// 	commonResource.ajaxViewDept().then(res => {
			// 		if(res.data.code == 1){
			// 			this.dept_list = res.data.data;
			// 		}else{
			// 			this.$message.warning(res.data.msg);
			// 		}
			// 	})
			// },
			//获取店铺列表
			// ajaxShops(){
			// 	this.store_ids = [];
			// 	commonResource.ajaxViewStore({dept_id:this.dept_ids.join(',')}).then(res => {
			// 		if(res.data.code == 1){
			// 			this.store_list = res.data.data;
			// 		}else{
			// 			this.$message.warning(res.data.msg);
			// 		}
			// 	})
			// },
			//品类列表
			ajaxTopSpmc(e){
				if(e != ''){
					demandResource.ajaxTopSpmc({name:e}).then(res => {
						if(res.data.code == 1){
							this.mc_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商列表
			getGys(e){
				if(e != ''){
					commonResource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//款式编码列表
			ajaxKsbm(e){
				if(e != ''){
					commonResource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ksbm_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
			//获取数据
			getData(){
				let arg = {
					dept_id:this.dept_ids.join(','),
					platform:this.platform_ids.join(','),
					shop_id:this.store_ids.join(','),
					mc:this.mc_ids.join(','),
					gys:this.gys_ids.join(','),
					ksbm:this.ksbm_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				this.loading = true;
				operationResource.salesAnalysisData(arg).then(res => {
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
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dept_id:this.dept_ids.join(','),
						platform:this.platform_ids.join(','),
						shop_id:this.store_ids.join(','),
						mc:this.mc_ids.join(','),
						gys:this.gys_ids.join(','),
						ksbm:this.ksbm_ids.join(','),
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
						sort:this.sort
					}
					operationResource.salesAnalysisExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'销售主题分析');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		},
		components:{
			dps,
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>
	
</style>