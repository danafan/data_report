<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="烫画片商品编码：">
				<el-select v-model="thspbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画片商品编码" :remote-method="getSpbm" collapse-tags >
					<el-option v-for="item in thspbm" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画片款式编码：">
				<el-select v-model="thksbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画片款式编码" :remote-method="getKsbm" collapse-tags >
					<el-option v-for="item in thksbm" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="成衣商品编码：">
				<el-select v-model="cyspbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入成衣商品编码" :remote-method="getCyspbm" collapse-tags >
					<el-option v-for="item in cyspbm" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<!-- <el-form-item label="统计日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item> -->
			<el-form-item>
				<el-button type="primary" size="mini" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="630px" @sort-change="tableSortChange" v-loading="loading">
			<el-table-column prop="cyspbm" label="成衣商品编码" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="color" label="颜色" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="cy_3" label="前三天销量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="cy_7" label="前七天销量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="thspbm" label="烫画片商品编码" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="thksbm" label="烫画片款式编码" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sysl" label="使用数量" align="center" show-overflow-tooltip sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/demandResource.js'
	// import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				thspbm:[],			//烫画商品编码
				thspbm_ids:[],		//选中的烫画商品编码
				thksbm:[],			//烫画款式编码
				thksbm_ids:[],		//选中烫画款式编码
				cyspbm:[],			//成衣商品编码
				cyspbm_ids:[],		//选中的成衣商品编码
				page:1,
				pagesize:10,
				// pickerOptions: {
				// 	shortcuts: [{
				// 		text: '当月',
				// 		onClick(picker) {
				// 			const start = getMonthStartDate();
				// 			const end = getCurrentDate();
				// 			picker.$emit('pick', [start, end]);
				// 		}
				// 	},{
				// 		text: '上个月',
				// 		onClick(picker) {
				// 			const start = getLastMonthStartDate(1);
				// 			const end = getLastMonthEndDate(0);
				// 			picker.$emit('pick', [start, end]);
				// 		}
				// 	}, {
				// 		text: '上上个月',
				// 		onClick(picker) {
				// 			const start = getLastMonthStartDate(2);
				// 			const end = getLastMonthEndDate(1);
				// 			picker.$emit('pick', [start, end]);
				// 		}
				// 	}]
				// },	 										//时间区间
				// date:[],
				table_sort:"",		//排序
				loading:false,
				data:[],
				total:0,
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//烫画款商品编码
			getSpbm(v){
				//获取搜索条件列表
				this.statisticalSearch('thspbm',v);
			},
			//烫画款款式编码
			getKsbm(v){
				//获取搜索条件列表
				this.statisticalSearch('thksbm',v);
			},
			//成衣商品编码
			getCyspbm(v){
				//获取搜索条件列表
				this.statisticalSearch('cyspbm',v);
			},
			//获取搜索条件列表
			statisticalSearch(type,keywords){
				let arg = {
					type:type,
					keywords:keywords
				}
				resource.statisticalSearch(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						if(type == 'thspbm'){	
							this.thspbm = data;
						}else if(type == 'thksbm'){	
							this.thksbm = data;
						}else if(type == 'cyspbm'){	
							this.cyspbm = data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			//表格排序    
			tableSortChange({ column, prop, order }) {  
				if(order){
					this.table_sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				}else{
					this.table_sort = "";
				}
				//获取列表
				this.getData();
			}, 
			//获取列表
			getData(){
				let arg = {
					thspbm:this.thspbm_ids.join(','),
					thksbm:this.thksbm_ids.join(','),
					cyspbm:this.cyspbm_ids.join(','),
					// start_time:this.date && this.date.length> 0?this.date[0]:"",
					// end_time:this.date && this.date.length> 0?this.date[1]:"",
					sort:this.table_sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.garmentList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.data = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
}
.num_row{
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>