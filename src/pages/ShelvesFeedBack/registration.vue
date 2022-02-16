<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-input clearable v-model="ksbm" placeholder="款式编码"></el-input>
			</el-form-item>
			<el-form-item label="查询时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"  :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" size="small" @click="show_dialog = true" v-if="button_list.export == 1">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="add_time" show-overflow-tooltip label="提交日期" align="center"></el-table-column>
			<el-table-column prop="ksbm" show-overflow-tooltip label="线上款式编码" align="center"></el-table-column>
			<el-table-column prop="dpysgg" show-overflow-tooltip label="下架颜色尺码" align="center"></el-table-column>
			<el-table-column prop="off_reason" show-overflow-tooltip label="下架原因" align="center"></el-table-column>
			<el-table-column prop="tjr" label="提交人" align="center"></el-table-column>
			<el-table-column label="操作" align="center" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="showDetail(scope.row.id)" v-if="scope.row.status == 1">录入</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
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
		<!-- 录入 -->
		<el-dialog title="录入" :close-on-click-modal="false" @close="closeDialog" :visible.sync="show_row_dialog">
			<el-form size="small">
				<el-form-item label="店铺名称：" required>
					<el-select v-model="editArg.dpmc" clearable :popper-append-to-body="false" filterable placeholder="全部">
						<el-option v-for="item in store_list" :key="item.jst_code" :label="item.shop_name" :value="item.jst_code">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="商品ID：" required>
					<el-tag
					:key="tag"
					v-for="tag in dpksbm_list"
					closable
					:disable-transitions="false"
					@close="handleClose(tag)">
					{{tag}}
				</el-tag>
				<el-input
				class="input-new-tag"
				v-if="inputVisible"
				v-model="inputValue"
				ref="saveTagInput"
				size="small"
				@keyup.enter.native="handleInputConfirm"
				@blur="handleInputConfirm"
				>
			</el-input>
			<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增</el-button>
		</el-form-item>
		<el-form-item label="执行结果：">
			<el-select v-model="editArg.zxjg" :popper-append-to-body="false" placeholder="请选择">
				<el-option label="请选择" :value="0" disabled></el-option>
				<el-option label="已下架" :value="1"></el-option>
				<el-option label="不下架" :value="2"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="情况说明：" :required="editArg.zxjg == 2">
			<el-input type="textarea" :rows="2" style="width: 300px" placeholder="请输入情况说明" v-model="editArg.qksm">
			</el-input>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="show_row_dialog = false">取 消</el-button>
		<el-button size="small" type="primary" @click="commitFun">确认</el-button>
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
.el-tag + .el-tag {
	margin-left: 10px;
}
.button-new-tag {
	margin-left: 10px;
	height: 32px;
	line-height: 30px;
	padding-top: 0;
	padding-bottom: 0;
}
.input-new-tag {
	width: 90px;
	margin-left: 10px;
	vertical-align: bottom;
}
</style>
<script>
	import resource from '../../api/shelvesResource.js'
	import {exportPost} from '../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				page:1,
				pagesize:15,
				ksbm:"",									//款式编码
				date:[getCurrentDate(),getNowDate()],		//查询日期
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
				dataObj:{},									//返回数据
				button_list:{},
				show_dialog:false,							//导入
				store_list:[],								//所有店铺列表
				show_row_dialog:false,						//录入的弹窗
				dpksbm_list:[],								//所有的商品ID
				dpksbm:[],
				inputVisible:false,
				inputValue:"",
				editArg:{
					id:"",
					zxjg:"",
					qksm:"",
					dpmc:"",
					
				},											//子列表编辑的参数
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			handleClose(tag) {
				this.dpksbm_list.splice(this.dpksbm_list.indexOf(tag), 1);
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},
			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dpksbm_list.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//下载模版
			downTemplate(){
				window.open('https://img.gxk8090.com/%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF.xlsx');
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.offShelfExport({file:files[0],from:this.from}).then(res => {
						this.$refs.csvUpload.value = null;
						this.show_dialog = false;
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
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:this.ksbm,
						add_time:this.date && this.date.length > 0?this.date[0]:"",
						end_date:this.date && this.date.length > 0?this.date[1]:"",
					}
					resource.exportUnique(arg).then(res => {
						exportPost("\ufeff" + res.data,'下架款登记-去重');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//点击主列表的录入
			showDetail(id){
				this.getStoreList();
				this.show_row_dialog = true;
				this.editArg.id = id;
			},
			//获取店铺列表
			getStoreList(){
				resource.ajaxShops().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭弹窗
			closeDialog(){
				this.editArg.dpmc = "";
				this.dpksbm_list = [];
				this.inputValue = "";
				this.editArg.zxjg = "";
				this.editArg.qksm = "";
			},
			//提交
			commitFun(){
				if(this.editArg.dpmc.length == 0){
					this.$message.warning('请选择店铺名称');
					return;
				}
				if(this.dpksbm_list.length == 0){
					this.$message.warning('请输入商品ID');
					return;
				}
				if(this.editArg.zxjg == 2 && this.editArg.qksm == ''){
					this.$message.warning('请输入情况说明');
					return;
				}
				this.editArg.dpksbm = this.dpksbm_list.join(',');
				resource.offshelfAdd(this.editArg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_row_dialog = false;
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				let arg = {
					ksbm:this.ksbm,
					add_time:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
				}
				resource.offShelfDjList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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

		}
	}
</script>