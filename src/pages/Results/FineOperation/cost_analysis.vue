<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="公司：">
				<el-select v-model="company" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部" @change="ajaxXmmc">
					<el-option v-for="item in company_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="用友店铺ID：">
				<el-select v-model="select_yyshop_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部" @change="ajaxXmmc">
					<el-option v-for="item in yyshop_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="项目大类：">
				<el-select v-model="select_xmdl_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in xmdl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="费用类型：">
				<el-select v-model="type" :popper-append-to-body="false">
					<el-option label="实际" :value="0"></el-option>
					<el-option label="充值" :value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="项目名称：">
				<el-select v-model="select_xmmc_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in xmmc_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="制单日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getData">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_setting">
			<div class="title">各店目标达成情况</div>
			<el-button type="primary" plain size="small" @click="Export">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_data" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :summary-method="getSummaries" show-summary>
			<el-table-column label="制单日期" prop="month" width="160" sortable>
			</el-table-column>
			<el-table-column label="店铺ID" prop="dpid" width="160" show-overflow-tooltip sortable>
			</el-table-column>
			<el-table-column label="用友店铺ID" prop="cdepname" width="160" show-overflow-tooltip sortable>
			</el-table-column>
			<el-table-column label="使用金额" prop="md" width="160" sortable>
				<template slot-scope="scope">
					<div class="background_box" :style="{width:`${max_list.max_md == 0?0:(160/max_list.max_md)*Math.abs(scope.row.md)}px`,background:'#FEDB6F'}">{{scope.row.md}}万</div>
				</template>
			</el-table-column>
			<el-table-column label="月目标" prop="ymb_yxfy" width="160" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.ymb_yxfy}}万</div>
				</template>
			</el-table-column>
			<el-table-column label="月目标使用率" prop="ymb_syl" width="160" sortable>
				<template slot-scope="scope">
					<div class="background_box" :style="{width:`${max_list.max_ymb_syl == 0?0:(160/max_list.max_ymb_syl)*Math.abs(scope.row.ymb_syl)}px`,background:'#F7AFAC'}">{{scope.row.ymb_syl}}%</div>
				</template>
			</el-table-column>
			<el-table-column label="累计目标" prop="rmb_yxfy" width="160" sortable>
				<template slot-scope="scope">
					<div>{{scope.row.rmb_yxfy}}万</div>
				</template>
			</el-table-column>
			<el-table-column label="累计目标达成率" prop="ljrmbdcl" width="160" sortable>
				<template slot-scope="scope">
					<div class="background_box" :style="{width:`${max_list.max_ljrmbdcl == 0?0:(160/max_list.max_ljrmbdcl)*Math.abs(scope.row.ljrmbdcl)}px`,background:'#F7AFAC'}">{{scope.row.ljrmbdcl}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 每日营销费用 -->
		<div id="tj_day" class="tj_day"></div>
		<!-- 底部tab -->
		<el-tabs v-model="activeLineTab" @tab-click="checkLineTab">
			<el-tab-pane label="按项目大类" name="xmdl" class="tab_pane_box">
				<div class="flex_box">
					<el-table :data="citemcname_table_data" size="small" style="width: 480px" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='500' :summary-method="xmdlSummary" show-summary>
						<el-table-column label="制单日期" prop="month" width="160">
						</el-table-column>
						<el-table-column label="项目大类" prop="name" width="160" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="使用金额" prop="md" width="160" sortable>
							<template slot-scope="scope">
								<div class="background_box" :style="{width:`${citemcname_max_list.max_md == 0?0:(160/citemcname_max_list.max_md)*Math.abs(scope.row.md)}px`,background:'#FEDB6F'}">{{scope.row.md}}万</div>
							</template>
						</el-table-column>
					</el-table>
					<div id="xmdl" class="pie_class"></div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="按项目部" name="xmb" class="tab_pane_box">
				<div class="flex_box">
					<el-table :data="dept_table_data" size="small" style="width: 480px" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='500' :summary-method="xmbSummary" show-summary>
						<el-table-column label="制单日期" prop="month" width="160">
						</el-table-column>
						<el-table-column label="项目部" prop="name" width="160" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="使用金额" prop="md" width="160" sortable>
							<template slot-scope="scope">
								<div class="background_box" :style="{width:`${dept_max_list.max_md == 0?0:(160/dept_max_list.max_md)*Math.abs(scope.row.md)}px`,background:'#FEDB6F'}">{{scope.row.md}}万</div>
							</template>
						</el-table-column>
					</el-table>
					<div id="xmb" class="pie_class"></div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="按店铺" name="dp" class="tab_pane_box">
				<div class="flex_box">
					<el-table :data="dp_table_data" size="small" style="width: 480px" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='500' :summary-method="dpSummary" show-summary>
						<el-table-column label="制单日期" prop="month" width="160">
						</el-table-column>
						<el-table-column label="店铺ID" prop="dpid" width="160" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="使用金额" prop="md" width="160" sortable>
							<template slot-scope="scope">
								<div class="background_box" :style="{width:`${dp_max_list.max_md == 0?0:(160/dp_max_list.max_md)*Math.abs(scope.row.md)}px`,background:'#FEDB6F'}">{{scope.row.md}}万</div>
							</template>
						</el-table-column>
					</el-table>
					<div id="dp" class="pie_class"></div>
				</div>
			</el-tab-pane>
			<el-tab-pane label="明细" name="mx" class="tab_pane_box">
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item label="项目名称：">
						<el-select v-model="selected_mx_xmmc_list" filterable clearable multiple collapse-tags placeholder="全部" @change="changeXmmc">
							<el-option v-for="item in mx_xmmc_list" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-table :data="mx_table_data" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='500' :summary-method="mxSummary" show-summary>
					<el-table-column label="制单日期" prop="month" width="160">
					</el-table-column>
					<el-table-column label="店铺ID" prop="dpid" width="160" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="项目大类" prop="citemcname" width="160" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="项目名称" prop="citemname" width="160" show-overflow-tooltip>
					</el-table-column>
					<el-table-column label="使用金额" prop="md" width="160" sortable>
						<template slot-scope="scope">
							<div class="background_box" :style="{width:`${mx_max_list.max_md == 0?0:(160/mx_max_list.max_md)*Math.abs(scope.row.md)}px`,background:'#FEDB6F'}">{{scope.row.md}}万</div>
						</template>
					</el-table-column>
				</el-table>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-top: 30px;
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
	.title{
		font-size: 18px;
		font-weight: bold;
	}
}

