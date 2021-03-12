<template>
	<div class="container">
		<!-- 每日鱼塘单量 -->
		<div class="single_box">
			<div id="single_date" class="single_date"></div>
			<div id="single_total" class="single_total"></div>
		</div>
		<!-- 各店铺鱼塘单量占比 -->
		<div id="accounted" class="accounted"></div>
		<!-- 鱼塘目标完成情况 -->
		<div id="over_state" class="over_state"></div>
	</div>
</template>
<style lang="less" scoped>
.container{
	.single_box{
		width: 100%;
		display: flex;
		.single_date{
			width:70%;
			height: 300px;
		}
		.single_total{
			width:30%;
			height: 300px;
		}
	}
	.accounted{
		width: 100%;
		height: 600px;
	}
	.over_state{
		width: 100%;
		height: 300px;
	}
}

</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				day_ytdl_obj:{
					fkrq:[],
					sjdl:[],
					ytdl:[],
					ytmbz:[]
				},							//每日鱼塘单量
				total_ljytdl_obj:{
					ytdl:[],
					sjdl:[],
					ytmbz:""
				},							//累计鱼塘单量
				shop_ytdlzb_obj:{
					dpid:[],
					sjdl:[],
					ytdl:[],
					ytdlzb:[]
				},							//各店铺鱼塘单量占比
			}
		},
		mounted(){
			var echarts = require("echarts");
			//每日鱼塘单量
			// var single_date = document.getElementById('single_date');
			// var single_dateChart = echarts.init(single_date);
			// single_dateChart.setOption({
			// 	title: {
			// 		text: '每日鱼塘单量'
			// 	},
			// 	tooltip: {
			// 		trigger: 'axis',
			// 		formatter: function (params) {
			// 			let tip = "";
			// 			if(params != null && params.length > 0) {
			// 				for(let i =0; i < params.length; i++) {
			// 					tip = "付款日期：" + params[0].axisValueLabel + "</br>"
			// 					+ params[0].seriesName + "：" + params[0].value + "万</br>"
			// 					+ params[1].seriesName + "：" + params[1].value + "万</br>"
			// 					+ params[2].seriesName + "：" + params[2].value + "万</br>" 
			// 					+ "鱼塘单量占比：" + '34.32%' + "</br>"
			// 					+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value))+"万";
			// 				}
			// 			}
			// 			return tip;
			// 		},
			// 		backgroundColor:"rgba(0,0,0,.8)",
			// 		textStyle:{
			// 			color:"#ffffff"
			// 		},
			// 		borderColor:"rgba(0,0,0,0.7)",
			// 	},
			// 	color:['#CBDC46','#ED9A30', '#408A28'],
			// 	legend: {
			// 		data: ['鱼塘单量', '实际单量', '鱼塘目标值']
			// 	},
			// 	xAxis: {
			// 		type: 'category',
			// 		boundaryGap: false,
			// 		data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			// 	},
			// 	yAxis: {
			// 		type: 'value',
			// 		min: 0,
			// 		interval: 250,
			// 		axisLabel: {
			// 			formatter: '{value} 万'
			// 		}
			// 	},
			// 	series: [
			// 	{
			// 		name: '鱼塘单量',
			// 		type: 'line',
			// 		stack: '总量',
			// 		itemStyle: { 
			// 			normal: { 
			// 				lineStyle: { 
			// 					 width:3.6
			// 				} 
			// 			} 
			// 		}, 
			// 		data: [120, 132, 101, 134, 90, 230, 210]
			// 	},
			// 	{
			// 		name: '实际单量',
			// 		type: 'line',
			// 		stack: '总量',
			// 		itemStyle: { 
			// 			normal: { 
			// 				lineStyle: { 
			// 					 width:3.6
			// 				} 
			// 			} 
			// 		},
			// 		data: [220, 182, 191, 234, 290, 330, 310]
			// 	},
			// 	{
			// 		name: '鱼塘目标值',
			// 		type: 'line',
			// 		stack: '总量',
			// 		itemStyle: { 
			// 			normal: { 
			// 				lineStyle: { 
			// 					 width:3.6
			// 				} 
			// 			} 
			// 		},
			// 		data: [150, 232, 201, 154, 190, 330, 410]
			// 	}]
			// });
			//累计鱼塘单量
			// var single_total = document.getElementById('single_total');
			// var single_totalChart = echarts.init(single_total);
			// single_totalChart.setOption({
			// 	title: {
			// 		text: '累计鱼塘单量'
			// 	},
			// 	tooltip: {
			// 		trigger: 'axis',
			// 		formatter: function (params) {
			// 			let tip = "";
			// 			if(params != null && params.length > 0) {
			// 				for(let i =0; i < params.length; i++) {
			// 					tip = params[0].seriesName + "：" + params[0].value + "万</br>"
			// 					+ params[1].seriesName + "：" + params[1].value + "万</br>"
			// 					+ "鱼塘目标值：" + "128" + "万</br>" 
			// 					+ "鱼塘单量占比：" + "12" + "%</br>" 
			// 					+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value))+"万";
			// 				}
			// 			}
			// 			return tip;
			// 		},
			// 		backgroundColor:"rgba(0,0,0,.8)",
			// 		textStyle:{
			// 			color:"#ffffff"
			// 		},
			// 		borderColor:"rgba(0,0,0,0.7)",
			// 		axisPointer: {            
			// 			type: 'shadow'        
			// 		}
			// 	},
			// 	color:['#CBDC46','#ED9A30'],
			// 	legend: {
			// 		data: ['鱼塘单量', '实际单量']
			// 	},
			// 	xAxis: [{
			// 		type: 'category',
			// 		data: ['']
			// 	}],
			// 	yAxis:[{
			// 		type: 'value',
			// 		min: 0,
			// 		interval: 250,
			// 	}],
			// 	series: [{
			// 		name: '鱼塘单量',
			// 		type: 'bar',
			// 		stack: '1',
			// 		emphasis: {
			// 			focus: 'series'
			// 		},
			// 		label:{
			// 			show:true,
			// 			formatter: '{c}万'
			// 		},
			// 		data: [320],
			// 	},{
			// 		name: '实际单量',
			// 		type: 'bar',
			// 		stack: '1',
			// 		emphasis: {
			// 			focus: 'series'
			// 		},
			// 		label:{
			// 			show:true,
			// 			formatter: '{c}万'
			// 		},
			// 		data: [120]
			// 	}]
			// });
			//各店铺鱼塘单量占比
			// var accounted = document.getElementById('accounted');
			// var accountedChart = echarts.init(accounted);
			// accountedChart.setOption({
			// 	title: {
			// 		text: '各店铺鱼塘单量占比'
			// 	},
			// 	tooltip: {
			// 		trigger: 'axis',
			// 		formatter: function (params) {
			// 			let tip = "";
			// 			if(params != null && params.length > 0) {
			// 				for(let i =0; i < params.length; i++) {
			// 					tip = params[0].axisValueLabel + "</br>"
			// 					+ params[0].seriesName + "：" + params[0].value + "</br>"
			// 					+ params[1].seriesName + "：" + params[1].value + "</br>"
			// 					+ params[2].seriesName + "：" + params[2].value + "%</br>" 
			// 					+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value));
			// 				}
			// 			}
			// 			return tip;
			// 		},
			// 		backgroundColor:"rgba(0,0,0,.8)",
			// 		textStyle:{
			// 			color:"#ffffff"
			// 		},
			// 		borderColor:"rgba(0,0,0,0.7)",
			// 		axisPointer: {            
			// 			type: 'shadow'        
			// 		}
			// 	},
			// 	color:['#CBDC46','#ED9A30', '#408A28'],
			// 	legend: {
			// 		data: ['鱼塘单量', '实际单量', '鱼塘单量占比']
			// 	},
			// 	xAxis: [{
			// 		type: 'category',
			// 		data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
			// 	}],
			// 	yAxis:[{
			// 		type: 'value',
			// 		axisLabel: {
			// 			formatter: '{value} 万'
			// 		}
			// 	},{
			// 		type: 'value',
			// 		min: 0,
			// 		max: 100,
			// 		interval: 25,
			// 		axisLabel: {
			// 			formatter: '{value} %'
			// 		}
			// 	}],
			// 	series: [{
			// 		name: '鱼塘单量',
			// 		type: 'bar',
			// 		stack: '1',
			// 		emphasis: {
			// 			focus: 'series'
			// 		},
			// 		data: [320, 332, 301, 334, 390, 330, 320]
			// 	},{
			// 		name: '实际单量',
			// 		type: 'bar',
			// 		stack: '1',
			// 		emphasis: {
			// 			focus: 'series'
			// 		},
			// 		data: [120, 132, 101, 134, 90, 230, 210]
			// 	},{
			// 		name: '鱼塘单量占比',
			// 		type: 'line',
			// 		stack: '1',
			// 		itemStyle: { 
			// 			normal: { 
			// 				lineStyle: { 
			// 					 width:3.6
			// 				} 
			// 			} 
			// 		},
			// 		emphasis: {
			// 			focus: 'series'
			// 		},
			// 		data: [220, 182, 191, 234, 290, 330, 310]
			// 	}]
			// });
			//鱼塘目标完成情况
			var over_state = document.getElementById('over_state');
			var over_stateChart = echarts.init(over_state);
			over_stateChart.setOption({
				title: {
					text: '鱼塘目标完成情况'
				},
				tooltip: {
					trigger: 'axis',
					formatter: function (params) {
						let tip = "";
						if(params != null && params.length > 0) {
							for(let i =0; i < params.length; i++) {
								tip = params[0].axisValueLabel + "</br>"
								+ params[0].seriesName + "：" + params[0].value + "</br>"
								+ params[1].seriesName + "：" + params[1].value + "</br>"
								+ params[2].seriesName + "：" + params[2].value + "%</br>" 
								+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value));
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
				color:['#44A422','#CBDD46', '#DE5636'],
				legend: {
					data: ['鱼塘目标值', '鱼塘单量', '鱼塘完成率']
				},
				xAxis: [{
					type: 'category',
					data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
				}],
				yAxis:[{
					type: 'value',
					axisLabel: {
						formatter: '{value} 万'
					}
				},{
					type: 'value',
					min: 0,
					max: 100,
					interval: 25,
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
					data: [420, 342, 386, 342, 390, 230, 410]
				},{
					name: '鱼塘单量',
					type: 'bar',
					stack: '1',
					barGap: '-120%',
					barMaxWidth:"60%",
					emphasis: {
						focus: 'series'
					},
					data: [320, 332, 301, 334, 390, 330, 320]
				},{
					name: '鱼塘完成率',
					type: 'line',
					stack: '1',
					itemStyle: { 
						normal: { 
							lineStyle: { 
								 width:3.6
							} 
						} 
					},
					emphasis: {
						focus: 'series'
					},
					data: [23, 82, 91, 34, 90, 30, 10]
				}]
			});
            //获取列表
            this.fishList();
        },
        methods:{
			//获取列表
			fishList(){
				resource.fishList().then(res => {
					if(res.data.code == '1'){
						var echarts = require("echarts");
						//每日鱼塘单量
						let day_ytdl_list = res.data.data.day_ytdl_list; 
						day_ytdl_list.map(item => {
							this.day_ytdl_obj.fkrq.push(item.fkrq);		//付款日期
							this.day_ytdl_obj.ytdl.push(item.ytdl);		//鱼塘单量
							this.day_ytdl_obj.sjdl.push(item.sjdl);		//实际单量
							this.day_ytdl_obj.ytmbz.push(item.ytmbz);	//鱼塘目标值
						});
						var single_date = document.getElementById('single_date');
						var single_dateChart = echarts.init(single_date);
						single_dateChart.setOption({
							title: {
								text: '每日鱼塘单量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = "付款日期：" + params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>"
											+ params[2].seriesName + "：" + params[2].value + "万</br>" 
											+ "鱼塘单量占比：" + (params[0].value/(parseFloat(params[0].value) + parseFloat(params[1].value))).toFixed(2) + "%</br>"
											+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
										}
									}
									return tip;
								},
								backgroundColor:"rgba(0,0,0,.8)",
								textStyle:{
									color:"#ffffff"
								},
								borderColor:"rgba(0,0,0,0.7)",
							},
							color:['#CBDC46','#ED9A30', '#408A28'],
							legend: {
								data: ['鱼塘单量', '实际单量', '鱼塘目标值']
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: this.day_ytdl_obj.fkrq
							},
							yAxis: {
								type: 'value',
								min: 0,
								interval: 10,
								axisLabel: {
									formatter: '{value} 万'
								}
							},
							series: [
							{
								name: '鱼塘单量',
								type: 'line',
								stack: '1',
								itemStyle: { 
									normal: { 
										lineStyle: { 
											 width:3.6
										} 
									} 
								}, 
								data: this.day_ytdl_obj.ytdl
							},
							{
								name: '实际单量',
								type: 'line',
								stack: '1',
								itemStyle: { 
									normal: { 
										lineStyle: { 
											 width:3.6
										} 
									} 
								},
								data: this.day_ytdl_obj.sjdl
							},
							{
								name: '鱼塘目标值',
								type: 'line',
								stack: '1',
								itemStyle: { 
									normal: { 
										lineStyle: { 
											 width:3.6
										} 
									} 
								},
								data: this.day_ytdl_obj.ytmbz
							}]
						});
						//累计鱼塘单量
						let total_ljytdl_list = res.data.data.total_ljytdl_list; 
						this.total_ljytdl_obj.ytdl.push(total_ljytdl_list[0].ytdl);	//鱼塘单量
						this.total_ljytdl_obj.sjdl.push(total_ljytdl_list[0].sjdl);	//实际单量
						this.total_ljytdl_obj.ytmbz = total_ljytdl_list[0].ytmbz;	//鱼塘目标值
						var single_total = document.getElementById('single_total');
						var single_totalChart = echarts.init(single_total);
						single_totalChart.setOption({
							title: {
								text: '累计鱼塘单量',
								subtext:`总单量：${(this.total_ljytdl_obj.ytdl[0] + this.total_ljytdl_obj.sjdl[0]).toFixed(2)}万`,
								subtextStyle:{
									color:"#DE5636"
								} 
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>"
											+ "鱼塘目标值：" + `${this.total_ljytdl_obj.ytmbz}` + "万</br>" 
											+ "鱼塘单量占比：" + (params[0].value/(parseFloat(params[0].value) + parseFloat(params[1].value))).toFixed(2) + "%</br>"
											+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
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
							color:['#CBDC46','#ED9A30'],
							legend: {
								data: ['鱼塘单量', '实际单量']
							},
							xAxis: [{
								type: 'category',
								data: ['']
							}],
							yAxis:[{
								type: 'value',
								min: 0,
								interval: 250,
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
									formatter: '{c}万'
								},
								data: this.total_ljytdl_obj.ytdl,
							},{
								name: '实际单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}万'
								},
								data: this.total_ljytdl_obj.sjdl
							}]
						});
						//各店铺鱼塘单量占比
						let shop_ytdlzb_list = res.data.data.shop_ytdlzb_list;
						shop_ytdlzb_list.map(item => {
							this.shop_ytdlzb_obj.dpid.push(item.dpid);		//店铺名称
							this.shop_ytdlzb_obj.ytdl.push(item.ytdl);		//鱼塘单量
							this.shop_ytdlzb_obj.sjdl.push(item.sjdl);		//实际单量
							this.shop_ytdlzb_obj.ytdlzb.push(item.ytdlzb);	//鱼塘店铺占比
						}); 
						var accounted = document.getElementById('accounted');
						var accountedChart = echarts.init(accounted);
						accountedChart.setOption({
							title: {
								text: '各店铺鱼塘单量占比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "</br>"
											+ params[1].seriesName + "：" + params[1].value + "</br>"
											+ params[2].seriesName + "：" + params[2].value + "%</br>" 
											+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2);
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
							color:['#CBDC46','#ED9A30', '#408A28'],
							legend: {
								data: ['鱼塘单量', '实际单量', '鱼塘单量占比']
							},
							grid:{
								y2:300
							},
							xAxis: [{
								type: 'category',
								data: this.shop_ytdlzb_obj.dpid,
								axisLabel: {
									color: '#333',
									interval: 0,
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								axisLabel: {
									formatter: '{value} 万'
								}
							},{
								type: 'value',
								min: 0,
								max: 100,
								interval: 25,
								axisLabel: {
									formatter: '{value} %'
								}
							}],
							series: [{
								name: '鱼塘单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								data: this.shop_ytdlzb_obj.ytdl
							},{
								name: '实际单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								data: this.shop_ytdlzb_obj.sjdl
							},{
								name: '鱼塘单量占比',
								type: 'line',
								stack: '1',
								itemStyle: { 
									normal: { 
										lineStyle: { 
											 width:3.6
										} 
									} 
								},
								emphasis: {
									focus: 'series'
								},
								data: this.shop_ytdlzb_obj.ytdlzb
							}]
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
}
}
}
</script>