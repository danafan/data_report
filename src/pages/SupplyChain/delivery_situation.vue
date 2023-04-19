<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<StoreScope v-if="item.web_url == 'store_scope'"/>
				<WarehouseScope v-if="item.web_url == 'warehouse_scope'"/>
				<KsScope v-if="item.web_url == 'ks_scope'"/>
				<StoreKsScope v-if="item.web_url == 'store_ks_scope'"/>
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
	import StoreScope from './DeliverySituation/store_scope.vue'
	import WarehouseScope from './DeliverySituation/warehouse_scope.vue'
	import KsScope from './DeliverySituation/ks_scope.vue'
	import StoreKsScope from './DeliverySituation/store_ks_scope.vue'
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
					if (item.web_url == 'delivery_situation') {
						this.menu_list = item.list;
						this.activeTab = this.menu_list[0].web_url;
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
			StoreScope,
			WarehouseScope,
			KsScope,
			StoreKsScope
		}
	}
</script>