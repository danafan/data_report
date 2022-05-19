<template>
	<div class="container">
		<!-- 单量、金额统计 -->
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="查询时间:" style="margin-right: 20px" v-if="tab_index == '3'">
				<el-date-picker
				v-model="searchDate"
				value-format="yyyy-MM"
				:append-to-body="false"
				type="monthrange"
				range-separator="至"
				start-placeholder="开始月份"
				end-placeholder="结束月份">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="付款日期:" style="margin-right: 20px" v-else>
			<el-date-picker
			v-model="date"
			type="daterange"
			:clearable="false"
			unlink-panels
			value-format="yyyy-MM-dd"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			:append-to-body="false"
			:picker-options="pickerOptions">
		</el-date-picker>
	</el-form-item>
	<el-form-item>
		<el-button type="primary" @click="searchFn">搜索</el-button>
	</el-form-item>
</el-form>
<div class="tab_container">
	<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">单量统计</div>
	<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">金额统计</div>
	<div class="tab_item" :class="{'active_tab_item':tab_index == '3'}" @click="tab_index = '3'">频次统计</div>
</div>
<!-- 每日鱼塘单量/每日鱼塘金额 -->
<div class="single_box">
	<!-- 每日鱼塘单量 -->
	<div id="single_date" class="single_date" v-show="tab_index == '1'"></div>
	<div id="single_total" class="single_total" v-show="tab_index == '1'"></div>
	<!-- 每日鱼塘金额 -->
	<div id="money_date" class="single_date" v-show="tab_index == '2'"></div>
	<div id="money_total" class="single_total" v-show="tab_index == '2'"></div>
</div>
<!-- 各店铺鱼塘单量占比 -->
<div id="accounted" class="accounted" v-show="tab_index == '1'"></div>
<!-- 各店铺鱼塘金额占比 -->
<div id="amount" class="accounted" v-show="tab_index == '2'"></div>
<!-- 鱼塘目标完成情况 -->
<div id="over_state" class="over_state" v-show="tab_index == '1'"></div>
<!-- 频次统计 -->
<div v-show="tab_index == '3'">
	<!-- 近一年鱼塘频次分析 -->
	<div class="pc_chart" id="pc_chart"></div>
	
	<div style="display:flex">
		<div style="margin-right: 100px">
			<div class="table_title">
				<div>鱼塘频次分析</div>
			</div>
			<el-table size="small" :data="pin_ci" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="pc" width="80" label="做单频次" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="account_num" width="100" label="买家账号统计" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="account_per" width="100" label="买家账号占比" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="sd_num" width="80" label="SD量" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="sd_per" width="80" label="SD占比" show-overflow-tooltip align="center">
				</el-table-column>
			</el-table>
		</div>
		<div style="margin-right: 100px">
			<div class="table_title">
				<div>五单以上的鱼塘账号</div>
				<el-button type="primary" plain size="mini" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
			<el-table size="small" :data="fiv_up" max-height="320" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="buyer_account" width="120" label="买家账号" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="shop_code" width="120" label="店铺名称" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="ytdl" width="80" label="SD量" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="ytdl_count" width="80" label="公司SD" show-overflow-tooltip align="center">
				</el-table-column>
			</el-table>
		</div>
		<div>
			<div class="table_title">
				<div>店铺鱼塘统计</div>
			</div>
			<el-table size="small" :data="dp_yt" max-height="320" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="shop_code" width="120" label="店铺名称" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="buyer_num" width="120" label="买家SD账号" show-overflow-tooltip align="center">
				</el-table-column>
				<el-table-column prop="ytdl_sum" width="120" label="店铺SD量" show-overflow-tooltip align="center">
				</el-table-column>
			</el-table>
		</div>
	</div>
