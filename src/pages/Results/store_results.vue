<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane label="业绩分析（运营）" lazy name="performance_analysis" class="tab_pane_box">
					<PerformanceAnalysis/>
			</el-tab-pane>
			<el-tab-pane label="每日业绩" lazy name="daily_performance" class="tab_pane_box">
				<DailyPerformance/>
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
				activeTab:'performance_analysis'
			}
		},
		components:{
			PerformanceAnalysis,
			DailyPerformance
		}
	}
</script>