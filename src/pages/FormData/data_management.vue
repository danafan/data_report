<template>
	<div>数据管理</div>
</template>
<style scoped lang="less">
	
</style>
<script>
	export default{
		created(){
			let query = this.$route.query;
			console.log(query);
		}
	}
</script>