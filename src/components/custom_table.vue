<template>
	<div>
		<el-table ref="total_table" class="total_table" size="mini" :data="total_data" tooltip-effect="dark" :header-cell-style="columnStyle" @sort-change="sortChange" :row-style="setBackground" v-if="total_row">
			<el-table-column fixed type="index" label="序号" align="center" v-if="show_index">
			</el-table-column>
			<el-table-column :prop="item.row_field_name" align="center" :sortable="sortableFn(item.is_sort)" :fixed="item.is_fixed == 1" show-overflow-tooltip v-for="item in title_list" :column-key="item.color" :width="item.type == '8'?180:item.type == '1'?100:item.width">
				<template slot="header" slot-scope="scope">
					<div class="width-100 pre-line">{{item.row_name}}</div>
				</template>
				<!-- 多级表头 -->
				<el-table-column :prop="i.row_field_name" align="center" :sortable="sortableFn(i.is_sort)" :fixed="i.is_fixed == 1" show-overflow-tooltip :column-key="i.color" :width="i.type == '8'?180:i.type == '1'?100:item.width" v-for="i in item.list">
					<template slot="header" slot-scope="scope">
						<div class="width-100 pre-line">{{i.row_name}}</div>
					</template>
					<template slot-scope="scope">
						<!-- 普通文字 -->
						<div class="table_header_text">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null&&scope.row[i.row_field_name] !== ''?i.unit:''}}</div>
					</template>
				</el-table-column>
				<!-- 单级表头 -->
				<template slot-scope="scope">
					<!-- 普通文字 -->
					<div class="table_header_text">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null&&scope.row[item.row_field_name] !== ''?item.unit:''}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" :width="setting_width" fixed="right" align="center" v-if="is_setting">
				<template slot-scope="scope">

				</template>
			</el-table-column>
		</el-table-column>
	</el-table>
	<el-table ref="data_table" size="mini" :data="table_data" tooltip-effect="dark" :header-cell-style="columnStyle" @sort-change="sortChange" :max-height="max_height" :show-header="!total_row" v-if="!total_row || (total_row && table_data.length > 0)">
		<el-table-column fixed type="index" label="序号" align="center" v-if="show_index">
		</el-table-column>
		<el-table-column :prop="item.row_field_name" align="center" :sortable="sortableFn(item.is_sort)" :fixed="item.is_fixed == 1" show-overflow-tooltip v-for="item in title_list" :column-key="item.color" :width="item.type == '8'?180:item.type == '1'?100:item.width">
			<template slot="header" slot-scope="scope">
				<div class="width-100 pre-line">{{item.row_name}}</div>
			</template>
			<!-- 多级表头 -->
			<el-table-column :prop="i.row_field_name" align="center" :sortable="sortableFn(i.is_sort)" :fixed="i.is_fixed == 1" show-overflow-tooltip :column-key="i.color" :width="i.type == '8'?180:i.type == '1'?100:item.width" v-for="i in item.list">
				<template slot="header" slot-scope="scope">
					<div class="width-100 pre-line">{{i.row_name}}</div>
				</template>
				<template slot-scope="scope">
					<!-- 营销费用经营管控-事业部项目部营销费用投产情况-毛利率-营销费用占比 -->
					<div :class="{'red_color':scope.row[i.row_field_name] < 20}" :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="i.type == '99'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
					<!-- 营销费用经营管控-店铺营销费用投产情况-毛利率-营销费用占比 -->
					<div :class="{'red_color':(i.row_field_name == 'mlv_rate' && scope.row[i.row_field_name] < 20) || (i.row_field_name == 'yx_rate' && ((scope.row.platform == '淘宝' && scope.row[i.row_field_name] > 15) || (scope.row.platform == '天猫' && scope.row[i.row_field_name] > 20)))}" :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="i.type == '98'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
					<!-- 供应链中心-重点跟进款式-款式Top200-今日跟踪反馈 -->
					<div class="flex ac" v-else-if="i.type == '97'">
						<el-checkbox style="margin-right: 5px;" :true-label='1' :false-label='0' v-model="scope.row.type" :disabled="i.check_disabled" @change="$emit('editFun',scope.row.today_remark,scope.row.ksbm,scope.row.type)"></el-checkbox>
						<el-input @blur="$emit('editFun',scope.row.today_remark,scope.row.ksbm,scope.row.type)" size="small" type="textarea" placeholder="输入反馈" v-model="scope.row.today_remark" :disabled="i.check_disabled">
						</el-input>
					</div>
					<!-- 供应链中心-重点跟进款式-款式Top200-历史跟踪反馈 -->
					<div v-else-if="i.type == '96'">
						<el-popover placement="right" width="800" :open-delay="1000"
						trigger="hover" @show="getRecord(scope.row.ksbm)" >
						<el-table size="small" :data="top_200_tableObj.data" tooltip-effect="dark" style="width: 100%;height: 400px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="top_200_detail_loading">
							<el-table-column prop="createtime" label="操作时间" width="160" align="center"></el-table-column>
							<el-table-column prop="remark" label="反馈内容" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="creater" label="操作人" width="100" show-overflow-tooltip align="center"></el-table-column>
						</el-table>
						<div class="page">
							<el-pagination @size-change="handlePageSize" @current-change="handlePage" :current-page="top_200_table_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, prev, pager, next, jumper" :total="top_200_tableObj.total">
							</el-pagination>
						</div>
						<el-button slot="reference" type="text" size="mini">查看</el-button>
					</el-popover>
				</div>
				<!-- 进度条 -->
				<div :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="i.type == '1'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null?i.unit:''}}</div>
				<!-- 正负颜色 -->
				<div :class="[{'red_color':scope.row[i.row_field_name] >= 0},{'green_color':scope.row[i.row_field_name] < 0}]" v-else-if="i.type == '2' && i.row_field_name != 'mlv_rate'">{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null&&scope.row[i.row_field_name] !== ''?i.unit:''}}</div>
				<!-- 图片 -->
				<div v-else-if="i.type == '3'">
					<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="filterImage(scope.row[i.row_field_name])[0]" fit="scale-down" :preview-src-list="filterImage(scope.row[i.row_field_name])" v-if="filterImage(scope.row[i.row_field_name]).length > 0" @click.stop="handleClickStop"></el-image>
					<!-- 主体店铺资料 -->
					<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`,marginLeft:'5px'}" :src="filterImage(scope.row[i.row_field_name])[1]" fit="scale-down" :preview-src-list="filterImage(scope.row[i.row_field_name])" v-if="filterImage(scope.row[i.row_field_name]).length > 1" @click.stop="handleClickStop"></el-image>
					<div v-if="filterImage(scope.row[i.row_field_name]).length == 0">暂无</div>
				</div>
				<!-- 链接 -->
				<el-button type="text" size="small" v-else-if="i.type == '4'" @click="$emit('tableCallBack',scope.row[fieldName],tableName,scope.row[i.row_field_name],i.row_field_name)">{{(tableName == 'main_body_info' && i.row_field_name == 'contract_url') || (tableName == 'basic_auth_info' && i.row_field_name == 'auth_file_url')?'查看':scope.row[i.row_field_name]}}{{i.unit}}</el-button>
				<!-- 图表 -->
				<div class="chart" v-else-if="i.type == '8'" :id="`${i.row_field_name}-${scope.row.id}`"></div>
				<!-- 普通文字 -->
				<div class="table_header_text" @dblclick="doCopy(scope.row[i.row_field_name])" v-else>{{scope.row[i.row_field_name]}}{{scope.row[i.row_field_name] !== null&&scope.row[i.row_field_name] !== ''?i.unit:''}}</div>
			</template>
		</el-table-column>
		<!-- 单级表头 -->
		<template slot-scope="scope">
			<!-- 营销费用经营管控-事业部项目部营销费用投产情况-毛利率-营销费用占比 -->
			<div :class="{'red_color':scope.row[item.row_field_name] < 20}" :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="item.type == '99'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null?item.unit:''}}</div>
			<!-- 营销费用经营管控-店铺营销费用投产情况-毛利率-营销费用占比 -->
			<div :class="{'red_color':(item.row_field_name == 'mlv_rate' && scope.row[item.row_field_name] < 20) || (item.row_field_name == 'yx_rate' && ((scope.row.platform == '淘宝' && scope.row[item.row_field_name] > 15) || (scope.row.platform == '天猫' && scope.row[item.row_field_name] > 20)))}" :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="item.type == '98'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null?item.unit:''}}</div>
			<!-- 供应链中心-重点跟进款式-款式Top200 -->
			<div class="flex ac" v-else-if="item.type == '97'">
				<el-checkbox style="margin-right: 5px;" :true-label='1' :false-label='0' v-model="scope.row.type" :disabled="item.check_disabled" @change="$emit('editFun',scope.row.today_remark,scope.row.ksbm,scope.row.type)"></el-checkbox>
				<el-input @blur="$emit('editFun',scope.row.today_remark,scope.row.ksbm,scope.row.type)" size="small" type="textarea" placeholder="输入反馈" v-model="scope.row.today_remark" :disabled="item.check_disabled">
				</el-input>
			</div>
			<!-- 供应链中心-重点跟进款式-款式Top200-历史跟踪反馈 -->
			<div v-else-if="item.type == '96'">
				<el-popover placement="right" width="800" :open-delay="1000"
				trigger="hover" @show="getRecord(scope.row.ksbm)" >
				<el-table size="small" :data="top_200_tableObj.data" tooltip-effect="dark" style="width: 100%;height: 400px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="top_200_detail_loading">
					<el-table-column prop="createtime" label="操作时间" width="160" align="center"></el-table-column>
					<el-table-column prop="remark" label="反馈内容" show-overflow-tooltip align="center"></el-table-column>
					<el-table-column prop="creater" label="操作人" width="100" show-overflow-tooltip align="center"></el-table-column>
				</el-table>
				<div class="page">
					<el-pagination @size-change="handlePageSize" @current-change="handlePage" :current-page="top_200_table_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, prev, pager, next, jumper" :total="top_200_tableObj.total">
					</el-pagination>
				</div>
				<el-button slot="reference" type="text" size="mini">查看</el-button>
			</el-popover>
		</div>
		<!-- 进度条 -->
		<div :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-else-if="item.type == '1'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null?item.unit:''}}</div>
		<!-- 正负颜色 -->
		<div :class="[{'red_color':scope.row[item.row_field_name] >= 0},{'green_color':scope.row[item.row_field_name] < 0}]" v-else-if="item.type == '2'">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null&&scope.row[item.row_field_name] !== ''?item.unit:''}}</div>
		<!-- 图片 -->
		<div v-else-if="item.type == '3'">
			<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`}" :src="filterImage(scope.row[item.row_field_name])[0]" fit="scale-down" :preview-src-list="filterImage(scope.row[item.row_field_name])" @click.stop="handleClickStop" v-if="filterImage(scope.row[item.row_field_name]).length > 0"></el-image>
			<!-- 主体店铺资料 -->
			<el-image :z-index="2006" :style="{width:`${image_size}`,height:`${image_size}`,marginLeft:'5px'}" :src="filterImage(scope.row[item.row_field_name])[1]" fit="scale-down" :preview-src-list="filterImage(scope.row[item.row_field_name])" @click.stop="handleClickStop" v-if="filterImage(scope.row[item.row_field_name]).length > 1"></el-image>
			<div v-if="filterImage(scope.row[item.row_field_name]).length == 0">暂无</div>
		</div>
		<!-- 链接 -->
		<el-button type="text" size="small" v-else-if="item.type == '4' && scope.row[item.row_field_name] != ''" @click="$emit('tableCallBack',scope.row[fieldName],tableName,scope.row[item.row_field_name],item.row_field_name)">{{(tableName == 'main_body_info' && item.row_field_name == 'contract_url') || (tableName == 'basic_auth_info' && item.row_field_name == 'auth_file_url')?'查看':scope.row[item.row_field_name]}}{{item.unit}}</el-button>
		<!-- <el-button type="text" size="small" v-else-if="item.type == '4' && ((tableName == 'main_body_info' && item.row_field_name == 'contract_url' && scope.row[item.row_field_name] != '') || (tableName == 'basic_auth_info' && item.row_field_name == 'auth_file_url' && scope.row[item.row_field_name] != ''))" @click="$emit('tableCallBack',scope.row[fieldName],tableName,scope.row[item.row_field_name],item.row_field_name)">{{(tableName == 'main_body_info' && item.row_field_name == 'contract_url') || (tableName == 'basic_auth_info' && item.row_field_name == 'auth_file_url')?'查看':scope.row[item.row_field_name]}}{{item.unit}}</el-button> -->
		<!-- 图表 -->
		<div class="chart" v-else-if="item.type == '8'" :id="`${item.row_field_name}-${scope.row.id}`"></div>
		<!-- 普通文字 -->
		<div class="table_header_text" @dblclick="doCopy(scope.row[item.row_field_name])" v-else>{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] !== null&&scope.row[item.row_field_name] !== ''?item.unit:''}}</div>
	</template>
