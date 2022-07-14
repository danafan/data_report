<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<Bpcgxd dept="er_dept" v-if="item.web_url == 'bpcgxd'"/>
				<Thkspmx dept="er_dept" v-if="item.web_url == 'thkspmx'"/>
				<ZxbpThdzb dept="er_dept" v-if="item.web_url == 'zxbp_thdzb'"/>
				<Zxbphgl dept="er_dept" v-if="item.web_url == 'zxbphgl'"/>
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
	import Bpcgxd from './common_tabs/bpcgxd.vue'
	import Thkspmx from './common_tabs/thkspmx.vue'
	import ZxbpThdzb from './common_tabs/zxbp_thdzb.vue'
	import Zxbphgl from './common_tabs/zxbphgl.vue'
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
					if (item.web_url == 'er_dept') {
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
			Bpcgxd,
			Thkspmx,
			ZxbpThdzb,
			Zxbphgl
		}
	}
</script>