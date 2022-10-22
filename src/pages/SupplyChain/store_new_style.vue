<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="上架时间:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否杭州档口：">
				<el-select v-model="type" clearable placeholder="全部">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 公司-店铺款式粒度 -->
		<div class="table_row">
			<div class="item table_box">
				<el-table :data="company_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="company_dept_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" :width="index == 0?90:200" align="center" v-for="(item,index) in company_title" :fixed="index == 0">
						<template slot-scope="scope">
							<div :class="{'bold_style':scope.$index == 0}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="90" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':scope.$index == 0 || index == 1 || index == 2}">{{scope.row[i.row_field_name]}}{{i_index == 1?'%':''}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<div class="item chart_box" id="store_new_status"></div>
		</div>
		<!-- 事业部数据 -->
		<div class="table_row">
			<div class="item table_box">
				<el-table :data="dept_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="company_dept_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" :width="index == 0 || index == 1?100:200" align="center" v-for="(item,index) in dept_title" :fixed="index == 0">
						<template slot-scope="scope">
							<div :class="{'bold_style':index == 0 || (index == 1 && scope.$index == 0 || scope.$index%3 == 0)}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="90" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':scope.$index == 0 || scope.$index%3 == 0}">{{scope.row[i.row_field_name]}}{{index%2 == 1?'%':''}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<div class="item chart_box" id="dept_data_chart"></div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import {lastXDate,getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import resource from '../../api/resource.js'
	import demandResource from '../../api/demandResource.js'

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
				date:[lastXDate(7),lastXDate(1)],			//时间区间
				store_list: [],								//店铺列表	
				select_store_ids:[],						//选中的店铺列表
				type:"",									//是否杭州档口
				company_dept_loading:false,
				company_title:[],		//公司表头
				company_data:[],		//公司表格数据
				storeNewStatusChart:null,
				dept_title:[],			//事业部表头
				dept_data:[],			//事业部表格数据
				
			}
		},
		created(){
			// 获取所有店铺
			this.getStoreList();
			//公司、事业部数据
			this.companyDeptKsList();
		},
		methods:{
			//表格固定列背景色
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0){
					return 'background: #F6BD16;color:#333333';
				}
			},
			searchFn(){
				//公司、事业部数据
				this.companyDeptKsList();
			},
			// 获取所有店铺
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//公司、事业部数据
			companyDeptKsList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					dpmc:this.select_store_ids.join(','),
					type:this.type
				}
				this.company_dept_loading = true;
				demandResource.companyDeptKsList(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						this.company_dept_loading = false;
						let company = res.data.data.company;
						this.company_title = company.table_list;
						this.company_data = company.data;
						//店铺款式粒度-每日上款情况表格数据
						let company_x_axis = [];			//横坐标
						this.company_title.map((item,index) => {
							if(index > 1){
								company_x_axis.push(item.row_name);
							}
						})
						let company_legend = [];			//图例名称
						let company_series_data = [];		//数据
						this.company_data.map((item,index) => {
							if(index > 0){
								company_legend.push(item.gys_level);
								let data_item = {
									name: item.gys_level,
									type: 'bar',
									stack: 'Ad',
									emphasis: {
										focus: 'series'
									},
									label: {
										show: true,
										formatter: function (params) {
											let tip = params.data.value > 100?params.data.value + "\n"
											+ params.data.rate + '%':'';
											return tip;
										},
										position: 'top'
									},
									data: []
								}
								company_x_axis.map((x_item,x_i) => {
									let x_o = {
										value:item[`num_${x_item.split('-')[2]}`],
										rate:item[`rate_${x_item.split('-')[2]}`]
									}
									data_item.data.push(x_o)
								})
								company_series_data.push(data_item)
							}
						})
						var store_new_status = document.getElementById('store_new_status');
						this.storeNewStatusChart = echarts.getInstanceByDom(store_new_status)
						if (this.storeNewStatusChart == null) { 
							this.storeNewStatusChart = echarts.init(store_new_status);
						}
						this.storeNewStatusChart.setOption(this.setBarOption('店铺款式粒度-每日上款情况(供应商等级)',company_legend,company_x_axis,company_series_data));

						let dept = res.data.data.dept;
						this.dept_title = dept.table_list;
						let dept_data = dept.data;
						this.dept_data = dept_data.reduce(function (a, b) { 
							return a.concat(b)
						});


						window.addEventListener('resize',() => {
							this.storeNewStatusChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//柱状图配置
			setBarOption(title,legend,x_axis,series_data){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = "";
							if(params != null && params.length > 0) {
								tip = '上架时间：' + params[0].axisValueLabel + "</br>";
								params.map(item => {
									tip += item.seriesName + "款数：" + item.data.value + "</br>" + item.seriesName + "占比：" + item.data.rate + "%</br>";
								})
							}
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
					grid:{
						top:'22%'
					},
					legend: {
						data: legend,
						top:"8%",
						left:0
					},
					xAxis: [
					{
						type: 'category',
						data: x_axis
					}
					],
					yAxis: [{
						type: 'value',
						name:'款数',
					}],
					series: series_data
				};
			}
		}
	}
	
</script>
<style lang="less" scoped>
.table_row{
	display: flex;
	justify-content: space-between;
	.item{
		width: 49%;
		.bold_style{
			// font-size: 14px;
			color: #333333;
			font-weight: bold;
		}
	}
	.chart_box{
		height: 420px;
	}
}
</style>