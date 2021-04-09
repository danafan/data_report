<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺:">
				<el-select v-model="select_store_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="shopHpxz()">查询</el-button>
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
	import {thousands} from '../../../../api/nowMonth.js'
	export default{
		data(){
			return{
				store_list:[],
				select_store_ids:[],
				shop_hpxzChart:null,
				shop_hpxzksChart:null
			}
		},
		mounted(){
			//货品性质占比
			this.shopHpxz();
			//款式数量
			this.shopHpxzks();
			//店铺列表
			this.getStoreList();
		},
		methods:{
			//店铺列表
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//货品性质占比
			shopHpxz(){
				resource.hpxz({shop_id:this.select_store_ids.join(','),}).then(res => {
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
								text: '货品性质款式占比'
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
								name: '访问来源',
								type: 'pie',
								radius: ['40%', '70%'],
								label:{
									formatter: '{b}: {d}%',
								},
								data: data_list
							}
							]
						});
						var _this = this;
						window.addEventListener('resize',() => {
							_this.shop_hpxzChart.resize();
						})
						this.shop_hpxzChart.on('click', params => {
							let new_req = {hpxz:params.name}
							//店铺品类销售数据图表
							this.shopHpxzks(new_req);
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式数量
			shopHpxzks(req){
				resource.hpxzks(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let name_list = res.data.data.name_list;
						let list = res.data.data.list;
						var shop_hpxzks = document.getElementById('shop_hpxzks');
						this.shop_hpxzksChart = echarts.init(shop_hpxzks);
						this.shop_hpxzksChart.setOption({
							title: {
								text: '店铺款式数量'
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
							legend: {
								data: ['款式数量'],
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
								name:'款式数量（件）',
								axisLabel: {
									formatter: '{value}'
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
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>