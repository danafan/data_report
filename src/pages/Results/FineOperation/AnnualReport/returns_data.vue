<template>
	<div>
		<!-- 品类退货金额汇总 -->
		<div class="title_text">品类退货金额汇总</div>
		<el-table v-if="show_table" :data="pl_list" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="loading">
			<el-table-column fixed prop="cpfl" align="center" label="品类" width="150"></el-table-column>
			<el-table-column :label="item" align="center" v-for="item in year_list">
				<el-table-column :prop="`value_${item}`" align="center" label="退货金额" width="120">
				</el-table-column>
				<el-table-column :prop="`zb_${item}`" align="center" label="金额占比" width="120">
				</el-table-column>
				<el-table-column :prop="`year_tb_${item}`" align="center" label="年同比" width="120">
				</el-table-column>
				<el-table-column :prop="`value_${item}_thsl`" align="center" label="退货数量" width="120">
				</el-table-column>
				<el-table-column :prop="`zb_${item}_thsl`" align="center" label="数量占比" width="120">
				</el-table-column>
				<el-table-column :prop="`year_tb_${item}_thsl`" align="center" label="年同比" width="120">
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 每日退货金额 | 占比年同比 -->
		<div class="tab_container">
			<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">按金额</div>
			<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">按占比</div>
		</div>
		<!-- axis_13 -->
		<div id="axis_13" class="axis_01" v-show="tab_index == '1'" v-loading="loading"></div>
		<!-- axis_14 -->
		<div id="axis_14" class="axis_01" v-show="tab_index == '2'" v-loading="loading"></div>
		<!-- 每月退货金额同比 -->
		<div class="third_row">
			<!-- axis_15 -->
			<div id="axis_15" class="axis_02" v-loading="loading"></div>
			<div class="tb_box">
				<div class="tab_box_item" v-loading="loading">
					<div class="title">退货金额年同比</div>
					<div class="xsje_vlaue">{{thje_year_ntb.amount}}万</div>
					<div class="xsje_toast">
						<div style="margin-right: 10px">同比(年)</div>
						<i class="el-icon-caret-top bai" v-if="thje_year_ntb.ntb > 0"></i>
						<i class="el-icon-caret-bottom green_color" v-else></i>
						<div class="bai" :class="{'green_color':thje_year_ntb.ntb < 0}">{{thje_year_ntb.ntb}}%</div>
					</div>
				</div>
				<div class="tab_box_item" v-loading="loading">
					<div class="title">金额退货率年同比</div>
					<div class="xsje_vlaue">{{thje_percent_year_ntb.amount}}%</div>
					<div class="xsje_toast">
						<div style="margin-right: 10px">同比(年)</div>
						<i class="el-icon-caret-top bai" v-if="thje_percent_year_ntb.ntb > 0"></i>
						<i class="el-icon-caret-bottom green_color" v-else></i>
						<div class="bai" :class="{'green_color':thje_percent_year_ntb.ntb < 0}">{{thje_percent_year_ntb.ntb}}%</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 每月退货数量 | 占比年同比 -->
		<div class="tab_container">
			<div class="tab_item" :class="{'active_tab_item':tab_indexs == '1'}" @click="tab_indexs = '1'">按金额</div>
			<div class="tab_item" :class="{'active_tab_item':tab_indexs == '2'}" @click="tab_indexs = '2'">按占比</div>
		</div>
		<!-- axis_16 -->
		<div id="axis_16" class="axis_01" v-show="tab_indexs == '1'" v-loading="loading"></div>
		<!-- axis_17 -->
		<div id="axis_17" class="axis_01" v-show="tab_indexs == '2'" v-loading="loading"></div>
		<!-- 每月退货数量年同比 -->
		<div class="third_row">
			<!-- axis_18 -->
			<div id="axis_18" class="axis_02" v-loading="loading"></div>
			<div class="tb_box">
				<div class="tab_box_item" v-loading="loading">
					<div class="title">退货数量年同比</div>
					<div class="xsje_vlaue">{{thsl_year_ntb.amount}}万</div>
					<div class="xsje_toast">
						<div style="margin-right: 10px">同比(年)</div>
						<i class="el-icon-caret-top bai" v-if="thsl_year_ntb.ntb > 0"></i>
						<i class="el-icon-caret-bottom green_color" v-else></i>
						<div class="bai" :class="{'green_color':thsl_year_ntb.ntb < 0}">{{thsl_year_ntb.ntb}}%</div>
					</div>
				</div>
				<div class="tab_box_item" v-loading="loading">
					<div class="title">数量退货率年同比</div>
					<div class="xsje_vlaue">{{thsl_percent_year_ntb.amount}}%</div>
					<div class="xsje_toast">
						<div style="margin-right: 10px">同比(年)</div>
						<i class="el-icon-caret-top bai" v-if="thsl_percent_year_ntb.ntb > 0"></i>
						<i class="el-icon-caret-bottom green_color" v-else></i>
						<div class="bai" :class="{'green_color':thsl_percent_year_ntb.ntb < 0}">{{thsl_percent_year_ntb.ntb}}%</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.title_text{
	margin-bottom: 15px;
	font-size: 18px;
	font-weight: bold;
}
.axis_01{
	margin-top: 30px;
	min-width: 100%;
	min-height: 380px;
}
.third_row{
	margin-top: 30px;
	width: 100%;
	display: flex;
	.axis_02{
		flex:1;
		min-height: 380px;
	}
	.tb_box{
		min-height: 380px;
		width: 300px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		.tab_box_item{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			.title{
				font-size: 18px;
				font-weight: bold;
			}
			.xsje_vlaue{
				color: #F6BD16;
				font-size: 42px;
				font-weight: bold;
			}
			.xsje_toast{
				display:flex;
				align-items: center;
				font-size: 16px;

			}
		}
	}
}
.bai{
	color: red;
}
.green_color{
	color:#5AD8A6;
}
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
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				show_table:false,
				pl_list:[],			//顶部表格
				year_list:[],		//所有年份列表
				month_list:[],		//所有月份列表
				day_list:[],		//所有日期列表
				axis_13Chart:null,
				axis_14Chart:null,
				axis_15Chart:null,
				axis_16Chart:null,
				axis_17Chart:null,
				axis_18Chart:null,
				thje_amount_day_ntb:[],		//每日退货金额（按金额）
				thje_percent_day_ntb:[],	//每日退货金额（按占比）
				thje_month_ntb:[],			//每月退货金额年同比
				thje_year_ntb:{},			//退货金额年同比
				thje_percent_year_ntb:{},	//金额退货率年同比
				thsl_amount_day_ntb:[],		//每日退货数量年同比（按金额）
				thsl_percent_day_ntb:[],	//每日退货数量年同比（按占比）
				thsl_month_ntb:[],			//每月退货数量年同比
				thsl_year_ntb:{},			//退货数量年同比
				thsl_percent_year_ntb:{},	//数量退货率年同比
				tab_index:'1',
				tab_indexs:'1',
				loading:false
			}
		},
		watch:{
			tab_index:function(n){
				this.$nextTick(() => {
					this.axis_13Chart.resize();
					this.axis_14Chart.resize();
				})
			},
			tab_indexs:function(n){
				this.$nextTick(() => {
					this.axis_16Chart.resize();
					this.axis_17Chart.resize();
				})
			}
		},
		methods:{
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0){
					return 'background: #F6BD16;color:#333333';
				}else if(columnIndex == 3 || columnIndex == 6 || columnIndex == 9 || columnIndex == 12){
					if(row[column.property].indexOf('-') > -1 && row[column.property].indexOf('%') > -1){
						return 'color: #0CB618';
					}else if(row[column.property].indexOf('-') == -1 && row[column.property].indexOf('%') > -1){
						return 'color: #EA1B29';
					}
				}
			},
			//每次数据变化重新渲染比表格
			refreshTable(){
				this.show_table = false;
				this.$nextTick(() => {
					this.show_table = true;
				})
			},
			getList(req){
				this.loading = true;
				resource.annualReturn(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						var echarts = require("echarts");
						//销毁已经创建的
						if(this.axis_13Chart){
							this.axis_13Chart.dispose();
						}
						if(this.axis_14Chart){
							this.axis_14Chart.dispose();
						}
						if(this.axis_15Chart){
							this.axis_15Chart.dispose();
						}
						if(this.axis_16Chart){
							this.axis_16Chart.dispose();
						}
						if(this.axis_17Chart){
							this.axis_17Chart.dispose();
						}
						if(this.axis_18Chart){
							this.axis_18Chart.dispose();
						}
						this.year_list = res.data.data.year_list; //所有年份列表
						this.month_list = res.data.data.month_list;//所有月份列表
						this.day_list = res.data.data.day_list;	  //所有日期列表
						//品类退货金额汇总
						this.pl_list = res.data.data.pl_list;
						//每次数据变化重新渲染比表格
						this.refreshTable();
						//每日退货金额（按金额）
						this.thje_amount_day_ntb = res.data.data.thje_amount_day_ntb;
						// let markPoint_01 = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.thje_amount_day_ntb[this.thje_amount_day_ntb.length - 1].markPoint_01 = markPoint_01;
						var axis_13 = document.getElementById('axis_13');
						this.axis_13Chart = echarts.init(axis_13);
						this.axis_13Chart.setOption({
							title: {
								text: '每日退货金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "退货金额指标：" + params[i].data.value + "万</br>"
											+ "较去年变化率：" + params[i].data.jqnbh + "%</br>";
										}
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
							color:['#5AD8A6','#F6BD16','#5B8FF9'],
							grid:{
								top:'25%'
							},
							legend: {
								data: this.year_list,
								top:"8%",
								left:0
							},
							xAxis: [{
								data: this.day_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.thje_amount_day_ntb
						});
						//每日退货金额（按占比）
						this.thje_percent_day_ntb = res.data.data.thje_percent_day_ntb;
						// let markPoint_02 = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.thje_percent_day_ntb[this.thje_percent_day_ntb.length - 1].markPoint_02 = markPoint_02;
						var axis_14 = document.getElementById('axis_14');
						this.axis_14Chart = echarts.init(axis_14);
						this.axis_14Chart.setOption({
							title: {
								text: '每日退货金额占比年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "退货金额指标：" + params[i].data.value + "%</br>"
											+ "较去年变化率：" + params[i].data.jqnbh + "%</br>";
										}
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
							color:['#5AD8A6','#F6BD16','#5B8FF9'],
							grid:{
								top:'25%'
							},
							legend: {
								data: this.year_list,
								top:"8%",
								left:0
							},
							xAxis: [{
								data: this.day_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'占比',
								axisLabel: {
									formatter: '{value}%'
								}
							}],
							series:this.thje_percent_day_ntb
						});
						//每月退货金额年同比
						this.thje_month_ntb = res.data.data.thje_month_ntb;
						this.thje_year_ntb = res.data.data.thje_year_ntb;
						this.thje_percent_year_ntb = res.data.data.thje_percent_year_ntb;
						this.thje_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}万',
							}
						})
						var axis_15 = document.getElementById('axis_15');
						this.axis_15Chart = echarts.init(axis_15);
						this.axis_15Chart.setOption({
							title: {
								text: '每月退货金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "退货金额：" + params[i].data.value + "万</br>"
											+ "较去年变化率：" + params[i].data.jqnbh + "%</br>";
										}
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
							color:['#5AD8A6','#F6BD16','#5B8FF9'],
							grid:{
								top:'25%'
							},
							legend: {
								data: this.year_list,
								top:"8%",
								left:0
							},
							xAxis: [{
								data: this.month_list,
								type: 'category',
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.thje_month_ntb
						});
						//每日退货数量（按金额）
						this.thsl_amount_day_ntb = res.data.data.thsl_amount_day_ntb;
						// let markPoint_03 = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.thsl_amount_day_ntb[this.thsl_amount_day_ntb.length - 1].markPoint_03 = markPoint_03;
						var axis_16 = document.getElementById('axis_16');
						this.axis_16Chart = echarts.init(axis_16);
						this.axis_16Chart.setOption({
							title: {
								text: '每日退货数量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "退货数量指标：" + params[i].data.value + "万</br>"
											+ "较去年变化率：" + params[i].data.jqnbh + "%</br>";
										}
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
							color:['#5AD8A6','#F6BD16','#5B8FF9'],
							grid:{
								top:'25%'
							},
							legend: {
								data: this.year_list,
								top:"8%",
								left:0
							},
							xAxis: [{
								data: this.day_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.thsl_amount_day_ntb
						});
						//每日退货数量（按占比）
						this.thsl_percent_day_ntb = res.data.data.thsl_percent_day_ntb;
						// let markPoint_04 = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.thsl_percent_day_ntb[this.thsl_percent_day_ntb.length - 1].markPoint_04 = markPoint_04;
						var axis_17 = document.getElementById('axis_17');
						this.axis_17Chart = echarts.init(axis_17);
						this.axis_17Chart.setOption({
							title: {
								text: '每日退货数量占比年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "退货数量指标：" + params[i].data.value + "%</br>"
											+ "较去年变化率：" + params[i].data.jqnbh + "%</br>";
										}
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
							color:['#5AD8A6','#F6BD16','#5B8FF9'],
							grid:{
								top:'25%'
							},
							legend: {
								data: this.year_list,
								top:"8%",
								left:0
							},
							xAxis: [{
								data: this.day_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'占比',
								axisLabel: {
									formatter: '{value}%'
								}
							}],
							series:this.thsl_percent_day_ntb
						});
						//每月退货数量年同比
						this.thsl_month_ntb = res.data.data.thsl_month_ntb;
						this.thsl_year_ntb = res.data.data.thsl_year_ntb;
						this.thsl_percent_year_ntb = res.data.data.thsl_percent_year_ntb;
						this.thsl_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}万',
							}
						})
						var axis_18 = document.getElementById('axis_18');
						this.axis_18Chart = echarts.init(axis_18);
						this.axis_18Chart.setOption({
							title: {
								text: '每月退货数量年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "退货数量：" + params[i].data.value + "万</br>"
											+ "较去年变化率：" + params[i].data.jqnbh + "%</br>";
										}
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
							color:['#5AD8A6','#F6BD16','#5B8FF9'],
							grid:{
								top:'25%'
							},
							legend: {
								data: this.year_list,
								top:"8%",
								left:0
							},
							xAxis: [{
								data: this.month_list,
								type: 'category',
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'数量',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.thsl_month_ntb
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.axis_13Chart.resize();
							_this.axis_14Chart.resize();
							_this.axis_15Chart.resize();
							_this.axis_16Chart.resize();
							_this.axis_17Chart.resize();
							_this.axis_18Chart.resize();
						})
					}else{
						this.$messgae.warning(res.data.msg);
					}
				})
}
}
}
</script>