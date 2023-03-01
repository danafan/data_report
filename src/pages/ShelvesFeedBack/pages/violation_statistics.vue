<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="事业部：">
				<el-select v-model="dept_name_ids" multiple filterable collapse-tags clearable placeholder="全部" @change="getStoreList">
					<el-option v-for="item in dept_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="shop_name_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.shop_code" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺ID：">
				<el-select v-model="shop_code_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.shop_code" :label="item.shop_code" :value="item.shop_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="违规时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="dept_name" label="事业部" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="shop" label="店铺ID" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="num" label="违规总数量" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="no_deal_num" label="超时未处理/未上传截图数量" show-overflow-tooltip align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="page"
			:pager-count="11"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="dataObj.total"
			>
		</el-pagination>
	</div>
</div>
</template>
<script>
	import shelvesResource from '../../../api/shelvesResource.js'
	import commonResource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				dept_list:[],					//事业部列表
				dept_name_ids:[],	//选中的事业部列表
				store_list:[],		//店铺列表
				shop_name_ids:[],	//选中的店铺名称列表
				shop_code_ids:[],	//选中的店铺ID列表
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
				date:[],		//违规时间
				page:1,
				pagesize:10,
				dataObj:{},
				loading:false
			}
		},
		created(){
			//部门列表
			this.getDept();
			// 获取店铺
			this.getStoreList();
			//获取列表
			this.getData();
		},
		methods:{
			//部门列表
			getDept(){
				commonResource.ajaxViewDept({from:2}).then(res => {
						// if(res.data.code == 1){
						// 	this.dept_list = res.data.data;
						// 	this.$store.commit('setDeptList',this.dept_list);
						// }else{
						// 	this.$message.warning(res.data.msg);
						// }
					})
			},
			// 获取店铺
			getStoreList(){
				let arg = {
					dept_name:this.dept_name_ids.join(',')
				}
				shelvesResource.violationShopName(arg).then(res => {
					if(res.data.code == 1){
						this.shop_name_ids = [];	//选中的店铺名称列表
						this.shop_code_ids = [];	//选中的店铺ID列表
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			//获取列表
			getData(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:"",
					dept_name:this.dept_name_ids.join(','),
					shop_name:this.shop_name_ids.join(','),
					shop_code:this.shop_code_ids.join(',')	
				}
				this.loading = true;
				shelvesResource.violationAnalysis(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			
		}
	}
</script>
<style lang="less" scoped>
.big_img{
	width: 100%;
}
.img_list{
	display:flex;
	flex-wrap: wrap;
	.dialog_img{
		margin-right: 10px;
		margin-bottom: 10px;
		position: relative;
		width: 120px;
		height: 120px;
		.img{
			width: 100%;
			height: 100%;
		}
		.modal{
			background: rgba(0,0,0,.6);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			img{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				display:block;
				width: 30px;
				height: 30px;
			}
		}
	}
}
</style>















