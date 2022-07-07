<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="款式：">
				<el-select v-model="ks" clearable :popper-append-to-body="false" multiple filterable
				 size="mini"
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
				<el-option v-for="item in hpxz_list" :key="item.id" :label="item.name" :value="item.name">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="实际货品性质：">
			<el-select v-model="sjhpxz" clearable :popper-append-to-body="false" placeholder="全部">
				<el-option v-for="item in hpxz_list" :key="item.id" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="mini" @click="getList('1')">搜索</el-button>
		</el-form-item>
	</el-form>
	<el-table size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column align="center" :width="160" property="ksbm" label="款式"></el-table-column>
		<el-table-column align="center" :width="160" property="gyshh" label="供应商货号"></el-table-column>
		<el-table-column align="center" property="mc" label="品类"></el-table-column>
		<el-table-column align="center" property="gys" label="供应商"></el-table-column>
		<el-table-column align="center" :width="260" label="实际下架日期">
			<template slot-scope="scope">
				<el-date-picker
				@change="changeTime($event,scope.row.ksbm)"
				v-model="scope.row.sjxjrq"
				type="date"
				clearable
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				size="mini"
				></el-date-picker>
			</template>
		</el-table-column>
		<el-table-column align="center" :width="120" property="sjhpxz" label="实际货品性质"></el-table-column>
		<el-table-column align="center" :width="120" property="jyhpxz" label="建议货品性质"></el-table-column>
		<el-table-column align="center" :width="120" property="sjxrrq" label="建议日期"></el-table-column>
		<el-table-column align="center" :width="120" property="remark" label="备注" show-overflow-tooltip>
		</el-table-column>
		<el-table-column label="操作" align="center" width="120" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="mini" @click="setKs('1','试',scope.row.ksbm)" v-if="button_list.try == 1">试</el-button>
				<el-button type="text" size="mini" @click="setKs('2','补',scope.row.ksbm)" v-if="button_list.replenishment == 1">补</el-button>
				<el-button type="text" size="mini" @click="setKs('3','停',scope.row.ksbm)" v-if="button_list.stop == 1">停</el-button>
				<el-button type="text" size="mini" @click="setKs('4','清',scope.row.ksbm)" v-if="button_list.clear == 1">清</el-button>
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
</div>
</template>
<style lang="less" scoped>
.label_title{
	width: 100px;
	color: #333333;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
}
</style>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				ks_list:[],								//产品编码
				ks:[],
				jyhpxz:"",
				sjhpxz:"",
				hpxz_list:[{
					id:'1',
					name:'试'
				},{
					id:'2',
					name:'补'
				},{
					id:'3',
					name:'停'
				},{
					id:'4',
					name:'清'
				}],			//货品性质
				dataObj:{},								//列表数据
				button_list:{}
			}
		},
		created(){
			//获取列表
			this.getList('1');
		},
		methods:{
			//修改实际下架日期
			changeTime(e,ksbm){
				let req = {
					ks:ksbm,
					xjrq:!e?'':e
				}
				resource.hpxzSetXjrq(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getList(type){		//type:1(搜索);2:设置
				this.page = type == '1'?1:this.page;
				let req = {
					ks:this.ks.join(','),
					jyhpxz:this.jyhpxz,
					sjhpxz:this.sjhpxz,
					pagesize:this.pagesize,
					page:this.page
				}
				resource.hpxzList(req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						this.button_list = this.dataObj.button_list;
						this.show_custom = false;
						if(type == '2'){
							this.$message.success(res.data.msg);
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//产品编码
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e,from:15}).then(res => {
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
				//1:试；2:补；3:停；4:清
				this.$prompt('请输入原因', `货品性质确定转为${title}么？想好哦！`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					if(!value){
						this.$message.warning('请输入原因');
						return;
					}
					let req = {
						remark:value,
						ks:ksbm
					}
					if(type == '1'){
						resource.hpxzTry(req).then(res => {
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
						resource.hpxzReplenish(req).then(res => {
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
						resource.hpxzStop(req).then(res => {
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
						resource.hpxzClear(req).then(res => {
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
			}
		}
	}
</script>