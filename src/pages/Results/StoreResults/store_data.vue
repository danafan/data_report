<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="统计日期：">
				<el-date-picker
				v-model="date_time"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				:append-to-body="false"
				>
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
			<CompleteStatus :dept_id="dept_id" :shop_id="shop_id" :tjrq="tjrq" :platform="platform" v-if="item.web_url == 'complete_status'"/>
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
	import StoreView from './store_data/store_view.vue'
	import TrafficView from './store_data/traffic_view.vue'
	import CompleteStatus from './store_data/complete_status.vue'
	import {getCurrentDate} from '../../../api/nowMonth.js'
	import dps from '../../../components/results_components/dps.vue'
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
				date_time:getCurrentDate(),					//传递的日期
				tjrq:"",
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
					if (item.web_url == 'store_data') {
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
				this.tjrq = !this.date_time?'':this.date_time;
				this.platform = this.select_plat_ids.join(',');
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
			CompleteStatus,
			dps
		}
	}
</script>