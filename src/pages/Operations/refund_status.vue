<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<dps @callBack="checkReq"></dps>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="商品ID：">
				<el-select v-model="select_spid_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入商品ID" :remote-method="getSpid" collapse-tags>
					<el-option v-for="item in spid_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="付款日期：">
				<el-date-picker v-model="date":clearable="false" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- 部门GMV详情 -->
		<div class="table_title">部门GMV详情</div>
		<el-table :data="dept_gmv_data" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' v-loading="dept_loading">
			<el-table-column :label="item.row_name" v-for="item in dept_title_list">
				<template slot-scope="scope">
					<div :class="{'bold_style':scope.$index == 0}">{{scope.row[item.row_field_name]}}</div>
				</template>
				<el-table-column :label="i.row_name" :prop="i.row_field_name" v-for="i in item.list">
					<template slot-scope="scope">
						<div :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="i.type == 1 && scope.$index > 0">{{scope.row[i.row_field_name]}}{{i.unit}}</div>
						<div class="text_content" :class="{'bold_style':scope.$index == 0}" v-else>{{i.num_type == 1?getQianNumber(scope.row[i.row_field_name]):scope.row[i.row_field_name]}}{{i.unit}}</div>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 平台GMV详情 -->
		<div class="table_title">平台GMV详情</div>
		<el-table :data="platform_gmv_data" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' v-loading="platform_loading">
			<el-table-column :label="item.row_name" v-for="item in platform_title_list">
				<template slot-scope="scope">
					<div :class="{'bold_style':scope.$index == 0}">{{scope.row[item.row_field_name]}}</div>
				</template>
				<el-table-column :label="i.row_name" :prop="i.row_field_name" v-for="i in item.list">
					<template slot-scope="scope">
						<div :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="i.type == 1 && scope.$index > 0">{{scope.row[i.row_field_name]}}{{i.unit}}</div>
						<div class="text_content" :class="{'bold_style':scope.$index == 0}" v-else>{{i.num_type == 1?getQianNumber(scope.row[i.row_field_name]):scope.row[i.row_field_name]}}{{i.unit}}</div>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<!-- 品类GMV详情 -->
		<div class="table_title">品类GMV详情</div>
		<el-table :data="cpfl_gmv_data" size="small" style="width: 100%" :header-cell-style="{'background':'#f4f4f4','text-align': 'center'}" max-height='560' v-loading="cpfl_loading">
			<el-table-column :label="item.row_name" v-for="item in cpfl_title_list">
				<template slot-scope="scope">
					<div :class="{'bold_style':scope.$index == 0}">{{scope.row[item.row_field_name]}}</div>
				</template>
				<el-table-column :label="i.row_name" :prop="i.row_field_name" v-for="i in item.list">
					<template slot-scope="scope">
						<div :style="{width:`${i.max_value == 0?0:(80/i.max_value)*Math.abs(scope.row[i.row_field_name])}px`,background:scope.row[i.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="i.type == 1 && scope.$index > 0">{{scope.row[i.row_field_name]}}{{i.unit}}</div>
						<div class="text_content" :class="{'bold_style':scope.$index == 0}" v-else>{{i.num_type == 1?getQianNumber(scope.row[i.row_field_name]):scope.row[i.row_field_name]}}{{i.unit}}</div>
					</template>
				</el-table-column>
			</el-table-column>
		</el-table>
		<div class="toast_box">
			<div class="table_title">店铺商品明细</div>
			<div class="toast_title">关键指标含义</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>xxUV：对应销售额/对应访客数</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>实退率：发货后退货数量/发货数量</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>退款率：退款数量/剔除鱼塘订单总坑产数量</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>发货前退款率：发货前退款数量/剔除鱼塘订单总坑产数量</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>毛利额：剔除鱼塘及售前退款订单，按款式每月销售成本计算</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>直接花费：鱼塘佣金 + 淘客佣金 + 直通车花费 + 超级推荐花费 + 极速推花费</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>盈亏：毛利额 -直接花费</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>利润率：盈亏 / 剔除鱼塘销售额</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>营销费用率：直接花费 / 剔除鱼塘销售额</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>营销贡献毛益率：盈亏 / 剔除鱼塘及售前退款销售额</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>整体ROI：总坑产 /直接花费</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>真实ROI：剔除鱼塘销售额 /直接花费</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>ROI平衡点：1 / 营销贡献毛益率</div>
			</div>
			<div class="item_row">
				<div class="dian"></div>
				<div>排序从左到右存在优先级，最左边排序等级为1级，若要排序其他列，需先取消前面的排序，点击两下至箭头消失</div>
			</div>
		</div>
		<!-- 店铺商品明细 -->
		<div class="table_setting">
			<el-button type="primary" size="small" @click="show_custom = true">自定义列表</el-button>
		</div>
		<!-- 表格 -->
		<el-table :data="table_list" size="small" style="width: 100%;margin-bottom: 30px" :header-cell-style="{'background':'#8D5714','color':'#ffffff'}" max-height='600' v-loading="goods_loading">
			<el-table-column :label="item.row_name" :prop="item.row_field_name" v-for="item in title_list" :sortable="item.is_sort == 1" show-overflow-tooltip :render-header="renderHeader" :fixed="item.is_fixed == 1">
				<template slot-scope="scope">
					<el-image :z-index="2008" style="width: 50px;height: 50px" :src="scope.row.images[0]" fit="scale-down" :preview-src-list="scope.row.images" v-if="item.type == 3 && scope.$index > 0"></el-image>
					<div :style="{width:`${item.max_value == 0?0:(80/item.max_value)*Math.abs(scope.row[item.row_field_name])}px`,background:scope.row[item.row_field_name] >= 0?'#FFA39E':'#B7EB8F'}" v-if="item.type == 1 && scope.$index > 0">{{scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ''?item.unit:''}}</div>
					<div class="text_content" :class="{'bold_style':scope.$index == 0}" v-if="item.type == 0 || item.type == 4 ||  scope.$index == 0">{{item.num_type == 1?getQianNumber(scope.row[item.row_field_name]):scope.row[item.row_field_name]}}{{scope.row[item.row_field_name] != ''?item.unit:''}}</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="storeSizeChange" @current-change="storePageChange" :current-page="page" :pager-count="5" :page-sizes="[5, 10, 15, 20]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 自定义列表 -->
		<el-dialog title="自定义列表" :visible.sync="show_custom">
			<div class="select_box">
				<el-checkbox-group v-model="selected_ids">
					<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in view_row">{{item.row_name}}</el-checkbox>
				</el-checkbox-group>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="Restore">恢复默认</el-button>
				<el-button size="small" @click="Restore('is_close')">取消</el-button>
				<el-button size="small" type="primary" @click="setColumns">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import dps from '../../components/results_components/dps.vue'
	import resource from '../../api/resource.js'
	import operationResource from '../../api/operationResource.js'
	import {getMonthStartDate,getCurrentDate,getNowDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	export default{
		data(){
			return{
				dept_name:[],								//项目部
				pl:[],										//平台
				shop_code:[],								//店铺
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
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
					}],
					disabledDate(date) {
						return (
							date.getTime() < new Date(new Date().getFullYear(),0,1).getTime() ||
							date.getTime() > new Date(new Date().getFullYear(),11,31).getTime()
							);
					}
				},	 										//时间区间
				date:[getMonthStartDate(),getNowDate()],//付款日期				
				dept_title_list:[],							//部门表头信息
				dept_gmv_data:[],							//部门gmv数据
				dept_loading:false,
				platform_title_list:[],						//平台表头信息
				platform_gmv_data:[],						//平台gmv数据
				platform_loading:false,
				cpfl_title_list:[],							//品类表头信息
				cpfl_gmv_data:[],							//品类gmv数据
				cpfl_loading:false,
				table_list:[],						//列表数据
				total:0,
				title_list:[],						//列
				selected_ids:[],					//自定义已选中的id
				view_row:[],						//自定义
				goods_loading:false,
				show_custom:false,
				page:1,
				pagesize:10,
			}
		},
		created(){
			//品类列表
			this.getPl();
			//搜索
			this.searchFn();
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
			//搜索
			async searchFn(){
				let arg = {
					dept_id:this.dept_name.join(','),
					platform:this.pl.join(','),
					shop_id:this.shop_code.join(','),
					cpfl:this.select_pl_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					gyskh:this.select_gys_ids.join(','),
					spid:this.select_spid_list.join(','),
					tjrq_start:this.date && this.date.length > 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length > 0?this.date[1]:""
				}
				//获取部门GMV详情
				await this.deptGmvList(arg);
				//获取平台GMV详情
				await this.platformGmvList(arg);
				//获取品类GMV详情
				await this.cpflGmvList(arg);
				//店铺商品明细
				await this.goodsDetails();
			},
			//获取部门GMV详情
			deptGmvList(arg){
				this.dept_loading = true;
				return new Promise((resolve)=>{
					operationResource.deptGmvList(arg).then(res => {
						if(res.data.code == 1){
							this.dept_loading = false;
							this.dept_gmv_data = res.data.data.data;
							this.dept_title_list = res.data.data.title_list;
							resolve();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//获取部门GMV详情
			platformGmvList(arg){
				this.platform_loading = true;
				return new Promise((resolve)=>{
					operationResource.platformGmvList(arg).then(res => {
						if(res.data.code == 1){
							this.platform_loading = false;
							this.platform_gmv_data = res.data.data.data;
							this.platform_title_list = res.data.data.title_list;
							resolve();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//获取品类GMV详情
			cpflGmvList(arg){
				this.cpfl_loading = true;
				return new Promise((resolve)=>{
					operationResource.cpflGmvList(arg).then(res => {
						if(res.data.code == 1){
							this.cpfl_loading = false;
							this.cpfl_gmv_data = res.data.data.data;
							this.cpfl_title_list = res.data.data.title_list;
							resolve();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//店铺商品明细
			goodsDetails(){
				let arg = {
					dept_id:this.dept_name.join(','),
					platform:this.pl.join(','),
					shop_id:this.shop_code.join(','),
					cpfl:this.select_pl_ids.join(','),
					ksbm:this.select_ks_ids.join(','),
					gyskh:this.select_gys_ids.join(','),
					spid:this.select_spid_list.join(','),
					tjrq_start:this.date && this.date.length > 0?this.date[0]:"",
					tjrq_end:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize
				}
				this.goods_loading = true;
				return new Promise((resolve)=>{
					operationResource.goodsDetails(arg).then(res => {
						if(res.data.code == 1){
							this.goods_loading = false;
							let data = res.data.data;
							//列表行数据
							let data_list = data.table_list.data;
							data_list.map(item => {
								let images = [];
								images.push(item.pic);
								item.images = images;
							})
							this.table_list = data_list;

							this.total = data.table_list.total;			//列表行数据
							this.title_list = data.title_list;		//列表列数据
							this.selected_ids = data.selected_ids;	//自定义已选中的id
							this.view_row = res.data.data.view_row;			//自定义
							resolve();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				})
			},
			//分页
			storeSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.goodsDetails();
			},
			storePageChange(val) {
				this.page = val;
				//获取列表
				this.goodsDetails();
			},
			//恢复默认
			Restore(type){
				this.selected_ids = [];
				this.view_row.map(item => {
					this.selected_ids.push(item.row_id)
				})
				if(type == 'is_close'){
					this.show_custom = false;
				}
			},
			//自定义列
			setColumns(){
				var row_ids = this.selected_ids.join(',');
				resource.setColumns({menu_id:'132',row_ids:row_ids}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_custom = false;
						//获取列表
						this.goodsDetails();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//千分位展示
			getQianNumber(number) {
				const num = String(number)
				const reg = /\d{1,3}(?=(\d{3})+$)/g
				const res = num.replace(/^(-?)(\d+)((\.\d+)?)$/, function(match, s1, s2, s3){
					return s1 + s2.replace(reg, '$&,') + s3
				})
				return res
			},
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					resource.ajaxPl().then(res => {
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
			//子组件传递过来的参数
			checkReq(reqObj){
				this.dept_name = reqObj.select_department_ids;
				this.pl = reqObj.select_plat_ids;
				this.shop_code = reqObj.select_store_ids;
			},
		},
		components:{
			dps
		}
	}
</script>
<style lang="less" scoped>
.table_title{
	margin-top: 15px;
	margin-bottom: 15px;
	font-weight: bold;
	color: #333333;
}
.table_setting{
	margin-bottom:15px;
	display: flex;
	justify-content: flex-end;
}
.bold_style{
	font-size: 14px;
	color: #333333;
	font-weight: bold;
}
.toast_box{
	margin-top: 15px;
	padding: 10px;
	border-radius: 10px;
	border:1px solid #8D5714;
	width: 50%;
}
.form_box{
	width: 50%;
	display:flex;
	flex-direction: column;
	justify-content: space-between;
}
.toast_title{
	font-weight: bold;
	font-size: 16px;
	color: #8D5714;
}
.dian{
	margin-right: 8px;
	border-radius: 3px;
	background:#8D5714; 
	width: 6px;
	height: 6px;
}
.item_row{
	display:flex;
	align-items: center;
	font-size: 14px;
	color: #8D5714;
}
</style>