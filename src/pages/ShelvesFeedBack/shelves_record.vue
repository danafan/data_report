<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-input clearable v-model="ksbm" placeholder="款式编码"></el-input>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="dpmc" clearable filterable placeholder="全部">
					<el-option v-for="item in store_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="执行结果：">
				<el-select v-model="zxjg" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="未处理" value="0"></el-option>
					<el-option label="已下架" value="1"></el-option>
					<el-option label="不下架" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="查询时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="160" show-overflow-tooltip prop="dpmc" label="店铺名称" align="center"></el-table-column>
				<el-table-column width="120" show-overflow-tooltip prop="zdmc" label="站点名称" align="center"></el-table-column>
				<el-table-column width="160" show-overflow-tooltip prop="ksbm" label="线上款式编码" align="center"></el-table-column>
				<el-table-column width="120" show-overflow-tooltip label="款式链接" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="openWindow(scope.row.url)">{{scope.row.url}}</el-button>
					</template>
				</el-table-column>
				<el-table-column width="160" prop="add_time" label="提交日期" align="center"></el-table-column>
				<el-table-column width="160" prop="dpysgg" show-overflow-tooltip label="下架颜色尺码" align="center"></el-table-column>
				<el-table-column width="160" prop="off_reason" show-overflow-tooltip label="下架原因" align="center"></el-table-column>
				<el-table-column width="120" show-overflow-tooltip label="执行结果" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.zxjg == 0?'未处理':scope.row.zxjg == 1?'已下架':'不下架'}}</div>
					</template>
				</el-table-column>
				<el-table-column width="160" prop="qksm" show-overflow-tooltip label="情况说明" align="center"></el-table-column>
				<el-table-column width="160" prop="zxr" show-overflow-tooltip label="执行人" align="center"></el-table-column>
				<el-table-column width="160" prop="zx_time" show-overflow-tooltip label="执行时间" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/shelvesResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../api/nowMonth.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:15,
				ksbm:"",		//款式编码
				store_list:[],	//所有店铺列表
				dpmc:"",		//选中的店铺列表
				zxjg:"",		//执行结果
				date:[getCurrentDate(),getNowDate()],		//查询日期
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
				dataObj:{},		//返回数据
			}
		},
		created(){
			//获取列表
			this.getList();
			//获取店铺列表
			this.getStoreList();
		},
		methods:{
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//获取店铺列表
			getStoreList(){
				resource.ajaxShops({type:'1'}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				let arg = {
					dpmc:this.dpmc,
					ksbm:this.ksbm,
					zxjg:this.zxjg,
					add_time:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
				}
				resource.offshelfAll(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			openWindow(url){
				window.open(url);
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