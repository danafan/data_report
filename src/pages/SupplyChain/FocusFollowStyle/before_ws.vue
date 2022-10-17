<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
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
			<el-form-item label="店铺名称：">
				<el-select v-model="select_store_ids" clearable multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="统计日期：">
				<el-date-picker v-model="sjxrrq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="630px" v-loading="loading">
			<el-table-column label="图片" align="center" width="180">
				<template slot-scope="scope">
					<el-image :z-index="2006" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="scope.row.images"></el-image>
					<div v-else></div>
				</template>
			</el-table-column>
			<el-table-column prop="shop_name" label="店铺名称" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="ksbm" label="款式编码" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gyshh" label="供应商货号" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="mlv_7" label="7天毛利率" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="stl_15" label="15天实退率" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dhl" label="7天到货率" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="fhl_3" label="3天发货率" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="xssl_3" label="前三天销量" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="xssl_2" label="前两天销量" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="xssl_1" label="前一天销量" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="ks_xssl_1" label="全公司前一天销量" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dhs_3" label="前三天到货数" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dhs_2" label="前两天到货数" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dhs_1" label="前一天到货数" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="jhckc" label="进货仓库存" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="xjkc" label="箱及仓位库存" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="qhs" label="缺货数" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sjcb" label="审计成本" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pjsmj" label="平均售卖价" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="is_200" label="是否前200" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="mc" label="商品名称" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gys" label="供应商" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gys_level" label="供应商等级" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="jsfs" label="结算方式" align="center" width="120" show-overflow-tooltip>
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
	import demandResource from '../../../api/demandResource.js'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				store_list: [],						//店铺列表	
				select_store_ids:[],				//选中的店铺id列表
				sjxrrq:getNowDate(),
				page:1,
				pagesize:10,
				data:[],
				total:0
			}
		},
		created(){
			// 获取所有店铺
			this.getStoreList();
			//获取列表
			this.getData();
		},
		methods:{
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
			// 获取所有店铺
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dept_id:this.select_store_ids.join(','),
						ksbm:this.select_ks_ids.join(','),
						gys:this.select_gys_ids.join(','),
						sjxrrq:this.sjxrrq?this.sjxrrq:''
					}
					demandResource.deforeWsExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'3店铺Top50列表');
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
			getData(){
				let arg = {
					dept_id:this.select_store_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					sjxrrq:this.sjxrrq?this.sjxrrq:'',
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.deforeWsList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
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
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
}
</style>










