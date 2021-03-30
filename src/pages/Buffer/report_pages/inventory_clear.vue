<template>
	<div>
		<el-card class="card_style">
			<Widget01/>
		</el-card>
		<el-card class="card_style">
			<Widget02/>
		</el-card>
		<el-card class="card_style">
			<Widget03/>
		</el-card>
		<el-card class="card_style">
			<Widget04/>
		</el-card>
	</div>
</template>
<style lang="less" scoped>
.card_style{
	margin-bottom: 20px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import Widget01 from './inventory_clear_components/widget_01.vue'
	import Widget02 from './inventory_clear_components/widget_02.vue'
	import Widget03 from './inventory_clear_components/widget_03.vue'
	import Widget04 from './inventory_clear_components/widget_04.vue'
	export default{
		components:{
			Widget01,
			Widget02,
			Widget03,
			Widget04,
		}
	}
</script>