<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="新编码：">
				<el-input style="width:200px" clearable v-model="ksbm" placeholder="请输入新编码"></el-input>
			</el-form-item>
			<el-form-item label="反馈人：">
				<el-input style="width:200px" clearable v-model="fkr" placeholder="请输入反馈人"></el-input>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="status" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker size="small" v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="ksbm" label="新编码" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="cb_price" label="成本价" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="edit_cb_price" label="反馈成本价" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="billing_time" label="开单时间" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="opreater_name" label="反馈人" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="add_time" label="反馈时间" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="remark" label="反馈原因" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="状态" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.status == 1">待审核</div>
					<div v-if="scope.row.status == 2">审批通过</div>
					<div v-if="scope.row.status == 3">审批拒绝</div>
				</template>
			</el-table-column>
			<el-table-column label="处理" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id)" v-if="button_list.detail == 1">详情</el-button>
					<el-button type="text" size="small" @click="checkStatus('0',scope.row.id)" v-if="scope.row.status == 1 && button_list.audit == 1">拒绝</el-button>
					<el-button type="text" size="small" @click="checkStatus('1',scope.row.id)" v-if="scope.row.status == 1 && button_list.audit == 1">同意</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 拒绝弹窗 -->
		<el-dialog title="拒绝" center @close="refused_text = ''" width="30%" :visible.sync="refusedDialog">
			<el-input type="textarea" :rows="5" placeholder="拒绝原因（选填）" v-model="refused_text">
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="refusedDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitFn('0')">提交</el-button>
			</div>
		</el-dialog>
		<!-- 同意弹窗 -->
		<el-dialog title="同意" center @close="closeAgree" width="45%" :visible.sync="agreeDialog">
			<el-form size="small">
				<el-form-item label="起始时间：" required>
					<el-date-picker
					:picker-options="startDateOptions"
					v-model="start_time"
					align="right"
					value-format="yyyy-MM-dd"
					type="date"
					placeholder="起始时间"
					>
				</el-date-picker>
			</el-form-item>
			<el-form-item label="结束时间：">
				<el-date-picker
				:picker-options="endDateOptions"
				v-model="end_time"
				align="right"
				value-format="yyyy-MM-dd"
				type="date"
				placeholder="结束时间"
				>
			</el-date-picker>
		</el-form-item>
		<el-form-item label="聊天截图：" required>
			<div class="img_list">
				<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
					<img class="img" :src="item.domain + item.urls">
					<div class="modal" v-if="item.is_del == true">
						<img src="../../../static/deleteImg.png" @click="deteleFile(item.urls,index)">
					</div>
				</div>
				<UploadFile @callbackFn="uploadFile" :current_num="show_img.length" :max_num="3" v-if="show_img.length < 3"/>
			</div>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button type="primary" size="small" @click="agreeDialog = false">取消</el-button>
		<el-button type="primary" size="small" @click="commitFn('1')">提交</el-button>
	</div>
</el-dialog>
<!-- 详情弹窗 -->
<el-dialog title="详情" center width="40%" :visible.sync="detailDialog">
	<el-form size="small">
		<el-form-item label="编码：">
			<div class="value">{{itemInfo.ksbm}}</div>
		</el-form-item>
		<el-form-item label="供应商款号：">
			<div class="value">{{itemInfo.supplier_ksbm}}</div>
		</el-form-item>
		<el-form-item label="成本价：">
			<div class="value">{{itemInfo.cb_price}}</div>
		</el-form-item>
		<el-form-item label="反馈成本价：">
			<div class="value">{{itemInfo.edit_cb_price}}</div>
		</el-form-item>
		<el-form-item label="开单时间：">
			<div class="value">{{itemInfo.billing_time}}</div>
		</el-form-item>
		<el-form-item label="原因：">
			<div class="value">{{itemInfo.remark}}</div>
		</el-form-item>
		<el-form-item label="反馈人：">
			<div class="value">{{itemInfo.opreater_name}}</div>
		</el-form-item>
		<el-form-item label="反馈时间：">
			<div class="value">{{itemInfo.add_time}}</div>
		</el-form-item>
		<el-form-item label="当前状态：">
			<div class="value" v-if="itemInfo.status == 1">待审核</div>
			<div class="value" v-if="itemInfo.status == 2">审批通过</div>
			<div class="value" v-if="itemInfo.status == 3">审批拒绝</div>
		</el-form-item>
		<el-form-item label="处理人：">
			<div class="value">{{itemInfo.approver}}</div>
		</el-form-item>
		<el-form-item label="拒绝原因：" v-if="itemInfo.status == 3">
			<div class="value">{{itemInfo.refuse_reason}}</div>
		</el-form-item>
		<el-form-item label="起始时间：" v-if="itemInfo.status == 2">
			<div class="value">{{itemInfo.start_date}}</div>
		</el-form-item>
		<el-form-item label="结束时间：" v-if="itemInfo.status == 2">
			<div class="value">{{itemInfo.end_date}}</div>
		</el-form-item>
		<el-form-item label="聊天截图：" v-if="itemInfo.status == 2">
			<el-image 
			@click="handleClickItem"
			v-for="item in itemInfo.ddd"
			style="width: 100px; height: 100px"
			:src="item" 
			:preview-src-list="itemInfo.ddd">
		</el-image>
	</el-form-item>
