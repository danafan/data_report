<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="gysmc" clearable filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_title_row">
			<div class="title">供应商销量排名</div>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column prop="gys" show-overflow-tooltip label="供应商" align="center"></el-table-column>
			<el-table-column prop="kssl" sortable='custom' label="款式数量" align="center"></el-table-column>
			<el-table-column prop="xssl" sortable='custom' label="15天销量" align="center"></el-table-column>
			<el-table-column prop="cgcb" sortable='custom' show-overflow-tooltip label="采购金额" align="center"></el-table-column>
			<el-table-column prop="cgcb_rank" sortable='custom' show-overflow-tooltip label="采购金额排行" align="center"></el-table-column>
			<el-table-column prop="mlv" sortable='custom' show-overflow-tooltip label="毛利率" align="center"></el-table-column>
			<el-table-column prop="mlv_rank" sortable='custom' show-overflow-tooltip label="毛利率排名" align="center"></el-table-column>
			<el-table-column prop="stl" sortable='custom' show-overflow-tooltip label="实退率" align="center"></el-table-column>
			<el-table-column prop="stl_rank" sortable='custom' show-overflow-tooltip label="实退率排名" align="center"></el-table-column>
			<el-table-column prop="dhl" sortable='custom' show-overflow-tooltip label="到货率" align="center"></el-table-column>
			<el-table-column prop="dhl_rank" sortable='custom' show-overflow-tooltip label="到货率排名" align="center"></el-table-column>
			<el-table-column prop="gys_level" label="供应商等级" show-overflow-tooltip align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
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
				date:"",							//日期
				page:1,
				pagesize:10,						//销量页码
				sort_field:"",
				sort_type:"",					//销量排序
				dataObj:{},						//销量数据
				loading:false,
			}
		},
		created(){
			//平台列表
			this.ajaxPlat();
			//供应商销量
			this.getGysSalenum();
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
				this.page = 1;
				//供应商销量
				this.getGysSalenum();
			},
			//供应商销量
			getGysSalenum(){
				let arg = {
					date:this.date?this.date:'',
					gys:this.gysmc,
					sort_field:this.sort_field,
					sort_type:this.sort_type,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				operResource.getGysSalenum(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商销量排序
			sortChange(column){
				this.sort_field = column.prop;
				this.sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getGysSalenum();
			},
			//供应商销量分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getGysSalenum();
			},
			handleCurrentChange(val) {
				this.page = val;
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
						sort_field:this.sort_field,
						sort_type:this.sort_type,
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
		}
	}
</script>
<style lang="less" scoped>
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
</style>