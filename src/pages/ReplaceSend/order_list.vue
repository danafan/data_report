<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="订单号：">
				<el-input v-model="search" placeholder="订单号/内部订单号"clearable></el-input>
			</el-form-item>
			<el-form-item label="订单状态：">
				<el-select v-model="select_order_status" clearable multiple filterable reserve-keyword placeholder="请选择订单状态" collapse-tags>
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column :label="item.label" :prop="item.prop" :width="item.width" align="center" show-overflow-tooltip v-for="item in main_columns">
				<template slot-scope="scope">
					<div class="fcol" v-if="item.prop == 'labels'">
						<el-tag class="mb5" size="mini" v-for="tag in scope.row.labels
						">{{tag}}</el-tag>
					</div>
					<div v-else-if="item.prop == 'goods_name'">
						<el-popover placement="right" trigger="hover">
							<el-table size="small" :data="scope.row.goods_list" :show-header="false">
								<el-table-column width="100">
									<template slot-scope="prop">
										<el-image :z-index="2006" class="table_image" :src="domain + prop.row.image" fit="scale-down"></el-image>
									</template>
								</el-table-column>
								<el-table-column width="120">
									<template slot-scope="prop">
										<div class="box flex jsb col fs">
											<div class="lan">{{prop.row.i_id}}</div>
											<div class="ccc">{{prop.row.refund_status}}</div>
										</div>
									</template>
								</el-table-column>
								<el-table-column width="50">
									<template slot-scope="prop">
										<div class="box red">¥ {{prop.row.sell_price}}</div>
									</template>
								</el-table-column>
								<el-table-column width="50">
									<template slot-scope="prop">
										<div class="box">x{{prop.row.sell_count}}</div>
									</template>
								</el-table-column>
								<el-table-column width="280">
									<template slot-scope="prop">
										<div class="box flex col fs jsb">
											<div class="name">{{prop.row.goods_name}}</div>
											<div>{{prop.row.spec_name}}</div>
										</div>
									</template>
								</el-table-column>
							</el-table>
							<div class="jsa" slot="reference">
								<el-image :z-index="2006" class="image" :src="item" fit="scale-down" v-for="item in scope.row.goods_img_arr"></el-image>
							</div>
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
				status_list:[{
					id:'Sent',
					name:'发货'
				},{
					id:'WaitConfirm',
					name:'待审核'
				},{
					id:'WaitOuterSent',
					name:'等供销商或外仓发货'
				},{
					id:'Delivering',
					name:'发货中'
				},{
					id:'Question',
					name:'异常'
				}],							//订单状态列表
				select_order_status:[],		//选中的订单状态
				page:1,
				pagesize:10,
				main_columns:[{
					label:"订单号",
					prop:"trade_no",
					width:"100"
				},{
					label:"内部订单号",
					prop:"trade_id",
					width:"100"
				},{
					label:"平台",
					prop:"platform",
					width:"100"
				},{
					label:"标记多标签",
					prop:"labels",
					width:"100"
				},{
					label:"店铺",
					prop:"shop_name",
					width:"150"
				},{
					label:"供应商",
					prop:"supplier_name",
					width:"100"
				},{
					label:"商品",
					prop:"goods_name",
					width:"160"
				},{
					label:"包裹重量",
					prop:"jst_weight",
					width:"100"
				},{
					label:"应付金额",
					prop:"all_total",
					width:"100"
				},{
					label:"付款金额",
					prop:"recv_total",
					width:"100"
				},{
					label:"订单创建时间",
					prop:"reg_time",
					width:"100"
				},{
					label:"付款时间",
					prop:"pay_time",
					width:"100"
				},{
					label:"发货仓",
					prop:"warehouse_name",
					width:"100"
				},{
					label:"快递",
					prop:"logistname",
					width:"100"
				},{
					label:"快递单号",
					prop:"logistic_no",
					width:"100"
				},{
					label:"订单状态",
					prop:"new_status",
					width:"100"
				},{
					label:"卖家备注",
					prop:"seller_append_remark",
					width:"100"
				}],
				loading:false,
				table_data:[],
				domain:"",
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
					order_status:this.select_order_status.join(','),
					search:this.search
				}
				this.loading = true;
				replaceSend.orderList(arg).then(res=> {
					if(res.data.code == 1){
						this.loading = false;
						this.table_data = res.data.data.data;
						this.domain = res.data.data.domain;
						this.table_data.map(item => {
							let arr = [];
							item.goods_img_list.map((i,index) => {
								if(index <= 1){
									arr.push(this.domain + i);
								}
							})
							item['goods_img_arr'] = arr;

							item.new_status = this.filterStatus(item.trade_status);
						})
						this.total = res.data.data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//状态
			filterStatus(v){
				let arr = this.status_list.filter(item => {
					return item.id == v;
				})
				return arr.length > 0?arr[0].name:"";
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
		}
	}
</script>
<style lang="less" scoped>
.fcol{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.jsa{
	width: 140px;
	display: flex;
	align-items: center;
	justify-content:space-around;
}
.image{
	width: 50px;
	height: 50px;
}
.table_image{
	width: 80px;
	height: 80px;
}
.box{
	width: 100%;
	height: 80px;
	font-size: 12px;
}
.flex{
	display:flex;
}
.name{
	width: 100%;
	overflow:hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: 2;
	display: -webkit-box;
	-webkit-box-orient: vertical;
	word-break:break-all;//英文
	white-space:pre-wrap;//中文
}
.lan{
	color: #1296db;
}
.ccc{
	color: #999999;
}
.red{
	color: red;
}
.col{
	flex-direction: column;
}
.jsb{
	justify-content: space-between;
}
.fs{
	align-items: flex-start;
}
.mb5{
	margin-bottom: 5px;
}
</style>