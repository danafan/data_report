<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="dpmc_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="结算方式：">
				<el-select v-model="jsfs_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in jsfs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="sjxrrq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="商品编码：">
				<el-input clearable v-model="spbm" placeholder="商品编码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="title">店铺款式刷单情况</div>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="table_data.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column :prop="item.row_field_name" :label="item.row_name" align="center" :sortable="item.is_sort?'custom':false" show-overflow-tooltip v-for="item in title_list">
				<template slot-scope="scope">
					<el-image :z-index="2006" class="image" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.row_field_name == 'tp'"></el-image>
					<div v-else>{{scope.row[item.row_field_name]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="table_data.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title{
		font-size: 14px;
		font-weight: bold;
	}
}
</style>
<script>
	import commonResource from '../../../api/resource.js'
	import resource from '../../../api/auditResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				loading:false,
				jsfs_list:[],			//结算方式列表
				jsfs_ids:[],			//选中的结算方式
				ks_list:[],				//款式编码列表
				select_ks_ids:[],		//选中的款式编码列表
				gys_list:[],			//供应商列表
				select_gys_ids:[],		//选中的供应商
				spbm:"",				//商品编码
				shop_list:[],			//店铺列表
				dpmc_ids:[],			//选中的店铺名称
				sjxrrq:"",
				page:1,
				pagesize:10,
				sort:"",
				title_list:[],
				table_data:{},
			}
		},
		created(){
			//获取店铺列表
			this.ajaxShops();
			//供应商结算方式
			this.ajaxJsfs();
			//获取列表（款式）
			this.getData();
		},
		methods:{
			//供应商结算方式
			ajaxJsfs(){
				commonResource.ajaxJsfs().then(res => {
					if(res.data.code == 1){
						this.jsfs_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取款式编码
			getKsbm(e){
				if(e != ''){
					commonResource.ajaxKsbm({name:e}).then(res => {
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
					commonResource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取店铺列表
			ajaxShops(){
				commonResource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					jsfs:this.jsfs_ids.join(','),
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					spbm:this.spbm,
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					shop_name:this.dpmc_ids.join(','),
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.storeSdReport(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.title_list = res.data.data.title_list;
						this.table_data = res.data.data.table_data;
						this.table_data.data.map(item => {
							let images = [];
							images.push(item.tp);
							item['images'] = images;
						})
						console.log(this.table_data)
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.sort = "";
				}   
				this.getData();
			},
			//款式信息列表导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						spbm:this.spbm,
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						shop_name:this.dpmc_ids.join(','),
						sort:this.sort
					}
					resource.storeSdReportExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'店铺款式刷单情况');
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
				this.page = 1;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			}
			
		}
	}
</script>










