<template>
	<div>
		<el-table size="small" :data="info_data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column width="150" show-overflow-tooltip prop="dept_1_name" label="一级部门" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="dept_2_name" label="二级部门" align="center"></el-table-column>
			<el-table-column width="100" show-overflow-tooltip prop="shop_id" label="主账号ID" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="platform" label="平台" align="center"></el-table-column>
			<el-table-column width="100" show-overflow-tooltip prop="shop_type" label="店铺类别" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="shopowner_name" label="店长" align="center"></el-table-column>
			<el-table-column width="150" show-overflow-tooltip prop="reference_shop_id" label="参考店铺" align="center"></el-table-column>
		</el-table>
		<el-table size="small" :data="table_data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column width="200" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
			<el-table-column width="180" :label="`${reference_year}年同期上月（${getLastyearLastMonth}）`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.last_month_value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="180" :label="`${reference_year}年同期（${getLastyearCurrentMonth}）`" align="center">
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
			<el-table-column width="200" show-overflow-tooltip prop="advice" label="备注" align="center">
			</el-table-column>
		</el-table>
		<div class="table_row">
			<div class="red_toast">*以下【店铺日目标】表格涉及到金额的都是以“万”为单位</div>
			<el-button type="primary" plain size="mini" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="day_table_data" max-height="650" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" show-summary :summary-method="getSummaries" v-loading="loading">
			<el-table-column width="75" prop="day" label="日期" align="center"></el-table-column>
			<el-table-column width="45" prop="week" label="星期" align="center"></el-table-column>
			<el-table-column width="100" prop="gmv" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="日GMV(万)" placement="top-start">
						<div class="text_content">日GMV(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.gmv}}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="xssr" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="日销量收入(万)" placement="top-start">
						<div class="text_content">日销量收入(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.xssr}}</div>
				</template>
			</el-table-column>
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
			<el-table-column width="80" prop="cpcb" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="产品成本(万)" placement="top-start">
						<div class="text_content">产品成本(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.cpcb}}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" show-overflow-tooltip prop="yxfyl" label="营销费用率" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.yxfyl}}%</div>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="yxfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="营销费用(万)" placement="top-start">
						<div class="text_content">营销费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.yxfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="90" prop="roi" label="销售ROI目标" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="销售ROI目标" placement="top-start">
						<div class="text_content">销售ROI目标</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.roi}}%</div>
				</template>
			</el-table-column>
			<el-table-column width="95" prop="dptdfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="店铺团队费用(万)" placement="top-start">
						<div class="text_content">店铺团队费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.dptdfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="95" prop="dpqtfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="店铺其他费用(万)" placement="top-start">
						<div class="text_content">店铺其他费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.dpqtfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="105" prop="xmbftfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="项目部分摊费用(万)" placement="top-start">
						<div class="text_content">项目部分摊费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.xmbftfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="105" prop="sybftfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="事业部分摊费用(万)" placement="top-start">
						<div class="text_content">事业部分摊费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.sybftfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="68" prop="lbfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="领标费用(万)" placement="top-start">
						<div class="text_content">领标费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.lbfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="gxmy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="贡献毛益(万)" placement="top-start">
						<div class="text_content">贡献毛益(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.gxmy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="wlfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="物流类费用(万)" placement="top-start">
						<div class="text_content">物流类费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.wlfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="kffy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="客服类费用(万)" placement="top-start">
						<div class="text_content">客服类费用(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.kffy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="60"prop="gtfy" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="公摊费(万)" placement="top-start">
						<div class="text_content">公摊费(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.gtfy}}</div>
				</template>
			</el-table-column>
			<el-table-column width="80" prop="jlr" show-overflow-tooltip align="center">
				<template slot="header" slot-scope="scope">
					<el-tooltip effect="dark" content="净利润额(万)" placement="top-start">
						<div class="text_content">净利润额(万)</div>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div>{{scope.row.jlr}}</div>
				</template>
			</el-table-column>
			<el-table-column width="68" show-overflow-tooltip prop="jlrl" label="净利润率" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.jlrl}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 底部信息 -->
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
				<div class="lable">审核状态：</div>
				<div class="value">{{bottom_info.status == '0'?'待审核':bottom_info.status == '1'?'审核通过':'审核拒绝'}}</div>
			</div>
			<div class="row" v-if="bottom_info.status != '0'">
				<div class="lable">审核人：</div>
				<div class="value">{{bottom_info.audit_user_name}}</div>
			</div>
			<div class="row" v-if="bottom_info.status != '0'">
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
			<!-- 店长 -->
			<div class="row" v-if="type == '1' && (bottom_info.status == '0' || bottom_info.status == '2')">
				<div class="lable">操作：</div>
				<div class="value">
					<el-button size="small" type="text" @click="$emit('callback',id)">请重新建表</el-button>
				</div>
			</div>
			<!-- 项目部 -->
			<div class="row" v-if="type == '2' && (bottom_info.status == '0' || (bottom_info.status != '2' && bottom_info.parent_refund_status == 1))">
				<div class="lable">操作：</div>
				<div class="value">
					<el-button size="mini" type="danger" @click="auditFn('1')">拒绝</el-button>
					<el-button size="mini" type="primary" @click="auditFn('2')" v-if="bottom_info.parent_refund_status != 1 || bottom_info.status == '0'">同意</el-button>
				</div>
			</div>
		</div>
		<!-- 拒绝 -->
		<el-dialog :visible.sync="showRefuse" append-to-body>
			<div slot="title" class="title_row">
				<div>{{refuse_type == '1'?'拒绝':'同意'}}</div>
				<img class="sh_icon" src="../../../../static/jujue_icon.png" v-if="refuse_type == '1'">
				<img class="sh_icon" src="../../../../static/tongyi_icon.png" v-else>
			</div>
			<el-input
			type="textarea"
			:rows="3"
			:placeholder="refuse_type == '1'?'请输入拒绝原因（必填）':'请输入通过原因（选填）'"
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
.table_row{
	margin-top: 15px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.red_toast{
		color: red;
		font-size: 12px;
	}
}

