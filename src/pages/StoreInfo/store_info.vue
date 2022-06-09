<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺名称：">
				<el-input clearable v-model="shop_name" placeholder="店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="店铺ID：">
				<el-input clearable v-model="shop_code" placeholder="店铺ID"></el-input>
			</el-form-item>
			<el-form-item label="聚水潭编号：">
				<el-input clearable v-model="jst_code" placeholder="聚水潭编号"></el-input>
			</el-form-item>
			<el-form-item label="项目部：">
				<el-input clearable v-model="dept_name" placeholder="项目部"></el-input>
			</el-form-item>
			<el-form-item label="二级部门：">
				<el-input clearable v-model="dept_2" placeholder="二级部门"></el-input>
			</el-form-item>
			<el-form-item label="T8编码：">
				<el-input clearable v-model="yy_t8_code" placeholder="T8编码"></el-input>
			</el-form-item>
			<el-form-item label="核算主体：">
				<el-input clearable v-model="company" placeholder="核算主体"></el-input>
			</el-form-item>
			<el-form-item label="平台：">
				<el-input clearable v-model="platform" placeholder="平台"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="dept_name" label="项目部" align="center"></el-table-column>
			<el-table-column prop="dept_2" label="二级部门" align="center"></el-table-column>
			<el-table-column prop="dept_3" label="三级部门" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="shop_name" label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="jst_code" label="聚水潭ID" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="shop_code" label="店铺ID" align="center"></el-table-column>
			<el-table-column prop="yy_t8_code" label="T8编码" align="center"></el-table-column>
			<el-table-column prop="yy_t6_code" label="T6编码" align="center"></el-table-column>
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
	export default{
		data(){
			return{
				page:1,
				pagesize:15,
				shop_name:"",		//店铺名称
				shop_code:"",		//店铺ID
				jst_code:"",		//聚水潭编号
				dept_name:"",
				dept_2:"",
				yy_t8_code:"",
				company:"",
				platform:"",
				dept_name:"",
				dataObj:{},			//返回数据
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){
				let arg = {
					shop_name:this.shop_name,
					shop_code:this.shop_code,
					jst_code:this.jst_code,		//聚水潭编号
					dept_name:this.dept_name,
					dept_2:this.dept_2,
					yy_t8_code:this.yy_t8_code,
					company:this.company,
					platform:this.platform,
					page:this.page,
					pagesize:this.pagesize,
				}
				resource.storeList(arg).then(res => {
					if(res.data.code == 1){
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
						shop_name:this.shop_name,
						shop_code:this.shop_code,
						jst_code:this.jst_code,		
						dept_name:this.dept_name,
						dept_2:this.dept_2,
						yy_t8_code:this.yy_t8_code,
						company:this.company,
						platform:this.platform,
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
		}
	}
</script>