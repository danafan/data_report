<template>
	<div>
		<el-input placeholder="请输入表单名或表单管理员名" style="width:280px" size="small"  clearable v-model="name">
			<el-button slot="append" size="small" icon="el-icon-search" @click="searchData"></el-button>
		</el-input>
		<div class="buts">
			<el-checkbox true-label="1" false-label="0" v-model="is_self" @change="searchData">仅查看我创建的</el-checkbox>
			<el-button type="primary" icon="el-icon-plus" size="small" @click="createFormFun" v-if="dataObj.button_list.add_form == 1">创建表单</el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="form_name" label="表单名" align="center"></el-table-column>
			<el-table-column label="发布状态" align="center">
				<template slot-scope="scope">
					<div class="status">
						<div class="status_icon_green" :class="{'status_icon_red':scope.row.status == '0'}"></div>
						<div class="status_text">{{scope.row.status == '1'?'收集中':'已停止'}}</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="num" label="数据条数" align="center"></el-table-column>
			<el-table-column prop="admin_names" label="表单管理员" align="center"></el-table-column>
			<el-table-column prop="creator_name" label="创建人" align="center"></el-table-column>
			<el-table-column prop="add_time" label="创建时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="$router.push(`/data_management?id=${scope.row.id}&form_name=${scope.row.form_name}`)">数据管理</el-button>
					<el-tooltip class="item" effect="dark" placement="bottom-start">
						<div slot="content">
							<div>
								<el-button type="text" size="small" @click="editForm(scope.row.id)" v-if="scope.row.user_type == '1' || scope.row.user_type == '2'">编辑</el-button></br>
							</div>
							<div v-if="scope.row.user_type == '1'">
								<el-button type="text" size="small" @click="copyFormFun(scope.row.id)">复制表单</el-button></br>
							</div>
							<el-button type="text" size="small" @click="delForm(scope.row.id)" v-if="scope.row.user_type == '1'">删除</el-button>
						</div>
						<el-button type="text" size="small">更多<i class="el-icon-caret-bottom"></i></el-button>
					</el-tooltip>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 创建/编辑表单 -->
		<el-dialog :title="`${dialog_type == '1'?'创建':(dialog_type == '2'?'编辑':'复制')}表单`" @close="closeDialog" :close-on-click-modal="false" :visible.sync="formDialog">
			<el-form size="small" class="demo-form-inline">
				<el-form-item label="表单名称：">
					<el-input style="width:220px" clearable v-model="form_name" placeholder="请输入表单名称"></el-input>
				</el-form-item>
				<el-form-item label="数据库对应表名称：">
					<el-input style="width:220px" clearable v-model="table_name" placeholder="请输入数据库对应表名称" disabled></el-input>
				</el-form-item>
				<el-form-item label="数据填报人：" v-if="dialog_type != '3'">
					<el-select v-model="selected_users" clearable :popper-append-to-body="false" multiple filterable placeholder="选择数据填报人" style="width:280px">
						<el-option v-for="item in user_data" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="表单管理人：" v-if="dialog_type != '3'">
					<el-select v-model="selected_admins" clearable :popper-append-to-body="false" multiple filterable placeholder="选择表单管理人" style="width:280px">
						<el-option v-for="item in user_data" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="表单状态：" v-if="dialog_type != '3'">
					<el-radio-group v-model="status">
						<el-radio :label="1">收集中</el-radio>
						<el-radio :label="0">已停止</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item>
					<div class="structure_content">
						<div>表单结构：</div>
						<div class="structure_list">
							<draggable v-model="structure_list">
								<transition-group>
									<div class="row_item" v-for="(item,index) in structure_list" :key="index">
										<el-button class="delete" type="danger" icon="el-icon-minus" circle @click="deleteItem(index)" v-if="structure_list.length > 1"></el-button>
										<el-card shadow="hover">
											<div class="label">
												<div class="num">Q{{index + 1}}：</div>
												<el-input v-model="item.title" placeholder="字段名称"></el-input>
											</div>
											<div class="type">类型：
												<el-select v-model="item.type" :popper-append-to-body="false" :disabled="item.is_old">
													<el-option v-for="i in type_list" :key="i.type" :label="i.name" :value="i.type">
													</el-option>
												</el-select>
											</div>
										</el-card>
										<el-tooltip class="add_icon item" effect="dark" placement="right-start" v-if="dialog_type != '3'">
											<div slot="content">
												<el-button type="text" size="small" @click="addItem(index,'up')">上插入</el-button></br>
												<el-button type="text" size="small" @click="addItem(index,'down')">下插入</el-button>
											</div>
											<el-button icon="el-icon-plus" circle></el-button>
										</el-tooltip>
									</div>
								</transition-group>
							</draggable>
						</div>
					</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="formDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="dealFun">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang='less' scoped>
