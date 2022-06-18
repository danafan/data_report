<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<!-- <el-tab-pane label="发货情况统计" lazy name="delivery_statistical" class="tab_pane_box">
				<DeliveryStatistical/>
			</el-tab-pane>
			<el-tab-pane label="发货情况明细(订单)" lazy name="delivery_record" class="tab_pane_box">
				<DeliveryRecord/>
			</el-tab-pane>
			<el-tab-pane label="未发货明细-包含预发(商品编码)" lazy name="sku_record" class="tab_pane_box">
				<SkuRecord/>
			</el-tab-pane> -->
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<DeliveryStatistical v-if="item.web_url == 'delivery_statistical'"/>
				<DeliveryRecord v-if="item.web_url == 'delivery_record'"/>
				<SkuRecord v-if="item.web_url == 'sku_record'"/>
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
	import DeliveryStatistical from './pages/delivery_statistical.vue'
	import DeliveryRecord from './pages/delivery_record.vue'
	import SkuRecord from './pages/sku_record.vue'
	export default{
		data(){
			return{
				activeTab:"delivery_statistical",
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
					if (item.web_url == 'dw_delivery') {
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
			DeliveryStatistical,
			DeliveryRecord,
			SkuRecord
		}
	}
</script>