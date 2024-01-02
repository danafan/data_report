<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="仓库：">
				<el-select v-model="ck_ids" clearable multiple filterable reserve-keyword placeholder="请输入款式" collapse-tags>
					<el-option v-for="item in ck_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex ac jse mb-15">
			<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="inventory_info" max_height="680" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" :pagerCount="5" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script type="text/javascript">
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getSomeDay,getNowDate,lastMonthDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	import operationResource from '../../../api/operationResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

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
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				ck_list:[],									//仓库列表
				ck_ids:[],									//选中的仓库
				loading:false,
				title_list:[],
				table_data:[],
				total:0,
				page:1,
				pagesize:10,
				sort:""
			}
		},
		created(){
			//供应商列表
			this.getGys();
			//款式编码
			this.getKsbm();
			//仓库列表
			this.getCk();
			//获取列表
			this.getData();
		},
		methods:{
			//点击查询
			searchFn(){
				this.page = 1;
				this.getData(true);
			},
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
			//仓库列表
			getCk(){
				operationResource.ajaxCkwz().then(res => {
					if(res.data.code == 1){
						this.ck_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取数据
			getData(bool){
				let arg = {
					ckwz:this.ck_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				if(bool){
					this.title_list = [];
				}
				operationResource.supplierManagerStock(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
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
						ckwz:this.ck_ids.join(','),
						gys:this.select_gys_ids.join(','),
						ksbm:this.select_ks_ids.join(','),
						sort:this.sort,
					}
					operationResource.supplierStockExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'库存信息分仓数据');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//款式排序回调
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
			}
			
		}
	}
</script>
<style lang="less" scoped>
	.table_title{
		margin-top: 15px;
		margin-bottom: 15px;
	}
</style>