</el-table-column>
<el-table-column label="操作" :width="setting_width" align="center" fixed="right" v-if="is_setting">
	<template slot-scope="scope">
		<!-- 生成款式编码【确认同步】 -->
		<el-button type="text" size="small" @click="$emit('syncJst',scope.row[fieldName])" v-if='button_list.sync == 1 && scope.row.sync_status == 1'>确认同步</el-button>
		<!-- 生成款式编码【增加】 -->
		<el-button type="text" size="small" @click="$emit('addSpecFn',{[fieldName]:scope.row[fieldName],ksbm:scope.row.ksbm})" v-if='button_list.add_spec == 1 && scope.row.status == 1'>增加</el-button>
		<!-- 生成款式编码【编辑】 -->
		<el-button type="text" size="small" @click="$emit('editFn',scope.row[fieldName])" v-if="tableName == 'ksbm_table' && button_list.edit == 1 && scope.row.status == '0'">编辑</el-button>
		<!-- 配置资料【编辑】 -->
		<el-button type="text" size="small" @click="$emit('editFn',scope.row[fieldName])" v-if="tableName == 'option_info' && button_list.edit == 1 && scope.row.used_status == '0'">编辑</el-button>
		<!-- 普通【编辑】 -->
		<el-button type="text" size="small" @click="$emit('editFn',scope.row[fieldName])" v-if="(tableName != 'ksbm_table' && tableName != 'option_info') && button_list.edit == 1">编辑</el-button>
		<!-- 生成款式编码【删除】 -->
		<el-button type="text" size="small" @click="$emit('deleteFn',scope.row[fieldName])" v-if="tableName == 'ksbm_table' && button_list.del == 1 && scope.row.status == '0'">删除</el-button>
		<!-- 配置资料【删除】 -->
		<el-button type="text" size="small" @click="$emit('deleteFn',scope.row[fieldName])" v-if="tableName == 'option_info' && button_list.del == 1 && scope.row.used_status == '0'">删除</el-button>
		<!-- 普通【删除】 -->
		<el-button type="text" size="small" @click="$emit('deleteFn',scope.row[fieldName])" v-if="(tableName != 'ksbm_table' && tableName != 'option_info') && button_list.del == 1">删除</el-button>
		<!-- 普通详情 -->
		<el-button type="text" size="small" @click="$emit('detailFn',scope.row[fieldName])" v-if='button_list.detail == 1'>详情</el-button>
		<!-- 转移主体（店铺基础授权资料） -->
		<el-button type="text" size="small" @click="$emit('transferFn',scope.row)" v-if='button_list.transfer == 1'>转移主体</el-button>
		<el-button type="text" size="small" @click="$emit('detailFn',scope.row[fieldName])" v-if='scope.row.detail'>详情</el-button>
		<el-button type="text" size="small" @click="$emit('handleFn',scope.row[fieldName])" v-if='scope.row.handle'>处理</el-button>
		<el-button type="text" size="small" @click="$emit('feekbackFn',scope.row[fieldName])" v-if='scope.row.feekback'>反馈</el-button>
	</template>
