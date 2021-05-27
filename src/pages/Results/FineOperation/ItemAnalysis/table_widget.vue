<template>
	<div>
		<div class="table_setting">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="exportFun">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_data" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" :cell-style="columnStyle" max-height='600' :summary-method="getSummaries"
		show-summary>
		<el-table-column :label="item.row_name" :prop="item.row_field_name" width="160" v-for="item in title_list" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip :fixed="zbhzFixed(item.row_field_name)">
			<template slot-scope="scope">
				<!-- 占比 -->
				<div class="background_box" :style="{width:`${item.max_value == 0?0:(160/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:`${item.color}`}" v-if="item.type == 1 && scope.row.is_total != 1">{{scope.row[item.row_field_name]}}{{item.unit}}</div>
				<!-- 正负颜色 -->
				<div class="red_color" :class="{'green_color':scope.row[item.row_field_name] < 0}" v-else-if="item.type == 2">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ""?item.unit:''}}</div>
				<!-- 普通文字 -->
				<div :class="{'is_total':item.row_field_name == 'spid'}" v-else>{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ""?item.unit:''}}</div>
			</template>
		</el-table-column>
	</el-table>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
}
.background_box{
	padding-left: 3px;
	white-space:nowrap;
	height: 28px;
	display:flex;
	align-items: center;
}
.is_total{
	color: #8D5714;
}
.red_color{
	color: red;
}
.green_color{
	color:#5AD8A6;
}
.el-table__footer-wrapper{
	color: red;
}
</style>
<script>
	import {exportExcel} from '../../../../api/export.js'
	export default{
		props:{
			page_type:{
				type:String,
				default:""
			},
			table_data:{
				type:Array,
				default:[]
			},
			selected_ids:{
				type:Array,
				default:[]
			},
			title_list:{
				type:Array,
				default:[]
			},
			view_row:{
				type:Array,
				default:[]
			},
			total_data:{
				type:Array,
				default:[]
			}
		},
		methods:{
			//周末行的样式
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(row.week == '周六' || row.week == '周日'){
					return 'background:#FFF7DA';
				}
			},
			//固定列
			zbhzFixed(row_field_name){
				if(row_field_name == 'tjrq'){
					return true;
				}
			},
			//总计行
			getSummaries(){
				return this.total_data
			},
			//自定义
			customFun(){
				this.$emit('customBack',this.page_type);
			},
			//导出
			exportFun(){
				var data_obj = {
					table_title:"每日业绩报告",
					table_title_list:[],
					field_name_list:[],
					data_list:this.table_data
				};
				var total_obj = {};
				this.title_list.map((item,i) => {
					data_obj.field_name_list.push(item.row_field_name);
					data_obj.table_title_list.push(item.row_name);
					total_obj[item.row_field_name] = this.total_data[i];
				})
				data_obj.data_list.push(total_obj);
				switch(this.page_type){
					case 'overall_data':
					data_obj.table_title = "整体数据报表";
					break;
					case 'search_data':
					data_obj.table_title = "搜索系列报表";
					break;
					case 'ztc_data':
					data_obj.table_title = "直通车系列报表";
					break;
					case 'cjtj_data':
					data_obj.table_title = "超级推荐系列报表";
					break;
					default:
					return "";
				}
				exportExcel(data_obj);
			},
		}
	}
</script>







