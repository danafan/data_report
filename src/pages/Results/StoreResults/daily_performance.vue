<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="daterange"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="项目部:" style="margin-right: 20px">
			<el-select v-model="select_department_ids" :popper-append-to-body="false" @change="GetStoreList" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="店铺:">
			<el-select v-model="select_store_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-checkbox v-model="is_assessment" true-label="1" false-label="0" border size="small">考核店铺</el-checkbox>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="GetData">搜索</el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="info" @click="ClearReq">清空</el-button>
		</el-form-item>
	</el-form>
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_custom = true">店铺自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="Export" v-if="button_list.export == '1'">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<!-- 表格 -->
	<div class="table_container" v-show="data_list.length > 0">
		<div class="tab_box">
			<div class="top_list">
				<div class="row_box">
					<div class="row_item header_item" v-for="(item,index) in label_list" :key="index" @mouseenter="CheckShow(index)" @mouseleave="CheckShow(index)">
						<el-tooltip effect="dark" :content="item.title" placement="top">
							<el-button type="text" class="label_title">{{item.title}}</el-button>
						</el-tooltip>
						<div v-if="item.show_sort">
							<img class="sort-icon" v-if="item.sort == 0" src="../../../static/sort_icon.png" @click="SortFun(2,index)">
							<img class="sort-icon" v-if="item.sort == 1" src="../../../static/sort_up.png" @click="SortFun(0,index)">
							<img class="sort-icon" v-if="item.sort == 2" src="../../../static/sort_down.png" @click="SortFun(1,index)">
						</div>
					</div>
				</div>
				<div class="row_box">
					<div class="row_item total_item" v-for="(item,index) in total_list" :key="index">
						<div>{{item.field_value_str}}</div>
					</div>
				</div>
			</div>
			<div class="content_list">
				<div class="row_box" v-for="(item,index) in data_list" :key="index">
					<div class="row_item" :class="{'column_item_odd':index%2 == 1}" v-for="(i,index) in item" :key="index">
						<div class="background_box" :class="{'is_negative':i.value < 0}" :style="{width:`${(100/i.max_value)*Math.abs(i.value)}px`}" v-if="Filtter(i.id)"></div>
						<div class="z_index">{{i.field_value_str}}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 折线图 -->
	<div id="container"></div>
	<!-- 没有数据 -->
	<div class="data_null" v-if="show_null && data_list.length == 0">暂无数据</div>
	<el-dialog title="店铺自定义列表（单机取消列表名保存直接修改）" :visible.sync="show_custom">
		<div class="select_box">
			<el-checkbox-group v-model="selected_ids">
				<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="Restore">恢复默认</el-button>
			<el-button size="small" @click="show_custom = false">取消</el-button>
			<el-button size="small" type="primary" @click="GetData('1')">保存</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	display: flex;
	justify-content: space-between;
}
// 表格
.table_container{
	margin-top: 5px;
	margin-bottom: 30px;
	width: 100%;   
	overflow-x: scroll;
	.tab_box{
		position: relative;
		height: 582px;
	}
	.top_list{
		position: absolute;
		top: 0;
		left: 0;
		height: 72px;
	}
	.content_list{
		position: absolute;
		top: 72px;
		left: 0;
		height: 500px;
		overflow-y: scroll;
	}
	.row_box{
		display: flex;
		.row_item{
			border-bottom:1px solid #D9D9D9;
			background: #EFF1FA;
			width:130px;
			height: 36px;
			line-height: 36px;
			font-size:14px;
			color: #333333;
			padding-left: 5px;
			padding-right: 5px;
			flex-shrink: 0;
			position: relative;
			.label_title{
				width: 100px;
				font-weight: 600;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.sort-icon{
				position: absolute;
				top: 10px;
				right: 5px;
				width:16px;
				height: 16px;
			}
			.background_box{
				background:#FFA39E;
				position: absolute;
				top: 3px;
				left: 0;
				height: 30px;
				line-height:30px;
			}
			.is_negative{
				background:#B7EB8F;
			}
			.z_index{
				position: absolute;
				top: 2px;
				left: 0;
				width:100px;
				height: 36px;
				line-height:36px;
				padding-left: 5px;
				z-index: 1;
			}
		}
		.column_item_odd{
			background: #F8F8F8;
		}
		.total_item{
			background:#FFE58F;
		}
		.header_item{
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
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
				is_assessment:'0',				//考核店铺
				dept_list: [],						//部门列表	
				select_department_ids:[],			//选中的部门id列表
				store_list: [],						//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				label_list:[],						//表格数据（表头）
				total_list:[],						//总计
				data_list:[],						//表格数据（后面内容）
				view_row:[],						//自定义列的内容
				selected_ids:[],					//选中的自定义列的id
				show_null:false,					//默认不显示空提示
				default_data_list:[],				//表格数据（备用）
				view_table_list:[],					//折线图列表
				show_custom:false,
				button_list:{}
			}
		},
		created(){
			//部门列表
			this.AjaxViewDept();
			//店铺列表
			this.GetStoreList();
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
			//导出
			Export(){
				var data_obj = {
					table_title:"每日业绩报告",
					table_title_list:[],
					field_name_list:[],
					data_list:[]
				};
				this.label_list.map(item => {
					data_obj.table_title_list.push(item.title);
					data_obj.field_name_list.push(item.field_name);
				})
				this.data_list.map(item => {
					let obj = {};
					item.map(i => {
						obj[i.field_name] = i.field_value_str;
					})
					data_obj.data_list.push(obj)
				})
				exportExcel(data_obj);
			},
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
			//店铺列表
			GetStoreList(){
				let dept_id = this.select_department_ids.join(',');
				this.select_store_ids = [];
				resource.ajaxViewStore({dept_id:dept_id}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取信息
			GetData(is_save){
				let req = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment
				}
				if(is_save == '1'){
					req.row_ids = this.selected_ids.join(',')
				}
				resource.dayAnalysis(req).then(res => {
					if(res.data.code == 1){
						this.show_custom = false;
						let data = res.data.data;
						data.shop_table_list.title_names[0].map(item => {
							item.show_sort = false;		//是否显示排序标签
						})
						this.label_list = data.shop_table_list.title_names[0];
						this.total_list = data.shop_table_list.title_names[1];
						this.data_list = data.shop_table_list.list;
						this.view_row = data.view_row;
						this.selected_ids = data.selected_ids;
						this.button_list = data.button_list;
						this.show_null = true;
						this.default_data_list = JSON.stringify(data.shop_table_list.list);
						this.view_table_list = data.view_table_list;	//折线图
						if(this.view_table_list == 0){
							//清空折线图
							this.ClearEcharts();
						}else{
							for(var i = 0;i < this.view_table_list.length;i ++){
								let div = '<div style="height:360px;float:left;width:46%;margin-bottom:10px;margin-right:30px" id='+"id_"+i+' class="echarts_div"></div>';
								document.getElementById('container').insertAdjacentHTML("beforeBegin",div);
							}
							var echarts = require("echarts");
							this.view_table_list.map((item,index) => {
								var legend_data = [];
								var xAxis_data = [];
								var series_data = [];
								item.list.map(item => {
									legend_data.push(item.name);
									xAxis_data = Object.keys(item.list);
									let obj = {
										name: item.name,
										type: 'line',
										lineStyle:{
											width:3.6
										},
										data: Object.values(item.list)
									}
									series_data.push(obj)
								})
								var ele = document.getElementById('id_' + index);
								var myChart = echarts.init(ele);
								myChart.setOption({
									title: {
										text: item.title
									},
									color:['#c23531','#2f4554', '#61a0a8'],
									tooltip: {
										trigger: 'axis',
										formatter (params) {
											var relVal = params[0].name
											for (var i = 0, l = params.length; i < l; i++) {
												let circle = `<i class="iconfont icon-yuan" style="margin-right:4px;font-size:14px;color:${params[i].color}">o</i>`
												relVal += '<br/>' + circle + params[i].seriesName + ' : ' + params[i].value + item.unit
											}
											return relVal
										}
									},
									legend: {
										x:'right',      
										y:'top',      
										data: legend_data
									},
									xAxis: {
										type: 'category',
										boundaryGap: false,
										data: xAxis_data,
										name:"日期"
									},
									yAxis: {
										type: 'value',
										name:"单位（"+ item.unit +"）"
									},
									series: series_data
								})

							})
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//清空折线图
			ClearEcharts(){
				var child= document.getElementsByClassName("echarts_div");
				child.removeNode = [];
				if (child.length != undefined) {
					var len = child.length;
					for (var i = 0; i < len; i++) {
						child.removeNode.push({
							parent: child[i].parentNode,
							inner: child[i].outerHTML,
							next: child[i].nextSibling
						});
					}
					for (var i = 0; i < len; i++){
						child[0].parentNode.removeChild(child[0]);
					}
				} else {
					child.removeNode.push({
						parent: child.parentNode,
						inner: child.outerHTML,
						next: child.nextSibling
					});
					child.parentNode.removeChild(child);
				}
			},
			//清空查询条件
			ClearReq(){
				this.select_department_ids = [];
				this.select_store_ids = [];
				this.date = [];
			},
			Filtter(id){
				if(id == 20 || id == 24 || id == 26 || id == 28 || id == 30 || id == 31 || id == 34 || id == 36 || id == 37 || id == 38){
					return true;
				}else{
					return false;
				}
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
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
			}
			
		}
	}
</script>