<template>
	<div class="supplier_data_container">
		<div class="page_top_row">
			<div class="input_box">
				<img class="s_search_icon" src="../../static/s_search_icon.png">
				<input placeholder="请输入你想要搜索的内容" v-model="supplier_name" @change="changeFn">
			</div>
			<div class="name">{{top_info.gys}}</div>
			<div class="type_row">
				<div>{{top_info.jsfs}}</div>
				<div>aaa+</div>
			</div>
		</div>
		<el-card>
			<div slot="header">
				<span class="card_title">数据更新日：{{update_date}}</span>
			</div>
			<div class="content_row">
				<div class="row_item">
					<img class="item_icon" src="../../static/zsks_icon.png">
					<div class="item_text">
						<div class="text_val">{{top_info.ksbm_num}}</div>
						<div class="text_label">在售款数</div>
					</div>
				</div>
				<div class="row_item">
					<img class="item_icon" src="../../static/zrxl_icon.png">
					<div class="item_text">
						<div class="text_val">{{top_info.xssl_1}}</div>
						<div class="text_label">昨日销量</div>
					</div>
				</div>
				<div class="row_item">
					<img class="item_icon" src="../../static/jsstxl_icon.png">
					<div class="item_text">
						<div class="text_val">{{top_info.xssl_sum_30}}</div>
						<div class="text_label">近30天销量</div>
					</div>
				</div>
				<div class="row_item">
					<img class="item_icon" src="../../static/stl_icon.png">
					<div class="item_text">
						<div class="text_val">{{top_info.stl}}</div>
						<div class="text_label">实退率</div>
					</div>
				</div>
				<div class="row_item">
					<img class="item_icon" src="../../static/mll_icon.png">
					<div class="item_text">
						<div class="text_val">{{top_info.mll}}</div>
						<div class="text_label">毛利率</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="margin_top">
			<div slot="header">
				<span class="card_title">库存报货统计</span>
			</div>
			<div class="content_row">
				<div class="bhtj_item">
					<div class="val_item">
						<div class="bhtj_val">{{top_info.qhs}}</div>
						<div class="bhtj_label">缺货数</div>
					</div>
					<div class="val_item margin_top">
						<div class="bhtj_val">{{top_info.zrdhl}}</div>
						<div class="bhtj_label">昨日到货率</div>
					</div>
				</div>
				<div class="bhtj_item">
					<div class="val_item">
						<div class="bhtj_val">{{top_info.xykc}}</div>
						<div class="bhtj_label">库存数</div>
					</div>
					<div class="val_item margin_top">
						<div class="bhtj_val">{{top_info.pbh_dhl_1}}</div>
						<div class="bhtj_label">昨日排除备货到货率</div>
					</div>
				</div>
				<div class="bhtj_item">
					<div class="val_item">
						<div class="bhtj_val">{{top_info.cgsl_7}}</div>
						<div class="bhtj_label">报货数</div>
					</div>
					<div class="val_item margin_top">
						<div class="bhtj_val">{{top_info.dhl_7}}</div>
						<div class="bhtj_label">7天到货率</div>
					</div>
				</div>
				<div class="bhtj_item">
					<div class="val_item">
						<div class="bhtj_val">{{top_info.rksl_7}}</div>
						<div class="bhtj_label">到货数</div>
					</div>
					<div class="val_item margin_top">
						<div class="bhtj_val">{{top_info.pbh_dhl_7}}</div>
						<div class="bhtj_label">7天排除备货到货率</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="margin_top">
			<div slot="header">
				<span class="card_title">销量统计</span>
			</div>
			<div class="xltj_row">
				<div class="left_total">
					<div class="left_item">
						<div class="label">本月销量</div>
						<div class="value">{{pro_info.month_xssl}}</div>
						<div class="percentage_row">
							<img class="per_icon" src="../../static/per_up_icon.png">
							<div class="per_value">{{pro_info.month_hb}}</div>
							<div class="per_label">环比上月</div>
						</div>
					</div>
					<div class="left_item left_item_margin">
						<div class="label">本周销量</div>
						<div class="value">{{pro_info.week_xssl}}</div>
						<div class="percentage_row">
							<img class="per_icon" src="../../static/per_up_icon.png">
							<div class="per_value">{{pro_info.week_hb}}</div>
							<div class="per_label">环比上周</div>
						</div>
					</div>
				</div>
				<div class="right_chart">
					<div class="tab_row">
						<div class="tab_item" :class="{'active_tab':type == '1'}" @click="type = '1'">本月</div>
						<div class="tab_item margin_left" :class="{'active_tab':type == '2'}" @click="type = '2'">本周</div>
					</div>
					<!-- 本月图表 -->
					<div class="tj_chart" id="month_chart" v-show="type == '1'"></div>
					<!-- 本周图表 -->
					<div class="tj_chart" id="week_chart" v-show="type == '2'"></div>
				</div>
			</div>
		</el-card>
		<el-card class="margin_top">
			<div slot="header">
				<span class="card_title">款式信息</span>
			</div>
			<div>
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item label="输入搜索：">
						<el-input placeholder="款式编码" suffix-icon="el-icon-search" v-model="ksbm" @change="ksPageChange(1)">
						</el-input>
					</el-form-item>
					<el-form-item label="是否新品：">
						<el-select v-model="is_new" clearable :popper-append-to-body="false" placeholder="全部" @change="ksPageChange(1)">
							<el-option label="是" value="是"></el-option>
							<el-option label="否" value="否"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-table size="small" :data="ks_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="ks_loading">
					<el-table-column :prop="item.prop" :label="item.label" align="center" show-overflow-tooltip :render-header="renderHeader" v-for="item in ks_column_list">
						<template slot-scope="scope">
							<el-image :z-index="2008" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.type == 3"></el-image>
							<div v-else-if="item.is_template">{{scope.row.gys}}/{{scope.row.gys_level}}</div>
							<div v-else>{{scope.row[item.prop]}}</div>
						</template>
					</el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="ksSizeChange" @current-change="ksPageChange" :current-page="ks_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="ks_total">
					</el-pagination>
				</div>
			</div>
		</el-card>
		<el-card class="margin_top">
			<div slot="header">
				<span class="card_title">SKU信息</span>
			</div>
			<div>
				<el-table size="small" :data="sku_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="sku_loading">
					<el-table-column :prop="item.prop" :label="item.label" align="center" v-for="item in sku_column_list"></el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="skuSizeChange" @current-change="skuPageChange" :current-page="sku_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="sku_total">
					</el-pagination>
				</div>
			</div>
		</el-card>
	</div>
