<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="供应商货号：">
				<el-input v-model="gyshh" clearable placeholder="输入供应商货号"></el-input>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-input v-model="supplier" clearable placeholder="输入供应商"></el-input>
			</el-form-item>
			<el-form-item label="部门：">
				<el-select v-model="dept_name" clearable :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in dept_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="shop_name" clearable :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in shop_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-input v-model="ksbm" clearable placeholder="输入款式编码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="toast">
				<div>
					缺货数据由当天早上7:30的库存和实时订单占有数生成
				</div>
				<div>更新时间：{{dataObj.update_time}}</div>
			</div>
			<div style="display:flex">
				<div class="upload_box">
					<el-button type="primary" size="small">
						导入
						<i class="el-icon-upload el-icon--right"></i>
					</el-button>
					<input type="file" ref="csvUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
					<el-tooltip class="item" placement="top">
						<div slot="content">
							1、批量导入，第一行为“款式”，“备注”两个字段，填写的数据从第二行开始<br/>
							2、导入失败原因1：数据中存在某款式编码找不到<br/>
							3、导入失败原因2：数据中存在重复款式编码<br/>
							4、导入失败原因3：数据不对应(款式填到备注里面了)
						</div>
						<i class="el-icon-info" style="color: red"></i>
					</el-tooltip>
				</div>
				<el-button type="primary" plain size="small" @click="exportTable">导出<i class="el-icon-download el-icon--right"></i></el-button>
			</div>
		</div>
		<el-table size="small" :data="table_list" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading" border @header-dragend="secondChange">
			<el-table-column :index="0" :width="getWidth('i_id')" show-overflow-tooltip :render-header="renderHeader" prop="i_id" label="款式编码" align="center"></el-table-column>
			<el-table-column :index="1" :width="getWidth('gys')" show-overflow-tooltip :render-header="renderHeader" prop="gys" label="供应商" align="center"></el-table-column>
			<el-table-column :index="2" :width="getWidth('gys_type')" show-overflow-tooltip  :render-header="renderHeader" prop="gys_type" label="供应商分类" align="center"></el-table-column>
			<el-table-column :index="3" :width="getWidth('gyshh')" show-overflow-tooltip :render-header="renderHeader" prop="gyshh" label="供应商货号" align="center"></el-table-column>
			<el-table-column :index="4" :width="getWidth('xssl_3_sum')" :render-header="renderHeader" prop="xssl_3_sum" label="近3天销量" align="center">
			</el-table-column>
			<el-table-column :index="5" :width="getWidth('ksqhqk')" prop="ksqhqk" label="款式缺货情况" align="center">
				<el-table-column :label="item" align="center" v-for="(item,index) in ks_shortage_day_list">
					<template slot-scope="scope">
						<div>{{scope.row.ks_shortage_list[index]}}</div>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column :index="6" :width="getWidth('zmdp')" show-overflow-tooltip :render-header="renderHeader" prop="zmdp" label="主卖店铺" align="center"></el-table-column>
			<el-table-column :index="7" :width="getWidth('dept_name')" show-overflow-tooltip :render-header="renderHeader" prop="dept_name" label="部门" align="center"></el-table-column>
			<el-table-column :index="8" :width="getWidth('yesterday_remark')" show-overflow-tooltip :render-header="renderHeader" prop="yesterday_remark" label="昨日跟踪反馈" align="center"></el-table-column>
			<el-table-column :index="9" :width="getWidth('today_remark')" :render-header="renderHeader" prop="today_remark" label="今日跟踪反馈" align="center">
				<template slot-scope="scope">
					<el-input @blur="editFun(scope.row.today_remark,scope.row.i_id)" size="small" type="textarea" placeholder="输入反馈" v-model="scope.row.today_remark">
					</el-input>
				</template>
			</el-table-column>
			<el-table-column :index="10" :width="getWidth('history_remark')" :render-header="renderHeader" prop="history_remark" label="历史跟踪反馈" align="center">
				<template slot-scope="scope">
					<el-popover
					placement="right"
					width="800"
					:open-delay="1000"
					trigger="hover"
					@show="getRecord(scope.row.i_id)"
					>
					<el-table size="small" :data="tableObj.data" tooltip-effect="dark" style="width: 100%;height: 400px" :header-cell-style="{'background':'#f4f4f4'}" v-loading="detail_loading">
						<el-table-column prop="createtime" label="操作时间" width="160" align="center"></el-table-column>
						<el-table-column prop="remark" label="反馈内容" show-overflow-tooltip align="center"></el-table-column>
						<el-table-column prop="creater" label="操作人" width="100" show-overflow-tooltip align="center"></el-table-column>
					</el-table>
					<div class="page">
						<el-pagination @size-change="handlePageSize" @current-change="handlePage" :current-page="table_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
					<el-button slot="reference" type="text" size="mini">查看</el-button>
				</el-popover>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
	</div>
