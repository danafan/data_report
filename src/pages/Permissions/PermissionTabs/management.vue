<template>
	<div>
		<el-button type="primary" size="small" @click="addAccess" v-if="dataObj.button_list.add == '1'">添加</el-button>
		<el-table :data="dataObj.data" size="small" border style="width: 100%;margin-top: 15px" align="center" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column width="150" prop="access_name" label="名称" align="center">
			</el-table-column>
			<el-table-column width="150" prop="menu_name" label="所属分组" align="center">
			</el-table-column>
			<el-table-column prop="access_codes" label="权限码" align="center">
			</el-table-column>
			<el-table-column width="150" label="操作" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="edior(scope.row.id)" v-if="dataObj.button_list.edit == '1'">编辑</el-button>
					<el-button type="text" size="small" @click="deleteIs(scope.row.id)" v-if="dataObj.button_list.del == '1'">删除</el-button>
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
	<el-dialog :title="`${dislogType == 1?'添加':'编辑'}权限`" center width="50%" @close="closeAccessDialog" :visible.sync="showDialog" :close-on-click-modal="false">
		<el-form size="small" label-width="150px">
			<el-form-item label="权限资源名称：">
				<el-input v-model="accessReq.access_name" style='width: 300px;' placeholder="请输入权限资源名称"></el-input>
			</el-form-item>
			<el-form-item label="所属菜单：">
				<el-cascader
				v-model="accessReq.menu_id"
				:show-all-levels="false"
				:options="menuList"
				:props="props"
				@change="changeMenu"
				></el-cascader>
			</el-form-item>
			<el-form-item label="添加权限码：">
				<el-select v-model="selController" placeholder="请选择">
					<el-option v-for="item in controller" :key="item" :label="item" :value="item">
					</el-option>
				</el-select> / 
				<el-select v-model="selMethod" placeholder="请选择">
					<el-option v-for="item in methodList" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
				<el-button style="margin-left: 20px" type="success" icon="el-icon-plus" circle @click="addAccessCode"></el-button>
				<div style="margin-top: 10px;">
					<el-tag style="margin-right: 20px;margin-bottom: 10px" closable v-for="(item,index) in accessCodes" :key="index" type="success" effect="dark" @close="handleClose(index)"> {{ item }}
					</el-tag>
				</div>
			</el-form-item>
			<el-form-item label="是否按钮：">
				<el-switch
				v-model="accessReq.is_button"
				:active-value="1"
				:inactive-value="0"
				active-color="#13ce66"
				inactive-color="#ff4949">
			</el-switch>
		</el-form-item>
		<el-form-item label="按钮名称：" v-if="accessReq.is_button == '1'">
			<el-input v-model="accessReq.button_name" style='width: 300px;' placeholder="请输入按钮名称"></el-input>
		</el-form-item>
		<el-form-item label="选择按钮："  v-if="accessReq.is_button == '0'">
			<el-checkbox-group v-model="button_access_ids">
				<el-checkbox :label="item.id" :key="item.id" border v-for="item in access_buts">{{item.access_name}}</el-checkbox>
			</el-checkbox-group>
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="showDialog = false">取消</el-button>
		<el-button size="small" type="primary" @click="submit">确 定</el-button>
	</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				dataObj:{button_list:{
					add: 1,
					del: 1,
					edit: 1
				}},				//列表
				menuList: [],			//所属菜单数据格式
				props:{
					expandTrigger: 'hover',
					emitPath:false,
					label:'menu_name',
					value:'menu_id',
					children:'list'
				},
				controller:[],			//所有控制器列表
				methodList:[],			//控制器下所有方法
				access_buts:[],			//权限按钮列表
				req:{
					page:1,
					pagesize:10
				},
				accessReq:{
					access_name:"",
					menu_id:"",
					access_codes:"",
					is_button:'0',
					button_name:"",
					button_access_ids:''
				},						//添加或编辑权限的请求参数
				button_access_ids:[],
				dislogType:"1",			//添加权限
				showDialog:false,		//默认弹框不显示
				selController:"",		//当前选择的控制器名称
				selMethod:"",			//当前选择的方法名称
				accessCodes:[],			//选中的所有权限吗列表
				id:"",
				loading:false
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		watch:{
			selController:function(n,o){
				if(n != o && n != ''){
					//获取所有控制器列表
					this.getMethod();
					this.selMethod = "";
				}
			}
		},
		methods:{
			//获取列表
			getList(){
				this.loading = true;
				resource.accessList(this.req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//添加
			addAccess(){
				this.dislogType = "1";
				this.showDialog = true;
				//获取所有菜单列表
				this.getMenu();
				//获取所有控制器列表
				this.getControllers();
			},
			//关闭弹框
			closeAccessDialog(){
				this.accessReq = {
					access_name:"",
					menu_id:"",
					access_codes:"",
					is_button:'0',
					button_name:"",
					button_access_ids:''
				};
				this.selController = "";		//当前选择的控制器名称
				this.selMethod = "";			//当前选择的方法名称
				this.accessCodes = [];
				this.button_access_ids = [];
			},
			//获取所有菜单列表
			getMenu(){
				resource.getMainMenus().then(res => {
					if(res.data.code == 1){
						this.menuList = res.data.data.menu_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切花选中的菜单
			changeMenu(e){
		 		//选择按钮的列表
		 		this.ajaxAccess(e);
		 	},
			//获取所有控制器列表
			getControllers(){
				resource.getControllers().then(res => {
					if(res.data.code == 1){
						this.controller = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取所有控制器下面的方法列表
			getMethod(){
				resource.getMethods({controller_name:this.selController}).then(res => {
					if(res.data.code == 1){
						this.methodList = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//选择按钮的列表
			ajaxAccess(menu_id){
				resource.ajaxAccess({menu_id}).then(res => {
					if(res.data.code == 1){
						this.access_buts = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getList();
			},
			//点击某一个关闭
			handleClose(index){
				this.accessCodes.splice(index,1);
			},
			//点击编辑
			edior(id){
				this.id = id;
				this.dislogType = "2";
				//获取所有菜单列表
				this.getMenu();
				//获取所有控制器列表
				this.getControllers();
				resource.getAccessInfo({id:id}).then(res => {
					if(res.data.code == 1){
						this.showDialog = true;
						this.accessReq.access_name = res.data.data.access_name;
						this.accessReq.menu_id = res.data.data.menu_id;
						this.accessCodes = res.data.data.access_codes;
						this.selController = "";		//当前选择的控制器名称
						this.selMethod = "";			//当前选择的方法名称
						this.accessReq.is_button = res.data.data.is_button;	//是否按钮
						this.accessReq.button_name = res.data.data.button_name;
						this.button_access_ids = res.data.data.button_access_ids.split(',');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除
			deleteIs(id){
				this.$confirm('确认删除该权限?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delAccess({id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getList()
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
			},
			//点击弹框的添加权限码
			addAccessCode(){
				if(this.selController == "" || this.selMethod == ""){
					this.$message.warning("请完善当前权限码");
				}else{
					let str = this.selController + "/" + this.selMethod;
					for(var i = 0;i < this.accessCodes.length;i ++){
						if(this.accessCodes[i] == str){
							this.$message.warning('已存在该权限码');
							return;
						}
					}
					this.accessCodes.push(str);
				}
			},
			//点击弹框的确定
			submit(){
				if(this.accessReq.access_name == ''){
					this.$message.warning("请输入权限资源名称");
				}else if(this.accessReq.menu_id == ''){
					this.$message.warning("请选择所属菜单");
				}else if(this.accessReq.is_button == '1' && this.accessReq.button_name == ''){
					this.$message.warning("请输入按钮名称");
				}else{
					if(this.accessCodes.length == 0){
						if(this.selController == "" || this.selMethod == ""){
							this.$message.warning("请选择权限码");
							return;
						}else{
							let str = this.selController + "/" + this.selMethod;
							this.accessCodes.push(str);
						}
					}
					this.accessReq.access_codes = JSON.stringify(this.accessCodes);
					this.accessReq.button_access_ids = this.button_access_ids.join(',');
					if(this.dislogType == "1"){
						resource.addAccess(this.accessReq).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList()
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{
						this.accessReq.id = this.id;
						resource.editAccess(this.accessReq).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.showDialog = false;
								//获取列表
								this.getList()
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}
			}

			
		}
	}
</script>