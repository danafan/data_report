<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<ToastCost v-if="item.web_url == 'total_cost'"/>
				<FeekBack v-if="item.web_url == 'feek_back'"/>
				<EditRecord v-if="item.web_url == 'edit_record'"/>
				<ReviewTable v-if="item.web_url == 'review_table'"/>
				<Timeout v-if="item.web_url == 'timeout'"/>
				<BargainingTable v-if="item.web_url == 'bargaining_table'"/>
				<PricingTable v-if="item.web_url == 'pricing_table'"/>
				<AduitDataAnalysis v-if="item.web_url == 'aduit_data_analysis'"/>
				<SupplierList v-if="item.web_url == 'supplier_list'"/>
				<EditSupplier v-if="item.web_url == 'edit_supplier'"/>
				<WaitAdjust v-if="item.web_url == 'wait_adjust'"/>
				<ReduceCost v-if="item.web_url == 'reduce_cost'"/>
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
	import FeekBack from './AuditPages/feek_back.vue'
	import EditRecord from './AuditPages/edit_record.vue'
	import ReviewTable from './AuditPages/review_table.vue'
	import PricingTable from './AuditPages/pricing_table.vue'
	import BargainingTable from './AuditPages/bargaining_table.vue'
	import Timeout from './AuditPages/timeout.vue'
	import AduitDataAnalysis from './AuditPages/aduit_data_analysis.vue'
	import SupplierList from './AuditPages/supplier_list.vue'
	import EditSupplier from './AuditPages/edit_supplier.vue'
	import WaitAdjust from './AuditPages/wait_adjust.vue'
	import ReduceCost from './AuditPages/reduce_cost.vue'
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
					if (item.web_url == 'audit_index') {
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
			ToastCost,
			FeekBack,
			EditRecord,
			ReviewTable,
			PricingTable,
			BargainingTable,
			Timeout,
			AduitDataAnalysis,
			SupplierList,
			EditSupplier,
			WaitAdjust,
			ReduceCost
		}
	}
</script>