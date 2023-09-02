<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="采购日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="仓库：">
				<el-select v-model="ck_ids" clearable multiple filterable placeholder="请输入款式" collapse-tags>
					<el-option v-for="item in ck_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex">
			<div class="flex-1 bar_line" id='bar_line' v-loading="chart_loading"></div>
			<div class="pie" id='pie' v-loading="chart_loading"></div>
		</div>
		<div class="flex">
			<div class="flex-1">
				<PopoverWidget class="table_title" title="款式采购明细" :show_popover="false"/>
				<custom-table v-loading="ksbm_purchase_loading" :isLoading="ksbm_purchase_loading" tableName="ksbm_purchase" max_height="680" :table_data="ksbm_purchase_data" :title_list="purchase_title_list" :is_custom_sort="false" @sortCallBack="ksbmSortCallBack"/>
				<page-widget :page="purchase_page" :pagesize="purchase_pagesize" :total="purchase_total" :pagerCount="5" @handleSizeChange="purchaseHandleSizeChange" @handlePageChange="purchaseHandlePageChange"/>
			</div>
			<div style="width:50%;margin-left: 30px">
				<PopoverWidget class="table_title" title="供应商采购明细" :show_popover="false"/>
				<custom-table v-loading="gys_purchase_loading" :isLoading="gys_purchase_loading" tableName="ksbm_purchase" max_height="680" :table_data="gys_purchase_data" :title_list="gys_title_list" :is_custom_sort="false" @sortCallBack="gysSortCallBack"/>
				<page-widget :page="gys_page" :pagesize="gys_pagesize" :total="gys_total" :pagerCount="5" @handleSizeChange="gysHandleSizeChange" @handlePageChange="gysHandlePageChange"/>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getSomeDay,getNowDate,lastMonthDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import operationResource from '../../../api/operationResource.js'

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		components:{
			CustomTable,
			PageWidget,
			PopoverWidget
		},
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
				date:[lastMonthDate(),getNowDate()],	//时间区间
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				ck_list:[],									//仓库列表
				ck_ids:[],									//选中的仓库
				chart_loading:false,
				barlineChart:null,
				pieChart:null,
				ksbm_purchase_loading:false,
				purchase_title_list:[],
				ksbm_purchase_data:[],
				purchase_total:0,
				purchase_page:1,
				purchase_pagesize:10,
				ksbm_sort:"",
				gys_purchase_loading:false,
				gys_title_list:[],
				gys_purchase_data:[],
				gys_total:0,
				gys_page:1,
				gys_pagesize:10,
				gys_sort:""
			}
		},
		created(){
			//款式编码
			this.getKsbm();
			//供应商列表
			this.getGys();
			//仓库列表
			this.getCk();
			//款式采购明细
			this.ksbmPurchaseList();
			//供应商采购明细
			this.gysPurchaseList();
		},
		mounted(){
			//获取顶部两个图表数据
			this.dayDhlChart();
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
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//仓库列表
			getCk(){
				resource.ajaxCk().then(res => {
					if(res.data.code == 1){
						this.ck_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取顶部两个图表数据
			dayDhlChart(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					ckmc:this.ck_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ksbm:this.select_ks_ids.join(',')
				}
				this.chart_loading = true;
				operationResource.dayDhlChart(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						this.chart_loading = false;
						let data = res.data.data;
						//折柱一体数据
						let x_axis = data.days;			//横坐标
						let avg_dhl = data.avg_dhl;
						let day_chart = data.day_chart;
						let cgsl_data = [];
						let dhl_data = [];
						day_chart.map(item => {
							cgsl_data.push(item.cgsl);
							dhl_data.push(item.dhl);
						})

						var bar_line = document.getElementById('bar_line');
						this.barlineChart = echarts.getInstanceByDom(bar_line)
						if (this.barlineChart == null) { 
							this.barlineChart = echarts.init(bar_line);
						}
						this.barlineChart.setOption(this.setBarLineOptions(x_axis,cgsl_data,dhl_data,avg_dhl));
						// 饼图数据
						let total_num =  data.ck_lists.reduce((total, currentValue, currentIndex, arr) => {
							return currentValue.cgsl ? (total + currentValue.cgsl) : total;
						}, 0);
						let pie_series_data = data.ck_lists.map(item => {
							let o = {
								value:item.cgsl,
								zb:this.getZb(total_num,item.cgsl),
								name:item.ckmc
							}
							return o;
						})
						var pie = document.getElementById('pie');
						this.pieChart = echarts.getInstanceByDom(pie)
						if (this.pieChart == null) { 
							this.pieChart = echarts.init(pie);
						}
						this.pieChart.setOption(this.setPieOptions(pie_series_data));
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//计算百分比
			getZb(total,num){
				return ((num/total)*100).toFixed(2);
			},
			//采购数量/到货率图表
			setBarLineOptions(x_axis,cgsl_data,dhl_data,avg_dhl){
				return {
					title: {
						text: '到货率每日波动'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = '采购日期：' + params[0].axisValueLabel + "</br>"
							+ params[0].seriesName  + '：' + params[0].value + "</br>"
							+ params[1].seriesName  + '：' + params[1].value + '%' + "</br>";
							return tip;
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
					legend: {
						data: ['采购数量', '到货率']
					},
					grid: {
						left:'50',
						right:'50',
						bottom: '30',
					},
					xAxis: [
					{
						type: 'category',
						data: x_axis,
						axisPointer: {
							type: 'shadow'
						}
					}
					],
					yAxis: [
					{
						type: 'value',
						name: '采购数量',
						axisLabel: {
							formatter: '{value}'
						}
					},
					{
						type: 'value',
						name: '到货率',
						axisLabel: {
							formatter: '{value} %'
						}
					}
					],
					series: [
					{
						name: '采购数量',
						type: 'bar',
						data: cgsl_data
					},
					{
						name: '到货率',
						type: 'line',
						smooth: true,
						yAxisIndex: 1,
						data: dhl_data,
						markLine: {
							label: {
								position:'insideEndTop',
								formatter: function (params) {
									return `平均到货率：${params.value}%`;
								}
							},
							data: [
							{
								silent: true, 
								lineStyle: {
									type: "dashed",
									color: "#FA3934",
								},
								yAxis: avg_dhl, 
							},
							]
						},
					}
					]
				}
			},
			//饼图图表
			setPieOptions(pie_series_data){
				return {
					title: {
						text: '采购数量仓库分布',
						left:'center',
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return "仓库名称：" + params.data.name + '</br>' 
							+ "采购数量：" + params.data.value + '</br>'
							+ "[采购数量]的总额百分比：" + params.data.zb + '%';
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
					series: [
					{
						type: 'pie',
						radius: [0, '70%'],
						label:{
							show:true,
							position:'inner',
							lineHeight: 16,
							formatter:(params) => {
								return params.data.name + '\n'
								+ params.data.zb + '%' + '\n'
								+ params.data.value;
							},
						},
						data: pie_series_data,
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
					]
				}
			},
			//款式采购明细
			ksbmPurchaseList(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					ckmc:this.ck_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					sort:this.ksbm_sort
				}
				this.ksbm_purchase_loading = true;
				operationResource.ksbmPurchaseList(arg).then(res => {
					if(res.data.code == 1){
						this.ksbm_purchase_loading = false;
						let data = res.data.data;
						this.purchase_title_list = data.title_list;
						this.ksbm_purchase_data = data.table_data.data;
						this.purchase_total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式排序回调
			ksbmSortCallBack(sort){
				this.ksbm_sort = sort;
				//获取列表
				this.ksbmPurchaseList();
			},
			//分页
			purchaseHandleSizeChange(val) {
				this.purchase_pagesize = val;
				//获取列表
				this.ksbmPurchaseList();
			},
			purchaseHandlePageChange(val) {
				this.purchase_page = val;
				//获取列表
				this.ksbmPurchaseList();
			},
			//供应商采购明细
			gysPurchaseList(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					ckmc:this.ck_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					sort:this.gys_sort
				}
				this.gys_purchase_loading = true;
				operationResource.gysPurchaseList(arg).then(res => {
					if(res.data.code == 1){
						this.gys_purchase_loading = false;
						let data = res.data.data;
						this.gys_title_list = data.title_list;
						this.gys_purchase_data = data.table_data.data;
						this.gys_total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商排序回调
			gysSortCallBack(sort){
				this.gys_sort = sort;
				//获取列表
				this.gysPurchaseList();
			},
			//分页
			gysHandleSizeChange(val) {
				this.gys_pagesize = val;
				//获取列表
				this.gysPurchaseList();
			},
			gysHandlePageChange(val) {
				this.gys_page = val;
				//获取列表
				this.gysPurchaseList();
			},
		}
	}
</script>
<style lang="less" scoped>
	.bar_line{
		height: 350px;
	}
	.pie{
		margin-left: 30px;
		width: 350px;
		height: 350px;
	}
	.table_title{
		margin-top: 15px;
		margin-bottom: 15px;
	}
</style>