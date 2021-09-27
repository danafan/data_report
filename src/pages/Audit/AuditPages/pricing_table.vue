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
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="index" label="序号" align="center" fixed="left"></el-table-column>
			<el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" align="center"></el-table-column>
			<el-table-column prop="cb_price" label="成本价" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="是否福袋款" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_blessingbag == '0'?'否':scope.row.is_blessingbag == '1'?'是':'未指定'}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="120">
				<template slot-scope="scope">
					<div v-if="scope.row.status == '1'">审批中</div>
					<el-button type="text" size="small" @click="getDetail(scope.row.id)" v-if="scope.row.status == '0'">调价</el-button>
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
				<el-form-item label="新编码：">
					<div>{{detailObj.ksbm}}</div>
				</el-form-item>
				<el-form-item label="成本价：">
					<div>{{detailObj.cb_price}}</div>
				</el-form-item>
				<el-form-item label="更新后成本价：" required>
					<el-input v-model="price" type="number" size="small" style="width: 120px" placeholder="请输入价格"></el-input>
				</el-form-item>
				<el-form-item label="是否福袋款：" required>
					<el-radio-group v-model="is_blessingbag">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="文件附图：">
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
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import UploadFile from '../../../components/upload_file.vue'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				gyshh_list:[],			//所有供应商款号
				select_gyshh_ids:[],	//选中的供应商款号
				dataObj:{},				//返回数据
				detailDialog:false,		//基本信息弹框
				detailObj:{},
				is_blessingbag:0,		//是否福袋款
				price:"",				//更新后成本价
				remark:"",				//备注
				show_img:[],			//显示的图片
				start_date:"",
				end_date:"",
			}
		},
		created(){
			//获取列表
			this.getData();
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
			//获取列表
			getData(){
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					supplier_ksbm:this.select_gyshh_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				resource.noZeroCost(arg).then(res => {
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
			//关闭替换弹框
			closeDialog(){
				this.is_blessingbag = 0;
				this.price = "";
				this.show_img = [];
				this.remark = "";
				this.start_date = "";
				this.end_date = "";
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
						this.show_img.splice(index,1);
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
				var img_arr = [];
				this.show_img.map(item => {
					img_arr.push(item.urls);
				})
				let arg = {
					id:this.detailObj.id,
					price:this.price,
					is_blessingbag:this.is_blessingbag,
					pictures:img_arr.join(','),
					remark:this.remark,
					start_date:this.start_date,
					end_date:!this.end_date?'':this.end_date,
				}
				resource.auditApply(arg).then(res => {
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










