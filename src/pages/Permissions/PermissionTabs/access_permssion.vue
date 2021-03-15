<template>
	<div>
		<el-button type="primary" size="small" @click="addRole" v-if="dataObj.button_list.add == '1'">添加</el-button>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%;margin-top: 15px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="menu_role_id" label="编号" width="120" align="center"></el-table-column>
			<el-table-column prop="menu_role_name" label="角色名称" align="center"></el-table-column>
			<el-table-column label="角色人员" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="roleUser(scope.row.menu_role_id)" v-if="dataObj.button_list.view == '1'">{{scope.row.num}}</el-button>
					<span v-else>{{scope.row.num}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="remark" show-overflow-tooltip label="角色备注" align="center"></el-table-column>
			<el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="创建人" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editFun(scope.row.menu_role_id)" v-if="dataObj.button_list.edit == '1'">编辑</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.menu_role_id)" v-if="dataObj.button_list.detail == '1'">查看</el-button>
					<el-button type="text" size="small" @click="deleteFun(scope.row.menu_role_id)" v-if="dataObj.button_list.del == '1'">删除</el-button>
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
	<el-dialog :title="`${role_type == '1'?'新增':'编辑'}角色`" width="50%" @close="closeRoleDialog" :close-on-click-modal="false" :visible.sync="show_role_dialog">
		<el-form label-position="left" label-width="86px">
			<el-form-item label="角色名称:" required>
				<el-input style="width:200px" type="text" placeholder="输入角色名称" size="small" v-model="name"></el-input>
			</el-form-item>
			<el-form-item label="备注:" required>
				<el-input style="width:220px" type="textarea" :rows="3" placeholder="输入备注..." size="small" v-model="remark">
				</el-input>
			</el-form-item>
			<el-form-item label="访问权限:">
				<div class="menu_list_box">
					<div class="menu_item" v-for="item in menu_list">
						<el-tree :data="item" ref="tree" node-key="menu_id" :default-checked-keys="checked_keys" :props="props" show-checkbox @check="checkChange"></el-tree>
					</div>
				</div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="show_role_dialog = false" size="small">取 消</el-button>
			<el-button type="primary" @click="submitRole" size="small">确 定</el-button>
		</div>
	</el-dialog>
	<!-- 查看 -->
	<el-dialog title="角色详情" width="50%" :visible.sync="show_detail">
		<div class="detail_item">
			<div class="item_label">角色名称：</div>
			<div class="item_val">{{menu_role_detail.menu_role_name}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">角色人员：</div>
			<div class="item_val">{{menu_role_detail.num}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">角色备注：</div>
			<div class="item_val">{{menu_role_detail.remark}}</div>
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
					<el-tree :data="item" ref="tree" node-key="menu_id" :props="props"></el-tree>
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
.detail_item{
	margin-bottom: 10px;
	display:flex;
	align-items: flex-start;
	.item_label{
		width:80px;
	}
}
.menu_list_box{
	flex:1;
	display: flex;
	flex-wrap: wrap;
	.menu_item{
		width:50%;
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
					pagesize:10
				},
				dataObj:{button_list:{
					add: 1,
					del: 1,
					detail: 1,
					edit: 1
				},
				data:[{
					menu_role_id: 1,
					menu_role_name: "测试角色",
					create_time: 0,
					remark: "备注。。。。",
					ding_user_name: "韩阳",
					num: 1
				}]},
				menu_list:[],						//功能列表（角色用）
				props:{
					label: 'menu_name',
					children: 'list'
				},
				show_role_dialog:false,				//是否显示新增或编辑角色
				role_dialog_title:"",				//新增或者编辑角色弹框标题
				checked_keys:[],					//已选中的功能id集合
				name:"",							//角色名称
				remark:"",							//备注
				role_type:'1',						//提交类型（1:添加；2:编辑）
				role_id:"",							//选中的角色id
				show_detail:false,					//角色详情弹框
				menu_role_detail:{},				//角色详情
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//获取列表
			getData(){
				resource.menuRoleList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭新增或者编辑
			closeRoleDialog(){
				this.checked_keys = [];					//已选中的功能id集合
				this.name = "";							//角色名称
				this.remark = "";						//备注
			},
			//新增角色
			addRole(){
				resource.addMenuRoleGet().then(res => {
					if(res.data.code == 1){
						this.menu_list = res.data.data;
						this.role_type = '1';
						this.show_role_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑
			editFun(role_id){
				resource.editMenuRoleGet({role_id:role_id}).then(res => {
					if(res.data.code == 1){
						this.menu_list = res.data.data.menu_list;
						this.checked_keys = res.data.data.selected_ids;
						this.name = res.data.data.menu_role_name;		//角色名称
						this.remark = res.data.data.remark;				//备注
						this.role_id = role_id;
						this.role_type = '2';
						this.show_role_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看
			getDetail(role_id){
				resource.menuRoleInfo({role_id:role_id}).then(res => {
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
				this.$confirm('确认删除该角色?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.menuRoleDel({role_id:role_id}).then(res => {
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
			//点击某个功能选项
			checkChange(data, checked) {
				let tree_list = this.$refs.tree;
				let arr = [];
				tree_list.map(item => {
					arr = [...arr,...item.getCheckedKeys()];
				})
				this.checked_keys = arr;
			},
			//提交添加或编辑
			submitRole(){
				if(this.name == ''){
					this.$message.warning('请输入角色名称!');
					return;
				}else if(this.name.length > 20){
					this.$message.warning('角色名称不能超过20个字!');
					return;
				}else if(this.remark == ''){
					this.$message.warning('请输入备注!');
					return;
				}
				let req = {
					name:this.name,
					ids:this.checked_keys.join(','),
					remark:this.remark
				}
				if(this.role_type == '1'){	//添加
					resource.addMenuRolePost(req).then(res => {
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
				}else{
					req.role_id = this.role_id;
					resource.editMenuRolePost(req).then(res => {
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
			roleUser(menu_role_id){
				this.$store.commit('checkPerTab','access_permssion');
				this.$router.push('/role_user?role_id=' + menu_role_id);
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