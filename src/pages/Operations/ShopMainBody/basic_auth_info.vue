<template>
    <div>
        <el-form :inline="true" size="small" class="demo-form-inline">
            <el-form-item label="店铺：">
                <el-input v-model="shop_name" placeholder="开店名称/授权名称"></el-input>
            </el-form-item>
            <el-form-item label="管理员：">
                <el-select v-model="user_ids" clearable multiple filterable reserve-keyword placeholder="请选择管理员" collapse-tags>
                    <el-option v-for="item in admin_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
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
        <CustomTable v-loading="loading" :isLoading="loading" tableName="basic_auth_info" max_height="620px" setting_width="160px" :table_data="table_data" :title_list="title_list" :is_setting="true" :button_list="button_list" fieldName="company_shop_id" :is_custom_sort="false" @sortCallBack="sortCallBack" @editFn="editFn($event,'edit')" @detailFn="editFn($event,'detail')" @tableCallBack="tableCallBack" @transferFn="transferFn"/>
        <page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
        <!-- 添加/编辑/详情 -->
        <el-dialog v-el-drag-dialog :title="dialog_title" width="1200px" top="30px" :close-on-click-modal="false" :visible.sync="dialog">
            <div class="flex jsb">
                <el-form class="label_bold" style="width: 360px;" size="small" label-width="130px">
                    <el-form-item label="授权类型：" required>
                        <div v-if="dialog_type == 'detail'">{{info.auth_type}}</div>
                        <el-select v-model="info.auth_type" placeholder="请选择授权类型" @change="setLocalStorage" v-else>
                            <el-option v-for="item in auth_type_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="新开/授权：" required>
                        <div v-if="dialog_type == 'detail'">{{info.is_new}}</div>
                        <el-select v-model="info.is_new" clearable placeholder="新开/授权" @change="setLocalStorage" v-else>
                            <el-option v-for="item in is_new_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺类型：" required>
                        <div v-if="dialog_type == 'detail'">{{info.shop_type}}</div>
                        <el-select v-model="info.shop_type" clearable placeholder="请选择店铺类型" @change="setLocalStorage" v-else>
                            <el-option v-for="item in shop_type_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="运营状态：" required>
                        <div v-if="dialog_type == 'detail'">{{info.operational_status}}</div>
                        <el-select v-model="info.operational_status" clearable placeholder="请选择运营状态" @change="setLocalStorage" v-else>
                            <el-option v-for="item in operational_status_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺手机号码：" required>
                        <div v-if="dialog_type == 'detail'">{{info.shop_tel}}</div>
                        <el-input type="number" v-model="info.shop_tel" @change="setLocalStorage" placeholder="请输入店铺手机号码" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="授权提交日：" required>
                        <div v-if="dialog_type == 'detail'">{{info.auth_date}}</div>
                        <el-date-picker value-format="yyyy-MM-dd" v-model="info.auth_date" type="date" placeholder="选择日期" @change="setLocalStorage" v-else>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="开店情况：" required>
                        <div v-if="dialog_type == 'detail'">{{info.shop_situation}}</div>
                        <el-input v-model="info.shop_situation" placeholder="请输入开店情况" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="聚水潭账号：" required> 
                        <div v-if="dialog_type == 'detail'">{{info.jst_id}}</div>
                        <el-input v-model="info.jst_id" placeholder="请输入聚水潭账号" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="聚水潭密码：" required>
                        <div v-if="dialog_type == 'detail'">{{info.jst_password}}</div>
                        <el-input v-model="info.jst_password" placeholder="请输入聚水潭密码" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                </el-form>
                <el-form class="label_bold" style="width: 360px;" size="small" label-width="110px">
                    <el-form-item label="管理员：" required>
                        <div v-if="dialog_type == 'detail'">{{detail_data.shop_admin_name}}</div>
                        <el-select v-model="info.shop_admin_id" clearable filterable placeholder="请选择管理员" @change="setLocalStorage" v-else>
                            <el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授权名称：" required>
                        <div v-if="dialog_type == 'detail'">{{info.auth_shop_name}}</div>
                        <el-input v-model="info.auth_shop_name" placeholder="请输入授权名称" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="开店名称：" required>
                        <div v-if="dialog_type == 'detail'">{{info.shop_name}}</div>
                        <el-input v-model="info.shop_name" placeholder="请输入开店名称" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="号码保管人：" required>
                        <div v-if="dialog_type == 'detail'">{{info.tel_custodian}}</div>
                        <el-select v-model="info.tel_custodian" clearable filterable placeholder="请选择号码保管人" @change="setLocalStorage" v-else>
                            <el-option v-for="item in user_list" :key="item.ding_user_id" :label="item.ding_user_name" :value="item.ding_user_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="授权到期日：" required>
                        <div v-if="dialog_type == 'detail'">{{info.auth_expires_date}}</div>
                        <el-date-picker value-format="yyyy-MM-dd" v-model="info.auth_expires_date" type="date" placeholder="选择日期" @change="setLocalStorage" v-else>
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="账号ID：" required>
                        <div v-if="dialog_type == 'detail'">{{info.account_id}}</div>
                        <el-input type="number" v-model="info.account_id" placeholder="请输入账号ID" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="子账号：" required>
                        <div v-if="dialog_type == 'detail'">{{info.sub_account}}</div>
                        <el-input v-model="info.sub_account" placeholder="请输入子账号" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="子账号电话：" required>
                        <div v-if="dialog_type == 'detail'">{{info.sub_account_tel}}</div>
                        <el-input type="number" v-model="info.sub_account_tel" placeholder="请输入授权名称" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="子账号密码：" required>
                        <div v-if="dialog_type == 'detail'">{{info.sub_account_password}}</div>
                        <el-input v-model="info.sub_account_password" placeholder="请输入子账号密码" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                </el-form>
                <el-form class="label_bold" style="width: 360px;" size="small" label-width="120px">
                    <el-form-item label="主体简称：" required>
                        <div v-if="dialog_type == 'detail'">{{detail_data.company_alias}}</div>
                        <el-select v-model="info.company_id" :disabled="dialog_type == 'edit'" clearable filterable placeholder="请选择主体简称" @change="getCompany" v-else>
                            <el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺领用：" required>
                        <div v-if="dialog_type == 'detail'">{{info.store_requisition}}</div>
                        <el-input v-model="info.store_requisition" placeholder="请输入店铺领用" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="OA流程编号：" required>
                        <div v-if="dialog_type == 'detail'">{{info.oa_id}}</div>
                        <el-input v-model="info.oa_id" placeholder="请输入OA流程编号" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="授权PDF：" required>
                        <UploadPdf :fileName="info.auth_file_url" :onlyView="dialog_type == 'detail'" :requestDel="dialog_type == 'add'" @callbackFn="uploadPdf" @viewPdf="openPdf"/>
                    </el-form-item>
                    <el-form-item label="平台：" required>
                        <div v-if="dialog_type == 'detail'">{{info.platform}}</div>
                        <el-select v-model="info.platform" clearable placeholder="请选择平台" @change="setLocalStorage" v-else>
                            <el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="开店状态：" required>
                        <div v-if="dialog_type == 'detail'">{{info.shop_status}}</div>
                        <el-select v-model="info.shop_status" clearable placeholder="请选择开店状态" @change="setLocalStorage" v-else>
                            <el-option v-for="item in shop_status_list" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="店铺分销：" required>
                        <div v-if="dialog_type == 'detail'">{{info.store_distribution}}</div>
                        <el-input v-model="info.store_distribution" placeholder="请输入店铺分销" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="授权确认：" required>
                        <div v-if="dialog_type == 'detail'">{{info.auth_confirm}}</div>
                        <el-input v-model="info.auth_confirm" placeholder="请输入授权确认" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                    <el-form-item label="备注：" required>
                        <div v-if="dialog_type == 'detail'">{{info.remark}}</div>
                        <el-input type="textarea" :rows="3" v-model="info.remark" placeholder="请输入备注" @change="setLocalStorage" v-else></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer flex jc" v-if="dialog_type != 'detail'">
                <el-button type="primary" size="small" @click="commitAduit">保存</el-button>
            </div>
        </el-dialog>
        <!-- 转移主体 -->
        <el-dialog v-el-drag-dialog title="转移主体" width="450px" :close-on-click-modal="false" :visible.sync="transfer_dialog">
            <div>

                <el-form size="small">
                    <el-form-item>
                        <div>店铺【{{transfer_shop_name}}】，现主体【{{company_name}}】</div>
                    </el-form-item>
                    <el-form-item label="主体简称：">
                        <el-select v-model="company_id" filterable placeholder="请选择主体简称">
                            <el-option v-for="item in company_list" :key="item.company_id" :label="item.company_name" :value="item.company_id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer" >
                <el-button size="small" @click="transfer_dialog = false">取消</el-button>
                <el-button type="primary" size="small" @click="transferConfirm">确认</el-button>
            </div>
        </el-dialog>
        <!-- 账号信息 -->
        <el-dialog v-el-drag-dialog title="账号信息" width="350px" @close="detail_data = {}" :close-on-click-modal="false" :visible.sync="account_dialog">
            <el-form class="label_bold" size="small" label-width="110px">
                <el-form-item label="平台：">
                    <div>{{detail_data.platform}}</div>
                </el-form-item>
                <el-form-item label="授权名称：">
                    <div>{{detail_data.auth_shop_name}}</div>
                </el-form-item>
                <el-form-item label="开店名称：">
                    <div>{{detail_data.shop_name}}</div>
                </el-form-item>
                <el-form-item label="账号ID：">
                    <div>{{detail_data.account_id}}</div>
                </el-form-item>
                <el-form-item label="子账号：">
                    <div>{{detail_data.sub_account}}</div>
                </el-form-item>
                <el-form-item label="子账号密码：">
                    <div>{{detail_data.sub_account_password}}</div>
                </el-form-item>
                <el-form-item label="子账号电话：">
                    <div>{{detail_data.sub_account_tel}}</div>
                </el-form-item>
                <el-form-item label="聚水潭账号：">
                    <div>{{detail_data.jst_id}}</div>
                </el-form-item>
                <el-form-item label="聚水潭密码：">
                    <div>{{detail_data.jst_password}}</div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 变更记录 -->
        <el-dialog v-el-drag-dialog title="店铺主体变更记录" width="1240px" top="30px" @close="" :close-on-click-modal="false" :visible.sync="log_dialog">
            <el-table :data="log_data" tooltip-effect="dark" style="width: 100%" max-height="600" :header-cell-style="{'background':'#f4f4f4'}" :row-class-name="tableRowClassName" border>
                <el-table-column prop="supplier" show-overflow-tooltip label="变更次数" align="center">
                    <template slot-scope="scope">
                        <div>{{log_data.length - scope.$index}}次</div>
                    </template>
                </el-table-column>
                <el-table-column prop="auth_shop_name" width="120" show-overflow-tooltip label="授权名称" align="center"></el-table-column>
                <el-table-column prop="shop_name" width="120" show-overflow-tooltip label="开店名称" align="center"></el-table-column>
                <el-table-column prop="add_user_name" width="160" show-overflow-tooltip label="变更操作人" align="center">
                </el-table-column>
                <el-table-column prop="company_name" width="180" show-overflow-tooltip label="主体变更" align="center">
                    <template slot-scope="scope">
                        <div>变更前主体：{{scope.row.old_info.company_name}}</div>
                        <div class="divider"></div>
                        <div>现主体：{{scope.row.new_info.company_name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="company_alias" width="160" show-overflow-tooltip label="公司简称" align="center">
                 <template slot-scope="scope">
                    <div>{{scope.row.old_info.company_alias}}</div>
                    <div class="divider"></div>
                    <div>{{scope.row.new_info.company_alias}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="register_address" width="160" show-overflow-tooltip label="主体注册地址" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.old_info.register_address}}</div>
                    <div class="divider"></div>
                    <div>{{scope.row.new_info.register_address}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="legal_person" width="120" show-overflow-tooltip label="法人" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.old_info.legal_person}}</div>
                    <div class="divider"></div>
                    <div>{{scope.row.new_info.legal_person}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operator_tel" width="120" show-overflow-tooltip label="经营人电话" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.old_info.operator_tel}}</div>
                    <div class="divider"></div>
                    <div>{{scope.row.new_info.operator_tel}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="operator_tel" width="160" show-overflow-tooltip label="经营人身份证号" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.old_info.operator_id_card}}</div>
                    <div class="divider"></div>
                    <div>{{scope.row.new_info.operator_id_card}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="company_name" width="120" show-overflow-tooltip label="主体归属" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.old_info.current_belong}}</div>
                    <div class="divider"></div>
                    <div>{{scope.row.new_info.current_belong}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="platform" label="经营人性别" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.old_info.operator_gender == 1">男</div>
                    <div v-if="scope.row.old_info.operator_gender == 2">女</div>
                    <div v-if="scope.row.old_info.operator_gender == 0">未设置</div>
                    <div class="divider"></div>
                    <div v-if="scope.row.new_info.operator_gender == 1">男</div>
                    <div v-if="scope.row.new_info.operator_gender == 2">女</div>
                    <div v-if="scope.row.new_info.operator_gender == 0">未设置</div>
                </template>
            </el-table-column>
            <el-table-column prop="platform" width="160" label="营业执照" align="center">
                <template slot-scope="scope">
                    <el-image :z-index="2006" class="image" :src="filterImage(scope.row.old_info.business_license_url)[0]" fit="scale-down" :preview-src-list="filterImage(scope.row.old_info.business_license_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.old_info.business_license_url).length > 0"></el-image>
                    <el-image :z-index="2006" class="image ml5" :src="filterImage(scope.row.old_info.business_license_url)[1]" fit="scale-down" :preview-src-list="filterImage(scope.row.old_info.business_license_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.old_info.business_license_url).length > 1"></el-image>
                    <div v-if="filterImage(scope.row.old_info.business_license_url).length == 0">暂无</div>
                    <div class="divider"></div>
                    <el-image :z-index="2006" class="image" :src="filterImage(scope.row.new_info.business_license_url)[0]" fit="scale-down" :preview-src-list="filterImage(scope.row.new_info.business_license_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.new_info.business_license_url).length > 0"></el-image>
                    <el-image :z-index="2006" class="image ml5" :src="filterImage(scope.row.new_info.business_license_url)[1]" fit="scale-down" :preview-src-list="filterImage(scope.row.new_info.business_license_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.new_info.business_license_url).length > 1"></el-image>
                    <div v-if="filterImage(scope.row.new_info.business_license_url).length == 0">暂无</div>
                </template>
            </el-table-column>
            <el-table-column prop="platform" width="160" label="身份证" align="center">
                <template slot-scope="scope">
                    <el-image :z-index="2006" class="image" :src="filterImage(scope.row.old_info.id_card_url)[0]" fit="scale-down" :preview-src-list="filterImage(scope.row.old_info.id_card_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.old_info.id_card_url).length > 0"></el-image>
                    <el-image :z-index="2006" class="image ml5" :src="filterImage(scope.row.old_info.id_card_url)[1]" fit="scale-down" :preview-src-list="filterImage(scope.row.old_info.id_card_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.old_info.id_card_url).length > 1"></el-image>
                    <div v-if="filterImage(scope.row.old_info.id_card_url).length == 0">暂无</div>
                    <div class="divider"></div>
                    <el-image :z-index="2006" class="image" :src="filterImage(scope.row.new_info.id_card_url)[0]" fit="scale-down" :preview-src-list="filterImage(scope.row.new_info.id_card_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.new_info.id_card_url).length > 0"></el-image>
                    <el-image :z-index="2006" class="image ml5" :src="filterImage(scope.row.new_info.id_card_url)[1]" fit="scale-down" :preview-src-list="filterImage(scope.row.new_info.id_card_url)" @click.stop="handleClickStop" v-if="filterImage(scope.row.new_info.id_card_url).length > 1"></el-image>
                    <div v-if="filterImage(scope.row.new_info.id_card_url).length == 0">暂无</div>
                </template>
            </el-table-column>
            <el-table-column prop="add_time" width="160" show-overflow-tooltip label="变更时间" align="center">
            </el-table-column>
        </el-table>
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
                admin_list:[],                              //管理员列表
                user_list:[],                               //用户列表
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
                    label:'续授权'
                }],                                         //新开/授权列表
                operational_status_list:[{
                    value:1,
                    label:'运营中'
                },{
                    value:0,
                    label:'待运营'
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
                }],                                     //店铺类型
                company_shop_id:"",                     //当前选中的店铺ID
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
                },
                detail_data:{},                         //详情信息
                account_dialog:false,                   //账号信息弹窗
                log_dialog:false,                       //变更记录弹窗
                log_data:[],                            //变更记录数据
                transfer_dialog:false,                  //转移主体弹窗
                transfer_shop_name:"",                  //开店名称
                company_name:"",                        //主体现归属
                company_id:"",                          //变更的主体id
            }
        },
        created(){
            //管理员列表
            this.ajaxCompanyShopAdmin();
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
            //管理员列表
            ajaxCompanyShopAdmin(){
                operationResource.ajaxCompanyShopAdmin().then(res => {
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
                        this.title_list.map(item => {
                            if(item.row_field_name == 'shop_tel' || item.row_field_name == 'register_address' || item.row_field_name == 'operator_id_card' || item.row_field_name == 'current_belong' || item.row_field_name == 'oa_id' || item.row_field_name == 'auth_file_url' || item.row_field_name == 'shop_situation' || item.row_field_name == 'business_license_url' || item.row_field_name == 'id_card_url'){
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
            editFn(company_shop_id,type){
                this.dialog = true;
                if(type == 'edit'){
                    this.dialog_type = type;
                    this.company_shop_id = company_shop_id;
                    operationResource.companyMainEditShopGet({company_shop_id:company_shop_id}).then(res => {
                        if(res.data.code == 1){
                            let data = res.data.data;
                            for(let info_k in this.info){
                                for(let data_k in data){
                                    if(info_k == data_k){
                                        this.info[info_k] = data[data_k]
                                    }
                                }
                            }
                            for(let info_k in this.new_info){
                                for(let data_k in data){
                                    if(info_k == data_k){
                                        this.new_info[info_k] = data[data_k]
                                    }
                                }
                            }
                            this.auth_file_name = data.auth_file_url;
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                    this.dialog_title = '编辑店铺主体授权资料';
                }else if(type == 'detail'){    
                    this.dialog_type = type; 
                    operationResource.companyMainShopInfo({company_shop_id:company_shop_id}).then(res => {
                        if(res.data.code == 1){
                            this.detail_data = res.data.data;
                            for(let info_k in this.info){
                                for(let data_k in this.detail_data){
                                    if(info_k == data_k){
                                        this.info[info_k] = this.detail_data[data_k]
                                    }
                                }
                            }
                            this.auth_file_name = this.detail_data.auth_file_url;
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                    this.dialog_title = '店铺主体授权资料详情';
                }else{
                    if(this.dialog_type != 'add'){
                        let basicAuthInfo = localStorage.getItem('basicAuthInfo');
                        let basicAuthNewInfo = localStorage.getItem('basicAuthNewInfo');
                        if(basicAuthInfo && basicAuthNewInfo){
                            this.info = JSON.parse(basicAuthInfo);
                            this.new_info = JSON.parse(basicAuthNewInfo);
                        }else{
                            this.closeDialog();
                        }
                    }
                    this.dialog_type = type;
                    this.dialog_title = '添加店铺主体授权资料';
                }

            },
            //设置添加信息缓存
            setLocalStorage(){
                if(this.dialog_type == 'add'){
                    localStorage.setItem('basicAuthInfo',JSON.stringify(this.info));
                    localStorage.setItem('basicAuthNewInfo',JSON.stringify(this.new_info));
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
                        this.setLocalStorage;
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
                this.new_info = {
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
            },
            //弹窗底部保存
            commitAduit(){
                let arg = JSON.parse(JSON.stringify(this.info));
                let new_info = JSON.parse(JSON.stringify(this.new_info));
                if(arg.is_new === ''){
                    this.$message.warning('请选择新开/授权!')
                }else if(arg.shop_type == ''){
                    this.$message.warning('请选择店铺类型!')
                }else if(arg.operational_status === ''){
                    this.$message.warning('请选择运营状态!')
                }else if(arg.shop_tel == ''){
                    this.$message.warning('请输入店铺手机号码!')
                }else if(arg.auth_date == ''){
                    this.$message.warning('请选择授权提交日!')
                }else if(arg.shop_situation == ''){
                    this.$message.warning('请输入开店情况!')
                }else if(arg.jst_id == ''){
                    this.$message.warning('请输入聚水潭账号!')
                }else if(arg.jst_password == ''){
                    this.$message.warning('请输入聚水潭密码!')
                }else if(arg.shop_admin_id == ''){
                    this.$message.warning('请选择管理员!')
                }else if(arg.auth_shop_name == ''){
                    this.$message.warning('请输入授权名称!')
                }else if(arg.shop_name == ''){
                    this.$message.warning('请输入开店名称!')
                }else if(arg.tel_custodian == ''){
                    this.$message.warning('请选择号码保管人!')
                }else if(arg.auth_expires_date == ''){
                    this.$message.warning('请选择授权到期日!')
                }else if(arg.account_id == ''){
                    this.$message.warning('请输入账号ID!')
                }else if(arg.sub_account == ''){
                    this.$message.warning('请输入子账号!')
                }else if(arg.sub_account_tel == ''){
                    this.$message.warning('请输入子账号电话!')
                }else if(arg.sub_account_password == ''){
                    this.$message.warning('请输入子账号密码!')
                }else if(arg.company_id == ''){
                    this.$message.warning('请选择主体!')
                }else if(arg.store_requisition == ''){
                    this.$message.warning('请输入店铺领用!')
                }else if(arg.oa_id == ''){
                    this.$message.warning('请输入OA流程编号!')
                }else if(arg.auth_file_url == ''){
                    this.$message.warning('请上传授权PDF!')
                }else if(arg.platform == ''){
                    this.$message.warning('请选择平台!')
                }else if(arg.shop_status === ''){
                    this.$message.warning('请选择开店状态!')
                }else if(arg.store_distribution == ''){
                    this.$message.warning('请输入店铺分销!')
                }else if(arg.auth_confirm == ''){
                    this.$message.warning('请输入授权确认!')
                }else if(arg.remark == ''){
                    this.$message.warning('请输入备注!')
                }else{
                    arg.is_new = arg.is_new == ''?0:arg.is_new;
                    arg.shop_type = arg.shop_type == ''?0:arg.shop_type;
                    var new_arg = {...arg,...new_info};
                    if(this.dialog_type == 'add'){      //添加
                        operationResource.companyMainAddShop(new_arg).then(res => {
                            if(res.data.code == 1){
                                this.$message.success(res.data.msg);
                                //获取数据
                                this.getData();
                                this.dialog = false;
                                this.closeDialog();
                                localStorage.removeItem('basicAuthInfo');
                                localStorage.removeItem('basicAuthNewInfo');
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        })
                    }else if(this.dialog_type == 'edit'){   //编辑
                        new_arg['company_shop_id'] = this.company_shop_id;
                        operationResource.companyMainEditShop(new_arg).then(res => {
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
                this.setLocalStorage();
            },
            //转移主体
            transferFn(row){
                this.transfer_shop_name = row.shop_name;
                this.company_name = row.company_name;
                this.company_id = row.company_id;
                this.company_shop_id = row.company_shop_id;
                this.transfer_dialog = true;
            },
            //转移主体提交
            transferConfirm(){
                let arg = {
                    company_id:this.company_id,
                    company_shop_id:this.company_shop_id,
                }
                operationResource.companyMainBodyTransfer(arg).then(res => {
                    if(res.data.code == 1){
                        this.$message.success(res.data.msg);
                        //获取数据
                        this.getData();
                        this.transfer_dialog = false;
                    }else{
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            //表格除操作栏之外的操作
            tableCallBack(field_name,table_name,value,row_field_name){
                if(row_field_name == 'auth_file_url'){  //预览pdf
                    window.open(this.domain + value)
                }else if(row_field_name == 'shop_name'){    //开店名称
                    operationResource.companyMainShopChangeList({company_shop_id:field_name}).then(res => {
                        if(res.data.code == 1){
                            let data = res.data.data;
                            data.map(item => {
                                if(item.old_info.id_card_url){
                                    let id_card_arr = [];
                                    item.old_info.id_card_url.split(',').map(id_card_item => {
                                        id_card_arr.push(item.domain + id_card_item);
                                    })
                                    item.old_info['id_card_url'] = id_card_arr.join(',');
                                }else{
                                    item.old_info['id_card_url'] = '';
                                }
                                if(item.new_info.id_card_url){
                                    let id_card_arr = [];
                                    item.new_info.id_card_url.split(',').map(id_card_item => {
                                        id_card_arr.push(item.domain + id_card_item);
                                    })
                                    item.new_info['id_card_url'] = id_card_arr.join(',');
                                }else{
                                    item.new_info['id_card_url'] = '';
                                }

                                if(item.new_info.business_license_url){
                                    let business_license_arr = [];
                                    item.new_info.business_license_url.split(',').map(business_license_item => {
                                        business_license_arr.push(item.domain + business_license_item);
                                    })
                                    item.new_info['business_license_url'] = business_license_arr.join(',');
                                }else{
                                    item.new_info['business_license_url'] = '';
                                }
                                if(item.old_info.business_license_url){
                                    let business_license_arr = [];
                                    item.old_info.business_license_url.split(',').map(business_license_item => {
                                        business_license_arr.push(item.domain + business_license_item);
                                    })
                                    item.old_info['business_license_url'] = business_license_arr.join(',');
                                }else{
                                    item.old_info['business_license_url'] = '';
                                }
                            })
                            this.log_data = data;
                            this.log_dialog = true;
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                }else if(row_field_name == 'account_info'){    //账号信息
                    operationResource.companyMainShopInfo({company_shop_id:field_name}).then(res => {
                        if(res.data.code == 1){
                            this.detail_data = res.data.data;
                            this.account_dialog = true;
                        }else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                }
            },
            //过滤图片
            filterImage(image){
                if(image){
                    return image.split(',');
                }else{
                    return [];
                }
            },
            //大图点击关闭
            handleClickStop() {
                this.$nextTick(() => {
                    let domImageView = document.querySelector(".el-image-viewer__mask"); 
                        // 获取遮罩层dom
                    if (!domImageView) {
                        return;
                    }
                    domImageView.addEventListener("click", () => {
                    // 点击遮罩层时调用关闭按钮的 click 事件
                        document.querySelector(".el-image-viewer__close").click();
                    });
                });
            },
            //设置变更记录过期状态
            tableRowClassName({row, rowIndex}) {
                if (rowIndex > 0) {
                    return 'expired';
                }
                return '';
            },
            //详情pdf预览
            openPdf(value){
                window.open(this.domain + value)
            }
        },
        components:{
            CustomTable,
            PageWidget,
            UploadPdf
        }
    }
</script>
<style type="text/css">
    .el-table .expired{
        background: #F7F7F7;
        color: #B6B6B6;
    }
    .label_bold .el-form-item__label{
        font-weight: bold;
    }
</style>
<style lang="less" scoped>
    .image{
        width: 50px;
        height: 50px;
    }
    .divider{
        margin-top: 12px;
        margin-bottom: 12px;
        background: #DCDFE6;
        width: 100%;
        height: 1px;
    }
    .ml5{
        margin-left: 5px;
    }
</style>