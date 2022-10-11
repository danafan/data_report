<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品ID：">
				<el-select v-model="select_spid_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="getSpid" collapse-tags>
					<el-option v-for="item in spid_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="付款日期：">
				<el-date-picker v-model="date":clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 部门GMV详情 -->
		<div class="table_title">部门GMV详情</div>
		<el-table :data="dept_gmv_data" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' v-loading="dept_loading">
			<el-table-column :label="item.row_name" v-for="item in dept_title_list">
				<template slot-scope="scope">
					<div :class="{'bold_style':scope.$index == 0}">{{scope.row[item.row_field_name]}}</div>
				</template>
				<el-table-column :label="i.row_name" :prop="i.row_field_name" v-for="i in item.list">
					<template slot-scope="scope">
						<div :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="i.type == 1 && scope.$index > 0">{{scope.row[i.row_field_name]}}{{i.unit}}</div>
						<div class="text_content" :class="{'bold_style':scope.$index == 0}" v-else>{{i.num_type == 1?getQianNumber(scope.row[i.row_field_name]):scope.row[i.row_field_name]}}{{i.unit}}</div>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	import dps from '../../components/results_components/dps.vue'
	import resource from '../../api/resource.js'
	import operationResource from '../../api/operationResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	export default{
		data(){
			return{
				dept_name:[],								//项目部
				pl:[],										//平台
				shop_code:[],								//店铺
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				spid_list:[],								//商品id列表
				select_spid_list:[],						//选中的商品ID列表
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
				date:[getMonthStartDate(),getCurrentDate()],//付款日期				
				dept_title_list:[],							//部门表头信息
				dept_gmv_data:[],							//部门gmv数据
				dept_loading:false,
			}
		},
		created(){
			//品类列表
			this.getPl();
			//搜索
			this.searchFn();
		},
		methods:{
			//搜索
			searchFn(){
				let arg = {
					dept_name:this.dept_name.join(','),
					pl:this.pl.join(','),
					shop_code:this.shop_code.join(','),
					cpfl:this.select_pl_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					gyshh:this.select_gys_ids.join(','),
					spid:this.select_spid_list.join(','),
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:""
				}
				//获取部门GMV详情
				this.deptGmvList(arg);
			},
			//获取部门GMV详情
			deptGmvList(arg){
				this.dept_loading = true;
				operationResource.deptGmvList(arg).then(res => {
					if(res.data.code == 1){
						this.dept_loading = false;
						this.dept_gmv_data = res.data.data.data;
						this.dept_title_list = res.data.data.title_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					resource.ajaxPl().then(res => {
						if(res.data.code == 1){
							this.pl_list = res.data.data;
							this.$store.commit('setPlList',this.pl_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.pl_list = this.$store.state.pl_list;
				}
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
			//商品ID列表
			getSpid(e){
				if(e != ''){
					resource.ajaxSpid({name:e}).then(res => {
						if(res.data.code == 1){
							this.spid_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.table_title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-weight: bold;
	color: #333333;
}
.bold_style{
	font-size: 14px;
	color: #333333;
	font-weight: bold;
}
</style>