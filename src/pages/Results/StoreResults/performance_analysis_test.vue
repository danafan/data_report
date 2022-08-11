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
		<el-card class="module_item" v-loading="loading">
			<div class="title">销售收入预估
				<el-tooltip class="item" effect="dark" :content="xssryg.remark" placement="top-start">
					<i class="el-icon-warning" style="color: #FFE58F"></i>
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
		<el-card class="module_item" v-loading="loading">
			<div class="title">营销费用预估
				<el-tooltip class="item" effect="dark" :content="yxfyyg.remark" placement="top-start">
					<i class="el-icon-warning" style="color: #FFE58F"></i>
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
		<el-card class="module_item" v-loading="loading">
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
		<el-card class="module_item" v-loading="loading">
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
		<el-card class="module_item" v-loading="loading">
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
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_custom = true">店铺自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="Export" v-if="button_list.export == '1'">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<!-- 表格 -->
	<div class="table_container" v-loading="loading">
		<div class="table_header">
			<div class="header_item" v-for="(item,index) in label_list" :key="index" @mouseenter="CheckShow(index)" @mouseleave="CheckShow(index)">
				<div class="label_title">{{item.row_name}}
					<el-tooltip class="item" effect="dark" :content="item.remark" placement="top-start" v-if="item.remark != ''">
						<i class="el-icon-warning" style="color: #FFE58F"></i>
					</el-tooltip>
				</div>
				<div v-show="item.show_sort">
					<img class="sort-icon" v-if="item.sort == 0" src="../../../static/sort_icon.png" @click="SortFun(2,index)">
					<img class="sort-icon" v-if="item.sort == 1" src="../../../static/sort_up.png" @click="SortFun(0,index)">
					<img class="sort-icon" v-if="item.sort == 2" src="../../../static/sort_down.png" @click="SortFun(1,index)">
				</div>
			</div>
		</div>
		<div class="column_item column_item_odd" v-if="data_list.length > 1">
			<div class="column_item_text" v-for="i in total_shop_data">
				<div class='total_text'>{{i}}</div>
			</div>
		</div>
		<div class="table_list">
			<div class="column_item" :class="{'column_item_odd':index%2 == 1}" v-for="(item,index) in data_list" :key="index">
				<div class="column_item_text" :class="[{'toast_red':i.id == 5 || i.id == 17},{'toast_yellow':i.id == 6 || i.id == 10 || i.id == 18}]" v-for="i in item">
					<el-tooltip effect="dark" :content="i.val.toString()" placement="top" v-if="i.id == 1 || i.id == 183">
						<el-button type="text" class="tooltip_but">{{i.val}}</el-button>
					</el-tooltip>
					<div class='tab_text' v-else>{{i.val}}</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 没有数据 -->
	<div class="data_null" v-if="data_list.length == 0 && loading == false">暂无数据</div>
	<el-dialog title="店铺自定义列表（单机取消列表名保存直接修改）" :visible.sync="show_custom">
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
	<div style="margin-top: 30px;margin-bottom: 10px;font-size: 22;font-weight: bold">营销周报</div>
	<!-- 营销周报 -->
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_week_custom = true">店铺自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="ExportWeek" v-if="button_list.week_export == '1'">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<!-- 表格 -->
	<div class="table_container" v-loading="loading">
		<div class="table_header">
			<div class="header_item" v-for="(item,index) in week_label_list" :key="index" @mouseenter="CheckWeekShow(index)" @mouseleave="CheckWeekShow(index)">
				<div class="label_title">{{item.row_name}}
					<el-tooltip class="item" effect="dark" :content="item.remark" placement="top-start" v-if="item.remark != ''">
						<i class="el-icon-warning" style="color: #FFE58F"></i>
					</el-tooltip>
				</div>
				<div v-show="item.show_sort">
					<img class="sort-icon" v-if="item.sort == 0" src="../../../static/sort_icon.png" @click="SortWeekFun(2,index)">
					<img class="sort-icon" v-if="item.sort == 1" src="../../../static/sort_up.png" @click="SortWeekFun(0,index)">
					<img class="sort-icon" v-if="item.sort == 2" src="../../../static/sort_down.png" @click="SortWeekFun(1,index)">
				</div>
			</div>
		</div>
		<div class="column_item column_item_odd" v-if="week_data_list.length > 1">
			<div class="column_item_text" v-for="i in total_week_data">
				<div class='total_text'>{{i}}</div>
			</div>
		</div>
		<div class="table_list">
			<div class="column_item" :class="{'column_item_odd':index%2 == 1}" v-for="(item,index) in week_data_list" :key="index">
				<div class="column_item_text" v-for="i in item">
					<el-tooltip effect="dark" :content="i.val.toString()" placement="top" v-if="i.id == 170 || i.id == 171">
						<el-button type="text" class="tooltip_but">{{i.val}}</el-button>
					</el-tooltip>
					<div class='tab_text' v-else>{{i.val}}</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 没有数据 -->
	<div class="data_null" v-if="week_data_list.length == 0 && loading == false">暂无数据</div>
	<el-dialog title="店铺自定义列表（单机取消列表名保存直接修改）" :visible.sync="show_week_custom">
		<div class="select_box">
			<el-checkbox-group v-model="selected_week_ids">
				<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_week_row">{{item.row_name}}</el-checkbox>
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
	justify-content: space-between;
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
	display: flex;
	justify-content: space-between;
}
// 表格
.table_container{
	margin-top: 5px;
	width: 100%;
	display: flex;
	font-size:14px;
	.table_header{
		border-top:1px solid #fff;
		border-right:1px solid #D9D9D9;
		.header_item{
			border-bottom:1px solid #fff;
			height: 37px;
			line-height: 37px;
			color: #333333;
			font-weight: 600;
			position: relative;
			padding-right:40px;
			.sort-icon{
				position: absolute;
				top: 10px;
				right: 5px;
				width:16px;
				height: 16px;
			}
		}
	}
	.column_item{
		border-top:1px solid #D9D9D9;
		background: #EFF1FA;
		.column_item_text{
			border-bottom:1px solid #D9D9D9;
			width:100px;
			padding-left: 5px;
			padding-right:5px;
			.tooltip_but{
				width:100%;
				height: 36px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				color: #333333;
				overflow: hidden !important;
				text-overflow: ellipsis !important;
				display: -webkit-box !important;
				-webkit-line-clamp: 1 !important;
				-webkit-box-orient: vertical !important;
			}
			.total_text{
				font-weight: bold;
				color: #FF993C;
				width:100%;
				text-align: center;
				height: 36px;
				line-height: 36px;
			}
			.tab_text{
				width:100%;
				text-align: center;
				height: 36px;
				line-height: 36px;
			}
		}
		.toast_red{
			background:#FFA39E;
		}
		.toast_yellow{
			background:#FFE58F;
		}
	}
	.column_item_odd{
		background: #F8F8F8;
	}
	.table_list{
		flex:1;
		display: flex;
		overflow-x: scroll;
	}
}
//暂无数据
.data_null{
	margin-top: 20px;
	border:1px solid #D9D9D9;
	width:100%;
	text-align: center;
	height: 80px;
	line-height: 80px;
	font-size:18px;
	color: #D9D9D9;
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
				company_list:[],					//公司列表
				company:[],							//选中的公司
				xssryg:{},							//销售收入预估
				yxfyyg:{},							//营销费用预估
				ygz_gxmy:{},						//预估值-贡献毛益
				ygz_gxmyl:{},						//预估值-贡献毛益率
				jlryg:{},							//净利润预估
				label_list:[],						//表格数据（左侧表头）
				shop_table_list_data:[],			//表格数据（原始）
				total_shop_data:[],					//总计
				total_list:[],						//导出用
				data_list:[],						//表格数据（更新后）
				default_data_list:[],				//表格数据（默认排序用）
				view_row:[],						//自定义列的内容
				selected_ids:[],					//选中的自定义列的id
				show_custom:false,					//是否显示自定义弹框
				button_list:{},						//按钮权限
				week_label_list:[],					//表格数据（营销周报，左侧表头）
				week_table_list_data:[],			//表格数据（原始）
				week_data_list:[],					//表格数据（后面内容）
				default_week_data_list:[],			//表格数据（营销周报，默认排序用）
				total_week_data:[],					//总计
				week_total_list:[],					//总计（导出用）
				view_week_row:[],					//自定义列的内容(营销周报)
				selected_week_ids:[],				//选中的自定义列的id(营销周报)
				show_week_custom:false,				//营销周报是否显示自定义弹框
				loading:false
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
				let table_list = JSON.parse(JSON.stringify(this.shop_table_list_data));
				let total_list = JSON.parse(JSON.stringify(this.total_list));
				let data_list = [...table_list,...total_list];
				
				data_list.map(item => {
					this.label_list.map(i => {
						item[i.row_field_name] += i.unit;
					})
				});
				var data_obj = {
					table_title:"业绩分析报告",
					table_title_list:[],
					field_name_list:[],
					data_list:table_list.length > 1?data_list:table_list
				};
				this.label_list.map(item => {
					data_obj.table_title_list.push(item.row_name);
					data_obj.field_name_list.push(item.row_field_name);
				})
				exportExcel(data_obj);
			},
			//营销周报导出
			ExportWeek(){
				// 加单位
				let table_list = JSON.parse(JSON.stringify(this.week_table_list_data));
				let total_list = JSON.parse(JSON.stringify(this.week_total_list));
				let data_list = [...table_list,...total_list];
				data_list.map(item => {
					this.week_label_list.map(i => {
						item[i.row_field_name] += i.unit;
					})
				});
				var data_obj = {
					table_title:"营销周报报告",
					table_title_list:[],
					field_name_list:[],
					data_list:table_list.length > 1?data_list:table_list
				};
				this.week_label_list.map(item => {
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
			//自定义列
			setColumns(menu_id){
				var row_ids = [];
				if(menu_id == '2'){
					row_ids = this.selected_ids.join(',')
				}else if(menu_id == '1'){
					row_ids = this.selected_week_ids.join(',')
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
				this.loading = true;
				resource.performanceReport(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.show_null = true;
						let data = res.data.data;
						this.button_list = data.button_list;
						// 顶部几块
						this.xssryg = data.top.xssryg;
						this.yxfyyg = data.top.yxfyyg;
						this.ygz_gxmy = data.top.ygz_gxmy;
						this.ygz_gxmyl = data.top.ygz_gxmyl;
						this.jlryg = data.top.jlryg;		
						//左侧表头
						data.table_list.title_list.map(item => {
							item.show_sort = false;		//是否显示排序标签
							item.sort = 0;				//默认排序
						})
						this.label_list = data.table_list.title_list;
						//表格数据
						this.shop_table_list_data = data.table_list.list;	//原始
						this.clTableData(this.shop_table_list_data);
						this.default_data_list = this.data_list;
						this.total_shop_data = data.table_list.total;
						this.total_list[0] = data.table_list.total_list;
						this.view_row = data.table_list.view_row;
						this.selected_ids = data.table_list.selected_ids;
						
						// 营销周报部分
						// 左侧表头
						data.week_table_list.title_list.map(item => {
							item.show_sort = false;		//是否显示排序标签
							item.sort = 0;				//默认排序
						})
						this.week_label_list = data.week_table_list.title_list;
						//表格数据
						this.week_table_list_data = data.week_table_list.list;	//原始
						this.clTableWeekData(this.week_table_list_data);
						this.default_week_data_list = this.week_data_list;
						this.total_week_data = data.week_table_list.total;
						this.week_total_list[0] = data.week_table_list.total_list;
						this.view_week_row = data.week_table_list.view_row;
						this.selected_week_ids = data.week_table_list.selected_ids;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换是否显示(业绩分析)
			CheckShow(index){
				this.label_list[index].show_sort = !this.label_list[index].show_sort;
			},
			//切换是否显示(营销周报)
			CheckWeekShow(index){
				this.week_label_list[index].show_sort = !this.week_label_list[index].show_sort;
			},
			// 排序(业绩分析)
			SortFun(sort,index){
				this.label_list.map((item,i) => {
					if(i == index){
						item.sort = sort;
					}else{
						item.sort = 0;
					}
				})
				if(sort == 0){
					this.clTableData(this.shop_table_list_data);
				}else{
					this.Compare(sort,this.label_list[index].row_field_name,this.shop_table_list_data,'1')
				}
			},
			// 排序(营销周报)
			SortWeekFun(sort,index){
				this.week_label_list.map((item,i) => {
					if(i == index){
						item.sort = sort;
					}else{
						item.sort = 0;
					}
				})
				if(sort == 0){
					this.clTableWeekData(this.week_table_list_data);
				}else{
					this.Compare(sort,this.week_label_list[index].row_field_name,this.week_table_list_data,'2')
				}
			},
			// 排序
			Compare(sort,k,table_data,type){
				let ss = JSON.parse(JSON.stringify(table_data));
				ss.sort((a, b) => {
					if(sort == 1){
						return a[k] - b[k];
					}else if(sort == 2){
						return b[k] - a[k];
					}
				});
				if(type == '1'){
					this.clTableData(ss);
				}else{
					this.clTableWeekData(ss);
				}
				
			},
			//处理上面表格的数据
			clTableData(table_data){
				var ss = JSON.parse(JSON.stringify(table_data));
				this.data_list = [];
				ss.map(item => {
					var item_values = Object.values(item);
					var arr = [];
					item_values.map((i,id) => {
						let oo = {
							id:this.label_list[id].row_id,
							val:i + this.label_list[id].unit
						}
						arr.push(oo);
					})
					this.data_list.push(arr)
				});
			},
			//处理下面面表格的数据
			clTableWeekData(table_data){
				var ss = JSON.parse(JSON.stringify(table_data));
				this.week_data_list = [];
				ss.map(item => {
					var item_values_week = Object.values(item);
					var arr_week = [];
					item_values_week.map((i,id) => {
						let oo = {
							id:this.week_label_list[id].row_id,
							val:i + this.week_label_list[id].unit
						}
						arr_week.push(oo);
					})
					this.week_data_list.push(arr_week)
				});	
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
				this.selected_week_ids = [];
				this.view_week_row.map(item => {
					this.selected_week_ids.push(item.row_id)
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