.background_box{
	padding-left: 3px;
	white-space:nowrap;
	height: 28px;
	display:flex;
	align-items: center;
}
.tj_day{
	margin-top: 30px;
	margin-bottom: 30px;
	width: 100%;
	height: 500px
}
.flex_box{
	width: 100%;
	display:flex;
	.pie_class{
		flex: 1;
		height: 500px;
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
				select_store_ids:[],						//选中的店铺列表
				select_department_ids:[],					//选中的部门id列表
				select_plat_ids:[],							//选中的平台列表
				yyshop_list:[],								//用友店铺列表
				select_yyshop_list:[],						//选中的用友店铺id列表
				xmdl_list:[],								//项目大类列表
				select_xmdl_list:[],						//选中的项目大类列表
				xmmc_list:[],								//项目名称列表
				select_xmmc_list:[],						//选中的项目名称列表
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
				type:0,										//费用类型
				table_data:[],								//上面表格信息
				max_list:{},								//最大值对象
				total_data:[],								//合计行
				tj_dayChart:null,							//每日营销费用
				activeLineTab:"xmdl",						//默认选中按项目大类
				xmdlChart:null,
				citemcname_table_data:[],					//按项目大类
				citemcname_max_list:{},						
				citemcname_total_data:[],		
				xmbChart:null,
				dept_table_data:[],							//按项目部
				dept_max_list:{},						
				dept_total_data:[],		
				dpChart:null,
				dp_table_data:[],							//按店铺
				dp_max_list:{},						
				dp_total_data:[],		
				mx_table_data:[],							//明细
				default_mx_table_data:[],
				mx_max_list:{},						
				mx_total_data:[],	
				company:['德儿'],							//选中的公司
				company_list:[],
				mx_xmmc_list:[],							//明细-所有项目名称
				selected_mx_xmmc_list:[],					//明细-选中的项目名称
			}
		},
		created(){
			//用友店铺列表
			this.ajaxYongyou();
			//项目大类列表
			this.ajaxXmdl();
			//项目名称列表
			this.ajaxXmmc();
			//公司列表
			this.ajaxCompany();
			//获取列表
			this.getData();
		},
		methods:{
			//导出
			Export(){
				let data_list = JSON.parse(JSON.stringify(this.table_data));
				data_list.map(item => {
					item.md = item.md + '万';
					item.ymb_yxfy = item.ymb_yxfy + '万';
					item.ymb_syl = item.ymb_syl + '%';
					item.rmb_yxfy = item.rmb_yxfy + '万';
					item.ljrmbdcl = item.ljrmbdcl + '%';
				})
				let total_data = {
					month:this.total_data[0],
					dpid:this.total_data[1],
					cdepname:this.total_data[2],
					md:this.total_data[3],
					ymb_yxfy:this.total_data[4],
					ymb_syl:this.total_data[5],
					rmb_yxfy:this.total_data[6],
					ljrmbdcl:this.total_data[7]
				};
				data_list.push(total_data);
				var data_obj = {
					table_title:"营销费用分析",
					table_title_list:['制单日期','店铺ID','用友店铺ID','使用金额','月目标','月目标使用率','累计目标','累计目标达成率'],
					field_name_list:['month','dpid','cdepname','md','ymb_yxfy','ymb_syl','rmb_yxfy','ljrmbdcl'],
					data_list:data_list
				};
				exportExcel(data_obj);
			},
			//总计行
			getSummaries(){
				return this.total_data;
			},
			//按项目大类总计行
			xmdlSummary(){
				return this.citemcname_total_data;
			},
			//按项目部总计行
			xmbSummary(){
				return this.dept_total_data;
			},
			//按店铺ID总计行
			dpSummary(){
				return this.dp_total_data;
			},
			//按明细总计行
			mxSummary(){
				return this.mx_total_data;
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
				//项目名称列表
				this.ajaxXmmc();
			},
			//用友店铺列表
			ajaxYongyou(){
				resource.ajaxYongyou().then(res => {
					if(res.data.code == 1){
						this.yyshop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//项目大类列表
			ajaxXmdl(){
				resource.ajaxXmdl().then(res => {
					if(res.data.code == 1){
						this.xmdl_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//项目名称列表
			ajaxXmmc(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					cdepcode:this.select_yyshop_list.join(','),
					company:this.company.join(',')
				}
				resource.ajaxXmmc(arg).then(res => {
					if(res.data.code == 1){
						this.xmmc_list = res.data.data;
						//处理底部项目名称
						this.mx_xmmc_list = this.xmmc_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换明细项目名称
			changeXmmc(v){
				if(v.length == 0 && this.mx_xmmc_list.length > 0){
					v = this.mx_xmmc_list;
				}
				var arr = [];
				var total_num = 0;
				this.default_mx_table_data.map(item => {
					v.map(i => {
						if(item.citemname == i){
							arr.push(item);
							total_num += item.md;
						}
					})
				})
				this.mx_table_data = arr;
				this.mx_total_data[4] = total_num.toFixed(2) + '万';
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
			//获取列表
			getData(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					cdepcode:this.select_yyshop_list.join(','),
					citemcname:this.select_xmdl_list.join(','),
					citemname:this.select_xmmc_list.join(','),
					start_time:this.date?this.date[0]:'',
					end_time:this.date?this.date[1]:'',
					type:this.type,
					company:this.company.join(',')
				}
				// //处理底部项目名称
				this.mx_xmmc_list = this.select_xmmc_list.length == 0?this.xmmc_list:this.select_xmmc_list;
				this.selected_mx_xmmc_list = this.mx_xmmc_list.length == this.xmmc_list.length?[]:this.mx_xmmc_list;
				resource.yxfyList(req).then(res => {
					if(res.data.code == 1){
						var data = res.data.data;
						var echarts = require("echarts");
						//各店目标达成情况
						this.table_data = data.top_table.list;
						this.max_list = data.top_table.max_list;
						this.total_data = data.top_table.total_data;
						//每日营销费用
						var day = data.tj_day.day;
						var list = data.tj_day.list;
						list.map(item => {
							item.toFixed(2);
						});
						var tj_day = document.getElementById('tj_day');
						this.tj_dayChart = echarts.init(tj_day);
						this.tj_dayChart.setOption({
							title: {
								text: '每日营销费用'
							},
							tooltip: {
								trigger: 'item',
								formatter: (params) => {
									return '制单日期：' + params.name + '</br>' 
									+ '使用金额：' + params.value + '万';
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
							color:['#FEDB6F'],
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: day
							},
							yAxis:[{
								type: 'value',
								name:'使用金额',
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series:[{
								label:{
									show:true,
									formatter: (params) => {
										return params.data + '万';
									},
								},
								data: list,
								type: 'line',
								areaStyle: {}
							}] 
						});
						//按项目大类
						this.citemcname_table_data = data.tj_citemcname.left_list.list;
						this.citemcname_max_list = data.tj_citemcname.left_list.max_list;
						this.citemcname_total_data = data.tj_citemcname.left_list.total_data;
						var xmdl = document.getElementById('xmdl');
						this.xmdlChart = echarts.init(xmdl);
						var citemcname_data = data.tj_citemcname.right_list.list;
						this.xmdlChart.setOption(this.pieOptions(citemcname_data,'项目大类'));
						//按项目部
						this.dept_table_data = data.tj_dept.left_list.list;
						this.dept_max_list = data.tj_dept.left_list.max_list;
						this.dept_total_data = data.tj_dept.left_list.total_data;
						var xmb = document.getElementById('xmb');
						this.xmbChart = echarts.init(xmb);
						var xmb_data = data.tj_dept.right_list.list;
						this.xmbChart.setOption(this.pieOptions(xmb_data,'项目部'));
						//按店铺ID
						this.dp_table_data = data.tj_dpid.left_list.list;
						this.dp_max_list = data.tj_dpid.left_list.max_list;
						this.dp_total_data = data.tj_dpid.left_list.total_data;
						var dp = document.getElementById('dp');
						this.dpChart = echarts.init(dp);
						var dp_data = data.tj_dpid.right_list.list;
						this.dpChart.setOption(this.pieOptions(dp_data,'店铺ID'));
						//明细
						this.mx_table_data = data.tj_mx.list;
						this.default_mx_table_data = data.tj_mx.list;
						this.mx_max_list = data.tj_mx.max_list;
						this.mx_total_data = data.tj_mx.total_data;

						var _this = this;
						window.addEventListener('resize',() => {
							_this.tj_dayChart.resize();
							_this.xmdlChart.resize();
							_this.xmbChart.resize();
							_this.dpChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//环形图配置
			pieOptions(data,title){
				data.map(item => {
					item.md = item.value.toFixed(2);
				});
				return {
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return title + "：" + params.data.name + '</br>' 
							+ "使用金额：" + params.data.md + '万</br>'
							+ "[使用金额]的总额百分比：" + params.data.value + '%';
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
						radius: ['40%', '70%'],
						label:{
							formatter: (params) => {
								return params.data.name + ':' + params.data.value + '%';
							},
						},
						data: data
					}
					]
				}
			},
			//切换tab
			checkLineTab(e){
				this.activeLineTab = e.name;
				this.$nextTick(() => {
					this.xmdlChart.resize();
					this.xmbChart.resize();
					this.dpChart.resize();
				})
			},
		},
		components:{
			dps
		}
	}
</script>








