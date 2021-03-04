<template>
	<div>
		<div class="breadcrumb">
			<el-button type="primary" size="small" icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
			<div class="breadcrumb_name">访问权限 / 角色人员列表</div>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="index" label="序号" width="120" align="center"></el-table-column>
			<el-table-column prop="job_no" label="工号" width="120" align="center"></el-table-column>
			<el-table-column prop="dept_name" show-overflow-tooltip label="所属部门" align="center"></el-table-column>
			<el-table-column prop="position" show-overflow-tooltip label="岗位名称" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="姓名" align="center"></el-table-column><el-table-column prop="menu_role_name" label="所属角色" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="settingFun(scope.row.user_id)">设置</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.user_id)">查看</el-button>
					<el-button type="text" size="small" @click="deleteFun(scope.row.user_id)">删除</el-button>
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
	<!-- 设置 -->
	<el-dialog title="设置" width="30%" :visible.sync="show_setting">
		<el-form label-width="80px" size="small">
			<el-form-item label="姓名：">
				<el-input v-model="ding_user_name" disabled></el-input>
			</el-form-item>
			<el-form-item label="有效期">
				<el-radio-group v-model="set_time_id">
					<el-radio label="-1">永久有效</el-radio>
					<el-radio label="1">制定有效期至</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item v-if="set_time_id == '1'">
				<el-date-picker
				v-model="over_time"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="截止日期">
			</el-date-picker>
		</el-form-item>
	</el-form>
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="show_setting = false">取 消</el-button>
		<el-button size="small" type="primary" @click="submitSetting">确 定</el-button>
	</div>
</el-dialog>
<!-- 查看 -->
<el-dialog title="用户信息" width="30%" :visible.sync="show_detail">
	<div class="detail_item">
		<div class="item_label">编号：</div>
		<div class="item_val">{{user_detail.ding_user_id}}</div>
	</div>
	<div class="detail_item">
		<div class="item_label">所属部门：</div>
		<div class="item_val">{{user_detail.dept_name}}</div>
	</div>
	<div class="detail_item">
		<div class="item_label">岗位名称：</div>
		<div class="item_val">{{user_detail.position}}</div>
	</div>
	<div class="detail_item">
		<div class="item_label">姓名：</div>
		<div class="item_val">{{user_detail.ding_user_name}}</div>
	</div>
	<div class="detail_item">
		<div class="item_label">所属角色：</div>
		<div class="item_val">{{user_detail.menu_role_name}}</div>
	</div>
	<div class="detail_item">
		<div class="item_label">有效期：</div>
		<div class="item_val">{{user_detail.menu_role_time}}</div>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button type="primary" size="small" @click="show_detail = false">确 定</el-button>
	</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.breadcrumb{
	margin-bottom: 15px;
	display:flex;
	align-items: center;
	.breadcrumb_name{
		margin-left: 10px;
		font-size: 14px;
	}
}
.detail_item{
	margin-bottom: 10px;
	display:flex;
	align-items: flex-start;
	.item_label{
		width:80px;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					role_id:"",
					pagesize:10,
					page:1
				},
				dataObj:{},				//列表数据
				user_id:"",				//选择的用户id
				show_setting:false,		//设置弹框
				ding_user_name:"",		//姓名
				set_time_id:'-1',		//单选框组
				over_time:"",			//截止日期
				show_detail:false,		//用户详情弹框
				user_detail:{},			//用户详情
			}
		},
		created(){
			this.req.role_id = this.$route.query.role_id;
			//获取列表
			this.userList();
		},
		methods:{
			//获取列表
			userList(){
				resource.menuRoleUsers(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//设置
			settingFun(user_id){
				this.user_id = user_id;
				resource.menuRoleSettingGet({user_id:this.user_id}).then(res => {
					if(res.data.code == 1){
						this.show_setting = true;
						this.ding_user_name = res.data.data.ding_user_name;
						this.set_time_id = res.data.data.menu_role_time == '-1'?'-1':'1';
						this.over_time = res.data.data.menu_role_time == '-1'?'':res.data.data.menu_role_time;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交设置
			submitSetting(){
				if(this.set_time_id != '-1' && this.over_time == ''){
					this.$message.warning("请选择截止日期");
					return;
				}
				let settingReq = {
					user_id:this.user_id,
					timeout:this.set_time_id == '-1'?'-1':this.over_time
				}
				resource.menuRoleSettingPost(settingReq).then(res => {
					if(res.data.code == 1){
						this.show_setting = false;
						this.$message.success('设置成功！');
						//获取列表
						this.userList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看
			getDetail(user_id){
				resource.menuRoleUsrInfo({user_id:user_id}).then(res => {
					if(res.data.code == 1){
						this.user_detail = res.data.data;
						this.show_detail = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//删除
			deleteFun(user_id){
				this.$confirm('确认删除该用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let req = {
						user_id:user_id,
						role_id:this.req.role_id
					}
					resource.moveUser(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.userList();
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