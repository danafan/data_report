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
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="上新时间：">
				<el-date-picker size="small" v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-checkbox v-model="is_zero_batch">零批发价</el-checkbox>
			</el-form-item>
			<el-form-item label="批发价：">
				<el-input type="number" size="small" v-model="batch_price_min" placeholder="最低" style="width: 100px"></el-input> ~
				<el-input type="number" size="small" v-model="batch_price_max" placeholder="最高" style="width: 100px"></el-input>
			</el-form-item>
			<el-form-item label="销量：">
				<el-input type="number" size="small" v-model="min_xssl" placeholder="最低" style="width: 100px"></el-input> ~
				<el-input type="number" size="small" v-model="max_xssl" placeholder="最高" style="width: 100px"></el-input>
			</el-form-item>
			<el-form-item label="折扣率：" v-if="user_type != '1'">
				<el-input type="number" size="small" v-model="min_zkl" placeholder="最低" style="width: 120px">
					<template slot="append">%</template>
				</el-input> ~
				<el-input type="number" size="small" v-model="max_zkl" placeholder="最高" style="width: 120px">
					<template slot="append">%</template>
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
			<el-form-item label="">
				<el-select v-model="from" @change="changeFrom" placeholder="全部">
					<el-option v-for="item in from_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="upload_box" v-if="button_list.import == 1">
				<el-button type="primary" size="small">
					导入
					<i class="el-icon-upload el-icon--right"></i>
				</el-button>
				<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
			</div>
			<el-button type="primary" size="small" @click="replaceDialog = true" v-if="button_list.edit_supplier == 1">一键替换</el-button>
			<el-button type="primary" plain size="small" @click="exportDialog = true"  v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading" @sort-change="sortChange">
			<el-table-column type="index" label="序号" align="center" fixed="left">
			</el-table-column>
			<el-table-column prop="launch_day" label="上新时间" width="120" align="center"></el-table-column>
			<el-table-column label="供应商" width="120" align="center">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.supplier" @focus="onFocus(scope.row.supplier)" @change="editSupplier($event,scope.row)" placeholder="输入供应商" :disabled="button_list.edit_one_supplier != 1"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="ksbm" label="新编码" width="120" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" show-overflow-tooltip label="供应商款号" width="120" align="center"></el-table-column>
			<el-table-column label="批发价" width="120" align="center">
				<template slot-scope="scope">
					<el-input size="small" @mousewheel.native.prevent type="number" v-model="scope.row.batch_price" @change="editFun('batch_price',scope.row.id,scope.row.batch_price)" placeholder="输入批发价" :disabled="button_list.edit_batch_price != 1"></el-input>
				</template>
			</el-table-column>
			<el-table-column prop="cb_price" label="成本价" sortable='custom' width="120" align="center"></el-table-column>
			<el-table-column prop="difference" label="差值" sortable='custom' width="120" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="是否特批" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_special == '0'?'否':scope.row.is_special == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="xssl" label="销量" sortable='custom' width="120" align="center"></el-table-column>
			<el-table-column prop="zkl" label="折扣率" sortable='custom' width="120" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="是否福袋款" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_blessingbag == '0'?'否':scope.row.is_blessingbag == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column label="备注" align="center" v-if="user_type != '1'">
				<template slot-scope="scope">
					<el-input size="small" v-model="scope.row.remark" @change="editFun('remark',scope.row.id,scope.row.remark)" maxlength="20" placeholder="备注（最多20字）" :disabled="button_list.edit_remark != 1"></el-input>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" v-if="button_list.add_feedback == 1">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="feedBack(scope.row)" v-if="(scope.row.feedback_status == 1 || scope.row.feedback_status == 2) && button_list.add_feedback == 1">反馈</el-button>
					<div v-if="scope.row.feedback_status == 0">已反馈</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 替换弹框 -->
		<el-dialog :title="`【${this.from =='1'?'德儿':'乎达'}】替换供应商`" center @close="closeDialog" width="45%" :close-on-click-modal="false" :visible.sync="replaceDialog">
			<div class="dialog_row">
				<el-select v-model="old_gys" size="small" clearable :popper-append-to-body="false" filterable remote placeholder="搜索原供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
				<div class="connect_line">-----></div>
				<el-input placeholder="输入新供应商" v-model="new_gys" size="small" style="width: 180px">
				</el-input>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="replaceDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitReplace">确认替换</el-button>
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
				<el-form-item label="时间区间（按上线时间）：" v-if="export_type == 2">
					<el-date-picker size="small" v-model="export_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="exportDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitExport">确认</el-button>
			</div>
		</el-dialog>
		<!-- 反馈弹窗 -->
		<el-dialog title="反馈" center @close="closeFeedBack" width="45%" :visible.sync="feedBackDialog">
			<el-form size="small">
				<el-form-item label="编码：">
					{{ksbm}}
				</el-form-item>
				<el-form-item label="成本价：">
					{{cb_price}}
				</el-form-item>
				<el-form-item label="开单时间：" required>
					<el-date-picker
					v-model="kd_time"
					value-format="yyyy-MM-dd HH:mm:ss"
					type="datetime"
					placeholder="选择日期时间">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="反馈成本价：" required>
				<el-input placeholder="请输入反馈成本价" type="number" style="width: 300px" v-model="new_cb_price">
				</el-input>
			</el-form-item>
			<el-form-item label="原因：">
				<el-input type="textarea" :rows="2" style="width: 300px" placeholder="请输入原因" v-model="feek_back_remark">
				</el-input>
			</el-form-item>
		</el-form>
		<el-dialog width="30%" title="提示" :visible.sync="innerDialog" append-to-body>
			<div>反馈成本价是：{{new_cb_price}}元</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="innerDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitFeedBack">提交</el-button>
			</div>
		</el-dialog>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="feedBackDialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitFn">确认</el-button>
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
.dialog_row{
	display:flex;
	align-items: center;
	justify-content: center;
	.connect_line{
		margin-left: 10px;
		margin-right: 10px;
	}	
}
.upload_box{
	margin-right: 10px;
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
				gys_list:[],			//所有供应商列表
				select_gys_ids:[],		//选中的供应商列表
				date:[],
				batch_price_min:"",		//批发价最低
				batch_price_max:"",		//批发价最高
				min_xssl:"",			//销售数量最低
				max_xssl:"",			//销售数量最高
				min_zkl:"",				//折扣率最小值
				max_zkl:"",				//折扣率最大值
				from_list:[{
					id:'1',
					name:'德儿'
				},{
					id:'2',
					name:'乎达'
				}],						//所有的平台
				from:'1',				//选中的平台
				is_zero_batch:false,	//是否零批发价
				sort_field:"",
				sort_type:"",
				dataObj:{},				//返回数据
				button_list:{},			
				replaceDialog:false,	//替换供应商弹框
				old_gys:"",				//原供应商
				new_gys:"",				//新供应商
				exportDialog:false,		//导出弹框
				export_type:1,			//导出类型
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
				date:[],				//上新时间
				export_date:[],			//导出日期区间
				user_type:"",
				current_supplier:"",	//当前点击的供应商
				feedBackDialog:false,	//点击反馈的弹窗
				id:"",					//点击反馈的ID
				ksbm:"",				//点击反馈的编码
				cb_price:"",			//点击反馈的成本价
				kd_time:"",				//开单时间
				new_cb_price:"",		//点击反馈的新成本价
				feek_back_remark:"",	//点击反馈的原因
				innerDialog:false,		//内部提示
				loading:false
			}
		},
		created(){
			this.user_type = localStorage.getItem('user_type');
			//获取列表
			this.getData();
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
			//供应商
			getGys(e){
				if(e != ''){
					resource.ajaxSupplier({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
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
			changeFrom(v){
				this.from = v;
				//获取列表
				this.getData()
			},
			//排序
			sortChange(column){
				this.sort_field = column.prop;
				this.sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getData();
			},
			//获取列表
			getData(){
				if(parseFloat(this.batch_price_min) > parseFloat(this.batch_price_max)){
					this.$message.warning('最低批发价不能高于最高批发价');
					return;
				}
				if(parseFloat(this.min_xssl) > parseFloat(this.max_xssl)){
					this.$message.warning('最低销量不能高于最高销量');
					return;
				}
				if(parseFloat(this.min_zkl) > parseFloat(this.max_zkl)){
					this.$message.warning('最低折扣率不能高于最高折扣率');
					return;
				}
				let arg = {
					ksbm:this.select_ksbm_ids.join(','),
					supplier_ksbm:this.select_gyshh_ids.join(','),
					supplier:this.select_gys_ids.join(','),
					is_zero_batch:!this.is_zero_batch?0:1,
					start_launch_day:this.date && this.date.length > 0?this.date[0]:"",
					end_launch_day:this.date && this.date.length > 0?this.date[1]:"",
					from:this.from,
					min_batch_price:this.batch_price_min,
					max_batch_price:this.batch_price_max,
					min_xssl:this.min_xssl,
					max_xssl:this.max_xssl,
					min_zkl:this.min_zkl,
					max_zkl:this.max_zkl,
					sort_field:this.sort_field,
					sort_type:this.sort_type,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.totalAudit(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//修改批发价/备注
			editFun(type,id,value){
				let arg = {
					id:id
				}
				arg[type] = value;	
				if(type == 'batch_price'){		//修改批发价
					this.$confirm('确认更改当前记录?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						resource.editBatch(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取列表
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
				}else{						//修改备注
					resource.editRemark(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击反馈
			feedBack(item_info){
				this.id = item_info.id;					//点击反馈的id
				this.ksbm = item_info.ksbm;					//点击反馈的编码
				this.cb_price = item_info.cb_price;			//点击反馈的成本价
				this.feedBackDialog = true;
			},
			//关闭反馈
			closeFeedBack(){
				this.id = "";				//点击反馈的id
				this.ksbm = "";				//点击反馈的编码
				this.cb_price = "";			//点击反馈的成本价
				this.new_cb_price = "";		//点击反馈的新成本价
				this.kd_time = "";			//开单时间
				this.feek_back_remark = "";	//点击反馈的原因
			},
			//确认
			commitFn(){
				if(!this.kd_time){
					this.$message.warning('请选择开单时间！');
				}else if(this.new_cb_price == ""){
					this.$message.warning('请输入反馈成本价！');
				}else{
					this.innerDialog = true;
				}
			},
			//提交反馈
			commitFeedBack(){
				let arg = {
					id:this.id,
					billing_time:this.kd_time,
					feedback_price:this.new_cb_price,
					reason:this.feek_back_remark
				}
				resource.addFeedback(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.feedBackDialog = false;
						this.innerDialog = false;
						//获取列表
						this.getData();
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
			//关闭替换弹框
			closeDialog(){
				this.old_gys = '';
				this.new_gys = '';
				this.export_type = 1;
				this.export_date = [];
			},
			//提交替换
			commitReplace(){
				if(this.old_gys == ''){
					this.$message.warning('请选择原供应商');
				}else if(this.new_gys == ''){
					this.$message.warning('请输入新供应商');
				}else{
					let arg = {
						old_supplier:this.old_gys,
						new_supplier:this.new_gys,
						from:this.from
					}
					resource.editSupplier(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.replaceDialog = false;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				};
			},
			//获取焦点
			onFocus(e){
				this.current_supplier = e;
			},
			//单独修改供应商
			editSupplier(e,row){
				this.$confirm(`原供应商${this.current_supplier} 更新供应商${e}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						id:row.id,
						supplier:e
					}
					resource.editOneSupplier(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					row.supplier = this.current_supplier;
					this.$message({
						type: 'info',
						message: '取消更改'
					});          
				});
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.importGoods({file:files[0],from:this.from}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			commitExport(){
				if(this.export_type == 2 && (!this.export_date || this.export_date.length == 0)){	//按时间导出
					this.$message.warning('请选择导出时间！');
				}else{
					//导出
					var arr = [];
					let arg = {
						start_date:this.export_date && this.export_date.length> 0?this.export_date[0]:"",
						end_date:this.export_date && this.export_date.length> 0?this.export_date[1]:"",
						from:this.from
					}
					for(var item in arg){
						let str = item + '=' + arg[item];
						arr.push(str);
					};
					exportUp(`audit/total_export?${arr.join('&')}`);
					this.exportDialog = false;
				}
			}
		}
	}
</script>










