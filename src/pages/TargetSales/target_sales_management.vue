<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane label="新建目标" lazy name="create_target">
				<CreateTarget/>
			</el-tab-pane>
			<el-tab-pane label="销售额预估表" lazy name="sales_forecast">
				<SalesForecast/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import CreateTarget from './components/create_target.vue'
	import SalesForecast from './components/sales_forecast.vue'
	export default{
		data(){
			return{
				activeTab:"create_target",
				// menu_list:[],
				// ss:[]
			}
		},
		// created(){
		// 	let menu_list = this.$store.state.menu_list;
		// 	this.forMenuList(menu_list);
		// 	this.getIndex();
		// },
		methods:{
			// forMenuList(arr) {
			// 	arr.map(item => {
			// 		if('list' in item){
			// 			this.ss.push(item);
			// 			this.forMenuList(item.list)
			// 		}
			// 	})
			// },
			// getIndex(){
			// 	this.ss.map(item => {
			// 		if (item.web_url == 'operations_data_analysis') {
			// 			this.menu_list = item.list;
			// 			let current_tab = this.$store.state.current_tab;
			// 			this.activeTab = current_tab == ''?this.menu_list[0].web_url:current_tab;
			// 		}
			// 	})
			// },
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				// this.$store.commit('currentTab',e.name);
			}
		},
		components:{
			CreateTarget,
			SalesForecast
		}
	}
</script>