<template>
	<!-- 审核表（项目部审核店铺） -->
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="年/月：">
				<el-date-picker v-model="date" :clearable="false" value-format="yyyy-MM" type="month" placeholder="选择年月">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="一级部门：">
				<el-select v-model="dept_1_id" :popper-append-to-body="false" clearable filterable placeholder="请选择一级部门" @change="getDepts">
					<el-option v-for="item in level1_dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="二级部门：">
				<el-select v-model="dept_2_id" :popper-append-to-body="false" clearable filterable placeholder="请选择二级部门">
					<el-option v-for="item in level2_dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="审核状态：">
				<el-select v-model="status" :popper-append-to-body="false" filterable placeholder="请选择店铺">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getData('1')">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="set_button">
			<el-button size="mini" type="plain" @click="$router.push('/sales_forecast_division')">月目标预估表</el-button>
			<el-button size="mini" type="primary" @click="mergeSubmit">合并提交</el-button>
		</div>
		<div class="total_data">
			销售收入：{{total.xssr}}万，毛利率：{{total.mll}}%，营销费用率：{{total.yxfy}}%，净利润：{{total.jlr}}万，净利润率：{{total.jlrl}}%
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="dept_1_name" show-overflow-tooltip label="一级部门" align="center"></el-table-column>
			<el-table-column prop="dept_2_name" show-overflow-tooltip label="二级部门" align="center"></el-table-column>
			<el-table-column prop="year" label="年份" align="center"></el-table-column>
			<el-table-column prop="month" label="月份" align="center"></el-table-column>
			<el-table-column prop="add_time" label="提交时间" align="center"></el-table-column>
			<el-table-column prop="cb_price" label="审核状态" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.status == '0'">待审核</div>
					<div v-if="scope.row.status == '1'">审核通过</div>
					<div v-if="scope.row.status == '2'">审核拒绝</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="300">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id,scope.row.dept_2_name)">查看详情</el-button>
					<el-button type="text" size="small" @click="$router.push('/store_target?id=' + scope.row.id)">拆分店目标</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 详情 -->
		<el-dialog center :title="dialog_title + ' 销售额预估'" :visible.sync="showDetail" width="80%" :close-on-click-modal="false">
			<div class="editBox">
				<DeptDetail :id="id" @callback="callBack" v-if="showDetail"/>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click="showDetail = false">关闭</el-button>
			</div>
		</el-dialog>
		<!-- 合并提交 -->
		<el-dialog title="合并提交" :visible.sync="showMerge" append-to-body>
			<el-input
			type="textarea"
			:rows="3"
			placeholder="请输入备注"
			v-model="remark">
		</el-input>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="showMerge = false">取 消</el-button>
			<el-button size="small" type="primary" @click="mergeTarget">确 定</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.set_button{
	margin-bottom: 15px;
	display: flex;
	justify-content: space-between;
}
.total_data{
	font-size: 12px;
	color: red;
}
</style>
<script>
	import resource from '../../../api/targetSales.js'
	import DeptDetail from './components/dept_detail.vue'
	import {getCurrentMonth} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				date:getCurrentMonth(),		//选择的年月
				dept_1_id:"",			//选中的一级部门id
				level1_dept_list:[],	//一级部门列表
				dept_2_id:"",			//选中的二级部门ID
				level2_dept_list:[],	//二级部门列表
				status:-1,		//默认全部
				status_list:[{
					name:'全部',
					id:-1
				},{
					name:'待审核',
					id:0
				},{
					name:'审核通过',
					id:1
				},
				{
					name:'审核拒绝',
					id:2
				}],							//状态列表
				pagesize:10,
				page:1,
				dataObj:{},					//返回数据
				total:{},
				showDetail:false,			//详情弹窗
				showMerge:false,			//合并提交弹窗
				dialog_title:"",
				id:"",						//查看详情的ID
				remark:"",					//合并备注
			}
		},
		beforeRouteLeave(to,from,next){
			if(to.path == '/store_target' || to.path == '/sales_forecast_division'){	//拆分店铺
				from.meta.isUseCache = true;
			}else{
				from.meta.isUseCache = false;
			}
			next();
		},
		activated(){
			if(!this.$route.meta.isUseCache){
				this.date = getCurrentMonth();
				this.dept_1_id = "";
				this.dept_2_id = "";
				this.status = -1;
				this.page = 1;
				this.pagesize = 10;
				//获取部门列表
				this.getDepts();
			}
			//获取列表
			this.getData();
			this.$route.meta.isUseCache = false;
		},
		methods:{
			//获取部门列表
			getDepts(dept_id){
				let arg = {};
				if(dept_id){
					arg.dept_id = dept_id;
					this.dept_2_id = '';
				}else{
					arg.type = '1';
				}
				resource.getDepts(arg).then(res => {
					if(res.data.code == 1){
						if(dept_id){
							this.level2_dept_list = res.data.data;
						}else{
							this.level1_dept_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			//获取列表
			getData(type){
				this.page = type?1:this.page;
				let arg = {
					from_type:'business',
					date:this.date,
					dept_1_id:this.dept_1_id,
					dept_2_id:this.dept_2_id,
					status:this.status,
					page:this.page,
					limit:this.pagesize
				}
				resource.projectTargetList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data.list;
						this.total = res.data.data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//合并提交
			mergeSubmit(){
				if(this.dept_1_id == ''){
					this.$message.warning('请选择一级部门');
					return;
				}
				this.showMerge = true;
			},
			//查看详情
			getDetail(id,name){
				this.dialog_title = name;
				this.id = JSON.stringify(id);
				this.showDetail = true;
			},
			//审核结束
			callBack(){
				this.showDetail = false;
				//获取列表
				this.getData();
			},
			//合并提交
			mergeTarget(){
				let arg = {
					type:'2',
					date:this.date,
					remark:this.remark,
					dept_1_id:this.dept_1_id,
					dept_2_id:this.dept_2_id
				}
				//提交审核
				resource.mergeTarget(arg).then(res => {
					if (res.data.code == 1) {
						this.$message.success(res.data.msg);
						this.showMerge = false;
						//获取列表
						this.getData('1');
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
		},
		components:{
			DeptDetail
		}
	}
</script>

















