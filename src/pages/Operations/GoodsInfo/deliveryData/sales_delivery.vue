<template>
	<div>
		<dps @callBack="checkReq"></dps>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="筛选日期：">
				<el-date-picker v-model="sx_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="index" label="序号" width="60" fixed="left"> </el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="shop_name" label="店铺" align="center"></el-table-column>
			<el-table-column prop="ksbm" width="120" show-overflow-tooltip label="款式编码" align="center"></el-table-column>
			<el-table-column prop="cpfl" label="品类" align="center"></el-table-column>
			<el-table-column prop="fh_sfsl" label="实发数量(发货)" align="center" width="130"></el-table-column>
			<el-table-column width="100" show-overflow-tooltip label="图片" align="center">
				<template slot-scope="scope">
					<img style="width: 80px;height: 80px" :src="scope.row.tp" @click="bigImg(scope.row.tp)">
				</template>
			</el-table-column>
			<el-table-column prop="cjsj" width="160" align="center">
				<template slot="header" slot-scope="scope">
					<div style="display:flex;align-items: center;justify-content: center">
						<div>上市日期</div>
						<el-tooltip class="item" effect="dark" content="SCM产品资料中的创建日期为上市日期" placement="top-start">

							<i class="el-icon-warning" style="color: #FFE58F"></i>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="dpj" label="吊牌价" align="center">
			</el-table-column>
			<el-table-column width="150" prop="zcsjkc" label="主仓库存" align="center">
			</el-table-column>
			<el-table-column width="150" prop="jhckc" label="进货仓库存" align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 图片放大 -->
		<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
			<img style="width: 100%" :src="big_img_url">
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imageDialog = false">关闭</el-button>
			</span>
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
</style>
<script>
	import resource from '../../../../api/operationResource.js'
	import {exportPost} from '../../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	import dps from '../../../../components/results_components/dps.vue'
	export default{
		data(){
			return {
				page:1,
				pagesize:10,
				sort_field:"",//排序字段名
				sort_type:"",	// 排序方式
				select_department_ids:[],	//选中的项目部列表
				select_plat_ids:[],			//选中的平台列表
				select_store_ids:[],		//选中的店铺列表
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
				sx_date:[getCurrentDate(),getCurrentDate()],				//上新日期
				dataObj:{},
				imageDialog:false,
				big_img_url:""
			}
		},
		created(){
			//点击搜索
			this.getData();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//点击搜索
			searchFn(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					dept_id:this.select_department_ids.join(','),
					platform:this.select_plat_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_date:this.sx_date && this.sx_date.length> 0?this.sx_date[0]:"",
					end_date:this.sx_date && this.sx_date.length> 0?this.sx_date[1]:""
				}
				resource.operateFhSale(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
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
			//图片放大
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dept_id:this.select_department_ids.join(','),
						platform:this.select_plat_ids.join(','),
						shop_id:this.select_store_ids.join(','),
						start_date:this.sx_date && this.sx_date.length> 0?this.sx_date[0]:"",
						end_date:this.sx_date && this.sx_date.length> 0?this.sx_date[1]:""
					}
					resource.fkSaleExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'款式销量（发货）');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		},
		components:{
			dps
		}
	}
</script>