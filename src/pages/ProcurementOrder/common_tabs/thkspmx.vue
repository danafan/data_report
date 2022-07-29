<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="日期：">
				<el-date-picker v-model="creat_rq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
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
			<el-form-item label="烫画款商品编码：">
				<el-select v-model="select_thkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款商品编码" :remote-method="thkhList" collapse-tags>
					<el-option v-for="item in thkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画款式编码：">
				<el-select v-model="select_thksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款式编码" :remote-method="thksbmList" collapse-tags>
					<el-option v-for="item in thksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<el-button type="primary" plain size="mini" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.list.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="tableCellStyle" @sort-change='sortChange'>
			<el-table-column prop="bp_gys" label="白坯供应商款号" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpkh" label="白坯款式编码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpspbm" label="白坯款商品编码" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bp_color" label="白坯颜色" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bp_size" label="白坯尺码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column label="烫画款" align="center">
				<el-table-column prop="thkh" label="烫画款式编码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="thspbm" label="商品编码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_gys" label="供应商" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_gyshh" label="供应商款号" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_color" label="颜色" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_size" label="尺码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="thr_xssl" label="三天前销量" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="scd_xssl" label="两天前销量" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="yes_xssl" label="一天前销量" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="3_xssl" label="三天销量" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="7_xssl" label="七天销量" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_xjcw_stock" label="箱及仓位库存" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_kys" label="可用数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_cgzt" label="采购在途" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="th_jhc_stock" label="进货仓库存" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			</el-table-column>
			<el-table-column label="白坯款" align="center">
				<el-table-column prop="bp_xjcw_stock" label="白坯箱及仓位库存" show-overflow-tooltip width="150" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="bp_kys" label="可用数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="bp_cgzt" label="采购在途" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="bp_jhc_stock" label="进货仓库存" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="min_qty" label="安全库存" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
				<el-table-column prop="bp_hgl" label="白坯合格率" show-overflow-tooltip width="120" align="center" sortable="custom">
					<template slot-scope="scope">
						<div v-if="scope.row.bp_hgl">{{scope.row.bp_hgl}}%</div>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column prop="th_stock_up" label="是否备货" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="is_bp" label="有无对照白坯款" width="130" show-overflow-tooltip align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="fut_rate" label="售后退货率" show-overflow-tooltip width="120" align="center" sortable="custom">
				<template slot-scope="scope">
					<div v-if="scope.row.fut_rate">{{scope.row.fut_rate}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.list.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/procurementResource.js'
	import {getNowDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				creat_rq:getNowDate(),	//日期
				bpkh_list:[],			//白坯商品编码
				select_bpkh_list:[],	//选中的白坯商品编码
				ksbm_list:[],			//白坯款式编码
				select_ksbm_list:[],	//选中的白坯款式编码
				thkh_list:[],			//烫画商品编码
				select_thkh_list:[],	//选中的烫画商品编码
				thksbm_list:[],			//烫画款式编码
				select_thksbm_list:[],	//选中的烫画款式编码
				dataObj:{
					list:{
						data:[]
				}},				//获取到的数据
				page:1,
				pagesize:10,
				sort:""
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
			this.getData();
		},
		methods:{
			tableCellStyle(v){
				if((v.columnIndex == 5 && v.rowIndex == 0) || (v.columnIndex >= 0 && v.columnIndex <= 14  && v.rowIndex == 1)) {
					return 'background:#87CEFA;color:#333333';
				}else if((v.columnIndex == 6 && v.rowIndex == 0) || (v.columnIndex >= 15 && v.columnIndex <= 20  && v.rowIndex == 1)){
					return 'background:#FFD700;color:#333333';
				}else{
					return 'background:#f4f4f4;color:#333333';
				}
			},
			//白坯商品编码
			bpkhList(e){
				this.searchDrawData('bpspbm',e)
			},
			//白坯款式编码
			ksbmList(e){
				this.searchDrawData('bpkh',e)
			},
			//烫画商品编码
			thkhList(e){
				this.searchDrawData('thspbm',e)
			},
			//烫画款式编码
			thksbmList(e){
				this.searchDrawData('thkh',e)
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
						}else if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
						}else if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			searchFn(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//排序
			sortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.sort = column.prop + '-' + order;
				}else{
					this.sort = '';
				}
        		//采购总数
        		this.getData();
        	},
			//获取列表
			getData(){
				let arg = {
					creat_rq:this.creat_rq,
					thkh:this.select_thksbm_list.join(','),
					thspbm:this.select_thkh_list.join(','),
					bpspbm:this.select_bpkh_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoDrawGoodsList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourDrawGoodsList(arg).then(res => {
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
			//分页
			changePage(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			changePageSize(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			//导出
			commitExport(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText:'取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						creat_rq:this.creat_rq,
						thkh:this.select_thksbm_list.join(','),
						thspbm:this.select_thkh_list.join(','),
						bpspbm:this.select_bpkh_list.join(','),
						bpkh:this.select_ksbm_list.join(','),
						sort:this.sort
					}
					if(this.dept == 'er_dept'){
						resource.twoDrawGoodsExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'烫画款商品明细');
							}
						})
					}else if(this.dept == 'si_dept'){
						resource.fourDrawGoodsExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'烫画款商品明细');
							}
						})
					}else{
						resource.drawGoodsExport(arg).then(res => {
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
			}
		}
	}
</script>
<style scoped lang="less">
.table_top{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
}
</style>