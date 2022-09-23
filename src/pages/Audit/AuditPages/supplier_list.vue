<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item>
				<el-input style="width: 200px" v-model="keyword" clearable placeholder="档口号/结算档口号/收款账号"></el-input>
			</el-form-item>
			<el-form-item label="引入时间:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" size="small" @click="addFn('1')">
				添加
			</el-button>
			<el-button type="primary" size="small" :disabled="ids.length == 0" @click="allEdit">
				批量编辑
			</el-button>
			<el-button type="primary" size="small" @click="import_dialog = true">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table ref="multipleTable" :data="table_data" size="small" style="width:100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}"  :cell-style="{'text-align':'center'}" v-loading="loading" @selection-change="handleSelectionChange">
			<el-table-column
			:selectable="selectable"
			fixed="left"
			type="selection"
			width="55">
		</el-table-column>
		<el-table-column :label="item.title" :prop="item.field_name" v-for="item in title_list" show-overflow-tooltip :render-header="renderHeader">
			<template slot-scope="scope">
				<div>{{scope.row[item.field_name]}}</div>
			</template>
		</el-table-column>
		<el-table-column label="操作" width="140" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="addFn('2',scope.row)" v-if="scope.row.status != 2">编辑</el-button>
				<el-button type="text" size="small" @click="deleteFn(scope.row.id)" v-if="scope.row.status != 2">删除</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
	<!-- 添加/编辑 -->
	<el-dialog :title="type == '1'?'添加供应商':'编辑供应商'" :visible.sync="show_dialog" center @close="closeDialog">
		<el-form size="small" >
			<el-form-item label="档口" required>
				<el-input style="width:200px" type="text" placeholder="请输入档口" v-model="info.supplier_name" :disabled="type == '2'">
				</el-input>
			</el-form-item>
			<el-form-item label="结算档口" required>
				<el-input style="width:200px" type="text" placeholder="请输入结算档口" v-model="info.settlement_supplier_name">
				</el-input>
			</el-form-item>
			<el-form-item label="结算档口内部编号" required>
				<el-input style="width:200px" type="text" placeholder="请输入结算档口" v-model="info.settlement_supplier_inside_code">
				</el-input>
			</el-form-item>
			<el-form-item label="结算方式" required>
				<el-input style="width:200px" type="text" placeholder="请输入结算方式" v-model="info.settlement_method">
				</el-input>
			</el-form-item>
			<el-form-item label="供应商">
				<el-input style="width:200px" type="text" placeholder="请输入供应商简称" v-model="info.gys">
				</el-input>
			</el-form-item>
			<el-form-item label="公司名称">
				<el-input style="width:200px" type="text" placeholder="请输入公司名称" v-model="info.corporate_name">
				</el-input>
			</el-form-item>
			<el-form-item label="公司地址">
				<el-input style="width:200px" type="text" placeholder="请输入公司地址" v-model="info.corporate_address">
				</el-input>
			</el-form-item>
			<el-form-item label="联系电话">
				<el-input style="width:200px" type="text" placeholder="请输入联系电话" v-model="info.contacts_number">
				</el-input>
			</el-form-item>
			<el-form-item label="邮箱地址">
				<el-input style="width:200px" type="text" placeholder="请输入邮箱地址" v-model="info.email">
				</el-input>
			</el-form-item>
			<el-form-item label="开户行">
				<el-input style="width:200px" type="text" placeholder="请输入开户行" v-model="info.bank">
				</el-input>
			</el-form-item>
			<el-form-item label="银行&支付宝账号">
				<el-input style="width:200px" type="text" placeholder="请输入银行&支付宝账号" v-model="info.collection_account_number">
				</el-input>
			</el-form-item>
			<el-form-item label="收款人">
				<el-input style="width:200px" type="text" placeholder="请输入收款人" v-model="info.payee">
				</el-input>
			</el-form-item>
			<el-form-item label="是否在合作">
				<el-radio-group v-model="info.is_cooperating">
					<el-radio label="是">是</el-radio>
					<el-radio label="否">否</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="引入时间">
				<el-date-picker v-model="info.introduction_time" type="date" value-format="yyyy-MM-dd" placeholder="引入时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="备注">
				<el-input style="width:200px" type="textarea" :rows="3" placeholder="请输入备注" v-model="info.remark">
				</el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="show_dialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitFn">提交</el-button>
		</div>
	</el-dialog>
	<!-- 导入 -->
	<el-dialog title="导入" :visible.sync="import_dialog" width="30%">
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
			<el-button size="small" @click="import_dialog = false">取 消</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				keyword:"",						//搜索关键字
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
				date:[],						//引入时间
				page:1,
				pagesize:10,
				title_list:[],					//表头数据
				table_data:[],					//表格数据
				total:0,
				loading:false,
				show_dialog:false,				//创建/编辑弹窗
				type:"",						//1:创建；2:编辑
				ids:[],							//选中的供应商ID列表
				names:[],						//选中的档口号列表
				info:{
					supplier_name: "",
					settlement_supplier_name: "",
					settlement_supplier_inside_code: "",
					settlement_method: "",
					gys: "",
					corporate_name: "",
					corporate_address: "",
					contacts_number: "",
					email: "",
					bank: "",
					payee: "",
					collection_account_number:"",
					is_cooperating: "",
					introduction_time: "",
					remark: ""
				},						//点击编辑的详情
				import_dialog:false,	//导入弹窗
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//顶部悬浮
			renderHeader(h, data) {
				return h("span", [
					h(
						"el-tooltip",
						{
							attrs: {
								class: "item",
								effect: "dark",
								content: data.column.label,
								placement: "top",
							},
						},
						[h("span", data.column.label)]
						),
					]);
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
			//操作多选
			handleSelectionChange(val) {
				let ids = [];
				let names = [];
				val.map(item => {
					ids.push(item.id);
					names.push(item.supplier_name);
				})
				this.ids = ids;
				this.names = names;
			},
			//获取列表
			getList(){
				let arg = {
					keyword:this.keyword,
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.supplierIndex(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除
			deleteFn(id){
				this.$confirm('确认删除该供应商?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						id:id
					}
					resource.supplierDel(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
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
						keyword:this.keyword,
						start_time:this.date && this.date.length> 0?this.date[0]:"",
						end_time:this.date && this.date.length> 0?this.date[1]:""
					}
					resource.supplierExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'供应商列表');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/供应商管理导入模板.xlsx`);
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.supplierImport({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						this.import_dialog = false;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//批量编辑
			allEdit(){
				this.type = '2';
				this.info = {
					ids:this.ids.join(','),
					supplier_name: this.names.join(','),
					settlement_supplier_name: "",
					settlement_supplier_inside_code: "",
					settlement_method: "",
					gys: "",
					corporate_name: "",
					corporate_address: "",
					contacts_number: "",
					email: "",
					bank: "",
					payee: "",
					collection_account_number:"",
					is_cooperating: "",
					introduction_time: "",
					remark: ""
				}
				this.show_dialog = true;
			},
			selectable(row) {
				if (row.status == 2) {
					return false;
				} else {
					return true;
				}
			},
			//点击添加或编辑
			addFn(type,info){
				this.type = type;
				if(this.type == '2'){
					let new_info = JSON.parse(JSON.stringify(info));
					let ids = new_info.id;
					delete new_info.id;
					new_info.ids = ids;
					this.info = new_info;
				}
				this.show_dialog = true;
			},
			closeDialog(){
				this.info = {
					supplier_name: "",
					settlement_supplier_name: "",
					settlement_supplier_inside_code: "",
					settlement_method: "",
					gys: "",
					corporate_name: "",
					corporate_address: "",
					contacts_number: "",
					email: "",
					bank: "",
					payee: "",
					collection_account_number:"",
					is_cooperating: "",
					introduction_time: "",
					remark: ""
				}
			},
			//创建/编辑提交
			commitFn(){
				if(this.info.supplier_name == ''){
					this.$message.warning('请输入档口!');
				}else if(this.info.settlement_supplier_name == ''){
					this.$message.warning('请输入结算档口!');
				}else if(this.info.settlement_supplier_inside_code == ''){
					this.$message.warning('请输入结算档口内部编号!');
				}else if(this.info.settlement_method == ''){
					this.$message.warning('请输入结算方式!');
				}else{
					if(this.type == '1'){		//添加
						resource.supplierAdd(this.info).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.show_dialog = false;
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{		//编辑
						resource.supplierEdit(this.info).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.show_dialog = false;
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			}	
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-top: 15px;
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
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