<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="订单号：">
				<el-input v-model="search" placeholder="订单号/内部订单号"clearable></el-input>
			</el-form-item>
			<el-form-item label="售后类型：">
				<el-select v-model="after_sales_type" clearable multiple filterable reserve-keyword placeholder="请选择售后类型" collapse-tags>
					<el-option v-for="item in after_sales_type_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="售后状态：">
				<el-select v-model="after_sales_status" clearable multiple filterable reserve-keyword placeholder="请选择售后类型" collapse-tags>
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
				after_sales_type_list:[{
					id:'0',
					name:'售后类型1'
				},{
					id:'1',
					name:'售后类型2'
				},{
					id:'2',
					name:'售后类型3'
				}],							//售后类型列表
				after_sales_type:[],		//选中的售后类型
				after_sales_status_list:[{
					id:'0',
					name:'售后状态1'
				},{
					id:'1',
					name:'售后状态2'
				},{
					id:'2',
					name:'售后状态3'
				}],							//售后状态列表
				after_sales_status:[],		//选中的售后状态
				after_sales_goods_status_list:[{
					id:'0',
					name:'货物状态1'
				},{
					id:'1',
					name:'货物状态2'
				},{
					id:'2',
					name:'货物状态3'
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
					prop:"goods_name",
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
					prop:"jst_weight",
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
					prop:"logistname",
					width:"100"
				},{
					label:"售后类型",
					prop:"logistic_no",
					width:"100"
				},{
					label:"售后状态",
					prop:"",
					width:"100"
				},{
					label:"货物状态",
					prop:"",
					width:"100"
				},{
					label:"实退数量",
					prop:"seller_append_remark",
					width:"100"
				},{
					label:"实收数量",
					prop:"seller_append_remark",
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
						this.table_data = res.data.data.data;
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
		}
	}
</script>
<style lang="less" scoped>
.fcol{
	display: flex;
	flex-direction: column;
	align-items: center;
}
.mb5{
	margin-bottom: 5px;
}
</style>