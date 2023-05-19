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
			<el-form-item label="是否发货：">
				<el-select v-model="is_send" clearable :popper-append-to-body="false" placeholder="是否发货">
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
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="线上订单号：">
			<el-input v-model="arg_xsddh" placeholder="线上订单号"></el-input>
		</el-form-item>
		<el-form-item label="易快报单号：">
			<el-input v-model="arg_ykbdh" placeholder="易快报单号"></el-input>
		</el-form-item>
		<el-form-item label="申请人：">
			<el-input v-model="arg_apply_user_name" placeholder="申请人"></el-input>
		</el-form-item>
		<el-form-item label="转交处理状态：">
			<el-select v-model="handle_status" clearable placeholder="转交处理状态">
				<el-option label="待处理" value="1"></el-option>
				<el-option label="待审核" value="2"></el-option>
				<el-option label="已审核" value="3"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="追回状态：">
			<el-select v-model="recover_status" clearable placeholder="追回状态">
				<el-option label="已追回" value="1"></el-option>
				<el-option label="未追回" value="2"></el-option>
			</el-select>
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
		<el-button type="primary" plain size="small" @click="allTransmit">批量转交</el-button>
		<ImportUpload ref="importUpload" button_name="批量导入内部订单号" table_key="内部订单号" @importCallBack="ytSendOrder"/>
		<el-button type="primary" size="small" @click="ykbDialog = true">
			导入
			<i class="el-icon-upload el-icon--right"></i>
		</el-button>
		<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading" @selection-change="handleSelectionChange">
		<el-table-column type="selection" width="55" fixed :selectable="checkboxInit">
		</el-table-column>
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
		<el-table-column prop="is_send" label="代发-是否发货" show-overflow-tooltip align="center">
		</el-table-column>
		<el-table-column prop="ykbdh" label="易快报单号" width="100" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column prop="apply_user_name" label="申请人" width="100" show-overflow-tooltip align="center"></el-table-column>
		<el-table-column label="转交处理状态" width="100" align="center">
			<template slot-scope="scope">
				<div v-if="scope.row.is_weight == '是'">{{scope.row.handle_status | handleStatus}}</div>
			</template>
		</el-table-column>
		<el-table-column label="追回状态" width="100" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.recover_status | recoverStatus}}</div>
			</template>
		</el-table-column>
		<el-table-column label="操作" width="160" align="center">
			<template slot-scope="scope">
				<div v-if="scope.row.is_weight == '是'">
					<el-button type="text" size="small" v-if="scope.row.handle_status == 0" @click="transmitFn(scope.row.id)">转交</el-button>
					<el-button type="text" size="small" v-if="scope.row.handle_status == 1 || scope.row.handle_status == 3" @click="getDetail(scope.row.id)">查看</el-button>
					<el-button type="text" size="small" v-if="scope.row.handle_status == 2" @click="getDetail(scope.row.id)">审核</el-button>
				</div>
			</template>
		</el-table-column>
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
	<!-- 不存在的线上订单号 -->
	<el-dialog title="本次导入不存在的线上订单号" :visible.sync="bczDialog" width="30%">
		<div class="mb-5 flex ac" v-for="item in bcz_list">
			<div class="yuan mr-6"></div>
			<div>{{item}}</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" type="primary" @click="bczDialog = false">知道了</el-button>
		</div>
	</el-dialog>
	<!-- 转交 -->
	<el-dialog title="转交处理人" :visible.sync="zjDialog" @close="handle_user_id = ''" width="30%">
		<div>
			<el-select size="small" clearable v-model="handle_user_id" filterable placeholder="请选择转交人">
				<el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
				</el-option>
			</el-select>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="zjDialog = false">取 消</el-button>
			<el-button size="small" type="primary" @click="transmitCommit">确 认</el-button>
		</div>
	</el-dialog>
	<!-- 转交结果查看和处理 -->
	<el-dialog :title="info.handle_status == 1?'待处理':info.handle_status == 2?'待审核':'已审核'" :visible.sync="handleDialog" @close="closeDetailDialog" width="45%">
		<div>
			<el-form size="mini">
				<el-form-item label="线上订单号：">
					<div>{{info.xsddh}}</div>
				</el-form-item>
				<el-form-item label="转交时间：">
					<div>{{info.add_time}}</div>
				</el-form-item>
				<el-form-item label="委托人：">
					<div>{{info.add_user_name}}</div>
				</el-form-item>
				<el-divider></el-divider>
				<!-- 拒绝列表 -->
				<div v-for="item in refund_list">
					<el-form-item label="凭证：">
						<uploads-file :onlyView="true" :current_images="item.current_images"/>
					</el-form-item>
					<el-form-item label="处理结果：">
						<div>{{item.handle_remark}}</div>
					</el-form-item>
					<el-form-item label="处理时间：">
						<div>{{item.handle_time}}</div>
					</el-form-item>
					<el-form-item label="处理人：">
						<div>{{item.handle_user_name}}</div>
					</el-form-item>
					<el-form-item label="审核状态：">
						<div>已拒绝</div>
					</el-form-item>
					<el-form-item label="拒绝原因：">
						<div>{{item.refund_reason}}</div>
					</el-form-item>
					<el-form-item label="审核人：">
						<div>{{item.audit_user_name}}</div>
					</el-form-item>
					<el-form-item label="审核时间：">
						<div>{{item.audit_time}}</div>
					</el-form-item>
					<el-divider></el-divider>
				</div>
				<!-- 待处理 -->
				<div v-if="info.handle_status == 1">
					<el-form-item label="处理人：">
						<div>{{info.handle_user_name}}</div>
					</el-form-item>
				</div>
				<!-- 待审核 -->
				<div v-else-if="info.handle_status == 2 || info.handle_status == 3">
					<el-form-item label="凭证：">
						<uploads-file :onlyView="true" :current_images="current_images"/>
					</el-form-item>
					<el-form-item label="处理结果：">
						<div>{{info.handle_remark}}</div>
					</el-form-item>
					<el-form-item label="处理时间：">
						<div>{{info.handle_time}}</div>
					</el-form-item>
					<el-form-item label="处理人：">
						<div>{{info.handle_user_name}}</div>
					</el-form-item>
					<el-form-item label="追回状态：">
						<div>{{info.recover_status == 1?'已追回':'未追回'}}</div>
					</el-form-item>
					<el-divider></el-divider>
					<el-form-item label="审核：" v-if="info.handle_status == 2">
						<el-radio-group v-model="type">
							<el-radio :label="1">通过</el-radio>
							<el-radio :label="2">拒绝</el-radio>
						</el-radio-group>
					</el-form-item>
					<el-form-item label="拒绝原因：" required v-if="type == 2 && info.handle_status == 2">
						<el-input
						style="width: 200px"
						type="textarea"
						:autosize="{ minRows: 2, maxRows: 5}"
						placeholder="最多150字"
						maxlength="150"
						show-word-limit
						v-model="remark">
					</el-input>
				</el-form-item>
				<el-form-item label="审核人：" v-if="info.handle_status == 3">
					<div>{{info.audit_user_name}}</div>
				</el-form-item>
				<el-form-item label="审核时间：" v-if="info.handle_status == 3">
					<div>{{info.audit_time}}</div>
				</el-form-item>
			</div>

		</el-form>
	</div>
	<div slot="footer" class="dialog-footer" v-if="info.handle_status == 2">
		<el-button size="small" type="primary" @click="handleCommit">提交</el-button>
	</div>
