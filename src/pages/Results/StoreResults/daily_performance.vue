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
	<!-- 表格 -->
	<div class="table_container">
		<div class="top_list">
			<div class="row_box">
				<div class="row_item header_item" v-for="(item,index) in label_list" @mouseenter="CheckShow(index)" @mouseleave="CheckShow(index)">
					<div class="label_title">{{item.title}}</div>
					<div v-if="item.show_sort">
						<img class="sort-icon" v-if="item.sort == 0" src="../../../static/sort_icon.png" @click="SortFun(2,index)">
						<img class="sort-icon" v-if="item.sort == 1" src="../../../static/sort_up.png" @click="SortFun(0,index)">
						<img class="sort-icon" v-if="item.sort == 2" src="../../../static/sort_down.png" @click="SortFun(1,index)">
					</div>
				</div>
			</div>
			<div class="row_box">
				<div class="row_item total_item" v-for="(item,index) in total_list">
					<div>{{item.field_value_str}}</div>
				</div>
			</div>
		</div>
		<div class="content_list">
			<div class="row_box" v-for="(item,index) in data_list">
				<div class="row_item" :class="{'column_item_odd':index%2 == 1}" v-for="(i,index) in item">
					<div class="background_box" :class="{'is_negative':i.value < 0}" :style="{width:`${(200/i.max_value)*Math.abs(i.value)}px`}" v-if="Filtter(i.id)"></div>
					<div class="z_index">{{i.field_value_str}}</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 折线图 -->
	<div id="container"></div>
</div>
</template>
<style lang="less" scoped>
// 表格
.table_container{
	margin-top: 5px;
	margin-bottom: 30px;
	width: 100%;   
	overflow-x: scroll;
	.top_list{
		height: 82px;
	}
	.content_list{
		height: 500px;
	}
	.row_box{
		display: flex;
		.row_item{
			border-bottom:1px solid #D9D9D9;
			background: #EFF1FA;
			width:220px;
			height: 40px;
			line-height: 40px;
			font-size:16px;
			color: #333333;
			padding-left: 5px;
			padding-right: 5px;
			flex-shrink: 0;
			position: relative;
			.label_title{
				font-weight: 600;
			}
			.sort-icon{
				position: absolute;
				top: 10px;
				right: 5px;
				width:20px;
				height: 20px;
			}
			.background_box{
				background:#FFA39E;
				position: absolute;
				top: 2px;
				left: 0;
				height: 36px;
				line-height:36px;
			}
			.is_negative{
				background:#B7EB8F;
			}
			.z_index{
				position: absolute;
				top: 2px;
				left: 0;
				width:200px;
				height: 40px;
				line-height:40px;
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
				label_list:[],						//表格数据（表头）
				total_list:[],						//总计
				data_list:[],						//表格数据（后面内容）
				default_data_list:[],				//表格数据（备用）
				view_table_list:[],					//折线图列表
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
				resource.dayAnalysis(req).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.view_table_list = data.view_table_list;
						data.shop_table_list.title_names[0].map(item => {
							item.show_sort = false;		//是否显示排序标签
						})
						this.label_list = data.shop_table_list.title_names[0];
						this.total_list = data.shop_table_list.title_names[1];
						this.data_list = data.shop_table_list.list;
						this.default_data_list = JSON.stringify(data.shop_table_list.list);
						for(var i = 0;i < this.view_table_list.length;i ++){
							let div = '<div style="height:360px;float:left;width:46%;margin-bottom:10px;margin-right:30px" id='+"id_"+i+'></div>';
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
									trigger: 'axis'
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
			
		}
	}
</script>