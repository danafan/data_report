<template>
	<div class="custom_title_row">
		<div class="custom_title">{{title}}</div>
		<el-popover
		placement="top-start"
		width="500"
		trigger="hover">
		<div class="row_content" v-for="item in list">
			<span class="bold">{{item.label}}</span>
			<span>{{item.value}}</span>
		</div>
		<i class="icon_style el-icon-info" slot="reference"></i>
	</el-popover>
</div>
</template>
<script>
	import popover from '../api/popoverContent.js'
	export default{
		data(){
			return{
				list:[]
			}
		},
		props:{
			//标题名称
			title:{
				type:String,
				default:""
			},
			keys:{
				type:String,
				default:""
			}
		},
		created(){
			var new_list = [];
			let list = popover[this.keys];
			list.map(item => {
				item.split('：');
				let obj = {
					label:item.split('：')[0] + "：",
					value:item.split('：')[1]
				}
				new_list.push(obj)
			})
			this.list = new_list;
		}
	}
</script>
<style lang="less" scoped>
.custom_title_row{
	display: flex;
	.custom_title{
		font-weight: bold;
		color: #333333;
	}

	.icon_style{
		margin-left: 5px;
		color: #E6A23C;
	}
}
.row_content{
	color: #333333;
	font-size: 14px;
	line-height: 22px;
	.bold{
		font-weight: bold;
	}
}
</style>