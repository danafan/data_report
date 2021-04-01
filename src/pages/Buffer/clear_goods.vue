<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺：">
				<el-select v-model="select_shop_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入供应商"
				:remote-method="ajaxGys"
				 collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_gyshh_list" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入供应商货号"
				:remote-method="ajaxGyshh"
				 collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_list" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入款式"
				:remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="建议货品性质：">
				<el-select v-model="jyhpxz" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in jyhpxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="波段：">
				<el-select v-model="select_bd_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in bd_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="运营决策：">
				<el-select v-model="yyjc" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in yyjc_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购决策：">
				<el-select v-model="cgjc" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in cgjc_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="写入日期：">
			<el-date-picker
			v-model="xr_start_time"
			type="date"
			value-format="yyyy-MM-dd"
			placeholder="选择日期"
			:append-to-body="false"
			>
		</el-date-picker>
	</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="getList('1')">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="table_setting">
		<el-popover
		placement="right-start"
		:append-to-body="false"
		width="150"
		trigger="click">
		<div class="setStyle">
			<el-button type="primary" size="small" plain @click="setKs('1','试')">试</el-button>
			<el-button type="primary" size="small" plain @click="setKs('2','补')">补</el-button>
		</div>
		<div class="setStyle">
			<el-button type="danger" size="small" plain @click="setKs('3','停')">停</el-button>
		</div>
		<el-button type="primary" size="small" slot="reference">批量设置</el-button>
	</el-popover>
	<div class="buts">
		<el-button type="primary" size="small" @click="show_custom = true">自定义列表</el-button>
		<el-button type="primary" plain size="small" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
</div>
<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{'background':'#f4f4f4'}">
	<el-table-column type="selection" width="55" fixed></el-table-column>
	<el-table-column :prop="item.row_field_name" :label="item.row_name" :width="item.row_field_name == 'bd'?160:120" align="center" v-for="item in dataObj.title_list">
		<template slot-scope="scope">
			<!-- 下钻 -->
			<el-button type="text" size="small" @click="getDetail(scope.row.ksbm,scope.row.sjxrrq)" v-if="item.row_field_name == 'ksbm'">{{scope.row[item.row_field_name]}}</el-button>
			<div v-else>{{scope.row[item.row_field_name]}}</div>
		</template>
	</el-table-column>
	<el-table-column label="操作" align="center" width="180" fixed="right">
		<template slot-scope="scope">
			<el-button type="text" size="small" @click="setKs('1','试',scope.row.ksbm)">试</el-button>
			<el-button type="text" size="small" @click="setKs('2','补',scope.row.ksbm)">补</el-button>
			<el-button type="text" size="small" @click="setKs('3','停',scope.row.ksbm)">停</el-button>
		</template>
	</el-table-column>
</el-table>
<div class="page">
	<el-pagination
	@size-change="handleSizeChange"
	@current-change="handleCurrentChange"
	:current-page="page"
	:pager-count="11"
	:page-sizes="[5, 10, 15, 20]"
	layout="total, sizes, prev, pager, next, jumper"
	:total="dataObj.total"
	>
</el-pagination>
</div>
<!-- 自定义列表 -->
<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
	<div class="select_box">
		<el-checkbox-group v-model="row_ids">
			<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in dataObj.view_row">{{item.row_name}}</el-checkbox>
		</el-checkbox-group>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="Restore">恢复默认</el-button>
		<el-button size="small" @click="show_custom = false">取消</el-button>
		<el-button size="small" type="primary" @click="getList('2')">保存</el-button>
	</div>
</el-dialog>
<!-- 下钻 -->
<el-dialog title="款式信息" @close="closeDetail" :visible.sync="detailDialog">
	<el-table :data="detailData.data" size="small">
		<el-table-column width="120" align="center" property="spbm" label="商品编码"></el-table-column>
		<el-table-column align="center" property="jsfhdqtxl" label="七天销量"></el-table-column>
		<el-table-column align="center" property="kys" label="可用库存"></el-table-column>
		<el-table-column align="center" property="zts" label="在途数"></el-table-column>
		<el-table-column align="center" property="bhts" label="备货天数"></el-table-column>
		<el-table-column align="center" property="qzxs" label="权重系数"></el-table-column>
		<el-table-column align="center" property="jybhsl" label="补货数量"></el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="detailSizeChange"
		@current-change="detailCurrentChange"
		:current-page="detail_page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="detailData.total"
		>
	</el-pagination>
