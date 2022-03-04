<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane label="款式销量（发货）" lazy name="sales_delivery" class="tab_pane_box">
				<SalesDelivery/>
			</el-tab-pane>
			<el-tab-pane label="款式销量（付款）" lazy name="sales_payment" class="tab_pane_box">
				<SalesPayment/>
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
	import SalesDelivery from './deliveryData/sales_delivery.vue'
	import SalesPayment from './deliveryData/sales_payment.vue'
	export default{
		data(){
			return{
				activeTab:"sales_delivery",
			}
		},
		
		methods:{
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
			}
		},
		components:{
			SalesDelivery,
			SalesPayment
		}
	}
</script>