<template>
	<div style="min-height: 600px">
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
			<el-button type="primary" @click="searchFun">搜索</el-button>
		</el-form-item>
	</el-form>
	<!-- 表格 -->
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_custom = true" style="margin-bottom: 5px">自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="Export">导出<i class="el-icon-download el-icon--right"></i></el-button>
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
				<div class="column_item_text" v-for="i in item">
					<el-tooltip effect="dark" :content="i.val.toString()" placement="top" v-if="i.id == 472 || i.id == 473">
						<el-button type="text" class="tooltip_but">{{i.val}}</el-button>
					</el-tooltip>
					<div class='tab_text' v-else>{{i.val}}</div>
				</div>
			</div>
		</div>
	</div>
	<!-- 没有数据 -->
	<div class="data_null" v-if="data_list.length == 0 && loading == false">暂无数据</div>
	<!-- 仪表 -->
	<div id="cate_row" class="cate_row"></div>
	<!-- 各店销售收入完成情况 -->
	<div id="axis_01" class="axis_box" v-show="show_axis_01"></div>
	<!-- 各店毛利额完成情况 -->
	<div id="axis_02" class="axis_box" v-show="show_axis_02"></div>
	<!-- 各店营销费用完成情况 -->
	<div id="axis_03" class="axis_box" v-show="show_axis_03"></div>
	<!-- 自定义列表 -->
	<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
		<div>
			<el-checkbox-group v-model="selected_ids">
				<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="Restore">恢复默认</el-button>
			<el-button size="small" @click="show_custom = false">取消</el-button>
			<el-button size="small" type="primary" @click="setColumns">保存</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style>
