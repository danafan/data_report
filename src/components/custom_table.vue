<template>
	<div>
		<el-table :class="[{'customTable':total_row},commonClass]" border size="mini" :data="table_data" tooltip-effect="dark" :header-cell-style="columnStyle" :max-height="max_height" @sort-change="sortChange" :show-summary="total_row" :summary-method="getSummaries">
			<el-table-column fixed type="index" label="序号" align="center" v-if="show_index">
			</el-table-column>
			<el-table-column :prop="item.row_field_name" align="center" :sortable="sortableFn(item.is_sort)" :fixed="item.is_fixed == 1" show-overflow-tooltip v-for="item in title_list" :column-key="item.color" :width="item.type == '8'?180:column_width">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
						<div :class="[{'pre-line':is_wrap},{'table_header_text':!is_wrap}]">{{item.row_name}}</div>
					</el-tooltip>
				</template>
				<!-- 多级表头 -->
				<el-table-column :prop="i.row_field_name" align="center" :sortable="sortableFn(i.is_sort)" :fixed="i.is_fixed == 1" show-overflow-tooltip :column-key="i.color" :width="i.type == '8'?180:column_width" v-for="i in item.list">
					<template slot="header" slot-scope="scope">
						<el-tooltip class="item" effect="dark" :content="i.row_name" placement="top-start">
							<div :class="[{'pre-line':is_wrap},{'table_header_text':!is_wrap}]">{{i.row_name}}</div>
						</el-tooltip>
					</template>
					<template slot-scope="scope">
						<!-- 营销费用经营管控-事业部项目部营销费用投产情况-毛利率-营销费用占比 -->
						<div :class="{'red_color':scope.row[i.row_field_name] < 20}" :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="i.type == '99'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
						<!-- 营销费用经营管控-店铺营销费用投产情况-毛利率-营销费用占比 -->
						<div :class="{'red_color':(i.row_field_name == 'mlv_rate' && scope.row[i.row_field_name] < 20) || (i.row_field_name == 'yx_rate' && ((scope.row.platform == '淘宝' && scope.row[i.row_field_name] > 15) || (scope.row.platform == '天猫' && scope.row[i.row_field_name] > 20)))}" :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="i.type == '98'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
						<!-- 进度条 -->
						<div :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="i.type == '1'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
						<!-- 正负颜色 -->
						<div :class="[{'red_color':scope.row[i.row_field_name] >= 0},{'green_color':scope.row[i.row_field_name] < 0}]" v-else-if="i.type == '2' && i.row_field_name != 'mlv_rate'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null&&scope.row[i.row_field_name] !== ''?i.unit:''}}</div>
						<!-- 图片 -->
						<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-else-if="i.type == '3' && scope.row.images[0] != ''"></el-image>
						<!-- 链接 -->
						<el-button type="text" v-else-if="i.type == '4'" @click="$emit('tableCallBack',scope.row[fieldName],tableName)">{{scope.row[i.row_field_name]}}{{i.unit}}</el-button>
						<!-- 图表 -->
						<div class="chart" v-else-if="i.type == '8'" :id="`${i.row_field_name}-${scope.row.id}`"></div>
						<!-- 普通文字 -->
						<div class="table_header_text" v-else>{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null&&scope.row[i.row_field_name] !== ''?i.unit:''}}</div>
					</template>
				</el-table-column>
				<!-- 单级表头 -->
				<template slot-scope="scope">
					<!-- 营销费用经营管控-事业部项目部营销费用投产情况-毛利率-营销费用占比 -->
					<div :class="{'red_color':scope.row[item.row_field_name] < 20}" :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="item.type == '99'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null?item.unit:''}}</div>
					<!-- 营销费用经营管控-店铺营销费用投产情况-毛利率-营销费用占比 -->
					<div :class="{'red_color':(item.row_field_name == 'mlv_rate' && scope.row[item.row_field_name] < 20) || (item.row_field_name == 'yx_rate' && ((scope.row.platform == '淘宝' && scope.row[item.row_field_name] > 15) || (scope.row.platform == '天猫' && scope.row[item.row_field_name] > 20)))}" :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="item.type == '98'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null?item.unit:''}}</div>
					<!-- 进度条 -->
					<div :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="item.type == '1'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null?item.unit:''}}</div>
					<!-- 正负颜色 -->
					<div :class="[{'red_color':scope.row[item.row_field_name] >= 0},{'green_color':scope.row[item.row_field_name] < 0}]" v-else-if="item.type == '2'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null&&scope.row[item.row_field_name] !== ''?item.unit:''}}</div>
					<!-- 图片 -->
					<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-else-if="item.type == '3' && scope.row.images[0] != ''"></el-image>
					<!-- 链接 -->
					<el-button type="text" v-else-if="item.type == '4'" @click="$emit('tableCallBack',scope.row[fieldName],tableName)">{{scope.row[item.row_field_name]}}{{item.unit}}</el-button>
					<!-- 图表 -->
					<div class="chart" v-else-if="item.type == '8'" :id="`${item.row_field_name}-${scope.row.id}`"></div>
					<!-- 普通文字 -->
					<div class="table_header_text" v-else>{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null&&scope.row[item.row_field_name] !== ''?item.unit:''}}</div>
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
	</div>
