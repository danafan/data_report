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
	</el-table>
	<div class="page">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
		</el-pagination>
	</div>
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
</style>