</div>
</div>
</template>
<style lang="less" scoped>
.container{
	.tab_container{
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
	.single_box{
		margin-bottom: 50px;
		width: 100%;
		display: flex;
		.single_date{
			min-width:60%;
			min-height: 300px;
		}
		.single_total{
			min-width:40%;
			min-height: 300px;
		}
	}
	.accounted{
		margin-bottom: 50px;
		min-width: 100%;
		min-height: 600px;
	}
	.over_state{
		min-width: 100%;
		min-height: 600px;
	}
}
.pc_chart{
	width: 100%;
	height: 400px;
}
.table_title{
	margin-top: 15px;
	margin-bottom:15px;
	display:flex;
	width: 100%;
	justify-content: space-between;
	font-size: 15px;
	font-weight: bold;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import dps from '../../../components/results_components/dps.vue'
	import {exportExcel} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				},	 										//时间区间
				date:[getCurrentDate(),getCurrentDate()],	//付款日期
				start_time:getCurrentDate(),				//开始日期
				end_time:getCurrentDate(),					//结束日期	
				select_department_ids:[],					//选中的部门id列表
				select_plat_ids:[],							//选中的平台列表
				select_store_ids:[],						//选中的店铺id列表
				tab_index:'1',								//表格导航
				single_dateChart:null,						//每日鱼塘单量
				single_totalChart:null,						//累计鱼塘单量
				money_dateChart:null,						//每日鱼塘金额
				money_totalChart:null,						//累计鱼塘金额
				accountedChart:null,						//各店铺鱼塘单量占比
				amountChart:null,							//各店铺鱼塘金额占比
				over_stateChart:null,						//鱼塘目标完成情况
				searchDate:[getLastMonthStartDate(1).split('-')[0] + '-' + getLastMonthStartDate(1).split('-')[1],getLastMonthStartDate(1).split('-')[0] + '-' + getLastMonthStartDate(1).split('-')[1]],								//查询日期
				pin_ci:[],									//鱼塘频次分析
				fiv_up:[],									//五单以上的鱼塘账号
				dp_yt:[],									//店铺鱼塘统计
			}
		},
		mounted(){
            //获取列表
            this.fishList();
        },
        watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
			tab_index:function(n){
				this.$nextTick(() => {
					if(n == '1' || n == '2'){
						this.single_dateChart.resize();
						this.single_totalChart.resize();
						this.money_dateChart.resize();
						this.money_totalChart.resize();
						this.accountedChart.resize();
						this.amountChart.resize();
						this.over_stateChart.resize();
					}else{
						//频次
						this.getFrequency();
						//频次图表
						this.pcChartData();
						const start = getLastMonthStartDate(1);
						const end = getLastMonthEndDate(0);
					}
				})
			}
		},
		methods:{
        	//子组件传递过来的参数
        	checkReq(reqObj){
        		this.select_department_ids = reqObj.select_department_ids;
        		this.select_plat_ids = reqObj.select_plat_ids;
        		this.select_store_ids = reqObj.select_store_ids;
        	},
        	//点击搜索
        	searchFn(){
        		if(this.tab_index == '3'){		//频次统计
        			//频次
        			this.getFrequency();
        			//频次图表
        			this.pcChartData();
        		}else{
        			//获取列表
        			this.fishList();
        		}
        	},
        	//频次图表
        	pcChartData(){
        		resource.pcChartData().then(res => {
        			if(res.data.code == 1){
        				let data = res.data.data.tu_biao;
        				var month = data.month;
        				var persion_up = data.persion_up;
        				var persion_down = data.persion_down;
        				var gross = data.gross;
        				gross.map(item => {
        					item = parseInt(item);
        				})
        				var echarts = require("echarts");
        				var pc_chart = document.getElementById('pc_chart');
        				let pcChart = echarts.getInstanceByDom(pc_chart)
        				if (pcChart == null) { 
        					pcChart = echarts.init(pc_chart);
        				}
        				var legend_list = ['鱼塘总量', '鱼塘五次以上人数百分比', '鱼塘五次以内人数百分比'];
        				pcChart.setOption(this.setOptions('近一年鱼塘频次分析',legend_list,month,gross,persion_up,persion_down,'单'));
        			}else{
        				this.$message.warning(res.data.msg);
        			}
        		})
        	},
        	//设置图表
        	setOptions(title,legend,month,gross,persion_up,persion_down,unit){
        		return {
        			title: {
        				text: title
        			},
        			tooltip: {
        				trigger: 'axis',
        				formatter: function (params) {
        					let dataIndex = params[params.length - 1].dataIndex;
        					let month_txt = month[dataIndex];
        					let gross_txt = gross[dataIndex];
        					let persion_up_txt = persion_up[dataIndex];
        					let persion_down_txt = persion_down[dataIndex];
        					let tip = "";
        					if(params != null && params.length > 0) {
        						tip = month_txt + "</br>"
        						+legend[0] + "：" + gross_txt + unit + "</br>"
        						+ legend[1] + "：" + persion_up_txt + "%</br>"
        						+ legend[2] + "：" + persion_down_txt + "%";
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
        			color:['#5AD8A6','#F6BD16', '#5B8FF9'],
        			legend: {
        				data: legend
        			},
        			grid:{
        				y2:100
        			},
        			xAxis: [{
        				type: 'category',
        				data: month,
        				axisLabel: {
        					color: '#333',
        					interval: 2,
        					rotate:70
        				}
        			}],
        			yAxis:[{
        				type: 'value',
        				min: 0,
        				axisLabel: {
        					formatter: '{value} ' + unit
        				}
        			},{
        				type: 'value',
        				min: 0,
        				axisLabel: {
        					formatter: '{value} %'
        				}
        			}],
        			series: [{
        				name: legend[0],
        				type: 'bar',
        				emphasis: {
        					focus: 'series'
        				},
        				data: gross
        			},{
        				name: legend[1],
        				type: 'line',
        				yAxisIndex:0,
        				lineStyle: { 
        					 width:3.6
        				},
        				emphasis: {
        					focus: 'series'
        				},
        				data: persion_up
        			},{
        				name: legend[2],
        				type: 'line',
        				yAxisIndex:1,
        				lineStyle: { 
        					 width:3.6
        				},
        				emphasis: {
        					focus: 'series'
        				},
        				data: persion_down
        			}]
        		}
        	},
        	//频次
        	getFrequency(){
        		let arg = {
        			dept_id:this.select_department_ids.join(','),
        			platform:this.select_plat_ids.join(','),
        			shop_id:this.select_store_ids.join(','),
        			start_date:this.searchDate && this.searchDate.length> 0?this.searchDate[0]:"",
        			end_date:this.searchDate && this.searchDate.length> 0?this.searchDate[1]:""
        		}
        		resource.fishStatistics(arg).then(res => {
        			if(res.data.code == 1){
        				let pin_ci = res.data.data.pin_ci;
        				pin_ci.map((item,index) => {
        					item.pc = index + 1;
        					if(item.pc == 7){
        						item.pc = "6次以上";
        					}
        				})
        				this.pin_ci = pin_ci;
        				this.fiv_up = res.data.data.fiv_up;
        				this.dp_yt = res.data.data.dp_yt;
        			}else{
        				this.$message.warning(res.data.msg);
        			}
        		})
        	},
        	//导出
        	exportFile(){
        		let fiv_up = JSON.parse(JSON.stringify(this.fiv_up));
        		var data_obj = {
        			table_title:"五单以上的鱼塘账号",
        			table_title_list:['买家账号','店铺名称','SD量','公司SD'],
        			field_name_list:['buyer_account','shop_code','ytdl','ytdl_count'],
        			data_list:fiv_up
        		};
        		exportExcel(data_obj);
        	},
			//获取列表
			fishList(){
				let req = {
					dept_id:this.select_department_ids.join(','),
					platform:this.select_plat_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time
				}
				resource.fishList(req).then(res => {
					if(res.data.code == '1'){
						var echarts = require("echarts");
						var day_ytdl_obj = {
							fkrq:[],
							sjdl:[],
							ytdl:[],
							ytmbz:[]
						};							//每日鱼塘单量
						var total_ljytdl_obj = {
							ytdl:[],
							sjdl:[],
							ytmbz:"",
							total_dl:0
						};							//累计鱼塘单量
						var day_ytje_obj ={
							fkrq:[],
							sjje:[],
							ytje:[]
						};							//每日鱼塘金额
						var total_ljytje_obj = {
							sjje:[],
							ytje:[],
							total_je:0
						};							//累计鱼塘金额
						var shop_ytdlzb_obj ={
							dpid:[],
							sjdl:[],
							ytdl:[],
							ytdlzb:[]
						};							//各店铺鱼塘单量占比
						var shop_ytjezb_obj ={
							dpid:[],
							ytje:[],
							sjje:[],
							ytjezb:[]
						};							//各店铺鱼塘金额占比
						var shop_target_obj ={
							dpid:[],
							target:[],
							ytdl:[],
							ytwcl:[]
						};							//鱼塘目标完成情况
						//每日鱼塘单量
						let day_ytdl_list = res.data.data.day_ytdl_list;
						day_ytdl_list.map((item,index) => {
							day_ytdl_obj.fkrq.push(item.fkrq);		//付款日期
							day_ytdl_obj.ytdl.push(item.ytdl);		//鱼塘单量
							day_ytdl_obj.sjdl.push(item.sjdl);		//实际单量
							day_ytdl_obj.ytmbz.push(item.ytmbz);	//鱼塘目标值
						});
						var single_date = document.getElementById('single_date');
						if(this.single_dateChart){
							this.single_dateChart.dispose();
						}
						this.single_dateChart = echarts.init(single_date);
						this.single_dateChart.setOption({
							title: {
								text: '每日鱼塘单量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let dataIndex = params[params.length - 1].dataIndex;
									let fkrq = day_ytdl_obj.fkrq[dataIndex];
									let ytdl = day_ytdl_obj.ytdl[dataIndex];
									let sjdl = day_ytdl_obj.sjdl[dataIndex];
									let ytmbz = day_ytdl_obj.ytmbz[dataIndex];
									let ytdlzb = ((ytdl/(parseFloat(ytdl) + parseFloat(sjdl)))*100).toFixed(2);
									let zdl = (parseFloat(ytdl) + parseFloat(sjdl)).toFixed(2);
									let tip = "";
									if(params != null && params.length > 0) {
										tip = "付款日期：" + fkrq + "</br>"
										+ "鱼塘单量：" + ytdl + "</br>"
										+ "实际单量：" + sjdl + "</br>"
										+ "鱼塘目标值：" + ytmbz + "</br>" 
										+ "鱼塘单量占比：" + ytdlzb + "%</br>"
										+ "总单量：" + zdl;
									}
									return tip;
								},
								backgroundColor:"rgba(0,0,0,.8)",
								textStyle:{
									color:"#ffffff"
								},
								borderColor:"rgba(0,0,0,0.7)",
							},
							color:['#5AD8A6','#F6BD16', '#5B8FF9'],
							legend: {
								data: ['鱼塘单量', '实际单量', '鱼塘目标值']
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: day_ytdl_obj.fkrq
							},
							yAxis: {
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value}'
								}
							},
							series: [
							{
								name: '鱼塘单量',
								type: 'line',
								stack: '1',
								lineStyle: { 
									 width:3.6
								}, 
								data: day_ytdl_obj.ytdl
							},
							{
								name: '实际单量',
								type: 'line',
								stack: '2',
								lineStyle: { 
									 width:3.6
								},
								data: day_ytdl_obj.sjdl
							},
							{
								name: '鱼塘目标值',
								type: 'line',
								stack: '3',
								lineStyle: { 
									 width:3.6
								},
								data: day_ytdl_obj.ytmbz
							}]
						});
						//累计鱼塘单量
						let total_ljytdl_list = res.data.data.total_ljytdl_list; 
						total_ljytdl_obj.ytdl.push(total_ljytdl_list[0].ytdl);	//鱼塘单量
						total_ljytdl_obj.sjdl.push(total_ljytdl_list[0].sjdl);	//实际单量
						total_ljytdl_obj.total_dl = total_ljytdl_list[0].total_dl;	//总单量
						total_ljytdl_obj.ytmbz = total_ljytdl_list[0].ytmbz;	//鱼塘目标值
						var single_total = document.getElementById('single_total');
						if(this.single_totalChart){
							this.single_totalChart.dispose();
						}
						this.single_totalChart = echarts.init(single_total);
						this.single_totalChart.setOption({
							title: {
								text: '累计鱼塘单量',
								subtext:`总单量：${total_ljytdl_obj.total_dl}`,
								itemGap:38,
								subtextStyle:{
									color:"#DE5636"
								} 
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let dataIndex = params[params.length - 1].dataIndex;
									let ytdl = total_ljytdl_obj.ytdl[dataIndex];
									let sjdl = total_ljytdl_obj.sjdl[dataIndex];
									let ytmbz = total_ljytdl_obj.ytmbz;
									let ytdlzb = ((ytdl/(parseFloat(ytdl) + parseFloat(sjdl)))*100).toFixed(2);
									let zdl = total_ljytdl_obj.total_dl;
									let tip = "";
									if(params != null && params.length > 0) {
										tip = "鱼塘单量：" + ytdl + "</br>"
										+ "实际单量：" + sjdl + "</br>"
										+ "鱼塘目标值：" + ytmbz + "</br>" 
										+ "鱼塘单量占比：" + ytdlzb + "%</br>"
										+ "总单量：" + zdl;
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
							color:['#5AD8A6','#F6BD16'],
							grid:{
								top:'30%'
							},
							legend: {
								data: ['鱼塘单量', '实际单量'],
								top:"10%",
								left:0
							},
							xAxis: [{
								type: 'category',
								data: ['']
							}],
							yAxis:[{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '鱼塘单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}'
								},
								data: total_ljytdl_obj.ytdl,
							},{
								name: '实际单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}'
								},
								data: total_ljytdl_obj.sjdl
							}]
						});
						//每日鱼塘金额
						let day_ytje_list = res.data.data.day_ytje_list; 
						day_ytje_list.map(item => {
							day_ytje_obj.fkrq.push(item.fkrq);		//付款日期
							day_ytje_obj.sjje.push(item.sjje);		//实际金额
							day_ytje_obj.ytje.push(item.ytje);		//鱼塘金额
						});
						var money_date = document.getElementById('money_date');
						if(this.money_dateChart){
							this.money_dateChart.dispose();
						}
						this.money_dateChart = echarts.init(money_date);
						this.money_dateChart.setOption({
							title: {
								text: '每日鱼塘金额'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let dataIndex = params[params.length - 1].dataIndex;
									let fkrq = day_ytje_obj.fkrq[dataIndex];
									let ytje = day_ytje_obj.ytje[dataIndex];
									let sjje = day_ytje_obj.sjje[dataIndex];
									let ytjezb = ((ytje/(parseFloat(ytje) + parseFloat(sjje)))*100).toFixed(2);
									let zje = (parseFloat(ytje) + parseFloat(sjje)).toFixed(2);
									let tip = "";
									if(params != null && params.length > 0) {
										tip = "付款日期：" + fkrq + "</br>"
										+"鱼塘金额：" + ytje + "</br>"
										+ "实际金额：" + sjje + "</br>"
										+ "鱼塘金额占比：" + ytjezb + "%</br>"
										+ "总金额：" + zje;
									}
									return tip;
								},
								backgroundColor:"rgba(0,0,0,.8)",
								textStyle:{
									color:"#ffffff"
								},
								borderColor:"rgba(0,0,0,0.7)",
							},
							color:['#5AD8A6','#F6BD16'],
							legend: {
								data: ['鱼塘金额', '实际金额']
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: day_ytje_obj.fkrq
							},
							yAxis: {
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value}'
								}
							},
							series: [
							{
								name: '鱼塘金额',
								type: 'line',
								stack: '1',
								areaStyle: {},
								lineStyle: { 
									 width:3.6
								}, 
								data: day_ytje_obj.ytje
							},
							{
								name: '实际金额',
								type: 'line',
								stack: '1',
								areaStyle: {},
								lineStyle: { 
									 width:3.6
								},
								data: day_ytje_obj.sjje
							}]
						});
						//累计鱼塘金额
						let total_ljytje_list = res.data.data.total_ljytje_list; 
						total_ljytje_obj.ytje.push(total_ljytje_list.ytje);	//鱼塘金额
						total_ljytje_obj.sjje.push(total_ljytje_list.sjje);	//实际金额
						total_ljytje_obj.total_je = total_ljytje_list.total_je;	//总金额
						var money_total = document.getElementById('money_total');
						if(this.money_totalChart){
							this.money_totalChart.dispose();
						}
						this.money_totalChart = echarts.init(money_total);
						this.money_totalChart.setOption({
							title: {
								text: '累计鱼塘金额',
								subtext:`总金额：${total_ljytje_obj.total_je}`,
								itemGap:38,
								subtextStyle:{
									color:"#DE5636"
								} 
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let dataIndex = params[params.length - 1].dataIndex;
									let ytje = total_ljytje_obj.ytje[dataIndex];
									let sjje = total_ljytje_obj.sjje[dataIndex];
									let ytjezb = ((ytje/(parseFloat(ytje) + parseFloat(sjje)))*100).toFixed(2);
									let zje = total_ljytje_obj.total_je;
									let tip = "";
									if(params != null && params.length > 0) {
										tip = "鱼塘金额：" + ytje + "</br>"
										+ "实际金额：" + sjje + "</br>"
										+ "鱼塘金额占比：" + ytjezb + "%</br>"
										+ "总金额：" + zje;
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
							color:['#5AD8A6','#F6BD16'],
							grid:{
								top:'30%',
								containLabel: true
							},
							legend: {
								data: ['鱼塘金额', '实际金额'],
								top:"10%",
								left:0
							},
							xAxis: [{
								type: 'category',
								data: ['']
							}],
							yAxis:[{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value}',
									width: 500,
								}
							}],
							series: [{
								name: '鱼塘金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}'
								},
								data: total_ljytje_obj.ytje,
							},{
								name: '实际金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}'
								},
								data: total_ljytje_obj.sjje
							}]
						});
						//各店铺鱼塘单量占比
						let shop_ytdlzb_list = res.data.data.shop_ytdlzb_list;
						shop_ytdlzb_list.map(item => {
							shop_ytdlzb_obj.dpid.push(item.dpid);		//店铺名称
							shop_ytdlzb_obj.ytdl.push(item.ytdl);		//鱼塘单量
							shop_ytdlzb_obj.sjdl.push(item.sjdl);		//实际单量
							shop_ytdlzb_obj.ytdlzb.push(item.ytdlzb);	//鱼塘店铺占比
						}); 
						var accounted = document.getElementById('accounted');
						if(this.accountedChart){
							this.accountedChart.dispose();
						}
						this.accountedChart = echarts.init(accounted);
						this.accountedChart.setOption({
							title: {
								text: '各店铺鱼塘单量占比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let dataIndex = params[params.length - 1].dataIndex;
									let dpid = shop_ytdlzb_obj.dpid[dataIndex];
									let ytdl = shop_ytdlzb_obj.ytdl[dataIndex];
									let sjdl = shop_ytdlzb_obj.sjdl[dataIndex];
									let ytdlzb = shop_ytdlzb_obj.ytdlzb[dataIndex];
									let zdl = (parseFloat(ytdl) + parseFloat(sjdl)).toFixed(2);
									let tip = "";
									if(params != null && params.length > 0) {
										tip = dpid + "</br>"
										+"鱼塘单量：" + ytdl + "</br>"
										+ "实际单量：" + sjdl + "</br>"
										+ "鱼塘单量占比：" + ytdlzb + "%</br>"
										+ "总单量：" + zdl;
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
							color:['#5AD8A6','#F6BD16', '#5B8FF9'],
							legend: {
								data: ['鱼塘单量', '实际单量', '鱼塘单量占比']
							},
							grid:{
								y2:300
							},
							xAxis: [{
								type: 'category',
								data: shop_ytdlzb_obj.dpid,
								axisLabel: {
									color: '#333',
									interval: 2,
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								axisLabel: {
									formatter: '{value}'
								}
							},{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value} %'
								}
							}],
							series: [{
								name: '鱼塘单量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: shop_ytdlzb_obj.ytdl
							},{
								name: '实际单量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: shop_ytdlzb_obj.sjdl
							},{
								name: '鱼塘单量占比',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: shop_ytdlzb_obj.ytdlzb
							}]
						});
						//各店铺鱼塘金额占比
						let shop_ytjezb_list = res.data.data.shop_ytjezb_list;
						shop_ytjezb_list.map(item => {
							shop_ytjezb_obj.dpid.push(item.dpid);		//店铺名称
							shop_ytjezb_obj.ytje.push(item.ytje);		//鱼塘金额
							shop_ytjezb_obj.sjje.push(item.sjje);		//实际金额
							shop_ytjezb_obj.ytjezb.push(item.ytjezb);	//鱼塘金额占比
						}); 
						var amount = document.getElementById('amount');
						if(this.amountChart){
							this.amountChart.dispose();
						}
						this.amountChart = echarts.init(amount);
						this.amountChart.setOption({
							title: {
								text: '各店铺鱼塘金额占比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let dataIndex = params[params.length - 1].dataIndex;
									let dpid = shop_ytjezb_obj.dpid[dataIndex];
									let ytje = shop_ytjezb_obj.ytje[dataIndex];
									let sjje = shop_ytjezb_obj.sjje[dataIndex];
									let ytjezb = shop_ytjezb_obj.ytjezb[dataIndex];
									let zje = (parseFloat(ytje) + parseFloat(sjje)).toFixed(2);
									let tip = "";
									if(params != null && params.length > 0) {
										tip = dpid + "</br>"
										+"鱼塘金额：" + ytje + "</br>"
										+ "实际金额：" + sjje + "</br>"
										+ "鱼塘金额占比：" + ytjezb + "%</br>"
										+ "总金额：" + zje;
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
							color:['#5AD8A6','#F6BD16', '#5B8FF9'],
							legend: {
								data: ['鱼塘金额', '实际金额', '鱼塘金额占比']
							},
							grid:{
								y2:300
							},
							xAxis: [{
								type: 'category',
								data: shop_ytjezb_obj.dpid,
								axisLabel: {
									color: '#333',
									interval: 2,
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								axisLabel: {
									formatter: '{value}'
								}
							},{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value} %'
								}
							}],
							series: [{
								name: '鱼塘金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								data: shop_ytjezb_obj.ytje
							},{
								name: '实际金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								data: shop_ytjezb_obj.sjje
							},{
								name: '鱼塘金额占比',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: shop_ytjezb_obj.ytjezb
							}]
						});
						//鱼塘目标完成情况
						let shop_target_list = res.data.data.shop_target_list;
						shop_target_list.map(item => {
							shop_target_obj.dpid.push(item.dpid);			//店铺名称
							shop_target_obj.target.push(item.target);		//鱼塘目标值
							shop_target_obj.ytdl.push(item.ytdl);			//鱼塘单量
							shop_target_obj.ytwcl.push(item.ytwcl);		//鱼塘完成率
						})
						var over_state = document.getElementById('over_state');
						if (this.over_stateChart != null && this.over_stateChart != "" && this.over_stateChart != undefined) {
        						this.over_stateChart.dispose();//销毁
        					};
        					this.over_stateChart = echarts.init(over_state);
        					this.over_stateChart.setOption({
        						title: {
        							text: '鱼塘目标完成情况'
        						},
        						tooltip: {
        							trigger: 'axis',
        							formatter: function (params) {
        								let dataIndex = params[params.length - 1].dataIndex;
        								let dpid = shop_target_obj.dpid[dataIndex];
        								let target = shop_target_obj.target[dataIndex];
        								let ytdl = shop_target_obj.ytdl[dataIndex];
        								let ytwcl = shop_target_obj.ytwcl[dataIndex];
        								let tip = "";
        								if(params != null && params.length > 0) {
        									tip = dpid + "</br>"
        									+"鱼塘目标值：" + target + "</br>"
        									+ "鱼塘单量：" + ytdl + "</br>"
        									+ "鱼塘完成率：" + ytwcl + "%";
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
        						color:['#5AD8A6','#F6BD16', '#5B8FF9'],
        						legend: {
        							data: ['鱼塘目标值', '鱼塘单量', '鱼塘完成率']
        						},
        						grid:{
        							y2:300
        						},
        						xAxis: [{
        							type: 'category',
        							data: shop_target_obj.dpid,
        							axisLabel: {
        								color: '#333',
        								interval: 2,
        								rotate:70
        							}
        						}],
        						yAxis:[{
        							type: 'value',
        							axisLabel: {
        								formatter: '{value}'
        							}
        						},{
        							type: 'value',
        							min: 0,
        							axisLabel: {
        								formatter: '{value} %'
        							}
        						}],
        						series: [{
        							name: '鱼塘目标值',
        							type: 'bar',
        							stack: '2',
        							emphasis: {
        								focus: 'series'
        							},
        							data: shop_target_obj.target
        						},{
        							name: '鱼塘单量',
        							type: 'bar',
        							stack: '1',
        							barGap: '-120%',
        							barMaxWidth:"60%",
        							emphasis: {
        								focus: 'series'
        							},
        							data: shop_target_obj.ytdl
        						},{
        							name: '鱼塘完成率',
        							type: 'line',
        							yAxisIndex:1,
        							lineStyle: { 
        								 width:3.6
        							},
        							emphasis: {
        								focus: 'series'
        							},
        							data: shop_target_obj.ytwcl
        						}]
        					});
        					var _this = this;
        					window.addEventListener('resize',() => {
        						_this.single_dateChart.resize();
        						_this.single_totalChart.resize();
        						_this.money_dateChart.resize();
        						_this.money_totalChart.resize();
        						_this.accountedChart.resize();
        						_this.amountChart.resize();
        						_this.over_stateChart.resize();
        					})
        				}else{
        					this.$message.warning(res.data.msg);
        				}
        			})
},
},
components:{
	dps
}
}
</script>