<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="批次：">
				<el-select v-model="start_rq" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in branth_list" :key="item.start_rq" :label="item.start_rq" :value="item.start_rq">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="部门：">
				<el-select v-model="select_dept_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in dept_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="季节：">
				<el-select v-model="select_jj_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option label="春" value="春"></el-option>
					<el-option label="夏" value="夏"></el-option>
					<el-option label="秋" value="秋"></el-option>
					<el-option label="冬" value="冬"></el-option>
					<el-option label="四季" value="四季"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="货源：">
				<el-select v-model="hy" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="档口货" value="档口货"></el-option>
					<el-option label="自有货品" value="自有货品"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="top_content">
			<div class="left_content">
				<div class="left_top">
					<el-card>
						<div class="left_top_card">
							<div class="card_label">当前款式数量</div>
							<div class="card_value">{{ksbm_count}}</div>
						</div>
					</el-card>
					<el-card>
						<div class="left_top_card">
							<div class="card_label">当前库存数量</div>
							<div class="card_value">{{now_kc}}</div>
						</div>
					</el-card>
				</div>
				<el-card>
					<div class="left_bottom" id="qczj"></div>
				</el-card>
			</div>
			<el-card class="center_content">
				<div class="qcjd" id="qcjd"></div>
			</el-card>
			<el-card class="right_content">
				<div class="bfb_column" v-if="series_data_funnel.length > 0">
					<div class="bfb_item">{{series_data_funnel[1].conversion}}%</div>
					<div class="bfb_item">{{series_data_funnel[2].conversion}}%</div>
					<div class="bfb_item">{{series_data_funnel[3].conversion}}%</div>
					<div class="bfb_item">{{series_data_funnel[4].conversion}}%</div>
					<div class="bfb_item">{{series_data_funnel[5].conversion}}%</div>
				</div>
				<div class="qcjdzhb" id="qcjdzhb"></div>
			</el-card>
		</div>
		<div class="table_charts_row" v-for="(item,index) in clear_list">
			<div class="analysis_left">
				<div class="title">{{item.name}}</div>
				<el-table :data="item.list" size="small" max-height="300" style="width: 100%" :cell-style="itemStyle">
					<el-table-column prop="name" :label="item.name.split('清仓进度')[0]" fixed show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column label="起始库存" align="center">
						<el-table-column prop="start_count" label="款数" align="center">
						</el-table-column>
						<el-table-column prop="start_kc" label="库存" align="center">
						</el-table-column>
						<el-table-column prop="start_progress" label="进度" align="center">
							<template slot-scope="scope">
								<div>{{scope.row.start_progress}}%</div>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="第一周" align="center">
						<el-table-column prop="one_count" label="款数" align="center">
						</el-table-column>
						<el-table-column prop="one_week" label="库存" align="center">
						</el-table-column>
						<el-table-column prop="one_progress" label="进度" align="center">
							<template slot-scope="scope">
								<div>{{scope.row.one_progress}}%</div>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="第二周" align="center">
						<el-table-column prop="two_count" label="款数" align="center">
						</el-table-column>
						<el-table-column prop="two_week" label="库存" align="center">
						</el-table-column>
						<el-table-column prop="two_progress" label="进度" align="center">
							<template slot-scope="scope">
								<div>{{scope.row.two_progress}}%</div>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="第三周" align="center">
						<el-table-column prop="three_count" label="款数" align="center">
						</el-table-column>
						<el-table-column prop="three_week" label="库存" align="center">
						</el-table-column>
						<el-table-column prop="three_progress" label="进度" align="center">
							<template slot-scope="scope">
								<div>{{scope.row.three_progress}}%</div>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="第四周" align="center">
						<el-table-column prop="four_count" label="款数" align="center">
						</el-table-column>
						<el-table-column prop="four_week" label="库存" align="center">
						</el-table-column>
						<el-table-column prop="four_progress" label="进度" align="center">
							<template slot-scope="scope">
								<div>{{scope.row.four_progress}}%</div>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="当前库存" align="center">
						<el-table-column prop="now_count" label="款数" align="center">
						</el-table-column>
						<el-table-column prop="now_kc" label="库存" align="center">
						</el-table-column>
						<el-table-column prop="now_progress" label="进度" align="center">
							<template slot-scope="scope">
								<div>{{scope.row.now_progress}}%</div>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>
			<div :id="`analysis_${index}_sss`" class="analysis_right"></div>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="批次：">
				<el-select v-model="select_record_branth" :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in branth_list" :key="item.start_rq" :label="item.start_rq" :value="item.start_rq">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchRecord">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="title">清仓进度明细表</div>
			<el-button type="primary" style="margin-bottom: 15px" plain size="small" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="dataObj.data" size="small" max-height="600" :row-class-name="tableRowClassName">
			<el-table-column prop="ksbm" label="款式编码" width="120" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="gyshh" label="供应商款号" width="120" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="cpfl" label="名称" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="pl" label="品牌" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="dept" label="所属部门" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="sjcb" label="审计成本" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="type" label="类型" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="purchase_quantity" label="异常采购数" show-overflow-tooltip width="120" align="center">
			</el-table-column>
			<el-table-column :label="i.time_interval" width="120" v-for="i in clear_date" align="center">
				<el-table-column :prop="i.date_field" width="120" :label="i.sjxrrq" align="center">
				</el-table-column>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="table_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getTableKsbm" collapse-tags>
					<el-option v-for="item in table_ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchTable">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="bottom_row">
			<div class="bottom_left_charts">
				<div class="charts_row">
					<div class="title">异常采购趋势图（总数：<span>{{total_num}}</span>）</div>
				</div>
				<div class="charts_box" id="charts_box"></div>
			</div>
			<div class="bottom_right_table">
				<div class="title">异常采购单</div>
				<el-table :data="tableObj.data" size="small" max-height="420" @sort-change="sortChange">
					<el-table-column prop="ksbm" sortable label="款式编码" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="rq" sortable label="日期" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="po_id" sortable label="采购单号" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="purchaser_name" sortable label="采购人" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="seller" sortable label="供应商" show-overflow-tooltip align="center">
					</el-table-column>
					<el-table-column prop="qty" label="数量" sortable show-overflow-tooltip align="center">
					</el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="tableHandleSizeChange" @current-change="tableHandleCurrentChange" :current-page="yc_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="tableObj.total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return {
				branth_list:[],			//批次列表
				start_rq:[],			//选中的批次列表
				select_record_branth:"",//选中的清仓进度明细批次
				dept_list:[],			//部门列表
				select_dept_ids:[],		//选中的部门列表
				select_jj_ids:[],		//选中的季节
				hy:"",					//选中的货源
				pl_list:[],				//品类列表
				select_pl_ids:[],		//选中的品类列表
				ksbm_count:0,			//当前款式数量
				now_kc:0,				//当前库存数量
				qcjdChart:null,			//清仓进度环形图
				qcjdzhbChart:null,		//清仓进度环比
				series_data_funnel:[],	//清仓进度环比数据
				qczjChart:null,			//清仓，折价趋势图
				clear_list:[],			//清仓汇总-列表
				ks_list:[],				//款式编码列表
				select_ks_ids:[],		//选中的款式编码列表
				page:1,
				pagesize:10,
				dataObj:{},
				clear_date:[],			//列表后面的列
				yc_page:1,
				yc_pagesize:10,			
				sort:"",
				tableObj:{},			//清仓异常（右侧图表）
				table_ks_ids:[],
				table_ks_list:[],	
				chartsBoxChart:null,
				total_num:0
			}
		},
		created(){
			//批次列表
			this.clearBatch();
			//部门列表
			this.getDept();
			//品类列表
			this.getPl();
			//清仓汇总
			this.dynamicAnalysisClear();
			//清仓汇总-清仓，折价趋势图
			this.clearChart();
			//清仓汇总-列表
			this.dynamicAnalysisclearList();
			//清仓异常图表
			this.clearAbnormalChart();
			//清仓汇总-清仓异常列表
			this.clearAbnormal();
		},
		methods:{
			//批次列表
			clearBatch(){
				resource.clearBatch().then(res => {
					if(res.data.code == 1){
						this.branth_list = res.data.data;
						this.select_record_branth = this.branth_list[0].start_rq;
						//获取清仓进度明细
						this.getClearProgress();
						//清仓汇总-清仓日期(列表后面的列)
						this.clearDate();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//部门列表
			getDept(){
				resource.clearDept().then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					resource.ajaxPl().then(res => {
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
			//搜索
			searchFn(){
				//清仓汇总
				this.dynamicAnalysisClear();
				//清仓汇总-清仓，折价趋势图
				this.clearChart();
				//清仓汇总-列表
				this.dynamicAnalysisclearList();
				//获取清仓进度明细
				this.getClearProgress();
				//清仓汇总-清仓日期(列表后面的列)
				this.clearDate();
			},
			//清仓汇总-清仓，折价趋势图
			clearChart(){
				let arg = {
					start_rq:this.start_rq.join(','),
					jj:this.select_jj_ids.join(','),
					hy:this.hy,
					cpfl:this.select_pl_ids.join(','),
					dept:this.select_dept_ids.join(',')
				}
				resource.clearChart(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let data_list = res.data.data;
						var sjxrrq_list = [];
						var discount_list = [];
						var clearance_list = [];
						data_list.map(item => {
							sjxrrq_list.push(item.sjxrrq);
							discount_list.push(item.discount);
							clearance_list.push(item.clearance);
						});
						//折线图配置(清仓，折价趋势图)
						var qczj = document.getElementById('qczj');
						this.qczjChart = echarts.getInstanceByDom(qczj)
						if (this.qczjChart == null) { 
							this.qczjChart = echarts.init(qczj);
						}
						this.qczjChart.setOption(this.setOptionAxis(sjxrrq_list,discount_list,clearance_list));
						window.addEventListener('resize',() => {
							this.qczjChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//折线图配置
			setOptionAxis(sjxrrq_list,discount_list,clearance_list){
				return {
					title: {
						text: '清仓、折价款库存趋势图'
					},
					tooltip: {
						trigger: 'axis',
						formatter: (params) => {
							let tip = "";
							tip += "日期：" + params[0].name  + '</br>'
							+ "清仓数量：" + params[0].value + '件</br>'
							+ "折价数量：" + params[1].value + "件</br>";
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
						top:'25%'
					},
					legend: {
						data: ['清仓','折价'],
						top:"8%",
						left:0
					},
					xAxis: [{
						data: sjxrrq_list,
						axisLabel: {
							color: '#333',
							rotate:70
						}
					}],
					yAxis:[{
						type: 'value',
						name:'库存数量',
						axisLabel: {
							formatter: '{value}件'
						}
					}],
					series:[{
						name:'清仓',
						type:"line",
						data:clearance_list
					},{
						name:'折价',
						type:"line",
						data:discount_list
					}]
				}
			},
			//清仓汇总
			dynamicAnalysisClear(){
				let arg = {
					start_rq:this.start_rq.join(','),
					jj:this.select_jj_ids.join(','),
					hy:this.hy,
					cpfl:this.select_pl_ids.join(','),
					dept:this.select_dept_ids.join(',')
				}
				resource.dynamicAnalysisClear(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let data = res.data.data;
						//当前款式、库存数量
						this.ksbm_count = data.ksbm_count;
						this.now_kc = data.now_kc;
						//清仓进度环形图
						var series_data_pie = [];
						for(let pie_k in data.progress){
							let pieObj = {
								value:0,
								num:0,
								name:""
							}
							if(pie_k == 'now'){
								pieObj.name = "当前库存";
								pieObj.value = data.now_kc;
							}else if(pie_k == 'start'){
								pieObj.name = "起始库存";
								pieObj.value = data.start_kc;
							}else if(pie_k == 'one'){
								pieObj.name = "第一周";
								pieObj.value = data.one_week;
							}else if(pie_k == 'two'){
								pieObj.name = "第二周";
								pieObj.value = data.two_week;
							}else if(pie_k == 'three'){
								pieObj.name = "第三周";
								pieObj.value = data.three_week;
							}else if(pie_k == 'four'){
								pieObj.name = "第四周";
								pieObj.value = data.four_week;
							}
							pieObj.num = data.progress[pie_k];
							series_data_pie.push(pieObj);
						}
						//环形图配置(清仓进度)
						var qcjd = document.getElementById('qcjd');
						this.qcjdChart = echarts.getInstanceByDom(qcjd)
						if (this.qcjdChart == null) { 
							this.qcjdChart = echarts.init(qcjd);
						}
						this.qcjdChart.setOption(this.setOptionsPie('清仓进度',series_data_pie));
						//清仓进度周环比
						this.series_data_funnel = [];
						this.series_data_funnel.push({
							name:"起始库存",
							value:data.start_kc,
						});
						for(let funnel_k in data.rate){
							let funnelObj = {
								name:"",
								value:0,
								arrive:0,
								conversion:0,
							}
							if(funnel_k == 'now'){
								funnelObj.name = "当前库存";
								funnelObj.value = data.now_kc;
							}else if(funnel_k == 'start'){
								funnelObj.name = "起始库存";
								funnelObj.value = data.start_kc;
							}else if(funnel_k == 'one'){
								funnelObj.name = "第一周";
								funnelObj.value = data.one_week;
							}else if(funnel_k == 'two'){
								funnelObj.name = "第二周";
								funnelObj.value = data.two_week;
							}else if(funnel_k == 'three'){
								funnelObj.name = "第三周";
								funnelObj.value = data.three_week;
							}else if(funnel_k == 'four'){
								funnelObj.name = "第四周";
								funnelObj.value = data.four_week;
							}
							funnelObj.arrive = data.rate[funnel_k].arrive;
							funnelObj.conversion = data.rate[funnel_k].conversion;
							this.series_data_funnel.push(funnelObj);
						}
						//筛选最大值的数组
						var sort_list = [];
						this.series_data_funnel.map(item => {
							sort_list.push(item.value);
						});
						let max = Math.max(...sort_list);
						//漏斗图配置(清仓进度环比)
						var qcjdzhb = document.getElementById('qcjdzhb');
						this.qcjdzhbChart = echarts.getInstanceByDom(qcjdzhb)
						if (this.qcjdzhbChart == null) { 
							this.qcjdzhbChart = echarts.init(qcjdzhb);
						}
						this.qcjdzhbChart.setOption(this.setOptionFunnel(max));
						//
						window.addEventListener('resize',() => {
							this.qcjdChart.resize();
							this.qcjdzhbChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//环形图配置
			setOptionsPie(title,series_data_pie){
				return {
					title: {
						text: title
					},
					series: [
					{
						type: 'pie',
						radius: [50, title == ''?100:150],
						center: ['50%', '50%'],
						roseType: 'radius',
						label:{
							position:'inside',
							lineHeight: 18,
							color:'#333333',
							fontWeight:'bold',
							formatter (params) {
								var relVal = params.data.name;
								relVal += '\n' + params.data.value
								+ '\n' + params.data.num + '%';
								return relVal;
							},
						},
						itemStyle: {
							borderRadius: 8
						},
						data: series_data_pie
					}
					]
				}
			},
			//漏斗图配置
			setOptionFunnel(max){
				return {
					title: {
						text: '清仓进度周环比'
					},
					series: [
					{
						name: 'Funnel',
						type: 'funnel',
						width: '80%',
						min: 0,
						max: max,
						minSize: '0%',
						maxSize: '100%',
						sort: 'none',
						gap: 2,
						label:{
							position:'inside',
							lineHeight: 18,
							color:'#333333',
							fontWeight:'bold',
							formatter (params) {
								var relVal = params.data.name;
								relVal += '\n' + params.data.value;
								return relVal;
							},
						},
						data: this.series_data_funnel
					}
					]
				}
			},
			//清仓汇总-列表
			dynamicAnalysisclearList(){
				let arg = {
					start_rq:this.start_rq.join(','),
					jj:this.select_jj_ids.join(','),
					hy:this.hy,
					cpfl:this.select_pl_ids.join(','),
					dept:this.select_dept_ids.join(',')
				}
				resource.dynamicAnalysisclearList(arg).then(res => {
					if(res.data.code == 1){
						this.clear_list = res.data.data;		//表格数据
						var pie_list = [];
						this.clear_list.map((item,index) => {
							var list = [];
							item.list.map(i => {
								i['start_progress'] = i.progress.start;
								i['one_progress'] = i.progress.one;
								i['two_progress'] = i.progress.two;
								i['three_progress'] = i.progress.three;
								i['four_progress'] = i.progress.four;
								i['now_progress'] = i.progress.now;
								var list_item_obj = {};
								for(let k in i){
									if(k.indexOf('now_') > -1){
										list_item_obj[k] = i[k];
									}
									list_item_obj['name'] = i.name;
								}
								list.push(list_item_obj);
							});
							pie_list.push(list)
						});
						var echarts = require("echarts");
						this.$nextTick(() => {
							pie_list.map((item,index) => {
								var analysis_index = document.getElementById(`analysis_${index}_sss`);
								var temporaryChart = echarts.getInstanceByDom(analysis_index)
								if (temporaryChart == null) { 
									temporaryChart = echarts.init(analysis_index);
								}
								item.map(iii => {
									for(let k in iii){
										iii['value'] = iii.now_count;
										iii['num'] = iii.now_progress;
									}
								})
								if(index <= 2){
									temporaryChart.setOption(this.setOptionsPie('',item));
								}else{
									
									let ddd = item.sort(this.compareDown)
									var cate_list = [];
									var num_list = [];
									ddd.map(i => {
										cate_list.push(i.name);
										num_list.push(i.num);
									})
									temporaryChart.setOption(this.setOptionsAxis(cate_list,num_list));
								}
								
							})
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//柱状图排序
			compareDown(v1,v2){
				return v1.num - v2.num;
			},
			// 柱状图配置
			setOptionsAxis(cate_list,num_list){
				return {
					tooltip: {
						trigger: 'axis',
					},
					xAxis: {
						type: 'value'
					},
					grid:{
						left:'20%',
					},
					yAxis: {
						type: 'category',
						data: cate_list
					},
					series: [
					{
						type: 'bar',
						label: {
							show: true,
							color:'#333333',
							position: 'right'
						},
						data: num_list
					},
					]
				}
			},
			//进度单元格背景色
			itemStyle(item){
				if(item.column.property.indexOf('progress') > -1){
					var progress = 0;
					switch(item.columnIndex){
						case 3:
						progress = item.row.start_progress < 20?20:item.row.start_progress > 100?100:item.row.start_progress;
						break;
						case 6:
						progress = item.row.one_progress < 20?20:item.row.one_progress > 100?100:item.row.one_progress;
						break;
						case 9:
						progress = item.row.two_progress < 20?20:item.row.two_progress > 100?100:item.row.two_progress;
						break;
						case 12:
						progress = item.row.three_progress < 20?20:item.row.three_progress > 100?100:item.row.three_progress;
						break;
						case 15:
						progress = item.row.four_progress < 20?20:item.row.four_progress > 100?100:item.row.four_progress;
						break;
						case 18:
						progress = item.row.now_progress < 20?20:item.row.now_progress > 100?100:item.row.now_progress;
						break;
					}
					let opacity = progress/100;
					return 'background: rgba(255,140,0,' + opacity + ');font-weight:bold'; 
				}
			},
			//获取款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//底部款式编码
			getTableKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.table_ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击搜索明细
			searchRecord(){
				this.page = 1;
				//获取清仓进度明细
				this.getClearProgress();
				//清仓汇总-清仓日期(列表后面的列)
				this.clearDate();
			},
			//清仓汇总-清仓日期(列表后面的列)
			clearDate(){
				let arg = {
					start_rq:this.select_record_branth
				}
				resource.clearDate({start_rq:this.select_record_branth}).then(res => {
					if(res.data.code == 1){
						this.clear_date = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取清仓进度明细
			getClearProgress(){
				let arg = {
					start_rq:this.select_record_branth,
					ksbm:this.select_ks_ids.join(','),
					jj:this.select_jj_ids.join(','),
					hy:this.hy,
					cpfl:this.select_pl_ids.join(','),
					dept:this.select_dept_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				resource.clearProgress(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFile(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						start_rq:this.select_record_branth,
						ksbm:this.select_ks_ids.join(','),
						jj:this.select_jj_ids.join(','),
						hy:this.hy,
						cpfl:this.select_pl_ids.join(','),
						dept:this.select_dept_ids.join(',')
					}
					resource.clearProgressExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'清仓进度明细');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//某一行添加颜色
			tableRowClassName({row, rowIndex}) {
				if (rowIndex == 0) {
					return 'total_style';
				}
				return '';
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getClearProgress();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getClearProgress();
			},
			//获取异常数据
			searchTable(){
				this.yc_page = 1;
				this.total_num = 0;
				//清仓汇总-清仓异常
				this.clearAbnormal();
				//清仓异常图表
				this.clearAbnormalChart();
			},
			//清仓异常图表
			clearAbnormalChart(){
				let arg = {
					ksbm:this.table_ks_ids.join(',')
				}
				resource.clearAbnormalChart(arg).then(res => {
					if(res.data.code == 1){
						let x_data = [];
						let series_data = [];
						let chartList = res.data.data.chartList;
						chartList.map(item => {
							x_data.push(item.rq);
							series_data.push(item.qty);
							this.total_num += parseInt(item.qty);
						})
						var echarts = require("echarts");
						var charts_box = document.getElementById('charts_box');
						this.chartsBoxChart = echarts.getInstanceByDom(charts_box)
						if (this.chartsBoxChart == null) { 
							this.chartsBoxChart = echarts.init(charts_box);
						}
						this.chartsBoxChart.setOption(this.setOptionLine(x_data,series_data));
						window.addEventListener('resize',() => {
							this.chartsBoxChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//清仓汇总-清仓异常
			clearAbnormal(){
				let arg = {
					sort:this.sort,
					ksbm:this.table_ks_ids.join(','),
					page:this.yc_page,
					pagesize:this.yc_pagesize
				}
				resource.clearAbnormal(arg).then(res => {
					if(res.data.code == 1){
						this.tableObj = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			
			//底部折线图配置
			setOptionLine(x_data,series_data){
				return {
					xAxis: {
						type: 'category',
						data: x_data,
						axisLabel: {
							color: '#333',
							rotate:50
						}
					},
					yAxis: {
						type: 'value'
					},
					series: [
					{
						data: series_data,
						label:{
							show:true
						},
						type: 'line'
					}
					]
				}
			},
			//排序
			sortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.sort = column.prop + '-' + order;
				}else{
					this.sort = '';
				}
				this.clearAbnormal();
			},
			//分页
			tableHandleSizeChange(val) {
				this.yc_pagesize = val;
				//获取列表
				this.clearAbnormal();
			},
			tableHandleCurrentChange(val) {
				this.yc_page = val;
				//获取列表
				this.clearAbnormal();
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
.top_content{
	width: 100%;
	display:flex;
	.left_content{
		width: 40%;
		.left_top{
			margin-bottom: 10px;
			width: 100%;
			display:flex;
			align-items: center;
			justify-content: space-around;
			.left_top_card{
				display:flex;
				flex-direction: column;
				align-items: center;
				.card_label{
					margin-bottom: 5px;
					font-size: 14px;
					color:#000000;
					font-weight:bold;
				}
				.card_value{
					font-size: 26px;
					color:#27659A;
					font-weight:bold;
				}
			}
		}
		.left_bottom{
			width: 100%;
			height: 300px;
		}
	}
	.center_content{
		margin-left:15px;
		margin-right: 15px;
		width: 35%;
		.qcjd{
			height: 418px;
		}
	}
	.right_content{
		position: relative;
		width: 25%;
		.bfb_column{
			padding-top: 65px;
			position: absolute;
			bottom: 0;
			left: 50px;
			height: 418px;
			.bfb_item{
				line-height: 50px;
				color:#666666;
				font-size: 14px;
			}
		}
		.qcjdzhb{
			height: 418px;
		}
	}
}
.table_charts_row{
	margin-top: 15px;
	width: 100%;
	display: flex;
	.analysis_left{
		flex:1;
		width: 100px;
	}
	.analysis_right{
		margin-left: 15px;
		width: 360px;
		height: 360px;
	}
}
.title{
	margin-bottom: 15px;
	font-size: 16px;
	font-weight: bold;
	span{
		color:rgba(255,140,0,1);
		font-size:20px;
	}
}
.buts{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.bottom_row{
	margin-top: 15px;
	display:flex;
	.bottom_left_charts{
		margin-right: 15px;
		width: 45%;
		height: 500px;
		.charts_row{
			height: 30px;
			width: 100%;
			display:flex;
			align-items: center;
		}
		.charts_box{
			height: 470px;
			width: 100%;
		}
	}
	.bottom_right_table{
		width: 55%;
		height: 500px;
	}
}
</style>