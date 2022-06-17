<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="白坯款商品编码：">
				<el-select v-model="select_bpkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款商品编码" :remote-method="bpkhList" collapse-tags>
					<el-option v-for="item in bpkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_ksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="ksbmList" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商名称：">
				<el-select v-model="select_gys_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商名称" :remote-method="gysList" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商编码：">
				<el-select v-model="select_gysbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商编码" :remote-method="gysbmList" collapse-tags>
					<el-option v-for="item in gysbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" :summary-method="getSummaries" show-summary @sort-change="sortChange">
			<el-table-column prop="bpspbm" label="白坯款商品编码" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="bpkh" label="白坯款款式编码" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="thkh_num" label="烫画款款数" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="thkh_sale_num" label="动销款数" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="color" label="颜色" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="size" label="尺码规格" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gys" label="供应商名称" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gyshh" label="供应商编码" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="yes_xssl" label="昨日销量" sortable show-overflow-tooltip width="120" align="center">
			</el-table-column>
			<el-table-column prop="3_xssl" label="三天销量" sortable show-overflow-tooltip width="120" align="center">
			</el-table-column>
			<el-table-column prop="7_xssl" label="七天销量" width="100" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="available_num" label="可用数" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="stock" label="库存" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="xjcw_stock" label="箱及仓位库存" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="th_out_stock" width="120" label="烫画款负库存" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="th_stock" width="120" label="烫画款库存" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="jhc_stock" label="进货仓库存" width="120" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="out_of_stock" label="缺货" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="safety_stock" width="100" label="安全库存" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="purchase_num" label="采购数" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="hgl" label="白坯合格率" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="!!scope.row.hgl">{{scope.row.hgl}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="pre_rate" label="售前退货率" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="!!scope.row.pre_rate">{{scope.row.pre_rate}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="fut_rate" label="售后退货率" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="!!scope.row.fut_rate">{{scope.row.fut_rate}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/procurementResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				bpkh_list:[],				//白坯商品编码
				select_bpkh_list:[],		//选中的白坯商品编码列表
				ksbm_list:[],				//款式编码列表
				select_ksbm_list:[],		//选中的白坯款式编码列表
				gys_list:[],				//供应商列表
				select_gys_list:[],			//选中的供应商列表
				gysbm_list:[],				//供应商编码列表
				select_gysbm_list:[],		//选中的供应商编码列表
				page:1,
				pagesize:10,
				sort:"",
				dataObj:{},
				total_data:{}
			}
		},
		created(){
			//获取列表
			this.getList();
			//总计
			this.drawGoodsTotal();
		},
		methods:{
			getSummaries(param) {
				var total_row = [];
				param.columns.map(item => {
					total_row.push(this.total_data[item.property]);
				})
				//总计
				return total_row;
			},
			//白坯商品编码
			bpkhList(e){
				this.searchDrawData('bpspbm',e)
			},
			//白坯款式编码
			ksbmList(e){
				this.searchDrawData('bpkh',e)
			},
			//供应商列表
			gysList(e){
				this.searchDrawData('gys',e)
			},
			//供应商编码
			gysbmList(e){
				//获取查询条件
				this.searchDrawData('gyshh',e)
			},
			//获取查询条件
			searchDrawData(field,field_value){
				let arg = {
					field:field,
					field_value:field_value
				}
				resource.searchWhiteData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
						}else if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}else if(field == 'gys'){
							this.gys_list = res.data.data;
						}else if(field == 'gyshh'){
							this.gysbm_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFn(){
				this.page = 1;
 				//获取列表
 				this.getList();
 				//总计
 				this.drawGoodsTotal();
 			},
 			//排序
 			sortChange(column){
 				if(column.order){
 					let order = column.order == 'ascending'?'asc':'desc';
 					this.sort = column.prop + '-' + order;
 				}else{
 					this.sort = '';
 				}
 				this.getList();
 			},
 			//导出
 			commitExport(){
 				MessageBox.confirm('确认导出?', '提示', {
 					confirmButtonText: '确定',
 					cancelButtonText: '取消',
 					type: 'warning'
 				}).then(() => {
 					let arg = {
 						bpspbm:this.select_bpkh_list.join(','),
 						bpkh:this.select_ksbm_list.join(','),
 						gys:this.select_gys_list.join(','),
 						gyshh:this.select_gysbm_list.join(','),
 						sort:this.sort
 					}
 					resource.whiteGoodsListExport(arg).then(res => {
 						if(res){
 							exportPost("\ufeff" + res.data,'白坯款商品编码');
 						}
 					})
 				}).catch(() => {
 					Message({
 						type: 'info',
 						message: '取消导出'
 					});          
 				});
 			},
			//获取列表
			getList(type){
				let arg = {
					bpspbm:this.select_bpkh_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					gys:this.select_gys_list.join(','),
					gyshh:this.select_gysbm_list.join(','),
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				resource.whiteGoodsList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//总计
			drawGoodsTotal(){
				let arg = {
					bpspbm:this.select_bpkh_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					gys:this.select_gys_list.join(','),
					gyshh:this.select_gysbm_list.join(',')
				}
				resource.whiteGoodsTotal(arg).then(res => {
					if(res.data.code == 1){
						var data = res.data.data;
						data['bpspbm'] = '总计';
						this.total_data = data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>