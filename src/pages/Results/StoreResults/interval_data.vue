<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="统计日期：">
				<el-date-picker
				v-model="date"
				type="daterange"
				clearable
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
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
		</el-form-item>
	</el-form>
	<el-tabs v-model="activeTab" type="border-card" @tab-click="checkTab">
		<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
			<StoreView :dept_id="dept_id" :shop_id="shop_id" :tjrq="tjrq" :platform="platform" v-if="item.web_url == 'store_view'"/>
			<TrafficView :dept_id="dept_id" :shop_id="shop_id" :tjrq="tjrq" :platform="platform" v-if="item.web_url == 'traffic_view'"/>
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
	import resource from '../../../api/resource.js'
	import StoreView from './interval_data/store_view.vue'
	import TrafficView from './interval_data/traffic_view.vue'
	import dps from '../../../components/results_components/dps.vue'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[],								//所有菜单列表
				select_plat_ids:[],							//选中的平台列表
				select_store_ids:[],						//选中的店铺列表
				shop_id:"",
				dept_list: [],								//部门列表
				dept_id:"",	
				select_department_ids:[],					//选中的部门id列表
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
				date:[getCurrentDate(),getCurrentDate()],
				tjrq:[getCurrentDate(),getCurrentDate()],
				platform:"",
				ss:[]
			}
		},
		created(){	
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list);
			this.getIndex();
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
					if (item.web_url == 'interval_data') {
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
			//点击搜索
			getList(){
				this.dept_id = this.select_department_ids.join(',');
				this.shop_id = this.select_store_ids.join(',');
				this.platform = this.select_plat_ids.join(',');
				this.tjrq = this.date;
			},
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				this.getList();
			}
		},
		components:{
			StoreView,
			TrafficView,
			dps
		}
	}
</script>