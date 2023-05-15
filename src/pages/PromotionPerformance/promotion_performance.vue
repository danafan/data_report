<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps from="4" @callBack="checkReq"></dps>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="推广负责人：">
				<el-select v-model="tgfzr_ids" clearable multiple filterable reserve-keyword placeholder="请输入推广负责人" collapse-tags>
					<el-option v-for="item in tgfzr_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
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
				<el-checkbox :true-label='1' :false-label="0" v-model="gxmyxyl">贡献毛益小于0</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-checkbox :true-label='1' :false-label="0" v-model="yk_flag">盈亏小于0</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!--  推广负责人 -->
		<div class="bar_chart_100" id="fzr_chart" v-loading="fzr_loading"></div>
		<div class="flex jse mb-10">
			<el-button type="primary" plain size="small" @click="postExport('推广负责人ROI','fzr')" :loading="fzr_table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="fzr_table_loading" :isLoading="fzr_table_loading" tableName="fzr" :table_data="fzr_table_data" :title_list="fzr_title_list"/>
		<div class="flex jsb mt-10">
			<div class="width-50">
				<div class="bar_chart_100" id="dept_chart" v-loading="dept_loading"></div>
				<div class="flex jse mb-10">
					<el-button type="primary" plain size="small" @click="postExport('项目部ROI','dept')" :loading="dept_table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<custom-table class="width-100" v-loading="dept_table_loading" :isLoading="dept_table_loading" tableName="dept" :table_data="dept_table_data" :title_list="dept_title_list"/>
			</div>
			<div class="width-50">
				<div class="bar_chart_100" id="dpid_chart" v-loading="dpid_loading"></div>
				<div class="flex jse mb-10">
					<el-button type="primary" plain size="small" @click="postExport('店铺ROI','dpid')" :loading="dpid_table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<custom-table class="width-100" v-loading="dpid_table_loading" :isLoading="dpid_table_loading" tableName="dept" :table_data="dpid_table_data" :title_list="dpid_title_list"/>
			</div>
		</div>
		<div class="bar_chart_100 mt-10" id="gys_chart" v-loading="gys_loading"></div>
		<div class="flex jse mb-10">
			<el-button type="primary" plain size="small" @click="postExport('供应商ROI','gys')" :loading="gys_table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="gys_table_loading" :isLoading="gys_table_loading" tableName="gys" :table_data="gys_table_data" :title_list="gys_title_list"/>
		<div class="bar_chart_100 mt-10" id="cpfl_chart" v-loading="cpfl_loading"></div>
		<div class="flex jse mb-10">
			<el-button type="primary" plain size="small" @click="postExport('品类ROI','cpfl')" :loading="cpfl_table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="cpfl_table_loading" :isLoading="cpfl_table_loading" tableName="cpfl" :table_data="cpfl_table_data" :title_list="cpfl_title_list"/>
		<div class="flex jse mt-15">
			<el-radio-group v-model="type" size="small">
				<el-radio-button label="fzr">人员</el-radio-button>
				<el-radio-button label="dept">项目部</el-radio-button>
				<el-radio-button label="dpid">店铺</el-radio-button>
				<el-radio-button label="gys">供应商</el-radio-button>
				<el-radio-button label="cpfl">品类</el-radio-button>
			</el-radio-group>
		</div>
		<!-- 气泡图 -->
		<div class="dashed_chart" id="dashed_chart" v-loading="dashed_loading"></div>
		<!-- 汇总 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="指标汇总" :show_popover="false"/>
			<div class="flex ac">
				<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="commitExport('promote_kpi_dp_export')" :loading="table_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
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
	import {exportUp,exportPost} from '../../api/export.js'
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
				date:[lastXDate(7),getCurrentDate()],//日期
				tgfzr_list:[],								//员工列表
				tgfzr_ids:[],								//推广负责人
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				pp_list:[],									//品牌列表
				select_pp_list:[],							//选中的品牌列表
				type:'fzr',									//类型
				gxmyxyl:0,									//贡献毛益小于0
				yk_flag:0,									//盈亏小于0
				dashedChart:null,							//气泡图
				dashed_loading:false,						//气泡图加载
				fzr_loading:false,
				fzr_table_loading:false,
				dept_loading:false,
				dept_table_loading:false,
				dpid_loading:false,
				dpid_table_loading:false,
				gys_loading:false,
				gys_table_loading:false,
				cpfl_loading:false,
				cpfl_table_loading:false,
				fzrChart:null,
				deptChart:null,
				dpidChart:null,
				gysChart:null,
				cpflChart:null,
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
				current_arg:{},
				qpt_arg:{},
				fzr_table_data:[],			//推广负责人roi表格数据
				fzr_title_list:[],			//推广负责人roi表头数据
				dept_table_data:[],			//项目部roi表格数据
				dept_title_list:[],			//项目部roi表头数据
				dpid_table_data:[],			//店铺roi表格数据
				dpid_title_list:[],			//店铺roi表头数据
				gys_table_data:[],			//供应商roi表格数据
				gys_title_list:[],			//供应商roi表头数据
				cpfl_table_data:[],			//产品分类roi表格数据
				cpfl_title_list:[],			//产品分类roi表头数据
			}
		},
		watch:{
			type:function(n,o){
				//获取气泡图数据
				this.page = 1;
				this.pagesize = 10;
				this.scatterChart();
			},
			activeTab:function(n,o){
				if(n == 'promotion_performance'){
					if(this.fzrChart){
						this.fzrChart.resize();
					}
					if(this.deptChart){
						this.deptChart.resize();
					}
					if(this.dpidChart){
						this.dpidChart.resize();
					}
					if(this.gysChart){
						this.gysChart.resize();
					}
					if(this.cpflChart){
						this.cpflChart.resize();
					}
					if(this.dashedChart){
						this.dashedChart.resize();
					}
				}
			}
		},
		props:{
			activeTab:{
				type:String,
			default:""
			}
		},
		created(){
			//推广负责人
			this.ajaxTgfzr();
			//品类列表
			this.getPl();
		},
		mounted(){
			//点击搜索
			this.searchFn();
		},
		methods:{
			//点击搜索
			async searchFn(){
				//获取推广负责人柱状图数据
				this.fzr_loading = true;
				this.fzr_table_loading = true;
				this.dept_loading = true;
				this.dept_table_loading = true;
				this.dpid_loading = true;
				this.dpid_table_loading = true;
				this.gys_loading = true;
				this.gys_table_loading = true;
				this.cpfl_loading = true;
				this.cpfl_table_loading = true;
				this.dashed_loading = true;
				this.table_loading = true;
				//推广负责人ROI
				await this.promoteKpiChart('fzr','推广负责人ROI')
				await this.dpPromoteGroupList('fzr');
				//项目部ROI
				await this.promoteKpiChart('dept','项目部ROI')
				await this.dpPromoteGroupList('dept');
				//店铺ROI
				await this.promoteKpiChart('dpid','店铺ROI')
				await this.dpPromoteGroupList('dpid');
				//供应商ROI
				await this.promoteKpiChart('gys','供应商ROI')
				await this.dpPromoteGroupList('gys');
				//品类ROI
				await this.promoteKpiChart('cpfl','品类ROI')
				await this.dpPromoteGroupList('cpfl');
				//获取气泡图数据
				this.type = 'fzr';
				await this.scatterChart();
				//推广绩效综合看板 汇总数据
				this.page = 1;
				this.pagesize = 10;
				this.qpt_arg = {};
				await this.promoteKpiDpList();
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_ids = reqObj.select_department_ids;
				this.platform_ids = reqObj.select_plat_ids;
				this.shop_ids = reqObj.select_store_ids;
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
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					commonResource.ajaxPl().then(res => {
						if(res.data.code == 1){
							this.pl_list = res.data.data;
							this.$store.commit('setPlList',this.pl_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.pl_list = this.$store.state.pl_list;
				}
			},
			//获取顶部柱状图数据
			promoteKpiChart(type,title){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					shop_id:this.shop_ids.join(','),
					cpfl:this.select_pl_ids.join(','),
					pp:this.select_pp_list.join(','),
					gys:this.select_gys_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					type:type
				}
				if(this.gxmyxyl === 1){
					arg['gxmy_flag'] = this.gxmyxyl;
				}
				if(this.yk_flag === 1){
					arg['yk_flag'] = this.yk_flag;
				}
				return new Promise((resolve)=>{
					resource.promoteKpiChart(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this[`${type}_loading`] = false;
							let data = res.data.data;
							var echarts = require("echarts");
							var dashed_chart = document.getElementById(`${type}_chart`);
							this[`${type}Chart`] = echarts.getInstanceByDom(dashed_chart)
							if (this[`${type}Chart`] == null) { 
								this[`${type}Chart`] = echarts.init(dashed_chart);
							}
							if(data.length == 0){		//无数据
								let option = {
									title: {
										text: title,
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
								if (this[`${type}Chart`]) { 
									this[`${type}Chart`].clear();
								}
								this[`${type}Chart`].setOption(option);
							}else{						//有数据
								let x_axis = data.title;
								let series_data = [];
								data.list.map(item => {
									item['value'] = item.roi;
									let chart_item = {
										value: item.roi,
										data:item,
										itemStyle: {
											color: item.roi >= data.roi?'green':'red'
										},
										label: {
											show: type != 'gys'?true:false,
											position: 'top',
											color: item.roi >= data.roi?'green':'red',
											fontWeight:'bold',
											distance:type == 'fzr' || type == 'dpid'?10:5,
											rotate:type == 'fzr' || type == 'dpid'?55:0
										},
									}
									series_data.push(chart_item);
								})
								let line_data = [];
								for(let i = 0;i < series_data.length;i ++){
									line_data.push(data.roi)
								}
								if (this[`${type}Chart`]) { 
									this[`${type}Chart`].clear();
								}
								this[`${type}Chart`].setOption(this.setBarOptions(title,x_axis,series_data,line_data,type));
							}
							
							// window.addEventListener('resize',this.debounce(()=>{
							// 	this[`${type}Chart`].resize();
							// }, 50));
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//柱状图渲染
			setBarOptions(title,x_axis,series_data,line_data,type){
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
							ROI：${params.value}</br>
							真实GMV：${params.data.data.zs_xsje}</br>
							营销费用：${params.data.data.yxfy}`;
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
						left: type == 'dept' || type == 'dpid'?'5%':'2%',
						top: '15%',
						right:type == 'dept' || type == 'dpid'?'15%':'8%',
						bottom:type != 'gys'?'22%':'10%'
					},
					xAxis: {
						type: 'category',
						data: x_axis,
						axisLabel:type != 'gys'?{
							interval:0,
							rotate:55
						}:{}
					},
					yAxis: {
						type: 'value',
						min:-1,
						max:21,
						splitNumber:6
					},
					series: [
					{
						data: series_data,
						type: 'bar'
					},
					{
						name: '平均值',
						type: 'line',
						data: line_data,
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
								name: '公司ROI',
							},
							],
							label: {
								position: 'end',
								formatter: '公司ROI：{c}',
							}
						},
					}
					]
				}
			},
			//获取表格数据
			dpPromoteGroupList(type){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					shop_id:this.shop_ids.join(','),
					cpfl:this.select_pl_ids.join(','),
					pp:this.select_pp_list.join(','),
					gys:this.select_gys_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					type:type
				}
				if(this.gxmyxyl === 1){
					arg['gxmy_flag'] = this.gxmyxyl;
				}
				if(this.yk_flag === 1){
					arg['yk_flag'] = this.yk_flag;
				}
				return new Promise((resolve)=>{
					resource.dpPromoteGroupList(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this[`${type}_table_loading`] = false;
							let data = res.data.data;
							this[`${type}_table_data`] = data.table_data;
							this[`${type}_title_list`] = data.title_list;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//获取气泡图数据
			scatterChart(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					shop_id:this.shop_ids.join(','),
					cpfl:this.select_pl_ids.join(','),
					pp:this.select_pp_list.join(','),
					gys:this.select_gys_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					type:this.type,
				}
				if(this.gxmyxyl === 1){
					arg['gxmy_flag'] = this.gxmyxyl;
				}
				if(this.yk_flag === 1){
					arg['yk_flag'] = this.yk_flag;
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
									item_arr.push(item.yxfy);
									if(item.dept_id){
										item_arr.push({dept_id:item.dept_id})
									}else if(item.shop_id){
										item_arr.push({shop_id:item.shop_id})
									}else{
										let dd = {};
										if(this.type == 'fzr'){
											dd['tgfzr'] = item.name;
										}else{
											dd[this.type] = item.name;
										}
										item_arr.push(dd)
									}
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
							this.dashedChart.off('click');
							this.dashedChart.on('click',(params) => {
								this.qpt_arg = params.data[params.data.length - 1];
								//推广绩效综合看板 汇总数据
								this.promoteKpiDpList();
							})
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
							真实GMV：${params.data[2]}</br>
							销量：${params.data[4]}</br>
							毛利率：${params.data[5]}</br>
							营销费用：${params.data[6]}</br>`;
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
						offset:-121
					},
					yAxis: {
						name:'ROI',
						scale:true,
						min:-1,
						max:21,
						splitNumber:6
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
								return params.data[2] > 1000000?params.data[3]:'';
							},
						},	
						symbolSize: function (data) {
							return Math.sqrt(data[2]) / 30;
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
			promoteKpiDpList(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					shop_id:this.shop_ids.join(','),
					cpfl:this.select_pl_ids.join(','),
					pp:this.select_pp_list.join(','),
					gys:this.select_gys_ids.join(','),
					platform:this.platform_ids.join(','),
					dept_id:this.dept_ids.join(','),
					type:this.type,
					sort:this.sort,
					sort_type:this.sort_type,
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.gxmyxyl === 1){
					arg['gxmy_flag'] = this.gxmyxyl;
				}
				if(this.yk_flag === 1){
					arg['yk_flag'] = this.yk_flag;
				}
				arg = {...arg,...this.qpt_arg};
				this.current_arg = arg;
				this.table_loading = true;
				return new Promise((resolve)=>{
					resource.promoteKpiDpList(arg).then(res => {
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
				commonResource.setColumns({menu_id:'178',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.custom_loading = false;
						//获取列表
						this.page = 1;
						this.pagesize = 10;
						this.promoteKpiDpList(this.current_arg);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//上面导出
			postExport(title,type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
						tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
						tgfzr:this.tgfzr_ids.join(','),
						shop_id:this.shop_ids.join(','),
						cpfl:this.select_pl_ids.join(','),
						pp:this.select_pp_list.join(','),
						gys:this.select_gys_ids.join(','),
						platform:this.platform_ids.join(','),
						dept_id:this.dept_ids.join(','),
						type:type,
					}
					if(this.gxmyxyl === 1){
						arg['gxmy_flag'] = this.gxmyxyl;
					}
					if(this.yk_flag === 1){
						arg['yk_flag'] = this.yk_flag;
					}
					resource.dpPromoteGroupExport(arg).then(res => {
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
			//导出
			commitExport(export_url){
				let req = {
					tjrq_start:this.current_arg.tjrq_start,
					tjrq_end:this.current_arg.tjrq_end,
					tgfzr:this.current_arg.tgfzr,
					shop_id:this.current_arg.shop_id,
					cpfl:this.current_arg.cpfl,
					pp:this.current_arg.pp,
					gys:this.current_arg.gys,
					platform:this.current_arg.platform,
					dept_id:this.current_arg.dept_id,
					type:this.current_arg.type,
					sort:this.current_arg.sort,
				}
				if(this.gxmyxyl === 1){
					req['gxmy_flag'] = this.gxmyxyl;
				}
				if(this.yk_flag === 1){
					req['yk_flag'] = this.yk_flag;
				}
				var export_arr = [];
				for(let key in req){
					export_arr.push(`${key}=${req[key]}`);
				}
				let url = `annual/${export_url}?${export_arr.join("&")}`;
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
				this.promoteKpiDpList();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.promoteKpiDpList();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.promoteKpiDpList();
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
	.bar_chart_100{
		width: 100%;
		height: 320px;
	}
	.bar_chart_50{
		width: 50%;
		height: 320px;
	}
	.dashed_chart{
	// width: 800px;
	width: 100%;
	height: 500px;
}
</style>