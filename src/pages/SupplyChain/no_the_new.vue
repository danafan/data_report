<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_row">
			<div class="left_table">
				<div class="table_title">事业部上架统计</div>
				<el-table size="small" :data="dept_data" tooltip-effect="dark" style="width: 100%" max-height="260px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="syb_loading">
					<el-table-column prop="title" label="事业部" align="center" width="155" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="lower_shelves_num" label="未上架款数" align="center" width="155" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="on_shelves_num" label="上架款数" align="center" width="155" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="on_dev" label="上架率" align="center" width="155" show-overflow-tooltip>
					</el-table-column>
				</el-table>
				<div class="table_title">店铺上架统计</div>
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item label="事业部：">
						<el-select size="mini" v-model="dept_name" multiple filterable collapse-tags clearable placeholder="全部" @change="onStoreIndex">
							<el-option v-for="item in dept_list" :key="item.dept_name" :label="item.dept_name" :value="item.dept_name">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-table size="small" :data="store_data.data" tooltip-effect="dark" style="width: 100%" max-height="320px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="dp_loading">
					<el-table-column prop="title" label="店铺" align="center" width="260" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="lower_shelves_num" label="未上架款数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="on_shelves_num" label="上架款数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="on_dev" label="上架率" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="storeSizeChange" @current-change="storePageChange" :current-page="store_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="store_data.total">
					</el-pagination>
				</div>
			</div>
			<div class="right_table">
				<div class="table_title">共用款上新情况</div>
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item label="款式编码：">
						<el-select size="mini" v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags @change="newIndex">
							<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<el-table size="small" :data="new_data.data" tooltip-effect="dark" style="position: absolute;width: 100%" max-height="630px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="new_loading">
					<el-table-column prop="ksbm" label="款式编码" align="center" width="120" show-overflow-tooltip fixed="left">
					</el-table-column>
					<el-table-column label="图片" align="center" width="180">
						<template slot-scope="scope">
							<el-image
							style="width: 160px; height: 80px"
							fit="cover"
							:src="scope.row.tp" v-if="scope.row.tp != ''" @click="bigImg(scope.row.tp)"></el-image>
							<div v-else>暂无图片</div>
						</template>
					</el-table-column>
					<el-table-column prop="lower_shelves_num" label="未上架店铺数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="lower_shelves_dp" label="未上架店铺名称" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="on_shelves_num" label="已上架店铺数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="on_shelves_dp" label="已上架店铺名称" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_7" label="7天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_6" label="6天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_5" label="5天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_4" label="4天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_3" label="3天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_2" label="2天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_1" label="1天前日销" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_7_sum" label="7日销量汇总" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="xssl_7_avg" label="7天日均" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="sfsl_7_sum" label="7日实发" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="sf_dev" label="实发率" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="qhs" label="缺货数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="qh_dev" label="缺货率" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="dhs_3" label="3天前到货数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="dhs_2" label="2天前到货数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="dhs_1" label="1天前到货数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="jhckc" label="进仓数" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="kc_now" label="库存" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
					<el-table-column prop="turnover" label="库转周期" align="center" width="120" show-overflow-tooltip>
					</el-table-column>
				</el-table>
				<div class="page new_page">
					<el-pagination @size-change="newSizeChange" @current-change="newPageChange" :current-page="new_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="new_data.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
			<div style="display: flex;justify-content: center;width: 100%;height: 450px">
				<el-image
				style="height: 450px"
				fit="fill"
				:src="big_img_url"></el-image>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imageDialog = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import commonResource from '../../api/resource.js'
	import resource from '../../api/demandResource.js'
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
				date:[],						//统计时间
				syb_loading:false,
				dept_data:[],					//事业部数据
				dp_loading:false,
				dept_list:[],					//事业部列表
				dept_name:[],					//选中的事业部列表
				store_page:1,
				store_pagesize:10,
				store_data:{},
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				new_page:1,
				new_pagesize:10,
				new_loading:false,
				new_data:{},
				imageDialog:false,
				big_img_url:"",
			}
		},
		created(){
			//事业部上架统计
			this.onDeptIndex();
			//部门列表
			this.getDept();
			//店铺上架统计
			this.onStoreIndex();
			//公用款上新情况
			this.newIndex();
		},
		methods:{
			//图片放大
			bigImg(big_img_url){
				this.big_img_url = big_img_url;
				this.imageDialog = true;
			},
			// 点击搜索
			searchFn(){

			},
			//事业部上架统计
			onDeptIndex(){
				let arg = {
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:""
				}
				this.syb_loading = true;
				resource.onDeptIndex(arg).then(res => {
					if(res.data.code == 1){
						this.dept_data = res.data.data;
						this.syb_loading = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//部门列表
			getDept(){
				if(this.$store.state.dept_list.length == 0){  
					commonResource.ajaxViewDept().then(res => {
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
			//分页
			storeSizeChange(val) {
				this.store_pagesize = val;
				//获取列表
				this.onStoreIndex();
			},
			storePageChange(val) {
				this.store_page = val;
				//获取列表
				this.onStoreIndex();
			},
			//店铺上架统计
			onStoreIndex(){
				let arg = {
					dept_name:this.dept_name.join(','),
					page:this.store_page,
					pagesize:this.store_pagesize,
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:""
				}
				this.dp_loading = true;
				resource.onStoreIndex(arg).then(res => {
					if(res.data.code == 1){
						this.store_data = res.data.data;
						this.dp_loading = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					commonResource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//分页
			newSizeChange(val) {
				this.new_pagesize = val;
				//获取列表
				this.newIndex();
			},
			newPageChange(val) {
				this.new_page = val;
				//获取列表
				this.newIndex();
			},
			//公用款上新情况
			newIndex(){
				let arg = {
					ksbm:this.select_ks_ids.join(','),
					page:this.new_page,
					pagesize:this.new_pagesize,
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:""
				}
				this.new_loading = true;
				resource.newIndex(arg).then(res => {
					if(res.data.code == 1){
						this.new_data = res.data.data;
						this.new_loading = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		}
	}
</script>
<style lang="less" scoped>
.table_row{
	display: flex;
	.left_table{
		width: 620px;
	}
	.right_table{
		margin-left: 15px;
		flex:1;
		position: relative;
	}
	.table_title{
		margin-top: 20px;
		margin-bottom: 10px;
		font-size: 16px;
		color: #333333;
		font-weight: bold;
	}
	.new_page{
		position: absolute;
		bottom: 0;
		right: 0;
	}
}
</style>