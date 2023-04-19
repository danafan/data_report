<template>
	<div>
		<div class="page_top">
			<div class="toast_box">
				<div class="toast_title">关键指标含义</div>
				<div class="item_row" v-for="item in toast_list">
					<div class="dian"></div>
					<div>{{item}}</div>
				</div>
			</div>
			<div class="form_box">
				<el-form :inline="true" size="mini" class="demo-form-inline">
					<el-form-item label="付款日期:">
						<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="changeDate">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="仓库：">
						<el-select v-model="ckmc" clearable multiple filterable collapse-tags placeholder="全部">
							<el-option v-for="item in ck_list" :key="item.id" :label="item.name" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click="ckSend">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="table_title">仓库发货情况</div>
		<!-- 表格 -->
		<div class="table_container" v-loading="loading">
			<div class="table_header">
				<div class="header_item" v-for="(item,index) in label_list" :key="index" @mouseenter="current_index = index" @mouseleave="current_index = null">
					<div>
						{{item.lable}}
					</div>
					<div v-if="current_index == index">
						<img class="sort-icon" v-if="item.sort == null" src="../../../static/sort_icon.png" @click="sortStatus(index,'asc')">
						<img class="sort-icon" v-if="item.sort == 'asc'" src="../../../static/sort_up.png" @click="sortStatus(index,'desc')">
						<img class="sort-icon" v-if="item.sort == 'desc'" src="../../../static/sort_down.png" @click="sortStatus(index,null)">
					</div>
				</div>
			</div>
			<div class="total_column" v-if="table_data.length > 0">
				<div class="total_column_value" v-for="item in label_list">
					{{total_data[item.prop]}}
				</div>
			</div>
			<div class="table_list" v-if="table_data.length > 0">
				<div class="column_item" :class="{'column_item_green':index%2 == 0}" v-for="(item,index) in table_data" :key="index">
					<div class="column_item_text" v-for="i in label_list">
						<el-tooltip effect="dark" :content="item[i.prop]" placement="top" v-if="i.prop == 'ckmc'">
							<el-button type="text" class="tooltip_but">{{item[i.prop]}}</el-button>
						</el-tooltip>
						<div v-else>{{item[i.prop]}}</div>
					</div>
				</div>
			</div>
			<div class="empty" v-if="table_data.length == 0">暂无数据</div>
		</div>

	</div>
