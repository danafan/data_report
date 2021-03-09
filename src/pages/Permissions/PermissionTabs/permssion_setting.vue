<template>
	<div>
		<div class="top_setting">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="搜索：">
					<el-input style="width:300px" v-model="req.search" clearable placeholder="部门名称/员工工号/员工名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="search">搜索</el-button>
				</el-form-item>
			</el-form>
			<el-button type="primary" size="small" @click="settingFun('1')">批量设置角色</el-button>
		</div>
		<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="job_no" label="工号" width="120" align="center"></el-table-column>
			<el-table-column prop="dept_name" show-overflow-tooltip label="所属部门" align="center"></el-table-column>
			<el-table-column prop="position" show-overflow-tooltip label="岗位名称" align="center"></el-table-column>
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
					<el-button type="text" size="small" @click="settingFun('2',scope.row.user_id)" v-if="dataObj.button_list.setting == '1'">设置</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row.user_id)" v-if="dataObj.button_list.detail == '1'">查看</el-button>
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
			<el-form-item label="访问权限">
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
				<el-switch v-model="setting_req.status" size="small" :active-value="0" :inactive-value="1" active-color="#5575EB"></el-switch>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="show_setting = false">取 消</el-button>
			<el-button size="small" type="primary" @click="submitSetting">确 定</el-button>
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
				dataObj:{},				//列表数据,
				select_user_ids:[],		//选中的用户id列表
				show_setting:false,		//设置弹框
				menu_list:[],			//访问权限
				data_list:[],			//数据权限
				setting_req:{
					user_id:"",
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
			this.userList();
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
				var setReq = {};
				if(type == '2'){		//单个设置
					setReq.user_id = user_id;
				}else{
					if(this.select_user_ids.length == 0){
						this.$message.warning("还没有选中的用户哦！");
						return;
					}else{
						setReq.user_id = this.select_user_ids.join(',');
					}
				}
				resource.userSetGet(setReq).then(res => {
					if(res.data.code == 1){
						this.show_setting = true;
						if(type == '1'){		//批量设置
							this.setting_req = {
								data_role_id: 0,
								menu_role_id: 0,
								status: 1
							};
						}else{					//单个设置
							this.setting_req = res.data.data.info;
						}
						this.setting_req.user_id = setReq.user_id;
						let menu_obj = {
							menu_role_id: 0,
							menu_role_name: "默认权限"
						}
						let menu_list = res.data.data.menu_list;
						menu_list.unshift(menu_obj);
						this.menu_list = menu_list;
						let data_obj = {
							data_role_id: 0,
							data_role_name: "默认权限"
						}
						let data_list = res.data.data.data_list;
						data_list.unshift(data_obj);
						this.data_list = data_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交设置
			submitSetting(){
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
			},
			//查看
			getDetail(user_id){
				resource.userInfo({user_id:user_id}).then(res => {
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
				this.userList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.userList();
			},
		}
	}
</script>