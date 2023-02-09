<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" :clearable="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="品类：">
				<el-cascader
				:options="pl_list"
				v-model="select_pl_ids"
				:props="props"
				collapse-tags
				clearable></el-cascader>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 表格 -->
		<div class="title">类目-关键词排行榜</div>
		<div style="font-size: 14px;color: red">数据更新时间为11点</div>
		<el-table size="mini" :data="table_data" tooltip-effect="dark" style="width: 100%" max-height="620" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column v-for="item in title_list
			" :prop="item.row_field_name" :label="item.row_name" :sortable="item.is_sort == 1?'custom':false" show-overflow-tooltip align="center"></el-table-column>
			<!-- <el-table-column prop="pl" label="品类" sortable="custom" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="lm" label="类目" sortable="custom" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="ssc" label="搜索词" sortable="custom" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="rspm" label="热搜排名" sortable="custom"  show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="ssrq" label="搜索人气" sortable="custom" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="djrq" label="点击人气" sortable="custom" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="djl" label="点击率" sortable="custom" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="zfzhl" label="支付转化率" sortable="custom" show-overflow-tooltip align="center"></el-table-column> -->
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import {lastXDate,getCurrentDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '近七天',
						onClick(picker) {
							const start = lastXDate(7);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '近半月',
						onClick(picker) {
							const start = lastXDate(15);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近一月',
						onClick(picker) {
							const start = lastXDate(30);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '近三月',
						onClick(picker) {
							const start = lastXDate(90);
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										//时间区间
				date:[getCurrentDate(),getCurrentDate()],
				props: { 
					multiple: true,
					value:'name',
					label:"name",
					children:'list',
					emitPath:false
				},						
				pl_list:[],				//品类列表
				select_pl_ids:[],		//选中的品类列表
				dataObj:{

				},				//表格数据
				table_data:[],
				title_list:[],
				total:0,
				sort:"",
				page:1,
				pagesize:20,			
				loading:false
			}
		},
		created(){
			//品类列表
			this.getPl();
			//款式列表
			this.stockAnalysisKsList();
		},
		methods:{
			//品类列表
			getPl(){
				resource.ajaxKeywordPl().then(res => {
					if(res.data.code == 1){
						this.pl_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFn(){
				this.page = 1;
				//款式列表
				this.stockAnalysisKsList();
			},
        	//款式列表
        	stockAnalysisKsList(){
        		let arg = {
        			start_date:this.date[0],
        			end_date:this.date[1],
        			pl:this.select_pl_ids.join(','),
        			page:this.page,
        			pagesize:this.pagesize
        		}
        		if(this.sort != ''){
        			arg.sort = this.sort;
        		}
        		this.loading = true;
        		resource.keywords(arg).then(res => {
        			if(res.data.code == 1){
        				this.loading = false;
        				let data = res.data.data;
        				this.table_data = data.data.data;
						this.title_list = data.title_list;
						this.total = data.data.total;
        			}else{
        				this.$message.warning(res.data.msg);
        			}
        		})
        	},
        	//排序
        	sortChange(column){
        		if(column.order){
        			let order = column.order == 'ascending'?'1':'0';
        			this.sort = column.prop + '-' + order;
        		}else{
        			this.sort = '';
        		}
        		this.stockAnalysisKsList();
        	},
        	//分页
        	handleSizeChange(val) {
        		this.pagesize = val;
				//获取列表
				this.stockAnalysisKsList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.stockAnalysisKsList();
			}
		}
	}
</script>
<style lang="less" scoped>
.title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-size: 16px;
	font-weight: bold;
}
</style>
















