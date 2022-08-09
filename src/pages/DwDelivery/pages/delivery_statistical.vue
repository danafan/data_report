<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计日期：">
				<el-date-picker v-model="day" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getData">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="title">得物-事业部发货情况<span>&nbsp&nbsp&nbsp每小时(整点)更新一次</span></div>
		<el-table size="small" :data="dept_data" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="800" @header-dragend="deptChange" v-loading="loading">
			<el-table-column :index="index" :prop="item.prop" :width="item.width" align="center" show-overflow-tooltip v-for="(item,index) in deptDataColumnObj">
				<template slot="header">
					<el-tooltip effect="dark" :content="item.label" placement="top-start">
						<span>{{item.label}}</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="title">得物-店铺发货情况<span>&nbsp&nbsp&nbsp每小时(整点)更新一次</span></div>
		<el-table size="small" :data="shop_data" tooltip-effect="dark" border style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="800" @header-dragend="shopChange" v-loading="loading">
			<el-table-column :index="index" :prop="item.prop" :width="item.width" align="center" show-overflow-tooltip v-for="(item,index) in shopDataColumnObj">
				<template slot="header">
					<el-tooltip effect="dark" :content="item.label" placement="top-start">
						<span>{{item.label}}</span>
					</el-tooltip>
				</template>
				<template slot-scope="scope">
					<div class="prop_text">{{scope.row[item.prop]}}{{item.unit && scope.row[item.prop]?item.unit:''}}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<style lang="less" scoped>
.title{
	margin-top: 15px;
	margin-bottom: 10px;
	font-size: 18px;
	font-weight: bold;
	span{
		font-size:14px;
		color: red;
	}
}
</style>
<script>
	import {getNowDate} from '../../../api/nowMonth.js'
	import resource from '../../../api/dwResource.js'
	import commonResource from '../../../api/resource.js'
	export default{
		data(){
			return{
				day:getNowDate(),			//统计日期
				dept_data:[],				//部门数据
				loading:false,
				shop_data:[],				//店铺数据
				dept_table_setting:{},
				deptDataColumnObj:[{
					label:'事业部',
					prop:'dept_name',
					width:100
				},{
					label:'店铺名称',
					prop:'shop_name',
					width:100
				},{
					label:'未发货',
					prop:'wfhdl',
					width:100
				},{
					label:'今日已发货',
					prop:'yfhdl',
					width:100
				},{
					label:'今日发货中',
					prop:'fhzdl',
					width:100
				},{
					label:'今日发货中_预发货',
					prop:'fhzyfdl',
					width:100
				},{
					label:'24小时内(今日已发货)',
					prop:'24yfhdl',
					width:100
				},{
					label:'24小时内(今日未发货)',
					prop:'24wfhdl',
					width:100
				},{
					label:'24小时内(今日发货中)',
					prop:'24fhzdl',
					width:100
				},{
					label:'24小时内(今日发货中_预发货)',
					prop:'24fhzyfdl',
					width:100
				},{
					label:'超时订单(今日已发货)',
					prop:'99yfhdl',
					width:100
				},{
					label:'超时订单(今日未发货)',
					prop:'99wfhdl',
					width:100
				},{
					label:'超时订单(今日发货中)',
					prop:'99fhzdl',
					width:100
				},{
					label:'超时订单(今日发货中_预发货)',
					prop:'99fhzyfdl',
					width:100
				}],
				shop_table_setting:{},
				shopDataColumnObj:[{
					label:'事业部',
					prop:'dept_name',
					width:100
				},{
					label:'店铺名称',
					prop:'shop_name',
					width:100
				},{
					label:'未发货',
					prop:'wfhdl',
					width:100
				},{
					label:'今日已发货',
					prop:'yfhdl',
					width:100
				},{
					label:'今日发货中',
					prop:'fhzdl',
					width:100
				},{
					label:'今日发货中_预发货',
					prop:'fhzyfdl',
					width:100
				},{
					label:'24小时内(今日已发货)',
					prop:'24yfhdl',
					width:100
				},{
					label:'24小时内(今日未发货)',
					prop:'24wfhdl',
					width:100
				},{
					label:'24小时内(今日发货中)',
					prop:'24fhzdl',
					width:100
				},{
					label:'24小时内(今日发货中_预发货)',
					prop:'24fhzyfdl',
					width:100
				},{
					label:'超时订单(今日已发货)',
					prop:'99yfhdl',
					width:100
				},{
					label:'超时订单(今日未发货)',
					prop:'99wfhdl',
					width:100
				},{
					label:'超时订单(今日发货中)',
					prop:'99fhzdl',
					width:100
				},{
					label:'超时订单(今日发货中_预发货)',
					prop:'99fhzyfdl',
					width:100
				}],
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			deptChange(newWidth, oldWidth, column, event){
				let index = column.index;
				this.deptDataColumnObj[index].width = newWidth;
				let arr = [];
				this.deptDataColumnObj.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				let arg = {
					table_id:this.dept_table_setting.table_id,
					setting:arr.join(','),
				}
				if(this.dept_table_setting.id){
					arg.id = this.dept_table_setting.id;
				}
				//修改宽度
				this.changeWidth(arg)
			},
			shopChange(newWidth, oldWidth, column, event){
				let index = column.index;
				this.shopDataColumnObj[index].width = newWidth;
				let arr = [];
				this.shopDataColumnObj.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				let arg = {
					table_id:this.shop_table_setting.table_id,
					setting:arr.join(','),
				}
				if(this.shop_table_setting.id){
					arg.id = this.shop_table_setting.id;
				}
				//修改宽度
				this.changeWidth(arg)
			},
			//修改宽度
			changeWidth(arg){
				commonResource.tableSetting(arg).then(res => {
					if(res.data.code != 1){
						this.$message.warning(res.data.msg);
					}
				})
			},
			//事业部发货情况排序
			deptSortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.order_total_sort = column.prop + '-' + order;
				}else{
					this.order_total_sort = '';
				}
        		//采购总数
        		this.twoOrderTotalNum();
        	},
			//获取列表
			getData(){
				let arg = {
					day:this.day
				}
				this.loading = true;
				resource.deliverDewuTotal(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dept_data = res.data.data.dept_data;
						this.shop_data = res.data.data.shop_data;
						let dept_table_setting = res.data.data.table_setting.filter(item => {
							return item.table_sort == 1;
						});
						this.dept_table_setting = dept_table_setting[0];
						if(this.dept_table_setting.setting){
							let setting_arr = this.dept_table_setting.setting.split(',');
							setting_arr.map(item => {
								this.deptDataColumnObj.map(iii => {
									if(item.split('-')[0] == iii.prop){
										iii.width = item.split('-')[1]
									}
								})
							})
						}
						let shop_table_setting = res.data.data.table_setting.filter(item => {
							return item.table_sort == 2;
						});
						this.shop_table_setting = shop_table_setting[0];
						if(this.shop_table_setting.setting){
							let setting_arr = this.shop_table_setting.setting.split(',');
							setting_arr.map(item => {
								this.shopDataColumnObj.map(iii => {
									if(item.split('-')[0] == iii.prop){
										iii.width = item.split('-')[1]
									}
								})
							})
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>










