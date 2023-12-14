<template>
    <div>
        <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item label="店铺：">
                <el-input v-model="shop_name" placeholder="开店名称/授权名称"></el-input>
            </el-form-item>
            <el-form-item label="管理员：">
                <el-select v-model="user_ids" clearable multiple filterable reserve-keyword placeholder="请选择管理员" collapse-tags>
                    <el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="授权类型：">
                <el-select v-model="auth_type_id" clearable placeholder="请选择授权类型">
                    <el-option v-for="item in auth_type_list" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户：">
                <el-select v-model="company_ids" clearable multiple filterable reserve-keyword placeholder="请选择客户" collapse-tags>
                    <el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开店状态：">
                <el-select v-model="shop_status_ids" clearable multiple filterable reserve-keyword placeholder="请选择开店状态" collapse-tags>
                    <el-option v-for="item in shop_status_list" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="handlePageChange(1)">搜索</el-button>
            </el-form-item>
        </el-form>
        <div class="flex jse mb-15">
            <el-button type="primary" plain icon="el-icon-plus" size="small" @click="editFn('','add')" v-if="button_list.add == 1">添加</el-button>
            <el-button type="primary" plain size="mini" @click="exportFn" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
        </div>
        <CustomTable v-loading="loading" :isLoading="loading" tableName="basic_auth_info" max_height="620px" :table_data="table_data" :title_list="title_list" :is_setting="true" :button_list="button_list" fieldName="company_id" :is_custom_sort="false" @sortCallBack="sortCallBack" @editFn="editFn($event,'edit')" @detailFn="editFn($event,'detail')" @tableCallBack="viewPdf"/>
        <page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
        <!-- 添加/编辑/详情 -->
        <el-dialog :title="dialog_title" width="1200px" @close="closeDialog" :close-on-click-modal="false" :visible.sync="dialog">
            <div class="flex jsb">
                <el-form style="width: 360px;" size="small" label-width="110px">
                    <el-form-item label="授权类型：">
                        <div v-if="dialog_type == 'detail'">{{info.auth_type}}</div>
                        <el-select v-model="info.auth_type" placeholder="请选择授权类型" v-else>
                            <el-option v-for="item in auth_type_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="新开/授权：">
                        <div v-if="dialog_type == 'detail'">{{info.is_new}}</div>
                        <el-select v-model="info.is_new" placeholder="请选择是否新开" v-else>
                            <el-option v-for="item in is_new_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺类型：">
                        <div v-if="dialog_type == 'detail'">{{info.shop_type}}</div>
                        <el-select v-model="info.shop_type" placeholder="请选择店铺类型" v-else>
                            <el-option v-for="item in shop_type_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="运营状态：">
                        <div v-if="dialog_type == 'detail'">{{info.operational_status}}</div>
                        <el-select v-model="info.operational_status" placeholder="请选择运营状态" v-else>
                            <el-option v-for="item in operational_status_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺手机号码：">
                        <div v-if="dialog_type == 'detail'">{{info.shop_tel}}</div>
                        <el-input type="number" v-model="info.shop_tel" placeholder="请输入店铺手机号码" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="授权提交日：">
                        <div v-if="dialog_type == 'detail'">{{info.auth_date}}</div>
                        <el-date-picker value-format="yyyy-MM-dd" v-model="info.auth_date" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="开店情况：">
                        <div v-if="dialog_type == 'detail'">{{info.shop_situation}}</div>
                        <el-input v-model="info.shop_situation" placeholder="请输入开店情况" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="聚水潭账号：">
                        <div v-if="dialog_type == 'detail'">{{info.jst_id}}</div>
                        <el-input v-model="info.jst_id" placeholder="请输入聚水潭账号" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="聚水潭密码：">
                        <div v-if="dialog_type == 'detail'">{{info.jst_password}}</div>
                        <el-input v-model="info.jst_password" placeholder="请输入聚水潭密码" v-else></el-input>
                    </el-form-item>
                </el-form>
                <el-form style="width: 360px;" size="small" label-width="110px">
                    <el-form-item label="管理员：">
                        <div v-if="dialog_type == 'detail'">{{info.company_admin_name}}</div>
                        <el-select v-model="info.shop_admin_id" clearable placeholder="请选择管理员" v-else>
                            <el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授权名称：">
                        <div v-if="dialog_type == 'detail'">{{info.auth_shop_name}}</div>
                        <el-input v-model="info.auth_shop_name" placeholder="请输入授权名称" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="开店名称：">
                        <div v-if="dialog_type == 'detail'">{{info.shop_name}}</div>
                        <el-input v-model="info.shop_name" placeholder="请输入开店名称" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="号码保管人：">
                        <div v-if="dialog_type == 'detail'">{{info.tel_custodian}}</div>
                        <el-select v-model="info.tel_custodian" clearable placeholder="请选择号码保管人" v-else>
                            <el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授权到期日：">
                        <div v-if="dialog_type == 'detail'">{{info.auth_expires_date}}</div>
                        <el-date-picker value-format="yyyy-MM-dd" v-model="info.auth_expires_date" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="账号ID：">
                        <div v-if="dialog_type == 'detail'">{{info.account_id}}</div>
                        <el-input type="number" v-model="info.account_id" placeholder="请输入授权名称" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="子账号：">
                        <div v-if="dialog_type == 'detail'">{{info.sub_account}}</div>
                        <el-input v-model="info.sub_account" placeholder="请输入子账号" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="子账号电话：">
                        <div v-if="dialog_type == 'detail'">{{info.sub_account_tel}}</div>
                        <el-input type="number" v-model="info.sub_account_tel" placeholder="请输入授权名称" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="子账号密码：">
                        <div v-if="dialog_type == 'detail'">{{info.sub_account_password}}</div>
                        <el-input v-model="info.sub_account_password" placeholder="请输入子账号密码" v-else></el-input>
                    </el-form-item>
                </el-form>
                <el-form style="width: 360px;" size="small" label-width="110px">
                    <el-form-item label="客户：">
                        <div v-if="dialog_type == 'detail'">{{info.company_id}}</div>
                        <el-select v-model="info.company_id" clearable placeholder="请选择客户" @change="getCompany" v-else>
                            <el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺领用：">
                        <div v-if="dialog_type == 'detail'">{{info.store_requisition}}</div>
                        <el-input v-model="info.store_requisition" placeholder="请输入店铺领用" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="OA流程编号：">
                        <div v-if="dialog_type == 'detail'">{{info.oa_id}}</div>
                        <el-input v-model="info.oa_id" placeholder="请输入OA流程编号" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="授权PDF：">
                        <UploadPdf :fileName="info.auth_file_url" :onlyView="dialog_type == 'detail'" @callbackFn="uploadPdf"/>
                    </el-form-item>
                    <el-form-item label="平台：">
                        <div v-if="dialog_type == 'detail'">{{info.platform}}</div>
                        <el-select v-model="info.platform" clearable placeholder="请选择平台" v-else>
                            <el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开店状态：">
                        <el-select v-model="info.shop_status" clearable placeholder="请选择开店状态">
                            <el-option v-for="item in shop_status_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺分销：">
                        <div v-if="dialog_type == 'detail'">{{info.store_distribution}}</div>
                        <el-input v-model="info.store_distribution" placeholder="请输入店铺分销" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="授权确认：">
                        <div v-if="dialog_type == 'detail'">{{info.auth_confirm}}</div>
                        <el-input v-model="info.auth_confirm" placeholder="请输入授权确认" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="备注：">
                        <div v-if="dialog_type == 'detail'">{{info.remark}}</div>
                        <el-input type="textarea" :rows="3" v-model="info.remark" placeholder="请输入备注" v-else></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer flex jc" v-if="dialog_type != 'detail'">
                <el-button type="primary" size="small" @click="commitAduit">保存</el-button>
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
    import auditResource from '../../../api/auditResource.js'
    import UploadPdf from '../../../components/upload_pdf.vue'
    export default{
        data(){
            return{
                domain:"",
                shop_name:"",                               //店铺名称/授权名称
                auth_type_list:[{
                    value:1,
                    label:'店铺授权'
                },{
                    value:2,
                    label:'生产授权'
                }],                                         //授权类型列表
                auth_type_id:"",                            //选中的授权类型
                user_list:[],                               //管理员列表
                user_ids:[],                                //选中的管理员列表
                company_list:[],                            //客户列表
                company_ids:[],                             //选中的客户列表
                shop_status_list:[{
                    value:1,
                    label:'开店成功'
                },{
                    value:2,
                    label:'开店中'
                },{
                    value:0,
                    label:'开店失败'
                }],                                         //开店状态列表
                shop_status_ids:[],                         //选中的开店状态
                page:1,
                pagesize:10,
                sort:"",                                    //排序
                title_list:[],                              //表头数据
                table_data:[],                              //表格数据
                total:0,                                    //数据总数
                button_list:{},
                loading:false,
                dialog:false,                               //添加/编辑/详情弹窗
                dialog_type:'',                             //弹窗类型
                dialog_title:'',                            //弹窗标题
                is_new_list:[{
                    value:1,
                    label:'新开'
                },{
                    value:0,
                    label:'续费'
                }],                                         //新开/授权列表
                operational_status_list:[{
                    value:1,
                    label:'新开'
                },{
                    value:0,
                    label:'续费'
                }],                                         //运营状态
                plat_list:[],                               //平台列表
                shop_type_list:[{
                    value:1,
                    label:'旗舰店'
                },{
                    value:2,
                    label:'企业店'
                },{
                    value:3,
                    label:'专卖店'
                },{
                    value:4,
                    label:'工厂店'
                }],                                         //店铺类型
                info:{
                    auth_type:1,
                    is_new:"",
                    shop_type:"",
                    operational_status:"",
                    shop_tel:"",
                    auth_date:"",
                    shop_situation:"",
                    sub_account_password:"",
                    jst_password:"",
                    shop_admin_id:"",
                    auth_shop_name:"",
                    shop_name:"",
                    tel_custodian:"",
                    auth_expires_date:"",
                    account_id:"",
                    sub_account_tel:"",
                    sub_account:"",
                    company_id:"",
                    store_requisition:"",
                    oa_id:"",
                    jst_id:"",
                    platform:"",
                    auth_file_url:"",
                    shop_status:"",
                    store_distribution:"",
                    auth_confirm:"",
                    remark:""
                },
                new_info:{
                    company_name:"",
                    company_alias:"",
                    business_license_number:"",
                    register_address:"",
                    operator_tel:"",
                    operator_id_card:"",
                    current_belong:"",
                    business_license_url:"",
                    id_card_url:"",
                }
            }
        },
        created(){
            //获取用户列表
            this.ajaxUser();
            //获取客户(公司主体)列表
            this.ajaxCompany();
            //平台列表
            this.ajaxPlatform();
            //获取数据
            this.getData();
        },
        methods:{
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
            //获取客户(公司主体)列表
            ajaxCompany(){
                operationResource.ajaxCompany().then(res => {
                    if(res.data.code == 1){
                        this.company_list = res.data.data;
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            //平台列表
            ajaxPlatform(){
                auditResource.ajaxPlatform().then(res => {
                    if(res.data.code == 1){
                        this.plat_list = res.data.data;
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
            //获取数据
            getData(){
                let arg = {
                    shop_admin_id:this.user_ids.join(','),
                    company_id:this.company_ids.join(','),
                    shop_name:this.shop_name,
                    shop_status:this.shop_status_ids.join(','),
                    auth_type:this.auth_type_id,
                    page:this.page,
                    pagesize:this.pagesize,
                    sort:this.sort
                }
                this.loading = true;
                operationResource.companyMainShopList(arg).then(res => {
                    if(res.data.code == 1){
                        this.loading = false;
                        let data = res.data.data;
                        this.domain = data.domain;
                        this.title_list = data.title_list;
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
                this.dialog_type = type;
                this.dialog = true;
                if(type == 'edit'){
                    this.company_id = company_id;
                    operationResource.mainBodyEditGet({company_id:company_id}).then(res => {
                        if(res.data.code == 1){
                            let data = res.data.data;
                            for(let info_k in this.info){
                                for(let data_k in data){
                                    if(info_k == data_k){
                                        this.info[info_k] = data[data_k]
                                    }
                                }
                            }
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                    this.dialog_title = '编辑主体';
                }else if(type == 'detail'){     //主体详情
                    operationResource.mainBodyInfoDetail({company_id:company_id}).then(res => {
                        if(res.data.code == 1){
                            let data = res.data.data;
                            for(let info_k in this.info){
                                for(let data_k in data){
                                    if(info_k == data_k){
                                        this.info[info_k] = data[data_k]
                                    }
                                }
                            }

                            if(data.id_card_url){
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
                    this.dialog_title = '添加主体';
                }

            },
            //根据客户切换获取信息
            getCompany(company_id){
                operationResource.mainBodyEditGet({company_id:company_id}).then(res => {
                    if(res.data.code == 1){
                        let data = res.data.data;
                        for(let n_k in this.new_info){
                            for(let k in data){
                                if(n_k == k){
                                    this.new_info[n_k] = data[k];
                                }
                            }
                        }
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            // 弹窗关闭
            closeDialog(){
                this.info = {
                    auth_type:1,
                    is_new:"",
                    shop_type:"",
                    operational_status:"",
                    shop_tel:"",
                    auth_date:"",
                    shop_situation:"",
                    sub_account_password:"",
                    jst_password:"",
                    shop_admin_id:"",
                    auth_shop_name:"",
                    shop_name:"",
                    tel_custodian:"",
                    auth_expires_date:"",
                    account_id:"",
                    sub_account_tel:"",
                    sub_account:"",
                    company_id:"",
                    store_requisition:"",
                    oa_id:"",
                    jst_id:"",
                    platform:"",
                    auth_file_url:"",
                    shop_status:"",
                    store_distribution:"",
                    auth_confirm:"",
                    remark:""
                }
            },
            //弹窗底部保存
            commitAduit(){
                let arg = JSON.parse(JSON.stringify(this.info));
                console.log(arg)
                let new_info = JSON.parse(JSON.stringify(this.new_info));
                console.log(new_info)
                if(arg.auth_shop_name == ''){
                    this.$message.warning('请输入授权名称!')
                }else{
                    arg.is_new = arg.is_new == ''?0:arg.is_new;
                    arg.shop_type = arg.shop_type == ''?0:arg.shop_type;
                    var new_arg = {...arg,...new_info};
                    console.log(new_arg)
                    return;
                    if(this.dialog_type == 'add'){      //添加
                        operationResource.companyMainAddShop(arg).then(res => {
                            if(res.data.code == 1){
                                this.$message.success(res.data.msg);
                                //获取数据
                                this.getData();
                                this.dialog = false;
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        })
                    }else if(this.dialog_type == 'edit'){   //编辑
                        operationResource.companyMainEditShop(arg).then(res => {
                            if(res.data.code == 1){
                                this.$message.success(res.data.msg);
                                //获取数据
                                this.getData();
                                this.dialog = false;
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        })
                    }
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
                        shop_admin_id:this.user_ids.join(','),
                        company_id:this.company_ids.join(','),
                        shop_name:this.shop_name,
                        shop_status:this.shop_status_ids.join(','),
                        auth_type:this.auth_type_id,
                        sort:this.sort
                    }
                    operationResource.companyMainShopListExport(arg).then(res => {
                        if(res){
                            exportPost("\ufeff" + res.data,'店铺基础授权资料');
                        }
                    })
                }).catch(() => {
                    Message({
                        type: 'info',
                        message: '取消导出'
                    });          
                });
            },
            //合同pdf上传回调
            uploadPdf(urls){
                this.info.auth_file_url = urls;
            },
            //pdf预览
            viewPdf(field_name,table_name,value,row_field_name){
                if(row_field_name == 'contract_url'){
                    window.open(this.domain + value)
                }
            }
        },
        components:{
            CustomTable,
            PageWidget,
            UploadPdf
        }
    }
</script>
<style lang="less" scoped>

</style>