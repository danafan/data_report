<template>
	<div>
		<!-- 品类销售数量汇总 -->
		<div class="title_text">品类销售数量汇总</div>
		<el-table v-if="show_table"  :data="pl_list" size="small" height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle">
			<el-table-column fixed prop="cpfl" align="center" label="品类" width="150"></el-table-column>
			<el-table-column :label="item" align="center" v-for="item in year_list">
				<el-table-column :prop="`value_${item}`" align="center" label="销售数量" width="120">
				</el-table-column>
				<el-table-column :prop="`zb_${item}`" align="center" label="数量占比" width="120">
				</el-table-column>
				<el-table-column :prop="`year_tb_${item}`" align="center" label="年同比" width="120">
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 每日销售数量年同比 -->
		<div id="axis_07" class="axis_01"></div>
		<!-- 每月销售数量年同比 -->
		<div class="third_row">
			<div id="axis_08" class="axis_02"></div>
			<div class="tb_box">
				<div class="title">销售数量年同比</div>
				<div class="xsje_vlaue">{{xssl_year_ntb.amount}}万</div>
				<div class="xsje_toast">
					<div style="margin-right: 10px">同比(年)</div>
					<i class="el-icon-caret-top bai" v-if="xssl_year_ntb.ntb > 0"></i>
					<i class="el-icon-caret-bottom green_color" v-else></i>
					<div class="bai" :class="{'green_color':xssl_year_ntb.ntb < 0}">{{xssl_year_ntb.ntb}}%</div>
				</div>
			</div>
		</div>
		<!-- 每日鱼塘数量 | 占比年同比 -->
		<div class="tab_container">
			<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">按数量</div>
			<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">按占比</div>
		</div>
		<!-- 第四个 -->
		<div id="axis_09" class="axis_01" v-show="tab_index == '1'"></div>
		<!-- 第六个 -->
		<div id="axis_11" class="axis_01" v-show="tab_index == '2'"></div>
		<!-- 第五个 -->
		<div class="third_row">
			<div id="axis_10" class="axis_02"></div>
			<div class="tb_box">
				<div class="title">鱼塘数量年同比</div>
				<div class="xsje_vlaue">{{yt_year_ntb.amount}}万</div>
				<div class="xsje_toast">
					<div style="margin-right: 10px">同比(年)</div>
					<i class="el-icon-caret-top bai" v-if="yt_year_ntb.ntb > 0"></i>
					<i class="el-icon-caret-bottom green_color" v-else></i>
					<div class="bai" :class="{'green_color':yt_year_ntb.ntb < 0}">{{yt_year_ntb.ntb}}%</div>
				</div>
			</div>
		</div>
		<!-- 第七个 -->
		<div class="third_row">
			<div id="axis_12" class="axis_02"></div>
			<div class="tb_box">
				<div class="title">鱼塘数量占比年同比</div>
				<div class="xsje_vlaue">{{yt_percent_year_ntb.amount}}%</div>
				<div class="xsje_toast">
					<div style="margin-right: 10px">同比(年)</div>
					<i class="el-icon-caret-top bai" v-if="yt_percent_year_ntb.ntb > 0"></i>
					<i class="el-icon-caret-bottom green_color" v-else></i>
					<div class="bai" :class="{'green_color':yt_percent_year_ntb.ntb < 0}">{{yt_percent_year_ntb.ntb}}%</div>
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
		position: relative;
		min-height: 380px;
		width: 300px;
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		.title{
			position: absolute;
			top: 0;
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
				xssl_day_ntb:[],	//每日销售数量年同比
				xssl_month_ntb:[],	//每月销售数量年同比
				xssl_year_ntb:{},	
				axis_07Chart:null,
				axis_08Chart:null,
				axis_09Chart:null,
				axis_10Chart:null,
				axis_11Chart:null,
				axis_12Chart:null,
				tab_index:'1',
				yt_amount_day_ntb:[],	//每日鱼塘金额年同比（按数量）
				yt_day_percent_ntb:[],	//每日鱼塘金额年同比（按占比）
				yt_month_ntb:[],		//每月鱼塘数量年同比
				yt_year_ntb:{},			
				yt_percent_month_ntb:[],
				yt_percent_year_ntb:{}
			}
		},
		watch:{
			tab_index:function(n){
				this.$nextTick(() => {
					this.axis_09Chart.resize();
					this.axis_11Chart.resize();
				})
			}
		},
		methods:{
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0){
					return 'background: #F6BD16;color:#333333';
				}else if(columnIndex == 3 || columnIndex == 6 || columnIndex == 9){
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
				resource.annualVolume(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						//销毁已经创建的
						if(this.axis_07Chart){
							this.axis_07Chart.dispose();
						}
						if(this.axis_08Chart){
							this.axis_08Chart.dispose();
						}
						if(this.axis_09Chart){
							this.axis_09Chart.dispose();
						}
						if(this.axis_10Chart){
							this.axis_10Chart.dispose();
						}
						if(this.axis_11Chart){
							this.axis_11Chart.dispose();
						}
						if(this.axis_12Chart){
							this.axis_12Chart.dispose();
						}
						this.year_list = res.data.data.year_list; //所有年份列表
						this.month_list = res.data.data.month_list;//所有月份列表
						this.day_list = res.data.data.day_list;	  //所有日期列表
						//品类销售数量汇总
						this.pl_list = res.data.data.pl_list;
						//每次数据变化重新渲染比表格
						this.refreshTable();
						//每日销售数量年同比
						this.xssl_day_ntb = res.data.data.xssl_day_ntb;
						// let markPoint = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.xsje_day_ntb[this.xsje_day_ntb.length - 1].markPoint = markPoint;
						var axis_07 = document.getElementById('axis_07');
						this.axis_07Chart = echarts.init(axis_07);
						this.axis_07Chart.setOption({
							title: {
								text: '每日销售数量年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "销售数量：" + params[i].data.value + "万</br>"
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
								name:'数量',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.xssl_day_ntb
						});
						//每月销售数量年同比
						this.xssl_month_ntb = res.data.data.xssl_month_ntb;
						this.xssl_year_ntb = res.data.data.xssl_year_ntb;
						this.xssl_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}万',
							}
						})
						var axis_08 = document.getElementById('axis_08');
						this.axis_08Chart = echarts.init(axis_08);
						this.axis_08Chart.setOption({
							title: {
								text: '每月销售数量年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "销售数量：" + params[i].data.value + "万</br>"
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
							series:this.xssl_month_ntb
						});
						//每日鱼塘数量年同比（按数量）
						this.yt_amount_day_ntb = res.data.data.yt_amount_day_ntb;
						// let yt_amount_day_markPoint = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.yt_amount_day_ntb[this.yt_amount_day_ntb.length - 1].markPoint = yt_amount_day_markPoint;
						var axis_09 = document.getElementById('axis_09');
						this.axis_09Chart = echarts.init(axis_09);
						this.axis_09Chart.setOption({
							title: {
								text: '每日鱼塘数量年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "鱼塘数量指标：" + params[i].data.value + "万</br>"
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
								name:'数量',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.yt_amount_day_ntb
						});
						//每日鱼塘数量占比年同比（按占比）
						this.yt_day_percent_ntb = res.data.data.yt_percent_day_ntb;
						// let yt_day_percent_markPoint = {
						// 	data: [
						// 	{type: 'max', name: '最大值'},
						// 	{type: 'min', name: '最小值'},
						// 	]
						// }
						// this.yt_day_percent_ntb[this.yt_day_percent_ntb.length - 1].markPoint = yt_day_percent_markPoint;
						var axis_11 = document.getElementById('axis_11');
						this.axis_11Chart = echarts.init(axis_11);
						this.axis_11Chart.setOption({
							title: {
								text: '每日鱼塘数量占比年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "鱼塘数量指标：" + params[i].data.value + "%</br>"
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
							series:this.yt_day_percent_ntb
						});
						//每月鱼塘数量年同比
						this.yt_month_ntb = res.data.data.yt_amount_month_ntb;
						this.yt_year_ntb = res.data.data.yt_amount_year_ntb;
						this.yt_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}万',
							}
						})
						var axis_10 = document.getElementById('axis_10');
						this.axis_10Chart = echarts.init(axis_10);
						this.axis_10Chart.setOption({
							title: {
								text: '每月鱼塘数量年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "鱼塘数量：" + params[i].data.value + "万</br>"
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
							series:this.yt_month_ntb
						});
						//每月鱼塘数量占比年同比
						this.yt_percent_month_ntb = res.data.data.yt_percent_month_ntb;
						this.yt_percent_year_ntb = res.data.data.yt_percent_year_ntb;
						this.yt_percent_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}%',
							}
						})
						var axis_12 = document.getElementById('axis_12');
						this.axis_12Chart = echarts.init(axis_12);
						this.axis_12Chart.setOption({
							title: {
								text: '每月鱼塘数量占比年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "鱼塘金额占比：" + params[i].data.value + "%</br>"
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
								name:'占比',
								axisLabel: {
									formatter: '{value}%'
								}
							}],
							series:this.yt_percent_month_ntb
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.axis_07Chart.resize();
							_this.axis_08Chart.resize();
							_this.axis_09Chart.resize();
							_this.axis_10Chart.resize();
							_this.axis_11Chart.resize();
							_this.axis_12Chart.resize();
						})
					}else{
						this.$messgae.warning(res.data.msg);
					}
				})
}
}
}
</script>