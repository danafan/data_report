<template>
	<div>
		<el-dialog title="转内供款式表" :visible.sync="showDialog" @close="closeZng" :close-on-press-escape="false" :close-on-click-modal="false">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="预警日期：">
					<el-date-picker v-model="warning_time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false" >
					</el-date-picker>
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
				<el-table-column align="center" prop="day_num" label="缺货天数"></el-table-column>
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
				showDialog:true,
				warning_time:"",
				page:1,
				page_size:10,
				data_list:[],
				total:0
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//获取列表
			getData(){
				let req = {
					warning_time:this.warning_time,
					page:this.page,
					page_size:this.page_size
				}
				resource.zngList(req).then(res => {
					if(res.data.code == 1){
						this.data_list = res.data.data.data;
						this.total = res.data.data.total;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//分页
			pagesizeChange(val) {
				this.page_size = val;
				//获取列表
				this.getData();
			},
			pageChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//关闭
			closeZng(){
				this.$emit('callback');
			}
		}
	}
</script>











