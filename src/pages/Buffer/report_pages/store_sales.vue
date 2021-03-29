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
			<el-form-item label="付款日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="daterange"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
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
	import {getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js';
	import resource from '../../../api/resource.js'
	import Widget01 from './store_sales_components/widget_01.vue'
	import Widget02 from './store_sales_components/widget_02.vue'
	import Widget03 from './store_sales_components/widget_03.vue'
	import Widget04 from './store_sales_components/widget_04.vue'
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										//时间区间
				date:[getCurrentDate(),getCurrentDate()],	//付款日期
				start_time:getCurrentDate(),				//开始日期
				end_time:getCurrentDate(),					//结束日期
				store_list:[],
				select_store_ids:[],
			}
		},
		watch:{
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
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
					end_time:this.end_time
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