</div>
</template>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content:space-between;
	.toast{
		font-size: 12px;
		color: red;
	}
	.upload_box{
		margin-right: 10px;
		position: relative;
		.upload_file{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
		.item{
			position: absolute;
			top: -10px;
			right: -10px;
		}
	}
}
</style>
<script>
	import resource from '../../api/inventoryResource.js'
	import {exportUp} from '../../api/export.js'
	import commonResource from '../../api/resource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				shop_list:[],			//店铺列表
				shop_name:"",			//选中的店铺
				dept_list:['事业二部','事业四部','新兴事业部','抖店中心','直播BD项目部','运营中心闲置'],			//部门列表
				dept_name:"",			//选中的部门
				gyshh:"",				//供应商货号
				supplier:"",			//供应商
				ksbm:"",				//款式编码
				width_list:[{
					prop:'i_id',
					width:"120"
				},{
					prop:'gys',
					width:"120"
				},{
					prop:'gys_type',
					width:"120"
				},{
					prop:'gyshh',
					width:"120"
				},{
					prop:'xssl_3_sum',
					width:"120"
				},{
					prop:'ksqhqk',
					width:"180"
				},{
					prop:'zmdp',
					width:"120"
				},{
					prop:'dept_name',
					width:"120"
				},{
					prop:'yesterday_remark',
					width:"120"
				},{
					prop:'today_remark',
					width:"180"
				},{
					prop:'history_remark',
					width:"120"
				}],			//宽度列表
				table_list:[],			//表格数据
				total:0,				//总数
				table_id:"",
				edit_id:"",

				dataObj:{},					//返回数据
				ks_shortage_day_list:[],	//款式缺货情况对应日期数组
				loading:false,
				table_page:1,
				table_pagesize:10,
				i_id:"",
				detail_loading:false,
				tableObj:{},				//详情
			}
		},
		created(){
			//店铺列表
			this.shopList();
			//获取列表
			this.getData();
		},
		methods:{
			//获取宽度
			getWidth(prop){
				let arr = this.width_list.filter(item => {
					return item.prop == prop;
				})
				return arr[0].width;
			},
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
			//店铺列表
			shopList(){
				resource.shopList().then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			getList(){
				this.page = 1;
				//获取列表
				this.getData();
			},
			//获取列表
			getData(){
				let arg = {
					ksbm:this.ksbm,
					dept_name:this.dept_name,
					shop_name:this.shop_name,
					gyshh:this.gyshh,
					supplier:this.supplier,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.stockList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.table_list = data.data;
						this.total = data.total;
						this.ks_shortage_day_list = data.ks_shortage_day_list;
						this.table_id = data.table_setting.table_id;
						if(data.table_setting.setting){
							this.edit_id = data.table_setting.edit_id;
							let setting_arr = data.table_setting.setting.split(',');
							this.width_list.map(iii => {
								let arr = setting_arr.filter(item => {
									return iii.prop == item.split('-')[0]
								})
								iii.width = arr[0].split('-')[1];
							})
						}

						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//明细表表列宽修改
			secondChange(newWidth, oldWidth, column, event){
				let index = column.index;
				if(!index){
					return;
				}
				this.width_list[index].width = newWidth;
				let arr = [];
				this.width_list.map(item => {
					let str = item.prop + '-' + item.width;
					arr.push(str);
				})
				let arg = {
					table_id:this.table_id,
					setting:arr.join(','),
				}
				if(this.edit_id){
					arg.id = this.edit_id;
				}
				//修改宽度
				this.changeWidth(arg)
			},
			//修改宽度
			changeWidth(arg){
				commonResource.tableSetting(arg).then(res => {
					if(res.data.code != 1){
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//编辑
			editFun(v,id){
				this.$confirm('确认提交反馈?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						ksbm:id,
						remark:v
					};
					resource.stockEdit(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//导入
			uploadCsv(){
				if (this.$refs.csvUpload.files.length > 0) {
					let files = this.$refs.csvUpload.files;
					resource.stockImport({file:files[0]}).then(res => {
						this.$refs.csvUpload.value = null;
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.page = 1;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//导出
			exportTable(){
				//导出
				var arr = [];
				let arg = {
					ksbm:this.ksbm,
					dept_name:this.dept_name,
					shop_name:this.shop_name,
					gyshh:this.gyshh,
					supplier:this.supplier,
				}
				for(var item in arg){
					let str = item + '=' + arg[item];
					arr.push(str);
				};
				exportUp(`stock/export?${arr.join('&')}`);
			},
			//点击查看
			getRecord(i_id){
				this.table_page = 1;
				this.i_id = i_id;
				//获取详情
				this.getTableData();
			},
			//获取详情
			getTableData(){
				let arg = {
					ksbm:this.i_id,
					page:this.table_page,
					pagesize:this.table_pagesize
				}
				this.detail_loading = true;
				resource.editLog(arg).then(res => {
					if(res.data.code == 1){
						this.detail_loading = false;
						this.tableObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//详情分页
			handlePageSize(val) {
				this.table_page = 1;
				this.table_pagesize = val;
				//获取列表
				this.getTableData();
			},
			handlePage(val) {
				this.table_page = val;
				//获取列表
				this.getTableData();
			},
		}
	}
</script>










