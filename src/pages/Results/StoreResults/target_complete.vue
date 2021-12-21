<template>
	<div>
		<dps @callBack="checkReq"></dps>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="公司：">
				<el-select v-model="company" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in company_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="发货日期:" style="margin-right: 20px">
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
			<el-checkbox v-model="is_assessment" true-label="1" false-label="0" border size="small">考核店铺</el-checkbox>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="getData">搜索</el-button>
		</el-form-item>
	</el-form>
	<!-- 第一个表格 -->
	<!-- <div class="table_setting">
		<el-button type="primary" size="small" @click="customFun('zbhz_data')" style="margin-bottom: 5px">自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="exportFun" v-if="button_list.hz_export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div> -->
	<!-- <el-table :data="view_row" size="small" style="width: 100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' :cell-style="columnStyle">
		<el-table-column :label="item.row_name" :prop="item.row_field_name" v-for="item in title_list" :sortable="item.is_sort?'custom':false" show-overflow-tooltip :fixed="item.is_fixed">
			<template slot-scope="scope"> -->
				<!-- 占比 -->
				<!-- <div class="background_box" :style="{width:`${item.max_value == 0?0:(70/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:`${item.color}`}" v-if="item.type == 1 && scope.row.is_total != 1">{{scope.row[item.row_field_name]}}{{item.unit}}</div> -->
				<!-- 普通文字 -->
				<!-- <div class="text_content" :class="{'is_total':item.row_field_name == 'spid'}" v-else>{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ''?item.unit:''}}</div> -->
<!-- 			</template>
		</el-table-column>
	</el-table> -->
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
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
				},	 								//时间区间
				date:[getMonthStartDate(),getCurrentDate()],//发货时间
				start_time:getMonthStartDate(),		//开始时间
				end_time:getCurrentDate(),			//结束时间
				select_department_ids:[],			//选中的部门id列表
				select_plat_ids:[],					//选中的平台列表
				select_store_ids:[],				//选中的店铺id列表
				company_list:[],					//公司列表
				company:['德儿'],					//选中的公司
				is_assessment:'0',					//是否考核店铺
				view_row:[],						//列表数据
			}
		},
		created(){
			//公司列表
			this.ajaxCompany();
			//获取列表
			this.getData();
		},
		watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
		},
		methods:{
			//公司列表
			ajaxCompany(){
				resource.ajaxCompany().then(res => {
					if(res.data.code == 1){
						this.company_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//获取列表
			getData(){
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					audit_flag:this.is_assessment,
					company:this.company.join(',')
				}
				resource.targetComplete(req).then(res => {
					if(res.data.code == 1){
						//列表数据
						this.view_row = res.data.data.view_row;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//指标汇总第一行样式
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(rowIndex == 0){
					return 'color: #8D5714';
				}
			},
			//指标汇总左侧固定
			tableFixed(row_field_name){
				if(row_field_name == 'dpid' || row_field_name == 'dpmc'){
					return true;
				}
			},
			
		},
		components:{
			dps
		}
	}
</script>








