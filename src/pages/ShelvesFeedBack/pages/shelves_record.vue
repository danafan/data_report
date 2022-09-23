<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-input clearable v-model="ksbm" placeholder="款式编码"></el-input>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="dpmc" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.jst_code" :label="item.shop_name" :value="item.jst_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="执行结果：">
				<el-select v-model="zxjg" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="未处理" value="0"></el-option>
					<el-option label="已下架" value="1"></el-option>
					<el-option label="不下架" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="验证状态：">
				<el-select v-model="is_check" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="未验证" value="0"></el-option>
					<el-option label="已下架" value="1"></el-option>
					<el-option label="未下架" value="2"></el-option>
					<el-option label="其他" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="查询时间：">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div>
				<el-button type="primary" size="small" @click="showDialog('1')" v-if="dataObj.button_list.import_result == 1">
					批量上传执行结果
					<i class="el-icon-upload el-icon--right"></i>
				</el-button>
			</div>
			<div style="display:flex">
				<el-button type="primary" plain size="small" @click="commitExport"  v-if="dataObj.button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column width="120" show-overflow-tooltip prop="zdmc" label="站点名称" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="dept_name" label="事业部" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="shop_code" label="店铺ID" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="dpbh" label="聚水潭编号" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="dpmc" label="店铺名称" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="ksbm" label="线上款式编码" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip label="款式链接" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="openWindow(scope.row.url)">{{scope.row.url}}</el-button>
				</template>
			</el-table-column>
			<el-table-column width="160" prop="add_time" label="提交日期" align="center"></el-table-column>
			<el-table-column width="160" prop="dpysgg" show-overflow-tooltip label="下架颜色尺码" align="center"></el-table-column>
			<el-table-column width="160" prop="off_reason" show-overflow-tooltip label="下架原因" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="tjr" label="提交人" align="center"></el-table-column>
			<el-table-column width="160" show-overflow-tooltip prop="add_time" label="提交时间" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip label="执行结果" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.zxjg == 0?'未处理':scope.row.zxjg == 1?'已下架':'不下架'}}</div>
				</template>
			</el-table-column>
			<el-table-column width="160" prop="qksm" show-overflow-tooltip label="情况说明" align="center"></el-table-column>
			<el-table-column width="160" prop="zxr" show-overflow-tooltip label="执行人" align="center"></el-table-column>
			<el-table-column width="160" prop="zx_time" show-overflow-tooltip label="执行时间" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip label="验证状态" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.is_check == 0">未验证</div>
					<div v-if="scope.row.is_check == 1">已下架</div>
					<div v-if="scope.row.is_check == 2">未下架</div>
					<div v-if="scope.row.is_check == 3">其他</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="120" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="setTag(scope.row.id)" v-if="dataObj.button_list.import_result == 1">标记</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-size="pagesize" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 标记 -->
		<el-dialog title="标记" :visible.sync="show_row_dialog" @close="closeDialog">
			<el-form size="small">
				<el-form-item label="执行结果：">
					<el-select v-model="tag_zxjg" :popper-append-to-body="false" placeholder="请选择">
						<el-option label="未处理" :value="0" disabled></el-option>
						<el-option label="已下架" :value="1"></el-option>
						<el-option label="不下架" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="情况说明：" :required="tag_zxjg == 2">
					<el-input type="textarea" :rows="2" style="width: 300px" placeholder="请输入情况说明" v-model="tag_qksm">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="show_row_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="commitFun">确认</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.import_toast{
	margin-bottom: 15px;
	color: red;
	font-size: 12px;
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
<script>
	import resource from '../../../api/shelvesResource.js'
	import {exportPost} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				page:1,
				pagesize:15,
				ksbm:"",		//款式编码
				store_list:[],	//所有店铺列表
				dpmc:[],		//选中的店铺列表
				zxjg:"",		//执行结果
				is_check:"",	//验证状态
				date:[getCurrentDate(),getNowDate()],		//查询日期
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
				dataObj:{
					button_list:{}
				},		//返回数据
				dialog_type:'1',		//弹窗类型（1:批量上传执行结果；2:供应链导入）
				show_dialog:false,		//导入弹窗
				show_row_dialog:false,	//标记弹窗
				ks_id:"",				//点击标记的款式id
				tag_zxjg:"",			//标记弹窗执行结果
				tag_qksm:"",			//标记弹窗情况说明
				loading:false
			}
		},
		created(){
			//获取列表
			this.getList();
			//获取店铺列表
			this.getStoreList();
		},
		methods:{
			//搜索
			searchFun(){
				this.page = 1;
				//获取列表
				this.getList();
			},
			//点击两种导入
			showDialog(type){
				this.dialog_type = type;
				this.show_dialog = true;
			},
			//标记
			setTag(id){
				this.ks_id = id;
				this.show_row_dialog = true;
			},
			closeDialog(){
				this.tag_zxjg = "";
				this.tag_qksm = "";
			},
			//下载模版
			downTemplate(){
				if(this.dialog_type == '1'){	//批量上传执行结果
					window.open(`${this.downLoadUrl}/批量上传执行结果模板.xlsx`);
				}else{	//供应商
					window.open(`${this.downLoadUrl}/%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF.xlsx`);
				}
			},
			//确认标记
			commitFun(){
				if(this.tag_zxjg == ''){
					this.$message.warning('请选择执行结果');
					return;
				}
				if(this.tag_zxjg == 2 && this.tag_qksm == ''){
					this.$message.warning('请输入情况说明');
					return;
				}
				let arg = {
					id:this.ks_id,
					zxjg:this.tag_zxjg,
					qksm:this.tag_qksm
				}
				resource.offshelfAdd(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_row_dialog = false;
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dpmc:this.dpmc.join(','),
						ksbm:this.ksbm,
						zxjg:this.zxjg,
						is_check:this.is_check,
						add_time:this.date && this.date.length > 0?this.date[0]:"",
						end_date:this.date && this.date.length > 0?this.date[1]:"",
					}
					resource.exportDetailed(arg).then(res => {
						exportPost("\ufeff" + res.data,'下架款登记-明细');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//获取店铺列表
			getStoreList(){
				resource.ajaxShops({type:'0'}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(){
				let arg = {
					dpmc:this.dpmc.join(','),
					ksbm:this.ksbm,
					zxjg:this.zxjg,
					is_check:this.is_check,
					add_time:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize,
				}
				this.loading = true;
				resource.offshelfAll(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			openWindow(url){
				window.open(url);
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
		}
	}
</script>