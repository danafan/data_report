<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="三天销量：">
				<el-input style="width: 70px" size="small" type="number" v-model="xssl_3_num_start"></el-input>
				--
				<el-input style="width: 70px" size="small" type="number" v-model="xssl_3_num_end"></el-input>
			</el-form-item>
			<el-form-item label="七天销量：">
				<el-input style="width: 70px" size="small" type="number" v-model="xssl_7_num_start"></el-input>
				--
				<el-input style="width: 70px" size="small" type="number" v-model="xssl_7_num_end"></el-input>
			</el-form-item>
			<el-form-item label="三十天销量：">
				<el-input style="width: 70px" size="small" type="number" v-model="xssl_30_num_start"></el-input>
				--
				<el-input style="width: 70px" size="small" type="number" v-model="xssl_30_num_end"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex ac jsb mb-10">
			<PopoverWidget title="拼多多项目部销售统计" :show_popover="false"/>
		</div>
		<custom-table v-loading="loading" :isLoading="loading" tableName="pdd_sales" max_height="650" :table_data="table_data" :title_list="title_list" :is_custom_sort="false" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import CustomTable from '../../components/custom_table.vue'
	import PageWidget from '../../components/pagination_widget.vue'
	import PopoverWidget from '../../components/popover_widget.vue'

	import resource from '../../api/operationResource.js'
	import commonResource from '../../api/resource.js'

	export default{
		data(){
			return{
				page:1,
				pagesize:20,
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				xssl_3_num_start:'',
				xssl_3_num_end:'',
				xssl_7_num_start:'',
				xssl_7_num_end:'',
				xssl_30_num_start:'',
				xssl_30_num_end:'',
				sort:"",									//排序
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,									//数据总数
				loading:false,
			}
		},
		created(){
			//获取列表
			this.pddDeptSales();
		},
		methods:{
			//款式编码
			getKsbm(e){
				if(e != ''){
					commonResource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取列表
			pddDeptSales(){
				if(this.xssl_3_num_start !== '' && !this.isZzs.test(this.xssl_3_num_start)){
					this.$message.warning('3天销量最小数量必须是正整数');
					return;
				}
				if(this.xssl_3_num_end !== '' && !this.isZzs.test(this.xssl_3_num_end)){
					this.$message.warning('3天销量最大数量必须是正整数');
					return;
				}
				if(parseInt(this.xssl_3_num_end) < parseInt(this.xssl_3_num_start)){
					this.$message.warning('3天销量最大数量大于最小数量');
					return;
				}
				if(this.xssl_7_num_start !== '' && !this.isZzs.test(this.xssl_7_num_start)){
					this.$message.warning('7天销量最小数量必须是正整数');
					return;
				}
				if(this.xssl_7_num_end !== '' && !this.isZzs.test(this.xssl_7_num_end)){
					this.$message.warning('7天销量最大数量必须是正整数');
					return;
				}
				if(parseInt(this.xssl_7_num_end) < parseInt(this.xssl_7_num_start)){
					this.$message.warning('7天销量最大数量大于最小数量');
					return;
				}
				if(this.xssl_30_num_start !== '' && !this.isZzs.test(this.xssl_30_num_start)){
					this.$message.warning('30天销量最小数量必须是正整数');
					return;
				}
				if(this.xssl_30_num_end !== '' && !this.isZzs.test(this.xssl_30_num_end)){
					this.$message.warning('30天销量最大数量必须是正整数');
					return;
				}
				if(parseInt(this.xssl_30_num_end) < parseInt(this.xssl_30_num_start)){
					this.$message.warning('30天销量最大数量大于最小数量');
					return;
				}
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					ksbm:this.select_ks_ids.join(','),
					sort:this.sort
				}
				if(this.xssl_3_num_start != '' || this.xssl_3_num_end != ''){
					arg['xssl_3_sum'] = `${this.xssl_3_num_start}_${this.xssl_3_num_end}`;
				}
				if(this.xssl_7_num_start != '' || this.xssl_7_num_end != ''){
					arg['xssl_7_sum'] = `${this.xssl_7_num_start}_${this.xssl_7_num_end}`;
				}
				if(this.xssl_30_num_start != '' || this.xssl_30_num_end != ''){
					arg['xssl_30_sum'] = `${this.xssl_30_num_start}_${this.xssl_30_num_end}`;
				}
				this.loading = true;
				resource.pddDeptSales(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序回调
			sortCallBack(sort){
				this.sort = sort;
				//获取列表
				this.pddDeptSales();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.pddDeptSales();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.pddDeptSales();
			},
		},
		components:{
			CustomTable,
			PageWidget,
			PopoverWidget
		}
	}
</script>
<style lang="less" scoped>

</style>






