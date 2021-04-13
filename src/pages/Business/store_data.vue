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
		<el-tabs v-model="activeTab">
			<!-- <el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<StoreView v-if="item.web_url == 'store_view'"/>
				<TrafficView v-if="item.web_url == 'traffic_view'"/>
				<CompleteStatus v-if="item.web_url == 'complete_status'"/>
			</el-tab-pane> -->
			<el-tab-pane label="店铺看板" lazy name="store_view" class="tab_pane_box">
				<StoreView :shop_id="shop_id" :tjrq="tjrq"/>
			</el-tab-pane>
			<el-tab-pane label="流量看板" lazy name="traffic_view" class="tab_pane_box">
				<TrafficView :shop_id="shop_id" :tjrq="tjrq"/>
			</el-tab-pane>
			<el-tab-pane label="目标达成情况" lazy name="complete_status" class="tab_pane_box">
				<CompleteStatus :shop_id="shop_id" :tjrq="tjrq"/>
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
	import resource from '../../api/resource.js'
	import StoreView from './store_data/store_view.vue'
	import TrafficView from './store_data/traffic_view.vue'
	import CompleteStatus from './store_data/complete_status.vue'
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[],								//所有菜单列表
				shop_list:[],								//店铺列表
				select_shop_list:[],						//选中的店铺列表
				dept_list: [],								//部门列表	
				select_department_ids:[],					//选中的部门id列表
				shop_id:"",
				tjrq:"",									//日期
				date_time:"",								//传递的日期
			}
		},
		created(){
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list,'store_data');
			//店铺列表
			this.AjaxViewDept();
		},
		methods:{
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
			forMenuList(arr, web_url) {
				for (let obj of arr) {
					if (obj.web_url == web_url) {
						this.menu_list = obj.list;
						this.activeTab = this.menu_list[0].web_url;
						return;
					}else{
						if('list' in obj){
							this.forMenuList(obj.list,'store_data')
						}
					}
				}
			},
			//点击搜索
			getList(){
				this.shop_id = this.select_shop_list.join(',');
				this.tjrq = this.date_time;
			}
		},
		components:{
			StoreView,
			TrafficView,
			CompleteStatus
		}
	}
</script>