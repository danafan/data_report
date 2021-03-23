<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺：">
				<el-select v-model="select_store_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_supplier_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_article_number_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_category_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_style_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="建议货品性质：">
				<el-select v-model="select_nature_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="波段：">
				<el-select v-model="select_advice_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否可退：">
				<el-select v-model="select_advice_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否内供：">
				<el-select v-model="select_advice_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否修正：">
				<el-select v-model="select_advice_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否确认：">
				<el-select v-model="select_advice_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in common_data" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期筛选:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="daterange"
				:clearable="false"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="search">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="table_setting">
		<el-button type="primary" size="small">批量设置</el-button>
		<el-button type="primary" plain size="small">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
	<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column type="selection" width="55" fixed></el-table-column>
		<el-table-column prop="job_no" label="店铺" width="120" align="center"></el-table-column>
		<el-table-column prop="dept_name" label="款式" width="120" align="center"></el-table-column>
		<el-table-column prop="position" label="供应商货号" align="center"></el-table-column>
		<el-table-column prop="ding_user_name" label="品类" align="center"></el-table-column>
		<el-table-column prop="menu_role_name" label="供应商" width="120" align="center"></el-table-column>
		<el-table-column label="是否可退" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.status == '0'?'是':'否'}}</div>
			</template>
		</el-table-column>
		<el-table-column prop="data_role_name" label="上架日期" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="上架天数" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="3天销量" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="7天销量" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="建议" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="实际货品性质" width="120" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="建议货品性质" width="120" align="center"></el-table-column>
		<el-table-column prop="data_role_name" label="建议日期" align="center"></el-table-column>
		<el-table-column label="操作" align="center" width="180" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small">试</el-button>
				<el-button type="text" size="small">补</el-button>
				<el-button type="text" size="small">停</el-button>
				<el-button type="text" size="small">清</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="req.page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="dataObj.total"
		>
	</el-pagination>
</div>

</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
}
</style>
<script>
	import resource from '../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	export default{
		data(){
			return{
				req:{
					search:"",
					pagesize:10,
					page:1
				},
				common_data:[{
					id:'1',
					name:'条件1'
				},{
					id:'2',
					name:'条件2'
				},{
					id:'3',
					name:'条件3'	
				}],										//公共的筛选条件
				select_store_ids:[],					//店铺id列表
				select_supplier_ids:[],					//供应商id列表
				select_article_number_ids:[],			//供应商货号id列表
				select_category_ids:[],					//品类id列表
				select_style_ids:[],					//款式id列表
				select_nature_ids:[],					//建议货品性质id列表
				select_advice_ids:[],					//建议id列表
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
				date:[getMonthStartDate(),getCurrentDate()],//发货时间
				start_time:getMonthStartDate(),		//开始时间
				end_time:getCurrentDate(),			//结束时间
				dataObj:{button_list:{
					setting:'0'
				}},						//列表数据,
				select_user_ids:[],		//选中的用户id列表
			}
		},
		created(){
			//获取列表
			this.userList();
		},
		watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
		},
		methods:{
			//搜索
			search(){
				this.req.page = 1;
				//获取列表
				this.userList();
			},	
			//获取列表
			userList(){
				// resource.userList(this.req).then(res => {
				// 	if(res.data.code == 1){
				// 		this.dataObj = res.data.data;
				// 	}else{
				// 		this.$message.warning(res.data.msg);
				// 	}
				// });
			},
			//切换选中
			handleSelectionChange(val) {
				this.select_user_ids = [];
				val.map(item => {
					this.select_user_ids.push(item.user_id)
				})
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.userList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.userList();
			},
		}
	}
</script>