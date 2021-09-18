<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="品类:">
				<el-select v-model="select_cate_names" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cate_name_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="统计月份:">
				<el-select v-model="select_month_list" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in month_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="年份:">
				<el-checkbox-group v-model="select_years_list">
					<el-checkbox-button v-for="item in years_list" :label="item.id" :key="item.id">{{item.name}}</el-checkbox-button>
				</el-checkbox-group>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-tabs v-model="activeTab" type="border-card" @tab-click="checkTab">
			<el-tab-pane :label="item.menu_name" lazy :name="item.web_url" class="tab_pane_box" v-for="item in menu_list">
				<SalesMoney ref="sales_money" v-if="item.web_url == 'sales_money'"/>
				<SalesNumber ref="sales_number" v-if="item.web_url == 'sales_number'"/>
				<ReturnsData ref="returns_data" v-if="item.web_url == 'returns_data'"/>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<style lang="less" scoped>
.tab_pane_box{
	padding-top: 10px;
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import SalesMoney from './AnnualReport/sales_money.vue'
	import SalesNumber from './AnnualReport/sales_number.vue'
	import ReturnsData from './AnnualReport/returns_data.vue'
	import dps from '../../../components/results_components/dps.vue'
	export default{
		data(){
			return{
				activeTab:"sales_money",
				menu_list:[],								//所有菜单列表
				select_store_ids:[],						//选中的店铺列表
				select_department_ids:[],					//选中的部门id列表
				select_plat_ids:[],							//选中的平台列表
				cate_name_list:[],							//品类列表
				select_cate_names:[],						//选中的品类列表
				month_list:[{
					id:'01',
					name:'1月'
				},{
					id:'02',
					name:'2月'
				},{
					id:'03',
					name:'3月'
				},{
					id:'04',
					name:'4月'
				},{
					id:'05',
					name:'5月'
				},{
					id:'06',
					name:'6月'
				},{
					id:'07',
					name:'7月'
				},{
					id:'08',
					name:'8月'
				},{
					id:'09',
					name:'9月'
				},{
					id:'10',
					name:'10月'
				},{
					id:'11',
					name:'11月'
				},{
					id:'12',
					name:'12月'
				},],										//所有月份
				select_month_list:[],						//选中的月份
				years_list:[],								//所有的年份
				select_years_list:[],						//选中的年份
				dept_id:"",									//传给子组件的部门字符串
				shop_id:"",									//传给子组件的店铺字符串
				cpfl:"",
				year:"",
				month:"",
				ss:[]
			}
		},
		created(){	
			//获取年份/月份
			var now = new Date();
			var nowYear = now.getFullYear();
			var nowMonth = now.getMonth();
			this.select_month_list = [nowMonth - 1 < 10?'0' + (nowMonth - 1):nowMonth - 1,nowMonth < 10?'0' + nowMonth:nowMonth,nowMonth + 1 < 10?'0' + (nowMonth + 1):nowMonth + 1];
			for(var i = 0;i < 3;i ++){
				let obj = {
					id:nowYear - i,
					name:(nowYear - i) + '年'
				};
				this.years_list.push(obj);
				if(i < 2){
					this.select_years_list.push(nowYear - i);
				}
			}
			let menu_list = this.$store.state.menu_list;
			this.forMenuList(menu_list);
			this.getIndex();
			//品类列表
			this.ajaxCpfl();
			this.getList();
		},
		methods:{
			forMenuList(arr) {
				arr.map(item => {
					if('list' in item){
						this.ss.push(item);
						this.forMenuList(item.list)
					}
				})
			},
			getIndex(){
				this.ss.map(item => {
					if (item.web_url == 'annual_report') {
						this.menu_list = item.list;
						this.activeTab = this.menu_list[0].web_url;
					}
				})
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
			},
			//品类列表
			ajaxCpfl(){
				resource.ajaxPl({from:8}).then(res => {
					if(res.data.code == 1){
						this.cate_name_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击搜索
			getList(){
				this.dept_id = this.select_department_ids.join(',');
				this.shop_id = this.select_store_ids.join(',');
				this.cpfl = this.select_cate_names.join(',');
				this.year = this.select_years_list.join(',');
				this.month = this.select_month_list.join(',');
				let req = {
					dept_id:this.dept_id,
					shop_id:this.shop_id,
					platform:this.select_plat_ids.join(','),
					cpfl:this.cpfl,
					year:this.year,
					month:this.month
				} 
				this.$nextTick(() => {
					this.$refs[this.activeTab][0].getList(req);
				})
			},
			//切换tab
			checkTab(e){
				this.activeTab = e.name;
				this.getList(this.activeTab);
			}
		},
		components:{
			SalesMoney,
			SalesNumber,
			ReturnsData,
			dps
		}
	}
</script>