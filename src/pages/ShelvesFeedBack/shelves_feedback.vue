<template>
	<div>
		<el-tabs v-model="activeTab">
			<el-tab-pane label="下架款筛选" lazy name="/screening" class="tab_pane_box">
				<Screening v-if="activeTab == '/screening'"/>
			</el-tab-pane>
			<el-tab-pane label="下架款登记" lazy name="/registration" class="tab_pane_box">
				<Registration v-if="activeTab == '/registration'"/>
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
	import Screening from './screening.vue'
	import Registration from './registration.vue'
	export default{
		data(){
			return{
				activeTab:"/screening"
			}
		},
		components:{
			Screening,
			Registration
		}
	}
</script>