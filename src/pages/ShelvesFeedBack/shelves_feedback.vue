<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<ShelvesRecord v-if="item.web_url == 'shelves_record'"/>
				<ShelvesStatistics v-if="item.web_url == 'shelves_statistics'"/>
				<FailedTable v-if="item.web_url == 'failed_table'"/>
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
	import ShelvesRecord from './pages/shelves_record.vue'
	import ShelvesStatistics from './pages/shelves_statistics.vue'
	import FailedTable from './pages/failed_table.vue'
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
					if (item.web_url == 'shelves_feedback') {
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
			ShelvesStatistics,
			ShelvesRecord,
			FailedTable
		}
	}
</script>