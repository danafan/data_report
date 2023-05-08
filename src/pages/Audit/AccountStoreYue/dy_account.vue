<template>
	<div>
		<!-- 抖音账单 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="抖音账单" :show_popover="false"/>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺:">
				<el-select v-model="zd_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="动账日期：">
				<el-date-picker v-model="zd_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="zdHandlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<custom-table v-loading="zd_loading" :isLoading="zd_loading" tableName="pdd_zd" :table_data="zd_table_data" :title_list="zd_title_list" :is_custom_sort="false" @sortCallBack="zdSortCallBack"/>
		<page-widget :page="zd_page" :pagesize="zd_pagesize" :total="zd_total" @handleSizeChange="zdHandleSizeChange" @handlePageChange="zdHandlePageChange"/>
		<!-- 抖音账单余额 -->
		<div class="flex ac jsb mb-10 mt-10">
			<PopoverWidget title="抖音账单余额" :show_popover="false"/>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺:">
				<el-select v-model="ye_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="ye_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="yeHandlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<custom-table v-loading="ye_loading" :isLoading="ye_loading" tableName="pdd_zd" :table_data="ye_table_data" :title_list="ye_title_list" :is_custom_sort="false" @sortCallBack="yeSortCallBack"/>
		<page-widget :page="ye_page" :pagesize="ye_pagesize" :total="ye_total" @handleSizeChange="yeHandleSizeChange" @handlePageChange="yeHandlePageChange"/>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import auditResource from '../../../api/auditResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		components:{
			CustomTable,
			PageWidget,
			PopoverWidget
		},
		data(){
			return{
				store_list: [],						//店铺列表
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
				},									//时间区间
				zd_store_ids:[],					//账单
				zd_date:[getMonthStartDate(),getCurrentDate()],
				zd_sort:"",							
				zd_loading:false,
				zd_title_list:[],					
				zd_table_data:[],					
				zd_total:0,							
				zd_page:1,
				zd_pagesize:10,
				ye_store_ids:[],					//余额
				ye_date:[getMonthStartDate(),getCurrentDate()],
				ye_sort:"",							
				ye_loading:false,
				ye_title_list:[],					
				ye_table_data:[],					
				ye_total:0,							
				ye_page:1,
				ye_pagesize:10,

			}
		},
		created(){
			// 获取所有店铺
			this.getStoreList();
			//获取账单列表
			this.dyBill();
			//获取余额列表
			this.dyBalance();
		},
		methods:{
			// 获取所有店铺
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取账单列表
			dyBill(){
				this.zd_loading = true;
				let arg = {
					shop_id:this.zd_store_ids.join(','),
					start_date:this.zd_date && this.zd_date.length> 0?this.zd_date[0]:"",
					end_date:this.zd_date && this.zd_date.length> 0?this.zd_date[1]:"",
					sort:this.zd_sort,
					page:this.zd_page,
					pagesize:this.zd_pagesize
				}
				auditResource.dyBill(arg).then(res => {
					if(res.data.code == 1){
						this.zd_loading = false;
						let data = res.data.data;
						this.zd_title_list = data.title_list;
						this.zd_table_data = data.table_data.data;
						this.zd_total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//账单排序回调
			zdSortCallBack(sort){
				this.zd_sort = sort;
				//获取列表
				this.dyBill();
			},
			//账单分页
			zdHandleSizeChange(val) {
				this.zd_pagesize = val;
				//获取列表
				this.dyBill();
			},
			zdHandlePageChange(val) {
				this.zd_page = val;
				//获取列表
				this.dyBill();
			},
			//获取余额列表
			dyBalance(){
				this.ye_loading = true;
				let arg = {
					shop_id:this.ye_store_ids.join(','),
					start_date:this.ye_date && this.ye_date.length> 0?this.ye_date[0]:"",
					end_date:this.ye_date && this.ye_date.length> 0?this.ye_date[1]:"",
					sort:this.ye_sort,
					page:this.ye_page,
					pagesize:this.ye_pagesize
				}
				auditResource.dyBalance(arg).then(res => {
					if(res.data.code == 1){
						this.ye_loading = false;
						let data = res.data.data;
						this.ye_title_list = data.title_list;
						this.ye_table_data = data.table_data.data;
						this.ye_total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//余额排序回调
			yeSortCallBack(sort){
				this.ye_sort = sort;
				//获取列表
				this.dyBalance();
			},
			//余额分页
			yeHandleSizeChange(val) {
				this.ye_pagesize = val;
				//获取列表
				this.dyBalance();
			},
			yeHandlePageChange(val) {
				this.ye_page = val;
				//获取列表
				this.dyBalance();
			},
		}
	}
</script>
<style lang="less" scoped>

</style>