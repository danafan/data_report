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
				collapse-tags
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" clearable @change="getStoreList" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
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
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<PopoverWidget title="指标解释" keys="top_lb"/>
			<div style="display: flex">
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
		<div style="font-size: 14px;color: red">缺货更新时间：{{update_time}}</div>
		<el-table border size="small" :data="data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="630px" @sort-change="tableSortChange" v-loading="loading" @header-dragend="secondChange">
			<el-table-column :index="index" :label="item.label" :prop="item.prop" :width="item.width" align="center" v-for="(item,index) in column_list" :sortable="item.is_sort?'custom':false" show-overflow-tooltip>
				<template slot="header" slot-scope="scope">
					<el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
						<div class="pre-line">{{item.label}}</div>
					</el-tooltip>
				</template>
				<div v-if="item.prop == 'qhghqk'">
					<el-table-column :label="i.label" :prop="i.prop" align="center" :sortable="i.is_sort?'custom':false" v-for="(i,index) in ks_shortage_day_list">
					</el-table-column>
				</div>
				<template slot-scope="scope">
					<!-- 图片 -->
					<div v-if="item.prop == 'images'">
						<el-image :z-index="2006" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="scope.row.images"></el-image>
						<div v-else></div>
					</div>
					<!-- 今日跟踪反馈 -->
					<div style="display: flex;align-items: center" v-else-if="item.prop == 'jrgzfk'">
						<el-checkbox style="margin-right: 5px;" :true-label='1' :false-label='0' v-model="scope.row.type" :disabled="nowDate != sjxrrq" @change="editFun(scope.row.today_remark,scope.row.ksbm,scope.row.type)"></el-checkbox>
						<el-input @blur="editFun(scope.row.today_remark,scope.row.ksbm,scope.row.type)" size="small" type="textarea" placeholder="输入反馈" v-model="scope.row.today_remark" :disabled="nowDate != sjxrrq">
						</el-input>
					</div>
					<!-- 历史跟踪反馈 -->
					<div v-else-if="item.prop == 'lsgzfk'">
						<el-popover placement="right" width="800" :open-delay="1000"
						trigger="hover" @show="getRecord(scope.row.ksbm)" >
						<el-table size="small" :data="tableObj.data" tooltip-effect="dark" style="width: 100%;height: 400px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="detail_loading">
							<el-table-column prop="createtime" label="操作时间" width="160" align="center"></el-table-column>
							<el-table-column prop="remark" label="反馈内容" show-overflow-tooltip align="center"></el-table-column>
							<el-table-column prop="creater" label="操作人" width="100" show-overflow-tooltip align="center"></el-table-column>
						</el-table>
						<div class="page">
							<el-pagination @size-change="handlePageSize" @current-change="handlePage" :current-page="table_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, prev, pager, next, jumper" :total="total">
							</el-pagination>
						</div>
						<el-button slot="reference" type="text" size="mini">查看</el-button>
					</el-popover>
				</div>
				<!-- 普通文字 -->
				<div class='text_style' v-else>{{scope.row[item.prop]}}</div>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
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

	import PopoverWidget from '../../../components/popover_widget.vue'
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
				page:1,
				pagesize:10,
				update_time:"",				//缺货更新时间
				column_list:[{
					label:'图片',
					prop:'images'
				},{
					label:'款式编码',
					prop:'ksbm',
				},{
					label:'供应商货号',
					prop:'gyshh',
				},{
					label:'现有库存',
					prop:'xjkc',
					is_sort:true
				},{
					label:'缺货跟货情况',
					prop:'qhghqk',
				},{
					label:'昨日跟踪反馈',
					prop:'yesterday_remark',
				},{
					label:'今日跟踪反馈',
					prop:'jrgzfk',
				},{
					label:'历史跟踪反馈',
					prop:'lsgzfk',
				},{
					label:'7天日均销量',
					prop:'xssl_av7',
					is_sort:true
				},{
					label:'30天销量',
					prop:'xssl_30_sum',
					is_sort:true
				},{
					label:'7天毛利率',
					prop:'mlv_7',
					is_sort:true
				},{
					label:'15天实退率',
					prop:'stl_15',
					is_sort:true
				},{
					label:'7天到货率',
					prop:'dhl_7',
					is_sort:true
				},{
					label:'7天到货率(排除备货)',
					prop:'pbh_dhl_7',
					is_sort:true
				},{
					label:'前三天销量',
					prop:'xssl_3',
					is_sort:true
				},{
					label:'前两天销量',
					prop:'xssl_2',
					is_sort:true
				},{
					label:'前一天销量',
					prop:'xssl_1',
					is_sort:true
				},{
					label:'主卖店铺',
					prop:'shop_name',
				},{
					label:'部门',
					prop:'dept_name',
				},{
					label:'批发价',
					prop:'pfj',
					is_sort:true
				},{
					label:'审计成本',
					prop:'sjcb',
					is_sort:true
				},{
					label:'商品名称',
					prop:'mc',
				},{
					label:'供应商',
					prop:'gys',
				},{
					label:'供应商分类',
					prop:'gys_type',
				},{
					label:'供应商等级',
					prop:'gys_level',
				},{
					label:'结算方式',
					prop:'jsfs',
				}],
				table_id:"",
				edit_id:"",
				data:[],
				ks_shortage_day_list:[],					//款式缺货情况对应日期数组
				total:0,
				table_sort:"",
				table_page:1,
				table_pagesize:10,
				ksbm:"",
				detail_loading:false,
				tableObj:{}
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
			//表格前几天到货数
			filterLabel(num,type){
				return `${getNextDate(this.sjxrrq,num).split('-')[1]}日${type == '1'?'到货数':''}`
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
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
							this.getData();
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
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//供应商销量排序
			tableSortChange({ column, prop, order }) {  
				if(order){
					this.table_sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				}else{
					this.table_sort = "";
				}
				this.getData();
			}, 
			//获取列表
			getData(){
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
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.deforeLbList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;

						// 处理款式缺货情况
						this.ks_shortage_day_list = [];
						for(let i = -3;i <= 0;i++){
							let ff = {
								label:this.filterLabel(i,'2'),
								prop:i < 0?`qhs_${i*-1}`:'qhs',
								is_sort:i == 0?true:false
							}
							this.ks_shortage_day_list.push(ff)
						}
						// 这里不知道为啥顺序会乱
						let dd = this.ks_shortage_day_list[3];
						this.ks_shortage_day_list.splice(3,1);
						this.ks_shortage_day_list.unshift(dd)
						//处理前几日到货数
						let sss = [];
						for(let j = -3;j <= -1;j++){
							let ddd = {
								label:this.filterLabel(j,'1'),
								prop:'dhs_' + `${j*-1}`,
								is_sort:true
							}
							sss.push(ddd)
						}
						this.column_list.splice(5,this.column_list.length>26?3:0,...sss);

						let data = res.data.data;
						let table_data = data.data;
						table_data.map(item => {
							let images = [];
							if(item.tp != ''){
								images.push(item.tp);
								item.images = images;
							}else{
								item.images = null;
							}
						})
						this.data = data.data;
						this.total = data.total;
						this.update_time = data.update_time;
						this.table_id = data.table_setting.table_id;
						if(data.table_setting.setting){
							this.edit_id = data.table_setting.edit_id;
							let setting_arr = data.table_setting.setting.split(',');
							this.column_list.map(iii => {
								let arr = setting_arr.filter(item => {
									return iii.prop == item.split('-')[0]
								})
								iii['width'] = arr.length > 0?arr[0].split('-')[1]:'80';
							})
						}else{
							this.column_list.map(item => {
								item['width'] = '80';
							})
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//明细表表列宽修改
			secondChange(newWidth, oldWidth, column, event){
				let index = column.index;
				this.column_list[index].width = newWidth;
				let arr = [];
				this.column_list.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				let arg = {
					table_id:this.table_id,
					setting:arr.join(','),
				}
				if(this.edit_id){
					arg.id = this.edit_id;
				}
				//修改宽度
				this.changeWidth(arg)
			},
			//修改宽度
			changeWidth(arg){
				resource.tableSetting(arg).then(res => {
					if(res.data.code != 1){
						this.$message.warning(res.data.msg);
					}
				})
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
			},
			//点击查看
			getRecord(ksbm){
				this.table_page = 1;
				this.ksbm = ksbm;
				//获取详情
				this.getTableData();
			},
			//获取详情
			getTableData(){
				let arg = {
					ksbm:this.ksbm,
					page:this.table_page,
					pagesize:this.table_pagesize
				}
				this.detail_loading = true;
				demandResource.editLog(arg).then(res => {
					if(res.data.code == 1){
						this.detail_loading = false;
						this.tableObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//详情分页
			handlePageSize(val) {
				this.table_page = 1;
				this.table_pagesize = val;
				//获取列表
				this.getTableData();
			},
			handlePage(val) {
				this.table_page = val;
				//获取列表
				this.getTableData();
			},
		},
		components:{
			PopoverWidget
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










