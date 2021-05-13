<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部:" style="margin-right: 20px">
				<el-select v-model="select_department_ids" clearable :popper-append-to-body="false" @change="GetStoreList" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
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
<el-form-item label="店铺销售性质：">
	<el-select v-model="xsxz" clearable :popper-append-to-body="false" placeholder="全部">
		<el-option v-for="item in xsxz_list" :key="item.id" :label="item.name" :value="item.id">
		</el-option>
	</el-select>
</el-form-item>
<el-form-item label="公司销售性质：">
	<el-select v-model="xsxz_gs" clearable :popper-append-to-body="false" placeholder="全部">
		<el-option v-for="item in xsxz_list" :key="item.id" :label="item.name" :value="item.id">
		</el-option>
	</el-select>
</el-form-item>
<el-form-item label="波段：">
	<el-select v-model="select_bd_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
		<el-option v-for="item in bd_list" :key="item" :label="item" :value="item">
		</el-option>
	</el-select>
</el-form-item>
<el-form-item label="是否可退：">
	<el-select v-model="sfkt" :popper-append-to-body="false" clearable placeholder="全部">
		<el-option v-for="item in sfkt_list" :key="item.id" :label="item.name" :value="item.id">
		</el-option>
	</el-select>
</el-form-item>
<el-form-item label="是否内供：">
	<el-select v-model="sfng" :popper-append-to-body="false" clearable placeholder="全部">
		<el-option key="1" label="是" value="1">
		</el-option>
		<el-option key="0" label="否" value="0">
		</el-option>
	</el-select>
</el-form-item>
<el-form-item label="是否自主款：">
	<el-select v-model="sfzzk" clearable :popper-append-to-body="false" placeholder="全部">
		<el-option key="1" label="是" value="1">
		</el-option>
		<el-option key="0" label="否" value="0">
		</el-option>
	</el-select>
</el-form-item>
<el-form-item label="负数库存：">
	<el-input style="width:100px" clearable type="number" v-model="operator1" clearable placeholder="大于等于"></el-input>
	--
	<el-input style="width:100px" clearable type="number" v-model="operator2" clearable placeholder="小于"></el-input>
</el-form-item>
<el-form-item label="上架日期:" style="margin-right: 20px">
	<el-date-picker
	v-model="date"
	type="daterange"
	unlink-panels
	value-format="yyyy-MM-dd"
	range-separator="至"
	start-placeholder="开始日期"
	end-placeholder="结束日期"
	:append-to-body="false"
	:picker-options="pickerOptions">
</el-date-picker>
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
		<el-button type="danger" size="small" plain @click="setKs('4','清')">清</el-button>
	</div>
	<el-button type="primary" size="small" slot="reference">批量设置</el-button>
</el-popover>
<div class="buts">
	<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
	<el-button type="primary" plain size="small" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
