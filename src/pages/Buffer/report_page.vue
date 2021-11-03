<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane label="店铺销售情况" lazy name="store_sales" class="tab_pane_box">
				<StoreSales/>
			</el-tab-pane>
			<el-tab-pane label="库存和清理情况" lazy name="inventory_clear" class="tab_pane_box">
				<InventoryClear/>
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
	import StoreSales from './report_pages/store_sales.vue'
	import InventoryClear from './report_pages/inventory_clear.vue'
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[]
			}
		},
		created(){
			this.getIndex();
		},
		methods:{
			getIndex(){
				let current_tab = this.$store.state.current_tab;
				this.activeTab = current_tab == ''?'store_sales':current_tab;
			},
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				this.$store.commit('currentTab',e.name);
			}
		},
		components:{
			StoreSales,
			InventoryClear
		}
	}
</script>