<template>
	<div>
		<div class="buts">
			<el-input placeholder="请输入表单名" v-model="name" size="small" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
			</el-input>
		</div>
		<el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
			<el-tab-pane label="已提交" lazy name="/submit_log" class="tab_pane_box">
				<CommitLog :name="name" ref="commit_log"/>
			</el-tab-pane>
			<!-- <el-tab-pane label="暂存" lazy name="/staging_data" class="tab_pane_box">
				<StagingData/>
			</el-tab-pane> -->
		</el-tabs>
	</div>
</template>
<style scoped lang="less">
.buts{
	display: flex;
	justify-content: flex-end;
	margin-bottom: 15px;
	.input-with-select{
		width: 220px;
	}
}
</style>
<script>
	import CommitLog from './submit_log.vue'
	import StagingData from './staging_data.vue'
	export default{
		data(){
			return{
				name:"",					//表单名
				activeTab:"/submit_log"
			}
		},
		methods:{
			//切换tab
			handleClick(e){
				this.activeTab = e.name;
			},
			//搜索
			search(){
				this.$refs.commit_log.search();
			}
		},
		components:{
			CommitLog,
			StagingData
		}
	}
</script>