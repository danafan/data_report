<template>
	<div>
		<div class="table_setting">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="exportFun" v-if="is_export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_data" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" :cell-style="columnStyle" max-height='600' :summary-method="getSummaries"
		show-summary>
		<el-table-column :prop="item.row_field_name" :width="item.row_field_name == 'tjrq'?90:80" v-for="item in title_list" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip :fixed="zbhzFixed(item.row_field_name)">
			<template slot="header" slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
					<div class="pre-line">{{item.row_name}}</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<!-- 占比 -->
				<div class="background_box" :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:`${item.color}`}" v-if="item.type == 1 && scope.row.is_total != 1">{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{item.unit}}</div>
				<!-- 正负颜色 -->
				<div class="red_color" :class="{'green_color':scope.row[item.row_field_name] < 0}" v-else-if="item.type == 2">{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ""?item.unit:''}}</div>
				<!-- 普通文字 -->
				<div :class="{'is_total':item.row_field_name == 'spid'}" v-else>{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ""?item.unit:''}}</div>
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
.text_content{
	overflow: hidden;/*超出部分隐藏*/
	white-space: nowrap;/*不换行*/
	text-overflow:ellipsis;/*超出部分文字以...显示*/
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
	import resource from '../../../../api/resource.js'
	import {exportExcel} from '../../../../api/export.js'
	export default{
		props:{
			page_type:{
				type:String,
				default:""
			},
			is_export:{
				type:Number,
				default:1
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
			getQianNumber(number) {
				const num = String(number)
				const reg = /\d{1,3}(?=(\d{3})+$)/g
				const res = num.replace(/^(-?)(\d+)((\.\d+)?)$/, function(match, s1, s2, s3){
					return s1 + s2.replace(reg, '$&,') + s3
				})
				return res
			},
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
					data_list:[]
				};
				var total_obj = {};
				this.title_list.map((item,i) => {
					data_obj.field_name_list.push(item.row_field_name);
					data_obj.table_title_list.push(item.row_name);
					total_obj[item.row_field_name] = this.total_data[i];
				})
				data_obj.data_list = [...this.table_data,...[total_obj]];
				switch(this.page_type){
					case 'overall_data':
					data_obj.table_title = "整体数据报表";
					resource.ztExport().then(res => {
						if(res.data.code == 1){
							exportExcel(data_obj);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					break;
					case 'search_data':
					data_obj.table_title = "搜索系列报表";
					resource.searchExport().then(res => {
						if(res.data.code == 1){
							exportExcel(data_obj);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					break;
					case 'ztc_data':
					data_obj.table_title = "直通车系列报表";
					resource.ztcExport().then(res => {
						if(res.data.code == 1){
							exportExcel(data_obj);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					break;
					case 'cjtj_data':
					data_obj.table_title = "超级推荐系列报表";
					resource.cjtjExport().then(res => {
						if(res.data.code == 1){
							exportExcel(data_obj);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					break;
					default:
					return "";
				}
			},
		}
	}
</script>







