<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane label="商品毛利分析" lazy name="gross_profit" class="tab_pane_box">
				<GrossProfit/>
			</el-tab-pane>
			<el-tab-pane label="商品价格变动" lazy name="price_change" class="tab_pane_box">
				<PriceChange/>
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
	import GrossProfit from './GoodsAnalysis/gross_profit.vue'
	import PriceChange from './GoodsAnalysis/price_change.vue'
	export default{
		data(){
			return{
				activeTab:"gross_profit",
			}
		},
		
		methods:{
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
			}
		},
		components:{
			GrossProfit,
			PriceChange
		}
	}
</script>