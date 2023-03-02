<template>
	<div class="send_view pr-10 pl-10 pb-20">
		<!-- 头部信息 -->
		<div class="top_content relative flex ac jsa mb-10">
			<div class="top_item background_color height-100 flex fc ac">
				<div class="width-100 flex ac jsb">
					<div class="red_color f12">今日代发订单监控</div>
					<PopoverWidget keys="jrdfddjk" :use_icon="true"/>
				</div>
				<div class="color_item relative flex fc ac jc fw-500 f16 dfdds" @click="getOrderList(1)">
					<div class="mb-17">代发订单数</div>
					<div>{{top_info.total_num}}</div>
					<div class="l_line absolute"></div>
					<div class="r_line absolute"></div>
				</div>
				<div class="c_c_line"></div>
				<div class="width-100 flex jsb">
					<div class="color_item flex fc ac jc fw-500 f16 wsh" @click="getOrderList(2)">
						<div class="mb-17">代发订单未审核</div>
						<div>{{top_info.today_uncheck_num}}</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 fhs" @click="getOrderList(3)">
						<div class="mb-17">代发订单发货数</div>
						<div>{{top_info.today_order_sented_num}}</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 ysh" @click="getOrderList(4)">
						<div class="mb-17">代发订单已审核</div>
						<div>{{top_info.today_checked_num}}</div>
					</div>
				</div>
			</div>
			<div class="flex fc ac jsb">
				<div class="center_card flex fc jsa">
					<div class="flex ac jsb f14">
						<div class="flex ac">
							<div class="yuan yuan_1"></div>
							<div>今日发货率</div>
						</div>
						<div class="rate_1">{{top_info.fhl_today}}</div>
					</div>
					<div class="flex ac jsb f14">
						<div class="flex ac">
							<div class="yuan yuan_2"></div>
							<div>24小时发货率</div>
						</div>
						<div class="rate_2">{{top_info.fhl_24}}</div>
					</div>
					<div class="flex ac jsb f14">
						<div class="flex ac">
							<div class="yuan yuan_3"></div>
							<div>48小时发货率</div>
						</div>
						<div class="rate_3">{{top_info.fhl_48}}</div>
					</div>
					<div class="flex ac jsb f14">
						<div class="flex ac">
							<div class="yuan yuan_4"></div>
							<div>72小时发货率</div>
						</div>
						<div class="rate_4">{{top_info.fhl_72}}</div>
					</div>
				</div>
				<div class="center_box flex fc ac jc" @click="getOrderList(5)">
					<div class="normal f22 white_color mb-13">{{top_info.today_sented_num}}</div>
					<div class="f16 fw-600 white_color">代发今日已发货</div>
				</div>
			</div>
			<div class="top_item background_color height-100 flex fc ac">
				<div class="width-100 flex ac jsb">
					<div class="red_color f12">截至当前代发订单监控</div>
					<PopoverWidget keys="dfkb" :use_icon="true"/>
				</div>
				<div class="r_item relative flex ac pl-14 mb-40" @click="getOrderList(7)">
					<img class="send_view_icon mr-14" src="../../static/send_view_02.png">
					<div class="r_content flex fc as jsb">
						<div class="dark_color f16">代发未发货</div>
						<div class="bold f22">{{top_info.unsent_num}}</div>
					</div>
					<div class="r_l_line absolute"></div>
					<div class="r_r_line absolute"></div>
				</div>
				<div class="width-100 flex jsb">
					<div class="r_item flex ac pl-14" @click="getOrderList(6)">
						<img class="send_view_icon mr-14" src="../../static/send_view_03.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">48小时内未发货</div>
							<div class="bold f22">{{top_info.unsented_less_twodays_num}}</div>
						</div>
					</div>
					<div class="r_item flex ac pl-14" @click="getOrderList(8)">
						<img class="send_view_icon mr-14" src="../../static/send_view_04.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">超48小时未发货</div>
							<div class="bold f22">{{top_info.unsented_more_twodays_num}}</div>
						</div>
					</div>
				</div>
			</div>
			<i class="refresh el-icon-refresh" @click="refreshFn"></i>
		</div>
		<!-- 图表 -->
		<div class="white_back p10 mb-10">
			<div class="flex ac jsb f16">
				<el-radio-group v-model="charts_type" size="mini">
					<el-radio-button label="today">今日代发概览</el-radio-button>
					<el-radio-button label="month">30日代发订单</el-radio-button>
				</el-radio-group>
				<div class="f12 red_color" v-if="charts_type == 'today'">更新时间：{{today_update_time}}</div>
			</div>
			<div class="charts" id="chart_view" v-loading="charts_loading"></div>
		</div>
		<!-- 明细 -->
		<div class="flex jsb mb-10">
			<div class="white_back p10" style="width: 50%">
				<div class="flex ac jsb f16 mb-10">
					<div class="bold">店铺代发明细表</div>
					<div class="f12 red_color">更新时间：{{store_update_time}}</div>
				</div>
				<div class="flex ac jsb mb-10">
					<el-input style="width: 200px" placeholder="请输入店铺名称" size="mini" v-model="store_name">
						<el-button slot="append" icon="el-icon-search" @click="dfShopGysList('shop_name')"></el-button>
					</el-input>
					<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
						<img class="export_icon" src="../../static/export_icon.png" @click="exportRecordFn('shop_name',store_name,'店铺代发明细表')">
					</el-tooltip>
				</div>
				<custom-table v-loading="store_record_loading" :show_index="true" :table_data="store_record_table_list" :title_list="store_record_title_list"/>
			</div>
			<div class="ml-15 white_back p10" style="width: 50%">
				<div class="flex ac jsb f16 mb-10">
					<div class="bold">供应商代发明细表</div>
					<div class="f12 red_color">更新时间：{{supplier_update_time}}</div>
				</div>
				<div class="flex ac jsb mb-10">
					<el-input style="width: 200px" placeholder="请输入供应商名称" size="mini" v-model="supplier_name">
						<el-button slot="append" icon="el-icon-search" @click="dfShopGysList('supplier_name')"></el-button>
					</el-input>
					<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
						<img class="export_icon" src="../../static/export_icon.png" @click="exportFn('supplier_name',supplier_name,'供应商代发明细表')">
					</el-tooltip>
				</div>
				<custom-table v-loading="supplier_record_loading" :show_index="true" :table_data="supplier_record_table_list" :title_list="supplier_record_title_list"/>
			</div>
		</div>
		<!-- 各种排行 -->
		<div class="flex jsb mb-10">
			<!-- 商品 -->
			<div class="white_back p10" style="width: 33%">
				<div class="flex ac jsb f16 mb-10">
					<div class="bold">商品代发排行</div>
					<div class="f12 red_color">实时更新</div>
				</div>
				<div class="flex ac jsb mb-10">
					<el-radio-group v-model="i_date_type" size="mini">
						<el-radio-button label="today">当日</el-radio-button>
						<el-radio-button label="week">本周</el-radio-button>
						<el-radio-button label="month">本月</el-radio-button>
					</el-radio-group>
					<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
						<img class="export_icon" src="../../static/export_icon.png" @click="exportFn('i_id',i_date_type,'商品代发排行')">
					</el-tooltip>
				</div>
				<custom-table v-loading="sp_loading" :show_index="true" :table_data="i_table_data" :title_list="i_title_list" :is_wrap="true"/>
			</div>
			<!-- 供应商 -->
			<div class="white_back p10 ml-15 mr-15" style="width: 33%">
				<div class="flex ac jsb f16 mb-10">
					<div class="bold">供应商代发排行</div>
					<div class="f12 red_color">实时更新</div>
				</div>
				<div class="flex ac jsb mb-10">
					<el-radio-group v-model="gys_date_type" size="mini">
						<el-radio-button label="today">当日</el-radio-button>
						<el-radio-button label="week">本周</el-radio-button>
						<el-radio-button label="month">本月</el-radio-button>
					</el-radio-group>
					<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
						<img class="export_icon" src="../../static/export_icon.png" @click="exportFn('supplier_name',gys_date_type,'供应商代发排行')">
					</el-tooltip>
				</div>
				<custom-table v-loading="gys_loading" :show_index="true" :table_data="gys_table_data" :title_list="gys_title_list" :is_wrap="true"/>
			</div>
			<!-- 店铺 -->
			<div class="white_back p10" style="width: 33%">
				<div class="flex ac jsb f16 mb-10">
					<div class="bold">店铺代发排行</div>
					<div class="f12 red_color">实时更新</div>
				</div>
				<div class="flex ac jsb mb-10">
					<el-radio-group v-model="dp_date_type" size="mini">
						<el-radio-button label="today">当日</el-radio-button>
						<el-radio-button label="week">本周</el-radio-button>
						<el-radio-button label="month">本月</el-radio-button>
					</el-radio-group>
					<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
						<img class="export_icon" src="../../static/export_icon.png" @click="exportFn('shop_name',dp_date_type,'店铺代发排行')">
					</el-tooltip>
				</div>
				<custom-table v-loading="dp_loading" :show_index="true" :table_data="dp_table_data" :title_list="dp_title_list" :is_wrap="true"/>
			</div>
		</div>
		<!-- 发货平均时效统计 -->
		<div class="white_back p10 mb-10">
			<div class="flex ac jsb f16 mb-10">
				<div class="bold">发货平均时效统计</div>
				<div class="f12 red_color">实时更新</div>
			</div>
			<div class="flex ac jsb mb-10">
				<el-radio-group v-model="pjsx_date_type" size="mini">
					<el-radio-button label="week">近一周</el-radio-button>
					<el-radio-button label="month">本月</el-radio-button>
				</el-radio-group>
				<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
					<img class="export_icon" src="../../static/export_icon.png" @click="exportPjsxFn">
				</el-tooltip>
			</div>
			<custom-table v-loading="pjsx_loading" :show_index="true" :table_data="pjsx_table_data" :title_list="pjsx_title_list"/>
		</div>
		<!-- 发货即将超时统计 -->
		<div class="white_back p10">
			<div class="flex ac jsb f16 mb-10">
				<div class="bold">发货即将超时统计</div>
				<div class="f12 red_color">实时更新</div>
			</div>
			<div class="flex ac jsb mb-10">
				<el-radio-group v-model="jjcs_date_type" size="mini">
					<el-radio-button label="week">近一周</el-radio-button>
					<el-radio-button label="month">本月</el-radio-button>
				</el-radio-group>
				<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
					<img class="export_icon" src="../../static/export_icon.png" @click="exportJjcsFn">
				</el-tooltip>
			</div>
			<custom-table v-loading="jjcs_loading" :show_index="true" :table_data="jjcs_table_data" :title_list="jjcs_title_list"/>
		</div>
	</div>
