<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<AnnualReport v-if="item.web_url == 'annual_report'"/>
				<ItemAnalysis v-if="item.web_url == 'item_analysis'"/>
				<CostAnalysis v-if="item.web_url == 'cost_analysis'"/>
				<KeywordView v-if="item.web_url == 'keyword_view'"/>
				<RegionalAnalysis v-if="item.web_url == 'regional_analysis'"/>
				<WeatherAnalysis v-if="item.web_url == 'weather_analysis'"/>
				<ExperienceScore v-if="item.web_url == 'experience_score'"/>
				<GrossProfitAnalysis v-if="item.web_url == 'gross_profit_analysis'"/>
				<NewItemAnalysis v-if="item.web_url == 'new_item_analysis'"/>
				<HumanEffect v-if="item.web_url == 'human_effect'"/>
				<PromotionPerformance v-if="item.web_url == 'promotion_performance'"/>
				<IndividualPerformance v-if="item.web_url == 'individual_performance'"/>
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
	import NewItemAnalysis from './FineOperation/new_item_analysis.vue'
	import CostAnalysis from './FineOperation/cost_analysis.vue'
	import KeywordView from './FineOperation/keyword_view.vue'
	import RegionalAnalysis from './FineOperation/regional_analysis.vue'
	import WeatherAnalysis from './FineOperation/weather_analysis.vue'
	import ExperienceScore from './FineOperation/experience_score.vue'
	import GrossProfitAnalysis from './FineOperation/gross_profit_analysis.vue'
	import HumanEffect from '../HumanEffect/human_effect.vue'
	import PromotionPerformance from '../PromotionPerformance/promotion_performance.vue'
	import IndividualPerformance from '../IndividualPerformance/individual_performance.vue'
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
			AnnualReport,
			NewItemAnalysis,
			ItemAnalysis,
			CostAnalysis,
			KeywordView,
			RegionalAnalysis,
			WeatherAnalysis,
			ExperienceScore,
			GrossProfitAnalysis,
			HumanEffect,
			PromotionPerformance,
			IndividualPerformance
		}
	}
</script>