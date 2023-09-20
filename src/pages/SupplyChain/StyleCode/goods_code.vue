<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="产品名称：">
				<el-input v-model="cpmc" clearable placeholder="请输入产品名称"></el-input>
			</el-form-item>
			<el-form-item label="款号：">
				<el-input v-model="ksbm" clearable placeholder="请输入款号"></el-input>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="plbm_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in plbm" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="ppmc_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in ppmc" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-input v-model="supplier_name" clearable placeholder="请输入供应商"></el-input>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-input v-model="supplier_ksbm" clearable placeholder="请输入供应商货号"></el-input>
			</el-form-item>
			<el-form-item label="状态:">
				<el-select v-model="status" clearable placeholder="全部">
					<el-option label="生成成功" :value="1"></el-option>
					<el-option label="生成失败" :value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="时间:">
				<el-date-picker style="margin-right: 15px;" v-model="date" :clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
				<el-checkbox :true-label="1" :false-label="0" v-model="is_today">今日导入</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<!-- <PopoverWidget title="指标解释" :update_time="update_time" keys="top_lb"/> -->
			<el-button type="primary" size="small" @click="import_dialog = true" v-if="button_list.import == 1">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" plain size="small" @click="export_dialog = true" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
			<el-button type="primary" size="small" @click="addKsbm" v-if="button_list.add == 1">添加<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="ksbm_table" max_height="630" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack" :is_setting="true" :button_list="button_list" fieldName="ksbm_id" @tableCallBack="tableCallBack" @addSpecFn="addSpecFn" @deleteFn="deleteFn" @editFn="editKsbm"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handleCurrentChange"/>
		<!-- sku资料 -->
		<el-dialog title="sku资料" @close="closeAddSku" width="30%" :visible.sync="add_sku_dialog">
			<div>
				<el-form size="small">
					<el-form-item label="款号：">
						<div>{{spec_ksbm}}</div>
					</el-form-item>
					<el-form-item label="颜色：">
						<el-input style="width: 192px;" v-model="colors" clearable placeholder="请输入颜色"></el-input>
					</el-form-item>
					<el-form-item label="尺码：">
						<el-input style="width: 192px;" v-model="sizes" clearable placeholder="请输入尺码"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="add_sku_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="commitAddSpecFn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 导出 -->
		<el-dialog title="请选择导出类型" width="25%" @close="export_type = 1" :visible.sync="export_dialog">
			<el-radio-group v-model="export_type">
				<el-radio :label="1">基础资料</el-radio>
				<el-radio :label="2">商品sku编码</el-radio>
			</el-radio-group>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="export_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="exportFn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 导入 -->
		<el-dialog title="导入" :visible.sync="import_dialog" width="30%">
			<div class="down_box">
				<el-button type="primary" plain size="small" @click="downTemplate">下载模版<i class="el-icon-download el-icon--right"></i></el-button>
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
				</div>
			</div>
			<div id="sss"></div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="import_dialog = false">取 消</el-button>
			</div>
		</el-dialog>
		<!-- 添加/编辑 -->
		<el-dialog :title="dialog_type == '1'?'添加款式编码':'编辑款式编码'" @close="closeDialog" width="60%" :visible.sync="add_edit_dialog">
			<div class="flex jsa">
				<el-form size="small" label-width="100px">
					<el-form-item label="填写人：" required>
						<el-select size="small" clearable v-model="form.fill_user_id" filterable placeholder="请选择填写人">
							<el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="年份：" required>
						<el-select size="small" clearable v-model="form.year" filterable placeholder="请选择年份">
							<el-option v-for="item in year_list" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="小类编码：" required>
						<el-input style="width: 192px;" v-model="form.xlbm" clearable placeholder="请输入小类编码"></el-input>
					</el-form-item>
					<el-form-item label="颜色：" required>
						<el-input style="width: 192px;" v-model="form.color" clearable placeholder="请输入颜色"></el-input>
					</el-form-item>
					<el-form-item label="尺码：" required>
						<el-input style="width: 192px;" v-model="form.size" clearable placeholder="请输入尺码"></el-input>
					</el-form-item>
					<el-form-item label="里料成分：" required>
						<el-input style="width: 192px;" v-model="form.llcf" clearable placeholder="请输入里料成分"></el-input>
					</el-form-item>
					<el-form-item label="执行标准：" required>
						<el-input style="width: 192px;" v-model="form.zxbz" clearable placeholder="请输入执行标准"></el-input>
					</el-form-item>
					<el-form-item label="品牌名称：" required>
						<el-select v-model="form.ppmc" clearable filterable placeholder="请选择品牌名称">
							<el-option v-for="item in ppmc" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="品类编码：" required>
						<el-select v-model="form.plbm" clearable filterable placeholder="请选择品类编码">
							<el-option v-for="item in plbm" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="供应商：" required>
						<el-input style="width: 192px;" v-model="form.supplier_name" clearable placeholder="请输入供应商"></el-input>
					</el-form-item>
				</el-form>
				<el-form size="small" label-width="110px">
					<el-form-item label="产品名称：" required>
						<el-input style="width: 192px;" v-model="form.cpmc" clearable placeholder="请输入产品名称"></el-input>
					</el-form-item>
					<el-form-item label="标准价：" required>
						<el-input style="width: 192px;" type="number" v-model="form.bzj" clearable placeholder="请输入标准价"></el-input>
					</el-form-item>
					<el-form-item label="季节：" required>
						<el-select size="small" clearable v-model="form.jj" filterable placeholder="请选择季节">
							<el-option v-for="item in jj_list" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="性别：" required>
						<el-select size="small" clearable v-model="form.xb" filterable placeholder="请选择性别">
							<el-option v-for="item in xb_list" :key="item.setting_id" :label="item.code_value" :value="item.setting_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="版型：" required>
						<el-input style="width: 192px;" v-model="form.bx" clearable placeholder="请输入版型"></el-input>
					</el-form-item>
					<el-form-item label="填充物成分：" required>
						<el-input style="width: 192px;" v-model="form.tcwcf" clearable placeholder="请输入填充物成分"></el-input>
					</el-form-item>
					<el-form-item label="包材单价：" required>
						<el-input style="width: 192px;" type="number" v-model="form.bcdj" clearable placeholder="请输入包材单价"></el-input>
					</el-form-item>
					<el-form-item label="供应商货号：" required>
						<el-input style="width: 192px;" v-model="form.supplier_ksbm" clearable placeholder="请输入供应商货号"></el-input>
					</el-form-item>
					<el-form-item label="面料成分：" required>
						<el-input style="width: 192px;" v-model="form.mlcf" clearable placeholder="请输入面料成分"></el-input>
					</el-form-item>
					<el-form-item label="安全技术级别：">
						<el-input style="width: 192px;" v-model="form.safe_level" clearable placeholder="请输入安全技术级别"></el-input>
					</el-form-item>
				</el-form>
				<el-form size="small" label-width="130px">
					<el-form-item label="吊牌价：" required>
						<el-input style="width: 192px;" type="number" v-model="form.dpj" clearable placeholder="请输入吊牌价"></el-input>
					</el-form-item>
					<el-form-item label="开发款号：" required>
						<el-input style="width: 192px;" v-model="form.kfkh" clearable placeholder="请输入开发款号"></el-input>
					</el-form-item>
					<el-form-item label="大类名称：" required>
						<el-input style="width: 192px;" v-model="form.dlmc" clearable placeholder="请输入大类名称"></el-input>
					</el-form-item>
					<el-form-item label="面料名称：" required>
						<el-input style="width: 192px;" v-model="form.mlmc" clearable placeholder="请输入面料名称"></el-input>
					</el-form-item>
					<el-form-item label="生产厂商.名称：" required>
						<el-input style="width: 192px;" v-model="form.sccs" clearable placeholder="请输入生产厂商.名称"></el-input>
					</el-form-item>
					<el-form-item label="标费档次.名称：" required>
						<el-input style="width: 192px;" v-model="form.bfdc" clearable placeholder="请输入标费档次.名称"></el-input>
					</el-form-item>
					<el-form-item label="材质：">
						<el-input style="width: 192px;" v-model="form.cz" clearable placeholder="请输入材质"></el-input>
					</el-form-item>
					<el-form-item label="成本价：" required>
						<el-input style="width: 192px;" type="number" v-model="form.cbj" clearable placeholder="请输入成本价"></el-input>
					</el-form-item>
					<el-form-item label="上下装：" required>
						<el-input style="width: 192px;" v-model="form.sxz" clearable placeholder="请输入上下装"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="add_edit_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="commitFn">确 定</el-button>
			</div>
		</el-dialog>
		<!-- 商品编码 -->
		<el-dialog title="商品编码" @close="closeSkuDialog" :visible.sync="sku_dialog">
			<div>
				<el-form :inline="true" size="small" class="demo-form-inline">
					<el-form-item label="商品sku编码：">
						<el-input v-model="sku" clearable placeholder="请输入商品sku编码"></el-input>
					</el-form-item>
					<el-form-item label="同步状态：">
						<el-select v-model="status_id" clearable placeholder="全部">
							<el-option v-for="item in sku_status" :key="item.id" :label="item.label" :value="item.id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="small" @click="skuHandleCurrentChange(1)">搜索</el-button>
					</el-form-item>
				</el-form>
				<div class="flex jse">合计：{{sku_total}}条</div>
				<custom-table v-loading="sku_loading" :isLoading="sku_loading" tableName="sku_table" max_height="630" :table_data="sku_table_data" :title_list="sku_title_list"/>
				<page-widget :page="sku_page" :pagesize="sku_pagesize" :total="sku_total" @handleSizeChange="skuHandleSizeChange" @handlePageChange="skuHandleCurrentChange"/>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	import formDataResource from '../../../api/formDataResource.js'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate,getNextDate} from '../../../api/nowMonth.js'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import CustomTable from '../../../components/custom_table.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'
	import PageWidget from '../../../components/pagination_widget.vue'

	import excel from "../../../api/excel.js";
	export default{
		data(){
			return{
				cpmc:"",									//产品名称
				ksbm:"",									//款号
				plbm:[],									//品类列表
				plbm_ids:[],								//选中的品类列表
				ppmc:[],									//品牌列表
				ppmc_ids:[],								//选中的品牌列表
				status:"",									//状态
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										
				date:[getMonthStartDate(),getCurrentDate()],//时间区间
				is_today:0,
				supplier_list:[],							//供应商列表
				supplier_name:"",							//选中的供应商
				supplier_ksbm:"",							//供应商货号
				page:1,
				pagesize:10,
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,
				button_list:{},
				table_sort:"",
				loading:false,
				export_dialog:false,						//导出弹窗
				export_type:1,							//导出类型（1:基础资料；商品sku编码）
				import_dialog:false,						//导入
				add_edit_dialog:false,						//添加/编辑弹窗
				dialog_type:'',							//添加/编辑弹窗类型（1:添加；2:编辑）
				user_list:[],								//填写人列表
				year_list:[],								//年份列表
				jj_list:[],									//季节列表
				xb_list:[],									//性别列表
				gys_list:[],								//供应商列表
				ksbm_id:"",									//点击的款式编码ID
				spec_ksbm:"",								//款式编码
				colors:"",									//颜色
				sizes:"",									//尺码
				add_sku_dialog:false,						//增加款式资料弹窗
				form:{	
					fill_user_id:'',							//选中的填写人
					year:"",									//选中的年份
					xlbm:"",									//小类编码
					color:"",									//颜色
					size:"",									//尺码
					llcf:"",									//里料成分
					zxbz:"",									//执行标准
					cpmc:"",									//产品名称
					bzj:"",										//标准价
					jj:"",										//季节
					xb:"",										//性别
					bx:"",										//版型
					tcwcf:"",									//填充物成分
					bcdj:"",									//包材单价
					dpj:"",										//吊牌价
					kfkh:"",									//开发款号
					dlmc:"",									//大类名称
					mlmc:"",									//面料名称
					sccs:"",									//生产厂商.名称
					bfdc:"",									//标费档次.名称
					cz:"",										//材质
					ppmc:"",									//品牌名称
					plbm:"",									//品类编码
					supplier_name:"",							//供应商
					supplier_ksbm:"",							//供应商货号
					mlcf:"",									//面料成分
					safe_level:"",								//安全技术级别
					cbj:"",										//成本价
					sxz:"",										//上下装
				},								  	  //详情内容
				sku_dialog:false,								//sku弹窗
				sku:"",											//sku
				sku_status:[{
					label:'未同步',
					id:0
				},{
					label:'已同步',
					id:1
				},{
					label:'同步失败',
					id:2
				}],										  //同步状态
				status_id:"",									//选中的同步状态
				sku_page:1,
				sku_pagesize:10,
				sku_loading:false,
				sku_title_list:[],								//表头数据
				sku_table_data:[],								//表格数据
				sku_total:0,
			}
		},
		props:{
			//监听当前页面
			activeTab:{
				type:String,
			default:''
			}
		},
		watch:{
			activeTab:function(n,o){
				if(n == 'goods_code'){
					//获取参数配置
					this.ajaxSetting();
				}
			}
		},
		created(){
			//获取参数配置
			this.ajaxSetting();
			//获取用户列表
			this.getUserList();
			//获取列表
			this.getData();
		},
		methods:{
			//获取参数配置
			ajaxSetting(){
				demandResource.ajaxSetting().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.plbm = data.plbm;				//品类
						this.ppmc = data.ppmc;				//品牌
						this.year_list = data.year;			//年份列表
						this.jj_list = data.jj;				//季节列表
						this.xb_list = data.xb;				//性别列表
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/款式编码导入模板.xlsx`);
			},
			//导入
			uploadCsv(e){
				let files = e.target.files;
				if (files.length > 0) {
					demandResource.importKsbm({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							let data = res.data.data;
							this.$alert(`导入基本资料${data.total_ksbm_num}条，已生成${data.total_sku_num}条商品款式编码`,'提示', {
								confirmButtonText: '我知道了',
								callback: action => {
									this.$message.success(res.data.msg);
									this.import_dialog = false;
									this.page = 1;
									//获取列表
									this.getData();
								}
							});
							
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			exportFn(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					plbm:this.plbm_ids.join(','),
					ppmc:this.ppmc_ids.join(','),
					cpmc:this.cpmc,
					status:this.status,
					is_today:this.is_today,
					ksbm:this.ksbm,
					supplier_name:this.supplier_name,
					supplier_ksbm:this.supplier_ksbm,
					sort:this.table_sort,
					type:this.export_type
				}
				demandResource.exportKsbm(arg).then(res => {
					if(res){
						exportPost("\ufeff" + res.data,'款式编码列表');
						this.export_dialog = false;
					}
				})
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
			//获取列表
			getData(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					plbm:this.plbm_ids.join(','),
					ppmc:this.ppmc_ids.join(','),
					cpmc:this.cpmc,
					status:this.status,
					is_today:this.is_today,
					ksbm:this.ksbm,
					supplier_name:this.supplier_name,
					supplier_ksbm:this.supplier_ksbm,
					sort:this.table_sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.ksbmList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.title_list.map(item => {
							if(item.row_field_name == 'ksbm'){
								item['width'] = '120'
							}
						});
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
			//增加sku资料
			addSpecFn(info){
				this.ksbm_id = info.ksbm_id;
				this.spec_ksbm = info.ksbm;
				this.add_sku_dialog = true;
			},
			//关闭sku资料
			closeAddSku(){
				this.ksbm = "";									//款式编码
				this.colors = "";									//颜色
				this.sizes = "";									//尺码
			},
			//提交添加sku资料
			commitAddSpecFn(){
				if(this.colors == '' && this.sizes == ''){
					this.$message.warning('颜色和尺码不能全部为空！');
					return
				}
				
				let arg = {
					ksbm_id:this.ksbm_id,
					colors:this.colors,
					sizes:this.sizes,
				}
				demandResource.addSpec(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.add_sku_dialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//删除款式编码
			deleteFn(ksbm_id){
				this.$confirm('确认删除该款式编码?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm_id:ksbm_id
					}
					demandResource.delKsbm(arg).then(res => {
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
			//获取用户列表
			getUserList(){
				formDataResource.ajaxUser().then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加
			addKsbm(){
				this.dialog_type = '1';
				this.add_edit_dialog = true;
			},
			//点击编辑
			editKsbm(ksbm_id){
				this.ksbm_id = ksbm_id;
				this.dialog_type = '2';
				this.add_edit_dialog = true;
				demandResource.editKsbmGet({ksbm_id:ksbm_id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						for(let k in this.form){
							if(k == 'year' || k == 'ppmc' || k == 'plbm' || k == 'jj' || k == 'xb'){
								if(data[k] == '' || data[k] == 0){
									this.form[k] = '';
								}else{
									this.form[k] = parseInt(data[k]);
								}
							}else{
								this.form[k] = data[k];
							}
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭添加/编辑弹窗
			closeDialog(){
				for(let k in this.form){
					this.form[k] = "";
				}
			},
			//添加/编辑保存	
			commitFn(){
				if(this.form.fill_user_id == ''){
					this.$message.warning('请选择填写人!');
				}else if(this.form.year == ''){
					this.$message.warning('请选择年份!');
				}else if(this.form.xlbm == ''){
					this.$message.warning('请输入小类编码!');
				}else if(this.form.color == ''){
					this.$message.warning('请输入颜色!');
				}else if(this.form.size == ''){
					this.$message.warning('请输入尺码!');
				}else if(this.form.llcf == ''){
					this.$message.warning('请输入里料成分!');
				}else if(this.form.zxbz == ''){
					this.$message.warning('请输入执行标准!');
				}else if(this.form.ppmc == ''){
					this.$message.warning('请选择品牌名称!');
				}else if(this.form.plbm == ''){
					this.$message.warning('请选择品类编码!');
				}else if(this.form.supplier_name == ''){
					this.$message.warning('请选择供应商!');
				}else if(this.form.cpmc == ''){
					this.$message.warning('请选择产品名称!');
				}else if(this.form.bzj == ''){
					this.$message.warning('请输入标准价!');
				}else if(this.form.jj == ''){
					this.$message.warning('请选择季节!');
				}else if(this.form.xb == ''){
					this.$message.warning('请选择性别!');
				}else if(this.form.bx == ''){
					this.$message.warning('请输入版型!');
				}else if(this.form.tcwcf == ''){
					this.$message.warning('请输入填充物成分!');
				}else if(this.form.bcdj == ''){
					this.$message.warning('请输入包材单价!');
				}else if(this.form.supplier_ksbm == ''){
					this.$message.warning('请输入供应商货号!');
				}else if(this.form.mlcf == ''){
					this.$message.warning('请输入面料成分!');
				}else if(this.form.dpj == ''){
					this.$message.warning('请输入吊牌价!');
				}else if(this.form.kfkh == ''){
					this.$message.warning('请输入开发款号!');
				}else if(this.form.dlmc == ''){
					this.$message.warning('请输入大类名称!');
				}else if(this.form.mlmc == ''){
					this.$message.warning('请输入面料名称!');
				}else if(this.form.sccs == ''){
					this.$message.warning('请输入生产厂商.名称!');
				}else if(this.form.bfdc == ''){
					this.$message.warning('请输入标费档次.名称!');
				}else if(this.form.cbj == ''){
					this.$message.warning('请输入成本价!');
				}else if(this.form.sxz == ''){
					this.$message.warning('请输入上下装!');
				}else{
					if(this.dialog_type == '1'){	//添加
						demandResource.addKsbm(this.form).then(res => {
							if(res.data.code == 1){
								this.add_edit_dialog = false;
								this.$message.success(res.data.msg);
								//获取列表
								this.getData();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{							//编辑
						let arg = JSON.parse(JSON.stringify(this.form));
						arg['ksbm_id'] = this.ksbm_id;
						demandResource.editKsbmPost(arg).then(res => {
							if(res.data.code == 1){
								this.add_edit_dialog = false;
								this.$message.success(res.data.msg);
								//获取列表
								this.getData();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
			//点击款号获取商品编码
			tableCallBack(ksbm_id){
				this.ksbm_id = ksbm_id;
				//获取sku列表
				this.skuList();
			},
			//获取sku列表
			skuList(){
				let arg = {
					ksbm_id:this.ksbm_id,
					sku:this.sku,
					status:this.status_id,
					page:this.sku_page,
					pagesize:this.sku_pagesize
				}
				this.sku_dialog = true;
				this.sku_loading = true;
				demandResource.skuList(arg).then(res => {
					if(res.data.code == 1){
						this.sku_loading = false;
						let data = res.data.data;
						this.sku_title_list = data.title_list;
						this.sku_table_data = data.table_data.data;
						this.sku_total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭sku列表
			closeSkuDialog(){
				this.sku = "";
				this.status_id = "";
				this.sku_page = 1;
				this.sku_pagesize = 10;
				this.sku_title_list = [];								//表头数据
				this.sku_table_data = [];								//表格数据
				this.sku_total = 0;
			},
			//分页
			skuHandleSizeChange(val) {
				this.sku_pagesize = val;
				//获取列表
				this.skuList();
			},
			skuHandleCurrentChange(val) {
				this.sku_page = val;
				//获取列表
				this.skuList();
			},
			
		},
		components:{
			PopoverWidget,
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
	.text_style{
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.down_box{
		display:flex;
		.upload_box{
			margin-left: 10px;
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
		}
	}
</style>










