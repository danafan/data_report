<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="推广负责人：">
				<el-select v-model="tgfzr_ids" filterable placeholder="请输入推广负责人">
					<el-option v-for="item in tgfzr_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="select_pp_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入品牌" :remote-method="ajaxPp" collapse-tags>
					<el-option v-for="item in pp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex mb-20 relative">
			<el-table class="user_info_table" :data="dp_zb_list" max-height="180" size="mini" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" v-loading="info_loading">
				<el-table-column show-overflow-tooltip prop="shop_name" label="店铺名称" width="150"  align="center">
				</el-table-column>
				<el-table-column prop="zsgmv_zb" label="店铺占比" width="100" align="center">
				</el-table-column>
			</el-table>
			<el-table class="info_table" :data="info_zb_list" size="mini" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" v-loading="info_loading">
				<el-table-column prop="company_zb" label="公司占比" width="100" align="center">
				</el-table-column>
				<el-table-column show-overflow-tooltip prop="ding_user_name" label="姓名" width="100" align="center">
				</el-table-column>
				<el-table-column show-overflow-tooltip prop="dept_1_name" label="部门" width="100" align="center">
				</el-table-column>
				<el-table-column show-overflow-tooltip prop="entry_time" label="入职时间" width="100" align="center">
				</el-table-column>
				<el-table-column prop="yesterday_roi" label="昨日ROI" width="100" align="center">
				</el-table-column>
				<el-table-column prop="month_roi" label="30日ROI" width="100" align="center">
				</el-table-column>
			</el-table>
		</div>
		<!-- 个人roi折线图 -->
		<div class="bar_chart" id="gr_chart" v-loading="info_loading"></div>
		<!-- 个人gmv柱状图 -->
		<div class="bar_chart" id="gmv_chart" v-loading="info_loading"></div>
		<!-- 个人销量柱状图 -->
		<div class="bar_chart" id="xl_chart" v-loading="info_loading"></div>
		<!-- 顶部饼图 -->
		<div class="pie_chart" id="pie_chart" v-loading="info_loading"></div>
		<div class="flex jse">
			<el-radio-group v-model="type" size="small">
				<el-radio-button label="gys">供应商</el-radio-button>
				<el-radio-button label="cpfl">品类</el-radio-button>
				<el-radio-button label="jj">季节</el-radio-button>
			</el-radio-group>
		</div>
		<!-- 气泡图 -->
		<div class="dashed_chart" id="dashed_chart" v-loading="dashed_loading"></div>
		<!-- 汇总 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="指标汇总" :show_popover="false"/>
			<div class="flex ac">
				<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="commitExport" :loading="table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="table_loading" :isLoading="table_loading" tableName="promotion" max_height="350" :table_data="table_data" :title_list="title_list" :is_wrap="true" :is_custom_sort="false" :total_row="true" :table_total_data="table_total_data" @sortCallBack="sortCallBack" @tableCallBack="tableCallBack" fieldName='spid_url' v-if="!custom_loading"/>
		<div style="width: 100%;height: 80px" v-else v-loading="true"></div>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
		<!-- 自定义列表 -->
		<el-dialog title="自定义列表（单击取消列表名保存直接修改）" :visible.sync="show_custom">
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
	import dps from '../../components/results_components/dps.vue'
	import resource from '../../api/promotion.js'
	import commonResource from '../../api/resource.js'

	import CustomTable from '../../components/custom_table.vue'
	import PageWidget from '../../components/pagination_widget.vue'
	import PopoverWidget from '../../components/popover_widget.vue'

	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,lastMonthDate,lastXDate} from '../../api/nowMonth.js'

	import {exportUp} from '../../api/export.js'
	export default{
		data(){
			return{
				dept_ids:[],								//选中的项目部
				platform_ids:[],							//选中的平台
				shop_ids:[],								//选中的店铺
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
				},	 										//时间区间
				date:[lastXDate(7),getCurrentDate()],		//日期
				tgfzr_list:[],								//员工列表
				tgfzr_ids:'宋鑫磊',							//推广负责人
				type:'gys',									//类型
				pp_list:[],									//品牌列表
				select_pp_list:[],							//选中的品牌列表
				dashedChart:null,							//气泡图
				dashed_loading:false,						//气泡图加载
				info_loading:false,
				grChart:null,
				gmvChart:null,
				table_loading:false,
				table_data:[],
				table_total_data:{},
				total:0,
				title_list:[],
				sort:"",
				sort_type:"",
				custom_loading:false,
				show_custom:false,
				selected_ids:[],							//自定义已选中的id
				row_ids:[],									//可提交的自定义ids
				view_row:[],								//所有列表-指标汇总
				page:1,
				pagesize:10,
				user_info:{},
				user_yesterday_roi:'',
				user_month_roi:"",
				dp_zb_list:[],								//个人店铺占比列表
				info_zb_list:[],							//个人信息列表
				company_zb:"",								//个人公司占比
			}
		},
		watch:{
			type:function(n,o){
				//获取气泡图数据
				this.scatterChart();
			}
		},
		created(){
			//推广负责人
			this.ajaxTgfzr();
		},
		mounted(){
			//点击搜索
			this.searchFn();
		},
		methods:{
			//点击搜索
			async searchFn(){
				this.info_loading = true;
				this.dashed_loading = true;
				this.table_loading = true;
				//获取推广负责人柱状图数据
				await this.userPromoteTotal()
				//获取气泡图数据
				await this.scatterChart();
				//推广绩效综合看板 汇总数据
				this.page = 1;
				this.pagesize = 10;
				await this.userPromoteDpList();
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_ids = reqObj.select_department_ids;
				this.platform_ids = reqObj.select_plat_ids;
				this.shop_ids = reqObj.select_store_ids;
			},
			//推广负责人
			ajaxTgfzr(){
				commonResource.ajaxTgfzr().then(res => {
					if(res.data.code == 1){
						this.tgfzr_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品牌列表
			ajaxPp(e){
				if(e != ''){
					commonResource.ajaxPp({name:e}).then(res => {
						if(res.data.code == 1){
							this.pp_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//顶部个人信息/折线图/饼图
			userPromoteTotal(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids,
					shop_id:this.shop_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					pp:this.select_pp_list.join(',')
				}
				this.info_loading = true;
				return new Promise((resolve)=>{
					resource.userPromoteTotal(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.info_loading = false;
							let data = res.data.data;
							// 顶部用户信息
							this.info_zb_list = [];
							let info_item = {
								ding_user_name:data.user_info.ding_user_name,
								dept_1_name:data.user_info.dept_1_name,
								entry_time:data.user_info.entry_time,
								yesterday_roi:data.yesterday_roi,
								month_roi:data.month_roi,
								company_zb:data.company_zb
							}
							this.info_zb_list.push(info_item);
							this.user_info = data.user_info;
							// this.user_yesterday_roi = data.yesterday_roi;
							this.user_month_roi = data.month_roi;
							this.dp_zb_list = data.dp_zb_list;//个人店铺占比列表
							this.company_zb = data.company_zb;//个人公司占比
							var echarts = require("echarts");
							
							// 个人roi折线图
							var gr_chart = document.getElementById(`gr_chart`);
							this.grChart = echarts.getInstanceByDom(gr_chart)
							if (this.grChart == null) { 
								this.grChart = echarts.init(gr_chart);
							}
							if(data.chart.length == 0){		//无数据
								let option = {
									title: {
										text: '个人ROI折线图'
									},
									graphic: {
										type: 'text',
										left: 'center',
										top: 'middle',
										silent: true,
										invisible: false, 
										style: {
											fill: 'black',
											text: '暂无数据',
											fontSize: '16px'
										}
									}
								}
								if (this.grChart) { 
									this.grChart.clear();
								}
								this.grChart.setOption(option);
							}else{
								let x_axis = data.chart.day_list;
								let series_data = data.chart.list;
								let self_roi = [];
								let company_roi = [];
								let month_roi = [];
								for(let i = 0;i < series_data.length;i ++){
									self_roi.push(data.self_roi)
									company_roi.push(data.company_roi)
									month_roi.push(data.month_roi)
								}
								if (this.grChart) { 
									this.grChart.clear();
								}
								this.grChart.setOption(this.setLineOptions(x_axis,series_data,self_roi,company_roi,month_roi));
							}
							// 个人gmv柱状图
							var gmv_chart = document.getElementById(`gmv_chart`);
							this.gmvChart = echarts.getInstanceByDom(gmv_chart)
							if (this.gmvChart == null) { 
								this.gmvChart = echarts.init(gmv_chart);
							}
							if(data.chart.length == 0){		//无数据
								let option = {
									title: {
										text: '个人GMV柱状图'
									},
									graphic: {
										type: 'text',
										left: 'center',
										top: 'middle',
										silent: true,
										invisible: false, 
										style: {
											fill: 'black',
											text: '暂无数据',
											fontSize: '16px'
										}
									}
								}
								if (this.gmvChart) { 
									this.gmvChart.clear();
								}
								this.gmvChart.setOption(option);
							}else{
								let gmv_x_axis = data.chart.day_list;
								let gmv_series_data = data.chart.zsgmv_list;
								if (this.gmvChart) { 
									this.gmvChart.clear();
								}
								this.gmvChart.setOption(this.setBarOptions('个人GMV柱状图','GMV',gmv_x_axis,gmv_series_data));
							}
							// 个人销量柱状图
							var xl_chart = document.getElementById(`xl_chart`);
							this.xlChart = echarts.getInstanceByDom(xl_chart)
							if (this.xlChart == null) { 
								this.xlChart = echarts.init(xl_chart);
							}
							if(data.chart.length == 0){		//无数据
								let option = {
									title: {
										text: '个人销量柱状图'
									},
									graphic: {
										type: 'text',
										left: 'center',
										top: 'middle',
										silent: true,
										invisible: false, 
										style: {
											fill: 'black',
											text: '暂无数据',
											fontSize: '16px'
										}
									}
								}
								if (this.xlChart) { 
									this.xlChart.clear();
								}
								this.xlChart.setOption(option);
							}else{
								let xl_x_axis = data.chart.day_list;
								let xl_series_data = data.chart.zsxl_list;
								if (this.xlChart) { 
									this.xlChart.clear();
								}
								this.xlChart.setOption(this.setBarOptions('个人销量柱状图','销量',xl_x_axis,xl_series_data));
							}
							
							// 饼图
							var pie_chart = document.getElementById('pie_chart');
							this.pieChart = echarts.getInstanceByDom(pie_chart)
							if (this.pieChart == null) { 
								this.pieChart = echarts.init(pie_chart);
							}
							if(data.pie_data.length == 0){		//无数据
								let option = {
									title: {
										text: '推广费用结构图'
									},
									graphic: {
										type: 'text',
										left: 'center',
										top: 'middle',
										silent: true,
										invisible: false, 
										style: {
											fill: 'black',
											text: '暂无数据',
											fontSize: '16px'
										}
									}
								}
								if (this.pieChart) { 
									this.pieChart.clear();
								}
								this.pieChart.setOption(option);
							}else{
								let legend_data = [];
								let pie_series_data = [];
								data.pie_data.map(item => {
									legend_data.push(item.name);
									let pie_item = {
										name:item.name,
										value:item.zb,
										money:item.money
									}
									pie_series_data.push(pie_item)
								})
								if (this.pieChart) { 
									this.pieChart.clear();
								}
								this.pieChart.setOption(this.setPieOptions(legend_data,pie_series_data));
							}
							// 刷新
							// window.addEventListener('resize',this.debounce(()=>{
							// 	this.grChart.resize();
							// 	this.pieChart.resize();
							// 	this.gmvChart.resize();
							// 	this.xlChart.resize();
							// }, 50));
						}else{
							this.$message.warning(res.data.msg);
						}
					})
})
},
			//折线图渲染
			setLineOptions(x_axis,series_data,self_roi,company_roi,month_roi){
				return {
					title:{
						text:'个人ROI折线图'
					},
					tooltip: {
					    // 提示框组件
					    trigger: 'item', 
					    position:'top',
					    formatter:  (params) => {
					    	let tip = `${params.name}</br>
					    	ROI：${params.value}`;
					    	return tip
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
					grid: {
						left: '8%',
						top: '18%',
						right:'10%',
						bottom:'10%'
					},
					xAxis: {
						type: 'category',
						data: x_axis,
						name:'日期'
					},
					yAxis: {
						type: 'value',
						min:-1,
						max:18,
						name:'ROI'
					},
					series: [
					{
						data: series_data,
						label: {
							show: true,
							position: 'top',
							color: 'inherit',
							fontWeight:'bold',
						},
						type: 'line'
					},
					{
						name: '个人',
						type: 'line',
						data: self_roi,
						lineStyle: {
							normal: {
								width: 0,
							},
						},
						symbolSize: 0,
						markLine: {
							silent: true,
							data: [
							{
								type: 'average',
								name: '个人',
							},
							],
							precision: 2,
							label: {
								color:"#91cc75",
								distance:20,
								position: 'start',
								formatter: '个人：{c}',
							}
						},
					}
					,{
						name: '公司',
						type: 'line',
						data: company_roi,
						lineStyle: {
							normal: {
								width: 0,
							},
						},
						symbolSize: 0,
						markLine: {
							silent: true,
							data: [
							{
								type: 'average',
								name: '公司',
							},
							],
							precision: 2,
							label: {
								color:"#fac858",
								position: 'middle',
								formatter: '公司：{c}'
							}
						},
					}
					,{
						name: '近30天',
						type: 'line',
						data: month_roi,
						lineStyle: {
							normal: {
								width: 0,
							},
						},
						symbolSize: 0,
						markLine: {
							silent: true,
							data: [
							{
								type: 'average',
								name: '近30天',
							},
							],
							precision: 2,
							label: {
								color:"#ee6666",
								position: 'end',
								formatter: '近30天：{c}'
							}
						},
					}
					]
				}
			},
			//柱状图渲染
			setBarOptions(title,y_name,x_axis,series_data){
				return {
					title:{
						text:title
					},
					tooltip: {
					    // 提示框组件
					    trigger: 'item', 
					    position:'top',
					    formatter:  (params) => {
					    	let tip = `${params.name}</br>
					    	${y_name}：${params.value}`;
					    	return tip
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
					grid: {
						left: '8%',
						top: '18%',
						right:'10%',
						bottom:'10%'
					},
					xAxis: {
						type: 'category',
						data: x_axis,
						name:'日期'
					},
					yAxis: {
						type: 'value',
						name:y_name
					},
					series: [
					{
						data: series_data,
						label: {
							show: true,
							position: 'top',
							color: 'inherit',
							fontWeight:'bold',
							rotate:55
						},
						type: 'bar'
					}
					]
				}
			},
			//饼图渲染
			setPieOptions(legend_data,series_data){
				return {
					title: {
						text: '推广费用结构图',
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return `${params.data.name}</br>
							占比：${params.data.value}%</br>
							金额：${!params.data.money?0:params.data.money}</br>`;
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
						top: '10%',
						data:legend_data
					},
					series: [
					{
						type: 'pie',
						radius: '50%',
						data: series_data,
						label:{
							formatter: (params) => {
								return params.data.name + '：' + params.data.value + '%' + `（${!params.data.money?0:params.data.money}）`;
							},
						},
						emphasis: {
							itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
							}
						}
					}
					]
				}
			},
			//获取气泡图数据
			scatterChart(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids,
					shop_id:this.shop_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					pp:this.select_pp_list.join(','),
					type:this.type
				}
				this.dashed_loading = true;
				return new Promise((resolve)=>{
					resource.scatterChart(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.dashed_loading = false;
							let data = res.data.data;
							var echarts = require("echarts");
							var dashed_chart = document.getElementById('dashed_chart');
							this.dashedChart = echarts.getInstanceByDom(dashed_chart)
							if (this.dashedChart == null) { 
								this.dashedChart = echarts.init(dashed_chart);
							}
							if(data.length == 0){		//无数据
								let option = {
									title: {
										text: 'ROI气泡图统计',
										left: '5%',
										top: '0'
									},
									graphic: {
										type: 'text',
										left: 'center',
										top: 'middle',
										silent: true,
										invisible: false, 
										style: {
											fill: 'black',
											text: '暂无数据',
											fontSize: '16px'
										}
									}
								}
								if (this.dashedChart) { 
									this.dashedChart.clear();
								}
								this.dashedChart.setOption(option);
							}else{
								var max = Math.max.apply(Math, data.list.map(i => {return i.zsgmv }));
								let chart_data = [];
								data.list.map(item => {
									let item_arr = [];
									item_arr.push(item.yk);
									item_arr.push(item.roi);
									item_arr.push(item.zsgmv);
									item_arr.push(item.name);
									item_arr.push(item.xssl);
									item_arr.push(item.mll);
									chart_data.push(item_arr)
								})
								if (this.dashedChart) { 
									this.dashedChart.clear();
								}
								this.dashedChart.setOption(this.setDashedOptions(chart_data,max));
							}
							// window.addEventListener('resize',this.debounce(()=>{
							// 	this.dashedChart.resize()
							// }, 50));
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//改变屏幕大小防抖
			debounce(fn, wait) {
				var timeout = null; 
				return function() { 
					if(timeout !== null) clearTimeout(timeout); 
					timeout = setTimeout(fn, wait); 
				} 
			},
			//气泡图渲染
			setDashedOptions(data,max){
				var echarts = require("echarts");
				return {
					tooltip: {
					    // 提示框组件
					    trigger: 'item', 
					    position:'top',
					    formatter:  (params) => {
					    	let tip = `${params.data[3]}</br>
					    	ROI：${params.data[1]}</br>
					    	贡献毛益：${params.data[0]}</br>
					    	GMV：${params.data[2]}</br>
					    	销量：${params.data[4]}</br>
					    	毛利率：${params.data[5]}</br>`;
					    	return tip
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
					title: {
						text: 'ROI气泡图统计',
						left: '5%',
						top: '0'
					},
					legend: {
						right: '2%',
						top: '0',
					},
					grid: {
						left: '8%',
						top: '10%',
						right:'8%'
					},
					xAxis: {
						name:'贡献毛益',
						axisLine:{
							onZero:false
						},
						offset:-140
					},
					yAxis: {
						name:'ROI',
						scale:true,
						min:-1,
						max:18,
					},
					series: [
					{
						data: data,
						type: 'scatter',
						label:{
							show:true,
							color:'blue',
							fontWeight:'bold',
							formatter: (params) => {
								return params.data[2] > 10000?params.data[3]:'';
							},
						},	
						symbolSize: function (data) {
							let r = 0;
							if(100000/max > 1){
								r = Math.sqrt(data[2]) / 2;
							}else{
								if(100000/max >= 0.8){
									r =(Math.sqrt(data[2]) * 100000/max)/1.8;
								}else if(100000/max >= 0.5 && 100000/max < 0.8){
									r =(Math.sqrt(data[2]) * 100000/max)/1.2;
								}else if(100000/max < 0.5){
									r =(Math.sqrt(data[2]) * 100000/max)/0.8;
								}
							}
							return r;
						},
						itemStyle: {
							color:({seriesIndex, dataIndex, data, value}) => {
								if(data[0] > 0 && data[1] > 6){
									return 'green'
								}else if(data[0] > 0 && data[1] <= 6){
									return 'yellow'
								}else if(data[0] <= 0 && data[1] <= 6){
									return 'red'
								}else if(data[0] <= 0 && data[1] > 6){
									return 'yellow'
								}
							}
						}
					}
					]
				}
			},
			//推广绩效综合看板 汇总数据
			userPromoteDpList(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids,
					shop_id:this.shop_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					pp:this.select_pp_list.join(','),
					type:this.type,
					sort:this.sort,
					sort_type:this.sort_type,
					page:this.page,
					pagesize:this.pagesize
				}
				this.table_loading = true;
				return new Promise((resolve)=>{
					resource.userPromoteDpList(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.table_loading = false;
							let data = res.data.data;
							this.title_list = data.title_list;
							this.table_data = data.table_list.data;
							if(this.table_data.length > 0){
								this.table_total_data = this.table_data[0];
								this.table_data.splice(0,1);
							}else{
								this.table_total_data = {};
							}
							this.total = data.table_list.total;
						this.selected_ids = data.selected_ids;	//自定义已选中的id
						this.view_row = data.view_row;			//自定义
					}else{
						this.$message.warning(res.data.msg);
					}
				})
				})
			},
			//点击自定义列
			customFun(){
				this.row_ids = this.selected_ids;
				this.show_custom = true;
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
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				this.custom_loading = true;
				commonResource.setColumns({menu_id:'179',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.custom_loading = false;
						//获取列表
						this.page = 1;
						this.pagesize = 10;
						this.userPromoteDpList();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出
			commitExport(){
				let req = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids,
					shop_id:this.shop_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					pp:this.select_pp_list.join(','),
					type:this.type,
					sort:this.sort
				}
				var export_arr = [];
				for(let key in req){
					export_arr.push(`${key}=${req[key]}`);
				}
				let url = "annual/user_promote_dp_export?" + export_arr.join("&");
				exportUp(url)
			},
			//排序回调
			sortCallBack(sort){
				if(sort == ''){
					this.sort = sort;
					this.sort_type = sort;
				}else{
					this.sort = sort.split('-')[0];
					this.sort_type = sort.split('-')[1]==0?1:0;
				}
				//获取列表
				this.userPromoteDpList();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.userPromoteDpList();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.userPromoteDpList();
			},
			//跳转商品链接
			tableCallBack(url,table_name){
				window.open(url)
			},
		},
		components:{
			dps,
			CustomTable,
			PageWidget,
			PopoverWidget
		}
	}
</script>
<style type="text/css">
.user_info_table .el-table__empty-block{
	min-height: 36px!important;
}
.user_info_table .el-table__empty-block .el-table__empty-text{
	line-height: 36px!important;
}
/*.el-table__row>td{ border: none!important; }*/

.el-table::before { height: 0px!important; } 
</style>
<style lang="less" scoped>


.info_table{
	position: absolute;
	left: 250px;
}
.bar_chart{
	width: 100%;
	height: 300px;
}
.pie_chart{
	width: 100%;
	height: 500px;
}
.dashed_chart{
	width: 100%;
	height: 500px;
}
</style>