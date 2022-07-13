<template>
	<div>
		<div class="title">每日下单采购汇总</div>
		<el-table size="small" :data="totalObj.data" tooltip-effect="dark" style="width: 100%" max-height="400px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="bp_gyshh" label="所属事业部" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="rq" label="日期" width="100" align="center"></el-table-column>
			<el-table-column prop="bpkh_num" label="今日白坯数量" width="130" align="center"></el-table-column>
			<el-table-column prop="th_num" label="对应烫画款数量" width="120" align="center"></el-table-column>
			<el-table-column prop="th_yes_xssl" label="烫画款日销" width="120" align="center"></el-table-column>
			<el-table-column prop="th_3_xssl" label="烫画款3日销" width="120" align="center"></el-table-column>
			<el-table-column prop="th_week_xssl" label="烫画款周销" width="120" align="center"></el-table-column>
			<el-table-column prop="th_kys" label="烫画款可用数" width="100" align="center"></el-table-column>
			<el-table-column prop="th_xjcw_stock" label="烫画款箱及仓位库存" width="130" align="center"></el-table-column>
			<el-table-column prop="th_out_of_stock" label="烫画款缺货汇总" width="120" align="center"></el-table-column>
			<el-table-column prop="th_cgzt" label="烫画款采购在途数" width="120" align="center"></el-table-column>
			<el-table-column prop="th_jhc_stock" label="烫画款进货仓库存" width="120" align="center">
			</el-table-column>
			<el-table-column prop="jy_purchase" label="今天下单量" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_jhc_stock" label="今天到仓量" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_cgzt" label="在途量" width="120" align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="totalPageSize" @current-change="totalPage" :current-page="total_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalObj.total">
			</el-pagination>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="日期：">
				<el-date-picker v-model="creat_rq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="供应商名称：">
				<el-select v-model="select_gys_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商名称" :remote-method="gysList" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchGysxdb">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<div class="title">供应商下单表</div>
			<el-button type="primary" plain size="mini" @click="commitExport('gysxd')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="gysxdObj.data" tooltip-effect="dark" style="width: 100%" max-height="400px" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="bp_gys" label="白坯供应商" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="bpkh_num" label="白坯款数" width="100" align="center"></el-table-column>
			<el-table-column prop="th_num" label="烫画款数" width="130" align="center"></el-table-column>
			<el-table-column prop="th_week_sale" label="烫画周销" width="120" align="center"></el-table-column>
			<el-table-column prop="th_xjcw_stock" label="烫画箱及仓位库存" width="120" align="center"></el-table-column>
			<el-table-column prop="th_kys" label="烫画可用数" width="120" align="center"></el-table-column>
			<el-table-column prop="th_out_of_stock" label="烫画缺货情况" width="120" align="center"></el-table-column>
			<el-table-column prop="th_cgzt" label="烫画采购在途" width="100" align="center"></el-table-column>
			<el-table-column prop="th_jhc_stock" label="烫画款进货仓库存" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_xjcw_stock" label="白坯箱及仓位库存" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_kys" label="白坯可用数" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_cgzt" label="白坯采购在途" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_jhc_stock" label="白坯进货仓库存" width="120" align="center">
			</el-table-column>
			<el-table-column prop="bp_hgl" label="白坯合格率" width="120" align="center">
			</el-table-column>
			<el-table-column prop="jy_purchase" label="白坯建议采购数" width="120" align="center">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="gysxdPageSize" @current-change="gysxdPage" :current-page="gysxd_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="gysxdObj.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/procurementResource.js'
	import {getNowDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				total_page:1,			//采购总数页码
				total_pagesize:10,
				totalObj:{},			//采购总数数据
				gys_list:[],			//供应商列表
				select_gys_list:[],		//选中的供应商
				creat_rq:getNowDate(),	//日期
				gysxd_page:1,			//供应商下单页码
				gysxd_pagesize:10,
				gysxdObj:{},			//供应商下单数据
			}
		},
		created(){
			//采购总数
			this.twoOrderTotalNum();
			//供应商下单表
			this.twoWhiteGysOrder();
		},
		methods:{
			//采购总数
			twoOrderTotalNum(){
				let arg = {
					page:this.total_page,
					pagesize:this.total_pagesize
				}
				resource.twoOrderTotalNum(arg).then(res => {
					if(res.data.code == 1){
						this.totalObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			totalPage(val) {
				this.total_page = val;
				//采购总数
				this.twoOrderTotalNum();
			},
			totalPageSize(val) {
				this.total_pagesize = val;
				//采购总数
				this.twoOrderTotalNum();
			},
			//供应商列表
			gysList(e){
				this.searchDrawData('gys',e)
			},
			//获取查询条件
			searchDrawData(field,field_value){
				let arg = {
					field:field,
					field_value:field_value
				}
				resource.searchWhiteData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
						}else if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}else if(field == 'gys'){
							this.gys_list = res.data.data;
						}else if(field == 'gyshh'){
							this.gysbm_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索供应商下单表
			searchGysxdb(){
				this.gysxd_page = 1;
				//供应商下单表
				this.twoWhiteGysOrder();
			},
			//供应商下单表
			twoWhiteGysOrder(){
				let arg = {
					creat_rq:this.creat_rq,
					bp_gys:this.select_gys_list.join(','),
					page:this.gysxd_page,
					pagesize:this.gysxd_pagesize
				}
				resource.twoWhiteGysOrder(arg).then(res => {
					if(res.data.code == 1){
						this.gysxdObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商下单表导出
			twoWhiteGysOrderExport(){
				let arg = {
					creat_rq:this.creat_rq,
					bp_gys:this.select_gys_list.join(',')
				}
				resource.twoWhiteGysOrderExport(arg).then(res => {
					if(res){
						exportPost("\ufeff" + res.data,'供应商下单表');
					}
				})
			},
			//供应商下单表分页
			gysxdPage(val) {
				this.gysxd_page = val;
				//供应商下单表
				this.twoWhiteGysOrder();
			},
			gysxdPageSize(val) {
				this.gysxd_pagesize = val;
				//供应商下单表
				this.twoWhiteGysOrder();
			},
			//导出
			commitExport(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText:'取消',
					type: 'warning'
				}).then(() => {
					if(type == 'gysxd'){
						//供应商下单表导出
						this.twoWhiteGysOrderExport();
					}
					
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}
		}
	}
</script>
<style scoped lang="less">
.table_top{
	display: flex;
	justify-content: space-between;
}
.title{
	margin-bottom: 15px;
	font-size: 14px;
	color:#333333;
	font-weight: bold;
}
.margin_top{
	margin-top: 15px;
}
</style>