<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="daterange"
				:clearable="false"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="公司：">
			<el-select v-model="company" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in company_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<dps @callBack="checkReq"></dps>
		<el-form-item>
			<el-checkbox v-model="is_assessment" true-label="1" false-label="0" border size="small">考核店铺</el-checkbox>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="GetData">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="table_setting">
		<el-button type="primary" size="small" @click="show_custom = true">店铺自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="Export" v-if="button_list.export == '1'">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<!-- 表格 -->
	<el-table :data="table_list" size="small" style="width: 100%;margin-bottom: 30px" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :summary-method="getWeekSummaries" show-summary v-loading="loading">
		<el-table-column :label="item.row_name" :prop="item.row_field_name" v-for="item in title_list" :sortable="item.is_sort == 1" show-overflow-tooltip :render-header="renderHeader" :fixed="item.is_fixed == 1">
			<template slot-scope="scope">
				<div :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="item.type == 1">{{scope.row[item.row_field_name]}}{{item.unit}}</div>
				<div class="text_content" v-else>{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{item.unit}}</div>
			</template>
		</el-table-column>
	</el-table>
	<!-- 折线图 -->
	<div id="container"></div>
	<!-- 自定义列表 -->
	<el-dialog title="店铺自定义列表（单机取消列表名保存直接修改）" :visible.sync="show_custom">
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
	<!-- 折线图放大 -->
	<div class="echarts_box" v-show="show_box">
		<div class="close_icon">
			<i class="el-icon-circle-close" @click="closeBox"></i>
		</div>
		<div class="lbx">
			<div class="echarts_container" id="echarts_container"></div>
		</div>
	</div>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
}
.echarts_box{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background:#fff;
	z-index: 999;
	display:flex;
	flex-direction: column;
	.close_icon{
		padding-top: 20px;
		padding-right: 20px;
		height: 60px;
		display:flex;
		justify-content: flex-end;
		font-size: 20px;
	}
	.lbx{
		flex: 100%;
		width: 100%;
		display:flex;
		align-items: center;
		justify-content: center;
		.echarts_container{
			height: 60%;
			width: 60%;
		}
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportExcel} from '../../../api/export.js'
	import dps from '../../../components/results_components/dps.vue'
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
				},	 								//时间区间
				date:[getMonthStartDate(),getCurrentDate()],//发货时间
				start_time:getMonthStartDate(),		//开始时间
				end_time:getCurrentDate(),			//结束时间
				is_assessment:'0',					//考核店铺
				select_plat_ids:[],					//选中的平台列表
				select_department_ids:[],			//选中的部门id列表	
				select_store_ids:[],				//选中的店铺id列表
				table_list:[],						//列表数据
				title_list:[],						//列
				selected_ids:[],					//自定义已选中的id
				view_row:[],						//自定义
				total:[],							//总计
				total_list:[],						//总计（用于导出）
				view_table_list:[],					//折线图列表
				company_list:[],					//公司列表
				show_custom:false,
				button_list:{},
				company:[],					//选中的公司
				show_box:false,						//默认放大折线图不显示
				loading:false
			}
		},
		mounted(){
			//获取信息
			this.GetData();
		},
		created(){
			//公司列表
			this.ajaxCompany();
		},
		watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
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
			//千分位展示
			getQianNumber(number) {
				const num = String(number)
				const reg = /\d{1,3}(?=(\d{3})+$)/g
				const res = num.replace(/^(-?)(\d+)((\.\d+)?)$/, function(match, s1, s2, s3){
					return s1 + s2.replace(reg, '$&,') + s3
				})
				return res
			},
			//表格总计行
			getWeekSummaries(param) {
				return this.total;
			},
			//导出
			Export(){
				// 加单位
				let table_list = JSON.parse(JSON.stringify(this.table_list));
				let total_list = JSON.parse(JSON.stringify(this.total_list));
				let data_list = [...table_list,...total_list];
				data_list.map(item => {
					this.title_list.map(i => {
						item[i.row_field_name] += i.unit;
					})
				});
				var data_obj = {
					table_title:"每日业绩报告",
					table_title_list:[],
					field_name_list:[],
					data_list:table_list.length > 1?data_list:table_list
				};
				this.title_list.map(item => {
					data_obj.table_title_list.push(item.row_name);
					data_obj.field_name_list.push(item.row_field_name);
				})
				exportExcel(data_obj);
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//公司列表
			ajaxCompany(){
				resource.ajaxCompany().then(res => {
					if(res.data.code == 1){
						this.company_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取信息
			GetData(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment,
					company:this.company.join(',')
				}
				this.loading = true;
				resource.dayAnalysis(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.button_list = res.data.data.button_list;
						let table_list = res.data.data.table_list;
						this.table_list = table_list.list;				//列表行数据
						this.title_list = table_list.title_list;		//列表列数据
						this.selected_ids = table_list.selected_ids;	//自定义已选中的id
						this.view_row = table_list.view_row;			//自定义
						this.total = table_list.total;
						this.total_list[0] = table_list.total_list;
						this.view_table_list = res.data.data.view_table_list;	//折线图
						if(this.view_table_list == 0){
							//清空折线图
							this.ClearEcharts();
						}else{
							for(var i = 0;i < this.view_table_list.length;i ++){
								let div = '<div style="height:360px;float:left;width:46%;margin-bottom:10px;margin-right:30px" id='+"id_"+i+' class="echarts_div"></div>';
								document.getElementById('container').insertAdjacentHTML("beforeBegin",div);
							}
							var echarts = require("echarts");
							this.view_table_list.map((item,index) => {
								var legend_data = [];
								var xAxis_data = [];
								var series_data = [];
								item.list.map(item => {
									legend_data.push(item.name);
									xAxis_data = Object.keys(item.list);
									let obj = {
										name: item.name,
										type: 'line',
										lineStyle:{
											width:3.6
										},
										data: Object.values(item.list)
									}
									series_data.push(obj)
								})
								var ele = document.getElementById('id_' + index);
								var myChart = echarts.init(ele);
								myChart.setOption(this.axisOption(item,xAxis_data,series_data,legend_data,'1'))
								window.addEventListener('resize',function(){
									myChart.resize();
								})
							})
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//折线图配置
			axisOption(item,xAxis_data,series_data,legend_data,type){
				return {
					title: {
						text: item.title
					},
					color:['#c23531','#2f4554', '#61a0a8'],
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = params[0].name
							for (var i = 0, l = params.length; i < l; i++) {
								let circle = `<i class="iconfont icon-yuan" style="margin-right:4px;font-size:14px;color:${params[i].color}">o</i>`
								relVal += '<br/>' + circle + params[i].seriesName + ' : ' + params[i].value + item.unit
							}
							return relVal
						}
					},
					toolbox: type=='1'?{
						feature: {
							myTool2: {
								show: true,
								title: '全屏',
								icon: 'path://M896 512V212.48L212.48 896H512v128H0V512h128v299.52L811.52 128H512V0h512v512h-128z',
								onclick:  () => {
									this.show_box = true;
									this.$nextTick(() => {
										var echarts = require("echarts");

										let echarts_container = document.getElementById('echarts_container');
										var echartsChart = echarts.getInstanceByDom(echarts_container);
										if (echartsChart == null) { 
											echartsChart = echarts.init(echarts_container);
										}
										echartsChart.setOption(this.axisOption(item,xAxis_data,series_data,legend_data,'2'));
									});
									window.addEventListener('resize',function(){
										echartsChart.resize();
									})
								}
							}
						}
					}:{},
					legend: {
						x:'center',      
						y:'top',      
						data: legend_data
					},
					xAxis: {
						type: 'category',
						boundaryGap: false,
						data: xAxis_data,
						name:"日期"
					},
					yAxis: {
						type: 'value',
						name:"单位（"+ item.unit +"）"
					},
					series: series_data
				}
			},
			//关闭放大框
			closeBox(){
				this.show_box = false;
			},
			//清空折线图
			ClearEcharts(){
				var child= document.getElementsByClassName("echarts_div");
				child.removeNode = [];
				if (child.length != undefined) {
					var len = child.length;
					for (var i = 0; i < len; i++) {
						child.removeNode.push({
							parent: child[i].parentNode,
							inner: child[i].outerHTML,
							next: child[i].nextSibling
						});
					}
					for (var j = 0; j < len; j++){
						child[0].parentNode.removeChild(child[0]);
					}
				} else {
					child.removeNode.push({
						parent: child.parentNode,
						inner: child.outerHTML,
						next: child.nextSibling
					});
					child.parentNode.removeChild(child);
				}
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
				resource.setColumns({menu_id:'3',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						//获取列表
						this.GetData();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			
		},
		components:{
			dps
		}
	}
</script>