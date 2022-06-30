<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="新编码：">
				<el-select v-model="select_ksbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入新编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="反馈人：">
				<el-select v-model="fkr_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in fkr_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="status" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日期：">
				<el-date-picker size="small" v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%;height: 600px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="ksbm" label="新编码" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="cb_price" label="成本价" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="difference" label="反馈成本价" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="difference" label="反馈人" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="difference" label="反馈时间" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="difference" label="反馈原因" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="difference" label="状态" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="处理" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="checkStatus('1')">拒绝</el-button>
					<el-button type="text" size="small" @click="checkStatus('2')">同意</el-button>
					<el-button type="text" size="small" @click="getDetail(scope.row)">详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 拒绝弹窗 -->
		<el-dialog title="拒绝" center @close="refused_text = ''" width="45%" :visible.sync="refusedDialog">
			<el-input type="textarea" :rows="2" style="width: 300px" placeholder="拒绝原因（选填）" v-model="refused_text">
			</el-input>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="closeRefused = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitFn('1')">提交</el-button>
			</div>
		</el-dialog>
		<!-- 详情弹窗 -->
		<el-dialog title="详情" center width="30%" :visible.sync="detailDialog">
			<el-form :inline="true" size="small" class="demo-form-inline">
				<el-form-item label="编码：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="成本价：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="反馈成本价：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="原因：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="反馈人：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="反馈时间：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="当前状态：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="处理人：">
					<div class="value">912837912837912</div>
				</el-form-item>
				<el-form-item label="拒绝原因：">
					<div class="value">912837912837912</div>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="detailDialog = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
.value{
	width: 300px;
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	import {exportUp} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				fkr_list:['张三','李四','王五'],	//反馈人列表
				fkr_ids:[],				//选中的反馈人列表
				status_list:[{
					id:'1',
					name:'待处理'
				},{
					id:'2',
					name:'已同意'
				},{
					id:'3',
					name:'已拒绝'
				}],						//状态列表
				status:"",				//选中的状态
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
				},	 					//时间区间
				date:[],				//日期区间
				dataObj:{},				//返回数据
				refusedDialog:false,	//拒绝弹窗
				refused_text:"",		//拒绝原因
				detailDialog:true,		//详情弹窗
			}
		},
		created(){
			//获取列表
			// this.getData();
		},
		methods:{
			//款式编码列表
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ksbm_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//搜索
			getList(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				// let arg = {
				// 	ksbm:this.select_ksbm_ids.join(','),
				// 	supplier_ksbm:this.select_gyshh_ids.join(','),
				// 	supplier:this.select_gys_ids.join(','),
				// 	is_zero_batch:!this.is_zero_batch?0:1,
				// 	from:this.from,
				// 	page:this.page,
				// 	pagesize:this.pagesize
				// }
				// resource.totalAudit(arg).then(res => {
				// 	if(res.data.code == 1){
				// 		this.dataObj = res.data.data;
				// 	}else{
				// 		this.$message.warning(res.data.msg);
				// 	}
				// })
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
			//点击拒绝或同意
			checkStatus(type){
				if(type == '1'){	//拒绝
					this.refusedDialog = true;
				}else{				//同意
					this.$confirm('原成本价将改成反馈成本价', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//提交处理
						this.commitFn('1');
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消'
						});          
					});
				}
			},
			//提交处理
			commitFn(type){	//1:拒绝；2:同意
				console.log(type);
			},
			//点击查看详情
			getDetail(){
				this.detailDialog = true;
			},
			//导出
			commitExport(){
				if(this.export_type == 2 && (!this.export_date || this.export_date.length == 0)){	//按时间导出
					this.$message.warning('请选择导出时间！');
				}else{
					//导出
					var arr = [];
					let arg = {
						start_date:this.export_date && this.export_date.length> 0?this.export_date[0]:"",
						end_date:this.export_date && this.export_date.length> 0?this.export_date[1]:"",
						from:this.from
					}
					for(var item in arg){
						let str = item + '=' + arg[item];
						arr.push(str);
					};
					exportUp(`audit/total_export?${arr.join('&')}`);
					this.exportDialog = false;
				}
			}
		}
	}
</script>










