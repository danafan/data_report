<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部：">
				<el-cascader
				 size="mini"
				class="input_cascader"
				ref="cascader"
				:options="dept_list"
				:props="props"
				filterable
				@change="getIds"
				@remove-tag="getIds"
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="select_store_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
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
	import resource from '../../api/resource.js'
	import replaceSend from '../../api/replaceSend.js'
	export default{
		data(){
			return{
				dept_list:[],								//部门列表
				select_dept_ids:[],							//选中的部门列表
				props:{
					multiple:true,
					value:'dept_id',
					label:'dept_name',
					children:'list',
				},
				shop_list:[],								//店铺列表
				select_store_ids:[],						//选中的店铺列表
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
			//部门列表
			this.getDept();
			//店铺列表
			this.getStore();
			//获取列表
			this.getList();
		},
		methods:{
			//部门列表
			getDept(){
				if(this.$store.state.dept_list.length == 0){  
					resource.ajaxViewDept().then(res => {
						if(res.data.code == 1){
							this.dept_list = res.data.data;
							this.$store.commit('setDeptList',this.dept_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.dept_list = this.$store.state.dept_list;
				}
			},
			//切换部门
			getIds(){
				this.$nextTick(()=>{
					var arr = [];
					var select_department = this.$refs.cascader.getCheckedNodes({leafOnly:true});
					select_department.map(s => {
						if(!!s.parent){	//最后一层有父级
							var m = s.parent;
							if(!!m.checked){ //倒数第二层被全选了
								if(!!m.parent){ //倒数第二层有父级
									var d = m.parent;
									if(!!d.checked){ //倒数第三层被全选了
										if(arr.indexOf(d.value) == -1){
											arr.push(d.value);
										}
									}else{
										if(arr.indexOf(m.value) == -1){
											arr.push(m.value);
										}
									}
								}else{
									if(arr.indexOf(m.value) == -1){
										arr.push(m.value);
									}
								}
							}else{
								arr.push(s.value);
							}
						}else{	//只有一层
							arr.push(s.value);
						}
					})
					this.select_dept_ids = arr;
					//店铺列表
					this.getStore();
				});
			},
			//店铺列表
			getStore(){
				this.select_store_ids = [];
				let dept_id = this.select_dept_ids.join(',');
				resource.ajaxViewStore({dept_id:dept_id,from:1}).then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					after_sales_type:this.after_sales_type.join(','),
					after_sales_status:this.after_sales_status.join(','),
					after_sales_goods_status:this.after_sales_goods_status.join(','),
					dept_id:this.select_dept_ids.join(','),
					shop_id:this.select_store_ids.join(','),
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