<template>
	<div>
		<el-card class="card_style">
			<Widget01/>
		</el-card>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺:">
				<el-select v-model="select_store_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="付款日期">
				<el-date-picker
				v-model="start_time"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				:append-to-body="false"
				>
			</el-date-picker>
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
	import {getCurrentDate} from '../../../api/nowMonth.js';
	import resource from '../../../api/resource.js'
	import Widget01 from './store_sales_components/widget_01.vue'
	import Widget02 from './store_sales_components/widget_02.vue'
	import Widget03 from './store_sales_components/widget_03.vue'
	import Widget04 from './store_sales_components/widget_04.vue'
	export default{
		data(){
			return{
				start_time:getCurrentDate(),				//付款日期
				store_list:[],
				select_store_ids:[],
			}
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
					start_time:this.start_time,
				}
				this.$refs.widget02.reLoadData(req);
				this.$refs.widget03.reLoadData(req);
				this.$refs.widget04.reLoadData(req);
			},
			//店铺列表
			getStoreList(){
				resource.ajaxViewStore().then(res => {
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