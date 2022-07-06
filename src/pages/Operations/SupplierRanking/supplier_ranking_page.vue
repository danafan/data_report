<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="gysmc" clearable :popper-append-to-body="false" filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="平台：">
				<el-select v-model="select_plat_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="自有货品：">
				<el-select v-model="zyhp" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="否" value="0"></el-option>
					<el-option label="是" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_row">
			<div class="table_item xl_table">
				<div class="table_title_row">
					<div class="title">供应商销量排名</div>
					<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="small" :data="xlDataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
					<el-table-column prop="id" label="排名" align="center"></el-table-column>
					<el-table-column prop="gys" show-overflow-tooltip label="供应商" align="center"></el-table-column>
					<el-table-column prop="xl" sortable='custom' label="销量" align="center"></el-table-column>
					<el-table-column prop="ksbm_num" sortable='custom' label="款式数量" align="center"></el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="xl_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="xlDataObj.total">
					</el-pagination>
				</div>
			</div>
			<div class="table_item qh_table">
				<div class="table_title_row">
					<div class="title">供应商缺货排名</div>
					<el-button type="primary" plain size="small" @click="qhCommitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="small" :data="qhDataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="qhSortChange">
					<el-table-column prop="id" label="排名" align="center"></el-table-column>
					<el-table-column prop="gys" label="供应商" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="kys" sortable='custom' label="缺货数" align="center"></el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="qhHandleSizeChange" @current-change="qhHandleCurrentChange" :current-page="qh_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="qhDataObj.total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import operResource from '../../../api/operationResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				gys_list:[],						//供应商
				gysmc:"",							//选中的供应商
				plat_list:[],						//平台列表
				select_plat_ids:[],					//选中的平台列表
				zyhp:"",							//自有货品
				date:"",							//日期
				xl_page:1,
				xl_pagesize:10,						//销量页码
				xl_sort_field:"",
				xl_sort_type:"",					//销量排序
				xlDataObj:{},						//销量数据
				qh_page:1,
				qh_pagesize:10,						//缺货页码
				qh_sort_field:"",
				qh_sort_type:"",					//缺货排序
				qhDataObj:{},						//缺货数据
			}
		},
		created(){
			//平台列表
			this.ajaxPlat();
			//供应商销量
			this.getGysSalenum();
			//供应商缺货排行
			this.getGysOutStock();
		},
		methods:{
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
			//平台列表
			ajaxPlat(){
				resource.ajaxPlat().then(res => {
					if(res.data.code == 1){
						this.plat_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			searchFn(){
				this.xl_page = 1;
				this.qh_page = 1;
				//供应商销量
				this.getGysSalenum();
				//供应商缺货排行
				this.getGysOutStock();
			},
			//供应商销量
			getGysSalenum(){
				let arg = {
					date:this.date?this.date:'',
					gys:this.gysmc,
					platform:this.select_plat_ids.join(','),
					zyhp:this.zyhp,
					sort_field:this.xl_sort_field,
					sort_type:this.xl_sort_type,
					page:this.xl_page,
					pagesize:this.xl_pagesize
				}
				operResource.getGysSalenum(arg).then(res => {
					if(res.data.code == 1){
						this.xlDataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商销量排序
			sortChange(column){
				this.xl_sort_field = column.prop;
				this.xl_sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getGysSalenum();
			},
			//供应商销量分页
			handleSizeChange(val) {
				this.xl_pagesize = val;
				//获取列表
				this.getGysSalenum();
			},
			handleCurrentChange(val) {
				this.xl_page = val;
				//获取列表
				this.getGysSalenum();
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date:this.date?this.date:'',
						gys:this.gysmc,
						platform:this.select_plat_ids.join(','),
						zyhp:this.zyhp,
						sort_field:this.xl_sort_field,
						sort_type:this.xl_sort_type,
					}
					operResource.gysSalenumExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商销量排行');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//供应商缺货排行
			getGysOutStock(){
				let arg = {
					date:this.date?this.date:'',
					gys:this.gysmc,
					platform:this.select_plat_ids.join(','),
					zyhp:this.zyhp,
					sort_field:this.qh_sort_field,
					sort_type:this.qh_sort_type,
					page:this.qh_page,
					pagesize:this.qh_pagesize
				}
				operResource.getGysOutStock(arg).then(res => {
					if(res.data.code == 1){
						this.qhDataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商缺货排序
			qhSortChange(column){
				this.qh_sort_field = column.prop;
				this.qh_sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getGysOutStock();
			},
			//供应商缺货分页
			qhHandleSizeChange(val) {
				this.qh_pagesize = val;
				//获取列表
				this.getGysOutStock();
			},
			qhHandleCurrentChange(val) {
				this.qh_page = val;
				//获取列表
				this.getGysOutStock();
			},
			//导出
			qhCommitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date:this.date?this.date:'',
						gys:this.gysmc,
						platform:this.select_plat_ids.join(','),
						zyhp:this.zyhp,
						sort_field:this.qh_sort_field,
						sort_type:this.qh_sort_type,
					}
					operResource.gysOutstockExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商缺货排行');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		}
	}
</script>
<style lang="less" scoped>
.table_row{
	height: 700px;
	width: 100%;
	display: flex;
	.xl_table{
		padding-right: 30px;
		width: 50%;
	}
	.qh_table{
		width: 50%;
	}
	.table_item{
		.table_title_row{
			margin-bottom: 15px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.title{
				font-size: 14px;
				color:#333333;
				font-weight: bold;
			}
		}
	}
}
</style>