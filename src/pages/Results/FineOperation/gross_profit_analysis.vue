<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="统计日期：">
				<el-date-picker v-model="day" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="胖胖哥官方旗舰店商品ID：">
				<el-select v-model="bbid" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="全部" :remote-method="ajaxPpgBbid" collapse-tags >
					<el-option v-for="item in bbid_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="日均销：">
				<el-select v-model="limit_type" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请选择日均销" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in limit_type_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<custom-table v-loading="loading" max_height="9999" :table_data="table_data" :title_list="title_list" :total_row="true" @sortCallBack="sortCallBack"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	</div>
</template>
<script>
	import dps from '../../../components/results_components/dps.vue'
	import CustomTable from '../../../components/custom_table.vue'
	import PageWidget from '../../../components/pagination_widget.vue'

	import resource from '../../../api/resource.js'

	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				select_store_ids:[],						//选中的店铺列表
				select_department_ids:[],					//选中的部门id列表
				select_plat_ids:[],							//选中的平台列表
				day:"",										//统计日期
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				limit_type:[],								//选中的日均销列表
				limit_type_list:[{
					id:'1',
					name:'日销 1-20'
				},{
					id:'2',
					name:'日销 21-100'
				},{
					id:'3',
					name:'日销 100-200'
				},{
					id:'4',
					name:'日销 200-500'
				}],											//日均销列表
				sort:"",									//排序
				bbid_list:[],								//胖胖哥宝贝id列表
				bbid:[],								//选中的胖胖哥宝贝id列表
				title_list:[],								//表头数据
				table_data:[],								//表格数据
				total:0,									//数据总数
				loading:false,
			}
		},
		created(){
			//获取列表
			this.mlreportList();
		},
		methods:{
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxGyshh({name:e}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//胖胖哥宝贝id列表
			ajaxPpgBbid(e){
				if(e != ''){
					resource.ajaxPpgBbid({name:e}).then(res => {
						if(res.data.code == 1){
							this.bbid_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					resource.ajaxPl({from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.pl_list = res.data.data;
							this.$store.commit('setPlList',this.pl_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.pl_list = this.$store.state.pl_list;
				}
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//获取列表
			mlreportList(){
				this.loading = true;
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					day:this.day?this.day:'',
					gys:this.select_gys_ids.join(','),
					gyshh:this.select_gyshh_ids.join(','),
					cpfl:this.select_pl_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					limit_type:this.limit_type.join(','),
					bbid:this.bbid.join(','),
					sort:this.sort
				}
				resource.mlreportList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.total = data.table_data.total;
						let table_total_data = data.table_total_data[0];
						this.table_data.unshift(table_total_data);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//排序回调
			sortCallBack(sort){
				this.sort = sort;
				//获取列表
				this.mlreportList();
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.mlreportList();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.mlreportList();
			},
		},
		components:{
			dps,
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>

</style>






