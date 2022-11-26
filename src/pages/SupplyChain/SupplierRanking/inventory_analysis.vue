<template>
	<div>
		<div class="table_row">
			<div style="width: 49%">
				<div class="jsb">
					<div class="table_title">库存分布情况</div>
					<el-button type="text" size="mini">&nbsp</el-button>
				</div>
				<div class="tree" id="tree" style="width: 100%">

				</div>
			</div>
			<div style="width: 49%">
				<div class="jsb">
					<div class="table_title">公司库存占比情况</div>
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
		<div class="table_row margin_top">
			<div style="width: 49%" >
				<div class="jsb">
					<div class="table_title">事业部库存占比情况</div>
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
					<div class="table_title">商品标签库存占比情况</div>
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
				<el-select v-model="gys_ids" clearable filterable multiple remote reserve-keyword placeholder="全部" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商等级：">
				<el-select v-model="gys_level_ids" clearable filterable multiple reserve-keyword placeholder="全部">
					<el-option v-for="item in gys_level_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="全部" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="jsb">
			<div class="table_title">明细表</div>
		</div>
		<el-table :data="detail_data" size="small" border style="width: 100%" max-height='680' :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="detail_loading" @header-dragend="secondChange">
			<el-table-column :index="index" :label="i.label" :prop="i.prop" align="center" v-for="(i,index) in column_list" :width="i.width" show-overflow-tooltip :sortable="i.sort?'custom':false">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.label" placement="top-start">
						<div class="text_content">{{i.label}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-input v-if="i.type=='input'" size="mini" v-model="scope.row.remarks" placeholder="请输入备注" @change="confirmEdit({id:scope.row.id,remark:scope.row.remarks})"></el-input>
					<el-button type="text" size="mini" v-else-if="i.type=='button'" @click="openEdit(scope.row.id,scope.row.is_retreat,scope.row.goods_label,scope.row.is_supply,scope.row.gys_type)">编辑</el-button>
					<div v-else>{{scope.row[i.prop]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 编辑 -->
		<el-dialog title="编辑" size="mini" width="40%" :visible.sync="edit_dialog">
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
	</div>
</template>
<script>
	import resource from '../../../api/operationResource.js'
	import commonResource from '../../../api/resource.js'
	export default{
		data(){
			return{
				treeChart:null,
				syb_data:[],				//事业部库存占比情况
				syb_loading:false,			//事业部库存占比情况加载
				syb_current_cell:"",		//事业部当前点击的单元格类型
				spbq_data:[],				//商品标签列表
				spbq_loading:false,			//商品标签情况加载
				spbq_current_cell:"",		//商品标签当前点击的单元格类型
				gys_cate_list:[],			//供应商分类列表
				gys_cate_ids:[],			//选中的供应商分类
				gys_list:[],				//供应商
				gys_ids:[],					//选中的供应商
				gys_level_list:[],			//供应商等级列表
				gys_level_ids:[],			//选中的供应商等级
				ks_list:[],					//款式编码
				select_ks_ids:[],			//选中的款式编码
				dept_name:"",				//当前选中的事业部
				syb_is_retreat:"",			//当前选中的事业部是否可退
				goods_label:"",				//当前选中的商品标签
				spbq_is_retreat:"",			//当前选中的商品标签是否可退
				is_retreat:"",				//当前选中的是否可退
				sort:"",
				page:1,
				pagesize:10,
				detail_data:[],				//明细列表
				total:0,
				detail_loading:false,		
				column_list:[{
					label:'供应商分类',
					width:"80",
					prop:'gys_type'
				},{
					label:'是否可退',
					width:"80",
					prop:'is_retreat'
				},{
					label:'是否内供',
					width:"80",
					prop:'is_supply'
				},{
					label:'商品标签',
					width:"80",
					prop:'goods_label'
				},{
					label:'供应商',
					width:"80",
					prop:'gys'
				},{
					label:'供应商等级',
					width:"80",
					prop:'gys_level'
				},{
					label:'结算方式',
					width:"80",
					prop:'jsfs'
				},{
					label:'款式编码',
					width:"80",
					prop:'ksbm'
				},{
					label:'供应商货号',
					width:"80",
					prop:'gyshh'
				},{
					label:'库存',
					width:"80",
					sort:true,
					prop:'kc'
				},{
					label:'库存转数',
					width:"80",
					sort:true,
					prop:'kczs'
				},{
					label:'前一天销量',
					width:"100",
					sort:true,
					prop:'xssl_1'
				},{
					label:'前两天销量',
					width:"100",
					sort:true,
					prop:'xssl_2'
				},{
					label:'前三天销量',
					width:"100",
					sort:true,
					prop:'xssl_3'
				},{
					label:'3天销量',
					width:"80",
					sort:true,
					prop:'xssl_3sum'
				},{
					label:'7天销量',
					width:"80",
					sort:true,
					prop:'xssl_7sum'
				},{
					label:'15天销量',
					width:"80",
					sort:true,
					prop:'xssl_15sum'
				},{
					label:'30天销量',
					width:"80",
					sort:true,
					prop:'xssl_30sum'
				},{
					label:'品类',
					width:"80",
					prop:'cpfl'
				},{
					label:'主卖店铺',
					width:"80",
					prop:'main_dp'
				},{
					label:'事业部',
					width:"80",
					prop:'dept_name'
				},{
					label:'平台',
					width:"80",
					prop:'platform'
				},{
					label:'处理方式备注',
					width:"120",
					type:'input',
					prop:'remark'
				},{
					label:'操作',
					width:"80",
					type:'button',
					prop:''
				}],
				table_id:"",
				edit_id:"",
				edit_dialog:false,
				id:"",
				gys_type:"",				//供应商分类
				edit_retreat:"",			//是否可退
				is_supply:"",				//是否内供
				edit_goods_label:"",		//商品标签

			}
		},
		created(){
			//库存占比
			let syb_arg = {
				type:'dept_name'
			}
			this.stockRate(syb_arg);
			//商品标签占比
			let spbq_arg = {
				type:'goods_label'
			}
			this.stockRate(spbq_arg);
			//明细表
			this.stockDetail();
			//供应商分类
			this.getSearchList({type:'gys_type'});
			//供应商等级
			this.getSearchList({type:'gys_level'});
		},
		mounted(){
			//图表渲染
			this.getCharts();
		},
		methods:{
			getCharts(){
				var echarts = require("echarts");
				var tree_chart = document.getElementById('tree');
				this.treeChart = echarts.getInstanceByDom(tree_chart)
				if (this.treeChart) { 
					this.treeChart.clear();
				}
				this.treeChart = echarts.init(tree_chart);
				this.treeChart.setOption(this.setOptions());
			},
			// 图表渲染
			setOptions(){
				return {
					tooltip: {
						trigger: 'item',
						formatter: function (params) {
							let data = params.data;
							let tip = "";
							if(!!params) {
								tip = '事业部：' + data.dept + "</br>"
								+'是否可退：' + data.is_return + "</br>"
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
								if(!!params) {
									tip = data.dept + "\n"
									+data.is_return + "\n"
									+data.value + "\n"
									+data.rate + "%";
								}
								return tip;
							},
						},
						data: [
						{
							dept:"事业二部",
							is_return:'1',
							value: 123123,
							rate:32
							
						},
						{
							dept:"事业四部",
							is_return:'2',
							value: 36453,
							rate:45
						}
						]
					}
					]
				}
			},
			//库存占比
			stockRate(arg){
				if(arg.type == 'dept_name'){		//事业部占比
					this.syb_loading = true;
				}else{								//商品标签占比
					this.spbq_loading = true;
				}
				resource.stockRate(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						if(arg.type == 'dept_name'){	//事业部占比
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
			//事业部单元格点击
			cellClick(row, column, cell, event){
				if(row.name == '总计' || (column.property != "is_retreat" && column.property != "name")){
					return;
				}
				this.syb_current_cell = column.property;	//点击的单元格类型
				this.dept_name = row.name;
				this.is_retreat = column.property == "is_retreat"?row.is_retreat:'';
				this.syb_is_retreat = column.property == "is_retreat"?row.is_retreat:'';
				this.goods_label = "";
				this.page = 1;
				let arg = {
					type:'goods_label',
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
				this.is_retreat = '';
				this.goods_label = "";
				this.page = 1;
				let arg = {
					type:'goods_label',
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
				}else{
					this.is_retreat = this.syb_is_retreat;
				}
				//明细表
				this.stockDetail();
			},
			//商品标签清空
			clearSpbq(){
				this.goods_label = '';
				this.is_retreat = this.syb_is_retreat;
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
			//供应商
			getGys(e){
				//供应商
				this.getSearchList({type:'gys',keyword:e});
			},
			//款式编码
			getKsbm(e){
				//款式编码
				this.getSearchList({type:'ksbm',keyword:e});
			},
			//获取搜索条件
			getSearchList(arg){
				resource.stockSelect(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						switch(arg.type){
							case 'gys_type':
							this.gys_cate_list = data.gys_type;
							break;
							case 'gys_level':
							this.gys_level_list = data.gys_level;
							break;
							case 'gys':
							this.gys_list = data.gys;
							break;
							case 'ksbm':
							this.ks_list = data.ksbm;
							break;
						}
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
					dept_name:this.dept_name,
					goods_label:this.goods_label,
					is_retreat:this.is_retreat,
					gys_type:this.gys_cate_ids.join(','),
					gys:this.gys_ids.join(','),
					gys_level:this.gys_level_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					sort:this.sort
				}
				this.detail_loading = true;
				resource.stockDetail(arg).then(res => {
					if(res.data.code == 1){
						this.detail_loading = false;
						let data = res.data.data;
						this.detail_data = data.data;
						this.total = data.total;
						this.table_id = data.table_setting.table_id;
						if(data.table_setting.setting){
							this.edit_id = data.table_setting.edit_id;
							let setting_arr = data.table_setting.setting.split(',');
							setting_arr.map(item => {
								this.column_list.map(iii => {
									if(item.split('-')[0] == iii.prop){
										iii.width = item.split('-')[1]
									}
								})
							})
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//明细表表列宽修改
			secondChange(newWidth, oldWidth, column, event){
				let index = column.index;
				this.column_list[index].width = newWidth;
				let arr = [];
				this.column_list.map(item => {
					let str = item.prop + '-' + item.width;
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
			//点击编辑
			openEdit(id,is_retreat,goods_label,is_supply,gys_type){
				this.id = id;
				this.edit_retreat = is_retreat;
				this.edit_goods_label = goods_label;
				this.is_supply = is_supply;
				this.gys_type = gys_type;
				this.edit_dialog = true;
			},
			//确认编辑
			okFn(){
				let arg = {
					id:this.id,
					is_retreat:this.edit_retreat,
					goods_label:this.edit_goods_label,
					is_supply:this.is_supply,
					gys_type:this.gys_type
				}
				//提交编辑
				this.confirmEdit(arg);
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
</style>
<style lang="less" scoped>
.table_row{
	display: flex;
	justify-content:space-between;
	.tree{
		height: 500px;
	}
}
.margin_top{
	margin-top: 30px;
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
</style>