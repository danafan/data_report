<template>
	<div>
		<!-- 小红书账单 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="小红书账单" :show_popover="false"/>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺:">
				<el-select v-model="zd_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="结算时间：">
				<el-date-picker v-model="zd_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="zdHandlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex jse mb-10">
			<el-button type="primary" plain size="small" @click="zdExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="zd_loading" max_height="620px" :isLoading="zd_loading" tableName="pdd_zd" :table_data="zd_table_data" :title_list="zd_title_list" :is_custom_sort="false" @sortCallBack="zdSortCallBack"/>
		<page-widget :page="zd_page" :pagesize="zd_pagesize" :total="zd_total" @handleSizeChange="zdHandleSizeChange" @handlePageChange="zdHandlePageChange"/>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import auditResource from '../../../api/auditResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				zd_pagesize:20,
			}
		},
		created(){
			// 获取所有店铺
			this.getStoreList();
			//获取账单
			this.xhsBill();
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
			xhsBill(){
				this.zd_loading = true;
				let arg = {
					shop_id:this.zd_store_ids.join(','),
					start_date:this.zd_date && this.zd_date.length> 0?this.zd_date[0]:"",
					end_date:this.zd_date && this.zd_date.length> 0?this.zd_date[1]:"",
					sort:this.zd_sort,
					page:this.zd_page,
					pagesize:this.zd_pagesize
				}
				auditResource.xhsBill(arg).then(res => {
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
			//账单导出
			zdExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						shop_id:this.zd_store_ids.join(','),
						start_date:this.zd_date && this.zd_date.length> 0?this.zd_date[0]:"",
						end_date:this.zd_date && this.zd_date.length> 0?this.zd_date[1]:"",
						sort:this.zd_sort,
					}
					auditResource.xhsBillExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'小红书账单');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//账单排序回调
			zdSortCallBack(sort){
				this.zd_sort = sort;
				//获取列表
				this.xhsBill();
			},
			//账单分页
			zdHandleSizeChange(val) {
				this.zd_pagesize = val;
				//获取列表
				this.xhsBill();
			},
			zdHandlePageChange(val) {
				this.zd_page = val;
				//获取列表
				this.xhsBill();
			},
			
		}
	}
</script>
<style lang="less" scoped>

</style>