<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="提交人：">
				<el-input clearable v-model="tjr" placeholder="提交人"></el-input>
			</el-form-item>
			<el-form-item label="日期区间：">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="batchDelete" v-if="dataObj.button_list.export == 1">删除<i class="el-icon-delete el-icon--right"></i></el-button>
			<el-button type="primary" plain size="small" @click="commitExport" v-if="dataObj.button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
			<el-button type="primary" size="small" @click="show_dialog = true" v-if="dataObj.button_list.import == 1">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading" @selection-change="handleSelectionChange">
			<el-table-column
			type="selection"
			width="55">
		</el-table-column>
		<el-table-column show-overflow-tooltip prop="ksbm" label="线上款式编码" align="center"></el-table-column>
		<el-table-column show-overflow-tooltip prop="dpysgg" label="下架颜色尺码" align="center"></el-table-column>
		<el-table-column show-overflow-tooltip prop="off_reason" label="下架原因" align="center"></el-table-column>
		<el-table-column show-overflow-tooltip prop="tjr" label="提交人" align="center"></el-table-column>
		<el-table-column show-overflow-tooltip prop="add_time" label="提交时间" align="center"></el-table-column>
		<el-table-column label="操作" align="center" width="120" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="delOffKsbm(scope.row.id)" v-if="dataObj.button_list.del_ksbm == 1">删除</el-button>
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
</style>
<script>
	import commonResource from '../../../api/resource.js'
	import resource from '../../../api/shelvesResource.js'
	import {exportPost} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				page:1,
				pagesize:15,
				tjr:"",										//提交人
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
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
				},	 					  //时间区间
				dataObj:{
					button_list:{}
				},											//返回数据
				show_dialog:false,							//导入弹窗
				loading:false,
				selected_ids:[],							//勾选的列表
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					commonResource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/下架登记数据模板.xlsx`);
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.offShelfExport({file:files[0]}).then(res => {
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
						tjr:this.tjr,
						ksbm:this.select_ks_ids.join(','),
						start_date:this.date && this.date.length > 0?this.date[0]:"",
						end_date:this.date && this.date.length > 0?this.date[1]:""
					}
					resource.exportUnique(arg).then(res => {
						exportPost("\ufeff" + res.data,'下架款登记');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});
				});
			},
			//获取列表
			getList(){
				let arg = {
					tjr:this.tjr,
					ksbm:this.select_ks_ids.join(','),
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
				}
				this.loading = true;
				resource.offShelfDjList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//监听切换多选
			handleSelectionChange(val) {
				this.selected_ids = val.map(item => {
					return item.id;
				})
			},
			//批量删除
			batchDelete(){
				if(this.selected_ids.length == 0){
					this.$message.warning('请先勾选数据!')
				}else{
					//删除下架款
					this.delOffKsbm(this.selected_ids.join(','))
				}
			},
			//删除下架款
			delOffKsbm(id){
				MessageBox.confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delOffKsbm({id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消删除'
					});          
				});
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