</template>
<script>
	export default{
		data(){
			return{
				commonClass:"",				//动态类名
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
				default:true
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
			//总计行数据
			table_total_data:{
				type:Object,
				default:()=>{}
			},
			//是否自定义排序
			is_custom_sort:{
				type:Boolean,
				default:true
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
			//排序拼接类型(true:数字；false：字母)
			sort_num:{
				type:Boolean,
				default:true
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
					this.show_chart_filed = [];
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
		mounted(){
			this.commonClass = `table_${this.tableName}`;
			//如果显示总计行，将总计行置于第一行
			if(this.total_row){
				this.$nextTick(() => {
					this.showSummariesPosition();
				})
			}
		},
		methods:{
			//如果显示总计行，将总计行置于第一行
			showSummariesPosition() {
				this.$nextTick(() => {
    			const table = document.querySelector(`.table_${this.tableName}`)
				const footer = document.querySelector(
					`.table_${this.tableName} .el-table__footer-wrapper`
					)
				const body = document.querySelector(
					`.table_${this.tableName} .el-table__body-wrapper`
					)
      			table.removeChild(footer) // 移除表格最下方的合计行
      			table.insertBefore(footer, body) // 把合计行插入到表格body的上面
      		})
      		},
			//排序
			sortChange({ column, prop, order }) {  
				let sort = "";
				if(order){
					sort = prop + '-' + (order == 'ascending'?`${this.sort_num?'1':'asc'}`:`${this.sort_num?'0':'desc'}`);
				} else{
					sort = "";
				}   
				this.$emit('sortCallBack',sort);
			},
			sortableFn(bool){
				if(bool){
					if(this.is_custom_sort){
						return true;
					}else{
						return 'custom';
					}
				}else{
					return false;
				}
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
			getSummaries({ columns, data }) {
				const sums = [];
				columns.forEach((column, index) => {
					sums[index] = this.table_total_data[column.property];
					if(sums[index]){
						sums[index] += this.getUnit(column.property);
					}
				});
				return sums;
			},
			//找到总计行单位
			getUnit(fieldName){
				let new_title_list = [];
				this.title_list.map(item => {
					if(!item.list){
						new_title_list.push(item);
					}else{
						new_title_list.push(item);
						new_title_list = [...new_title_list,...item.list]
					}
				})
				let arr = new_title_list.filter(item => {
					return item.row_field_name == fieldName;
				})
				return arr.length > 0?arr[0].unit:'';
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
					grid:{
						bottom:'10px',
						top:'10px',
						left:'5px',
						right:'5px',
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
<style type="text/css">
.customTable .el-table__fixed-body-wrapper {
	top: 129px !important;
}
.customTable .el-table__fixed-footer-wrapper {
	z-index: 0;
	top: 94px !important;
}
</style>
<style lang="less" scoped>

.prop_text{
	white-space: pre-wrap;
}
.chart{
	width: 150px;
	height: 80px;
}
.red_color{
	color: red;
}
.green_color{
	color: green;
}
</style>