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
		<el-table size="small" :data="dept_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="800">
			<el-table-column prop="dept_name" width="120" show-overflow-tooltip label="事业部" align="center"></el-table-column>
			<el-table-column prop="shop_name" width="120" show-overflow-tooltip label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="wfhdl" label="未发货" align="center"></el-table-column>
			<el-table-column prop="yfhdl" label="今日已发货" align="center"></el-table-column>
			<el-table-column prop="fhzdl" label="今日发货中" width="120" align="center">
			</el-table-column>
			<el-table-column prop="fhzyfdl" width="130" label="今日发货中_预发货" align="center">
			</el-table-column>
			<el-table-column prop="24yfhdl" width="190" label="24小时内(今日已发货)" align="center"></el-table-column>
			<el-table-column prop="24wfhdl" width="190" label="24小时内(今日未发货)" align="center"></el-table-column>
			<el-table-column prop="24fhzdl" width="190" label="24小时内(今日发货中)" align="center"></el-table-column>
			<el-table-column prop="24fhzyfdl" width="190" label="24小时内(今日发货中_预发货)" align="center"></el-table-column>
			<el-table-column prop="99yfhdl" width="140" label="超时订单(今日已发货)" align="center"></el-table-column>
			<el-table-column prop="99wfhdl" width="140" label="超时订单(今日未发货)" align="center"></el-table-column>
			<el-table-column prop="99fhzdl" width="140" label="超时订单(今日发货中)" align="center"></el-table-column>
			<el-table-column prop="99fhzyfdl" width="190" label="超时订单(今日发货中_预发货)" align="center"></el-table-column>
		</el-table>
		<div class="title">得物-店铺发货情况<span>&nbsp&nbsp&nbsp每小时(整点)更新一次</span></div>
		<el-table size="small" :data="shop_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="800">
			<el-table-column prop="dept_name" width="120" show-overflow-tooltip label="事业部" align="center"></el-table-column>
			<el-table-column prop="shop_name" width="120" show-overflow-tooltip label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="wfhdl" label="未发货" align="center"></el-table-column>
			<el-table-column prop="yfhdl" label="今日已发货" align="center"></el-table-column>
			<el-table-column prop="fhzdl" label="今日发货中" width="120" align="center">
			</el-table-column>
			<el-table-column prop="fhzyfdl" width="130" label="今日发货中_预发货" align="center">
			</el-table-column>
			<el-table-column prop="24yfhdl" width="190" label="24小时内(今日已发货)" align="center"></el-table-column>
			<el-table-column prop="24wfhdl" width="190" label="24小时内(今日未发货)" align="center"></el-table-column>
			<el-table-column prop="24fhzdl" width="190" label="24小时内(今日发货中)" align="center"></el-table-column>
			<el-table-column prop="24fhzyfdl" width="190" label="24小时内(今日发货中_预发货)" align="center"></el-table-column>
			<el-table-column prop="99yfhdl" width="140" label="超时订单(今日已发货)" align="center"></el-table-column>
			<el-table-column prop="99wfhdl" width="140" label="超时订单(今日未发货)" align="center"></el-table-column>
			<el-table-column prop="99fhzdl" width="140" label="超时订单(今日发货中)" align="center"></el-table-column>
			<el-table-column prop="99fhzyfdl" width="190" label="超时订单(今日发货中_预发货)" align="center"></el-table-column>
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
	export default{
		data(){
			return{
				day:getNowDate(),						//统计日期
				dept_data:[],				//部门数据
				shop_data:[],				//店铺数据
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//获取列表
			getData(){
				let arg = {
					day:this.day
				}
				resource.deliverDewuTotal(arg).then(res => {
					if(res.data.code == 1){
						this.dept_data = res.data.data.dept_data;
						this.shop_data = res.data.data.shop_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>










