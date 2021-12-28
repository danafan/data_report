<template>
	<div>
		<dps @callBack="checkReq"></dps>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="公司：">
				<el-select v-model="company" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in company_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
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
		<el-form-item>
			<el-checkbox v-model="is_assessment" true-label="1" false-label="0" border size="small">考核店铺</el-checkbox>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="searchFun">搜索</el-button>
		</el-form-item>
	</el-form>
	<!-- 表格 -->
	<div class="table_setting">
		<el-button type="primary" size="small" @click="customFun" style="margin-bottom: 5px">自定义列表</el-button>
	</div>
	<el-table :data="table_list" size="small" style="width: 100%" :class="{'margin_bottom':dashboard_data.length > 0}" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :cell-style="columnStyle"  @sort-change="sortChange">
		<el-table-column :label="item.row_name" :prop="item.row_field_name" v-for="item in title_list" :sortable="item.is_sort == 1?'custom':false" show-overflow-tooltip :render-header="renderHeader" :fixed="item.is_fixed == 1" width="80">
			<template slot-scope="scope">
				<div :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:`${item.color}`}" v-if="item.type == 1 && scope.$index != 0">{{scope.row[item.row_field_name]}}{{item.unit}}</div>
				<div class="text_content" v-else>{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ''?item.unit:''}}</div>
			</template>
		</el-table-column>
	</el-table>
	<!-- 仪表 -->
	<div id="cate_row" class="cate_row"></div>
	<!-- 各店销售收入完成情况 -->
	<div id="axis_01" class="axis_box"></div>
	<!-- 各店毛利额完成情况 -->
	<div id="axis_02" class="axis_box"></div>
	<!-- 各店营销费用完成情况 -->
	<div id="axis_03" class="axis_box"></div>
	<!-- 自定义列表 -->
	<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
		<div>
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
<style>
.el-table .cell {
	word-break: keep-all !important;
	white-space: nowrap !important;
}
</style>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
}
.cate_row{
	width: 100%;
	display:flex;
	align-items: center;
	justify-content: space-evenly;
}
.text_content{
	overflow:hidden;
	text-overflow:ellipsis;
	white-space:nowrap
}
.margin_bottom{
	margin-bottom: 60px;
}
.axis_box{
	margin-top: 60px;
	width: 100%;
	min-height: 600px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
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
				select_department_ids:[],			//选中的部门id列表
				select_plat_ids:[],					//选中的平台列表
				select_store_ids:[],				//选中的店铺id列表
				company_list:[],					//公司列表
				company:['德儿'],					//选中的公司
				is_assessment:'0',					//是否考核店铺
				dashboard_data:[],					//仪表盘列表
				table_list:[],						//列表数据
				title_list:[],						//列
				selected_ids:[],					//自定义已选中的id
				row_ids:[],							//可提交的自定义ids
				view_row:[],						//自定义
				sort:"",
				sort_type:"",
				show_custom:false,					//自定义列表
			}
		},
		created(){
			//公司列表
			this.ajaxCompany();
			//获取列表（表格）
			this.targetTable();
			//获取列表（仪表盘和柱状图）
			this.getData();
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
			//点击搜索
			searchFun(){
				//获取列表（表格）
				this.targetTable();
				//获取列表（仪表盘和柱状图）
				this.getData();
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
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//获取列表（表格）
			targetTable(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment,
					company:this.company.join(','),
					sort:this.sort,
					sort_type:this.sort_type
				}
				resource.targetTable(req).then(res => {
					if(res.data.code == 1){
						this.table_list = res.data.data.data;			//列表行数据
						this.title_list = res.data.data.title_list;		//列表列数据
						this.selected_ids = res.data.data.selected_ids;	//自定义已选中的id
						this.view_row = res.data.data.view_row;			//自定义
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//表格排序
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				//获取表格
				this.targetTable();
			},
			//单品分析—-指标汇总自定义列表
			customFun(page_type){
				this.row_ids = this.selected_ids;
				this.show_custom = true;
			},
			//单品分析—-指标汇总恢复默认
			Restore(){
				this.row_ids = [];
				this.view_row.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			//自定义列
			setColumns(){
				resource.setColumns({menu_id:'54',row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						//获取列表
						this.targetTable();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//获取列表（仪表和柱状图）
			getData(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment,
					company:this.company.join(',')
				}
				resource.targetCompleteChart(req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						//仪表盘数据
						this.dashboard_data = res.data.data.dashboard;
						for(var i = 0;i < this.dashboard_data.length;i ++){
							//判断是否包含当前元素
							let cur_ele = document.getElementById('id_' + i);
							if(!cur_ele){	//不包含则创建
								let div = '<div style="height:300px;float:left;width:320px;margin-bottom:10px;margin-right:30px" id='+"id_"+i+' class="echarts_div"></div>';
								document.getElementById('cate_row').insertAdjacentHTML("beforeBegin",div);
							}
						}
						this.dashboard_data.map((item,index) => {
							var ele = document.getElementById('id_' + index);
							var myChart = echarts.getInstanceByDom(ele);
							if (myChart == null) { 
								myChart = echarts.init(ele);
							}
							myChart.setOption(this.option(item));
						});
						//各店销售收入完成情况
						var title = '各店销售收入完成情况（有月目标的店铺）';
						var	legend = ['销售收入月目标','销售收入预估','销售收入月完成率预估'];
						var xssr_dpid = [];
						var xssr_dpmc = [];
						var xssr_xssryg = [];
						var xssr_ymb = [];
						var xssr_wcl = [];
						let xssryg_chart = res.data.data.xssryg_chart;
						xssryg_chart.map(item => {
							xssr_dpid.push(item.dpid);			//店铺id
							xssr_dpmc.push(item.dpmc);			//店铺名称
							xssr_ymb.push(item.ymb_xssr);		//销售收入月目标
							xssr_xssryg.push(item.xssryg);		//销售收入预估
							xssr_wcl.push(item.wcl);			//销售收入完成率
						});
						var axis_01 = document.getElementById('axis_01');
						let axis_01Chart = echarts.getInstanceByDom(axis_01);
						if (axis_01Chart == null) { 
							this.axis_01Chart = echarts.init(axis_01);
						}
						this.axis_01Chart.setOption(this.axisOption(title,legend,xssr_dpid,xssr_dpmc,xssr_ymb,xssr_xssryg,xssr_wcl));
						//各店毛利额完成情况
						var title = '各店毛利额完成情况（有月目标的店铺）';
						var	legend = ['毛利额月目标','毛利额','毛利额月完成率预估'];
						var mle_dpid = [];
						var mle_dpmc = [];
						var mle_mle = [];
						var mle_ymb = [];
						var mle_wcl = [];
						let mle_chart = res.data.data.mle_chart;
						mle_chart.map(item => {
							mle_dpid.push(item.dpid);			//店铺id
							mle_dpmc.push(item.dpmc);			//店铺名称
							mle_ymb.push(item.ymb_mle);			//毛利额月目标
							mle_mle.push(item.mle);			//毛利额
							mle_wcl.push(item.wcl);			//毛利额月完成率预估
						});
						var axis_02 = document.getElementById('axis_02');
						let axis_02Chart = echarts.getInstanceByDom(axis_02);
						if (axis_02Chart == null) { 
							this.axis_02Chart = echarts.init(axis_02);
						}
						this.axis_02Chart.setOption(this.axisOption(title,legend,mle_dpid,mle_dpmc,mle_ymb,mle_mle,mle_wcl));
						//各店营销费用完成情况
						var title = '各店营销费用完成情况（有月目标的店铺）';
						var	legend = ['营销费用月目标','营销费用预估','营销费用月完成率预估'];
						var yxfy_dpid = [];
						var yxfy_dpmc = [];
						var yxfy_yxfyyg = [];
						var yxfy_ymb = [];
						var yxfy_wcl = [];
						let yxfy_chart = res.data.data.yxfy_chart;
						yxfy_chart.map(item => {
							yxfy_dpid.push(item.dpid);			//店铺id
							yxfy_dpmc.push(item.dpmc);			//店铺名称
							yxfy_ymb.push(item.ymb_yxfy);		//营销费用月目标
							yxfy_yxfyyg.push(item.yxfy);		//营销费用预估
							yxfy_wcl.push(item.wcl);			//营销费用完成率
						});
						var axis_03 = document.getElementById('axis_03');
						let axis_03Chart = echarts.getInstanceByDom(axis_03);
						if (axis_03Chart == null) { 
							this.axis_03Chart = echarts.init(axis_03);
						}
						this.axis_03Chart.setOption(this.axisOption(title,legend,yxfy_dpid,yxfy_dpmc,yxfy_ymb,yxfy_yxfyyg,yxfy_wcl));

						var _this = this;
						window.addEventListener('resize',() => {
							_this.axis_01Chart.resize();
							_this.axis_02Chart.resize();
							_this.axis_03Chart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//第一行样式
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(rowIndex == 0){
					return 'color: #8D5714';
				}
			},
			//左侧固定
			tableFixed(row_field_name){
				if(row_field_name == 'dpid' || row_field_name == 'dpmc'){
					return true;
				}
			},
			// 仪表盘
			option(item){
				return {
					title: {
						text: item.title,
						subtext:item.tag_message?item.tag_message:''
					},
					series: [{
						type: 'gauge',
						center: ["50%", "60%"], 
						radius: "100%", 
						startAngle: 215,
						endAngle: -35,
						min: 0,
						max: item.max_value,
						splitNumber: 2,
						itemStyle: {
							color: '#FD7B08',
						},
						progress: {
							show: true,
							roundCap: true,
							width: 18
						},
						pointer: {
							icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
							length: '75%',
							width: 16,
							offsetCenter: [0, '5%']
						},
						axisLine: {
							roundCap: true,
							lineStyle: {
								width: 18
							}
						},
						axisTick: {
							splitNumber: 2,
							lineStyle: {
								width: 2,
								color: '#999'
							}
						},
						splitLine: {
							length: 12,
							lineStyle: {
								width: 3,
								color: '#999'
							}
						},
						axisLabel: {
							distance: -40,
							color: '#999',
							formatter: '{value} 万'
						},
						title: {
							show: false
						},
						detail: {
							backgroundColor: '#fff',
							borderColor: '#999',
							width: '60%',
							lineHeight: 40,
							height: 40,
							borderRadius: 8,
							offsetCenter: [0, '35%'],
							valueAnimation: true,
							formatter: function (value) {
								return '{value|' + value.toFixed(2) + '}{unit|万}';
							},
							rich: {
								value: {
									fontSize: 20,
									fontWeight: 'bolder',
									color: '#333'
								},
								unit: {
									fontSize: 20,
									fontWeight: 'bolder',
									color: '#333',
								}
							}
						},
						data: [{
							value: item.current_value
						}]
					}]
				}
			},
            //柱状图加折线图
            axisOption(title,legend,dpid,dpmc,ymb,yg,wcl){
            	return {
            		title: {
            			text: title
            		},
            		tooltip: {
            			trigger: 'axis',
            			formatter: function (params) {
            				let dataIndex = params[params.length - 1].dataIndex;
            				let tip_dpid = dpid[dataIndex];
            				let tip_dpmc = dpmc[dataIndex];
            				let tip_ymb = ymb[dataIndex];
            				let tip_yg = yg[dataIndex];
            				let tip_wcl = wcl[dataIndex];
            				let tip = "";
            				if(params != null && params.length > 0) {
            					tip = "店铺ID：" + tip_dpid + "</br>"
            					+"店铺名称：" + tip_dpmc + "</br>"
            					+ legend[0] + "：" + tip_ymb + "万</br>"
            					+ legend[1] + "：" + tip_yg + "万</br>"
            					+ legend[2] + "：" + tip_wcl + "%";
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
            		color:['#9FAFFE','#FDD139', '#DE8337'],
            		legend: {
            			data: legend
            		},
            		grid:{
            			y2:300
            		},
            		xAxis: [{
            			type: 'category',
            			data: dpid,
            			axisLabel: {
            				color: '#333',
            				interval: 2,
            				rotate:70
            			}
            		}],
            		yAxis:[{
            			type: 'value',
            			axisLabel: {
            				formatter: '{value}万'
            			}
            		},{
            			type: 'value',
            			min: 0,
            			axisLabel: {
            				formatter: '{value} %'
            			}
            		}],
            		series: [{
            			name: legend[0],
            			type: 'bar',
            			stack: '2',
            			emphasis: {
            				focus: 'series'
            			},
            			data: ymb
            		},{
            			name: legend[1],
            			type: 'bar',
            			stack: '1',
            			barGap: '-120%',
            			barMaxWidth:"60%",
            			emphasis: {
            				focus: 'series'
            			},
            			data: yg
            		},{
            			name: legend[2],
            			type: 'line',
            			yAxisIndex:1,
            			lineStyle: { 
            				 width:3.6
            			},
            			emphasis: {
            				focus: 'series'
            			},
            			data: wcl
            		}]
            	}
            },

        },
        components:{
        	dps
        }
    }

</script>








