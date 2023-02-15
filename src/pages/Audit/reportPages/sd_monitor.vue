<template>
	<div>
		<div class="buts">
			<div class="title">店铺款式刷单情况</div>
		</div>
		<el-table size="small" :data="table_data.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column :prop="item.row_field_name" :label="item.row_name" align="center" :sortable="item.is_sort?'custom':false" v-for="item in title_list">
				<template slot-scope="scope">
					<el-image :z-index="2006" class="image" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.row_field_name == 'tp'"></el-image>
					<div v-else>{{scope.row[item.row_field_name]}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="table_data.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 5px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title{
		font-size: 14px;
		font-weight: bold;
	}
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				loading:false,
				page:1,
				pagesize:10,
				sort:"",
				title_list:[],
				table_data:{},
			}
		},
		created(){
			//获取列表（款式）
			this.getData();
		},
		methods:{
			//获取列表(款式)
			getData(){
				let arg = {
					sort:this.sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.storeSdReport(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.title_list = res.data.data.title_list;
						this.table_data = res.data.data.table_data;
						this.table_data.data.map(item => {
							let images = [];
							images.push(item.tp);
							item['images'] = images;
						})
						console.log(this.table_data)
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
			sortChange({ column, prop, order }) {  
				if(order){
					this.sort = prop + '-' + (order == 'ascending'?'1':'0');
				} else{
					this.sort = "";
				}   
				this.getData();
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










