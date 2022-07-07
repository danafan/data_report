<template>
	<div>
		<condition page_type="6" @callBack="searchFun"/>
		<div class="buts">
			<div style="display:flex">
				<el-button type="primary" size="mini" @click="customFun">自定义列表</el-button>
				<el-button type="primary" plain size="mini" @click="showSearch = true">批量查询款式编码<i class="el-icon-search el-icon--right"></i></el-button>
			</div>
			<div style="display:flex">
				<el-button type="primary" plain size="mini" @click="exportFile" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
				<el-button type="primary" plain size="mini" @click="decisionAdd" v-if="button_list.add_decision == 1">导入决策管理<i class="el-icon-download"></i></el-button>
			</div>
		</div>
		<el-table ref="multipleTable" max-height="800" size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
			<el-table-column :label="item.row_name" :prop="item.row_field_name" :sortable="item.is_sort == 1" :width="maxWidth(item.row_field_name,item.is_edit)" align="center" v-for="item in dataObj.title_list" show-overflow-tooltip :fixed="isFixed(item.row_field_name)">
				<template slot-scope="scope">
					<!-- 编辑框 -->
					<el-input v-model="scope.row[item.row_field_name]" size="mini" type="text" style='width: 100px' :placeholder="item.row_name" :disabled="scope.row.edit_status == 0 || button_list.edit != 1" v-if="item.is_edit == 1 && item.row_field_name != 'sjxjrq' && item.row_field_name != 'tp' && item.row_field_name != 'sjhpxz' && item.row_field_name != 'ksbm'" @change="editFun($event,item.row_field_name,scope.row.ksbm)"></el-input>
					<!-- 下钻 -->
					<el-tooltip placement="top-end" v-else-if="item.row_field_name == 'ksbm' && button_list.detail == 1">
						<div slot="content">
							<el-button type="text" size="mini" @click="getDetail(scope.row.ksbm)">下钻</el-button>
						</div>
						<div style="color: #1890FF">{{scope.row[item.row_field_name]}}</div>
					</el-tooltip>
					<!--  实际下架日期 -->
					<el-date-picker
					@change="editFun($event,item.row_field_name,scope.row.ksbm)"
					v-else-if="item.row_field_name == 'sjxjrq'"
					v-model="scope.row.sjxjrq"
					:disabled="scope.row.edit_status == 0 || button_list.edit != 1"
					type="date"
					clearable
					value-format="yyyy-MM-dd"
					placeholder="选择日期"
					size="mini"
					></el-date-picker>
					<!-- 实际货品性质 -->
					<el-select 
					v-model="scope.row.sjhpxz" 
					@change="editFun($event,item.row_field_name,scope.row.ksbm)" 
					v-else-if="item.row_field_name == 'sjhpxz'"
					:disabled="scope.row.edit_status == 0 || button_list.edit != 1" 
					clearable 
					size="mini"
					placeholder="全部">
					<el-option label="试" value="1"></el-option>
					<el-option label="补" value="2"></el-option>
					<el-option label="停" value="3"></el-option>
					<el-option label="清" value="4"></el-option>
				</el-select>
				<!-- 图片 -->
				<img class="table_img" :src="scope.row[item.row_field_name]" v-else-if="item.row_field_name == 'tp'" @click="bigImg(scope.row[item.row_field_name])">
				<div v-else>{{scope.row[item.row_field_name]}}</div>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="dataObj.total"
		>
	</el-pagination>
</div>
<!-- 自定义列表 -->
<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
	<div class="select_box">
		<el-checkbox-group v-model="row_ids">
			<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in dataObj.view_row">{{item.row_name}}</el-checkbox>
		</el-checkbox-group>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button size="mini" @click="Restore">恢复默认</el-button>
		<el-button size="mini" @click="show_custom = false">取消</el-button>
		<el-button size="mini" type="primary" @click="setColumns">保存</el-button>
	</div>
</el-dialog>
<!-- 下钻 -->
<el-dialog title="款式信息" @close="closeDetail" :visible.sync="detailDialog">
	<el-table :data="detailData.data" size="mini">
		<el-table-column width="160" align="center" label="商品ID">
			<template slot-scope="scope">
				<el-tooltip placement="top-end">
					<div slot="content">
						<el-button type="text" size="mini" @click="openWindow(scope.row.spid_url)">查看商品</el-button>
					</div>
					<div style="color: #1890FF">{{scope.row.spid}}</div>
				</el-tooltip>
			</template>
		</el-table-column>
		<el-table-column width="160" show-overflow-tooltip align="center" property="dpid" label="店铺ID"></el-table-column>
		<el-table-column width="120" align="center" property="xsxz" label="销售性质"></el-table-column>
		<el-table-column width="120" align="center" property="spid_qtxl" label="商品ID7天销量"></el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="detailSizeChange"
		@current-change="detailCurrentChange"
		:current-page="detail_page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="detailData.total"
		>
	</el-pagination>
</div>
</el-dialog>
<!-- 批量查询商品编码 -->
<el-dialog title="数据查询" :visible.sync="showSearch">
	<div>
		<div>导入编辑好的Excel表格</div>
		<div class="toast_text">请以"款式编码"为第一行，在第一列填写相应编码</div>
		<img class="model_img" src="../../../static/model_img.png">
		<div>
			<div class="imgBox" v-if="filename == ''">
				<div class="text">请选择上传文件</div>
				<input type="file" ref="fileUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadFn">
			</div>
			<div class="file_name_box" v-else>
				<div class="file_name">{{filename}}</div>
				<i class="el-icon-circle-close" @click="deleteFile"></i>
			</div>
		</div>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button size="mini" @click="showSearch = false">取消</el-button>
		<el-button size="mini" type="primary" @click="allSearch">批量查询</el-button>
	</div>
