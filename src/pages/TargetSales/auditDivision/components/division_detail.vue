<template>
	<div>
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column width="150" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
			<el-table-column width="180" :label="`去年同期上月（${getLastyearLastMonth}）`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.last_month_value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" :label="`去年同期（${getLastyearCurrentMonth}）`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" :label="`上月目标值（${getLastMonth}）`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.target_data}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" :label="`上月实际值（${getLastMonth}）`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.actual_data}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" :label="`本月目标参数（${getCurrentMonth}）`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.new_value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="bottom_table" v-loading="loading">
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
			<div class="row">
				<div class="lable">审核状态：</div>
				<div class="value">{{bottom_info.status == '0'?'待审核':bottom_info.status == '1'?'审核通过':'审核拒绝'}}</div>
			</div>
			<div class="row">
				<div class="lable">审核人：</div>
				<div class="value">{{bottom_info.audit_user_name}}</div>
			</div>
			<div class="row">
				<div class="lable">审核时间：</div>
				<div class="value">{{bottom_info.audit_time}}</div>
			</div>
			<div class="row" v-if="bottom_info.status == '2'">
				<div class="lable">拒绝原因：</div>
				<div class="value">{{bottom_info.refuse_reason}}</div>
			</div>
			<div class="row" v-if="bottom_info.status == '1'">
				<div class="lable">审核人备注：</div>
				<div class="value">{{bottom_info.agree_reason}}</div>
			</div>
		</div>
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
				getLastMonth:"",
				getCurrentMonth:"",
				getLastyearLastMonth:"",
				getLastyearCurrentMonth:"",
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
				loading:false
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
				this.loading = true;
				resource.businessTargetInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;

						//底部详情
						this.bottom_info = data.data;		//底部信息
						this.getLastMonth = (this.bottom_info.month == 1?this.bottom_info.year-1:this.bottom_info.year) + '-' + (this.bottom_info.month == 1?12:this.bottom_info.month-1);
						this.getCurrentMonth = this.bottom_info.year + '-' + this.bottom_info.month;
						this.getLastyearLastMonth = (this.bottom_info.month == 1?this.bottom_info.year-2:this.bottom_info.year-1) + '-' + (this.bottom_info.month == 1?12:this.bottom_info.month-1);
						this.getLastyearCurrentMonth = (this.bottom_info.year-1) + '-' + this.bottom_info.month;
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
			}
		}
	}
</script>

















