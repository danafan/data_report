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
				<el-table :data="total_data" size="mini" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" width="50%" :row-class-name="tableRowClassName" :cell-style="columnStyle" @sort-change="sortChange" v-if="total_data.length > 0" v-loading="loading">
					<el-table-column label="序号" width="60">
						<template>
							<div>总计</div>
						</template>
					</el-table-column>
					<el-table-column label="店铺ID" prop="dpid" width="140" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="店铺名称" prop="dpname" width="140" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="平台" prop="platform" width="140" show-overflow-tooltip sortable="custom">
					</el-table-column>
					<el-table-column :label="date.pre_day" prop="yesterday" width="140"  sortable="custom">
						<template slot-scope="scope">
							<div>{{scope.row.yesterday.toFixed(2)}}万</div>
						</template>
					</el-table-column>
					<el-table-column :label="date.today" prop="today" width="140"  sortable="custom">
						<template slot-scope="scope">
							<div>{{scope.row.today.toFixed(2)}}万</div>
						</template>
					</el-table-column>
					<el-table-column label="变化率" prop="bhl" width="140" show-overflow-tooltip  sortable="custom">
						<template slot-scope="scope">
							<div>{{scope.row.bhl.toFixed(2)}}%</div>
						</template>
					</el-table-column>
				</el-table>
				<el-table :data="table_data" size="mini" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='1000' width="50%" :cell-style="columnStyle" @sort-change="sortChange" :show-header="total_data.length == 0" v-loading="loading">
					<el-table-column label="序号" width="60">
						<template slot-scope="scope">
							<div>{{scope.$index}}</div>
						</template>
					</el-table-column>
					<el-table-column label="店铺ID" prop="dpid" width="140" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="店铺名称" prop="dpname" width="140" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="平台" prop="platform" width="140" show-overflow-tooltip sortable="custom">
					</el-table-column>
					<el-table-column :label="date.pre_day" prop="yesterday" width="140"  sortable="custom">
						<template slot-scope="scope">
							<div class="background_box" :style="{width:`${max_list.yesterday_max == 0?0:(140/max_list.yesterday_max)*Math.abs(scope.row.yesterday)}px`,background:'#FEDB6F'}" v-if="scope.$index > 0">{{scope.row.yesterday.toFixed(2)}}万</div>
							<div v-else>{{scope.row.yesterday.toFixed(2)}}万</div>
						</template>
					</el-table-column>
					<el-table-column :label="date.today" prop="today" width="140"  sortable="custom">
						<template slot-scope="scope">
							<div class="background_box" :style="{width:`${max_list.max_today == 0?0:(140/max_list.max_today)*Math.abs(scope.row.today)}px`,background:'#FEDB6F'}" v-if="scope.$index > 0">{{scope.row.today.toFixed(2)}}万</div>
							<div v-else>{{scope.row.today.toFixed(2)}}万</div>
						</template>
					</el-table-column>
					<el-table-column label="变化率" prop="bhl" width="140" show-overflow-tooltip  sortable="custom">
						<template slot-scope="scope">
							<div>{{scope.row.bhl.toFixed(2)}}%</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="right_box" v-loading="loading">
				<div class="title">近期趋势变化</div>
				<div class="list_box">
					<div class="row_right" v-for="(item,index) in right_list" :key="index">
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
.el-table .warning-row {
    background: #f0f9eb;
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
				sort_field:"",
				sort_type:"",
				fkrq:getCurrentDate(),						//付款当日
				table_data:[],								//表格数据
				max_list:{},								//最大值
				total_data:[],								//总计行
				day_list:[],								//所有日期列表
				right_list:[],	
				date:{},
				loading:false
			}
		},
		created(){	
			//获取列表
			this.getData();
		},
		methods:{
			tableRowClassName({rowIndex}) {
				if (rowIndex === 0) {
					return 'warning-row';
				}
			},	
			// 监听排序
			sortChange(e){
				if(!e.order){
					this.sort_field = "";
					this.sort_type = "";
				}else if(e.order == "descending"){
					this.sort_type = 0;
					this.sort_field = e.prop;
				}else if(e.order == "ascending"){
					this.sort_type = 1;
					this.sort_field = e.prop;
				}
				//获取列表
				this.getData();
			},
			//区分颜色的列的样式
			columnStyle({ row, columnIndex }) {
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
					sort_field:this.sort_field,
					sort_type:this.sort_type,
				}
				this.loading = true;
				resource.recentSales(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.date = data.date;
						this.total_data = [];
						this.table_data = data.left_list.list;
						if(this.table_data.length > 0){
							this.total_data.push(this.table_data[0])
							this.table_data.splice(0,1);
						}
						
						this.max_list = data.left_list.max_list;
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
							}
							window.addEventListener('resize',() => {
								chart_list.map((item) => {
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







