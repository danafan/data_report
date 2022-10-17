<template>
	<div>
		<div class="page_top">
			<div class="toast_box">
				<div class="toast_title">关键指标含义</div>
				<div class="item_row" v-for="item in toast_list">
					<div class="dian"></div>
					<div>{{item}}</div>
				</div>
			</div>
			<div class="form_box">
				<el-form :inline="true" size="mini" class="demo-form-inline">
					<dps @callBack="checkReq"></dps>
					<el-form-item label="付款日期:">
						<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="table_title">店铺发货情况</div>
		<el-table size="small" :data="store_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="storeSortChange" :header-cell-class-name="storeHeaderHandler">
			<el-table-column prop="shop_name" label="店铺名称" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="fh_0" label="今日已发货" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="dd_0" label="今日订单总数" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="fhl_0" label="今日发货率" align="center"></el-table-column>
			<el-table-column prop="fhl_1" label="两日发货率" align="center"></el-table-column>
			<el-table-column prop="fhl_2" label="三日发货率" align="center"></el-table-column>
			<el-table-column prop="fhl_3" label="四日发货率" align="center"></el-table-column>
			<el-table-column prop="xtsy" label="系统剩余订单数" align="center"></el-table-column>
			<el-table-column prop="yc_dp" label="系统异常订单" align="center"></el-table-column>
			<el-table-column prop="rate" label="多件订单比例" align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="sizeChange($event,'store')" @current-change="pageChange($event,'store')" :current-page="store_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="store_total">
			</el-pagination>
		</div>
		<div class="table_chart">
			<div class="table_box">
				<div class="table_title">部门发货情况</div>
				<el-table size="small" :data="dept_data" tooltip-effect="dark" style="position: absolute;width: 100%" :max-height="300" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="deptSortChange" :header-cell-class-name="deptHeaderHandler">
					<el-table-column prop="name" label="部门" width="120" show-overflow-tooltip align="center" fixed></el-table-column>
					<el-table-column prop="fh_0" label="今日已发货" width="110" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="dd_0" label="今日订单总数" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_0" label="今日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="fhl_1" label="两日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="fhl_2" label="三日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="fhl_3" label="四日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="xtsy" label="系统剩余订单数" width="110" align="center"></el-table-column>
					<el-table-column prop="yc_dp" label="系统异常订单" width="100" align="center"></el-table-column>
					<el-table-column prop="rate" label="多件订单比例" width="100" align="center">
					</el-table-column>
				</el-table>
				<div class="page bottom">
					<el-pagination @size-change="sizeChange($event,'dept')" @current-change="pageChange($event,'dept')" :current-page="dept_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dept_total">
					</el-pagination>
				</div>
			</div>
			<div class="zb_chart" id='dept_zb'></div>
		</div>
		<div class="table_chart">
			<div class="table_box">
				<div class="table_title">平台发货情况</div>
				<el-table size="small" :data="platform_data" tooltip-effect="dark" style="position: absolute;width: 100%" :max-height="300" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="platformSortChange" :header-cell-class-name="platformHeaderHandler">
					<el-table-column prop="name" label="平台" width="120" show-overflow-tooltip align="center" fixed></el-table-column>
					<el-table-column prop="fh_0" label="今日已发货" width="110" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="dd_0" label="今日订单总数" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_0" label="今日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="fhl_1" label="两日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="fhl_2" label="三日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="fhl_3" label="四日发货率" width="80" align="center"></el-table-column>
					<el-table-column prop="xtsy" label="系统剩余订单数" width="110" align="center"></el-table-column>
					<el-table-column prop="yc_dp" label="系统异常订单" width="100" align="center"></el-table-column>
					<el-table-column prop="rate" label="多件订单比例" width="100" align="center">
					</el-table-column>
				</el-table>
				<div class="page bottom">
					<el-pagination @size-change="sizeChange($event,'platform')" @current-change="pageChange($event,'platform')" :current-page="platform_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="platform_total">
					</el-pagination>
				</div>
			</div>
			<div class="zb_chart" id='dept_zb'></div>
		</div>
	</div>
