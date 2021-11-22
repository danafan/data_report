<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="流量来源:" style="margin-right: 20px">
				<el-select v-model="llly_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in llly" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_container">
			<div class="tab_box">
				<div class="top_list">
					<div class="row_box">
						<div class="row_item header_item" v-for="(item,index) in label_list" :key="index" @mouseenter="CheckShow(index)" @mouseleave="CheckShow(null)">
							<el-tooltip effect="dark" :content="item.title" placement="top">
								<el-button type="text" class="label_title">{{item.title}}</el-button>
							</el-tooltip>
							<div v-if="show_sort_index == index">
								<img class="sort-icon" v-if="item.sort == 0" src="../../../../static/sort_icon.png" @click="SortFun(2,index)">
								<img class="sort-icon" v-if="item.sort == 1" src="../../../../static/sort_up.png" @click="SortFun(0,index)">
								<img class="sort-icon" v-if="item.sort == 2" src="../../../../static/sort_down.png" @click="SortFun(1,index)">
							</div>
						</div>
					</div>
					<div class="row_box" v-if="data_list.length > 0">
						<div class="row_item total_item" v-for="(item,index) in total_list" :key="index">
							<div>{{item.field_value_str}}{{item.field_name != 'lymx' && item.field_name != 'll_fks'?'%':''}}</div>
						</div>
					</div>
				</div>
				<div class="content_list">
					<div class="row_box" v-for="(item,index) in data_list" :key="index">
						<div class="row_item" :class="{'column_item_odd':index%2 == 1}" v-for="(i,index) in item" :key="index">
							<div :class="{'f_background_box':i.field_name == 'zfzhl','h_background_box':i.field_name == 'll_fks','is_negative':i.value < 0}" :style="{width:`${(100/i.max_value)*Math.abs(i.value)}px`}" v-if="Filtter(i.field_name)"></div>
							<div :class="['z_index',{'red_color':(i.field_value_str > 0 && i.field_name != 'll_fks' && i.field_name != 'zfzhl'),'green_color':(i.field_value_str < 0 && i.field_name != 'll_fks' && i.field_name != 'zfzhl')}]">{{i.field_value_str}}{{i.field_name != 'lymx' && i.field_name != 'll_fks'?'%':''}}</div>
						</div>
					</div>
				</div>
				<!-- 没有数据 -->
				<div class="data_null" v-if="data_list.length == 0">暂无数据</div>
			</div>
		</div>
		<div class="tab_container">
			<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">周期</div>
			<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">去年</div>
		</div>
		<div class="charts_box" v-show="tab_index == '1'">
			<div class="charts_item" id="dayly"></div>
			<div class="charts_item" id="daymx"></div>
		</div>
		<div class="charts_box" v-show="tab_index == '2'">
			<div class="charts_item" id="weekly"></div>
			<div class="charts_item" id="weekmx"></div>
		</div>
	</div>
