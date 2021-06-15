<template>
	<div class="content_box">
		<div class="bar_box" id="bar_01"></div>
		<div class="center_box">
			<div class="tab_container">
				<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">销售金额</div>
				<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">销售单量</div>
			</div>
			<div class="money_text">{{total_obj.value}}</div>
			<div class="tb_row">
				<div>同比(年)</div>
				<i class="el-icon-caret-top top" v-if="total_obj.tb >= 0"></i>
				<i class="el-icon-caret-top green" v-if="total_obj.tb < 0"></i>
				<div class="top" :class="{'green':total_obj.tb < 0}">{{total_obj.tb}}%</div>
			</div>
			<div class='china_box' id="china_box"></div>
			<div class="line_box" id="line_box"></div>
		</div>
		<div class="bar_box" id="bar_02"></div>
	</div>
</template>
<style lang="less" scoped>
.content_box{
	display:flex;
	justify-content: space-between;
	.bar_box{
		width: 30%;
		height: 700px;
	}
	.center_box{
		width: 36%;
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		.money_text{
			font-size: 36px;
			font-weight: bold;
			color: #DE3F07;
		}
		.tb_row{
			display:flex;
			align-items: center;
			font-size: 16px;
			.top{
				color: #DE3F07;
			}
			.green{
				color: #5AD8A6;
			}
		}
		.china_box{
			border: 1px solid red;
			width: 100%;
			height: 350px;
		}
		.line_box{
			width: 100%;
			height: 200px;
		}
	}
}
.tab_container{
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
		background:#DE3F07;
		color: #fff;
	}
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				tab_index:'1',			//默认选中第一个
				bar_01Chart:null,		//左侧的柱状图
				bar_02Chart:null,
				line_boxChart:null,
				total_obj:{},
				req:{}
			}
		},
		watch:{
			tab_index:function(n,o){
				this.getList();
			}
		},
		methods:{
			setReq(req){
				this.req = req;
				this.getList();
			},
			getList(){
				let req_obj = {...this.req,...{type:this.tab_index}};
				resource.areaSale(req_obj).then(res => {
					if(res.data.code == 1){
						var data = res.data.data;
						var echarts = require("echarts");
						//总计
						this.total_obj = data.total;
						//左侧柱状图
						var left_title_list = data.province.title_list;
						var left_data = data.province.data;
						var left_ljzb_list = [];
						left_data.map(item => {
							left_ljzb_list.push(item.ljzb);
						});
						var bar_01 = document.getElementById('bar_01');
						if(this.bar_01Chart){
							this.bar_01Chart.dispose();
						}
						this.bar_01Chart = echarts.init(bar_01);
						this.bar_01Chart.setOption(this.barOptions('各省销售指标排名',left_title_list,left_data,left_ljzb_list));
						//右侧柱状图
						var right_title_list = data.cpfl.title_list;
						var right_data = data.cpfl.list;
						var right_ljzb_list = [];
						right_data.map(item => {
							right_ljzb_list.push(item.ljzb);
						});
						var bar_02 = document.getElementById('bar_02');
						if(this.bar_02Chart){
							this.bar_02Chart.dispose();
						}
						this.bar_02Chart = echarts.init(bar_02);
						this.bar_02Chart.setOption(this.barOptions('各品类指标排名',right_title_list,right_data,right_ljzb_list));
						//底部折线图
						var day_list = data.day_list.day;
						var day_data_list = data.day_list.list;
						var line_box = document.getElementById('line_box');
						if(this.line_boxChart){
							this.line_boxChart.dispose();
						}
						this.line_boxChart = echarts.init(line_box);
						this.line_boxChart.setOption(this.lineOptions(day_list,day_data_list));
						//地图
						var china_box = document.getElementById('china_box');
						if(this.china_boxChart){
							this.china_boxChart.dispose();
						}
						this.china_boxChart = echarts.init(china_box);
						this.china_boxChart.setOption(this.mapOptions());

						var _this = this;
						window.addEventListener('resize',() => {
							_this.bar_01Chart.resize();
							_this.bar_02Chart.resize();
							_this.line_boxChart.resize();
							_this.china_boxChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//折线图配置
			lineOptions(day_list,day_data_list){
				return {
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return '统计日期：' + params.name + '</br>' 
							+ '销售指标：' + params.value + '万';
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
					color:['#DE3F07'],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: day_list
					},
					yAxis:[{
						type: 'value',
						axisLabel: {
							formatter: '{value}万'
						}
					}],
					series:[{
						label:{
							formatter: (params) => {
								return params.data + '万';
							},
						},
						data: day_data_list,
						type: 'line',
						areaStyle: {}
					}] 
				};
			},
			//柱状图配置
			barOptions(title,left_title_list,left_data,ljzb_list){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis',
						formatter: (params) => {
							let tip = "";
							if(params != null && params.length > 0) {
								for(let i =0; i < params.length; i++) {
									tip = params[1].axisValueLabel + '</br>'
									+ '销售指标：' + params[1].data.value + '</br>' 
									+ '占比：' + params[1].data.zb + "%</br>"
									+ '累计占比：' + params[1].data.ljzb + "%";
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
					color:['#DE3F07','#F6BD16'],
					grid: {
						containLabel: true,
						y2: 10
					},
					yAxis: [{
						type: 'category',
						data: left_title_list
					}],
					xAxis:[{
						type: 'value',
						axisLabel: {
							formatter: '{value}%'
						}
					},{
						type: 'value',
						axisLabel: {
							formatter: '{value}万'
						}
					}],
					series: [{
						type: 'line',
						stack: '1',
						xAxisIndex:0,
						lineStyle: { 
							 width:3.6
						},
						emphasis: {
							focus: 'series'
						},
						data: ljzb_list
					},{
						type: 'bar',
						xAxisIndex:1,
						emphasis: {
							focus: 'series'
						},
						data: left_data
					}]
				}
			},
			//地图配置
			mapOptions(){
				return {
					visualMap: {
						min: 800,
						max: 50000,
						text: ['High', 'Low'],
						realtime: false,
						calculable: true,
						inRange: {
							color: ['lightskyblue', 'yellow', 'orangered']
						}
					},
					series: [
					{
						name: '香港18区人口密度',
						type: 'map',
						nameMap:{
							'China' : '中国'
						},
                		label: {
                			show: true
                		},
                		data: [
                		{name: '中西区', value: 20057.34},
                		{name: '湾仔', value: 15477.48},
                		{name: '东区', value: 31686.1},
                		{name: '南区', value: 6992.6},
                		{name: '油尖旺', value: 44045.49},
                		{name: '深水埗', value: 40689.64},
                		{name: '九龙城', value: 37659.78},
                		{name: '黄大仙', value: 45180.97},
                		{name: '观塘', value: 55204.26},
                		{name: '葵青', value: 21900.9},
                		{name: '荃湾', value: 4918.26},
                		{name: '屯门', value: 5881.84},
                		{name: '元朗', value: 4178.01},
                		{name: '北区', value: 2227.92},
                		{name: '大埔', value: 2180.98},
                		{name: '沙田', value: 9172.94},
                		{name: '西贡', value: 3368},
                		{name: '离岛', value: 806.98}
                		]
                	}
                	]
                }
            }
        }
    }
</script>