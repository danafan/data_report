<template>
	<div>
		<div class="toast_box">
			<div class="toast_title">报表说明：8：50左右生成当日数据以供参考</div>
			<div class="small_title">字段说明：</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>销量：按付款时间统计，总销量-特殊单销量-售前销量</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>进仓库存：聚水潭-商品库存</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>采购库存：聚水潭-商品库存，采购在途数据会每天晚上清0，外采款除外；8点半前采购可以建完采购单</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>可用数：聚水潭-商品库存</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>缺货量：聚水潭-商品库存-负数可用数</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>箱及仓位库存：聚水潭-箱及仓位库存-新项目仓</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>合格率：未添加的白胚款，默认70%合格率</div>
			</div>
			<div class="small_title">计算逻辑：</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>周销：（7天订单日均销量+3天日均销量+昨日销售）/3*7</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>库存：（箱及仓位库存+（采购在途+进仓库存）*合格率</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>建议采购数：（{汇总所有烫画款【（烫画款的周销-烫画款的库存（不考虑合格率））+烫画款的缺货】-对应白胚的库存}/白胚合格率</div>
			</div>
			<div class="small_title">注意事项：</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>二部四部不同的烫画款对应同一个白坯款</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>二部和四部的数据目前是分开计算的，所以同白胚不同部门不同款分开计算。目前同款的不多，各自跟货备货   且共用白胚不多，主要是下单白胚T恤,可以由供应链统一下单。</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>二部四部同一个烫画款对应不同白坯款</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>同一烫画款对应不同白胚，由跟货人决定，按最新的白胚对应关系去计算。另外，跟货人会自行清理多款白胚的库存。   目前以短袖白胚种类最多，后续会持续用下单白胚替换掉，之前的白胚库存清理掉或者退掉。</div>
			</div>
		</div>
		<div class="title">每日下单采购汇总</div>
		<el-table size="small" :data="totalObj.list.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="orderTotalSortChange">
			<el-table-column prop="dept_2" label="所属事业部" show-overflow-tooltip width="130" align="center" sortable="custom" v-if="dept == 'total_table'"></el-table-column>
			<el-table-column prop="rq" label="日期" show-overflow-tooltip width="100" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpkh_num" label="今日白坯数量" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_num" label="对应烫画款数量" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_yes_xssl" label="烫画款日销" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_3_xssl" label="烫画款3日销" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_week_xssl" label="烫画款周销" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_kys" label="烫画款可用数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_xjcw_stock" label="烫画款箱及仓位库存" show-overflow-tooltip width="160" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_out_of_stock" label="烫画款缺货汇总" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_cgzt" label="烫画款采购在途数" show-overflow-tooltip width="140" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_jhc_stock" label="烫画款进货仓库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="jy_purchase" label="今天下单量" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_jhc_stock" label="今天到仓量" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_cgzt" label="在途量" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="totalPageSize" @current-change="totalPage" :current-page="total_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="totalObj.list.total">
			</el-pagination>
		</div>
		<!-- 供应商下单表 -->
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="日期：">
				<el-date-picker v-model="creat_rq" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="白坯供应商：">
				<el-select v-model="select_gys_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商名称" :remote-method="gysList" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn('gysxd')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<div class="title">供应商下单表</div>
			<el-button type="primary" plain size="mini" @click="commitExport('gysxd')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="gysxdObj.list.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="gysxdCellStyle" @sort-change='gysOrderSortChange'>
			<el-table-column prop="bp_gys" label="白坯供应商" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpkh_num" label="白坯款数" show-overflow-tooltip width="100" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_num" label="烫画款数" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_week_sale" label="烫画周销" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_xjcw_stock" label="烫画箱及仓位库存" show-overflow-tooltip width="140" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_kys" label="烫画可用数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_out_of_stock" label="烫画缺货情况" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_cgzt" label="烫画采购在途" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_jhc_stock" label="烫画款进货仓库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_xjcw_stock" label="白坯箱及仓位库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_kys" label="白坯可用数" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_cgzt" label="白坯采购在途" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_jhc_stock" label="白坯进货仓库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_hgl" label="白坯合格率" show-overflow-tooltip width="120" align="center" sortable="custom">
				<template slot-scope="scope">
					<div v-if="scope.row.bp_hgl">{{scope.row.bp_hgl}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="jy_purchase" label="白坯建议采购数" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="gysxdPageSize" @current-change="gysxdPage" :current-page="gysxd_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="gysxdObj.list.total">
			</el-pagination>
		</div>
		<!-- 白坯款式编码下单表 -->
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_ksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="ksbmList" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn('bpksbm')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<div class="title">白坯款式编码下单表</div>
			<el-button type="primary" plain size="mini" @click="commitExport('bpksbm')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="bpkxdObj.list.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="bpkxdCellStyle" @sort-change='ksOrderSortChange'>
			<el-table-column prop="bp_gys" label="白坯供应商" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpkh" label="白坯款式编码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="cpfl" label="白坯品类" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bp_spbm_num" label="白坯商品编码款数" show-overflow-tooltip width="140" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_num" label="烫画款数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_week_sale" label="烫画周销" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_xjcw_stock" label="烫画箱及仓位库存" show-overflow-tooltip width="140" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_kys" label="烫画可用数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_out_of_stock" label="烫画缺货情况" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="th_cgzt" label="烫画采购在途" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="th_jhc_stock" label="烫画进货仓库存" show-overflow-tooltip width="130" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_xjcw_stock" label="白坯箱及仓位库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_kys" label="白坯可用数" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_cgzt" label="白坯采购在途" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_jhc_stock" label="白坯进货仓库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_hgl" label="白坯合格率" show-overflow-tooltip width="120" align="center" sortable="custom">
				<template slot-scope="scope">
					<div v-if="scope.row.bp_hgl">{{scope.row.bp_hgl}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="jy_purchase" label="白坯建议采购数" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="bpkxdPageSize" @current-change="bpkxdPage" :current-page="bpkxd_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="bpkxdObj.list.total">
			</el-pagination>
		</div>
		<!-- 白坯商品编码下单表 -->
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="白坯款商品编码：">
				<el-select v-model="select_bpkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款商品编码" :remote-method="bpkhList" collapse-tags>
					<el-option v-for="item in bpkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn('bpspbm')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<div class="title">白坯商品编码下单表</div>
			<el-button type="primary" plain size="mini" @click="commitExport('bpspbm')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="bpspbmObj.list.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="bpspbmCellStyle" @sort-change='bmOrderSortChange'>
			<el-table-column prop="bp_gys" label="白坯供应商" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpkh" label="白坯款式编码" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bpspbm" label="白坯商品编码" show-overflow-tooltip width="130" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="cpfl" label="白坯品类" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="bp_color" label="白坯颜色规格" show-overflow-tooltip width="120" align="center" sortable="custom">
				<template slot-scope="scope">
					<div>{{scope.row.bp_color}}/{{scope.row.bp_size}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="th_num" label="烫画款数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_week_sale" show-overflow-tooltip label="烫画款周销" width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_xjcw_stock" show-overflow-tooltip label="烫画箱及仓位库存" width="140" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_kys" label="烫画可用数" show-overflow-tooltip width="120" align="center" sortable="custom"></el-table-column>
			<el-table-column prop="th_out_of_stock" label="烫画缺货情况" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="th_cgzt" label="烫画采购在途" show-overflow-tooltip width="120" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="th_jhc_stock" label="烫画进货仓库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_xjcw_stock" label="白坯箱及仓位库存" show-overflow-tooltip width="140" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_kys" label="白坯可用数" width="120" show-overflow-tooltip align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_cgzt" label="白坯采购在途" width="120" show-overflow-tooltip align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_jhc_stock" label="白坯进货仓库存" show-overflow-tooltip width="130" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="jy_purchase" label="白坯建议采购数" show-overflow-tooltip width="130" align="center" sortable="custom">
			</el-table-column>
			<el-table-column prop="bp_hgl" label="白坯合格率" show-overflow-tooltip width="120" align="center" sortable="custom">
				<template slot-scope="scope">
					<div v-if="scope.row.bp_hgl">{{scope.row.bp_hgl}}%</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="bpspbmPageSize" @current-change="bpspbmPage" :current-page="bpspbm_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="bpspbmObj.list.total">
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
				order_total_sort:'',
				totalObj:{
					list:{
						data:[]
					}
				},			//采购总数数据
				gys_list:[],			//供应商列表
				select_gys_list:[],		//选中的供应商
				creat_rq:getNowDate(),	//日期
				gysxd_page:1,			//供应商下单页码
				gysxd_pagesize:10,
				gys_order_sort:"",		
				gysxdObj:{
					list:{
						data:[]
					}},			//供应商下单数据
				ksbm_list:[],			//白坯款式编码
				select_ksbm_list:[],	//选中的白坯款式编码
				bpkxd_page:1,			//白坯款下单页码
				bpkxd_pagesize:10,	
				ks_order_sort:"",	
				bpkxdObj:{
					list:{
						data:[]
					}
				},			//白坯款下单数据
				bpkh_list:[],				//白坯商品编码
				select_bpkh_list:[],		//选中的白坯商品编码列表
				bpspbm_page:1,			//白坯商品编码下单页码
				bpspbm_pagesize:10,		
				bm_order_sort:"",
				bpspbmObj:{
					list:{
						data:[]
					}
				},			//白坯商品编码下单数据
			}
		},
		props:{
			dept:{
				type:String,
				default:''
			}
		},
		created(){
			//采购总数
			this.twoOrderTotalNum();
			//供应商下单表
			this.twoWhiteGysOrder();
			//白坯款下单表
			this.twoWhiteKsOrder();
			//白坯款商品编码下单表
			this.twoWhiteBmOrder();
		},
		methods:{
			//采购总数排序
			orderTotalSortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.order_total_sort = column.prop + '-' + order;
				}else{
					this.order_total_sort = '';
				}
        		//采购总数
        		this.twoOrderTotalNum();
        	},
			//采购总数
			twoOrderTotalNum(){
				let arg = {
					sort:this.order_total_sort,
					page:this.total_page,
					pagesize:this.total_pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoOrderTotalNum(arg).then(res => {
						if(res.data.code == 1){
							this.totalObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourOrderTotalNum(arg).then(res => {
						if(res.data.code == 1){
							this.totalObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.orderTotalNum(arg).then(res => {
						if(res.data.code == 1){
							this.totalObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
				this.searchDrawData('bp_gys',e)
			},
			//白坯款式编码
			ksbmList(e){
				this.searchDrawData('bpkh',e)
			},
			//白坯商品编码
			bpkhList(e){
				this.searchDrawData('bpspbm',e)
			},
			//获取查询条件
			searchDrawData(field,field_value){
				let arg = {
					field:field,
					field_value:field_value
				}
				resource.searchDrawData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
						}else if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}else if(field == 'bp_gys'){
							this.gys_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			searchFn(type){
				if(type == 'gysxd'){
					this.gysxd_page = 1;
					//供应商下单表
					this.twoWhiteGysOrder();
					//白坯款下单表
					this.twoWhiteKsOrder();
					//白坯商品编码下单表
					this.twoWhiteBmOrder();
				}else if(type == 'bpksbm'){
					this.bpkxd_page = 1;
					//白坯款下单表
					this.twoWhiteKsOrder();
					//白坯商品编码下单表
					this.twoWhiteBmOrder();
				}else if(type == 'bpspbm'){
					this.bpspbm_page = 1;
					//白坯商品编码下单表
					this.twoWhiteBmOrder();
				}
			},
			//供应商下单表排序
			gysOrderSortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.gys_order_sort = column.prop + '-' + order;
				}else{
					this.gys_order_sort = '';
				}
        		//供应商下单表
        		this.twoWhiteGysOrder();
        	},
			//供应商下单表
			twoWhiteGysOrder(){
				let arg = {
					creat_rq:this.creat_rq,
					bp_gys:this.select_gys_list.join(','),
					sort:this.gys_order_sort,
					page:this.gysxd_page,
					pagesize:this.gysxd_pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteGysOrder(arg).then(res => {
						if(res.data.code == 1){
							this.gysxdObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteGysOrder(arg).then(res => {
						if(res.data.code == 1){
							this.gysxdObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.whiteGysOrder(arg).then(res => {
						if(res.data.code == 1){
							this.gysxdObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商下单表导出
			twoWhiteGysOrderExport(){
				let arg = {
					sort:this.gys_order_sort,
					creat_rq:this.creat_rq,
					bp_gys:this.select_gys_list.join(',')
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteGysOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商下单表');
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteGysOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商下单表');
						}
					})
				}else{
					resource.whiteGysOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'供应商下单表');
						}
					})
				}
			},
			//供应商下单表头颜色
			gysxdCellStyle(v){
				if(v.columnIndex >= 2 && v.columnIndex <= 8){
					return 'background:#87CEFA;color:#333333';
				}else if(v.columnIndex > 8){
					return 'background:#FFD700;color:#333333';
				}else{
					return 'background:#f4f4f4';
				}
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
			//白坯款下单表排序
			ksOrderSortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.ks_order_sort = column.prop + '-' + order;
				}else{
					this.ks_order_sort = '';
				}
        		//白坯款下单表
        		this.twoWhiteKsOrder();
        	},
			//白坯款下单表
			twoWhiteKsOrder(){
				let arg = {
					creat_rq:this.creat_rq,
					bp_gys:this.select_gys_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					sort:this.ks_order_sort,
					page:this.bpkxd_page,
					pagesize:this.bpkxd_pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteKsOrder(arg).then(res => {
						if(res.data.code == 1){
							this.bpkxdObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteKsOrder(arg).then(res => {
						if(res.data.code == 1){
							this.bpkxdObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.whiteKsOrder(arg).then(res => {
						if(res.data.code == 1){
							this.bpkxdObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//白坯款式下单表导出
			twoWhiteKsOrderExport(){
				let arg = {
					creat_rq:this.creat_rq,
					sort:this.ks_order_sort,
					bp_gys:this.select_gys_list.join(','),
					bpkh:this.select_ksbm_list.join(',')
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteKsOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'白坯款式下单表');
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteKsOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'白坯款式下单表');
						}
					})
				}else{
					resource.whiteKsOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'白坯款式下单表');
						}
					})
				}
			},
			//白坯款式下单表头颜色
			bpkxdCellStyle(v){
				if(v.columnIndex >= 4 && v.columnIndex <= 10){
					return 'background:#87CEFA;color:#333333';
				}else if(v.columnIndex > 10){
					return 'background:#FFD700;color:#333333';
				}else{
					return 'background:#f4f4f4';
				}
			},
			//白坯款式下单表分页
			bpkxdPage(val) {
				this.bpkxd_page = val;
				//白坯款式下单表
				this.twoWhiteKsOrder();
			},
			bpkxdPageSize(val) {
				this.bpkxd_pagesize = val;
				//白坯款式下单表
				this.twoWhiteKsOrder();
			},
			//白坯款下单表排序
			bmOrderSortChange(column){
				if(column.order){
					let order = column.order == 'ascending'?'asc':'desc';
					this.bm_order_sort = column.prop + '-' + order;
				}else{
					this.bm_order_sort = '';
				}
        		//白坯款商品编码下单表
        		this.twoWhiteBmOrder();
        	},
			//白坯款商品编码下单表
			twoWhiteBmOrder(){
				let arg = {
					creat_rq:this.creat_rq,
					bp_gys:this.select_gys_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					bpspbm:this.select_bpkh_list.join(','),
					sort:this.bm_order_sort,
					page:this.bpspbm_page,
					pagesize:this.bpspbm_pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteBmOrder(arg).then(res => {
						if(res.data.code == 1){
							this.bpspbmObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteBmOrder(arg).then(res => {
						if(res.data.code == 1){
							this.bpspbmObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.whiteBmOrder(arg).then(res => {
						if(res.data.code == 1){
							this.bpspbmObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//白坯款商品编码下单表分页
			bpspbmPage(val) {
				this.bpspbm_page = val;
				//白坯款商品编码下单表
				this.twoWhiteBmOrder();
			},
			bpspbmPageSize(val) {
				this.bpspbm_pagesize = val;
				//白坯款商品编码下单表
				this.twoWhiteBmOrder();
			},
			//白坯款商品编码下单表头颜色
			bpspbmCellStyle(v){
				if(v.columnIndex >= 5 && v.columnIndex <= 11){
					return 'background:#87CEFA;color:#333333';
				}else if(v.columnIndex > 11){
					return 'background:#FFD700;color:#333333';
				}else{
					return 'background:#f4f4f4';
				}
			},
			//白坯款商品编码下单表导出
			twoWhiteBmOrderExport(){
				let arg = {
					creat_rq:this.creat_rq,
					sort:this.bm_order_sort,
					bp_gys:this.select_gys_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					bpspbm:this.select_bpkh_list.join(',')
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteBmOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'白坯款商品编码下单表');
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteBmOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'白坯款商品编码下单表');
						}
					})
				}else{
					resource.whiteBmOrderExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'白坯款商品编码下单表');
						}
					})
				}
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
					}else if(type == 'bpksbm'){
						//白坯款式下单表导出
						this.twoWhiteKsOrderExport();
					}else if(type == 'bpspbm'){
						//白坯商品编码下单表导出
						this.twoWhiteBmOrderExport();
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
.toast_box{
	margin-bottom: 15px;
	padding: 10px;
	border-radius: 10px;
	border:1px solid #8D5714;
	width: 50%;
}
.toast_title{
	font-weight: bold;
	font-size: 16px;
	color: #8D5714;
}
.small_title{
	margin-bottom: 5px;
	margin-top: 5px;
	font-size: 14px;
	font-weight:bold;
	color: #8D5714;
}
.dian{
	margin-right: 8px;
	border-radius: 3px;
	background:#8D5714; 
	width: 6px;
	height: 6px;
}
.item_row{
	display:flex;
	align-items: center;
	font-size: 14px;
	color: #8D5714;
}
.table_top{
	display: flex;
	align-items: center;
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