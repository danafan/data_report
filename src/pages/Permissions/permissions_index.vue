<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<PermssionSetting v-if="item.web_url == 'permssion_setting'"/>
				<AccessPermssion v-if="item.web_url == 'access_permssion'"/>
				<DataPermssion v-if="item.web_url == 'data_permssion'"/>
				<Management v-if="item.web_url == 'management'"/>
				<AuditSetting v-if="item.web_url == 'audit_setting'"/>
				<SPermssionSetting v-if="item.web_url == 's_permssion_setting'"/>
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
	import PermssionSetting from './PermissionTabs/permssion_setting.vue'
	import AccessPermssion from './PermissionTabs/access_permssion.vue'
	import DataPermssion from './PermissionTabs/data_permssion.vue'
	import Management from './PermissionTabs/management.vue'
	import AuditSetting from './PermissionTabs/audit_setting.vue'
	import SPermssionSetting from './PermissionTabs/s_permssion_setting.vue'
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
					if (item.web_url == 'permssions_index') {
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
			PermssionSetting,
			AccessPermssion,
			DataPermssion,
			Management,
			AuditSetting,
			SPermssionSetting
		}
	}
</script>