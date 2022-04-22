<template>
	<div>
		<condition page_type="7" @callBack="searchFun"/>
		<div class="buts">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="exportFile" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table ref="multipleTable" max-height="800" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange" :row-class-name="tableRowClassName">
			<el-table-column :label="item.row_name" :prop="item.row_field_name" :sortable="item.is_sort == 1" :width="maxWidth(item.row_field_name,item.is_edit)" align="center" v-for="item in dataObj.title_list" show-overflow-tooltip :fixed="isFixed(item.row_field_name)">
				<template slot-scope="scope">
					<el-input v-model="scope.row[item.row_field_name]" size="small" type="text" style='width: 100px' :placeholder="item.row_name" :disabled="button_list.edit_decision != 1 || scope.row.is_self == 0 || scope.row.edit_status == 0" v-if="item.is_edit == 1 && item.row_field_name != 'sjxjrq' && item.row_field_name != 'tp' && item.row_field_name != 'sjhpxz' && item.row_field_name != 'jrsx' && item.row_field_name != 's2b' && item.row_field_name != 'b2t' && item.row_field_name != 't2q'" @change="editFun($event,item.row_field_name,scope.row.decision_rq,scope.row.ksbm)"></el-input>
					<!--  实际下架日期 -->
					<el-date-picker
					@change="editFun($event,item.row_field_name,scope.row.decision_rq,scope.row.ksbm)"
					v-else-if="item.row_field_name == 'sjxjrq'"
					v-model="scope.row.sjxjrq"
					:disabled="button_list.edit_decision != 1 || scope.row.is_self == 0 || scope.row.edit_status == 0"
					type="date"
					clearable
					value-format="yyyy-MM-dd"
					placeholder="选择日期"
					size="small"
					></el-date-picker>
					<!-- 实际货品性质 -->
					<el-select 
					v-model="scope.row.sjhpxz" 
					@change="editFun($event,item.row_field_name,scope.row.decision_rq,scope.row.ksbm)" 
					v-else-if="item.row_field_name == 'sjhpxz'" 
					:disabled="button_list.edit_decision != 1 || scope.row.is_self == 0 || scope.row.edit_status == 0"
					clearable 
					size="small"
					placeholder="全部">
					<el-option label="试" value="1"></el-option>
					<el-option label="补" value="2"></el-option>
					<el-option label="停" value="3"></el-option>
					<el-option label="清" value="4"></el-option>
				</el-select>
				<!-- 最后四个 -->
				<el-select 
				v-model="scope.row[item.row_field_name]" 
				@change="editFun($event,item.row_field_name,scope.row.decision_rq,scope.row.ksbm)" 
				v-else-if="item.row_field_name == 'jrsx' || item.row_field_name == 's2b' || item.row_field_name == 'b2t' || item.row_field_name == 't2q'" 
				clearable 
				:disabled="button_list.edit_decision != 1 || scope.row.is_self == 0 || scope.row.edit_status == 0"
				size="small"
				placeholder="全部">
				<el-option label="是" :value="1"></el-option>
				<el-option label="否" :value="0"></el-option>
			</el-select>
			<!-- 图片 -->
			<img class="table_img" :src="scope.row[item.row_field_name]" v-else-if="item.row_field_name == 'tp'" @click="bigImg(scope.row[item.row_field_name])">
			<div v-else>{{scope.row[item.row_field_name]}}</div>
		</template>
	</el-table-column>
	<el-table-column label="操作" align="center" width="120" fixed="right">
		<template slot-scope="scope">
			<el-button type="text" size="small" @click="confirmFun(scope.row.decision_rq,scope.row.ksbm,'1')" v-if="button_list.confirm == 1 && scope.row.is_self == 1 && (scope.row.is_done == 0 || scope.row.is_done == 2)">确认</el-button>
			<el-button type="text" size="small" @click="confirmFun(scope.row.decision_rq,scope.row.ksbm,'2')" v-if="button_list.cancel_confirm == 1 && scope.row.is_self == 1 && scope.row.is_done == 1">取消</el-button>
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
		<el-button size="small" type="primary" @click="setColumns">保存</el-button>
	</div>
</el-dialog>
<!-- 图片放大 -->
<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
	<img class="big_img" :src="big_img_url">
	<span slot="footer" class="dialog-footer">
		<el-button type="primary" @click="imageDialog = false">关闭</el-button>
	</span>
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
.big_img{
	width: 100%;
}
</style>
<style lang="less">
.el-table .red_color {
	background: #FFBABA;
}
.el-table .yellow_color {
	background: #FFE8AB;
}
.el-table .green_color {
	background: #B0FFDF;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {exportUp} from '../../../api/export.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import condition from '../../../components/condition.vue'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				req:{},										//请求参数
				sort:"",
				sort_type:"",
				show_custom:false,							//自定义列表
				dataObj:{},
				row_ids:[],
				imageDialog:false,							//是否显示放大图片弹框
				big_img_url:"",								//放大的图片地址
				button_list:{}
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//某一行添加颜色
			tableRowClassName({row, rowIndex}) {
				if (row.color == 1) {
					return 'red_color';
				} else if (row.color == 2) {
					return 'yellow_color';
				}else if (row.color == 3) {
					return 'green_color';
				}
				return '';
			},
			//排序
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				this.getList();
			},
			//导出
			exportFile(){
				var arr = [];
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				for(var item in this.req){
					let str = item + '=' + this.req[item];
					arr.push(str);
				};
				exportUp(`decision/goodsExport?${arr.join('&')}`)
			},
			//按条件查询
			searchFun(req){
				this.page = 1;
				this.req = req;
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){		
				this.req.pagesize = this.pagesize;
				this.req.page = this.page;
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				resource.decisionList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						this.button_list = this.dataObj.button_list;
						this.show_custom = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				});

			},
			//设置自定义列
			setColumns(){
				resource.setColumns({menu_id:'31',row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//放大图片
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
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
			editFun(e,name,decision_rq,ksbm){
				let req = {
					name:name,
					content:e,
					decision_rq:decision_rq,
					ks:ksbm
				}
				resource.editDecision(req).then(res => {
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
			//确认
			confirmFun(decision_rq,ksbm,type){	//1:确认；2:取消
				this.$confirm(`${type == '1'?'确认':'取消'}?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(type == '1'){	//确认
						resource.decisionConfirm({decision_rq:decision_rq,ks:ksbm}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{
						resource.decisionCancel({decision_rq:decision_rq,ks:ksbm}).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.getList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			isFixed(row_field_name){
				if(row_field_name == 'ksbm' || row_field_name == 'gyshh' || row_field_name == 'xb'){
					return true;
				}
			}
		},
		components:{
			condition
		}
	}
</script>