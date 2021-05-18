<template>
	<div>
		<!-- 第一个 -->
		<div class="title_text">品类销售金额汇总</div>
		<el-table :data="pl_list" size="small" height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle">
			<el-table-column prop="cpfl" align="center" label="品类" width="150"></el-table-column>
			<el-table-column :label="item" align="center" v-for="item in year_list">
				<el-table-column :prop="`value_${item}`" align="center" label="销售金额" width="120">
				</el-table-column>
				<el-table-column :prop="`zb_${item}`" align="center" label="金额占比" width="120">
				</el-table-column>
				<el-table-column :prop="`year_tb_${item}`" align="center" label="年同比" width="120">
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 第二个 -->
		<div id="axis_01" class="axis_01"></div>
		<!-- 第三个 -->
		<div class="third_row">
			<div id="axis_02" class="axis_02"></div>
			<div class="tb_box">
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
		<div class="tab_container">
			<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">按金额</div>
			<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">按占比</div>
		</div>
		<!-- 第四个 -->
		<div id="axis_03" class="axis_01" v-show="tab_index == '1'"></div>
		<!-- 第五个 -->
		<div class="third_row" v-show="tab_index == '1'">
			<div id="axis_04" class="axis_02"></div>
			<div class="tb_box">
				<div class="title">鱼塘金额年同比</div>
				<div class="xsje_vlaue">{{yt_year_ntb.amount}}</div>
				<div class="xsje_toast">
					<div style="margin-right: 10px">同比(年)</div>
					<i class="el-icon-caret-top bai" v-if="yt_year_ntb.ntb > 0"></i>
					<i class="el-icon-caret-bottom green_color" v-else></i>
					<div class="bai" :class="{'green_color':yt_year_ntb.ntb < 0}">{{yt_year_ntb.ntb}}%</div>
				</div>
			</div>
		</div>
		<!-- 第六个 -->
		<div id="axis_05" class="axis_01" v-show="tab_index == '2'"></div>
		<!-- 第七个 -->
		<div class="third_row" v-show="tab_index == '2'">
			<div id="axis_06" class="axis_02"></div>
			<div class="tb_box">
				<div class="title">鱼塘金额年同比</div>
				<div class="xsje_vlaue">{{yt_percent_year_ntb.amount}}</div>
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
				pl_list:[],			//顶部表格
				year_list:[],		//所有年份列表
				month_list:[],		//所有月份列表
				day_list:[],		//所有日期列表
				xsje_day_ntb:[],	//第二个折线图列表
				axis_01Chart:null,
				axis_02Chart:null,
				xsje_month_ntb:[],	//第三个折线图列表
				xsje_year_ntb:{},	//销售金额年同比
				axis_03Chart:null,
				axis_04Chart:null,
				axis_05Chart:null,
				yt_day_number_ntb:[],//每日鱼塘金额年同比（按金额）
				yt_month_ntb:[],	//第五个折线图列表
				yt_year_ntb:{},		//鱼塘金额年同比
				tab_index:'1',
				yt_day_percent_ntb:[],	//每日鱼塘金额年同比（按占比）
				yt_percent_month_ntb:[],
				yt_percent_year_ntb:{}
			}
		},
		props:{
			dept_id:{
				type:String,
				default:""
			},
			shop_id:{
				type:String,
				default:""
			},
			cpfl:{
				type:String,
				default:""
			},
			year:{
				type:String,
				default:""
			},
			month:{
				type:String,
				default:""
			}
		},
		watch:{
			dept_id:function(n,o){
				//获取列表
				this.getList();
			},
			shop_id:function(n,o){
				//获取列表
				this.getList();
			},
			cpfl:function(n,o){
				//获取列表
				this.getList();
			},
			year:function(n,o){
				//获取列表
				this.getList();
			},
			month:function(n,o){
				//获取列表
				this.getList();
			},
			tab_index:function(n){
				this.$nextTick(() => {
					this.axis_03Chart.resize();
					this.axis_04Chart.resize();
					this.axis_05Chart.resize();
					this.axis_06Chart.resize();
				})
			}
		},
		mounted(){
			//获取列表
			this.getList();
		},
		methods:{
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if (columnIndex == 0) {
					return "background:#F6BD16;color:#333333";
				}
			},
			getList(){
				let req = {
					dept_id:this.dept_id,
					shop_id:this.shop_id,
					cpfl:this.cpfl,
					year:this.year,
					month:this.month
				}
				resource.annualAmount(req).then(res => {
					if(res.data.code == 1){
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
						//第一个
						this.pl_list = res.data.data.pl_list;
						//第二个
						this.xsje_day_ntb = res.data.data.xsje_day_ntb;
						let markPoint = {
							data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'},
							]
						}
						this.xsje_day_ntb[this.xsje_day_ntb.length - 1].markPoint = markPoint;
						var axis_01 = document.getElementById('axis_01');
						this.axis_01Chart = echarts.init(axis_01);
						this.axis_01Chart.setOption({
							title: {
								text: '店铺七天销量'
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
								name:'销售金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.xsje_day_ntb
						});
						//第三个
						this.xsje_month_ntb = res.data.data.xsje_month_ntb;
						this.xsje_year_ntb = res.data.data.xsje_year_ntb;
						this.xsje_month_ntb.map(item => {
							item.label = {
								show: true
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
								name:'销售金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.xsje_month_ntb
						});
						//第四个
						this.yt_amount_day_ntb = res.data.data.yt_amount_day_ntb;
						let yt_amount_day_markPoint = {
							data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'},
							]
						}
						this.yt_amount_day_ntb[this.yt_amount_day_ntb.length - 1].markPoint = yt_amount_day_markPoint;
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
								name:'销售金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.yt_amount_day_ntb
						});
						//第五个
						this.yt_month_ntb = res.data.data.yt_amount_month_ntb;
						this.yt_year_ntb = res.data.data.yt_amount_year_ntb;
						this.yt_month_ntb.map(item => {
							item.label = {
								show: true
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
								name:'销售金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.yt_month_ntb
						});
						//第六个
						this.yt_day_percent_ntb = res.data.data.yt_percent_day_ntb;
						let yt_day_percent_markPoint = {
							data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'},
							]
						}
						this.yt_day_percent_ntb[this.yt_day_percent_ntb.length - 1].markPoint = yt_day_percent_markPoint;
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
								name:'销售金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.yt_day_percent_ntb
						});
						//第七个
						this.yt_percent_month_ntb = res.data.data.yt_percent_month_ntb;
						this.yt_percent_year_ntb = res.data.data.yt_percent_year_ntb;
						this.yt_percent_month_ntb.map(item => {
							item.label = {
								show: true
							}
						})
						var axis_06 = document.getElementById('axis_06');
						this.axis_06Chart = echarts.init(axis_06);
						this.axis_06Chart.setOption({
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
								name:'销售金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:this.yt_percent_month_ntb
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.axis_01Chart.resize();
							_this.axis_02Chart.resize();
							_this.axis_03Chart.resize();
							_this.axis_04Chart.resize();
							_this.axis_05Chart.resize();
							_this.axis_06Chart.resize();
						})
					}else{
						this.$messgae.warning(res.data.msg);
					}
				})
}
}
}
</script>