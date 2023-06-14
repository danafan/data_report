<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="新编码：">
				<el-select v-model="select_ksbm_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入新编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商款号：">
				<el-select v-model="select_gyshh_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商款号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="status" placeholder="全部">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
			<el-form-item label="是否石狮：">
				<el-select v-model="ksbm_type" clearable @change="getData" placeholder="全部">
					<el-option label="是" :value="1"></el-option>
					<el-option label="否" :value="0"></el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" size="small" @click="allAudit" v-if="button_list.audit == 1">一键审批</el-button>
			<el-button type="primary" plain size="small" @click="exportDialog = true" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" ref="multipleTable" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" v-loading="loading">
			<el-table-column type="selection" width="55" fixed="left" :selectable="selectableFun" v-if="button_list.audit == 1"></el-table-column>
			<el-table-column type="index" label="序号" align="center" fixed="left"></el-table-column>
			<el-table-column prop="supplier" label="供应商" width="120" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" width="120" align="center"></el-table-column>
			<el-table-column prop="kjs_shop_name" label="店铺" width="120" align="center"></el-table-column>
			<el-table-column prop="platform" label="平台" width="120" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" width="120" align="center"></el-table-column>
			<el-table-column prop="batch_price" label="原批发价" width="120" align="center">
			</el-table-column>
			<el-table-column prop="edit_batch_price" label="更新批发价" width="120" align="center">
			</el-table-column>
			<el-table-column prop="cb_price" label="原成本价" width="120" align="center"></el-table-column>
			<el-table-column prop="edit_cb_price" label="更新成本价" width="120" align="center"></el-table-column>
			<el-table-column label="起始/结束时间" width="210">
				<template slot-scope="scope">
					<div>开始时间：{{scope.row.start_date}}</div>
					<div>结束时间：{{scope.row.end_date}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="是否福袋款" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_blessingbag == '0'?'否':scope.row.is_blessingbag == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="是否特批" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_special == '0'?'否':scope.row.is_special == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="opreater_name" label="提交人" width="120" align="center">
			</el-table-column>
			<el-table-column prop="add_time" label="提交时间" width="140" align="center">
			</el-table-column>
			<el-table-column label="审核状态" width="120" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.status == '0'">默认状态</div>
					<div v-if="scope.row.status == '1'">待审批</div>
					<div v-if="scope.row.status == '2'">审核通过</div>
					<div v-if="scope.row.status == '3'">审批拒绝</div>
				</template>
			</el-table-column>
			<el-table-column prop="approver_time" label="审核时间" width="140" align="center">
			</el-table-column>
			<el-table-column prop="approver" label="审核人" width="120" align="center">
			</el-table-column>
			<el-table-column label="操作" width="120" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id,true)" v-if="scope.row.status == '1' && button_list.audit == 1">审核</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.id,false)" v-if="button_list.detail == 1">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20,50,100]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 详情弹框 -->
		<el-dialog :title="dialog_title" center :visible.sync="detailDialog">
			<el-dialog width="30%" title="提示" :visible.sync="innerVisible" append-to-body>
				<div>{{innerValue}}</div>
				<div slot="footer" class="dialog-footer">
					<el-button @click="innerVisible = false">取 消</el-button>
					<el-button type="primary" @click="aduitFun('1')">确 认</el-button>
				</div>
			</el-dialog>
			<div class="dialog_content">
				<div>
					<div class="content_row is_red" v-if="detailObj.type == 3">
						<div class="label">下架款</div>
					</div>
					<div class="content_row">
						<div class="label">供应商：</div>
						<div>{{detailObj.supplier}}</div>
					</div>
					<div class="content_row">
						<div class="label">供应商款号：</div>
						<div>{{detailObj.supplier_ksbm}}</div>
					</div>
					<div class="content_row">
						<div class="label">店铺：</div>
						<div>{{detailObj.kjs_shop_name}}</div>
					</div>
					<div class="content_row">
						<div class="label">平台：</div>
						<div>{{detailObj.platform}}</div>
					</div>
					<div class="content_row">
						<div class="label">新编码：</div>
						<div>{{detailObj.ksbm}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type != 3">
						<div class="label">原批发价：</div>
						<div>{{detailObj.batch_price}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type != 3">
						<div class="label">更新批发价：</div>
						<div>{{detailObj.edit_batch_price}}</div>
					</div>
				</div>
				<div v-if="detailObj.type != 3">
					<div class="content_row">
						<div class="label">原成本价：</div>
						<div>{{detailObj.cb_price}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 0}">
						<div class="label">更新成本价：</div>
						<div>{{detailObj.edit_cb_price}}</div>
					</div>
					<div class="content_row">
						<div class="label">开始时间：</div>
						<div>{{detailObj.start_date}}</div>
					</div>
					<div class="content_row">
						<div class="label">结束时间：</div>
						<div>{{detailObj.end_date}}</div>
					</div>
					<div class="content_row">
						<div class="label">是否福袋款：</div>
						<div>{{detailObj.is_blessingbag == '0'?'否':detailObj.is_blessingbag == '1'?'是':''}}</div>
					</div>
					<div class="content_row">
						<div class="label">是否特批：</div>
						<div>{{detailObj.is_special == '0'?'否':detailObj.is_special == '1'?'是':''}}</div>
					</div>
				</div>
				<div>
					<div class="content_row">
						<div class="label">提交人：</div>
						<div>{{detailObj.opreater_name}}</div>
					</div>
					<div class="content_row">
						<div class="label">提交时间：</div>
						<div>{{detailObj.add_time}}</div>
					</div>
					<div class="content_row">
						<div class="label">审核状态：</div>
						<div v-if="detailObj.status == '0'">默认状态</div>
						<div v-if="detailObj.status == '1'">待审批</div>
						<div v-if="detailObj.status == '2'">审批通过</div>
						<div v-if="detailObj.status == '3'">审批拒绝</div>
					</div>
					<div class="content_row">
						<div class="label">审核时间：</div>
						<div>{{detailObj.approver_time}}</div>
					</div>
					<div class="content_row">
						<div class="label">审核人：</div>
						<div>{{detailObj.approver}}</div>
					</div>
				</div>
			</div>
			<div class="content_row" v-if="detailObj.type != 3">
				<div class="label">文件附图：</div>
				<div class="img_list">
					<el-image class="img" :src="item" v-for="item in big_img_list" :preview-src-list="big_img_list">
					</el-image>
				</div>
			</div>
			<div class="content_row" v-if="detailObj.type != 3">
				<div class="label">下载附件：</div>
				<el-button type="text" size="small" v-if="detailObj.excel_file != ''" @click="downCsv(detailObj.excel_file)">
					{{detailObj.excel_file}}
					<i class="el-icon-download el-icon--right"></i>
				</el-button>
			</div>
			<div class="content_row">
				<div class="label">备注：</div>
				<div>{{detailObj.remark}}</div>
			</div>
			<div class="content_row" v-if="detailObj.status == '3'">
				<div class="label">拒绝原因：</div>
				<div>{{detailObj.refuse_reason}}</div>
			</div>
			<div slot="footer" class="dialog-footer" v-if="is_aduit">
				<el-button type="primary" size="small" @click="aduitFun('0')">拒绝</el-button>
				<el-button type="primary" size="small" @click="thougnFun">通过</el-button>
			</div>
			<div slot="footer" class="dialog-footer" v-else>
				<el-button type="primary" size="small" @click="detailDialog = false">关闭</el-button>
			</div>
		</el-dialog>
		<!-- 一键审核 -->
		<el-dialog title="审核" width="30%" center :visible.sync="allDialog">
			<div style="text-align: center">审核所有商品</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="allAduitFun('0')">拒绝</el-button>
				<el-button type="primary" size="small" @click="allAduitFun('1')">通过</el-button>
			</div>
		</el-dialog>
		<!-- 导出弹框 -->
		<el-dialog title="导出" center @close="closeDialog" width="45%" :close-on-click-modal="false" :visible.sync="exportDialog">
			<el-form size="small">
				<el-form-item label="导出类型：">
					<el-radio-group v-model="export_type">
						<el-radio :label="1">全部</el-radio>
						<el-radio :label="2">选择时间导出</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="时间区间（按审核时间）：" v-if="export_type == 2">
					<el-date-picker size="small" v-model="export_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="状态：">
					<el-select v-model="export_status" :popper-append-to-body="false" placeholder="全部">
						<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</el-select>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="exportDialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitExport">确认</el-button>
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
.dialog_content{
	display: flex;
	justify-content: space-between;
	color: #333;
	.is_red{
		color: red;
	}
}
.content_row{
	display:flex;
	margin-bottom: 10px;
	.label{
		font-weight: bold;
		width: 90px;
	}
	.img_list{
		width: 400px;
		display:flex;
		flex-wrap: wrap;
		.img{
			margin-right: 10px;
			width: 120px;
			height: 120px;
		}
	}
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {exportUp} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				gyshh_list:[],			//所有供应商款号
				select_gyshh_ids:[],	//选中的供应商款号
				status:'1',				//选中的状态
				status_list:[{
					id:'0',
					name:'全部'
				},{
					id:'1',
					name:'待审核'
				},{
					id:'2',
					name:'审核通过'
				},{
					id:'3',
					name:'审核拒绝'
				},],					//状态列表
				ksbm_type:"",
				dataObj:{},				//返回数据
				button_list:{},
				detailDialog:false,		//基本信息弹框
				detailObj:{},			//详情列表
				select_id:"",			//单个审核选中的id
				ids:[],					//多选框选中的id
				allDialog:false,		//一键审核
				exportDialog:false,		//导出
				export_type:1,			//导出类型
				export_date:[],			//时间区间
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
				},	 					//时间区间
				export_status:'0',		//导出类型
				big_img_list:[],
				dialog_title:"",
				innerVisible:false,
				innerValue:'确认通过？',
				user_type:"",
				loading:false,
				is_aduit:false,			//是否是审核
			}
		},
		created(){
			this.user_type = localStorage.getItem('user_type');
			this.status = this.user_type == '4'?'2':'1';
			//获取列表
			this.getData();
		},
		methods:{
			// 超时高亮提示
			tableRowClassName({row, rowIndex}) {
				if (row.price_flag == 1) {
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
			//获取列表
			getData(){
				let arg = {
					status:this.status,
					ksbm:this.select_ksbm_ids.join(','),
					supplier_ksbm:this.select_gyshh_ids.join(','),
					ksbm_type:this.ksbm_type,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.auidtLog(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换多选
			handleSelectionChange(val) {
				let multipleSelection = val;
				let ids = [];
				multipleSelection.map(item => {
					ids.push(item.id);
				});
				this.ids = ids;
			},
			//判断是否可以勾选
			selectableFun(row, index){
				if(row.status == 1){
					return true;
				}else{
					return false;
				}
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
			//点击审核
			getDetail(id,type){
				this.is_aduit = type;
				this.select_id = id;
				resource.logDetail({id:this.select_id}).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
						if(this.detailObj.type == 0){
							this.dialog_title = '调价信息';
						}else if(this.detailObj.type == 3){
							this.dialog_title = '下架信息';
						}else{
							this.dialog_title = '基本信息';
						}
						this.big_img_list = [];
						this.detailObj.pictures.map(item => {
							let img_url = this.detailObj.domain + item;
							this.big_img_list.push(img_url);
						})
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//通过方法
			thougnFun(){
				if(this.detailObj.type == 3){
					this.innerValue = "审批通过，下架款在总表中移除"
				}else{
					this.innerValue = "确认通过？"
				}
				this.innerVisible = true;
			},
			//拒绝或通过
			aduitFun(audit_type){
				if(audit_type == '0'){		//拒绝
					this.$prompt('请输入拒绝原因', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({ value }) => {
						//请求审核
						let arg = {
							ids:this.select_id,
							audit_type:audit_type,
							remark:!value?'':value
						}
						this.requestFun(arg);
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});       
					});
				}else{						//通过
					//请求审核
					let arg = {
						ids:this.select_id,
						audit_type:audit_type
					}
					this.requestFun(arg);
				}
			},
			//一键审核
			allAudit(){
				if (this.ids.length == 0) {
					this.$message.warning('至少选择一条!');
				}else{
					this.allDialog = true;
				}
			},
			//提交一键审核
			allAduitFun(audit_type){
				//请求审核
				let arg = {
					ids:this.ids.join(','),
					audit_type:audit_type
				}
				this.requestFun(arg);
			},
			//请求审核
			requestFun(arg){
				resource.auidtItem(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.detailDialog = false;
						this.allDialog = false;
						this.innerVisible = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭替换弹框
			closeDialog(){
				this.export_type = 1;
				this.export_date = [];
			},
			//下载表格
			downCsv(csv_url){
				window.open(this.detailObj.domain + csv_url);
			},
			//导出
			commitExport(){
				if(this.export_type == 2 && (!this.export_date || this.export_date.length == 0)){	//按时间导出
					this.$message.warning('请选择导出时间！');
				}else{
					//导出
					var arr = [];
					let arg = {
						status:this.export_status,
						start_date:this.export_date && this.export_date.length> 0?this.export_date[0]:"",
						end_date:this.export_date && this.export_date.length> 0?this.export_date[1]:""
					}
					for(var item in arg){
						let str = item + '=' + arg[item];
						arr.push(str);
					};
					exportUp(`audit/auidt_log_export?${arr.join('&')}`);
					this.exportDialog = false;
				}
			}
		}
	}
</script>