.el-table .cell {
	word-break: keep-all !important;
	white-space: nowrap !important;
}
</style>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
}
.cate_row{
	width: 100%;
	display:flex;
	align-items: center;
	justify-content: space-evenly;
}
.text_content{
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap
}
.margin_bottom{
	margin-bottom: 60px;
}
.axis_box{
	margin-top: 60px;
	width: 100%;
	min-height: 600px;
}
// 表格
.table_container{
	margin-top: 5px;
	margin-bottom: 30px;
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
	import {exportExcel} from '../../../api/export.js'
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
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
				select_department_ids:[],			//选中的部门id列表
				select_plat_ids:[],					//选中的平台列表
				select_store_ids:[],				//选中的店铺id列表
				company_list:[],					//公司列表
				company:[],					//选中的公司
				is_assessment:'0',					//是否考核店铺
				dashboard_data:[],					//仪表盘列表
				label_list:[],						//表格数据（左侧表头）
				shop_table_list_data:[],			//表格数据（原始）
				total_shop_data:[],					//总计
				total_list:[],						//导出用
				data_list:[],						//表格数据（更新后）
				default_data_list:[],				//表格数据（默认排序用）
				view_row:[],						//自定义列的内容
				selected_ids:[],					//选中的自定义列的id
				show_custom:false,					//是否显示自定义弹框
				show_axis_01:true,
				show_axis_02:true,
				show_axis_03:true,
				loading:false
			}
		},
		created(){
			//公司列表
			this.ajaxCompany();
			//获取列表（表格）
			this.targetTable();
			//获取列表（仪表盘和柱状图）
			this.getData();
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
			//表格总计行
			getWeekSummaries(param) {
				return this.total;
			},
			//点击搜索
			searchFun(){
				//获取列表（表格）
				this.targetTable();
				//获取列表（仪表盘和柱状图）
				this.getData();
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
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//获取列表（表格）
			targetTable(){
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
				resource.targetTable(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						//左侧表头
						data.title_list.map(item => {
							item.show_sort = false;		//是否显示排序标签
							item.sort = 0;				//默认排序
						})
						this.label_list = data.title_list;
						//表格数据
						this.shop_table_list_data = data.data;	//原始
						this.clTableData(this.shop_table_list_data);
						this.default_data_list = this.data_list;
						this.total_shop_data = data.total;
						this.total_list[0] = data.total_list;
						this.view_row = data.view_row;
						this.selected_ids = data.selected_ids;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
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
					table_title:"目标完成情况",
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
			//处理表格的数据
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
					this.clTableData(this.shop_table_list_data);
				}else{
					this.Compare(sort,this.label_list[index].row_field_name,this.shop_table_list_data)
				}
			},
			// 排序
			Compare(sort,k,table_data){
				let ss = JSON.parse(JSON.stringify(table_data));
				ss.sort((a, b) => {
					if(sort == 1){
						return a[k] - b[k];
					}else if(sort == 2){
						return b[k] - a[k];
					}
				});
				this.clTableData(ss);
			},
			//单品分析—-指标汇总恢复默认
			Restore(){
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
			},
			//自定义列
			setColumns(){
				resource.setColumns({menu_id:'54',row_ids:this.selected_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						//获取列表
						this.targetTable();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//获取列表（仪表和柱状图）
			getData(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment,
					company:this.company.join(',')
				}
				resource.targetCompleteChart(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						//仪表盘数据
						this.dashboard_data = res.data.data.dashboard;
						if(this.dashboard_data.length == 0){
							//清空图表
							this.ClearEcharts();
						}else{
							for(var i = 0;i < this.dashboard_data.length;i ++){
							//判断是否包含当前元素
							let cur_ele = document.getElementById('id_' + i);
							if(!cur_ele){	//不包含则创建
								let div = '<div style="height:300px;float:left;width:320px;margin-bottom:10px;margin-right:30px" id='+"id_"+i+' class="echarts_div"></div>';
								document.getElementById('cate_row').insertAdjacentHTML("beforeBegin",div); 
							}
						}
						this.dashboard_data.map((item,index) => {
							var ele = document.getElementById('id_' + index);
							var myChart = echarts.getInstanceByDom(ele);
							if (myChart == null) { 
								myChart = echarts.init(ele);
							}
							myChart.setOption(this.option(item));
						});
					}

						//各店销售收入完成情况
						var title = '各店销售收入完成情况（有月目标的店铺）';
						var	legend = ['销售收入月目标','销售收入预估','销售收入月完成率预估'];
						var xssr_dpid = [];
						var xssr_dpmc = [];
						var xssr_xssryg = [];
						var xssr_ymb = [];
						var xssr_wcl = [];
						let xssryg_chart = res.data.data.xssryg_chart;
						xssryg_chart.map(item => {
							xssr_dpid.push(item.dpid);			//店铺id
							xssr_dpmc.push(item.dpmc);			//店铺名称
							xssr_ymb.push(item.ymb_xssr);		//销售收入月目标
							xssr_xssryg.push(item.xssryg);		//销售收入预估
							xssr_wcl.push(item.wcl);			//销售收入完成率
						});
						var axis_01 = document.getElementById('axis_01');
						let axis_01Chart = echarts.getInstanceByDom(axis_01);
						if (axis_01Chart == null) { 
							this.axis_01Chart = echarts.init(axis_01);
						}
						this.axis_01Chart.setOption(this.axisOption(title,legend,xssr_dpid,xssr_dpmc,xssr_ymb,xssr_xssryg,xssr_wcl));
						if(xssryg_chart.length > 1){
							this.show_axis_01 = true;
						}else{
							this.show_axis_01 = false;
						}
						//各店毛利额完成情况
						var title = '各店毛利额完成情况（有月目标的店铺）';
						var	legend = ['毛利额月目标','毛利额','毛利额月完成率预估'];
						var mle_dpid = [];
						var mle_dpmc = [];
						var mle_mle = [];
						var mle_ymb = [];
						var mle_wcl = [];
						let mle_chart = res.data.data.mle_chart;
						mle_chart.map(item => {
							mle_dpid.push(item.dpid);			//店铺id
							mle_dpmc.push(item.dpmc);			//店铺名称
							mle_ymb.push(item.ymb_mle);			//毛利额月目标
							mle_mle.push(item.mle);			//毛利额
							mle_wcl.push(item.wcl);			//毛利额月完成率预估
						});
						var axis_02 = document.getElementById('axis_02');
						let axis_02Chart = echarts.getInstanceByDom(axis_02);
						if (axis_02Chart == null) { 
							this.axis_02Chart = echarts.init(axis_02);
						}
						this.axis_02Chart.setOption(this.axisOption(title,legend,mle_dpid,mle_dpmc,mle_ymb,mle_mle,mle_wcl));
						if(mle_chart.length > 1){
							this.show_axis_02 = true;
						}else{
							this.show_axis_02 = false;
						}
						//各店营销费用完成情况
						var title = '各店营销费用完成情况（有月目标的店铺）';
						var	legend = ['营销费用月目标','营销费用预估','营销费用月完成率预估'];
						var yxfy_dpid = [];
						var yxfy_dpmc = [];
						var yxfy_yxfyyg = [];
						var yxfy_ymb = [];
						var yxfy_wcl = [];
						let yxfy_chart = res.data.data.yxfy_chart;
						yxfy_chart.map(item => {
							yxfy_dpid.push(item.dpid);			//店铺id
							yxfy_dpmc.push(item.dpmc);			//店铺名称
							yxfy_ymb.push(item.ymb_yxfy);		//营销费用月目标
							yxfy_yxfyyg.push(item.yxfy);		//营销费用预估
							yxfy_wcl.push(item.wcl);			//营销费用完成率
						});
						var axis_03 = document.getElementById('axis_03');
						let axis_03Chart = echarts.getInstanceByDom(axis_03);
						if (axis_03Chart == null) { 
							this.axis_03Chart = echarts.init(axis_03);
						}
						this.axis_03Chart.setOption(this.axisOption(title,legend,yxfy_dpid,yxfy_dpmc,yxfy_ymb,yxfy_yxfyyg,yxfy_wcl));
						if(yxfy_chart.length > 1){
							this.show_axis_03 = true;
						}else{
							this.show_axis_03 = false;
						}

						var _this = this;
						window.addEventListener('resize',() => {
							_this.axis_01Chart.resize();
							_this.axis_02Chart.resize();
							_this.axis_03Chart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
},
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
			// 仪表盘
			option(item){
				return {
					title: {
						text: item.title,
						subtext:item.tag_message?item.tag_message:''
					},
					series: [{
						type: 'gauge',
						center: ["50%", "60%"], 
						radius: "100%", 
						startAngle: 215,
						endAngle: -35,
						min: 0,
						max: item.max_value,
						splitNumber: 2,
						itemStyle: {
							color: '#FD7B08',
						},
						progress: {
							show: true,
							roundCap: true,
							width: 18
						},
						pointer: {
							icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
							length: '75%',
							width: 16,
							offsetCenter: [0, '5%']
						},
						axisLine: {
							roundCap: true,
							lineStyle: {
								width: 18
							}
						},
						axisTick: {
							splitNumber: 2,
							lineStyle: {
								width: 2,
								color: '#999'
							}
						},
						splitLine: {
							length: 12,
							lineStyle: {
								width: 3,
								color: '#999'
							}
						},
						axisLabel: {
							distance: -40,
							color: '#999',
							formatter: '{value} 万'
						},
						title: {
							show: false
						},
						detail: {
							backgroundColor: '#fff',
							borderColor: '#999',
							width: '60%',
							lineHeight: 40,
							height: 40,
							borderRadius: 8,
							offsetCenter: [0, '35%'],
							valueAnimation: true,
							formatter: function (value) {
								return '{value|' + value.toFixed(2) + '}{unit|万}';
							},
							rich: {
								value: {
									fontSize: 20,
									fontWeight: 'bolder',
									color: '#333'
								},
								unit: {
									fontSize: 20,
									fontWeight: 'bolder',
									color: '#333',
								}
							}
						},
						data: [{
							value: item.current_value
						}]
					}]
				}
			},
            //柱状图加折线图
            axisOption(title,legend,dpid,dpmc,ymb,yg,wcl){
            	return {
            		title: {
            			text: title
            		},
            		tooltip: {
            			trigger: 'axis',
            			formatter: function (params) {
            				let dataIndex = params[params.length - 1].dataIndex;
            				let tip_dpid = dpid[dataIndex];
            				let tip_dpmc = dpmc[dataIndex];
            				let tip_ymb = ymb[dataIndex];
            				let tip_yg = yg[dataIndex];
            				let tip_wcl = wcl[dataIndex];
            				let tip = "";
            				if(params != null && params.length > 0) {
            					tip = "店铺ID：" + tip_dpid + "</br>"
            					+"店铺名称：" + tip_dpmc + "</br>"
            					+ legend[0] + "：" + tip_ymb + "万</br>"
            					+ legend[1] + "：" + tip_yg + "万</br>"
            					+ legend[2] + "：" + tip_wcl + "%";
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
            		color:['#9FAFFE','#FDD139', '#DE8337'],
            		legend: {
            			data: legend
            		},
            		grid:{
            			y2:300
            		},
            		xAxis: [{
            			type: 'category',
            			data: dpid,
            			axisLabel: {
            				color: '#333',
            				interval: 2,
            				rotate:70
            			}
            		}],
            		yAxis:[{
            			type: 'value',
            			axisLabel: {
            				formatter: '{value}万'
            			}
            		},{
            			type: 'value',
            			min: 0,
            			axisLabel: {
            				formatter: '{value} %'
            			}
            		}],
            		series: [{
            			name: legend[0],
            			type: 'bar',
            			stack: '2',
            			emphasis: {
            				focus: 'series'
            			},
            			data: ymb
            		},{
            			name: legend[1],
            			type: 'bar',
            			stack: '1',
            			barGap: '-120%',
            			barMaxWidth:"60%",
            			emphasis: {
            				focus: 'series'
            			},
            			data: yg
            		},{
            			name: legend[2],
            			type: 'line',
            			yAxisIndex:1,
            			lineStyle: { 
            				 width:3.6
            			},
            			emphasis: {
            				focus: 'series'
            			},
            			data: wcl
            		}]
            	}
            },

        },
        components:{
        	dps
        }
    }

</script>








