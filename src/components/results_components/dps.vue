<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部:" style="margin-right: 20px" v-if="show_dept">
				<el-cascader
				ref="cascader"
				:options="dept_list"
				:props="props"
				@change="getIds"
				filterable
				collapse-tags
				reserve-keyword
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" clearable @change="getStoreList" multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-select v-model="select_store_key" class="input_key">
					<el-option label="店铺名称" :value="1">
					</el-option>
					<el-option label="店铺ID" :value="2">
					</el-option>
				</el-select>：
				<el-select popper-class="custom_select" v-model="select_store_ids" clearable multiple filterable :filter-method="filterMethod" collapse-tags reserve-keyword placeholder="全部">
					<div class="all_select flex ac jse absolute">
						<el-checkbox v-model="all_selected" @change="changeSelected">全选</el-checkbox>
					</div>
					<el-option v-for="item in options" :key="item.dept_id" :label="select_store_key == 1?item.shop_name:item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
	</div>
</template>
<style>
	.input_key{
		width: 100px!important;
	}
	.input_key input{
		border:none!important;
	}
	.custom_select .el-scrollbar{
		position: relative;
		padding-top: 34px;
	}
	.custom_select .all_select{
		top:0;
		left: 0;
		width: 100%;
		height: 34px;
		padding-left: 20px;
		padding-right: 20px;
	}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return {
				dept_list: [],						//部门列表	
				select_department_ids:[],			//选中的部门id列表
				plat_list:[],						//平台列表
				select_plat_ids:[],					//选中的平台列表
				select_store_key:1,					//店铺的key值
				store_list: [],						//店铺列表	
				options:[],							//展示的店铺列表
				select_store_ids:[],				//选中的店铺id列表
				props:{
					multiple:true,
					value:'dept_id',
					label:'dept_name',
					children:'list',
				},
				all_selected:false
			}
		},
		props:{
			show_dept:{
				type:Boolean,
			default:true
			},
			from:{
				type:String,
			default:''
			}
		},
		created(){
			//部门列表
			this.AjaxViewDept();
			//平台列表
			this.ajaxPlat();
			// 获取所有店铺
			this.getStoreList()
		},
		watch:{
			//项目部
			select_department_ids:function(){
				this.emitCallBack();
			},
			// 平台
			select_plat_ids:function(){
				this.emitCallBack();
			},
			//店铺
			select_store_ids:function(){
				this.emitCallBack();
			},
			select_store_key:function(){
				this.select_store_ids = [];
			},
		},
		methods:{
			filterMethod(query){
				if (query !== "") {
					this.options = this.store_list.filter((item) => {
          				// 这里是用的value选项筛选，默认是label
          				if(this.select_store_key == 1){
          					return item.shop_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
          				}else{
          					return item.dept_name.toLowerCase().indexOf(query.toLowerCase()) > -1;
          				}
					});
					this.all_selected = false;
				} else {
					this.options = [];
				}
			},
			getIds(){
				this.$nextTick(()=>{
					var arr = [];
					let select_department = this.$refs.cascader.getCheckedNodes({leafOnly:true});
					select_department.map(s => {
					if(s.parent){	//最后一层有父级
						var m = s.parent;
						if(m.checked){ //倒数第二层被全选了
							if(m.parent){ //倒数第二层有父级
								var d = m.parent;
								if(d.checked){ //倒数第三层被全选了
									if(arr.indexOf(d.value) == -1){
										arr.push(d.value);
									}
								}else{
									if(arr.indexOf(m.value) == -1){
										arr.push(m.value);
									}
								}
							}else{
								if(arr.indexOf(m.value) == -1){
									arr.push(m.value);
								}
							}
						}else{
							arr.push(s.value);
						}
					}else{	//只有一层
						arr.push(s.value);
					}
				})
					this.select_department_ids = arr;
					//店铺列表
					this.getStoreList();
				});
			},
			//店铺下拉全选
			changeSelected(v){
				if(v){
					this.select_store_ids = this.options.map(item => {
						return item.dept_id;
					})
				}else{
					this.select_store_ids = [];
				}
			},
			//向父组件传递参数
			emitCallBack(){
				this.all_selected = this.select_store_ids.length > 0 && this.select_store_ids.length == this.options.length;
				let obj = {
					select_department_ids:this.select_department_ids,
					select_plat_ids:this.select_plat_ids,
					select_store_ids:this.select_store_ids,
				}
				this.$emit('callBack',obj);
			},
			//部门列表
			AjaxViewDept(){
				resource.ajaxViewDept({from:this.from}).then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			// 获取所有店铺
			getStoreList(){
				this.select_store_ids = [];
				let dept_id = this.select_department_ids.join(',');
				resource.ajaxViewStore({dept_id:dept_id,platform:this.select_plat_ids.join(','),from:this.from}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
						this.options = this.store_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		}
	}
</script>






