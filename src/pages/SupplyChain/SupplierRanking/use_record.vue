<template>
	<div>
		<div class="table_title">使用排行榜</div>
		<div class="raking_row">
			<div>
				<el-table size="small" border :data="today_data" tooltip-effect="dark" max-height="350px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="raking_loading">
					<el-table-column width="100" prop="supplier_name" show-overflow-tooltip label="供应商" align="center"></el-table-column>
					<el-table-column width="80" prop="level" label="供应商等级" align="center"></el-table-column>
					<el-table-column width="90" prop="num" label="当日登录次数" align="center"></el-table-column>
				</el-table>
			</div>
			<div>
				<el-table size="small" border :data="seven_days_list" tooltip-effect="dark" max-height="350px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="raking_loading">
					<el-table-column width="100" prop="supplier_name" show-overflow-tooltip label="供应商" align="center"></el-table-column>
					<el-table-column width="80" prop="level" label="供应商等级" align="center"></el-table-column>
					<el-table-column width="90" prop="num" label="7日登录次数" align="center"></el-table-column>
				</el-table>
			</div>
			<div>
				<el-table size="small" border :data="month_list" tooltip-effect="dark" max-height="350px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="raking_loading">
					<el-table-column width="100" prop="supplier_name" show-overflow-tooltip label="供应商" align="center"></el-table-column>
					<el-table-column width="80" prop="level" label="供应商等级" align="center"></el-table-column>
					<el-table-column width="90" prop="num" label="30日登录次数" align="center"></el-table-column>
				</el-table>
			</div>
			<div>
				<el-table size="small" border :data="total_list" tooltip-effect="dark" max-height="350px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="raking_loading">
					<el-table-column width="100" prop="supplier_name" show-overflow-tooltip label="供应商" align="center"></el-table-column>
					<el-table-column width="80" prop="level" label="供应商等级" align="center"></el-table-column>
					<el-table-column width="100" prop="rate" label="登录比率" align="center"></el-table-column>
					<el-table-column width="100" prop="days" label="登录天数" align="center"></el-table-column>
					<el-table-column width="160" prop="add_day" label="账号开通时间" align="center"></el-table-column>
				</el-table>
			</div>
		</div>
		<div class="table_title margin_top">登录统计</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="gysmc" clearable filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商等级：">
				<el-select v-model="gys_level"  clearable placeholder="请选择供应商等级">
					<el-option label="S" value="S"></el-option>
					<el-option label="A" value="A"></el-option>
					<el-option label="B" value="B"></el-option>
					<el-option label="C" value="C"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="登录时间:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-checkbox true-label="1" false-label="0" v-model="unlogin_flag">未登录过账号</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getLoginLog">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="log_data" tooltip-effect="dark" max-height="350px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="log_loading">
			<el-table-column width="350" prop="supplier_name" show-overflow-tooltip label="供应商" align="center"></el-table-column>
			<el-table-column width="350" prop="level" label="供应商等级" align="center"></el-table-column>
			<el-table-column width="350" prop="num" sortable='custom' label="登录次数" align="center"></el-table-column>
		</el-table>
		<div class="table_title margin_top">登录明细</div>
		<el-table size="small" :data="record_data" tooltip-effect="dark" max-height="350px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="record_loading">
			<el-table-column prop="supplier_name" show-overflow-tooltip label="供应商" align="center"></el-table-column>
			<el-table-column prop="level" label="供应商等级" align="center"></el-table-column>
			<el-table-column prop="add_time" label="登录时间" align="center"></el-table-column>
			<el-table-column prop="ip" label="登录IP" align="center"></el-table-column>
			<el-table-column prop="phone" label="手机号" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import operResource from '../../../api/operationResource.js'
	export default{
		data(){
			return{
				raking_loading:false,
				today_data:[],			//当日
				seven_days_list:[],		//七日
				month_list:[],			//30日
				total_list:[],			//累计
				gys_list:[],						//供应商
				gysmc:"",							//选中的供应商
				gys_level:"",						//选中的供应商等级
				date:[],							//日期
				unlogin_flag:0,
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
				},	 								//时间区间
				sort:"",
				log_data:[],						//统计列表
				log_loading:false,
				page:1,
				pagesize:10,
				record_data:[],
				total:0,
				record_loading:false
			}
		},
		created(){
			//获取使用记录
			this.getUsedRecord();
			//获取统计数据
			this.getLoginLog();
			//登录明细
			this.loginRecord();
		},
		methods:{
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
			//获取使用记录
			getUsedRecord(){
				this.raking_loading = true;
				operResource.usedRecord().then(res => {
					if(res.data.code == 1){
						this.raking_loading = false;
						let data = res.data.data;
						this.today_list = data.today_list;
						this.seven_days_list = data.seven_days_list;
						this.month_list = data.month_list;
						this.total_list = data.total_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取统计数据
			getLoginLog(){
				let arg = {
					unlogin_flag:this.unlogin_flag
				}
				if(this.unlogin_flag === '0'){
					arg.sort = this.sort;
					arg.supplier_name = this.gysmc;
					arg.supplier_level = this.gys_level;
					arg.start_date = this.date && this.date.length> 0?this.date[0]:"";
					arg.end_date = this.date && this.date.length> 0?this.date[1]:"";
				}
				this.log_loading = true;
				operResource.loginLog(arg).then(res => {
					if(res.data.code == 1){
						this.log_loading = false;
						this.log_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//登录统计排序
			sortChange(column){
				this.sort = !column.order?'':(column.prop + '-' + (column.order == 'ascending'?'1':'0'));
				this.getLoginLog();
			},
			//登录明细
			loginRecord(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize
				}
				this.record_loading = true;
				operResource.loginRecord(arg).then(res => {
					if(res.data.code == 1){
						this.record_loading = false;
						let data = res.data.data;
						this.record_data = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.loginRecord();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.loginRecord();
			},
		}
	}
</script>
<style lang="less" scoped>
.table_title{
	margin-bottom: 15px;
	font-size: 14px;
	color: #333333;
	font-weight: bold;
}
.margin_top{
	margin-top: 15px;
}
.raking_row{
	display: flex;
	justify-content: space-between;
}
</style>