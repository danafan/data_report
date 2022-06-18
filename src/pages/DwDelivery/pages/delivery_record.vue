<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货时间：">
				<el-date-picker v-model="send_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="支付时间：">
				<el-date-picker v-model="pay_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="订单状态：">
				<el-select v-model="trade_status" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="已发货" value="1"></el-option>
					<el-option label="发货中" value="2"></el-option>
					<el-option label="未发货" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺ID：">
				<el-select v-model="shop_id" clearable filterable reserve-keyword :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.shop_id" :label="item.shop_name" :value="item.shop_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否预发货：">
				<el-select v-model="labels" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="shop_id" label="聚水潭编码" align="center"></el-table-column>
			<el-table-column prop="shop_name" label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="trade_id" label="内部订单号" align="center"></el-table-column>
			<el-table-column prop="trade_no" label="线上订单号" align="center"></el-table-column>
			<el-table-column prop="goods_name" label="商品名称" align="center"></el-table-column>
			<el-table-column prop="sell_count" label="数量" width="120" align="center">
			</el-table-column>
			<el-table-column prop="sndtime" width="130" label="发货时间" align="center">
			</el-table-column>
			<el-table-column prop="pay_time" width="140" label="支付时间" align="center"></el-table-column>
			<el-table-column prop="i_id" width="140" label="款式编码" align="center"></el-table-column>
			<el-table-column prop="goods_code" width="140" label="商品编码" align="center"></el-table-column>
			<el-table-column prop="supplier_name" width="190" label="供应商名称" align="center"></el-table-column>
			<el-table-column prop="supplier_sku_id" width="140" label="供应商款式编码" align="center"></el-table-column>
			<el-table-column prop="supplier_i_id" width="140" label="供应商商品编码" align="center"></el-table-column>
			<el-table-column prop="labels" width="140" label="预发货" align="center"></el-table-column>
			<el-table-column prop="trade_status" width="190" label="状态" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
<script>
	import resource from '../../../api/dwResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
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
				send_date:[],			//发货时间
				pay_date:[],			//支付时间
				trade_status:'',		//订单状态
				shop_list:[],			//店铺列表
				shop_id:"",				//选中的店铺id
				labels:"",				//是否预发货
				page:1,
				pagesize:10,
				dataObj:{},				//返回数据
			}
		},
		created(){
			//获取ajax获取得物店铺店铺id
			this.ajaxShops();
			//获取列表
			this.getData();
		},
		methods:{
			//获取ajax获取得物店铺店铺id
			ajaxShops(){
				resource.ajaxShops().then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFn(){
				this.page = 1;
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					send_start_date:this.send_date && this.send_date.length> 0?this.send_date[0]:"",
					send_end_date:this.send_date && this.send_date.length> 0?this.send_date[1]:"",
					pay_start_date:this.pay_date && this.pay_date.length> 0?this.pay_date[0]:"",
					pay_end_date:this.pay_date && this.pay_date.length> 0?this.pay_date[1]:"",
					trade_status:this.trade_status,
					labels:this.labels,
					shop_id:this.shop_id,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.dewuOrder(arg).then(res => {
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
						send_start_date:this.send_date && this.send_date.length> 0?this.send_date[0]:"",
						send_end_date:this.send_date && this.send_date.length> 0?this.send_date[1]:"",
						pay_start_date:this.pay_date && this.pay_date.length> 0?this.pay_date[0]:"",
						pay_end_date:this.pay_date && this.pay_date.length> 0?this.pay_date[1]:"",
						trade_status:this.trade_status,
						labels:this.labels,
						shop_id:this.shop_id,
					}
					resource.dewuOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'得物发货情况明细');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
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
		}
	}
</script>










