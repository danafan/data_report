<template>
	<div>
		<div class="top_setting">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="搜索：">
					<el-input v-model="req.search" placeholder="部门名称/员工编号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-button type="primary" size="small" @click="settingFun('1')">批量设置角色</el-button>
		</div>
		<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="user_id" label="编号" width="120" align="center"></el-table-column>
			<el-table-column prop="dept_name" label="所属部门" align="center"></el-table-column>
			<el-table-column prop="position" label="岗位名称" align="center"></el-table-column>
			<el-table-column prop="ding_user_name" label="姓名" align="center"></el-table-column>
			<el-table-column prop="menu_role_name" label="所属角色" align="center"></el-table-column>
			<el-table-column label="是否禁用" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.status == '0'?'是':'否'}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="data_role_name" label="数据权限" align="center"></el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="settingFun('2',scope.row.user_id)">设置</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.user_id)">查看</el-button>
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
		<el-form>
			<el-form-item label="角色权限">
				<el-select v-model="setting_req.menu_role_id" size="small" filterable placeholder="请选择">
					<el-option v-for="item in menu_list" :key="item.menu_role_id" :label="item.menu_role_name" :value="item.menu_role_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="数据权限">
				<el-select v-model="setting_req.data_role_id" size="small" filterable placeholder="请选择">
					<el-option v-for="item in data_list" :key="item.data_role_id" :label="item.data_role_name" :value="item.data_role_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否禁用">
				<el-switch v-model="setting_req.status" size="small" :active-value="1" :inactive-value="0" active-color="#5575EB"></el-switch>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="show_setting = false">取 消</el-button>
			<el-button type="primary" @click="submitSetting">确 定</el-button>
		</div>
	</el-dialog>
	<!-- 查看 -->
	<el-dialog title="成员详情" width="30%" :visible.sync="show_detail">
		<div class="detail_item">
			<div class="item_label">成员账号：</div>
			<div class="item_val">{{user_detail.ding_user_id}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">职务名称：</div>
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
			<div class="item_label">数据权限：</div>
			<div class="item_val">{{user_detail.data_role_name}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">所属部门：</div>
			<div class="item_val">{{user_detail.dept_name}}</div>
		</div>
		<div class="detail_item">
			<div class="item_label">是否禁用：</div>
			<div class="item_val">{{user_detail.status == '0'?'是':'否'}}</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="show_detail = false">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.top_setting{
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.detail_item{
	height: 30px;
	display:flex;
	align-items: center;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					search:"",
					pagesize:10,
					page:1
				},
				dataObj:{
					data:[{
						user_id: 2751,
						ding_user_id: "15361161941056565",
						ding_user_name: "王铮铭",
						position: "总经理助理&HRBP",
						menu_role_name: "测试角色",
						data_role_name: "测试角色",
						dept_name: "",
						is_self: 0
					},
					{
						user_id: 2794,
						ding_user_id: "15262575868677723",
						ding_user_name: "韩阳",
						position: "后端工程师（PHP）",
						menu_role_name: "测试角色",
						data_role_name: "测试角色",
						dept_name: "",
						is_self: 0
					},
					{
						user_id: 2743,
						ding_user_id: "15506312502266487",
						ding_user_name: "汪淑艳",
						position: "财务经理",
						menu_role_name: null,
						data_role_name: null,
						dept_name: "",
						is_self: 0
					}]
				},						//列表数据,
				select_user_ids:[],		//选中的用户id列表
				show_setting:false,		//设置弹框
				menu_list:[{
					menu_role_id: 1,
					menu_role_name: "测试角色1"
				},{
					menu_role_id: 2,
					menu_role_name: "测试角色2"
				},{
					menu_role_id: 3,
					menu_role_name: "测试角色3"
				}],						//访问权限列表
				data_list:[{
					data_role_id: 1,
					data_role_name: "数据权限1"
				},{
					data_role_id: 2,
					data_role_name: "数据权限2"
				},{
					data_role_id: 3,
					data_role_name: "数据权限3"
				}],
				setting_req:{
					menu_role_id:"",
					data_role_id:"",
					status:'0'
				},						//设置数据
				show_detail:false,		//成员详情
				user_detail:{},			//用户详情
			}
		},
		created(){
			//获取列表
			// this.userList();
		},
		methods:{
			//搜索
			search(){
				this.req.page = 1;
				//获取列表
				this.userList();
			},	
			//获取列表
			userList(){
				resource.userList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//切换选中
			handleSelectionChange(val) {
				this.select_user_ids = [];
				val.map(item => {
					this.select_user_ids.push(item.user_id)
				})
			},
			//设置
			settingFun(type,user_id){
				let setReq = {};
				if(type == '1'){		//单个设置
					setReq.id = user_id;
				}else{
					if(this.select_user_ids.length == 0){
						this.$message.warning("还没有选中的用户哦！");
						return;
					}else{
						setReq.id = this.select_user_ids.join(',');
					}
				}
				this.setting_req = {...setting_req,...setReq};
				resource.userSetGet(setReq).then(res => {
					if(res.data.code == 1){
						this.show_setting = true;
						this.setting_req = res.data.data.info;
						this.menu_list = res.data.data.menu_list;
						this.data_list = res.data.data.data_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交设置
			submitSetting(){
				if(this.setting_req.menu_role_id == ''){
					this.$message.warning('请选择访问权限');
				}else if(this.setting_req.data_role_id == ''){
					this.$message.warning('请选择数据权限');
				}else{
					resource.userSetPost(this.setting_req).then(res => {
						if(res.data.code == 1){
							this.show_setting = false;
							this.$message.success('设置成功！');
							//获取列表
							this.userList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//查看
			getDetail(user_id){
				resource.userInfo({id:user_id}).then(res => {
					if(res.data.code == 1){
						this.user_detail = res.data.data;
						this.show_detail = true;
					}else{
						this.$message.warning(res.data.msg);
					}
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