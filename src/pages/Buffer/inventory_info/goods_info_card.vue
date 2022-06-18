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
							<el-tooltip class="item" effect="dark" :content="cardInfo.ksbm" placement="top-end">
								<div class="table_value">{{cardInfo.ksbm}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">供应商款号</div>
							<el-tooltip class="item" effect="dark" :content="cardInfo.gyshh" placement="top-end">
								<div class="table_value">{{cardInfo.gyshh}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">季节</div>
							<div class="table_value">{{cardInfo.jj}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">性别</div>
							<div class="table_value">{{cardInfo.xb}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">产品分类</div>
							<el-tooltip class="item" effect="dark" :content="cardInfo.cpfl" placement="top-end">
								<div class="table_value">{{cardInfo.cpfl}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">波段</div>
							<el-tooltip class="item" effect="dark" :content="cardInfo.bd" placement="top-end">
								<div class="table_value">{{cardInfo.bd}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">品牌</div>
							<el-tooltip class="item" effect="dark" :content="cardInfo.pl" placement="top-end">
								<div class="table_value">{{cardInfo.pl}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">建档时间</div>
							<div class="table_value">{{cardInfo.cjsj}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">价格带(¥)</div>
							<div class="table_value">{{cardInfo.jgd}}</div>
						</div>
					</div>
					<div class="item">
						<div class="title">商品性质</div>
						<div class="table_item">
							<div class="table_label">首次售卖日期</div>
							<div class="table_value">{{cardInfo.first_fkrq}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">预计下架日期</div>
							<div class="table_value">{{cardInfo.xjrq}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">毛利率分类</div>
							<el-tooltip class="item" effect="dark" :content="JSON.stringify(cardInfo.mlv_7d_classify)" placement="top-end">
								<div class="table_value">{{cardInfo.mlv_7d_classify}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">公司销售性质</div>
							<el-tooltip class="item" effect="dark" :content="JSON.stringify(cardInfo.xsxz_gs)" placement="top-end">
								<div class="table_value">{{cardInfo.xsxz_gs}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">实际货品性质</div>
							<el-tooltip class="item" effect="dark" :content="cardInfo.sjhpxz" placement="top-end">
								<div class="table_value">{{cardInfo.sjhpxz}}</div>
							</el-tooltip>
						</div>
						<div class="table_item">
							<div class="table_label">当天缺货率</div>
							<div class="table_value">{{cardInfo.outstock_rate_1}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">综合缺货率(三天)</div>
							<div class="table_value">{{cardInfo.outstock_rate_3}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">周转天数</div>
							<div class="table_value">{{cardInfo.Turnover_days_classify}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">累计3天销量</div>
							<div class="table_value">{{cardInfo.stxl}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">累计7天销量</div>
							<div class="table_value">{{cardInfo.qtxl}}</div>
						</div>
						<div class="table_item">
							<div class="table_label">累计15天销量</div>
							<div class="table_value">{{cardInfo.swtxl}}</div>
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
		<div class="buts">
			<div class="title">款式销售数据</div>
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
		</div>
		<el-table ref="multipleTable" max-height="800" size="small" :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" :row-class-name="tableRowClassName">
			<el-table-column :label="item.row_name" :prop="item.row_field_name" sortable="custom" :width="maxWidth(item.row_field_name)" align="center" v-for="item in title_list" show-overflow-tooltip>
				<template slot-scope="scope">
					<!-- 总坑产 -->
					<div class="background_box" :style="{width:`${max == 0?0:(160/max)*Math.abs(scope.row.xsje)}px`,background:'#FEDB6F'}" v-if="item.row_field_name == 'xsje' && scope.$index > 0">{{scope.row.xsje}}</div>
					<!-- 图片 -->
					<img class="table_img" :src="scope.row[item.row_field_name]" v-else-if="item.row_field_name == 'tp'" @click="bigImg(scope.row.tp)">
					<div v-else-if="item.row_field_name == 'mlv' || item.row_field_name == 'bdbl' || item.row_field_name == 'fhqthl' || item.row_field_name == 'fhhthl'">{{scope.row[item.row_field_name] === null?'':scope.row[item.row_field_name] + '%'}}</div>
					<div v-else>{{scope.row[item.row_field_name]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 自定义列表 -->
		<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
			<div class="select_box">
				<el-checkbox-group v-model="row_ids">
					<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="Restore">恢复默认</el-button>
				<el-button size="small" @click="show_custom = false">取消</el-button>
				<el-button size="small" type="primary" @click="setColumns">保存</el-button>
			</div>
		</el-dialog>
		<!-- 图片放大 -->
		<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
			<img class="big_img" :src="big_img_url">
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imageDialog = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import {getMonthStartDate,getNowDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
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
				date:[getLastMonthStartDate(2),getNowDate()],				//选中的时间
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
				tableData:[],
				title_list:[],
				max:0,
				imageDialog:false,		//图片放大弹窗
				big_img_url:"",
				show_custom:false,		//自定义列表
				row_ids:[],	
				selected_ids:[],
				view_row:[],			//
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
						if(e == ''){
							this.select_ks_ids = this.ks_list[0];
							//获取顶部卡片信息
							this.getShopCard();
							//获取资料图表
							this.getShopTrend();
							//获取下面列表
							this.shopDetailCard()
						}
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
						let max_field = res.data.data.max_field;
						var tableData = this.dataObj.data;
						if (max_field.length > 0) {
							tableData.unshift(max_field);
						}
						this.tableData = tableData;
						this.title_list = res.data.data.title_list;
						this.view_row = res.data.data.view_row;
						this.selected_ids = res.data.data.selected_ids;
						this.max = res.data.data.max;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//某一行添加颜色
			tableRowClassName({row, rowIndex}) {
				if (rowIndex == 0) {
					return 'total_style';
				}
				return '';
			},
			//宽度
			maxWidth(row_field_name){
				if(row_field_name == 'company' || row_field_name == 'dept_name' || row_field_name == 'xsje' || row_field_name == 'zskc_num'||row_field_name == 'fut_thje' || row_field_name == 'fut_thsl'){
					return 160;
				}else if(row_field_name == 'sjfhje' || row_field_name == 'sjfh_num' || row_field_name == 'sjfh_cb'){
					return 140;
				}else if(row_field_name == 'shop_code' || row_field_name == 'tp' || row_field_name == 'tjcb' || row_field_name == 'zs_thje'||row_field_name == 'zs_thsl' || row_field_name == 'zs_xssl' || row_field_name == 'zs_xsje' || row_field_name == 'fhhthl' || row_field_name == 'dfh_num' || row_field_name == 'dfhje' || row_field_name == 'qx_xssl' || row_field_name == 'qx_xsje' || row_field_name == 'fhqthl' || row_field_name == 'pre_thsl' || row_field_name == 'pre_thje' || row_field_name == 'zskc' || row_field_name == 'xssl'){
					return 130;
				}else{
					return 100;
				}
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.shopDetailCard();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.shopDetailCard();
			},
			//放大图片
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
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
			//自定义列表
			customFun(){
				this.show_custom = true;
				this.row_ids = this.selected_ids;
			},
			//恢复默认
			Restore(){
				this.row_ids = [];
				this.view_row.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			//设置自定义列
			setColumns(){
				resource.shopDetailCustomList({column:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.shopDetailCard();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
		}
	}
</script>
<style>
.el-table .total_style {
	font-weight: bold;
	font-size: 14px;
}
</style>
<style lang="less" scoped>
.buts{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.title{
	margin-bottom: 10px;
	font-size: 18px;
	font-weight: bold;
}
.top_content{
	display: flex;
	.content_item{
		width: 50%;
		
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












