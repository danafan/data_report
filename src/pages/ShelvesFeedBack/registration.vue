<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-input clearable v-model="ksbm" placeholder="款式编码"></el-input>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-input clearable v-model="dpmc" placeholder="店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="查询时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="add_time" label="提交日期" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="线上款式编码" align="center"></el-table-column>
			<el-table-column prop="dpysgg" label="颜色尺码" align="center"></el-table-column>
			<el-table-column prop="off_reason" label="下架原因" align="center"></el-table-column>
			<el-table-column prop="zxr" label="提交人" align="center"></el-table-column>
			
			<el-table-column prop="zx_time" label="更新时间" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
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
				pagesize:10,
				ksbm:"",		//款式编码
				dpmc:"",		//店铺名称
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
		},
		methods:{
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){
				let arg = {
					dpmc:this.dpmc,
					ksbm:this.ksbm,
					add_time:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
				}
				resource.offShelfDjList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
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