<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="发货日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 折、柱一体图 -->
		<PopoverWidget class="margin_bottom" title="经营状况趋势图" keys="jyzkqst_list"/>
		<div class="b_l_chart" id="b_l_chart" v-loading="chart_loading"></div>
		<!-- 两个圆形图 -->
		<div class="custom_row">
			<div class="custom_item">
				<PopoverWidget class="margin_bottom" title="项目部-销售收入圆形图" keys="xmb_xssryxt_list"/>
				<div class="custom_chart" id="dept_custom" v-loading="chart_loading"></div>
			</div>
			<div class="custom_item">
				<PopoverWidget class="margin_bottom" title="店铺-销售收入圆形图" keys="dp_xssryxt_list"/>
				<div class="custom_chart" id="store_custom" v-loading="chart_loading"></div>
			</div>
		</div>
		<!-- 事业部项目部--营销费用投产情况 -->
		<div class="button_rows">
			<PopoverWidget class="margin_bottom" title="事业部项目部--营销费用投产情况" keys="sybxmbyxfytcqk"/>
			<el-button type="primary" plain size="small" @click="deptExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="dept_business" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' v-loading="dept_loading">
			<el-table-column :label="i.row_name" v-for="i in dept_title_list" show-overflow-tooltip :fixed="i.row_field_name == 'dept_name' || i.row_field_name == 'dept_2'">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.row_name" placement="top-start">
						<div class="text_content">{{i.row_name}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="text_content" :class="[{'red_style':i.row_field_name == 'mlv_rate' && scope.row[i.row_field_name] < 20},{'bold_style':scope.$index == 0}]" v-if="scope.$index == 0 || i.type == 0">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
					<div :class="{'red_style':i.row_field_name == 'mlv_rate' && scope.row[i.row_field_name] < 20}" :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else>{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 店铺--营销费用投产情况 -->
		<div class="button_rows">
			<div class="custom_title">店铺--营销费用投产情况</div>
			<el-button type="primary" plain size="small" @click="storeExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="shop_business" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' v-loading="shop_loading">
			<el-table-column :label="i.row_name" v-for="i in shop_title_list" show-overflow-tooltip :fixed="i.row_field_name == 'shop_code' || i.row_field_name == 'shop_name'">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.row_name" placement="top-start">
						<div class="text_content">{{i.row_name}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="text_content" :class="[{'red_style':(i.row_field_name == 'mlv_rate' && scope.row[i.row_field_name] < 20) || (i.row_field_name == 'yx_rate' && ((scope.row.platform == '淘宝' && scope.row[i.row_field_name] > 15) || (scope.row.platform == '天猫' && scope.row[i.row_field_name] > 20)))},{'bold_style':scope.$index == 0}]" v-if="scope.$index == 0 || i.type == 0">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
					<div :class="{'red_style':(i.row_field_name == 'mlv_rate' && scope.row[i.row_field_name] < 20) || (i.row_field_name == 'yx_rate' && ((scope.row.platform == '淘宝' && scope.row[i.row_field_name] > 15) || (scope.row.platform == '天猫' && scope.row[i.row_field_name] > 20)))}" :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else>{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="storeSizeChange" @current-change="storePageChange" :current-page="store_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="store_total">
			</el-pagination>
		</div>
		<!-- 店铺日数据 -->
		<div class="custom_title">店铺日数据</div>
		<el-table :data="day_data" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' @sort-change="daySortChange" v-loading="day_loading">
			<el-table-column :width="i.width" :prop="i.prop" v-for="i in day_title_list" show-overflow-tooltip align="center" sortable="custom">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.label" placement="top-start">
						<div class="text_content">{{i.label}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row[i.prop]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="daySizeChange($event,'store')" @current-change="dayPageChange($event,'store')" :current-page="day_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="day_total">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	import * as d3 from 'd3';
	import dps from '../../../components/results_components/dps.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'

	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default {
		data() {
			return {
				toast_list:[
				'退款率：售前售后退款/GMV（排刷单）',
				'销售收入（已发货）：具有发货时间订单',
				'销售收入（未发货）：订单状态为 发货中（打单拣货），已付款待审核，异常',
				'充值-营销费用：财务每日做账的充值金额',
				'实际-营销费用：店铺后台获取的实际花费金额',
				'差额-营销费用：充值-实际，存在充值金额大于实际花费金额情况，由于店铺帐号有余额',
				'ROI：实际营销费用/GMV',
				'营销费用占比：实际营销费用/销售收入（已发货），淘系C店参考线定为15%，天猫定为20%，高于则标记红色',
				'鱼塘开支：包含鱼塘快递，鱼塘佣金，买家秀佣金，淘宝客佣金，海外刷单佣金',
				'报销费用：包含事业部费用，项目部费用',
				'毛利率-营销费用占比：将20%作为参考线，低于则标记红色',
				'贡献毛益：毛利额-实际营销费用-事业部费用-项目部费用-店铺团队费用',
				'贡献毛益率：贡献毛益/销售收入（已发货）',
				],
				jyzkqst_list:[{
					label:"1.横坐标：",
					value:"发货日期"
				},{
					label:"2.指标解释：",
					value:""
				},{
					label:"GMV：",
					value:"包含刷单的销售金额"
				},{
					label:"GMV(排刷单)：",
					value:"排除刷单的销售金额"
				},{
					label:"销售收入-已发货：",
					value:"即销售收入，销售收入=销售发货金额-售后退款金额-线下退款金额预估+冲减收入"
				},{
					label:"毛利额：",
					value:"销售收入-销售成本，其中：销售收入=销售发货金额-售后退款金额-线下退款金额预估+冲减收入；销售成本=发货成本-退货进仓成本预估+成本差异金额"
				},{
					label:"实际-营销费用：",
					value:"店铺后台获取的实际花费金额"
				},{
					label:"毛利率：",
					value:"（销售收入-销售成本）/销售收入"
				},{
					label:"营销费用占比：",
					value:"实际营销费用/销售收入，淘系C店参考线定为15%，天猫定为20%，高于则标记红色"
				},{
					label:"贡献毛利率：",
					value:"贡献毛益/销售收入，贡献毛益=毛利额-实际营销费用-事业部费用-项目部费用-店铺团队费用"
				}],
				dept_name:[],								//项目部
				pl:[],										//平台
				shop_code:[],								//店铺
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
				},	 										
				date:[getMonthStartDate(),getNowDate()],			//时间区间
				colorList: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc'],
				blChart:null,				//经营状况趋势图
				empty_option:{
					title: {
						text: '暂无数据~',
						x: 'center',
						y: 'center',
						textStyle: {
							fontSize: 14,
							fontWeight: 'normal',
						}
					}
				},
				dept_custom_data:[],		//项目部销售收入圆形图
				deptCustomChart:null,
				store_custom_data:[],		//店铺销售收入圆形图
				storeCustomChart:null,
				chart_loading:false,
				dept_business:[],			//项目部-营销费用投产情况
				dept_title_list:[],			//表头
				dept_loading:false,
				shop_business:[],			//店铺-营销费用投产情况
				store_total:0,
				shop_title_list:[],			//表头
				shop_loading:false,
				store_pagesize:10,
				store_page:1,
				day_data:[],				//店铺日数据
				day_title_list:[{
					label:'发货日期',
					prop:'fhrq',
					width:'100',
				},{
					label:'事业部',
					prop:'dept_name',
					width:'100',
				},{
					label:'项目部',
					prop:'dept_2',
					width:'100',
				},{
					label:'店铺名称',
					prop:'shop_name',
					width:'120',
				},{
					label:'店铺ID',
					prop:'shop_code',
					width:'120',
				},{
					label:'GMV',
					prop:'xsje',
					width:'120',
				},{
					label:'GMV（排刷单）',
					prop:'qd_xsje',
					width:'120',
				},{
					label:'鱼塘金额',
					prop:'sd_xsje',
					width:'120',
				},{
					label:'鱼塘金额占比',
					prop:'sd_rate',
					width:'120',
				},{
					label:'退款率',
					prop:'tkl',
					width:'120',
				},{
					label:'销售收入-已发货',
					prop:'xssr',
					width:'120',
				},{
					label:'销售收入-未发货',
					prop:'wait_xsje',
					width:'120',
				},{
					label:'毛利率',
					prop:'mlv',
					width:'120',
				},{
					label:'充值-营销费用',
					prop:'recharge_yxfy',
					width:'120',
				},{
					label:'实际-营销费用',
					prop:'actual_yxfy',
					width:'120',
				},{
					label:'差额-营销费用',
					prop:'ce_yxfy',
					width:'120',
				},{
					label:'ROI(GMV/实际营销费用)',
					prop:'roi',
					width:'120',
				},{
					label:'营销费用占比(营销费用/销售收入已发货)',
					prop:'yx_rate',
					width:'120',
				},{
					label:'鱼塘开支',
					prop:'yt_cost',
					width:'120',
				},{
					label:'鱼塘开支占比',
					prop:'yt_rate',
					width:'120',
				},{
					label:'毛利率-营销费用占比',
					prop:'mlv_rate',
					width:'120',
				},{
					label:'报销费用',
					prop:'bxyj',
					width:'120',
				},{
					label:'贡献毛益',
					prop:'mlv_gx',
					width:'120',
				},{
					label:'贡献毛益率',
					prop:'mlv_gx_rate',
					width:'120',
				},{
					label:'鱼塘订单',
					prop:'yt_dd',
					width:'120',
				},{
					label:'发货订单',
					prop:'fh_dd',
					width:'120',
				},{
					label:'未发货订单',
					prop:'wait_dd',
					width:'120',
				},{
					label:'多件订单占比',
					prop:'multiple_rate',
					width:'120',
				},{
					label:'拆分订单占比',
					prop:'split_rate',
					width:'120',
				}],
				day_total:0,
				day_loading:false,
				day_page:1,
				day_pagesize:10,
				sort:""
			};
		},
		created(){
			//点击搜索
			this.searchFn();
		},
		methods: {
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
			//点击搜索
			searchFn(){
				//上面三个图表数据
				this.businessChart();
				//项目部-营销费用投产情况
				this.deptBusiness();
				//店铺—营销费用投产情况
				this.store_page = 1;
				this.store_pagesize = 10;
				this.shopBusiness();
				//店铺日数据
				this.day_page = 1;
				this.day_pagesize = 10;
				this.shopDayBusiness()
			}, 
			//上面三个图表数据
			businessChart(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
				}
				this.chart_loading = true;
				resource.businessChart(arg).then(res => {
					if(res.data.code == 1){
						this.chart_loading = false;
						var echarts = require("echarts");
						let data = res.data.data;
						//经营状况趋势图
						let x_axis = data.date;	//横坐标
						let legend = [];		//图例名称
						let chart_list = data.chart;	//原始数据
						let series_data = [];			//新数据（可直接渲染）
						chart_list.map(item => {
							legend.push(item.name);
							let new_item = {
								name: item.name,
								type: item.type,
								markPoint: {
									label:{
										formatter:function(c){
											return c.value + (item.type == 'bar'?'万':'%')
										}
									},
									symbolSize:10,
									data: [
									{ type: 'max', name: 'Max' },
									{ type: 'min', name: 'Min' }
									]
								},
								yAxisIndex:item.type == 'bar'?0:1,
								data: item.value
							};
							series_data.push(new_item)
						})
						var b_l_chart = document.getElementById('b_l_chart');
						this.blChart = echarts.getInstanceByDom(b_l_chart)
						if (this.blChart == null) { 
							this.blChart = echarts.init(b_l_chart);
						}
						this.blChart.setOption(this.setOptions(legend,x_axis,series_data));
						//部门圆形图
						let dept_custom_data = data.dept_chart;
						dept_custom_data.map(item => {
							item['id'] = `dept.${item.dept_2}`;
							item['name'] = item.dept_2;
							item['value'] = item.xssr;
							item['unit'] = '万';
						})
						if(dept_custom_data.length > 0){
							dept_custom_data.unshift({
								id:'dept',
								name:'最外层',
								value:0,
								unit:'万'
							})
							dept_custom_data.sort(this.compare("value"));
						}
						this.dept_custom_data = dept_custom_data;
						var dept_custom = document.getElementById('dept_custom');
						this.deptCustomChart = echarts.getInstanceByDom(dept_custom)
						if (this.deptCustomChart == null) { 
							this.deptCustomChart = echarts.init(dept_custom);
						}
						this.deptCustomChart.setOption(this.setChartOptions(dept_custom_data,'dept'));
						//店铺圆形图
						let store_custom_data = data.shop_chart;
						store_custom_data.map(item => {
							item['id'] = `store.${item.shop_code}`;
							item['name'] = item.shop_code;
							item['value'] = item.xssr;
							item['unit'] = '万';
						})
						store_custom_data.unshift({
							id:'store',
							name:'最外层',
							value:0,
							unit:'万'
						})
						store_custom_data.sort(this.compare("value"));
						this.store_custom_data = store_custom_data;
						var store_custom = document.getElementById('store_custom');
						this.storeCustomChart = echarts.getInstanceByDom(store_custom)
						if (this.storeCustomChart == null) { 
							this.storeCustomChart = echarts.init(store_custom);
						}
						this.storeCustomChart.setOption(store_custom_data.length == 1?this.empty_option:this.setChartOptions(this.store_custom_data,'store'));
						window.addEventListener('resize',() => {
							this.blChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
			compare(property) {
				return function (a, b) {
					var value1 = a[property];
					var value2 = b[property];
					return value2 - value1;
				}
			},
			//折、柱一体图表
			setOptions(legend,x_axis,series_data){
				if(series_data.length == 0){
					this.blChart.clear();
					return this.empty_option;
				}else{
					this.blChart.clear();
					return {
						tooltip: {
							trigger: 'axis',
							formatter: function (params) {
								let tip = "";
								if(params != null && params.length > 0) {
									tip = params[0].axisValueLabel + "</br>";
									params.map(item => {
										tip += item.seriesName + "：" + item.value + (item.seriesType == 'bar'?'万':'%') + "</br>";
									})
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
						legend: {
							data: legend
						},
						grid:{
							y2:80
						},
						xAxis: [{
							type: 'category',
							data: x_axis,
							axisLabel: {
								color: '#333',
								interval: 2,
								rotate:70
							}
						}],
						yAxis:[{
							type: 'value',
							axisLabel: {
								formatter: '{value} 万'
							}
						},{
							type: 'value',
							axisLabel: {
								formatter: '{value} %'
							}
						}],
						series: series_data
					}
				}
			},
			//圆形图表配置
			setChartOptions(series_data,type){
				if(series_data.length == 0){
					this.deptCustomChart.clear();
					this.storeCustomChart.clear();
					// if(type == 'dept'){
					// 	this.deptCustomChart.clear();
					// }
					// if(type == 'store'){
					// 	this.storeCustomChart.clear();
					// }
					return this.empty_option;
				}else{
					if(type == 'dept'){
						this.deptCustomChart.clear();
					}
					if(type == 'store'){
						this.storeCustomChart.clear();
					}
					return {
						dataset: {
							source: series_data
						},
						tooltip: {
						},
						series: [{
							type: 'custom',
							colorBy: 'data',
							renderItem: this.renderItem,
							coordinateSystem: 'none',
							encode: {
								tooltip: ['value','unit'],
								itemName: 'name'
							}
						}]
					}
				}
			},
			renderItem(params, api) {
				let context = params.context;
				let idx = params.dataIndex;
				let id = api.value('id');
				if (!context.layout) {
					context.layout = true;
					this.overallLayout(params, api,id.split('.')[0]);
				}
				let name = api.value('name');
				let value = api.value('value');
				let node = context.nodes[id];
				if (node.id === id.split('.')[0]) {
					node.r = 0
				}
				if (!node) {
					return;
				}
				return {
					type: 'circle',
					shape: {
						cx: node.x,
						cy: node.y,
						r: node.r
					},
					textContent: {
						type: 'text',
						style: {
							text: idx < 5 || (value >= 100 && idx >= 5)?name + '\n' + `${value}万`:'',
							fill: '#fff',
							fontFamily: 'Arial',
							width: node.r * 1.3,
							overflow: 'truncate',
							fontSize: node.r / 6
						}
					},
					textConfig: {
						position: 'inside'
					},
					style: {
						fill: this.colorList[idx % this.colorList.length]
					},
					emphasis: {
						style: {
							fontFamily: 'Arial',
							fontSize: 12,
							shadowBlur: 20,
							shadowOffsetX: 3,
							shadowOffsetY: 5,
							shadowColor: 'rgba(0,0,0,0.3)'
						}
					}
				};
			},
			overallLayout(params, api,type) {
				let displayRoot = this.stratify1(type);
				let context = params.context;
				d3.pack().size([api.getWidth() - 2, api.getHeight() - 2]).padding(0)(displayRoot);
				context.nodes = {};
				displayRoot.descendants().forEach(function (node) {
					context.nodes[node.id] = node;
				});
			},
			stratify1(type) {
				return d3.stratify().parentId(function (d) {
					return d.id.substring(0, d.id.lastIndexOf('.'));
				})(this[`${type}_custom_data`]).sum(function (d) {
					return d.value || 0;
				}).sort(function (a, b) {
					return b.value - a.value;
				});
			},
			//项目部-营销费用投产情况
			deptBusiness(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
				}
				this.dept_loading = true;
				resource.deptBusiness(arg).then(res => {
					if(res.data.code == 1){
						this.dept_loading = false;
						this.dept_business = res.data.data.data;
						this.dept_title_list = res.data.data.table_title;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//项目部-导出
			deptExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						start_time:this.date && this.date.length> 0?this.date[0]:"",
						end_time:this.date && this.date.length> 0?this.date[1]:"",
						platform:this.pl.join(','),
						dept_id:this.dept_name.join(','),
						shop_id:this.shop_code.join(','),
					}
					resource.deptBusinessExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'项目部-营销费用投产情况');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//店铺—营销费用投产情况
			shopBusiness(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
					page:this.store_page,
					pagesize:this.store_pagesize
				}
				this.shop_loading = true;
				resource.shopBusiness(arg).then(res => {
					if(res.data.code == 1){
						this.shop_loading = false;
						this.shop_business = res.data.data.data.data;
						this.store_total = res.data.data.data.total;
						this.shop_title_list = res.data.data.table_title;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺-导出
			storeExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						start_time:this.date && this.date.length> 0?this.date[0]:"",
						end_time:this.date && this.date.length> 0?this.date[1]:"",
						platform:this.pl.join(','),
						dept_id:this.dept_name.join(','),
						shop_id:this.shop_code.join(','),
					}
					resource.shopBusinessExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'店铺-营销费用投产情况');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//店铺—营销费用投产情况分页
			storeSizeChange(val) {
				this.store_pagesize = val;
				this.shopBusiness();
			},
			storePageChange(val) {
				this.store_page = val;
				this.shopBusiness();
			},
			//店铺日数据
			shopDayBusiness(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
					page:this.day_page,
					pagesize:this.day_pagesize,
					sort:this.sort
				}
				this.day_loading = true;
				resource.shopDayBusiness(arg).then(res => {
					if(res.data.code == 1){
						this.day_loading = false;
						this.day_data = res.data.data.data;
						this.day_total = res.data.data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序    
			daySortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				} else{
					this.sort = "";
				}   
				this.shopDayBusiness();
			}, 
			//店铺—营销费用投产情况分页
			daySizeChange(val) {
				this.day_pagesize = val;
				this.shopDayBusiness();
			},
			dayPageChange(val) {
				this.day_page = val;
				this.shopDayBusiness();
			},
		},
		components:{
			dps,
			PopoverWidget
		}
	}

</script>
<style type="text/css">
.el-table th>.cell{
	display: flex!important;
	align-items: center!important;
	justify-content: center!important;
}
</style>
<style lang="less" scoped>
.custom_title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-weight: bold;
	color: #333333;
}
.b_l_chart{
	width: 100%;
	height: 480px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.custom_row{
	width: 100%;
	display: flex;
	justify-content: space-between;
	.custom_item{
		width: 650px;
		.custom_chart{
			width: 600px;
			height: 600px;
		}
	}
}
.margin_bottom{
	margin-bottom: 15px;
}
.text_content{
	overflow: hidden;/*超出部分隐藏*/
	white-space: nowrap;/*不换行*/
	text-overflow:ellipsis;/*超出部分文字以...显示*/
}
.bold_style{
	font-size: 14px;
	color: #333333;
	font-weight: bold;
}
.red_style{
	color: red;
}
.button_rows{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
</style>
