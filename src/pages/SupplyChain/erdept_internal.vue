<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货日期:">
				<el-date-picker v-model="date" :clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-select v-model="current_key" size="small" style="width: 120px" :popper-append-to-body="false" @change="selectChange($event,'a')">
					<el-option v-for="item in arg_list" :key="item.key" :label="item.label" :value="item.key">
					</el-option>
				</el-select>
				<el-select v-model="keyword" :placeholder="`请输入${placeholder}`" clearable filterable remote reserve-keyword size="small" :popper-append-to-body="false" :remote-method="searchKeyWord">
					<el-option v-for="item in options_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn('a')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="table_title">做货款对照表明细</div>
			<el-button type="primary" plain size="small" @click="commitExport('a')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_data" size="small" style="width: 100%" max-height='680' :header-cell-style="tableCellStyle" @sort-change="sortChange" v-loading="loading">
			<el-table-column :label="i.label" :prop="i.prop" align="center" v-for="i in column_list" :width="i.width" show-overflow-tooltip :sortable="i.sort?'custom':false">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.label" placement="top-start">
						<div class="text_content">{{i.label}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-image fit="cover" style="width: 60px; height: 60px" :src="scope.row.images[0]" :preview-src-list="scope.row.images" v-if="i.prop == 'tp_url' && scope.row[i.prop] != '总计'">
					</el-image>
					<div v-else>{{scope.row[i.prop]}}{{scope.row[i.prop] !== ''&&i.unit?i.unit:""}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline margin">
			<el-form-item label="发货日期:">
				<el-date-picker v-model="b_date" :clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-select v-model="b_current_key" size="small" style="width: 120px" :popper-append-to-body="false" @change="selectChange($event,'b')">
					<el-option v-for="item in arg_list" :key="item.key" :label="item.label" :value="item.key" :disabled="item.disabled">
					</el-option>
				</el-select>
				<el-select v-model="b_keyword" :placeholder="`请输入${b_placeholder}`" clearable filterable remote reserve-keyword size="small" :popper-append-to-body="false" :remote-method="bSearchKeyWord">
					<el-option v-for="item in b_options_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn('b')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="table_title">做货款现款明细</div>
			<el-button type="primary" plain size="small" @click="commitExport('b')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="b_table_data" size="small" style="width: 100%" max-height='680' :header-cell-style="{'background':'#f4f4f4'}" @sort-change="bSortChange" v-loading="b_loading">
			<el-table-column :label="i.label" :prop="i.prop" align="center" v-for="i in b_column_list" :width="i.width" show-overflow-tooltip :sortable="i.sort?'custom':false">
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="i.label" placement="top-start">
						<div class="text_content">{{i.label}}</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-image fit="cover" style="width: 60px; height: 60px" :src="scope.row.images[0]" :preview-src-list="scope.row.images" v-if="i.prop == 'tp_url' && scope.row[i.prop] != '总计'">
					</el-image>
					<div v-else>{{scope.row[i.prop]}}{{scope.row[i.prop] !== ''&&i.unit?i.unit:""}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="bHandleSizeChange" @current-change="bHandleCurrentChange" :current-page="b_page" :pager-count="11" :page-size="b_pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="b_total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../api/demandResource.js'
	import cResource from '../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate,lastXDate} from '../../api/nowMonth.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				date:[lastXDate(7),getNowDate()],			//提报日期
				arg_list:[{
					label:'现款式编码',
					key:'xksbm',
					type:1
				},{
					label:'原款式编码',
					key:'yksbm',
					type:1,
					disabled:true
				},{
					label:'现供应商',
					key:'xgys',
					type:2
				},{
					label:'原供应商',
					key:'ygys',
					type:2,
					disabled:true
				}],											//筛选条件列表
				placeholder:"现款式编码",
				current_key:"xksbm",						//当前选中的查询类型图标
				search_type:1,					//搜索关键词类型（1:款式编码；2:供应商）
				options_list:[],							//搜索的列表
				keyword:"",									//输入的关键词
				page:1,
				pagesize:15,
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
				column_list:[{
					label:'图片',
					width:"120",
					prop:'tp_url'
				},{
					label:'产品分类',
					width:"120",
					prop:'cpfl'
				},{
					label:'原供应商',
					width:"120",
					prop:'ygys'
				},{
					label:'原供应商款号',
					width:"130",
					prop:'ygyshh'
				},{
					label:'原款式编码',
					width:"120",
					prop:'yksbm'
				},{
					label:'原成本',
					width:"80",
					sort:true,
					prop:'ycb'
				},{
					label:'原库存',
					width:"80",
					sort:true,
					prop:'ykc'
				},{
					label:'原缺货',
					width:"80",
					sort:true,
					prop:'yqh'
				},{
					label:'原毛利率',
					width:"80",
					sort:true,
					unit:"%",
					prop:'ymll'
				},{
					label:'原发货量',
					width:"80",
					sort:true,
					prop:'yfhsl'
				},{
					label:'原售价',
					width:"80",
					sort:true,
					prop:'ysj'
				},{
					label:'近30天原发货数量',
					width:"130",
					sort:true,
					prop:'30_yfhl'
				},{
					label:'现供应商',
					width:"100",
					prop:'xgys'
				},{
					label:'现供应商款号',
					width:"130",
					prop:'xgyshh'
				},{
					label:'现款式编码',
					width:"120",
					prop:'xksbm'
				},{
					label:'现成本',
					width:"80",
					sort:true,
					prop:'xcb'
				},{
					label:'现库存',
					width:"80",
					sort:true,
					prop:'xkc'
				},{
					label:'现缺货',
					width:"80",
					sort:true,
					prop:'xqh'
				},{
					label:'现毛利率',
					width:"80",
					sort:true,
					unit:"%",
					prop:'xmll'
				},{
					label:'现发货量',
					width:"80",
					sort:true,
					prop:'xfhsl'
				},{
					label:'现售价',
					width:"80",
					sort:true,
					prop:'xsj'
				},{
					label:'近30天现发货量',
					width:"120",
					sort:true,
					prop:'30_xfhl'
				},{
					label:'现款式发货占比',
					width:"130",
					sort:true,
					unit:"%",
					prop:'xksfhzb'
				},{
					label:'降本额',
					width:"80",
					sort:true,
					prop:'jbe'
				},{
					label:'近30天降本额',
					width:"100",
					sort:true,
					prop:'30_jbe'
				},{
					label:'30天总销量',
					width:"100",
					sort:true,
					prop:'30_zxl'
				}],
				table_data:[],
				total:0,
				loading:false,
				sort:"",
				b_date:[lastXDate(7),getNowDate()],			//提报日期
				b_placeholder:"现款式编码",
				b_current_key:"xksbm",						//当前选中的查询类型图标
				b_search_type:1,					//搜索关键词类型（1:款式编码；2:供应商）
				b_options_list:[],							//搜索的列表
				b_keyword:"",									//输入的关键词
				b_page:1,
				b_pagesize:15,
				b_column_list:[{
					label:'图片',
					width:"120",
					prop:'tp_url'
				},{
					label:'产品分类',
					width:"120",
					prop:'cpfl'
				},{
					label:'现供应商',
					prop:'xgys'
				},{
					label:'现供应商款号',
					prop:'xgyshh'
				},{
					label:'现款式编码',
					prop:'xksbm'
				},{
					label:'现成本',
					sort:true,
					prop:'xcb'
				},{
					label:'现库存',
					sort:true,
					prop:'xkc'
				},{
					label:'现缺货',
					sort:true,
					prop:'xqh'
				},{
					label:'现毛利率',
					sort:true,
					unit:"%",
					prop:'xmll'
				},{
					label:'现发货量',
					sort:true,
					prop:'xfhsl'
				},{
					label:'现售价',
					sort:true,
					prop:'xsj'
				},{
					label:'近30天现发货量',
					sort:true,
					prop:'30_xfhl'
				},{
					label:'降本额',
					sort:true,
					prop:'jbe'
				},{
					label:'七天到货率',
					sort:true,
					unit:"%",
					prop:'dhl_7'
				}],
				b_table_data:[],
				b_total:0,
				b_loading:false,
				b_sort:"",
			}
		},
		created(){
			//获取列表数据
			this.getData();
			//下面的表格
			this.getEbzhkTwo();
		},
		methods:{
			//切换筛选条件类型
			selectChange(v,type){
				let arr = this.arg_list.filter(item => {
					return item.key == v;
				})
				if(type == 'a'){
					this.placeholder = arr[0].label;
					this.search_type = arr[0].type;
					this.options_list = [];
					this.keyword = "";
				}else{
					this.b_placeholder = arr[0].label;
					this.b_search_type = arr[0].type;
					this.b_options_list = [];
					this.b_keyword = "";
				}
			},
			//点击搜索
			searchFn(type){
				if(type == 'a'){
					this.page = 1;
					this.pagesize = 15;
					//获取列表数据
					this.getData();
				}else{
					this.b_page = 1;
					this.b_pagesize = 15;
					//下面的表格
					this.getEbzhkTwo();
				}
			},
			//获取款式编码或供应商列表
			searchKeyWord(e){
				if(this.search_type == 1){	//款式编码
					//款式编码
					this.getKsbm(e,'a');
				}else{		//供应商
					//供应商列表
					this.getGys(e,'a');
				}
			},
			bSearchKeyWord(e){
				if(this.b_search_type == 1){	//款式编码
					//款式编码
					this.getKsbm(e,'b');
				}else{		//供应商
					//供应商列表
					this.getGys(e,'b');
				}
			},
			//供应商列表
			getGys(e,type){
				if(e != ''){
					cResource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							if(type == 'a'){
								this.options_list = res.data.data;
							}else{
								this.b_options_list = res.data.data;
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//款式编码
			getKsbm(e,type){
				if(e != ''){
					cResource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							if(type == 'a'){
								this.options_list = res.data.data;
							}else{
								this.b_options_list = res.data.data;
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//第一个表格表头区分颜色
			tableCellStyle(v){
				if(v.columnIndex <= 9) {
					return 'background:#87CEFA;color:#333333';
				}else if(v.columnIndex >= 10 && v.columnIndex <= 20){
					return 'background:#FFD700;color:#333333';
				}
			},
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.sort = "";
				}   
				this.getData();
			}, 
			//获取列表数据
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				arg[this.current_key] = this.keyword;
				this.loading = true;
				resource.getKsbmFhqk(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;

						let table_data = data.data;
						table_data.map(item => {
							let images = [];
							images.push(item.tp_url);
							item.images = images;
						})
						this.table_data = table_data;

						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//导出
			commitExport(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(type == 'a'){
						let arg = {
							start_date:this.date && this.date.length> 0?this.date[0]:"",
							end_date:this.date && this.date.length> 0?this.date[1]:"",
							sort:this.sort,
						}
						arg[this.current_key] = this.keyword;
						resource.getKsbmFhqkExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'做货款对照表明细');
							}
						})
					}else{
						let arg = {
							start_date:this.date && this.date.length> 0?this.date[0]:"",
							end_date:this.date && this.date.length> 0?this.date[1]:"",
							sort:this.sort,
						}
						arg[this.b_current_key] = this.b_keyword;
						resource.getEbzhkTwoExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'做货款现款明细');
							}
						})
					}
					
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//下面的表格
			getEbzhkTwo(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					sort:this.b_sort,
					page:this.b_page,
					pagesize:this.b_pagesize
				}
				arg[this.b_current_key] = this.b_keyword;
				this.b_loading = true;
				resource.getEbzhkTwo(arg).then(res => {
					if(res.data.code == 1){
						this.b_loading = false;
						let data = res.data.data;
						let b_table_data = data.data;
						b_table_data.map(item => {
							let images = [];
							images.push(item.tp_url);
							item.images = images;
						})
						this.b_table_data = b_table_data;
						this.b_total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
			bSortChange({ column, prop, order }) {  
				if(order){
					this.b_sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.b_sort = "";
				}   
				this.getEbzhkTwo();
			},
			//分页
			bHandleSizeChange(val) {
				this.b_pagesize = val;
				//获取列表
				this.getEbzhkTwo();
			},
			bHandleCurrentChange(val) {
				this.b_page = val;
				//获取列表
				this.getEbzhkTwo();
			},
		}
	}
</script>
<style type="text/css">
.el-table th>.cell{
	display: flex!important;
	align-items: center!important;
	justify-content: center!important;
}
</style>
<style lang="less" scoped>
.margin{
	margin-top: 15px;
}
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.table_title{
		font-weight: bold;
	}
}
</style>







