<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" :popper-append-to-body="false" filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm">
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="top_content">
			<div class="content_item margin_right">
				<div class="title">概况</div>
				<el-card>
					<div class="gk_row">
						<img class="kstp" :src="cardInfo.tp">
						<div class="gk_item">
							<div class="gk_label">今日库存</div>
							<div class="gk_value">{{cardInfo.kc}}</div>
						</div>
						<div class="gk_item">
							<div class="gk_label">昨日销量</div>
							<div class="gk_value">{{cardInfo.zs_xssl}}</div>
						</div>
						<div class="gk_item">
							<div class="gk_label">周转天数(30天)</div>
							<div class="gk_value">{{cardInfo.Turnover_days}}</div>
						</div>
						<div class="gk_item">
							<div class="gk_label">周转天数(7天)</div>
							<div class="gk_value">{{cardInfo.Turnover_7days}}</div>
						</div>
					</div>
				</el-card>
				<div class="table_row">
					<div class="item">
						<div class="title">基本属性</div>
						<div class="table_item">
							<div class="table_label">款式编码</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.ksbm}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">供应商款号</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.gyshh}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">季节</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.jj}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">性别</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.xb}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">产品分类</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.cpfl}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">波段</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.bd}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">品牌</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.pl}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">建档时间</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.cjsj}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">价格带(¥)</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.jgd}}</div>
							</el-tooltip>
						</div>
					</div>
					<div class="item">
						<div class="title">商品性质</div>
						<div class="table_item">
							<div class="table_label">首次售卖日期</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.first_fkrq}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">预计下架日期</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.xjrq}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">毛利率分类</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.mlv_7d_classify}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">公司销售性质</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.xsxz_gs}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">实际货品性质</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.sjhpxz}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">当天缺货率</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.outstock_rate_1}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">综合缺货率(三天)</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.outstock_rate_3}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">周转天数</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.Turnover_days_classify}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">累计3天销量</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.stxl}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">累计7天销量</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.qtxl}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">累计15天销量</div>
							<el-tooltip class="item" effect="dark" content="Top Right 提示文字" placement="top-end">
								<div class="table_value">{{cardInfo.swtxl}}</div>
							</el-tooltip>
						</div>
					</div>
				</div>
			</div>
			<div class="content_item">
				<div class="trend" id="xs"></div>
				<div class="trend" id="kc"></div>
				<div class="trend" id="zzts"></div>
			</div>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" show-summary :summary-method="getSummaries" @sort-change="sortChange">
			<el-table-column label="月份" prop="fkrq" width="100" sortable align="center">
			</el-table-column>
			<el-table-column label="公司" prop="company" width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="部门" prop="dept_name" width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="平台" prop="platform" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="店铺ID" prop="shop_code" width="120" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="供应商款号" prop="gyskh" width="120" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column prop="supplier_ksbm" label="图片" width="120" align="center">
				<template slot-scope="scope">
					<img style="width: 80px;height: 80px" :src="scope.row.tp" @click="bigImg(scope.row.tp)">
				</template>
			</el-table-column>
			<el-table-column label="入库成本" prop="xscb" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="最新调价成本" prop="tjcb" width="120" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="总坑产" prop="xsje" width="160" sortable>
				<template slot-scope="scope">
					<div class="background_box" :style="{width:`${max == 0?0:(160/max)*Math.abs(scope.row.xsje)}px`,background:'#FEDB6F'}">{{scope.row.xsje}}</div>
				</template>
			</el-table-column>
			<el-table-column label="总坑产销售数量" prop="xssl" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="补单金额" prop="sd_xsje" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="补单数量" prop="sd_xssl" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="补单比例" prop="bdbl" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="真实坑产(-刷单)" prop="zskc" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="真实坑产数量(-刷单)" prop="zskc_num" width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="空包金额" prop="kb_xsje" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="空包数量" prop="kb_xssl" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="发货前退货金额" prop="pre_thje" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="发货前退货数量" prop="pre_thsl" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="发货前退货率" prop="fhqthl" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="取消订单金额" prop="qx_xsje" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="取消订单数量" prop="qx_xssl" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="待发货销售金额" prop="dfhje" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="待发货销售数量" prop="dfh_num" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="发货后退货销售金额" prop="fut_thje" width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="发货后退货销售数量" prop="fut_thsl" width="160" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="发货后退货率" prop="fhhthl" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="真实销售金额" prop="zs_xsje" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="真实销售数量" prop="zs_xssl" width="130" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="补发数量" prop="bh_xssl" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="换货数量" prop="hh_xssl" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="实际发货销售金额" prop="sjfhje" width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="实际发货销售数量" prop="sjfh_num" width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="实际发货销售成本" prop="hh_xssl" width="140" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="真实退货金额" prop="zs_thje" width="120" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="真实退货数量" prop="zs_thsl" width="120" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="毛利额" prop="mle" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
			<el-table-column label="毛利率" prop="mlv" width="100" show-overflow-tooltip sortable align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return {
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
				},	 					//时间区间
				date:[],				//选中的时间
				ks_list:[],				//款式编码列表
				select_ks_ids:'',		//选中的款式编码
				cardInfo:{},			//顶部卡片信息
				xsChart:null,			//销售图表
				kcChart:null,			//库存图表
				zztsChart:null,			//周转天数图表
				pagesize:10,
				page:1,
				sort:"",
				dataObj:{},
				max:0
			}
		},
		created(){
			//款式编码
			this.getKsbm('');
		},
		methods:{
			//款式编码
			getKsbm(e){
				resource.ajaxKsbm({name:e}).then(res => {
					if(res.data.code == 1){
						this.ks_list = res.data.data;
						this.select_ks_ids = this.ks_list[0];
						//获取顶部卡片信息
						this.getShopCard();
						//获取资料图表
						this.getShopTrend();
						//获取下面列表
						this.shopDetailCard()
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFn(){
				//获取顶部卡片信息
				this.getShopCard();
				//获取资料图表
				this.getShopTrend();
				//获取下面列表
				this.shopDetailCard()
			},
			//获取顶部卡片信息
			getShopCard(){
				resource.getShopCard({shop_code:this.select_ks_ids}).then(res => {
					if(res.data.code == 1){
						this.cardInfo = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取资料图表
			getShopTrend(){
				let arg = {
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					shop_code:this.select_ks_ids
				}
				resource.getShopTrend(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let data = res.data.data;
						//销售数据
						let xs_time = data.xs_time;
						let xs_data = data.xs_data;
						var xs = document.getElementById('xs');
						this.xsChart = echarts.getInstanceByDom(xs)
						if (this.xsChart == null) { 
							this.xsChart = echarts.init(xs);
						}
						let xsSeriesData = [
						{
							name: "销售数量",
							data: xs_data,
							type: 'line',
							areaStyle: {}
						}];
						this.xsChart.setOption(this.chartOption('销售趋势图',xs_time,xsSeriesData));
						//库存数据
						let kc_time = data.kc_time;
						let kc_data = data.kc_data;
						var kc = document.getElementById('kc');
						this.kcChart = echarts.getInstanceByDom(kc)
						if (this.kcChart == null) { 
							this.kcChart = echarts.init(kc);
						}
						let kcSeriesData = [
						{
							name: "库存数量",
							data: kc_data,
							type: 'line',
							areaStyle: {}
						}];
						this.kcChart.setOption(this.chartOption('库存趋势图',kc_time,kcSeriesData));
						//周转天数数据
						let day_time = data.day_time;
						let day_data_7 = data.day_data_7;
						let day_data = data.day_data;
						var zzts = document.getElementById('zzts');
						this.zztsChart = echarts.getInstanceByDom(zzts)
						if (this.zztsChart == null) { 
							this.zztsChart = echarts.init(zzts);
						}
						let zztsSeriesData = [
						{
							name: "30天数量",
							data: day_data,
							type: 'line',
							areaStyle: {}
						},{
							name: "7天数量",
							data: day_data_7,
							type: 'line',
							areaStyle: {}
						}];
						this.zztsChart.setOption(this.chartOption('周转天数趋势图',day_time,zztsSeriesData,['30天数量','7天数量']));
						window.addEventListener('resize',() =>{
							this.xsChart.resize();
							this.kcChart.resize();
							this.zztsChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//图表绘制
			chartOption(title,xData,seriesData,legend){
				return {
					title: {
						text: title
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return "日期：" + params.name + '</br>' 
							+ params.seriesName +  "：" + params.value + '</br>';
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
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: xData
					},
					yAxis: {
						name:"数量",
						type: 'value'
					},
					series: seriesData
				};
			},
			//获取下面列表
			shopDetailCard(){
				let arg = {
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					shop_code:this.select_ks_ids,
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				resource.shopDetailCard(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data.detail;
						this.max = res.data.data.max;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.stockAnalysisKsList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.shopDetailCard();
			},
			//排序
			sortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.sort = column.prop + '-' + order;
				}else{
					this.sort = '';
				}
				this.shopDetailCard();
			},
			// 表尾合计行处理
			getSummaries(param) {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '总计';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					sums[index] = values.reduce((prev, curr) => {
						return prev + curr;
					}, 0);
					sums[index] = sums[index].toFixed(2);
					if (index === 10) {	//总成本
						sums[index] = sums[index] + '万';
					}else{
						sums[index] = '';
					}
				});
				return sums;
			},
		}
	}
</script>
<style lang="less" scoped>
.top_content{
	display: flex;
	.content_item{
		width: 50%;
		.title{
			margin-bottom: 10px;
			font-size: 18px;
			font-weight: bold;
		}
		.gk_row{
			display:flex;
			align-items: center;
			justify-content: space-between;
			.kstp{
				width: 120px;
				height: 120px;
			}
			.gk_item{
				flex:1;
				display:flex;
				flex-direction: column;
				align-items: center;
				.gk_label{
					margin-bottom: 10px;
					font-size: 14px;
					font-weight: bold;
				}
				.gk_value{
					color: #2C82FF;
					font-size: 18px;
					font-weight: bold;
				}
			}
		}
		.table_row{
			margin-top: 15px;
			display:flex;
			.item{
				margin-right: 15px;
				.table_item{
					display:flex;
					font-size: 14px;
					.table_label{
						background: #2C82FF;
						width: 140px;
						height: 40px;
						line-height: 40px;
						padding-left: 5px;
						padding-right: 5px;
						color:#ffffff;
						font-weight: bold;
					}
					.table_value{
						border: 1px solid #cccccc;
						width: 180px;
						height: 40px;
						line-height: 40px;
						padding-left: 5px;
						padding-right: 5px;
						word-break: break-all;
						text-overflow: ellipsis;
						overflow: hidden;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}
				}
			}
		}
		.trend{
			width: 100%;
			height: 230px;
		}
	}
	.margin_right{
		margin-right: 30px;
	}
}
.background_box{
	padding-left: 3px;
	white-space:nowrap;
	height: 28px;
	display:flex;
	align-items: center;
}
</style>












