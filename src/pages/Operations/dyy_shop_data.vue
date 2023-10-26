<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="统计日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="dp_ids" clearable multiple filterable placeholder="请选择店铺" collapse-tags>
					<el-option v-for="item in dp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="平台：">
				<el-select v-model="pt_ids" clearable multiple filterable placeholder="请选择平台" collapse-tags>
					<el-option v-for="item in pt_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="select_pp_list" clearable :popper-append-to-body="false" multiple filterable reserve-keyword placeholder="请输入品牌" collapse-tags>
					<el-option v-for="item in pp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex ac jse mb-10">
			<el-button type="primary" plain size="small" @click="exportFn" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" max_height="650" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" :total_row="true" :table_total_data="table_total_data" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate,lastXDate} from '../../api/nowMonth.js'
	import operationResource from '../../api/operationResource.js'
	import commonResource from '../../api/resource.js'

	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import CustomTable from '../../components/custom_table.vue'
	import PageWidget from '../../components/pagination_widget.vue'
	export default{
		data(){
			return{
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
				date:[lastXDate(7),lastXDate(1)],			//时间区间
				dp_list:[],									//店铺列表
				dp_ids:[],									//选中的店铺
				pt_list:[],									//平台列表
				pt_ids:[],									//选择平台
				pp_list:[],									//品牌列表
				select_pp_list:[],							//选中的品牌列表
				page:1,			
				pagesize:15,			
				sort:"",
				loading:false,
				table_data:[],
				table_total_data:{},
				title_list:[],
				total:0,
				button_list:{},
			}
		},
		created(){
			//获取店铺和平台列表
			this.dyyShopPlatform();
			//获取数据
			this.getData();
		},
		methods:{
			//获取店铺和平台列表
			dyyShopPlatform(){
				operationResource.dyyShopPlatform().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.dp_list = data.dp_list;
						this.pt_list = data.pt_list;
						this.pp_list = data.pp_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取数据
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					dp:this.dp_ids.join(','),
					pt:this.pt_ids.join(','),
					pp:this.select_pp_list.join(','),
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				this.loading = true;
				operationResource.dyyShopList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						if(this.table_data.length > 0){
							this.table_total_data = this.table_data[0];
							this.table_data.splice(0,1);
						}else{
							this.table_total_data = {};
						}
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
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
						dp:this.dp_ids.join(','),
						pt:this.pt_ids.join(','),
						pp:this.select_pp_list.join(','),
						sort:this.sort
					}
					operationResource.dyyShopExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'代运营店铺数据');
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
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>
</style>