</el-dialog>
</div>
</template>
<script>
	import dps from '../../../components/results_components/dps.vue'
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import resource from '../../../api/auditResource.js'
	import commonResource from '../../../api/targetSales.js'
	import UploadsFile from '../../../components/uploads_file.vue'
	import ImportUpload from '../../../components/import_upload.vue'

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
				is_send:"",									//是否发货
				bj:"",										//便笺
				arg_xsddh:"",									//线上订单号
				arg_ykbdh:"",									//易快报单号
				arg_apply_user_name:"",							//申请人
				handle_status:"",							//处理状态
				recover_status:"",							//追回状态
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
				multiple_selection:[],
				loading:false,
				bcz_list:[],
				bczDialog:false,			//导入不存在的线上订单号提示
				zjDialog:false,							//转交弹窗
				id:"",									//点击某行的ID
				user_list:[],							//转交人列表
				handle_user_id:"",						//选择的转交人
				handleDialog:false,						//公用弹窗
				info:{},								//详情数据
				refund_list:[],							//拒绝记录
				current_images:[],
				type:1,									//审核状态
				remark:"",								//拒绝原因
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
			//设置不可勾选
			checkboxInit(row) {
				if(row.is_weight == '是' && row.handle_status == 0) { 
					return 1 
				} else { 
					return 0
				}
			},
			//切换多选
			handleSelectionChange(val) {
				this.multiple_selection = val;
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
						apply_user_name:this.sqr,
						file:this.file
					}
					resource.importYkb(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.ykbDialog = false;
							//获取列表
							this.getList();
							if(res.data.data.length > 0){
								this.bcz_list = res.data.data;
								this.bczDialog = true;
							}
						}else{
							this.file = null;
							this.filename = "";
							this.$message.warning(res.data.msg);
						}
					})
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
					is_send:this.is_send,
					note:this.bj,
					xsddh:this.arg_xsddh,
					ykbdh:this.arg_ykbdh,
					apply_user_name:this.arg_apply_user_name,
					handle_status:this.handle_status,						
					recover_status:this.recover_status						
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
					is_send:this.is_send,
					note:this.bj,
					xsddh:this.arg_xsddh,
					ykbdh:this.arg_ykbdh,
					apply_user_name:this.arg_apply_user_name,
					handle_status:this.handle_status,						
					recover_status:this.recover_status,	
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.ytReport(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//批量导入内部订单号
			ytSendOrder(nbddh_arr){
				let arg = {
					nbddhs:nbddh_arr.join(',')
				}
				resource.ytSendOrder(arg).then(res => {
					this.$refs.importUpload.clearInput();
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
						is_send:this.is_send,
						note:this.bj,
						xsddh:this.arg_xsddh,
						ykbdh:this.arg_ykbdh,
						apply_user_name:this.arg_apply_user_name,
						handle_status:this.handle_status,					
						recover_status:this.recover_status,	
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
			//点击批量转交
			allTransmit(){
				if(this.multiple_selection.length == 0){
					this.$message.warning('请先选择要转交的数据！')
				}else{
					this.zj_type = 2;
					this.zjDialog = true;
					//获取转交人
					this.getUserList();
				}
			},
			//点击转交
			transmitFn(id){
				this.zj_type = 1;
				this.id = id;
				this.zjDialog = true;
				//获取转交人
				this.getUserList();
			},
			//获取转交人
			getUserList(){
				commonResource.ajaxUser().then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击提交转交
			transmitCommit(){
				if(this.handle_user_id == ''){	
					this.$message.warning('请选择转交人')
				}else{
					let ids = this.multiple_selection.map(item => {
						return item.id;
					})
					let arg = {
						id:this.zj_type == 1?this.id:ids.join(','),
						handle_user_id:this.handle_user_id
					}
					resource.ytTransmit(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.zjDialog = false;
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击查看获取详情
			getDetail(id){
				this.id = id;
				let arg = {
					id:id,
					type:'1'
				}
				resource.ytHandleDetail(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.info = data.info;
						this.current_images = [];
						if(this.info.images != ''){
							let dd = this.info.images.split(',');
							dd.map(item => {
								let o = {
									domain:data.domain,
									urls:item
								}
								this.current_images.push(o)
							})
						}
						this.refund_list = data.refund_list;
						this.refund_list.map(item => {
							let n_current_images = [];
							if(item.images != ''){
								let cc = item.images.split(',');
								cc.map(i => {
									let g = {
										domain:data.domain,
										urls:i
									}
									n_current_images.push(g)
								})
							}
							item['current_images'] = n_current_images
						})
						this.handleDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交
			handleCommit(){
				if(this.type == 2 && this.remark == ''){
					this.$message.warning('请输入拒绝原因');
					return;
				}
				let arg = {
					id:this.id,
					type:this.type
				}
				if(this.type == 2){
					arg['remark'] = this.remark;
				}
				resource.ytSudit(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.handleDialog = false;
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭详情弹窗
			closeDetailDialog(){
				this.info = {};								//详情数据
				this.refund_list = [];							//拒绝记录
				this.current_images = [];
				this.type = 1;									//审核状态
				this.remark = "";								//拒绝原因
			}
		},
		filters:{
			//转交处理状态
			handleStatus:function(v){
				switch(v){
				case 0:
					return '待转交';
				case 1:
					return '待处理';
				case 2:
					return '待审核';
				case 3:
					return '已审核';
				default:
					return;
				}
			},
			//追回状态
			recoverStatus:function(v){
				switch(v){
				case 1:
					return '已追回';
				case 2:
					return '未追回';
				default:
					return;
				}
			},
		},
		components:{
			dps,
			UploadsFile,
			ImportUpload
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
	.yuan{
		background:#333333;
		border-radius:50%;
		width: 10px;
		height: 10px;
	}
</style>