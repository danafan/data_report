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
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions" :clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格数据 -->
		<el-table size="small" :data="tableData" tooltip-effect="dark" style="margin-bottom: 30px;width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="500" show-summary :summary-method="getSummaries">
			<el-table-column prop="shop_name" label="店铺" align="center"></el-table-column>
			<el-table-column prop="xsds" label="销售单数" align="center" sortable></el-table-column>
			<el-table-column prop="xsje" label="销售金额" width="120" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.xsje}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="yfsl" label="应发数量" width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="sfsl" label="实发数量" width="120" align="center" sortable>
			</el-table-column>
			<el-table-column prop="fhl" label="发货率" width="120" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.fhl}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="wfhsl" label="未发货数量" align="center" sortable></el-table-column>
			<el-table-column prop="kdj" label="客单价" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.kdj}}元</div>
				</template>
			</el-table-column>
			<el-table-column prop="ytds" label="鱼塘单量" align="center" sortable></el-table-column>
			<el-table-column prop="ytzb" label="鱼塘占比" align="center" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.ytzb}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<el-tabs v-model="tab_index" type="card">
			<el-tab-pane label="销售数据" name="1">
				<div id="saleToastContainer" class="toastContainer"></div>
				<div id="saleContainer"></div>
			</el-tab-pane>
			<el-tab-pane label="鱼塘数据" name="2">
				<div id="ytToastContainer" class="toastContainer"></div>
				<div id="ytContainer"></div>
			</el-tab-pane>
		</el-tabs>
		<div class="scroll_top" @click="scrollTop">
			<i class="el-icon-top" style="font-size: 26px"></i>
		</div>
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
				tab_index:'1',						//图表默认类型（1:销售数据；2:鱼塘数据）
				tableData:[],						//表格数据
				day_list:[],						//日期列表
				saleDataList:[],					//销售数据图表列表
				ytDataList:[],						//鱼塘数据图表列表
				sale_min:0,							//销售数据比例最小值（用于折线图显示）
				yt_min:0,							//鱼塘数据比例最小值（用于折线图显示）
				total_sale_min:0,					//销售数据总计最小值
				total_yt_min:0,						//鱼塘数据总计最小值
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
						this.drawingSaleAxis();
					}else{
						this.drawingYtAxis();
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
					start_date:this.date[0],
					end_date:this.date[1],
				}
				operationResource.saleAnalysisTable(arg).then(res => {
					if(res.data.code == 1){
						this.tableData = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 表尾合计行加单位
			getSummaries(param) {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					sums[index] = values.reduce((prev, curr) => {
						return prev + curr;
					}, 0);
					if(index == 2 || index == 6){
						sums[index] = sums[index].toFixed(2);
					}
					if(index == 2){
						sums[index] = sums[index] += '万';
					}
					if(index == 5){
						let gg = ((sums[4]/sums[3])*100).toFixed(2);
						sums[index] = gg += '%';
					}
					if(index == 6){
						let cc =  (parseFloat(sums[2].split('万')[0]*10000)/sums[1]).toFixed(2);
						sums[index] = cc + '元';
					}
					if(index == 8){
						let dd =  (sums[7]/(sums[7] + sums[1])).toFixed(2);
						sums[index] = dd += '%';
					}
				});
				return sums;
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
						let saleToastEle = document.getElementById('saleToastContainer');
						let saleToastChart = echarts.getInstanceByDom(saleToastEle);
						if (saleToastChart != null) { 
							saleToastChart.dispose();
						}
						let ytToastEle = document.getElementById('ytToastContainer');
						let ytToastChart = echarts.getInstanceByDom(ytToastEle);
						if (ytToastChart != null) { 
							ytToastChart.dispose();
						}
						for(let i = 1;i < this.saleDataList.length;i ++){
							let ele = document.getElementById('id_' + i);
							if(ele){
								let myChart = echarts.getInstanceByDom(ele);
								if (myChart != null) { 
									myChart.dispose();
								}
							}
						}
						for(let j = 1;j < this.ytDataList.length;j ++){
							let ytEle = document.getElementById('ytid_' + j);
							if(ytEle){
								let ytChart = echarts.getInstanceByDom(ytEle);
								if (ytChart != null) { 
									ytChart.dispose();
								}
							}
							
						}
						this.day_list = res.data.data.day_list;	//日期列表（公用）
						//销售数据
						this.saleDataList = res.data.data.chart_list.sale;
						this.sale_min = res.data.data.chart_list.sale_min;
						this.total_sale_min = res.data.data.chart_list.total_sale_min;
						//鱼塘数据
						this.ytDataList = res.data.data.chart_list.yt;
						this.yt_min = res.data.data.chart_list.yt_min;
						this.total_yt_min = res.data.data.chart_list.total_yt_min;
						if(this.tab_index == '1'){
							this.drawingSaleAxis();
						}else{
							this.drawingYtAxis();
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 销售数据
			drawingSaleAxis(){
				for(var i = 1;i < this.saleDataList.length;i ++){
					if(!document.getElementById('id_' + i)){
						let div = '<div style="height:360px;float:left;width:30%;margin-bottom:10px;margin-right:30px" id='+"id_"+i+' class="echarts_div"></div>';
						document.getElementById('saleContainer').insertAdjacentHTML("beforeBegin",div);
					};
				}
				this.saleDataList.map((item,index) => {
					var legend_data = [];
					var series_data = [];
					item.list.map(item => {
						legend_data.push(item.name);
						let obj = {
							name: item.name,
							type: item.name == '销售额环比' || item.name == '销售单数环比'?'line':'bar',
							yAxisIndex:item.name == '销售额环比' || item.name == '销售单数环比'?1:0,
							emphasis: {
								focus: 'series'
							},
							data: item.list
						}
						series_data.push(obj)
					})
					if(index == 0){
						var ele = document.getElementById('saleToastContainer');
						let myChart = echarts.getInstanceByDom(ele)
						if (myChart == null) { 
							myChart = echarts.init(ele);
						}
						myChart.setOption(this.chartsOptions(item,series_data,legend_data))
					}else{
						var ele = document.getElementById('id_' + index);
						let myChart = echarts.getInstanceByDom(ele)
						if (myChart == null) { 
							myChart = echarts.init(ele);
						}
						myChart.setOption(this.chartsOptions(item,series_data,legend_data))
					}
				})
			},
			//鱼塘数据
			drawingYtAxis(){
				for(var i = 1;i < this.ytDataList.length;i ++){
					if(!document.getElementById('ytid_' + i)){
						let div = '<div style="height:360px;float:left;width:30%;margin-bottom:10px;margin-right:30px" id='+"ytid_"+i+' class="echarts_div"></div>';
						document.getElementById('ytContainer').insertAdjacentHTML("beforeBegin",div);
					}
				}
				this.ytDataList.map((item,index) => {
					var legend_data = [];
					var series_data = [];
					item.list.map(item => {
						legend_data.push(item.name);
						let obj = {
							name: item.name,
							type: item.name == '鱼塘占比' || item.name == '销售单数环比'?'line':'bar',
							yAxisIndex:item.name == '鱼塘占比' || item.name == '销售单数环比'?1:0,
							emphasis: {
								focus: 'series'
							},
							data: item.list
						}
						series_data.push(obj)
					})
					if(index == 0){
						var ele = document.getElementById('ytToastContainer');
						let myChart = echarts.getInstanceByDom(ele)
						if (myChart == null) { 
							myChart = echarts.init(ele);
						}
						myChart.setOption(this.chartsOptions(item,series_data,legend_data))
					}else{
						var ele = document.getElementById('ytid_' + index);
						let ytChart = echarts.getInstanceByDom(ele)
						if (ytChart == null) { 
							ytChart = echarts.init(ele);
						}
						ytChart.setOption(this.chartsOptions(item,series_data,legend_data))
					}
				})
			},
			// 图表绘制
			chartsOptions(item,series_data,legend_data){
				var min = 0;
				if(item.title == '总计'){
					if(this.tab_index == '1'){
						min = this.total_sale_min;
					}else{
						min = this.total_yt_min;
					}
				}else{
					if(this.tab_index == '1'){
						min = this.sale_min;
					}else{
						min = this.yt_min;
					}
				}
				return {
					title: {
						text: item.title
					},
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = params[0].name
							for (var i = 0, l = params.length; i < l; i++) {
								relVal += '<br/>' + params[i].seriesName + ' : ' + params[i].value + item.list[i].unit
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
						min: min,
						axisLabel: {
							formatter: '{value} %'
						}
					}],
					series: series_data
				}
			},
			//回到顶部
			scrollTop(){
				console.log("asd")
				document.getElementById('scroll_content').scrollTop = 0;
			}
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.scroll_top{
	position: fixed;
	bottom: 40px;
	right: 40px;
}

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
.toastContainer{
	width: 100%;
	height: 360px;
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





















