<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" clearable :popper-append-to-body="false" @change="getStore" multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="select_store_key" class="input_key">
					<el-option label="店铺名称" :value="1">
					</el-option>
					<el-option label="店铺ID" :value="2">
					</el-option>
				</el-select>：
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags reserve-keywordplaceholder="全部">
				<el-option v-for="item in store_list" :key="item.dept_id" :label="select_store_key == 1?item.shop_name:item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="产品分类：">
			<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags reserve-keyword placeholder="全部">
				<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="商品ID：">
			<el-select v-model="select_spid_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="getSpid" collapse-tags>
				<el-option v-for="item in spid_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="款式编码：">
			<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
				<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="供应商款号：">
			<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
				<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
		</el-form-item>
	</el-form>
	<!-- 指标汇总 -->
	<div class="flex ac jsb mb-10">
		<PopoverWidget title="指标解释" update_time="每日14:00" width="900" keys="dpzhfx"/>
		<div class="flex">
			<el-button type="primary" size="small" @click="customFun('zbhz_data')">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="exportFun" v-if="button_list.hz_export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
	</div>
	<el-table :data="table_list.data" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :cell-style="columnStyle" @sort-change="sortChange" v-loading="table_list_loading" v-if="!is_custom_loading">
		<el-table-column :prop="item.row_field_name" :width="item.type == 3 || zbhzFixed(item.row_field_name)?110:widthColumn(item.row_field_name)?90:70" v-for="item in title_list" :sortable="item.is_sort?'custom':false" show-overflow-tooltip :fixed="zbhzFixed(item.row_field_name)">
			<template slot="header" slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
					<div class="pre-line">{{item.row_name}}</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<!-- 占比 -->
				<div class="background_box" :style="{width:`${item.max_value == 0?0:(70/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:`${item.color}`}" v-if="item.type == 1 && scope.row.is_total != 1">{{scope.row[item.row_field_name]}}{{item.unit}}</div>
				<!-- 图片 -->
				<img style="width: 80px;height: 80px" :src="scope.row.pic" v-else-if="item.type == 3 && scope.row.is_total != 1" @click="bigImg(scope.row.pic)">
				<!-- 按钮 -->
				<el-tooltip placement="top-end" v-else-if="item.type == 4 && scope.row.is_total != 1">
					<div slot="content">
						<el-button type="text" size="small" @click="getDetail(scope.row.spid_url)">查看</el-button>
					</div>
					<div style="color: #8D5714">{{scope.row.spid}}</div>
				</el-tooltip>
				<!-- 普通文字 -->
				<div class="text_content" :class="{'is_total':item.row_field_name == 'spid'}" v-else>{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ''?item.unit:''}}</div>
			</template>
		</el-table-column>
	</el-table>
	<div v-else style="height: 600px;width: 100%" v-loading="true"></div>
	<div class="page">
		<el-pagination @size-change="zbhzPageSizeChange" @current-change="zbhzPageChange" :current-page="zbhz_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="table_list.total" >
		</el-pagination>
	</div>
	<!-- 指标汇总图片放大 -->
	<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
		<img style="width: 100%" :src="big_img_url">
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="imageDialog = false">关闭</el-button>
		</span>
	</el-dialog>
	<!-- 每日分析 -->
	<div class="title">每日分析</div>
	<el-tabs v-model="activeItemTab" @tab-click="checkItemTab">
		<el-tab-pane label="整体数据" name="overall_data" class="tab_pane_box">
			<TabaleWidget page_type="overall_data" :table_data="table_data_overall" :selected_ids="selected_ids_overall" :title_list="title_list_overall" :view_row="view_row_overall" :total_data="total_data_overall" :is_export="button_list.zt_export" @customBack="customFun" v-loading="overall_loading" :showTable="!overall_loading"/>
		</el-tab-pane>
		<el-tab-pane label="搜索系列" name="search_data" class="tab_pane_box">
			<TabaleWidget page_type="search_data" :table_data="table_data_search" :selected_ids="selected_ids_search" :title_list="title_list_search" :view_row="view_row_search" :total_data="total_data_search" :is_export="button_list.search_export" @customBack="customFun" v-loading="search_loading" :showTable="!search_loading"/>
		</el-tab-pane>
		<el-tab-pane label="直通车系列" name="ztc_data" class="tab_pane_box">
			<TabaleWidget page_type="ztc_data" :table_data="table_data_ztc" :selected_ids="selected_ids_ztc" :title_list="title_list_ztc" :view_row="view_row_ztc" :total_data="total_data_ztc" :is_export="button_list.ztc_export" @customBack="customFun" v-loading="ztc_loading" :showTable="!ztc_loading"/>
		</el-tab-pane>
		<el-tab-pane label="超级推荐系列" name="cjtj_data" class="tab_pane_box">
			<TabaleWidget page_type="cjtj_data" :table_data="table_data_cjtj" :selected_ids="selected_ids_cjtj" :title_list="title_list_cjtj" :view_row="view_row_cjtj" :total_data="total_data_cjtj" :is_export="button_list.cjtj_export" @customBack="customFun" v-loading="cjtj_loading" :showTable="!cjtj_loading"/>
		</el-tab-pane>
	</el-tabs>
	<!-- 折线图 -->
	<el-tabs v-model="activeLineTab" @tab-click="checkLineTab" style="margin-top: 30px">
		<el-tab-pane label="访客分析" name="visitors_analysis" class="tab_pane_box">
			<div id="visitors_analysis" class="complete_line" v-loading="zxt_loading"></div>
		</el-tab-pane>
		<el-tab-pane label="买家GMV分析" name="production_analysis" class="tab_pane_box">
			<div class="flex_box">
				<div id="production_analysis_left" class="half_line" v-loading="zxt_loading"></div>
				<div id="production_analysis_right" class="half_line" v-loading="zxt_loading"></div>
			</div>
		</el-tab-pane>
		<el-tab-pane label="花费分析" name="cost_analysis" class="tab_pane_box">
			<div id="cost_analysis" class="complete_line" v-loading="zxt_loading"></div>
		</el-tab-pane>
		<el-tab-pane label="转化率对比" name="ratio_comparison" class="tab_pane_box">
			<div id="ratio_comparison" class="complete_line" v-loading="zxt_loading"></div>
		</el-tab-pane>
		<el-tab-pane label="收藏加购率分析" name="collection_analysis" class="tab_pane_box">
			<div class="flex_box">
				<div id="collection_analysis_left" class="half_line" v-loading="zxt_loading"></div>
				<div id="collection_analysis_right" class="half_line" v-loading="zxt_loading"></div>
			</div>
		</el-tab-pane>
	</el-tabs>
	<!-- 单品分析—-指标汇总 -->
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
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
}
.top_row{
	display: flex;
	justify-content: space-between;
	.toast_box{
		padding: 10px;
		border-radius: 10px;
		border:1px solid #8D5714;
		width: 50%;
		margin-right: 30px;
	}
	.form_box{
		width: 50%;
		display:flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.toast_title{
		font-weight: bold;
		font-size: 16px;
		color: #8D5714;
	}
	.dian{
		margin-right: 8px;
		border-radius: 3px;
		background:#8D5714; 
		width: 6px;
		height: 6px;
	}
	.item_row{
		display:flex;
		align-items: center;
		font-size: 14px;
		color: #8D5714;
	}
}
.text_content{
	overflow: hidden;/*超出部分隐藏*/
	white-space: nowrap;/*不换行*/
	text-overflow:ellipsis;/*超出部分文字以...显示*/
}
.background_box{
	padding-left: 3px;
	white-space:nowrap;
	height: 28px;
	display:flex;
	align-items: center;
}
.title{
	margin-top: 30px;
	margin-bottom: 20px;
	font-size: 18px;
	font-weight: bold;
}
.is_total{
	color: #8D5714;
}
.complete_line{
	width: 100%;
	height: 500px;
}
.flex_box{
	width: 100%;
	display:flex;
	.half_line{
		width: 50%;
		height: 500px;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import TabaleWidget from './ItemAnalysis/table_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	import {exportUp} from '../../../api/export.js'
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
				date:[getMonthStartDate(),getCurrentDate()],//制单日期
				store_name:"",
				// shop_list:[],								//店铺列表
				// select_shop_list:[],						//选中的店铺列表
				select_store_key:1,					//店铺的key值
				store_list: [],						//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				plat_list:[],								//平台列表
				select_plat_ids:[],							//选中的平台列表
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				spid_list:[],								//商品id列表
				select_spid_list:[],						//选中的商品ID列表
				table_list:{},								//列表行数据
				title_list:[],								//列表列数据
				is_custom_loading:false,
				sort:"",
				sort_type:"",
				show_custom:false,							//是否显示自定义弹框
				selected_ids:[],							//自定义已选中的id
				row_ids:[],									//可提交的自定义ids
				view_row_zbhz:[],							//所有列表-指标汇总
				view_row:[],								//自定义
				zbhz_page:1,								//指标汇总分页
				zbhz_pagesize:10,							
				imageDialog:false,							//指标汇总图片放大弹框
				big_img_url:"",								//指标汇总图片地址
				activeLineTab:"visitors_analysis",			//默认选中访客分析
				visitorsAnalysisChart:null,					
				productionAnalysisLeftChart:null,
				productionAnalysisRightChart:null,
				costAnalysisChart:null,
				ratioComparisonChart:null,
				collectionAnalysisLeftChart:null,
				collectionAnalysisRightChart:null,
				activeItemTab:"overall_data",				//每日分析默认整体数据
				table_data_overall:[],						//表格数据-整体分析
				selected_ids_overall:[],					//已选列表-整体分析
				title_list_overall:[],						//所有列-整体分析
				view_row_overall:[],						//所有列表-整体分析
				total_data_overall:[],						//总计-整体分析
				table_data_search:[],						//表格数据-搜索系列
				selected_ids_search:[],						//已选列表-搜索系列
				title_list_search:[],						//所有列-搜索系列
				view_row_search:[],							//所有列表-搜索系列
				total_data_search:[],						//总计-搜索系列
				table_data_ztc:[],							//表格数据-直通车
				selected_ids_ztc:[],						//已选列表-直通车
				title_list_ztc:[],							//所有列-直通车
				view_row_ztc:[],							//所有列表-直通车
				total_data_ztc:[],							//总计-直通车
				table_data_cjtj:[],							//表格数据-超级推荐
				selected_ids_cjtj:[],						//已选列表-超级推荐
				title_list_cjtj:[],							//所有列-超级推荐
				view_row_cjtj:[],							//所有列表-超级推荐
				total_data_cjtj:[],							//总计-超级推荐
				menu_id:"",									//自定义提交的menu_id
				page_type:"",								//弹框的类型
				req:{},										//请求参数
				button_list:{},								//权限
				table_list_loading:false,
				overall_loading:false,
				search_loading:false,
				ztc_loading:false,
				cjtj_loading:false,
				zxt_loading:false

			}
		},
		watch:{
			select_store_key:function(){
				this.select_store_ids = [];
			},
		},
		created(){
			//平台列表
			this.ajaxPlat();
			//店铺列表
			this.getStore();
			//品类列表
			this.getPl();
			//点击搜索
			this.searchFun();
		},
		methods:{
			getQianNumber(number) {
				const num = String(number)
				const reg = /\d{1,3}(?=(\d{3})+$)/g
				const res = num.replace(/^(-?)(\d+)((\.\d+)?)$/, function(match, s1, s2, s3){
					return s1 + s2.replace(reg, '$&,') + s3
				})
				return res
			},
			//平台列表
			ajaxPlat(){
				resource.ajaxPlat().then(res => {
					if(res.data.code == 1){
						this.plat_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺列表
			getStore(){
				resource.ajaxViewStore({name:this.store_name,platform:this.select_plat_ids.join(','),}).then(res => {
					if(res.data.code == 1){
						// this.shop_list = res.data.data;
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类列表
			getPl(){
				resource.ajaxPl({from:10}).then(res => {
					if(res.data.code == 1){
						this.pl_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//商品ID列表
			getSpid(e){
				if(e != ''){
					resource.ajaxSpid({name:e}).then(res => {
						if(res.data.code == 1){
							this.spid_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e,from:10}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxGyshh({name:e,from:10}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击搜索
			searchFun(){
				let req = {
					spid:this.select_spid_list.join(','),
					shop_id:this.select_store_ids.join(','),
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					cpfl:this.select_pl_ids.join(','),
					gyskh:this.select_gyshh_ids.join(','),
					ks:this.select_ks_ids.join(','),
					platform:this.select_plat_ids.join(','),
				}
				this.req = req;
				//单品分析—-指标汇总
				this.zbhz_page = 1;
				this.dpAnalysis();
				//每日分析下面的折线图
				this.dayDpAnalysis();
				//每日分析-整体数据
				this.annualDpzt();
				//每日分析-搜索系列
				this.annualDpSearch();
				//每日分析-直通车系列
				this.annualDpZtc();
				//每日分析-超级推荐系列
				this.annualDpCjtj();
			},
			//单品分析—-指标汇总自定义列表
			customFun(page_type){
				this.page_type = page_type;
				this.show_custom = true;
				switch(page_type){
					case 'zbhz_data':
					this.row_ids = this.selected_ids;
					this.view_row = this.view_row_zbhz;
					this.menu_id = "37";
					break;
					case 'overall_data':
					this.row_ids = this.selected_ids_overall;
					this.view_row = this.view_row_overall;
					this.menu_id = "100001";
					break;
					case 'search_data':
					this.row_ids = this.selected_ids_search;
					this.view_row = this.view_row_search;
					this.menu_id = "100002";
					break;
					case 'ztc_data':
					this.row_ids = this.selected_ids_ztc;
					this.view_row = this.view_row_ztc;
					this.menu_id = "100003";
					break;
					case 'cjtj_data':
					this.row_ids = this.selected_ids_cjtj;
					this.view_row = this.view_row_cjtj;
					this.menu_id = "100004";
					break;
					default:
					return "";
				}
			},
			//单品分析—-指标汇总恢复默认
			Restore(){
				this.row_ids = [];
				this.view_row.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			//单品分析—-指标汇总设置自定义列
			setColumns(){
				resource.setColumns({menu_id:this.menu_id,row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						if(this.page_type == 'zbhz_data'){
							this.is_custom_loading = true;
							//指标汇总
							this.dpAnalysis();
						}else if(this.page_type == 'overall_data'){
							//每日分析-整体数据
							this.annualDpzt();
						}else if(this.page_type == 'search_data'){
							//每日分析-搜索系列
							this.annualDpSearch();
						}else if(this.page_type == 'ztc_data'){
							//每日分析-直通车系列
							this.annualDpZtc();
						}else if(this.page_type == 'cjtj_data'){
							//每日分析-超级推荐系列
							this.annualDpCjtj();
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//单品分析—-指标汇总排序
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				//单品分析—-指标汇总
				this.dpAnalysis();
			},
			//导出
			exportFun(){
				let req = {
					spid:this.select_spid_list.join(','),
					shop_id:this.select_store_ids.join(','),
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					cpfl:this.select_pl_ids.join(','),
					gyskh:this.select_gyshh_ids.join(','),
					ks:this.select_ks_ids.join(',')
				}
				var export_arr = [];
				for(let key in req){
					export_arr.push(`${key}=${req[key]}`);
				}
				let url = "annual/dp_analysis_export?" + export_arr.join("&");
				exportUp(url)
			},
			//单品分析—-指标汇总
			dpAnalysis(){
				let req = JSON.parse(JSON.stringify(this.req));
				let dpAnalysis = {
					page:this.zbhz_page,
					pagesize:this.zbhz_pagesize,
					sort:this.sort,
					sort_type:this.sort_type
				};
				this.table_list_loading = true;
				resource.dpAnalysis({...req,...dpAnalysis}).then(res => {
					if(res.data.code == 1){
						this.table_list_loading = false;
						this.is_custom_loading = false;
						this.button_list = res.data.data.button_list;	//导出按钮是否显示
						this.table_list = res.data.data.table_list;		//列表行数据
						this.title_list = res.data.data.title_list;		//列表列数据
						this.selected_ids = res.data.data.selected_ids;	//自定义已选中的id
						this.view_row_zbhz = res.data.data.view_row;			//自定义
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//单品分析—-指标汇总分页
			zbhzPageSizeChange(val) {
				this.zbhz_page = 1;
				this.zbhz_pagesize = val;
				//获取列表
				this.dpAnalysis();
			},
			zbhzPageChange(val) {
				this.zbhz_page = val;
				//获取列表
				this.dpAnalysis();
			},
			//指标汇总左侧固定
			zbhzFixed(row_field_name){
				if(row_field_name == 'spid' || row_field_name == 'dpid' || row_field_name == 'ksbm' || row_field_name == 'gyskh' || row_field_name == 'pic'){
					return true;
				}
			},
			//宽一点
			widthColumn(row_field_name){
				if(row_field_name == 'total_fks'||  row_field_name == 'xsje' ||  row_field_name == 'xssl' ||  row_field_name == 'sd_xssl' || row_field_name == 'total_hf' || row_field_name == 'mll' || row_field_name == 'yk'){
					return true;
				}
			},
			//指标汇总第一行样式
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(rowIndex == 0){
					return 'color: #8D5714';
				}
			},
			//指标汇总图片放大
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
			},
			//指标汇总商品id跳转
			getDetail(spid_url){
				window.open(spid_url)
			},
			//切换每日分析的表格
			checkItemTab(e){
				this.activeItemTab = e.name;
			},
			//切换每日分析下面的折线图
			checkLineTab(e){
				this.activeLineTab = e.name;
				this.$nextTick(() => {
					this.visitorsAnalysisChart.resize();
					this.productionAnalysisLeftChart.resize();
					this.productionAnalysisRightChart.resize();
					this.costAnalysisChart.resize();
					this.ratioComparisonChart.resize();
					this.collectionAnalysisLeftChart.resize();
					this.collectionAnalysisRightChart.resize();
				})
			},
			//每日分析-整体数据
			annualDpzt(){
				this.overall_loading = true;
				resource.annualDpzt(this.req).then(res => {
					if(res.data.code == 1){
						this.overall_loading = false;
						this.table_data_overall = res.data.data.data;
						this.selected_ids_overall = res.data.data.selected_ids;
						this.title_list_overall = res.data.data.title_list;
						this.view_row_overall = res.data.data.view_row;
						this.total_data_overall = res.data.data.total_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//每日分析-搜索系列
			annualDpSearch(){
				this.search_loading = true;
				resource.annualDpSearch(this.req).then(res => {
					if(res.data.code == 1){
						this.search_loading = false;
						this.table_data_search = res.data.data.data;
						this.selected_ids_search = res.data.data.selected_ids;
						this.title_list_search = res.data.data.title_list;
						this.view_row_search = res.data.data.view_row;
						this.total_data_search = res.data.data.total_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//每日分析-直通车系列
			annualDpZtc(){
				this.ztc_loading = true;
				resource.annualDpZtc(this.req).then(res => {
					if(res.data.code == 1){
						this.ztc_loading = false;
						this.table_data_ztc = res.data.data.data;
						this.selected_ids_ztc = res.data.data.selected_ids;
						this.title_list_ztc = res.data.data.title_list;
						this.view_row_ztc = res.data.data.view_row;
						this.total_data_ztc = res.data.data.total_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//每日分析-超级推荐系列
			annualDpCjtj(){
				this.cjtj_loading = true;
				resource.annualDpCjtj(this.req).then(res => {
					if(res.data.code == 1){
						this.cjtj_loading = false;
						this.table_data_cjtj = res.data.data.data;
						this.selected_ids_cjtj = res.data.data.selected_ids;
						this.title_list_cjtj = res.data.data.title_list;
						this.view_row_cjtj = res.data.data.view_row;
						this.total_data_cjtj = res.data.data.total_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//折线图配置
			lineOptions(date_list,series_data,unit){
				return {
					tooltip: {
						trigger: 'axis',
						formatter: (params) => {
							let tip = "";
							if(params != null && params.length > 0) {
								tip += "统计日期：" + params[0].axisValue + '</br>';
								for(let i =0; i < params.length; i++) {
									tip += params[i].seriesName + "：" + params[i].value + unit + '</br>';
								}
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
						data: series_data.title_list,
						top:0,
						left:0
					},
					grid: {
						y2:150
					},
					xAxis: {
						type: 'category',
						data: date_list,
						axisLabel: {
							color: '#333',
							rotate:70
						}
					},
					yAxis: {
						type: 'value',
						axisLabel: {
							formatter: '{value}' + unit
						}
					},
					series: series_data.list
				}
			},
			//每日分析下面的折线图
			dayDpAnalysis(){
				this.zxt_loading = true;
				resource.dayDpAnalysis(this.req).then(res => {
					if(res.data.code == 1){
						this.zxt_loading = false;
						var echarts = require("echarts");
						let max_min = {
							data: [
							{type: 'max'},
							{type: 'min'}
							]
						};
						if(this.visitorsAnalysisChart){
							this.visitorsAnalysisChart.dispose();
						}
						if(this.productionAnalysisLeftChart){
							this.productionAnalysisLeftChart.dispose();
						}
						if(this.productionAnalysisRightChart){
							this.productionAnalysisRightChart.dispose();
						}
						if(this.costAnalysisChart){
							this.costAnalysisChart.dispose();
						}
						if(this.ratioComparisonChart){
							this.ratioComparisonChart.dispose();
						}
						if(this.collectionAnalysisLeftChart){
							this.collectionAnalysisLeftChart.dispose();
						}
						if(this.collectionAnalysisRightChart){
							this.collectionAnalysisRightChart.dispose();
						}
						let day = res.data.data.day;
						//访客分析
						let fkfx = res.data.data.fkfx;		
						fkfx.list.map(item => {
							item.markPoint = max_min;
						});		
						var visitors_analysis = document.getElementById('visitors_analysis');
						this.visitorsAnalysisChart = echarts.init(visitors_analysis);
						this.visitorsAnalysisChart.setOption(this.lineOptions(day,fkfx,''));
						//买家坑产分析（左侧）
						let mjskcfx_left = res.data.data.mjskcfx_left;
						mjskcfx_left.list.map(item => {
							item.markPoint = max_min;
						});	
						var production_analysis_left = document.getElementById('production_analysis_left');
						this.productionAnalysisLeftChart = echarts.init(production_analysis_left);
						this.productionAnalysisLeftChart.setOption(this.lineOptions(day,mjskcfx_left,''));
						//买家坑产分析（右侧）
						let mjskcfx_right = res.data.data.mjskcfx_right;
						mjskcfx_right.list.map(item => {
							item.markPoint = max_min;
						});
						var production_analysis_right = document.getElementById('production_analysis_right');
						this.productionAnalysisRightChart = echarts.init(production_analysis_right);
						this.productionAnalysisRightChart.setOption(this.lineOptions(day,mjskcfx_right,''));
						//花费分析
						let hffx = res.data.data.hffx;
						hffx.list.map(item => {
							item.markPoint = max_min;
						});
						var cost_analysis = document.getElementById('cost_analysis');
						this.costAnalysisChart = echarts.init(cost_analysis);
						this.costAnalysisChart.setOption(this.lineOptions(day,hffx,''));
						//转化率对比
						let zhlfx = res.data.data.zhlfx;
						zhlfx.list.map(item => {
							item.markPoint = max_min;
						});
						var ratio_comparison = document.getElementById('ratio_comparison');
						this.ratioComparisonChart = echarts.init(ratio_comparison);
						this.ratioComparisonChart.setOption(this.lineOptions(day,zhlfx,'%'));
						//收藏加购分析（左侧）
						let scjglfx_left = res.data.data.scjglfx_left;	
						scjglfx_left.list.map(item => {
							item.markPoint = max_min;
						});
						var collection_analysis_left = document.getElementById('collection_analysis_left');
						this.collectionAnalysisLeftChart = echarts.init(collection_analysis_left);
						this.collectionAnalysisLeftChart.setOption(this.lineOptions(day,scjglfx_left,'%'));
						//收藏加购分析（右侧）
						let scjglfx_right = res.data.data.scjglfx_right;
						scjglfx_right.list.map(item => {
							item.markPoint = max_min;
						});
						var collection_analysis_right = document.getElementById('collection_analysis_right');
						this.collectionAnalysisRightChart = echarts.init(collection_analysis_right);
						this.collectionAnalysisRightChart.setOption(this.lineOptions(day,scjglfx_right,'%'));
						var _this = this;
						window.addEventListener('resize',() => {
							_this.visitorsAnalysisChart.resize();
							_this.productionAnalysisLeftChart.resize();
							_this.productionAnalysisRightChart.resize();
							_this.costAnalysisChart.resize();
							_this.ratioComparisonChart.resize();
							_this.collectionAnalysisLeftChart.resize();
							_this.collectionAnalysisRightChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
}
},
components:{
	TabaleWidget,
	PopoverWidget
}
}
</script>