</template>
<script>
	import {lastXDate,getNowDate} from '../../api/nowMonth.js'
	import resource from '../../api/replaceSend.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import PopoverWidget from '../../components/popover_widget.vue'

	import CustomTable from '../../components/custom_table.vue'
	export default{
		data(){
			return {
				top_info:{},						//头部数据
				charts_loading:false,
				charts_type:'today',				//今日/30日代发概览
				month_data:{},						//30日代发订单图表
				today_data:{},						//今日代发概览图表
				today_update_time:"",				//今日代发图表更新时间
				store_name:"",						//店铺明细（店铺名称）
				store_record_loading:false,			
				store_record_title_list:[],			//店铺明细表格头部列表
				store_record_table_list:[],			//店铺明细表格数据列表
				store_update_time:"",				
				supplier_name:"",					//供应商明细（供应商名称）
				supplier_record_loading:false,			
				supplier_record_title_list:[],		//供应商明细表格头部列表
				supplier_record_table_list:[],		//供应商明细表格数据列表
				supplier_update_time:"",	
				i_date_type:"today",				//商品时间类型
				sp_loading:false,
				i_title_list:[],					//商品头部列表
				i_table_data:[],					//商品数据列表
				gys_date_type:"today",				//供应商时间类型
				gys_loading:false,
				gys_title_list:[],					//供应商头部列表
				gys_table_data:[],					//供应商数据列表
				dp_date_type:"today",				//店铺时间类型
				dp_loading:false,
				dp_title_list:[],					//店铺头部列表
				dp_table_data:[],					//店铺数据列表
				pjsx_date_type:"week",				//发货平均时效统计
				pjsx_loading:false,
				pjsx_title_list:[],					//发货平均时效头部列表
				pjsx_table_data:[],					//发货平均时效列表
				jjcs_date_type:"week",				//发货即将超时统计
				jjcs_loading:false,
				jjcs_title_list:[],					//发货即将超时头部列表
				jjcs_table_data:[],					//发货即将超时列表
				viewChart:null
			}
		},
		created(){
			this.refreshFn();
		},
		watch:{
			//今日/30日代发概览
			charts_type:function(n,o){
				if(this.viewChart){
					this.viewChart.clear();
					this.viewChart = null;
				}
				if(n == 'today'){	//今日
					//今日代发概览图表渲染
					this.todayCharts();
				}else{				//30日
					//30天代发订单图表渲染
					this.monthCharts();
				}
			},
			//切换商品时间类型
			i_date_type:function(n,o){
				//商品代发排行
				this.dfSpData();
			},
			//切换供应商时间类型
			gys_date_type:function(n,o){
				//供应商代发排行
				this.gysData();
			},
			//切换店铺时间类型
			dp_date_type:function(n,o){
				//店铺代发排行
				this.dpData();
			},
			//切换发货平均时效时间类型
			pjsx_date_type:function(n,o){
				//代发看板发货平均时效统计
				this.dfAverageDelivery();
			},
			//切换发货超时未发时间类型
			jjcs_date_type:function(n,o){
				//代发看板发货超时未发统计
				this.dfOverTime();
			},
		},
		methods:{
			//刷新
			async refreshFn(){
				this.top_info = {};						//头部数据
				this.charts_loading = false;
				this.charts_type = 'today';				//今日/30日代发概览
				this.month_data = {};						//30日代发订单图表
				this.today_data = {};						//今日代发概览图表
				this.today_update_time = "";				//今日代发图表更新时间
				this.store_name = "";						//店铺明细（店铺名称）
				this.store_record_loading = false;			
				this.store_record_title_list = [];			//店铺明细表格头部列表
				this.store_record_table_list = [];			//店铺明细表格数据列表
				this.store_update_time = "";				
				this.supplier_name = "";					//供应商明细（供应商名称）
				this.supplier_record_loading = false;			
				this.supplier_record_title_list = [];		//供应商明细表格头部列表
				this.supplier_record_table_list = [];		//供应商明细表格数据列表
				this.supplier_update_time = "";	
				this.i_date_type = "today";				//商品时间类型
				this.sp_loading = false;
				this.i_title_list = [];					//商品头部列表
				this.i_table_data = [];					//商品数据列表
				this.gys_date_type = "today";				//供应商时间类型
				this.gys_loading = false;
				this.gys_title_list = [];					//供应商头部列表
				this.gys_table_data = [];					//供应商数据列表
				this.dp_date_type = "today";				//店铺时间类型
				this.dp_loading = false;
				this.dp_title_list = [];					//店铺头部列表
				this.dp_table_data = [];					//店铺数据列表
				this.pjsx_date_type = "week";				//发货平均时效统计
				this.pjsx_loading = false;
				this.pjsx_title_list = [];					//发货平均时效头部列表
				this.pjsx_table_data = [];					//发货平均时效列表
				this.jjcs_date_type = "week";				//发货即将超时统计
				this.jjcs_loading = false;
				this.jjcs_title_list = [];					//发货即将超时头部列表
				this.jjcs_table_data = [];					//发货即将超时列表
				//头部信息
				await this.dfOrderTotal();
				//30天和今天代发订单图表
				await this.dfChart();
				//店铺代发明细
				await this.dfShopGysList('shop_name');
				//供应商代发明细
				await this.dfShopGysList('supplier_name');
				//商品代发排行
				await this.dfSpData();
				//供应商代发排行
				await this.gysData();
				//店铺代发排行
				await this.dpData();
				//代发看板发货平均时效统计
				await this.dfAverageDelivery();
				//代发看板发货超时未发统计
				await this.dfOverTime();
			},
			//头部信息
			dfOrderTotal(){
				return new Promise((resolve)=>{
					resource.dfOrderTotal().then(res => {
						resolve();
						if(res.data.code == 1){
							this.top_info = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//点击跳转到订单列表页面
			getOrderList(type){
				var arg = {};
				switch(type){
					case 1: //代发订单数
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:[],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 2: //代发订单未审核
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['WaitConfirm','Question'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 3: //代发订单发货数
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['Sent'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 4: //代发订单已审核
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 5: //代发今日已发货
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['Sent'],
						time_type:2
					}
					this.$emit('callback',arg);
					break;
					case 6: //48小时内未发货
					arg = {
						start_date:lastXDate(2,true),
						end_date:getNowDate(true),
						order_status:['WaitConfirm','Question','WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 7: //代发今日未发货
					arg = {
						start_date:'',
						end_date:'',
						order_status:['WaitConfirm','Question','WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 8: //超48小时未发货订单数
					arg = {
						start_date:'',
						end_date:lastXDate(2,true),
						order_status:['WaitConfirm','Question','WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					default:
					return;
				}
			},
			//30天和今天代发订单图表
			dfChart(){
				this.charts_loading = true;
				return new Promise((resolve)=>{
					resource.dfChart().then(res => {
						resolve();
						if(res.data.code == 1){
							this.charts_loading = false;
							let data = res.data.data;
							this.month_data = data.month;
							this.today_data = data.today;
							this.today_update_time = this.today_data.update_time;
						//今日代发概览图表渲染
						this.todayCharts();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
				})
			},
			//今日代发概览图表渲染
			todayCharts(){
				var echarts = require("echarts");
				var chart_view = document.getElementById('chart_view');
				this.viewChart = echarts.getInstanceByDom(chart_view)
				this.viewChart = echarts.init(chart_view);

				let x_data = this.today_data.hour_list;
				let today_data = [];
				let yesterday_data = [];
				let last_week_data = [];
				let zb_data = [];
				this.today_data.list.map(item => {
					today_data.push(item.today_money);
					yesterday_data.push(item.yesterday_money);
					last_week_data.push(item.last_week_money);
					let zb_obj = {
						yesterday_zb:item.yesterday_zb,
						last_week_zb:item.last_week_zb
					}
					zb_data.push(zb_obj)
				})

				this.viewChart.setOption({
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = "";
							if(params.length > 0){
								tip += `${params[0].seriesName}：${params[0].value}</br>`;
							}
							
							tip += `较昨日:${zb_data[params[0].dataIndex].yesterday_zb}&nbsp&nbsp&nbsp&nbsp较上周:${zb_data[params[0].dataIndex].last_week_zb}</br>`;
							if(params.length > 1){
								tip += `${params[1].seriesName}：${params[1].value}</br>`;
							}
							if(params.length > 2){
								tip += `${params[2].seriesName}：${params[2].value}</br>`;
							}
							return tip;
						},
						backgroundColor:"#ffffff",
						textStyle:{
							color:"#333333",
							fontSize:14
						},
						axisPointer: {            
							type: 'shadow'     
						}
					},
					grid:{
						left:80,
						top:60,
						bottom:30,
						right:50
					},
					legend: {
						data: ['今日','昨日','上周']
					},
					xAxis: [{
						type: 'category',
						data: x_data,
					}],
					yAxis:[{
						type: 'value',
						axisLabel: {
							formatter: '{value}'
						}
					}],
					series: [{
						name: "今日",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: today_data
					},{
						name: "昨日",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: yesterday_data
					},{
						name: "上周",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: last_week_data
					}]
				});
				window.addEventListener('resize',() => {
					this.viewChart.resize();
				});
			},
			//30天代发订单图表渲染
			monthCharts(){
				var echarts = require("echarts");
				var chart_view = document.getElementById('chart_view');
				this.viewChart = echarts.getInstanceByDom(chart_view)
				this.viewChart = echarts.init(chart_view);

				let x_data = this.month_data.day_list;
				let order_num_list = this.month_data.order_num_list.list;
				let money_list = this.month_data.money_list.list;
				
				this.viewChart.setOption({
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = `时间：${params[0].name}</br>`;
							params.map((item,index) => {
								tip += `${item.seriesName}：${item.value}${index == 0?'单':'元'}</br>`
							})
							return tip;
						},
						backgroundColor:"#ffffff",
						textStyle:{
							color:"#333333",
							fontSize:14
						},
						axisPointer: {            
							type: 'shadow'     
						}
					},
					grid:{
						left:80,
						top:60,
						bottom:30,
						right:80
					},
					legend: {
						data: ['代发订单', '代发金额']
					},
					xAxis: [{
						type: 'category',
						data: x_data
					}],
					yAxis:[{
						type: 'value',
						name:'代发订单（单）',
						axisLabel: {
							formatter: '{value}'
						}
					},{
						type: 'value',
						name:'代发金额（元）',
						axisLabel: {
							formatter: '{value}'
						}
					}],
					series: [{
						name: '代发订单',
						type: 'bar',
						yAxisIndex:0,
						emphasis: {
							focus: 'series'
						},
						data: order_num_list
					},{
						name: '代发金额',
						type: 'line',
						yAxisIndex:1,
						lineStyle: { 
							 width:3.6
						},
						emphasis: {
							focus: 'series'
						},
						data: money_list
					}]
				});
				window.addEventListener('resize',() => {
					this.viewChart.resize();
				});
			},
			//店铺/供应商代发明细
			dfShopGysList(type){
				let arg = {
					type:type,
					search:this.store_name
				}
				if(type == 'shop_name'){
					arg['search'] = this.store_name;
					this.store_record_loading = true;
				}else{
					arg['search'] = this.supplier_name;
					this.supplier_record_loading = true;
				}
				return new Promise((resolve)=>{
					resource.dfShopGysList(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							let data = res.data.data;
							if(type == 'shop_name'){
								this.store_record_title_list = data.title_list;
								this.store_record_table_list = data.table_data;
								this.store_update_time = data.update_time;
								this.store_record_loading = false;
							}else{
								this.supplier_record_title_list = data.title_list;
								this.supplier_record_table_list = data.table_data;
								this.supplier_update_time = data.update_time;
								this.supplier_record_loading = false;
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//店铺/供应商代发明细导出
			exportRecordFn(type,search,title){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						type:type,
						search:search
					}
					resource.dfShopGysExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,title);
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//商品代发排行
			dfSpData(){
				let arg = {
					type:'i_id',
					date_type:this.i_date_type
				}
				this.sp_loading = true;
				return new Promise((resolve)=>{
					resource.dfShopKsbmGys(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.sp_loading = false;
							this.i_title_list = res.data.data.title_list;
							this.i_table_data = res.data.data.table_data;
							this.i_table_data.map(item => {
								item['images'] = [item.pic];
							})
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//供应商代发排行
			gysData(){
				let arg = {
					type:'supplier_name',
					date_type:this.gys_date_type
				}
				this.gys_loading = true;
				return new Promise((resolve)=>{
					resource.dfShopKsbmGys(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.gys_loading = false;
							this.gys_title_list = res.data.data.title_list;
							this.gys_table_data = res.data.data.table_data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//店铺代发排行
			dpData(){
				let arg = {
					type:'shop_name',
					date_type:this.dp_date_type
				}
				this.dp_loading = true;
				return new Promise((resolve)=>{
					resource.dfShopKsbmGys(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.dp_loading = false;
							this.dp_title_list = res.data.data.title_list;
							this.dp_table_data = res.data.data.table_data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//店铺、商品、供应商代发排行导出
			exportFn(type,date_type,title){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						type:type,
						date_type:date_type
					}
					resource.dfShopKsbmGysExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,title);
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//代发看板发货平均时效统计
			dfAverageDelivery(){
				let arg = {
					date_type:this.pjsx_date_type
				}
				this.pjsx_loading = true;
				return new Promise((resolve)=>{
					resource.dfAverageDelivery(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.pjsx_loading = false;
							this.pjsx_title_list = res.data.data.title_list;
							this.pjsx_table_data = res.data.data.table_data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//代发看板发货平均时效统计导出
			exportPjsxFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date_type:this.pjsx_date_type
					}
					resource.dfAverageDeliveryExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'代发看板发货平均时效统计');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//代发看板发货即将超时统计
			dfOverTime(){
				let arg = {
					date_type:this.jjcs_date_type
				}
				this.jjcs_loading = true;
				return new Promise((resolve)=>{
					resource.dfOverTime(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.jjcs_loading = false;
							this.jjcs_title_list = res.data.data.title_list;
							this.jjcs_table_data = res.data.data.table_data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//代发看板发货即将超时统计导出
			exportJjcsFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date_type:this.jjcs_date_type
					}
					resource.dfOverTimeExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'代发看板发货即将超时统计');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		},
		components:{
			PopoverWidget,
			CustomTable
		}
	}
</script>
<style lang="less" scoped>
.send_view{
	background-color: #ECEFF8;
}
.top_content{
	height: 332px;
	padding: 14px 24px;
	.refresh{
		position: absolute;
		top: 14px;
		right: 14px;
		cursor: pointer;
	}
	.top_item{
		padding: 15px 10px; 
		border-radius: 8px;
		width: 480px;
	}
	.center_card{
		padding: 5px 12px 5px 6px;
		margin-bottom: 15px;
		width: 194px;
		height: 116px;
		background: #FFFFFF;
		border-radius: 8px;
		.yuan{
			margin-right: 6px;
			border-radius: 4px;
			width: 8px;
			height: 8px;
		}
		.yuan_1{
			background-color: #8BC75D;
		}
		.rate_1{
			color: #8BC75D;
		}
		.yuan_2{
			background-color: #FF993C;
		}
		.rate_2{
			color: #FF993C;
		}
		.yuan_3{
			background-color: #FF7272;
		}
		.rate_3{
			color: #FF7272;
		}
		.yuan_4{
			background-color: #2868F8;
		}
		.rate_4{
			color: #2868F8;
		}
	}
	.center_box{
		border-radius: 50%;
		width: 150px;
		height: 150px;
		background: #5575EB;
		cursor: pointer;
	}
	.today_icon{
		top: 14px;
		left: 14px;
		width: 29px;
		height: 27px;
	}
	.background_color{
		background-color: #ffffff;
	}
	.color_item{
		border-radius: 8px;
		width: 144px;
		height: 100px;
		cursor: pointer;
		.l_line{
			left:-85px;
			top:50px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
			width: 85px;
			height: 100px;
		}
		.r_line{
			right:-85px;
			top:50px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
			width: 85px;
			height: 100px;
		}
	}
	.c_c_line{
		height: 68px;
		width: 1px;
		background-color:#5288F8; 
	}
	.r_item{
		width: 210px;
		height: 116px;
		background: #FFFFFF;
		box-shadow: 0px 0px 8px 0px #E2EBFF;
		border-radius: 8px;
		cursor: pointer;
		.send_view_icon{
			width: 54px;
			height: 54px;
		}
		.r_content{
			height: 54px;
		}
		.r_l_line{
			left: -22px;
			top: 55px;
			width: 22px;
			height: 78px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
		}
		.r_r_line{
			right: -22px;
			top: 55px;
			width: 22px;
			height: 78px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
		}
	}
	.dfdds{
		background-color: #E3ECFF;
	}
	.wsh{
		background-color: #FFE0E0;
	}
	.fhs{
		background-color: #FFF9E3;
	}
	.ysh{
		background-color: #E8F8E8;
	}
}
.charts{
	width: 100%;
	height: 380px;
}
</style>












