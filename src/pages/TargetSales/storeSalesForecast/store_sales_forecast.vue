<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="年/月：">
				<el-date-picker v-model="date" :clearable="false" clearable value-format="yyyy-MM" type="month" placeholder="选择年月">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="shop_id" :popper-append-to-body="false" clearable filterable placeholder="请选择店铺">
					<el-option v-for="item in store_list" :key="item.shop_code" :label="item.shop_name" :value="item.shop_code">
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
		<div style="display:flex;justify-content: end;margin-bottom: 15px">
			<el-button type="primary" size="small" @click="$router.push('/create_target')">店铺填报</el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="dept_1_name" show-overflow-tooltip label="一级部门" align="center"></el-table-column>
			<el-table-column prop="dept_2_name" show-overflow-tooltip label="二级部门" align="center"></el-table-column>
			<el-table-column prop="shop_name" show-overflow-tooltip label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="shop_id" label="主账号ID" align="center"></el-table-column>
			<el-table-column prop="platform" label="平台" align="center"></el-table-column>
			<el-table-column prop="shop_type" label="店铺类别" align="center"></el-table-column>
			<el-table-column prop="shopowner_name" label="店长" align="center"></el-table-column>
			<el-table-column prop="reference_shop" show-overflow-tooltip label="参考店铺" align="center"></el-table-column>
			<el-table-column prop="year" label="年份" align="center"></el-table-column>
			<el-table-column prop="month" label="月份" align="center"></el-table-column>
			<el-table-column prop="cb_price" label="审核状态" align="center">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getStep(scope.row.id)" v-if="scope.row.status == '0'">待审核</el-button>
					<el-button type="text" size="small" @click="getStep(scope.row.id)" v-if="scope.row.status == '1'">审核通过</el-button>
					<el-button type="text" size="small" @click="getStep(scope.row.id)" v-if="scope.row.status == '2'">审核拒绝</el-button>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="300">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id,scope.row.shop_name)">查看详情</el-button>
					<el-button type="text" size="small" @click="cancelItem(scope.row.id)" v-if="scope.row.status == '2'">作废</el-button>
					<el-button type="text" size="small" @click="editFun(scope.row.id)" v-if="scope.row.status == '2'">修改</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<el-dialog title="编辑" :visible.sync="showEdit" width="80%" :close-on-click-modal="false">
			<div class="editBox">
				<EditTarget :day="day" :month="month" @callback="getData" :shop_target_id="shop_target_id"/>
			</div>
		</el-dialog>
		<el-dialog center :title="dialog_title + ' 销售额预估'" :visible.sync="showDetail" width="80%" :close-on-click-modal="false">
			<div class="editBox">
				<TargetDetail type="1" :id="id" @callback="editFun" v-if="showDetail"/>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click="showDetail = false">关闭</el-button>
			</div>
		</el-dialog>
		<el-dialog title="审批流程" :visible.sync="showStep">
			<el-timeline>
				<el-timeline-item
				v-for="(activity, index) in step_list"
				:key="index"
				:timestamp="activity.user_name">
				<div class="step_row">
					<div class="flex_style">{{activity.title}} </div>
					<div class="gu">{{activity.status}} </div>
					<div class="gu">{{activity.time}} </div>
				</div>
			</el-timeline-item>
		</el-timeline>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" type="primary" @click="showStep = false">关闭</el-button>
		</div>
	</el-dialog>
</div>
</template>
<style lang="less" scoped>
.editBox{
	height: 700px;
	overflow-y: scroll;
}
.step_row{
	display: flex;
	align-items: center;
	justify-content: space-between;
	.flex_style{
		flex: 1;
	}
	.gu{
		width: 200px;
		text-align: end;
	}
}
</style>
<script>
	import resource from '../../../api/targetSales.js'
	import EditTarget from './components/edit_target.vue'
	import TargetDetail from './components/target_detail.vue'
	export default{
		data(){
			return{
				date:"",		//选择的年月
				shop_id:"",		//选中的店铺ID
				store_list:[],	//店铺列表
				status:-1,		//默认全部
				status_list:[{
					name:'全部',
					id:-1
				},
				{
					name:'待审核',
					id:0
				},
				{
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
				showEdit:false,
				month:"",
				day:"",
				shop_target_id:"",
				showDetail:false,			//详情弹窗
				dialog_title:"",			//详情标题
				showStep:false,				//审批流程弹窗
				step_list:[],				//审批流程列表
			}
		},
		created(){
			//获取店铺列表
			this.getShops();
			//获取列表
			this.getData();
		},
		methods:{
			//获取店铺列表
			getShops(){
				resource.getShops().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
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
				this.showEdit = false;
				this.page = type?1:this.page;
				let arg = {
					from_type:'shop',
					date:this.date?this.date:'',
					shop_id:this.shop_id,
					status:this.status,
					page:this.page,
					limit:this.pagesize
				}
				resource.shopTargetList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击状态查看进度
			getStep(id){
				resource.auditLog({shop_target_id:id}).then(res => {
					if(res.data.code == 1){
						this.step_list = res.data.data;
						this.showStep = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击修改
			editFun(id){
				this.showDetail = false;
				resource.editShopTargetGet({shop_target_id:id}).then(res => {
					if(res.data.code == 1){
						this.showEdit = true;
						this.shop_target_id = JSON.stringify(id);
						this.month = JSON.stringify(res.data.data.month);
						this.day = JSON.stringify(res.data.data.day);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//作废
			cancelItem(id){
				this.$confirm('确认作废', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.cancelShopLog({shop_target_id:id}).then(res => {
						if (res.data.code == 1) {
							this.$message.success(res.data.msg);
      						//获取列表
      						this.getData('1');
      					}else{
      						this.$message.warning(res.data.msg)
      					}
      				})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			//查看详情
			getDetail(id,store_name){
				this.dialog_title = store_name;
				this.id = JSON.stringify(id);
				this.showDetail = true;
			}
		},
		components:{
			EditTarget,
			TargetDetail
		}
	}
</script>















