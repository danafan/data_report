<template>
	<div>
		<div class="title">月度日均单数</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="160" show-overflow-tooltip prop="dates" label="付款日期" align="center"></el-table-column>
			<el-table-column prop="ztdl" label="整体单量" align="center"></el-table-column>
			<el-table-column prop="ztrj" label="整体日均" align="center"></el-table-column>
			<el-table-column prop="tbdl" label="淘宝单量" align="center"></el-table-column>
			<el-table-column prop="tbzb" label="淘宝占比" align="center"></el-table-column>
			<el-table-column prop="tbrj" label="淘宝日均" align="center"></el-table-column>
			<el-table-column prop="tmdl" label="天猫单量" align="center"></el-table-column>
			<el-table-column prop="tmzb" label="天猫占比" align="center"></el-table-column>
			<el-table-column prop="tmrj" label="天猫日均" align="center"></el-table-column>
			<el-table-column prop="pdddl" label="拼多多单量" align="center"></el-table-column>
			<el-table-column prop="pddzb" label="拼多多占比" align="center"></el-table-column>
			<el-table-column prop="pddrj" label="拼多多日均" align="center"></el-table-column>
			<el-table-column prop="dwdl" label="得物单量" align="center"></el-table-column>
			<el-table-column prop="dwzb" label="得物占比" align="center"></el-table-column>
			<el-table-column prop="dwrj" label="得物日均" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 日订单数 -->
		<div class="chart_style" id="day_orders"></div>
		<!-- 付款金额 -->
		<div class="chart_style" id="payment_amount"></div>
		<!-- 渠道订单占比 -->
		<div class="chart_style" id="proportion_orders"></div>
		<!-- 渠道销售金额占比 -->
		<div class="chart_style" id="proportion_amount"></div>
		<!-- 店铺昨日订单数 -->
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="销量范围:">
				<el-select v-model="range_sec" @change="changeSec" :popper-append-to-body="false">
					<el-option label="其他" value="1"></el-option>
					<el-option label="10至199" value="2"></el-option>
					<el-option label="大于200" value="3"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<!-- 店铺昨日订单数 -->
		<div class="chart_style" id="order_yesterday"></div>
	</div>
