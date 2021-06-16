<template>
	<div class="content_box">
		<div class="bar_box" id="bar_03"></div>
		<div class="center_box">
			<div class="tab_container">
				<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">退款金额</div>
				<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">退款数量</div>
			</div>
			<div class="money_text">{{total_obj.value}}</div>
			<div class="tb_row">
				<div>同比(年)</div>
				<i class="el-icon-caret-top top" v-if="total_obj.tb >= 0"></i>
				<i class="el-icon-caret-top green" v-if="total_obj.tb < 0"></i>
				<div class="top" :class="{'green':total_obj.tb < 0}">{{total_obj.tb}}%</div>
			</div>
			<div class="tb_row">
				<div>退款率</div>
				<div class="top">{{total_obj.zb}}%</div>
			</div>
			<div class='china_box' id="china_box_refund"></div>
			<div class="line_box" id="line_box_refund"></div>
		</div>
		<div class="bar_box" id="bar_04"></div>
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
			color: #880F0A;
		}
		.tb_row{
			margin-bottom: 3px;
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
		background:#880F0A;
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
				bar_03Chart:null,		//左侧的柱状图
				bar_04Chart:null,		//右侧柱状图
				line_box_refundChart:null,		//底部折线图
				china_box_refundChart:null,	//中国地图
				total_obj:{},			//总计数字
				req:{},					//点击搜索传递的参数
				left_title_list:[],		//缓存的左侧省份数据
				left_data:[],			//缓存的左侧数据
				map_list:[],			//缓存的地图数据
				max_value:0,			//缓存的地图最大值
				min_value:0,			//缓存的地图最小值
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
				resource.areasaleReturn(req_obj).then(res => {
					if(res.data.code == 1){
						var data = res.data.data;
						var echarts = require("echarts");
						//总计
						this.total_obj = data.total;
						//左侧柱状图
						if(data.province){
							this.left_title_list = data.province.title_list;
							this.left_data = data.province.data;
							this.left_data.reverse();
						}
						var left_ljzb_list = [];
						this.left_data.map(item => {
							left_ljzb_list.push(item.ljzb);
						});
						var bar_03 = document.getElementById('bar_03');
						if(this.bar_03Chart){
							this.bar_03Chart.dispose();
						}
						this.bar_03Chart = echarts.init(bar_03);
						this.bar_03Chart.setOption(this.barOptions('各省退款指标排名',this.left_title_list,this.left_data,left_ljzb_list));
						//点击事件
						this.bar_03Chart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.bar_03Chart.containPixel('grid', pointInPixel)) {
								let yIndex = this.bar_03Chart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[1];
								this.req.select_province = this.left_title_list[yIndex];
								this.getList();
							}
						})
						//右侧柱状图
						var right_title_list = data.cpfl.title_list;
						var right_data = data.cpfl.list;
						right_data.reverse();
						var right_ljzb_list = [];
						right_data.map(item => {
							right_ljzb_list.push(item.ljzb);
						});
						var bar_04 = document.getElementById('bar_04');
						if(this.bar_04Chart){
							this.bar_04Chart.dispose();
						}
						this.bar_04Chart = echarts.init(bar_04);
						this.bar_04Chart.setOption(this.barOptions('各品类退款指标排名',right_title_list,right_data,right_ljzb_list));
						//底部折线图
						var day_list = data.day_list.day;
						var day_data_list = data.day_list.list;
						var day_zb_list = data.day_list.zb_list;
						var line_box_refund = document.getElementById('line_box_refund');
						if(this.line_box_refundChart){
							this.line_box_refundChart.dispose();
						}
						this.line_box_refundChart = echarts.init(line_box_refund);
						this.line_box_refundChart.setOption(this.lineOptions(day_list,day_data_list,day_zb_list));
						//地图
						echarts.registerMap('china', {geoJSON: geoJson});
						var china_box_refund = document.getElementById('china_box_refund');
						if(this.china_box_refundChart){
							this.china_box_refundChart.dispose();
						}
						this.china_box_refundChart = echarts.init(china_box_refund);
						if(data.map){
							this.map_data = data.map.list;
							this.max_value = data.map.max_value;
							this.min_value = data.map.min_value;
						}
						this.china_box_refundChart.setOption(this.mapOptions());

						var _this = this;
						window.addEventListener('resize',() => {
							_this.bar_03Chart.resize();
							_this.bar_04Chart.resize();
							_this.line_box_refundChart.resize();
							_this.china_box_refundChart.resize();
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
					color:['#880F0A'],
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
						name:'退款指标',
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
						name:'退款率',
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
									+ '退款指标：' + params[1].data.value + '万</br>' 
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
					color:['#880F0A','#880F0A'],
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
								+ '退款指标：' + params.data.value + '万';
							}else{
								tip = '暂无信息' + '</br>'
								+ '退款指标：' + '无';
							}
							return tip;
						}
					},
					visualMap: {
						left: 'right',
						min: this.min_value,
						max: this.max_value,
						inRange: {
							color: ['#FCD8D3','#880F0A']
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