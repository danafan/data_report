<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane label="总成本表" lazy name="/total_cost" class="tab_pane_box">
				<ToastCost/>
			</el-tab-pane>
			<el-tab-pane label="修改记录表" lazy name="/edit_record" class="tab_pane_box">
				<EditRecord/>
			</el-tab-pane>
			<el-tab-pane label="审核表" lazy name="/review_table" class="tab_pane_box">
				<ReviewTable/>
			</el-tab-pane>
			<el-tab-pane label="调价表" lazy name="/pricing_table" class="tab_pane_box">
				<PricingTable/>
			</el-tab-pane>
			<el-tab-pane label="首次议价表" lazy name="/bargaining_table" class="tab_pane_box">
				<BargainingTable/>
			</el-tab-pane>
			<el-tab-pane label="运营审核表" lazy name="/operational_table" class="tab_pane_box">
				<OperationalTable/>
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
	import ToastCost from './AuditPages/total_cost.vue'
	import EditRecord from './AuditPages/edit_record.vue'
	import ReviewTable from './AuditPages/review_table.vue'
	import PricingTable from './AuditPages/pricing_table.vue'
	import BargainingTable from './AuditPages/bargaining_table.vue'
	import OperationalTable from './AuditPages/operational_table.vue'
	export default{
		data(){
			return{
				activeTab:"/total_cost",
			}
		},
		components:{
			ToastCost,
			EditRecord,
			ReviewTable,
			PricingTable,
			BargainingTable,
			OperationalTable
		}
	}
</script>