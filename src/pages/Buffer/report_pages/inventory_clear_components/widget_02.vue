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
				<el-button type="primary" size="small" @click="shopRks()">查询</el-button>
			</el-form-item>
		</el-form>
		<div class="charts_box">
			<div class="charts_item" id="shop_rks"></div>
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
				ks_list:[],				//款式列表
				shop_plkcChart:null,
				ks:[]
			}
		},
		created(){
			//产品编码
			this.ajaxKsbm();
		},
		mounted(){
			//款式库存及到货情况
			this.shopRks();
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
			//款式库存及到货情况
			shopRks(){
				let ks = {
					ks:this.ks.join(',')
				}
				resource.rks(ks).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_rks = document.getElementById('shop_rks');
						this.shop_rksChart = echarts.init(shop_rks);
						this.shop_rksChart.setOption({
							title: {
								text: '入库数'
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
								data: ['入库数'],
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
								name:'入库数（万件）',
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
							_this.shop_rksChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>