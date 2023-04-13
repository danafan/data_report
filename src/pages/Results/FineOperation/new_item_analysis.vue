<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计日期：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="推广负责人：">
				<el-input v-model="tgfzr" clearable placeholder="请输入推广负责人姓名"></el-input>
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
						<div class="f14 bold mb-5">总GMV</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.xsje}}</div>
					</div>
					<div class="flex fc ac jc">
						<div class="f14 bold mb-5">剔除补单GMV</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.gmv_pbd}}</div>
					</div>
					<div class="flex fc ac jc">
						<div class="f14 bold mb-5">剔除补单退款GMV</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.gmv_pbdtk}}</div>
					</div>
				</div>
			</div>
			<div class="top_box zyxfy flex fc">
				<div class="table_title flex ac jc bold f14">总营销费用</div>
				<div class="flex-1 flex jsa ac top_content">
					<div class="flex fc ac jc">
						<div class="f14 bold mb-5">总营销费用</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.total_yxfy}}</div>
					</div>
					<div class="height-100 flex fc ac jc relative">
						<div class="f14 bold mb-5">直通车</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.ztc_hf}}</div>
						<div class="absolute space-nowrap zb">占比：{{top_data.ylmf_xh_zb}}</div>
					</div>
					<div class="height-100 flex fc ac jc relative">
						<div class="f14 bold mb-5">引力魔方</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.ylmf_xh}}</div>
						<div class="absolute space-nowrap zb">占比：{{top_data.ylmf_xh_zb}}</div>
					</div>
					<div class="height-100 flex fc ac jc relative">
						<div class="f14 bold mb-5">淘客佣金</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.tbk_yj}}</div>
						<div class="absolute space-nowrap zb">占比：{{top_data.tbk_yj_zb}}</div>
					</div>
					<div class="height-100 flex fc ac jc relative">
						<div class="f14 bold mb-5">鱼塘佣金</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.sd_yj}}</div>
						<div class="absolute space-nowrap zb">占比：{{top_data.sd_yj_zb}}</div>
					</div>
					<div class="height-100 flex fc ac jc relative">
						<div class="f14 bold mb-5">鱼塘快递费</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.ytkdf}}</div>
						<div class="absolute space-nowrap zb">占比：{{top_data.ytkdf_zb}}</div>
					</div>
				</div>
			</div>
			<div class="top_box mytj flex fc">
				<div class="table_title flex ac jc bold f14">毛益统计</div>
				<div class="flex-1 flex jsa ac top_content">
					<div class="flex fc ac jc">
						<div class="f14 bold mb-5">贡献毛益</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.gxmy}}</div>
					</div>
					<div class="flex fc ac jc">
						<div class="f14 bold mb-5">贡献毛益率</div>
						<div class="f22 bold money" v-loading="top_loading">{{top_data.gxmyl}}</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="指标汇总" :show_popover="false"/>
			<div class="flex ac">
				<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
				<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="new_item_analysis" max_height="750" :table_data="table_data" :title_list="title_list" :total_row="true" :table_total_data="table_total_data" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
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
	height: 140px;
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
	width: 29%;
}
.zyxfy{
	width: 50%;
}
.mytj{
	width: 19%;
}
.money{
	color:#A96115;
}
.zb{
	color:red;
	font-size: 12px;
	bottom:8px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'

	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'
	import PopoverWidget from '../../../components/popover_widget.vue'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
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
				tgfzr:"",
				top_loading:false,
				top_data:{},
				page:1,
				pagesize:10,
				sort:'',
				sort_type:'',
				loading:false,
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
			//点击搜索
			this.searchFun();
		},
		methods:{
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
					tgfzr:this.tgfzr
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
					tgzrr:this.tgfzr,
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort,
					sort_type:this.sort_type,
				}
				this.loading = true;
				this.title_list = [];
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
				resource.setColumns({menu_id:'171',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
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
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						tjrq_start:this.date && this.date.length> 0?this.date[0]:"",
						tjrq_end:this.date && this.date.length> 0?this.date[1]:"",
						tgzrr:this.tgfzr,
						sort:this.sort,
						sort_type:this.sort_type,
					}
					resource.dpNewAnalysisExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'单品综合分析');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
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







