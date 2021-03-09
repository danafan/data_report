<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<PerformanceAnalysis v-if="item.web_url == 'performance_analysis'"/>
				<DailyPerformance v-if="item.web_url == 'daily_performance'"/>
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
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[]
			}
		},
		created(){
			console.log("asd1")
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list,'store_results');
		},
		methods:{
			forMenuList(arr, web_url) {
				for (let obj of arr) {
					if (obj.web_url == web_url) {
						this.menu_list = obj.list;
						this.activeTab = this.menu_list[0].web_url;
						return;
					}else{
						if('list' in obj){
							this.forMenuList(obj.list,'store_results')
						}
					}
				}
			}
		},
		components:{
			PerformanceAnalysis,
			DailyPerformance
		}
	}
</script>