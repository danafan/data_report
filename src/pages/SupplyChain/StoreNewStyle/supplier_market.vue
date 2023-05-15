<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="项目部：">
				<el-cascader
				size="mini"
				class="input_cascader"
				ref="cascader"
				:options="dept_list"
				:props="props"
				filterable
				@change="getIds"
				@remove-tag="getIds"
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="创建时间:">
				<el-date-picker v-model="date" :clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 档口/外采折线图 -->
		<div class="line_chart" id="hy_chart" v-loading="hy_loading"></div>
		<!-- 档口/外采交叉图 -->
		<PopoverWidget class="mb-10" title="市场款式上新数据" :show_popover="false"/>
		<el-table class="mb-10" border :data="hy_table" size="small" max-height="320" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="columnStyle" v-loading="hy_table_loading">
			<el-table-column :label="item.label" :prop="item.prop" align="center" v-for="(item,index) in hy_title_list" :fixed="index == 0">
			</el-table-column>
		</el-table>
		<!-- 近30天事业部上新折线图 -->
		<div class="line_chart" id="dept_chart" v-loading="dept_loading"></div>
		<!-- 近30天事业部上新交叉图 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget class="mb-10" title="近30天事业部上新交叉图" :show_popover="false"/>
			<el-button type="primary" plain size="small" @click="customExport('dept')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table class="mb-10" :data="dept_table" size="small" max-height="320" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="twoColumnStyle" :span-method="deptSpanMethod" v-loading="dept_table_loading">
			<el-table-column :label="item.label" :prop="item.prop" align="center" v-for="(item,index) in dept_title_list" :fixed="index == 0 || index == 1">
				<template slot-scope="scope">
					<div>{{scope.row[item.prop]}}</div>
				</template>
				<el-table-column :label="i.label" :prop="i.prop" align="center" width="90" v-for="(i,i_index) in item.list">
					<template slot-scope="scope">
						<div>{{scope.row[i.prop]}}</div>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 店铺上新折线图 -->
		<div class="line_chart" id="shop_chart" v-loading="shop_loading"></div>
		<!-- 店铺上新交叉图 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="店铺上新交叉图" :show_popover="false"/>
			<el-button type="primary" plain size="small" @click="customExport('shop')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table class="mb-10" :data="shop_table" size="small" max-height="320" :header-cell-style="{'background':'#F6BD16','color':'#333333'}" :cell-style="twoColumnStyle" @cell-click="cellClick" :span-method="shopSpanMethod" v-loading="shop_table_loading">
			<el-table-column :label="item.label" :prop="item.prop" :width="index == 0?140:''" align="center" v-for="(item,index) in shop_title_list" :index="index" :fixed="index == 0 || index == 1">
				<template slot-scope="scope">
					<div>{{scope.row[item.prop]}}</div>
				</template>
				<el-table-column :label="i.label" :prop="i.prop" align="center" width="90" v-for="(i,i_index) in item.list">
					<template slot-scope="scope">
						<div>{{scope.row[i.prop]}}</div>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 明细数据 -->
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="明细数据" :show_popover="false"/>
			<el-button type="primary" plain size="small" @click="exportFn" :loading="detail_loading">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="detail_loading" :isLoading="detail_loading" tableName="market_detail" max_height="360" :table_data="detail_table_data" :title_list="detail_title_list" :is_custom_sort="false" @sortCallBack="sortCallBack" />
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import {lastXDate,getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate,getEveryDay} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	import {exportPost,exportExcel} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import PopoverWidget from '../../../components/popover_widget'
	import CustomTable from '../../../components/custom_table'
	import PageWidget from '../../../components/pagination_widget'
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
				},	 										
				date:[lastXDate(7),lastXDate(1)],			//时间区间
				dept_list:[],								//部门列表
				area_list:[],								//供应商地址列表
				area_ids:[],								//选中的供应商地址列表
				select_dept_ids:[],							//选中的部门列表
				props:{
					multiple:true,
					value:'dept_id',
					label:'dept_name',
					children:'list',
				},
				store_list: [],								//店铺列表	
				select_store_ids:[],						//选中的店铺列表
				table_date_list:[],							//表格日期列表
				hyChart:null,								//档口/外采折线图
				hy_loading:false,							//档口/外采折线图加载
				hy_title_list:[{
					label:'市场款式上新',
					prop:'hy_name'
				},{
					label:'近7天',
					prop:'seven_days_num'
				},{
					label:'近7天上款率',
					prop:'seven_days_zb'
				},{
					label:'近30天',
					prop:'thirty_days_num'
				},{
					label:'近30天上款率',
					prop:'thirty_days_zb'
				}],											//档口/外采交叉图表头
				hy_table:[],								//档口/外采交叉图数据
				hy_table_loading:false,						//档口/外采交叉图加载
				deptChart:null,								//近30天事业部上新折线图
				dept_loading:false,							//近30天事业部上新折线图加载
				dept_title_list:[{
					label:'事业部',
					prop:'name'
				},{
					label:'类型',
					prop:'hy_name'
				}],											//近30天事业部上新交叉图表头
				dept_table:[],								//近30天事业部上新交叉图数据
				dept_table_loading:false,					//近30天事业部上新交叉图加载
				shopChart:null,								//店铺上新折线图
				shop_loading:false,							//店铺上新折线图加载
				shop_title_list:[{
					label:'店铺',
					prop:'name'
				},{
					label:'类型',
					prop:'hy_name'
				}],											//店铺上新交叉图表头
				shop_table:[],								//店铺上新交叉图数据
				shop_table_loading:false,					//店铺上新交叉图加载
				detail_loading:false,						//明细数据加载
				shop_id:"",
				detail_title_list:[],						//明细数据表格头部
				detail_table_data:[],						//明细数据列表
				total:0,
				page:1,
				pagesize:10,
				sort:''
			}
		},
		watch:{
			activeTab:function(n,o){
				if(n == 'supplier_market'){
					if(this.hyChart){
						this.hyChart.resize();
					}
					if(this.deptChart){
						this.deptChart.resize();
					}
					if(this.shopChart){
						this.shopChart.resize();
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
			//部门列表
			this.getDept();
			// 获取所有店铺
			this.getStoreList();
			//点击搜索
			this.searchFn(true);
		},
		methods:{
			//一列背景色
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0){
					return 'background: #F6BD16;color:#333333';
				}
			},
			//两列背景色
			twoColumnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0 || columnIndex == 1){
					return 'background: #F6BD16;color:#333333';
				}
			},
			//事业部合并单元格
			deptSpanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0) {
					const _row = this.flitterData(this.dept_table).one[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col,
					};
				}
			},
			//店铺合并单元格
			shopSpanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0) {
					const _row = this.flitterData(this.shop_table).one[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col,
					};
				}
			},
			/**合并表格的第一列，处理表格数据 */
			flitterData(arr) {
				let spanOneArr = [];
				let concatOne = 0;
				arr.forEach((item, index) => {
					if (index === 0) {
						spanOneArr.push(1);
					} else {
					    //注意这里的quarterly是表格绑定的字段，根据自己的需求来改
						if (item.name === arr[index - 1].name) {
					        //第一列需合并相同内容的判断条件
							spanOneArr[concatOne] += 1;
							spanOneArr.push(0);
						} else {
							spanOneArr.push(1);
							concatOne = index;
						}
					}
				});
				return {
					one: spanOneArr,
				};
			},
			//部门列表
			getDept(){
				if(this.$store.state.dept_list.length == 0){  
					resource.ajaxViewDept({from:1}).then(res => {
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
			//切换部门
			getIds(){
				this.$nextTick(()=>{
					var arr = [];
					var select_department = this.$refs.cascader.getCheckedNodes({leafOnly:true});
					select_department.map(s => {
						if(!!s.parent){	//最后一层有父级
							var m = s.parent;
							if(!!m.checked){ //倒数第二层被全选了
								if(!!m.parent){ //倒数第二层有父级
									var d = m.parent;
									if(!!d.checked){ //倒数第三层被全选了
										if(arr.indexOf(d.value) == -1){
											arr.push(d.value);
										}
									}else{
										if(arr.indexOf(m.value) == -1){
											arr.push(m.value);
										}
									}
								}else{
									if(arr.indexOf(m.value) == -1){
										arr.push(m.value);
									}
								}
							}else{
								arr.push(s.value);
							}
						}else{	//只有一层
							arr.push(s.value);
						}
					})
					this.select_dept_ids = arr;
					//店铺列表
					this.getStoreList();
				});
			},
			// 获取所有店铺
			getStoreList(){
				this.select_store_ids = [];
				let dept_id = this.select_dept_ids.join(',');
				resource.ajaxViewStore({dept_id:dept_id}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			async searchFn(is_all){
				this.shop_id = "";
				this.table_date_list = getEveryDay(this.date[0],this.date[1]).reverse();
				if(is_all === true){
					this.hy_loading = true;
					this.dept_loading = true;
					this.shop_loading = true;
					this.hy_table_loading = true;
					this.dept_table_loading = true;
					this.shop_table_loading = true;
					this.detail_loading = true;
					//档口，外采-折线图
					await this.hyLineChart();
					//档口，外采-交叉图
					await this.hyCrossplot();
					//近30天事业部上新折线图
					await this.deptLineChart();
					//近30天事业部上新交叉图
					await this.deptCrossplot();
					//店铺上新折线图
					await this.shopLineChart();
					//店铺上新交叉图
					await this.shopCrossplot();
					//明细数据
					await this.kssxList();
				}else{
					this.hy_table_loading = true;
					this.dept_table_loading = true;
					this.shop_table_loading = true;
					this.detail_loading = true;
					//档口，外采-交叉图
					await this.hyCrossplot();
					//近30天事业部上新交叉图
					await this.deptCrossplot();
					//店铺上新交叉图
					await this.shopCrossplot();
					//明细数据
					this.page = 1;
					this.pagesize = 10;
					this.sort = '';
					await this.kssxList();
				}
			},
			//档口/外采-折线图
			hyLineChart(){
				this.hy_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxLineChart({type:'hy'}).then(res => {
						resolve();
						if(res.data.code == 1){
							this.hy_loading = false;
							var echarts = require("echarts");
							let data = res.data.data;
							let series_data = [];
							let legend_data = [];
							data.list.map(item => {
								legend_data.push(item.hy_name)
								let series_data_arr = [];
								let num_arr = [];
								let zb_arr = [];
								for(let k in item){
									if(k.indexOf('num') > -1){
										num_arr.push(item[k]);
									}
									if(k.indexOf('zb') > -1){
										zb_arr.push(item[k]);
									}
								}
								num_arr.map((item,index)=> {
									let series_item = {
										value:item,
										zb:zb_arr[index]
									}
									series_data_arr.push(series_item)
								})
								let chart_item = {
									name: item.hy_name,
									type: 'line',
									data: series_data_arr
								}
								series_data.push(chart_item)
							})
							var hy_chart = document.getElementById('hy_chart');
							this.hyChart = echarts.getInstanceByDom(hy_chart)
							if (this.hyChart == null) { 
								this.hyChart = echarts.init(hy_chart);
							}
							this.hyChart.setOption(this.setLineOptions('档口/外采折线图',data.day_list,series_data,legend_data,'hy'));
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//近30天事业部上新折线图
			deptLineChart(){
				this.dept_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxLineChart({type:'dept'}).then(res => {
						resolve();
						if(res.data.code == 1){
							this.dept_loading = false;
							var echarts = require("echarts");
							let data = res.data.data;
							let series_data = [];
							let legend_data = [];
							data.list.map(item => {
								legend_data.push(item.name)
								let series_data_arr = [];
								for(let k in item){
									if(k.indexOf('num') > -1){
										series_data_arr.push(item[k]);
									}
								}
								let chart_item = {
									name: item.name,
									type: 'line',
									data: series_data_arr
								}
								series_data.push(chart_item)
							})
							var dept_chart = document.getElementById('dept_chart');
							this.deptChart = echarts.getInstanceByDom(dept_chart)
							if (this.deptChart == null) { 
								this.deptChart = echarts.init(dept_chart);
							}
							this.deptChart.setOption(this.setLineOptions('近30天事业部上新折线图',data.day_list,series_data,legend_data,'dept'));
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//店铺上新折线图
			shopLineChart(){
				this.shop_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxLineChart({type:'ppg'}).then(res => {
						resolve();
						if(res.data.code == 1){
							this.shop_loading = false;
							var echarts = require("echarts");
							let data = res.data.data;
							let series_data = [];
							let legend_data = [];
							data.list[0].list.map(item => {
								legend_data.push(item.name)
								let series_data_arr = [];
								let num_arr = [];
								let zb_arr = [];
								for(let k in item){
									if(k.indexOf('num') > -1){
										num_arr.push(item[k]);
									}
									if(k.indexOf('zb') > -1){
										zb_arr.push(item[k]);
									}
								}
								num_arr.map((item,index)=> {
									let series_item = {
										value:item,
										zb:zb_arr[index],
										name:data.list[0].name
									}
									series_data_arr.push(series_item)
								})
								let chart_item = {
									name: item.hy_name,
									type: 'line',
									data: series_data_arr
								}
								series_data.push(chart_item)
							})
							var shop_chart = document.getElementById('shop_chart');
							this.shopChart = echarts.getInstanceByDom(shop_chart)
							if (this.shopChart == null) { 
								this.shopChart = echarts.init(shop_chart);
							}
							this.shopChart.setOption(this.setLineOptions('店铺档口/外采折线图',data.day_list,series_data,legend_data,'shop'));
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//折线图渲染
			setLineOptions(title,x_axis,series_data,legend,type){
				return {
					title:{
						text:title
					},
					legend:{
						data:legend
					},
					tooltip: {
					    // 提示框组件
						trigger: 'axis', 
						position:'top',
						formatter:  (params) => {
							if(type == 'hy'){
								let tip = `${params[0].name}</br>`;
								params.map(item => {
									tip += `${item.seriesName}上新数量：${item.data.value}</br>
									${item.seriesName}占比：${item.data.zb}</br>`;
								})
								return tip;
							}else if(type == 'dept'){
								let tip = `${params[0].name}</br>`;
								params.map(item => {
									tip += `${item.seriesName}：${item.value}</br>`;
								})
								return tip;
							}else if(type == 'shop'){
								let tip = `${params[0].data.name}</br>
								${params[0].axisValue}</br>`;
								params.map(item => {
									tip += `${item.seriesName}上新数量：${item.data.value}</br>
									${item.seriesName}占比：${item.data.zb}</br>`;
								})
								return tip
							}
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
						left: '3%',
						top: '18%',
						right:'3%',
						bottom:'10%'
					},
					xAxis: {
						type: 'category',
						data: x_axis,
						name:'日期'
					},
					yAxis: {
						name:'上新数量',
						type: 'value',
					},
					series: series_data
				}
			},
			//档口/外采-交叉图
			hyCrossplot(){
				let arg = {
					type:'hy',
					shop_id:this.select_store_ids.join(','),
					dept_id:this.select_dept_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
				}
				this.hy_table_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxCrossplot(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.hy_table_loading = false;
							this.hy_title_list = [{
								label:'市场款式上新',
								prop:'hy_name'
							},{
								label:'近7天',
								prop:'seven_days_num'
							},{
								label:'近7天上款率',
								prop:'seven_days_zb'
							},{
								label:'近30天',
								prop:'thirty_days_num'
							},{
								label:'近30天上款率',
								prop:'thirty_days_zb'
							}];
							let new_arr = [];
							this.table_date_list.map(item => {
								let title_item = {
									label:item,
									prop:`${item}_num`
								}
								new_arr.push(title_item)
							})
							new_arr.unshift(1, 0); 
							Array.prototype.splice.apply(this.hy_title_list, new_arr); 
							this.hy_table = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//近30天事业部上新交叉图
			deptCrossplot(){
				let arg = {
					type:'dept',
					shop_id:this.select_store_ids.join(','),
					dept_id:this.select_dept_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
				}
				this.dept_table_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxCrossplot(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.dept_table_loading = false;
							let data = res.data.data;

							this.dept_title_list = [{
								label:'事业部',
								prop:'name'
							},{
								label:'类型',
								prop:'hy_name'
							}];
							this.table_date_list.map(item => {
								let title_item = {
									label:item,
									prop:'',
									list:[{
										label:'款数',
										prop:`${item}_num`,
									},{
										label:'占比',
										prop:`${item}_zb`,
									}]
								}
								this.dept_title_list.push(title_item)
							})
							this.dept_table = [];
							data.map(item => {
								item.list.map(i => {
									i['name'] = item.name;
									this.dept_table.push(i);
								})
							})
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//店铺上新交叉图
			shopCrossplot(){
				let arg = {
					type:'ppg',
					shop_id:this.select_store_ids.join(','),
					dept_id:this.select_dept_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
				}
				this.shop_table_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxCrossplot(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.shop_table_loading = false;
							let data = res.data.data;

							this.shop_title_list = [{
								label:'店铺',
								prop:'name'
							},{
								label:'类型',
								prop:'hy_name'
							}];
							this.table_date_list.map(item => {
								let title_item = {
									label:item,
									prop:'',
									list:[{
										label:'款数',
										prop:`${item}_num`,
									},{
										label:'占比',
										prop:`${item}_zb`,
									}]
								}
								this.shop_title_list.push(title_item)
							})
							this.shop_table = [];
							data.map(item => {
								item.list.map(i => {
									i['name'] = item.name;
									i['shop_id'] = item.shop_id;
									this.shop_table.push(i);
								})
							})
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//点击店铺上新交叉图某个店铺
			cellClick(row, column, cell, event){
				if(column.index == 0){
					this.shop_id = row.shop_id;
					//明细数据
					this.kssxList();
				}
			},
			//明细数据
			kssxList(){
				if(this.shop_id != ''){
					this.page = 1;
					this.sort = '';
				}
				let arg = {
					shop_id:this.shop_id?this.shop_id:this.select_store_ids.join(','),
					dept_id:this.select_dept_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				this.detail_loading = true;
				return new Promise((resolve)=>{
					demandResource.kssxList(arg).then(res => {
						resolve();
						if(res.data.code == 1){
							this.detail_loading = false;
							let data = res.data.data;
							this.detail_title_list = data.title_list;
							this.detail_table_data = data.table_data.data;
							this.total = data.table_data.total;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//post导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						shop_id:this.select_store_ids.join(','),
						dept_id:this.select_dept_ids.join(','),
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
						sort:this.sort
					}
					demandResource.kssxExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'明细数据');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//排序回调
			sortCallBack(sort){
				this.sort = sort;
				//获取列表
				this.kssxList();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.kssxList();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.kssxList();
			},
			//自定义导出
			customExport(type){
				if(type == 'shop'){
					let multiHeader = ['店铺','类型'];
					let tHeader = ['店铺','类型'];
					let field_name_list = ['name','hy_name'];
					this.table_date_list.map(item => {
						multiHeader = [...multiHeader,...[item,item]];
						tHeader.push('款数');
						tHeader.push('占比');
						field_name_list.push(`${item}_num`);
						field_name_list.push(`${item}_zb`);
					})
					var data_obj = {
						multiHeader:multiHeader, //这里是第一行的表头
				        header: tHeader, //这里应该是算第二行的表头
				        field_name_list:field_name_list,
				        data_list:this.shop_table,//数据
				        filename: "店铺上新交叉图",
				    };
				    exportExcel(data_obj,true);
				}else{
					let multiHeader = ['事业部','类型'];
					let tHeader = ['事业部','类型'];
					let field_name_list = ['name','hy_name'];
					this.table_date_list.map(item => {
						multiHeader = [...multiHeader,...[item,item]];
						tHeader.push('款数');
						tHeader.push('占比');
						field_name_list.push(`${item}_num`);
						field_name_list.push(`${item}_zb`);
					})
					var data_obj = {
						multiHeader:multiHeader, //这里是第一行的表头
				        header: tHeader, //这里应该是算第二行的表头
				        field_name_list:field_name_list,
				        data_list:this.dept_table,//数据
				        filename: "事业部上新交叉图",
				    };
				    exportExcel(data_obj,true);
				}
			}
		},
		components:{
			PopoverWidget,
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>
	.line_chart{
		width: 100%;
		height: 320px;
	}
</style>