</el-form>
<div slot="footer" class="dialog-footer">
	<el-button type="primary" size="small" @click="detailDialog = false">关闭</el-button>
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
.value{
	width: 300px;
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
<script>
	import resource from '../../../api/auditResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import UploadFile from '../../../components/upload_file.vue'
	export default{
		data(){
			return{
				user_type:"",
				page:1,
				pagesize:10,
				ksbm:"",					//款式编码
				fkr:"",						//反馈人
				status_list:[{
					id:'1',
					name:'待处理'
				},{
					id:'2',
					name:'已同意'
				},{
					id:'3',
					name:'已拒绝'
				}],						//状态列表
				status:"",				//选中的状态
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
				date:[],				//日期区间
				dataObj:{},				//返回数据
				button_list:{},
				refusedDialog:false,	//拒绝弹窗
				refused_text:"",		//拒绝原因
				detailDialog:false,		//详情弹窗
				itemInfo:{},			//详情
				agreeDialog:false,		//同意弹窗
				start_time:"",			//起始时间
				end_time:"",			//结束时间
				show_img:[],			//显示的图片
				startDateOptions: {
					disabledDate:(time) =>{
						if(this.end_time){
							return time.getTime() > new Date(this.end_time).getTime();
						}else{
							return false;
						};
					}
				},
				endDateOptions: {
					disabledDate:(time) =>{
						if(this.start_time){
							return time.getTime() < new Date(this.start_time).getTime();
						}else{
							return false;
						};
					}
				},
				loading:false

			}
		},
		created(){
			this.user_type = localStorage.getItem('user_type');
			//获取列表
			this.getData();
		},
		methods:{
			handleClickItem() {
				this.$nextTick(() => {
					let domImageMask = document.querySelector('.el-image-viewer__mask')
					if (!domImageMask) {
						return
					}
					domImageMask.addEventListener('click', () => {
						document.querySelector('.el-image-viewer__close').click()
					})
				})
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
					ksbm:this.ksbm,
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					opreater_name:this.fkr,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.feedbackList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
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
			//点击拒绝或同意
			checkStatus(type,id){
				this.id = id;
				if(type == '0'){	//拒绝
					this.refusedDialog = true;
				}else{				//同意
					this.agreeDialog = true;
				}
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
						this.show_img.splice(index,1);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//关闭同意弹窗
			closeAgree(){
				this.start_time = "";				//起始时间
				this.end_time = "";					//结束时间
				this.show_img = []			//显示的图片
			},
			//提交处理
			commitFn(type){	//0:拒绝；1:同意
				var arg = {
					id:this.id,
					audit_type:type
				}
				if(type == '0'){	//拒绝
					if(this.refused_text != ''){
						arg.remark = this.refused_text;
					}
				}else{	//同意
					if(!this.start_time){
						this.$message.warning('请选择起始时间!');
						return;
					}else if(this.show_img.length == 0){
						this.$message.warning('至少上传1-3张图片!');
						return;
					}else{
						let pictures = [];
						this.show_img.map(item => {
							pictures.push(item.urls);
						})
						arg.start_date = this.start_time;
						arg.end_date = !this.end_time?'':this.end_time;
						arg.pictures = pictures.join(',');
					}
				}
				resource.auditFeedback(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.refusedDialog = false;
						this.agreeDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击查看详情
			getDetail(id){
				resource.feedbackDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.detailDialog = true;
						let itemInfo = res.data.data;
						itemInfo.ddd = [];
						itemInfo.pictures.map(item => {
							itemInfo.ddd.push(itemInfo.domain + item)
						})
						this.itemInfo = itemInfo;
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
						status:this.status,
						ksbm:this.ksbm,
						start_time:this.date && this.date.length> 0?this.date[0]:"",
						end_time:this.date && this.date.length> 0?this.date[1]:"",
						opreater_name:this.fkr,
					}
					resource.feedbackExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'反馈表');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}
		},
		components:{
			UploadFile
		}
	}
</script>










