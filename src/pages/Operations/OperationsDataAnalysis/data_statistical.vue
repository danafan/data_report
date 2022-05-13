<template>
	<div class="container">
		<i class="el-icon-refresh-left reload" @click="getDataStatistics"></i>
		<div class="content">
			<el-card class="card_item today">
				<div class="card_top">
					<div class="top_left">
						<div class="card_label">今日收入</div>
						<div class="card_value">{{top_square.today_value}}</div>
					</div>
					<div class="top_right">
						<div class="right_row">环比昨日：<span class="green_color" :class="{'red_color':top_square.hb > 0}">{{top_square.hb > 0?'+':''}}{{top_square.hb}}%</span></div>
						<div class="right_row">同比上周：<span class="green_color" :class="{'red_color':top_square.tb > 0}">{{top_square.tb > 0?'+':''}}{{top_square.tb}}%</span></div>
						<div class="right_row">今日完成率：{{top_square.wcl}}%</div>
					</div>
				</div>
			</el-card>
			<!-- 顶部数据 -->
			<div class="top_cards">
				<el-card class="card_item" v-for="item in square">
					<div class="card_top">
						<div class="top_left">
							<div class="card_label">{{item.name}}</div>
							<div class="card_value">{{item.today_value}}</div>
						</div>
						<div class="top_right">
							<div class="right_row">环比昨日：<span class="green_color" :class="{'red_color':item.hb > 0}">{{item.hb > 0?'+':''}}{{item.hb}}%</span></div>
							<div class="right_row">同比上周：<span class="green_color" :class="{'red_color':item.tb > 0}">{{item.tb > 0?'+':''}}{{item.tb}}%</span></div>
						</div>
					</div>
					<el-divider></el-divider>
					<div class="right_row margin-bottom">昨日{{item.name}}：<span class="vvv">{{item.yesterday_value}}</span></div>
					<div class="right_row">当月{{item.name}}：<span class="vvv">{{item.month_value}}</span></div>
				</el-card>
			</div>
			<el-card class="axis_list margin_bottom">
				<div class="sss">
					<div class="axis_item" id="today"></div>
					<div class="axis_item" id="yesterday"></div>
					<div class="axis_item" id="month"></div>
					<div class="axis_item" id="rlj"></div>
				</div>
			</el-card>
			<el-card class="margin_bottom">
				<div class="table_title">店铺销售汇总</div>
				<el-table size="small" :data="tableData" tooltip-effect="dark" style="margin-bottom: 30px;width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="500">
					<el-table-column prop="shop_name" show-overflow-tooltip label="店铺名" width="160"></el-table-column>
					<el-table-column prop="today_income" label="今日收入" width="100" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.today_income}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="today_target" label="今日目标" width="100" align="center" sortable >
						<template slot-scope="scope">
							<div>{{scope.row.today_target}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="today_deviation" label="今日偏差" width="100" align="center" sortable >
						<template slot-scope="scope">
							<div>{{scope.row.today_deviation}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="today_wcl" label="今日目标完成率" width="130" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.today_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_income" label="当月收入累计" width="120" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_income}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_lj_target" label="当月目标累计" width="120" show-overflow-tooltip align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_lj_target}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_deviation" label="当月偏差" width="100" show-overflow-tooltip align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_deviation}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_lj_wcl" label="当月累计完成率" width="130" show-overflow-tooltip align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_lj_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target" label="当月目标" width="100" show-overflow-tooltip align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_wcl" label="当月目标完成率" width="130" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="year_income" label="年收入累计" show-overflow-tooltip width="110" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.year_income}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="year_target" label="年目标" show-overflow-tooltip width="80" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.year_target}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="year_deviation" label="年偏差" show-overflow-tooltip width="80" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.year_deviation}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="year_target_wcl" label="年目标完成率" show-overflow-tooltip width="120" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.year_target_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_wlfy" label="当月物流累计(预估)" show-overflow-tooltip width="150" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_wlfy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_lj_wlfy" label="当月物流目标累计" show-overflow-tooltip width="140" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_lj_wlfy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_wlfy_deviation" label="当月物流偏差" show-overflow-tooltip width="120" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_wlfy_deviation}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_lj_wlfy_wcl" label="当月物流累计完成率" show-overflow-tooltip width="160" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_lj_wlfy_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_wlfy" label="当月物流目标" show-overflow-tooltip width="120" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_wlfy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_wlfy_wcl" label="当月物流完成率" show-overflow-tooltip width="130" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_wlfy_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_yxfy" label="当月营销费用累计" show-overflow-tooltip width="140" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_yxfy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_lj_yxfy" label="当月营销目标累计" show-overflow-tooltip width="140" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_lj_yxfy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_yxfy_deviation" label="当月营销偏差" show-overflow-tooltip width="120" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_yxfy_deviation}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_lj_yxfy_wcl" label="当月营销累计完成率" show-overflow-tooltip width="160" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_lj_yxfy_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_yxfy" label="当月营销目标" show-overflow-tooltip width="120" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_yxfy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_yxfy_wcl" label="当月营销完成率" show-overflow-tooltip width="130" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_yxfy_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_kffy" label="当月客服费用累计" show-overflow-tooltip width="140" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_kffy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_lj_kffy" label="当月客服费用目标累计" show-overflow-tooltip width="170" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_lj_kffy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_kffy_deviation" label="当月客服费用偏差" show-overflow-tooltip width="140" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_kffy_deviation}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_lj_kffy_wcl" label="当月客服费用累计完成率" show-overflow-tooltip width="180" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_lj_kffy_wcl}}%</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_kffy" label="当月客服费用目标" show-overflow-tooltip width="140" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_kffy}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="month_target_kffy_wcl" label="当月客服费用完成率" show-overflow-tooltip width="160" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.month_target_kffy_wcl}}%</div>
						</template>
					</el-table-column>
				</el-table>
			</el-card>
			<el-card>
				<div class="sale_chart" id="sale_chart"></div>
			</el-card>
		</div>
	</div>
