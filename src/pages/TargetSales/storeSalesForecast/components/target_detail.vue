<template>
	<div>
		<el-table size="small" :data="info_data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" show-overflow-tooltip prop="dept_1_name" label="一级部门" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="dept_2_name" label="二级部门" align="center"></el-table-column>
			<el-table-column width="100" show-overflow-tooltip prop="shop_id" label="主账号ID" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="platform" label="平台" align="center"></el-table-column>
			<el-table-column width="100" show-overflow-tooltip prop="shop_type" label="店铺类别" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="shopowner_name" label="店长" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="reference_shop" label="参考店铺" align="center"></el-table-column>
		</el-table>
		<el-table size="small" :data="table_data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="200" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
			<el-table-column width="180" label="去年同期" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="200" label="本月目标参数" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.new_value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="200" show-overflow-tooltip prop="advice" label="建议" align="center">
			</el-table-column>
		</el-table>
		
		<el-table size="small" :data="day_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" show-summary :summary-method="getSummaries">
			<el-table-column width="70" prop="day" label="日期" align="center"></el-table-column>
			<el-table-column width="45" prop="week" label="星期" align="center"></el-table-column>
			<el-table-column width="70" show-overflow-tooltip prop="gmv" label="日GMV" align="center"></el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="xssr" label="日销量收入" align="center"></el-table-column>
			<el-table-column width="130" prop="xssrzb" label="销售收入占比" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.xssrzb}}%</div>
				</template>
			</el-table-column>
			<el-table-column width="70" show-overflow-tooltip prop="mll" label="毛利率" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.mll}}%</div>
				</template>
			</el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="cpcb" label="产品成本" align="center"></el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="yxfyl" label="营销费用率" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.yxfyl}}%</div>
				</template>
			</el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="yxfy" label="营销费用" align="center"></el-table-column>
			<el-table-column width="90" prop="roi" label="销售ROI目标" align="center"></el-table-column>
			<el-table-column width="95" show-overflow-tooltip prop="dptdfy" label="店铺团队费用" align="center"></el-table-column>
			<el-table-column width="95" show-overflow-tooltip prop="dpqtfy" label="店铺其他费用" align="center"></el-table-column>
			<el-table-column width="105" show-overflow-tooltip prop="xmbftfy" label="项目部分摊费用" align="center"></el-table-column>
			<el-table-column width="105" show-overflow-tooltip prop="sybftfy" label="事业部分摊费用" align="center"></el-table-column>
			<el-table-column width="68" show-overflow-tooltip prop="lbfy" label="领标费用" align="center"></el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="gxmy" label="贡献毛益" align="center"></el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="wlfy" label="物流类费用" align="center"></el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="kffy" label="客服类费用" align="center"></el-table-column>
			<el-table-column width="60" show-overflow-tooltip prop="gtfy" label="公摊费" align="center"></el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="jlr" label="净利润额" align="center"></el-table-column>
			<el-table-column width="68" show-overflow-tooltip prop="jlrl" label="净利润率" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.jlrl}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 店长 -->
		<div class="bottom_table" v-if="type == '1'">
			<div class="row">
				<div class="lable">提交时间：</div>
				<div class="value">{{bottom_info.add_time}}</div>
			</div>
			<div class="row">
				<div class="lable">提交人：</div>
				<div class="value">{{bottom_info.add_user_name}}</div>
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
			<div class="row" v-if="bottom_info.status == '0' || bottom_info.status == '2'">
				<div class="lable">操作：</div>
				<div class="value">
					<el-button size="small" type="text" @click="$emit('callback',id)">请重新建表</el-button>
				</div>
			</div>
		</div>
		<!-- 项目部 -->
		<div class="bottom_table" v-if="type == '2'">
			<div class="row">
				<div class="lable">提交时间：</div>
				<div class="value">{{bottom_info.add_time}}</div>
			</div>
			<div class="row">
				<div class="lable">提交人：</div>
				<div class="value">{{bottom_info.add_user_name}}</div>
			</div>
			<div class="row" v-if="bottom_info.status == '0' || bottom_info.parent_refund_status == 1">
				<div class="lable">操作：</div>
				<div class="value">
					<el-button size="mini" type="danger" @click="showRefuse = true">拒绝</el-button>
					<el-button size="mini" type="primary" @click="agreeFun" v-if="bottom_info.parent_refund_status != 1">同意</el-button>
				</div>
			</div>
		</div>
	<!-- 拒绝 -->
	<el-dialog title="拒绝" :visible.sync="showRefuse" append-to-body>
		<el-input
				type="textarea"
				:rows="3"
				placeholder="请输入拒绝原因（必填）"
				v-model="refuse_reason">
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
				info_data:[],			//顶部详情信息
				table_data:[{
					name:'预估发货单数',
					key:'ygfhds',
					value:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'GMV',
					key:'gmv',
					value:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'退款率',
					key:'tkl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'销售收入',
					key:'xssr',
					value:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'毛利率',
					key:'mll',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'营销费用率',
					key:'yxfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'店铺团队费用率',
					key:'dptdfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'项目部分摊费用率',
					key:'xmbftfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'事业部分摊费用率',
					key:'sybftfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'领标费用率',
					key:'lbfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'店铺其他费用率',
					key:'dpqtfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'贡献毛益率',
					key:'gxmyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'贡献毛益',
					key:'gxmy',
					value:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'物流费用率',
					key:'wlfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'客服费用率',
					key:'kffyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'公摊费用率',
					key:'gtfyl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				},{
					name:'净利润',
					key:'jlr',
					value:0,
					new_value:"",
					isPer:false,
					advice:""
				},{
					name:'净利润率',
					key:'jlrl',
					value:0,
					new_value:"",
					isPer:true,
					advice:""
				}],							//右侧表格数据
				day_table_data:[],		//日数据表格
				bottom_info:{},			//底部信息
				showRefuse:false,		//拒绝弹窗（项目部）
				refuse_reason:"",			//拒绝原因
			}
		},
		props:{
			id:{
				type:String,
				default:""
			},
			type:{		//类型（1:店长；2:部门）
				type:String,
				default:""
			},
		},
		created(){
			//查看详情
			this.getDetail();
		},
		methods:{
			//查看详情
			getDetail(){
				resource.shopTargetInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;

						//顶部店铺详情
						let infoData = data.data;
						this.bottom_info = infoData;		//底部信息
						let info_item = {
							dept_1_name:"",			//选中的一级部门名称
							dept_2_name:"",			//选中的二级部门名称
							shop_id:"",				//主账号ID
							platform:"",			//平台名称
							shop_type:"",			//店铺类别
							shopowner_name:"",		//店长姓名
							reference_shop:"",		//参考店铺名称
							date:"",				//选择的年月
						}
						for (let k in info_item) {
							for (let info_k in infoData) {
								if(k == info_k){
									info_item[k] = infoData[info_k];
								}
							}
						}
						this.info_data.push(info_item);
					//去年同期
					let before_data = data.before_data;
					this.table_data.map(item => {
						for (let info_k in infoData) {
							if(item.key == info_k){
								item.new_value = infoData[info_k];
								item.advice = infoData[info_k+'_remark'];
							}
						}
						if(before_data.length == 0){
							item.value = 0;
						}else{
							for (let be_k in before_data) {
								if(item.key == be_k){
									item.value = before_data[be_k];
								}
							}
						}
					});
						//日数据
						this.day_table_data = data.days_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 表尾合计行处理
			getSummaries(param) {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					sums[index] = values.reduce((prev, curr) => {
						return prev + curr;
					}, 0);
					sums[index] = sums[index].toFixed(2);
					if (index === 1) {	//星期
						sums[index] = '';
					}
					if (index === 4) {	//销售收入占比
						sums[index] = parseInt(sums[index]) + '%';
					}
					if (index === 5) {	//毛利率=月毛利率
						let mll = this.table_data[4].new_value;
						sums[index] = mll + '%';
					}
					if (index === 7) {	//营销费用率=月营销费用率
						let yxfyl = this.table_data[5].new_value;
						sums[index] = yxfyl + '%';
					}
					if (index === 20) {	//净利润率=总日净利润额/总日销售收入
						let jlrl = (sums[19]/sums[3]).toFixed(2);
						sums[index] = jlrl + '%';
					}
				});
				return sums;
			},
			//审核拒绝（部门）
			refuseCheck(){
				if(this.refuse_reason == ''){
					this.$message.warning('请输入拒绝原因');
				}else{
					//提交审核
					this.targetCheck('refuse');
				}
			},
			//审核同意
			agreeFun(){
				this.$confirm('确认同意？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//提交审核
					this.targetCheck('agree');
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			},
			//提交审核
			targetCheck(type){
				let arg = {
					id:this.id,
					from_type:'project',
					type:type
				}
				if(type == 'refuse'){
					arg.refuse_reason = this.refuse_reason;
				}
				resource.shopTargetCheck(arg).then(res => {
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

















