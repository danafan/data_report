<template>
	<div>
		<el-card class="card_style">
			<Widget01/>
		</el-card>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="店铺:">
				<el-select v-model="select_store_ids" :popper-append-to-body="false" multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="写入日期">
				<el-date-picker
				v-model="time_data.sjxrrq"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				:append-to-body="false"
				>
			</el-date-picker>
		</el-form-item>
		<el-form-item label="数据日期">
			<div>{{time_data.start_date}} -- {{time_data.end_date}}</div>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="searchFun">搜索</el-button>
		</el-form-item>
	</el-form>
	<el-card class="card_style">
		<Widget02 ref="widget02"/>
	</el-card>
	<el-card class="card_style">
		<Widget03 ref="widget03"/>
	</el-card>
	<el-card class="card_style">
		<Widget04 ref="widget04"/>
	</el-card>
</div>
</template>
<style lang="less" scoped>
.card_style{
	margin-bottom: 20px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import Widget01 from './store_sales_components/widget_01.vue'
	import Widget02 from './store_sales_components/widget_02.vue'
	import Widget03 from './store_sales_components/widget_03.vue'
	import Widget04 from './store_sales_components/widget_04.vue'
	export default{
		data(){
			return{
				time_data:{},
				store_list:[],
				select_store_ids:[],
			}
		},
		created(){
			//获取分析报告的写入日期
			this.ajaxReportsJxrrq();
		},
		mounted(){
			this.searchFun();
			//店铺列表
			this.getStoreList();
		},
		methods:{
			//搜索
			searchFun(){
				let req = {
					shop_id:this.select_store_ids.join(','),
					start_time:this.time_data.sjxrrq,
				}
				this.$refs.widget02.reLoadData(req);
				this.$refs.widget03.reLoadData(req);
				this.$refs.widget04.reLoadData(req);
			},
			//获取分析报告的写入日期
			ajaxReportsJxrrq(){
				resource.ajaxReportsJxrrq().then(res => {
					if(res.data.code == 1){
						this.time_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺列表
			getStoreList(){
				resource.ajaxViewStore({from:1}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		},
		components:{
			Widget01,
			Widget02,
			Widget03,
			Widget04,
		}
	}
</script>