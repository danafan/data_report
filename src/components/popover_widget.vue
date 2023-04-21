<template>
	<div>
		<div class="custom_title_row">
			<div class="custom_title">{{title}}</div>
			<el-popover
			placement="top-start"
			width="500"
			trigger="hover" v-if="show_popover">
			<div class="row_content" v-for="item in list">
				<span class="bold">{{item.label}}</span>
				<span>{{item.value}}</span>
			</div>
			<img v-if="use_icon" class="popover_icon" src="../static/popover_icon.png" slot="reference">
			<i class="icon_style el-icon-info" slot="reference" v-else></i>
		</el-popover>
	</div>
	<div class="f12 red_color" v-if="update_time != ''">数据更新时间：{{update_time}}</div>
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
			//是否显示感叹号
			show_popover:{
				type:Boolean,
				default:true
			},
			//标题名称
			title:{
				type:String,
				default:""
			},
			//数据更新时间
			update_time:{
				type:String,
				default:""
			},
			keys:{
				type:String,
				default:""
			},
			//是否使用特定图标
			use_icon:{
				type:Boolean,
				default:false
			}
		},
		created(){
			if(!this.show_popover){
				return;
			}
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
	.popover_icon{
		margin-left: 5px;
		width: 20px;
		height: 20px;
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