<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式：">
				<el-select v-model="ks" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList()">查询</el-button>
			</el-form-item>
		</el-form>
		<div class="charts_box">
			<div class="charts_item" id="shop_hpxz"></div>
			<div class="charts_item" id="shop_hpxzks"></div>
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
			return{
				ks_list:[],				//款式列表
				ks:[],
				shop_hpxzChart:null,
				shop_hpxzksChart:null
			}
		},
		created(){
			//产品编码
			this.ajaxKsbm();
		},
		mounted(){
			//货品性质占比
			this.shopHpxz();
			//款式数量
			this.shopHpxzks();
		},
		methods:{
			//产品编码
			ajaxKsbm(){
				resource.ajaxKsbm().then(res => {
					if(res.data.code == 1){
						this.ks_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//货品性质占比
			shopHpxz(){
				resource.hpxz().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
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
						var shop_hpxz = document.getElementById('shop_hpxz');
						this.shop_hpxzChart = echarts.init(shop_hpxz);
						this.shop_hpxzChart.setOption({
							title: {
								text: '货品性质占比'
							},
							tooltip: {
								trigger: 'item',
								formatter: "{a} <br/>{b}: {c}%"
							},
							series: [{
								name: '货品性质占比',
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
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shop_hpxzChart.resize();
						})
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
			//款式数量
			shopHpxzks(){
				resource.hpxzks().then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_hpxzks = document.getElementById('shop_hpxzks');
						this.shop_hpxzksChart = echarts.init(shop_hpxzks);
						this.shop_hpxzksChart.setOption({
							title: {
								text: '款式数量'
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
							legend: {
								data: ['款式数量']
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
								name:'款式数量',
								axisLabel: {
									formatter: '{value}万件'
								}
							}],
							series: [{
								name: '款式数量',
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
							_this.shop_hpxzksChart.resize();
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