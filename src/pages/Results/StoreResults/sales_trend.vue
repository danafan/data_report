<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="付款当日：">
				<el-date-picker v-model="fkrq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="getData">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="row_box">
			<div class="left_box">
				<div class="title">各店目标达成情况</div>
				<el-table :data="table_data" size="mini" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='1000' width="50%" :summary-method="getSummaries" show-summary :cell-style="columnStyle">
					<el-table-column type="index" label="序号" width="60"> </el-table-column>
					<el-table-column label="店铺ID" prop="dpid" width="140" show-overflow-tooltip sortable>
					</el-table-column>
					<el-table-column label="店铺名称" prop="dpname" width="140" show-overflow-tooltip sortable>
					</el-table-column>
					<el-table-column label="平台" prop="platform" width="140" show-overflow-tooltip sortable>
					</el-table-column>
					<el-table-column :label="current_year + '-' + day_list[day_list.length - 2]" prop="yesterday" width="140" sortable>
						<template slot-scope="scope">
							<div class="background_box" :style="{width:`${max_list.yesterday_max == 0?0:(140/max_list.yesterday_max)*Math.abs(scope.row.yesterday)}px`,background:'#FEDB6F'}">{{scope.row.yesterday.toFixed(2)}}万</div>
						</template>
					</el-table-column>
					<el-table-column :label="current_year + '-' + day_list[day_list.length - 1]" prop="today" width="140" sortable>
						<template slot-scope="scope">
							<div class="background_box" :style="{width:`${max_list.max_today == 0?0:(140/max_list.max_today)*Math.abs(scope.row.today)}px`,background:'#FEDB6F'}">{{scope.row.today.toFixed(2)}}万</div>
						</template>
					</el-table-column>
					<el-table-column label="变化率" prop="bhl" width="140" show-overflow-tooltip sortable>
						<template slot-scope="scope">
							<div>{{scope.row.bhl.toFixed(2)}}%</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="right_box">
				<div class="title">近期趋势变化</div>
				<div class="list_box">
					<div class="row_right" v-for="item in right_list">
						<div class="name_box">
							<div class="name_text">{{item.name}}</div>
						</div>
						<div class="sales_div"></div>
					</div>
				</div>
				
			</div>
		</div>
	</div>
</template>
<style type="text/css">
	.el-table--mini td{
		padding: 5px 0!important;
	}
</style>
<style lang="less" scoped>
.title{
	// margin-top: 30px;
	margin-bottom: 20px;
	font-size: 18px;
	font-weight: bold;
}
.row_box{
	width: 100%;
	display:flex;
}
.background_box{
	padding-left: 3px;
	white-space:nowrap;
	height: 28px;
	display:flex;
	align-items: center;
}

.right_box{
	flex: 1;
	.list_box{
		height: 1000px;
		width: 100%;
		overflow: scroll;
		.row_right{
			width: 100%;
			display:flex;
			.name_box{
				height: 140px;
				width: 20%;
				display:flex;
				align-items: center;
				justify-content:center;
				.name_text{
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					text-overflow: ellipsis;
					overflow: hidden;
					font-size: 12px;
				}
			}
			.sales_div{
				height: 200px;
				width: 75%;
			}
		}
	}
	
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getCurrentDate} from '../../../api/nowMonth.js'
	import dps from '../../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				select_department_ids:[],					//选中的部门id列表
				select_store_ids:[],						//选中的店铺列表
				select_plat_ids:[],							//选中的平台列表
				fkrq:getCurrentDate(),						//付款当日
				table_data:[],								//表格数据
				max_list:{},								//最大值
				total_data:[],								//总计行
				day_list:[],								//所有日期列表
				current_year:"",							//当前年
				right_list:[],	
			}
		},
		created(){
			var now = new Date(); 				//当前日期  
			this.current_year = now.getFullYear(); 		
			//获取列表
			this.getData();
		},
		methods:{
			//总计行
			getSummaries(){
				return this.total_data;
			},
			//区分颜色的列的样式
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 4){
					if(row.bhl < 0){
						return 'color: #0CB618';
					}else{
						return 'color: #EA1B29';
					}
				}
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//获取列表
			getData(){
				let req = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					fkrq:this.fkrq?this.fkrq:'',
				}
				resource.recentSales(req).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.table_data = data.left_list.list;
						this.max_list = data.left_list.max_list;
						this.total_data = data.left_list.total_data;
						this.day_list = data.day;
						this.right_list = data.right_list;
						var echarts = require("echarts");
						
						this.$nextTick(() => {
							var roseCharts = document.getElementsByClassName('sales_div');
							var chart_list = [];
							for(let i = 0;i < roseCharts.length;i ++){
								var myChart = echarts.init(roseCharts[i]);
								myChart.setOption(this.pieOptions(this.right_list[i].xjse));
								chart_list.push(myChart);
							};
							window.addEventListener('resize',() => {
								chart_list.map((item,index) => {
									item.resize();
								})
							})
						})
						
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//折线图配置
			pieOptions(xjse){
				return {
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return "店铺：" + params.data.name + '</br>' 
							+ "付款日期：" + params.data.day + '</br>'
							+ "销售额：" + params.data.value + '万';
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
					color:['#FDA509'],
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: this.day_list
					},
					yAxis:{
						show: false,
					},
					series: [
					{
						type: 'line',
						data: xjse,
						markLine: {
							silent:true,
							label:{
								position:'middle'
							},
							data: [
							{type: 'average', name: '平均值',
							label:{
								formatter: '{c}万'
							}}
							]
						}
					}
					]
				};
			},
		},
		components:{
			dps
		}
	}
</script>







