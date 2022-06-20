<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="ksbm" clearable filterable remote reserve-keyword :popper-append-to-body="false" :remote-method="getKsbm" placeholder="全部">
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品编码：">
				<el-input clearable v-model="spbm" placeholder="商品编码"></el-input>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="gysmc" clearable :popper-append-to-body="false" filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="title">每小时(整点)更新一次</div>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
			<el-table-column prop="ksbm" width="120" show-overflow-tooltip label="款式编码" align="center"></el-table-column>
			<el-table-column prop="spbm" width="120" show-overflow-tooltip label="商品编码" align="center"></el-table-column>
			<el-table-column prop="gysmc" width="120" show-overflow-tooltip label="供应商名称" align="center"></el-table-column>
			<el-table-column prop="gysksbm" width="120" show-overflow-tooltip label="供应商款式" align="center"></el-table-column>
			<el-table-column prop="gysspbm" width="120" show-overflow-tooltip label="供应商商品编码" align="center"></el-table-column>
			<el-table-column prop="sl" label="数量" width="120" align="center">
			</el-table-column>
			<el-table-column prop="zcsjkc" sortable width="140" label="主仓实际库存" align="center"></el-table-column>
			<el-table-column prop="ddzy" sortable width="140" label="订单占有" align="center"></el-table-column>
			<el-table-column prop="kys" sortable width="140" label="可用数" align="center"></el-table-column>
			<el-table-column prop="jhckc" sortable width="190" label="进货仓库存" align="center"></el-table-column>
			<el-table-column prop="cgxds" sortable width="140" label="采购下单数量" align="center"></el-table-column>
			<el-table-column prop="cgrks" sortable width="140" label="采购入库数量" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	font-size:14px;
		color: red;
	align-items: center;
	justify-content: space-between;
}
</style>
<script>
	import dwResource from '../../../api/dwResource.js'
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				ks_list:[],				//款式编码列表
				ksbm:"",				//选中的款式编码
				spbm:"",				//商品编码
				gys_list:[],			//供应商
				gysmc:"",				//选中的供应商
				dataObj:{},				//返回数据
				sort_field:"",			//排序字段
				sort_type:"",			//排序方式
				page:1,
				pagesize:10,
			}
		},
		created(){
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
					resource.ajaxGys({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//排序
			sortChange(column){
				this.sort_field = column.prop;
				this.sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getData();
			},
 			//搜索
 			searchFn(){
 				this.page = 1;
 				this.getData();
 			},
			//获取列表
			getData(){
				let arg = {
					ksbm:this.ksbm,
					spbm:this.spbm,
					gysmc:this.gysmc,
					sort_field:this.sort_field,
					sort_type:this.sort_type,
					page:this.page,
					pagesize:this.pagesize
				}
				dwResource.dewuSku(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:this.ksbm,
						spbm:this.spbm,
						gysmc:this.gysmc,
						sort_field:this.sort_field,
						sort_type:this.sort_type,
					}
					dwResource.dewuSkuExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'未发货明细-包含预发');
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
		}
	}
</script>










