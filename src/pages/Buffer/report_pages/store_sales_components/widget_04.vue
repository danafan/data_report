<template>
	<div>
		<div class="charts_box">
			<div class="charts_item" id="shopcb" v-loading="shopcb_loading"></div>
			<div class="charts_item" id="shopplcb" v-loading="shopplcb_loading"></div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="shopkscb" v-loading="shopkscb_loading"></div>
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
				shopcbChart:null,
				shopplcbChart:null,
				shopkscbChart:null,
				shopcb_loading:false,
				shopplcb_loading:false,
				shopkscb_loading:false,
			}
		},
		methods:{
        	//重新调用
        	reLoadData(req){
        		//店铺销售成本图表
        		this.shopCb(req);
            	//品类销售成本图表
            	this.shopPlcb(req);
				//款式销售成本图表
				this.shopKscb(req);
			},
			//店铺销售成本图表
			shopCb(req){
				this.shopcb_loading = true;
				resource.shopcb(req).then(res => {
					if(res.data.code == 1){
						this.shopcb_loading = false;
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shopcb = document.getElementById('shopcb');
						this.shopcbChart = echarts.init(shopcb);
						this.shopcbChart.setOption({
							title: {
								text: '店铺七天销售成本'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "（万）";
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
								data: ['成本'],
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
								name:'成本（万）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '成本',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shopcbChart.resize();
						})
						this.shopcbChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.shopcbChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.shopcbChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								let old_req = {select_shop_id:name_list[xIndex]}
								let new_req = {...req,...old_req}
								//品类销售成本图表
								this.shopPlcb(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类销售成本图表
			shopPlcb(req){
				this.shopplcb_loading = true;
				resource.shopplcb(req).then(res => {
					if(res.data.code == 1){
						this.shopplcb_loading = false;
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shopplcb = document.getElementById('shopplcb');
						this.shopplcbChart = echarts.init(shopplcb);
						this.shopplcbChart.setOption({
							title: {
								text: '品类七天销售成本'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + thousands(params[0].value) + "（元）";
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
								data: ['成本'],
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
								name:'成本（元）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '成本',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shopplcbChart.resize();
						})
						this.shopplcbChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.shopplcbChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.shopplcbChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								let old_req = {
									select_shop_id:req.select_shop_id?req.select_shop_id:"",
									pl:name_list[xIndex]
								}
								let new_req = {...req,...old_req}
								//款式推广费用
								this.shopKscb(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式销售成本图表
			shopKscb(req){
				this.shopkscb_loading = true;
				resource.shopkscb(req).then(res => {
					if(res.data.code == 1){
						this.shopkscb_loading = false;
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shopkscb = document.getElementById('shopkscb');
						this.shopkscbChart = echarts.init(shopkscb);
						this.shopkscbChart.setOption({
							title: {
								text: '款式七天销售成本'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + thousands(params[0].value) + "（元）";
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
								data: ['成本'],
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
								name:'成本（元）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '成本',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shopkscbChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>