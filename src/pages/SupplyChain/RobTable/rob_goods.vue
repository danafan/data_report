<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="update_time">更新时间：{{dataObj.update_time}}</div>
		<el-table size="small" ref="multipleTable" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" max-height="630px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="gys" label="供应商" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="款式编码" align="center">
				<template slot-scope="scope">
					<!-- 下钻 -->
					<el-tooltip placement="top-end">
						<div slot="content">
							<el-button type="text" size="mini" @click="getDetail(scope.row.ksbm)">下钻</el-button>
						</div>
						<div style="color: #1890FF">{{scope.row.ksbm}}</div>
					</el-tooltip>
				</template>
			</el-table-column>
			<el-table-column prop="gysbm" label="供应商货号" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="qhs" label="缺货数" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="3_xssl" label="3天销量" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="7_xssl" label="7天销量" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="kc" label="现有库存" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dhs" label="今日到货数" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sfq200" label="是否前200款" align="center" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="sfcxqh" label="是否持续缺货" align="center" show-overflow-tooltip>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 下钻 -->
		<el-dialog title="款式信息" @close="closeDetail" :visible.sync="detailDialog">
			<el-table :data="data" size="mini">
				<el-table-column align="center" prop="ksbm" label="款号"></el-table-column>
				<el-table-column align="center" prop="color" label="图片">
					<template slot-scope="scope">
						<el-image :z-index="2006" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="scope.row.images"></el-image>
						<div v-else></div>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="color" label="颜色"></el-table-column>
				<el-table-column align="center" prop="size" label="尺码"></el-table-column>
				<el-table-column prop="qhs" label="缺货数" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="3_xssl" label="3天销量" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="7_xssl" label="7天销量" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="kc" label="现有库存" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="dhs" label="今日到货数" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="sfq200" label="是否前200款" align="center" show-overflow-tooltip>
				</el-table-column>
				<el-table-column prop="sfcxqh" label="是否持续缺货" align="center" show-overflow-tooltip>
				</el-table-column>
				
			</el-table>
			<div class="page">
				<el-pagination
				@size-change="detailSizeChange"
				@current-change="detailCurrentChange"
				:current-page="detail_page"
				:pager-count="11"
				:page-sizes="[5, 10, 15, 20]"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				>
			</el-pagination>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button size="mini" type="primary" @click="detailDialog = false">关闭</el-button>
		</span>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.update_time{
	margin-bottom:5px;
	color: red;
	font-size: 14px; 
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import demandResource from '../../../api/demandResource.js'
	export default{
		data(){
			return{
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				pagesize:10,
				page:1,
				dataObj:{},
				loading:false,
				detailDialog:false,			
				detail_page:1,
				detail_page_size:10,
				ksbm:"",
				data:[],
				total:0
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
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
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxGyshh({name:e}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
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
			//获取列表
			getList(){		
				let arg = {
					ksbm:this.select_ks_ids.join(','),
					gys:this.select_gys_ids.join(','),
					gysbm:this.select_gyshh_ids.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				demandResource.grabGoods(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
			//获取下钻内容
			getDetail(ksbm){
				this.ksbm = ksbm;
				let arg = {
					page:this.detail_page,
					pagesize:this.detail_page_size,
					ksbm:this.ksbm
				}
				demandResource.grabGoodsSku(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data.data;
						data.map(item => {
							let images = [];
							if(item.tp_url != ''){
								images.push(item.tp_url);
								item.images = images;
							}else{
								item.images = null;
							}
						})
						this.data = data;
						this.total = res.data.data.total
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭
			closeDetail(){
				this.detail_page = 1;
			},
			//分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				//获取列表
				this.getDetail(this.ksbm);
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetail(this.ksbm);
			}
		}
	}
</script>