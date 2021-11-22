<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<PerformanceAnalysis v-if="item.web_url == 'performance_analysis'"/>
				<DailyPerformance v-if="item.web_url == 'daily_performance'"/>
				<FishPonds v-if="item.web_url == 'fish_ponds'"/>
				<StoreData v-if="item.web_url == 'store_data'"/>
				<SalesTrend v-if="item.web_url == 'sales_trend'"/>
				<IntervalData v-if="item.web_url == 'interval_data'"/>
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
	import PerformanceAnalysis from './StoreResults/performance_analysis.vue'
	import DailyPerformance from './StoreResults/daily_performance.vue'
	import FishPonds from './StoreResults/fish_ponds.vue'
	import StoreData from './StoreResults/store_data.vue'
	import SalesTrend from './StoreResults/sales_trend.vue'
	import IntervalData from './StoreResults/interval_data.vue'
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[],
				ss:[]
			}
		},
		created(){
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list);
			this.getIndex();
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
					if (item.web_url == 'store_results') {
						this.menu_list = item.list;
						let current_tab = this.$store.state.current_tab;
						this.activeTab = current_tab == ''?this.menu_list[0].web_url:current_tab;
					}
				})
			},
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				this.$store.commit('currentTab',e.name);
			}
		},
		components:{
			PerformanceAnalysis,
			DailyPerformance,
			FishPonds,
			StoreData,
			SalesTrend,
			IntervalData
		}
	}
</script>