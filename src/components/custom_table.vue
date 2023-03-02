<template>
	<el-table size="mini" :data="table_data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" :max-height="max_height">
		<el-table-column fixed type="index" label="序号" align="center" v-if="show_index">
		</el-table-column>
		<el-table-column :prop="item.row_field_name" align="center" :sortable="item.is_sort === 1" show-overflow-tooltip v-for="item in title_list" :width="column_width">
			<template slot="header" slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
					<div :class="{'prop_text':is_wrap}">{{item.row_name}}</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.type == '3' && scope.row.images[0] != ''"></el-image>
				<div v-else>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
			</template>
		</el-table-column>
	</el-table>
</template>
<script>
	export default{
		props:{
			//是否显示序号
			show_index:{
				type:Boolean,
				default:false
			},
			//表头是否换行
			is_wrap:{
				type:Boolean,
				default:false
			},
			//表格最大高度
			max_height:{
				type:String,
				default:'360px'
			},
			//列宽
			column_width:{
				type:String,
				default:''
			},
			//表格数据
			table_data:{
				type:Array,
				default:()=>[]
			},
			//表头数据
			title_list:{
				type:Array,
				default:()=>[]
			},
			//图片宽高
			image_size:{
				type:String,
				default:'50px'
			}
		}
	}
</script>
<style lang="less" scoped>
.prop_text{
	white-space: pre-wrap;
}
</style>