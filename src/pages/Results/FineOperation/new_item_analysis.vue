<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="平台:">
				<el-select v-model="select_plat_ids" clearable @change="getStore" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in plat_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="select_shop_list" clearable multiple
				filterable
				collapse-tags placeholder="全部">
				<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="产品分类：">
			<el-select v-model="select_pl_ids" clearable multiple filterable collapse-tags placeholder="全部">
				<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="商品ID：">
			<el-select v-model="select_spid_list" clearable multiple filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="getSpid" collapse-tags>
				<el-option v-for="item in spid_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="款式编码：">
			<el-select v-model="select_ks_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
				<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="供应商款号：">
			<el-select v-model="select_gyshh_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
				<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="供应商：">
			<el-select v-model="select_gys_ids" clearable multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
				<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="推广负责人：">
			<el-select v-model="tgfzr_ids" clearable multiple filterable reserve-keyword placeholder="请输入推广负责人" collapse-tags>
				<el-option v-for="item in tgfzr_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-checkbox v-model="wtgfzr" :true-label="1" :false-label="0" @change="searchFun">无推广负责人</el-checkbox>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="flex jsb mb-15">
		<div class="top_box gmvtj flex fc">
			<div class="table_title flex ac jc bold f14">GMV统计</div>
			<div class="flex-1 flex jsa ac top_content">
				<div class="flex fc ac jc">
					<div class="f13 bold mb-5">总GMV</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.xsje}}</div>
				</div>
				<div class="flex fc ac jc">
					<div class="f13 bold mb-5">真实GMV</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.gmv_pbd}}</div>
				</div>
				<div class="flex fc ac jc">
					<div class="f13 bold mb-5">剔除补单退款GMV</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.gmv_pbdtk}}</div>
				</div>
			</div>
		</div>
		<div class="top_box zyxfy flex fc">
			<div class="table_title flex ac jc bold f14">总营销费用</div>
			<div class="flex-1 flex jsa ac top_content">
				<div class="flex fc ac jc">
					<div class="f13 bold mb-5">总营销费用</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.total_yxfy}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">直通车</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.ztc_hf}}</div>
					<div class="absolute space-nowrap zb">{{top_data.ztc_hf_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">引力魔方</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.ylmf_xh}}</div>
					<div class="absolute space-nowrap zb">{{top_data.ylmf_xh_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">引力魔方到店</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.ylmf_xh_dp}}</div>
					<div class="absolute space-nowrap zb">{{top_data.ylmf_xh_dp_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">淘客佣金</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.tbk_yj}}</div>
					<div class="absolute space-nowrap zb">{{top_data.tbk_yj_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">万相台</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.wxt_xh}}</div>
					<div class="absolute space-nowrap zb">{{top_data.wxt_xh_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">营销费用(其他)</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.qt_yxfy}}</div>
					<div class="absolute space-nowrap zb">{{top_data.qt_yxfy_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">极速推花费</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.jstj_hf}}</div>
					<div class="absolute space-nowrap zb">{{top_data.jstj_hf_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">超级推荐费用</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.cjtj_hf}}</div>
					<div class="absolute space-nowrap zb">{{top_data.cjtj_hf_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">天猫佣金</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.tmyj}}</div>
					<div class="absolute space-nowrap zb">{{top_data.tmyj_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">鱼塘佣金</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.sd_yj}}</div>
					<div class="absolute space-nowrap zb">{{top_data.sd_yj_zb}}</div>
				</div>
				<div class="height-100 flex fc ac jc relative">
					<div class="f13 bold mb-5">鱼塘快递费</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.ytkdf}}</div>
					<div class="absolute space-nowrap zb">{{top_data.ytkdf_zb}}</div>
				</div>
			</div>
		</div>
		<div class="top_box mytj flex fc">
			<div class="table_title flex ac jc bold f14">营销费用贡献毛益统计</div>
			<div class="flex-1 flex jsa ac top_content">
				<div class="flex fc ac jc">
					<div class="f13 bold mb-5">营销费用贡献毛益</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.gxmy}}</div>
				</div>
				<div class="flex fc ac jc">
					<div class="f13 bold mb-5">营销费用贡献毛益率</div>
					<div class="f15 bold money" v-loading="top_loading">{{top_data.gxmyl}}</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex ac jsb mb-10">
		<PopoverWidget title="指标汇总" width="900" keys="dpzhfx"/>
		<div class="flex ac">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
	</div>
	<custom-table v-loading="loading" :isLoading="loading" tableName="new_item_analysis" max_height="680" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" :total_row="true" :table_total_data="table_total_data" @sortCallBack="sortCallBack" @tableCallBack="tableCallBack" fieldName='spid_url' v-if="!custom_loading"/>
	<div style="width: 100%;height: 80px" v-else v-loading="true"></div>
	<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	<!-- 自定义列表 -->
	<el-dialog title="自定义列表（单击取消列表名保存直接修改）" :visible.sync="show_custom">
		<div class="select_box">
			<el-checkbox-group v-model="selected_ids">
				<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
			</el-checkbox-group>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="Restore">恢复默认</el-button>
			<el-button size="small" @click="Restore('is_close')">取消</el-button>
			<el-button size="small" type="primary" @click="setColumns">保存</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.top_box{
	height: 120px;
	.table_title{
		background: #D6E9EF;
		width: 100%;
		height: 38px;
	}
	.top_content{
		border-bottom: 1px solid #dcdcdc;
		border-left: 1px solid #dcdcdc;
		border-right: 1px solid #dcdcdc;
	}
}
.gmvtj{
	width: 280px;
	margin-right: 3px;
}
.zyxfy{
	flex:1;
}
.mytj{
	margin-left: 3px;
	width: 240px
}
.money{
	margin-top: 3px;
	color:#A96115;
}
.zb{
	color:red;
	font-size: 20px;
	zoom:0.6;
	bottom:5px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'

	import {exportUp} from '../../../api/export.js'
	export default{
		data(){
			return{
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
				date:[getMonthStartDate(),getCurrentDate()],//统计日期
				shop_list:[],								//店铺列表
				select_shop_list:[],						//选中的店铺列表
				plat_list:[],								//平台列表
				select_plat_ids:[],							//选中的平台列表
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				spid_list:[],								//商品id列表
				select_spid_list:[],						//选中的商品ID列表
				tgfzr_list:[],								//推广负责人列表
				tgfzr_ids:[],							//选中的推广负责人列表
				wtgfzr:0,
				top_loading:false,
				top_data:{},
				page:1,
				pagesize:10,
				sort:'',
				sort_type:'',
				loading:false,
				custom_loading:false,
				table_data:[],
				table_total_data:{},
				total:0,
				title_list:[],
				show_custom:false,
				selected_ids:[],							//自定义已选中的id
				row_ids:[],									//可提交的自定义ids
				view_row:[],								//所有列表-指标汇总
			}
		},
		created(){
			//平台列表
			this.ajaxPlat();
			//店铺列表
			this.getStore();
			//品类列表
			this.getPl();
			//推广负责人列表
			this.ajaxTgfzr();
			//点击搜索
			this.searchFun();
		},
		methods:{
			//平台列表
			ajaxPlat(){
				resource.ajaxPlat().then(res => {
					if(res.data.code == 1){
						this.plat_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺列表
			getStore(){
				resource.ajaxViewStore({name:'',platform:this.select_plat_ids.join(','),}).then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类列表
			getPl(){
				resource.ajaxPl({from:10}).then(res => {
					if(res.data.code == 1){
						this.pl_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//商品ID列表
			getSpid(e){
				if(e != ''){
					resource.ajaxSpid({name:e}).then(res => {
						if(res.data.code == 1){
							this.spid_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e,from:10}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxGyshh({name:e,from:10}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
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
			//推广负责人
			ajaxTgfzr(){
				resource.ajaxTgfzr().then(res => {
						if(res.data.code == 1){
							this.tgfzr_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
			},
			//点击搜索
			searchFun(){
				this.page = 1;
				this.pagesize = 10;
				this.sort = '';
				this.sort_type = '';
				//头部汇总
				this.dpNewAnalysisTotal();
				//指标汇总
				this.getList();
			},
			//头部汇总
			dpNewAnalysisTotal(){
				let arg = {
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					empty_tgzrr_flag:this.wtgfzr,
					spid:this.select_spid_list.join(','),
					shop_id:this.select_shop_list.join(','),
					cpfl:this.select_pl_ids.join(','),
					gyskh:this.select_gyshh_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ks:this.select_ks_ids.join(','),
					platform:this.select_plat_ids.join(','),
				}
				this.top_loading = true;
				resource.dpNewAnalysisTotal(arg).then(res => {
					if(res.data.code == 1){
						this.top_loading = false;
						this.top_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//表格
			getList(){
				let arg = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					empty_tgzrr_flag:this.wtgfzr,
					spid:this.select_spid_list.join(','),
					shop_id:this.select_shop_list.join(','),
					cpfl:this.select_pl_ids.join(','),
					gyskh:this.select_gyshh_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ks:this.select_ks_ids.join(','),
					platform:this.select_plat_ids.join(','),
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort,
					sort_type:this.sort_type,
				}
				this.loading = true;
				resource.dpNewAnalysis(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						let table_data = data.table_list.data;
						table_data.map(item => {
							let images = [];
							images.push(item.pic);
							item['images'] = images;
						})
						this.table_data = table_data;
						if(this.table_data.length > 0){
							this.table_total_data = this.table_data[0];
							this.table_data.splice(0,1);
						}else{
							this.table_total_data = {};
						}
						this.total = data.table_list.total;

						this.selected_ids = data.selected_ids;	//自定义已选中的id
						this.view_row = data.view_row;			//自定义
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击自定义列
			customFun(){
				this.row_ids = this.selected_ids;
				this.show_custom = true;
			},
			//恢复默认
			Restore(type){
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
				if(type == 'is_close'){
					this.show_custom = false;
				}
			},
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				this.custom_loading = true;
				resource.setColumns({menu_id:'171',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						this.custom_loading = false;
						//获取列表
						this.page = 1;
						this.pagesize = 10;
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//导出
			commitExport(){
				let req = {
					tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
					tgfzr:this.tgfzr_ids.join(','),
					empty_tgzrr_flag:this.wtgfzr,
					spid:this.select_spid_list.join(','),
					shop_id:this.select_shop_list.join(','),
					cpfl:this.select_pl_ids.join(','),
					gyskh:this.select_gyshh_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ks:this.select_ks_ids.join(','),
					platform:this.select_plat_ids.join(','),
					sort:this.sort,
					sort_type:this.sort_type,
				}
				var export_arr = [];
				for(let key in req){
					export_arr.push(`${key}=${req[key]}`);
				}
				let url = "annual/dp_new_analysis_export?" + export_arr.join("&");
				exportUp(url)
			},
			//跳转商品链接
			tableCallBack(url,table_name){
				window.open(url)
			},
			//排序回调
			sortCallBack(sort){
				if(sort == ''){
					this.sort = sort;
					this.sort_type = sort;
				}else{
					this.sort = sort.split('-')[0];
					this.sort_type = sort.split('-')[1]==0?1:0;
				}
				//获取列表
				this.getList();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
		},
		components:{
			CustomTable,
			PageWidget,
			PopoverWidget
		}
	}
</script>