</template>
<script>
	import resource from '../../api/demandResource.js'

	export default{
		data(){
			return{
				supplier_name:"",	//输入的供应商名称
				update_date:"",		//数据更新日
				top_info:{},		//顶部信息
				pro_info:{},		//头部汇总信息
				type:'1',			//销量统计类型（1:本月；2:本周）
				monthChart:null,
				month_list_data:{},
				weekChart:null,
				week_list_data:{},
				ksbm:"",			//输入的款式编码
				is_new:"",			//是否新品
				ks_column_list:[{
					label:"图片",
					prop:'tp',
					type:3
				},{
					label:"款式编码",
					prop:'ksbm',
				},{
					label:"供应商货号",
					prop:'gyshh',
				},{
					label:"7天日均销量",
					prop:'xssl_sum_7',
				},{
					label:"30天销量",
					prop:'xssl_sum_30',
				},{
					label:"7天毛利率",
					prop:'mll',
				},{
					label:"15天实退率",
					prop:'stl_15',
				},{
					label:"7天到货率",
					prop:'dhl_7',
				},{
					label:"28日销量",
					prop:'dhs_3',
				},{
					label:"29日销量",
					prop:'dhs_2',
				},{
					label:"30日销量",
					prop:'dhs_1',
				},{
					label:"主卖店铺",
					prop:'zmdp',
				},{
					label:"28日到货",
					prop:'dhs_3',
				},{
					label:"29日到货",
					prop:'dhs_2',
				},{
					label:"30日到货",
					prop:'dhs_1',
				},{
					label:"现有库存",
					prop:'xykc',
				},{
					label:"缺货数",
					prop:'qhs',
				},{
					label:"批发价",
					prop:'pfj',
				},{
					label:"审计成本",
					prop:'sjcb',
				},{
					label:"商品名称",
					prop:'mc',
				},{
					label:"供应商/供应商等级",
					prop:"",
					is_template:true,
				},{
					label:"结算方式",
					prop:'jsfs',
				}],							//款式信息列
				ks_table_data:[],			//款式信息数据列表
				ks_total:0,
				ks_loading:false,
				ks_page:1,
				ks_pagesize:10,	
				sku_column_list:[{
					label:"款式编码",
					prop:"ksbm"
				},{
					label:"3天销量",
					prop:"ksbm"
				},{
					label:"7天销量",
					prop:"ksbm"
				},{
					label:"30天销量",
					prop:"ksbm"
				},{
					label:"28日销量",
					prop:"ksbm"
				},{
					label:"29日销量",
					prop:"ksbm"
				},{
					label:"30日销量",
					prop:"ksbm"
				},{
					label:"现有库存",
					prop:"ksbm"
				},{
					label:"订单占有数",
					prop:"ksbm"
				},{
					label:"缺货数",
					prop:"ksbm"
				},{
					label:"28日到货数",
					prop:"ksbm"
				},{
					label:"29日到货数",
					prop:"ksbm"
				},{
					label:"30日到货数",
					prop:"ksbm"
				}],							//sku信息列
				sku_table_data:[],			//sku数据列表
				sku_total:0,				
				sku_loading:false,
				sku_page:1,
				sku_pagesize:10,	
			}
		},
		created(){
			//顶部信息
			this.boardGysInfo();
			//本月本周销量和环比
			this.getGysWeekmonthTotal();
			//本月本周销量图表
			this.getGysWeekMonthChart();
			//款式信息列表
			this.ksInfoData();
		},
		watch:{
			//切换本月或本周
			type:function(n,o){
				if(n == '1'){
					this.setMonthChart();
				}else{
					this.setWeekChart();
				}
			}
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
			//顶部搜索供应商
			changeFn(){

			},
			//顶部信息
			boardGysInfo(){
				let arg = {
					gys:this.supplier_name
				}
				resource.boardGysInfo().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.update_date = data.date;
						this.top_info = data.info;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//本月本周销量和环比
			getGysWeekmonthTotal(){
				let arg = {
					gys:this.supplier_name
				}
				resource.getGysWeekmonthTotal(arg).then(res => {
					if(res.data.code == 1){
						this.pro_info = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//本月本周销量图表
			getGysWeekMonthChart(){
				let arg = {
					gys:this.supplier_name
				}
				resource.getGysWeekMonthChart(arg).then(res => {
					if(res.data.code == 1){
						this.month_list_data = res.data.data.month_list;
						this.week_list_data = res.data.data.week_list;
						//渲染月图表
						this.setMonthChart();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//渲染月图表
			setMonthChart(){
				this.$nextTick(() => {
					var echarts = require("echarts");
					var month_chart = document.getElementById('month_chart');
					this.monthChart = echarts.getInstanceByDom(month_chart)
					if (this.monthChart == null) { 
						this.monthChart = echarts.init(month_chart);
					}
					this.monthChart.setOption(this.setOptions('近一月销售统计',this.month_list_data.day_list,this.month_list_data.data_list));
					window.addEventListener('resize',() => {
						this.monthChart.resize();
					})
				})	
			},
			//渲染周图表
			setWeekChart(){
				this.$nextTick(() => {
					var echarts = require("echarts");
					var week_chart = document.getElementById('week_chart');
					this.weekChart = echarts.getInstanceByDom(week_chart)
					if (this.weekChart == null) { 
						this.weekChart = echarts.init(week_chart);
					}
					this.weekChart.setOption(this.setOptions('近一周销售统计',this.week_list_data.day_list,this.week_list_data.data_list));
					window.addEventListener('resize',() => {
						this.weekChart.resize();
					})
				})
			},
			//图表渲染
			setOptions(title,x_axis,series_data){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'axis'
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: x_axis
					},
					yAxis: {
						type: 'value'
					},
					series: [
					{
						data: series_data,
						type: 'line',
						areaStyle: {}
					}
					]
				}
			},
			//款式信息分页
			ksSizeChange(val) {
				this.ks_pagesize = val;
				//款式信息列表
				this.ksInfoData();
			},
			ksPageChange(val) {
				this.ks_page = val;
				//款式信息列表
				this.ksInfoData();
			},
			//款式信息列表
			ksInfoData(){
				let arg = {
					gys:this.supplier_name,
					ksbm:this.ksbm,
					is_new:this.is_new,
					page:this.ks_page,
					pagesize:this.ks_pagesize
				}
				resource.getGysKsbmList(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						let ks_table_data = data.data;
						ks_table_data.map(item => {
							let images = [];
							images.push(item.tp);
							item.images = images;
						})
						this.ks_table_data = ks_table_data;
						this.ks_total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//sku信息分页
			skuSizeChange(val) {
				this.sku_pagesize = val;
				//sku信息列表
				this.skuInfoData();
			},
			skuPageChange(val) {
				this.sku_page = val;
				//sku信息列表
				this.skuInfoData();
			},
			//sku信息列表
			skuInfoData(){
				let arg = {
					page:this.sku_page,
					pagesize:this.sku_pagesize
				}
				console.log(arg)
			}
		}
	}
</script>
<style lang="less" scoped>
.supplier_data_container{
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	overflow-y: scroll;
	background: #ECEFF8;
	padding: 0 24px;
	.page_top_row{
		height: 96px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.input_box{
			border-radius: 20px;
			border: 1px solid #5575EB;
			width: 200px;
			height: 40px;
			display: flex;
			align-items: center;
			padding-left: 10px;
			padding-right: 10px;
			.s_search_icon{
				margin-right: 5px;
				width: 16px;
				height: 16px;
			}
			input{
				background: #ECEFF8;
				flex:1;
				border:none;
				outline: none;
				font-size: 14px;
			}
		}
		.name{
			color: #5575EB;
			font-size: 34px;
			font-weight: 500;
		}
		.type_row{
			width: 125px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: #5575EB;
			font-size: 18px;
			font-weight: 500;
		}
	}
	.margin_top{
		margin-top: 16px;
	}
	.card_title{
		font-weight: 500;
		font-size: 16px;
		color: #333333;
	}
	.content_row{
		display: flex;
		justify-content: space-between;
		.row_item{
			height: 74px;
			display: flex;
			.item_icon{
				margin-right: 16px;
				width: 74px;
				height: 74px;
			}
			.item_text{
				height: 74px;
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-between;
				.text_val{
					font-size: 32px;
					color: #333333;
					font-weight: bold;
				}
				.text_label{
					color: #666666;
					font-size: 16px;
				}
			}
		}
		.bhtj_item{
			width: 25%;
			.val_item{
				.bhtj_val{
					color: #5575EB;
					font-size: 30px;
					font-weight: bold;
				}
				.bhtj_label{
					color: #666666;
					font-size: 16px;
				}
			}
		}
	}
	.xltj_row{
		display: flex;
		.left_total{
			width: 164px;
			.left_item{
				.label{
					color: #666666;
					font-size: 14px;
				}
				.value{
					color: #333333;
					font-size: 32px;
					font-weight: 500;
				}
				.percentage_row{
					display: flex;
					align-items: center;
					.per_icon{
						width: 10px;
						height: 6px;
					}
					.per_value{
						margin-left: 6px;
						margin-right: 6px;
						font-size: 14px;
					}
					.per_label{
						color: #999999;
						font-size: 14px;
					}
				}
			}
			.left_item_margin{
				margin-top: 30px;
			}
		}
		.right_chart{
			flex:1;
			.tab_row{
				display: flex;
				justify-content: flex-end;
				font-size: 14px;
				color: #999999;
				.active_tab{
					color: #52C41B;
				}
				.tab_item{
					cursor: pointer;
				}
				.margin_left{
					margin-left: 24px;
				}
			}
			.tj_chart{
				height: 320px;
			}
		}
		
	}
}
</style>





