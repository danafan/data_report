<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-input v-model="ksbm" placeholder="供应商款式编码/线上款式编码"></el-input>
			</el-form-item>
			<el-form-item label="下架来源：">
				<el-select v-model="from_type_ids" clearable multiple filterable placeholder="请选择下架来源" collapse-tags>
					<el-option v-for="item in from_type_list" :key="item.value" :label="item.name" :value="item.value">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="仓库位置：">
				<el-select v-model="ckwz_ids" clearable multiple filterable placeholder="请选择仓库位置" collapse-tags>
					<el-option v-for="item in ckwz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="下架备注：">
				<el-input v-model="remark" placeholder="下架备注"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex ac jse mb-15">
			<el-button type="primary" plain size="small" v-if="button_list.export == 1" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table v-loading="loading" max_height="9999" :button_list="button_list" :table_data="table_list" :title_list="title_list"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import resource from '../../api/demandResource.js'
	import {exportPost} from '../../api/export.js'

	import PageWidget from '../../components/pagination_widget.vue'
	import CustomTable from '../../components/custom_table.vue'

	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				from_type_list:[],				//下架来源
				from_type_ids:[],				//选中的下架来源
				ckwz_list:[],					//仓库位置列表
				ckwz_ids:[],					//选中的仓库位置
				ksbm:"",						//款式编码
				remark:"",						//下架备注
				page:1,
				pagesize:10,				
				total:0,
				loading:false,
				table_list:[],					//数据列表
				title_list:[],					//头部列表
				button_list:{},					//按钮权限
			}
		},
		created(){
			//下架来源
			this.ajaxWmsOffshelfFrom();
			//仓库位置列表
			this.ajaxOffshelfWms();
			//获取列表
			this.getData();
		},
		methods:{
			//下架来源
			ajaxWmsOffshelfFrom(){
				resource.ajaxWmsOffshelfFrom().then(res => {
					if(res.data.code == 1){
						this.from_type_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//仓库位置列表
			ajaxOffshelfWms(){
				resource.ajaxOffshelfWms().then(res => {
					if(res.data.code == 1){
						this.ckwz_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			getData(){
				let arg = {
					ksbm:this.ksbm,
					from_type:this.from_type_ids.join(','),
					ckwz:this.ckwz_ids.join(','),
					remark:this.remark,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.wmsOffshelf(arg).then(res => {
					this.loading = false;
					if(res.data.code == 1){
						let data = res.data.data;
						this.table_list = data.table_data.data;
						this.table_list.map(item => {
							item['kc'] = parseInt(item.kc);
						})
						this.title_list = data.title_list;
						this.total = data.table_data.total;
						this.button_list = data.button_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:this.ksbm,
						from_type:this.from_type_ids.join(','),
						ckwz:this.ckwz_ids.join(','),
						remark:this.remark,
					}
					resource.wmsOffshelfExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'下架款数据（仓库查看）');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			}
		},
		components:{
			PageWidget,
			CustomTable
		}
	}
</script>
<style lang="less" scoped>

</style>








