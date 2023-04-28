<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="用户名称：">
				<el-select v-model="tgfzr_ids" filterable placeholder="请输入推广负责人">
					<el-option v-for="item in tgfzr_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 个人信息 -->
		<el-divider></el-divider>
		<div class="flex ac jsb f12">
			<div>姓名：{{user_info.ding_user_name}}</div>
			<div>部门：{{user_info.dept_1_name}}</div>
			<div>入职时间：{{user_info.entry_time}}</div>
			<div>昨日ROI：{{user_yesterday_roi}}</div>
			<div>30日ROI：{{user_month_roi}}</div>
		</div>
		<el-divider></el-divider>
		<!-- 顶部柱状图 -->
		<div class="bar_chart" id="gr_chart" v-loading="gr_loading"></div>
		<!-- 顶部饼图 -->
		<div class="pie_chart" id="pie_chart" v-loading="pie_loading"></div>
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
				<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="table_loading" :isLoading="table_loading" tableName="promotion" max_height="350" :table_data="table_data" :title_list="title_list" :is_wrap="true" :is_custom_sort="false" :total_row="true" :table_total_data="table_total_data" @sortCallBack="sortCallBack" @tableCallBack="tableCallBack" fieldName='spid_url'/>
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

	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,lastMonthDate} from '../../api/nowMonth.js'

	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				date:[lastMonthDate(),getCurrentDate()],//日期
				tgfzr_list:[],								//员工列表
				tgfzr_ids:'宋鑫磊',							//推广负责人
				type:'gys',									//类型
				dashedChart:null,							//气泡图
				dashed_loading:false,						//气泡图加载
				gr_loading:false,
				pie_loading:false,
				grChart:null,
				table_loading:false,
				table_data:[],
				table_total_data:{},
				total:0,
				title_list:[],
				sort:"",
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
			//推广绩效综合看板 汇总数据
			this.userPromoteDpList();
		},
		mounted(){
			//获取推广负责人柱状图数据
			this.userPromoteTotal()
			//获取气泡图数据
			this.scatterChart();
		},
		methods:{
			//点击搜索
			searchFn(){
				//获取推广负责人柱状图数据
				this.userPromoteTotal()
				//获取气泡图数据
				this.scatterChart();
				//推广绩效综合看板 汇总数据
				this.userPromoteDpList();
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
			//获取顶部柱状图数据
			userPromoteTotal(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids,
					shop_id:this.shop_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(',')
				}
				this.gr_loading = true;
				this.pie_loading = true;
				resource.userPromoteTotal(arg).then(res => {
					if(res.data.code == 1){
						this.gr_loading = false;
						this.pie_loading = false;
						let data = res.data.data;
						this.user_info = data.user_info;
						this.user_yesterday_roi = data.yesterday_roi;
						this.user_month_roi = data.month_roi;
						let x_axis = data.chart.day_list;
						let series_data = data.chart.list;
						let month_line = [];
						let week_line = [];
						for(let i = 0;i < series_data.length;i ++){
							month_line.push(data.month_roi)
							week_line.push(data.week_roi)
						}
						var echarts = require("echarts");
						var gr_chart = document.getElementById(`gr_chart`);
						this.grChart = echarts.getInstanceByDom(gr_chart)
						if (this.grChart == null) { 
							this.grChart = echarts.init(gr_chart);
						}
						this.grChart.setOption(this.setBarOptions(x_axis,series_data,month_line,week_line));

						let legend_data = [];
						data.pie_data.map(item => {
							legend_data.push(item.name)
						})
						var pie_chart = document.getElementById(`pie_chart`);
						this.pieChart = echarts.getInstanceByDom(pie_chart)
						if (this.pieChart == null) { 
							this.pieChart = echarts.init(pie_chart);
						}
						this.pieChart.setOption(this.setPieOptions(legend_data,data.pie_data));
						window.addEventListener('resize',this.debounce(()=>{
							this.grChart.resize();
							this.pieChart.resize();
						}, 50));
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//柱状图渲染
			setBarOptions(x_axis,series_data,month_line,week_line){
				return {
					title:{
						text:'个人ROI柱状图'
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
						top: '15%',
						right:'2%',
						bottom:'10%'
					},
					xAxis: {
						type: 'category',
						data: x_axis
					},
					yAxis: {
						type: 'value'
					},
					series: [
					{
						data: series_data,
						type: 'bar'
					},
					{
						name: '平均值',
						type: 'line',
						data: month_line,
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
								name: '月辅助线',
							},
							],
							precision: 0,
							label: {
								normal: {
									position: 'middle',
									formatter: '月辅助线：{c}',
								},
							}
						},
					},{
						name: '平均值',
						type: 'line',
						data: week_line,
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
								name: '周辅助线',
							},
							],
							precision: 0,
							label: {
								normal: {
									position: 'middle',
									formatter: '周辅助线：{c}',
								},
							}
						},
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
							ROI：${params.data.value}`;
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
						right: '2%',
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
								return params.data.name + ':' + params.data.value + '%';
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
					type:this.type
				}
				this.dashed_loading = true;
				resource.scatterChart(arg).then(res => {
					if(res.data.code == 1){
						this.dashed_loading = false;
						let data = res.data.data.list;
						let chart_data = [];
						data.map(item => {
							let item_arr = [];
							item_arr.push(item.yk);
							item_arr.push(item.roi);
							item_arr.push(item.zsgmv);
							item_arr.push(item.name);
							chart_data.push(item_arr)
						})
						var echarts = require("echarts");
						var dashed_chart = document.getElementById('dashed_chart');
						this.dashedChart = echarts.getInstanceByDom(dashed_chart)
						if (this.dashedChart == null) { 
							this.dashedChart = echarts.init(dashed_chart);
						}
						this.dashedChart.setOption(this.setDashedOptions(chart_data));
						window.addEventListener('resize',this.debounce(()=>{
							this.dashedChart.resize()
						}, 50));
					}else{
						this.$message.warning(res.data.msg);
					}
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
			setDashedOptions(data){
				var echarts = require("echarts");
				return {
					tooltip: {
					    // 提示框组件
					    trigger: 'item', 
					    position:'top',
					    formatter:  (params) => {
					    	let tip = `${params.data[3]}</br>
					    	ROI：${params.data[2]}</br>
					    	贡献毛益：${params.data[1]}</br>
					    	GMV：${params.data[2]}</br>`;
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
						right:'2%'
					},
					xAxis: {
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						}
					},
					yAxis: {
						splitLine: {
							lineStyle: {
								type: 'dashed'
							}
						},
						scale: true
					},
					series: [
					{
						// name: '1990',
						data: data,
						type: 'scatter',
						symbolSize: function (data) {
							return Math.sqrt(data[2]) / 20;
						},
						// emphasis: {
						// 	focus: 'series',
						// 	label: {
						// 		show: true,
						// 		formatter: function (param) {
						// 			return param.data[3];
						// 		},
						// 		position: 'top'
						// 	}
						// },
						itemStyle: {
							shadowBlur: 10,
							shadowColor: 'rgba(120, 36, 50, 0.5)',
							shadowOffsetY: 5,
							color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
							{
								offset: 0,
								color: 'rgb(251, 118, 123)'
							},
							{
								offset: 1,
								color: 'rgb(204, 46, 72)'
							}
							])
						}
					}
					]
				};
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
					type:this.type,
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.table_loading = true;
				resource.userPromoteDpList(arg).then(res => {
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
						this.promoteKpiDpList();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
						tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
						tgfzr:this.tgfzr_ids,
						shop_id:this.shop_ids.join(','),
						platform:this.platform_ids.join(','),
						dept_id:this.dept_ids.join(','),
						type:this.type,
						sort:this.sort
					}
					resource.userPromoteDpExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,`${this.user_info.ding_user_name}绩效综合看板汇总`);
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
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
<style lang="less" scoped>
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