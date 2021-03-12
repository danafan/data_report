<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<PermssionSetting v-if="item.web_url == 'permssion_setting'"/>
				<AccessPermssion v-if="item.web_url == 'access_permssion'"/>
				<DataPermssion v-if="item.web_url == 'data_permssion'"/>
				<Management v-if="item.web_url == 'management'"/>
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
	export default{
		data(){
			return{
				activeTab:"",
				menu_list:[]
			}
		},
		created(){
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list,'permssions_index');
		},
		methods:{
			forMenuList(arr, web_url) {
				for (let obj of arr) {
					if (obj.web_url == web_url) {
						this.menu_list = obj.list;
						this.activeTab = this.$store.state.permissions_tab != ''?this.$store.state.permissions_tab:this.menu_list[0].web_url;
						return;
					}else{
						if('list' in obj){
							this.forMenuList(obj.list,'permssions_index')
						}
					}
				}
			}
		},
		components:{
			PermssionSetting,
			AccessPermssion,
			DataPermssion,
			Management
		}
	}
</script>