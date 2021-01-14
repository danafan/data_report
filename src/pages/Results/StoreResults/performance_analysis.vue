<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="datetimerange"
				:picker-options="pickerOptions"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:default-time="['00:00:00', '23:59:59']"
				>
			</el-date-picker>
		</el-form-item>
		<el-form-item label="项目部:" style="margin-right: 20px">
			<el-select v-model="select_department_ids" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in department_list" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="店铺:">
			<el-select v-model="select_store_ids" multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in store_list" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary">搜索</el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="info">清空</el-button>
		</el-form-item>
	</el-form>
	<!-- 数据模块 -->
	<div class="data_module">
		<div class="module_item">
			<div class="title">销售收入预估</div>
			<div class="value">1055.25万</div>
			<div class="content_row">
				<div class="label">销售收入月目标</div>
				<div class="content_val">86454.00万</div>
			</div>
			<div class="content_row">
				<div class="label">月度完成率</div>
				<div class="content_val">12.47%</div>
			</div>
			<div class="content_row">
				<div class="label">日累计-销售收入</div>
				<div class="content_val">86454.00万</div>
			</div>
			<div class="content_row">
				<div class="label">周期内完成率</div>
				<div class="content_val">86.64%</div>
			</div>
		</div>
		<div class="module_item">
			<div class="title">营销费用预估</div>
			<div class="value">1055.25万</div>
			<div class="content_row">
				<div class="label">营销费用月目标</div>
				<div class="content_val">86454.00万</div>
			</div>
			<div class="content_row">
				<div class="label">月度使用率</div>
				<div class="content_val">12.47%</div>
			</div>
			<div class="content_row">
				<div class="label">日累计-营销费用</div>
				<div class="content_val">86454.00万</div>
			</div>
			<div class="content_row">
				<div class="label">周期内使用率</div>
				<div class="content_val">86.64%</div>
			</div>
		</div>
		<div class="module_item">
			<div class="title">预估值-贡献毛益</div>
			<div class="value">1055.25万</div>
			<div class="content_row">
				<div class="label">贡献毛益月目标</div>
				<div class="content_val">86454.00万</div>
			</div>
			<div class="content_row">
				<div class="label">月度完成率</div>
				<div class="content_val">12.47%</div>
			</div>
			<div class="content_row">
				<div class="label">日累积-贡献毛益</div>
				<div class="content_val">86454.00万</div>
			</div>
			<div class="content_row">
				<div class="label">周期内完成率</div>
				<div class="content_val">86.64%</div>
			</div>
		</div>
		<div class="module_item">
			<div class="title">预估值-贡献毛益率</div>
			<div class="value">14.35%</div>
			<div class="content_row">
				<div class="label">贡献毛益率月目标</div>
				<div class="content_val">14.35%</div>
			</div>
			<div class="content_row">
				<div class="label">日累积-贡献毛益率</div>
				<div class="content_val">14.35%</div>
			</div>
		</div>
	</div>
	<!-- 表格 -->
	<div class="table_container">
		<div class="table_header">
			<div class="header_item">店铺</div>
			<div class="header_item">月目标-销售收入</div>
			<div class="header_item">日累计-销售收入</div>
			<div class="header_item">销售收入预估</div>
			<div class="header_item">月目标-销售收入完成率</div>
			<div class="header_item">日累计-销售收入完成率</div>
			<div class="header_item">月毛利率目标</div>
			<div class="header_item">预估毛利率</div>
			<div class="header_item">月目标-营销费用率</div>
			<div class="header_item">预估营销费用率</div>
			<div class="header_item">返现费用预估</div>
			<div class="header_item">月目标-贡献毛益</div>
			<div class="header_item">日累计-贡献毛益</div>
			<div class="header_item">贡献毛益预估</div>
			<div class="header_item">月目标-贡献毛益率</div>
			<div class="header_item">贡献毛益率预估</div>
			<div class="header_item">月目标-贡献毛益完成率</div>
			<div class="header_item">日累计-贡献毛益完成率</div>
		</div>
		<div class="table_list">
			<div class="column_item" :class="{'column_item_odd':index%2 == 1}" v-for="(item,index) in data_list">
				<div class="column_item_text">{{item.item_01}}</div>
				<div class="column_item_text">{{item.item_02}}</div>
				<div class="column_item_text">{{item.item_03}}</div>
				<div class="column_item_text">{{item.item_04}}</div>
				<div class="column_item_text">{{item.item_05}}</div>
				<div class="column_item_text">{{item.item_06}}</div>
				<div class="column_item_text">{{item.item_07}}</div>
				<div class="column_item_text">{{item.item_08}}</div>
				<div class="column_item_text">{{item.item_09}}</div>
				<div class="column_item_text">{{item.item_10}}</div>
				<div class="column_item_text">{{item.item_11}}</div>
				<div class="column_item_text">{{item.item_12}}</div>
				<div class="column_item_text">{{item.item_13}}</div>
				<div class="column_item_text">{{item.item_14}}</div>
				<div class="column_item_text">{{item.item_15}}</div>
				<div class="column_item_text">{{item.item_16}}</div>
				<div class="column_item_text">{{item.item_17}}</div>
				<div class="column_item_text">{{item.item_18}}</div>
			</div>
		</div>
	</div>
	<el-dialog title="收货地址" width="50%" :visible.sync="dialogTableVisible">
		asdhk
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
// 数据模块
.data_module{
	width: 100%;
	display: flex;
	justify-content: space-between;
	.module_item{
		border:1px solid #D9D9D9;
		border-radius: 4px;
		width: 228px;
		padding: 16px 24px 11px;
		.title{
			margin-bottom: 5px;
			font-size: 18px;
			color: #333333;
		}
		.value{
			margin-bottom: 5px;
			font-size:24px;
			color: #FF993C;
		}
		.content_row{
			margin-bottom: 5px;
			display: flex;
			.label{
				width: 130px;
				font-size:14px;
				color: #333333;
			}
			.content_val{
				font-size:16px;
				color: #FF993C;
			}
		}
	}
}
// 表格
.table_container{
	margin-top: 20px;
	width: 100%;
	display: flex;
	.table_header{
		.header_item{
			border-bottom:1px solid #fff;
			height: 40px;
			line-height: 40px;
			width: 200px;
			font-size:16px;
			color: #333333;
			font-weight: 600;
		}
	}
	.table_list{
		border-top:1px solid #D9D9D9;
		flex:1;
		display: flex;
		overflow-x: scroll;
		.column_item{
			width: 160px;
			background: #EFF1FA;
			.column_item_text{
				border-bottom:1px solid #D9D9D9;
				width:160px;
				padding-left: 8px;
				padding-right: 8px;
				height: 40px;
				line-height: 40px;
				font-size:16px;
				color: #333333;
			}
		}
		.column_item_odd{
			background: #F8F8F8;
		}
	}
}
</style>
<script>
	export default{
		data(){
			return{
				dialogTableVisible:true,
				pickerOptions: {
					shortcuts: [{
						text: '最近一周',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近一个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '最近三个月',
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit('pick', [start, end]);
						}
					}]
				},									//时间区间
				date:[],							//发货时间
				department_list: [{
					value: '1',
					label: '海外项目部'
				}, {
					value: '2',
					label: '拼多多项目部'
				}, {
					value: '3',
					label: '其他'
				}, {
					value: '4',
					label: '新兴项目部'
				}, {
					value: '5',
					label: '运营二部'
				}],									//部门列表	
				select_department_ids:[],			//选中的部门id列表
				store_list: [{
					value: '1',
					label: '11号折扣店'
				}, {
					value: '2',
					label: '1212ww_2005'
				}, {
					value: '3',
					label: '1688店铺ppg8090'
				}, {
					value: '4',
					label: 'amapo旗舰店'
				}, {
					value: '5',
					label: 'denhaag旗舰店'
				}],									//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				data_list:[{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				},{
					item_01:"看天上的你",
					item_02:"2083.20万",
					item_03:"875.76万",
					item_04:"479.48万",
					item_05:"23.02%",
					item_06:"54.75%",
					item_07:"33.62%",
					item_08:"40.32%",
					item_09:"19.80%",
					item_10:"18.93%",
					item_11:"13.54万",
					item_12:"262.95万",
					item_13:"110.55万",
					item_14:"77.01万",
					item_15:"12.62%",
					item_16:"16.53%",
					item_17:"29.29%",
					item_18:"69.67%",
				}],									//表格数据
			}
		}
	}
</script>