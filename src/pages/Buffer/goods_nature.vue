<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<KsInfo v-if="item.web_url == 'ks_info'"/>
				<GoodsInfo v-if="item.web_url == 'goods_info'"/>
				<DecisionMaking v-if="item.web_url == 'decision_making'"/>
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
	import KsInfo from './goods_natures/ks_info.vue'
	import GoodsInfo from './goods_natures/goods_info.vue'
	import DecisionMaking from './goods_natures/decision_making.vue'
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
					if (item.web_url == 'goods_nature') {
						this.menu_list = item.list;
						this.activeTab = this.menu_list[0].web_url;
					}
				})
			},
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
			}
		},
		components:{
			KsInfo,
			GoodsInfo,
			DecisionMaking
		}
	}
</script>