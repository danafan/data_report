<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="季节：">
				<el-select v-model="select_jj_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option label="春" value="春"></el-option>
					<el-option label="夏" value="夏"></el-option>
					<el-option label="秋" value="秋"></el-option>
					<el-option label="冬" value="冬"></el-option>
					<el-option label="四季" value="四季"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="自有货品：">
				<el-select v-model="select_sfzzk_id" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option label="CHRISUNO" value="CHRISUNO"></el-option>
					<el-option label="白坯" value="白坯"></el-option>
					<el-option label="自主款" value="自主款"></el-option>
					<el-option label="海外" value="海外"></el-option>
					<el-option label="VASCO" value="VASCO"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="销售性质：">
				<el-select v-model="select_xsxz_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="爆" value="5"></el-option>
					<el-option label="畅" value="4"></el-option>
					<el-option label="平" value="3"></el-option>
					<el-option label="滞" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="建议货品性质：">
				<el-select v-model="select_jyhpxz_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="试" value="试"></el-option>
					<el-option label="补" value="补"></el-option>
					<el-option label="停" value="停"></el-option>
					<el-option label="清" value="清"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="实际货品性质：">
				<el-select v-model="select_sjhpxz_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="试" value="1"></el-option>
					<el-option label="补" value="2"></el-option>
					<el-option label="停" value="3"></el-option>
					<el-option label="清" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="当天缺货率 ：">
				<el-select v-model="outstock_rate_1_classify" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="不缺货" value="1"></el-option>
					<el-option label="轻度缺货" value="2"></el-option>
					<el-option label="严重缺货" value="3"></el-option>
					<el-option label="整款缺货" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="综合缺货率 ：">
				<el-select v-model="outstock_rate_3_classify" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="不缺货" value="1"></el-option>
					<el-option label="偶尔缺货" value="2"></el-option>
					<el-option label="经常缺货" value="3"></el-option>
					<el-option label="持续缺货" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="毛利率分类 ：">
				<el-select v-model="mlv_7d_classify" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="低毛利" value="1"></el-option>
					<el-option label="正常毛利" value="2"></el-option>
					<el-option label="高毛利" value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="周转天数 ：">
				<el-select v-model="Turnover_days_classify" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="30天内" value="1"></el-option>
					<el-option label="30-60天" value="2"></el-option>
					<el-option label="60-90天" value="3"></el-option>
					<el-option label="大于90天" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_list">
			<div class="table_item" v-for="(item,index) in table_list">
				<div class="first_table" v-if="index == 0">
					<el-card>
						<div class="card_row">
							<div class="card_lable">款数</div>
							<div class="card_value">{{table_list[0].list.ks_count}}</div>
						</div>

					</el-card>
					<el-card>
						<div class="card_row">
							<div class="card_lable">库存</div>
							<div class="card_value">{{table_list[0].list.kc_total}}</div>
						</div>
					</el-card>
					<el-card>
						<div class="card_row">
							<div class="card_lable">成本</div>
							<div class="card_value">{{table_list[0].list.cb_total}}</div>
						</div>
					</el-card>
				</div>
				<div v-else>
					<div class="table_title">{{item.name}}{{index == 5?'（滚动三天）':index == 6?'（滚动七天）':''}}</div>
					<el-table size="small" :data="item.list" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
						<el-table-column prop="name" :label="item.name" align="center"></el-table-column>
						<el-table-column prop="ks_count" label="款数" align="center"></el-table-column>
						<el-table-column prop="kc_total" label="库存" align="center"></el-table-column>
						<el-table-column prop="cb_total" label="成本" align="center"></el-table-column>
						<el-table-column prop="cb_rate" label="成本占比" align="center">
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
			<el-table-column prop="supplier_ksbm" label="款式图片" width="120" align="center">
				<template slot-scope="scope">
					<img style="width: 80px;height: 80px" :src="scope.row.tp" @click="bigImg(scope.row.tp)">
				</template>
			</el-table-column>
			<el-table-column prop="ksbm" label="款式编码" sortable width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="jj" label="季节" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="cpfl" label="品类" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="gys" label="供应商" sortable width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="jgd" label="价格带" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="sjcb" label="审计成本" sortable width="100" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.sjcb !== null">{{scope.row.sjcb}}元</div>
				</template>
			</el-table-column>
			<el-table-column prop="kc" label="库存" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="stxl" label="累计3天销量" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="qtxl" label="累计7天销量" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="swtxl" label="累计15天销量" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="xsxz_gs" label="销售性质" sortable width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="jyhpxz" label="建议货品性质" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="sjhpxz" label="实际货品性质" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="outstock_rate_1_classify" label="当天缺货率" sortable width="120" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.outstock_rate_1_classify == '1'">不缺货</div>
					<div v-if="scope.row.outstock_rate_1_classify == '2'">轻度缺货</div>
					<div v-if="scope.row.outstock_rate_1_classify == '3'">严重缺货</div>
					<div v-if="scope.row.outstock_rate_1_classify == '4'">整款缺货</div>
				</template>
			</el-table-column>
			<el-table-column prop="outstock_rate_3_classify" label="综合缺货率(三天)" sortable width="140" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.outstock_rate_3_classify == '1'">不缺货</div>
					<div v-if="scope.row.outstock_rate_3_classify == '2'">偶尔缺货</div>
					<div v-if="scope.row.outstock_rate_3_classify == '3'">经常缺货</div>
					<div v-if="scope.row.outstock_rate_3_classify == '4'">持续缺货</div>
				</template>
			</el-table-column>
			<el-table-column prop="sl" label="毛利率分类(三天)" sortable width="140" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.mlv_7d_classify == '1'">低毛利</div>
					<div v-if="scope.row.mlv_7d_classify == '2'">正常毛利</div>
					<div v-if="scope.row.mlv_7d_classify == '3'">高毛利</div>
				</template>
			</el-table-column>
			<el-table-column prop="mlv_7d" label="毛利率" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>{{scope.row.mlv_7d*100}}%</div>
				</template>
			</el-table-column>
			<el-table-column prop="ckwz" label="周转天数" sortable width="100" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.Turnover_days_classify == '1'">30天内</div>
					<div v-if="scope.row.Turnover_days_classify == '2'">0-60天</div>
					<div v-if="scope.row.Turnover_days_classify == '3'">60-90天</div>
					<div v-if="scope.row.Turnover_days_classify == '4'">大于90天</div>
				</template>
			</el-table-column>
			<el-table-column prop="cjsj" label="建档时间" sortable width="120" show-overflow-tooltip align="center"></el-table-column>
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
.table_list{
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	.table_item{
		width: 40%;
		height: 300px;
		padding-left: 30px;
		padding-right: 30px;
	}
	.first_table{
		height: 300px;
		display:flex;
		flex-direction: column;
		justify-content: space-around;
		.card_row{
			display:flex;
			align-items: center;
			justify-content: space-between;
			.card_lable{
				font-size: 14px;
				font-weight: bold;
			}
			.card_value{
				font-size: 24px;
				font-weight: bold;
				color:#EA4780;
			}
		}
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				ks_list:[],				//款式编码列表
				select_ks_ids:[],		//选中的款式编码列表
				select_jj_ids:[],		//选中的季节
				gys_list:[],			//供应商列表
				select_gys_ids:[],		//选中的供应商
				pl_list:[],				//品类列表
				select_pl_ids:[],		//选中的品类列表
				select_sfzzk_id:[],		//选中的自有货品
				select_xsxz_id:"",		//店铺销售性质
				select_jyhpxz_id:"",	//选中的建议货品性质
				select_sjhpxz_id:"",	//选中的实际货品性质
				outstock_rate_1_classify:"",	//当天缺货率
				outstock_rate_3_classify:"",	//综合缺货率
				mlv_7d_classify:"",				//毛利率分类
				Turnover_days_classify:"",		//周转天数
				table_list:[],			//顶部表格列表
				dataObj:{},				//底部表格
				sort:"",
				page:1,
				pagesize:10,
				imageDialog:false,
				big_img_url:""
			}
		},
		created(){
			//品类列表
			this.getPl();
			//顶部表格列表
			this.dynamicAnalysisIndex();
			//底部表格列表
			this.dynamicAnalysisList();
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
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					resource.ajaxPl().then(res => {
						if(res.data.code == 1){
							this.pl_list = res.data.data;
							this.$store.commit('setPlList',this.pl_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.pl_list = this.$store.state.pl_list;
				}
			},
			//获取列表
			searchFn(){
				this.page = 1;
				this.sort = '';
				//顶部表格列表
				this.dynamicAnalysisIndex();
				//底部表格列表
				this.dynamicAnalysisList();
			},
			//顶部表格列表
			dynamicAnalysisIndex(){
				let arg = {
					ksbm:this.select_ks_ids.join(','),
					jj:this.select_jj_ids.join(','),
					gys:this.select_gys_ids.join(','),
					cpl:this.select_pl_ids.join(','),
					plbz:this.select_sfzzk_id.join(','),
					xsxz_gs:this.select_xsxz_id,
					jyhpxz:this.select_jyhpxz_id,
					sjhpxz:this.select_sjhpxz_id,
					outstock_rate_1_classify:this.outstock_rate_1_classify,
					outstock_rate_3_classify:this.outstock_rate_3_classify,
					mlv_7d_classify:this.mlv_7d_classify,
					Turnover_days_classify:this.Turnover_days_classify
				}
				resource.dynamicAnalysisIndex(arg).then(res => {
					if(res.data.code == 1){
						this.table_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//底部表格列表
			dynamicAnalysisList(){
				let arg = {
					ksbm:this.select_ks_ids.join(','),
					jj:this.select_jj_ids.join(','),
					gys:this.select_gys_ids.join(','),
					cpl:this.select_pl_ids.join(','),
					plbz:this.select_sfzzk_id.join(','),
					xsxz_gs:this.select_xsxz_id,
					jyhpxz:this.select_jyhpxz_id,
					sjhpxz:this.select_sjhpxz_id,
					outstock_rate_1_classify:this.outstock_rate_1_classify,
					outstock_rate_3_classify:this.outstock_rate_3_classify,
					mlv_7d_classify:this.mlv_7d_classify,
					Turnover_days_classify:this.Turnover_days_classify,
					page:this.page,
					pagesize:this.pagesize,
					sort:this.sort
				}
				resource.dynamicAnalysisList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序
        	sortChange(column){
        		if(column.order){
        			let order = column.order == 'ascending'?'asc':'desc';
        			this.sort = column.prop + '-' + order;
        		}else{
        			this.sort = '';
        		}
        		this.dynamicAnalysisList();
        	},
        	//分页
        	handleSizeChange(val) {
        		this.pagesize = val;
				//获取列表
				this.dynamicAnalysisList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.dynamicAnalysisList();
			},
        	//图片放大
        	bigImg(big_img_url){
        		this.imageDialog = true;
        		this.big_img_url = big_img_url;
        	},
		}
	}
</script>















