<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="流量来源:" style="margin-right: 20px">
				<el-select v-model="llly_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in llly" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_container">
			<div class="tab_box">
				<div class="top_list">
					<div class="row_box">
						<div class="row_item header_item" v-for="(item,index) in label_list" :key="index" @mouseenter="CheckShow(index)" @mouseleave="CheckShow(null)">
							<el-tooltip effect="dark" :content="item.title" placement="top">
								<el-button type="text" class="label_title">{{item.title}}</el-button>
							</el-tooltip>
							<div v-if="show_sort_index == index">
								<img class="sort-icon" v-if="item.sort == 0" src="../../../static/sort_icon.png" @click="SortFun(2,index)">
								<img class="sort-icon" v-if="item.sort == 1" src="../../../static/sort_up.png" @click="SortFun(0,index)">
								<img class="sort-icon" v-if="item.sort == 2" src="../../../static/sort_down.png" @click="SortFun(1,index)">
							</div>
						</div>
					</div>
					<div class="row_box">
						<div class="row_item total_item" v-for="(item,index) in total_list" :key="index">
							<div>{{item.field_value_str}}{{item.field_name != 'lymx' && item.field_name != 'll_fks'?'%':''}}</div>
						</div>
					</div>
				</div>
				<div class="content_list">
					<div class="row_box" v-for="(item,index) in data_list" :key="index">
						<div class="row_item" :class="{'column_item_odd':index%2 == 1}" v-for="(i,index) in item" :key="index">
							<div :class="{'f_background_box':i.field_name == 'zfzhl','h_background_box':i.field_name == 'll_fks','is_negative':i.value < 0}" :style="{width:`${(100/i.max_value)*Math.abs(i.value)}px`}" v-if="Filtter(i.field_name)"></div>
							<div :class="['z_index',{'red_color':(i.field_value_str > 0 && i.field_name != 'll_fks' && i.field_name != 'zfzhl'),'green_color':(i.field_value_str < 0 && i.field_name != 'll_fks' && i.field_name != 'zfzhl')}]">{{i.field_value_str}}{{i.field_name != 'lymx' && i.field_name != 'll_fks'?'%':''}}</div>
						</div>
					</div>
				</div>
				<!-- 没有数据 -->
				<div class="data_null" v-if="data_list.length == 0">暂无数据</div>
			</div>
		</div>
		
	</div>
</template>
<style lang="less" scoped>
// 表格
.table_container{
	margin-top: 5px;
	margin-bottom: 30px;
	width: 100%;   
	overflow-x: scroll;
	.tab_box{
		position: relative;
		height: 582px;
	}
	.top_list{
		position: absolute;
		top: 0;
		left: 0;
		height: 72px;
	}
	.content_list{
		position: absolute;
		top: 72px;
		left: 0;
		height: 500px;
		overflow-y: scroll;
	}
	.row_box{
		display: flex;
		.row_item{
			border-bottom:1px solid #D9D9D9;
			background: #EFF1FA;
			width:160px;
			height: 36px;
			line-height: 36px;
			font-size:14px;
			color: #333333;
			padding-left: 5px;
			padding-right: 5px;
			flex-shrink: 0;
			position: relative;
			.label_title{
				width: 160px;
				font-weight: 600;
				color: #333333;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.sort-icon{
				position: absolute;
				top: 10px;
				right: 5px;
				width:16px;
				height: 16px;
			}
			.f_background_box{
				background:#FFA39E;
				position: absolute;
				top: 3px;
				left: 0;
				height: 30px;
				line-height:30px;
			}
			.h_background_box{
				background:#FFE58F;
				position: absolute;
				top: 3px;
				left: 0;
				height: 30px;
				line-height:30px;background:#FFE58F;
			}
			.is_negative{
				background:#B7EB8F;
			}
			.z_index{
				position: absolute;
				top: 2px;
				left: 0;
				width:160px;
				height: 36px;
				line-height:36px;
				padding-left: 5px;
				z-index: 1;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			.red_color{
				color: red;
			}
			.green_color{
				color: green;
			}
		}
		.column_item_odd{
			background: #F8F8F8;
		}
		.total_item{
			background: #fff;
			color: #333;
			font-weight: bold;
		}
		.header_item{
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
	}
}
//暂无数据
.data_null{
	position: absolute;
	top: 72px;
	left: 0;
	border:1px solid #D9D9D9;
	width:100%;
	text-align: center;
	height: 80px;
	line-height: 80px;
	font-size:18px;
	color: #D9D9D9;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				label_list:[],
				total_list:[],
				data_list:[],
				llly:[],
				llly_list:[],
				default_data_list:[],
				show_sort_index:null
			}
		},
		props:{
			shop_id:{
				type:String,
				default:""
			},
			tjrq:{
				type:String,
				default:""
			}
		},
		watch:{
			shop_id:function(n,o){
				//获取列表
				this.getList();
			},
			tjrq:function(n,o){
				//获取列表
				this.getList();
			}
		},
		created(){
			//流量来源列表
			this.ajaxllly();
			//获取列表
			this.getList();
		},
		methods:{
			ajaxllly(){
				resource.ajaxllly().then(res => {
					if(res.data.code == 1){
						this.llly = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//获取列表
			getList(){
				let req = {
					tjrq:this.tjrq,
					shop_id:this.shop_id,
					llly:this.llly_list.join(',')
				}
				resource.boardFlow(req).then(res => {
					if(res.data.code == 1){
						this.label_list = res.data.data.title_names[0];
						this.label_list.map(item => {	
							item.sort = 0;		
						})
						this.total_list = res.data.data.title_names[1];
						this.data_list = res.data.data.list;
						this.default_data_list = JSON.stringify(res.data.data.list);
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//切换是否显示
			CheckShow(index){
				this.show_sort_index = index;
			},
			// 排序
			SortFun(sort,index){
				this.label_list.map((item,i) => {
					if(i == index){
						item.sort = sort;
					}else{
						item.sort = 0;
					}
				})
				if(sort == 0){
					this.data_list = JSON.parse(this.default_data_list);
				}else{
					this.data_list.sort(this.Compare(sort,index));
				}
			},
			// 排序
			Compare(sort,index){
				return function(arr1, arr2){
					var val1 = arr1[index].value;
					var val2 = arr2[index].value;
					if(sort == 1){
						return val1 - val2;
					}else if(sort == 2){
						return val2 - val1;
					}
				}
			},
			Filtter(field_name){
				if(field_name == 'll_fks' || field_name == 'zfzhl'){
					return true;
				}else{
					return false;
				}
			},
		}
	}
</script>