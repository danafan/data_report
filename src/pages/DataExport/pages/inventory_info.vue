<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="结算供应商：">
				<el-select v-model="gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入结算供应商" :remote-method="getGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="ksbm_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex">
			<div style="width:650px;margin-right:15px">
				<div class="flex ac jsb mb-15">
					<PopoverWidget title="结算供应商库存" :show_popover="false"/>
					<el-button type="primary" plain size="small" v-if="gys_button_list.export == 1" @click="exportFn(1)">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<custom-table v-loading="gys_loading" max_height="9999" :table_data="gys_table_list" :title_list="gys_title_list" @sortCallBack="gysSortCallBack"/>
				<page-widget :page="gys_page" :pagesize="gys_pagesize" :total="gys_total" :pagerCount="5" @handleSizeChange="gysHandleSizeChange" @handlePageChange="gysHandlePageChange"/>
			</div>
			<div class="flex-1">
				<div class="flex ac jsb mb-15">
					<PopoverWidget title="款式库存" :show_popover="false"/>
					<el-button type="primary" plain size="small" v-if="ksbm_button_list.export == 1" @click="exportFn(2)">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<custom-table v-loading="ksbm_loading" max_height="9999" :table_data="ksbm_table_list" :title_list="ksbm_title_list" :total_row="true" :table_total_data="table_total_data" @sortCallBack="ksbmSortCallBack"/>
				<page-widget :page="ksbm_page" :pagesize="ksbm_pagesize" :total="ksbm_total" :pagerCount="5" @handleSizeChange="ksbmHandleSizeChange" @handlePageChange="ksbmHandlePageChange"/>
			</div>
		</div>

		
	</div>
</template>
<script>
	import resource from '../../../api/dataExportResource.js'
	import commonResource from '../../../api/resource.js'
	import {exportPost} from '../../../api/export.js'

	import PageWidget from '../../../components/pagination_widget.vue'
	import CustomTable from '../../../components/custom_table.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'

	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				ksbm_list:[],					//款式编码列表
				ksbm_ids:[],					//选中的款式编码
				gys_list:[],					//供应商列表
				gys_ids:[],						//选中的供应商
				gys_sort:"",					//供应商排序
				gys_page:1,
				gys_pagesize:10,				
				gys_total:0,
				gys_loading:false,
				gys_table_list:[],					//供应商数据列表
				gys_title_list:[],					//供应商头部列表
				gys_button_list:{},					//供应商按钮权限
				ksbm_sort:"",						//款式编码排序
				ksbm_page:1,
				ksbm_pagesize:10,				
				ksbm_total:0,
				ksbm_loading:false,
				ksbm_table_list:[],					//款式编码数据列表
				table_total_data:{},
				ksbm_title_list:[],					//款式编码头部列表
				ksbm_button_list:{},				//款式编码按钮权限
			}
		},
		created(){
			//获取供应商列表
			this.getGysData();
			//获取款式编码列表
			this.getKsbmData();
		},
		methods:{
			//款式编码
			getKsbm(e){
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
			//供应商列表
			getGys(e){
				if(e != ''){
					commonResource.ajaxSettlementSupplier({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击搜索
			searchFn(){
				this.gys_page = 1;
				this.ksbm_page = 1;
				//获取款式编码列表
				this.getGysData();
				//获取款式编码列表
				this.getKsbmData();
			},
			//供应商排序回调
			gysSortCallBack(sort){
				this.gys_sort = sort;
				//获取列表
				this.getGysData();
			},
			//供应商分页
			gysHandleSizeChange(val) {
				this.gys_pagesize = val;
				//获取列表
				this.getGysData();
			},
			gysHandlePageChange(val) {
				this.gys_page = val;
				//获取列表
				this.getGysData();
			},
			//获取供应商列表
			getGysData(){
				let arg = {
					gys:this.gys_ids.join(','),
					sort:this.gys_sort,
					type:1,
					page:this.gys_page,
					pagesize:this.gys_pagesize
				}
				this.gys_loading = true;
				resource.financeInventory(arg).then(res => {
					this.gys_loading = false;
					if(res.data.code == 1){
						let data = res.data.data;
						this.gys_title_list = data.title_list;
						// this.gys_title_list.map(item => {
						// 	item['width'] = 100;
						// })
						this.gys_table_list = data.table_data.data;
						this.gys_total = data.table_data.total;
						this.gys_button_list = data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式编码排序回调
			ksbmSortCallBack(sort){
				this.ksbm_sort = sort;
				//获取列表
				this.getKsbmData();
			},
			//款式编码分页
			ksbmHandleSizeChange(val) {
				this.ksbm_pagesize = val;
				//获取列表
				this.getKsbmData();
			},
			ksbmHandlePageChange(val) {
				this.ksbm_page = val;
				//获取列表
				this.getKsbmData();
			},
			//获取款式编码列表
			getKsbmData(){
				let arg = {
					ksbm:this.ksbm_ids.join(','),
					gys:this.gys_ids.join(','),
					sort:this.ksbm_sort,
					type:2,
					page:this.ksbm_page,
					pagesize:this.ksbm_pagesize
				}
				this.ksbm_loading = true;
				resource.financeInventory(arg).then(res => {
					this.ksbm_loading = false;
					if(res.data.code == 1){
						let data = res.data.data;
						this.ksbm_title_list = data.title_list;
						// this.ksbm_title_list.map(item => {
						// 	item['width'] = 120;
						// })
						this.ksbm_table_list = data.table_data.data;
						if(this.ksbm_table_list.length > 0){
							this.table_total_data = this.ksbm_table_list[0];
							this.ksbm_table_list.splice(0,1);
						}else{
							this.table_total_data = {};
						}
						this.ksbm_total = data.table_data.total;
						this.ksbm_button_list = data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFn(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						gys:this.gys_ids.join(','),
						sort:type == 1?this.gys_sort:this.ksbm_sort,
						type:type,
					}
					if(type == 2){
						arg['ksbm'] = this.ksbm_ids.join(',');
					}
					resource.financeInventoryExport(arg).then(res => {
						exportPost("\ufeff" + res.data,`${type == 1?'供应商':'款式编码'}库存`);
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
			PageWidget,
			CustomTable,
			PopoverWidget
		}
	}
</script>
<style lang="less" scoped>

</style>








