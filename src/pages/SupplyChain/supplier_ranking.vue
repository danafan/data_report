<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<SupplierRankingPage v-if="item.web_url == 'supplier_ranking_page'"/>
				<SupplierDataIndex v-if="item.web_url == 'supplier_data_index'"/>
				<SupplierBoardIndex v-if="item.web_url == 'supplier_board_index'"/>
				<StyleRankingPage v-if="item.web_url == 'style_ranking_page'"/>
				<InventoryAnalysis v-if="item.web_url == 'inventory_analysis'"/>
				<UseRecord v-if="item.web_url == 'use_record'"/>
				<ArrivalStatistics v-if="item.web_url == 'arrival_statistics'"/>
				<InventoryInfo v-if="item.web_url == 'inventory_info'"/>
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
	import SupplierRankingPage from './SupplierRanking/supplier_ranking_page.vue'
	import SupplierDataIndex from './SupplierRanking/supplier_data_index.vue'
	import SupplierBoardIndex from './SupplierRanking/supplier_board_index.vue'
	import StyleRankingPage from './SupplierRanking/style_ranking_page.vue'
	import InventoryAnalysis from './SupplierRanking/inventory_analysis.vue'
	import UseRecord from './SupplierRanking/use_record.vue'
	import ArrivalStatistics from './SupplierRanking/arrival_statistics.vue'
	import InventoryInfo from './SupplierRanking/inventory_info.vue'
	export default{
		data(){
			return{
				activeTab:"supplier_ranking_page",
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
					if (item.web_url == 'supplier_ranking') {
						this.menu_list = item.list;
						console.log(this.menu_list)
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
			SupplierRankingPage,
			SupplierDataIndex,
			SupplierBoardIndex,
			StyleRankingPage,
			InventoryAnalysis,
			UseRecord,
			ArrivalStatistics,
			InventoryInfo
		}
	}
</script>