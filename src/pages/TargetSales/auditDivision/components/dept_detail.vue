<template>
	<div>
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
			<el-table-column width="180" label="去年同期上月" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.last_month_value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" label="去年同期" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" label="上月实际值" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.actual_data}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" label="上月目标值" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.target_data}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="160" label="本月目标参数" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.new_value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="bottom_table">
			<div class="row">
				<div class="lable">提交时间：</div>
				<div class="value">{{bottom_info.add_time}}</div>
			</div>
			<div class="row">
				<div class="lable">提交人：</div>
				<div class="value">{{bottom_info.add_user_name}}</div>
			</div>
			<div class="row">
				<div class="lable">提交人备注：</div>
				<div class="value">{{bottom_info.remark}}</div>
			</div>
			<div class="row" v-if="bottom_info.status != '0'">
				<div class="lable">审核状态：</div>
				<div class="value">{{bottom_info.status == '0'?'待审核':bottom_info.status == '1'?'审核通过':'审核拒绝'}}</div>
			</div>
			<div class="row" v-if="bottom_info.status != '0'">
				<div class="lable">审核时间：</div>
				<div class="value">{{bottom_info.audit_time}}</div>
			</div>
			<div class="row" v-if="bottom_info.status != '0'">
				<div class="lable">审核人：</div>
				<div class="value">{{bottom_info.audit_user_name}}</div>
			</div>
			<div class="row" v-if="bottom_info.status == '2'">
				<div class="lable">拒绝原因：</div>
				<div class="value">{{bottom_info.refuse_reason}}</div>
			</div>
			<div class="row" v-if="bottom_info.status == '1'">
				<div class="lable">审核人备注：</div>
				<div class="value">{{bottom_info.agree_reason}}</div>
			</div>
			<div class="row" v-if="bottom_info.status == '0' || (bottom_info.status != '2' && bottom_info.parent_refund_status == 1)">
				<div class="lable">操作：</div>
				<div class="value">
					<el-button size="mini" type="danger" @click="auditFn('1')">拒绝</el-button>
					<el-button size="mini" type="primary" @click="auditFn('2')">同意</el-button>
				</div>
			</div>
		</div>
		<!-- 拒绝 -->
		<el-dialog :title="refuse_type == '1'?'拒绝':'通过'" :visible.sync="showRefuse" append-to-body>
			<el-input
			type="textarea"
			:rows="3"
			:placeholder="refuse_type == '1'?'请输入拒绝原因（必填）':'请输入备注原因（选填）'"
			v-model="reason">
		</el-input>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="showRefuse = false">取 消</el-button>
			<el-button size="small" type="primary" @click="refuseCheck">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.bottom_table{
	margin-top: 30px;
	border-left: 1px solid #333333;
	border-top: 1px solid #333333;
	.row{
		display: flex;
		.lable{
			border-right: 1px solid #333333;
			border-bottom: 1px solid #333333;
			width: 100px;
			text-align: center;
			padding-top: 10px;
			padding-bottom: 10px;
		}
		.value{
			border-right: 1px solid #333333;
			border-bottom: 1px solid #333333;
			flex:1;
			padding-left: 30px;
			padding-top: 10px;
			padding-bottom: 10px;
		}
	}
}
</style>
<script>
	import resource from '../../../../api/targetSales.js'
	export default{
		data(){
			return{
				dataObj:{},
				table_data:[{
					name:'预估发货单数（万）',
					key:'ygfhds',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'GMV（万）',
					key:'gmv',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'退款率',
					key:'tkl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'销售收入（万）',
					key:'xssr',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'毛利率',
					key:'mll',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'营销费用率',
					key:'yxfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'店铺团队费用率',
					key:'dptdfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'项目部分摊费用率',
					key:'xmbftfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'事业部分摊费用率',
					key:'sybftfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'领标费用率',
					key:'lbfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'店铺其他费用率',
					key:'dpqtfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'贡献毛益率',
					key:'gxmyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'贡献毛益（万）',
					key:'gxmy',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'物流费用率',
					key:'wlfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'客服费用率',
					key:'kffyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'公摊费用率',
					key:'gtfyl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'净利润（万）',
					key:'jlr',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'净利润率',
					key:'jlrl',
					value:0,
					last_month_value:0,
					actual_data:0,
					target_data:0,
					new_value:"",
					isPer:true,
					advice:""
				}],							//右侧表格数据
				bottom_info:{},			//底部信息
				showRefuse:false,		//拒绝弹窗（项目部）
				refuse_type:'1',		//弹窗类型（1:拒绝；2:同意）
				reason:"",				//原因(1:拒绝；2:同意)
			}
		},
		props:{
			id:{
				type:String,
				default:""
			}
		},
		created(){
			//查看详情
			this.getDetail();
		},
		methods:{
			//查看详情
			getDetail(){
				resource.projectTargetInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						//底部详情
						this.bottom_info = data.data;		//底部信息
						//去年同期
						let before_data = data.before_data;
						//去年同期上月
						let last_year_last_month = data.last_year_last_month;
						//上月实际值
						let last_month_actual_data = data.last_month_actual_data;
						//上月目标值
						let last_month_target_data = data.last_month_target_data;
						this.table_data.map(item => {
							for (let info_k in this.bottom_info) {
								if(item.key == info_k){
									item.new_value = this.bottom_info[info_k];
									item.advice = this.bottom_info[info_k+'_remark'];
								}
							}
							//去年同期
							if(before_data.length == 0){
								item.value = 0;
							}else{
								for (let be_k in before_data) {
									if(item.key == be_k){
										item.value = before_data[be_k];
									}
								}
							}
							//去年同期上月
							if(last_year_last_month.length == 0){
								item.last_month_value = 0;
							}else{
								for (let l_k in last_year_last_month) {
									if(item.key == l_k){
										item.last_month_value = last_year_last_month[l_k];
									}
								}
							}
							//上月实际值
							if(last_month_actual_data.length == 0){
								item.actual_data = 0;
							}else{
								for (let l_a_k in last_month_actual_data) {
									if(item.key == l_a_k){
										item.actual_data = last_month_actual_data[l_a_k];
									}
								}
							}
							//上月目标值
							if(last_month_target_data.length == 0){
								item.target_data = 0;
							}else{
								for (let l_t_k in last_month_target_data) {
									if(item.key == l_t_k){
										item.target_data = last_month_target_data[l_t_k];
									}
								}
							}
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击审核
			auditFn(type){
				this.refuse_type = type;
				this.showRefuse = true;
			},
			//审核弹窗确认
			refuseCheck(){
				if(this.refuse_type == '1'){	//拒绝
					if(this.reason == ''){
						this.$message.warning('请输入拒绝原因');
					}else{
						//提交审核
						this.targetCheck('refuse');
					}
				}else{	//同意
					//提交审核
					this.targetCheck('agree');
				}
			},
			//提交审核
			targetCheck(type){
				let arg = {
					id:this.id,
					from_type:'business',
					type:type,
					refuse_reason:this.reason,
					agree_reason:this.reason
				}
				resource.projectTargetCheck(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.$emit('callback');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>

















