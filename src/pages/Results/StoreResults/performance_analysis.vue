<template>
	<div>
		<dps @callBack="checkReq"></dps>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="公司：">
				<el-select v-model="company" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in company_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="发货日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="daterange"
				:clearable="false"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-checkbox v-model="is_assessment" true-label="1" false-label="0" border size="small">考核店铺</el-checkbox>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="GetData">搜索</el-button>
		</el-form-item>
	</el-form>
	<!-- 数据模块 -->
	<div class="data_module">
		<el-card class="module_item">
			<div class="title">销售收入预估
				<el-tooltip class="item" effect="dark" :content="xssryg.remark" placement="top-start">
					<i class="el-icon-warning" style="color: #FFE58F" v-if="xssryg.remark != ''"></i>
				</el-tooltip>
			</div>
			<div class="value">{{xssryg.xssryg}}万</div>
			<div class="content_row">
				<div class="label">销售收入月目标</div>
				<div class="content_val">{{xssryg.xssrymb}}万</div>
			</div>
			<div class="content_row">
				<div class="label">月度完成率</div>
				<div class="content_val">{{xssryg.ydwcl}}%</div>
			</div>
			<div class="content_row">
				<div class="label">日累计-销售收入</div>
				<div class="content_val">{{xssryg.rlj_xssr}}万</div>
			</div>
			<div class="content_row">
				<div class="label">周期内完成率</div>
				<div class="content_val">{{xssryg.zqnwcl}}%</div>
			</div>
		</el-card>
		<el-card class="module_item">
			<div class="title">营销费用预估
				<el-tooltip class="item" effect="dark" :content="yxfyyg.remark" placement="top-start">
					<i class="el-icon-warning" style="color: #FFE58F" v-if="yxfyyg.remark != ''"></i>
				</el-tooltip>
			</div>
			<div class="value">{{yxfyyg.yxfyyg}}万</div>
			<div class="content_row">
				<div class="label">营销费用月目标</div>
				<div class="content_val">{{yxfyyg.yxfyymb}}万</div>
			</div>
			<div class="content_row">
				<div class="label">月度使用率</div>
				<div class="content_val">{{yxfyyg.ydsyl}}%</div>
			</div>
			<div class="content_row">
				<div class="label">日累计-营销费用</div>
				<div class="content_val">{{yxfyyg.rlj_yxfy}}万</div>
			</div>
			<div class="content_row">
				<div class="label">周期内使用率</div>
				<div class="content_val">{{yxfyyg.zqnsyl}}%</div>
			</div>
		</el-card>
		<el-card class="module_item">
			<div class="title">预估值-贡献毛益</div>
			<div class="value">{{ygz_gxmy.ygz_gxmy}}万</div>
			<div class="content_row">
				<div class="label">贡献毛益月目标</div>
				<div class="content_val">{{ygz_gxmy.gxmyymb}}万</div>
			</div>
			<div class="content_row">
				<div class="label">月度完成率</div>
				<div class="content_val">{{ygz_gxmy.ydwcl}}%</div>
			</div>
			<div class="content_row">
				<div class="label">日累积-贡献毛益</div>
				<div class="content_val">{{ygz_gxmy.rlj_gxmy}}万</div>
			</div>
			<div class="content_row">
				<div class="label">周期内完成率</div>
				<div class="content_val">{{ygz_gxmy.zqnwcl}}%</div>
			</div>
		</el-card>
		<el-card class="module_item">
			<div class="title">预估值-贡献毛益率</div>
			<div class="value">{{ygz_gxmyl.gxmylyg}}%</div>
			<div class="content_row">
				<div class="label">贡献毛益率月目标</div>
				<div class="content_val">{{ygz_gxmyl.ymb_gxmyl}}%</div>
			</div>
			<div class="content_row">
				<div class="label">日累积-贡献毛益率</div>
				<div class="content_val">{{ygz_gxmyl.rlj_gxmyl}}%</div>
			</div>
		</el-card>
		<el-card class="module_item">
			<div class="title">净利润预估
				<el-tooltip class="item" effect="dark" :content="jlryg.remark" placement="top-start">
					<i class="el-icon-warning" style="color: #FFE58F" v-if="jlryg.remark != ''"></i>
				</el-tooltip>
			</div>
			<div class="value">{{jlryg.jlryg}}万</div>
			<div class="content_row">
				<div class="label">净利润率</div>
				<div class="content_val">{{jlryg.jlrl}}%</div>
			</div>
		</el-card>
	</div>
	<!-- 上面表格 -->
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_custom = true">店铺自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="Export" v-if="button_list.export == '1'">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<el-table :data="data_list" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :summary-method="getSummaries" show-summary :cell-style="columnStyle">
		<el-table-column :label="item.row_name" :prop="item.row_field_name" v-for="item in title_list" :sortable="item.is_sort == 1" show-overflow-tooltip :render-header="renderHeader" :fixed="item.is_fixed == 1">
			<template slot-scope="scope">
				<div class="text_content">{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{item.unit}}</div>
			</template>
		</el-table-column>
	</el-table>
	<el-dialog title="店铺自定义列表（单击取消列表名保存直接修改）" :visible.sync="show_custom">
		<div class="select_box">
			<el-checkbox-group v-model="selected_ids">
				<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="Restore">恢复默认</el-button>
			<el-button size="small" @click="Restore('is_close')">取消</el-button>
			<el-button size="small" type="primary" @click="setColumns('2')">保存</el-button>
		</div>
	</el-dialog>
	<!-- 营销周报 -->
	<div style="margin-top: 30px;margin-bottom: 10px;font-size: 22;font-weight: bold">营销周报</div>
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_week_custom = true">店铺自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="ExportWeek" v-if="button_list.week_export == '1'">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<!-- 表格 -->
	<el-table :data="week_data_list" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :summary-method="getWeekSummaries" show-summary>
		<el-table-column :label="item.row_name" :prop="item.row_field_name" v-for="item in week_title_list" :sortable="item.is_sort == 1" show-overflow-tooltip :render-header="renderHeader" :fixed="item.is_fixed == 1">
			<template slot-scope="scope">
				<div class="text_content">{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{item.unit}}</div>
			</template>
		</el-table-column>
	</el-table>
	<el-dialog title="店铺自定义列表（单击取消列表名保存直接修改）" :visible.sync="show_week_custom">
		<div class="select_box">
			<el-checkbox-group v-model="week_selected_ids">
				<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in week_view_row">{{item.row_name}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="RestoreWeek">恢复默认</el-button>
			<el-button size="small" @click="RestoreWeek('is_close')">取消</el-button>
			<el-button size="small" type="primary" @click="setColumns('1')">保存</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
