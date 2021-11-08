<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
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
			<el-form-item>
				<el-checkbox v-model="is_off_shelf">已下架</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="exportTable">全部导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" :row-class-name="tableRowClassName">
			<el-table-column type="index" label="序号" align="center" fixed="left"></el-table-column>
			<el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" align="center"></el-table-column>
			<el-table-column prop="kjs_shop_name" label="店铺" align="center"></el-table-column>
			<el-table-column prop="platform" label="平台" width="120" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="是否特批" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_special == '0'?'否':scope.row.is_special == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="batch_price" label="批发价" width="120" align="center">
			</el-table-column>
			<el-table-column prop="cb_price" label="成本价" align="center"></el-table-column>
			<el-table-column label="操作" align="center" width="120">
				<template slot-scope="scope">
					<div v-if='scope.row.is_off_shelf == 0'>
						<el-button type="text" size="small" @click="getDetail(scope.row.id)">调价</el-button>
						<el-button type="text" size="small" @click="shelveFun(scope.row.id)">下架</el-button>
					</div>
					<el-button type="text" size="small" @click="upCliFun(scope.row.id)" v-else>上架</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 详情弹框 -->
		<el-dialog title="调价信息" center @close="closeDialog" :close-on-click-modal="false" :visible.sync="detailDialog">
			<el-form size="small" class="demo-form-inline">
				<el-form-item label="供应商：">
					<div>{{detailObj.supplier}}</div>
				</el-form-item>
				<el-form-item label="供应商款号：">
					<div>{{detailObj.supplier_ksbm}}</div>
				</el-form-item>
				<el-form-item label="店铺：">
					<div>{{detailObj.kjs_shop_name}}</div>
				</el-form-item>
				<el-form-item label="平台：">
					<div>{{detailObj.platform}}</div>
				</el-form-item>
				<el-form-item label="新编码：">
					<div>{{detailObj.ksbm}}</div>
				</el-form-item>
				<el-form-item label="是否特批：" required>
					<el-radio-group v-model="is_special">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="批发价：">
					<div>{{detailObj.batch_price}}</div>
				</el-form-item>
				<el-form-item label="成本价：">
					<div>{{detailObj.cb_price}}</div>
				</el-form-item>
				<el-form-item label="更新后成本价：" required>
					<el-input v-model="price" type="number" size="small" style="width: 120px" placeholder="请输入价格"></el-input>
				</el-form-item>
				<el-form-item label="上传附件：">
					<div class="img_list">
						<UploadFile @callbackFn="uploadCsv" :is_csv="true" v-if="url == ''"/>
						<div style="display:flex;align-items: center" v-else>
							<div>{{url}}</div>
							<i class="el-icon-circle-close" style="margin-left: 10px" @click="deteleFile(url)"></i>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="上传图片：">
					<div class="img_list">
						<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
							<img class="img" :src="item.domain + item.urls">
							<div class="modal" v-if="item.is_del == true">
								<img src="../../../static/deleteImg.png" @click="deteleFile(item.urls,index)">
							</div>
						</div>
						<UploadFile @callbackFn="uploadFile" :current_num="show_img.length" v-if="show_img.length < 9"/>
					</div>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input type="textarea" :rows="3" style="width: 260px" placeholder="请输入备注" v-model="remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="detailDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitAduit">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.img_list{
	display:flex;
	flex-wrap: wrap;
	.dialog_img{
		margin-right: 10px;
		margin-bottom: 10px;
		position: relative;
		width: 120px;
		height: 120px;
		.img{
			width: 100%;
			height: 100%;
		}
		.modal{
			background: rgba(0,0,0,.6);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			img{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				display:block;
				width: 30px;
				height: 30px;
			}
		}
	}
}
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.upload_file{
	border:1px solid red;
	position: relative;
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
</style>
<style type="text/css">
.el-table .warning-row {
	background: #F56C6C;
	color: #333333;
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import UploadFile from '../../../components/upload_file.vue'
	import {exportUp} from '../../../api/export.js'
	import * as dd from 'dingtalk-jsapi';
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				gyshh_list:[],			//所有供应商款号
				select_gyshh_ids:[],	//选中的供应商款号
				is_off_shelf:false,		//是否已下架
				dataObj:{},				//返回数据
				detailDialog:false,		//基本信息弹框
				detailObj:{},
				is_special:0,			//是否特批
				price:"",				//更新后成本价
				remark:"",				//备注
				show_img:[],			//显示的图片
				domain:"",				//文件前缀
				url:""					//csv后缀
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			// 超时高亮提示
			tableRowClassName({row, rowIndex}) {
				if (row.bg_flag == 1) {
					return 'warning-row';
				}
				return '';
			},
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
			//搜索
			getList(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//全部导出
			exportTable(){
				exportUp(`audit/zero_cost_export`);
			},
			//获取列表
			getData(){
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					supplier_ksbm:this.select_gyshh_ids.join(','),
					is_off_shelf:this.is_off_shelf?'1':'0',
					page:this.page,
					pagesize:this.pagesize
				}
				resource.zeroCost(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
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
			//点击调价
			getDetail(id){
				this.select_id = id;
				resource.ksbmDetail({id:this.select_id}).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击下架
			shelveFun(id){
				this.$prompt('', '下架备注', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					resource.offShelf({id:id,remark:!value?'':value}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});       
				});
			},
			//上架
			upCliFun(id){
				this.$confirm('确认上架?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.onShelf({id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//关闭替换弹框
			closeDialog(){
				this.is_special = 0;
				this.price = "";
				this.show_img = [];
				this.remark = "";
				this.domain = "";
				this.url = "";
			},
			//上传表格
			uploadCsv(arg){
				this.domain = arg.file.domain;
				this.url = arg.file.urls;
			},
			//上传照片
			uploadFile(arg){
				arg.file.is_del = false;
				this.show_img.push(arg.file);
			},
			//删除图片
			deteleFile(url,index){
				resource.delImage({url:url}).then(res => {
					if(res.data.code == 1){
						if(!!index || index == 0){
							this.show_img.splice(index,1);
						}else{
							this.domain = "";
							this.url = "";
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//提交审批
			commitAduit(){
				if(this.price == ''){
					this.$message.warning('请输入成本价');
					return;
				}
				var img_arr = [];
				this.show_img.map(item => {
					img_arr.push(item.urls);
				})
				let arg = {
					id:this.detailObj.id,
					price:this.price,
					is_special:this.is_special,
					pictures:img_arr.join(','),
					remark:this.remark,
					excel_file:this.url
				}
				resource.zeroApply(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.detailDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			UploadFile
		}
	}
</script>