</template>
<style lang="less" scoped>
.container{
	padding: 20px;
	background: #ECEFF8;
	// display:flex;
	// justify-content: center;
	position: relative;
	.reload{
		position: absolute;
		top: 15px;
		right: 15px;
	}
	.content{
		// width: 920px;
		.top_cards{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
		}

		.card_item{
			margin-bottom: 10px;
			width: 280px;
			height: 150px;
			.card_top{
				display:flex;
				align-items: center;
				.top_left{
					width: 48%;
					.card_label{
						text-align: center;
						font-size: 12px;
						font-weight: bold;
					}
					.card_value{
						text-align: center;
						font-size: 22px;
						font-weight: bold;
					}
				}
				.top_right{
					height: 50px;
					width: 52%;
					display:flex;
					flex-direction: column;
					justify-content: space-around;
				}
			}
			.el-divider{
				margin: 10px 0!important;
			}
			.right_row{
				font-size: 12px;
			}
			.green_color{
				color:green;
				font-weight: bold;
			}
			.red_color{
				color:red;
				font-weight: bold;
			}
			.vvv{
				font-size: 14px;
				font-weight: bold;
			}
			.margin-bottom{
				margin-bottom: 10px;
			}
		}
		.today{
			margin: 0 auto 20px;
			height: 90px;
		}
		.axis_list{
			width: 100%;
			.sss{
				width: 100%;
				display:flex;
				justify-content: space-between;
				.axis_item{
					width: 220px;
					height:220px;
				}
			}		
		}
		.margin_bottom{
			margin-bottom: 5px;
		}
		.table_title{
			font-size: 18px;
			font-weight: bold;
		}
		.sale_chart{
			width: 100%;
			height: 300px;
		}
	}
}
</style>
<script>
	import operationResource from '../../../api/operationResource.js'
	export default{
		data(){
			return{
				top_square:{},
				square:[],		//顶部数据
				tableData:[],	//店铺销售汇总
			}
		},
		created(){
			//获取数据
			this.getDataStatistics();
		},
		methods:{
			//获取数据
			getDataStatistics(){
				operationResource.dataStatistics().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						this.top_square = res.data.data.square.top;
						this.square = res.data.data.square.list;	//顶部数据
						this.tableData = res.data.data.table;	//店铺销售汇总
						// 四个柱状图
						let income_chart = res.data.data.income_chart;
						//今日收入
						var today = document.getElementById('today');
						let todayChart = echarts.getInstanceByDom(today)
						if (todayChart == null) { 
							todayChart = echarts.init(today);
						}
						todayChart.setOption(this.setOptions('今日收入',income_chart.today));
						//昨日收入
						var yesterday = document.getElementById('yesterday');
						let yesterdayChart = echarts.getInstanceByDom(yesterday)
						if (yesterdayChart == null) { 
							yesterdayChart = echarts.init(yesterday);
						}
						yesterdayChart.setOption(this.setOptions('昨日收入',income_chart.yesterday));
						//月收入
						var month = document.getElementById('month');
						let monthChart = echarts.getInstanceByDom(month)
						if (monthChart == null) { 
							monthChart = echarts.init(month);
						}
						monthChart.setOption(this.setOptions('月收入',income_chart.month));
						//年累计收入
						var rlj = document.getElementById('rlj');
						let rljChart = echarts.getInstanceByDom(rlj)
						if (rljChart == null) { 
							rljChart = echarts.init(rlj);
						}
						rljChart.setOption(this.setOptions('年累计收入',income_chart.year));
						
						//近30天销售汇总
						let sale_title = "店铺近30天销售汇总"
						let sale_color = ['#89D2D0','#ED985C','#5E5C9D'];	//颜色
						let sale_legend = ['销售收入','发货金额','毛利率'];	//文字
						let sale_days = res.data.data.sale_chart.day;		//x轴
						var series_data = [];								//y轴
						res.data.data.sale_chart.chart_list.map(item => {
							let obj = {
								name: item.name,
								type: item.name == '销售收入' || item.name == '发货金额'?'bar':'line',
								label:{
									show:item.name == '毛利率'?true:false,
									position: 'top',
								},
								yAxisIndex:item.name == '毛利率'?1:0,
								emphasis: {
									focus: 'series'
								},
								data: item.list
							}
							series_data.push(obj)
						})
						var sale_chart = document.getElementById('sale_chart');
						let saleChart = echarts.getInstanceByDom(sale_chart)
						if (saleChart == null) { 
							saleChart = echarts.init(sale_chart);
						}
						saleChart.setOption(this.setSaleOption(sale_title,sale_legend,sale_color,sale_days,series_data,res.data.data.sale_chart.chart_list));
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//顶部四个柱状图
			setOptions(title,value){
				return {
					title: {
						text: title
					},
					color:['#9772B9','#9772B9'],
					grid:{
						y2:20,
						left: 30,
						top:'25%'
					},
					xAxis: [{
						data: ['目标','收入'],
					}],
					yAxis:[{
						type: 'value',
					}],
					series:[{
						data:[value.target_value,value.income],
						type: "bar",
						label:{
							show:true,
							position: 'top',
							formatter: "{c}万"
						}
					}]
				}
			},
			//近30天销售汇总
			setSaleOption(title,legend,color,days,series_data,chart_list){
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
						data: legend,
						top:"10%",
						left:0
					},
					color:color,
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
						name:legend[legend.length - 1],
						axisLabel: {
							formatter: '{value}'
						}
					}],
					series: series_data
				}
			}
			
		}
	}
</script>