</el-dialog>
<!-- 图片放大 -->
<el-dialog
title="图片"
:visible.sync="imageDialog"
width="30%"
center>
<img class="big_img" :src="big_img_url">
<span slot="footer" class="dialog-footer">
	<el-button type="primary" @click="imageDialog = false">关闭</el-button>
</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.table_img{
	width: 30px;
	height: 30px;
}
.imgBox{
	margin-top: 8px;
	background: #fff;
	display: flex;
	align-items:center;
	justify-content:center;
	width: 106px;
	height: 30px;
	border-radius: 2px;
	border: 1px solid #E0E0E0;
	position: relative;
	.text{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 30px;
		font-size: 13px;
		color: #666666;
	}
	.upload_file {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
.file_name_box{
	display: flex;
	align-items: center;
	border-radius: 2px;
	border: 1px solid #E0E0E0;
	width: 206px;
	height: 30px;
	padding-left: 10px;
	padding-right: 10px;
	.file_name{
		margin-right: 10px;
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 30px;
		font-size: 13px;
		color: #666666;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
}
.toast_text{
	margin-top: 10px;
	color: red;
}
.model_img{
	margin-top: 10px;
	margin-bottom: 30px;
	width: 160px;
}
.big_img{
	width: 100%;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {exportPost} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	import condition from '../../../components/condition.vue'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				req:{},										//请求参数
				sort:"",
				sort_type:"",
				show_custom:false,							//自定义列表
				dataObj:{},
				row_ids:[],
				detailDialog:false,							//下钻
				detailData:{},								//下钻获取的列表
				ksbm:"",									//下钻的款式编码
				detail_page:1,
				detail_page_size:10,
				showSearch:false,							//批量查询弹框是否显示
				filename:'',								//已上传的文件名
				all_search:false,							//是否是批量查询
				imageDialog:false,							//是否显示放大图片弹框
				big_img_url:"",								//放大的图片地址
				button_list:{}
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//放大图片
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
			},
			//排序
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				this.getList();
			},
			//导入到决策管理
			decisionAdd(){
				this.$confirm('确认导入到决策管理?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.req.flag = this.all_search == true?1:0;
					this.req.sort = this.sort;
					this.req.sort_type = this.sort_type;
					resource.decisionAdd(this.req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			// 上传文件
			uploadFn(){
				if (this.$refs.fileUpload.files.length > 0) {
					var file = this.$refs.fileUpload.files[0];
					this.filename = file.name;
					this.file = file;
				}
			},
			//删除文件
			deleteFile(){
				this.filename = '';
				this.file = null;
			},
			//按条件查询
			searchFun(req){
				this.page = 1;
				this.all_search = false;
				this.req = req;
				//获取列表
				this.getList();
			},
			//批量查询
			allSearch(){
				if(!this.file){
					this.$message.warning('请先上传文件');
					return;
				}
				this.page = 1;
				this.all_search = true;
				this.req = {
					file:this.file
				}
				//获取列表
				this.getList();
			},
			//导出
			exportFile(){
				this.req.flag = this.all_search == true?1:0;
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.ksbmExport(this.req).then(res => {
						exportPost("\ufeff" + res.data,'商品信息管理');
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
				this.req.flag = this.all_search == true?1:0;
				this.req.pagesize = this.pagesize;
				this.req.page = this.page;
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				resource.decisionSku(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						this.button_list = this.dataObj.button_list;
						this.showSearch = false;
						this.show_custom = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//设置自定义列
			setColumns(){
				resource.setColumns({menu_id:'30',row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
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
			//下钻
			getDetail(ksbm){
				this.ksbm = ksbm;
				let sort_obj = {
					page:this.detail_page,
					pagesize:this.detail_page_size
				}
				//获取下钻内容
				this.getDetailList(sort_obj);
			},
			//获取下钻内容
			getDetailList(sort_obj){
				let req = {...{
					ks:this.ksbm
				},...sort_obj}
				resource.skuDetail(req).then(res => {
					if(res.data.code == 1){
						this.detailData = res.data.data;
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭
			closeDetail(){
				this.detail_page_size = 10;
				this.detail_page = 1;
			},
			//分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				let sort_obj = {
					page:this.detail_page,
					pagesize:this.detail_page_size
				}
				//获取列表
				this.getDetailList(sort_obj);
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				let sort_obj = {
					page:this.detail_page,
					pagesize:this.detail_page_size
				}
				//获取列表
				this.getDetailList(sort_obj);
			},
			//跳转页面
			openWindow(spid_url){
				window.open(spid_url);
			},
			//自定义列表
			customFun(){
				this.show_custom = true;
				this.row_ids = this.dataObj.selected_ids;
			},
			//恢复默认
			Restore(){
				this.row_ids = [];
				this.dataObj.view_row.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			//编辑某一个input
			editFun(e,name,ksbm){
				let req = {
					name:name,
					content:e,
					ks:ksbm
				}
				resource.editSku(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//宽度
			maxWidth(row_field_name,is_edit){
				if(row_field_name == 'spbmgh' || row_field_name == 'cpjglx' || row_field_name == 'tlrjxl' || row_field_name == 'sjxjrq'||row_field_name == 'txbtdltjwxl' || row_field_name == 'txbtdlxl'){
					return 260;
				}else if(is_edit == 1){
					return 160;
				}else{
					return 120;
				}
			},
			isFixed(row_field_name){
				if(row_field_name == 'ksbm' || row_field_name == 'gyshh' || row_field_name == 'xb'){
					return true;
				}
			}
		},
		components:{
			condition
		}
	}
</script>