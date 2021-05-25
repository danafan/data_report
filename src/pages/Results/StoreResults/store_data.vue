<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部:" style="margin-right: 20px">
				<el-select v-model="select_department_ids" :popper-append-to-body="false" @change="GetStoreList" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="select_shop_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
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
			<StoreView :dept_id="dept_id" :shop_id="shop_id" :tjrq="tjrq" v-if="item.web_url == 'store_view'"/>
			<TrafficView :dept_id="dept_id" :shop_id="shop_id" :tjrq="tjrq" v-if="item.web_url == 'traffic_view'"/>
			<CompleteStatus :dept_id="dept_id" :shop_id="shop_id" :tjrq="tjrq" v-if="item.web_url == 'complete_status'"/>
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
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[],								//所有菜单列表
				shop_list:[],								//店铺列表
				select_shop_list:[],						//选中的店铺列表
				shop_id:"",
				dept_list: [],								//部门列表
				dept_id:"",	
				select_department_ids:[],					//选中的部门id列表
				date_time:getCurrentDate(),								//传递的日期
				tjrq:"",
				ss:[]
			}
		},
		created(){	
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list);
			this.getIndex();
			//部门/店铺列表
			this.AjaxViewDept();
			//店铺列表
			this.GetStoreList();
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
			//部门列表
			AjaxViewDept(){
				resource.ajaxViewDept().then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺列表
			GetStoreList(){
				let dept_id = this.select_department_ids.join(',');
				this.select_store_ids = [];
				resource.ajaxViewStore({dept_id:dept_id}).then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			getList(){
				this.dept_id = this.select_department_ids.join(',');
				this.shop_id = this.select_shop_list.join(',');
				this.tjrq = !this.date_time?'':this.date_time;
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
			CompleteStatus
		}
	}
</script>