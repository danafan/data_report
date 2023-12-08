<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<CostControl v-if="item.web_url == 'cost_control'"/>
				<RefundStatus v-if="item.web_url == 'refund_status'"/>
				<DeliverySituation v-if="item.web_url == 'delivery_situation'"/>
				<FocusFollowStyle v-if="item.web_url == 'focus_follow_style'"/>
				<StoreNewStyle v-if="item.web_url == 'store_new_style'"/>
				<SupplierRankingPage v-if="item.web_url == 'supplier_ranking_page'"/>
				<InventoryAnalysis v-if="item.web_url == 'inventory_analysis'"/>
				<CostAnalysis v-if="item.web_url == 'cost_analysis'"/>
				<SalesSubjectAnalysis v-if="item.web_url == 'sales_subject_analysis'"/>
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
	import CostControl from '../Results/StoreResults/cost_control.vue'
	import RefundStatus from '../Operations/refund_status.vue'
	import DeliverySituation from '../SupplyChain/delivery_situation.vue'
	import FocusFollowStyle from '../SupplyChain/focus_follow_style.vue'
	import StoreNewStyle from '../SupplyChain/store_new_style.vue'
	import SupplierRankingPage from '../SupplyChain/SupplierRanking/supplier_ranking_page.vue'
	import InventoryAnalysis from '../SupplyChain/SupplierRanking/inventory_analysis.vue'
	import CostAnalysis from '../Results/FineOperation/cost_analysis.vue'
	import SalesSubjectAnalysis from '../Operations/sales_subject_analysis.vue'
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
					if (item.web_url == 'focus_core') {
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
			CostControl,
			RefundStatus,
			DeliverySituation,
			FocusFollowStyle,
			StoreNewStyle,
			SupplierRankingPage,
			InventoryAnalysis,
			CostAnalysis,
			SalesSubjectAnalysis
		}
	}
</script>