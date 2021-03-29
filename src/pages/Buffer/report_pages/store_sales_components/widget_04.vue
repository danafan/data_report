<template>
	<div>
		<div class="charts_box">
			<div class="charts_item" id="shopcb"></div>
			<div class="charts_item" id="shopplcb"></div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="shopkscb"></div>
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
	export default{
		data(){
			return {
				shopcbChart:null,
				shopplcbChart:null,
				shopkscbChart:null
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
				resource.shopcb(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shopcb = document.getElementById('shopcb');
						this.shopcbChart = echarts.init(shopcb);
						this.shopcbChart.setOption({
							title: {
								text: '店铺销售成本'
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
								data: ['费用']
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
								name:'费用',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series: [{
								name: '费用',
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
				resource.shopplcb(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shopplcb = document.getElementById('shopplcb');
						this.shopplcbChart = echarts.init(shopplcb);
						this.shopplcbChart.setOption({
							title: {
								text: '品类销售成本'
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
								data: ['费用']
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
								name:'费用',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series: [{
								name: '费用',
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
				resource.shopkscb(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shopkscb = document.getElementById('shopkscb');
						this.shopkscbChart = echarts.init(shopkscb);
						this.shopkscbChart.setOption({
							title: {
								text: '款式销售成本'
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
								data: ['费用']
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
								name:'费用',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series: [{
								name: '费用',
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