<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="订单号：">
				<el-input v-model="search" placeholder="订单号/内部订单号"clearable></el-input>
			</el-form-item>
			<el-form-item label="售后类型：">
				<el-select v-model="after_sales_type" clearable multiple filterable reserve-keyword placeholder="请选择售后类型" collapse-tags>
					<el-option v-for="item in after_sales_type_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="售后状态：">
				<el-select v-model="after_sales_status" clearable multiple filterable reserve-keyword placeholder="请选择售后状态" collapse-tags>
					<el-option v-for="item in after_sales_status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="货物状态：">
				<el-select v-model="after_sales_goods_status" clearable multiple filterable reserve-keyword placeholder="请选择货物状态" collapse-tags>
					<el-option v-for="item in after_sales_goods_status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column :label="item.label" :prop="item.prop" :width="item.width" align="center" show-overflow-tooltip v-for="item in main_columns">
				<template slot-scope="scope">
					<div v-if="item.prop == 'pic'">
						<el-popover placement="right" width="400" trigger="hover">
							<el-image class="big_image" :src="scope.row.pic" fit="scale-down"></el-image>
							<el-image slot="reference" class="table_image" :src="scope.row.pic" fit="scale-down"></el-image>
						</el-popover>
					</div>
					<div v-else>{{scope.row[item.prop]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import replaceSend from '../../api/replaceSend.js'
	export default{
		data(){
			return{
				search:"",				//搜索的内容
				after_sales_type_list:['普通退货','其它','拒收退货','仅退款','投诉','补发','换货'],	//售后类型列表
				after_sales_type:[],		//选中的售后类型
				after_sales_status_list:[{
					id:'WaitConfirm',
					name:'待确认'
				},{
					id:'Confirmed',
					name:'已确认'
				},{
					id:'Cancelled',
					name:'作废'
				},{
					id:'Merged',
					name:'被合并'
				}],							//售后状态列表
				after_sales_status:[],		//选中的售后状态
				after_sales_goods_status_list:[{
					id:'BUYER_NOT_RECEIVED',
					name:'买家未收到货'
				},{
					id:'BUYER_RECEIVED',
					name:'买家已收到货'
				},{
					id:'BUYER_RETURNED_GOODS',
					name:'买家已退货'
				},{
					id:'SELLER_RECEIVED',
					name:'卖家已收到退货'
				}],									//货物状态列表
				after_sales_goods_status:[],		//选中的货物状态
				page:1,
				pagesize:10,
				main_columns:[{
					label:"款式编码",
					prop:"i_id",
					width:"100"
				},{
					label:"商品",
					prop:"pic",
					width:"100"
				},{
					label:"平台",
					prop:"platform",
					width:"100"
				},{
					label:"店铺",
					prop:"shop_name",
					width:"100"
				},{
					label:"售后单号",
					prop:"as_id",
					width:"100"
				},{
					label:"内部订单号",
					prop:"trade_id",
					width:"100"
				},{
					label:"线上订单号",
					prop:"trade_no",
					width:"100"
				},{
					label:"发货仓",
					prop:"warehouse_name",
					width:"100"
				},{
					label:"供应商",
					prop:"supplier_name",
					width:"100"
				},{
					label:"供应商编码",
					prop:"supplier_i_id",
					width:"100"
				},{
					label:"售后原因",
					prop:"question_type",
					width:"100"
				},{
					label:"售后类型",
					prop:"type",
					width:"100"
				},{
					label:"售后状态",
					prop:"new_status",
					width:"100"
				},{
					label:"货物状态",
					prop:"new_good_status",
					width:"100"
				},{
					label:"实退数量",
					prop:"qty",
					width:"100"
				},{
					label:"实收数量",
					prop:"r_qty",
					width:"100"
				}],
				loading:false,
				table_data:[],
				total:0,
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					after_sales_type:this.after_sales_type.join(','),
					after_sales_status:this.after_sales_status.join(','),
					after_sales_goods_status:this.after_sales_goods_status.join(','),
					search:this.search
				}
				this.loading = true;
				replaceSend.returnGoods(arg).then(res=> {
					if(res.data.code == 1){
						this.loading = false;
						let table_data = res.data.data.data;
						table_data.map(item => {
							item.new_status = this.filterStatus(item.status);
							item.new_good_status = this.filterGoodsStatus(item.good_status);
						})
						this.table_data = table_data;
						this.total = res.data.data.total;
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
			//售后状态
			filterStatus(v){
				let arr = this.after_sales_status_list.filter(item => {
					return item.id == v;
				})
				return arr[0].name;
			},
			//货物状态
			filterGoodsStatus(v){
				let arr = this.after_sales_goods_status_list.filter(item => {
					return item.id == v;
				})
				return arr.length > 0?arr[0].name:'';
			}
		}
	}
</script>
<style lang="less" scoped>
.fcol{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.table_image{
	width: 50px;
	height: 50px;
}
.big_image{
	width: 100%;
}
.mb5{
	margin-bottom: 5px;
}
</style>