</template>
<script>
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import demandResource from '../../../api/demandResource.js'
	export default{
		data(){
			return{
				toast_list:[
				'本报告数据源为实时数据源，展示订单发货情况',
				'数据更新方式：每小时一更新',
				'今日发货数：付款日期为数据写入日期当天的已发货的内部订单号数',
				'今日订单总数：付款日期为数据写入日期当天的所有的内部订单号数',
				'今日发货率：今日发货数/今日订单总数',
				'两日发货率：昨日发货数/昨日订单总数',
				'三日发货率：前天发货数/前天订单总数',
				'四日发货率：大前天发货数/大前天订单总数',
				'每单(内部订单号)对应的销售数量等于1的订单为一件订单；大于1的订单为多件订单',
				'一件订单：付款日期为数据写入日期前1天至脚本运行时间单件订单的内部订单号数',
				'多件订单：付款日期为数据写入日期前1天至脚本运行时间的多件订单的内部订单号数',
				'多件订单比例：多件订单/(一件订单+多件订单）',
				'系统剩余订单数：近一个月未发货订单的原始线上订单号数',
				'缺货件数：付款日期为近一个月的所有deer_shop店铺缺货数（销售数量）',
				'有货件数：付款日期为近一个月的所有deer_shop店铺有货数（销售数量）',
				],
				dept_name:[],								//项目部
				pl:[],										//平台
				shop_code:[],								//店铺
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										
				date:[getNowDate(),getNowDate()],			//时间区间
				store_page:1,			//店铺分页
				store_size:10,			//店铺分页
				store_data:[],			//店铺数据
				store_total:0,			//店铺发货情况总计
				store_sort_field:{},	//店铺排序字段处理
				dept_page:1,			//部门分页
				dept_size:10,			//部门分页
				dept_data:[],			//部门数据
				dept_total:0,			//部门发货情况总计
				dept_sort_field:{},		//部门排序字段处理
				platform_page:1,			//平台分页
				platform_size:10,			//平台分页
				platform_data:[],			//平台数据
				platform_total:0,			//平台发货情况总计
				platform_sort_field:{},		//平台排序字段处理
			}
		},
		created(){
			//点击搜索
			this.searchFn();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
			//点击搜索
			searchFn(){
				//获取店铺发货情况
				this.store_page = 1;
				this.store_size = 10;
				this.getTableList('store');
				//获取部门发货情况
				this.dept_page = 1;
				this.dept_size = 10;
				this.getTableList('dept');
				//获取平台发货情况
				this.platform_page = 1;
				this.platform_size = 10;
				this.getTableList('platform');
			},
			//店铺表头
			storeHeaderHandler({ row, column, rowIndex, columnIndex }) {  
				if(this.store_sort_field[column.property]){
					column.order = this.store_sort_field[column.property];
				}    
			},  
			//店铺排序    
			storeSortChange({ column, prop, order }) {      
				if(!order || this.store_sort_field[prop] === order){
					this.store_sort_field[prop] = null;
				}else{
					this.store_sort_field[prop] = order;
				}
				//获取店铺发货情况
				this.getTableList('store');
			},
			//部门表头
			deptHeaderHandler({ row, column, rowIndex, columnIndex }) {  
				if(this.dept_sort_field[column.property]){
					column.order = this.dept_sort_field[column.property];
				}    
			},  
			//部门排序    
			deptSortChange({ column, prop, order }) {      
				if(!order || this.dept_sort_field[prop] === order){
					this.dept_sort_field[prop] = null;
				}else{
					this.dept_sort_field[prop] = order;
				}
				//获取店铺发货情况
				this.getTableList('dept');
			},
			//平台表头
			deptHeaderHandler({ row, column, rowIndex, columnIndex }) {  
				if(this.platform_sort_field[column.property]){
					column.order = this.platform_sort_field[column.property];
				}    
			},  
			//平台排序    
			deptSortChange({ column, prop, order }) {      
				if(!order || this.platform_sort_field[prop] === order){
					this.platform_sort_field[prop] = null;
				}else{
					this.platform_sort_field[prop] = order;
				}
				//获取平台发货情况
				this.getTableList('platform');
			},
			//获取店铺发货情况
			getTableList(type){
				let arg = {
					type:`${type}_name`,
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_name:this.shop_code.join(','),
					page:this[`${type}_page`],
					pagesize:this[`${type}_size`],
					sort:this.sortFn(this[`${type}_sort_field`])
				}
				demandResource.supplierSend(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this[`${type}_data`] = data.data;
						this[`${type}_total`] = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//处理排序字段
			sortFn(sort_field){
				let sort = [];
				for(let k in sort_field){
					if(sort_field[k]){
						let str = k + '-' + (sort_field[k] == 'descending'?'desc':'asc');
						sort.push(str);
					}
				}
				return sort.join('-');
			},
			//分页
			sizeChange(v,type) {
				this[`${type}_size`] = v;
				this.getTableList(type);
			},
			pageChange(v,type) {
				this[`${type}_page`] = v;
				this.getTableList(type);
			},
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.page_top{
	display: flex;
	.toast_box{
		margin-top: 15px;
		padding: 10px;
		border-radius: 10px;
		border:1px solid #8D5714;
		width: 50%;
		.toast_title{
			font-weight: bold;
			font-size: 16px;
			color: #8D5714;
		}
		.item_row{
			display:flex;
			align-items: center;
			font-size: 14px;
			color: #8D5714;
			.dian{
				margin-right: 8px;
				border-radius: 3px;
				background:#8D5714; 
				width: 6px;
				height: 6px;
			}
		}
	}
	.form_box{
		width: 50%;
	}
}
.table_title{
	height: 42px;
	line-height: 42px;
	text-align: center;
	font-size:15px;
	color: #333333;
	font-weight: bold;
}
.table_chart{
	margin-top: 15px;
	display: flex;
	.table_box{
		margin-right:15px;
		flex:1;
		position: relative;
		.bottom{
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}
	.zb_chart{
		border:1px solid red;
		width: 380px;
		height: 380px;
	}
}
</style>