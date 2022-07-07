<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
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
<el-form-item>
	<el-button type="primary" size="mini" @click="getList()">搜索</el-button>
</el-form-item>
</el-form>
<el-table size="mini" max-height="800" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
	<el-table-column prop="ksbm" label="款式" align="center"></el-table-column>
	<el-table-column label="图片" align="center">
		<template slot-scope="scope">
			<img style="width: 30px;height: 30px" :src="scope.row.tp" @click="bigImg(scope.row.tp)">
		</template>
	</el-table-column>
	<el-table-column prop="gys" label="供应商" align="center"></el-table-column>
	<el-table-column prop="gyshh" label="供应商货号" align="center"></el-table-column>
	<el-table-column prop="cjrq" label="建档时间" align="center"></el-table-column>
	<el-table-column prop="sjrq" label="上架时间" align="center"></el-table-column>
	<el-table-column prop="xjrq" label="下架时间" align="center"></el-table-column>
	<el-table-column prop="cb" label="成本" align="center"></el-table-column>
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
<!-- 图片放大 -->
<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
	<img style="width: 100%" :src="big_img_url">
	<span slot="footer" class="dialog-footer">
		<el-button type="primary" @click="imageDialog = false">关闭</el-button>
	</span>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.tp{
	width: 80px;
	height: 80px;
}
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ks_list:[],
				gys_list:[],
				gyshh_list:[],
				select_ks_list:[],
				select_gys:[],
				select_gyshh_list:[],
				dataObj:{},
				imageDialog:false,							//是否显示放大图片弹框
				big_img_url:"",								//放大的图片地址
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//图片放大
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
			},
			//产品编码
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e,from:16}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商列表
			ajaxGys(e){
				if(e != ''){
					resource.ajaxGys({name:e,from:16}).then(res => {
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
					resource.ajaxGyshh({name:e,from:16}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取列表
			getList(){
				let req = {
					ks:this.select_ks_list.join(','),
					gys:this.select_gys.join(','),
					gyshh:this.select_gyshh_list.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				resource.reportList(req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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