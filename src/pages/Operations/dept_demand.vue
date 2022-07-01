<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="部门：">
				<el-select v-model="select_dept_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in dept_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间：">
				<el-date-picker size="small" v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="upload_box">
				<el-button type="primary" size="small">
					导入
					<i class="el-icon-upload el-icon--right"></i>
				</el-button>
				<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
			</div>
		</div>
		<el-table :data="tableData" size="small" :span-method="objectSpanMethod" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="date" label="⽇期" width="180" align="center"></el-table-column>
			<el-table-column prop="name" label="项目部" width="180" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="品类" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="款式" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="特殊要求" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="价格带" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="数量" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="供应商" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="完成进度" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="address" label="备注" show-overflow-tooltip align="center"></el-table-column>
		</el-table>
		<!-- <div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div> -->
	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	export default {
		data() {
			return {
				dept_list:[],			//部门列表
				select_dept_ids:[],		//选中的部门列表
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
				},	 					//时间区间
				date:[],				//选中的时间区间
				page:1,
				sizepage:10,			
				tableData: [{
					date: '2016-05-02',
					name: '王⼩虎',
					address: '上海市普陀区⾦沙江路 1518 弄'
				}, {
					date: '2016-05-02',
					name: '王⼩虎',
					address: '上海市普陀区⾦沙江路 1517 弄'
				}, {
					date: '2016-05-02',
					name: '王⼩虎',
					address: '上海市普陀区⾦沙江路 1519 弄'
				}, {
					date: '合计',
					name: '王⼩了',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}, {
					date: '2016-05-03',
					name: '王⼩龙',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}, {
					date: '2016-05-03',
					name: '王⼩龙',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}, {
					date: '合计',
					name: '王⼩茶',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}, {
					date: '2016-05-04',
					name: '王⼩哈',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}, {
					date: '2016-05-04',
					name: '王⼩哈',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}, {
					date: '合计',
					name: '王⼩里',
					address: '上海市普陀区⾦沙江路 1516 弄'
				}],
				rowIndexArr:[],
			};
		},
		created(){
			//部门列表
			// this.getDept();
			//获取列表
			this.getData();
		},
		methods: {
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					console.log(files)
					// resource.importGoods({file:files[0],from:this.from}).then(res => {
					// 	this.$refs.csvUpload.value = null;
					// 	if(res.data.code == 1){
					// 		this.$message.success(res.data.msg);
					// 		this.page = 1;
					// 		//获取列表
					// 		this.getData();
					// 	}else{
					// 		this.$message.warning(res.data.msg);
					// 	}
					// })
				}
			},
			//部门列表
			getDept(){
				resource.clearDept().then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			getList(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let res = this.tableData
				res.reduce((result, currentVal, currentIndex) => {
					if (result == 0 || result != currentVal.date) {
						this.rowIndexArr.push(currentIndex)
					}
					return currentVal.date
				}, 0)
				this.rowIndexArr.push(res.length)
				console.log(this.rowIndexArr)
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
			//合并行
			objectSpanMethod({ rowIndex, columnIndex }) {
				if (columnIndex === 0 || columnIndex === 1) {
					if (this.rowIndexArr.includes(rowIndex)) {
						return {
							rowspan: this.rowIndexArr[this.rowIndexArr.indexOf(rowIndex) + 1] - rowIndex,
							colspan: 1
						}
					} else {
						return {
							rowspan: 0,
							colspan: 0
						}
					}
				}
			}
		}
	};
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.upload_box{
	margin-right: 10px;
	position: relative;
	.upload_file{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
</style>