<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<StoreAccountYue v-if="item.web_url == 'store_account_yue'"/>
				<AlipayYue v-if="item.web_url == 'alipay_yue'"/>
				<PddAccount v-if="item.web_url == 'pdd_account'"/>
				<DyAccount v-if="item.web_url == 'dy_account'"/>
				<JdAccount v-if="item.web_url == 'jd_account'"/>
				<KsAccount v-if="item.web_url == 'ks_account'"/>
				<XhsAccount v-if="item.web_url == 'xhs_account'"/>
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
	import StoreAccountYue from './AccountStoreYue/store_account_yue.vue'
	import AlipayYue from './AccountStoreYue/alipay_yue.vue'
	import PddAccount from './AccountStoreYue/pdd_account.vue'
	import DyAccount from './AccountStoreYue/dy_account.vue'
	import JdAccount from './AccountStoreYue/jd_account.vue'
	import KsAccount from './AccountStoreYue/ks_account.vue'
	import XhsAccount from './AccountStoreYue/xhs_account.vue'
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
					if (item.web_url == 'account_store') {
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
			StoreAccountYue,
			AlipayYue,
			PddAccount,
			DyAccount,
			JdAccount,
			KsAccount,
			XhsAccount
		}
	}
</script>