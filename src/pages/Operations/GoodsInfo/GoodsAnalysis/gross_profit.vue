<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags reserve-keyword placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商款号：">
				<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式编码：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品ID：">
				<el-select v-model="select_spid_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="getSpid" collapse-tags>
					<el-option v-for="item in spid_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="发货日期：">
				<el-date-picker v-model="date" :clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="top_content">
			<div class="cate_item" v-for="item in top_list_data">
				<div class="item_label">{{item.title}}</div>
				<div class="sub_label">{{item.value}}</div>
				<div class="small_text">环比：<span :class="{'red_color': item.hb_value > 0,'green_color': item.hb_value < 0}">{{item.hb_value}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': item.tb_value > 0,'green_color': item.tb_value < 0}">{{item.tb_value}}%</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="flex jse mt-10">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<div class="table_content">
			<div class="left_menu">
				<div class="menu_item" :class="{'active_color':active_index == index}" v-for="(item,index) in menu_list" @click="active_index = index">
					<div>{{item.name}}</div>
					<div class="active_line" v-if="active_index == index"></div>
				</div>
			</div>
			<el-table :data="table_list" size="small" style="width:100%" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" :max-height='540' :summary-method="getWeekSummaries" show-summary v-loading="loading">
				<el-table-column :label="item.title" :prop="item.field_name" v-for="item in title_list" :render-header="renderHeader" show-overflow-tooltip sortable :fixed="item.is_fixed">
					<template slot-scope="scope">
						<div :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.field_name])}px`,background:scope.row[item.field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="item.type == 1">{{scope.row[item.field_name]}}{{item.unit}}</div>
						<div v-else>{{scope.row[item.field_name]}}{{item.unit}}</div>
					</template>
				</el-table-column>
			</el-table>
			
		</div>
	</div>
</template>
<script>
	import resource from '../../../../api/resource.js'
	import operationResource from '../../../../api/operationResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../../api/nowMonth.js'
	import dps from '../../../../components/results_components/dps.vue'

	import {exportPost} from '../../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				select_department_ids:[],					//选中的部门列表
				select_plat_ids:[],							//选中的平台列表
				select_store_ids:[],						//选中的店铺列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				spid_list:[],								//商品id列表
				select_spid_list:[],						//选中的商品ID列表
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
				date:[getMonthStartDate(),getCurrentDate()],									//发货日期
				top_list_data:[],							//顶部数据
				menu_list:[
				{name:'店铺',id:'store'},
				{name:'品类',id:'cpfl'},
				{name:'店铺品类',id:'store_cpfl'},
				{name:'款式',id:'ksbm'},
				{name:'供应商',id:'gys'},
				{name:'颜色',id:'color'},
				{name:'尺码',id:'size'}],	//左侧导航列表
				active_index:0,						//当前选中的导航下标
				table_list:[],						//列表数据
				title_list:[],						//列
				total:[],
				loading:false,
			}
		},
		created(){
			//品类列表
			this.getPl();
			//点击搜索
			this.getList();
		},
		watch:{
			active_index:function(n,o){
				//点击搜索
				this.getList('1');
			}
		},
		methods:{
			//顶部悬浮
			renderHeader(h, data) {
				return h("span", [
					h(
						"el-tooltip",
						{
							attrs: {
								class: "item",
								effect: "dark",
								content: data.column.label,
								placement: "top",
							},
						},
						[h("span", data.column.label)]
						),
					]);
			},
			//子组件传递过来的参数
			checkReq(reqObj){
				this.select_department_ids = reqObj.select_department_ids;
				this.select_plat_ids = reqObj.select_plat_ids;
				this.select_store_ids = reqObj.select_store_ids;
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
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e,from:this.page_type}).then(res => {
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
					resource.ajaxGyshh({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//商品ID列表
			getSpid(e){
				if(e != ''){
					resource.ajaxSpid({name:e}).then(res => {
						if(res.data.code == 1){
							this.spid_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击搜索
			getList(type){
				let arg = {
					dept_id:this.select_department_ids.join(','),
					platform:this.select_plat_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					cpfl:this.select_pl_ids.join(','),
					spid:this.select_spid_list.join(','),
					gyskh:this.select_gyshh_ids.join(','),
					gys:this.select_gys_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
				}
				if(type != '1'){
					//获取顶部数据
					this.mlAnalysisTop(arg);
				}
				//获取底部列表
				this.loading = true;
				switch(this.active_index){
					case 0:
					//店铺
					this.getStoreData(arg);
					break;
					case 1:
					//品类
					this.mlCpfl(arg);
					break;
					case 2:
					//店铺品类
					this.mlStoreCpfl(arg);
					break;
					case 3:
					//款式
					this.mlKs(arg);
					break;
					case 4:
					//款式
					this.mlGys(arg);
					break;
					case 5:
					//颜色
					this.mlColor(arg);
					break;
					case 6:
					//尺码
					this.mlSize(arg);
					break;
					default:
					return;
				}
			},
			//获取顶部数据
			mlAnalysisTop(arg){
				operationResource.mlAnalysisTop(arg).then(res => {
					if(res.data.code == 1){
						this.top_list_data = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺
			getStoreData(arg){
				operationResource.mlStore(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类
			mlCpfl(arg){
				operationResource.mlCpfl(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺品类
			mlStoreCpfl(arg){
				operationResource.mlStoreCpfl(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						this.title_list[1].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//款式
			mlKs(arg){
				operationResource.mlKs(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商
			mlGys(arg){
				operationResource.mlGys(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//颜色
			mlColor(arg){
				operationResource.mlColor(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;	
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//尺码
			mlSize(arg){
				operationResource.mlSize(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.list;				//列表行数据
						this.title_list = data.title_list;		//列表列数据
						this.title_list[0].is_fixed = true;
						let total = [];
						data.total.map((item,index) => {
							total.push(item + this.title_list[index].unit);
						})
						this.total = total;	
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				let str = this.menu_list[this.active_index].name;
				let type = this.menu_list[this.active_index].id;
				MessageBox.confirm(`确认按${str}类型导出?`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dept_id:this.select_department_ids.join(','),
						platform:this.select_plat_ids.join(','),
						shop_id:this.select_store_ids.join(','),
						cpfl:this.select_pl_ids.join(','),
						spid:this.select_spid_list.join(','),
						gyskh:this.select_gyshh_ids.join(','),
						gys:this.select_gys_ids.join(','),
						ksbm:this.select_ks_ids.join(','),
						start_date:this.date && this.date.length > 0?this.date[0]:"",
						end_date:this.date && this.date.length > 0?this.date[1]:"",
						type:type
					}
					operationResource.mlExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,`毛利分析-${str}`);
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//表格总计行
			getWeekSummaries(param) {
				return this.total;
			},
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.top_content{
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	.cate_item{
		border-radius: 6px;
		border:1px solid #8a8a8a;
		width: 166px;
		height: 116px;
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		padding-top: 10px;
		padding-bottom: 10px;
		position: relative;
		.zb{
			position: absolute;
			top: -20px;
			height: 20px;
			width: 100%;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			color: #FD7B08;
		}
		.t_v{
			position: absolute;
			top: -36px;
			height: 36px;
			width: 100%;
			display:flex;
			flex-direction: column;
			align-items: center;
			font-size: 12px;
			.t{
				color: #333;
			}
			.v{
				color: #FD7B08;
			}
		}
		.item_label{
			font-weight: bold;
			color: #333;
			font-size: 14px;
		}
		.sub_label{
			color: #1296db;
			font-size: 18px;
			font-weight: bold;
		}
		.small_text{
			font-size: 12px;
			color: #8a8a8a;
			.red_color{
				color: red;
			}
			.green_color{
				color: green;
			}
		}
	}
}
.table_content{
	margin-top: 10px;
	width: 100%;
	display: flex;
	align-items: flex-start;
	.left_menu{
		border-right: 1px solid #333333;
		width: 120px;
		.menu_item{
			width: 120px;
			text-align: center;
			height: 48px;
			line-height: 48px;
			font-size:14px;
			color: #333333;
			position: relative;
			.active_line{
				position: absolute;
				top: 0;
				right: 0;
				background: #F56013;
				height: 48px;
				width: 2px;
			}
		}
		.active_color{
			color: #F56013;
		}
	}
}

</style>






