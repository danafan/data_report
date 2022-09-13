<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
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
					<div class="title">款式销量排名</div>
					<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="small" :data="xlDataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="xl_loading">
					<el-table-column prop="ksbm" show-overflow-tooltip label="款式编码" align="center"></el-table-column>
					<el-table-column prop="xl" sortable='custom' label="销量" align="center"></el-table-column>
					<el-table-column prop="gys" show-overflow-tooltip label="供应商" align="center"></el-table-column>
					<el-table-column prop="gyshh" show-overflow-tooltip label="供应商款号" align="center"></el-table-column>
					<el-table-column prop="zyhp" label="自有货品" align="center"></el-table-column>
					<el-table-column prop="dhl" show-overflow-tooltip label="到货率" align="center"></el-table-column>
					<el-table-column prop="mll" show-overflow-tooltip label="毛利率" align="center"></el-table-column>
					<el-table-column prop="settlement_method" show-overflow-tooltip label="结算方式" align="center"></el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="xl_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="xlDataObj.total">
					</el-pagination>
				</div>
			</div>
			<div class="table_item qh_table">
				<div class="table_title_row">
					<div class="title">款式缺货排名</div>
					<el-button type="primary" plain size="small" @click="qhCommitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="small" :data="qhDataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="qhSortChange" v-loading="qh_loading">
					<el-table-column prop="ksbm" label="款式编码" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="kc" sortable='custom' label="库存" align="center"></el-table-column>
					<el-table-column prop="kys" sortable='custom' label="缺货数" align="center"></el-table-column>
					<el-table-column prop="qhl" label="缺货率" show-overflow-tooltip align="center"></el-table-column>
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
				ks_list:[],							//款式编码列表
				select_ks_ids:[],					//选中的款式编码列表
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
				xl_loading:false,
				qh_loading:false
			}
		},
		created(){
			//平台列表
			this.ajaxPlat();
			//款式销量排行
			this.getKsSalenum();
			//款式缺货排行
			this.getKsOutstock();
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
			//点击搜索
			searchFn(){
				this.xl_page = 1;
				this.qh_page = 1;
				//款式销量排行
				this.getKsSalenum();
				//款式缺货排行
				this.getKsOutstock();
			},
			//款式销量排行
			getKsSalenum(){
				let arg = {
					date:this.date?this.date:'',
					gys:this.gysmc,
					ksbm:this.select_ks_ids.join(','),
					platform:this.select_plat_ids.join(','),
					zyhp:this.zyhp,
					sort_field:this.xl_sort_field,
					sort_type:this.xl_sort_type,
					page:this.xl_page,
					pagesize:this.xl_pagesize
				}
				this.xl_loading = true;
				operResource.getKsSalenum(arg).then(res => {
					if(res.data.code == 1){
						this.xl_loading = false;
						this.xlDataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式销量排行排序
			sortChange(column){
				this.xl_sort_field = column.prop;
				this.xl_sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getKsSalenum();
			},
			//款式销量排行分页
			handleSizeChange(val) {
				this.xl_pagesize = val;
				//获取列表
				this.getKsSalenum();
			},
			handleCurrentChange(val) {
				this.xl_page = val;
				//获取列表
				this.getKsSalenum();
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
						ksbm:this.select_ks_ids.join(','),
						platform:this.select_plat_ids.join(','),
						zyhp:this.zyhp,
						sort_field:this.xl_sort_field,
						sort_type:this.xl_sort_type,
					}
					operResource.ksSalenumExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'款式销量排行');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//款式缺货排行
			getKsOutstock(){
				let arg = {
					date:this.date?this.date:'',
					gys:this.gysmc,
					ksbm:this.select_ks_ids.join(','),
					platform:this.select_plat_ids.join(','),
					zyhp:this.zyhp,
					sort_field:this.qh_sort_field,
					sort_type:this.qh_sort_type,
					page:this.qh_page,
					pagesize:this.qh_pagesize
				}
				this.qh_loading = true;
				operResource.getKsOutstock(arg).then(res => {
					if(res.data.code == 1){
						this.qh_loading = false;
						this.qhDataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式缺货排序
			qhSortChange(column){
				this.qh_sort_field = column.prop;
				this.qh_sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getKsOutstock();
			},
			//款式缺货分页
			qhHandleSizeChange(val) {
				this.qh_pagesize = val;
				//获取列表
				this.getKsOutstock();
			},
			qhHandleCurrentChange(val) {
				this.qh_page = val;
				//获取列表
				this.getKsOutstock();
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
						ksbm:this.select_ks_ids.join(','),
						platform:this.select_plat_ids.join(','),
						zyhp:this.zyhp,
						sort_field:this.qh_sort_field,
						sort_type:this.qh_sort_type,
					}
					operResource.ksOutstockExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'款式缺货排行');
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