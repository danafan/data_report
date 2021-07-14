<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="省份:" style="margin-right: 20px" v-if="activeTab != 'hot_data'">
				<el-select v-model="select_province_list" clearable :popper-append-to-body="false" @change="ajaxCity" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in province_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="城市：" v-if="activeTab != 'hot_data'">
				<el-select v-model="select_city_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in city_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList" v-if="activeTab != 'hot_data'">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-tabs v-model="activeTab" type="border-card" @tab-click="checkTab">
			<el-tab-pane label="未来天气" lazy name="future_data" class="tab_pane_box">
				<FutureData ref="future_data"/>
			</el-tab-pane>
			<el-tab-pane label="历史天气" lazy name="history_data" class="tab_pane_box">
				<HistoryData ref="history_data"/>
			</el-tab-pane>
			<el-tab-pane label="热门天气" lazy name="hot_data" class="tab_pane_box">
				<HotData ref="hot_data"/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../api/resource.js'
	import FutureData from './WeatherAnalysis/future_data.vue'
	import HistoryData from './WeatherAnalysis/history_data.vue'
	import HotData from './WeatherAnalysis/hot_data.vue'
	export default{
		data(){
			return {
				province_list:[],			//所有省份
				select_province_list:[],	//选中的所有省份
				city_list:[],				//所有城市列表
				select_city_list:[],		//选中的城市列表
				activeTab:'future_data',	//默认选中的tab

			}	
		},
		created(){
			//获取所有省份
			this.ajaxProvince();
			//所有城市列表
			this.ajaxCity();
			//获取数据
			this.getList();
		},
		methods:{
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				this.getList();
			},
			//点击搜索
			getList(){
				let req = {
					from:this.activeTab == 'future_data'?'1':this.activeTab == 'history_data'?'2':'3',
					province:this.select_province_list.join(','),
					city:this.select_city_list.join(','),
					pagesize:10,
					page:1,
					sort:"",
					sort_type:"",
				} 
				this.$nextTick(() => {
					this.$refs[this.activeTab].setReq(req);
				})
			},
			//获取所有省份
			ajaxProvince(){
				resource.ajaxProvince().then(res => {
					if (res.data.code == 1) {
						this.province_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//所有城市列表
			ajaxCity(){
				resource.ajaxCity({province:this.select_province_list.join(',')}).then(res => {
					if (res.data.code == 1) {
						this.city_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		},
		components:{
			FutureData,
			HistoryData,
			HotData
		}
	}
</script>












