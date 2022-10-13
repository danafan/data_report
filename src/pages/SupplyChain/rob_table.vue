<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<RobGoods v-if="item.web_url == 'rob_goods'"/>
				<SupplierLackRanking v-if="item.web_url == 'supplier_lack_ranking'"/>
				<StoreReady v-if="item.web_url == 'store_ready'"/>
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
	import RobGoods from './RobTable/rob_goods.vue'
	import SupplierLackRanking from './RobTable/supplier_lack_ranking.vue'
	import StoreReady from './RobTable/store_ready.vue'
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
					if (item.web_url == 'rob_table') {
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
			RobGoods,
			SupplierLackRanking,
			StoreReady
		}
	}
</script>