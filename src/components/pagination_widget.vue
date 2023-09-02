<template>
	<div class="flex mt-15 jse">
		<el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="page" :pager-count="pagerCount" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
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
			//展示的页码数量
			pagerCount:{
				type:Number,
				default:11
			},
		},
		methods:{
			//切换页码
			handlePageChange(v){
				this.$emit('handlePageChange',v)
			},
			//切换每页条数
			handleSizeChange(v){
				this.$emit('handleSizeChange',v)
			}
		}
	}
</script>
<style lang="less" scoped>

</style>