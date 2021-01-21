<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="datetimerange"
				value-format="yyyy-MM-dd HH:mm:ss"
				:picker-options="pickerOptions"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:default-time="['00:00:00', '23:59:59']"
				>
			</el-date-picker>
		</el-form-item>
		<el-form-item label="项目部:" style="margin-right: 20px">
			<el-select v-model="select_department_ids" @change="ChangeDept" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="店铺:">
			<el-select v-model="select_store_ids" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="GetData">搜索</el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="info" @click="ClearReq">清空</el-button>
		</el-form-item>
	</el-form>
	<!-- 数据模块 -->
	<div class="data_module">
		<el-card class="module_item">
			<div class="title">销售收入预估</div>
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
			<div class="title">营销费用预估</div>
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
			<div class="value">{{ygz_gxmy.rlj_gxmy}}万</div>
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
			<div class="value">{{ygz_gxmyl.rlj_gxmyl}}%</div>
			<div class="content_row">
				<div class="label">贡献毛益率月目标</div>
				<div class="content_val">{{ygz_gxmyl.gxmylyg}}%</div>
			</div>
			<div class="content_row">
				<div class="label">日累积-贡献毛益率</div>
				<div class="content_val">{{ygz_gxmyl.rlj_gxmyl}}%</div>
			</div>
		</el-card>
	</div>
	<el-button type="primary" size="small">店铺自定义列表</el-button>
	<!-- 表格 -->
	<div class="table_container">
		<div class="table_header">
			<div class="header_item" v-for="(item,index) in label_list" @mouseenter="CheckShow(index)" @mouseleave="CheckShow(index)">
				<div class="label_title">{{item.title}}</div>
				<div v-if="item.show_sort">
					<img class="sort-icon" v-if="item.sort == 0" src="../../../static/sort_icon.png" @click="SortFun(2,index)">
					<img class="sort-icon" v-if="item.sort == 1" src="../../../static/sort_up.png" @click="SortFun(0,index)">
					<img class="sort-icon" v-if="item.sort == 2" src="../../../static/sort_down.png" @click="SortFun(1,index)">
				</div>
			</div>
		</div>
		<div class="table_list">
			<div class="column_item" :class="{'column_item_odd':index%2 == 1}" v-for="(item,index) in data_list">
				<div class="column_item_text" :class="[{'toast_red':i.id == 5 || i.id == 17},{'toast_yellow':i.id == 6 || i.id == 10 || i.id == 18}]" v-for="i in item">{{i.field_value_str}}</div>
			</div>
		</div>
	</div>
	<el-dialog title="店铺自定义列表（单机取消列表名保存直接修改）" :visible.sync="show_custom">
		<div class="select_box">
			<div class="select_item" v-for="item in label_list">
				<el-checkbox v-model="item.is_show">{{item.title}}</el-checkbox>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="Restore">恢复默认</el-button>
			<el-button size="small" @click="show_custom = false">取消</el-button>
			<el-button size="small" type="primary" @click="Save">保存</el-button>
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
// 表格
.table_container{
	margin-top: 5px;
	width: 100%;
	display: flex;
	.table_header{
		border-right:1px solid #D9D9D9;
		.header_item{
			border-bottom:1px solid #fff;
			height: 40px;
			line-height: 40px;
			font-size:16px;
			color: #333333;
			font-weight: 600;
			position: relative;
			padding-right:40px;
			.sort-icon{
				position: absolute;
				top: 10px;
				right: 5px;
				width:20px;
				height: 20px;
			}
		}
	}
	.table_list{
		border-top:1px solid #D9D9D9;
		flex:1;
		display: flex;
		overflow-x: scroll;
		.column_item{
			background: #EFF1FA;
			width:180px;
			.column_item_text{
				border-bottom:1px solid #D9D9D9;
				width:180px;
				text-align: center;
				height: 40px;
				line-height: 40px;
				font-size:16px;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
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
	}
}
//修改默认显示弹框
.select_box{
	display: flex;
	flex-wrap: wrap;
	.select_item{
		margin-bottom: 8px;
		width:33%;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 								//时间区间
				date:[],							//发货时间
				start_time:"",						//开始时间
				end_time:"",						//结束时间
				dept_list: [],						//部门列表	
				select_department_ids:[],			//选中的部门id列表
				store_list: [],						//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				xssryg:{},							//销售收入预估
				yxfyyg:{},							//营销费用预估
				ygz_gxmy:{},						//预估值-贡献毛益
				ygz_gxmyl:{},						//预估值-贡献毛益率
				label_list:[],						//表格数据（左侧表头）
				data_list:[],						//表格数据（后面内容）
				default_data_list:[],				//表格数据（备用）
				show_custom:false,					//是否显示自定义弹框
			}
		},
		created(){
			//部门列表
			this.AjaxViewDept();
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
			//部门列表
			AjaxViewDept(){
				resource.ajaxViewDept().then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},	
			//切换选中部门
			ChangeDept(v){
				let dept_id = v.join(',');
				resource.ajaxViewStore({dept_id:dept_id}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取信息
			GetData(){
				let req = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time
				}
				resource.performanceReport(req).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.xssryg = data.top.xssryg;
						this.yxfyyg = data.top.yxfyyg;
						this.ygz_gxmy = data.top.ygz_gxmy;
						this.ygz_gxmyl = data.top.ygz_gxmyl;
						data.shop_table_list.title_names.map(item => {
							item.is_show = true;		//是否显示当前行
							item.show_sort = false;		//是否显示排序标签
						})
						this.label_list = data.shop_table_list.title_names;
						this.data_list = data.shop_table_list.list;
						this.default_data_list = JSON.stringify(data.shop_table_list.list);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//清空查询条件
			ClearReq(){
				this.select_department_ids = [];
				this.select_store_ids = [];
				this.date = [];
			},
			//切换是否显示
			CheckShow(index){
				this.label_list[index].show_sort = !this.label_list[index].show_sort;
			},
			// 排序
			SortFun(sort,index){
				this.label_list.map((item,i) => {
					if(i == index){
						item.sort = sort;
					}else{
						item.sort = 0;
					}
				})
				if(sort == 0){
					this.data_list = JSON.parse(this.default_data_list);
				}else{
					this.data_list.sort(this.Compare(sort,index));
				}
			},
			// 排序
			Compare(sort,index){
				return function(arr1, arr2){
					var val1 = arr1[index].value;
					var val2 = arr2[index].value;
					if(sort == 1){
						return val1 - val2;
					}else if(sort == 2){
						return val2 - val1;
					}
				}
			},
			//恢复默认
			Restore(){

			},
			//保存
			Save(){

			}
			
		}
	}
</script>