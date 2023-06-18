<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.jst_code" :label="item.shop_name" :value="item.jst_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="统计日期：">
				<el-date-picker v-model="sjxrrq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<PopoverWidget title="指标解释" keys="top_ws"/>
			<div class="flex">
				<el-button type="primary" size="small" @click="show_custom = true">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-if="title_list.length > 0" v-loading="loading" :isLoading="loading" tableName="before_ws" max_height="630" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handleCurrentChange"/>
		<!-- 自定义列表 -->
		<el-dialog title="（单击取消列表名保存直接修改）" :visible.sync="show_custom">
			<div class="select_box">
				<el-checkbox-group v-model="selected_ids">
					<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="Restore">恢复默认</el-button>
				<el-button size="small" @click="Restore('is_close')">取消</el-button>
				<el-button size="small" type="primary" @click="setColumns">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import PopoverWidget from '../../../components/popover_widget.vue'
	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	export default{
		data(){
			return{
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				store_list: [],						//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				sjxrrq:getNowDate(),
				page:1,
				pagesize:10,
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,
				table_sort:"",
				loading:false,
				show_custom:false,						//自定义列表
				selected_ids:[],			//当前选中的所有ID
				view_row:[],				//当前的列表
			}
		},
		created(){
			// 获取所有店铺
			this.getStoreList();
			//获取列表
			this.getData();
		},
		methods:{
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
			// 获取所有店铺
			getStoreList(){
				demandResource.deerShop().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
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
						jst_code:this.select_store_ids.join(','),
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						sjxrrq:this.sjxrrq?this.sjxrrq:'',
						sort:this.table_sort,
					}
					demandResource.deforeWsExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'3店铺Top50列表');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
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
			//排序回调
			sortCallBack(sort){
				this.table_sort = sort;
				//获取列表
				this.getData();
			},
			//恢复默认
			Restore(type){
				
				if(type == 'is_close'){
					this.show_custom = false;
				}else{
					this.selected_ids = [];
					this.view_row.map(item => {
						this.selected_ids.push(item.row_id)
					})
				}
			},
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				resource.setColumns({menu_id:'137',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.page = 1;
						this.pagesize = 10;
						this.getData(true);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			getData(is_custom){
				let arg = {
					jst_code:this.select_store_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					sort:this.table_sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.deforeWsList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						if(is_custom){
							this.title_list = [];
						}
						this.title_list = data.title_list;
						this.table_data = data.table_list.data;
						this.total = data.table_list.total;
						// this.update_time = data.update_time;
						this.view_row = data.view_rows;
						this.selected_ids = data.selected_ids;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			PopoverWidget,
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>
	.buts{
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>










