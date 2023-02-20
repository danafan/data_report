<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<OrderList :arg="arg" v-if="item.web_url == 'order_list' && activeTab == 'order_list'"/>
				<ReturnGoods v-if="item.web_url == 'return_goods'"/>
				<ReferenceView v-if="item.web_url == 'reference_view'"/>
				<SendView v-if="item.web_url == 'send_view'" @callback="callback"/>
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
	import OrderList from './order_list.vue'
	import ReturnGoods from './return_goods.vue'
	import ReferenceView from './reference_view.vue'
	import SendView from './send_view.vue'
	export default{
		data(){
			return{
				arg:{},
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
			//点击切换订单列表
			callback(v){
				this.arg = v;
				this.activeTab = 'order_list';
			},
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
					if (item.web_url == 'replace_send') {
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
			OrderList,
			ReturnGoods,
			ReferenceView,
			SendView
		}
	}
</script>