<template>
	<div>
		<el-table :data="all_pl" size="small" style="width: 100%">
			<el-table-column prop="n" align="center" label="品类" width="150"></el-table-column>
			<el-table-column :label="item" align="center" v-for="item in arr">
				<el-table-column :prop="`xj_${item}`" align="center" label="销售金额" width="120">
				</el-table-column>
				<el-table-column :prop="`xs_${item}`" align="center" label="销售数量" width="120">
				</el-table-column>
				<el-table-column :prop="`ts_${item}`" align="center" label="退款数量" width="120">
				</el-table-column>
			</el-table-column>
		</el-table>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				all_pl:[],
				arr:[]
			}
		},
		props:{
			dept_id:{
				type:String,
				default:""
			},
			shop_id:{
				type:String,
				default:""
			},
			cpfl:{
				type:String,
				default:""
			},
			year:{
				type:String,
				default:""
			},
			month:{
				type:String,
				default:""
			}
		},
		watch:{
			dept_id:function(n,o){
				//获取列表
				this.getList();
			},
			shop_id:function(n,o){
				//获取列表
				this.getList();
			},
			cpfl:function(n,o){
				//获取列表
				this.getList();
			},
			year:function(n,o){
				//获取列表
				this.getList();
			},
			month:function(n,o){
				//获取列表
				this.getList();
			}
		},
		mounted(){
			//获取列表
			this.getList();
		},
		methods:{
			getList(){
				this.all_pl = [{n:'片类1',xj_2020:'1',xs_2020:'1',ts_2020:'1',xj_2021:'2',xs_2021:'2',ts_2021:'2'},{n:'片类2',xj_2020:'3',xs_2020:'3',ts_2020:'3',xj_2021:'4',xs_2021:'4',ts_2021:'4'}];
				this.arr = ['2020','2021'];
				let req = {
					dept_id:this.dept_id,
					shop_id:this.shop_id,
					cpfl:this.cpfl,
					year:this.year,
					month:this.month
				}
				resource.annualAmount(req).then(res => {
					if(res.data.code == 1){
						
					}else{
						this.$messgae.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>