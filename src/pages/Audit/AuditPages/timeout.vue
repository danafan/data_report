<template>
	<div>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="exportTable" v-if="button_list.export == 1">全部导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column type="index" label="序号" align="center" fixed="left"></el-table-column>
			<el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" align="center"></el-table-column>
			<el-table-column prop="kjs_shop_name" label="店铺" align="center"></el-table-column>
			<el-table-column prop="platform" label="平台" width="120" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="是否特批" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_special == '0'?'否':scope.row.is_special == '1'?'是':''}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="batch_price" label="批发价" width="120" align="center">
			</el-table-column>
			<el-table-column prop="cb_price" label="成本价" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {exportUp} from '../../../api/export.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				dataObj:{},
				button_list:{},
				loading:false
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//全部导出
			exportTable(){
				exportUp(`audit/overtime_export`);
			},
			//获取列表
			getData(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.overTimeTable(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			}
		}
	}
</script>










