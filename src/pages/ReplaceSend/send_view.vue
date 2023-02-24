<template>
	<div>
		<!-- 头部信息 -->
		<div class="top_content relative flex ac jsa mb-10">
			<div class="top_item background_color relative height-100 flex fc ac">
				<img class="today_icon absolute" src="../../static/today_icon.png">
				<div class="color_item relative flex fc ac jc fw-500 f16 dfdds" @click="getOrderList(1)">
					<div class="mb-17">代发订单数</div>
					<div>{{top_info.total_num}}</div>
					<div class="l_line absolute"></div>
					<div class="r_line absolute"></div>
				</div>
				<div class="c_c_line"></div>
				<div class="width-100 flex jsb">
					<div class="color_item flex fc ac jc fw-500 f16 wsh" @click="getOrderList(2)">
						<div class="mb-17">代发订单未审核</div>
						<div>{{top_info.today_uncheck_num}}</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 fhs" @click="getOrderList(3)">
						<div class="mb-17">代发订单发货数</div>
						<div>{{top_info.today_order_sented_num}}</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 ysh" @click="getOrderList(4)">
						<div class="mb-17">代发订单已审核</div>
						<div>{{top_info.today_checked_num}}</div>
					</div>
				</div>
			</div>
			<div class="center_box flex fc ac jc" @click="getOrderList(5)">
				<div class="normal f22 white_color mb-13">{{top_info.today_sented_num}}</div>
				<div class="f16 fw-600 white_color">代发今日已发货</div>
			</div>
			<div class="top_item relative background_color height-100 flex fc ac">
				<PopoverWidget class="popover absolute" title="" keys="dfkb"/>
				<div class="r_item relative flex ac pl-14 mb-40" @click="getOrderList(7)">
					<img class="send_view_icon mr-14" src="../../static/send_view_02.png">
					<div class="r_content flex fc as jsb">
						<div class="dark_color f16">代发未发货</div>
						<div class="bold f22">{{top_info.unsent_num}}</div>
					</div>
					<div class="r_l_line absolute"></div>
					<div class="r_r_line absolute"></div>
				</div>
				<div class="width-100 flex jsb">
					<div class="r_item flex ac pl-14" @click="getOrderList(6)">
						<img class="send_view_icon mr-14" src="../../static/send_view_03.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">48小时内未发货</div>
							<div class="bold f22">{{top_info.unsented_less_twodays_num}}</div>
						</div>
					</div>
					<div class="r_item flex ac pl-14" @click="getOrderList(8)">
						<img class="send_view_icon mr-14" src="../../static/send_view_04.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">超48小时未发货</div>
							<div class="bold f22">{{top_info.unsented_more_twodays_num}}</div>
						</div>
					</div>
				</div>
			</div>
			<i class="refresh el-icon-refresh" @click="refreshFn"></i>
		</div>
		<div class="flex jsb mb-15">
			<!-- 商品 -->
			<div>
				<div class="f16 bold mb-10">商品代发排行</div>
				<div class="flex ac jsb mb-10">
					<el-radio-group v-model="i_date_type" size="mini">
						<el-radio-button label="today">当日</el-radio-button>
						<el-radio-button label="week">本周</el-radio-button>
						<el-radio-button label="month">本月</el-radio-button>
					</el-radio-group>
					<el-button type="primary" plain size="mini" @click="exportFn('i_id',i_date_type,'商品代发排行')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="mini" :data="i_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="sp_loading" max-height="300px">
					<el-table-column type="index" label="序号" align="center">
					</el-table-column>
					<el-table-column :prop="item.row_field_name" width="120px" :label="item.row_name" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip align="center" v-for="item in i_title_list">
						<template slot-scope="scope">
							<div>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 供应商 -->
			<div>
				<div class="f16 bold mb-10">供应商代发排行</div>
				<div class="flex ac jsb mb-10">
					<el-radio-group v-model="gys_date_type" size="mini">
						<el-radio-button label="today">当日</el-radio-button>
						<el-radio-button label="week">本周</el-radio-button>
						<el-radio-button label="month">本月</el-radio-button>
					</el-radio-group>
					<el-button type="primary" plain size="mini" @click="exportFn('supplier_name',gys_date_type,'供应商代发排行')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="mini" :data="gys_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="gys_loading" max-height="300px">
					<el-table-column type="index" label="序号" align="center">
					</el-table-column>
					<el-table-column :prop="item.row_field_name" width="120px" :label="item.row_name" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip align="center" v-for="item in gys_title_list">
						<template slot-scope="scope">
							<div>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- 店铺 -->
			<div>
				<div class="f16 bold mb-10">店铺代发排行</div>
				<div class="flex ac jsb mb-10">
					<el-radio-group v-model="dp_date_type" size="mini">
						<el-radio-button label="today">当日</el-radio-button>
						<el-radio-button label="week">本周</el-radio-button>
						<el-radio-button label="month">本月</el-radio-button>
					</el-radio-group>
					<el-button type="primary" plain size="mini" @click="exportFn('shop_name',dp_date_type,'店铺代发排行')">导出<i class="el-icon-download el-icon--right"></i></el-button>
				</div>
				<el-table size="mini" :data="dp_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="dp_loading" max-height="300px">
					<el-table-column type="index" label="序号" align="center">
					</el-table-column>
					<el-table-column :prop="item.row_field_name" width="120px" :label="item.row_name" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip align="center" v-for="item in dp_title_list">
						<template slot-scope="scope">
							<div>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<!-- 发货平均时效统计 -->
		<div class="f16 bold mb-10">发货平均时效统计</div>
		<div class="flex ac jsb mb-10">
			<el-radio-group v-model="pjsx_date_type" size="mini">
				<el-radio-button label="week">近一周</el-radio-button>
				<el-radio-button label="month">本月</el-radio-button>
			</el-radio-group>
			<el-button type="primary" plain size="mini" @click="exportPjsxFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="mini" :data="pjsx_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="pjsx_loading" max-height="300px">
			<el-table-column type="index" label="序号" align="center">
			</el-table-column>
			<el-table-column :prop="item.row_field_name" :label="item.row_name" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip align="center" v-for="item in pjsx_title_list">
				<template slot-scope="scope">
					<div>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
				</template>
			</el-table-column>
		</el-table>
		<!-- 发货即将超时统计 -->
		<div class="f16 bold mb-10 mt-15">发货即将超时统计</div>
		<div class="flex ac jsb mb-10">
			<el-radio-group v-model="jjcs_date_type" size="mini">
				<el-radio-button label="week">近一周</el-radio-button>
				<el-radio-button label="month">本月</el-radio-button>
			</el-radio-group>
			<el-button type="primary" plain size="mini" @click="exportJjcsFn">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="mini" :data="jjcs_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="jjcs_loading" max-height="300px">
			<el-table-column type="index" label="序号" align="center">
			</el-table-column>
			<el-table-column :prop="item.row_field_name" :label="item.row_name" :sortable="item.is_sort == 1?true:false" show-overflow-tooltip align="center" v-for="item in jjcs_title_list">
				<template slot-scope="scope">
					<div>{{scope.row[item.row_field_name]}}{{item.unit}}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<script>
	import {lastXDate,getNowDate} from '../../api/nowMonth.js'
	import resource from '../../api/replaceSend.js'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import PopoverWidget from '../../components/popover_widget.vue'
	export default{
		data(){
			return {
				top_info:{},						//头部数据
				i_date_type:"today",				//商品时间类型
				sp_loading:false,
				i_title_list:[],					//商品头部列表
				i_table_data:[],					//商品数据列表
				gys_date_type:"today",				//供应商时间类型
				gys_loading:false,
				gys_title_list:[],					//供应商头部列表
				gys_table_data:[],					//供应商数据列表
				dp_date_type:"today",				//店铺时间类型
				dp_loading:false,
				dp_title_list:[],					//店铺头部列表
				dp_table_data:[],					//店铺数据列表
				pjsx_date_type:"week",				//发货平均时效统计
				pjsx_loading:false,
				pjsx_title_list:[],					//发货平均时效头部列表
				pjsx_table_data:[],					//发货平均时效列表
				jjcs_date_type:"week",				//发货即将超时统计
				jjcs_loading:false,
				jjcs_title_list:[],					//发货即将超时头部列表
				jjcs_table_data:[],					//发货即将超时列表
			}
		},
		created(){
			//头部信息
			this.dfOrderTotal();
			//商品代发排行
			this.dfSpData();
			//供应商代发排行
			this.gysData();
			//店铺代发排行
			this.dpData();
			//代发看板发货平均时效统计
			this.dfAverageDelivery();
			//代发看板发货超时未发统计
			this.dfOverTime();
		},
		watch:{
			//切换商品时间类型
			i_date_type:function(n,o){
				//商品代发排行
				this.dfSpData();
			},
			//切换供应商时间类型
			gys_date_type:function(n,o){
				//供应商代发排行
				this.gysData();
			},
			//切换店铺时间类型
			dp_date_type:function(n,o){
				//店铺代发排行
				this.dpData();
			},
			//切换发货平均时效时间类型
			pjsx_date_type:function(n,o){
				//代发看板发货平均时效统计
				this.dfAverageDelivery();
			},
			//切换发货超时未发时间类型
			jjcs_date_type:function(n,o){
				//代发看板发货超时未发统计
				this.dfOverTime();
			},
		},
		methods:{
			//刷新
			refreshFn(){
				this.top_info = {},						//头部数据
				this.i_date_type = "today";				//商品时间类型
				this.sp_loading = false;
				this.i_title_list = [];					//商品头部列表
				this.i_table_data = [];					//商品数据列表
				this.gys_date_type = "today";				//供应商时间类型
				this.gys_loading = false;
				this.gys_title_list = [];					//供应商头部列表
				this.gys_table_data = [];					//供应商数据列表
				this.dp_date_type = "today";				//店铺时间类型
				this.dp_loading = false;
				this.dp_title_list = [];					//店铺头部列表
				this.dp_table_data = [];					//店铺数据列表
				this.pjsx_date_type = "week";				//发货平均时效统计
				this.pjsx_loading = false;
				this.pjsx_title_list = [];					//发货平均时效头部列表
				this.pjsx_table_data = [];					//发货平均时效列表
				this.jjcs_date_type = "week";				//发货即将超时统计
				this.jjcs_loading = false;
				this.jjcs_title_list = [];					//发货即将超时头部列表
				this.jjcs_table_data = [];					//发货即将超时列表
				//头部信息
				this.dfOrderTotal();
				//商品代发排行
				this.dfSpData();
				//供应商代发排行
				this.gysData();
				//店铺代发排行
				this.dpData();
				//代发看板发货平均时效统计
				this.dfAverageDelivery();
				//代发看板发货超时未发统计
				this.dfOverTime();
			},
			//头部信息
			dfOrderTotal(){
				resource.dfOrderTotal().then(res => {
					if(res.data.code == 1){
						this.top_info = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击跳转到订单列表页面
			getOrderList(type){
				var arg = {};
				switch(type){
					case 1: //代发订单数
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:[],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 2: //代发订单未审核
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['WaitConfirm','Question'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 3: //代发订单发货数
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['Sent'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 4: //代发订单已审核
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 5: //代发今日已发货
					arg = {
						start_date:getNowDate() + ' 00:00:00',
						end_date:getNowDate() + ' 23:59:59',
						order_status:['Sent'],
						time_type:2
					}
					this.$emit('callback',arg);
					break;
					case 6: //48小时内未发货
					arg = {
						start_date:lastXDate(2,true),
						end_date:getNowDate(true),
						order_status:['WaitConfirm','Question','WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 7: //代发今日未发货
					arg = {
						start_date:'',
						end_date:'',
						order_status:['WaitConfirm','Question','WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					case 8: //超48小时未发货订单数
					arg = {
						start_date:'',
						end_date:lastXDate(2,true),
						order_status:['WaitConfirm','Question','WaitOuterSent','Delivering'],
						time_type:1
					}
					this.$emit('callback',arg);
					break;
					default:
					return;
				}
			},
			//商品代发排行
			dfSpData(){
				let arg = {
					type:'i_id',
					date_type:this.i_date_type
				}
				this.sp_loading = true;
				resource.dfShopKsbmGys(arg).then(res => {
					if(res.data.code == 1){
						this.sp_loading = false;
						this.i_title_list = res.data.data.title_list;
						this.i_table_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//供应商代发排行
			gysData(){
				let arg = {
					type:'supplier_name',
					date_type:this.gys_date_type
				}
				this.gys_loading = true;
				resource.dfShopKsbmGys(arg).then(res => {
					if(res.data.code == 1){
						this.gys_loading = false;
						this.gys_title_list = res.data.data.title_list;
						this.gys_table_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺代发排行
			dpData(){
				let arg = {
					type:'shop_name',
					date_type:this.dp_date_type
				}
				this.dp_loading = true;
				resource.dfShopKsbmGys(arg).then(res => {
					if(res.data.code == 1){
						this.dp_loading = false;
						this.dp_title_list = res.data.data.title_list;
						this.dp_table_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//店铺、商品、供应商代发排行导出
			exportFn(type,date_type,title){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						type:type,
						date_type:date_type
					}
					resource.dfShopKsbmGysExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,title);
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//代发看板发货平均时效统计
			dfAverageDelivery(){
				let arg = {
					date_type:this.pjsx_date_type
				}
				this.pjsx_loading = true;
				resource.dfAverageDelivery(arg).then(res => {
					if(res.data.code == 1){
						this.pjsx_loading = false;
						this.pjsx_title_list = res.data.data.title_list;
						this.pjsx_table_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//代发看板发货平均时效统计导出
			exportPjsxFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date_type:this.pjsx_date_type
					}
					resource.dfAverageDeliveryExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'代发看板发货平均时效统计');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//代发看板发货即将超时统计
			dfOverTime(){
				let arg = {
					date_type:this.jjcs_date_type
				}
				this.jjcs_loading = true;
				resource.dfOverTime(arg).then(res => {
					if(res.data.code == 1){
						this.jjcs_loading = false;
						this.jjcs_title_list = res.data.data.title_list;
						this.jjcs_table_data = res.data.data.table_data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//代发看板发货即将超时统计导出
			exportJjcsFn(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						date_type:this.jjcs_date_type
					}
					resource.dfOverTimeExport(arg).then(res => {
						if(res){
							exportPost("\ufeff" + res.data,'代发看板发货即将超时统计');
						}
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		},
		components:{
			PopoverWidget
		}
	}
</script>
<style lang="less" scoped>
.top_content{
	height: 332px;
	background-color: #ECEFF8;
	padding: 14px 24px;
	.refresh{
		position: absolute;
		top: 14px;
		right: 14px;
		cursor: pointer;
	}
	.top_item{
		padding: 22px 10px; 
		border-radius: 8px;
		width: 480px;
	}
	.popover{
		top: 14px;
		right: 14px;
		z-index: 9;
	}
	.center_box{
		border-radius: 50%;
		width: 150px;
		height: 150px;
		background: #5575EB;
		cursor: pointer;
	}
	.today_icon{
		top: 14px;
		left: 14px;
		width: 29px;
		height: 27px;
	}
	.background_color{
		background-color: #ffffff;
	}
	.color_item{
		border-radius: 8px;
		width: 144px;
		height: 100px;
		cursor: pointer;
		.l_line{
			left:-85px;
			top:50px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
			width: 85px;
			height: 110px;
		}
		.r_line{
			right:-85px;
			top:50px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
			width: 85px;
			height: 110px;
		}
	}
	.c_c_line{
		height: 68px;
		width: 1px;
		background-color:#5288F8; 
	}
	.r_item{
		width: 210px;
		height: 116px;
		background: #FFFFFF;
		box-shadow: 0px 0px 8px 0px #E2EBFF;
		border-radius: 8px;
		cursor: pointer;
		.send_view_icon{
			width: 54px;
			height: 54px;
		}
		.r_content{
			height: 54px;
		}
		.r_l_line{
			left: -22px;
			top: 55px;
			width: 22px;
			height: 89px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
		}
		.r_r_line{
			right: -22px;
			top: 55px;
			width: 22px;
			height: 89px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
		}
	}
	.dfdds{
		background-color: #E3ECFF;
	}
	.wsh{
		background-color: #FFE0E0;
	}
	.fhs{
		background-color: #FFF9E3;
	}
	.ysh{
		background-color: #E8F8E8;
	}
}
</style>












