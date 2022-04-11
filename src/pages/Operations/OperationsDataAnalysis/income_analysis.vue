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
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions" :clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格数据 -->
		<el-table size="small" :data="tableData" tooltip-effect="dark" style="margin-bottom: 30px;width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="500">
			<el-table-column prop="shop_name" width="160" label="店铺" show-overflow-tooltip></el-table-column>
			<el-table-column prop="fhdl" width="100" label="发货单数" align="center" sortable></el-table-column>
			<el-table-column prop="fhje" label="发货金额" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.fhje}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="fhcb" label="发货成本" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.fhcb}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="mll" label="毛利率" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.mll}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="xssr" label="销售收入" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.xssr}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="xscb" label="销售成本" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.xscb}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="thdl" label="退货单数" width="100" align="center" sortable></el-table-column>
			<el-table-column prop="thje" label="退货金额" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.thje}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="thcb" label="退货成本" width="100" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.thcb}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="xxtkje" label="线下退款金额" width="120" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.xxtkje}}万</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 毛利率分析 -->
		<div class="content_text mllfx" id="mllfx"></div>
		<!-- 销售成本/销售收入 -->
		<div class="bottom_row">
			<div class="content_text bottom_item" id="xscb">{{!show_xscb_chart?'暂无数据':''}}</div>
			<div class="content_text bottom_item" id="xssr">{{!show_xssr_chart?'暂无数据':''}}</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.content_text{
	display:flex;
	align-items: center;
	justify-content: center;
}
.mllfx{
	width: 100%;
	height: 360px;
}
.bottom_row{
	width: 100%;
	display: flex;
	.bottom_item{
		width: 50%;
		height: 360px;
	}
}
</style>
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
				date:[lastXDate(6),getNowDate()],	//日期
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
				},	 								//时间区间
				tableData:[],						//表格数据
				// show_mllfx_chart:true,
				show_xscb_chart:true,
				show_xssr_chart:true
			}
		},
		created(){
			//公司列表
			this.ajaxCompany();
			// 获取表格数据
			this.getTableData();
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
			},
			// 获取表格数据
			getTableData(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					company:this.company.join(','),
					start_date:this.date[0],
					end_date:this.date[1],
				}
				operationResource.incomeAnalysisDelivery(arg).then(res => {
					if(res.data.code == 1){
						//表格数据
						this.tableData = res.data.data.table;
						//毛利率分析
						let mllfx = res.data.data.mllfx;
						var mllfxEle = document.getElementById('mllfx');
						var mllfxChart = echarts.getInstanceByDom(mllfxEle)
						if (mllfxChart != null) { 
							mllfxChart.dispose();
						}
						if(mllfx.chart_list){
							let mllfx_legend = [];
							let mllfx_series = [];
							mllfx.chart_list.map(item => {
								mllfx_legend.push(item.name);
								let obj = {
									name: item.name,
									type: item.name == '毛利率'?'line':'bar',
									yAxisIndex:item.name == '毛利率'?1:0,
									emphasis: {
										focus: 'series'
									},
									data: item.list
								}
								mllfx_series.push(obj)
							})
							mllfxChart = echarts.init(mllfxEle);
							mllfxChart.setOption(this.chartsOptions('毛利率分析',mllfx_series,mllfx_legend,mllfx.day,mllfx.chart_list))
						}
						//销售成本
						let xscb = res.data.data.xscb;
						var xscbEle = document.getElementById('xscb');
						let xscbChart = echarts.getInstanceByDom(xscbEle)
						if (xscbChart != null) { 
							xscbChart.dispose();
						}
						if(xscb.chart_list){
							let xscb_legend = [];
							let xscb_series = [];
							xscb.chart_list.map(item => {
								xscb_legend.push(item.name);
								let obj = {
									name: item.name,
									type: 'bar',
									yAxisIndex:0,
									emphasis: {
										focus: 'series'
									},
									data: item.list
								}
								xscb_series.push(obj)
							})
							xscbChart = echarts.init(xscbEle);
							xscbChart.setOption(this.chartsOptions('销售成本',xscb_series,xscb_legend,xscb.day,xscb.chart_list));
						}
						//销售收入
						let xssr = res.data.data.xssr;
						var xssrEle = document.getElementById('xssr');
						let xssrChart = echarts.getInstanceByDom(xssrEle)
						if (xssrChart != null) { 
							xssrChart.dispose();
						}
						if(xssr.chart_list){
							let xssr_legend = [];
							let xssr_series = [];
							xssr.chart_list.map(item => {
								xssr_legend.push(item.name);
								let obj = {
									name: item.name,
									type: 'bar',
									yAxisIndex:0,
									emphasis: {
										focus: 'series'
									},
									data: item.list
								}
								xssr_series.push(obj)
							})
							xssrChart = echarts.init(xssrEle);
							xssrChart.setOption(this.chartsOptions('销售收入',xssr_series,xssr_legend,xssr.day,xssr.chart_list))
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//图表绘制
			chartsOptions(title,series_data,legend_data,day,chart_list){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = params[0].name
							for (var i = 0, l = params.length; i < l; i++) {
								relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + chart_list[i].unit
							}
							return relVal
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
					},
					legend: {
						data: legend_data,
						top:"10%",
						left:0
					},
					grid:{
						y2:90,
						top:'25%',
						left: '80',
						right: '80',
					},
					xAxis: [{
						type: 'category',
						data: day,
						axisLabel: {
							color: '#333',
							// interval: 2,
							rotate:70
						}
					}],
					yAxis:[
					{
						type: 'value',
						axisLabel: {
							formatter: '{value}万'
						}
					},{
						type: 'value',
						axisLabel: {
							formatter: '{value} %'
						}
					}],
					series: series_data
				}
			},
		},
		components:{
			dps
		}
	}
</script>
















