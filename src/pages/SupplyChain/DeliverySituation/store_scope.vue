<template>
	<div>
		<div class="page_top">
			<div class="toast_box">
				<div class="toast_title">关键指标含义</div>
				<div class="item_row" v-for="item in toast_list">
					<div class="dian"></div>
					<div>{{item}}</div>
				</div>
			</div>
			<div class="form_box">
				<el-form :inline="true" size="mini" class="demo-form-inline">
					<dps @callBack="checkReq"></dps>
					<el-form-item label="统计日期:">
						<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<PopoverWidget class="mb-10 mt-10" title="店铺发货情况" :show_popover="false" :update_time="store_update_time"/>
		<el-table size="small" :data="store_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','white-space': 'pre-line'}" @sort-change="storeSortChange" v-loading="store_loading">
			<el-table-column prop="name" label="店铺名称" width="120" show-overflow-tooltip align="center" sortable="custom">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="sendFhlChart(scope.row.dpbh,scope.row.name)">{{scope.row.name}}</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="fh_0" label="当日发货数" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="fh_je_0" label="当日发货金额" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="dd_0" label="当日订单总数" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="jrfh_0" label="今日发货数" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="jrfh_je_0" label="今日发货金额" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="fhl_0" label="当日发货率" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="fhl_1" label="两日发货率" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="fhl_2" label="三日发货率" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="fhl_3" label="四日发货率" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="xtsy" label="系统剩余订单数" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="xtsy_je" label="系统剩余金额" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="yc_dp" label="系统异常订单" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="rate" label="多件订单比例" align="center" sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="sizeChange($event,'store')" @current-change="pageChange($event,'store')" :current-page="store_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="store_total">
			</el-pagination>
		</div>
		<div class="chart_row">
			<div class="djddbl" id="djddbl" v-loading="chart_loading"></div>
			<div class="jqtfhl" id="jqtfhl" v-loading="jqt_loading"></div>
		</div>
		<div class="table_chart">
			<div class="table_box">
				<PopoverWidget class="mb-10 mt-10" title="部门发货情况" :show_popover="false" :update_time="dept_update_time"/>
				<el-table size="small" :data="dept_data" tooltip-effect="dark" style="position: absolute;width: 100%" :max-height="300" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="deptSortChange" v-loading="dept_loading">
					<el-table-column prop="name" label="部门" width="120" show-overflow-tooltip align="center" fixed sortable="custom"></el-table-column>
					<el-table-column prop="fh_0" label="当日发货数" width="110" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="dd_0" label="当日订单总数" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_0" label="当日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_1" label="两日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_2" label="三日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_3" label="四日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="xtsy" label="系统剩余订单数" width="130" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="yc_dp" label="系统异常订单" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="rate" label="多件订单比例" width="120" align="center" sortable="custom">
					</el-table-column>
				</el-table>
				<div class="page bottom">
					<el-pagination @size-change="sizeChange($event,'dept')" @current-change="pageChange($event,'dept')" :current-page="dept_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dept_total">
					</el-pagination>
				</div>
			</div>
			<div class="zb_chart" id='dept_zb' v-loading="chart_loading"></div>
		</div>
		<div class="table_chart">
			<div class="table_box">
				<PopoverWidget class="mb-10 mt-10" title="平台发货情况" :show_popover="false" :update_time="platform_update_time"/>
				<el-table size="small" :data="platform_data" tooltip-effect="dark" style="position: absolute;width: 100%" :max-height="300" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="platformSortChange" v-loading="platform_loading">
					<el-table-column prop="name" label="平台" width="120" show-overflow-tooltip align="center" fixed sortable="custom"></el-table-column>
					<el-table-column prop="fh_0" label="当日已发货" width="110" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="dd_0" label="当日订单总数" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_0" label="当日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_1" label="当日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_2" label="三日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="fhl_3" label="四日发货率" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="xtsy" label="系统剩余订单数" width="130" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="yc_dp" label="系统异常订单" width="120" align="center" sortable="custom"></el-table-column>
					<el-table-column prop="rate" label="多件订单比例" width="120" align="center" sortable="custom">
					</el-table-column>
				</el-table>
				<div class="page bottom">
					<el-pagination @size-change="sizeChange($event,'platform')" @current-change="pageChange($event,'platform')" :current-page="platform_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="platform_total">
					</el-pagination>
				</div>
			</div>
			<div class="zb_chart" id='platform_zb' v-loading="chart_loading"></div>
		</div>
	</div>
