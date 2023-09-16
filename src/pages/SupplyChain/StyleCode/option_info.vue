<template>
	<div>
		<div class="flex ac">
			<el-tabs style="margin-right: 10px;" size="small" v-model="type" type="card">
				<el-tab-pane :label="`${item.label}代码`" :name="item.id" v-for="item in type_list"></el-tab-pane>
			</el-tabs>
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item>
					<el-input style="width: 192px;" v-model="name" clearable placeholder="请输入搜索内容"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div class="buts">
			<el-button type="primary" size="small" @click="addInfo" v-if="button_list.add == 1">添加<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="setting_list"fieldName="setting_id" :table_data="table_data" :title_list="title_list" @deleteFn="deleteInfo" @editFn="editInfo" :is_custom_sort="false" :is_setting="true" :button_list="button_list" @sortCallBack="sortCallBack" max_height="630px"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handleCurrentChange"/>
		<!-- 添加/编辑弹窗 -->
		<el-dialog title="配置资料" @close="closeDialog" width="30%" :visible.sync="show_dialog">
			<el-form size="small">
				<el-form-item :label="`${type_name}代码：`" required>
					<el-input style="width: 192px;" v-model="code" clearable :placeholder="`请输入${type_name}代码`"></el-input>
				</el-form-item>
				<el-form-item label="代码含义：" required>
					<el-input style="width: 192px;" v-model="code_value" clearable placeholder="请输入代码含义"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="show_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="commitFn">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script type="text/javascript">
	import demandResource from '../../../api/demandResource.js'
	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	export default{	
		data(){
			return{
				type:"1",				//列表类型
				type_name:"",
				type_list:[{
					label:'品牌',
					id:'1'
				},{
					label:'品类',
					id:'2'
				},{
					label:'颜色',
					id:'3'
				},{
					label:'尺码',
					id:'4'
				}],
				name:"",				//搜索名称
				loading:false,
				page:1,
				pagesize:10,
				table_sort:"",
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,
				button_list:{},
				show_dialog:false,
				dialog_type:'1',							//1:添加；2:编辑
				setting_id:"",
				code:"",									//代码
				code_value:"",								//代码含义
			}
		},
		watch:{
			//监听切换页面
			type:function(n,o){
				let current_item = this.type_list.filter(item => {
					return item.id == n;
				})
				this.type_name = current_item[0].label;
				this.page = 1;
				this.pagesize = 10;
				//获取列表
				this.getData();
			}
		},
		created(){
			this.type_name = this.type_list[0].label;
			//获取列表
			this.getData();
		},
		methods:{
			//获取列表
			getData(){
				let arg = {
					name:this.name,
					type:this.type,
					sort:this.table_sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.settingList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
						this.button_list = data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序回调
			sortCallBack(sort){
				this.table_sort = sort;
				//获取列表
				this.getData();
			},
			//点击添加
			addInfo(){
				this.dialog_type = '1';
				this.show_dialog = true;
			},
			//点击编辑
			editInfo(setting_id){
				let infos = this.table_data.map(item => {
					console.log(setting_id)
					return item.setting_id == setting_id;
				})

				let info = this.table_data.filter(item => {
					console.log(setting_id)
					return item.setting_id == setting_id;
				})
				this.code = info[0].code;						//代码
				this.code_value = info[0].code_value;			//代码含义
				this.setting_id = setting_id;
				this.dialog_type = '2';
				this.show_dialog = true;
			},
			//关闭添加/编辑弹窗
			closeDialog(){
				this.code = "";									//代码
				this.code_value = "";								//代码含义
			},
			//添加/编辑保存	
			commitFn(){
				if(this.code == ''){
					this.$message.warning(`请输入${this.type_name}代码!`);
				}else if(this.code_value == ''){
					this.$message.warning(`请输入${this.type_name}代码含义!`);
				}else{
					this.$confirm(`确定使用【${this.code_value}】为【${this.code}】的代码吗?`, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let arg = {
							type:this.type,
							setting_code:this.code,
							code_value:this.code_value
						}
						if(this.dialog_type == '1'){	//添加
							demandResource.addSetting(arg).then(res => {
								if(res.data.code == 1){
									this.show_dialog = false;
									this.$message.success(res.data.msg);
									//获取列表
									this.getData();
								}else{
									this.$message.warning(res.data.msg);
								}
							})
						}else{							//编辑
							let new_arg = JSON.parse(JSON.stringify(arg));
							new_arg['setting_id'] = this.setting_id;
							demandResource.editSetting(new_arg).then(res => {
								if(res.data.code == 1){
									this.show_dialog = false;
									this.$message.success(res.data.msg);
									//获取列表
									this.getData();
								}else{
									this.$message.warning(res.data.msg);
								}
							})
						}
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});          
					});
				}
			},
			//删除
			deleteInfo(setting_id){
				this.$confirm('确认删除该资料?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						setting_id:setting_id
					}
					demandResource.delSetting(arg).then(res => {
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
						message: '已取消'
					});          
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
		},
		components:{
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>
	.buts{
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>