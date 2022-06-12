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
					<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
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
			<div :id="`analysis_${index}`" class="analysis_right"></div>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return {
				branth_list:[],			//批次列表
				start_rq:[],			//选中的批次列表
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
		},
		methods:{
			//批次列表
			clearBatch(){
				resource.clearBatch().then(res => {
					if(res.data.code == 1){
						this.branth_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//部门列表
			getDept(){
				if(this.$store.state.dept_list.length == 0){  
					resource.ajaxViewDept().then(res => {
						if(res.data.code == 1){
							this.dept_list = res.data.data;
							this.$store.commit('setDeptList',this.dept_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.dept_list = this.$store.state.dept_list;
				}
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

			},
			//清仓汇总-清仓，折价趋势图
			clearChart(){
				resource.clearChart().then(res => {
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
				resource.dynamicAnalysisClear().then(res => {
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
								pieObj.num = data.now_kc;
							}else if(pie_k == 'start'){
								pieObj.name = "起始库存";
								pieObj.num = data.start_kc;
							}else if(pie_k == 'one'){
								pieObj.name = "第一周";
								pieObj.num = data.one_week;
							}else if(pie_k == 'two'){
								pieObj.name = "第二周";
								pieObj.num = data.two_week;
							}else if(pie_k == 'three'){
								pieObj.name = "第三周";
								pieObj.num = data.three_week;
							}else if(pie_k == 'four'){
								pieObj.name = "第四周";
								pieObj.num = data.four_week;
							}
							pieObj.value = data.progress[pie_k];
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
						radius: [50, 200],
						center: ['50%', '50%'],
						roseType: 'area',
						label:{
							position:'inside',
							lineHeight: 18,
							color:'#333333',
							fontWeight:'bold',
							formatter (params) {
								var relVal = params.data.name;
								relVal += '\n' + params.data.num
								+ '\n' + params.data.value + '%';
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
						// left: '10%',
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
				resource.dynamicAnalysisclearList().then(res => {
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
								var analysis_index = document.getElementById(`analysis_${index}`);
								var temporaryChart = echarts.getInstanceByDom(analysis_index)
								if (temporaryChart == null) { 
									temporaryChart = echarts.init(analysis_index);
								}
								item.map(iii => {
									for(let k in iii){
										iii['num'] = iii.now_count;
										iii['value'] = iii.now_progress;
									}
								})
								temporaryChart.setOption(this.setOptionsPie('',item));
							})
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			}
		}
	}
</script>
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
		.title{
			margin-bottom: 15px;
			font-size: 16px;
			font-weight: bold;
		}
	}
	.analysis_right{
		width: 360px;
		height: 360px;
	}
}
</style>