<template>
	<div>
		<el-card>
			<el-tabs v-model="activeTab">
				<el-tab-pane label="业绩分析" name="performance_analysis" style="padding-top: 10px">
					<PerformanceAnalysis/>
				</el-tab-pane>
				<el-tab-pane label="每日业绩" name="daily_performance" style="padding-top: 10px">
					<DailyPerformance/>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>
<style lang="less" scoped>

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