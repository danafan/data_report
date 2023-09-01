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
			<div class="flex-1 bar_line border" id='bar_line'></div>
			<div class="pie border" id='pie'></div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getSomeDay,getNowDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import operationResource from '../../../api/operationResource.js'
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
				date:[getMonthStartDate(),getNowDate()],	//时间区间
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				ck_list:[],									//仓库列表
				ck_ids:[],									//选中的仓库
				barlineChart:null,
			}
		},
		created(){
			//款式编码
			this.getKsbm();
			//供应商列表
			this.getGys();
			//仓库列表
			this.getCk();
			
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
				operationResource.dayDhlChart().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let data = res.data.data;
						let x_axis = data.days;			//横坐标
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
						this.barlineChart.setOption(this.setBarLineOptions(x_axis,cgsl_data,dhl_data));
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//采购数量/到货率图表
			setBarLineOptions(x_axis,cgsl_data,dhl_data){
				return {
					// tooltip: {
					// 	trigger: 'axis',
					// 	axisPointer: {
					// 		type: 'cross',
					// 		crossStyle: {
					// 			color: '#999'
					// 		}
					// 	}
					// },
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
						yAxisIndex: 1,
						data: dhl_data
					}
					]
				}
			}
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
</style>