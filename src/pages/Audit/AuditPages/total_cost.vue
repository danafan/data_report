<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline" v-if="user_type != '1'">
			<el-form-item label="新编码：">
				<el-select v-model="select_ksbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入新编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商款号：">
				<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商款号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="user_type != '4'">
				<el-checkbox v-model="is_zero_batch">零批发价</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="upload_box" v-if="user_type != '1' && user_type != '4'">
				<el-button type="primary" size="small">
					导入
					<i class="el-icon-upload el-icon--right"></i>
				</el-button>
				<input type="file" ref="csvUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
			</div>
			<el-button type="primary" size="small" @click="replaceDialog = true" v-if="user_type != '1' && user_type != '4'">一键替换</el-button>
			<el-button type="primary" plain size="small" @click="exportDialog = true">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="index" label="序号" align="center" fixed="left">
			</el-table-column>
			<el-table-column prop="launch_day" label="上新时间" width="120" align="center"></el-table-column>
			<el-table-column prop="supplier" label="供应商" width="120" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" width="120" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" width="120" align="center"></el-table-column>
			<el-table-column label="批发价" width="120" align="center">
				<template slot-scope="scope">
					<el-input size="small" type="number" v-model="scope.row.batch_price" @change="editFun('batch_price',scope.row.id,scope.row.batch_price)" placeholder="输入批发价" :disabled="user_type == '1' || user_type == '4'"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="cb_price" label="成本价" width="120" align="center"></el-table-column>
			<el-table-column prop="difference" label="差值" width="120" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="是否特批" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_special == '0'?'否':scope.row.is_special == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="是否福袋款" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_blessingbag == '0'?'否':scope.row.is_blessingbag == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" v-if="user_type != '1'">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.remark" @change="editFun('remark',scope.row.id,scope.row.remark)" maxlength="20"
					show-word-limit placeholder="请输入备注" :disabled="user_type == '4'"></el-input>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 替换弹框 -->
		<el-dialog title="替换供应商" center @close="closeDialog" width="45%" :close-on-click-modal="false" :visible.sync="replaceDialog">
			<div class="dialog_row">
				<el-select v-model="old_gys" size="small" clearable :popper-append-to-body="false" filterable remote placeholder="搜索原供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
				<div class="connect_line">-----></div>
				<el-input placeholder="输入新供应商" v-model="new_gys" size="small" style="width: 180px">
				</el-input>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="replaceDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitReplace">确认替换</el-button>
			</div>
		</el-dialog>
		<!-- 导出弹框 -->
		<el-dialog title="导出" center @close="closeDialog" width="45%" :close-on-click-modal="false" :visible.sync="exportDialog">
			<el-form size="small">
				<el-form-item label="导出类型：">
					<el-radio-group v-model="export_type">
						<el-radio :label="1">全部</el-radio>
						<el-radio :label="2">选择时间导出</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="时间区间（按上线时间）：" v-if="export_type == 2">
					<el-date-picker size="small" v-model="export_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="exportDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitExport">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.dialog_row{
	display:flex;
	align-items: center;
	justify-content: center;
	.connect_line{
		margin-left: 10px;
		margin-right: 10px;
	}	
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
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {exportUp} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				gyshh_list:[],			//所有供应商款号
				select_gyshh_ids:[],	//选中的供应商款号
				gys_list:[],			//所有供应商列表
				select_gys_ids:[],		//选中的供应商列表
				is_zero_batch:false,	//是否零批发价
				dataObj:{},				//返回数据
				replaceDialog:false,	//替换供应商弹框
				old_gys:"",				//原供应商
				new_gys:"",				//新供应商
				exportDialog:false,		//导出弹框
				export_type:1,			//导出类型
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
				},	 					//时间区间
				export_date:[],			//导出日期区间
				user_type:"",
			}
		},
		created(){
			this.user_type = localStorage.getItem('user_type');
			//获取列表
			this.getData();
		},
		methods:{
			//款式编码列表
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ksbm_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxSupplierKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商
			getGys(e){
				if(e != ''){
					resource.ajaxSupplier({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//搜索
			getList(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					supplier_ksbm:this.select_gyshh_ids.join(','),
					supplier:this.select_gys_ids.join(','),
					is_zero_batch:!this.is_zero_batch?0:1,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.totalAudit(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//修改批发价/备注
			editFun(type,id,value){
				let arg = {
					id:id
				}
				arg[type] = value;	
				if(type == 'batch_price'){		//修改批发价
					this.$confirm('确认更改当前记录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.editBatch(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取列表
								this.getData();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消'
						});          
					});
				}else{						//修改备注
					resource.editRemark(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
			//关闭替换弹框
			closeDialog(){
				this.old_gys = '';
				this.new_gys = '';
				this.export_type = 1;
				this.export_date = [];
			},
			//提交替换
			commitReplace(){
				if(this.old_gys == ''){
					this.$message.warning('请选择原供应商');
				}else if(this.new_gys == ''){
					this.$message.warning('请输入新供应商');
				}else{
					let arg = {
						old_supplier:this.old_gys,
						new_supplier:this.new_gys
					}
					resource.editSupplier(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.replaceDialog = false;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				};
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.importGoods({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			commitExport(){
				if(this.export_type == 2 && (!this.export_date || this.export_date.length == 0)){	//按时间导出
					this.$message.warning('请选择导出时间！');
				}else{
					//导出
					var arr = [];
					let arg = {
						start_date:this.export_date && this.export_date.length> 0?this.export_date[0]:"",
						end_date:this.export_date && this.export_date.length> 0?this.export_date[1]:""
					}
					for(var item in arg){
						let str = item + '=' + arg[item];
						arr.push(str);
					};
					exportUp(`audit/total_export?${arr.join('&')}`);
					this.exportDialog = false;
				}
			}
		}
	}
</script>










