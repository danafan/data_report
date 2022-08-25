<template>
	<div class="content_box">
		<div class="bar_box" id="bar_05" v-loading="loading"></div>
		<div class="center_box">
			<div class="tab_container">
				<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">鱼塘金额</div>
				<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">鱼塘单量</div>
			</div>
			<div class="money_text">{{total_obj.value}}</div>
			<div class="tb_row">
				<div>同比(年)</div>
				<i class="el-icon-caret-top top" v-if="total_obj.tb >= 0"></i>
				<i class="el-icon-caret-top green" v-if="total_obj.tb < 0"></i>
				<div class="top" :class="{'green':total_obj.tb < 0}">{{total_obj.tb}}%</div>
			</div>
			<div class="tb_row">
				<div>鱼塘占比</div>
				<div class="top">{{total_obj.zb}}%</div>
			</div>
			<div class='china_box' id="china_box_yt" v-loading="loading"></div>
			<div class="line_box" id="line_box_yt" v-loading="loading"></div>
		</div>
		<div class="bar_box" id="bar_06" v-loading="loading"></div>
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
			color: #103597;
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
		background:#103597;
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
				bar_05Chart:null,		//左侧的柱状图
				bar_06Chart:null,		//右侧柱状图
				line_box_ytChart:null,		//底部折线图
				china_box_ytChart:null,	//中国地图
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
				resource.areasaleYt(req_obj).then(res => {
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
						var bar_05 = document.getElementById('bar_05');
						if(this.bar_05Chart){
							this.bar_05Chart.dispose();
						}
						this.bar_05Chart = echarts.init(bar_05);
						this.bar_05Chart.setOption(this.barOptions('1','各省鱼塘指标排名',this.left_title_list,this.left_data,left_ljzb_list));
						//点击事件
						this.bar_05Chart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.bar_05Chart.containPixel('grid', pointInPixel)) {
								let yIndex = this.bar_05Chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[1];
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
						var bar_06 = document.getElementById('bar_06');
						if(this.bar_06Chart){
							this.bar_06Chart.dispose();
						}
						this.bar_06Chart = echarts.init(bar_06);
						this.bar_06Chart.setOption(this.barOptions('2','各品类鱼塘指标排名',right_title_list,right_data,right_ljzb_list));
						//底部折线图
						var day_list = data.day_list.day;
						var day_data_list = data.day_list.list;
						var day_zb_list = data.day_list.zb_list;
						var line_box_yt = document.getElementById('line_box_yt');
						if(this.line_box_ytChart){
							this.line_box_ytChart.dispose();
						}
						this.line_box_ytChart = echarts.init(line_box_yt);
						this.line_box_ytChart.setOption(this.lineOptions(day_list,day_data_list,day_zb_list));
						//地图
						echarts.registerMap('china', {geoJSON: geoJson});
						var china_box_yt = document.getElementById('china_box_yt');
						if(this.china_box_ytChart){
							this.china_box_ytChart.dispose();
						}
						this.china_box_ytChart = echarts.init(china_box_yt);
						if(data.map){
							this.map_data = data.map.list;
							this.max_value = data.map.max_value;
							this.min_value = this.map_data.length == 1?0:data.map.min_value;
						}
						this.china_box_ytChart.setOption(this.mapOptions());

						var _this = this;
						window.addEventListener('resize',() => {
							_this.bar_05Chart.resize();
							_this.bar_06Chart.resize();
							_this.line_box_ytChart.resize();
							_this.china_box_ytChart.resize();
						})

					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//折线图配置
			lineOptions(day_list,day_data_list,day_zb_list){
				return {
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return '统计日期：' + params.name + '</br>' 
							+ params.seriesName + "：" + params.value + `${params.seriesIndex == 0?'万':'%'}`;
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
					color:['#103597'],
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
					},{
						type: 'value',
						axisLabel: {
							formatter: '{value}%'
						}
					}],
					series:[{
						name:'鱼塘指标',
						label:{
							formatter: (params) => {
								return params.data + '万';
							},
						},
						yAxisIndex:0,
						data: day_data_list,
						type: 'line',
						areaStyle: {}
					},{
						name:'鱼塘占比',
						label:{
							formatter: (params) => {
								return params.data + '%';
							},
						},
						yAxisIndex:1,
						data: day_zb_list,
						type: 'line',
						areaStyle: {}
					}] 
				};
			},
			//柱状图配置
			barOptions(type,title,left_title_list,left_data,ljzb_list){
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
									+ '鱼塘指标：' + params[1].data.value + '万</br>' 
									+ '鱼塘占比：' + params[1].data.ljzb + "%";
									if(type == '1'){
										tip += '</br>' + '占比：' + params[1].data.zb + "%";
									}
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
					color:['#103597','#103597'],
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
								+ '鱼塘指标：' + params.data.value + '万';
							}else{
								tip = '暂无信息' + '</br>'
								+ '鱼塘指标：' + '无';
							}
							return tip;
						}
					},
					visualMap: {
						left: 'right',
						min: this.min_value,
						max: this.max_value,
						inRange: {
							color: ['#E0E2FB','#103597']
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