</el-table-column>
</el-table>
</div>
</template>
<script>
	import demandResource from '../api/demandResource.js'
	export default{
		data(){
			return{
				total_data:[],
				commonClass:"",				//动态类名
				show_chart_filed:[],		//需要展示图表的字段列表
				total_table:null,
				data_table:null,
				top_200_ksbm:"",			//款式Top200历史跟踪反馈查看的款式编码
				top_200_table_page:1,
				top_200_table_pagesize:10,	
				top_200_detail_loading:false,
				top_200_tableObj:{},
				isUpdate:false
			}
		},
		props:{
			//是否显示序号
			show_index:{
				type:Boolean,
			default:false
			},
			//表头是否换行
			is_wrap:{
				type:Boolean,
			default:true
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
			//第一行是否是总计行
			total_row:{
				type:Boolean,
			default:false
			},
			//总计行数据
			table_total_data:{
				type:Object,
			default:()=>{}
			},
			//是否自定义排序
			is_custom_sort:{
				type:Boolean,
			default:true
			},
			//操作时取的参数
			fieldName:{
				type:String,
			default:'id'
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
			//操作列宽度
			setting_width:{
				type:String,
			default:'120'
			},
			//排序拼接类型(true:数字；false：字母)
			sort_num:{
				type:Boolean,
			default:true
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
		//加载状态
		isLoading:{
			type:Boolean,
		default: false
		}
	},
	watch:{
		table_data:function(n,o){
			this.$nextTick(() => {
				this.show_chart_filed = [];
				this.getShowChartFiled(this.title_list);
				var echarts = require("echarts");
				n.map(n_item => {
					this.show_chart_filed.map((item) => {
						if(n_item.id != ''){
							var ele = document.getElementById(`${item}-${n_item.id}`);
							let myChart = echarts.getInstanceByDom(ele)
							if (myChart == null) { 
								myChart = echarts.init(ele);
							}
							let x_axis = [];
							let series_data = n_item[item].split(',');
							series_data.map(i => {
								x_axis.push('');
							})
							myChart.setOption(this.chartsOptions(x_axis,series_data))
						}

					})
				})
			})
		},
		table_total_data:function(n,o){
			this.total_data = [];
			if(Object.keys(n).length > 0){
				this.total_data.push(n);
			}
		},
		isLoading:function(n,o){
			// this.isUpdate = !this.isUpdate;
			this.isUpdate = `${this.tableName}_${Math.random()}`;
			if(!n){
				this.setScroll();
			}
		},
	},
	mounted(){
		this.setScroll();
	},
	beforeDestroy() {
    		// 移除事件监听
		if(this.total_table){
			this.total_table.removeEventListener("scroll", ()=>{});
		}
		if(this.data_table){
			this.data_table.removeEventListener("scroll", ()=>{});
		}
	},
	methods:{
		doCopy(text) {
			this.$copyText(text).then( (e) => {
				this.$message.success('复制成功')
			},  (e)=> {
				this.$message.success('复制失败')
			})
		},
    	//过滤图片
		filterImage(image){
			if(image){
				return image.split(',');
			}else{
				return [];
			}
		},
  		//设置监听滚动事件
		setScroll(){
			this.$nextTick(() => {
				if(this.total_row){
					this.total_table = this.$refs.total_table.bodyWrapper;
					this.total_table.addEventListener('scroll', this.debounce((e)=>{
						if(this.table_data.length > 0){
							this.data_table.scrollLeft = this.total_table.scrollLeft;
						}

					}, 50));
				}else{
					this.total_table = null;
				}
				if(!this.total_row || (this.total_row && this.table_data.length > 0)){
					this.data_table = this.$refs.data_table.bodyWrapper;
					this.data_table.addEventListener('scroll', this.debounce((e)=>{
						if(this.total_row){
							this.total_table.scrollLeft = this.data_table.scrollLeft;
						}
					}, 50));
				}else{
					this.data_table = null;
				}
			})
		},
		debounce(fn, wait) {
			var timeout = null; 
			return function() { 
				if(timeout !== null) clearTimeout(timeout); 
				timeout = setTimeout(fn, wait); 
			} 
		},
		setBackground({row, rowIndex}){
			return {'background':'#F5F7FA','color':'#333333'}
		},
		//排序
		sortChange({ column, prop, order }) {  
			let sort = "";
			if(order){
				sort = prop + '-' + (order == 'ascending'?`${this.sort_num?'1':'asc'}`:`${this.sort_num?'0':'desc'}`);
			} else{
				sort = "";
			}   
			this.$emit('sortCallBack',sort);
		},
		sortableFn(bool){
			if(bool){
				if(this.is_custom_sort){
					return true;
				}else{
					return 'custom';
				}
			}else{
				return false;
			}
		},
		//递归找到需要展示图标的字段
		getShowChartFiled(list) {
			list.map(item => {
				if(item.list && item.list.length > 0){
					if(item.type == 8){
						this.show_chart_filed.push(item.row_field_name);
					}
					this.getShowChartFiled(item.list)
				}else{
					if(item.type == 8){
						this.show_chart_filed.push(item.row_field_name);
					}
				}
			})
		},
		//表头加特殊背景色
		columnStyle({ row, column, rowIndex, columnIndex }) {
			if(column.columnKey){
				return `background: ${column.columnKey};color:#333333`;
			}else{
				return `background: #f4f4f4`;
			}
		},
		//图表绘制
		chartsOptions(x_axis,series_data){
			return {
				xAxis: {
					type: 'category',
					data: x_axis,
					axisLine: {
						show: false, 
					},
					axisTick: {
						show: false,  
					}
				},
				yAxis: {
					type: 'value',
					axisTick: {
						show: false,  
					},
					axisLine: {
						show: false, 
					},
					axisLabel: {
						show: false, 
					},
					splitLine: {
						show: true,
						lineStyle: {
							type: 'dashed',
						},
					}
				},
				grid:{
					bottom:'10px',
					top:'10px',
					left:'5px',
					right:'5px',
				},
				series: [
				{
					data: series_data,
					type: 'line',
				}
				]
			}
		},
		//大图点击关闭
		handleClickStop() {
			this.$nextTick(() => {
		          let domImageView = document.querySelector(".el-image-viewer__mask"); // 获取遮罩层dom
		          if (!domImageView) {
		          	return;
		          }
		          domImageView.addEventListener("click", () => {
		            // 点击遮罩层时调用关闭按钮的 click 事件
		          	document.querySelector(".el-image-viewer__close").click();
		          });
		      });
		},
		//点击查看
		getRecord(ksbm){
			this.top_200_table_page = 1;
			this.top_200_ksbm = ksbm;
			//获取详情
			this.getTableData();
		},
		//获取详情
		getTableData(){
			let arg = {
				ksbm:this.top_200_ksbm,
				page:this.top_200_table_page,
				pagesize:this.top_200_table_pagesize
			}
			this.top_200_detail_loading = true;
			demandResource.editLog(arg).then(res => {
				if(res.data.code == 1){
					this.top_200_detail_loading = false;
					this.top_200_tableObj = res.data.data;
				}else{
					this.$message.warning(res.data.msg);
				}
			})
		},
		//详情分页
		handlePageSize(val) {
			this.top_200_table_page = 1;
			this.top_200_table_pagesize = val;
				//获取列表
			this.getTableData();
		},
		handlePage(val) {
			this.top_200_table_page = val;
				//获取列表
			this.getTableData();
		},

	}
}
</script>
<style type="text/css">
	.total_table .el-table__body-wrapper::-webkit-scrollbar {
		display: none!important;
		height: 0!important;
	}
	.total_table .el-table__fixed{
		height: 100%!important;
	}
	.el-table__fixed-right::before, .el-table__fixed::before{
		z-index: 1;
	}
</style>
<style lang="less" scoped>
	.prop_text{
		white-space: pre-wrap;
	}
	.chart{
		width: 150px;
		height: 80px;
	}
	.red_color{
		color: red;
	}
	.green_color{
		color: green;
	}
</style>