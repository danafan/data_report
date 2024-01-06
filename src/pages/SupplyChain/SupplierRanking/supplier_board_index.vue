<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商名称：">
				<el-input v-model="gys" clearable placeholder="请输入供应商名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex ac jsb mb-15">
			<div class="f12 red_color">数据更新时间：{{update_time}}</div>
			<div class="flex ac">
				<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="supplier_board_index" max_height="680" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" :pagerCount="5" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
		<!-- 自定义列表 -->
		<el-dialog title="自定义列表（单击取消列表名保存直接修改）" :visible.sync="show_custom">
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
				gys:"",							//供应商名称
				loading:false,
				title_list:[],
				table_data:[],
				total:0,
				page:1,
				pagesize:10,
				sort:"",
				show_custom:false,
				selected_ids:[],							//自定义已选中的id
				row_ids:[],									//可提交的自定义ids
				view_row:[],								//所有列表-指标汇总
				update_time:"",
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//点击查询
			searchFn(){
				this.page = 1;
				this.getData(true);
			},
			//获取数据
			getData(bool){
				let arg = {
					gys:this.gys,
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				if(bool){
					this.title_list = [];
				}
				operationResource.gysBoardList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
						this.selected_ids = data.selected_ids;	//自定义已选中的id
						this.view_row = data.view_row;			//自定义
						this.update_time = data.date;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击自定义列
			customFun(){
				this.row_ids = this.selected_ids;
				this.show_custom = true;
			},
			//恢复默认
			Restore(type){
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
				if(type == 'is_close'){
					this.show_custom = false;
				}
			},
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				this.custom_loading = true;
				resource.setColumns({menu_id:'201',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.custom_loading = false;
						//获取列表
						this.page = 1;
						this.pagesize = 10;
						this.getData(true);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						gys:this.gys,
						sort:this.sort,
					}
					operationResource.gysBoardExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商看板分板');
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