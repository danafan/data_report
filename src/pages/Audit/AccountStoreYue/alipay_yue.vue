<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="支付宝账号：">
				<el-select v-model="select_zfb_ids" clearable multiple filterable reserve-keyword placeholder="请选择支付宝账号" collapse-tags>
					<el-option v-for="item in zfb_list" :key="item.id" :label="item.alipay_name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="total_row">
			总支出：<span>{{dataObj.disburse_total}}</span>&nbsp&nbsp&nbsp总收入：<span>{{dataObj.income_total}}</span>
		</div>
		<div class="table_title_row">
			<div class="title">支付宝余额：<span>（每日更新一次）（账号总数：{{dataObj.total_num}}；今日更新：{{dataObj.today_num}}）</span></div>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="company_body" show-overflow-tooltip label="公司主体" align="center"></el-table-column>
			<el-table-column prop="shop" show-overflow-tooltip label="店铺" align="center"></el-table-column>
			<el-table-column prop="bill_date" show-overflow-tooltip label="日期" align="center"></el-table-column>
			<el-table-column prop="bill_account" show-overflow-tooltip label="支付宝账号" align="center"></el-table-column>
			<el-table-column prop="init_amount" show-overflow-tooltip label="初始余额" align="center"></el-table-column>
			<el-table-column prop="income_amount" show-overflow-tooltip label="收入" align="center"></el-table-column>
			<el-table-column prop="disburse_amount" label="支出" align="center"></el-table-column>
			<el-table-column prop="final_amount" label="最终余额" align="center"></el-table-column>
			<el-table-column prop="remark" show-overflow-tooltip label="备注" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.data.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/auditResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				zfb_list:[],				//支付宝账号列表
				select_zfb_ids:[],			//选中的支付宝账号列表
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
				},	 						//时间区间
				date:[],					//日期
				page:1,
				pagesize:10,				
				dataObj:{
					data:{}
				},					
			}
		},
		created(){
			//获取所有支付宝账号列表
			this.alipayAccounts();
			//支付宝账单
			this.alipayBill();
		},
		methods:{
			//获取所有支付宝账号列表
			alipayAccounts(){
				resource.alipayAccounts().then(res => {
					if(res.data.code == 1){
						this.zfb_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},	
			//点击搜索
			searchFn(){
				this.page = 1;
				//支付宝账单
				this.alipayBill();
			},
			//支付宝账单
			alipayBill(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					alipay_account_id:this.select_zfb_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				resource.alipayBill(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			
			//款式销量排行分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.alipayBill();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.alipayBill();
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
						alipay_account_id:this.select_zfb_ids.join(',')
					}
					resource.alipayBillExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'支付宝账单');
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
<style lang="less" scoped>
.total_row{
	margin-bottom: 10px;
	font-size: 16px;
	color:#333333;
	font-weight:bold;
	span{
		color:red;
	}
}
.table_title_row{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title{
		font-size: 14px;
		color:#333333;
		font-weight: bold;
		span{
			color:red;
		}
	}
}
</style>