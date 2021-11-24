<template>
	<div>
		<el-tabs v-model="activeTab" @tab-click="handleClick">
			<el-tab-pane label="数据管理" lazy name="/form_data" class="tab_pane_box">
				<FormData/>
			</el-tab-pane>
			<el-tab-pane label="我的提交" lazy name="/my_commit" class="tab_pane_box">
				<MyCommit/>
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
	import FormData from './form_data/form_data.vue'
	import MyCommit from './my_commit/my_commit.vue'
	export default{
		data(){
			return{
				activeTab:""
			}
		},
		created(){
			var current_tab = this.$store.state.current_tab;
			this.activeTab = current_tab == ''?'/form_data':current_tab;
		},
		methods:{
			handleClick(e){
				this.activeTab = e.name;
				this.$store.commit('currentTab',e.name);
			}
		},
		components:{
			FormData,
			MyCommit
		}
	}
</script>