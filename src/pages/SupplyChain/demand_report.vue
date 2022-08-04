<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺：">
				<el-select v-model="select_store_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="提报人：">
				<el-select v-model="select_tbr_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in tbr_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="提报日期:">
				<el-date-picker v-model="tb_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="status" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="待处理" value="0"></el-option>
					<el-option label="接受" value="1"></el-option>
					<el-option label="不接受" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="allDeal" v-if="button_list.handle == 1">批量处理</el-button>
			<div class="right_buts">
				<el-button type="primary" plain size="small" @click="commitExport" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
				<el-button type="primary" plain size="small" @click="$router.push('/created_demand')" v-if="button_list.add == 1">新建<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
			</div>
		</div>
		<el-table size="small" ref="multipleTable" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="630px" :header-cell-style="{'background':'#f4f4f4'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" fixed="left" :selectable="selectFn" v-if="button_list.handle == 1"></el-table-column>
			<el-table-column label="操作" align="center" width="320" fixed="left">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="$router.push('/procurement_info?id=' + scope.row.id + '&type=1')" v-if="button_list.detail == 1">详情</el-button>
					<el-button type="text" size="small" @click="$router.push('/created_demand?id=' + scope.row.id)" v-if="button_list.edit == 1 && scope.row.is_accept == '待处理'">编辑</el-button>
					<el-button type="text" size="small" @click="$router.push('/procurement_info?id=' + scope.row.id + '&type=2')" v-if="button_list.handle == 1 && scope.row.is_accept == '待处理'">处理</el-button>
					<!-- <el-button type="text" size="small" @click="$router.push('/procurement_info?id=' + scope.row.id + '&type=3')" v-if="button_list.turn_head == 1">转接负责人</el-button>
					<el-button type="text" size="small" @click="$router.push('/procurement_info?id=' + scope.row.id + '&type=4')" v-if="button_list.confirm == 1">确认状态</el-button>
					<el-button type="text" size="small" @click="$router.push('/procurement_info?id=' + scope.row.id + '&type=5')" v-if="button_list.delay == 1">延期解决</el-button> -->
				</template>
			</el-table-column>
			<el-table-column prop="create_time" label="提报日期" align="center" width="120">
			</el-table-column>
			<el-table-column prop="dept_name" label="事业部" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_2" label="项目部" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="shop_name" label="店铺" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="shop_link" label="店铺链接" align="center" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="create_name" label="提报人" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="cate_1" label="一级类目" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="cate_2" label="二级类目" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="版型、面料、工艺、颜色" align="center" width="180">
				<template slot-scope="scope">
					<el-image fit="cover" style="width: 160px; height: 80px" :src="scope.row.version_image[0]" :preview-src-list="scope.row.version_image">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="without_link" label="参考店铺链接" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="参考店铺图片" align="center" width="180">
				<template slot-scope="scope">
					<el-image fit="cover" style="width: 160px; height: 80px" :src="scope.row.without_image[0]" :preview-src-list="scope.row.without_image" v-if="scope.row.without_image.length > 0">
					</el-image>
					<div v-else>暂无图片</div>
				</template>
			</el-table-column>
			<el-table-column prop="without_describe" label="参考店铺描述" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="特殊要求" width="120" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_special}}<el-tooltip class="item" effect="dark" :content="scope.row.special_content" placement="top-start" v-if="scope.row.is_special == '是'">
						<i class="el-icon-warning" style="color: #FFE58F"></i>
					</el-tooltip></div>
				</template>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="销售价格区间" width="120" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div>{{scope.row.sale_min_price}}-{{scope.row.sale_max_price}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="成本区间" width="120" align="center" show-overflow-tooltip>
				<template slot-scope="scope">
					<div>{{scope.row.min_price}}-{{scope.row.max_price}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="style" label="款式定位" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="style_num" label="款式需要数量" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gys" label="制定供货商" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gys_area" label="供应商地域要求" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gys_model" label="供应商合作模式" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="done_time" label="最晚达成时间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="put_time" label="计划上新时间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="arrival_time" label="预计达成时间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="ding_user_name" label="状态" width="120" align="center" fixed="right">
				<template slot-scope="scope">
					<div>{{scope.row.is_accept}}<el-tooltip class="item" effect="dark" :content="scope.row.remark" placement="top-start" v-if="scope.row.is_accept != '待处理'">
						<i class="el-icon-warning" style="color: #FFE58F"></i>
					</el-tooltip></div>
				</template>
			</el-table-column>
			<el-table-column prop="operation_remark" label="备注" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 批量处理弹窗 -->
		<el-dialog title="批量处理弹窗" center @close="closeDialog" width="45%" :close-on-click-modal="false" :visible.sync="dealDialog">
			<el-form size="small">
				<el-form-item label="合理性评估：" required>
					<el-select v-model="hlxpg" :popper-append-to-body="false">
						<el-option label="接受" value="1"></el-option>
						<el-option label="不接受" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注：" :required="hlxpg == '2'">
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					:placeholder="hlxpg == '2'?'请输入不接受的原因':'请输入备注（选填）'"
					:rows="7"
					v-model="remark"
					maxlength="100"
					show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="预计达成时间：" required>
					<el-date-picker v-model="yjdcsj" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
					</el-date-picker>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="dealDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitFn">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../api/resource.js'
	import demandResource from '../../api/demandResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				store_list:[],				//所有店铺
				select_store_ids:[],		//选中的店铺列表
				tbr_list:[],				//提报人列表
				select_tbr_ids:[],			//选中的提报人列表
				tb_date:[],					//提报日期
				status:"",					//状态
				page:1,
				pagesize:10,
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
				},	 										//时间区间
				dataObj:{},	
				button_list:{},				//按钮权限
				multipleSelection:[],		//选中的列表	
				dealDialog:false,			//处理弹窗	
				hlxpg:'1',			//选中的合理性评估
				yjdcsj:"",			//预计达成时间
				remark:"",			//备注
			}
		},
		beforeRouteLeave(to,from,next){
			if(to.path == '/procurement_info' || (to.path == '/created_demand' && to.query.id)){	
				from.meta.isUseCache = true;
			}else{
				from.meta.isUseCache = false;
			}
			next();
		},
		activated(){
			if(!this.$route.meta.isUseCache){
				this.select_store_ids = [];
				this.select_tbr_ids = [];
				this.tb_date = [];
				this.status = "";
				this.page = 1;
				this.pagesize = 10;
			}
			//获取店铺列表
			this.getStoreList();
			//获取提报人列表
			this.searchList({field:"create_name"});
			//获取列表数据
			this.getData();
			this.$route.meta.isUseCache = false;
		},
		methods:{
			//获取店铺列表
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取提报人列表
			searchList(arg){
				demandResource.searchList(arg).then(res => {
					if(res.data.code == 1){
						this.tbr_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			getList(){
				this.page = 1;
				//获取列表数据
				this.getData();
			},	
			//获取列表数据
			getData(){
				let arg = {
					shop_name:this.select_store_ids.join(','),
					create_name:this.select_tbr_ids.join(','),
					start_time:this.tb_date && this.tb_date.length> 0?this.tb_date[0]:"",
					end_time:this.tb_date && this.tb_date.length> 0?this.tb_date[1]:"",
					is_accept:this.status,
					page:this.page,
					pagesize:this.pagesize
				}
				demandResource.demandList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.button_list = res.data.data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//判断多选框是否可以勾选
			selectFn(row,index){
				if(row.is_accept == '待处理'){
					return true;
				}else{
					return false;
				}
			},
			//切换多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
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
			//点击批量处理
			allDeal(){
				if(this.multipleSelection.length == 0){
					this.$message.warning('请至少勾选一条记录!')
				}else{
					this.dealDialog = true;
				}
			},
			//关闭批量修改弹窗
			closeDialog(){
				this.hlxpg = '1';
				this.yjdcsj = '';
				this.remark = '';
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						shop_name:this.select_store_ids.join(','),
						create_name:this.select_tbr_ids.join(','),
						start_time:this.tb_date && this.tb_date.length> 0?this.tb_date[0]:"",
						end_time:this.tb_date && this.tb_date.length> 0?this.tb_date[1]:"",
						is_accept:this.status
					}
					demandResource.supplyChainExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'运营中心需求报表');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//提交批量处理
			commitFn(){
				if(this.hlxpg == '2' && this.remark == ''){
					this.$message.warning('请输入不接受的原因！');
				}else if(!this.yjdcsj){
					this.$message.warning('请选择预计达成时间！');
				}else{
					var ids = [];
					this.multipleSelection.map(item => {
						ids.push(item.id);
					});
					let arg = {
						id:ids.join(','),
						is_accept:this.hlxpg,
						arrival_time:this.yjdcsj,
						remark:this.remark
					}
					demandResource.supplyChainAudit(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.dealDialog = false;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.right_buts{
		display: flex;
		align-items: center;
	}
}
</style>







