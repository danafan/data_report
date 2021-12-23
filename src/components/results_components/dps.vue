<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部:" style="margin-right: 20px">
				<el-cascader
				ref="cascader"
				:options="dept_list"
				:props="props"
				@change="getIds"
				filterable
				collapse-tags
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" clearable :popper-append-to-body="false" @change="getStoreList" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="select_store_ids" clearable :popper-append-to-body="false"  multiple
				filterable
				remote
				reserve-keyword
				:remote-method="checkStore" collapse-tags placeholder="全部">
				<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
	</el-form>
</div>
</template>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return {
				dept_list: [],						//部门列表	
				select_department_ids:[],			//选中的部门id列表
				plat_list:[],						//平台列表
				select_plat_ids:[],					//选中的平台列表
				store_list: [],						//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				store_name:"",						//输入的店铺名称
				props:{
					multiple:true,
					value:'dept_id',
					label:'dept_name',
					children:'list',
				}
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
			select_department_ids:function(n,o){
				this.emitCallBack();
			},
			// 平台
			select_plat_ids:function(n,o){
				this.emitCallBack();
			},
			//店铺
			select_store_ids:function(n,o){
				this.emitCallBack();
			}
		},
		methods:{
			getIds(){
				this.$nextTick(()=>{
					var arr = [];
					let select_department = this.$refs.cascader.getCheckedNodes({leafOnly:true});
					select_department.map(s => {
					if(!!s.parent){	//最后一层有父级
						var m = s.parent;
						if(!!m.checked){ //倒数第二层被全选了
							if(!!m.parent){ //倒数第二层有父级
								var d = m.parent;
								if(!!d.checked){ //倒数第三层被全选了
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
			//向父组件传递参数
			emitCallBack(){
				let obj = {
					select_department_ids:this.select_department_ids,
					select_plat_ids:this.select_plat_ids,
					select_store_ids:this.select_store_ids,
				}
				this.$emit('callBack',obj);
			},
			//部门列表
			AjaxViewDept(){
				resource.ajaxViewDept().then(res => {
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
			//模糊查询店铺
			checkStore(e){
				this.store_name = e;
				//店铺列表
				this.getStoreList('1');
			},
			// 获取所有店铺
			getStoreList(type){
				let dept_id = this.select_department_ids.join(',');
				if(type != '1'){
					this.select_store_ids = [];
				}
				resource.ajaxViewStore({dept_id:dept_id,name:this.store_name,platform:this.select_plat_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		}
	}
</script>






