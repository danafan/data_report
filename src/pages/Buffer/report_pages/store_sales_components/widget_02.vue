<template>
	<div>
		<div class="charts_box">
			<div class="charts_item" id="shop_sale"></div>
			<div class="charts_item" id="plsale"></div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="kssale"></div>
			<div class="charts_item" id="day_sale"></div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.charts_box{
	margin-top: 20px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	.charts_item{
		width: 46%;
		height: 500px
	}
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	import {thousands} from '../../../../api/nowMonth.js'
	export default{
		data(){
			return {
				shop_saleChart:null,
				plsaleChart:null,
				kssaleChart:null,
				day_saleChart:null
			}
		},
		methods:{
        	//重新调用
        	reLoadData(req){
        		//店铺销量图表
        		this.shopSale(req);
            	//品类销售数据图表
            	this.shopPlsale(req);
            	//款式销售数据图表
            	this.shopKssale(req);
            	//每日销售数据图表
            	this.shopDaySale(req);
            },
			//店铺销量图表
			shopSale(req){
				resource.shopSale(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let money_list = res.data.data.money_list;
						let num_list = res.data.data.num_list;
						let name_list = res.data.data.name_list;
						var shop_sale = document.getElementById('shop_sale');
						this.shop_saleChart = echarts.init(shop_sale);
						this.shop_saleChart.setOption({
							title: {
								text: '店铺七天销量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + "：" + params[0].value + "（万件）</br>"
											+ params[1].seriesName + "：" + params[1].value + "（万）</br>";
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
							color:['#5AD8A6','#F6BD16'],
							legend: {
								data: ['销量', '金额'],
								top:0,
								right:0
							},
							grid:{
								y2:150
							},
							xAxis: [{
								type: 'category',
								data: name_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'销量（万件）',
								axisLabel: {
									formatter: '{value}'
								}
							},{
								type: 'value',
								name:'金额（万）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '销量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: num_list
							},{
								name: '金额',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: money_list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shop_saleChart.resize();
						})
						this.shop_saleChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.shop_saleChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.shop_saleChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								let old_req = {select_shop_id:name_list[xIndex]}
								let new_req = {...req,...old_req}
								//店铺品类销售数据图表
								this.shopPlsale(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺品类销售数据图表
			shopPlsale(req){
				resource.plsale(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let money_list = res.data.data.money_list;
						let num_list = res.data.data.num_list;
						let name_list = res.data.data.name_list;
						var plsale = document.getElementById('plsale');
						this.plsaleChart = echarts.init(plsale);
						this.plsaleChart.setOption({
							title: {
								text: '品类七天销量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + "：" + thousands(params[0].value) + "（件）</br>"
											+ params[1].seriesName + "：" + thousands(params[1].value) + "（元）</br>";
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
							color:['#5AD8A6','#F6BD16'],
							legend: {
								data: ['销量', '金额'],
								top:0,
								right:0
							},
							grid:{
								y2:150
							},
							xAxis: [{
								type: 'category',
								data: name_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'销量（件）',
								axisLabel: {
									formatter: '{value}'
								}
							},{
								type: 'value',
								name:'金额（元）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '销量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: num_list
							},{
								name: '金额',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: money_list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.plsaleChart.resize();
						})
						this.plsaleChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.plsaleChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.plsaleChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								let old_req = {
									select_shop_id:req.select_shop_id?req.select_shop_id:"",
									pl:name_list[xIndex]
								}
								let new_req = {...req,...old_req}
								//款式销量图表
								this.shopKssale(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式销量图表
			shopKssale(req){
				resource.kssale(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let money_list = res.data.data.money_list;
						let num_list = res.data.data.num_list;
						let name_list = res.data.data.name_list;
						var kssale = document.getElementById('kssale');
						this.kssaleChart = echarts.init(kssale);
						this.kssaleChart.setOption({
							title: {
								text: '款式七天销量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + "：" + thousands(params[0].value) + "（件）</br>"
											+ params[1].seriesName + "：" + thousands(params[1].value) + "（元）</br>";
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
							color:['#5AD8A6','#F6BD16'],
							legend: {
								data: ['销量', '金额'],
								top:0,
								right:0
							},
							grid:{
								y2:150
							},
							xAxis: [{
								type: 'category',
								data: name_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'销量（件）',
								axisLabel: {
									formatter: '{value}'
								}
							},{
								type: 'value',
								name:'金额（元）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '销量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: num_list
							},{
								name: '金额',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: money_list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.kssaleChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//每日销量图表
			shopDaySale(req){
				resource.daySale(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let num_list = res.data.data.num_list;
						let name_list = res.data.data.name_list;
						var day_sale = document.getElementById('day_sale');
						this.day_saleChart = echarts.init(day_sale);
						this.day_saleChart.setOption({
							title: {
								text: '日销量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + thousands(params[0].value) + "（件）";
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
							color:['#5AD8A6'],
							legend: {
								data: ['销量'],
								top:0,
								right:0
							},
							grid:{
								y2:150
							},
							xAxis: [{
								type: 'category',
								data: name_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'销量（件）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '销量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: num_list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.day_saleChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>