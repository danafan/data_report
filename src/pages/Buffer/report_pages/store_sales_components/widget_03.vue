<template>
	<div>
		<div class="charts_box">
			<div class="charts_item" id="shop_promotion"></div>
			<div class="charts_item" id="catepromotion"></div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="kspromotion"></div>
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
				shop_promotionChart:null,
				catepromotionChart:null,
				kspromotionChart:null
			}
		},
		methods:{
        	//重新调用
        	reLoadData(req){
        		//店铺推广费用
        		this.shopPromotion(req);
            	//直通车推广费用
            	this.shopCatePromotion(req);
				//款式推广费用
				this.shopksPromotion(req);
			},
			//店铺推广费用
			shopPromotion(req){
				resource.shopPromotion(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shop_promotion = document.getElementById('shop_promotion');
						this.shop_promotionChart = echarts.init(shop_promotion);
						this.shop_promotionChart.setOption({
							title: {
								text: '店铺推广费用'
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
							_this.shop_promotionChart.resize();
						})
						this.shop_promotionChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.shop_promotionChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.shop_promotionChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								let old_req = {select_shop_id:name_list[xIndex]}
								let new_req = {...req,...old_req}
								//直通车推广费用
								this.shopCatePromotion(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//直通车推广费用
			shopCatePromotion(req){
				resource.catePromotion(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var catepromotion = document.getElementById('catepromotion');
						this.catepromotionChart = echarts.init(catepromotion);
						this.catepromotionChart.setOption({
							title: {
								text: '直通车推广费用'
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
							_this.catepromotionChart.resize();
						})
						this.catepromotionChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.catepromotionChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.catepromotionChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								let old_req = {
									select_shop_id:req.select_shop_id?req.select_shop_id:"",
									pl:name_list[xIndex]
								}
								let new_req = {...req,...old_req}
								//款式推广费用
								this.shopksPromotion(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式推广费用
			shopksPromotion(req){
				resource.ksPromotion(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var kspromotion = document.getElementById('kspromotion');
						this.kspromotionChart = echarts.init(kspromotion);
						this.kspromotionChart.setOption({
							title: {
								text: '款式推广费用'
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
							_this.kspromotionChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>