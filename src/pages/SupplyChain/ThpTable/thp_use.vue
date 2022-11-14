<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="仓库位置：">
				<el-select v-model="ckwzpj_ids" clearable multiple filterable collapse-tags placeholder="全部" @focus="setOptionWidth">
					<el-option v-for="item in ckwzpj" :key="item" :label="item" :value="item" :style="{width:selectOptionWidth}">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="pp_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pp" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="部门归属：">
				<el-select v-model="gs_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in gs" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画片商品编码：">
				<el-select v-model="thspbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画片商品编码" :remote-method="getSpbm" collapse-tags >
					<el-option v-for="item in thspbm" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画片款式编码：">
				<el-select v-model="thksbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画片款式编码" :remote-method="getKsbm" collapse-tags >
					<el-option v-for="item in thksbm" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="三天销量:">
				<el-input type="number" style="width: 50px" v-model="stxl_start"></el-input> ~ 
				<el-input type="number" style="width: 50px" v-model="stxl_end"></el-input>
			</el-form-item>
			<el-form-item label="七天销量:">
				<el-input type="number" style="width: 50px" v-model="qtxl_start"></el-input> ~ 
				<el-input type="number" style="width: 50px" v-model="qtxl_end"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<PopoverWidget title="指标解释" keys="thp_use"/>
			<div style="display: flex;align-items: center">
				<el-button type="primary" plain size="small" @click="exportFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
				<el-button size="mini" type="primary" @click="daysDialog = true">设置建议备货数</el-button>
			</div>
		</div>
		<el-table size="small" :data="data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" max-height="630px" @sort-change="tableSortChange" v-loading="loading">
			<el-table-column label="图片" align="center" width="180">
				<template slot-scope="scope">
					<el-image :z-index="2006" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="scope.row.images"></el-image>
					<div v-else>暂无图片</div>
				</template>
			</el-table-column>
			<el-table-column prop="thspbm" label="烫画片商品编码" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="thksbm" label="烫画片款式编码" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="xjkc" label="箱及库存" align="center" width="120" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="jybhs" width="120" align="center" sortable="custom">
				<template slot="header">
					<div style="display: inline-block">
						<div style="display: inline-block">建议备货数</div>
						<el-tooltip class="item" effect="dark" content="建议备货数 = 七天日均销量 * 建议备货数 - 箱及库存" placement="top-start">
							<i class="el-icon-warning" style="color: #FFE58F"></i>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="jybhs_1" label="前一天建议备货数" align="center" width="140" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="jybhs_2" label="前两天建议备货数" align="center" width="140" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="jybhs_3" label="前三天建议备货数" align="center" width="140" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="th_3" label="三天销量" align="center" width="120" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="th_7" label="七天销量" align="center" width="120" show-overflow-tooltip sortable="custom">
			</el-table-column>
			<el-table-column prop="ckwzpj" label="仓库位置" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="gs" label="部门归属" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="pp" label="品牌" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 建议备货数 -->
		<el-dialog title="建议备货数" width="30%" @close="days = ''" center :visible.sync="daysDialog">
			<div class="num_row">
				<div>七天日均销量 x&nbsp</div>
				<el-input type="number" size="mini" style="width: 50px" v-model="days"></el-input>&nbsp 
				天 - 箱及库存
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button size="mini" @click="daysDialog = false">取消</el-button>
				<el-button size="mini" type="primary" @click="commitFn">确认</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../../api/demandResource.js'

	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';

	import PopoverWidget from '../../../components/popover_widget.vue'
	export default{
		data(){
			return{
				ckwzpj:[],			//仓库列表
				ckwzpj_ids:[],		//选中的仓库列表
				gs:[],				//部门归属
				gs_ids:['得物'],			//选中的部门归属
				pp:[],				//品牌
				pp_ids:[],			//选中的品牌
				thspbm:[],			//烫画商品编码
				thspbm_ids:[],		//选中的烫画商品编码
				thksbm:[],			//烫画款式编码
				thksbm_ids:[],		//选中烫画款式编码
				page:1,
				pagesize:10,
				table_sort:"",		//排序
				stxl_start:"",		//三天销量
				stxl_end:"",
				qtxl_start:"",		//七天销量
				qtxl_end:"",
				loading:false,
				data:[],
				total:0,
				daysDialog:false,
				days:"",
				selectOptionWidth:null
			}
		},
		created(){
			//获取搜索条件列表
			this.statisticalSearch('other');
			//获取列表
			this.getData();
		},
		methods:{
			//烫画款商品编码
			getSpbm(v){
				//获取搜索条件列表
				this.statisticalSearch('thspbm',v);
			},
			//烫画款款式编码
			getKsbm(v){
				//获取搜索条件列表
				this.statisticalSearch('thksbm',v);
			},
			//获取搜索条件列表
			statisticalSearch(type,keywords){
				let arg = {
					type:type,
				}
				if(type != 'other'){
					arg.keywords = keywords;
				}
				resource.statisticalSearch(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						if(type == 'other'){	
							this.ckwzpj = data.ckwzpj;
							this.gs = data.gs;
							this.pp = data.pp;
						}else if(type == 'thspbm'){	
							this.thspbm = data;
						}else if(type == 'thksbm'){	
							this.thksbm = data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			setOptionWidth(event){
				this.$nextTick(() => {
					this.selectOptionWidth = event.srcElement.offsetWidth + 120 + "px";
				}); 
			},
			//导出
			exportFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						thspbm:this.thspbm_ids.join(','),
						thksbm:this.thksbm_ids.join(','),
						ckwzpj:this.ckwzpj_ids.join(','),
						gs:this.gs_ids.join(','),
						pp:this.pp_ids.join(','),
						th_3:this.stxl_start == "" && this.stxl_end == ""?"":((this.stxl_start == ""?0:this.stxl_start) + ',' + (this.stxl_end == ""?100000000:this.stxl_end)),
						th_7:this.qtxl_start == "" && this.qtxl_end == ""?"":((this.qtxl_start == ""?0:this.qtxl_start) + ',' + (this.qtxl_end == ""?100000000:this.qtxl_end)),
						sort:this.table_sort
					}
					resource.statisticalListExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'烫画片使用统计');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//点击搜索
			searchFn(){
				if(this.stxl_start != "" && this.stxl_end != "" && this.stxl_start > this.stxl_end){
					this.$message.warning('三天销量区间无效！');
				}else if(this.qtxl_start != "" && this.qtxl_end != "" && this.qtxl_start > this.qtxl_end){
					this.$message.warning('七天销量区间无效！');
				}else{
					this.handleCurrentChange(1);
				}
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
			//表格排序    
			tableSortChange({ column, prop, order }) {  
				if(order){
					this.table_sort = prop + '-' + (order == 'ascending'?'asc':'desc');
				}else{
					this.table_sort = "";
				}
				//获取列表
				this.getData();
			}, 
			//获取列表
			getData(){
				let arg = {
					thspbm:this.thspbm_ids.join(','),
					thksbm:this.thksbm_ids.join(','),
					ckwzpj:this.ckwzpj_ids.join(','),
					gs:this.gs_ids.join(','),
					pp:this.pp_ids.join(','),
					th_3:this.stxl_start == "" && this.stxl_end == ""?"":((this.stxl_start == ""?0:this.stxl_start) + ',' + (this.stxl_end == ""?100000000:this.stxl_end)),
					th_7:this.qtxl_start == "" && this.qtxl_end == ""?"":((this.qtxl_start == ""?0:this.qtxl_start) + ',' + (this.qtxl_end == ""?100000000:this.qtxl_end)),
					sort:this.table_sort,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.statisticalList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						let table_data = data.data;
						table_data.map(item => {
							let images = [];
							if(item.tp){
								images.push(item.tp);
								item.images = images;
							}else{
								item.images = null;
							}
						})
						this.data = table_data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击提交安全库存
			commitFn(){
				if(this.days == ""){
					this.$message.warning('请填写安全天数');
					return;
				}
				let arg = {
					thspbm:this.thspbm_ids.join(','),
					thksbm:this.thksbm_ids.join(','),
					ckwzpj:this.ckwzpj_ids.join(','),
					gs:this.gs_ids.join(','),
					pp:this.pp_ids.join(','),
					th_3:this.stxl_start == "" && this.stxl_end == ""?"":((this.stxl_start == ""?0:this.stxl_start) + ',' + (this.stxl_end == ""?100000000:this.stxl_end)),
					th_7:this.qtxl_start == "" && this.qtxl_end == ""?"":((this.qtxl_start == ""?0:this.qtxl_start) + ',' + (this.qtxl_end == ""?100000000:this.qtxl_end)),
					days:this.days
				}
				resource.updateStock(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.daysDialog = false;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			PopoverWidget
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
}
.num_row{
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>