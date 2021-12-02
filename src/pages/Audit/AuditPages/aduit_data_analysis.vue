<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="日期区间:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions" :clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_box">
			<div class="header row">
				<div class="column_item">项目部</div>
				<div class="column_item">调价</div>
				<div class="column_item">零成本</div>
			</div>
			<div class="row" v-for="item in table_list">
				<div class="column_item">{{item.dept_name}}</div>
				<div class="column_item">{{item.no_zero_num}}</div>
				<div class="column_item">{{item.zero_num}}</div>
			</div>
		</div>
		<!-- 调价 -->
		<div id="tj_axis" class="axis_box"></div>
		<!-- 零成本 -->
		<div id="lcb_axis" class="axis_box"></div>
	</div>
</template>
<style scoped lang="less">
.table_box{
	width: 360px;
	border-top: 1px solid #333;
	border-left: 1px solid #333;
	.header{
		font-weight: bold;
	}
	.row{
		font-size: 14px;
		display: flex;
		.column_item{
			border-right: 1px solid #333;
			border-bottom: 1px solid #333;
			width: 120px;
			text-align: center;
			height: 30px;
			line-height: 30px;
		}
	}
}
.axis_box{
	margin-top: 50px;
	width: 100%;
	height: 360px;
}
</style>
<script>
	import {lastXDate,getCurrentDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/auditResource.js'
	var echarts = require("echarts");
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '近七天',
						onClick(picker) {
							const start = lastXDate(7);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '近半月',
						onClick(picker) {
							const start = lastXDate(15);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近一月',
						onClick(picker) {
							const start = lastXDate(30);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近三月',
						onClick(picker) {
							const start = lastXDate(90);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										//时间区间
				date:[getCurrentDate(),getCurrentDate()],									//选中的时间
				table_list:[],								//表格数据
				tj_axisChart:null,							//调价
			}
		},
		created(){
			//获取数据列表
			this.getList();
		},
		methods:{
			//获取数据列表
			getList(){
				let arg = {
					start_time:this.date[0],
					end_time:this.date[1]
				}
				resource.auditChart(arg).then(res => {
					if(res.data.code == 1){
						var dept_list = [];
						// 表格
						this.table_list = res.data.data.table;
						//日期
						var day_list = res.data.data.day_list;
						//调价
						let no_zero_list = res.data.data.no_zero_list;
						no_zero_list.map(item => {
							dept_list.push(item.name);
							item['type'] = 'line';
							item['lineStyle'] = { 
								 width:3.6
							};
						})
						var tj_axis = document.getElementById('tj_axis');
						if(this.tj_axisChart){
							this.tj_axisChart.dispose();
						}
						this.tj_axisChart = echarts.init(tj_axis);
						this.tj_axisChart.setOption(this.axisOption('调价',dept_list,no_zero_list,day_list));

						//零成本
						let zero_list = res.data.data.zero_list;
						zero_list.map(item => {
							item['type'] = 'line';
							item['lineStyle'] = { 
								 width:3.6
							};
						})
						var lcb_axis = document.getElementById('lcb_axis');
						if(this.lcb_axisChart){
							this.lcb_axisChart.dispose();
						}
						this.lcb_axisChart = echarts.init(lcb_axis);
						this.lcb_axisChart.setOption(this.axisOption('零成本',dept_list,zero_list,day_list));


						window.addEventListener('resize',() => {
							this.tj_axisChart.resize();
							this.lcb_axisChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			axisOption(title,dept_list,no_zero_list,day_list){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = "";
							if(params != null && params.length > 0) {
								tip = params[0].axisValueLabel + '</br>';
								for(let i = 0; i < params.length; i++) {
									tip += params[i].seriesName + '：' + params[i].value + '</br>';
								}
							}
							return tip;
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
					},
					legend: {
						data: dept_list
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: day_list
					},
					yAxis: {
						type: 'value',
						min: 0,
						axisLabel: {
							formatter: '{value}'
						}
					},
					series: no_zero_list
				}
			}
		}
	}
</script>