</template>
<script>
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import resource from '../../../api/demandResource.js'
	export default{
		data(){
			return{
				toast_list:[
				'本报告数据源为实时数据源，展示各个仓库发货情况',
				'数据更新方式：每小时一更新',
				'当日订单数：付款日期当天的下单内部订单号数，订单状态包括：已发货、发货中、已付款待审核和异常',
				'当日已发货：付款日期当天的已发货的内部订单号数',
				'当日发货中：付款日期当天的发货中的内部订单号数',
				'当日未发货：付款日期当天的已付款待审核和异常的内部订单号数',
				'当日发货率：当日已发货/当日订单数',
				'当日缺货率：当日异常订单数/当日订单数',
				'当日档口款缺货率：异常订单中，档口款订单数/(档口款订单数+自有货品订单数）',
				'当日自有货品缺货率：异常订单中，自有货品订单数/(档口款订单数+自有货品订单数）'
				],
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 						
				ck_list:[],									//仓库列表
				ckmc:[],									//选中的仓库列表	
				date:[getNowDate(),getNowDate()],			//时间区间
				sort:"",
				label_list:[{
					lable:'仓库名称',
					prop:'ckmc',
					sort:null
				},{
					lable:'当日订单数',
					prop:'dd_0',
					sort:null
				},{
					lable:'当日已发货',
					prop:'yfh_0',
					sort:null
				},{
					lable:'当日发货中',
					prop:'fhz_0',
					sort:null
				},{
					lable:'当日未发货',
					prop:'wfh',
					sort:null
				},{
					lable:'当日异常(缺货)',
					prop:'yc_0',
					sort:null
				},{
					lable:'当日发货率',
					prop:'fhl_0',
					sort:null
				},{
					lable:'当日缺货率',
					prop:'qhl_0',
					sort:null
				},{
					lable:'当日档口款缺货率',
					prop:'dk_qhl_0',
					sort:null
				},{
					lable:'当日自有货品缺货率',
					prop:'hp_qhl_0',
					sort:null
				},{
					lable:'两日发货率',
					prop:'fhl_1',
					sort:null
				},{
					lable:'两日缺货率',
					prop:'qhl_1',
					sort:null
				},{
					lable:'两日档口款缺货率',
					prop:'dk_qhl_1',
					sort:null
				},{
					lable:'两日自有货品缺货率',
					prop:'hp_qhl_1',
					sort:null
				},{
					lable:'三日发货率',
					prop:'fhl_2',
					sort:null
				},{
					lable:'三日缺货率',
					prop:'qhl_2',
					sort:null
				},{
					lable:'三日档口款缺货率',
					prop:'dk_qhl_2',
					sort:null
				},{
					lable:'三日自有货品缺货率',
					prop:'hp_qhl_2',
					sort:null
				},{
					lable:'四日发货率',
					prop:'fhl_3',
					sort:null
				},{
					lable:'四日缺货率',
					prop:'qhl_3',
					sort:null
				},{
					lable:'四日档口款缺货率',
					prop:'dk_qhl_3',
					sort:null
				},{
					lable:'四日自有货品缺货率',
					prop:'hp_qhl_3',
					sort:null
				}],
				current_index:null,
				loading:false,
				total_data:{},			//总计列
				table_data:[],			//表哥数据
			}
		},
		created(){
			//获取仓库列表
			this.changeDate();
			//获取列表
			this.ckSend();
		},
		methods:{
			//获取仓库列表
			changeDate(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:""
				}
				resource.ckList(arg).then(res => {
					if(res.data.code == 1){
						this.ckmc = [];
						this.ck_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			ckSend(){
				let arg = {
					start_time:this.date && this.date.length> 0?this.date[0]:"",
					end_time:this.date && this.date.length> 0?this.date[1]:"",
					ckmc:this.ckmc.join(','),
					sort:this.sort
				}
				this.loading = true;
				resource.ckSend(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						if(data.length > 0){
							this.total_data = data.splice(0,1)[0];
							this.table_data = data;
						}else{
							this.total_data = {};
							this.table_data = [];
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//判断排序图标是否显示
			sortStatus(index,sort){
				this.label_list.map((item,i) => {
					item.sort = index == i?sort:null
				})
				let arr = this.label_list.filter(item => {
					return item.sort
				})
				this.sort = arr.length > 0?arr[0].prop + '-' + arr[0].sort:'';
				//获取列表
				this.ckSend();
			}
		}
	}
</script>
<style lang="less" scoped>
.page_top{
	display: flex;
	.toast_box{
		margin-right: 15px;
		margin-top: 15px;
		padding: 10px;
		border-radius: 10px;
		border:1px solid #8D5714;
		width: 50%;
		.toast_title{
			font-weight: bold;
			font-size: 16px;
			color: #8D5714;
		}
		.item_row{
			display:flex;
			align-items: center;
			font-size: 14px;
			color: #8D5714;
			.dian{
				margin-right: 8px;
				border-radius: 3px;
				background:#8D5714; 
				width: 6px;
				height: 6px;
			}
		}
	}
	.form_box{
		width: 50%;
	}
}
.table_title{
	margin-top: 15px;
	height: 42px;
	line-height: 42px;
	text-align: center;
	font-size:15px;
	color: #333333;
	font-weight: bold;
}
// 表格
.table_container{
	width: 100%;
	display: flex;
	font-size:14px;
	.table_header{
		background: #64D160;
		.header_item{
			width: 190px;
			height: 37px;
			color: #333333;
			font-weight: 600;
			padding:0 10px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.sort-icon{
				width:16px;
				height: 16px;
			}
		}
	}
	.total_column{
		border-top:1px solid #333333;
		width: 130px;
		.total_column_value{
			border-bottom:1px solid #ccc;
			width: 130px;
			text-align: center;
			height: 37px;
			line-height: 37px;
			font-size:14px;
			font-weight: bold;
		}
	}
	.table_list{
		flex:1;
		display: flex;
		overflow-x: scroll;
		&::-webkit-scrollbar {
    		display: none;//取消滚动条
    	}
    	.column_item{
    		border-top:1px solid #333333;
    		.column_item_text{
    			border-bottom:1px solid #ccc;
    			width:130px;
    			text-align: center;
    			height: 37px;
    			line-height: 37px;
    			font-size:14px;
    			color: #333333;
    			.tooltip_but{
    				width:130px;
    				text-align: center;
    				font-size:14px;
    				color: #333333;
    				overflow: hidden !important;
    				text-overflow: ellipsis !important;
    				display: -webkit-box !important;
    				-webkit-line-clamp: 1 !important;
    				-webkit-box-orient: vertical !important;
    			}
    		}
    	}
    	.column_item_green{
    		background: rgba(100,209,96,.5);
    	}
    }
    .empty{
    	flex:1;
    	height: 814px;
    	display: flex;
    	align-items: center;
    	justify-content: center;
    	font-size:14px;
    	color: #cccccc;
    }

}
</style>