</template>
<script>
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import demandResource from '../../../api/demandResource.js'
	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		data(){
			return{
				toast_list:[
				'本报告数据源为实时数据源，展示订单发货情况',
				'当日发货数：以付款日期统计，当天付款的订单已发货的内部订单号数',
				'当日发货金额：以付款日期统计，当天付款的订单已发货的销售金额',
				'当日订单总数：以付款日期统计，当天付款的订单所有状态的内部订单号数，订单状态包括:已发货、发货中、已付款待审核、等待供销商发货和异常',
				'今日发货数：以发货日期统计，当天发货的内部订单号数',
				'今日发货金额：以发货日期统计，当天发货的销售金额',
				'当日发货率：当日发货数/当日订单总数',
				'两日发货率：昨日发货数/昨日订单总数',
				'三日发货率：前天发货数/前天订单总数',
				'四日发货率：大前天发货数/大前天订单总数',
				'每单(内部订单号)对应的销售数量等于1的订单为一件订单；大于1的订单为多件订单',
				'一件订单：以付款日期统计，前1天至脚本运行时间单件订单的内部订单号数',
				'多件订单：以付款日期统计，前1天至脚本运行时间的多件订单的内部订单号数',
				'多件订单比例：多件订单/(一件订单+多件订单）',
				'系统剩余订单数：以付款日期统计，近一个月未发货订单的原始线上订单号数',
				'系统剩余金额：以付款日期统计，近一个月未发货订单的销售金额',
				'系统异常订单：以付款日期统计，近一个月异常订单的原始线上订单号数'
				],
				dept_name:[],								//项目部
				pl:[],										//平台
				shop_code:[],								//店铺
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
				date:[getNowDate(),getNowDate()],			//时间区间
				store_page:1,			//店铺分页
				store_size:10,			//店铺分页
				store_sort:"",
				store_data:[],			//店铺数据
				store_total:0,			//店铺发货情况总计
				store_loading:false,
				dept_page:1,			//部门分页
				dept_size:10,			//部门分页
				dept_sort:"",
				dept_data:[],			//部门数据
				dept_total:0,			//部门发货情况总计
				dept_loading:false,
				platform_page:1,			//平台分页
				platform_size:10,			//平台分页
				platform_sort:"",
				platform_data:[],			//平台数据
				platform_total:0,			//平台发货情况总计
				platform_loading:false,
				deptZbChart:null,	
				platformZbChart:null,
				djddblChart:null,
				jqt_loading:false,
				jqtfhlChart:null,
				chart_loading:false,
				store_update_time:"",
				dept_update_time:"",
				platform_update_time:"",
			}
		},
		created(){
			//点击搜索
			this.searchFn();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
			//点击搜索
			searchFn(){
				//获取店铺发货情况
				this.store_page = 1;
				this.store_size = 10;
				this.getTableList('store');
				//获取部门发货情况
				this.dept_page = 1;
				this.dept_size = 10;
				this.getTableList('dept');
				//获取平台发货情况
				this.platform_page = 1;
				this.platform_size = 10;
				this.getTableList('platform');
				//仓库发货图表
				this.sendChart();
				//仓库发货图表-7天发货率和订单数
				this.sendFhlChart()
			}, 
			//店铺排序    
			storeSortChange({ column, prop, order }) {  
				if(order){
					this.store_sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				}    
				//获取店铺发货情况
				this.getTableList('store');
			},  
			//部门排序    
			deptSortChange({ column, prop, order }) {      
				if(order){
					this.dept_sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				}   
				//获取店铺发货情况
				this.getTableList('dept');
			}, 
			//平台排序    
			platformSortChange({ column, prop, order }) {       
				if(order){
					this.platform_sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				} 
				//获取平台发货情况
				this.getTableList('platform');
			},
			//获取三个表格数据
			getTableList(type){
				let arg = {
					type:`${type}_name`,
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
					page:this[`${type}_page`],
					pagesize:this[`${type}_size`],
					sort:this[`${type}_sort`]
				}
				this[`${type}_loading`] = true;
				demandResource.supplierSend(arg).then(res => {
					if(res.data.code == 1){
						this[`${type}_loading`] = false;
						let data = res.data.data;
						this[`${type}_data`] = data.data;
						this[`${type}_total`] = data.total;
						this[`${type}_update_time`] = data.update_time;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			sizeChange(v,type) {
				this[`${type}_size`] = v;
				this.getTableList(type);
			},
			pageChange(v,type) {
				this[`${type}_page`] = v;
				this.getTableList(type);
			},
			//仓库发货图表
			sendChart(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
				}
				this.chart_loading = true;
				demandResource.sendChart(arg).then(res => {
					if(res.data.code == 1){
						this.chart_loading = false;
						var echarts = require("echarts");
						//部门饼状图
						var dept_data = res.data.data.deptChart;
						//平台饼状图
						var platform_data = res.data.data.platformChart;
						//多件订单比例
						var order_data = res.data.data.orderChart;
						this.$nextTick(() => {
							//部门饼状图
							var dept_zb_chart = document.getElementById('dept_zb');
							this.deptZbChart = echarts.getInstanceByDom(dept_zb_chart)
							if (this.deptZbChart == null) { 
								this.deptZbChart = echarts.init(dept_zb_chart);
							}
							this.deptZbChart.setOption(this.pieOptions('部门',dept_data));
							//平台饼状图
							var platform_zb_chart = document.getElementById('platform_zb');
							this.platformZbChart = echarts.getInstanceByDom(platform_zb_chart)
							if (this.platformZbChart == null) { 
								this.platformZbChart = echarts.init(platform_zb_chart);
							}
							this.platformZbChart.setOption(this.pieOptions('平台',platform_data));
							//多条件订单比例
							let series_data = [];
							let x_data = [];
							order_data.map(item => {
								series_data.push(item.rate);
								x_data.push(item.shop_name);
							})
							var djddbl_chart = document.getElementById('djddbl');
							this.djddblChart = echarts.getInstanceByDom(djddbl_chart)
							if (this.djddblChart == null) { 
								this.djddblChart = echarts.init(djddbl_chart);
							}
							this.djddblChart.setOption(this.categoryOptions(series_data,x_data));
						})
						window.addEventListener('resize',() => {
							this.deptZbChart.resize();
							this.platformZbChart.resize();
							this.djddblChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//仓库发货图表-7天发货率和订单数
			sendFhlChart(dpbh,chart_title){
				this.chart_title = chart_title;
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
				}
				if(dpbh){
					arg['target_dpbh'] = dpbh;
				}
				this.jqt_loading = true;
				demandResource.sendFhlChart(arg).then(res => {
					if(res.data.code == 1){
						this.jqt_loading = false;
						var echarts = require("echarts");
						//近七天发货率
						var seven_send_data = res.data.data.sevenSendChart;
						//近七天订单数
						var seven_sendo_order = res.data.data.sevenSendOrderChart;
						this.$nextTick(() => {
							//近七天发货率
							var jr_dd_data = [];
							var jr_data = [];
							var lr_data = [];
							var sr_data = [];
							var si_data = [];
							var ax_data = [];
							seven_sendo_order.map(item => {
								jr_dd_data.push(item.dd_0);
							})
							seven_send_data.map(item => {
								jr_data.push(item.fhl_0);
								lr_data.push(item.fhl_1);
								sr_data.push(item.fhl_2);
								si_data.push(item.fhl_3);
								ax_data.push(item.sjxrrq);
							})
							var jqtfhl_chart = document.getElementById('jqtfhl');
							this.jqtfhlChart = echarts.getInstanceByDom(jqtfhl_chart)
							if (this.jqtfhlChart == null) { 
								this.jqtfhlChart = echarts.init(jqtfhl_chart);
							}
							this.jqtfhlChart.setOption(this.axisOption(jr_dd_data,jr_data,lr_data,sr_data,si_data,ax_data));
						})
						// window.addEventListener('resize',() => {
						// 	this.jqtfhlChart.resize();
						// });
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//柱状图配置
			categoryOptions(series_data,x_data){
				return {
					title: {
						text: '多件订单比例',
						left:'center'
					},
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = params[0];
							return '店铺名称：' + relVal.axisValue + '</br>' 
							+ "多件订单比例：" + relVal.value + '%';
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
						y2:100,
						top:'15%',
						left: '80',
						right: '80',
					},
					xAxis: [{
						type: 'category',
						data: x_data,
						axisLabel: {
							color: '#333',
							rotate:70
						}
					}],
					yAxis:{
						type: 'value',
						axisLabel: {
							formatter: '{value}%'
						}
					},
					series: [
					{
						data: series_data,
						type: 'bar'
					}
					]
				}
			},
			//折线图配置
			axisOption(jr_dd_data,jr_data,lr_data,sr_data,si_data,ax_data){
				return {
					title: {
						text: this.chart_title?`近七天发货率（${this.chart_title}）`:'近七天发货率',
						left:'center'
					},
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var str = '付款日期：' + params[0].axisValue + '</br>';
							params.map(item => {
								str += `${item.seriesName}：${item.value}${item.seriesName.indexOf('率') > -1?'%':''}</br>`
							})
							return str
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
						y2:100,
						top:'15%',
						left: '80',
						right: '80',
					},
					legend: {
						top:'30',
						data: ['当日订单总数','当日发货率','两日发货率','三日发货率','四日发货率',]
					},
					xAxis: {
						type: 'category',
						name:"付款日期",
						data: ax_data,
						axisLabel: {
							color: '#333',
							rotate:70
						}
					},
					yAxis:[{
						type: 'value',
						name:'度量值',
						axisLabel: {
							formatter: '{value}%'
						}
					},{
						type: 'value',
						name:'订单数'
					}],
					series: [{
						name:'当日订单总数',
						type: 'line',
						yAxisIndex:1,
						lineStyle:{
							width:3.6
						},
						data: jr_dd_data
					},{
						name:'当日发货率',
						type: 'line',
						yAxisIndex:0,
						lineStyle:{
							width:3.6
						},
						data: jr_data
					},{
						name:'两日发货率',
						type: 'line',
						yAxisIndex:0,
						lineStyle:{
							width:3.6
						},
						data: lr_data
					},{
						name:'三日发货率',
						type: 'line',
						yAxisIndex:0,
						lineStyle:{
							width:3.6
						},
						data: sr_data
					},{
						name:'四日发货率',
						type: 'line',
						yAxisIndex:0,
						lineStyle:{
							width:3.6
						},
						data: si_data
					}]
				}
			},
			//饼状图图配置
			pieOptions(params_name,data){
				return {
					title: {
						text: `系统剩余订单数${params_name}占比`,
						left:'center'
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return params_name + '：' + params.data.name + '</br>' 
							+ "系统剩余未发订单数：" + params.data.xtsy + '</br>'
							+ "系统剩余未发总额百分比：" + params.data.value + '%';
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
					legend: {
						bottom: 'bottom',
						left: 'center'
					},
					series: [
					{
						type: 'pie',
						radius: '50%',
						data: data
					}
					]
				}
			},
		},
		components:{
			dps,
			PopoverWidget
		}
	}
</script>
<style lang="less" scoped>
.page_top{
	display: flex;
	.toast_box{
		margin-right: 15px;
		margin-top: 15px;
		padding: 10px;
		border-radius: 10px;
		border:1px solid #8D5714;
		width: 50%;
		.toast_title{
			font-weight: bold;
			font-size: 16px;
			color: #8D5714;
		}
		.item_row{
			display:flex;
			align-items: center;
			font-size: 14px;
			color: #8D5714;
			.dian{
				margin-right: 8px;
				border-radius: 3px;
				background:#8D5714; 
				width: 6px;
				height: 6px;
			}
		}
	}
	.form_box{
		width: 50%;
	}
}
.table_title{
	height: 42px;
	line-height: 42px;
	text-align: center;
	font-size:15px;
	color: #333333;
	font-weight: bold;
}
.chart_row{
	margin-top: 30px;
	display: flex;
	.djddbl{
		width: 500px;
		height: 380px;
	}
	.jqtfhl{
		flex:1;
		height: 380px;
	}
}
.table_chart{
	margin-top: 15px;
	display: flex;
	.table_box{
		margin-right:15px;
		flex:1;
		position: relative;
		.bottom{
			position: absolute;
			bottom: 0;
			right: 0;
		}
	}
	.zb_chart{
		width: 380px;
		height: 380px;
	}
}
</style>