<template>
	<div>
		<el-button type="primary" size="small" @click="addRole">新增角色</el-button>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%;margin-top: 15px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="menu_role_id" label="编号" width="120" align="center"></el-table-column>
			<el-table-column prop="menu_role_name" label="角色名称" align="center"></el-table-column>
			<el-table-column prop="num" label="角色人员" align="center"></el-table-column>
			<el-table-column prop="remark" label="角色备注" align="center"></el-table-column>
			<el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="创建人" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="editFun(scope.row.menu_role_id)">编辑</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.menu_role_id)">查看</el-button>
					<el-button type="text" size="small" @click="deleteFun(scope.row.menu_role_id)">删除</el-button>
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
	<el-dialog :title="`${role_type == '1'?'新增':'编辑'}角色`" width="36%" :visible.sync="show_role_dialog">
		<el-form label-position="left" label-width="86px">
			<el-form-item label="角色名称:" required>
				<el-input type="text" placeholder="输入角色名称" size="small" v-model="name"></el-input>
			</el-form-item>
			<el-form-item label="备注:" required>
				<el-input type="textarea" :rows="5" placeholder="输入备注..." size="small" v-model="remark">
				</el-input>
			</el-form-item>
		</el-form>
		<div class="menu_list_box">
			<div class="menu_item" v-for="item in menu_list">
				<el-tree :data="item" ref="tree" node-key="menu_id" :default-checked-keys="checked_keys" default-expand-all :props="props" show-checkbox @check="checkChange"></el-tree>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button @click="show_role_dialog = false" size="small">取 消</el-button>
			<el-button type="primary" @click="submitRole" size="small">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.menu_list_box{
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
				dataObj:{data:[{
					menu_role_id: 1,
					menu_role_name: "测试角色",
					create_time: 0,
					remark: "备注。。。。",
					ding_user_name: "韩阳",
					num: 1
				}]},
				menu_list:[
				[{
					menu_name: "系统管理",
					menu_id: 1,
					list: [
					{
						menu_name: "权限管理",
						menu_id: 3,
						list: [{
							menu_name: "权限配置",
							menu_id: 6
						},{
							menu_name: "访问权限",
							menu_id: 7
						},{
							menu_name: "数据权限",
							menu_id: 8
						}]
					}]
				}],[{
					menu_name: "访问权限",
					menu_id: 2,
					list: [
					{
						menu_name: "功能列表",
						menu_id: 4,
						list: [{
							menu_name: "功能-1",
							menu_id: 9
						},{
							menu_name: "功能-2",
							menu_id: 10
						}]
					},
					{
						menu_name: "报表字段",
						menu_id: 5,
						list: [{
							menu_name: "字段-1",
							menu_id: 11
						},{
							menu_name: "字段-2",
							menu_id: 12
						}]
					}]
				}]],								//功能列表（角色用）
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
			}
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
			//新增角色
			addRole(){
				this.role_type = '1';
				this.checked_keys = [];					//已选中的功能id集合
				this.name = "";							//角色名称
				this.remark = "";							//备注
				this.show_role_dialog = true;
			},
			//点击编辑
			editFun(role_id){
				this.role_id = role_id;
				this.role_type = '2';
				this.show_role_dialog = true;
			},
			//查看
			getDetail(role_id){
				this.role_id = role_id;
				
			},
			//删除
			deleteFun(role_id){
				this.role_id = role_id;
				
			},
			//点击某个功能选项
			checkChange(data, checked) {
				let tree_list = this.$refs.tree;
				let arr = [];
				tree_list.map(item => {
					arr = [...arr,...item.getCheckedKeys()];
				})
				console.log(arr)
			},
			//提交添加或编辑
			submitRole(){
				if(this.name == ''){
					this.$message.warning('请输入角色名称!');
					return;
				}else if(this.remark == ''){
					this.$message.warning('请输入备注!');
					return;
				}
				let req = {
					name:this.name,
					menu_ids:this.checked_keys.join(','),
					remark:this.remark
				}
				if(this.role_type == '1'){	//添加
					resource.addMenuRole(req).then(res => {
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
					resource.editMenuRole(req).then(res => {
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