<template>
	<div>
		<el-button icon="el-icon-arrow-left" size="small" @click="$router.go(-1)">返回</el-button>
		<!-- 进度管理 -->
		<el-card v-if="!!headerObj.start_time">
			<div class="title">进度管理</div>
			<div class="desc">开始时间：{{headerObj.start_time}} &nbsp&nbsp&nbsp 截止时间：无</div>
			<div class="progress_content">
				<div class="progress_item">
					<div class="item_title">完成进度</div>
					<div class="item_content">
						<div class="content_text">{{headerObj.percent}}%</div>
					</div>
				</div>
				<div class="status_content">
					<div class="progress_item status_back">
						<div class="item_title">指定填写人</div>
						<div class="item_content">
							<div class="content_text">{{headerObj.total_num}}</div>
							<div class="ren">人</div>
							<el-button class="get_button" type="text" @click="getDetail">查看进度详情</el-button>
						</div>
					</div>
					<div class="line"></div>
					<div class="progress_item status_back">
						<div class="item_title">已提交</div>
						<div class="item_content">
							<div class="content_text">{{headerObj.write_num}}</div>
							<div class="ren">人</div>
						</div>
					</div>
					<div class="line"></div>
					<div class="progress_item status_back">
						<div class="item_title">未提交</div>
						<div class="item_content">
							<div class="content_text">{{headerObj.undo_num}}</div>
							<div class="ren">人</div>
						</div>
					</div>
				</div>
			</div>
		</el-card>
		<!-- 表单数据 -->
		<el-card style="margin-top: 15px">
			<div class="form_data_title">
				<div class="title">表单数据</div>
				<div class="desc form_desc">（全部数据：{{tableObj.info.total_num}}条，今日提交数据：{{tableObj.info.today_num}}条）</div>
			</div>
			<!-- 按钮部分 -->
			<div style="margin-top: 15px">
				<el-button-group v-if="tableObj.info.status == '1' || (tableObj.info.status == '0' && tableObj.info.user_type != '3')">
					<el-button type="primary" plain icon="el-icon-delete" size="small" :disabled="multipleSelection.length == 0" @click="delData">删除</el-button>
					<el-button type="primary" plain icon="el-icon-brush" size="small" @click="clearData">清空</el-button>
				</el-button-group>
				&nbsp
				<el-button-group v-if="tableObj.info.status == '1' || (tableObj.info.status == '0' && tableObj.info.user_type != '3')">
					<el-button type="primary" plain icon="el-icon-plus" size="small" @click="addData">添加</el-button>
					<el-button type="primary" plain icon="el-icon-download" size="small" @click="allAddData">批量添加</el-button>
				</el-button-group>
				&nbsp
				<el-button type="primary" plain icon="el-icon-upload2" size="small" @click="exportTable">导出</el-button>
				<el-button type="primary" plain icon="el-icon-refresh-right" size="small" @click="searchTableList">刷新</el-button>
			</div>
			<!-- 筛选条件 -->
			<div class="req_box">
				<div class="input_row" v-for="(i,index) in selected_filter_list">
					<!-- 文本或数字 -->
					<el-input :type="i.type" placeholder="请输入关键词搜索" size="small" style="width: 320px" v-model="i.value" class="input-with-select" v-if="i.type == 'text' || i.type == 'number'">
						<el-select v-model="i.select_column_name" size="small" style="width: 120px" slot="prepend" :popper-append-to-body="false" @change="selectChange">
							<el-option v-for="item in filter_list" :key="item.column_name" :label="item.title" :value="item.column_name" :disabled="item.is_disabled">
							</el-option>
						</el-select>
						<el-button slot="append" size="small" icon="el-icon-search" @click="searchTableList"></el-button>
					</el-input>
					<!-- 日期 -->
					<div class="date_row" v-else>
						<el-select v-model="i.select_column_name" size="small" style="width: 120px" slot="prepend" :popper-append-to-body="false" @change="selectChange">
							<el-option v-for="item in filter_list" :key="item.column_name" :label="item.title" :value="item.column_name" :disabled="item.is_disabled">
							</el-option>
						</el-select>
						<el-date-picker
						size="small"
						v-model="i.value"
						type="daterange"
						value-format="yyyy-MM-dd"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
					<el-button slot="append" size="small" icon="el-icon-search" @click="searchTableList"></el-button>
				</div>
				<el-button type="text" size="small" style="margin-left: 5px" @click="delFilter(index)" :disabled="selected_filter_list.length == 1">删除</el-button>
				<el-button type="text" size="small" @click="addFliter">新增筛选项</el-button>
			</div>
		</div>
		<!-- 表格 -->
		<el-table ref="multipleTable" :data="tableObj.data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" style="width: 100%" @selection-change="handleSelectionChange" size="small">
			<el-table-column type="selection" width="55" fixed="left"></el-table-column>
			<el-table-column :prop="item.column_name" :label="item.title"v-for="item in tableObj.title_list"></el-table-column>
			<el-table-column label="操作" align="center" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editData(scope.row.id)" v-if="tableObj.info.status != '0' && tableObj.info.user_type != '3'">修改数据</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="tableObj.total">
			</el-pagination>
		</div>
	</el-card>
	<!-- 查看进度详情弹窗 -->
	<el-dialog title="进度详情" width="700px" :visible.sync="detail_dialog">
		<div class="detail_top">
			<el-button type="info" plain size="small" :disabled="detailObj.message_status == '0'" @click="send">提醒未提交人</el-button>
			<el-input placeholder="输入填写人进行搜索" style="width: 240px" v-model="fill_name" size="small" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="searchDetailList"></el-button>
			</el-input>
		</div>
		<el-table size="small" :data="detailObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="ding_user_name" label="填写人"></el-table-column>
			<el-table-column label="进展情况">
				<template slot-scope="scope">
					<div>{{scope.row.status == '1'?'已提交':'未提交'}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="add_time" label="提交时间"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="detailSizeChange" @current-change="detailCurrentChange" :current-page="detail_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="detailObj.total">
			</el-pagination>
		</div>
	</el-dialog>
	<!-- 添加/编辑数据 -->
	<el-dialog :title="data_dialog_type == '1'?'添加数据':'编辑数据'" width="700px" :visible.sync="data_dialog">
		<div class="data_dialog_desc">{{form_name}}</div>
		<div class="data_content">
			<el-form size="small" >
				<el-form-item :label="item.title" v-for="item in fields_list">
					<el-input type="text" placeholder="请输入文字" size="small" v-model="item.value" v-if="item.type == 'text'" style="width: 280px">
					</el-input>
					<el-input type="number" placeholder="请输入数字" size="small" v-model="item.value" v-if="item.type == 'number'" style="width: 280px">
					</el-input>
					<el-date-picker v-model="item.value" value-format="yyyy-MM-dd" type="date" placeholder="请选择日期" v-if="item.type == 'date'" style="width: 280px">
					</el-date-picker>
				</el-form-item>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="data_dialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitData">提交</el-button>
		</div>
	</el-dialog>
	<!-- 批量提交 -->
	<el-dialog title="批量提交" :visible.sync="all_dialog" :modal-append-to-body="false">
		<div>
			<el-button type="primary" plain icon="el-icon-download" size="small" @click="downTemplate">下载Excel模版</el-button>
			<div class="upload_box">
				<!-- 未上传 -->
				<div class="box_border" v-if="!files">
					<div class="upload_ele">
						<i class="el-icon-folder-opened" style="font-size: 32px"></i>
						<div>点击上传文件</div>
						<div>每次批量导入仅限10000行数据</div>
						<div style="font-size: 12px;color: red" v-if="is">如不能选择xlsx/xls文件，请在浏览器打开新窗口选择</div>
					</div>
					<input type="file" ref="csvUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" @change="uploadCsv">
				</div>
				<!-- 已上传 -->
				<div class="box_border" v-else>
					<div style="display:flex;align-items: center">
						<div>{{files.name}}</div>
						<i class="el-icon-circle-close" style="margin-left: 10px" @click="files = null"></i>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="all_dialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitAll">提交</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style scoped lang="less">
.title{
	font-size: 16px;
	font-weight: bold;
}
.desc{
	margin-top: 15px;
	color: #606266;
	font-size: 13px;
}
.progress_content{
	margin-top: 15px;
	display: flex;
	align-items: center;
	.progress_item{
		background: #ECEFF8;
		width: 25%;
		height: 100px;
		padding: 15px 25px;
		display:flex;
		flex-direction: column;
		justify-content: center;
		.item_title{
			font-size: 14px;
			font-weight: bold;
			margin-bottom: 10px;
		}
		.item_content{
			display:flex;
			align-items: flex-end;
			color: #606266;
			.content_text{
				position: relative;
				top: 5px;
				margin-right: 5px;
				font-size: 24px;
			}
			.ren{
				font-size: 10px;
			}
			.get_button{
				margin-left: 10px;
				position: relative;
				top: 10px;
				font-size: 10px;
			}
		}
	}
	.status_content{
		background: #ECEFF8;
		margin-left: 15px;
		flex:1;
		display:flex;
		.status_back{
			width: 33%;
		}
		.line{
			border-left:1px solid #606266;
			height: 40px;
			margin-top: 40px;
		}
	}
}
.form_data_title{
	display:flex;
	align-items: center;
	.form_desc{
		position: relative;
		top: -6px;
		margin-left: 15px;
	}
}
.detail_top{
	margin-bottom: 10px;
	display:flex;
	align-items: center;
	justify-content: space-between;
}
.req_box{
	margin-top: 30px;
	display:flex;
	flex-wrap: wrap;
	.input_row{
		margin-right: 15px;
		margin-bottom: 15px;
		display:flex;
	}
}
.data_dialog_desc{
	background: #606266;
	height: 38px;
	line-height: 38px;
	margin-bottom: 30px;
	color: #ffffff;
	font-weight: bold;
	padding-left: 15px;
}
.data_content{
	max-height: 500px;
	overflow-y: scroll;
}
.upload_box{
	background: #ECEFF8;
	border:1px solid #606266;
	border-radius: 5px;
	width: 100%;
	height: 180px;
	margin-top: 30px;
	padding:10px;
	.box_border{
		background:#ffffff;
		position: relative;
		border:1px dashed #606266;
		border-radius: 5px;
		width: 100%;
		height: 100%;
		display:flex;
		align-items: center;
		justify-content: center;
		.upload_ele{
			display:flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
		}
		.upload_file {
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
	import resource from '../../../api/formDataResource.js'
	import UpLoadFile from '../../../components/upload_file.vue'
	import {exportUp} from '../../../api/export.js'
	export default{
		data(){
			return{
				form_name:"",
				form_id:"",
				headerObj:{},				//数据管理头部信息
				detail_dialog:false,		//查看进度详情
				fill_name:"",				//填写人姓名
				detail_page:1,
				detail_page_size:10,
				detailObj:{},				//详情列表
				filter_list: [],			//所有参数列表
				selected_filter_list:[],	//已选的参数列表
				multipleSelection:[],		//已选的表格行
				tableObj:{
					data:[],
					info:{},
					title_list:[]
				},				//表格数据
				page:1,
				pagesize:10,
				data_dialog:false,			//添加/编辑数据弹窗
				data_dialog_type:'1',		//添加/编辑字段弹窗类型
				fields_list:[],				//添加/编辑字段列表
				id:"",						//点击的数据id
				all_dialog:false,			//批量添加
				files:null,					//上传的文件
				is:false
			}
		},
		created(){
			let query = this.$route.query;
			let form_name = this.$route.form_name;
			this.form_id = query.id;
			this.form_name = query.form_name;
			//数据管理头部信息
			this.formTableHearder();
			//获取筛选条件
			this.getFilter();
			//获取列表数据
			this.getData();
			this.isMac()
		},
		methods:{
			isMac() { 
				let is_ding_talk = this.$store.state.is_ding_talk
				let is_mac_os = /macintosh|mac os x/i.test(navigator.userAgent); 
				if(is_ding_talk == true && is_mac_os == true){
					this.is = true;
				}
			},
			//数据管理头部信息
			formTableHearder(){
				resource.formTableHearder({form_id:this.form_id}).then(res => {
					if(res.data.code == 1){
						this.headerObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//点击详情搜索
			searchDetailList(){
				this.detail_page = 1;
				//点击查看记录详情
				this.getDetail();
			},
			//点击查看记录详情
			getDetail(){
				let arg = {
					form_id:this.form_id,
					name:this.fill_name,
					page:this.detail_page,
					pagesize:this.detail_page_size
				}
				resource.processList(arg).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
						this.detail_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//详情分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				//获取列表
				this.getDetail();
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetail();
			},
			//获取筛选条件
			getFilter(){
				resource.formtableFilters({form_id:this.form_id}).then(res => {
					if(res.data.code == 1){
						let filter_list = res.data.data;
						filter_list.map(item => {
							item.value = "";
							item.select_column_name = item.column_name;
							item.is_disabled = false;
						})
						this.filter_list = filter_list;
						this.selected_filter_list.push(JSON.parse(JSON.stringify(filter_list[0])));
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换筛选项
			selectChange(){
				for(var i = 0; i < this.filter_list.length; i++){
					var column_name = this.filter_list[i].column_name;
					for(var j = 0; j < this.selected_filter_list.length; j++){
						var select_column_name = this.selected_filter_list[j].select_column_name;
						if(select_column_name == column_name){
							this.filter_list[i].is_disabled = true;
							this.selected_filter_list[j].type = this.filter_list[i].type;
							this.selected_filter_list[j].value = '';
							break;
						}else{
							this.filter_list[i].is_disabled = false;
						}
					}
				}
			},
			//删除筛选项
			delFilter(index){
				var select_column_name = this.selected_filter_list[index].select_column_name;
				for(var i = 0; i < this.filter_list.length; i++){
					if(this.filter_list[i].column_name == select_column_name){
						this.filter_list[i].is_disabled = false;
					}
				}
				this.selected_filter_list.splice(index,1);
			},
			//新增筛选项
			addFliter(){
				var result = [];
				for(var i = 0; i < this.filter_list.length; i++){
					var obj = this.filter_list[i];
					var column_name = obj.column_name;
					var isExist = false;
					for(var j = 0; j < this.selected_filter_list.length; j++){
						var aj = this.selected_filter_list[j];
						var select_column_name = aj.select_column_name;
						if(select_column_name == column_name){
							isExist = true;
							break;
						}
					}
					if(!isExist){
						result.push(JSON.parse(JSON.stringify(obj)));
					}else{
						obj.is_disabled = true;
					}
				}
				if(result.length > 0){
					this.selected_filter_list.push(result[0]);
					//处理下拉框禁用
					for(var i = 0; i < this.filter_list.length; i++){
						if(this.filter_list[i].column_name == result[0].column_name){
							this.filter_list[i].is_disabled = true;
						}
					}
				}else{
					this.$message.warning('没有更多了')
				}
			},
			//获取列表数据
			searchTableList(){
				this.page = 1;
				//获取列表数据
				this.getData();
			},
			//获取列表数据
			getData(){
				var arg = {
					form_id:this.form_id,
					page:this.page,
					pagesize:this.pagesize
				}
				this.selected_filter_list.map(item => {
					if(item.type != 'date' && item.value != ""){	
						arg[item.select_column_name] = item.value;
					}
					if(item.type == 'date' && item.value != '' && !!item.value){
						arg[item.select_column_name] = item.value[0] + '_' + item.value[1];
					}
				})
				resource.formTableList(arg).then(res => {
					if(res.data.code == 1){
						this.tableObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//表格分页
			handleSizeChange(val) {
				this.page_size = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//切换多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			//点击删除
			delData(){
				this.$confirm('确认删除该数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var ids = [];
					this.multipleSelection.map(item => {
						ids.push(item.id);
					});
					let arg = {
						form_id:this.form_id,
						del_ids:ids.join(',')
					}
					resource.formtableDel(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						//获取列表数据
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
			},
			//点击清空
			clearData(){
				this.$confirm('确认清除所有数据?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.formtableClear({form_id:this.form_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						//获取列表数据
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
			},
			//点击添加数据(get)
			addData(){
				this.data_dialog_type = '1';
				resource.formTableAddGet({form_id:this.form_id}).then(res => {
					if(res.data.code == 1){
						let fields_list = res.data.data.fields;
						fields_list.map(item => {
							item.value = "";
						})
						this.fields_list = fields_list;
						this.data_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击修改数据
			editData(id){
				this.data_dialog_type = '2';
				this.id = id;
				resource.formtableEditGet({form_id:this.form_id,id:this.id}).then(res => {
					if(res.data.code == 1){
						let fields_list = res.data.data.fields;
						this.fields_list = fields_list;
						this.data_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},	
			//添加提交
			commitData(){
				var arg = {form_id:this.form_id};
				var is_next = true;
				this.fields_list.map(item => {
					if(item.value == null || item.value == ''){
						this.$message.warning(`请填写${item.title}`);
						is_next = false;
						return;
					}else{
						arg[item.column_name] = item.value;
					}
				})
				if(!!is_next){
					if(is_next && this.data_dialog_type == '1'){	//创建
						resource.formTableAddPost(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取列表数据
								this.getData();
								this.data_dialog = false;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{	//修改
						arg.id = this.id;
						resource.formtableEditPost(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取列表数据
								this.getData();
								this.data_dialog = false;
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}

			},
			//点击批量添加
			allAddData(){
				this.files = null;
				this.all_dialog = true;
			},
			//下载模版
			downTemplate(){
				this.$confirm('确认下载模版?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					window.open(this.tableObj.info.domain + this.tableObj.info.excel_url)
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//上传表格
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files[0];
					this.files = files;
				}
			},
			//批量添加
			commitAll(){
				if(!this.files){
					this.$message.warning('请先上传文件!');
					return;
				}
				const loading = this.$loading({
					lock: true,
					text: '拼命加载中...',
					background: 'rgba(255, 255, 255, 0.6)',
					spinner: 'el-icon-loading'
				});
				let arg = {
					form_id:this.form_id,
					file:this.files
				}
				resource.formtableImport(arg).then(res => {
					loading.close();
					if(res.data.code == 1){
						this.all_dialog = false;
						this.page = 1;
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportTable(){
				exportUp(`formtable/export?form_id=${this.form_id}`);
			},
			//提醒未提交人
			send(){
				resource.formSend({form_id:this.form_id}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			}
		},
		components:{
			UpLoadFile
		}
	}
</script>