.buts{
	margin-top: 15px;
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.status{
	display:flex;
	align-items: center;
	justify-content: center;
	.status_icon_green{
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background:green;
	}
	.status_icon_red{
		background:red;
	}
	.status_text{
		margin-left: 10px;
	}
}
.structure_content{
	display:flex;
	.structure_list{
		flex:1;
		height: 500px;
		overflow-y: scroll;
		.row_item{
			margin-bottom: 5px;
			font-size: 12px;
			display:flex;
			align-items: center;
			.delete{
				width: 6px;
				height: 6px;
				margin-right: 10px;
				display:flex;
				align-items: center;
				justify-content: center;
			}
			.label{
				display:flex;
				align-items: center;
				.num{
					width: 48px;
				}
			}
			.add_icon{
				margin-left: 10px;
			}
		}
	}	
}
</style>
<script>
	import resource from '../../../api/formDataResource.js'
	import draggable from 'vuedraggable'
	export default{
		data(){
			return{
				name:"",			//名称
				is_self:'0',		//是否仅查看我创建的
				page:1,
				pagesize:10,
				dataObj:{
					button_list:{}
				},				//返回数据
				dialog_type:'1',
				formDialog:false,		//创建或编辑表单弹窗是否显示
				form_name:"",			//表单名称
				table_name:"",			//数据库对应表名称
				user_data:[],			//所有用户列表
				selected_users:[],		//选中的数据填报人列表
				selected_admins:[],		//选中的表单管理人列表
				status:1,
				type_list:[{
					name:'文本',
					type:'text'
				},{
					name:'数字',
					type:'number'
				},{
					name:'时间',
					type:'date'
				}],						//类型列表
				structure_list:[{
					title:'',
					type:'text'
				}],						//结构列表
				form_id:"",				//点击的表单id
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//搜索
			searchData(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					is_self:this.is_self,
					name:this.name,
					page:this.page,
					pagesize:this.pagesize
				}
				resource.formList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//点击创建表单
			createFormFun(){
				this.formDialog = true;
				this.table_name = this.getFormName();
				this.dialog_type = '1';
				//获取钉钉用户列表
				this.ajaxUser();
			},
			//点击编辑表单
			editForm(id){
				this.dialog_type = '2';
				this.form_id = id;
				resource.ajaxUser({from:'14'}).then(res => {
					if(res.data.code == 1){
						this.user_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				}).then(() => {
					//获取表单详情
					this.getFormDetail(id);
				});
			},
			//获取表单详情
			getFormDetail(id){
				resource.formEditGet({form_id:id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.form_name = data.form_name;
						this.table_name = data.form_table_name;
						this.status = data.status;
						let selected_users = data.selected_users;
						selected_users.map(item => {
							this.user_data.map(i => {
								if(item == i.ding_user_id){
									this.selected_users.push(item);
								}
							})
						})
						let selected_admins = data.selected_admins;
						selected_admins.map(item => {
							this.user_data.map(i => {
								if(item == i.ding_user_id){
									this.selected_admins.push(item);
								}
							})
						})
						let structure_list = data.fields;
						structure_list.map(item => {
							item.is_old = true;
						});
						this.structure_list = structure_list;
						this.formDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取钉钉用户列表
			ajaxUser(){
				resource.ajaxUser({from:'14'}).then(res => {
					if(res.data.code == 1){
						this.user_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//点击复制表单
			copyFormFun(id){
				this.dialog_type = '3';
				resource.copyForm({form_id:id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.form_name = data.form_name;
						this.table_name = this.getFormName();
						let structure_list = data.fields;
						structure_list.map(item => {
							item.is_old = true;
						});
						this.structure_list = structure_list;
						this.formDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//组装数据库对应表名称
			getFormName(){
				var now = new Date(); 				//当前日期  
				var nowYear = now.getYear(); 		//当前年 
				nowYear += (nowYear < 2000) ? 1900 : 0;
				var nowMonth = now.getMonth(); 		//当前月 
				nowMonth += 1;
				var nowDay = now.getDate(); 		//当前日 
				var nowHours = now.getHours();
				nowHours = nowHours < 10?`0${nowHours}`:nowHours;
				var nowMinutes = now.getMinutes();
				nowMinutes = nowMinutes < 10?`0${nowMinutes}`:nowMinutes;
				var nowSeconds = now.getSeconds();
				nowSeconds = nowSeconds < 10?`0${nowSeconds}`:nowSeconds;
				return `deer_${nowYear}${nowMonth}${nowDay}${nowHours}${nowMinutes}${nowSeconds}`
			},
			//关闭弹窗
			closeDialog(){
				this.form_name = "";			//表单名称
				this.table_name = "";			//数据库对应表名称
				this.selected_users = [];
				this.selected_admins = [];
				this.structure_list = [{
					title:'',
					type:'text'
				}];
			},
			//插入字段
			addItem(index,type){
				var item = {
					title:'',
					type:'text'
				}
				if(type == 'up'){
					this.structure_list.splice(index,0,item);
				}else{
					this.structure_list.splice(index + 1,0,item);
				}
			},
			//删除字段
			deleteItem(index){
				this.structure_list.splice(index,1);
			},
			//提交前判断
			dealFun(){
				//空判断
				if(this.form_name == ""){
					this.$message.warning('请输入表单名称');
					return;
				}else if(this.table_name == ""){
					this.$message.warning('请输入数据库对应表名称');
					return;
				}
				//判断是否有未填写的字段名
				for(let i = 0;i < this.structure_list.length;i ++){
					if(this.structure_list[i].title == ""){
						this.$message.warning('表结构有未完成信息！');
						return;
					}
					if(this.structure_list[i].title.indexOf('_') > 1){
						this.$message.warning('表结构标题不能包含下划线！');
						return;
					}
				}
				//判断是否有重复字段
				const names = this.structure_list.map(value=>value.title);
				const namesSet = new Set(names);
				if(namesSet.size != names.length){
					this.$message.warning('表结构有重复字段名！');
					return;
				}
				//处理字段
				var structure_list = [];
				this.structure_list.map(item => {
					var str = "";
					if(this.dialog_type == '1' || this.dialog_type == '3'){ //创建/复制
						str = item.type + '_' + item.title;
					}else if(this.dialog_type == '2'){ //编辑
						str = item.type + '_' + item.title + '_' + (item.column_name?item.column_name:'0');
					}
					
					structure_list.push(str);
				});
				var arg = {
					form_name:this.form_name,
					table_name:this.table_name,
					structure:structure_list.join(','),
				};
				if(this.dialog_type == '1'){	
					//创建
					this.createForm(arg);
				}else if(this.dialog_type == '2'){	
					//编辑
					this.editFormFun(arg);
				}else if(this.dialog_type == '3'){	
					//复制
					this.copyForm(arg);
				}
			},
			//创建
			createForm(arg){
				arg.selected_users = this.selected_users.join(',');
				arg.selected_admins = this.selected_admins.join(',');
				arg.status = this.status;
				resource.formAdd(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.formDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//编辑
			editFormFun(arg){
				arg.selected_users = this.selected_users.join(',');
				arg.selected_admins = this.selected_admins.join(',');
				arg.status = this.status;
				arg.form_id = this.form_id;
				resource.formEditPost(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.formDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//复制
			copyForm(arg){
				resource.formAdd(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.formDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//删除表单
			delForm(id){
				this.$confirm('确认删除该表单?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.formDel({form_id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});          
				});
			}
		},
		components: {
			draggable
		},
	}
</script>