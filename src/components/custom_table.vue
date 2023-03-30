<template>
	<el-table border size="mini" :data="table_data" tooltip-effect="dark" :header-cell-style="columnStyle" :cell-style="rowStyle" :max-height="max_height" @sort-change="sortChange">
		<el-table-column fixed type="index" label="序号" align="center" v-if="show_index">
		</el-table-column>
		<el-table-column :prop="item.row_field_name" align="center" :sortable="item.is_sort?'custom':false" :fixed="item.is_fixed == 1" show-overflow-tooltip v-for="item in title_list" :column-key="item.color" :width="item.type == '8'?180:column_width">
			<template slot="header" slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
					<div class="table_header_text">{{item.row_name}}</div>
				</el-tooltip>
			</template>
			<!-- 多级表头 -->
			<el-table-column :prop="i.row_field_name" align="center" :sortable="i.is_sort?'custom':false" :fixed="i.is_fixed == 1" show-overflow-tooltip v-for="i in item.list" :column-key="i.color" :width="i.type == '8'?180:column_width" v-if="item.list">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.row_name" placement="top-start">
						<div class="table_header_text">{{i.row_name}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="i.type == '3' && scope.row.images[0] != ''"></el-image>
					<el-button type="text" v-else-if="i.type == '4'" @click="$emit('tableCallBack',scope.row[fieldName],tableName)">{{scope.row[i.row_field_name]}}{{i.unit}}</el-button>
					<div class="chart" v-else-if="i.type == '8'" :id="`${i.row_field_name}-${scope.row.id}`"></div>
					<div v-else>{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null&&scope.row[i.row_field_name] != ''?i.unit:''}}</div>
				</template>
			</el-table-column>
			<!-- 单级表头 -->
			<template slot-scope="scope" v-else>
				<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.type == '3' && scope.row.images[0] != ''"></el-image>
				<el-button type="text" v-else-if="item.type == '4'" @click="$emit('tableCallBack',scope.row[fieldName],tableName)">{{scope.row[item.row_field_name]}}{{item.unit}}</el-button>
				<div class="chart" v-else-if="item.type == '8'" :id="`${item.row_field_name}-${scope.row.id}`"></div>
				<div v-else>{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null&&scope.row[i.row_field_name] != ''?item.unit:''}}</div>
			</template>
		</el-table-column>
		<el-table-column label="操作" align="center" v-if="is_setting">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="$emit('editFn',scope.row.id)" v-if='button_list.edit == 1'>编辑</el-button>
				<el-button type="text" size="small" @click="$emit('deleteFn',scope.row.id)" v-if='button_list.del == 1'>删除</el-button>
				<el-button type="text" size="small" @click="$emit('detailFn',scope.row.id)" v-if='scope.row.detail'>详情</el-button>
				<el-button type="text" size="small" @click="$emit('handleFn',scope.row.id)" v-if='scope.row.handle'>处理</el-button>
				<el-button type="text" size="small" @click="$emit('feekbackFn',scope.row[fieldName])" v-if='scope.row.feekback'>反馈</el-button>
			</template>
		</el-table-column>
	</el-table>
</template>
<script>
	export default{
		data(){
			return{
				show_chart_filed:[],		//需要展示图表的字段列表
			}
		},
		props:{
			//是否显示序号
			show_index:{
				type:Boolean,
				default:false
			},
			//表头是否换行
			is_wrap:{
				type:Boolean,
				default:false
			},
			//表格最大高度
			max_height:{
				type:String,
				default:'360px'
			},
			//列宽
			column_width:{
				type:String,
				default:''
			},
			//表格数据
			table_data:{
				type:Array,
				default:()=>[]
			},
			//表头数据
			title_list:{
				type:Array,
				default:()=>[]
			},
			//第一行是否是总计行
			total_row:{
				type:Boolean,
				default:false
			},
			//下钻时取的参数
			fieldName:{
				type:String,
				default:''
			},
			//表格名称（用于区分点击的哪个表格）
			tableName:{
				type:String,
				default:''
			},
			//图片宽高
			image_size:{
				type:String,
				default:'50px'
			},
			//是否有操作列
			is_setting:{
				type:Boolean,
				default:false
			},
			//按钮权限
			button_list:{
				type:Object,
				default:() => {
					return {
						edit:0,
						del:0
					}
				}
			},
		},
		watch:{
			table_data:function(n,o){
				this.$nextTick(() => {
					this.getShowChartFiled(this.title_list);
					var echarts = require("echarts");
					n.map(n_item => {
						this.show_chart_filed.map((item) => {
							if(n_item.id != ''){
								var ele = document.getElementById(`${item}-${n_item.id}`);
								let myChart = echarts.getInstanceByDom(ele)
								if (myChart == null) { 
									myChart = echarts.init(ele);
								}
								let x_axis = [];
								let series_data = n_item[item].split(',');
								series_data.map(i => {
									x_axis.push('');
								})
								myChart.setOption(this.chartsOptions(x_axis,series_data))
							}

						})
					})
				})
			}
		},
		methods:{
			//排序
			sortChange({ column, prop, order }) {  
				let sort = "";
				if(order){
					sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					sort = "";
				}   
				this.$emit('sortCallBack',sort);
			},
			//递归找到需要展示图标的字段
			getShowChartFiled(list) {
				list.map(item => {
					if(item.list && item.list.length > 0){
						if(item.type == 8){
							this.show_chart_filed.push(item.row_field_name);
						}
						this.getShowChartFiled(item.list)
					}else{
						if(item.type == 8){
							this.show_chart_filed.push(item.row_field_name);
						}
					}
				})
			},
			//表头加特殊背景色
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(column.columnKey){
					return `background: ${column.columnKey};color:#333333`;
				}else{
					return `background: #f4f4f4`;
				}
			},
			// 总计行样式
			rowStyle({ row, column, rowIndex, columnIndex }) {
				if(this.total_row && rowIndex == 0){
					return 'color:#333333;fontSize:14px;fontWeight:bold';
				}
			},
			//图表绘制
			chartsOptions(x_axis,series_data){
				return {
					xAxis: {
						type: 'category',
						data: x_axis,
						axisLine: {
							show: false, 
						},
						axisTick: {
							show: false,  
						}
					},
					yAxis: {
						type: 'value',
						axisTick: {
							show: false,  
						},
						axisLine: {
							show: false, 
						},
						axisLabel: {
							show: false, 
						},
						splitLine: {
							show: true,
							lineStyle: {
								type: 'dashed',
							},
						}
					},
					series: [
					{
						data: series_data,
						type: 'line',
					}
					]
				}
			},
		}
	}
</script>
<style lang="less" scoped>
.prop_text{
	white-space: pre-wrap;
}
.chart{
	width: 120px;
	height: 80px;
}
.total_style{
	color: red;
}
</style>