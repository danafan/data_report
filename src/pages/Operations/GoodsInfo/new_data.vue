<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq" :show_dept="false"></dps>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags style="width: 280px">
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="上新日期：">
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
			<el-table-column width="120" show-overflow-tooltip prop="goods_title" label="标题" align="center"></el-table-column>
			<el-table-column prop="platform" label="平台" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="shop" label="店铺" align="center"></el-table-column>
			<el-table-column prop="spid" label="商品ID" align="center"></el-table-column>
			<el-table-column width="100" show-overflow-tooltip label="图片" align="center">
				<template slot-scope="scope">
					<img style="width: 80px;height: 80px" :src="scope.row.goods_photo" @click="bigImg(scope.row.goods_photo)">
				</template>
			</el-table-column>
			<el-table-column prop="ksbm" label="款式编码" align="center">
			</el-table-column>
			<el-table-column prop="price" label="价格" align="center">
			</el-table-column>
			<el-table-column width="150" prop="add_day" label="上新日期" align="center">
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
	import resource from '../../../api/operationResource.js'
	import {exportPost} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import { MessageBox,Message } from 'element-ui';
	import dps from '../../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				select_plat_ids:[],		//选中的平台
				select_store_ids:[],	//选中的店铺列表
				ks_list:[],				//款式编码列表
				select_ks_ids:[],		//选中的款式编码
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
				pagesize:10,
				page:1,
				dataObj:{},				//返回数据
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
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ksbmList({ksbm:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击搜索
			searchFn(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//点击搜索
			getData(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					platform:this.select_plat_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					start_date:this.sx_date && this.sx_date.length> 0?this.sx_date[0]:"",
					end_date:this.sx_date && this.sx_date.length> 0?this.sx_date[1]:""
				}
				resource.newOnshelfList(arg).then(res => {
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
						platform:this.select_plat_ids.join(','),
						shop_id:this.select_store_ids.join(','),
						ksbm:this.select_ks_ids.join(','),
						start_date:this.sx_date && this.sx_date.length> 0?this.sx_date[0]:"",
						end_date:this.sx_date && this.sx_date.length> 0?this.sx_date[1]:""
					}
					resource.newOnshelfExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'上新数据');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		},components:{
			dps
		}
	}
</script>
























