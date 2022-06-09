<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="入库时间：">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="分仓：">
				<el-select v-model="wms_co_id" clearable :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in wms_list" :key="item.wms_co_id" :label="item.name" :value="item.wms_co_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="仓库：">
				<el-select v-model="wh_id" clearable :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in wh_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="120" show-overflow-tooltip prop="io_id" label="入仓单号" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="name" label="操作仓储方" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="warehouse" label="仓库" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="supplier_name" label="供应商" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="sku_id" label="款式编号" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="po_id" label="采购单号" align="center"></el-table-column>
			<el-table-column width="160" prop="modified" label="创建日期" align="center"></el-table-column>
			<el-table-column width="160" prop="io_date" show-overflow-tooltip label="入库日期" align="center"></el-table-column>
			<el-table-column width="160" prop="goods_labels" show-overflow-tooltip label="商品标签" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="qty" label="数量" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="cost_price" label="单价" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="cost_amount" label="金额" align="center"></el-table-column>
			<el-table-column width="160" prop="creator_name" show-overflow-tooltip label="制单人" align="center"></el-table-column>
			<el-table-column width="160" prop="remark" show-overflow-tooltip label="备注" align="center"></el-table-column>
			<el-table-column width="160" prop="order_labels" show-overflow-tooltip label="标记多标签" align="center"></el-table-column>
			<el-table-column width="160" prop="so_id" show-overflow-tooltip label="线上订单号" align="center"></el-table-column>
			<el-table-column width="160" prop="supplier_id" show-overflow-tooltip label="供应商编码" align="center"></el-table-column>
			<el-table-column width="160" prop="supplier_i_id" show-overflow-tooltip label="供应商款号" align="center"></el-table-column>
			<el-table-column width="160" prop="supplier_sku_id" show-overflow-tooltip label="供应商商品编码" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
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
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/dataExportResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				date:[],		//时间
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
				wms_co_id:"",		//选中的分仓编号
				wms_list:[],		//分仓列表
				wh_id:"",			//选中的主仓编号
				wh_list:[{
					id:1,
					name:'主仓'
				},{
					id:2,
					name:'销退仓'
				},{
					id:3,
					name:'进货仓'
				},{
					id:4,
					name:'次品仓'
				}],						//主仓列表
				pagesize:10,
				page:1,
				dataObj:{}
			}
		},
		created(){
			//获取仓库列表
			this.ajaxWms();
			//采购入库列表
			this.getList();
		},	
		methods:{
			//获取仓库列表
			ajaxWms(){
				resource.ajaxWms().then(res => {
					if(res.data.code == 1){
						this.wms_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFun(){
				this.page = 1;
				//采购入库列表
				this.getList();
			},
			//采购入库列表
			getList(){
				let arg = {
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					wms_co_id:this.wms_co_id,
					wh_id:this.wh_id,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.purinList(arg).then(res => {
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
						start_date:this.date && this.date.length > 0?this.date[0]:"",
						end_date:this.date && this.date.length > 0?this.date[1]:"",
						wms_co_id:this.wms_co_id,
						wh_id:this.wh_id
					}
					resource.purinExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'采购入库数据');
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









