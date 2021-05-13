<template>
	<div>
		<el-table :data="all_pl" size="small" style="width: 100%">
			<el-table-column prop="n" align="center" label="品类" width="150"></el-table-column>
			<el-table-column :label="item" align="center" v-for="item in arr">
				<el-table-column :prop="`xj_${item}`" align="center" label="销售金额" width="120">
				</el-table-column>
				<el-table-column :prop="`xs_${item}`" align="center" label="销售数量" width="120">
				</el-table-column>
				<el-table-column :prop="`ts_${item}`" align="center" label="退款数量" width="120">
				</el-table-column>
			</el-table-column>
		</el-table>
		<div id="axis_01" class="axis_01"></div>
	</div>
</template>
<style lang="less" scoped>
.axis_01{
	min-width: 100%;
	min-height: 600px;
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				all_pl:[],
				arr:[]
			}
		},
		props:{
			dept_id:{
				type:String,
				default:""
			},
			shop_id:{
				type:String,
				default:""
			},
			cpfl:{
				type:String,
				default:""
			},
			year:{
				type:String,
				default:""
			},
			month:{
				type:String,
				default:""
			}
		},
		watch:{
			dept_id:function(n,o){
				//获取列表
				this.getList();
			},
			shop_id:function(n,o){
				//获取列表
				this.getList();
			},
			cpfl:function(n,o){
				//获取列表
				this.getList();
			},
			year:function(n,o){
				//获取列表
				this.getList();
			},
			month:function(n,o){
				//获取列表
				this.getList();
			}
		},
		mounted(){
			//获取列表
			this.getList();
		},
		methods:{
			getList(){
				this.all_pl = [{n:'片类1',xj_2020:'1',xs_2020:'1',ts_2020:'1',xj_2021:'2',xs_2021:'2',ts_2021:'2'},{n:'片类2',xj_2020:'3',xs_2020:'3',ts_2020:'3',xj_2021:'4',xs_2021:'4',ts_2021:'4'}];
				this.arr = ['2020','2021'];
				let req = {
					dept_id:this.dept_id,
					shop_id:this.shop_id,
					cpfl:this.cpfl,
					year:this.year,
					month:this.month
				}
				resource.annualAmount(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						var ele = document.getElementById('axis_01');
						var myChart = echarts.init(ele);
						myChart.setOption({
							title: {
								text: '店铺七天销量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = "日期：" + params[0].axisValueLabel + '</br>'
											+ params[0].seriesName + '</br>'
											+ "销售金额：" + params[0].value + "（万）</br>"
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
								data: ['2020', '2021'],
								// top:0,
								// right:0
							},
							xAxis: [{
								data: ['2','3','4','5','6'],
								axisLabel: {
									color: '#333',
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								name:'销售金额（万）',
								axisLabel: {
									formatter: '{value}'
								}
							},{
								type: 'value',
								name:'较去年变化率（%）',
								axisLabel: {
									formatter: '{value}'
								}
							}],
							series: [{
								name: '2020',
								type: 'line',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: [12,23,32,123,23]
							},{
								name: '2021',
								type: 'line',
								stack: '1',
								yAxisIndex:1,
								emphasis: {
									focus: 'series'
								},
								data: [112,223,132,323,123]
							}]
						})
					}else{
						this.$messgae.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>