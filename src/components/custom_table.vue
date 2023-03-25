<template>
	<el-table size="mini" :data="table_data" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" :max-height="max_height">
		<el-table-column fixed type="index" label="序号" align="center" v-if="show_index">
		</el-table-column>
		<el-table-column :prop="item.row_field_name" align="center" :sortable="item.is_sort === 1" :fixed="item.is_fixed == 1" show-overflow-tooltip v-for="item in title_list" :width="column_width">
			<template slot="header" slot-scope="scope">
				<el-tooltip class="item" effect="dark" :content="item.row_name" placement="top-start">
					<div :class="{'prop_text':is_wrap}">{{item.row_name}}</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.type == '3' && scope.row.images[0] != ''"></el-image>
				<el-button type="text" v-else-if="item.type == '4'" @click="$emit('tableCallBack',scope.row[fieldName],tableName)">{{scope.row[item.row_field_name]}}{{item.unit}}</el-button>
				<div v-else>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
			</template>
		</el-table-column>
		<el-table-column label="操作" align="center" v-if="is_setting">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="$emit('editFn',scope.row.id)" v-if='button_list.edit == 1'>编辑</el-button>
				<el-button type="text" size="small" @click="$emit('deleteFn',scope.row.id)" v-if='button_list.del == 1'>删除</el-button>
				<el-button type="text" size="small" @click="$emit('detailFn',scope.row.id)" v-if='scope.row.detail'>详情</el-button>
				<el-button type="text" size="small" @click="$emit('handleFn',scope.row.id)" v-if='scope.row.handle'>处理</el-button>
				<el-button type="text" size="small" @click="$emit('feekbackFn',scope.row[fieldName])" v-if='scope.row.feekback'>反馈</el-button>
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
			//下钻时取的参数
			fieldName:{
				type:String,
				default:''
			},
			//表格名称（用于区分点击的哪个表格）
			tableName:{
				type:String,
				default:''
			},
			//图片宽高
			image_size:{
				type:String,
				default:'50px'
			},
			//是否有操作列
			is_setting:{
				type:Boolean,
				default:false
			},
			//按钮权限
			button_list:{
				type:Object,
				default:() => {
					return {
						edit:0,
						del:0
					}
				}
			},
		}
	}
</script>
<style lang="less" scoped>
.prop_text{
	white-space: pre-wrap;
}
</style>