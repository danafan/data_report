<template>
	<div>
		<dps from="1" @callBack="checkReq"></dps>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="聚水潭编号：">
				<el-input clearable v-model="jst_code" placeholder="聚水潭编号"></el-input>
			</el-form-item>
			<el-form-item label="T8编码：">
				<el-input clearable v-model="yy_t8_code" placeholder="T8编码"></el-input>
			</el-form-item>
			<el-form-item label="核算主体：">
				<el-input clearable v-model="company" placeholder="核算主体"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="dept_name" label="项目部" align="center"></el-table-column>
			<el-table-column prop="dept_2" label="二级部门" align="center"></el-table-column>
			<el-table-column prop="dept_3" label="三级部门" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="shop_name" label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="jst_code" label="聚水潭ID" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="shop_code" label="店铺ID" align="center"></el-table-column>
			<el-table-column prop="yy_t8_code" label="T8编码" align="center"></el-table-column>
			<el-table-column prop="yy_t6_code" label="店铺编码" align="center"></el-table-column>
			<el-table-column prop="company" label="核算主体" align="center"></el-table-column>
			<el-table-column prop="platform" label="平台" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
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
	import resource from '../../api/storeResource.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import dps from '../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				select_department_ids:[],	//选中的项目部列表
				select_plat_ids:[],			//选中的平台列表
				select_store_ids:[],		//选中的店铺列表
				page:1,
				pagesize:15,
				jst_code:"",		//聚水潭编号
				yy_t8_code:"",
				company:"",
				dept_name:"",
				dataObj:{},			//返回数据
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){
				let arg = {
					jst_code:this.jst_code,		//聚水潭编号
					yy_t8_code:this.yy_t8_code,
					dept_id:this.select_department_ids.join(','),
					platform:this.select_plat_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					company:this.company,
					page:this.page,
					pagesize:this.pagesize,
				}
				this.loading = true;
				resource.storeList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						jst_code:this.jst_code,		
						yy_t8_code:this.yy_t8_code,
						company:this.company,
						dept_id:this.select_department_ids.join(','),
						platform:this.select_plat_ids.join(','),
						shop_id:this.select_store_ids.join(','),
					}
					resource.shopExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'店铺列表');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
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
			},
		},
		components:{
			dps
		}
	}
</script>