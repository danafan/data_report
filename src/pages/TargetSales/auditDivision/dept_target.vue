<template>
	<div>
		<div style="display:flex;align-items: center;margin-bottom: 20px">
			<el-button type="primary" plain size='mini' icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
			<div style="margin-left: 15px">拆分项目部(事业部)</div>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="二级部门：">
				<el-select v-model="dept_2_id" :popper-append-to-body="false" clearable filterable reserve-keyword placeholder="请选择二级部门">
					<el-option v-for="item in level2_dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getData('1')">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="dept_1_name" show-overflow-tooltip label="一级部门" align="center"></el-table-column>
			<el-table-column prop="dept_2_name" show-overflow-tooltip label="二级部门" align="center"></el-table-column>
			<el-table-column prop="year" label="年份" align="center"></el-table-column>
			<el-table-column prop="month" label="月份" align="center"></el-table-column>
			<el-table-column prop="add_time" label="提交时间" align="center"></el-table-column>
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
		<el-dialog center :title="dialog_title + ' 销售额预估'" :visible.sync="showDetail" width="80%" :close-on-click-modal="false">
			<div class="editBox">
				<DeptDetail :id="id" @callback="showDetail = false" v-if="showDetail"/>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click="showDetail = false">关闭</el-button>
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
	import DeptDetail from './components/dept_detail.vue'
	import {getCurrentMonth} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				dept_2_id:"",			//选中的二级部门ID
				level2_dept_list:[],	//二级部门列表
				pagesize:10,
				page:1,
				dataObj:{},					//返回数据
				showDetail:false,			//详情弹窗
				dialog_title:"",
				id:"",						//详情ID
				loading:false
			}
		},
		beforeRouteLeave(to,from,next){
			if(to.path == '/store_target'){	//拆分店铺
				from.meta.isUseCache = true;
			}else{
				from.meta.isUseCache = false;
			}
			next();
		},
		activated(){
			if(!this.$route.meta.isUseCache){
				this.log_id = this.$route.query.id;
				this.dept_2_id = "";
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
			getDepts(){
				resource.getDepts({type:2}).then(res => {
					if(res.data.code == 1){
						this.level2_dept_list = res.data.data;
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
					log_id:this.$route.query.id,
					dept_2_id:this.dept_2_id,
					page:this.page,
					limit:this.pagesize
				}
				this.loading = true;
				resource.projectTargetList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看详情
			getDetail(id,name){
				this.dialog_title = name;
				this.id = JSON.stringify(id);
				this.showDetail = true;
			}
		},
		components:{
			DeptDetail
		}
	}
</script>















