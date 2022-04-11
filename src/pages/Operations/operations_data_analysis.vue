<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" v-for="item in menu_list">
				<SalesAnalysis v-if="item.web_url == 'sales_analysis'"/>
				<DataStatistical v-if="item.web_url == 'data_statistical'"/>
				<IncomeAnalysis v-if="item.web_url == 'income_analysis'"/>
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
	import SalesAnalysis from './OperationsDataAnalysis/sales_analysis.vue'
	import DataStatistical from './OperationsDataAnalysis/data_statistical.vue'
	import IncomeAnalysis from './OperationsDataAnalysis/income_analysis.vue'
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
					if (item.web_url == 'operations_data_analysis') {
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
			SalesAnalysis,
			DataStatistical,
			IncomeAnalysis
		}
	}
</script>