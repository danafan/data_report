<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="handleClick">
			<el-tab-pane label="成本表" lazy name="/total_cost" class="tab_pane_box">
				<ToastCost v-if="activeTab == '/total_cost'"/>
			</el-tab-pane>
			<el-tab-pane label="修改记录表" lazy name="/edit_record" class="tab_pane_box" v-if="user_type == '2' || user_type == '3'">
				<EditRecord v-if="activeTab == '/edit_record'"/>
			</el-tab-pane>
			<el-tab-pane label="审核表" lazy name="/review_table" class="tab_pane_box" v-if="user_type == '2' || user_type == '3' || user_type == '4'">
				<ReviewTable v-if="activeTab == '/review_table'"/>
			</el-tab-pane>
			<el-tab-pane label="超时表" lazy name="/timeout" class="tab_pane_box" v-if="user_type == '2' || user_type == '3'">
				<Timeout v-if="activeTab == '/timeout'"/>
			</el-tab-pane>
			<el-tab-pane label="首次议价表" lazy name="/bargaining_table" class="tab_pane_box" v-if="user_type == '1'">
				<BargainingTable v-if="activeTab == '/bargaining_table'"/>
			</el-tab-pane>
			<el-tab-pane label="调价表" lazy name="/pricing_table" class="tab_pane_box" v-if="user_type != '4'">
				<PricingTable v-if="activeTab == '/pricing_table'"/>
			</el-tab-pane>
			<el-tab-pane label="运营审核表" lazy name="/operational_table" class="tab_pane_box" v-if="user_type == '1'">
				<OperationalTable v-if="activeTab == '/operational_table'"/>
			</el-tab-pane>
			<el-tab-pane label="数据分析表" lazy name="/aduit_data_analysis" class="tab_pane_box" v-if="user_type == '2' || user_type == '3'">
				<AduitDataAnalysis v-if="activeTab == '/aduit_data_analysis'"/>
			</el-tab-pane>

			<!-- <el-tab-pane label="总成本表" lazy name="/total_cost" class="tab_pane_box">
				<ToastCost v-if="activeTab == '/total_cost'"/>
			</el-tab-pane>
			<el-tab-pane label="修改记录表" lazy name="/edit_record" class="tab_pane_box">
				<EditRecord v-if="activeTab == '/edit_record'"/>
			</el-tab-pane>
			<el-tab-pane label="审核表" lazy name="/review_table" class="tab_pane_box">
				<ReviewTable v-if="activeTab == '/review_table'"/>
			</el-tab-pane>
			<el-tab-pane label="首次议价表" lazy name="/bargaining_table" class="tab_pane_box">
				<BargainingTable v-if="activeTab == '/bargaining_table'"/>
			</el-tab-pane>
			<el-tab-pane label="调价表" lazy name="/pricing_table" class="tab_pane_box">
				<PricingTable v-if="activeTab == '/pricing_table'"/>
			</el-tab-pane>
			<el-tab-pane label="运营审核表" lazy name="/operational_table" class="tab_pane_box">
				<OperationalTable v-if="activeTab == '/operational_table'"/>
			</el-tab-pane>
			<el-tab-pane label="超时表" lazy name="/timeout" class="tab_pane_box">
				<Timeout v-if="activeTab == '/timeout'"/>
			</el-tab-pane> -->
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
	import Timeout from './AuditPages/timeout.vue'
	import AduitDataAnalysis from './AuditPages/aduit_data_analysis.vue'
	export default{
		data(){
			return{
				activeTab:"",
				user_type:''
			}
		},
		created(){
			var current_tab = this.$store.state.current_tab;
			this.user_type = localStorage.getItem('user_type');
			if(this.user_type == '1'){
				this.activeTab = current_tab == ''?'/bargaining_table':current_tab;
			}else if(this.user_type == '2' || this.user_type == '3' || this.user_type == '4'){
				this.activeTab = current_tab == ''?'/total_cost':current_tab;
			}
		},
		methods:{
			handleClick(e){
				this.activeTab = e.name;
				this.$store.commit('currentTab',e.name);
			}
		},
		components:{
			ToastCost,
			EditRecord,
			ReviewTable,
			PricingTable,
			BargainingTable,
			OperationalTable,
			Timeout,
			AduitDataAnalysis
		}
	}
</script>