<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="公司名称：">
				<el-input v-model="company_name" placeholder="请输入公司名称"></el-input>
			</el-form-item>
			<el-form-item label="公司简称：">
				<el-input v-model="company_alias" placeholder="请输入公司简称"></el-input>
			</el-form-item>
			<el-form-item label="主体类型：">
				<el-select v-model="main_body_type_id" clearable placeholder="请选择主体类型">
					<el-option v-for="item in main_body_type" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="管理员：">
				<el-select v-model="user_ids" clearable multiple filterable reserve-keyword placeholder="请选择管理员" collapse-tags>
					<el-option v-for="item in admin_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex jse mb-15">
			<el-button type="primary" plain icon="el-icon-plus" size="small" @click="editFn('','add')" v-if="button_list.add == 1">添加</el-button>
			<el-button type="primary" size="small" @click="import_dialog = true">
				导入
				<i class="el-icon-upload el-icon--right"></i>
			</el-button>
			<el-button type="primary" plain size="mini" @click="exportFn" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<CustomTable v-loading="loading" :isLoading="loading" tableName="main_body_info" max_height="620px" :table_data="table_data" :title_list="title_list" :is_setting="true" :button_list="button_list" fieldName="company_id" :is_custom_sort="false" @sortCallBack="sortCallBack" @editFn="editFn($event,'edit')" @detailFn="editFn($event,'detail')" @tableCallBack="viewPdf"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
		<!-- 添加/编辑/详情 -->
		<el-dialog v-el-drag-dialog :title="dialog_title" width="1200px" top="30px" :close-on-click-modal="false" :visible.sync="dialog">
			<div class="flex jsb">
				<el-form class="label_bold" style="width: 360px;" size="small" label-width="110px">
					<el-form-item label="主体类型：">
						<div v-if="dialog_type == 'detail'">{{info.main_body_type}}</div>
						<el-select v-model="info.main_body_type" placeholder="请选择主体类型" @change="setLocalStorage" v-else>
							<el-option v-for="item in main_body_type" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="主体简称：">
						<div v-if="dialog_type == 'detail'">{{info.company_alias}}</div>
						<el-input v-model="info.company_alias" placeholder="请输入主体简称" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="经营人：">
						<div v-if="dialog_type == 'detail'">{{info.legal_person}}</div>
						<el-input v-model="info.legal_person" placeholder="请输入经营人" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="主体原归属：">
						<div v-if="dialog_type == 'detail'">{{info.original_belong}}</div>
						<el-input v-model="info.original_belong" placeholder="请输入主体原归属" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="联系地址：">
						<div v-if="dialog_type == 'detail'">{{info.contacts_address}}</div>
						<el-input v-model="info.contacts_address" placeholder="请输入联系地址" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="合同条款：">
						<div v-if="dialog_type == 'detail'">{{info.contract_terms}}</div>
						<el-select v-model="info.contract_terms" clearable placeholder="请选择合同条款" @change="setLocalStorage" v-else>
							<el-option v-for="item in contract_terms_list" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="营业执照：">
						<uploads-file :current_images="business_license" :max_num="2" @callback="businessLicenseCallBack" :onlyView="dialog_type == 'detail'" :requestDel="dialog_type == 'add'" v-if="dialog"/>
					</el-form-item>
					<el-form-item label="备注：">
						<div v-if="dialog_type == 'detail'">{{info.remark}}</div>
						<el-input type="textarea" :rows="3" v-model="info.remark" placeholder="请输入备注" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
				</el-form>
				<el-form class="label_bold" style="width: 360px;" size="small" label-width="110px">
					<el-form-item label="管理员：">
						<div v-if="dialog_type == 'detail'">{{detail_data.company_admin_name}}</div>
						<el-select v-model="info.company_admin_id" clearable filterable placeholder="请选择管理员" @change="setLocalStorage" v-else>
							<el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="营业执照号：">
						<div v-if="dialog_type == 'detail'">{{info.business_license_number}}</div>
						<el-input v-model="info.business_license_number" placeholder="请输入营业执照号" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="经营人电话：">
						<div v-if="dialog_type == 'detail'">{{info.operator_tel}}</div>
						<el-input type="number" v-model="info.operator_tel" placeholder="请输入经营人电话" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="经营人性别：">
						<div v-if="dialog_type == 'detail'">{{info.operator_gender}}</div>
						<el-select v-model="info.operator_gender" clearable placeholder="请选择经营人性别" @change="setLocalStorage" v-else>
							<el-option label="男" :value="1"></el-option>
							<el-option label="女" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="联系人：">
						<div v-if="dialog_type == 'detail'">{{info.contacts}}</div>
						<el-input v-model="info.contacts" placeholder="请输入联系人" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="归属客户：">
						<div v-if="dialog_type == 'detail'">{{info.current_belong}}</div>
						<el-input v-model="info.current_belong" placeholder="请输入归属客户" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="身份证照片：">
						<uploads-file :current_images="id_card" :max_num="2" @callback="idCardCallBack" :onlyView="dialog_type == 'detail'" :requestDel="dialog_type == 'add'" v-if="dialog"/>
					</el-form-item>
				</el-form>
				<el-form class="label_bold" style="width: 360px;" size="small" label-width="130px">
					<el-form-item label="公司全称：">
						<div v-if="dialog_type == 'detail'">{{info.company_name}}</div>
						<el-input v-model="info.company_name" placeholder="请输入公司全称" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="注册地址：">
						<div v-if="dialog_type == 'detail'">{{info.register_address}}</div>
						<el-input type="textarea" :rows="2" v-model="info.register_address" placeholder="请输入注册地址：" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="经营人身份证：">
						<div v-if="dialog_type == 'detail'">{{info.operator_id_card}}</div>
						<el-input type="number" v-model="info.operator_id_card" placeholder="请输入经营人身份证" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="联系人电话：">
						<div v-if="dialog_type == 'detail'">{{info.contacts_tel}}</div>
						<el-input type="number" v-model="info.contacts_tel" placeholder="请输入联系人电话" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
					<el-form-item label="是否转出：">
						<div v-if="dialog_type == 'detail'">{{info.is_transfer_out}}</div>
						<el-select v-model="info.is_transfer_out" placeholder="请选择" @change="setLocalStorage" v-else>
							<el-option label="是" :value="1"></el-option>
							<el-option label="否" :value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="合同PDF：">
						<UploadPdf :fileName="info.contract_url" :onlyView="dialog_type == 'detail'" :requestDel="dialog_type == 'add'" @callbackFn="uploadPdf" @viewPdf="openPdf"/>
					</el-form-item>
					<el-form-item label="新客申请：">
						<div v-if="dialog_type == 'detail'">{{info.new_apply}}</div>
						<el-input v-model="info.new_apply" placeholder="请输入新客申请" @change="setLocalStorage" v-else></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer flex jc" v-if="dialog_type != 'detail'">
				<el-button type="primary" size="small" @click="commitAduit">保存</el-button>
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
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="import_dialog = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import operationResource from '../../../api/operationResource.js'
	import formDataResource from '../../../api/formDataResource.js'
	import UploadsFile from '../../../components/uploads_file.vue'
	import UploadPdf from '../../../components/upload_pdf.vue'
	export default{
		data(){
			return{
				domain:"",
				company_name:"",							//公司名称
				company_alias:"",							//公司简称
				main_body_type:[{
					value:1,
					label:'授权主体'
				},{
					value:2,
					label:'合同主体'
				}],											//主体类型列表
				main_body_type_id:"",						//选中的主体类型
				admin_list:[],								//管理员列表
				user_list:[],								//用户列表
				user_ids:[],								//选中的用户列表
				page:1,
				pagesize:10,
				sort:"",									//排序
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,									//数据总数
				button_list:{},
				loading:false,
				dialog:false,								//添加/编辑/详情弹窗
				dialog_type:'',								//弹窗类型
				dialog_title:'',							//弹窗标题
				contract_terms_list:[{
					label:"保证金",
					value:1
				},{
					label:"开店费",
					value:2
				},{
					label:"授权费",
					value:3
				},{
					label:"品牌管理费",
					value:4
				},{
					label:"店铺数量",
					value:5
				}],											//合同条款列表
				company_id:"",								//点击的公司
				detail_data:{},
				info:{
					main_body_type:"",
					company_alias:"",
					legal_person:"",
					original_belong:"",	
					contacts_address:"",
					contract_terms:"",
					company_admin_id:"",
					business_license_number:"",
					operator_tel:"",
					operator_gender:"",
					contacts:"",
					current_belong:"",
					remark:"",
					company_name:"",
					register_address:"",
					operator_id_card:"",
					contacts_tel:"",
					is_transfer_out:"",
					new_apply:"",
					business_license_url:"",
					id_card_url:"",
					contract_url:"",							
				},
				business_license:[],						//营业执照
				id_card:[],									//身份证
				import_dialog:false,						//导入弹窗
			}
		},
		created(){
			//获取管理员列表
			this.ajaxCompanyAdmin();
			//获取用户列表
			this.ajaxUser();
			//获取数据
			this.getData();
		},
		methods:{
			//获取管理员列表
			ajaxCompanyAdmin(){
				operationResource.ajaxCompanyAdmin().then(res => {
					if(res.data.code == 1){
						this.admin_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取用户列表
			ajaxUser(){
				formDataResource.ajaxUser().then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序回调
			sortCallBack(sort){
				this.sort = sort;
				//获取列表
				this.getData();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//下载模版
			downTemplate(){
				window.open(`${this.downLoadUrl}/主体资料导入模板.xlsx`);
			},
			//导入
			uploadCsv(e){
				let files = e.target.files;
				if (files.length > 0) {
					operationResource.importCompany({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.import_dialog = false;
							this.page = 1;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取数据
			getData(){
				let arg = {
					company_name:this.company_name,
					company_alias:this.company_alias,
					main_body_type:this.main_body_type_id,
					company_admin_id:this.user_ids.join(','),
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				this.loading = true;
				operationResource.mainBodyInfo(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.domain = data.domain;
						this.title_list = data.title_list;
						this.title_list.map(item => {
							if(item.row_field_name == 'company_name' || item.row_field_name == 'business_license_number' || item.row_field_name == 'register_address' || item.row_field_name == 'operator_id_card' || item.row_field_name == 'original_belong' || item.row_field_name == 'current_belong' || item.row_field_name == 'contract_url' || item.row_field_name == 'business_license_url' || item.row_field_name == 'id_card_url'){
								item['width'] = '160px'
							}else{
								item['width'] = '100px'
							}
						})
						this.table_data = data.table_data.data;
						this.table_data.map(item => {
							if(item.id_card_url){
								let id_card_arr = [];
								item.id_card_url.split(',').map(id_card_item => {
									id_card_arr.push(data.domain + id_card_item);
								})
								item['id_card_url'] = id_card_arr.join(',');
							}else{
								item['id_card_url'] = '';
							}
							if(item.business_license_url){
								let business_license_arr = [];
								item.business_license_url.split(',').map(business_license_item => {
									business_license_arr.push(data.domain + business_license_item);
								})
								item['business_license_url'] = business_license_arr.join(',');
							}else{
								item['business_license_url'] = '';
							}
						})
						this.total = data.table_data.total;
						this.button_list = data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//添加/编辑/详情
			editFn(company_id,type){
				this.dialog = true;
				if(type == 'edit'){
					this.dialog_type = type;
					this.company_id = company_id;
					operationResource.mainBodyEditGet({company_id:company_id}).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							for(let info_k in this.info){
								for(let data_k in data){
									if(info_k == data_k){
										if(info_k == 'main_body_type' || info_k == 'is_transfer_out' || info_k == 'operator_gender' || info_k == 'contract_terms'){
											this.info[info_k] = data[data_k] === 0?'':data[data_k];
										}else{
											this.info[info_k] = data[data_k];
										}
										
									}
								}
							}
							if(data.id_card_url){
								this.id_card = [];
								data.id_card_url.split(',').map(image_item => {
									let image_obj = {
										domain:this.domain,
										urls:image_item,
										is_del:false
									}
									this.id_card.push(image_obj);
								})
							}
							if(data.business_license_url){
								this.business_license = [];
								data.business_license_url.split(',').map(image_item => {
									let image_obj = {
										domain:this.domain,
										urls:image_item,
										is_del:false
									}
									this.business_license.push(image_obj);
								})
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					this.dialog_title = '编辑主体';
				}else if(type == 'detail'){		//主体详情
					this.dialog_type = type;
					operationResource.mainBodyInfoDetail({company_id:company_id}).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.detail_data = data;
							for(let info_k in this.info){
								for(let data_k in data){
									if(info_k == data_k){
										this.info[info_k] = data[data_k]
									}
								}
							}

							if(data.id_card_url){
								this.id_card = [];
								data.id_card_url.split(',').map(image_item => {
									let image_obj = {
										domain:this.domain,
										urls:image_item,
										is_del:false
									}
									this.id_card.push(image_obj);
								})
							}
							if(data.business_license_url){
								this.business_license = [];
								data.business_license_url.split(',').map(image_item => {
									let image_obj = {
										domain:this.domain,
										urls:image_item,
										is_del:false
									}
									this.business_license.push(image_obj);
								})
							}
						}else{
							this.$message.warning(res.data.msg);
						}
					})
					this.dialog_title = '主体详情';
				}else{
					let mainBodyInfo = localStorage.getItem('mainBodyInfo');
					if(mainBodyInfo){
						this.info = JSON.parse(mainBodyInfo);
						if(this.info.id_card_url){
							this.id_card = [];
							this.info.id_card_url.split(',').map(image_item => {
								let image_obj = {
									domain:this.domain,
									urls:image_item,
									is_del:false
								}
								this.id_card.push(image_obj);
							})
						}
						if(this.info.business_license_url){
							this.business_license = [];
							this.info.business_license_url.split(',').map(image_item => {
								let image_obj = {
									domain:this.domain,
									urls:image_item,
									is_del:false
								}
								this.business_license.push(image_obj);
							})
						}
					}else{
						this.closeDialog();
					}
					this.dialog_type = type;
					this.dialog_title = '添加主体';
				}

			},
			//设置添加信息缓存
			setLocalStorage(){
				if(this.dialog_type == 'add'){
					localStorage.setItem('mainBodyInfo',JSON.stringify(this.info));
				}
			},
			//营业执照上传回调
			businessLicenseCallBack(v){
				this.info.business_license_url = v.join(',');
				this.setLocalStorage();
			},
			//身份证上传回调
			idCardCallBack(v){
				this.info.id_card_url = v.join(',');
				this.setLocalStorage();
			},
			//合同pdf上传回调
			uploadPdf(urls){
				this.info.contract_url = urls;
				this.setLocalStorage();
			},
			// 弹窗关闭
			closeDialog(){
				this.info = {
					main_body_type:"",
					company_alias:"",
					legal_person:"",
					original_belong:"",	
					contacts_address:"",
					contract_terms:"",
					company_admin_id:"",
					business_license_number:"",
					operator_tel:"",
					operator_gender:"",
					contacts:"",
					current_belong:"",
					remark:"",
					company_name:"",
					register_address:"",
					operator_id_card:"",
					contacts_tel:"",
					is_transfer_out:"",
					new_apply:"",
					business_license_url:"",
					id_card_url:"",
					contract_url:"",							
				}
				this.business_license = [];						//营业执照
				this.id_card = [];									//身份证
			},
			//弹窗底部保存
			commitAduit(){
				let arg = JSON.parse(JSON.stringify(this.info));
				// if(arg.company_alias == ''){
				// 	this.$message.warning('请输入主体简称!')
				// }else if(arg.legal_person == ''){
				// 	this.$message.warning('请输入法人!')
				// }else if(arg.original_belong == ''){
				// 	this.$message.warning('请输入主体原归属!')
				// }else if(arg.contacts_address == ''){
				// 	this.$message.warning('请输入联系地址!')
				// }else if(arg.contract_terms == ''){
				// 	this.$message.warning('请选择合同条款!')
				// }else if(this.business_license.length == 0){
				// 	this.$message.warning('至少上传一张营业执照!')
				// }else if(arg.remark == ''){
				// 	this.$message.warning('请输入备注!')
				// }else if(arg.company_admin_id == ''){
				// 	this.$message.warning('请选择管理员!')
				// }else if(arg.business_license_number == ''){
				// 	this.$message.warning('请输入营业执照号!')
				// }else if(arg.operator_tel == ''){
				// 	this.$message.warning('请输入经营人电话!')
				// }else if(arg.operator_gender == ''){
				// 	this.$message.warning('请选择经营人性别!')
				// }else if(arg.contacts == ''){
				// 	this.$message.warning('请输入联系人!')
				// }else if(arg.current_belong == ''){
				// 	this.$message.warning('请输入主体现归属!')
				// }else if(this.id_card.length == 0){
				// 	this.$message.warning('至少上传一张身份证照片!')
				// }else if(arg.company_name == ''){
				// 	this.$message.warning('请输入公司全称!')
				// }else if(arg.register_address == ''){
				// 	this.$message.warning('请输入注册地址!')
				// }else if(arg.operator_id_card == ''){
				// 	this.$message.warning('请输入经营人身份证!')
				// }else if(arg.contacts_tel == ''){
				// 	this.$message.warning('请输入联系人电话!')
				// }else if(arg.contract_url == ''){
				// 	this.$message.warning('请上传合同PDF!')
				// }else if(arg.new_apply == ''){
				// 	this.$message.warning('请输入新客申请!')
				// }else{
				arg.main_body_type = arg.main_body_type === ''?0:arg.main_body_type;
				arg.is_transfer_out = arg.is_transfer_out === ''?0:arg.is_transfer_out;
				arg.operator_gender = arg.operator_gender === ''?0:arg.operator_gender;
				arg.contract_terms = arg.contract_terms === ''?0:arg.contract_terms;
					if(this.dialog_type == 'add'){		//添加
						operationResource.mainBodyAdd(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取数据
								this.getData();
								this.dialog = false;
								this.closeDialog();
								localStorage.removeItem('mainBodyInfo');
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(this.dialog_type == 'edit'){	//编辑
						arg['company_id'] = this.company_id;
						operationResource.mainBodyEdit(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								//获取数据
								this.getData();
								this.dialog = false;
								this.closeDialog();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				// }
				},
			//导出
				exportFn(){
					MessageBox.confirm('确认导出?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let arg = {
							company_name:this.company_name,
							company_alias:this.company_alias,
							main_body_type:this.main_body_type_id,
							company_admin_id:this.user_ids.join(','),
							sort:this.sort
						}
						operationResource.mainBodyInfoExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'公司主体资料表');
							}
						})
					}).catch(() => {
						Message({
							type: 'info',
							message: '取消导出'
						});          
					});
				},
			//pdf预览
				viewPdf(field_name,table_name,value,row_field_name){
					if(row_field_name == 'contract_url'){
						window.open(this.domain + value)
					}
				},
			//详情pdf预览
				openPdf(value){
					if(row_field_name == 'contract_url' && value != ''){
						window.open(this.domain + value)
					}
				}
			},
			components:{
				CustomTable,
				PageWidget,
				UploadsFile,
				UploadPdf
			}
		}
	</script>
	<style type="text/css">
		.label_bold .el-form-item__label{
			font-weight: bold;
		}
	</style>
	<style lang="less" scoped>
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