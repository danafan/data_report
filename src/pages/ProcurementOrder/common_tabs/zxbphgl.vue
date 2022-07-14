<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_ksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="ksbmList" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<el-button type="primary" plain size="mini" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.list.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="bpkh" label="白坯款号" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="hgl" label="合格率" align="center"></el-table-column>
			<el-table-column prop="creator_name" label="提交人" align="center"></el-table-column>
			<el-table-column prop="add_time" label="提交时间" align="center"></el-table-column>
			<el-table-column prop="dept_2" label="所属事业部" show-overflow-tooltip width="130" align="center" v-if="dept == 'total_table'"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.list.total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/procurementResource.js'
	import {getNowDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				ksbm_list:[],			//白坯款式编码
				select_ksbm_list:[],	//选中的白坯款式编码
				dataObj:{
					list:{
						data:[]
					}
				},				//获取到的数据
				page:1,
				pagesize:10
			}
		},
		props:{
			dept:{
				type:String,
				default:''
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//白坯款式编码
			ksbmList(e){
				this.searchDrawData('bpkh',e)
			},
			//获取查询条件
			searchDrawData(field,field_value){
				let arg = {
					field:field,
					field_value:field_value
				}
				resource.searchWhiteHglData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'bpkh'){
							this.ksbm_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			searchFn(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					bpkh:this.select_ksbm_list.join(','),
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoWhiteHglList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourWhiteHglList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.whiteHglList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//分页
			changePage(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			changePageSize(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			//导出
			commitExport(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText:'取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						bpkh:this.select_ksbm_list.join(','),
					}
					if(this.dept == 'er_dept'){
						resource.twoWhiteHglExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'白坯合格率');
							}
						})
					}else if(this.dept == 'si_dept'){
						resource.fourWhiteHglExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'白坯合格率');
							}
						})
					}else{
						resource.whiteHglExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'白坯合格率');
							}
						})
					}
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			}
		}
	}
</script>
<style scoped lang="less">
.table_top{
	margin-bottom: 15px;
	display: flex;
	justify-content: flex-end;
}
</style>