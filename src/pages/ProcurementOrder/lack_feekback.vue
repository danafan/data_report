<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="ksbm" clearable filterable remote reserve-keyword :popper-append-to-body="false" :remote-method="getKsbm" placeholder="全部">
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="事业部：">
				<el-select v-model="dept_name" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="事业二部" value="事业二部"></el-option>
					<el-option label="事业四部" value="事业四部"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="gysmc" clearable :popper-append-to-body="false" filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_ksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="ksbmList" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="changePage(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<el-button type="primary" plain size="mini" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" border tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change='sortChange'>
			<el-table-column :prop="item.prop" :sortable="item.sort" width="65" align="center" show-overflow-tooltip v-for="item in column_list">
				<template slot="header">
					<el-tooltip effect="dark" :content="item.label" placement="top-start">
						<span>{{item.label}}</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="160" align="center">
				<template slot="header">
					<el-tooltip effect="dark" content="当日供应链反馈结果" placement="top-start">
						<span>当日供应链反馈结果</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-input size="small" placeholder="当日供应链反馈结果" v-model="scope.row.fkjg" @change="changeResult($event,scope.row.ksbm,'0')">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column width="80" align="center">
				<template slot="header">
					<el-tooltip effect="dark" content="历史供应链反馈结果" placement="top-start">
						<span>历史供应链反馈结果</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getRecord(scope.row.ksbm)">查看</el-button>
				</template>
			</el-table-column>
			<el-table-column width="160" align="center">
				<template slot="header">
					<el-tooltip effect="dark" content="供应链建议" placement="top-start">
						<span>供应链建议</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<el-input size="small" placeholder="供应链建议" v-model="scope.row.jy" @change="changeResult($event,scope.row.ksbm,'1')">
					</el-input>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 历史供应链反馈结果弹窗 -->
		<el-dialog title="历史供应链反馈结果" center :visible.sync="show_table">
			<el-table size="small" :data="tableObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column prop="createtime" label="操作时间" width="160" align="center"></el-table-column>
				<el-table-column prop="record" label="供应反馈结果" show-overflow-tooltip align="center"></el-table-column>
				<el-table-column prop="creater" label="操作人" width="100" show-overflow-tooltip align="center"></el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @size-change="handlePageSize" @current-change="handlePage" :current-page="table_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="tableObj.total">
				</el-pagination>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click="show_table = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../api/resource.js'
	import proResource from '../../api/procurementResource.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				dept_name:"",			//事业部名称
				ks_list:[],				//款式编码列表
				ksbm:"",				//选中的款式编码
				gys_list:[],			//供应商
				gysmc:"",				//选中的供应商
				ksbm_list:[],			//白坯款式编码列表
				select_ksbm_list:[],	//选中的白坯款式编码
				page:1,
				pagesize:10,
				sort:"",
				dataObj:{},
				show_table:false,		//详情弹窗
				table_page:1,
				table_pagesize:10,
				tableObj:{},
				column_list:[{
					label:'事业部',
					prop:'dept_name',
					sort:false
				},{
					label:'主卖店铺',
					prop:'zmdp',
					sort:false
				},{
					label:'供应商',
					prop:'gys',
					sort:false
				},{
					label:'款式编码',
					prop:'ksbm',
					sort:false
				},{
					label:'供应商款号',
					prop:'gyskh',
					sort:false
				},{
					label:'3天销量',
					prop:'3_xssl',
					sort:'custom'
				},{
					label:'库存',
					prop:'xykc',
					sort:'custom'
				},{
					label:'缺货数',
					prop:'qhs',
					sort:'custom'
				},{
					label:'进货仓数',
					prop:'jhcs',
					sort:'custom'
				},{
					label:'当日采购在途数',
					prop:'drcgzts',
					sort:'custom'
				},{
					label:'到货率',
					prop:'dhl',
					sort:'custom',
					unit:'%'
				},{
					label:'白坯款号',
					prop:'bpkh',
					sort:false
				},{
					label:'白坯供应商款号',
					prop:'bpgyskh',
					sort:false
				},{
					label:'白坯库存',
					prop:'bpkc',
					sort:false
				},{
					label:'合格率',
					prop:'hgl',
					sort:false,
					unit:'%'
				},{
					label:'产品分类',
					prop:'cpfl',
					sort:false
				}]
			}
		},
		created(){
			//采购总数
			this.getData();
		},
		methods:{
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
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//白坯款式编码
			ksbmList(e){
				this.searchShortage('bpkh',e)
			},
			//获取查询条件
			searchShortage(field,field_value){
				let arg = {
					field:field,
					field_value:field_value
				}
				proResource.searchShortage(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}
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
				this.column_list.splice(6,3);
        		//采购总数
        		this.getData();
        	},
			//获取列表
			getData(){
				let arg = {
					gys:this.gysmc,
					ksbm:this.ksbm,
					bpkh:this.select_ksbm_list.join(','),
					dept_name:this.dept_name,
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				proResource.shortageFeedback(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						var i = 5;
						for(let k in this.dataObj.title){
							i += 1;
							let obj = {
								label:this.dataObj.title[k],
								prop:k,
								sort:'custom'
							}
							this.column_list.splice(i,0,obj);
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText:'取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						gys:this.gysmc,
						ksbm:this.ksbm,
						bpkh:this.select_ksbm_list.join(','),
						dept_name:this.dept_name,
						sort:this.sort,
					}
					proResource.shortageFeedbackExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'得物-缺货跟踪情况');
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
			changePageSize(val) {
				this.pagesize = val;
				//获取列表
				this.column_list.splice(6,3);
				this.getData();
			},
			changePage(val) {
				this.page = val;
				//获取列表
				this.column_list.splice(6,3);
				this.getData();
			},
			//点击查看
			getRecord(ksbm){
				this.show_table = true;
				//获取详情
				this.getTableData(ksbm);
			},
			//获取详情
			getTableData(ksbm){
				let arg = {
					ksbm:ksbm,
					page:this.table_page,
					pagesize:this.table_pagesize
				}
				proResource.shortageRecordList(arg).then(res => {
					if(res.data.code == 1){
						this.tableObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//详情分页
			handlePageSize(val) {
				this.table_pagesize = val;
				//获取列表
				this.getTableData();
			},
			handlePage(val) {
				this.table_page = val;
				//获取列表
				this.getTableData();
			},
			//编辑反馈结果或建议
			changeResult(record,ksbm,type){
				let arg = {
					record:record,
					ksbm:ksbm,
					type:type
				}
				proResource.shortageRecordSave(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success('更新成功!');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>

<style lang="less" scoped>
.table_top{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
}


</style>