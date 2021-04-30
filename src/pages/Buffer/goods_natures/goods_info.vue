<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="全部" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品编码：">
				<el-select v-model="select_spbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="全部" :remote-method="ajaxSpbm" collapse-tags>
					<el-option v-for="item in spbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_gyshh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="供应商货号" :remote-method="ajaxGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="季节：">
				<el-select v-model="select_jj_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in jj_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="波段：">
				<el-select v-model="select_bd_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in bd_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="买手：">
				<el-select v-model="select_ms_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in ms_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购员：">
				<el-select v-model="select_cgy_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cgy_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购性质：">
				<el-select v-model="select_cgxz_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cgxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否可退：">
				<el-select v-model="sfkt" :popper-append-to-body="false" clearable placeholder="全部">
					<el-option v-for="item in sfkt_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="首卖日期:">
				<el-date-picker v-model="sm_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="建档日期:">
				<el-date-picker v-model="jd_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="全部" :remote-method="ajaxGys" collapse-tags>
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="性别：">
				<el-select v-model="xb" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
					<el-option label="通用" value="通用"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="选款方式：">
				<el-select v-model="select_xkfs_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in xkfs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="设计师：">
				<el-select v-model="select_sjs_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in sjs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="跟单员：">
				<el-select v-model="select_gdy_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in gdy_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="价格带：">
				<el-select v-model="select_jgd_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in jgd_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否内供：">
				<el-select v-model="sfng" :popper-append-to-body="false" clearable placeholder="全部">
					<el-option v-for="item in sfng_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="实际货品性质：">
				<el-select v-model="sjhpxz" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in sjhpxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList('1')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="decisionAdd">导入决策管理<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
			<el-table-column :label="item.row_name" :prop="item.row_field_name" :sortable="item.is_sort == 1" :width="maxWidth(item.row_field_name,item.is_edit)" align="center" v-for="item in dataObj.title_list" show-overflow-tooltip :fixed="isFixed(item.row_field_name)">
				<template slot-scope="scope">
					<!-- 编辑框 -->
					<el-input v-model="scope.row[item.row_field_name]" size="small" type="text" style='width: 100px' :placeholder="item.row_name" :disabled="scope.row.edit_status == 0" v-if="item.is_edit == 1 && item.row_field_name != 'sjxjrq' && item.row_field_name != 'tp' && item.row_field_name != 'sjhpxz'" @change="editFun($event,item.row_field_name,scope.row.ksbm)"></el-input>
					<!--  实际下架日期 -->
					<el-date-picker
					@change="editFun($event,item.row_field_name,scope.row.ksbm)"
					v-else-if="item.row_field_name == 'sjxjrq'"
					v-model="scope.row.sjxjrq"
					 :disabled="scope.row.edit_status == 0"
					type="date"
					clearable
					value-format="yyyy-MM-dd"
					placeholder="选择日期"
					size="small"
					></el-date-picker>
					<!-- 实际货品性质 -->
					<el-select 
					v-model="scope.row.sjhpxz" 
					@change="editFun($event,item.row_field_name,scope.row.ksbm)" 
					v-else-if="item.row_field_name == 'sjhpxz'"
					 :disabled="scope.row.edit_status == 0" 
					clearable 
					size="small"
					placeholder="全部">
					<el-option v-for="item in sjhpxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
				<!-- 图片 -->
				<img class="table_img" :src="scope.row[item.row_field_name]" v-else-if="item.row_field_name == 'tp'">
				<div v-else>{{scope.row[item.row_field_name]}}</div>
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
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.table_img{
	width: 80px;
	height: 80px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				ks_list:[],									//款式列表
				select_ks_list:[],							//选中的款式列表	
				spbm_list:[],								//商品编码
				select_spbm_list:[],						//选中的商品编码
				gyshh_list:[],								//供应商货号列表
				select_gyshh_list:[],						//选中的供应商货号列表
				jj_list:['春','夏','秋','冬'],				//季节列表
				select_jj_list:[],							//选中的季节列表
				bd_list:[],									//波段列表
				select_bd_list:[],							//选中的波段列表	
				ms_list:[],									//买手列表
				select_ms_list:[],							//选中的买手列表
				cgy_list:[],								//采购员列表
				select_cgy_list:[],							//选中的采购员列表
				cgxz_list:[],								//采购性质列表
				select_cgxz_list:[],						//选中的采购性质列表
				sfkt_list:[{
					id:'0',
					name:"不可退"
				},{
					id:'1',
					name:"可退"
				}],											//是否可退列表
				sfkt:"",									//选中的可退id
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
				sm_date:[],									//首卖日期
				start_first_fkrq:"",						//首卖日期（开始时间）
				end_first_fkrq:"",							//首卖日期（结束时间）
				jd_date:[],									//建档日期
				start_cjrq:"",								//建档日期（开始时间）
				end_cjrq:"",								//建档日期（结束时间）
				gys_list:[],								//供应商列表
				select_gys:[],								//选中的供应商列表
				xb:"",										//性别
				pl_list:[],									//品类列表
				select_pl_list:[],							//选中的品类列表
				xkfs_list:[],								//选款方式列表
				select_xkfs_list:[],						//选中的选款方式列表
				sjs_list:[],								//设计师列表
				select_sjs_list:[],							//选中的设计师列表
				gdy_list:[],								//跟单员列表
				select_gdy_list:[],							//选中的跟单员列表
				jgd_list:[],								//价格带列表
				select_jgd_list:[],							//选中的价格带列表
				sfng_list:[{
					id:'0',
					name:"否"
				},{
					id:'1',
					name:"是"
				}],											//是否内供列表
				sfng:"",									//选中的是否内供
				sjhpxz_list:['试','补','停','清'],			//实际货品性质列表
				sjhpxz:"",									//选中的实际货品性质
				sort:"",
				sort_type:"",
				show_custom:false,							//自定义列表
				dataObj:{},
				row_ids:[]
			}
		},
		watch:{
			//首卖日期
			sm_date:function(n){
				this.start_first_fkrq = n && n.length> 0?n[0]:"";
				this.end_first_fkrq = n && n.length> 0?n[1]:"";
			},
			//建档日期
			jd_date:function(n){
				this.start_cjrq = n && n.length> 0?n[0]:"";
				this.end_cjrq = n && n.length> 0?n[1]:"";
			}
		},
		created(){
			//波段
			this.ajaxBd();
			//买手列表
			this.ajaxMs();
			//采购员列表
			this.ajaxCgy();
			//采购性质
			this.ajaxCgxz();
			//产品分类
			this.ajaxPl();
			// 选款方式
			this.ajaxXkfs();
			// 设计师
			this.ajaxSjs();
			// 跟单员
			this.ajaxGdy();
			// 价格带
			this.ajaxJgd();
			//获取列表
			this.getList('1');
		},
		methods:{
			//排序
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				this.getList();
			},
			//导入到决策管理
			decisionAdd(){
				this.$confirm('确认导入到决策管理?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let req = {
						ks:this.select_ks_list.join(','),
						spbm:this.select_spbm_list.join(','),
						gyshh:this.select_gyshh_list.join(','),
						jj:this.select_jj_list.join(','),
						bd:this.select_bd_list.join(','),
						ms:this.select_ms_list.join(','),
						cgy:this.select_cgy_list.join(','),
						cgxz:this.select_cgxz_list.join(','),
						sfkt:this.sfkt,
						start_first_fkrq:this.start_first_fkrq,
						end_first_fkrq:this.end_first_fkrq,
						start_cjrq:this.start_cjrq,
						end_cjrq:this.end_cjrq,
						gys:this.select_gys.join(','),
						xb:this.xb,
						pl:this.select_pl_list.join(','),
						xkfs:this.select_xkfs_list.join(','),
						sjs:this.select_sjs_list.join(','),
						gdy:this.select_gdy_list.join(','),
						jgd:this.select_jgd_list.join(','),
						sfng:this.sfng,
						sjhpxz:this.sjhpxz
					}
					resource.decisionAdd(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			//获取列表
			getList(type){		//type:1(搜索);2:设置字段
				this.page = type == '1'?1:this.page;
				let req = {
					pagesize:this.pagesize,
					page:type == '1'?1:this.page,
					ks:this.select_ks_list.join(','),
					spbm:this.select_spbm_list.join(','),
					gyshh:this.select_gyshh_list.join(','),
					jj:this.select_jj_list.join(','),
					bd:this.select_bd_list.join(','),
					ms:this.select_ms_list.join(','),
					cgy:this.select_cgy_list.join(','),
					cgxz:this.select_cgxz_list.join(','),
					sfkt:this.sfkt,
					start_first_fkrq:this.start_first_fkrq,
					end_first_fkrq:this.end_first_fkrq,
					start_cjrq:this.start_cjrq,
					end_cjrq:this.end_cjrq,
					gys:this.select_gys.join(','),
					xb:this.xb,
					pl:this.select_pl_list.join(','),
					xkfs:this.select_xkfs_list.join(','),
					sjs:this.select_sjs_list.join(','),
					gdy:this.select_gdy_list.join(','),
					jgd:this.select_jgd_list.join(','),
					sfng:this.sfng,
					sjhpxz:this.sjhpxz,
					sort:this.sort,
					sort_type:this.sort_type
				}
				if(type == '2'){
					req.row_ids = this.row_ids.join(',');
				}
				resource.decisionSku(req).then(res => {
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
			//款式列表
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxDecisionKs({name:e,from:2}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商货号
			ajaxGyshh(e){
				if(e != ''){
					resource.ajaxDecisionGyshh({name:e,from:2}).then(res => {
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
			//买手列表
			ajaxMs(){
				resource.ajaxMs({from:2}).then(res => {
					if(res.data.code == 1){
						this.ms_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//采购员列表
			ajaxCgy(){
				resource.ajaxCgy({from:2}).then(res => {
					if(res.data.code == 1){
						this.cgy_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//采购性质列表
			ajaxCgxz(){
				resource.ajaxCgxz({from:2}).then(res => {
					if(res.data.code == 1){
						this.cgxz_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商列表
			ajaxGys(e){
				if(e != ''){
					resource.ajaxDecisionGys({name:e,from:2}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//品类
			ajaxPl(){
				resource.ajaxDecisionPlList({from:2}).then(res => {
					if(res.data.code == 1){
						this.pl_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//选款方式
			ajaxXkfs(){
				resource.ajaxXkfs({from:2}).then(res => {
					if(res.data.code == 1){
						this.xkfs_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//设计师列表
			ajaxSjs(){
				resource.ajaxSjs({from:2}).then(res => {
					if(res.data.code == 1){
						this.sjs_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//跟单员列表
			ajaxGdy(){
				resource.ajaxGdy({from:2}).then(res => {
					if(res.data.code == 1){
						this.gdy_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//价格带列表
			ajaxJgd(){
				resource.ajaxJgd({from:2}).then(res => {
					if(res.data.code == 1){
						this.jgd_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//商品编码
			ajaxSpbm(e){
				if(e != ''){
					resource.ajaxSpbm({name:e,from:2}).then(res => {
						if(res.data.code == 1){
							this.spbm_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
			//编辑某一个input
			editFun(e,name,ksbm){
				let req = {
					name:name,
					content:e,
					ks:ksbm
				}
				resource.editSku(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//宽度
			maxWidth(row_field_name,is_edit){
				if(row_field_name == 'spbmgh' || row_field_name == 'cpjglx' || row_field_name == 'tlrjxl' || row_field_name == 'sjxjrq'){
					return 260;
				}else if(is_edit == 1){
					return 160;
				}else{
					return 120;
				}
			},
			isFixed(row_field_name){
				if(row_field_name == 'ksbm' || row_field_name == 'gyshh' || row_field_name == 'mc' || row_field_name == 'bd' || row_field_name == 'gys' || row_field_name == 'xb'){
					return true;
				}
			}
		}
	}
</script>