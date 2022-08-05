<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="烫画款商品编码：">
				<el-select v-model="select_thkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款商品编码" :remote-method="thkhList" collapse-tags>
					<el-option v-for="item in thkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="烫画款式编码：">
				<el-select v-model="select_thksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入烫画款式编码" :remote-method="thksbmList" collapse-tags>
					<el-option v-for="item in thksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款式编码：">
				<el-select v-model="select_ksbm_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款式编码" :remote-method="ksbmList" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="白坯款商品编码：">
				<el-select v-model="select_bpkh_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入白坯款商品编码" :remote-method="bpkhList" collapse-tags>
					<el-option v-for="item in bpkh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="有无差异：">
				<el-select v-model="is_dif" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="无" value="0"></el-option>
					<el-option label="有" value="1"></el-option>
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
			<el-table-column prop="gyshh" label="烫画款供应商款号" width="150" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="thkh" label="烫画款号" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="thspbm" label="烫画商品编码" width="150" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="烫画款颜色规格" width="120" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>{{scope.row.th_color}}/{{scope.row.th_size}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="bp_gyshh" label="白坯款供应商款号" width="150" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="bpkh" label="白坯款号" width="120" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="cpfl" label="白坯分类" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="bpspbm" label="白坯商品编码" width="150" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="白坯款颜色规格" width="120" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>{{scope.row.bp_color}}/{{scope.row.bp_size}}</div>
				</template>
			</el-table-column>
			<el-table-column label="颜色规格是否有差异" width="140" show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div>{{scope.row.is_dif == '1'?'有':'无'}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="creator_name" label="提交人" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="add_time" label="提交时间" show-overflow-tooltip width="160" align="center"></el-table-column>
			<el-table-column prop="dept_2" label="所属事业部" width="120" show-overflow-tooltip align="center" v-if="dept == 'total_table'"></el-table-column>
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
				thkh_list:[],			//烫画商品编码
				select_thkh_list:[],	//选中的烫画商品编码
				thksbm_list:[],			//烫画款式编码
				select_thksbm_list:[],	//选中的烫画款式编码
				bpkh_list:[],			//白坯商品编码
				select_bpkh_list:[],	//选中的白坯商品编码
				ksbm_list:[],			//白坯款式编码
				select_ksbm_list:[],	//选中的白坯款式编码
				is_dif:"",				//有无差异
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
			//烫画商品编码
			thkhList(e){
				this.searchDrawData('thspbm',e)
			},
			//烫画款式编码
			thksbmList(e){
				this.searchDrawData('thkh',e)
			},
			//白坯商品编码
			bpkhList(e){
				this.searchDrawData('bpspbm',e)
			},
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
				resource.searchWhiteData(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'thspbm'){
							this.thkh_list = res.data.data;
						}else if(field == 'thkh'){
							this.thksbm_list = res.data.data;
						}else if(field == 'bpspbm'){
							this.bpkh_list = res.data.data;
						}else if(field == 'bpkh'){
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
					thkh:this.select_thksbm_list.join(','),
					thspbm:this.select_thkh_list.join(','),
					bpspbm:this.select_bpkh_list.join(','),
					bpkh:this.select_ksbm_list.join(','),
					is_dif:this.is_dif,
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.dept == 'er_dept'){
					resource.twoDrawContrastList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else if(this.dept == 'si_dept'){
					resource.fourDrawContrastList(arg).then(res => {
						if(res.data.code == 1){
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					resource.drawContrastList(arg).then(res => {
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
						thkh:this.select_thksbm_list.join(','),
						thspbm:this.select_thkh_list.join(','),
						bpspbm:this.select_bpkh_list.join(','),
						bpkh:this.select_ksbm_list.join(','),
						is_dif:this.is_dif,
					}
					if(this.dept == 'er_dept'){
						resource.twoDrawContrastExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'白坯烫画对照表');
							}
						})
					}else if(this.dept == 'si_dept'){
						resource.fourDrawContrastExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'白坯烫画对照表');
							}
						})
					}else{
						resource.drawContrastExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'白坯烫画对照表');
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