</div>
</div>
<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%":header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
	<el-table-column :prop="item.row_field_name" :label="item.row_name" :width="item.row_field_name == 'bd' || item.row_field_name == 'sjxjrq'?260:120" :sortable="item.row_field_name == 'qtxl' || item.row_field_name == 'stxl' || item.row_field_name == 'replenish_num'?'custom':false" align="center" v-for="item in dataObj.title_list" show-overflow-tooltip :fixed="isFixed(item.row_field_name)">
		<template slot-scope="scope">
			<!-- 下钻 -->
			<el-tooltip placement="top-end" v-if="item.row_field_name == 'ksbm'">
				<div slot="content">
					<el-button type="text" size="small" @click="getDetail(scope.row.ksbm,scope.row.sjxrrq)">下钻</el-button>
				</div>
				<div style="color: #1890FF">{{scope.row[item.row_field_name]}}</div>
			</el-tooltip>
			<!--  实际下架日期 -->
			<el-date-picker
			@change="changeTime($event,scope.row.ksbm)"
			v-else-if="item.row_field_name == 'sjxjrq'"
			v-model="scope.row.sjxjrq"
			type="date"
			clearable
			value-format="yyyy-MM-dd"
			placeholder="选择日期"
			size="small"
			></el-date-picker>
			<div v-else>{{scope.row[item.row_field_name]}}</div>
		</template>
	</el-table-column>
	<el-table-column label="操作" align="center" width="180" fixed="right">
		<template slot-scope="scope">
			<el-button type="text" size="small" @click="setKs('1','试',scope.row.ksbm)">试</el-button>
			<el-button type="text" size="small" @click="setKs('2','补',scope.row.ksbm)">补</el-button>
			<el-button type="text" size="small" @click="setKs('4','清',scope.row.ksbm)">清</el-button>
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
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import {exportUp} from '../../api/export.js'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				dept_list: [],						//部门列表	
				select_department_ids:[],			//选中的部门id列表
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
				jyhpxz_list:['试','补','停','清'],					//建议货品性质列表
				xsxz_list:[{
					id:'5',
					name:"爆"
				},{
					id:'4',
					name:"畅"
				},{
					id:'3',
					name:"平"
				},{
					id:'2',
					name:"滞"
				}],											//销售性质列表
				xsxz:"",
				xsxz_gs:"",
				jyhpxz:"",
				bd_list:[],									//波段列表
				select_bd_list:[],							//选中的波段列表
				sfkt_list:[{
					id:'0',
					name:"不可退"
				},{
					id:'1',
					name:"可退"
				}],											//是否可退列表
				sfkt:"",
				sfng:"",
				sfzzk:"",
				operator1:"",
				operator2:"",
				date:[],
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
				start_time:"",				//开始时间
				end_time:"",					//结束时间
				xr_start_time:"",							//写入日期
				dataObj:{},									//列表数据
				show_custom:false,							//自定义列表是否显示
				row_ids:[],									//选择的自定义列表id
				detailData:[],								//下钻信息
				sjxrrq:"",
				ksbm:"",
				detailDialog:false,			
				detail_page:1,
				detail_page_size:10,
				sort:"",
				sort_type:""
			}
		},
		created(){
			//部门列表
			this.AjaxViewDept();
			//店铺列表
			this.GetStoreList();
			//产品分类
			this.ajaxPl();
			//波段
			this.ajaxBd();
			//获取列表
			this.getList('1');
		},
		watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				this.getList();
			},
			//修改实际下架日期
			changeTime(e,ksbm){
				let req = {
					ks:ksbm,
					xjrq:!e?'':e
				}
				resource.stopSetXjrq(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			exportFile(){
				var arr = [];
				let req = {
					pagesize:this.pagesize,
					page:this.page,
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_shop_list.join(','),
					gys:this.select_gys.join(','),
					gyshh:this.select_gyshh_list.join(','),
					pl:this.select_pl_list.join(','),
					ks:this.select_ks_list.join(','),
					jyhpxz:this.jyhpxz,
					xsxz:this.xsxz,
					xsxz_gs:this.xsxz_gs,
					bd:this.select_bd_list.join(','),
					sfkt:this.sfkt,
					xr_start_time:this.xr_start_time?this.xr_start_time:'',
					sfng:this.sfng,
					sfzzk:this.sfzzk,
					operator_value1:this.operator1,
					operator_value2:this.operator2,
					sj_start_time:this.start_time,
					sj_end_time:this.end_time,
					sort:this.sort,
					sort_type:this.sort_type
				}
				for(var item in req){
					let str = item + '=' + req[item];
					arr.push(str);
				};
				exportUp(`stop/stopexport?${arr.join('&')}`)
			},
			//获取列表
			getList(type){		//type:1(搜索);2:设置字段
				this.page = type == '1'?1:this.page;
				let req = {
					pagesize:this.pagesize,
					page:type == '1'?1:this.page,
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_shop_list.join(','),
					gys:this.select_gys.join(','),
					gyshh:this.select_gyshh_list.join(','),
					pl:this.select_pl_list.join(','),
					ks:this.select_ks_list.join(','),
					jyhpxz:this.jyhpxz,
					xsxz:this.xsxz,
					xsxz_gs:this.xsxz_gs,
					bd:this.select_bd_list.join(','),
					sfkt:this.sfkt,
					xr_start_time:this.xr_start_time?this.xr_start_time:'',
					sfng:this.sfng,
					sfzzk:this.sfzzk,
					operator_value1:this.operator1,
					operator_value2:this.operator2,
					sj_start_time:this.start_time,
					sj_end_time:this.end_time,
					sort:this.sort,
					sort_type:this.sort_type
				}
				if(type == '2'){
					req.row_ids = this.row_ids.join(',');
				}
				resource.stopList(req).then(res => {
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
			//部门列表
			AjaxViewDept(){
				resource.ajaxViewDept({from:1}).then(res => {
					if(res.data.code == 1){
						this.dept_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},	
			// 获取所有店铺
			GetStoreList(){
				let dept_id = this.select_department_ids.join(',');
				this.select_store_ids = [];
				resource.ajaxViewStore({dept_id:dept_id,from:1}).then(res => {
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
			//设置
			setKs(type,title,ksbm){
				var req = {};
				if(!ksbm){
					let ee = {
						dept_id:this.select_department_ids.join(','),
						shop_id:this.select_shop_list.join(','),
						gys:this.select_gys.join(','),
						gyshh:this.select_gyshh_list.join(','),
						pl:this.select_pl_list.join(','),
						ks:this.select_ks_list.join(','),
						jyhpxz:this.jyhpxz,
						xsxz:this.xsxz,
						bd:this.select_bd_list.join(','),
						sfkt:this.sfkt,
						xr_start_time:this.xr_start_time?this.xr_start_time:'',
						flag:'1',
						from:'3'
					}
					req = ee;
				}else{
					req.ks = ksbm;
					req.flag = '2';
				}
				//1:试；2:补；4:清
				this.$prompt('请输入原因', `货品性质确定转为${title}么？想好哦！`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					if(!value){
						this.$message.warning('请输入原因');
						return;
					}
					req.remark = value;
					if(type == '1'){
						resource.stopTry(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList('1');
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '2'){
						resource.stopReplenish(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList('1');
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '4'){
						resource.stopClear(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList('1');
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
			//自定义列表
			customFun(){
				this.show_custom = true;
				this.row_ids = this.dataObj.selected_ids;
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
					pagesize:this.detail_page_size
				}
				resource.stopDetail(req).then(res => {
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
			isFixed(row_field_name){
				if(row_field_name == 'ksbm' || row_field_name == 'gyshh' || row_field_name == 'xb'){
					return true;
				}
			}
		}
	}
</script>