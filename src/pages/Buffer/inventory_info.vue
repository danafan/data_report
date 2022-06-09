<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<StaticAnalysis v-if="item.web_url == 'static_analysis'"/>
				<DynamicAnalysis v-if="item.web_url == 'dynamic_analysis'"/>
			</el-tab-pane>
			<el-tab-pane label="商品资料卡片" lazy name="goods_info_card" class="tab_pane_box">
				<GoodsInfoCard/>
			</el-tab-pane>
			<el-tab-pane label="商品库存信息" lazy name="goods_inventory" class="tab_pane_box">
				<GoodsInventory/>
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
	import StaticAnalysis from './inventory_info/static_analysis.vue'
	import DynamicAnalysis from './inventory_info/dynamic_analysis.vue'
	import GoodsInfoCard from './inventory_info/goods_info_card.vue'
	import GoodsInventory from './inventory_info/goods_inventory.vue'
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
					if (item.web_url == 'inventory_info') {
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
			StaticAnalysis,
			DynamicAnalysis,
			GoodsInfoCard,
			GoodsInventory
		}
	}
</script>