<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="品牌：">
				<el-select v-model="select_pp_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入品牌" :remote-method="ajaxPp" collapse-tags>
					<el-option v-for="item in pp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
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
		<div class="flex ac jsb mb-10">
			<PopoverWidget class="margin_bottom" title="事业部项目部--营销费用投产情况" keys="sybxmbyxfytcqk"/>
			<div class="flex ac">
				<el-button type="primary" size="small" @click="customFn('dept')">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="deptExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="dept_loading" :isLoading="dept_loading" max_height="560" :table_data="dept_business" :title_list="dept_title_list" :total_row="true" :table_total_data="dept_total_data"/>
		<!-- 店铺--营销费用投产情况 -->
		<div class="flex ac jsb mb-10 mt-10">
			<div class="custom_title">店铺--营销费用投产情况</div>
			<div class="flex ac">
				<el-button type="primary" size="small" @click="customFn('shop')">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="storeExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="shop_loading" :isLoading="shop_loading" max_height="560" :table_data="shop_business" :title_list="shop_title_list" :total_row="true" :table_total_data="shop_total_data"/>
		<page-widget :page="store_page" :pagesize="store_pagesize" :total="store_total" @handleSizeChange="storeSizeChange" @handlePageChange="storePageChange"/>
		<!-- 店铺日数据 -->
		<div class="flex ac jsb mb-10 mt-10">
			<div class="custom_title">店铺日数据</div>
			<el-button type="primary" size="small" @click="customFn('day')">自定义列表</el-button>
		</div>
		<custom-table v-loading="day_loading" :isLoading="day_loading" max_height="560" :table_data="day_data" :title_list="day_title_list" :sort_num="false" :total_row="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="day_page" :pagesize="day_pagesize" :total="day_total" @handleSizeChange="daySizeChange" @handlePageChange="dayPageChange"/>
		<!-- 自定义列表 -->
		<el-dialog title="（单击取消列表名保存直接修改）" :visible.sync="show_custom">
			<div class="select_box">
				<el-checkbox-group v-model="selected_ids">
					<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="Restore">恢复默认</el-button>
				<el-button size="small" @click="Restore('is_close')">取消</el-button>
				<el-button size="small" type="primary" @click="setColumns">保存</el-button>
			</div>
		</el-dialog>
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
	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	export default {
		data() {
			return {
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
				pp_list:[],									//品牌列表
				select_pp_list:[],							//选中的品牌列表
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
				dept_view_row:[],			//自定义表头
				dept_selected_ids:[],		//当前选中ID
				dept_total_data:{},			//项目部-营销费用投产情况（总计行）
				dept_loading:false,
				shop_business:[],			//店铺-营销费用投产情况
				store_total:0,
				shop_title_list:[],			//表头
				shop_view_row:[],			//自定义表头
				shop_selected_ids:[],		//当前选中ID
				shop_total_data:{},			//店铺-营销费用投产情况（总计行）
				shop_loading:false,
				store_pagesize:10,
				store_page:1,
				day_data:[],				//店铺日数据
				day_title_list:[],
				day_view_row:[],			//自定义表头
				day_selected_ids:[],		//当前选中ID
				day_total:0,
				day_loading:false,
				day_page:1,
				day_pagesize:10,
				sort:"",
				show_custom:false,			//自定义列表弹窗
				menu_id:'',					//菜单ID
				custom_type:'',	//自定义类型(dept:部门;shop:店铺;day:日数据）
				selected_ids:[],			//当前选中的所有ID
				view_row:[],				//当前的列表
			};
		},
		created(){
			//点击搜索
			this.searchFn();
		},
		methods: {
			//品牌列表
			ajaxPp(e){
				if(e != ''){
					resource.ajaxPp({name:e}).then(res => {
						if(res.data.code == 1){
							this.pp_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
			//点击搜索
			async searchFn(){
				//上面三个图表数据
				await this.businessChart();
				//项目部-营销费用投产情况
				await this.deptBusiness();
				//店铺—营销费用投产情况
				this.store_page = 1;
				this.store_pagesize = 10;
				await this.shopBusiness();
				//店铺日数据
				this.day_page = 1;
				this.day_pagesize = 10;
				this.sort = "";
				await this.shopDayBusiness()
			}, 
			//上面三个图表数据
			businessChart(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					pp:this.select_pp_list.join(','),
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
				}
				this.chart_loading = true;
				return new Promise((resolve)=>{
					resource.businessChart(arg).then(res => {
						resolve();
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
							item['show_value'] = item.xssr;
							item['value'] = item.xssr < 0?item.xssr*-1:item.xssr;
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
							item['show_value'] = item.xssr;
							item['value'] = item.xssr < 0?item.xssr*-1:item.xssr;
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
						// window.addEventListener('resize',() => {
						// 	this.blChart.resize();
						// });
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
				let show_value = api.value('show_value');
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
							text: idx < 5 || (value >= 100 && idx >= 5)?name + '\n' + `${show_value}万`:'',
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
					pp:this.select_pp_list.join(','),
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
				}
				this.dept_loading = true;
				this.dept_title_list = [];
				return new Promise((resolve)=>{
					resource.deptBusiness(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.dept_loading = false;
							let data = res.data.data;
							let dept_business = data.data;
							this.dept_view_row = data.all_rows;
							this.dept_selected_ids = data.selected_ids;
							let dept_title_list = data.table_title;
							dept_title_list.map(item => {
								if(item.row_field_name == 'mlv_rate'){
									item.type = '99';
								}
							})
							this.dept_title_list = dept_title_list;
							this.dept_business = dept_business;
							if(this.dept_business.length > 0){
								this.dept_total_data = this.dept_business[0];
								this.dept_business.splice(0,1);
							}else{
								this.dept_total_data = {};
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
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
						pp:this.select_pp_list.join(','),
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
					pp:this.select_pp_list.join(','),
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
					page:this.store_page,
					pagesize:this.store_pagesize
				}
				this.shop_loading = true;
				this.shop_title_list = [];
				return new Promise((resolve)=>{
					resource.shopBusiness(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.shop_loading = false;
							let data = res.data.data;
							this.shop_view_row = data.all_rows;
							this.shop_selected_ids = data.selected_ids;
							let shop_business = data.data.data;
							if(shop_business.length > 0){
								this.shop_total_data = shop_business[0];
								shop_business.splice(0,1);
							}else{
								this.shop_total_data = {};
							}
							this.shop_business = shop_business;
							this.store_total = data.data.total;

							let shop_title_list = data.table_title;
							shop_title_list.map(item => {
								if(item.row_field_name == 'mlv_rate' || item.row_field_name == 'yx_rate'){
									item.type = '98';
								}
							})
							this.shop_title_list = shop_title_list;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
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
						pp:this.select_pp_list.join(','),
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
					pp:this.select_pp_list.join(','),
					platform:this.pl.join(','),
					dept_id:this.dept_name.join(','),
					shop_id:this.shop_code.join(','),
					page:this.day_page,
					pagesize:this.day_pagesize,
					sort:this.sort
				}
				this.day_loading = true;
				this.day_title_list = [];
				return new Promise((resolve)=>{
					resource.shopDayBusiness(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.day_loading = false;
							let data = res.data.data;
							this.day_view_row = data.all_rows;
							this.day_selected_ids = data.selected_ids;
							this.day_data = data.data.data;
							this.day_total = data.data.total;
							this.day_title_list = data.table_title;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//排序回调
			sortCallBack(sort){
				this.sort = sort;
				//获取列表
				this.shopDayBusiness();
			},
			//店铺日数据
			daySizeChange(val) {
				this.day_pagesize = val;
				this.shopDayBusiness();
			},
			dayPageChange(val) {
				this.day_page = val;
				this.shopDayBusiness();
			},
			//点击自定义列
			customFn(type){
				this.custom_type = type;
				if(this.custom_type == 'dept'){
					this.view_row = this.dept_view_row;
					this.selected_ids = this.dept_selected_ids;
					this.menu_id = '144';
				}else if(this.custom_type == 'shop'){
					this.view_row = this.shop_view_row;
					this.selected_ids = this.shop_selected_ids;
					this.menu_id = '100005';
				}else if(this.custom_type == 'day'){
					this.view_row = this.day_view_row;
					this.selected_ids = this.day_selected_ids;
					this.menu_id = '100006';
				}
				this.show_custom = true;
			},
			//恢复默认
			Restore(type){
				this.selected_ids = [];
				if(this.custom_type == 'dept'){
					this.dept_view_row.map(item => {
						this.selected_ids.push(item.row_id)
					})
				}else if(this.custom_type == 'shop'){
					this.shop_view_row.map(item => {
						this.selected_ids.push(item.row_id)
					})
				}else if(this.custom_type == 'day'){
					this.day_view_row.map(item => {
						this.selected_ids.push(item.row_id)
					})
				}
				if(type == 'is_close'){
					this.show_custom = false;
				}
			},
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				resource.setColumns({menu_id:this.menu_id,row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						//获取列表
						if(this.custom_type == 'dept'){
							this.deptBusiness();
						}else if(this.custom_type == 'shop'){
							this.store_page = 1;
							this.store_pagesize = 10;
							this.shopBusiness();
						}else if(this.custom_type == 'day'){
							this.day_page = 1;
							this.day_pagesize = 10;
							this.sort = "";
							this.shopDayBusiness()
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
		},
		components:{
			dps,
			PopoverWidget,
			CustomTable,
			PageWidget
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
	font-weight: bold;
	color: #333333;
}
.b_l_chart{
	width: 100%;
	height: 480px;
	// display: flex;
	// align-items: center;
	// justify-content: center;
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
</style>