// 数据模块
.data_module{
	margin-bottom: 20px;
	width: 100%;
	display: flex;
	justify-content: space-around;
	.module_item{
		width: 262px;
		.title{
			margin-bottom: 5px;
			font-size: 18px;
			color: #333333;
		}
		.value{
			margin-bottom: 5px;
			font-size:24px;
			color: #FF993C;
		}
		.content_row{
			margin-bottom: 5px;
			display: flex;
			.label{
				width: 130px;
				font-size:14px;
				color: #333333;
			}
			.content_val{
				font-size:16px;
				color: #FF993C;
			}
		}
	}
}
.table_setting{
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
}
.text_content{
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportExcel} from '../../../api/export.js'
	import dps from '../../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 								//时间区间
				date:[getMonthStartDate(),getCurrentDate()],//发货时间
				start_time:getMonthStartDate(),		//开始时间
				end_time:getCurrentDate(),			//结束时间
				is_assessment:'0',					//是否考核店铺
				select_department_ids:[],			//选中的部门id列表
				select_plat_ids:[],					//选中的平台列表
				select_store_ids:[],				//选中的店铺id列表
				xssryg:{},							//销售收入预估
				yxfyyg:{},							//营销费用预估
				ygz_gxmy:{},						//预估值-贡献毛益
				ygz_gxmyl:{},						//预估值-贡献毛益率
				jlryg:{},							//净利润预估
				button_list:{},						//按钮权限
				title_list:[],						//表头
				data_list:[],						//表格数据
				total:[],							//总计
				total_list:[],						//总计（用于导出）
				view_row:[],						//自定义列的内容
				selected_ids:[],					//选中的自定义列的id
				show_custom:false,					//是否显示自定义弹框
				week_title_list:[],					//表头
				week_data_list:[],					//表格数据
				week_total:[],						//总计
				week_total_list:[],					//总计（用于导出）
				week_view_row:[],					//自定义列的内容
				week_selected_ids:[],				//选中的自定义列的id
				show_week_custom:false,				//营销周报是否显示自定义弹框
				company_list:[],					//公司列表
				company:[],					//选中的公司
			}
		},
		created(){
			//公司列表
			this.ajaxCompany();
			//获取信息
			this.GetData();
		},
		watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
		},
		methods:{
			//顶部悬浮
			renderHeader(h, data) {
				return h("span", [
					h(
						"el-tooltip",
						{
							attrs: {
								class: "item",
								effect: "dark",
								content: data.column.label,
								placement: "top",
							},
						},
						[h("span", data.column.label)]
						),
					]);
			},
			//千分位展示
			getQianNumber(number) {
				const num = String(number)
				const reg = /\d{1,3}(?=(\d{3})+$)/g
				const res = num.replace(/^(-?)(\d+)((\.\d+)?)$/, function(match, s1, s2, s3){
					return s1 + s2.replace(reg, '$&,') + s3
				})
				return res
			},
			//第一个表格总计行
			getSummaries(param) {
				return this.total;
			},
			//第二个表格总计行
			getWeekSummaries(param) {
				return this.week_total;
			},
			//第一个表格列颜色
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(column.property == 'rmb_xssrwcl' || column.property == 'ygyxfyl' || column.property == 'rmb_gxmywcl'){
					return 'background: #FFE58F';
				}else if(column.property == 'ymb_xssrwcl' || column.property == 'ymb_gxmywcl'){
					return 'background: #FFA39E';
				}
			},
			//公司列表
			ajaxCompany(){
				resource.ajaxCompany().then(res => {
					if(res.data.code == 1){
						this.company_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			Export(){
				// 加单位
				let table_list = JSON.parse(JSON.stringify(this.data_list));
				let total_list = JSON.parse(JSON.stringify(this.total_list));
				let data_list = [...table_list,...total_list];
				data_list.map(item => {
					this.title_list.map(i => {
						item[i.row_field_name] += i.unit;
					})
				});
				var data_obj = {
					table_title:"业绩分析报告",
					table_title_list:[],
					field_name_list:[],
					data_list:table_list.length > 1?data_list:table_list
				};
				this.title_list.map(item => {
					data_obj.table_title_list.push(item.row_name);
					data_obj.field_name_list.push(item.row_field_name);
				})
				exportExcel(data_obj);
			},
			//营销周报导出
			ExportWeek(){
				// 加单位
				let table_list = JSON.parse(JSON.stringify(this.week_data_list));
				let total_list = JSON.parse(JSON.stringify(this.week_total_list));
				let data_list = [...table_list,...total_list];
				data_list.map(item => {
					this.week_title_list.map(i => {
						item[i.row_field_name] += i.unit;
					})
				});
				var data_obj = {
					table_title:"营销周报报告",
					table_title_list:[],
					field_name_list:[],
					data_list:table_list.length > 1?data_list:table_list
				};
				this.week_title_list.map(item => {
					data_obj.table_title_list.push(item.row_name);
					data_obj.field_name_list.push(item.row_field_name);
				})
				exportExcel(data_obj);
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//获取信息
			GetData(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment,
					company:this.company.join(',')
				}
				resource.performanceReport(req).then(res => {
					if(res.data.code == 1){
						//按钮权限
						this.button_list = res.data.data.button_list;
						//顶部几个模块
						let top_data = res.data.data.top;
						this.xssryg = top_data.xssryg;		//销售收入预估
						this.yxfyyg = top_data.yxfyyg;		//营销费用预估
						this.ygz_gxmy = top_data.ygz_gxmy;	//预估值-贡献毛益
						this.ygz_gxmyl = top_data.ygz_gxmyl;//预估值-贡献毛益率
						this.jlryg = top_data.jlryg;		//净利润预估
						//第一个表格
						let table_list_data = res.data.data.table_list;
						this.title_list = table_list_data.title_list;
						this.data_list = table_list_data.list;
						this.total = table_list_data.total;
						this.total_list[0] = table_list_data.total_list;
						this.view_row = table_list_data.view_row;
						this.selected_ids = table_list_data.selected_ids;
						//第二个表格
						let week_table_list_data = res.data.data.week_table_list;
						this.week_title_list = week_table_list_data.title_list;
						this.week_data_list = week_table_list_data.list;
						this.week_total = week_table_list_data.total;
						this.week_total_list[0] = week_table_list_data.total_list;
						this.week_view_row = week_table_list_data.view_row;
						this.week_selected_ids = week_table_list_data.selected_ids;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//自定义列
			setColumns(menu_id){
				var row_ids = [];
				if(menu_id == '2'){
					row_ids = this.selected_ids.join(',')
				}else if(menu_id == '1'){
					row_ids = this.week_selected_ids.join(',')
				}
				resource.setColumns({menu_id:menu_id,row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.show_week_custom = false;
						//获取列表
						this.GetData();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//切换是否显示(业绩分析)
			CheckShow(index){
				this.label_list[index].show_sort = !this.label_list[index].show_sort;
			},
			//切换是否显示(营销周报)
			CheckWeekShow(index){
				this.week_label_list[index].show_sort = !this.week_label_list[index].show_sort;
			},
			//恢复默认
			Restore(type){
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
				if(type == 'is_close'){
					this.show_custom = false;
				}
			},
			//恢复默认(营销周报)
			RestoreWeek(type){
				this.week_selected_ids = [];
				this.week_view_row.map(item => {
					this.week_selected_ids.push(item.row_id)
				})
				if(type == 'is_close'){
					this.show_week_custom = false;
				}
			},
			
		},
		components:{
			dps
		}
	}
</script>