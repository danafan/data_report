<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="品类:">
				<el-select v-model="select_cate_names" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cate_name_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="省/直辖市:">
				<el-select v-model="select_province_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in province_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="付款日期:">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-tabs v-model="activeTab" type="border-card" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<SalesData ref="sales_data" v-if="item.web_url == 'sales_data'"/>
				<RefundData ref="refund_data" v-if="item.web_url == 'refund_data'"/>
				<FishpondsData ref="fishponds_data" v-if="item.web_url == 'fishponds_data'"/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style lang="less" scoped>
.tab_pane_box{
	padding-top: 10px;
}
</style>
<script>
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/resource.js'
	import SalesData from './RegionalAnalysis/sales_data.vue'
	import RefundData from './RegionalAnalysis/refund_data.vue'
	import FishpondsData from './RegionalAnalysis/fishponds_data.vue'
	import dps from '../../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				activeTab:"sales_data",
				menu_list:[],								//所有菜单列表
				select_store_ids:[],						//选中的店铺列表
				select_department_ids:[],					//选中的部门id列表
				select_plat_ids:[],							//选中的平台列表
				cate_name_list:[],							//品类列表
				select_cate_names:[],						//选中的品类列表
				dept_id:"",									//传给子组件的部门字符串
				shop_id:"",									//传给子组件的店铺字符串
				cpfl:"",									//传给子组件的品类字符串
				ss:[],
				province_list:[],							//所有省份列表
				select_province_list:[],					//选中的省份列表
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
				},	 										 //时间区间
				date:[getMonthStartDate(),getCurrentDate()], //上架日期
			}
		},
		created(){	
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list);
			this.getIndex();
			//品类列表
			this.ajaxCpfl();
			//所有省份列表
			this.ajaxProvince();
			this.getList();
		},
		methods:{
			forMenuList(arr) {
				arr.map(item => {
					if('list' in item){
						this.ss.push(item);
						this.forMenuList(item.list)
					}
				})
			},
			getIndex(){
				this.ss.map(item => {
					if (item.web_url == 'regional_analysis') {
						this.menu_list = item.list;
						this.activeTab = this.menu_list[0].web_url;
					}
				})
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//品类列表
			ajaxCpfl(){
				resource.ajaxPl({from:8}).then(res => {
					if(res.data.code == 1){
						this.cate_name_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//所有省份列表
			ajaxProvince(){
				resource.ajaxProvince().then(res => {
					if(res.data.code == 1){
						this.province_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			getList(){
				this.dept_id = this.select_department_ids.join(',');
				this.shop_id = this.select_store_ids.join(',');
				this.cpfl = this.select_cate_names.join(',');
				let req = {
					platform:this.select_plat_ids.join(','),
					dept_id:this.dept_id,
					shop_id:this.shop_id,
					cpfl:this.cpfl,
					province:this.select_province_list.join(','),
					start_time:this.date?this.date[0]:'',
					end_time:this.date?this.date[1]:'',
					select_province:""
				} 
				this.$nextTick(() => {
					this.$refs[this.activeTab][0].setReq(req);
				})
			},
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				this.getList(this.activeTab);
			}
		},
		components:{
			SalesData,
			RefundData,
			FishpondsData,
			dps
		}
	}
</script>