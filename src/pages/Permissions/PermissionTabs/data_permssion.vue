<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="数据权限名称：">
				<el-input v-model="req.role_name" clearable placeholder="输入数据权限名称"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="search">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" size="small" @click="addRole" v-if="dataObj.button_list.add == '1'">添加</el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%;margin-top: 15px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="data_role_id" label="编号" width="120" align="center"></el-table-column>
			<el-table-column prop="data_role_name" label="数据权限名" align="center"></el-table-column>
			<el-table-column prop="dept_name" show-overflow-tooltip label="对应部门" align="center"></el-table-column>
			<el-table-column prop="shop_ids" show-overflow-tooltip label="对应店铺" align="center"></el-table-column>
			<el-table-column label="权限人数" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="roleUser(scope.row.data_role_id)" v-if="dataObj.button_list.view == '1'">{{scope.row.num}}</el-button>
					<span v-else>{{scope.row.num}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="创建人" align="center"></el-table-column>
			<el-table-column prop="update_time" label="更新时间" align="center"></el-table-column>
			<el-table-column prop="last_update_user_name" label="上次更新人姓名" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editFun(scope.row.data_role_id)" v-if="dataObj.button_list.edit == '1' && scope.row.is_disable == '0'">编辑</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.data_role_id)" v-if="dataObj.button_list.detail == '1' && scope.row.is_disable == '0'">查看</el-button>
					<el-button type="text" size="small" @click="deleteFun(scope.row.data_role_id)" v-if="dataObj.button_list.del == '1' && scope.row.is_disable == '0'">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
			:current-page="req.page"
			:pager-count="11"
			:page-sizes="[5, 10, 15, 20]"
			layout="total, sizes, prev, pager, next, jumper"
			:total="dataObj.total"
			>
		</el-pagination>
	</div>
	<el-dialog :title="`${role_type == '1'?'新增':'编辑'}权限`" :close-on-click-modal="false" @close="closeRoleDialog" width="50%" :visible.sync="show_role_dialog">
		<el-form label-position="left" label-width="116px">
			<el-form-item label="数据权限名称:" required>
				<el-input style="width:200px" type="text" placeholder="数据权限名称" size="small" v-model="name"></el-input>
			</el-form-item>
		</el-form>
		<el-radio-group class="mb-10" size="mini" v-model="permssion_type">
			<el-radio-button label="shop_list">店铺</el-radio-button>
			<el-radio-button label="dept_list">部门</el-radio-button>
		</el-radio-group>
		<!-- 店铺树 -->
		<div class="menu_list_box" v-show="permssion_type == 'shop_list'">
			<el-tree :data="shop_list" ref="shopTree" node-key="dept_id" :default-checked-keys="shop_ids" :props="props" show-checkbox @check="checkShopChange"></el-tree>
		</div>
		<!-- 部门树 -->
		<div class="menu_list_box"  v-show="permssion_type == 'dept_list'">
			<el-tree :data="dept_list" ref="tree" node-key="dept_id" :default-checked-keys="dept_ids" :props="props" show-checkbox @check="checkDeptChange"></el-tree>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="show_role_dialog = false" size="small">取 消</el-button>
			<el-button type="primary" @click="submitRole" size="small">确 定</el-button>
		</div>
	</el-dialog>
	<!-- 查看 -->
	<el-dialog title="角色详情" width="50%" :visible.sync="show_detail">
		<div class="detail_item">
			<div class="item_label">数据权限名：</div>
			<div class="item_val">{{menu_role_detail.data_role_name}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">权限人员：</div>
			<div class="item_val">{{menu_role_detail.num}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">创建时间：</div>
			<div class="item_val">{{menu_role_detail.create_time}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">创建人：</div>
			<div class="item_val">{{menu_role_detail.create_id}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">访问权限：</div>
			<div class="menu_list_box">
				<div class="menu_item" v-for="item in menu_role_detail.list">
					<el-tree :data="item" ref="tree" node-key="dept_id" default-expand-all :props="props"></el-tree>
				</div>
			</div>
		</div>
		
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="show_detail = false">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
	.buts{
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.menu_list_box{
		flex:1;
		display: flex;
		flex-wrap: wrap;
		.menu_item{
			width:50%;
		}
	}
	.detail_item{
		margin-bottom: 10px;
		display:flex;
		align-items: flex-start;
		.item_label{
			width:90px;
		}
	}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					page:1,
					pagesize:10,
					role_name:""
				},
				dataObj:{button_list:{
					add: 1,
					del: 1,
					detail: 1,
					edit: 1
				}},		  //数据
				permssion_type:'shop_list',			//角色类型
				shop_list:[],						//店铺列表
				shop_ids:[],						//选中的店铺列表
				dept_list:[],						//部门列表
				dept_ids:[],						//选中的部门列表
				props:{
					label: 'dept_name',
					children: 'list'
				},
				show_role_dialog:false,				//是否显示新增或编辑角色
				role_dialog_title:"",				//新增或者编辑角色弹框标题
				name:"",							//角色名称
				role_type:'1',						//提交类型（1:添加；2:编辑）
				role_id:"",							//选中的角色id
				show_detail:false,					//角色详情弹框
				menu_role_detail:{},				//角色详情
				loading:false
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//搜索
			search(){
				this.req.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				this.loading = true;
				resource.dataRoleList(this.req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//清除已选的列表
			clearList(){
				this.shop_ids = [];					//删除已选中的店铺列表
				this.dept_ids = [];					//删除已选中的部门列表
			},
			//监听关闭弹窗
			closeRoleDialog(){
				this.name = "";
				this.permssion_type = 'shop_list';
				//清除已选的列表
				this.clearList();
			},
			//新增角色
			addRole(){
				resource.addDataRoleGet().then(res => {
					if(res.data.code == 1){
						this.role_type = '1';
						let data = res.data.data;
						let shop_list = data.shop_list;
						let dept_list = data.dept_list;
						//设置当前展示的列表
						this.setCurrentList(shop_list,dept_list);
						this.show_role_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			editFun(role_id){
				resource.editDataRoleGet({role_id:role_id}).then(res => {
					if(res.data.code == 1){
						this.role_type = '2';
						let data = res.data.data;
						let shop_list = data.shop_list;
						let dept_list = data.dept_list;
						//设置当前展示的列表
						this.setCurrentList(shop_list,dept_list);
						this.shop_ids = data.shop_ids;
						this.dept_ids = data.dept_ids;

						this.name = data.role_name;	//角色名称
						this.role_id = role_id;
						this.show_role_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//设置当前展示的列表
			setCurrentList(shop_list,dept_list){
				this.shop_list = [];
				shop_list.map(item => {
					this.shop_list.push(item[0]);
				})
				this.dept_list = [];
				dept_list.map(item => {
					this.dept_list.push(item[0]);
				})
				//清除已选的列表
				this.clearList();
			},
			//查看
			getDetail(role_id){
				resource.dataRoleInfo({role_id:role_id}).then(res => {
					if(res.data.code == 1){
						this.show_detail = true;
						this.menu_role_detail = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//删除
			deleteFun(role_id){
				this.$confirm('确认删除该权限?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delDataRole({role_id:role_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消删除'
					});          
				});
			},
			//点击某个店铺选项
			checkShopChange() {
				const resourceArr = this.$refs.shopTree.getCheckedNodes().filter(item => {
					return !item.list
				})
      			this.shop_ids = resourceArr.map(vls => { //此处为接口需要数据格式
      				return vls.dept_id;
      			})
      		},
			//点击某个部门选项
      		checkDeptChange(data, checked) {
      			this.dept_ids = checked.checkedKeys;
      		},
			//提交添加或编辑
      		submitRole(){
      			if(this.name == ''){
      				this.$message.warning('请输入数据权限名称!');
      				return;
      			}else if(this.name.length > 20){
      				this.$message.warning('权限名称不能超过20个字!');
      				return;
      			}
      			let req = {
      				name:this.name,
      				shop_ids:this.shop_ids.join(','),
      				dept_ids:this.dept_ids.join(',')
      			}
				if(this.role_type == '1'){	//添加
					resource.addDataRolePost(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.show_role_dialog = false;
							this.req.page = 1;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}else{						//编辑
					req.role_id = this.role_id;
					resource.editDataRolePost(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.show_role_dialog = false;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}
			},
			//查看用户列表
			roleUser(data_role_id){
				this.$store.commit('checkPerTab','data_permssion');
				this.$router.push(`/data_role_user?role_id=${data_role_id}`);
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getData();
			},
		}
	}
</script>