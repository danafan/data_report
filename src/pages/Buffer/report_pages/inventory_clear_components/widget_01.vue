<template>
	<div>
		<div class="table_content">
			<div class="header_box">
				清理进度指标版
			</div>
			<div class="time_content">
				<div class="time_item">
					<div>一周</div>
					<div class="red_color">20</div>
					<div class="red_color">%</div>
				</div>
				<div class="time_item">
					<div>二周</div>
					<div class="red_color">20</div>
					<div class="red_color">%</div>
				</div>
				<div class="time_item">
					<div>三周</div>
					<div class="red_color">20</div>
					<div class="red_color">%</div>
				</div>
				<div class="time_item">
					<div>四周</div>
					<div class="red_color">20</div>
					<div class="red_color">%</div>
				</div>
				<div class="time_item">
					<div>待清理款</div>
					<div class="red_color">20</div>
				</div>
			</div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="shop_plkc"></div>
			<div class="charts_item" id="shop_kskc"></div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.table_content{
	border:1px solid #D9D9D9;
	width: 100%;
	.header_box{
		border-bottom:1px solid #D9D9D9;
		background: #FAFAFA;
		width: 100%;
		height: 46px;
		line-height: 46px;
		padding-left: 20px;
		color: #333333;
		font-size: 14px;
	}
	.time_content{
		width: 100%;
		display: flex;
		justify-content: space-around;
		padding-top: 10px;
		padding-bottom: 10px;
		.time_item{
			display:flex;
			flex-direction: column;
			align-items: center;
			color: #333333;
			font-size: 16px;
			.red_color{
				color: #FF0000;
				font-weight: bold;
			}
		}
	}
}
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
			return{
				shop_plkcChart:null
			}
		},
		mounted(){
			//品类库存列表
			this.shopPlkc();
			//款式库存及到货情况
			this.shopKskc();
		},
		methods:{
			//品类库存列表
			shopPlkc(){
				resource.plkc().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name;
						var data_list = [];
						list.map((item,index) => {
							name_list.map((name_item,i) => {
								if(index == i){
									let obj = {
										value:item,
										name:name_item
									}
									data_list.push(obj)
								}
							})
						})
						var shop_plkc = document.getElementById('shop_plkc');
						this.shop_plkcChart = echarts.init(shop_plkc);
						this.shop_plkcChart.setOption({
							title: {
								text: '品类库存'
							},
							tooltip: {
								trigger: 'item',
								formatter: "{a} <br/>{b}: {c}%"
							},
							series: [{
								name: '库存比例',
								type: 'pie',
								radius: ['40%', '70%'],
								avoidLabelOverlap: false,
								label: {
									show: false,
									position: 'center'
								},
								emphasis: {
									label: {
										show: true,
										fontSize: '40',
										fontWeight: 'bold'
									}
								},
								labelLine: {
									show: false
								},
								data: data_list
							}]
						});
						// var _this = this;
						// window.addEventListener('resize',() => {
						// 	_this.shop_saleChart.resize();
						// })
						// this.shop_saleChart.getZr().on('click', params => {
						// 	let pointInPixel = [params.offsetX, params.offsetY]
						// 	if (this.shop_saleChart.containPixel('grid', pointInPixel)) {
						// 		let xIndex = this.shop_saleChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
						// 		let old_req = {select_shop_id:name_list[xIndex]}
						// 		let new_req = {...req,...old_req}
						// 		//店铺品类销售数据图表
						// 		this.shopPlsale(new_req);
						// 	}
						// })
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式库存及到货情况
			shopKskc(){
				resource.kskc().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let kc_list = res.data.data.kc_list;
						let dh_list = res.data.data.dh_list;
						var shop_kskc = document.getElementById('shop_kskc');
						this.shop_kskcChart = echarts.init(shop_kskc);
						this.shop_kskcChart.setOption({
							title: {
								text: '款式库存及到货情况'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + "：" + params[0].value + "（万件）</br>"
											+ params[1].seriesName + "：" + params[1].value + "（万件）</br>";
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
								data: ['库存', '到货']
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
								name:'库存',
								axisLabel: {
									formatter: '{value}万件'
								}
							},{
								type: 'value',
								name:'到货',
								axisLabel: {
									formatter: '{value}万件'
								}
							}],
							series: [{
								name: '库存',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: kc_list
							},{
								name: '到货',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: dh_list
							}]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shop_kskcChart.resize();
						})
						// this.shop_kskcChart.getZr().on('click', params => {
						// 	let pointInPixel = [params.offsetX, params.offsetY]
						// 	if (this.shop_kskcChart.containPixel('grid', pointInPixel)) {
						// 		let xIndex = this.shop_kskcChart.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
						// 		let old_req = {select_shop_id:name_list[xIndex]}
						// 		let new_req = {...req,...old_req}
						// 		//店铺品类销售数据图表
						// 		this.shopPlsale(new_req);
						// 	}
						// })
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>