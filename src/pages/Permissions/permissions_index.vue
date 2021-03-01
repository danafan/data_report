<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane label="权限配置" lazy name="permssion_setting" class="tab_pane_box">
					<PermssionSetting/>
			</el-tab-pane>
			<el-tab-pane label="访问权限" lazy name="access_permssion" class="tab_pane_box">
				<AccessPermssion/>
			</el-tab-pane>
			<el-tab-pane label="数据权限" lazy name="data_permssion" class="tab_pane_box">
				<DataPermssion/>
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
	export default{
		data(){
			return{
				activeTab:'permssion_setting'
			}
		},
		components:{
			PermssionSetting,
			AccessPermssion,
			DataPermssion
		}
	}
</script>