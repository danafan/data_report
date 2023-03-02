<template>
	<div class="flex mt-15 jse">
		<el-pagination @size-change="$emit('handleSizeChange')" @current-change="$emit('handlePageChange')" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
</template>
<script>
	export default{
		props:{
			//页码
			page:{
				type:Number,
				default:1
			},
			//每页条数
			pagesize:{
				type:Number,
				default:10
			},
			//总数
			total:{
				type:Number,
				default:0
			},
		},
		methods:{

		}
	}
</script>
<style lang="less" scoped>

</style>