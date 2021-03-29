<template>
	<div>
		<el-tabs v-model="activeTab">
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
				activeTab:"inventory_clear",
				menu_list:[]
			}
		},
		components:{
			StoreSales,
			InventoryClear
		}
	}
</script>