<template>
	<div>
		<el-dialog title="档口配齐时间" :visible.sync="showDialog" @close="colseDialog('0')" :close-on-press-escape="false" :close-on-click-modal="false">
			<el-tabs v-model="activeTab" @tab-click="checkTab">
				<el-tab-pane label="待填档口配齐时间表" lazy name="0">
					<el-form :inline="true" size="small" class="demo-form-inline">
						<el-form-item label="预警日期：">
							<el-date-picker
							v-model="warning_time"
							type="date"
							value-format="yyyy-MM-dd"
							placeholder="选择日期"
							:append-to-body="false"
							>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="填报日期：" v-if="activeTab == '1'">
						<el-date-picker
						v-model="add_time"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期"
						:append-to-body="false"
						>
					</el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="getData('1')">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-table :data="data_list" size="small">
				<el-table-column width="120" fixed="left" align="center" prop="ksbm" label="款式"></el-table-column>
				<el-table-column width="120" align="center" label="供应商">
					<template slot-scope="scope">
						<el-input v-model="scope.row.gys" size="small" style='width: 100px' placeholder="供应商"></el-input>
					</template>
				</el-table-column>
				<el-table-column width="260" align="center" label="配齐时间">
					<template slot-scope="scope">
						<el-date-picker
						size="small"
						v-model="scope.row.match_time"
						type="date"
						value-format="yyyy-MM-dd"
						placeholder="选择日期"
						>
					</el-date-picker>
				</template>
			</el-table-column>
			<el-table-column align="center" prop="kc" label="库存"></el-table-column>
			<el-table-column align="center" prop="zts" label="在途数"></el-table-column>
			<el-table-column align="center" prop="qtxl" label="七天销量"></el-table-column>
			<el-table-column width="120" align="center" prop="warning_time" label="预警日期"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
			@size-change="pagesizeChange"
			@current-change="pageChange"
			:current-page="page"
			:pager-count="11"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="total"
			>
		</el-pagination>
	</div>
</el-tab-pane>
<el-tab-pane label="已填档口配齐时间表" lazy name="1">
	<el-form :inline="true" size="small" class="demo-form-inline">
		<el-form-item label="预警日期：">
			<el-date-picker
			v-model="warning_time"
			type="date"
			value-format="yyyy-MM-dd"
			placeholder="选择日期"
			:append-to-body="false"
			>
		</el-date-picker>
	</el-form-item>
	<el-form-item label="填报日期：">
		<el-date-picker
		v-model="add_time"
		type="date"
		value-format="yyyy-MM-dd"
		placeholder="选择日期"
		:append-to-body="false"
		>
	</el-date-picker>
</el-form-item>
<el-form-item>
	<el-button type="primary" size="small" @click="getData('1')">搜索</el-button>
</el-form-item>
</el-form>
<el-table :data="data_list" size="small">
	<el-table-column width="120" fixed="left" align="center" prop="ksbm" label="款式"></el-table-column>
	<el-table-column align="center" prop="gys" label="供应商">
	</el-table-column>
	<el-table-column width="120" align="center" prop="match_time" label="配齐时间">
	</el-table-column>
	<el-table-column align="center" prop="kc" label="库存"></el-table-column>
	<el-table-column align="center" prop="zts" label="在途数"></el-table-column>
	<el-table-column align="center" prop="qtxl" label="七天销量"></el-table-column>
	<el-table-column width="120" align="center" prop="warning_time" label="预警日期"></el-table-column>
	<el-table-column width="120" align="center" prop="add_time" label="填报日期"></el-table-column>
</el-table>
<div class="page">
	<el-pagination
	@size-change="pagesizeChange"
	@current-change="pageChange"
	:current-page="page"
	:pager-count="11"
	:page-sizes="[5, 10, 15, 20]"
	layout="total, sizes, prev, pager, next, jumper"
	:total="total"
	>
</el-pagination>
</div>
</el-tab-pane>

</el-tabs>
<span slot="footer" class="dialog-footer">
	<el-button size="small" @click="colseDialog('0')">取消</el-button>
	<el-button size="small" type="primary" @click="colseDialog('1')" v-if="activeTab == '0'">确 定</el-button>
</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				activeTab:"0",
				warning_time:"",
				add_time:"",
				page:1,
				pagesize:10,
				showDialog:true,
				data_list:[],
				total:0
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			// 切换
			checkTab(e){
				this.activeTab = e.name;
				this.warning_time = "";
				this.add_time = "";
				this.page = 1;
				this.pagesize = 10;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(type){
				let req = {
					status:this.activeTab,
					warning_time:!this.warning_time?'':this.warning_time,
					add_time:!this.add_time?'':this.add_time,
					page:type == '1'?1:this.page,
					pagesize:this.pagesize
				}
				resource.matchTime(req).then(res => {
					if(res.data.code == 1){
						let list = res.data.data.data;
						list.map(item => {
							if(!item.match_time){
								item.match_time = "";
							}
							if(!item.gys){
								item.gys = "";
							}
						});
						this.data_list = list;
						this.total = res.data.data.total;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//分页
			pagesizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			pageChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//提交
			colseDialog(type){	//1:提交；0:取消
				var req_list = [];
				this.data_list.map(item => {
					if(item.gys != '' && item.match_time != ''){
						let obj = {
							ksbm:item.ksbm,
							gys:item.gys,
							match_time:item.match_time
						}
						req_list.push(obj);
					}
				})
				if(type == '1' && req_list.length == 0){
					this.$message.warning('一个都还没有填写哦～');
				}else{
					this.$emit('callback',{req_list:JSON.stringify(req_list),type:type})
				}
			}
		}
	}
</script>











