<template>
	<div>
		<condition page_type="4" @callBack="searchFun"/>
		<div class="table_setting">
			<div style="display:flex">
				<el-popover
				placement="right-start"
				:append-to-body="false"
				width="150"
				trigger="click">
				<div class="setStyle">
					<el-button type="primary" size="small" plain @click="setKs('1','试')" v-if="button_list.try == 1">试</el-button>
					<el-button type="primary" size="small" plain @click="setKs('2','补')" v-if="button_list.replenishment == 1">补</el-button>
				</div>
				<div class="setStyle">
					<el-button type="danger" size="small" plain @click="setKs('3','停')" v-if="button_list.stop == 1">停</el-button>
				</div>
				<el-button type="primary" size="small" slot="reference">批量设置</el-button>
			</el-popover>
			<el-button type="primary" plain size="small" style="margin-left: 10px" @click="showSearch = true">批量查询款式编码<i class="el-icon-search el-icon--right"></i></el-button>
		</div>
		<div class="buts">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="exportFile" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
	</div>
	<el-table ref="multipleTable" max-height="800" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
		<el-table-column :prop="item.row_field_name" :label="item.row_name" :width="item.row_field_name == 'bd' || item.row_field_name == 'sjxjrq'?260:120" :sortable="item.row_field_name == 'qtxl' || item.row_field_name == 'stxl' || item.row_field_name == 'replenish_num'?'custom':false" align="center" v-for="item in dataObj.title_list" show-overflow-tooltip :fixed="isFixed(item.row_field_name)">
			<template slot-scope="scope">
				<!-- 下钻 -->
				<el-tooltip placement="top-end" v-if="item.row_field_name == 'ksbm' && button_list.detail == 1">
					<div slot="content">
						<el-button type="text" size="small" @click="getDetail(scope.row.ksbm,scope.row.sjxrrq)">下钻</el-button>
					</div>
					<div style="color: #1890FF">{{scope.row[item.row_field_name]}}</div>
				</el-tooltip>
				<!--  实际下架日期 -->
				<el-date-picker
				@change="changeTime($event,scope.row.ksbm)"
				v-else-if="item.row_field_name == 'sjxjrq'"
				v-model="scope.row.sjxjrq"
				type="date"
				clearable
				:disabled="button_list.setxjrq != 1"
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				size="small"
				></el-date-picker>
				<!-- 图片 -->
				<img style="width: 80px;height: 80px" :src="scope.row.tp" v-else-if="item.row_field_name == 'tp'" @click="bigImg(scope.row.tp)">
				<div v-else>{{scope.row[item.row_field_name]}}</div>
			</template>
		</el-table-column>
		<el-table-column label="操作" align="center" width="180" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="setKs('1','试',scope.row.ksbm)" v-if="button_list.try == 1">试</el-button>
				<el-button type="text" size="small" @click="setKs('2','补',scope.row.ksbm)" v-if="button_list.replenishment == 1">补</el-button>
				<el-button type="text" size="small" @click="setKs('3','停',scope.row.ksbm)" v-if="button_list.stop == 1">停</el-button>
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
		<el-button size="small" @click="Restore">恢复默认</el-button>
		<el-button size="small" @click="show_custom = false">取消</el-button>
		<el-button size="small" type="primary" @click="setColumns">保存</el-button>
	</div>
</el-dialog>
<!-- 下钻 -->
<el-dialog title="款式信息" @close="closeDetail" :visible.sync="detailDialog">
	<el-table :data="detailData.data" size="small">
		<el-table-column width="120" align="center" property="spbm" label="商品编码"></el-table-column>
		<el-table-column align="center" property="jsfhdqtxl" label="七天销量"></el-table-column>
		<el-table-column align="center" property="kys" label="可用库存"></el-table-column>
		<el-table-column align="center" property="zts" label="在途数"></el-table-column>
		<el-table-column align="center" property="bhts" label="备货天数"></el-table-column>
		<el-table-column align="center" property="qzxs" label="权重系数"></el-table-column>
		<el-table-column align="center" property="jybhsl" label="补货数量"></el-table-column>
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
<!-- 图片放大 -->
<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
	<img style="width: 100%" :src="big_img_url">
	<span slot="footer" class="dialog-footer">
		<el-button type="primary" @click="imageDialog = false">关闭</el-button>
	</span>
