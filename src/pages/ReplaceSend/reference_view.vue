<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供销商：">
				<el-select v-model="select_gxs_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供销商" :remote-method="getGxs" collapse-tags >
					<el-option v-for="item in gxs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="top_row">
			<el-card v-loading="chart_loading">
				<div class="info_card" @click="getDetail('all','fhcb','发货成本',total_info)">
					<div class="top_title">发货成本</div>
					<div class="top_value">{{total_info.fhcb}}</div>
				</div>
			</el-card>
			<el-card v-loading="chart_loading">
				<div class="info_card" @click="getDetail('all','zhcb','追回成本',total_info)">
					<div class="top_title">追回成本</div>
					<div class="top_value">{{total_info.zhcb}}</div>
				</div>
			</el-card>
			<el-card v-loading="chart_loading">
				<div class="info_card" @click="getDetail('all','thcb','退货成本',total_info)">
					<div class="top_title">退货成本</div>
					<div class="top_value">{{total_info.thcb}}</div>
				</div>
			</el-card>
		</div>
		<div id="chart_view" class="chart_view" v-loading="chart_loading"></div>
		<div class="buts">
			<div class="title">分销货款每日明细</div>
			<el-button type="primary" plain size="small" @click="exportFn('1')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table ref="dataTable" size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column :prop="item.row_field_name" :label="item.row_name" :sortable="item.is_sort == 1?'custom':false" show-overflow-tooltip align="center" v-for="item in title_list">
				<template slot-scope="scope">
					<el-button type="text" v-if="item.row_field_name == 'fhcb'" @click="getDetail('only','fhcb','发货成本',scope.row)">{{scope.row[item.row_field_name]}}</el-button>
					<el-button type="text" v-else-if="item.row_field_name == 'zhcb'" @click="getDetail('only','zhcb','追回成本',scope.row)">{{scope.row[item.row_field_name]}}</el-button>
					<el-button type="text" v-else-if="item.row_field_name == 'thcb'" @click="getDetail('only','thcb','退货成本',scope.row)">{{scope.row[item.row_field_name]}}</el-button>
					<div v-else>{{scope.row[item.row_field_name]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 下钻 -->
		<el-dialog :title="dialog_title" :visible.sync="show_dialog" @close="closeDialog" @open="getNbddh('')" width="65%">
			<div class="buts">
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item :label="dialog_type == 'thcb'?'单据编号：':'内部订单号：'">
						<el-select v-model="select_nbddh_ids" clearable multiple filterable remote reserve-keyword :placeholder="dialog_type == 'thcb'?'请输入单据编号':'请输入内部订单号'" :remote-method="getNbddh" collapse-tags >
							<el-option v-for="item in nbddh_list" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="searchDetailFn">搜索</el-button>
					</el-form-item>
				</el-form>

				<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
			<el-table ref="detailTable" size="mini" :data="detailData.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortDetailChange" v-loading="loading">
				<el-table-column :prop="item.row_field_name" :label="item.row_name" :sortable="item.is_sort == 1?'custom':false" show-overflow-tooltip align="center" v-for="item in detail_title_list"></el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @size-change="handleDetailSizeChange" @current-change="handleDetailCurrentChange" :current-page="detail_page" :page-size="detail_pagesize" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="detailData.total">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="show_dialog = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,lastXDate} from '../../api/nowMonth.js'
	import resource from '../../api/resource.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				},	 										//时间区间
				date:[lastXDate(1),lastXDate(1)],
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gxs_list:[],								//供销商列表
				select_gxs_ids:[],							//选中的供销商
				total_info:{},								//顶部三块
				chart_loading:false,						//报表是否加载
				viewChart:null,
				title_list:[],				//表头数据
				dataObj:{},					//表格数据
				sort:"",
				page:1,
				pagesize:10,	
				dialog_title:"",			//弹窗标题
				show_dialog:false,
				e_type:"",		
				dialog_type:'',				//弹窗类型
				nbddh_list:[],
				select_nbddh_ids:[],
				item:{},
				detail_title_list:[],		//表头数据
				detailData:{},
				detail_page:1,
				detail_pagesize:10,
				detail_sort:"",
			}
		},
		created(){
			//获取顶部汇总和折线图接口
			this.accountStatementChart();
			//分销货款每日明细
			this.accountStatementDayDetail();
		},
		methods:{
			//供应商列表
			getGys(e){
				if(e != ''){
					let arg = {
						type:'gys',
						name:e
					}
					resource.ajaxAccountStatement(arg).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供销商列表
			getGxs(e){
				if(e != ''){
					let arg = {
						type:'gxs',
						name:e
					}
					resource.ajaxAccountStatement(arg).then(res => {
						if(res.data.code == 1){
							this.gxs_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击搜索
			searchFn() {
				this.page = 1;
				this.sort = '';
				this.$refs.dataTable.clearSort(); // 清除排序
				//获取顶部汇总和折线图接口
				this.accountStatementChart();
				//分销货款每日明细
				this.accountStatementDayDetail();
			},
			//获取顶部汇总和折线图接口
			accountStatementChart(){
				let arg = {
					start_date:this.date[0],
					end_date:this.date[1],
					gys:this.select_gys_ids.join(','),
					gxs:this.select_gxs_ids.join(',')
				}
				this.chart_loading = true;
				resource.accountStatementChart(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.total_info = data.total_info;

						this.chart_loading = false;
						var echarts = require("echarts");
						//图表数据
						var chart_data = res.data.data.list;
						var x_data = data.day_list;		//x轴日期
						//发货成本
						var fhcb_data = data.chart_list.map(item => {
							return item.fhcb;
						});			
						//追回成本
						var zhcb_data = data.chart_list.map(item => {
							return item.zhcb;
						});
						//退货成本
						var thcb_data = data.chart_list.map(item => {
							return item.thcb;
						});

						var chart_view = document.getElementById('chart_view');
						this.viewChart = echarts.getInstanceByDom(chart_view)
						if (this.viewChart == null) { 
							this.viewChart = echarts.init(chart_view);
						}
						this.viewChart.setOption(this.setOptions(x_data,fhcb_data,zhcb_data,thcb_data));
						window.addEventListener('resize',() => {
							this.viewChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//图表配置
			setOptions(x_data,fhcb_data,zhcb_data,thcb_data){
				return {
					title: {
						text: '分销货款每日趋势'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							console.log(params)
							let date = params[0].axisValue;
							let fhcb_txt = params[0].value;
							let zhcb_txt = params[1].value;
							let thcb_txt = params[2].value;

							let tip = "";
							if(params != null && params.length > 0) {
								tip = date + "</br>"
								+ "发货成本：" + fhcb_txt + "万</br>"
								+ "追回成本：" + zhcb_txt + "万</br>"
								+ "退货成本：" + thcb_txt + "万</br>";
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
						data: ['发货成本','追回成本','退货成本']
					},
					xAxis: [{
						type: 'category',
						data: x_data,
					}],
					yAxis:[{
						type: 'value',
						axisLabel: {
							formatter: '{value}万'
						}
					}],
					series: [{
						name: "发货成本",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: fhcb_data
					},{
						name: "追回成本",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: zhcb_data
					},{
						name: "退货成本",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						data: thcb_data
					}]
				}
			},
			//分销货款每日明细
			accountStatementDayDetail(){
				let arg = {
					start_date:this.date[0],
					end_date:this.date[1],
					gys:this.select_gys_ids.join(','),
					gxs:this.select_gxs_ids.join(','),
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.accountStatementDayDetail(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.title_list = data.title_list;
						this.dataObj = data.data;
						this.loading = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
			sortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'1':'0';
					this.sort = column.prop + '-' + order;
				}else{
					this.sort = '';
				}
				this.accountStatementDayDetail();
			},
        	//分页
        	handleSizeChange(val) {
        		this.pagesize = val;
				//获取列表
				this.accountStatementDayDetail();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.accountStatementDayDetail();
			},
			//下钻
			getDetail(e_type,type,title,item){
				this.e_type = e_type;
				this.dialog_type = type;
				this.dialog_title = title;
				this.item = item;
				//获取下钻列表
				this.getDetailList();
			},
			//关闭下钻
			closeDialog(){
				this.detail_page = 1;
				this.detail_pagesize = 10;
				this.detail_sort = "";
				this.nbddh_list = [];
				this.select_nbddh_ids = [];
				this.$refs.detailTable.clearSort(); // 清除排序
     		},
			//获取内部编号
			getNbddh(e){
				if(this.dialog_type == 'fhcb'){
					if(e != ''){
						let arg = {
							type:'nbddh_fh',
							name:e
						}
						resource.ajaxAccountStatement(arg).then(res => {
							if(res.data.code == 1){
								this.nbddh_list = res.data.data;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}else if(this.dialog_type == 'zhcb'){
					if(e != ''){
						let arg = {
							type:'nbddh_zh',
							name:e
						}
						resource.ajaxAccountStatement(arg).then(res => {
							if(res.data.code == 1){
								this.nbddh_list = res.data.data;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}else if(this.dialog_type == 'thcb'){
					if(e != ''){
						let arg = {
							type:'bill_number',
							name:e
						}
						resource.ajaxAccountStatement(arg).then(res => {
							if(res.data.code == 1){
								this.nbddh_list = res.data.data;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
			//详情搜索
			searchDetailFn(){
				this.detail_page = 1;
				//获取下钻列表
				this.getDetailList();
			},
			//获取下钻列表
			getDetailList(){
				let arg = {
					start_date:this.e_type == 'all'?this.date[0]:this.item.tjrq,
					end_date:this.e_type == 'all'?this.date[1]:this.item.tjrq,
					gys:this.e_type == 'all'?this.select_gys_ids.join(','):this.item.gys,
					gxs:this.e_type == 'all'?this.select_gxs_ids.join(','):this.item.gxs,
					sort:this.detail_sort,
					page:this.detail_page,
					pagesize:this.detail_pagesize
				}
				if(this.dialog_type == 'fhcb'){				//发货成本
					arg['nbddh'] = this.select_nbddh_ids.join(',');
					resource.accountStatementFhcb(arg).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.detail_title_list = data.title_list;
							this.detailData = data.data;
							this.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dialog_type == 'zhcb'){		//追回成本
					arg['nbddh'] = this.select_nbddh_ids.join(',');
					resource.accountStatementZhcb(arg).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.detail_title_list = data.title_list;
							this.detailData = data.data;
							this.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dialog_type == 'thcb'){		//退货成本
					arg['bill_number'] = this.select_nbddh_ids.join(',');
					resource.accountStatementThcb(arg).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.detail_title_list = data.title_list;
							this.detailData = data.data;
							this.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//排序（下钻）
			sortDetailChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'1':'0';
					this.detail_sort = column.prop + '-' + order;
				}else{
					this.detail_sort = '';
				}
				this.getDetailList();
			},
        	//分页
        	handleDetailSizeChange(val) {
        		this.detail_pagesize = val;
				//获取列表
				this.getDetailList();
			},
			handleDetailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetailList();
			},
			//导出
			exportFn(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(type == '1'){	//每日明细
						let arg = {
							start_date:this.date[0],
							end_date:this.date[1],
							gys:this.select_gys_ids.join(','),
							gxs:this.select_gxs_ids.join(','),
						}
						if(this.sort != ''){
							arg.sort = this.sort;
						}
						resource.accountStatementdayExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'分销货款每日明细');
							}
						})
					}else{		//下钻列表
						let detail_arg = {
							start_date:this.e_type == 'all'?this.date[0]:this.item.tjrq,
							end_date:this.e_type == 'all'?this.date[1]:this.item.tjrq,
							gys:this.e_type == 'all'?this.select_gys_ids.join(','):this.item.gys,
							gxs:this.e_type == 'all'?this.select_gxs_ids.join(','):this.item.gxs
						}
						if(this.detail_sort != ''){
							detail_arg.sort = this.detail_sort;
						}
						if(this.dialog_type == 'fhcb'){				//发货成本
							detail_arg['nbddh'] = this.select_nbddh_ids.join(',');
							resource.accountStatementFhcbExport(detail_arg).then(res => {
								if(res){
									exportPost("\ufeff" + res.data,'发货成本明细');
								}
							})
						}else if(this.dialog_type == 'zhcb'){		//追回成本
							detail_arg['nbddh'] = this.select_nbddh_ids.join(',');
							resource.accountStatementZhcbExport(detail_arg).then(res => {
								if(res){
									exportPost("\ufeff" + res.data,'追回成本明细');
								}
							})
						}else if(this.dialog_type == 'thcb'){		//退货成本
							detail_arg['bill_number'] = this.select_nbddh_ids.join(',');
							resource.accountStatementThcbExport(detail_arg).then(res => {
								if(res){
									exportPost("\ufeff" + res.data,'退货成本明细');
								}
							})
						}
					}
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}


		}
	}
</script>
<style lang="less" scoped>
.top_row{
	display: flex;
	justify-content: space-around;
	font-weight: bold;
	.info_card{
		cursor: pointer;
		display: flex;
		flex-direction: column;
		align-items: center;
		.top_title{
			margin-bottom: 5px;
			font-size: 16px;
			color: #333333;
		}
		.top_value{
			font-size: 24px;
			color: red;
		}
	}
}
.chart_view{
	margin-top: 10px;
	height: 360px;
}
.title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-size: 16px;
	font-weight: bold;
}
.buts{
	height: 36px;
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
}
</style>