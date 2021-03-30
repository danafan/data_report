<template>
	<div>
		<div class="charts_box">
			<div class="charts_item" id="shop_zxk"></div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="shop_zxkc"></div>
			<div class="charts_item" id="shop_zxje"></div>
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
		height: 450px
	}
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				shop_zxkChart:null,
				shop_zxkcChart:null,
				shop_zxjeChart:null
			}
		},
		mounted(){
			//款式库存及到货情况
			this.shopUnsaLable();
			//滞销款式库存
			this.plkcunSalable();
			//滞销款式金额
			this.plunsaLableMoney();
		},
		methods:{
			//款式库存及到货情况
			shopUnsaLable(){
				resource.shopUnsaLable().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_zxk = document.getElementById('shop_zxk');
						this.shop_zxkChart = echarts.init(shop_zxk);
						this.shop_zxkChart.setOption({
							title: {
								text: '店铺滞销款'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + "：" + params[0].value + "（万件）</br>";
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
								name:'款式数量（万件）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '入库数',
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
							_this.shop_zxkChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//滞销款式库存
			plkcunSalable(){
				resource.plkcunSalable().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var shop_zxkc = document.getElementById('shop_zxkc');
						this.shop_zxkcChart = echarts.init(shop_zxkc);
						this.shop_zxkcChart.setOption({
							title: {
								text: '滞销款式库存'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ "库存：" + params[0].value + "（万件）";
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
							grid:{
								y2:150
							},
							xAxis: {
								type: 'category',
								data: name_list,
								axisLabel: {
									color: '#333',
									rotate:70
								}
							},
							yAxis: {
								type: 'value',
								name:'库存（万件）',
								axisLabel: {
									formatter: '{value}'
								}
							},
							series: [{
								data: list,
								type: 'bar'
							}]
						})
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shop_zxkcChart.resize();
						})
						this.shop_zxkcChart.getZr().on('click', params => {
							let pointInPixel = [params.offsetX, params.offsetY]
							if (this.shop_zxkcChart.containPixel('grid', pointInPixel)) {
								let xIndex = this.shop_zxkcChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
								//店铺品类销售数据图表
								let new_req = {pl:name_list[xIndex]};
								this.plunsaLableMoney(new_req);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//滞销款式金额
			plunsaLableMoney(req){
				resource.plunsaLableMoney(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_zxje = document.getElementById('shop_zxje');
						this.shop_zxjeChart = echarts.init(shop_zxje);
						this.shop_zxjeChart.setOption({
							title: {
								text: '滞销款式金额'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
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
								name:'金额（万元）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '金额',
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
							_this.shop_zxjeChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>