.text_content{
	overflow: hidden;/*超出部分隐藏*/
	white-space: nowrap;/*不换行*/
	text-overflow:ellipsis;/*超出部分文字以...显示*/
}
.title_row{
	display: flex;
	align-items: center;
}
.sh_icon{
	margin-left: 10px;
	width: 26px;
	height: 26px;
}
</style>
<script>
	import {exportExcel} from '../../../../api/export.js'
	import resource from '../../../../api/targetSales.js'
	export default{
		data(){
			return{
				getLastMonth:"",
				getCurrentMonth:"",
				getLastyearLastMonth:"",
				getLastyearCurrentMonth:"",
				reference_year:"",
				dataObj:{},
				info_data:[],			//顶部详情信息
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
					name:'客单价（元）',
					key:'kdj',
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
				day_table_data:[],		//日数据表格
				bottom_info:{},			//底部信息
				showRefuse:false,		//拒绝弹窗（项目部）
				refuse_type:'1',		//弹窗类型（1:拒绝；2:同意）
				reason:"",				//原因(1:拒绝；2:同意)
				row:{},
				loading:false
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
				this.loading = true;
				resource.shopTargetInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						//顶部店铺详情
						let infoData = data.data;

						this.reference_year = data.reference_year;
						this.getLastMonth = (infoData.month == 1?infoData.year-1:infoData.year) + '-' + (infoData.month == 1?12:infoData.month-1);
						this.getCurrentMonth = infoData.year + '-' + infoData.month;
						this.getLastyearLastMonth = this.reference_year + '-' + (infoData.month == 1?12:infoData.month-1);
						this.getLastyearCurrentMonth = this.reference_year + '-' + infoData.month;

						this.bottom_info = infoData;		//底部信息
						let info_item = {
							dept_1_name:"",			//选中的一级部门名称
							dept_2_name:"",			//选中的二级部门名称
							shop_id:"",				//主账号ID
							platform:"",			//平台名称
							shop_type:"",			//店铺类别
							shopowner_name:"",		//店长姓名
							reference_shop_id:"",		//参考店铺名称
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
						//去年同期上月
						let last_year_last_month = data.last_year_last_month;
						//上月实际值
						let last_month_actual_data = data.last_month_actual_data;
						//上月目标值
						let last_month_target_data = data.last_month_target_data;
						this.table_data.map(item => {
							for (let info_k in infoData) {
								if(item.key == info_k){
									item.new_value = infoData[info_k];
									item.advice = infoData[info_k+'_remark'];
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
					if (index === 4) {	//去年同期销售收入占比
						sums[index] = sums[index] + '%';
					}
					if (index === 5) {	//毛利率=月毛利率
						let mll = this.table_data[4].new_value;
						sums[index] = mll + '%';
					}
					if (index === 7) {	//营销费用率=月营销费用率
						let yxfyl = this.table_data[5].new_value;
						sums[index] = yxfyl + '%';
					}
					if (index === 9) {	//销售ROI目标=日销售收入/日营销费用
						let roi = sums[3] == 0 || sums[8] == 0?0:((sums[3]/sums[8])*100).toFixed(2);
						sums[index] = roi + '%';
					}
					if (index === 20) {	//净利润率=总日净利润额/总日销售收入
						let jlrl = sums[19] == 0 || sums[3] == 0?0:((sums[19]/sums[3])*100).toFixed(2);
						sums[index] = jlrl + '%';
					}
				});
				this.row = sums;
				return sums;
			},
			//点击审核
			auditFn(type){
				this.refuse_type = type;
				this.showRefuse = true;
			},
			exportFile(){
				var data_obj = {
					table_title:`(${this.bottom_info.shop_name})店铺日目标`,
					table_title_list:['日期','星期','日GMV(万)','日销量收入(万)','销售收入占比','毛利率','产品成本(万)','营销费用率','营销费用(万)','销售ROI目标','店铺团队费用(万)','店铺其他费用(万)','项目部分摊费用(万)','事业部分摊费用(万)','领标费用(万)','贡献毛益(万)','物流类费用(万)','客服类费用(万)','公摊费(万)','净利润额(万)','净利润率'],
					field_name_list:['day','week','gmv','xssr','xssrzb','mll','cpcb','yxfyl','yxfy','roi','dptdfy','dpqtfy','xmbftfy','sybftfy','lbfy','gxmy','wlfy','kffy','gtfy','jlr','jlrl'],
					data_list:[]
				};
				let dd = JSON.parse(JSON.stringify(this.day_table_data));
				dd.map(item => {
					for(let k in item){
						if(k == 'xssrzb' || k == 'mll' || k == 'yxfyl' || k == 'roi' || k == 'jlrl'){
							item[k] = item[k] + '%';
						}
					}
				})
				data_obj.data_list = dd; 
				let obj = {};
				data_obj.field_name_list.map((item,index) => {
					obj[item] = this.row[index];
				})
				data_obj.data_list.push(obj)
				exportExcel(data_obj);
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
					from_type:'project',
					type:type,
					refuse_reason:this.reason,
					agree_reason:this.reason
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

















