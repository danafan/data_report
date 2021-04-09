<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺：">
				<el-select v-model="shop_id" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="gys" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入供应商"
				:remote-method="ajaxGys"
				 collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="gyshh" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入供应商货号"
				:remote-method="ajaxGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="pl" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="ks" clearable :popper-append-to-body="false" multiple filterable
				remote
				reserve-keyword
				placeholder="请输入款式"
				:remote-method="ajaxKsbm"
				collapse-tags>
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
		<el-form-item label="建议：">
			<el-select v-model="yyjc" :popper-append-to-body="false" clearable placeholder="全部">
				<el-option v-for="item in yyjc_list" :key="item" :label="item" :value="item">
				</el-option>
			</el-select>
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
		clearable
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
		<el-button type="success" size="small" plain @click="setKs('2','补')">补</el-button>
	</div>
	<div class="setStyle">
		<el-button type="warning" size="small" plain @click="setKs('3','停')">停</el-button>
		<el-button type="danger" size="small" plain @click="setKs('4','清')">清</el-button>
	</div>
	<el-button type="primary" size="small" slot="reference">批量设置</el-button>
</el-popover>
<div class="buts">
	<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
	<el-button type="primary" plain size="small" @click="exportFile">导出<i class="el-icon-download el-icon--right"></i></el-button>
</div>
</div>
<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :header-cell-style="{'background':'#f4f4f4'}">
	<el-table-column type="selection" width="55" fixed></el-table-column>
	<el-table-column :prop="item.row_field_name" :label="item.row_name" width="120" align="center" v-for="item in dataObj.title_list"></el-table-column>
	<el-table-column label="操作" align="center" width="180" fixed="right">
		<template slot-scope="scope">
			<el-button type="text" size="small" @click="setKs('1','试',scope.row.ksbm)">试</el-button>
			<el-button type="text" size="small" @click="setKs('2','补',scope.row.ksbm)">补</el-button>
			<el-button type="text" size="small" @click="setKs('3','停',scope.row.ksbm)">停</el-button>
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
	import exportFile from '../../api/export.js'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				shop_list:[],								//店铺列表
				pl_list:[],									//产品分类
				gys_list:[],								//供应商列表
				gyshh_list:[],								//供应商货号列表
				ks_list:[],									//产品编码
				jyhpxz_list:['试','补','停','清'],			//建议货品性质
				yyjc_list:['转正','下架'],					//建议
				shop_id:[],									//店铺id列表
				gys:[],										//供应商id列表
				gyshh:[],									//供应商货号id列表
				pl:[],										//品类id列表
				ks:[],										//款式id列表
				jyhpxz:"",									//建议货品性质
				yyjc:"",									//建议
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
				date:[],//发货时间
				start_time:"",				//开始时间
				end_time:"",					//结束时间
				xr_start_time:"",							//数据写入日期
				dataObj:{},									//列表数据
				select_ids:[],								//批量操作选中的id列表
				show_custom:false,							//自定义列表是否显示
				row_ids:[],									//选择的自定义列表id
			}
		},
		created(){
			let query = this.$route.query;
			if(JSON.stringify(query) != "{}"){
				for(var item in query){
					this.[item] = query[item];
				}
			}
			//店铺列表
			this.ajaxViewStore();
			//产品分类
			this.ajaxPl();
			//获取列表
			this.getList('1');
		},
		watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
		},
		methods:{
			//导出
			exportFile(){
				var arr = [];
				let req = {
					shop_id:this.shop_id.join(','),
					gys:this.gys.join(','),
					gyshh:this.gyshh.join(','),
					pl:this.pl.join(','),
					ks:this.ks.join(','),
					jyhpxz:this.jyhpxz,
					yyjc:this.yyjc,
					sj_start_time:this.start_time,
					sj_end_time:this.end_time,
					xr_start_time:!this.xr_start_time?'':this.xr_start_time,
					pagesize:this.pagesize,
					page:this.page
				}
				for(var item in req){
					let str = item + '=' + req[item];
					arr.push(str);
				};
				exportFile.exportUp(`trial/trialexport?${arr.join('&')}`)
			},
			//获取列表
			getList(type){		//type:1(搜索);2:设置字段
				let req = {
					shop_id:this.shop_id.join(','),
					gys:this.gys.join(','),
					gyshh:this.gyshh.join(','),
					pl:this.pl.join(','),
					ks:this.ks.join(','),
					jyhpxz:this.jyhpxz,
					yyjc:this.yyjc,
					sj_start_time:this.start_time,
					sj_end_time:this.end_time,
					xr_start_time:!this.xr_start_time?'':this.xr_start_time,
					pagesize:this.pagesize,
					page:type == '1'?1:this.page
				}
				if(type == '2'){
					req.row_ids = this.row_ids.join(',');
				}
				resource.trialList(req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						this.show_custom = false;
						if(type == '2'){
							this.$message.success(res.data.msg);
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
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
			//批量设置
			setAll(){
				if(this.select_ids.length == 0){
					this.$message.warning('至少选择一个款式');
				}else{
					console.log(this.select_ids.join(','))
				}
			},
			//设置
			setKs(type,title,ksbm){
				if(!ksbm && this.select_ids.length == 0){
					this.$message.warning('至少选择一个款式');
					return;
				}
				//1:试；2:补；3:停；4:清
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
						resource.trialTry({ks:ks}).then(res => {
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
						resource.trialReplenish({ks:ks}).then(res => {
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
						resource.trialStop({ks:ks}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '4'){
						resource.trialClear({ks:ks}).then(res => {
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
			}
		}
	}
</script>