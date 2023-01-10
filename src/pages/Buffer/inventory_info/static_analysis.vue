<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="自有货品：">
				<el-select v-model="select_sfzzk_id" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option label="CHRISUNO" value="CHRISUNO"></el-option>
					<el-option label="白坯" value="白坯"></el-option>
					<el-option label="自主款" value="自主款"></el-option>
					<el-option label="海外" value="海外"></el-option>
					<el-option label="VASCO" value="VASCO"></el-option>
					<el-option label="得物" value="得物"></el-option>
					<el-option label="其他" value="其他"></el-option>
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
			<el-form-item label="所在仓库：">
				<el-select v-model="selected_ckwz_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option :label="item.ckwz" :value="item.ckwz" v-for="item in ckwz_list" :key="item.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="select_pp_list" clearable :popper-append-to-body="false" multiple filterable reserve-keyword placeholder="请选择品牌" collapse-tags>
					<el-option v-for="item in pp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="性别：">
				<el-select v-model="select_xb_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
					<el-option label="通用" value="通用"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="库存日期：">
				<el-date-picker v-model="date" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="是否可退：">
				<el-select v-model="is_retreat" placeholder="请选择">
					<el-option label="不可退" value="不可退"></el-option>
					<el-option label="可退" value="可退"></el-option>
					<el-option label="待核实" value="待核实"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="标签：">
				<el-input size="mini" v-model="labels" placeholder="标签"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 页面左侧 -->
		<div v-loading="analysis_row_loading">
			<div class="analysis_row" v-for="(item,index) in tableData">
				<div class="analysis_left">
					<div class="title">{{item.name}}库存分析</div>
					<el-table :data="item.list" size="mini" max-height="300">
						<el-table-column prop="name" :label="item.name" fixed show-overflow-tooltip align="center">
							<template slot-scope="scope">
								<div>{{scope.row.name == null?'-':scope.row.name}}</div>
							</template>
						</el-table-column>
						<el-table-column :label="i" v-for="i in date_list" align="center">
							<el-table-column :prop="`sl_total_${i}`" label="数量" align="center">
							</el-table-column>
							<el-table-column :prop="`cbj_total_${i}`" label="总成本额" align="center">
								<template slot-scope="scope">
									<div>{{scope.row[`cbj_total_${i}`]}}万</div>
								</template>
							</el-table-column>
							<el-table-column :prop="`cb_rate_${i}`" label="成本占比" align="center">
								<template slot-scope="scope">
									<div>{{scope.row[`cb_rate_${i}`]}}%</div>
								</template>
							</el-table-column>
							<el-table-column :prop="`year_rate_${i}`" label="年同比(成本)" align="center">
								<template slot-scope="scope">
									<div v-if="scope.row[`year_rate_${i}`] == '-'">{{scope.row[`year_rate_${i}`]}}</div>
									<div style="color:red" v-if="scope.row[`year_rate_${i}`] >= 0">{{scope.row[`year_rate_${i}`]}}%</div>
									<div style="color:green" v-if="scope.row[`year_rate_${i}`] < 0">{{scope.row[`year_rate_${i}`]}}%</div>
								</template>
							</el-table-column>
						</el-table-column>
					</el-table>
				</div>
				<div :id="`analysis_${index}_eee`" class="analysis_right"></div>
			</div>
		</div>
		<!-- 右上（近一年库存/成本趋势图） -->
		<div class="kc_cb">
			<div id="kc_cb_chart" class="kc_cb_chart" v-loading="kc_cb_chart_loading"></div>
			<div class="number_box" v-loading="kc_cb_chart_loading">
				<div class="number_row">
					<div class="label">款数</div>
					<div class="right">
						<div class="val">{{mom.ksbm_count}}</div>
						<div class="hb">环比</div>
						<i class="el-icon-caret-top" style="color: red" v-if="mom.ksbm_rate >= 0"></i>
						<i class="el-icon-caret-bottom" style="color: green" v-else></i>
						<div class="bfb" :class="{'bfb_j':mom.ksbm_rate < 0}">{{mom.ksbm_rate}}%</div>
					</div>
				</div>
				<div class="number_row">
					<div class="label">库存</div>
					<div class="right">
						<div class="val">{{mom.sl_total}}</div>
						<div class="hb">环比</div>
						<i class="el-icon-caret-top" style="color: red" v-if="mom.sl_rate >= 0"></i>
						<i class="el-icon-caret-bottom" style="color: green" v-else></i>
						<div class="bfb" :class="{'bfb_j':mom.sl_rate < 0}">{{mom.sl_rate}}%</div>
					</div>
				</div>
				<div class="number_row">
					<div class="label">成本</div>
					<div class="right">
						<div class="val">{{mom.cbj_total}}万</div>
						<div class="hb">环比</div>
						<i class="el-icon-caret-top" style="color: red" v-if="mom.cbj_rate >= 0"></i>
						<i class="el-icon-caret-bottom" style="color: green" v-else></i>
						<div class="bfb" :class="{'bfb_j':mom.cbj_rate < 0}">{{mom.cbj_rate}}%</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 表格 -->
		<div class="title">款式库存数量</div>
		<div class="toast">总成本：{{cbj_total}}万</div>
		<div class="buts">
			<el-button type="primary" size="small" @click="show_dialog = true">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column prop="sjxrrq" label="日期" sortable width="120" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="图片" width="120" align="center">
				<template slot-scope="scope">
					<img style="width: 80px;height: 80px" :src="scope.row.tp" @click="bigImg(scope.row.tp)">
				</template>
			</el-table-column>
			<el-table-column prop="ksbm" label="款式编码" sortable width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gys" label="供应商" sortable width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gyshh" label="供应商货号" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="is_retreat" label="是否可退" width="100" align="center"></el-table-column>
			<el-table-column prop="plbz" label="标签" width="100" align="center">
				<template slot-scope="scope">
					<el-input size="mini" v-model="scope.row.labels" placeholder="标签" @change="tagEdit({ksbm:scope.row.ksbm,labels:scope.row.labels})"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="plbz" label="货品" sortable width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="pl" label="品牌" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="xb" label="性别" sortable show-overflow-tooltip width="120" align="center">
			</el-table-column>
			<el-table-column prop="cpfl" label="品类" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="jj" label="季节" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="sjcb" label="审计成本" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.sjcb !== null">{{scope.row.sjcb}}元</div>
				</template>
			</el-table-column>
			<el-table-column prop="sl" label="数量" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="cbj_total" label="总成本" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>{{scope.row.cbj_total}}万</div>
				</template>
			</el-table-column>
			<el-table-column prop="ckwz" label="所在仓库" sortable show-overflow-tooltip align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 图片放大 -->
		<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
			<img style="width: 100%" :src="big_img_url">
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imageDialog = false">关闭</el-button>
			</span>
		</el-dialog>
		<!-- 导入 -->
		<el-dialog title="导入" :visible.sync="show_dialog" width="30%">
			<div class="down_box">
				<el-button type="primary" plain size="small" @click="downTemplate">下载模版<i class="el-icon-download el-icon--right"></i></el-button>
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="show_dialog = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import {getNowDate,getLastYear} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				select_sfzzk_id:[],		//选中的自有货品
				select_jj_ids:[],		//选中的季节
				ckwz_list:[],			//仓库位置列表
				selected_ckwz_list:[],	//选中的仓库位置列表
				pp_list:[],				//品牌列表
				select_pp_list:[],		//选中的品牌列表
				ks_list:[],				//款式编码列表
				select_ks_ids:[],		//选中的款式编码列表
				pl_list:[],				//品类列表
				select_pl_ids:[],		//选中的品类列表
				select_xb_id:"",		//选中的性别	
				date:getNowDate(),		//库存日期
				is_retreat:"",			//是否可退
				labels:"",				//标签
				date_list:[getLastYear(2),getLastYear(1),getLastYear(0)],	//年份列表
				tableData:[],			//库存分析（页面左侧部分）
				kcCbChart:null,			//近一年库存/成本趋势图表
				mom:{},					//右上角百分比
				dataObj:{},				//表格数据
				sort:"",
				page:1,
				pagesize:10,			
				imageDialog:false,		//图片放大弹窗
				big_img_url:"",			//图片地址
				dpChart:null,
				cbj_total:0,			//总成本
				analysis_row_loading:false,
				kc_cb_chart_loading:false,
				loading:false,
				show_dialog:false,


			}
		},
		created(){
			//获取仓库位置列表
			this.getCkwz();
			//库存分析（页面左侧部分）
			this.stockAnalysis();
			//款式分析（页面右上部分）
			this.stockAnalysisKs();
			//品类列表
			this.getPl();
			//品牌列表
			this.ajaxPp();
			//款式列表
			this.stockAnalysisKsList();
		},
		methods:{
			//获取仓库位置列表
			getCkwz(){
				resource.getCkwz().then(res => {
					if(res.data.code == 1){
						this.ckwz_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品牌列表
			ajaxPp(){
				resource.ajaxPp().then(res => {
					if(res.data.code == 1){
						this.pp_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式编码
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
				this.page = 1;
				//库存分析（页面左侧部分）
				this.stockAnalysis();
				//款式列表
				this.stockAnalysisKsList();
			},
			//库存分析（页面左侧部分）
			stockAnalysis(){
				let arg = {
					start_time:this.date,
					plbz:this.select_sfzzk_id.join(','),
					jj:this.select_jj_ids.join(','),
					ckwz:this.selected_ckwz_list.join(','),
					pl:this.select_pp_list.join(','),
					ksbm:this.select_ks_ids.join(','),
					xb:this.select_xb_id,
					cpfl:this.select_pl_ids.join(','),
					is_retreat:this.is_retreat,
					labels:this.labels
				}
				this.analysis_row_loading = true;
				resource.stockAnalysis(arg).then(res => {
					if(res.data.code == 1){
						this.analysis_row_loading = false;
						var echarts = require("echarts");
						this.tableData = res.data.data;
						var gg = [];
						this.tableData.map(item => {
							var dd = [];
							item.list.map((list_item,index) => {
								var obj = {};
								if(index > 0){
									for(var k in list_item){
										if(k.indexOf(this.date.split('-')[0]) > -1){
											obj[k] = list_item[k];
										}
										obj.name = list_item.name;
									}
								}
								dd.push(obj);
							});
							dd.splice(0,1);
							gg.push(dd);
						})
						this.$nextTick(() => {
							gg.map((item,index) => {
								var dp = document.getElementById(`analysis_${index}_eee`);
								var dpChart = echarts.getInstanceByDom(dp)
								if (dpChart == null) { 
									dpChart = echarts.init(dp);
								}
								item.map(iii => {
									for(var k in iii){
										if(k.indexOf('cb_rate') > -1){
											iii['value'] = iii[k];
										}
									}
								})
								dpChart.setOption(this.pieOptions(item));
							})
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//环形图配置
			pieOptions(data){
				console.log(data)
				return {
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return params.data.name + '</br>' 
							+ "总成本：" + params.data[`cbj_total_${this.date.split('-')[0]}`] + '万</br>'
							+ "数量：" + params.data[`sl_total_${this.date.split('-')[0]}`] + '</br>'
							+ "[总成本]的总额百分比：" + params.data[`cb_rate_${this.date.split('-')[0]}`] + '%';
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
								return params.data.name;
							},
						},
						data: data
					}
					]
				}
			},
			//款式分析（页面右上部分）
			stockAnalysisKs(){
				this.kc_cb_chart_loading = true;
				resource.stockAnalysisKs().then(res => {
					if(res.data.code == 1){
						this.kc_cb_chart_loading = false;
						var echarts = require("echarts");
						//图表数据
						var chart_data = res.data.data.list;
						var x_data = [];	//x轴日期
						var number_data = [];	//库存数量
						var total_data = [];	//总成本额
						chart_data.map(item => {
							x_data.push(item.sjxrrq);
							number_data.push(item.sl_total);
							total_data.push(item.cbj_total);
						});
						var kc_cb_chart = document.getElementById('kc_cb_chart');
						this.kcCbChart = echarts.getInstanceByDom(kc_cb_chart)
						if (this.kcCbChart == null) { 
							this.kcCbChart = echarts.init(kc_cb_chart);
						}
						this.kcCbChart.setOption(this.setOptions(x_data,number_data,total_data));
						window.addEventListener('resize',() => {
							this.kcCbChart.resize();
						});
						//百分比
						this.mom = res.data.data.mom;
						this.mom.ksbm_count = chart_data[chart_data.length - 1].ksbm_count;
						this.mom.sl_total = chart_data[chart_data.length - 1].sl_total_origin;
						this.mom.cbj_total = chart_data[chart_data.length - 1].cbj_total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//设置图表
			setOptions(x_data,number_data,total_data){
				return {
					title: {
						text: '近一年库存/成本趋势图'
					},
					tooltip: {
						trigger: 'axis',
						formatter: function (params) {
							let dataIndex = params[params.length - 1].dataIndex;
							let date = x_data[dataIndex];
							let number_data_txt = number_data[dataIndex];
							let total_data_txt = total_data[dataIndex];
							let tip = "";
							if(params != null && params.length > 0) {
								tip = date + "</br>"
								+ "库存：" + number_data_txt + "万</br>"
								+ "总成本额：" + total_data_txt + "万";
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
					color:['#FB0008','#81CA17'],
					legend: {
						data: ['库存','总成本额']
					},
					xAxis: [{
						type: 'category',
						data: x_data,
					}],
					yAxis:[{
						type: 'value',
						name:'库存',
						axisLabel: {
							formatter: '{value}万'
						}
					},{
						type: 'value',
						name:'总成本额',
						axisLabel: {
							formatter: '{value}万'
						}
					}],
					series: [{
						name: "库存",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						yAxisIndex:0,
						data: number_data
					},{
						name: "总成本额",
						type: 'line',
						emphasis: {
							focus: 'series'
						},
						yAxisIndex:1,
						data: total_data
					}]
				}
			},
        	//款式列表
        	stockAnalysisKsList(){
        		let arg = {
        			start_time:this.date,
        			plbz:this.select_sfzzk_id.join(','),
        			jj:this.select_jj_ids.join(','),
        			ckwz:this.selected_ckwz_list.join(','),
        			pl:this.select_pp_list.join(','),
        			ksbm:this.select_ks_ids.join(','),
        			xb:this.select_xb_id,
        			cpfl:this.select_pl_ids.join(','),
        			is_retreat:this.is_retreat,
        			labels:this.labels,
        			page:this.page,
        			pagesize:this.pagesize
        		}
        		if(this.sort != ''){
        			arg.sort = this.sort;
        		}
        		this.loading = true;
        		resource.stockAnalysisKsList(arg).then(res => {
        			if(res.data.code == 1){
        				this.loading = false;
        				this.dataObj = res.data.data.list;
        				this.cbj_total = res.data.data.cbj_total;
        			}else{
        				this.$message.warning(res.data.msg);
        			}
        		})
        	},
        	//修改标签
        	tagEdit(arg){
        		resource.editLabels(arg).then(res => {
        			if(res.data.code == 1){
        				this.$message.success(res.data.msg);
        			}else{
        				this.$message.warning(res.data.msg);
        			}
        		})
        	},
        	//排序
        	sortChange(column){
        		if(column.order){
        			let order = column.order == 'ascending'?'asc':'desc';
        			this.sort = column.prop + '-' + order;
        		}else{
        			this.sort = '';
        		}
        		this.stockAnalysisKsList();
        	},
        	//下载模版
        	downTemplate(){
        		window.open(`${this.downLoadUrl}/静态库存分析_款式标签导入模板.xlsx`);
        	},
        	//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.importLabels({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						this.show_dialog = false;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.stockAnalysisKsList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
        	//导出
        	commitExport(){
        		MessageBox.confirm('确认导出?', '提示', {
        			confirmButtonText: '确定',
        			cancelButtonText: '取消',
        			type: 'warning'
        		}).then(() => {
        			let arg = {
        				start_time:this.date,
        				plbz:this.select_sfzzk_id.join(','),
        				jj:this.select_jj_ids.join(','),
        				ckwz:this.selected_ckwz_list.join(','),
        				pl:this.select_pp_list.join(','),
        				ksbm:this.select_ks_ids.join(','),
        				xb:this.select_xb_id,
        				cpfl:this.select_pl_ids.join(','),
        				is_retreat:this.is_retreat,
        				labels:this.labels
        			}
        			if(this.sort != ''){
        				arg.sort = this.sort;
        			}
        			resource.stockAnalysisKsExprot(arg).then(res => {
        				if(res){
        					exportPost("\ufeff" + res.data,'款式库存数量');
        				}
        			})
        		}).catch(() => {
        			Message({
        				type: 'info',
        				message: '取消导出'
        			});          
        		});
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
				this.stockAnalysisKsList();
			},
        	//图片放大
        	bigImg(big_img_url){
        		this.imageDialog = true;
        		this.big_img_url = big_img_url;
        	},
        }
    }
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 5px;
	display: flex;
	justify-content: flex-end;
}
.analysis_row{
	width: 100%;
	display: flex;
	.analysis_left{
		flex:1;
	}
	.analysis_right{
		width: 360px;
		height: 360px;
	}
}
.kc_cb{
	margin-top: 15px;
	width: 100%;
	display: flex;
	.kc_cb_chart{
		flex: 1;
		height: 320px;
	}
	.number_box{
		width: 280px;
		height: 260px;
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		padding-left: 15px;
		.number_row{
			display:flex;
			align-items: center;
			justify-content: space-between;
			.label{
				font-size: 18px;
				font-weight: bold;
			}
			.right{
				display:flex;
				align-items: center;
				.val{
					font-size: 16px;
					font-weight: bold;
					color:#FE9333;
				}
				.hb{
					margin-left: 5px;
					margin-right: 5px;
					font-size: 14px;
					color: #999999;
				}
				.bfb{
					font-size: 14px;
					color: red;
					font-weight: bold;
				}
				.bfb_j{
					color: green;
				}
			}
		}
	}
}
.title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-size: 16px;
	font-weight: bold;
}
.toast{
	margin-bottom: 15px;
	font-size: 14px;
	color:red;
}
.down_box{
	display:flex;
	.upload_box{
		margin-left: 10px;
		position: relative;
		.upload_file{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
}
</style>
















