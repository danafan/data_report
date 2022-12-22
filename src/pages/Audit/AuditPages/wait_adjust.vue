<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item>
				<el-input style="width: 200px" v-model="search" clearable placeholder="请输入新编码/供应商款号"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="table_data" size="small" style="width:100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}"  :cell-style="{'text-align':'center'}" v-loading="loading">
			<el-table-column :label="item.label" :prop="item.prop" v-for="item in main_column" show-overflow-tooltip>
				<template slot-scope="scope">
					<div v-if="item.prop == 'is_blessingbag'">{{scope.row.is_blessingbag =='0'?'否':'是'}}</div>
					<div v-else>{{scope.row[item.prop]}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="180" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="adjustPrice(scope.row)" v-if="button_list.edit_price == 1">调价</el-button>
					<el-button type="text" size="small" @click="noNeedFn(scope.row.ksbm)" v-if="button_list.no_need_edit == 1">无需调价</el-button>
					<el-button type="text" size="small" @click="transferFn(scope.row.ksbm)" v-if="button_list.handover == 1">转交</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 调价 -->
		<el-dialog title="调价信息" center @close="closeDialog" :close-on-click-modal="false" :visible.sync="adjuest_dialog">
			<el-form size="small" class="demo-form-inline">
				<el-form-item label="供应商：">
					<div>{{detailObj.gys}}</div>
				</el-form-item>
				<el-form-item label="供应商款号：">
					<div>{{detailObj.gyshh}}</div>
				</el-form-item>
				<el-form-item label="新编码：">
					<div>{{detailObj.ksbm}}</div>
				</el-form-item>
				<el-form-item label="成本价：">
					<div>{{detailObj.cb_price}}</div>
				</el-form-item>
				<el-form-item label="更新后成本价：" required>
					<el-input v-model="price" @mousewheel.native.prevent type="number" size="small" style="width: 120px" placeholder="请输入价格"></el-input>
				</el-form-item>
				<el-form-item label="是否福袋款：" required>
					<el-radio-group v-model="is_blessingbag">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
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
				<el-form-item label="上传图片：" required>
					<div class="img_list">
						<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
							<img class="img" :src="item.domain + item.urls">
							<div class="modal" v-if="item.is_del == true">
								<img src="../../../static/deleteImg.png" @click="deteleFile(item.urls,index)">
							</div>
						</div>
						<UploadFile @callbackFn="uploadFile" :current_num="show_img.length" :max_num="9" v-if="show_img.length < 9"/>
					</div>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input type="textarea" :rows="3" maxlength="100" style="width: 260px" placeholder="请输入备注" v-model="remark"></el-input>
				</el-form-item>
				<el-form-item label="开始时间：" required>
					<el-date-picker v-model="start_date" type="date" value-format="yyyy-MM-dd" placeholder="开始时间">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间：">
					<el-date-picker v-model="end_date" type="date" value-format="yyyy-MM-dd" placeholder="结束时间">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="adjuest_dialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitAduit">提交</el-button>
			</div>
		</el-dialog>
		<!-- 转交 -->
		<el-dialog title="转交给同事" width="30%" center :close-on-click-modal="false" @close="handle_user_id = ''" :visible.sync="hand_over_dialog">
			<el-form size="small" class="demo-form-inline">
				<el-form-item label="转交人：">
					<el-select size="small" clearable v-model="handle_user_id" :popper-append-to-body="false" filterable placeholder="请选择转交人">
						<el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="hand_over_dialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="confirmTransfer">提交</el-button>
			</div>
		</el-dialog>
		<!-- 无需调价 -->
		<el-dialog title="无需调价" width="30%" center @close="closeNoNeedDialog" :close-on-click-modal="false" :visible.sync="no_need_dialog">
			<el-form size="small" class="demo-form-inline">
				<el-form-item label="上传图片：" required>
					<div class="img_list">
						<div class="dialog_img" v-for="(item,index) in no_show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
							<img class="img" :src="item.domain + item.urls">
							<div class="modal" v-if="item.is_del == true">
								<img src="../../../static/deleteImg.png" @click="deteleNoFile(item.urls,index)">
							</div>
						</div>
						<UploadFile @callbackFn="noUpload" :current_num="no_show_img.length" :max_num="3" v-if="no_show_img.length < 3"/>
					</div>
				</el-form-item>
				<el-form-item label="说明：" required>
					<el-input type="textarea" :rows="3" maxlength="100" style="width: 260px" placeholder="请填写说明" v-model="no_remark"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="no_need_dialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitNo">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/auditResource.js'
	import commonResource from '../../../api/targetSales.js'

	import UploadFile from '../../../components/upload_file.vue'
	export default{
		data(){
			return{
				search:"",						//搜索关键字
				page:1,
				pagesize:10,
				main_column:[{
					label:"供应商",
					prop:"gys",
				},{
					label:"供应商款号",
					prop:"gyshh",
				},{
					label:"新编码",
					prop:"ksbm",
				},{
					label:"成本价",
					prop:"cb_price",
				},{
					label:"是否福袋款",
					prop:"is_blessingbag",
				},{
					label:"主卖店铺",
					prop:"zmdp",
				},{
					label:"日均销",
					prop:"xssl_av7",
				},{
					label:"生成时间",
					prop:"sjxrrq",
				}],
				button_list:{},
				table_data:[],					
				total:0,
				loading:false,
				adjuest_dialog:false,				//调价弹窗
				detailObj:{},							//点击的某一条数据
				price:"",						//更新后成本价
				is_blessingbag:0,				//是否福袋款
				url:"",							//可传递的附件
				show_img:[],					//显示的图片
				remark:"",
				start_date:"",
				end_date:"",
				domain:"",						//文件前缀
				hand_over_dialog:false,			//转交弹窗
				user_list:[],					//员工列表
				ksbm:"",						//当前点击的款式编码
				handle_user_id:"",				//选中的人员
				no_need_dialog:false,			//无需调价
				no_show_img:[],					//无需调价图片列表
				no_remark:"",					//无需调价说明
				
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			start_date:function(n,o){
				if(!!n || n != ''){
					if(new Date(this.start_date) > new Date(this.end_date)){
						this.$message.warning('开始时间不能小于结束时间!');
					};
				}
			},
			end_date:function(n,o){
				if(!!n || n != ''){
					if(new Date(this.start_date) > new Date(this.end_date)){
						this.$message.warning('开始时间不能小于结束时间!');
					};
				}
			}
		},
		methods:{
			//获取列表
			getList(){
				let arg = {
					search:this.search,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.auditWait(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_data = data.data;
						this.button_list = data.button_list;
						this.total = data.total;
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
			//点击调价
			adjustPrice(row){
				this.detailObj = row;
				this.adjuest_dialog = true;
			},
			//关闭替换弹框
			closeDialog(){
				this.price = "";
				this.is_blessingbag = 0;
				this.url = "";
				this.show_img = [];
				this.remark = "";
				this.start_date = "";
				this.end_date = "";
				this.domain = "";
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
			//删除文件
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
			//提交调价
			commitAduit(){
				if(this.price == ''){
					this.$message.warning('请输入成本价');
					return;
				}
				if(!this.start_date || this.start_date == ''){
					this.$message.warning('请选择活动开始时间');
					return;
				}
				if(!!this.start_date && this.start_date != '' && !!this.end_date && this.end_date != ''){
					if(new Date(this.start_date) > new Date(this.end_date)){
						this.$message.warning('开始时间不能小于结束时间!');
						return;
					};
				};
				if(this.show_img.length == 0){
					this.$message.warning('请上传图片!');
					return;
				}
				var img_arr = this.show_img.map(item => {
					return item.urls;
				})
				let arg = {
					ksbm:this.detailObj.ksbm,
					price:this.price,
					is_blessingbag:this.is_blessingbag,
					pictures:img_arr.join(','),
					remark:this.remark,
					start_date:this.start_date,
					end_date:!this.end_date?'':this.end_date,
					excel_file:this.url
				}
				resource.waitApply(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.adjuest_dialog = false;
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击转交
			transferFn(ksbm){
				this.ksbm = ksbm;
				this.hand_over_dialog = true;
				if(this.user_list.length == 0){
					//获取员工列表
					this.getAjaxUser();
				}
			},
			//获取员工列表
			getAjaxUser(){
				commonResource.ajaxUser().then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//转交提交
			confirmTransfer(){
				if(this.handle_user_id == ''){
					this.$message.warning('请选择转交人!')
				}else{
					let arg = {
						ksbm:this.ksbm,
						handle_user_id:this.handle_user_id
					}
					resource.handOver(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.hand_over_dialog = false;
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})

				}
			},
			//点击无需调价
			noNeedFn(ksbm){
				this.ksbm = ksbm;
				this.no_need_dialog = true;
			},
			//关闭无需调价弹窗
			closeNoNeedDialog(){
				this.no_show_img = [];
				this.no_remark = "";
			},
			//无需调价上传文件
			noUpload(arg){
				arg.file.is_del = false;
				this.no_show_img.push(arg.file);
			},
			//无需调价删除图片
			deteleNoFile(url,index){
				resource.delImage({url:url}).then(res => {
					if(res.data.code == 1){
						this.no_show_img.splice(index,1);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//提交无需调价
			commitNo(){
				if(this.no_show_img.length == 0){
					this.$message.warning('请上传图片！');
					return;
				}
				if(this.no_remark == ''){
					this.$message.warning('请输入说明！');
					return;
				}
				let arg = {
					ksbm:this.ksbm,
					remark:this.no_remark
				}
				var img_arr = this.no_show_img.map(item => {
					return item.urls;
				})
				arg.pictures = img_arr.join(',');
				resource.noNeed(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
						this.no_need_dialog = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			}
			
		},
		components:{
			UploadFile
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
</style>