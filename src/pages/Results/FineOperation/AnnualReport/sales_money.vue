<template>
	<div>
		<!-- 品类销售金额汇总 -->
		<div class="title_text">品类销售金额汇总</div>
		<el-table v-if="show_table" :data="pl_list" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="loading">
			<el-table-column fixed prop="cpfl" align="center" label="品类" width="150"></el-table-column>
			<el-table-column :label="item" align="center" v-for="item in year_list">
				<el-table-column :prop="`value_${item}`" align="center" label="销售金额" width="120">
				</el-table-column>
				<el-table-column :prop="`zb_${item}`" align="center" label="金额占比" width="120">
				</el-table-column>
				<el-table-column :prop="`year_tb_${item}`" align="center" label="年同比" width="120">
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 每日销售金额年同比 -->
		<div id="axis_01" class="axis_01" v-loading="loading"></div>
		<!-- 销售金额年同比 -->
		<div class="third_row">
			<div id="axis_02" class="axis_02" v-loading="loading"></div>
			<div class="tb_box" v-loading="loading">
				<div class="title">销售金额年同比</div>
				<div class="xsje_vlaue">{{xsje_year_ntb.amount}}万</div>
				<div class="xsje_toast">
					<div style="margin-right: 10px">同比(年)</div>
					<i class="el-icon-caret-top bai" v-if="xsje_year_ntb.ntb > 0"></i>
					<i class="el-icon-caret-bottom green_color" v-else></i>
					<div class="bai" :class="{'green_color':xsje_year_ntb.ntb < 0}">{{xsje_year_ntb.ntb}}%</div>
				</div>
			</div>
		</div>
		<!-- 每日鱼塘金额年同比 -->
		<div class="tab_container">
			<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">按金额</div>
			<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">按占比</div>
		</div>
		<!-- 每日鱼塘金额年同比（按金额） -->
		<div id="axis_03" class="axis_01" v-show="tab_index == '1'" v-loading="loading"></div>
		<!-- 每日鱼塘金额年同比（按占比） -->
		<div id="axis_05" class="axis_01" v-show="tab_index == '2'" v-loading="loading"></div>
		<!-- 鱼塘金额年同比 -->
		<div class="third_row">
			<div id="axis_04" class="axis_02" v-loading="loading"></div>
			<div class="tb_box" v-loading="loading">
				<div class="title">鱼塘金额年同比</div>
				<div class="xsje_vlaue">{{yt_year_ntb.amount}}万</div>
				<div class="xsje_toast">
					<div style="margin-right: 10px">同比(年)</div>
					<i class="el-icon-caret-top bai" v-if="yt_year_ntb.ntb > 0"></i>
					<i class="el-icon-caret-bottom green_color" v-else></i>
					<div class="bai" :class="{'green_color':yt_year_ntb.ntb < 0}">{{yt_year_ntb.ntb}}%</div>
				</div>
			</div>
		</div>
		<!-- 鱼塘金额占比年同比 -->
		<div class="third_row">
			<div id="axis_06" class="axis_02" v-loading="loading"></div>
			<div class="tb_box" v-loading="loading">
				<div class="title">鱼塘金额占比年同比</div>
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
				xsje_day_ntb:[],	//每日销售金额年同比
				xsje_month_ntb:[],	//每月销售金额年同比
				xsje_year_ntb:{},	//销售金额年同比
				axis_01Chart:null,
				axis_02Chart:null,
				axis_03Chart:null,
				axis_04Chart:null,
				axis_05Chart:null,
				axis_06Chart:null,
				tab_index:'1',
				yt_amount_day_ntb:[],	//每日鱼塘金额年同比（按金额）
				yt_day_percent_ntb:[],	//每日鱼塘金额年同比（按占比）
				yt_month_ntb:[],		//每月鱼塘金额年同比
				yt_year_ntb:{},			
				yt_percent_month_ntb:[],//每月鱼塘金额占比年同比
				yt_percent_year_ntb:{},
				loading:false
			}
		},
		watch:{
			tab_index:function(n){
				this.$nextTick(() => {
					this.axis_03Chart.resize();
					this.axis_05Chart.resize();
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
			refreshTable () {
				this.show_table = false;
				this.$nextTick(() => {
					this.show_table = true;
				})
			},
			getList(req){
				this.loading = true;
				resource.annualAmount(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						var echarts = require("echarts");
						//销毁已经创建的
						if(this.axis_01Chart){
							this.axis_01Chart.dispose();
						}
						if(this.axis_02Chart){
							this.axis_02Chart.dispose();
						}
						if(this.axis_03Chart){
							this.axis_03Chart.dispose();
						}
						if(this.axis_04Chart){
							this.axis_04Chart.dispose();
						}
						if(this.axis_05Chart){
							this.axis_05Chart.dispose();
						}
						if(this.axis_06Chart){
							this.axis_06Chart.dispose();
						}
						this.year_list = res.data.data.year_list; //所有年份列表
						this.month_list = res.data.data.month_list;//所有月份列表
						this.day_list = res.data.data.day_list;	  //所有日期列表
						//品类销售金额汇总
						this.pl_list = res.data.data.pl_list;
						//每次数据变化重新渲染比表格
						this.refreshTable();
						//每日销售金额年同比
						let xsje_day_ntb = res.data.data.xsje_day_ntb;
						if(xsje_day_ntb.length > 0){
							this.xsje_day_ntb = xsje_day_ntb;
						}else{
							let arr = [];
							this.year_list.map(item => {
								let obj = {
									name: item,
									type: "line",
									data:[]
								}
								arr.push(obj);
							})
							this.xsje_day_ntb = arr;
						}
						var axis_01 = document.getElementById('axis_01');
						this.axis_01Chart = echarts.init(axis_01);
						this.axis_01Chart.setOption({
							title: {
								text: '每日销售金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "销售金额：" + params[i].data.value + "万</br>"
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
							series:this.xsje_day_ntb
						});
						//每月销售金额年同比
						let xsje_month_ntb = res.data.data.xsje_month_ntb;
						if(xsje_month_ntb.length > 0){
							this.xsje_month_ntb = xsje_month_ntb;
						}else{
							let arr = [];
							this.year_list.map(item => {
								let obj = {
									name: item,
									type: "line",
									data:[]
								}
								arr.push(obj);
							})
							this.xsje_month_ntb = arr;
						}
						this.xsje_year_ntb = res.data.data.xsje_year_ntb;
						this.xsje_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}万',
							}
						})
						var axis_02 = document.getElementById('axis_02');
						this.axis_02Chart = echarts.init(axis_02);
						this.axis_02Chart.setOption({
							title: {
								text: '每月销售金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "销售金额：" + params[i].data.value + "万</br>"
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
							series:this.xsje_month_ntb
						});
						//每日鱼塘金额年同比（按金额）
						let yt_amount_day_ntb = res.data.data.yt_amount_day_ntb;
						if(yt_amount_day_ntb.length > 0){
							this.yt_amount_day_ntb = yt_amount_day_ntb;
						}else{
							let arr = [];
							this.year_list.map(item => {
								let obj = {
									name: item,
									type: "line",
									data:[]
								}
								arr.push(obj);
							})
							this.yt_amount_day_ntb = arr;
						}
						var axis_03 = document.getElementById('axis_03');
						this.axis_03Chart = echarts.init(axis_03);
						this.axis_03Chart.setOption({
							title: {
								text: '每日鱼塘金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "鱼塘金额指标：" + params[i].data.value + "万</br>"
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
							series:this.yt_amount_day_ntb
						});
						//每日鱼塘金额年同比（按占比）
						let yt_percent_day_ntb = res.data.data.yt_percent_day_ntb;
						if(yt_percent_day_ntb.length > 0){
							this.yt_percent_day_ntb = yt_percent_day_ntb;
						}else{
							let arr = [];
							this.year_list.map(item => {
								let obj = {
									name: item,
									type: "line",
									data:[]
								}
								arr.push(obj);
							})
							this.yt_percent_day_ntb = arr;
						}
						var axis_05 = document.getElementById('axis_05');
						this.axis_05Chart = echarts.init(axis_05);
						this.axis_05Chart.setOption({
							title: {
								text: '每日鱼塘金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "日期：" + params[i].data.tj_mon_day + '</br>'
											+ "鱼塘金额指标：" + params[i].data.value + "%</br>"
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
							series:this.yt_percent_day_ntb
						});
						//每月鱼塘金额年同比
						let yt_month_ntb = res.data.data.yt_amount_month_ntb;
						if(yt_month_ntb.length > 0){
							this.yt_month_ntb = yt_month_ntb;
						}else{
							let arr = [];
							this.year_list.map(item => {
								let obj = {
									name: item,
									type: "line",
									data:[]
								}
								arr.push(obj);
							})
							this.yt_month_ntb = arr;
						}
						this.yt_year_ntb = res.data.data.yt_amount_year_ntb;
						this.yt_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}万',
							}
						})
						var axis_04 = document.getElementById('axis_04');
						this.axis_04Chart = echarts.init(axis_04);
						this.axis_04Chart.setOption({
							title: {
								text: '每月鱼塘金额年同比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i = 0; i < params.length; i++) {
											tip += "年份：" + params[i].data.tj_yr  + '</br>'
											+ "月份：" + params[i].data.tj_mon + '月</br>'
											+ "鱼塘金额：" + params[i].data.value + "万</br>"
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
							series:this.yt_month_ntb
						});
						//每月鱼塘金额占比年同比
						let yt_percent_month_ntb = res.data.data.yt_percent_month_ntb;
						if(yt_percent_month_ntb.length > 0){
							this.yt_percent_month_ntb = yt_percent_month_ntb;
						}else{
							let arr = [];
							this.year_list.map(item => {
								let obj = {
									name: item,
									type: "line",
									data:[]
								}
								arr.push(obj);
							})
							this.yt_percent_month_ntb = arr;
						}
						this.yt_percent_year_ntb = res.data.data.yt_percent_year_ntb;
						this.yt_percent_month_ntb.map(item => {
							item.label = {
								show: true,
								formatter: '{c}%',
							}
						})
						var axis_06 = document.getElementById('axis_06');
						this.axis_06Chart = echarts.init(axis_06);
						this.axis_06Chart.setOption({
							title: {
								text: '每月鱼塘金额占比年同比'
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
						window.addEventListener('resize',() => {
							this.axis_01Chart.resize();
							this.axis_02Chart.resize();
							this.axis_03Chart.resize();
							this.axis_04Chart.resize();
							this.axis_05Chart.resize();
							this.axis_06Chart.resize();
						})
					}else{
						this.$messgae.warning(res.data.msg);
					}
				})
}
}
}
</script>