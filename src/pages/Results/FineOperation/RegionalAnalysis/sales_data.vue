<template>
	<div class="content_box">
		<div class="bar_box" id="bar_01" v-loading="loading"></div>
		<div class="center_box">
			<div class="tab_container">
				<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">销售金额</div>
				<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">销售数量</div>
			</div>
			<div class="money_text">{{total_obj.value}}</div>
			<div class="tb_row">
				<div>同比(年)</div>
				<i class="el-icon-caret-top top" v-if="total_obj.tb >= 0"></i>
				<i class="el-icon-caret-top green" v-if="total_obj.tb < 0"></i>
				<div class="top" :class="{'green':total_obj.tb < 0}">{{total_obj.tb}}%</div>
			</div>
			<div class='china_box' id="china_box" v-loading="loading"></div>
			<div class="line_box" id="line_box" v-loading="loading"></div>
		</div>
		<div class="bar_box" id="bar_02" v-loading="loading"></div>
	</div>
</template>
<style lang="less" scoped>
.content_box{
	display:flex;
	justify-content: space-between;
	.bar_box{
		border:1px solid red;
		width: 400px;
		height: 700px;
	}
	.center_box{
		flex: 1;
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		font-size: 16px;
		.money_text{
			font-size: 36px;
			font-weight: bold;
			color: #FC5C19;
		}
		.tb_row{
			display:flex;
			align-items: center;
			font-size: 14px;
			.top{
				color: #DE3F07;
			}
			.green{
				color: #5AD8A6;
			}
		}
		.china_box{
			width: 100%;
			height: 350px;
		}
		.line_box{
			width: 100%;
			height: 260px;
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
		background:#FC5C19;
		color: #fff;
	}
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	import geoJson from '../../../../static/china_geo.json'
	export default{
		data(){
			return{
				tab_index:'1',			//默认选中第一个
				bar_01Chart:null,		//左侧的柱状图
				bar_02Chart:null,		//右侧柱状图
				line_boxChart:null,		//底部折线图
				china_boxChart:null,	//中国地图
				total_obj:{},			//总计数字
				req:{},					//点击搜索传递的参数
				left_title_list:[],		//缓存的左侧省份数据
				left_data:[],			//缓存的左侧数据
				map_list:[],			//缓存的地图数据
				max_value:0,			//缓存的地图最大值
				min_value:0,			//缓存的地图最小值
				loading:false
			}
		},
		watch:{
			tab_index:function(n,o){
				this.req.select_province = '';
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
				this.loading = true;
				resource.areaSale(req_obj).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						var data = res.data.data;
						var echarts = require("echarts");
						//总计
						this.total_obj = data.total;
						//左侧柱状图
						if(data.province){
							this.left_title_list = data.province.title_list;
							this.left_data = data.province.data;
							this.left_data.reverse();
							this.left_title_list.reverse();
						}
						var left_ljzb_list = [];
						this.left_data.map(item => {
							left_ljzb_list.push(item.ljzb);
						});
						var bar_01 = document.getElementById('bar_01');
						if(this.bar_01Chart){
							this.bar_01Chart.dispose();
						}
						this.bar_01Chart = echarts.init(bar_01);
						this.bar_01Chart.setOption(this.barOptions('各省销售指标排名',this.left_title_list,this.left_data,left_ljzb_list));
						//点击事件
						this.bar_01Chart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.bar_01Chart.containPixel('grid', pointInPixel)) {
								let yIndex = this.bar_01Chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[1];
								this.req.select_province = this.left_title_list[yIndex];
								this.getList();
							}
						})
						//右侧柱状图
						var right_title_list = data.cpfl.title_list;
						right_title_list.reverse();
						var right_data = data.cpfl.list;
						right_data.reverse();
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
						echarts.registerMap('china', {geoJSON: geoJson});
						var china_box = document.getElementById('china_box');
						if(this.china_boxChart){
							this.china_boxChart.dispose();
						}
						this.china_boxChart = echarts.init(china_box);
						if(data.map){
							this.map_data = data.map.list;
							this.max_value = data.map.max_value;
							this.min_value = this.map_data.length == 1?0:data.map.min_value;
						}
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
					color:['#FC5C19'],
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
									+ '销售指标：' + params[1].data.value + '万</br>' 
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
					color:['#FC5C19','#FC5C19'],
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
						itemStyle: {
							color: (params) => {
								if(this.req.select_province  === params.name){
									return '#1296db';
								}else {
									return '#F6BD16';
								}
							}},
							data: left_data
						}]
					}
				},
			//地图配置
			mapOptions(){
				return {
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							let tip = "";
							if(params.data){
								tip = params.data.name + '</br>'
								+ '销售指标：' + params.data.value + '万';
							}else{
								tip = '暂无信息' + '</br>'
								+ '销售指标：' + '暂无';
							}
							return tip;
						}
					},
					visualMap: {
						left: 'right',
						min: this.min_value,
						max: this.max_value,
						inRange: {
							color: ['#FEDB6F','#FC5C19']
						},
						text: [this.max_value + '万', this.min_value + '万'],           
						calculable: true
					},
					series: [
					{
						type: 'map',
						roam: true,
						map: 'china',
						data:this.map_data
					}
					]
				}
			}
		}
	}
</script>