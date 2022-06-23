<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="烫画款式编码：">
				<el-select v-model="select_thksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款式编码" :remote-method="thksbmList" collapse-tags>
					<el-option v-for="item in thksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画款商品编码：">
				<el-select v-model="select_thkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款商品编码" :remote-method="thkhList" collapse-tags>
					<el-option v-for="item in thkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款商品编码：">
				<el-select v-model="select_bpkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款商品编码" :remote-method="bpkhList" collapse-tags>
					<el-option v-for="item in bpkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_bpksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="bpksbmList" collapse-tags>
					<el-option v-for="item in bpksbm_list" :key="item" :label="item" :value="item">
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
			<el-form-item label="有无对照白坯款：">
				<el-select v-model="is_bp" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="有" value="0"></el-option>
					<el-option label="无" value="1"></el-option>
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
			<el-table-column prop="bp_gyshh" label="白坯供应商款号" width="120" align="center"></el-table-column>
			<el-table-column prop="bpkh" label="白坯款式编码" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="bpspbm" label="白坯款商品编码" width="130" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="bp_color" label="白坯颜色" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="bp_size" label="白坯尺码规格" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="thkh" label="烫画款式编码" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="thspbm" label="烫画款商品编码" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gys" label="烫画供应商" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gyshh" label="烫画供应商款号" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="color" label="烫画颜色" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="size" label="烫画尺码规格" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="yes_xssl" label="昨日销量" sortable show-overflow-tooltip width="120" align="center">
			</el-table-column>
			<el-table-column prop="3_xssl" label="三天销量" sortable show-overflow-tooltip width="120" align="center">
			</el-table-column>
			<el-table-column prop="7_xssl" label="七天销量" width="100" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="pre_rate" label="售前退货率" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.pre_rate !== null">{{scope.row.pre_rate}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="fut_rate" label="售后退货率" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.fut_rate !== null">{{scope.row.fut_rate}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="available_num" label="可用数" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="stock" label="库存" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="xjcw_stock" width="120" label="箱及仓位库存" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="bp_stock" label="白坯库存" width="120" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="jhc_stock" label="进货仓库存" width="120" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="out_of_stock" label="缺货" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="safety_stock" label="安全库存" width="100" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="purchase_num" label="建议采购数" width="120" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="白坯合格率" width="100" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.hgl !== null">{{scope.row.hgl}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="bp_purchase" width="150" label="今日采购数(8:30前)" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column width="150" label="有无对照白坯款" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_bp == 0?'有':'无'}}</div>
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
				select_thksbm_list:[],		//选中的烫画款式编码
				thksbm_list:[],				//烫画款式编码
				select_bpksbm_list:[],		//选中的白坯款式编码
				bpksbm_list:[],				//白坯款式编码
				thkh_list:[],				//烫画款号列表
				select_thkh_list:[],		//选中的烫画款号列表
				bpkh_list:[],				//白坯款号列表
				select_bpkh_list:[],		//选中的白坯款号列表
				gys_list:[],					//供应商列表
				select_gys_list:[],			//选中的供应商列表
				gysbm_list:[],					//供应商编码列表
				select_gysbm_list:[],			//选中的供应商编码列表
				is_bp:"",						//有无对照白坯款 
				page:1,
				pagesize:10,
				sort:"",
				dataObj:{},
				total_data:{}
			}
		},
		props:{
			dept:{
				type:String,
				default:''
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
			//烫画款式编码
			thksbmList(e){
				this.searchDrawData('thkh',e)
			},
			//白坯款号
			bpksbmList(e){
				this.searchDrawData('bpkh',e)
			},
			//烫画款号
			thkhList(e){
				this.searchDrawData('thspbm',e)
			},
			//白坯款号
			bpkhList(e){
				this.searchDrawData('bpspbm',e)
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
				resource.searchDrawData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'thspbm'){
							this.thkh_list = res.data.data;
						}else if(field == 'thkh'){
							this.thksbm_list = res.data.data;
						}else if(field == 'bpkh'){
							this.bpksbm_list = res.data.data;
						}else if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
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
        				dept_2:this.dept,
        				thkh:this.select_thksbm_list.join(','),
        				bpkh:this.select_bpksbm_list.join(','),
        				thspbm:this.select_thkh_list.join(','),
        				bpspbm:this.select_bpkh_list.join(','),
        				gys:this.select_gys_list.join(','),
        				gyshh:this.select_gysbm_list.join(','),
        				is_bp:this.is_bp,
        				sort:this.sort
        			}
        			if(this.dept == '四部得物组'){
        				resource.drawGoodsListExportFour(arg).then(res => {
        					if(res){
        						exportPost("\ufeff" + res.data,'烫画款商品明细');
        					}
        				})
        			}else{
        				resource.drawGoodsListExport(arg).then(res => {
        					if(res){
        						exportPost("\ufeff" + res.data,'烫画款商品明细');
        					}
        				})
        			}
        		}).catch(() => {
        			Message({
        				type: 'info',
        				message: '取消导出'
        			});          
        		});
        	},
			//获取列表
			getList(){
				let arg = {
					dept_2:this.dept,
					thkh:this.select_thksbm_list.join(','),
					bpkh:this.select_bpksbm_list.join(','),
					thspbm:this.select_thkh_list.join(','),
					bpspbm:this.select_bpkh_list.join(','),
					gys:this.select_gys_list.join(','),
					gyshh:this.select_gysbm_list.join(','),
					is_bp:this.is_bp,
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				if(this.dept == '四部得物组'){
					resource.drawGoodsListFour(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.drawGoodsList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//总计
			drawGoodsTotal(){
				let arg = {
					type:2,
					dept_2:this.dept,
					thkh:this.select_thksbm_list.join(','),
					bpkh:this.select_bpksbm_list.join(','),
					thspbm:this.select_thkh_list.join(','),
					bpspbm:this.select_bpkh_list.join(','),
					gys:this.select_gys_list.join(','),
					gyshh:this.select_gysbm_list.join(','),
					sort:this.sort
				}
				if(this.dept == '四部得物组'){
					resource.drawGoodsTotalFour(arg).then(res => {
						if(res.data.code == 1){
							var data = res.data.data;
							data['bp_gyshh'] = '总计';
							this.total_data = data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.drawGoodsTotal(arg).then(res => {
						if(res.data.code == 1){
							var data = res.data.data;
							data['bp_gyshh'] = '总计';
							this.total_data = data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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