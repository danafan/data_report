<template>
	<div>
		<dps @callBack="checkReq"></dps>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="公司：">
				<el-select v-model="company" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in company_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="付款日期：">
				<el-date-picker v-model="select_day" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格数据 -->
		<el-table size="small" :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="500">
			<el-table-column prop="shop_name" label="店铺" align="center"></el-table-column>
			<el-table-column prop="xsds" label="销售单数" align="center" sortable></el-table-column>
			<!-- <el-table-column prop="kjs_shop_name" label="净销售单数" align="center"></el-table-column> -->
			<el-table-column prop="xsje" label="销售金额" width="120" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.xsje}}万</div>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="ksbm" label="净销售额" align="center"></el-table-column> -->
			<el-table-column prop="yfsl" label="应发数量" width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="sfsl" label="实发数量" width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="wfhsl" label="未发货数量" align="center" sortable></el-table-column>
			<el-table-column prop="kdj" label="客单价" align="center" sortable></el-table-column>
			<el-table-column prop="ytds" label="鱼塘单量" align="center" sortable></el-table-column>
			<el-table-column prop="ytzb" label="鱼塘占比" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.ytzb}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="charts_row">
			<!-- <div class="tab_container">
				<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">销售数据</div>
				<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">鱼塘数据</div>
			</div> -->
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item>
					<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions" :clearable="false" @change="getChartsData">
					</el-date-picker>
				</el-form-item>
			</el-form>
		</div>
		<el-tabs v-model="tab_index" type="card">
			<el-tab-pane label="销售数据" name="1">
				<div id="saleContainer"></div>
			</el-tab-pane>
			<el-tab-pane label="销售数据" name="2">
				<div id="ytContainer"></div>
			</el-tab-pane>
		</el-tabs>
		<!-- <div id="saleContainer" class="saleContainer" v-show="tab_index == '1'"></div>
			<div id="ytContainer" class="ytContainer" v-show="tab_index == '2'"></div> -->
		</div>
	</template>
	<script>
		import resource from '../../../api/resource.js'
		import operationResource from '../../../api/operationResource.js'
		import dps from '../../../components/results_components/dps.vue'
		import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate,lastXDate} from '../../../api/nowMonth.js'
		var echarts = require("echarts");
		export default{
			data(){
				return{
				company_list:[],					//公司列表
				company:[],							//选中的公司
				select_department_ids:[],			//选中的部门id列表
				select_plat_ids:[],					//选中的平台列表
				select_store_ids:[],				//选中的店铺id列表
				select_day:getNowDate(),			//付款日期
				tableData:[],						//表格数据
				date:[lastXDate(6),getNowDate()],							//图表日期
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
				},	 										//时间区间
				tab_index:'1',								//图表默认类型
				day_list:[],						//日期列表
				saleDataList:[],
				ytDataList:[],
				myChart:null,
				ytChart:null
			}
		},
		created(){
			//公司列表
			this.ajaxCompany();
			// 获取表格数据
			this.getTableData();
			// 获取图表数据
			this.getChartsData();
		},
		watch:{
			tab_index:function(n,o){
				this.$nextTick(() => {
					if(n == '1'){
						this.ddd();
					}else{
						this.ccc();
					}
				})
			}
		},
		methods:{
			//公司列表
			ajaxCompany(){
				resource.ajaxCompany().then(res => {
					if(res.data.code == 1){
						this.company_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//搜索
			searchFun(){
				// 获取表格数据
				this.getTableData();
				// 获取图表数据
				this.getChartsData();
			},
			// 获取表格数据
			getTableData(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					company:this.company.join(','),
					select_day:this.select_day
				}
				operationResource.saleAnalysisTable(arg).then(res => {
					if(res.data.code == 1){
						this.tableData = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 获取图表数据
			getChartsData(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					company:this.company.join(','),
					start_date:this.date[0],
					end_date:this.date[1],
				}
				operationResource.saleAnalysisChart(arg).then(res => {
					if(res.data.code == 1){
						this.day_list = res.data.data.day_list;	//日期列表（公用）
						//销售数据列表
						this.saleDataList = res.data.data.chart_list.sale;
						// this.saleDataList.push(res.data.data.chart_list.sale[0]);
						//鱼塘数据列表
						this.ytDataList = res.data.data.chart_list.yt;
						// this.ytDataList.push(res.data.data.chart_list.yt[0]);
						this.ddd();
						// this.ccc();
						
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			ddd(){
				for(var i = 0;i < this.saleDataList.length;i ++){
					let div = '<div style="height:860px;float:left;width:46%;margin-bottom:10px;margin-right:30px" id='+"id_"+i+' class="echarts_div"></div>';
					document.getElementById('saleContainer').insertAdjacentHTML("beforeBegin",div);
				}
				this.saleDataList.map((item,index) => {
					var legend_data = [];
					var series_data = [];
					item.list.map(item => {
						legend_data.push(item.name);
						let obj = {
							name: item.name,
							type: item.name == '销售额环比' || item.name == '销售单数环比'?'line':'bar',
							emphasis: {
								focus: 'series'
							},
							data: item.list
						}
						series_data.push(obj)
					})
					var ele = document.getElementById('id_' + index);
					let myChart = echarts.getInstanceByDom(ele)
					if (myChart == null) { 
						myChart = echarts.init(ele);
					}

					// if(this.myChart){
					// 	this.myChart.dispose();
					// }
					// var myChart = echarts.init(ele);
					myChart.setOption(this.chartsOptions(item,series_data,legend_data))
				})
				// window.addEventListener('resize',function(){
				// 	this.myChart.resize();
				// })
			},
			ccc(){
				for(var i = 0;i < this.ytDataList.length;i ++){
					let div = '<div style="height:860px;float:left;width:46%;margin-bottom:10px;margin-right:30px" id='+"ytid_"+i+' class="echarts_div"></div>';
					document.getElementById('ytContainer').insertAdjacentHTML("beforeBegin",div);
				}
				this.ytDataList.map((item,index) => {
					var legend_data = [];
					var series_data = [];
					item.list.map(item => {
						legend_data.push(item.name);
						let obj = {
							name: item.name,
							type: item.name == '鱼塘占比' || item.name == '销售单数环比'?'line':'bar',
							emphasis: {
								focus: 'series'
							},
							data: item.list
						}
						series_data.push(obj)
					})
					var ele = document.getElementById('ytid_' + index);
					let ytChart = echarts.getInstanceByDom(ele)
					if (ytChart == null) { 
						ytChart = echarts.init(ele);
					}
					// if(this.ytChart){
					// 	this.ytChart.dispose();
					// }
					// var ytChart = echarts.init(ele);
					ytChart.setOption(this.chartsOptions(item,series_data,legend_data))
				})
				// window.addEventListener('resize',function(){
				// 	this.ytChart.resize();
				// })
			},
			chartsOptions(item,series_data,legend_data){
				return {
					title: {
						text: item.title
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'shadow'
						}
					},
					legend: {
						data: legend_data
					},
					grid:{
						y2:300
					},
					xAxis: [{
						type: 'category',
						data: this.day_list,
						axisLabel: {
							color: '#333',
							interval: 2,
							rotate:70
						}
					}],
					yAxis:[
					{
						type: 'value',
						axisLabel: {
							formatter: '{value}'
						}
					},{
						type: 'value',
						min: 0,
						axisLabel: {
							formatter: '{value} %'
						}
					}],
					series: series_data
				}
			}
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.charts_row{
	margin-top:30px;
	display:flex;
	align-items: center;
	.tab_container{
		margin-right: 30px;
		margin-bottom: 30px;
		margin-top: 10px;
		display:flex;
		.tab_item{
			background: #EFEFEF;
			width:160px;
			text-align: center;
			height: 40px;
			line-height: 40px;
			font-size: 18px;
			color: #8a8a8a;
		}
		.active_tab_item{
			background:#008DFF;
			color: #fff;
		}
	}
}
.saleContainer{
	width: 100%;
	display:flex;
	flex-wrap: wrap;
}
.ytContainer{
	width: 100%;
	display:flex;
	flex-wrap: wrap;
}
</style>





















