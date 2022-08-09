<template>
	<div>
		<div class="charts_box">
			<div class="charts_item" id="shop_zxk" v-loading="shop_zxk_loading"></div>
		</div>
		<div class="charts_box">
			<div class="charts_item" id="shop_zxkc" v-loading="shop_zxkc_loading"></div>
			<div class="charts_item" id="shop_zxje" v-loading="shop_zxje_loading"></div>
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
	import {thousands} from '../../../../api/nowMonth.js'
	export default{
		data(){
			return{
				shop_zxkChart:null,
				shop_zxkcChart:null,
				shop_zxjeChart:null,
				shop_zxk_loading:false,
				shop_zxkc_loading:false,
				shop_zxje_loading:false,
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
				this.shop_zxk_loading = true;
				resource.shopUnsaLable().then(res => {
					if(res.data.code == 1){
						this.shop_zxk_loading = false;
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_zxk = document.getElementById('shop_zxk');
						this.shop_zxkChart = echarts.init(shop_zxk);
						this.shop_zxkChart.setOption({
							title: {
								text: '店铺滞销款数'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + "：" + thousands(params[0].value) + "（件）</br>";
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
								name:'款式数量（件）',
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
				this.shop_zxkc_loading = true;
				resource.plkcunSalable().then(res => {
					if(res.data.code == 1){
						this.shop_zxkc_loading = false;
						var echarts = require("echarts");
						let list = res.data.data.list;
						let name_list = res.data.data.name_list;
						var data_arr = [];
						list.map((item,index) => {
							name_list.map((name_item,i) => {
								if(index == i){
									let obj = {
										name:name_item,
										value:item
									}
									data_arr.push(obj);
								}
							})
						})
						var shop_zxkc = document.getElementById('shop_zxkc');
						this.shop_zxkcChart = echarts.init(shop_zxkc);
						this.shop_zxkcChart.setOption({
							title: {
								text: '滞销款式库存'
							},
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									return params.name + "：" + params.value + '%';
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
							series: [
							{
								name: '滞销款式库存',
								type: 'pie',
								radius: '50%',
								label:{
									formatter: '{b}: {d}%',
								},
								data: data_arr,
								emphasis: {
									itemStyle: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}
							]
						})
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shop_zxkcChart.resize();
						})
						this.shop_zxkcChart.on('click', params => {
							let new_req = {pl:params.name};
							this.plunsaLableMoney(new_req);
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//滞销款式金额
			plunsaLableMoney(req){
				this.shop_zxje_loading = true;
				resource.plunsaLableMoney(req).then(res => {
					if(res.data.code == 1){
						this.shop_zxje_loading = false;
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_zxje = document.getElementById('shop_zxje');
						this.shop_zxjeChart = echarts.init(shop_zxje);
						this.shop_zxjeChart.setOption({
							title: {
								text: '滞销款式库存金额'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + '</br>'
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
								name:'金额（元）',
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