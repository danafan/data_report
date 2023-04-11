<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="日期:">
				<el-date-picker v-model="top_date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="gtfymrbd" id="gtfymrbd"></div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="日期:">
				<el-date-picker v-model="center_date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handleBdPageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<PopoverWidget class="mb-10" title="公摊费用变动" keys="gtfybd"/>
		<custom-table tableName="bdTable" v-loading="bd_loading" max_height="750" :table_data="bd_table_data" :title_list="bd_title_list" :is_custom_sort="false" :total_row="true" :table_total_data="bd_total_data" @sortCallBack="bdSortCallBack"/>
		<page-widget :page="bd_page" :pagesize="bd_pagesize" :total="bd_total" @handleSizeChange="handleBdSizeChange" @handlePageChange="handleBdPageChange"/>
		<PopoverWidget class="mb-10" title="公摊费用明细" :show_popover="false"/>
		<custom-table tableName="mxTable" v-loading="mx_loading" max_height="750" :table_data="mx_table_data" :title_list="mx_title_list" :is_custom_sort="false" :total_row="true" :table_total_data="mx_total_data" @sortCallBack="mxSortCallBack"/>
		<page-widget :page="mx_page" :pagesize="mx_pagesize" :total="mx_total" @handleSizeChange="handleMxSizeChange" @handlePageChange="handleMxPageChange"/>
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate,getNullMonthStartDate,getNextDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		data(){
			return{
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
				top_date:[getCurrentDate()],			//顶部时间区间
				gtfymrbdChart:null,						//公摊费用每日波动
				center_date:[],							//中间日期区间
				bd_loading:false,						//公摊费用变动
				bd_table_data:[],
				bd_title_list:[],
				bd_total_data:{},
				bd_sort:"",
				bd_page:1,
				bd_pagesize:10,
				bd_total:0,
				mx_loading:false,						//公摊费用明细
				mx_table_data:[],
				mx_title_list:[],
				mx_total_data:{},
				mx_sort:"",
				mx_page:1,
				mx_pagesize:10,
				mx_total:0,
			}
		},
		created(){
			// 设置顶部时间区间开始日期
			this.top_date.unshift(getNullMonthStartDate(parseInt(getCurrentDate().split('-')[1])));
			let current_day = parseInt(getNowDate().split('-')[2]);
			if(current_day == 2){
				this.center_date.push(getMonthStartDate());
				this.center_date.push(getMonthStartDate());
			}else{
				this.center_date.push(getNullMonthStartDate(parseInt(getCurrentDate().split('-')[1])));
				this.center_date.push(getNextDate(getNowDate(),-2,true));
			}
			//查询
			this.searchFn();
		},
		methods:{
			//查询
			searchFn(){
				this.bd_sort = "";
				this.bd_page = 1;
				this.bd_pagesize = 10;
				this.bd_total = 0;
				this.mx_sort = "";
				this.mx_page = 1;
				this.mx_pagesize = 10;
				this.mx_total = 0;
				// 公摊费用每日波动
				this.dayGtfyChart();
				//公摊费用变动
				this.dayGtfyList();
				//公摊费用明细
				this.dayGtfyDetial();
			},
			// 公摊费用每日波动
			dayGtfyChart(){
				let arg = {
					start_date:this.top_date[0],
					end_date:this.top_date[1]
				}
				resource.dayGtfyChart(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let data = res.data.data;
						let x_axis = data.day_lists;
						let series_data = data.list;
						let gtfymrbd_ele = document.getElementById('gtfymrbd');
						this.gtfymrbdChart = echarts.getInstanceByDom(gtfymrbd_ele);
						if (this.gtfymrbdChart == null) { 
							this.gtfymrbdChart = echarts.init(gtfymrbd_ele);
						}
						this.gtfymrbdChart.setOption(this.setOptions(x_axis,series_data));
						window.addEventListener('resize',()=>{
							this.gtfymrbdChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 曲线图配置
			setOptions(x_axis,series_data){
				return {
					title: {
						text: '公摊费用每日波动'
					},
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							return `做账日期：${params[0].name}<br/>金额：${params[0].value}`;
							 
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
						axisPointer: {            
							type: 'shadow'        
						}
					},
					xAxis: {
						type: 'category',
						data: x_axis,
						name:"做账日期"
					},
					color:['#c23531'],
					yAxis: {
						type: 'value',
						name:"金额"
					},
					series: [
					{
						data: series_data,
						type: 'line',
						smooth: true
					}
					]
				}
			},
			//公摊费用变动
			dayGtfyList(){
				let arg = {
					start_date:this.top_date[0],
					end_date:this.top_date[1],
					last_start_date:this.center_date[0],
					last_end_date:this.center_date[1],
					page:this.bd_page,
					pagesize:this.bd_pagesize,
					sort:this.bd_sort
				}
				this.bd_loading = true;
				resource.dayGtfyList(arg).then(res => {
					if(res.data.code == 1){
						this.bd_loading = false;
						let data = res.data.data;
						let bd_table_data = data.table_data.data;
						if(bd_table_data.length > 0){
							this.bd_total_data = bd_table_data[0];
							bd_table_data.splice(0,1);
						}
						this.bd_table_data = bd_table_data;
						this.bd_total = data.table_data.total;
						this.bd_title_list = data.title_list;
						
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//公摊费用变动排序回调
			bdSortCallBack(sort){
				this.bd_sort = sort;
				//公摊费用变动
				this.dayGtfyList();
			},
			//公摊费用变动分页
			handleBdSizeChange(val) {
				this.bd_pagesize = val;
				//公摊费用变动
				this.dayGtfyList();
			},
			handleBdPageChange(val) {
				this.bd_page = val;
				//公摊费用变动
				this.dayGtfyList();
			},
			//公摊费用明细
			dayGtfyDetial(){
				let arg = {
					start_date:this.top_date[0],
					end_date:this.top_date[1],
					page:this.mx_page,
					pagesize:this.mx_pagesize,
					sort:this.mx_sort
				}
				this.mx_loading = true;
				resource.dayGtfyDetial(arg).then(res => {
					if(res.data.code == 1){
						this.mx_loading = false;
						let data = res.data.data;
						let mx_table_data = data.table_data.data;
						if(mx_table_data.length > 0){
							this.mx_total_data = mx_table_data[0];
							mx_table_data.splice(0,1);
							
						}
						this.mx_table_data = mx_table_data;

						this.mx_total = data.table_data.total;
						this.mx_title_list = data.title_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//公摊费用明细排序回调
			mxSortCallBack(sort){
				this.mx_sort = sort;
				//公摊费用明细
				this.dayGtfyDetial();
			},
			//公摊费用明细分页
			handleMxSizeChange(val) {
				this.mx_pagesize = val;
				//公摊费用明细
				this.dayGtfyDetial();
			},
			handleMxPageChange(val) {
				this.mx_page = val;
				//公摊费用明细
				this.dayGtfyDetial();
			},
		},
		components:{
			CustomTable,
			PageWidget,
			PopoverWidget
		}
	}
</script>
<style lang="less" scoped>
.gtfymrbd{
	width: 100%;
	height: 360px;
}
</style>