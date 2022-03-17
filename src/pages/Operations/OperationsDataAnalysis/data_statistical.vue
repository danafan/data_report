<template>
	<div class="container">
		<div class="content">
			<!-- 顶部数据 -->
			<div class="top_cards">
				<el-card class="card_item" v-for="item in square">
					<div class="card_value">{{item.value}}</div>
					<div class="card_label">{{item.title}}</div>
				</el-card>
			</div>
			<el-card class="axis_list">
				<div class="sss">
					<div class="axis_item" id="today"></div>
					<div class="axis_item" id="yesterday"></div>
					<div class="axis_item" id="rlj"></div>
					<div class="axis_item" id="month"></div>
				</div>
				
			</el-card>
			<el-card>
				<div class="table_title">店铺销售汇总</div>
				<el-table size="small" :data="tableData" tooltip-effect="dark" style="margin-bottom: 30px;width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="500">
					<el-table-column prop="shop_name" label="店铺名" align="center"></el-table-column>
					<el-table-column prop="today_xsje" label="今日销售额" align="center" sortable></el-table-column>
					<el-table-column prop="today_income" label="今日收入" width="120" align="center" sortable>
					</el-table-column>
					<el-table-column prop="month_xsje" label="当月销售额" width="120" align="center" sortable>
					</el-table-column>
					<el-table-column prop="month_income" label="当月收入" width="120" align="center" sortable>
					</el-table-column>
					<el-table-column prop="month_wcl" label="当月完成率" align="center" sortable></el-table-column>
					<el-table-column prop="rljmb" label="日累计目标" align="center" sortable>
						<template slot-scope="scope">
							<div>{{scope.row.rljwcl}}万</div>
						</template>
					</el-table-column>
					<el-table-column prop="rljwcl" label="日累计完成率" align="center" sortable></el-table-column>
				</el-table>
			</el-card>
		</div>
		
	</div>
</template>
<style lang="less" scoped>
.container{
	padding: 20px;
	background: #ECEFF8;
	.content{
		width: 920px;
		.top_cards{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.card_item{
				margin-bottom: 6px;
				width: 180px;
				height: 80px;
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				.card_value{
					text-align: center;
					font-size: 28px;
					font-weight: bold;
				}
				.card_label{
					text-align: center;
					font-size: 12px;
					font-weight: bold;
				}
			}
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
		.table_title{
			font-size: 18px;
			font-weight: bold;
		}
	}
	
}
</style>
<script>
	import operationResource from '../../../api/operationResource.js'
	export default{
		data(){
			return{
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
						this.square = res.data.data.square;	//顶部数据
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
						//日累计收入
						var rlj = document.getElementById('rlj');
						let rljChart = echarts.getInstanceByDom(rlj)
						if (rljChart == null) { 
							rljChart = echarts.init(rlj);
						}
						rljChart.setOption(this.setOptions('日累计收入',income_chart.rlj));
						//月收入
						var month = document.getElementById('month');
						let monthChart = echarts.getInstanceByDom(month)
						if (monthChart == null) { 
							monthChart = echarts.init(month);
						}
						monthChart.setOption(this.setOptions('月收入',income_chart.month));
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
							formatter: "{c}万"
						}
					}]
				}
			}
			
		}
	}
</script>












