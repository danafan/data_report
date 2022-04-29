<template>
	<div>
		<div style="display:flex;align-items: center;margin-bottom: 20px">
			<el-button type="primary" plain size='mini' icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
			<div style="margin-left: 15px">拆分店目标</div>
		</div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺名称：">
				<el-select v-model="shop_id" :popper-append-to-body="false" clearable filterable placeholder="请选择店铺">
					<el-option v-for="item in store_list" :key="item.shop_code" :label="item.shop_name" :value="item.shop_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getData('1')">搜索</el-button>
			</el-form-item>
		</el-form>
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
			<el-table-column label="操作" align="center" fixed="right" width="120">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id,scope.row.shop_name)">查看详情</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<el-dialog center :title="dialog_title + ' 销售额预估'" :visible.sync="showDetail" width="80%" :close-on-click-modal="false">
			<div class="editBox">
				<TargetDetail type="1" :id="id" @callback="showDetail = false" v-if="showDetail"/>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" type="primary" @click="showDetail = false">关闭</el-button>
			</div>
		</el-dialog>
</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../../api/targetSales.js'
	import TargetDetail from '../../storeSalesForecast/components/target_detail.vue'
	export default{
		data(){
			return{
				shop_id:"",		//选中的店铺ID
				log_id:"",
				store_list:[],	//店铺列表
				pagesize:10,
				page:1,
				dataObj:{},					//返回数据
				shop_target_id:"",
				showDetail:false,			//详情弹窗
				dialog_title:"",			//弹窗标题
			}
		},
		created(){
			this.log_id = this.$route.query.id;
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
				this.page = type?1:this.page;
				let arg = {
					from_type:'project',
					log_id:this.log_id,
					shop_id:this.shop_id,
					page:this.page,
					limit:this.pagesize
				}
				resource.shopTargetList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查看详情
			getDetail(id,shop_name){
				this.dialog_title = shop_name;
				this.id = JSON.stringify(id);
				this.showDetail = true;
			}
		},
		components:{
			TargetDetail
		}
	}
</script>