</el-dialog>
<!-- 批量查询商品编码 -->
<el-dialog title="数据查询" :visible.sync="showSearch">
	<div>
		<div>导入编辑好的Excel表格</div>
		<div class="toast_text">请以"款式编码"为第一行，在第一列填写相应编码</div>
		<img class="model_img" src="../../static/model_img.png">
		<div>
			<div class="imgBox" v-if="filename == ''">
				<div class="text">请选择上传文件</div>
				<input type="file" ref="fileUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadFn" v-if="isMac">
				<input type="file" ref="fileUpload" class="upload_file" accept="application/vnd.ms-excel" @change="uploadFn" v-else/>
			</div>
			<div class="file_name_box" v-else>
				<div class="file_name">{{filename}}</div>
				<i class="el-icon-circle-close" @click="deleteFile"></i>
			</div>
		</div>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="showSearch = false">取消</el-button>
		<el-button size="small" type="primary" @click="allSearch">批量查询</el-button>
	</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	.buts{
		display: flex;
	}
}
.setStyle{
	height: 50px;
	display:flex;
	align-items: center;
	justify-content:space-around;
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
</style>
<script>
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import resource from '../../api/resource.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import condition from '../../components/condition.vue'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				req:{},											//请求参数
				dataObj:{},									//列表数据
				show_custom:false,							//自定义列表是否显示
				row_ids:[],									//选择的自定义列表id
				detailData:[],								//下钻信息
				sjxrrq:"",
				ksbm:"",
				detailDialog:false,			
				detail_page:1,
				detail_page_size:10,
				sort:"",
				sort_type:"",
				imageDialog:false,							//是否显示放大图片弹框
				big_img_url:"",								//放大的图片地址
				showSearch:false,							//批量查询弹框是否显示
				filename:'',								//已上传的文件名
				file:null,
				isMac:true,									//判断系统
				all_search:false,							//是否是批量查询
				button_list:{}
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//图片放大
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
			//修改实际下架日期
			changeTime(e,ksbm){
				let req = {
					ks:ksbm,
					xjrq:!e?'':e
				}
				resource.clearSetXjrq(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
					resource.clearExport(this.req).then(res => {
						exportPost("\ufeff" + res.data,'清理管理');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
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
			//获取列表
			getList(){		
				this.req.flag = this.all_search == true?1:0;
				this.req.pagesize = this.pagesize;
				this.req.page = this.page;
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				resource.clearList(this.req).then(res => {
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
				resource.setColumns({menu_id:'21',row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//设置
			setKs(type,title,ksbm){
				var req = {};
				if(!ksbm){
					let allSet = this.req;
					allSet.flag = this.all_search?'3':'1';
					allSet.from = '4';
					req = allSet;
				}else{
					req.ks = ksbm;
					req.flag = '2';
				}
				//1:试；2:补；3:停
				this.$prompt('请输入原因', `货品性质确定转为${title}么？想好哦！`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					if(!value){
						this.$message.warning('请输入原因');
						return;
					}
					req.remark = value;
					if(type == '1'){
						resource.clearTry(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '2'){
						resource.clearReplenish(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '3'){
						resource.clearStop(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
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
			//下钻
			getDetail(ksbm,sjxrrq){
				this.ksbm = ksbm;
				this.sjxrrq = sjxrrq;
				//获取下钻内容
				this.getDetailList();
			},
			//获取下钻内容
			getDetailList(){
				let req = {
					day:this.sjxrrq,
					ks:this.ksbm,
					page:this.detail_page,
					page_size:this.detail_page_size
				}
				resource.clearDetail(req).then(res => {
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
				//获取列表
				this.getDetailList();
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetailList();
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