</template>
<style lang="less" scoped>
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
			width:160px;
			height: 36px;
			line-height: 36px;
			font-size:14px;
			color: #333333;
			padding-left: 5px;
			padding-right: 5px;
			flex-shrink: 0;
			position: relative;
			.label_title{
				width: 160px;
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
			.f_background_box{
				background:#FFA39E;
				position: absolute;
				top: 3px;
				left: 0;
				height: 30px;
				line-height:30px;
			}
			.h_background_box{
				background:#FFE58F;
				position: absolute;
				top: 3px;
				left: 0;
				height: 30px;
				line-height:30px;background:#FFE58F;
			}
			.is_negative{
				background:#B7EB8F;
			}
			.z_index{
				position: absolute;
				top: 2px;
				left: 0;
				width:160px;
				height: 36px;
				line-height:36px;
				padding-left: 5px;
				z-index: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.red_color{
				color: red;
			}
			.green_color{
				color: green;
			}
		}
		.column_item_odd{
			background: #F8F8F8;
		}
		.total_item{
			background: #fff;
			color: #333;
			font-weight: bold;
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
	position: absolute;
	top: 72px;
	left: 0;
	width:1120px;
	text-align: center;
	height: 80px;
	line-height: 80px;
	font-size:18px;
	color: #D9D9D9;
}
.tab_container{
	margin-bottom: 30px;
	margin-top: 10px;
	display:flex;
	.tab_item{
		background: #EFEFEF;
		width:160px;
		text-align: center;
		height: 40px;
		line-height: 40px;
		font-size: 18px;
		color: #8a8a8a;
	}
	.active_tab_item{
		background:#008DFF;
		color: #fff;
	}
}
.charts_box{
	margin-top: 20px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	.charts_item{
		width: 46%;
		height: 500px
	}
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				daymxChart:null,
				daylyChart:null,
				weeklyChart:null,
				weekmxChart:null,
				label_list:[],
				total_list:[],
				data_list:[],
				llly:[],
				llly_list:[],
				default_data_list:[],
				show_sort_index:null,
				tab_index:'1',
				req:{},
				standSize: document.body.clientWidth
			}
		},
		props:{
			dept_id:{
				type:String,
				default:""
			},
			shop_id:{
				type:String,
				default:""
			},
			tjrq:{
				type:Array,
				default:[]
			},
			platform:{
				type:String,
				default:""
			}
		},
		watch:{
			dept_id:function(n,o){
				//获取列表
				this.getList();
				//访客流量分布（日）
				this.getDaymx();
				//访客流量来源（日）
				this.getDayly();
				//访客流量来源（周）
				this.getWeekly();
				//访客流量分布（周）
				this.getWeekmx();
			},
			shop_id:function(n,o){
				//获取列表
				this.getList();
				//访客流量分布（日）
				this.getDaymx();
				//访客流量来源（日）
				this.getDayly();
				//访客流量来源（周）
				this.getWeekly();
				//访客流量分布（周）
				this.getWeekmx();
			},
			tjrq:function(n,o){
				//获取列表
				this.getList();
				//访客流量分布（日）
				this.getDaymx();
				//访客流量来源（日）
				this.getDayly();
				//访客流量来源（周）
				this.getWeekly();
				//访客流量分布（周）
				this.getWeekmx();
			},
			platform:function(n,o){
				//获取列表
				this.getList();
				//访客流量分布（日）
				this.getDaymx();
				//访客流量来源（日）
				this.getDayly();
				//访客流量来源（周）
				this.getWeekly();
				//访客流量分布（周）
				this.getWeekmx();
			},
			tab_index:function(n,o){
				this.$nextTick(() => {
					this.daymxChart.resize();
					this.daylyChart.resize();
					this.weeklyChart.resize();
					this.weekmxChart.resize();
				})
			}
		},
		created(){
			//流量来源列表
			this.ajaxllly();
			//获取列表
			this.getList();
		},
		mounted(){
			//访客流量分布（日）
			this.getDaymx();
			//访客流量来源（日）
			this.getDayly();
			//访客流量来源（周）
			this.getWeekly();
			//访客流量分布（周）
			this.getWeekmx();
		},
		methods:{
			//流量来源列表
			ajaxllly(){
				resource.ajaxllly().then(res => {
					if(res.data.code == 1){
						this.llly = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取列表
			getList(){
				let req = {
					dept_id:this.dept_id,
					start_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[0],
					end_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[1],
					shop_id:this.shop_id,
					platform:this.platform,
					llly:this.llly_list.join(',')
				}
				resource.boardPeriodFlow(req).then(res => {
					if(res.data.code == 1){
						this.label_list = res.data.data.title_names[0];
						this.label_list.map(item => {	
							item.sort = 0;		
						})
						this.total_list = res.data.data.title_names[1];
						this.data_list = res.data.data.list;
						this.default_data_list = JSON.stringify(res.data.data.list);
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//切换是否显示
			CheckShow(index){
				this.show_sort_index = index;
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
			Filtter(field_name){
				if(field_name == 'll_fks' || field_name == 'zfzhl'){
					return true;
				}else{
					return false;
				}
			},
			//访客流量来源（日）
			getDayly(){
				let req = {
					dept_id:this.dept_id,
					start_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[0],
					end_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[1],
					shop_id:this.shop_id,
					platform:this.platform,
					llly:this.llly_list.join(',')
				}
				resource.getPeriodDayly(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let fk_num_list = res.data.data.fk_num_list;  //访客数
						let fk_per_list = res.data.data.fk_per_list;  //访客数百分比
						let name = res.data.data.name;  			  //标题
						var data_list = [];
						name.map((item,index) => {
							fk_per_list.map((name_item,i) => {
								if(index == i){
									let obj = {
										value:name_item,
										name:item
									}
									data_list.push(obj)
								}
							})
						})
						var dayly = document.getElementById('dayly');
						this.daylyChart = echarts.init(dayly);
						this.daylyChart.setOption(this.pieOption(data_list));
						var _this = this;
						window.addEventListener('resize',() => {
							_this.daylyChart.resize();
						})
						this.daylyChart.on('click', params => {
							//访客流量分布（日）
							this.getDaymx({select_llly:params.name});
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//访客流量分布（日）
			getDaymx(new_req){
				let req = {
					select_llly:new_req?new_req.select_llly:'',
					dept_id:this.dept_id,
					start_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[0],
					end_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[1],
					shop_id:this.shop_id,
					platform:this.platform,
					llly:this.llly_list.join(',')
				}
				resource.getPeriodDaymx(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let fk_num_list = res.data.data.fk_num_list;  //访客数
						let fk_per_list = res.data.data.fk_per_list;  //访客数百分比
						let name = res.data.data.name;  			  //标题
						var daymx = document.getElementById('daymx');
						this.daymxChart = echarts.init(daymx);
						this.daymxChart.setOption(this.axisOption(fk_num_list,fk_per_list,name));
						var _this = this;
						window.addEventListener('resize',() => {
							_this.daymxChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//访客流量来源（周）
			getWeekly(){
				let req = {
					dept_id:this.dept_id,
					start_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[0],
					end_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[1],
					shop_id:this.shop_id,
					platform:this.platform,
					llly:this.llly_list.join(',')
				}
				resource.getPeriodWeekly(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let fk_num_list = res.data.data.fk_num_list;  //访客数
						let fk_per_list = res.data.data.fk_per_list;  //访客数百分比
						let name = res.data.data.name;  			  //标题
						var data_list = [];
						name.map((item,index) => {
							fk_per_list.map((name_item,i) => {
								if(index == i){
									let obj = {
										value:name_item,
										name:item
									}
									data_list.push(obj)
								}
							})
						})
						var weekly = document.getElementById('weekly');
						this.weeklyChart = echarts.init(weekly);
						this.weeklyChart.setOption(this.pieOption(data_list));
						var _this = this;
						window.addEventListener('resize',() => {
							_this.weeklyChart.resize();
						})
						this.weeklyChart.on('click', params => {
							//访客流量分布（周）
							this.getWeekmx({select_llly:params.name});
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//访客流量分布（周）
			getWeekmx(new_req){
				let req = {
					select_llly:new_req?new_req.select_llly:'',
					dept_id:this.dept_id,
					start_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[0],
					end_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[1],
					shop_id:this.shop_id,
					platform:this.platform,
					llly:this.llly_list.join(',')
				}
				resource.getPeriodWeekmx(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let fk_num_list = res.data.data.fk_num_list;  //访客数
						let fk_per_list = res.data.data.fk_per_list;  //访客数百分比
						let name = res.data.data.name;  			  //标题
						var weekmx = document.getElementById('weekmx');
						this.weekmxChart = echarts.init(weekmx);
						this.weekmxChart.setOption(this.axisOption(fk_num_list,fk_per_list,name));
						var _this = this;
						window.addEventListener('resize',() => {
							_this.weekmxChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 饼状图
			pieOption(data_list){
				return {
					title: {
						text: '访客流量来源分布（联动右侧）'
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return '流量来源：' + params.name + '</br>' + '访客占比：' + params.value + '%';
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
					series: [
					{
						name: '访客流量来源分布',
						type: 'pie',
						radius: ['40%', '70%'],
						center: ['50%', '50%'],
						itemStyle: {
							borderRadius: 8
						},
						label:{
							formatter: (params) => {
								return params.name + '\n' + params.value + '%';
							},
						},
						minAngle: 10,  // 设置每块扇形的最小占比
						data: data_list
					}
					]
				}
			},
			//柱状图
			axisOption(fk_num_list,fk_per_list,name){
				return {
					title: {
						text: '访客流量明细分布'
					},
					tooltip: {
						trigger: 'axis',
						formatter: (params) => {
							let tip = "";
							if(params != null && params.length > 0) {
								for(let i =0; i < params.length; i++) {
									tip = params[0].axisValueLabel + '</br>'
									+ params[0].seriesName + "：" + params[0].value + "%</br>"
									+ params[1].seriesName + "：" + params[1].value + "（人）</br>";
								}
							}
							return tip;
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
					color:['#5AD8A6','#F6BD16'],
					legend: {
						data: ['访客占比', '访客数'],
						top:0,
						right:0
					},
					grid:{
						y2:150
					},
					xAxis: [{
						type: 'category',
						data: name,
						axisLabel: {
							color: '#333',
							rotate:70
						}
					}],
					yAxis:[{
						type: 'value',
						name:'访客占比',
						axisLabel: {
							formatter: '{value}%'
						}
					},{
						type: 'value',
						name:'访客数',
						axisLabel: {
							formatter: '{value}'
						}
					}],
					series: [{
						name: '访客占比',
						type: 'bar',
						stack: '1',
						yAxisIndex:0,
						emphasis: {
							focus: 'series'
						},
						data: fk_per_list
					},{
						name: '访客数',
						type: 'line',
						yAxisIndex:1,
						lineStyle: { 
							 width:3.6
						},
						emphasis: {
							focus: 'series'
						},
						data: fk_num_list
					}]
				}
			}

		}
	}
</script>