<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq" from="1"></dps>
			<el-form-item label="是否称重：">
				<el-select v-model="sfcz" clearable :popper-append-to-body="false" placeholder="是否称重">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否售后：">
				<el-select v-model="sfsh" clearable :popper-append-to-body="false" placeholder="是否售后">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否进仓：">
				<el-select v-model="is_warehousing" clearable :popper-append-to-body="false" placeholder="是否进仓">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="便笺：">
				<el-select v-model="bj" clearable :popper-append-to-body="false" placeholder="便笺">
					<el-option label="WP" value="WP"></el-option>
					<el-option label="001" value="001"></el-option>
					<el-option label="003" value="003"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="发货日期:">
				<el-date-picker
				v-model="date"
				type="daterange"
				:clearable="false"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="card_row">
		<el-card class="el_card">
			<div class="card_content">
				<div class="card_left">
					<div class="left_label">SD量</div>
					<div class="left_value">{{top_info.sd_total_num}}</div>
				</div>
				<el-divider class="line" direction="vertical"></el-divider>
				<div class="card_right">
					<div class="right_row">
						<div class="right_row_label">内部SD：</div>
						<div class="right_row_value">{{top_info.sd_total_inner_num}}</div>
					</div>
					<div class="right_row">
						<div class="right_row_label">外部SD：</div>
						<div class="right_row_value">{{top_info.sd_total_outer_num}}</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="el_card">
			<div class="card_content">
				<div class="card_left">
					<div class="left_label">SD金额</div>
					<div class="left_value">{{top_info.sd_total_money}}元</div>
				</div>
				<el-divider class="line" direction="vertical"></el-divider>
				<div class="card_right">
					<div class="right_row">
						<div class="right_row_label">内部金额：</div>
						<div class="right_row_value">{{top_info.sd_total_inner_money}}元</div>
					</div>
					<div class="right_row">
						<div class="right_row_label">外部金额：</div>
						<div class="right_row_value">{{top_info.sd_total_outer_money}}元</div>
					</div>
				</div>
			</div>
		</el-card>
		<el-card class="el_card">
			<div class="card_content">
				<div class="card_left">
					<div class="left_label">售后订单</div>
					<div class="left_value">{{top_info.after_sale_total_num}}</div>
				</div>
				<el-divider class="line" direction="vertical"></el-divider>
				<div class="card_left">
					<div class="left_label">售后金额</div>
					<div class="left_value">{{top_info.after_sale_total_money}}元</div>
				</div>
			</div>
		</el-card>
		<el-card class="el_card">
			<div class="card_content">
				<div class="card_left">
					<div class="left_label">称重订单数</div>
					<div class="left_value">{{top_info.weight_total_num}}</div>
				</div>
				<el-divider class="line" direction="vertical"></el-divider>
				<div class="card_left">
					<div class="left_label">称重金额</div>
					<div class="left_value">{{top_info.weight_total_money}}元</div>
				</div>
			</div>
		</el-card>
	</div>
	<div class="buts">
		<!-- <el-button type="primary" size="small" @click="ykbDialog = true">
			导入
			<i class="el-icon-upload el-icon--right"></i>
		</el-button> -->
		<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column prop="fhrq" label="日期" width="100" align="center"></el-table-column>
		<el-table-column prop="xsddh" label="线上订单号" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="ysxsddh" label="原始线上订单号" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="nbddh" label="内部订单号" width="100" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="shop_name" label="店铺名称" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="shop_code" label="店铺ID" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="buyer_account" label="买家账号" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="xsje" label="付款金额" width="100" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="note" label="便笺" width="80" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="is_after_sale" label="是否售后" width="80" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="weight" label="重量" width="80" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="is_weight" label="是否称重" width="80" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="remarks" label="线下备注" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="is_warehousing" label="是否进仓" show-overflow-tooltip align="center">
		</el-table-column>
		<!-- <el-table-column prop="nbddh" label="易快报单号" width="100" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="nbddh" label="申请人" width="100" show-overflow-tooltip align="center"></el-table-column> -->
	</el-table>
	<div class="page">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
		</el-pagination>
	</div>
	<!-- 导入 -->
	<el-dialog title="填写易快报信息" :visible.sync="ykbDialog" width="30%" @close="closeDialog">
		<el-form size="small">
			<el-form-item label="易快报单号：" required>
				<el-input placeholder="请输入易快报单号" style="width: 300px" v-model="ykbdh">
				</el-input>
			</el-form-item>
			<el-form-item label="申请人：" required>
				<el-input placeholder="请输入申请人" style="width: 300px" v-model="sqr">
				</el-input>
			</el-form-item>
			<el-form-item label="上传表格：" required>
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
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="ykbDialog = false">取 消</el-button>
			<el-button size="small" type="primary" @click="confirmFn">确 认</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import dps from '../../components/results_components/dps.vue'
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import resource from '../../api/auditResource.js'
	export default{
		data(){
			return{
				ykbDialog:false,							//易快报信息弹窗
				ykbdh:"",									//易快报单号
				sqr:"",										//申请人
				filename:'',								//已上传的文件名
				file:null,
				select_department_ids:[],					//选中的部门id列表
				select_plat_ids:[],							//选中的平台列表
				select_store_ids:[],						//选中的店铺id列表
				sfcz:"",									//是否称重
				sfsh:"",									//是否售后
				is_warehousing:"",							//是否进仓
				bj:"",										//便笺
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
				date:[getCurrentDate(),getCurrentDate()],	//发货日期
				top_info:{},								//头部汇总数据
				page:1,
				pagesize:10,
				dataObj:{},									//列表数据
			}
		},
		created(){
			//获取顶部分块数据
			this.getYtReportTotal();
			//获取列表
			this.getList();
		},
		methods:{
			//搜索
			searchFn(){
				this.page = 1;
				//获取顶部分块数据
				this.getYtReportTotal();
				//获取列表
				this.getList();
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
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
			//关闭导入弹窗
			closeDialog(){
				this.ykbdh = "";
				this.sqr = "";
				this.filename = '';
				this.file = null;
			},
			//导入提交
			confirmFn(){
				if(this.ykbdh == ''){
					this.$message.warning('请输入易快报单号!');
				}else if(this.sqr == ''){
					this.$message.warning('请输入申请人!');
				}else if(this.file == null){
					this.$message.warning('请上传表格!');
				}else{
					let arg = {
						ykbdh:this.ykbdh,
						sqr:this.sqr,
						file:this.file
					}
					console.log(arg)
				}
			},
			//获取顶部分块数据
			getYtReportTotal(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					is_weight:this.sfcz,
					is_after_sale:this.sfsh,
					is_warehousing:this.is_warehousing,
					note:this.bj
				}
				resource.ytReportTotal(arg).then(res => {
					if(res.data.code == 1){
						this.top_info = res.data.data;
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
			//获取列表
			getList(){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					platform:this.select_plat_ids.join(','),
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					is_weight:this.sfcz,
					is_after_sale:this.sfsh,
					is_warehousing:this.is_warehousing,
					note:this.bj,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.ytReport(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						export_flag:"",
						dept_id:this.select_department_ids.join(','),
						shop_id:this.select_store_ids.join(','),
						platform:this.select_plat_ids.join(','),
						start_time:this.date && this.date.length> 0?this.date[0]:"",
						end_time:this.date && this.date.length> 0?this.date[1]:"",
						is_weight:this.sfcz,
						is_after_sale:this.sfsh,
						is_warehousing:this.is_warehousing,
						note:this.bj
					}
					resource.ytReportExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'审计SD分析');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.card_row{
	display: flex;
	align-items: center;
	justify-content: space-between;
	.el_card{
		width: 380px;
		.card_content{
			height: 80px;
			font-size: 14px;
			display:flex;
			justify-content: space-between;
			.card_left{
				flex:1;
				display:flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				font-weight: bold;
				.left_label{
					margin-bottom: 10px;
				}
				.left_value{
					font-size: 22px;
				}
			}
			.line{
				height: 80px;
			}
			.card_right{
				flex:1;
				display:flex;
				flex-direction: column;
				align-items: flex-start;
				justify-content: space-around;
				.right_row{
					display:flex;
					.right_row_label{
						font-weight: bold;
					}
				}
			}
		}
		
	}
}
.buts{
	margin-top: 15px;
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.imgBox{
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
.buttons{
	display: flex;
	align-items: center;
	justify-content: center;
	.upload_box{
		margin-left: 30px;
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