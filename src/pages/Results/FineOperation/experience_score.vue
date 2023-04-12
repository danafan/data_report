<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="日期:">
				<el-date-picker
				v-model="date"
				type="daterange"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="getListData">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="flex jse mb-15">
		<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="360px" @row-click="rowClick" v-loading="loading">
		<el-table-column :prop="item.row_field_name" align="center" :sortable="item.is_sort === 1" show-overflow-tooltip v-for="item in title_list">
			<template slot="header" slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
					<div class="pre-line">{{item.row_name}}</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div :class="{'red_color':item.row_field_name == 'dpzhtyf' && scope.row[item.row_field_name] < 3}">{{scope.row[item.row_field_name]}}{{item.unit}}</div>
			</template>
		</el-table-column>
	</el-table>
	<div class="flex jse" v-if="scoreChart">
		<el-radio-group v-model="date_type" class="radio_group" size="mini">
			<el-radio-button label="week">近7天</el-radio-button>
			<el-radio-button label="month">近30天</el-radio-button>
		</el-radio-group>
	</div>
	
	<div class="score_chart" id="score_chart">
		
	</div>
</div>
</template>
<script>
	import dps from '../../../components/results_components/dps.vue'
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				select_department_ids:[],		//部门
				select_plat_ids:[],				//平台
				select_store_ids:[],			//店铺
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
				},	 							//时间区间
				date:[getCurrentDate(),getCurrentDate()],						//日期
				loading:false,
				sort:"",
				title_list:[],
				table_data:[],
				shop_name:"",
				date_type:"week",
				scoreChart:null
			}
		},
		created(){
			//获取列表数据
			this.getListData();
		},
		watch:{
			//切换时间段
			date_type:function(n,o){
				//获取店铺体验分走势数据
				this.getScoreChart();
			}
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//获取列表数据
			getListData(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					sort:this.sort,
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
				}
				resource.storeScore(arg).then(res => {
					if(res.data.code == 1){
						this.title_list = res.data.data.title_list;
						this.table_data = res.data.data.data;
						if(this.table_data.length > 0){
							this.shop_name = this.table_data[0].dp;
							//获取店铺体验分走势数据
							this.getScoreChart();
						}else{
							if(this.scoreChart){
								this.scoreChart.clear();
								this.scoreChart = null;
							}
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式信息列表导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dept_id:this.select_department_ids.join(','),
						shop_id:this.select_store_ids.join(','),
						platform:this.select_plat_ids.join(','),
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
					}
					resource.storeScoreExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'店铺体验分');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//点击某个单元格
			rowClick(row, column, event){
				this.shop_name = row.dp;
				//获取店铺体验分走势数据
				this.getScoreChart();
			},
			//获取店铺体验分走势数据
			getScoreChart(){
				let arg = {
					shop_name:this.shop_name,
					date_type:this.date_type
				}
				resource.storeScoreChart(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						let day = data.day;
						let chart_list = data.chart_list;

						var echarts = require("echarts");
						var score_chart = document.getElementById('score_chart');
						this.scoreChart = echarts.getInstanceByDom(score_chart)
						if (this.scoreChart == null) { 
							this.scoreChart = echarts.init(score_chart);
						}
						this.scoreChart.setOption(this.setLineOptions(chart_list[0].name,day,chart_list[0].list));
						window.addEventListener('resize',() => {
							this.scoreChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//趋势图配置
			setLineOptions(legend,x_axis,series_data){
				return {
					title: {
						text: '店铺体验分走势'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = params[0].axisValue + "</br>"
							+ "店铺：" + params[0].seriesName + "</br>"
							+ "体验分：" + params[0].value + "</br>";
							return tip;
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
					},
					legend: {
						data: [legend]
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: x_axis
					},
					yAxis: {
						type: 'value',
						name:'体验分',
						axisLabel: {
							formatter: '{value}'
						}
					},
					series: [
					{
						name: legend,
						type: 'line',
						lineStyle: { 
							 width:3.6
						}, 
						data: series_data
					}]
				}
			}
		},
		components:{
			dps
		}
	}
</script>
<style type="text/css">
.el-table th>.cell{
	display: flex!important;
	align-items: center!important;
	justify-content: center!important;
}
</style>
<style lang="less" scoped>
.red_color{
	color: red;
}
.radio_group{
	position: relative;
	top: 40px;
	z-index: 9;
}
.score_chart{
	margin-top: 15px;
	width: 100%;
	height: 350px;
}
</style>