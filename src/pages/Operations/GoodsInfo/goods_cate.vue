<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商：">
				<el-input clearable v-model="supplier" placeholder="输入供应商"></el-input>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-input clearable v-model="supplier_code" placeholder="输入供应商货号"></el-input>
			</el-form-item>
			<el-form-item label="款号：">
				<el-input clearable v-model="code" placeholder="输入款号"></el-input>
			</el-form-item>
			<el-form-item label="品牌：">
				<el-select v-model="brand_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in brand_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="推广类型：">
				<el-select v-model="popularize_type_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in popularize_type_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="产品线：">
				<el-select v-model="product_line_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in product_line_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="季节：">
				<el-select v-model="season_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in season_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="分类：">
				<el-select v-model="classify_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in classify_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="大类：">
				<el-select v-model="broad_heading_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in broad_heading_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否已维护：">
				<el-select v-model="is_edit" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="table_top">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="dataObj.list.data" tooltip-effect="dark" style="width: 100%" max-height="560px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="brand" label="品牌" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="supplier" label="供应商" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="supplier_code" label="供应商货号" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="code" label="款号" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column label="图片" align="center" width="180">
				<template slot-scope="scope">
					<el-image
					style="width: 160px; height: 80px"
					fit="cover"
					:src="scope.row.image_url" v-if="scope.row.image_url != ''" @click="bigImg(scope.row.image_url)"></el-image>
					<div v-else>暂无图片</div>
				</template>
			</el-table-column>
			<el-table-column width="200" label="推广类型" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.popularize_type" size="small" @change="changeInput($event,scope.row.id,'popularize_type')">
						<el-option v-for="item in popularize_type_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column width="200" label="产品线" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.product_line" size="small" @change="changeInput($event,scope.row.id,'product_line')">
						<el-option v-for="item in product_line_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column width="200" label="季节" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.season" size="small" @change="changeInput($event,scope.row.id,'season')">
						<el-option v-for="item in season_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column width="200" label="分类" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.classify" size="small" @change="changeInput($event,scope.row.id,'classify')">
						<el-option v-for="item in classify_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
			<el-table-column width="200" label="大类" align="center">
				<template slot-scope="scope">
					<el-select v-model="scope.row.broad_heading" size="small" @change="changeInput($event,scope.row.id,'broad_heading')">
						<el-option v-for="item in broad_heading_list" :key="item" :label="item" :value="item">
						</el-option>
					</el-select>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="changePageSize" @current-change="changePage" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.list.total">
			</el-pagination>
		</div>
		<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
			<div style="display: flex;justify-content: center;width: 100%;height: 450px">
				<el-image
				style="height: 450px"
				fit="fill"
				:src="big_img_url"></el-image>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="imageDialog = false">关闭</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import resource from '../../../api/operationResource.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				supplier:"",			//供应商
				supplier_code:"",		//供应商货号
				code:"",				//款号
				brand_list:[],			//品牌列表
				brand_ids:[],			//选中的品牌列表
				popularize_type_list:[],//推广类型列表
				popularize_type_ids:[],	//选中的推广类型列表
				product_line_list:[],	//产品线列表
				product_line_ids:[],	//选中的产品线列表
				season_list:[],			//季节列表
				season_ids:[],			//选中的季节
				classify_list:[],		//分类列表
				classify_ids:[],		//选中的分类列表
				broad_heading_list:[],	//大类列表
				broad_heading_ids:[],	//选中的大类列表
				is_edit:"",				//师傅已维护
				page:1,
				pagesize:10,	
				dataObj:{
					list:{}
				},
				imageDialog:false,
				big_img_url:"",
				loading:false
			}
		},
		created(){
			//查询条件列表
			this.selectType();
		},
		watch:{
			// 处理款号批量查询
			code:function(n,o){
				this.code = n.replaceAll(' ',',');
			}
		},
		methods:{
			//图片放大
			bigImg(big_img_url){
				this.big_img_url = big_img_url;
				this.imageDialog = true;
			},
			//查询条件列表
			selectType(){
				resource.selectType().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.brand_list = data.brand;	//品牌
						this.popularize_type_list = data.popularize_type;//推广类型
						this.product_line_list = data.product_line;	//产品线
						this.season_list = data.season;	//季节
						this.classify_list = data.classify;	//分类
						this.broad_heading_list = data.broad_heading;	//大类
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFn(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					supplier:this.supplier,
					supplier_code:this.supplier_code,
					k_code:this.code,
					brand:this.brand_ids.join(','),
					popularize_type:this.popularize_type_ids.join(','),
					product_line:this.product_line_ids.join(','),
					season:this.season_ids.join(','),
					classify:this.classify_ids.join(','),
					broad_heading:this.broad_heading_ids.join(','),
					is_edit:this.is_edit,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.operateIndex(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//编辑
			changeInput(field_value,id,field){
				let arg = {
					id:id,
					field:field,
					field_value:field_value
				}
				resource.operateEdit(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			changePage(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			changePageSize(val) {
				this.page = 1;
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
						supplier:this.supplier,
						supplier_code:this.supplier_code,
						k_code:this.code,
						brand:this.brand_list.join(','),
						popularize_type:this.popularize_type_ids.join(','),
						product_line:this.product_line_ids.join(','),
						season:this.season_ids.join(','),
						classify:this.classify_ids.join(','),
						broad_heading:this.broad_heading_ids.join(','),
						is_edit:this.is_edit
					}
					resource.operateExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'商品品类');
						}
					})
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

<style lang="less" scoped>
.table_top{
	display: flex;
	justify-content: flex-end;
	margin-bottom: 15px;
}
</style>










