<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="日期：">
				<el-date-picker v-model="creat_rq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="白坯款商品编码：">
				<el-select v-model="select_bpkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款商品编码" :remote-method="bpkhList" collapse-tags>
					<el-option v-for="item in bpkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_ksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="ksbmList" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画款商品编码：">
				<el-select v-model="select_thkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款商品编码" :remote-method="thkhList" collapse-tags>
					<el-option v-for="item in thkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画款式编码：">
				<el-select v-model="select_thksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款式编码" :remote-method="thksbmList" collapse-tags>
					<el-option v-for="item in thksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="有无白坯：">
				<el-select v-model="is_bp" clearable placeholder="全部">
					<el-option label="有" value="0"></el-option>
					<el-option label="无" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<el-button type="primary" plain size="mini" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.list.data" tooltip-effect="dark" border style="width: 100%" :header-cell-style="tableCellStyle" @sort-change='sortChange' @header-dragend="dragendChange" v-loading="loading">
			<el-table-column column-key="0" :index="index" :prop="item.prop" sortable="custom" :width="item.width" align="center" show-overflow-tooltip v-for="(item,index) in columnDataObj">
				<template slot="header">
					<el-tooltip effect="dark" :content="item.label" placement="top-start">
						<span>{{item.label}}</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
				</template>
			</el-table-column>
			<el-table-column align="center" label="烫画款">
				<el-table-column column-key="1" :index="index" :prop="item.prop" sortable="custom" :width="item.width" align="center" show-overflow-tooltip v-for="(item,index) in thkDataObj">
					<template slot="header">
						<el-tooltip effect="dark" :content="item.label" placement="top-start">
							<span>{{item.label}}</span>
						</el-tooltip>
					</template>
					<template slot-scope="scope">
						<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column align="center" label="白坯款">
				<el-table-column column-key="2" :index="index" :prop="item.prop" sortable="custom" :width="item.width" align="center" show-overflow-tooltip v-for="(item,index) in bpDataObj">
					<template slot="header">
						<el-tooltip effect="dark" :content="item.label" placement="top-start">
							<span>{{item.label}}</span>
						</el-tooltip>
					</template>
					<template slot-scope="scope">
						<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column column-key="3" :index="index" :prop="item.prop" sortable="custom" :width="item.width" align="center" show-overflow-tooltip v-for="(item,index) in endDataObj">
				<template slot="header">
					<el-tooltip effect="dark" :content="item.label" placement="top-start">
						<span>{{item.label}}</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.list.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import commonResource from '../../../api/resource.js'
	import resource from '../../../api/procurementResource.js'
	import {getNowDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				creat_rq:getNowDate(),	//日期
				bpkh_list:[],			//白坯商品编码
				select_bpkh_list:[],	//选中的白坯商品编码
				ksbm_list:[],			//白坯款式编码
				select_ksbm_list:[],	//选中的白坯款式编码
				thkh_list:[],			//烫画商品编码
				select_thkh_list:[],	//选中的烫画商品编码
				thksbm_list:[],			//烫画款式编码
				select_thksbm_list:[],	//选中的烫画款式编码
				loading:false,
				dataObj:{
					list:{
						data:[]
				}},				//获取到的数据
				columnDataObj:[{
					label:'白坯供应商款号',
					prop:'bp_gyshh',
					width:60
				},{
					label:'白坯款式编码',
					prop:'bpkh',
					width:60
				},{
					label:'白坯款商品编码',
					prop:'bpspbm',
					width:60
				},{
					label:'白坯颜色',
					prop:'bp_color',
					width:60
				},{
					label:'白坯尺码',
					prop:'bp_size',
					width:60
				}],
				thkDataObj:[{
					label:'烫画款式编码',
					prop:'thkh',
					width:60
				},{
					label:'商品编码',
					prop:'thspbm',
					width:60
				},{
					label:'供应商',
					prop:'th_gys',
					width:60
				},{
					label:'供应商款号',
					prop:'th_gyshh',
					width:60
				},{
					label:'颜色',
					prop:'th_color',
					width:60
				},{
					label:'尺码',
					prop:'th_size',
					width:60
				},{
					label:'三天前销量',
					prop:'thr_xssl',
					width:60
				},{
					label:'两天前销量',
					prop:'scd_xssl',
					width:60
				},{
					label:'一天前销量',
					prop:'yes_xssl',
					width:60
				},{
					label:'三天销量',
					prop:'3_xssl',
					width:60
				},{
					label:'七天销量',
					prop:'7_xssl',
					width:60
				},{
					label:'箱及仓位库存',
					prop:'th_xjcw_stock',
					width:60
				},{
					label:'可用数',
					prop:'th_kys',
					width:60
				},{
					label:'采购在途',
					prop:'th_cgzt',
					width:60
				},{
					label:'进货仓库存',
					prop:'th_jhc_stock',
					width:60
				}],						//烫画款
				bpDataObj:[{
					label:'白坯箱及仓位库存',
					prop:'bp_xjcw_stock',
					width:60
				},{
					label:'可用数',
					prop:'bp_kys',
					width:60
				},{
					label:'采购在途',
					prop:'bp_cgzt',
					width:60
				},{
					label:'进货仓库存',
					prop:'bp_jhc_stock',
					width:60
				},{
					label:'安全库存',
					prop:'min_qty',
					width:60
				},{
					label:'白坯合格率',
					prop:'bp_hgl',
					width:60,
					unit:'%'
				}],						//白坯款
				endDataObj:[{
					label:'是否备货',
					prop:'th_stock_up',
					width:60
				},{
					label:'有无对照白坯款',
					prop:'is_bp',
					width:60
				},{
					label:'售后退货率',
					prop:'fut_rate',
					width:60,
					unit:'%'
				}],
				page:1,
				pagesize:10,
				sort:"",
				is_bp:""
			}
		},
		props:{
			dept:{
				type:String,
				default:''
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			dragendChange(newWidth, oldWidth, column, event){
				let index = column.index;
				if(column.columnKey == '0'){
					this.columnDataObj[index].width = newWidth;
				}else if(column.columnKey == '1'){
					this.thkDataObj[index].width = newWidth;
				}else if(column.columnKey == '3'){
					this.bpDataObj[index].width = newWidth;
				}else if(column.columnKey == '4'){
					this.endDataObj[index].width = newWidth;
				}
				let arr = [];
				this.columnDataObj.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				this.thkDataObj.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				this.bpDataObj.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				this.endDataObj.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				let arg = {
					table_id:this.dataObj.table_setting.table_id,
					setting:arr.join(','),
				}
				if(this.dataObj.table_setting.id){
					arg.id = this.dataObj.table_setting.id;
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
			tableCellStyle(v){
				if((v.columnIndex == 5 && v.rowIndex == 0) || (v.columnIndex >= 0 && v.columnIndex <= 14  && v.rowIndex == 1)) {
					return 'background:#87CEFA;color:#333333';
				}else if((v.columnIndex == 6 && v.rowIndex == 0) || (v.columnIndex >= 15 && v.columnIndex <= 20  && v.rowIndex == 1)){
					return 'background:#FFD700;color:#333333';
				}else{
					return 'background:#f4f4f4;color:#333333';
				}
			},
			//白坯商品编码
			bpkhList(e){
				this.searchDrawData('bpspbm',e)
			},
			//白坯款式编码
			ksbmList(e){
				this.searchDrawData('bpkh',e)
			},
			//烫画商品编码
			thkhList(e){
				this.searchDrawData('thspbm',e)
			},
			//烫画款式编码
			thksbmList(e){
				this.searchDrawData('thkh',e)
			},
			//获取查询条件
			searchDrawData(field,field_value){
				let arg = {
					field:field,
					field_value:field_value
				}
				resource.searchDrawData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'thspbm'){
							this.thkh_list = res.data.data;
						}else if(field == 'thkh'){
							this.thksbm_list = res.data.data;
						}else if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
						}else if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			searchFn(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//排序
			sortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.sort = column.prop + '-' + order;
				}else{
					this.sort = '';
				}
        		//采购总数
        		this.getData();
        	},
			//获取列表
			getData(){
				let arg = {
					creat_rq:this.creat_rq,
					thkh:this.select_thksbm_list.join(','),
					thspbm:this.select_thkh_list.join(','),
					bpspbm:this.select_bpkh_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					is_bp:this.is_bp,
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				if(this.dept == 'er_dept'){
					resource.twoDrawGoodsList(arg).then(res => {
						if(res.data.code == 1){
							this.loading = false;
							this.dataObj = res.data.data;
							if(this.dataObj.table_setting.setting){
								let setting_arr = this.dataObj.table_setting.setting.split(',');
								setting_arr.map(item => {
									this.columnDataObj.map(i => {
										if(item.split('-')[0] == i.prop){
											i.width = item.split('-')[1]
										}
									})
									this.thkDataObj.map(ii => {
										if(item.split('-')[0] == ii.prop){
											ii.width = item.split('-')[1]
										}
									})
									this.bpDataObj.map(iii => {
										if(item.split('-')[0] == iii.prop){
											iii.width = item.split('-')[1]
										}
									})
									this.endDataObj.map(iiii => {
										if(item.split('-')[0] == iiii.prop){
											iiii.width = item.split('-')[1]
										}
									})
								})
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourDrawGoodsList(arg).then(res => {
						if(res.data.code == 1){
							this.loading = false;
							this.dataObj = res.data.data;
							if(this.dataObj.table_setting.setting){
								let setting_arr = this.dataObj.table_setting.setting.split(',');
								setting_arr.map(item => {
									this.columnDataObj.map(i => {
										if(item.split('-')[0] == i.prop){
											i.width = item.split('-')[1]
										}
									})
									this.thkDataObj.map(ii => {
										if(item.split('-')[0] == ii.prop){
											ii.width = item.split('-')[1]
										}
									})
									this.bpDataObj.map(iii => {
										if(item.split('-')[0] == iii.prop){
											iii.width = item.split('-')[1]
										}
									})
									this.endDataObj.map(iiii => {
										if(item.split('-')[0] == iiii.prop){
											iiii.width = item.split('-')[1]
										}
									})
								})
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.drawGoodsList(arg).then(res => {
						if(res.data.code == 1){
							this.loading = false;
							this.dataObj = res.data.data;
							if(this.dataObj.table_setting.setting){
								let setting_arr = this.dataObj.table_setting.setting.split(',');
								setting_arr.map(item => {
									this.columnDataObj.map(i => {
										if(item.split('-')[0] == i.prop){
											i.width = item.split('-')[1]
										}
									})
									this.thkDataObj.map(ii => {
										if(item.split('-')[0] == ii.prop){
											ii.width = item.split('-')[1]
										}
									})
									this.bpDataObj.map(iii => {
										if(item.split('-')[0] == iii.prop){
											iii.width = item.split('-')[1]
										}
									})
									this.endDataObj.map(iiii => {
										if(item.split('-')[0] == iiii.prop){
											iiii.width = item.split('-')[1]
										}
									})
								})
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//分页
			changePage(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			changePageSize(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			//导出
			commitExport(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText:'取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						creat_rq:this.creat_rq,
						thkh:this.select_thksbm_list.join(','),
						thspbm:this.select_thkh_list.join(','),
						bpspbm:this.select_bpkh_list.join(','),
						bpkh:this.select_ksbm_list.join(','),
						sort:this.sort,
						is_bp:this.is_bp,
					}
					if(this.dept == 'er_dept'){
						resource.twoDrawGoodsExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'烫画款商品明细');
							}
						})
					}else if(this.dept == 'si_dept'){
						resource.fourDrawGoodsExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'烫画款商品明细');
							}
						})
					}else{
						resource.drawGoodsExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'烫画款商品明细');
							}
						})
					}
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}
		}
	}
</script>
<style scoped lang="less">
.table_top{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
}
</style>