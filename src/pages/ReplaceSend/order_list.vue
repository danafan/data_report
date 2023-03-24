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
			<el-form-item label="款式编码：">
				<el-input v-model="ksbm" placeholder="款式编码"clearable></el-input>
			</el-form-item>
			<el-form-item>
				<el-select style="width: 100px" v-model="time_type">
					<el-option label="下单时间" :value="1"></el-option>
					<el-option label="发货时间" :value="2"></el-option>
				</el-select>
				<el-date-picker
				v-model="date_time"
				type="datetimerange"
				value-format="yyyy-MM-dd HH:mm:ss"
				range-separator="至"
				start-placeholder="开始时间"
				end-placeholder="结束时间">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="订单状态：">
			<el-select v-model="select_order_status" clearable multiple filterable reserve-keyword placeholder="请选择订单状态" collapse-tags>
				<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="供应商：">
			<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
				<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<!-- <el-form-item label="店铺：">
			<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in store_list" :key="item.jst_code" :label="item.shop_name" :value="item.jst_code">
				</el-option>
			</el-select>
		</el-form-item> -->
		<el-form-item>
			<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="buts">
		<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
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
							<!-- <div class="num">3</div> -->
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
	import resource from '../../api/resource.js'
	import replaceSend from '../../api/replaceSend.js'
	import demandResource from '../../api/demandResource.js'
	import {getNowDate,lastXDate} from '../../api/nowMonth.js'

	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				ksbm:"",				//款式编码
				time_type:1,			//时间类型
				date_time:[],			//选中的时间
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
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				// store_list: [],								//店铺列表	
				// select_store_ids:[],						//选中的店铺id列表
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
		props:{
			req:{
				type:Object,
				default:() => {
					
				}
			}
		},
		created(){
			//部门列表
			this.getDept();
			//店铺列表
			this.getStore();
			this.date_time.push(this.req.start_date?this.req.start_date:`${lastXDate(3)} 00:00:00`);
			this.date_time.push(this.req.end_date?this.req.end_date:`${getNowDate(true)}`);
			this.select_order_status = this.req.order_status?this.req.order_status:[];
			this.time_type = this.req.time_type?this.req.time_type:1;
			//点击看板的列表下钻跳转过来的
			this.ksbm = this.req.ksbm?this.req.ksbm:'';
			//获取列表
			this.getList();
		},
		methods:{
			//部门列表
			getDept(){
				if(this.$store.state.dept_list.length == 0){  
					resource.ajaxViewDept({from:3}).then(res => {
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
				resource.ajaxViewStore({dept_id:dept_id,from:3}).then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取列表
			getList(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					order_status:this.select_order_status.join(','),
					supplier_name:this.select_gys_ids.join(','),
					dept_id:this.select_dept_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					search:this.search,
					ksbm:this.ksbm,
					time_type:this.time_type,
					start_date:this.date_time && this.date_time.length > 0?this.date_time[0]:"",
					end_date:this.date_time && this.date_time.length > 0?this.date_time[1]:"",
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
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						order_status:this.select_order_status.join(','),
						supplier_name:this.select_gys_ids.join(','),
						dept_id:this.select_dept_ids.join(','),
						shop_id:this.select_store_ids.join(','),
						search:this.search,
						ksbm:this.ksbm,
						time_type:this.time_type,
						start_date:this.date_time && this.date_time.length > 0?this.date_time[0]:"",
						end_date:this.date_time && this.date_time.length > 0?this.date_time[1]:""
					}
					replaceSend.orderSkuExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'代发订单列表');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
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
	position: relative;
	width: 140px;
	display: flex;
	align-items: center;
	justify-content:space-around;
}
.buts{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
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