<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<AnnualReport v-if="item.web_url == 'annual_report'"/>
				<ItemAnalysis v-if="item.web_url == 'item_analysis'"/>
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
	import AnnualReport from './FineOperation/annual_report.vue'
	import ItemAnalysis from './FineOperation/item_analysis.vue'
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
					if (item.web_url == 'category_analysis') {
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
			AnnualReport,
			ItemAnalysis
		}
	}
</script>