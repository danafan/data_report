<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部:">
				<el-cascader
				ref="cascader"
				:options="dept_list"
				:props="props"
				@change="getIds"
				filterable
				reserve-keyword
				collapse-tags
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" clearable @change="getStoreList" multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in store_list" :key="item.jst_code" :label="item.shop_name" :value="item.jst_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-input v-model="gyshh" clearable placeholder="请输入供应商货号"></el-input>
			</el-form-item>
			<el-form-item label="供应商分类：">
				<el-select v-model="gys_cate_ids" clearable filterable multiple reserve-keyword placeholder="全部">
					<el-option v-for="item in gys_cate_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="统计日期：">
				<el-date-picker v-model="sjxrrq" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="类型：">
				<el-select v-model="type" clearable placeholder="请选择类型">
					<el-option label="款式Top200" value="1"></el-option>
					<el-option label="近三天每天销量大于10" value="2"></el-option>
					<el-option label="近三天每天销量大于5" value="3"></el-option>
					<el-option label="近三天销量大于3" value="4"></el-option>
					<el-option label="外采款式Top200" value="5"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword :remote-method="ajaxTopSpmc" collapse-tags placeholder="全部">
					<el-option v-for="item in goods_name_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="select_pp_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in pp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1,true)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<PopoverWidget title="指标解释" :update_time="update_time" keys="top_lb"/>
			<div class="flex">
				<el-button type="primary" size="small" @click="show_custom = true">自定义列表</el-button>
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
					<el-tooltip class="item" placement="top">
						<div slot="content">
							1、批量导入，第一行为“款式”、“备注”、“重要程度”三个字段，填写的数据从第二行开始<br/>
							2、导入失败原因1：数据中存在某款式编码找不到<br/>
							3、导入失败原因2：数据中存在重复款式编码<br/>
							4、导入失败原因3：数据不对应(款式填到备注里面了)
						</div>
						<i class="el-icon-info" style="color: red"></i>
					</el-tooltip>
				</div>
				<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="before_lb" max_height="630" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack" @editFun="editFun"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handleCurrentChange"/>
		<!-- 自定义列表 -->
		<el-dialog title="（单击取消列表名保存直接修改）" :visible.sync="show_custom">
			<div class="select_box">
				<el-checkbox-group v-model="selected_ids">
					<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="Restore">恢复默认</el-button>
				<el-button size="small" @click="Restore('is_close')">取消</el-button>
				<el-button size="small" type="primary" @click="setColumns">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import operationResource from '../../../api/operationResource.js'
	import inventoryResource from '../../../api/inventoryResource.js'
	import demandResource from '../../../api/demandResource.js'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate,getNextDate} from '../../../api/nowMonth.js'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import CustomTable from '../../../components/custom_table.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	export default{
		data(){
			return{
				nowDate:"",
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gyshh:"",									//供应商货号
				gys_cate_list:[],							//供应商分类列表
				gys_cate_ids:[],							//选中的供应商分类
				select_store_ids:[],						//选中的店铺列表
				dept_list:[],
				select_department_ids:[],					//选中的部门id列表
				props:{
					multiple:true,
					value:'dept_id',
					label:'dept_name',
					children:'list',
				},
				plat_list:[],
				select_plat_ids:[],							//选中的平台列表
				store_list: [],								//店铺列表	
				select_store_ids:[],						//选中的店铺id列表
				sjxrrq:getNowDate(),
				type:"1",
				goods_name_list:[],							//品类列表
				select_pl_ids:[],							//选中的品类列表
				pp_list:[],									//品牌列表
				select_pp_list:[],							//选中的品牌列表
				page:1,
				pagesize:10,
				update_time:"",				//缺货更新时间
				table_id:"",
				edit_id:"",
				ks_shortage_day_list:[],			//款式缺货情况对应日期数组
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,
				table_sort:"",
				loading:false,
				show_custom:false,						//自定义列表
				selected_ids:[],			//当前选中的所有ID
				data_selected_ids:[],
				view_row:[],				//当前的列表
			}
		},
		created(){
			this.nowDate = getNowDate();
			//部门列表
			this.AjaxViewDept();
			//平台列表
			this.ajaxPlat();
			// 获取所有店铺
			this.getStoreList()
			//获取供应商分类
			this.getGysfl();
			//品牌列表
			this.ajaxPp();
			//获取商品名称列表
			// this.ajaxTopSpmc();
			//获取列表
			this.getData();
		},
		methods:{
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
			// 获取所有店铺
			getStoreList(){
				this.select_store_ids = [];
				let dept_id = this.select_department_ids.join(',');
				resource.ajaxViewStore({dept_id:dept_id,platform:this.select_plat_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品牌列表
			ajaxPp(){
				resource.ajaxDeerShopPp().then(res => {
					if(res.data.code == 1){
						this.pp_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类列表
			ajaxTopSpmc(e){
				if(e != ''){
					demandResource.ajaxTopSpmc({name:e}).then(res => {
						if(res.data.code == 1){
							this.goods_name_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//表格前几天到货数
			filterLabel(num,type){
				return `${getNextDate(this.sjxrrq,num).split('-')[1]}日${type == '1'?'到货数':''}`
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxTop200Ksbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取供应商分类
			getGysfl(){
				operationResource.stockSelect({type:'gys_type'}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.gys_cate_list = data.gys_type;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					inventoryResource.stockImport({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.getData(true);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dept_id:this.select_department_ids.join(','),
						platform:this.select_plat_ids.join(','),
						jst_code:this.select_store_ids.join(','),
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						gyshh:this.gyshh,
						gys_type:this.gys_cate_ids.join(','),
						sjxrrq:this.sjxrrq?this.sjxrrq:'',
						type:this.type,
						pp:this.select_pp_list.join(','),
						mc:this.select_pl_ids.join(','),
						sort:this.table_sort,
					}
					demandResource.deforeLbExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'款式Top200列表');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val,bool) {
				this.page = val;
				//获取列表
				this.getData(bool);
			},
			//恢复默认
			Restore(type){
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
				if(type == 'is_close'){
					this.selected_ids = this.data_selected_ids;
					this.show_custom = false;
				}
			},
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				resource.setColumns({menu_id:'134',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.page = 1;
						this.pagesize = 10;
						this.getData(true);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//获取列表
			getData(is_reload){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					platform:this.select_plat_ids.join(','),
					jst_code:this.select_store_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					gyshh:this.gyshh,
					gys_type:this.gys_cate_ids.join(','),
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					type:this.type,
					sort:this.table_sort,
					pp:this.select_pp_list.join(','),
					mc:this.select_pl_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				if(is_reload){
					this.title_list = [];
				}
				demandResource.deforeLbList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						let title_list = data.title_list;
						title_list.map(item => {
							if(item.row_field_name == 'today_remark'){
								item.type = '97';
								item['check_disabled'] = this.nowDate != this.sjxrrq;
								item['width'] = "160";
							}
							if(item.row_field_name == 'ksbm' || item.row_field_name == 'gyshh'){
								item['width'] = "120";
							}
							if(item.row_field_name == 'lsgzfk'){
								item.type = '96';
							}
						})

						this.title_list = title_list;

						this.table_data = data.table_list.data;
						this.total = data.table_list.total;
						this.update_time = data.update_time;

						this.view_row = data.view_rows;
						this.selected_ids = data.selected_ids;
						this.data_selected_ids = data.selected_ids;
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
			//编辑今日反馈
			editFun(v,ksbm,type){
				this.$confirm('确认提交反馈?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:ksbm,
						type:type,
						remark:v
					};
					demandResource.stockEdit(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
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
			}
		},
		components:{
			PopoverWidget,
			CustomTable,
			PageWidget
		}
	}
</script>
<style type="text/css">
	.el-table th>.cell{
		display: flex!important;
		align-items: center!important;
		justify-content: center!important;
	}
	.row_style{
		background: #3467B8!important;
		color:#ffffff!important;
	}
	.main_dp .el-input__inner{
		border:none!important;
		background: #F7BD47!important;
	}
</style>
<style lang="less" scoped>
	.buts{
		margin-bottom: 15px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.text_style{
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.upload_box{
		margin-left: 10px;
		margin-right: 10px;
		position: relative;
		.upload_file{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
		.item{
			position: absolute;
			top: -10px;
			right: -10px;
		}
	}
</style>