</template>
<script>
	import operationResource from '../../../api/operationResource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				dataObj:{},		//月度日均单数
				range_sec:'3',	//选中的销量范围
			}
		},
		created(){
			//月度日均单数
			this.monthlyDailyNumber();
			//订单分析-图表
			this.jstOrderAnalyse();
			//店铺昨日订单数
			this.orderYesterday();
		},
		methods:{
			//月度日均单数
			monthlyDailyNumber(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize
				}
				operationResource.monthlyDailyNumber(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//月度日均单数
				this.monthlyDailyNumber();
			},
			handleCurrentChange(val) {
				this.page = val;
				//月度日均单数
				this.monthlyDailyNumber();
			},
			//订单分析-图表
			jstOrderAnalyse(){
				operationResource.jstOrderAnalyse().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						//日订单数
						let day_orders = res.data.data.day_orders;	
						let day_orders_legend = {
							name_list:['销售单量','销售单量-日环比增长率','销售单量-周同比增长率'],
							unit_list:['','%','%']
						};	
						let day_orders_xAxis = day_orders.date;	
						var day_orders_series = [
						{
							name: '销售单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: day_orders.xsdl
						},
						{
							name: '销售单量-日环比增长率',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: day_orders.huan
						},
						{
							name: '销售单量-周同比增长率',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: day_orders.tong
						}
						];								
						var day_orders_ele = document.getElementById('day_orders');
						let dayOrdersChart = echarts.getInstanceByDom(day_orders_ele)
						if (dayOrdersChart == null) { 
							dayOrdersChart = echarts.init(day_orders_ele);
						}
						dayOrdersChart.setOption(this.setChartOption('日订单数',day_orders_legend,day_orders_xAxis,day_orders_series));
						//付款金额
						let payment_amount = res.data.data.payment_amount;
						let payment_amount_legend = {
							name_list:['销售金额','销售金额-日环比增长率'],
							unit_list:['','%']
						};	
						let payment_amount_xAxis = payment_amount.fkrq;	
						var payment_amount_series = [
						{
							name: '销售金额',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: payment_amount.xsje
						},
						{
							name: '销售金额-日环比增长率',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: payment_amount.huan
						}
						];								
						var payment_amount_ele = document.getElementById('payment_amount');
						let payMentAmountChart = echarts.getInstanceByDom(payment_amount_ele)
						if (payMentAmountChart == null) { 
							payMentAmountChart = echarts.init(payment_amount_ele);
						}
						payMentAmountChart.setOption(this.setChartOption('付款金额',payment_amount_legend,payment_amount_xAxis,payment_amount_series));	
						//渠道订单占比
						let proportion_orders = res.data.data.proportion_orders;
						let proportion_orders_legend = {
							name_list:['淘宝单量','天猫单量','拼多多单量','得物单量','淘宝单量占比','天猫单量占比','拼多多单量占比','得物单量占比'],
							unit_list:['','','','','%','%','%','%']
						};	
						let proportion_orders_xAxis = proportion_orders.fkrq;	
						var proportion_orders_series = [
						{
							name: '淘宝单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.tbdl
						},
						{
							name: '天猫单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.tmdl
						},
						{
							name: '拼多多单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.pdddl
						},
						{
							name: '得物单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.dwdl
						},
						{
							name: '淘宝单量占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.tbdlzb
						},
						{
							name: '天猫单量占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.tmdlzb
						},
						{
							name: '拼多多单量占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.pdddlzb
						},
						{
							name: '得物单量占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_orders.dwdlzb
						}
						];								
						var proportion_orders_ele = document.getElementById('proportion_orders');
						let proportionOrdersChart = echarts.getInstanceByDom(proportion_orders_ele)
						if (proportionOrdersChart == null) { 
							proportionOrdersChart = echarts.init(proportion_orders_ele);
						}
						proportionOrdersChart.setOption(this.setChartOption('渠道订单占比',proportion_orders_legend,proportion_orders_xAxis,proportion_orders_series));
						//渠道销售金额占比	
						let proportion_amount = res.data.data.proportion_amount;
						let proportion_amount_legend = {
							name_list:['淘宝金额','天猫金额','拼多多金额','得物金额','淘宝金额占比','天猫金额占比','拼多多金额占比','得物金额占比'],
							unit_list:['','','','','%','%','%','%']
						};	
						let proportion_amount_xAxis = proportion_amount.fkrq;	
						var proportion_amount_series = [
						{
							name: '淘宝金额',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.tbje
						},
						{
							name: '天猫金额',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.tmje
						},
						{
							name: '拼多多金额',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.pddje
						},
						{
							name: '得物金额',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.dwje
						},
						{
							name: '淘宝金额占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.tbjezb
						},
						{
							name: '天猫金额占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.tmjezb
						},
						{
							name: '拼多多金额占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.pddjezb
						},
						{
							name: '得物金额占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: proportion_amount.dwjezb
						}
						];								
						var proportion_amount_ele = document.getElementById('proportion_amount');
						let proportionAmountChart = echarts.getInstanceByDom(proportion_amount_ele)
						if (proportionAmountChart == null) { 
							proportionAmountChart = echarts.init(proportion_amount_ele);
						}
						proportionAmountChart.setOption(this.setChartOption('渠道销售金额占比',proportion_amount_legend,proportion_amount_xAxis,proportion_amount_series));
						window.addEventListener('resize',() => {
							dayOrdersChart.resize();
							payMentAmountChart.resize();
							proportionOrdersChart.resize();
							proportionAmountChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换销量范围
			changeSec(v){
				//店铺昨日订单数
				this.orderYesterday();
			},
			//店铺昨日订单数
			orderYesterday(){
				operationResource.orderYesterday({range_sec:this.range_sec}).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let order_yesterday = res.data.data;	
						let order_yesterday_legend = {
							name_list:['销售单量','鱼塘单量','鱼塘订单占比'],
							unit_list:['','','%']
						};	
						let order_yesterday_xAxis = order_yesterday.shop_name;	
						var order_yesterday_series = [
						{
							name: '销售单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: order_yesterday.xsdl
						},
						{
							name: '鱼塘单量',
							type: 'bar',
							yAxisIndex:0,
							emphasis: {
								focus: 'series'
							},
							data: order_yesterday.ytdl
						},
						{
							name: '鱼塘订单占比',
							type: 'line',
							label:{
								show:true,
								position: 'top',
								formatter: '{c}%'
							},
							yAxisIndex:1,
							emphasis: {
								focus: 'series'
							},
							data: order_yesterday.ytddzb
						}
						];								
						var order_yesterday_ele = document.getElementById('order_yesterday');
						let orderYesterdayChart = echarts.getInstanceByDom(order_yesterday_ele)
						if (orderYesterdayChart == null) { 
							orderYesterdayChart = echarts.init(order_yesterday_ele);
						}
						orderYesterdayChart.setOption(this.setChartOption('店铺昨日订单数',order_yesterday_legend,order_yesterday_xAxis,order_yesterday_series));
						window.addEventListener('resize',() => {
							orderYesterdayChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//图表配置
			setChartOption(title,legend,days,series_data){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = '';
							for (var i = 0, l = params.length; i < l; i++) {
								relVal += params[i].seriesName + ' : ' + params[i].value + legend.unit_list[i] + '<br/>';
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
						data: legend.name_list,
						top:"10%",
						left:0
					},
					grid:{
						y2:20,
						top:'25%',
						left: '80',
						right: '50',
					},
					xAxis: [{
						type: 'category',
						data: days,
						axisLabel: {
							color: '#333',
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
						axisLabel: {
							formatter: '{value}%'
						}
					}],
					series: series_data
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-size: 14px;
	font-weight: bold;
	color: #333333;
}
.chart_style{
	margin-bottom: 30px;
	width: 100%;
	height: 500px;
}
</style>



