<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：" required>
				<el-input clearable v-model="ksbm" placeholder="款式编码（必填）"></el-input>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-input clearable v-model="dpmc" placeholder="店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="颜色规格：">
				<el-input clearable v-model="dpysgg" placeholder="颜色规格"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="settingFun">转为下架款</el-button>
		</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @selection-change="handleKsbm">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column prop="dpmc" label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="zdmc" label="站点名称" align="center"></el-table-column>
			<el-table-column prop="dpksbm" label="平台店铺款式编码" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="线上款式编码" align="center"></el-table-column>
			<el-table-column prop="ysspbm" label="原始商品编码" align="center"></el-table-column>
			<el-table-column prop="dpysgg" label="颜色规格" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<el-dialog title="转为下架款" :visible.sync="show_dialog">
			<el-form size="small">
				<el-form-item label="下架原因" required>
					<el-input type="textarea" :rows="2" placeholder="请输入下架原因" v-model="off_reason">
					</el-input>
				</el-form-item>
				<el-form-item label="颜色规格备注" required>
					<el-input type="textarea" :rows="2" placeholder="请输入颜色规格备注" v-model="dpysgg_remark">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="show_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="commitFun">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
}
</style>
<script>
	import resource from '../../api/shelvesResource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm:"",		//款式编码
				dpmc:"",		//店铺名称
				dpysgg:"",		//颜色规格
				dataObj:{},		//返回数据
				show_dialog:false,	//转为下架款弹窗
				dpksbm:[],		//选中的款式编码
				off_reason:"",	//下架原因
				dpysgg_remark:"",		//颜色规格备注
			}
		},
		methods:{
			//搜索
			searchFun(){
				if(this.ksbm == ''){
					this.$message.warning('请输入款式编码');
				}else{
					this.page = 1;
					//获取列表
					this.getList();
				}
			},
			//获取列表
			getList(){
				let arg = {
					dpmc:this.dpmc,
					ksbm:this.ksbm,
					dpysgg:this.dpysgg,
					page:this.page,
					pagesize:this.pagesize,
				}
				resource.offShelfList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换选中
			handleKsbm(val) {
				this.dpksbm = val;
			},
			//转为下架款
			settingFun(){
				if(this.dpksbm.length == 0){
					this.$message.warning('没有选中的款式');
				}else {
					this.show_dialog = true;
				}
			},
			//确认转为下架款
			commitFun(){
				if(this.off_reason == ''){
					this.$message.warning('请输入下架原因');
				}else if(this.dpysgg_remark == ''){
					this.$message.warning('请输入颜色规格备注');
				}else{
					let dpksbm = [];
					this.dpksbm.map(item => {
						dpksbm.push(item.ksbm);
					});
					let arg = {
						dpksbm:dpksbm,
						off_reason:this.off_reason,
						dpysgg:this.dpysgg_remark
					}
					resource.offShelfSet(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.getList();
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
		}
	}
</script>