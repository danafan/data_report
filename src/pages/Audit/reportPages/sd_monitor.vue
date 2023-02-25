<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="dpmc_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="结算方式：">
				<el-select v-model="jsfs_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in jsfs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="sjxrrq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="商品编码：">
				<el-input clearable v-model="spbm" placeholder="商品编码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 两个图表 -->
		<div class="flex jsb mb-10">
			<div class="gys_lists" id="gys_lists" v-loading="chart_loading"></div>
			<div class="gys_lists" id="jsfs_lists" v-loading="chart_loading"></div>
		</div>
		<!-- 供应商（日结、现结） -->
		<div class="flex jsb mb-15">
			<div class="jsfs_item">
				<div class="f16 bold mb-10">日结-供应商</div>
				<div class="flex jsb mb-15">
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">供应商数量</div>
						<div class="card_num f20 bold">{{rj_info.gys_num}}个</div>
					</el-card>
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">款式数量</div>
						<div class="card_num f20 bold">{{rj_info.ksbm_num}}款</div>
					</el-card>
				</div>
				<div class="flex jsb">
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">3天刷单量</div>
						<div class="card_num f20 bold">{{rj_info.sd_xssl_3_sum}}件</div>
					</el-card>
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">3天真实销量</div>
						<div class="card_num f20 bold">{{rj_info.xssl_3_sum}}件</div>
					</el-card>
				</div>
			</div>
			<div class="jsfs_item">
				<div class="f16 bold mb-10">现结-供应商</div>
				<div class="flex jsb mb-15">
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">供应商数量</div>
						<div class="card_num f20 bold">{{xj_info.gys_num}}个</div>
					</el-card>
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">款式数量</div>
						<div class="card_num f20 bold">{{xj_info.ksbm_num}}款</div>
					</el-card>
				</div>
				<div class="flex jsb">
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">3天刷单量</div>
						<div class="card_num f20 bold">{{xj_info.sd_xssl_3_sum}}件</div>
					</el-card>
					<el-card class="item_card" v-loading="chart_loading">
						<div class="mb-10">3天真实销量</div>
						<div class="card_num f20 bold">{{xj_info.xssl_3_sum}}件</div>
					</el-card>
				</div>
			</div>
		</div>
		<div class="buts">
			<div class="title">店铺款式刷单情况</div>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="table_data.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column :prop="item.row_field_name" align="center" :sortable="item.is_sort?'custom':false" show-overflow-tooltip v-for="item in title_list">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
						<div class="prop_text">{{item.row_name}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-tooltip placement="top-end" v-if="item.row_field_name == 'ksbm'">
						<div slot="content">
							<el-button type="text" size="mini" @click="getDetail(scope.row.ksbm,scope.row.shop_name)">下钻</el-button>
						</div>
						<div style="color: #1890FF">{{scope.row[item.row_field_name]}}</div>
					</el-tooltip>
					<el-image :z-index="2006" class="image" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-else-if="item.row_field_name == 'tp'"></el-image>
					<div v-else>{{scope.row[item.row_field_name]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="table_data.total">
			</el-pagination>
		</div>
		<!-- 下钻 -->
		<el-dialog title="款式信息" width="65%" @close="closeDetail" :visible.sync="detailDialog">
			<el-table :data="detail_data.data" @sort-change="sortDetailChange" size="mini">
				<el-table-column :prop="item.row_field_name" align="center" :sortable="item.is_sort?'custom':false" show-overflow-tooltip v-for="item in detail_title_list">
					<template slot="header" slot-scope="scope">
						<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
							<div class="prop_text">{{item.row_name}}</div>
						</el-tooltip>
					</template>
					<template slot-scope="scope">
						<div>{{scope.row[item.row_field_name]}}</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @size-change="detailSizeChange" @current-change="detailCurrentChange" :current-page="detail_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="detail_data.total">
				</el-pagination>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.gys_lists{
	width: 45%;
	height: 360px;
}
.jsfs_item{
	width: 40%;
	.item_card{
		width: 40%;
		.card_num{
			color: #FDA409;
		}
	}
}
.buts{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title{
		font-size: 14px;
		font-weight: bold;
	}
}
</style>
<script>
	import commonResource from '../../../api/resource.js'
	import resource from '../../../api/auditResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				loading:false,
				jsfs_list:[],			//结算方式列表
				jsfs_ids:[],			//选中的结算方式
				ks_list:[],				//款式编码列表
				select_ks_ids:[],		//选中的款式编码列表
				gys_list:[],			//供应商列表
				select_gys_ids:[],		//选中的供应商
				spbm:"",				//商品编码
				shop_list:[],			//店铺列表
				dpmc_ids:[],			//选中的店铺名称
				sjxrrq:"",
				page:1,
				pagesize:10,
				sort:"",
				title_list:[],
				table_data:{},
				chart_loading:false,
				rj_info:{},						//日结数据
				xj_info:{},						//现结数据
				gysListsChart:null,				//左侧柱状图
				jsfsListsChart:null,			//右侧饼图
				detailDialog:false,				//下钻
				ksbm:'',
				shop_name:'',
				detail_page_size:10,
				detail_page:1,
				detail_data:{},
				detail_sort:"",
				detail_title_list:[],
			}
		},
		created(){
			//获取店铺列表
			this.ajaxShops();
			//供应商结算方式
			this.ajaxJsfs();
			//获取列表（款式）
			this.getData();
			//店铺款式刷单情况-报表头部汇总
			this.storeSdTotal();
		},
		methods:{
			//供应商结算方式
			ajaxJsfs(){
				commonResource.ajaxJsfs().then(res => {
					if(res.data.code == 1){
						this.jsfs_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取款式编码
			getKsbm(e){
				if(e != ''){
					commonResource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商列表
			getGys(e){
				if(e != ''){
					commonResource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取店铺列表
			ajaxShops(){
				commonResource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			searchFn(){
				//店铺款式刷单情况-报表头部汇总
				this.storeSdTotal();
				this.handleCurrentChange(1);
			},
			//店铺款式刷单情况-报表头部汇总
			storeSdTotal(){
				let arg = {
					jsfs:this.jsfs_ids.join(','),
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					spbm:this.spbm,
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					shop_name:this.dpmc_ids.join(','),
				}
				this.chart_loading = true;
				resource.storeSdTotal(arg).then(res => {
					if(res.data.code == 1){
						//日结/现结数据
						this.rj_info = res.data.data.rj_info;
						this.xj_info = res.data.data.xj_info;

						var echarts = require("echarts");
						this.chart_loading = false;
						//左侧柱状图
						let gys_lists_data = res.data.data.gys_lists;
						let y_axis_data = gys_lists_data.map(item => {
							return item.name
						});
						let series_data = gys_lists_data.map(item => {
							return item.num
						});
						var gys_lists = document.getElementById('gys_lists');
						this.gysListsChart = echarts.getInstanceByDom(gys_lists)
						if (this.gysListsChart == null) { 
							this.gysListsChart = echarts.init(gys_lists);
						}
						this.gysListsChart.setOption(this.setBarOptions(y_axis_data,series_data));
						//右侧饼图
						let jsfs_lists_data = res.data.data.jsfs_lists;
						let pie_series_data = jsfs_lists_data.map(item => {
							let o = {
								value:item.percent,
								num:item.num,
								name:item.name
							}
							return o;
						})
						var jsfs_lists = document.getElementById('jsfs_lists');
						this.jsfsListsChart = echarts.getInstanceByDom(jsfs_lists)
						if (this.jsfsListsChart == null) { 
							this.jsfsListsChart = echarts.init(jsfs_lists);
						}
						this.jsfsListsChart.setOption(this.setPieOptions(pie_series_data));

						window.addEventListener('resize',() => {
							this.gysListsChart.resize();
							this.jsfsListsChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//柱状图图配置
			setBarOptions(y_axis_data,series_data){
				return {
					title: {
						text: '供应商3日刷单量-排行'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let tip = "供应商：" + params[0].name + "</br>"
							+ "3日刷单量：" + params[0].value + "</br>";
							return tip;
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
					},
					grid: {
						left: '3%',
						right: '4%',
						bottom: '3%',
						containLabel: true
					},
					xAxis: {
						type: 'value'
					},
					yAxis: {
						type: 'category',
						data: y_axis_data
					},
					series: [
					{
						type: 'bar',
						label: {
							show: true
						},
						emphasis: {
							focus: 'series'
						},
						data: series_data
					}
					]
				}
			},
			//饼图配置
			setPieOptions(pie_series_data){
				return {
					title: {
						text: '结算方式3日刷单-占比',
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return "结算方式：" + params.data.name + '</br>' 
							+ "3日刷单数：" + params.data.num + '</br>'
							+ "百分比：" + params.data.value + '%';
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
						type: 'pie',
						radius: [0, '70%'],
						label:{
							show:true,
							position:'inner',
							lineHeight: 16,
							formatter:(params) => {
								return params.data.name + '\n'
								+ params.data.num + '\n'
								+ params.data.value + '%';
							},
						},
						data: pie_series_data,
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
			//获取列表
			getData(){
				let arg = {
					jsfs:this.jsfs_ids.join(','),
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					spbm:this.spbm,
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					shop_name:this.dpmc_ids.join(','),
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.storeSdReport(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.title_list = res.data.data.title_list;
						this.table_data = res.data.data.table_data;
						this.table_data.data.map(item => {
							let images = [];
							images.push(item.tp);
							item['images'] = images;
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//下钻
			getDetail(ksbm,shop_name){
				this.ksbm = ksbm;
				this.shop_name = shop_name;
				//获取下钻内容
				this.getDetailList();
			},
			//获取下钻内容
			getDetailList(){
				let arg = {
					ksbm:this.ksbm,
					shop_name:this.shop_name,
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					sort:this.detail_sort,
					page:this.detail_page,
					pagesize:this.detail_page_size
				}
				resource.storeSdSpbm(arg).then(res => {
					if(res.data.code == 1){
						this.detail_data = res.data.data.table_data;
						this.detail_title_list = res.data.data.title_list;
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//下钻排序
			sortDetailChange({ column, prop, order }) {  
				if(order){
					this.detail_sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.detail_sort = "";
				}   
				this.getDetailList();
			},
			//关闭
			closeDetail(){
				this.detail_page_size = 10;
				this.detail_page = 1;
			},
			//分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				//获取列表
				this.getDetailList();
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetailList();
			},
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.sort = "";
				}   
				this.getData();
			},
			//款式信息列表导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						jsfs:this.jsfs_ids.join(','),
						sjxrrq:this.sjxrrq?this.sjxrrq:'',
						spbm:this.spbm,
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						shop_name:this.dpmc_ids.join(','),
						sort:this.sort,
					}
					resource.storeSdReportExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'店铺款式刷单情况');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				this.page = 1;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			}
			
		}
	}
</script>










