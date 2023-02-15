<template>
	<div>
		<div class="table_row">
			<div style="width: 49%">
				<div class="jsb">
					<PopoverWidget title="库存分布情况" keys="kcfx_kcfbqk"/>
					<el-button type="text" size="mini">&nbsp</el-button>
				</div>
				<div class="tree" id="tree" style="width: 100%" v-loading="chart_loading"></div>
			</div>
			<div style="width: 49%">
				<div class="jsb">
					<PopoverWidget title="公司库存占比情况" keys="kcfx_gskczbqk"/>
					<el-button type="text" size="mini" @click="clearGs">清空</el-button>
				</div>
				<el-table :data="gs_data" size="small" border max-height="500px" :header-cell-style="{'background':'#3467B8','color':'#ffffff'}"  :cell-style="columnStyle" :row-class-name="gsRowStyle" :span-method="gsSpanMethod" v-loading="gs_loading" @cell-click="gsCellClick">
					<el-table-column prop="name" show-overflow-tooltip label="公司" align="center"></el-table-column>
					<el-table-column prop="is_retreat" label="是否可退" align="center"></el-table-column>
					<el-table-column prop="count" show-overflow-tooltip label="款数" align="center"></el-table-column>
					<el-table-column prop="kc" show-overflow-tooltip label="库存" align="center"></el-table-column>
					<el-table-column prop="rate" label="百分比" align="center">
						<template slot-scope="scope">
							<div>{{scope.row.rate}}%</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="table_row margin_top">
			<div style="width: 49%" >
				<div class="jsb">
					<PopoverWidget title="事业部库存占比情况" keys="kcfx_sybkczbqk"/>
					<el-button type="text" size="mini" @click="clearSyb">清空</el-button>
				</div>
				<el-table :data="syb_data" size="small" border max-height="500" :header-cell-style="{'background':'#3467B8','color':'#ffffff'}" :cell-style="columnStyle" :row-class-name="rowStyle" :span-method="spanMethod" v-loading="syb_loading" @cell-click="cellClick">
					<el-table-column prop="name" show-overflow-tooltip label="事业部" align="center"></el-table-column>
					<el-table-column prop="is_retreat" label="是否可退" align="center"></el-table-column>
					<el-table-column prop="count" show-overflow-tooltip label="款数" align="center"></el-table-column>
					<el-table-column prop="kc" show-overflow-tooltip label="库存" align="center"></el-table-column>
					<el-table-column prop="rate" label="百分比" align="center">
						<template slot-scope="scope">
							<div>{{scope.row.rate}}%</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div style="width: 49%">
				<div class="jsb">
					<PopoverWidget title="商品标签库存占比情况" keys="kcfx_spbqkczbqk"/>
					<el-button type="text" size="mini" @click="clearSpbq">清空</el-button>
				</div>
				<el-table :data="spbq_data" size="small" border max-height="500px" :header-cell-style="{'background':'#3467B8','color':'#ffffff'}"  :cell-style="columnStyle" :row-class-name="spbqRowStyle" :span-method="spbqSpanMethod" v-loading="spbq_loading" @cell-click="spbqCellClick">
					<el-table-column prop="name" show-overflow-tooltip label="商品标签" align="center"></el-table-column>
					<el-table-column prop="is_retreat" label="是否可退" align="center"></el-table-column>
					<el-table-column prop="count" show-overflow-tooltip label="款数" align="center"></el-table-column>
					<el-table-column prop="kc" show-overflow-tooltip label="库存" align="center"></el-table-column>
					<el-table-column prop="rate" label="百分比" align="center">
						<template slot-scope="scope">
							<div>{{scope.row.rate}}%</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline margin_top">
			<el-form-item label="供应商分类：">
				<el-select v-model="gys_cate_ids" clearable filterable multiple reserve-keyword placeholder="全部">
					<el-option v-for="item in gys_cate_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-input v-model="gys_ids" clearable placeholder="请输入供应商"></el-input>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-input v-model="gyshh" clearable placeholder="请输入供应商货号"></el-input>
			</el-form-item>
			<el-form-item label="供应商等级：">
				<el-select v-model="gys_level_ids" clearable filterable multiple reserve-keyword placeholder="全部">
					<el-option v-for="item in gys_level_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-input v-model="select_ks_ids" clearable placeholder="请输入款式编码"></el-input>
			</el-form-item>
			<el-form-item label="主卖店铺：">
				<el-select v-model="main_dp_ids" style="width:240px" clearable multiple filterable remote reserve-keyword placeholder="全部" :remote-method="getMainDp" collapse-tags>
					<el-option v-for="item in main_dp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="cpfl_ids" clearable multiple filterable remote reserve-keyword placeholder="全部" :remote-method="getCpfl" collapse-tags>
					<el-option v-for="item in cpfl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否内供：">
				<el-select v-model="is_supply_ids" clearable multiple filterable remote reserve-keyword placeholder="全部" collapse-tags>
					<el-option v-for="item in is_supply_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="结算方式：">
				<el-select v-model="jsfs_ids" clearable multiple filterable remote reserve-keyword placeholder="全部" collapse-tags>
					<el-option v-for="item in jsfs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input v-model="remarks" clearable placeholder="请输入备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="jsb">
			<PopoverWidget title="明细表" keys="kcfx_mxb"/>
			<div style="display: flex">
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
				</div>
				<el-button type="primary" size="mini" @click="allEdit" :disabled="selected_list.length == 0 && !is_all">批量编辑</el-button>
				<el-button type="primary" size="mini" @click="show_custom = true">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="commitExport" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<!-- 明细表 -->
		<el-table size="small" ref="table" :data="detail_data" border style="width: 100%" max-height='680' :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="detail_loading" @selection-change="changeSelected" @header-dragend="secondChange">
			<el-table-column type="selection" width="50" align="center" fixed="left" :selectable="selectableFn">
			</el-table-column>
			<el-table-column :index="index" :label="item.row_name" :prop="item.row_field_name" :width="item.width" align="center" v-for="(item,index) in column_list" :sortable="item.is_sort === 1?'custom':false" show-overflow-tooltip>
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
						<div class="text_style">{{item.row_name}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<!-- 备注 -->
					<el-input v-if="item.type=='6'" size="mini" v-model="scope.row.remarks" placeholder="请输入备注" :disabled="button_list.edit === 0" @change="confirmEdit({id:scope.row.id,edit_remark:scope.row.remarks})"></el-input>
					<!-- 修改主卖店铺 -->
					<el-select v-else-if="item.type=='7'" :class="{'main_dp':scope.row.status == 1}" size="mini" v-model="scope.row.main_dp1" filterable placeholder="全部" @change="confirmEdit({id:scope.row.id,edit_main_dp1:scope.row.main_dp1})">
						<el-option v-for="i in store_list" :key="i.shop_name" :label="i.shop_name" :value="i.shop_name">
						</el-option>
					</el-select>
					<!-- 普通文字 -->
					<div class='text_style' v-else>{{scope.row[item.row_field_name]}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="mini" v-if="button_list.edit == 1" @click="openEdit(scope.row.id,scope.row.is_retreat,scope.row.goods_label,scope.row.is_supply,scope.row.gys_type)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="bottom_page">
			<el-checkbox v-model="is_all">全选所有</el-checkbox>
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 编辑 -->
		<el-dialog title="编辑" size="mini" width="40%" :visible.sync="edit_dialog" @close="closeEdit">
			<el-form size="mini">
				<el-form-item label="供应商分类：">
					<el-select v-model="gys_type" placeholder="请选择">
						<el-option v-for="item in gys_cate_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否可退：">
					<el-select v-model="edit_retreat" placeholder="请选择">
						<el-option label="不可退" value="不可退"></el-option>
						<el-option label="可退" value="可退"></el-option>
						<el-option label="待核实" value="待核实"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否支持内供：">
					<el-select v-model="is_supply" placeholder="请选择">
						<el-option label="是" value="是"></el-option>
						<el-option label="否" value="否"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品标签">
					<el-input style="width: 200px" v-model="edit_goods_label" placeholder="请输入商品标签"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="edit_dialog = false">取 消</el-button>
				<el-button size="mini" type="primary" @click="okFn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 自定义列表 -->
		<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
			<div class="select_box">
				<el-checkbox-group v-model="row_ids">
					<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_rows">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="mini" @click="Restore">恢复默认</el-button>
				<el-button size="mini" @click="show_custom = false">取消</el-button>
				<el-button size="mini" type="primary" @click="setColumns">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/operationResource.js'
	import commonResource from '../../../api/resource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		components:{
			PopoverWidget
		},
		data(){
			return{
				treeChart:null,
				chart_loading:false,
				gs_data:[],					//公司占比
				gs_loading:false,			//公司库存占比情况加载
				gs_current_cell:"",			//公司当前点击的单元格类型
				syb_data:[],				//事业部库存占比情况
				syb_loading:false,			//事业部库存占比情况加载
				syb_current_cell:"",		//事业部当前点击的单元格类型
				spbq_data:[],				//商品标签列表
				spbq_loading:false,			//商品标签情况加载
				spbq_current_cell:"",		//商品标签当前点击的单元格类型
				gys_cate_list:[],			//供应商分类列表
				gys_cate_ids:[],			//选中的供应商分类
				gys_ids:"",					//输入的供应商
				gyshh:"",					//供应商货号
				remarks:"",					//备注
				gys_level_list:[],			//供应商等级列表
				gys_level_ids:[],			//选中的供应商等级
				select_ks_ids:"",			//选中的款式编码
				company_name:"",			//当前选中的公司
				gs_is_retreat:"",			//当前选中的公司是否可退
				dept_name:"",				//当前选中的事业部
				syb_is_retreat:"",			//当前选中的事业部是否可退
				goods_label:"",				//当前选中的商品标签
				spbq_is_retreat:"",			//当前选中的商品标签是否可退
				is_retreat:"",				//当前选中的是否可退
				main_dp_list:[],			//主卖店铺列表
				main_dp_ids:[],				//选中的主卖店铺
				cpfl_list:[],				//品类列表
				cpfl_ids:[],				//选中的品类列表
				is_supply_list:[],			//是否内供
				is_supply_ids:[],			//选中的是否内供
				jsfs_list:[],				//结算方式列表
				jsfs_ids:[],				//选中的结算方式
				sort:"",
				page:1,
				pagesize:10,
				detail_data:[],				//明细列表
				button_list:{},
				total:0,
				detail_loading:false,		
				store_list:[],				//店铺列表
				column_list:[],
				view_rows:[],
				row_ids:[],
				table_id:"",
				edit_id:"",
				edit_dialog:false,
				edit_type:'1',				//编辑类型（1:批量；2:单个）
				id:"",
				gys_type:"",				//供应商分类
				edit_retreat:"",			//是否可退
				is_supply:"",				//是否内供
				edit_goods_label:"",		//商品标签
				show_custom:false,			//自定义弹窗
				selected_list:[],			//已勾选的列表
				is_all:false,				//是否全选
			}
		},
		created(){
			//公司占比
			let gs_arg = {
				type:'company'
			}
			this.stockRate(gs_arg);
			//事业部占比
			let syb_arg = {
				type:'dept_name'
			}
			this.stockRate(syb_arg);
			//商品标签占比
			let spbq_arg = {
				type:'goods_label'
			}
			// 获取所有店铺
			this.getStoreList();
			this.stockRate(spbq_arg);
			//明细表
			this.stockDetail();
			//供应商分类
			this.getSearchList({type:'gys_type'});
			//供应商等级
			this.getSearchList({type:'gys_level'});
			//是否内供
			this.getSearchList({type:'is_supply'});
			//结算方式
			this.getSearchList({type:'jsfs'});
		},
		mounted(){
			//库存分布情况图表
			this.getCharts();
		},
		watch:{
			is_all:function(n,o){
				if(n != o){
					this.$refs.table.toggleAllSelection();
				}
			}
		},
		methods:{
			// 库存分布情况图表
			getCharts(){
				this.chart_loading = true;
				resource.distriBution().then(res => {
					if(res.data.code == 1){
						this.chart_loading = false;
						let data = res.data.data;
						data.sort(function(a,b){
							if(parseFloat(a.kc)<parseFloat(b.kc)){
								return 1
							}
							if(parseFloat(a.kc)>parseFloat(b.kc)){
								return -1
							}
							if(parseFloat(a.kc)==parseFloat(b.kc)){
								return 0
							}
						})
						data.map(item => {
							item['value'] = item.kc
						})

						let new_data = this.sortArr(data, 'name');
						var series_data = [];
						new_data.map(item => {
							let item_name = "";
							let item_value = 0;
							let item_children = [];
							item.map((ii,index) => {
								item_name = ii.name;
								item_value += parseFloat(ii.value);
								if(index == 0){
									ii['show_tag'] = true;
								}
								item_children.push(ii)
							})
							let series_item = {
								name:item_name,
								value:item_value,
								children:item_children
							}
							series_data.push(series_item)
						})


						var echarts = require("echarts");
						var tree_chart = document.getElementById('tree');
						this.treeChart = echarts.getInstanceByDom(tree_chart)
						if (this.treeChart) { 
							this.treeChart.clear();
						}
						this.treeChart = echarts.init(tree_chart);
						this.treeChart.setOption(this.setOptions(series_data));
						window.addEventListener('resize',() => {
							this.treeChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 图表渲染
			setOptions(series_data){
				return {
					tooltip: {
						trigger: 'item',
						formatter: function (params) {
							let data = params.data;
							let tip = "";
							if(!!params) {
								tip = '事业部：' + data.name + "</br>"
								+'是否可退：' + data.is_retreat + "</br>"
								+'库存：' + data.value + "</br>"
								+'库存占总额百分比：' + data.rate + "%";
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
					series: [
					{
						type: 'treemap',
						roam:false,
						nodeClick:false,
						breadcrumb:{
							show:false
						},
						itemStyle:{
							gapWidth: 1
						},
						left:0,
						top:0,
						right:0,
						bottom:0,
						label:{
							show:true,
							lineHeight:20,
							color:"#333333",
							fontSize:14,
							fontWeight:'bold',
							formatter: function (params) {
								let data = params.data;
								let tip = "";
								if(!!params && data.show_tag) {
									tip = data.name + "\n"
									+data.is_retreat + "\n"
									+data.value + "\n"
									+data.rate + "%";
								}
								return tip;
							},
						},
						data: series_data
					}
					]
				}
			},
			sortArr(arr, str) {
				var _arr = [],
				_t = [],
        		// 临时的变量
        		_tmp;

    			// 按照特定的参数将数组排序将具有相同值得排在一起
    			arr = arr.sort(function(a, b) {
    				var s = a[str],
    				t = b[str];

    				return s < t ? -1 : 1;
    			});

    			if ( arr.length ){
    				_tmp = arr[0][str];
    			}
    			// 将相同类别的对象添加到统一个数组
    			for (var i in arr) {
    				if ( arr[i][str] === _tmp ){
    					_t.push( arr[i] );
    				} else {
    					_tmp = arr[i][str];
    					_arr.push( _t );
    					_t = [arr[i]];
    				}
    			}
    			// 将最后的内容推出新数组
    			_arr.push( _t );
    			return _arr;
    		},
			//库存占比
			stockRate(arg){
				if(arg.type == 'company'){		//公司占比
					this.gs_loading = true;
				}else if(arg.type == 'dept_name'){	//事业部占比
					this.syb_loading = true;
				}else{								//商品标签占比
					this.spbq_loading = true;
				}
				resource.stockRate(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						if(arg.type == 'company'){	//公司占比
							this.gs_loading = false;
							this.gs_data = data;
						}else if(arg.type == 'dept_name'){	//事业部占比
							this.syb_loading = false;
							this.syb_data = data;
						}else{							//商品标签占比
							this.spbq_loading = false;
							this.spbq_data = data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(columnIndex == 0 || columnIndex == 1){
					return 'background: #3467B8;color:#ffffff';
				}
			},
			//公司合并单元格
			gsSpanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0) {
					const _row = this.filterData(this.gs_data, columnIndex).one[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col,
					}
				}
			},
			//事业部合并单元格
			spanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0) {
					const _row = this.filterData(this.syb_data, columnIndex).one[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col,
					}
				}
			},
			//商品标签合并单元格
			spbqSpanMethod({ row, column, rowIndex, columnIndex }){
				if (columnIndex === 0) {
					const _row = this.filterData(this.spbq_data, columnIndex).one[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col,
					}
				}
			},
			filterData(arr, colIndex) {
				let spanOneArr = [];
				let concatOne = 0;
				arr.forEach((item, index) => {
					if (index == 0) {
						spanOneArr.push(1);
					} else {
						if (colIndex == 0) {
							if (item.name === arr[index - 1].name) {
								spanOneArr[concatOne] += 1;
								spanOneArr.push(0);
							} else {
								spanOneArr.push(1);  
								concatOne = index;
							}
						} else {
							if (item.classify === arr[index - 1].classify) {
								spanOneArr[concatOne] += 1;
								spanOneArr.push(0);
							} else {
								spanOneArr.push(1);  
								concatOne = index;
							} 
						}
					}
				});
				return {
					one: spanOneArr,
				};
			},
			//公司单元格点击
			gsCellClick(row, column, cell, event){
				if(row.name == '总计' || (column.property != "is_retreat" && column.property != "name")){
					return;
				}
				this.gs_current_cell = column.property;	//点击的单元格类型
				this.company_name = row.name;
				this.is_retreat = column.property == "is_retreat"?row.is_retreat:'';
				this.gs_is_retreat = column.property == "is_retreat"?row.is_retreat:'';
				this.dept_name = "";
				this.goods_label = "";
				this.page = 1;
				//事业部占比
				let syb_arg = {
					type:'dept_name',
					company:this.company_name,
					is_retreat:this.is_retreat
				}
				this.stockRate(syb_arg);
				//商品标签占比
				let spbq_arg = {
					type:'goods_label',
					company:this.company_name,
					dept_name:this.dept_name,
					is_retreat:this.is_retreat
				}
				this.stockRate(spbq_arg);
				//明细表
				this.stockDetail();
			},
			//公司清空
			clearGs(){
				this.company_name = '';
				this.dept_name = '';
				this.goods_label = "";
				this.is_retreat = '';
				this.page = 1;
				//事业部占比
				let syb_arg = {
					type:'dept_name',
					company:this.company_name,
					is_retreat:this.is_retreat
				}
				this.stockRate(syb_arg);
				//商品标签占比
				let spbq_arg = {
					type:'goods_label',
					company:this.company_name,
					dept_name:this.dept_name,
					is_retreat:this.is_retreat
				}
				this.stockRate(spbq_arg);
				//明细表
				this.stockDetail();
			},
			//公司高亮当前行
			gsRowStyle({ row }) {
				if(this.gs_current_cell == 'name'){
					if (row.name == this.company_name) {
						return "row_style";
					}
				}else if(this.gs_current_cell == 'is_retreat'){
					if (row.name == this.company_name && row.is_retreat == this.gs_is_retreat) {
						return "row_style";
					}
				}
			},
			//事业部单元格点击
			cellClick(row, column, cell, event){
				if(row.name == '总计' || (column.property != "is_retreat" && column.property != "name")){
					return;
				}
				this.syb_current_cell = column.property;	//点击的单元格类型
				this.dept_name = row.name;
				this.syb_is_retreat = column.property == "is_retreat"?row.is_retreat:'';
				if(column.property == "is_retreat"){
					this.is_retreat = row.is_retreat;
				}else{
					this.is_retreat = this.gs_is_retreat;
				}
				this.goods_label = "";
				this.page = 1;
				let arg = {
					type:'goods_label',
					company:this.company_name,
					dept_name:this.dept_name,
					is_retreat:this.is_retreat
				}
				//商品标签占比
				this.stockRate(arg);
				//明细表
				this.stockDetail();
			},
			//事业部清空
			clearSyb(){
				this.dept_name = '';
				this.goods_label = "";
				this.is_retreat = this.gs_is_retreat;
				this.syb_is_retreat = this.gs_is_retreat
				this.page = 1;
				let arg = {
					type:'goods_label',
					company:this.company_name,
					dept_name:this.dept_name,
					is_retreat:this.is_retreat
				}
				//商品标签占比
				this.stockRate(arg);
				//明细表
				this.stockDetail();
			},
			//事业部高亮当前行
			rowStyle({ row }) {
				if(this.syb_current_cell == 'name'){
					if (row.name == this.dept_name) {
						return "row_style";
					}
				}else if(this.syb_current_cell == 'is_retreat'){
					if (row.name == this.dept_name && row.is_retreat == this.syb_is_retreat) {
						return "row_style";
					}
				}
			},
			//商品标签单元格点击
			spbqCellClick(row, column, cell, event){
				if(row.name == '总计' || (column.property != "is_retreat" && column.property != "name")){
					return;
				}
				this.spbq_current_cell = column.property;	//点击的单元格类型
				this.goods_label = row.name;
				this.spbq_is_retreat = column.property == "is_retreat"?row.is_retreat:'';
				this.page = 1;
				if(column.property == "is_retreat"){
					this.is_retreat = row.is_retreat;
				}
				//明细表
				this.stockDetail();
			},
			//商品标签清空
			clearSpbq(){
				this.goods_label = '';
				if(this.gs_is_retreat != ''){
					this.is_retreat = this.gs_is_retreat;
				}else if(this.syb_is_retreat != ''){
					this.is_retreat = this.syb_is_retreat;
				}else{
					this.is_retreat = '';
				}
				this.page = 1;
				//明细表
				this.stockDetail();
			},
			//商品标签高亮当前行
			spbqRowStyle({ row }) {
				if(this.spbq_current_cell == 'name'){
					if (row.name == this.goods_label) {
						return "row_style";
					}
				}else if(this.spbq_current_cell == 'is_retreat'){
					if (row.name == this.goods_label && row.is_retreat == this.spbq_is_retreat) {
						return "row_style";
					}
				}
			},
			// 获取所有店铺
			getStoreList(){
				commonResource.ajaxViewStore({from:1}).then(res => {
					if(res.data.code == 1){
						let store_list = res.data.data;
						let obj = {
							shop_name:'全公司'
						}
						store_list.unshift(obj);
						this.store_list = store_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//主卖店铺
			getMainDp(e){
				this.getSearchList({type:'main_dp',keyword:e});
			},
			//品类
			getCpfl(e){
				this.getSearchList({type:'cpfl',keyword:e});
			},
			//供应商
			getGys(e){
				this.getSearchList({type:'gys',keyword:e});
			},
			//获取搜索条件
			getSearchList(arg){
				resource.stockSelect(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						switch(arg.type){
							case 'main_dp':
							this.main_dp_list = data.main_dp;
							break;
							case 'cpfl':
							this.cpfl_list = data.cpfl;
							break;
							case 'is_supply':
							this.is_supply_list = data.is_supply;
							break;
							case 'jsfs':
							this.jsfs_list = data.jsfs;
							break;
							case 'gys_type':
							this.gys_cate_list = data.gys_type;
							break;
							case 'gys_level':
							this.gys_level_list = data.gys_level;
							break;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.importData({file:files[0],flag:1}).then(res => {
						if(res.data.code == 1){
							// 提交导入
							this.importFile(files[0]);
						}else if(res.data.code == 2){
							//弹窗提示
							MessageBox.confirm(`${res.data.msg},继续导出?`, '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								// 提交导入
								this.importFile(files[0]);
							}).catch(() => {
								Message({
									type: 'info',
									message: '取消导出'
								});          
							});
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			// 提交导入
			importFile(file){
				resource.importData({file:file,flag:2}).then(res => {
					this.$refs.csvUpload.value = null;
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.page = 1;
						//获取列表
						this.stockDetail();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//明细表
			stockDetail(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					company:this.company_name,
					dept_name:this.dept_name,
					goods_label:this.goods_label,
					is_retreat:this.is_retreat,
					gys_type:this.gys_cate_ids.join(','),
					gys:this.gys_ids,
					gyshh:this.gyshh,
					remarks:this.remarks,
					gys_level:this.gys_level_ids.join(','),
					ksbm:this.select_ks_ids,
					main_dp:this.main_dp_ids.join(','),
					cpfl:this.cpfl_ids.join(','),
					is_supply:this.is_supply_ids.join(','),
					jsfs:this.jsfs_ids.join(','),
					sort:this.sort
				}
				this.detail_loading = true;
				resource.stockDetail(arg).then(res => {
					if(res.data.code == 1){
						this.detail_loading = false;
						let data = res.data.data;
						this.detail_data = data.data;
						this.total = data.total;
						this.button_list = data.button_list;
						this.table_id = data.table_setting.table_id;
						var title_list = data.title_list;
						if(data.table_setting.setting){
							this.edit_id = data.table_setting.edit_id;
							let setting_arr = data.table_setting.setting.split(',');
							title_list.map(iii => {
								let arr = setting_arr.filter(item => {
									return iii.row_field_name == item.split('-')[0]
								})
								iii.width = arr.length > 0?arr[0].split('-')[1]:'100';
							})
							this.column_list = title_list;
						}else{
							title_list.map(iii => {
								iii.width = '80';
							})
							this.column_list = title_list;
						}
						this.view_rows = data.view_rows;
						this.row_ids = data.selected_ids;
						if(this.is_all){
							this.$refs.table.toggleAllSelection();
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			selectableFn(row,index){
				return !this.is_all;
			},
			//恢复默认
			Restore(){
				this.row_ids = [];
				this.view_rows.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			//设置自定义列
			setColumns(){
				commonResource.setColumns({menu_id:'152',row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.stockDetail();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						company:this.company_name,
						dept_name:this.dept_name,
						goods_label:this.goods_label,
						is_retreat:this.is_retreat,
						gys_type:this.gys_cate_ids.join(','),
						gys:this.gys_ids,
						gyshh:this.gyshh,
						remarks:this.remarks,
						gys_level:this.gys_level_ids.join(','),
						ksbm:this.select_ks_ids,
						main_dp:this.main_dp_ids.join(','),
						cpfl:this.cpfl_ids.join(','),
						is_supply:this.is_supply_ids.join(','),
						jsfs:this.jsfs_ids.join(','),
						sort:this.sort
					}
					resource.exportDetail(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'库存分析明细');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//明细表表列宽修改
			secondChange(newWidth, oldWidth, column, event){
				let index = column.index;
				this.column_list[index].width = newWidth;
				let arr = [];
				this.column_list.map(item => {
					let str = item.row_field_name + '-' + item.width;
					arr.push(str);
				})
				let arg = {
					table_id:this.table_id,
					setting:arr.join(','),
				}
				if(this.edit_id){
					arg.id = this.edit_id;
				}
				//修改宽度
				this.changeWidth(arg)
			},
			//修改宽度
			changeWidth(arg){
				commonResource.tableSetting(arg).then(res => {
					if(res.data.code != 1){
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.stockDetail();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.stockDetail();
			},
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				} else{
					this.sort = "";
				}   
				this.stockDetail();
			},
			//切换选中
			changeSelected(val) {
				this.selected_list = val;
			},
			//点击批量编辑
			allEdit(){
				this.edit_type = '1';
				this.edit_dialog = true;
			},
			//点击编辑
			openEdit(id,is_retreat,goods_label,is_supply,gys_type){
				this.edit_type = '2';
				this.id = id;
				this.edit_retreat = is_retreat;
				this.edit_goods_label = goods_label;
				this.is_supply = is_supply;
				this.gys_type = gys_type;
				this.edit_dialog = true;
			},
			//关闭编辑
			closeEdit(){
				this.edit_retreat = '';
				this.edit_goods_label = '';
				this.is_supply = '';
				this.gys_type = '';
			},
			//确认编辑
			okFn(){
				let arg = {
					edit_is_retreat:this.edit_retreat,
					edit_goods_label:this.edit_goods_label,
					edit_is_supply:this.is_supply,
					edit_gys_type:this.gys_type
				}
				if(this.edit_type == '1'){		//批量
					arg.is_all = this.is_all?1:0;
					if(!this.is_all){
						let ids = this.selected_list.map(item => {
							return item.id;
						})
						arg.id = ids.join(',');
					}else{
						arg.company = this.company_name;
						arg.dept_name = this.dept_name;
						arg.goods_label = this.goods_label;
						arg.is_retreat = this.is_retreat;
						arg.gys_type = this.gys_cate_ids.join(',');
						arg.gys = this.gys_ids;
						arg.gyshh = this.gyshh;
						arg.remarks = this.remarks;
						arg.gys_level = this.gys_level_ids.join(',');
						arg.ksbm = this.select_ks_ids;
						arg.main_dp = this.main_dp_ids.join(',');
						arg.cpfl = this.cpfl_ids.join(',');
						arg.is_supply = this.is_supply_ids.join(',');
						arg.jsfs = this.jsfs_ids.join(',');
					}
					if(this.edit_retreat != '' ||this.edit_goods_label != '' || this.is_supply != '' || this.gys_type != ''){
						//提交编辑
						this.confirmEdit(arg);
					}else{
						this.$message.warning('至少输入一个编辑项！');
					}
				}else{				//单个
					arg.id = this.id;
					//提交编辑
					this.confirmEdit(arg);
				}
			},
			//提交编辑
			confirmEdit(arg){
				resource.stockEdit(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.edit_dialog = false;
						//明细表
						this.stockDetail();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>
<style type="text/css">
.el-table th>.cell{
	display: flex!important;
	align-items: center!important;
	justify-content: center!important;
}
.row_style{
	background: #3467B8!important;
	color:#ffffff!important;
}
.main_dp .el-input__inner{
	border:none!important;
	background: #F7BD47!important;
}
</style>
<style lang="less" scoped>
.table_row{
	display: flex;
	justify-content:space-between;
	.tree{
		height: 480px;
	}
}
.margin_top{
	margin-top: 30px;
}
.upload_box{
	margin-right: 10px;
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
.jsb{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content:space-between;
	.table_title{
		font-size: 16px;
		font-weight: bold;
		color: #333333;
	}
}
.text_style{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
.bottom_page{
	margin-top: 15px;
	display: flex;
	justify-content: space-between;
}
</style>