</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	.buts{
		display: flex;
	}
}
.setStyle{
	height: 50px;
	display:flex;
	align-items: center;
	justify-content:space-around;
}
</style>
<script>
	import resource from '../../api/resource.js'
	import exportFile from '../../api/export.js'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				shop_list:[],								//店铺列表
				select_shop_list:[],						//选中的店铺列表
				gys_list:[],								//供应商列表
				select_gys:[],								//选中的供应商列表
				gyshh_list:[],								//供应商货号列表
				select_gyshh_list:[],						//选中的供应商货号列表
				pl_list:[],									//品类列表
				select_pl_list:[],							//选中的品类列表
				ks_list:[],									//款式列表
				select_ks_list:[],							//选中的款式列表
				jyhpxz_list:['试','补','清'],					//建议货品性质列表
				jyhpxz:"",
				bd_list:[],									//波段列表
				select_bd_list:[],							//选中的波段列表
				xr_start_time:"",							//写入日期
				yyjc_list:[],								//运营决策
				yyjc:"",
				cgjc_list:[],								//采购决策
				cgjc:"",
				dataObj:{},									//列表数据
				select_ids:[],								//批量操作选中的id列表
				show_custom:false,							//自定义列表是否显示
				row_ids:[],									//选择的自定义列表id
				detailData:[],								//下钻信息
				sjxrrq:"",
				ksbm:"",
				detailDialog:false,			
				detail_page:1,
				detail_page_size:10
			}
		},
		created(){
			//店铺列表
			this.ajaxViewStore();
			//产品分类
			this.ajaxPl();
			//产品波段
			this.ajaxBd();
			//运营决策列表
			this.ajaxYyjc();
			//运营决策列表
			this.ajaxCgjc();
			//获取列表
			this.getList('1');
		},
		methods:{
			//导出
			exportFile(){
				var arr = [];
				let req = {
					pagesize:this.pagesize,
					page:this.page,
					shop_id:this.select_shop_list.join(','),
					gys:this.select_gys.join(','),
					gyshh:this.select_gyshh_list.join(','),
					pl:this.select_pl_list.join(','),
					ks:this.select_ks_list.join(','),
					jyhpxz:this.jyhpxz,
					bd:this.select_bd_list.join(','),
					yyjc:this.yyjc,
					cgjc:this.cgjc,
					xr_start_time:this.xr_start_time
				}
				for(var item in req){
					let str = item + '=' + req[item];
					arr.push(str);
				};
				exportFile.exportUp(`clear/clearexport?${arr.join('&')}`)
			},
			//获取列表
			getList(type){		//type:1(搜索);2:设置字段
				let req = {
					pagesize:this.pagesize,
					page:type == '1'?1:this.page,
					shop_id:this.select_shop_list.join(','),
					gys:this.select_gys.join(','),
					gyshh:this.select_gyshh_list.join(','),
					pl:this.select_pl_list.join(','),
					ks:this.select_ks_list.join(','),
					jyhpxz:this.jyhpxz,
					bd:this.select_bd_list.join(','),
					yyjc:this.yyjc,
					cgjc:this.cgjc,
					xr_start_time:this.xr_start_time
				}
				if(type == '2'){
					req.row_ids = this.row_ids.join(',');
				}
				resource.clearList(req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						if(type == '2'){
							this.$message.success(res.data.msg);
							this.show_custom = false;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//运营决策列表
			ajaxYyjc(){
				resource.ajaxYyjc().then(res => {
					if(res.data.code == 1){
						this.yyjc_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//采购决策列表
			ajaxCgjc(){
				resource.ajaxCgjc().then(res => {
					if(res.data.code == 1){
						this.cgjc_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺列表
			ajaxViewStore(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//产品分类
			ajaxPl(){
				resource.ajaxPl().then(res => {
					if(res.data.code == 1){
						this.pl_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商列表
			ajaxGys(e){
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
			ajaxGyshh(e){
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
			//波段列表
			ajaxBd(){
				resource.ajaxBd().then(res => {
					if(res.data.code == 1){
						this.bd_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//产品编码
			ajaxKsbm(e){
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
			//切换选中
			handleSelectionChange(val) {
				this.select_ids = [];
				val.map(item => {
					this.select_ids.push(item.ksbm)
				})
			},
			//设置
			setKs(type,title,ksbm){
				if(!ksbm && this.select_ids.length == 0){
					this.$message.warning('至少选择一个款式');
					return;
				}
				//1:试；2:补；3:停
				this.$confirm(`货品性质确定转为${title}么？想好哦！`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(ksbm){
						this.select_ids.push(ksbm);
					}
					let ks = this.select_ids.join(',');
					if(type == '1'){
						resource.clearTry({ks:ks}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '2'){
						resource.clearReplenish({ks:ks}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '3'){
						resource.clearStop({ks:ks}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
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
			//恢复默认
			Restore(){
				this.row_ids = [];
				this.dataObj.view_row.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			
			//下钻
			getDetail(ksbm,sjxrrq){
				this.ksbm = ksbm;
				this.sjxrrq = sjxrrq;
				//获取下钻内容
				this.getDetailList();
			},
			//获取下钻内容
			getDetailList(){
				let req = {
					day:this.sjxrrq,
					ks:this.ksbm,
					page:this.detail_page,
					page_size:this.detail_page_size
				}
				resource.clearDetail(req).then(res => {
					if(res.data.code == 1){
						this.detailData = res.data.data;
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭
			closeDetail(){
				this.detail_page_size = 10;
				this.detail_page = 1;
			},
			//分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				//获取列表
				this.getDetailList();
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetailList();
			},
		}
	}
</script>