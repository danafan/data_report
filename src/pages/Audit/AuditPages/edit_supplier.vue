<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item>
				<el-input style="width: 200px" v-model="keyword" clearable placeholder="档口号/结算档口号/收款账号"></el-input>
			</el-form-item>
			<el-form-item label="审核状态：">
				<el-select v-model="status" clearable placeholder="全部">
					<el-option label="待审核" :value="1"></el-option>
					<el-option label="同意" :value="2"></el-option>
					<el-option label="拒绝" :value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="修改内容：">
				<el-select v-model="edit_flag" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in flag_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="table_data" size="small" style="width:100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}"  :cell-style="{'text-align':'center'}" v-loading="loading">
			<el-table-column :label="item.title" :prop="item.field_name" v-for="item in title_list" show-overflow-tooltip :render-header="renderHeader">
				<template slot-scope="scope">
					<div v-if="scope.row[item.field_name].constructor === Array">
						<div :class="{'old_color':index == 1}" v-for="(item,index) in scope.row[item.field_name]">{{item}}</div>
					</div>
					<div v-else>{{scope.row[item.field_name]}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="140" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" v-if="scope.row.status_sign == 1" @click="auditFn(2,scope.row.id)">同意</el-button>
					<el-button type="text" size="small" v-if="scope.row.status_sign == 1" @click="auditFn(3,scope.row.id)">拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				keyword:"",						//搜索关键字
				status:1,						//状态
				flag_list:[],					//修改列表
				edit_flag:[],					//选中的修改列表
				page:1,
				pagesize:10,
				title_list:[],					//表头数据
				table_data:[],					//表格数据
				total:0,
				loading:false,
			}
		},
		created(){
			//修改列表
			this.editFlagList();
			//获取列表
			this.getList();
		},
		methods:{
			//顶部悬浮
			renderHeader(h, data) {
				return h("span", [
					h(
						"el-tooltip",
						{
							attrs: {
								class: "item",
								effect: "dark",
								content: data.column.label,
								placement: "top",
							},
						},
						[h("span", data.column.label)]
						),
					]);
			},
			//修改列表
			editFlagList(){
				resource.editFlagList().then(res => {
					if(res.data.code == 1){
						this.flag_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){
				let arg = {
					keyword:this.keyword,
					status:this.status,
					edit_flag:this.edit_flag.reduce( (sum,current,index)=>{
						return sum + current
					} , 0),
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.editIndex(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//审核
			auditFn(status,id){
				this.$confirm(`确认${status == 2?'同意':'拒绝'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						status:status,
						id:id
					}
					resource.supplierCheck(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			}
			
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-top: 15px;
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.old_color{
	color:red;
}
</style>