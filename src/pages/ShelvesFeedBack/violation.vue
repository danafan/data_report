<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺：">
				<el-select v-model="shop_list_ids" clearable multiple filterable placeholder="请输入店铺" collapse-tags>
					<el-option v-for="item in shop_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="订单编号：">
				<el-input v-model="order_no" placeholder="订单编号"></el-input>
			</el-form-item>
			<el-form-item label="类型：">
				<el-select v-model="type_list_ids" clearable multiple filterable placeholder="请输入类型" collapse-tags>
					<el-option v-for="item in type_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="统计日期:">
				<el-date-picker
				v-model="date"
				type="daterange"
				:clearable="false"
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
			<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="flex ac jse mb-15">
		<el-button type="primary" plain size="small">导出<i class="el-icon-download el-icon--right"></i></el-button>
	</div>
</div>
</template>
<script>
	import {getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import resource from '../../api/shelvesResource.js'
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
				},	 										
				date:[getCurrentDate(),getCurrentDate()],	//统计日期
				order_no:"",					//订单编号
				shop_list:[],					//店铺列表
				shop_list_ids:[],				//选中的店铺列表
				type_list:[],					//类型列表
				type_list_ids:[],				//选中的类型列表
			}
		},
		created(){
			//获取店铺列表
			this.gsViolationSearch('shop_name');
			//获取违规类型列表
			this.gsViolationSearch('type');
		},
		methods:{
			//获取顶部筛选条件
			gsViolationSearch(type){
				resource.gsViolationSearch({type:type}).then(res => {
					if(res.data.code == 1){
						if(type == 'shop_name'){	//店铺列表
							this.shop_list = res.data.data;
						}else{						//违规类型
							this.type_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//
			searchFn(){
				let arg = {
					shop_name:this.shop_list_ids.join(','),
					order_no:this.order_no,
					type:this.type_list_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
				}
				console.log(arg)
			}
		}
	}
</script>
<style lang="less" scoped>

</style>








