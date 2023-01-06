<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="gysmc" clearable filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys">
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商等级：">
				<el-select v-model="gys_level" multiple clearable placeholder="请选择供应商等级">
					<el-option label="S" value="S"></el-option>
					<el-option label="A" value="A"></el-option>
					<el-option label="B" value="B"></el-option>
					<el-option label="C" value="C"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker v-model="date" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_title_row">
			<div class="title">供应商销量排名</div>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="600px" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" v-loading="loading">
			<el-table-column prop="gys" show-overflow-tooltip label="供应商" align="center">
				<template slot-scope="scope">
					<el-popover placement="right" trigger="click" @hide="list_page = 1">
						<el-table size="small" :data="account_data" max-height="550">
							<el-table-column prop="phone" width="120" align="center" show-overflow-tooltip label="手机号"></el-table-column>
							<el-table-column prop="add_user_name" width="120" align="center" show-overflow-tooltip label="添加人"></el-table-column>
							<el-table-column prop="add_time" width="160" align="center" label="添加时间">
							</el-table-column>
							<el-table-column label="操作" width="120" align="center">
								<template slot-scope="sss">
									<el-button type="text" size="small" @click="accountDel(sss.row.account_id)" v-if="button_list.del_account == 1">删除</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="page">
							<el-pagination @size-change="listSizeChange" @current-change="listPageChange" :current-page="list_page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="list_total">
							</el-pagination>
						</div>
						<el-button type="text" size="small" slot="reference" @click="getAccount(scope.row.gys)" v-if="button_list.view_account_list == 1">{{scope.row.gys}}</el-button>
					</el-popover>
					<div v-if="button_list.view_account_list == 0">{{scope.row.gys}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="kssl" sortable='custom' label="款式数量" align="center"></el-table-column>
			<el-table-column prop="xssl" sortable='custom' label="30天销量" align="center"></el-table-column>
			<el-table-column prop="cgcb" sortable='custom' show-overflow-tooltip label="采购金额" align="center"></el-table-column>
			<el-table-column prop="cgcb_rank" sortable='custom' show-overflow-tooltip width="120" label="销售成本排行" align="center"></el-table-column>
			<el-table-column prop="mlv" sortable='custom' show-overflow-tooltip label="毛利率" align="center"></el-table-column>
			<el-table-column prop="mlv_rank" sortable='custom' show-overflow-tooltip label="毛利率排名" align="center"></el-table-column>
			<el-table-column prop="stl" sortable='custom' show-overflow-tooltip label="实退率" align="center"></el-table-column>
			<el-table-column prop="stl_rank" sortable='custom' show-overflow-tooltip label="实退率排名" align="center"></el-table-column>
			<el-table-column prop="dhl" sortable='custom' show-overflow-tooltip label="到货率" align="center"></el-table-column>
			<el-table-column prop="dhl_rank" sortable='custom' show-overflow-tooltip label="到货率排名" align="center"></el-table-column>
			<el-table-column prop="pbh_dhl" label="30天到货率(排除备货)" align="center" width="170" sortable="custom" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gys_level" label="供应商系统评级" show-overflow-tooltip align="center" width="100"></el-table-column>
			<el-table-column prop="gys_level_sj" label="供应商实际评级" show-overflow-tooltip align="center" width="100"></el-table-column>
			<el-table-column prop="settlement_method" show-overflow-tooltip label="结算方式" align="center"></el-table-column>
			<el-table-column label="操作" width="120" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="addFn(scope.row.gys)" v-if="scope.row.is_core == 1 && button_list.add_account == 1">添加</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<el-dialog title="添加用户" width="30%" @close="closeDialog" :visible.sync="add_dialog">
			<el-form size="small">
				<el-form-item label="供应商">
					<div>{{gys}}</div>
				</el-form-item>
				<el-form-item label="手机号">
					<el-input style="width: 200px" type="number" v-model="phone" placeholder="请输入手机号"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="add_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="confirmAdd">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import operResource from '../../../api/operationResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				gys_list:[],						//供应商
				gysmc:"",							//选中的供应商
				gys_level:[],						//选中的供应商等级
				date:"",							//日期
				page:1,
				pagesize:10,						//销量页码
				sort_field:"",
				sort_type:"",					//销量排序
				dataObj:{},						//销量数据
				button_list:{},
				loading:false,
				add_dialog:false,				//添加手机号弹窗
				gys:"",							//点击的供应商
				phone:"",						//输入的手机号
				list_page:1,
				list_pagesize:10,
				account_data:[],				//账号列表
				list_total:0,
			}
		},
		created(){
			//平台列表
			this.ajaxPlat();
			//供应商销量
			this.getGysSalenum();
		},
		methods:{
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//平台列表
			ajaxPlat(){
				resource.ajaxPlat().then(res => {
					if(res.data.code == 1){
						this.plat_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			searchFn(){
				this.page = 1;
				//供应商销量
				this.getGysSalenum();
			},
			//供应商销量
			getGysSalenum(){
				let arg = {
					date:this.date?this.date:'',
					gys:this.gysmc,
					gys_level:this.gys_level.join(','),
					sort_field:this.sort_field,
					sort_type:this.sort_type,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				operResource.getGysSalenum(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商销量排序
			sortChange(column){
				this.sort_field = column.prop;
				this.sort_type = !column.order?'':column.order == 'ascending'?'0':'1';
				this.getGysSalenum();
			},
			//供应商销量分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getGysSalenum();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getGysSalenum();
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date:this.date?this.date:'',
						gys:this.gysmc,
						gys_level:this.gys_level.join(','),
						sort_field:this.sort_field,
						sort_type:this.sort_type,
					}
					operResource.gysSalenumExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商销量排行');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//关闭添加用户弹窗
			closeDialog(){
				this.phone = "";
			},
			//点击添加
			addFn(gys){
				this.gys = gys;
				this.add_dialog = true;
			},
			//确认添加
			confirmAdd(){
				if(!this.judgmentPhone.test(this.phone)){
					this.$message.warning("请输入正确的手机号");
				}else{
					let arg = {
						supplier_name:this.gys,
						phone:this.phone
					}
					operResource.accountAdd(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.add_dialog = false;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//查看账号列表
			getAccount(gys){
				this.gys = gys;
				let arg = {
					page:this.list_page,
					pagesize:this.list_pagesize,
					supplier_name:gys
				}
				operResource.accountList(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.account_data = data.data;
						this.list_total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//账号分页
			listSizeChange(val) {
				this.list_pagesize = val;
				//获取列表
				this.getAccount(this.gys);
			},
			listPageChange(val) {
				this.list_page = val;
				//获取列表
				this.getAccount(this.gys);
			},
			//删除账号
			accountDel(account_id){
				this.$confirm('确认删除账号?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					operResource.accountDel({account_id:account_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});

			}
		}
	}
</script>
<style lang="less" scoped>
.table_title_row{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.title{
		font-size: 14px;
		color:#333333;
		font-weight: bold;
	}
}
</style>