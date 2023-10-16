<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否前200款：">
				<el-select v-model="sfqlb" clearable :popper-append-to-body="false" placeholder="是否前200款">
					<el-option label="是" value="是"></el-option>
					<el-option label="否" value="否"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否持续缺货：">
				<el-select v-model="sfcxqh" clearable :popper-append-to-body="false" placeholder="是否持续缺货">
					<el-option label="是" value="是"></el-option>
					<el-option label="否" value="否"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="export_row">
			<div class="update_time">更新时间：{{dataObj.update_time}}</div>
			<div class="flex">
				<el-button type="primary" plain size="mini" @click="exportGrabSku">导出缺货sku<i class="el-icon-download el-icon--right"></i></el-button>
				<el-button type="primary" plain size="mini" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<el-table size="small" ref="multipleTable" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="630px" :header-cell-style="{'background':'#f4f4f4'}" :row-class-name="tableRowClassName" v-loading="loading" @sort-change="tableSortChange">
			<el-table-column prop="gys" label="供应商" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="ksbm" label="款式编码" align="center" sortable="custom">
				<template slot-scope="scope">
					<!-- 下钻 -->
					<el-tooltip placement="top-end">
						<div slot="content">
							<el-button type="text" size="mini" @click="getDetail(scope.row.ksbm)">下钻</el-button>
						</div>
						<div style="color: #1890FF">{{scope.row.ksbm}}</div>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="gysbm" label="供应商货号" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="qhs" label="缺货数" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="df_qhs" label="缺货数(包含代发)" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="3_xssl" label="3天销量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="7_xssl" label="7天销量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="kc" label="现有库存" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="dhs" label="今日到货数" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="sfq200" label="是否前200款" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="sfcxqh" label="是否持续缺货" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 下钻 -->
		<el-dialog title="款式信息" @close="closeDetail" :visible.sync="detailDialog">
			<el-table :data="data" size="mini" @sort-change="detailSortChange">
				<el-table-column align="center" prop="ksbm" label="款号"></el-table-column>
				<el-table-column align="center" prop="color" label="图片">
					<template slot-scope="scope">
						<el-image :z-index="2006" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="scope.row.images"></el-image>
						<div v-else></div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="color" label="颜色"></el-table-column>
				<el-table-column align="center" prop="size" label="尺码"></el-table-column>
				<el-table-column prop="qhs" label="缺货数" align="center" show-overflow-tooltip sortable="custom">
				</el-table-column>
				<el-table-column prop="df_qhs" label="缺货数(包含代发)" align="center" width="120px" show-overflow-tooltip sortable="custom">
				</el-table-column>
				<el-table-column prop="3_xssl" label="3天销量" align="center" show-overflow-tooltip sortable="custom">
				</el-table-column>
				<el-table-column prop="7_xssl" label="7天销量" align="center" show-overflow-tooltip sortable="custom">
				</el-table-column>
				<el-table-column prop="kc" label="现有库存" align="center" show-overflow-tooltip sortable="custom">
				</el-table-column>
				<el-table-column prop="dhs" label="今日到货数" width="120px" align="center" show-overflow-tooltip sortable="custom">
				</el-table-column>
				<el-table-column prop="sfq200" label="是否前200款" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="sfcxqh" label="是否持续缺货" width="100px" align="center" show-overflow-tooltip>
				</el-table-column>
				
			</el-table>
			<div class="page">
				<el-pagination
				@size-change="detailSizeChange"
				@current-change="detailCurrentChange"
				:current-page="detail_page"
				:pager-count="11"
				:page-sizes="[5, 10, 15, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				>
			</el-pagination>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button size="mini" type="primary" @click="detailDialog = false">关闭</el-button>
		</span>
	</el-dialog>
</div>
</template>
<style type="text/css">
.red_color{
	background: #F6BD16!important;
}
</style>
<style lang="less" scoped>
.export_row{
	margin-bottom:5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.update_time{
		color: red;
		font-size: 14px; 
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				sfqlb:"",
				sfcxqh:"",
				pagesize:10,
				page:1,
				dataObj:{},
				table_sort:"",
				loading:false,
				detailDialog:false,			
				detail_page:1,
				detail_page_size:10,
				ksbm:"",
				detail_sort:"",
				data:[],
				total:0
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//指定行颜色
			tableRowClassName(row, rowIndex) {
				if (row.row.sfq200 == '是') {
					return 'red_color';
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
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxGyshh({name:e}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
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
			//表格排序    
			tableSortChange({ column, prop, order }) {  
				if(order){
					this.table_sort = prop + '-' + (order == 'ascending'?'1':'0');
				}else{
					this.table_sort = "";
				}
				this.getList();
			}, 
			//获取列表
			getList(){		
				let arg = {
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					gysbm:this.select_gyshh_ids.join(','),
					sfcxqh:this.sfcxqh,
					sfqlb:this.sfqlb,
					page:this.page,
					pagesize:this.pagesize,
					sort:this.table_sort
				}
				this.loading = true;
				demandResource.grabGoods(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出缺货sku
			exportGrabSku(){
				MessageBox.confirm('确认导出缺货sku?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						gysbm:this.select_gyshh_ids.join(','),
						sfcxqh:this.sfcxqh,
						sfqlb:this.sfqlb,
						sort:this.table_sort
					}
					demandResource.grabSkuExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'缺货sku报表');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//导出
			exportFile(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						gysbm:this.select_gyshh_ids.join(','),
						sfcxqh:this.sfcxqh,
						sfqlb:this.sfqlb,
						sort:this.table_sort
					}
					demandResource.grabGoodsExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'抢货报表');
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
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
			//详情排序
			detailSortChange({ column, prop, order }) {  
				if(order){
					this.detail_sort = prop + '-' + (order == 'ascending'?'1':'0');
				}else{
					this.detail_sort = "";
				}
				this.getDetail(this.ksbm);
			}, 
			//获取下钻内容
			getDetail(ksbm){
				this.ksbm = ksbm;
				let arg = {
					page:this.detail_page,
					pagesize:this.detail_page_size,
					ksbm:this.ksbm,
					sort:this.detail_sort
				}
				demandResource.grabGoodsSku(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data.data;
						data.map(item => {
							let images = [];
							if(item.tp_url != ''){
								images.push(item.tp_url);
								item.images = images;
							}else{
								item.images = null;
							}
						})
						this.data = data;
						this.total = res.data.data.total
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭
			closeDetail(){
				this.detail_page = 1;
			},
			//分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				//获取列表
				this.getDetail(this.ksbm);
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetail(this.ksbm);
			}
		}
	}
</script>