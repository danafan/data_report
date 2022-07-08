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
				<el-select v-model="status" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker size="small" v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%;height: 600px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="ksbm" label="新编码" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="cb_price" label="成本价" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="edit_cb_price" label="反馈成本价" show-overflow-tooltip align="center"></el-table-column>
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
			<el-table-column label="处理" align="center" fixed="right" v-if="user_type == '2' || user_type == '3' || user_type == '4'">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id)" v-if="scope.row.status != 1">详情</el-button>
					<el-button type="text" size="small" @click="checkStatus('0',scope.row.id)" v-if="scope.row.status == 1 && (user_type == '2' || user_type == '3')">拒绝</el-button>
					<el-button type="text" size="small" @click="checkStatus('1',scope.row.id)" v-if="scope.row.status == 1 && (user_type == '2' || user_type == '3')">同意</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 拒绝弹窗 -->
		<el-dialog title="拒绝" center @close="refused_text = ''" width="45%" :visible.sync="refusedDialog">
			<el-input type="textarea" :rows="2" style="width: 300px" placeholder="拒绝原因（选填）" v-model="refused_text">
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="closeRefused = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitFn('0')">提交</el-button>
			</div>
		</el-dialog>
		<!-- 详情弹窗 -->
		<el-dialog title="详情" center width="40%" :visible.sync="detailDialog">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="编码：">
					<div class="value">{{itemInfo.ksbm}}</div>
				</el-form-item>
				<el-form-item label="成本价：">
					<div class="value">{{itemInfo.cb_price}}</div>
				</el-form-item>
				<el-form-item label="反馈成本价：">
					<div class="value">{{itemInfo.edit_cb_price}}</div>
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
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				refusedDialog:false,	//拒绝弹窗
				refused_text:"",		//拒绝原因
				detailDialog:false,		//详情弹窗
				itemInfo:{},			//详情
			}
		},
		created(){
			this.user_type = localStorage.getItem('user_type');
			//获取列表
			this.getData();
		},
		methods:{
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
				resource.feedbackList(arg).then(res => {
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
			//点击拒绝或同意
			checkStatus(type,id){
				this.id = id;
				if(type == '0'){	//拒绝
					this.refusedDialog = true;
				}else{				//同意
					this.$confirm('原成本价将改成反馈成本价', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//提交处理
						this.commitFn('1');
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});          
					});
				}
			},
			//提交处理
			commitFn(type){	//0:拒绝；1:同意
				let arg = {
					id:this.id,
					audit_type:type
				}
				if(type == '0' && this.refused_text != ''){
					arg.remark = this.refused_text;
				}
				resource.auditFeedback(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.refusedDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击查看详情
			getDetail(id){
				resource.logDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.detailDialog = true;
						this.itemInfo = res.data.data;
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
		}
	}
</script>










