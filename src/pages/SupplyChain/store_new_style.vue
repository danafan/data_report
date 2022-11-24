<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="上架时间:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否杭州档口：">
				<el-select v-model="type" clearable placeholder="全部">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 公司-店铺款式粒度 -->
		<div class="table_row">
			<div class="item table_box">
				<div class="button_rows">
					<div class="table_title">公司</div>
					<el-button type="primary" plain size="mini" @click="exportFn('company')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table :data="company_data" size="small" max-height="320" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="company_dept_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" :width="index == 0?90:200" align="center" v-for="(item,index) in company_title" :fixed="index == 0">
						<template slot-scope="scope">
							<div :class="{'bold_style':scope.$index == 0}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="90" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':scope.$index == 0 || (index == 1 && (scope.$index == 1 || scope.$index == 2))}">{{scope.row[i.row_field_name]}}{{i_index == 1?'%':''}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<div class="item">
				<div class="table_title">店铺款式粒度-每日上款情况(供应商等级)</div>
				<div class="chart_box" id="store_new_status"></div>
			</div>
		</div>
		<!-- 事业部数据 -->
		<div class="table_row">
			<div class="item table_box">
				<div class="button_rows">
					<div class="table_title">事业部</div>
					<el-button type="primary" plain size="mini" @click="exportFn('dept')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table :data="dept_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="twoColumnStyle" :span-method="spanMethod" v-loading="company_dept_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" :width="index == 0 || index == 1?100:200" align="center" v-for="(item,index) in dept_title" :fixed="index == 0 || index == 1">
						<template slot-scope="scope">
							<div :class="{'bold_style':index == 0 || (index == 1 && scope.$index == 0 || scope.$index%3 == 0)}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="90" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':scope.$index == 0 || scope.$index%3 == 0}">{{scope.row[i.row_field_name]}}{{i.row_field_name.indexOf('rate') > -1?'%':''}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<div class="item">
				<div class="table_title">事业部</div>
				<div class="chart_box" id="dept_data_chart"></div>
			</div>
		</div>
		<!-- 项目部数据 -->
		<div class="table_row">
			<div class="item table_box">
				<div class="button_rows">
					<div class="table_title">项目部</div>
					<el-button type="primary" plain size="mini" @click="exportFn('xmb')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table :data="xmb_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="twoColumnStyle" :span-method="spanMethod" v-loading="xmb_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" :width="index == 0 || index == 1?100:200" align="center" v-for="(item,index) in xmb_title" :fixed="index == 0 || index == 1">
						<template slot-scope="scope">
							<div :class="{'bold_style':index == 0 || (index == 1 && scope.$index == 0 || scope.$index%3 == 0)}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="90" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':scope.$index == 0 || scope.$index%3 == 0}">{{scope.row[i.row_field_name]}}{{i.row_field_name.indexOf('rate') > -1?'%':''}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<div class="item">
				<div class="table_title">项目部</div>
				<div class="chart_box" id="xmb_data_chart"></div>
			</div>
		</div>
		<!-- 店铺数据 -->
		<div class="table_row">
			<div class="item table_box">
				<div class="button_rows">
					<div class="table_title">店铺</div>
					<el-button type="primary" plain size="mini" @click="exportFn('store')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table :data="store_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="twoColumnStyle" :span-method="spanMethod" v-loading="store_loading">
					<el-table-column :label="item.row_name" show-overflow-tooltip :prop="item.row_field_name" :width="index == 0 || index == 1?100:200" align="center" v-for="(item,index) in store_title" :fixed="index == 0 || index == 1">
						<template slot-scope="scope">
							<div :class="{'bold_style':index == 0 || (index == 1 && scope.$index == 0 || scope.$index%3 == 0)}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="90" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':scope.$index == 0 || scope.$index%3 == 0}">{{scope.row[i.row_field_name]}}{{i.row_field_name.indexOf('rate') > -1?'%':''}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="storeSizeChange" @current-change="storePageChange" :current-page="store_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="store_total">
					</el-pagination>
				</div>
			</div>
			<div class="item">
				<div class="button_rows">
					<div class="table_title">店铺款式上新明细表</div>
					<el-button type="primary" plain size="mini" @click="exportFn('detail')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="small" :data="style_data" max-height="320" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="style_loading">
					<el-table-column show-overflow-tooltip prop="sjsj" label="上架时间" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="dpmc" label="店铺名称" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="ksbm" label="款式编码" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="gys" label="供应商" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="gyshh" label="供应商款号" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="gys_level" label="供应商等级" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="sjcb" label="审计成本" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="sj" label="售价" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="xssl_7" label="7天销量" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="mlv" label="毛利率" align="center"></el-table-column>
					<el-table-column show-overflow-tooltip prop="xsje_7" label="7天销售金额" width="120" align="center"></el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="styleSizeChange" @current-change="stylePageChange" :current-page="style_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="style_total">
					</el-pagination>
				</div>
			</div>
		</div>
		<!-- 供应商 -->
		<div class="table_row">
			<div class="item table_box">
				<div class="button_rows">
					<div class="table_title">供应商</div>
					<el-button type="primary" plain size="mini" @click="exportFn('supplier')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table :data="supplier_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="supplier_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" width="120" align="center" v-for="(item,index) in supplier_title" :fixed="index == 0">
						<template slot-scope="scope">
							<div :class="{'bold_style':index == 0}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="120" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':index == 0 || index == 1}">{{scope.row[i.row_field_name]}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="supplierSizeChange" @current-change="supplierPageChange" :current-page="supplier_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="supplier_total">
					</el-pagination>
				</div>
			</div>
			<div class="item">
				<div class="button_rows">
					<div class="table_title">S+A供应商</div>
					<el-button type="primary" plain size="mini" @click="exportFn('supplier_sa')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table :data="sa_supplier_data" size="small" max-height="320" style="width: 100%" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="sa_supplier_loading">
					<el-table-column :label="item.row_name" :prop="item.row_field_name" width="120" align="center" v-for="(item,index) in sa_supplier_title" :fixed="index == 0">
						<template slot-scope="scope">
							<div :class="{'bold_style':index == 0}">{{scope.row[item.row_field_name]}}</div>
						</template>
						<el-table-column :label="i.row_name" :prop="i.row_field_name" align="center" width="120" v-for="(i,i_index) in item.list">
							<template slot-scope="scope">
								<div :class="{'bold_style':index == 0 || index == 1}">{{scope.row[i.row_field_name]}}</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="saSupplierSizeChange" @current-change="saSupplierPageChange" :current-page="sa_supplier_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="sa_supplier_total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script type="text/javascript">
	import {lastXDate,getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import resource from '../../api/resource.js'
	import demandResource from '../../api/demandResource.js'
	import {exportPost,exportNewExcel,exportUp} from '../../api/export.js'
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
				},	 										
				date:[lastXDate(7),lastXDate(1)],			//时间区间
				store_list: [],								//店铺列表	
				select_store_ids:[],						//选中的店铺列表
				type:"",									//是否杭州档口
				company_dept_loading:false,
				company_title:[],		//公司表头
				company_data:[],		//公司表格数据
				storeNewStatusChart:null,
				dept_title:[],			//事业部表头
				dept_data:[],			//事业部表格数据
				deptDataChart:null,
				xmb_loading:false,		//项目部
				xmb_title:[],			//项目部表头
				xmb_data:[],			//项目部数据
				xmbDataChart:null,
				store_loading:false,	//店铺
				store_pagesize:10,
				store_page:1,
				store_title:[],			//店铺表头
				store_data:[],			//店铺数据
				store_total:0,
				style_loading:false,	//店铺款式上新
				style_pagesize:10,
				style_page:1,
				style_data:[],			//店铺数据
				style_total:0,
				supplier_loading:false,	//供应商
				supplier_pagesize:10,
				supplier_page:1,
				supplier_title:[],		//公司表头
				supplier_data:[],		//公司表格数据
				supplier_total:0,
				sa_supplier_loading:false,	//SA供应商
				sa_supplier_pagesize:10,
				sa_supplier_page:1,
				sa_supplier_title:[],		//公司表头
				sa_supplier_data:[],		//公司表格数据
				sa_supplier_total:0,
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

			}
		},
		created(){
			// 获取所有店铺
			this.getStoreList();
			//点击搜索
			this.searchFn();
		},
		methods:{
			//一列背景色
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0){
					return 'background: #F6BD16;color:#333333';
				}
			},
			//两列背景色
			twoColumnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0 || columnIndex == 1){
					return 'background: #F6BD16;color:#333333';
				}
			},
			//合并单元格
			spanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0) {
					if (rowIndex % 3 === 0) {
						return [3, 1];
					} else {
						return [0, 0];
					}
				}
			},
			//点击搜索
			searchFn(){
				//公司、事业部数据
				this.companyDeptKsList();
				//项目部数据
				this.xmb_pagesize = 10;
				this.xmb_page = 1;
				this.xmbKsList();
				//店铺数据
				this.store_pagesize = 10;
				this.store_page = 1;
				this.storeKsList();
				//店铺款式上新
				this.style_pagesize = 10;
				this.style_page = 1;
				this.styleKsList();
				//供应商
				this.supplier_pagesize = 10;
				this.supplier_page = 1;
				this.supplierList();
				//sa供应商
				this.sa_supplier_pagesize = 10;
				this.sa_supplier_page = 1;
				this.saSupplierList();
			},
			// 获取所有店铺
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//公司、事业部数据
			companyDeptKsList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type
				}
				this.company_dept_loading = true;
				demandResource.companyDeptKsList(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						this.company_dept_loading = false;
						let x_axis = [];			//公共横坐标
						// 店铺数据
						let company = res.data.data.company;
						this.company_title = company.table_list;
						this.company_data = company.data;
						//店铺款式粒度-每日上款情况表格数据
						this.company_title.map((item,index) => {
							if(index > 1){
								x_axis.push(item.row_name);
							}
						})
						let company_legend = [];			//图例名称
						let company_series_data = [];		//数据
						this.company_data.map((item,index) => {
							if(index > 0){
								company_legend.push(item.gys_level);
								let data_item = {
									name: item.gys_level,
									type: 'bar',
									stack: 'Ad',
									emphasis: {
										focus: 'series'
									},
									label: {
										show: true,
										formatter: function (params) {
											let tip = params.data.value > 100?params.data.value + "\n"
											+ params.data.rate + '%':'';
											return tip;
										},
										position: 'top'
									},
									data: []
								}
								x_axis.map((x_item,x_i) => {
									let x_o = {
										value:item[`num_${x_item.split('-')[2]}`],
										rate:item[`rate_${x_item.split('-')[2]}`]
									}
									data_item.data.push(x_o)
								})
								company_series_data.push(data_item)
							}
						})
						var store_new_status = document.getElementById('store_new_status');
						this.storeNewStatusChart = echarts.getInstanceByDom(store_new_status)
						if (this.storeNewStatusChart == null) { 
							this.storeNewStatusChart = echarts.init(store_new_status);
						}
						this.storeNewStatusChart.setOption(this.setBarOption(company_legend,x_axis,company_series_data,'store'));
						//事业部数据
						let dept = res.data.data.dept;
						this.dept_title = dept.table_list;
						let dept_data = dept.data;
						this.dept_data = dept_data.length > 0?dept_data.reduce(function (a, b) { 
							return a.concat(b)
						}):[];
						// 事业部图表
						let dept_legend = [];	//图例名称
						let dept_series_data = [];		//数据
						this.dept_data.map((item,index) => {
							if(index == 0 || index%3==0){
								dept_legend.push(item.dept_1);
								let dept_data_item = {
									name: item.dept_1,
									type: 'bar',
									emphasis: {
										focus: 'series'
									},
									label: {
										show: true,
										formatter: function (params) {
											return params.value > 0?params.value:'';
										},
										position: 'top'
									},
									data: []
								}
								x_axis.map((x_item,x_i) => {
									dept_data_item.data.push(item[`num_${x_item.split('-')[2]}`])
								})
								dept_series_data.push(dept_data_item);
							}
						})
						var dept_data_chart = document.getElementById('dept_data_chart');
						this.deptDataChart = echarts.getInstanceByDom(dept_data_chart)
						if (this.deptDataChart == null) { 
							this.deptDataChart = echarts.init(dept_data_chart);
						}
						this.deptDataChart.setOption(this.setBarOption(dept_legend,x_axis,dept_series_data,'dept'));


						window.addEventListener('resize',() => {
							this.storeNewStatusChart.resize();
							this.deptDataChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//数据-导出
			exportFn(item){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type
				}
				if(item == 'detail'){		//店铺上新明细
					MessageBox.confirm('确认导出?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						arg.item = item;
						demandResource.shopKsDetailExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'店铺上新明细数据');
							}
						})
					}).catch(() => {
						Message({
							type: 'info',
							message: '取消导出'
						});          
					});
				}else{
					if(item == 'company' || item == 'dept'){	//公司、事业部
						arg.item = item;
						exportUp(`supplier/company_dept_ks_list_export?start_time=${arg.start_time}&end_time=${arg.end_time}&shop_id=${arg.shop_id}&type=${arg.type}&item=${arg.item}`);
					}else if(item == 'xmb'){		//项目部
						exportUp(`supplier/dept_ks_list_export?start_time=${arg.start_time}&end_time=${arg.end_time}&shop_id=${arg.shop_id}&type=${arg.type}`)
					}else if(item == 'store'){		//店铺
						exportUp(`supplier/shop_ks_list_export?start_time=${arg.start_time}&end_time=${arg.end_time}&shop_id=${arg.shop_id}&type=${arg.type}`)
					}else if(item == 'supplier'){	//供应商
						exportUp(`supplier/gys_ks_list_export?start_time=${arg.start_time}&end_time=${arg.end_time}&shop_id=${arg.shop_id}&type=${arg.type}`)
					}else if(item == 'supplier_sa'){	//供应商sa
						exportUp(`supplier/sa_ks_list_export?start_time=${arg.start_time}&end_time=${arg.end_time}&shop_id=${arg.shop_id}&type=${arg.type}`)
					}
				}
			},
			//项目部数据
			xmbKsList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type,
				}
				this.xmb_loading = true;
				demandResource.xmbKsList(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						this.xmb_loading = false;
						let x_axis = [];			//横坐标
						// 项目部数据
						let data = res.data.data;
						this.xmb_title = data.table_list;
						let xmb_data = data.data;
						this.xmb_data = xmb_data.length > 0?xmb_data.reduce(function (a, b) { 
							return a.concat(b)
						}):[];
						//横坐标
						this.xmb_title.map((item,index) => {
							if(index > 2){
								x_axis.push(item.row_name);
							}
						})
						// 项目部图表
						let xmb_legend = [];	//图例名称
						let xmb_series_data = [];		//数据
						this.xmb_data.map((item,index) => {
							if(index == 0 || index%3==0){
								xmb_legend.push(item.dept_1);
								let xmb_data_item = {
									name: item.dept_1,
									type: 'bar',
									emphasis: {
										focus: 'series'
									},
									label: {
										show: true,
										formatter: function (params) {
											return params.value > 0?params.value:'';
										},
										position: 'top'
									},
									data: []
								}
								x_axis.map((x_item,x_i) => {
									xmb_data_item.data.push(item[`num_${x_item.split('-')[2]}`])
								})
								xmb_series_data.push(xmb_data_item);
							}
						})
						var xmb_data_chart = document.getElementById('xmb_data_chart');
						this.xmbDataChart = echarts.getInstanceByDom(xmb_data_chart)
						if (this.xmbDataChart == null) { 
							this.xmbDataChart = echarts.init(xmb_data_chart);
						}
						this.xmbDataChart.setOption(this.setBarOption(xmb_legend,x_axis,xmb_series_data,'xmb'));


						window.addEventListener('resize',() => {
							this.xmbDataChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			storeSizeChange(val) {
				this.store_pagesize = val;
				//店铺数据
				this.storeKsList();
			},
			storePageChange(val) {
				this.store_page = val;
				//店铺数据
				this.storeKsList();
			},
			//店铺数据
			storeKsList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type,
					page:this.store_page,
					pagesize:this.store_pagesize
				}
				this.store_loading = true;
				demandResource.storeKsList(arg).then(res => {
					if(res.data.code == 1){
						this.store_loading = false;
						// 店铺数据
						let data = res.data.data;
						this.store_title = data.table_list;
						this.store_total = data.data.total;
						let store_data = data.data.data;
						this.store_data = store_data.length > 0?store_data.reduce(function (a, b) { 
							return a.concat(b)
						}):[];
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			styleSizeChange(val) {
				this.style_pagesize = val;
				//店铺款式上新
				this.styleKsList();
			},
			stylePageChange(val) {
				this.style_page = val;
				//店铺款式上新
				this.styleKsList();
			},
			//店铺款式上新
			styleKsList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type,
					page:this.style_page,
					pagesize:this.style_pagesize
				}
				this.style_loading = true;
				demandResource.styleKsList(arg).then(res => {
					if(res.data.code == 1){
						this.style_loading = false;
						// 店铺数据
						let data = res.data.data;
						this.style_total = data.total;
						this.style_data = data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			supplierSizeChange(val) {
				this.supplier_pagesize = val;
				//供应商
				this.supplierList();
			},
			supplierPageChange(val) {
				this.supplier_page = val;
				//供应商
				this.supplierList();
			},
			//供应商
			supplierList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type,
					page:this.supplier_page,
					pagesize:this.supplier_pagesize
				}
				this.supplier_loading = true;
				demandResource.supplierList(arg).then(res => {
					if(res.data.code == 1){
						this.supplier_loading = false;
						// 供应商
						let data = res.data.data;
						this.supplier_title = data.table_list;
						this.supplier_total = data.data.total;
						let supplier_data = data.data.data;
						this.supplier_data = supplier_data.length > 0?supplier_data.reduce(function (a, b) { 
							return a.concat(b)
						}):[];
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			saSupplierSizeChange(val) {
				this.sa_supplier_pagesize = val;
				//供应商
				this.saSupplierList();
			},
			saSupplierPageChange(val) {
				this.sa_supplier_page = val;
				//供应商
				this.saSupplierList();
			},
			//sa供应商
			saSupplierList(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					shop_id:this.select_store_ids.join(','),
					type:this.type,
					page:this.sa_supplier_page,
					pagesize:this.sa_supplier_pagesize
				}
				this.sa_supplier_loading = true;
				demandResource.saSupplierList(arg).then(res => {
					if(res.data.code == 1){
						this.sa_supplier_loading = false;
						// 供应商
						let data = res.data.data;
						this.sa_supplier_title = data.table_list;
						this.sa_supplier_total = data.data.total;
						let sa_supplier_data = data.data.data;
						this.sa_supplier_data = sa_supplier_data.length > 0?sa_supplier_data.reduce(function (a, b) { 
							return a.concat(b)
						}):[];
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//柱状图配置
			setBarOption(legend,x_axis,series_data,type){
				if(series_data.length == 0){
					if(type == 'store'){
						this.storeNewStatusChart.clear();
					}
					if(type == 'dept'){
						this.deptDataChart.clear();
					}
					if(type == 'xmb'){
						this.xmbDataChart.clear();
					}
					return this.empty_option;
				}else{
					if(type == 'store'){
						this.storeNewStatusChart.clear();
					}
					if(type == 'dept'){
						this.deptDataChart.clear();
					}
					if(type == 'xmb'){
						this.xmbDataChart.clear();
					}
					
					return {
						tooltip: {
							trigger: 'axis',
							formatter: function (params) {
								let tip = "";
								if(params != null && params.length > 0) {
									tip = '上架时间：' + params[0].axisValueLabel + "</br>";
									params.map(item => {
										if(type == 'store'){
											tip += item.seriesName + "款数：" + item.data.value + "</br>" + item.seriesName + "占比：" + item.data.rate + "%</br>";
										}else{
											tip += item.seriesName + "款数：" + item.value + "</br>";
										}

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
						grid:{
							top:type == 'xmb'?'25%':'15%'
						},
						legend: {
							data: legend,
							top:0,
							left:0
						},
						xAxis: [
						{
							type: 'category',
							data: x_axis
						}
						],
						yAxis: [{
							type: 'value',
							name:'款数',
						}],
						series: series_data
					};
				}
			}
		}
	}
	
</script>
<style lang="less" scoped>
.table_row{
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
	.item{
		width: 49%;
		.bold_style{
			color: #333333;
			font-weight: bold;
		}
	}
	.chart_box{
		height: 420px;
	}
}
.button_rows{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content:space-between;
	.table_title{
		color: #333333;
		font-size:16px;
		font-weight:bold;
	}
}
</style>