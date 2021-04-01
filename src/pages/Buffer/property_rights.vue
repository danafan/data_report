<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式：">
				<el-select v-model="ks" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入款式"
				:remote-method="ajaxKsbm"
				 collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="建议货品性质：">
				<el-select v-model="jyhpxz" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in hpxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="实际货品性质：">
				<el-select v-model="sjhpxz" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in hpxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList('1')">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column align="center" property="ksbm" label="款式"></el-table-column>
			<el-table-column align="center" property="gyshh" label="供应商货号"></el-table-column>
			<el-table-column align="center" property="mc" label="品类"></el-table-column>
			<el-table-column align="center" property="sjhpxz" label="实际货品性质"></el-table-column>
			<el-table-column align="center" property="jyhpxz" label="建议货品性质"></el-table-column>
			<el-table-column align="center" property="sjxrrq" label="建议日期"></el-table-column>
			<el-table-column label="操作" align="center" width="180" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="setKs('1','试',scope.row.ksbm)">试</el-button>
					<el-button type="text" size="small" @click="setKs('2','补',scope.row.ksbm)">补</el-button>
					<el-button type="text" size="small" @click="setKs('3','停',scope.row.ksbm)">停</el-button>
					<el-button type="text" size="small" @click="setKs('4','清',scope.row.ksbm)">停</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="page"
			:pager-count="11"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="dataObj.total"
			>
		</el-pagination>
	</div>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				ks_list:[],								//产品编码
				ks:[],
				jyhpxz:"",
				sjhpxz:"",
				hpxz_list:['试','补','停','清'],			//货品性质
				dataObj:{},								//列表数据
			}
		},
		created(){
			//获取列表
			this.getList('1');
		},
		methods:{
			//获取列表
			getList(type){		//type:1(搜索);2:设置
				let req = {
					ks:this.ks.join(','),
					jyhpxz:this.jyhpxz,
					sjhpxz:this.sjhpxz,
					pagesize:this.pagesize,
					page:type == '1'?1:this.page
				}
				resource.hpxzList(req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						this.show_custom = false;
						if(type == '2'){
							this.$message.success(res.data.msg);
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//产品编码
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//设置
			setKs(type,title,ksbm){
				//1:试；2:补；3:停；4:清
				this.$confirm(`货品性质确定转为${title}么？想好哦！`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(type == '1'){
						resource.hpxzTry({ks:ksbm}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '2'){
						resource.hpxzReplenish({ks:ksbm}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '3'){
						resource.hpxzStop({ks:ksbm}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '4'){
						resource.hpxzClear({ks:ksbm}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
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
			}
		}
	}
</script>