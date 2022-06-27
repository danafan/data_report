<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table ref="multipleTable" size="small" :data="dataObj.list.data" tooltip-effect="dark" style="width: 100%">
			<el-table-column :prop="item.field" :label="item.name" align="center" v-for="item in dataObj.title" show-overflow-tooltip>
				<template slot-scope="scope">
					<div >{{scope.row[item.field]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.list.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/auditResource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				plat_list:[],			//平台列表
				select_plat_ids:"",		//选中的平台列表
				dataObj:{},				//返回数据
			}
		},
		created(){
			//平台列表
			this.ajaxPlatform();
		},
		methods:{
			//平台列表
			ajaxPlatform(){
				resource.ajaxPlatform().then(res => {
					if(res.data.code == 1){
						this.plat_list = res.data.data;
						this.select_plat_ids = this.plat_list[0];
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			getList(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					platform:this.select_plat_ids,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.platformBalanceData(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
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










