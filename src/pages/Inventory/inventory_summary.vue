<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="店铺：">
				<el-select v-model="shop_name" clearable :popper-append-to-body="false" filterable placeholder="全部">
					<el-option v-for="item in shop_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-input v-model="supplier" clearable placeholder="输入供应商"></el-input>
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
					缺货数据由当天早上7:30的库存和异常订单数据生成，数据整体更新时间为11:20，内供款式有生产周期数据
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
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column width="120" show-overflow-tooltip prop="shop_code" label="主卖店铺" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="gys" label="供应商" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="ksbm" label="款式编码" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="gyshh" label="供应商货号" align="center"></el-table-column>
			<el-table-column width="120" show-overflow-tooltip prop="splb" label="货品类型" align="center">
			</el-table-column>
			<el-table-column prop="avg3" label="近3天日均" align="center">
			</el-table-column>
			<el-table-column label="款式缺货情况" align="center">
				<el-table-column :label="item" align="center" v-for="(item,index) in ks_shortage_day_list">
					<template slot-scope="scope">
						<div>{{scope.row.ks_shortage_list[index]}}</div>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column label="缺货跟踪反馈" align="center">
				<el-table-column width="120" :label="item" align="center" v-for="(item,index) in feedback_day_list">
					<template slot-scope="scope">
						<el-input
						@blur="editFun(scope.row.feedback_list[index],scope.row.id)"
						size="small" 
						type="textarea"
						placeholder="输入反馈"
						v-model="scope.row.feedback_list[index]"
						v-if="index == feedback_day_list.length - 1"
						>
					</el-input>
					<div v-else>{{scope.row.feedback_list[index]}}</div>
				</template>
			</el-table-column>
		</el-table-column>
		<el-table-column prop="yxdl" label="已下单量" align="center">
		</el-table-column>
		<el-table-column width="150" prop="check_date" label="下单日期" align="center">
		</el-table-column>
		<el-table-column width="150" prop="deliver_date" label="交货日期" align="center">
		</el-table-column>
		<el-table-column prop="okpdtnum" label="已入库数" align="center">
		</el-table-column>
		<el-table-column prop="ponum" label="再途数量" align="center">
		</el-table-column>
		<el-table-column prop="rodate" label="延期天数" align="center">
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
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
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				shop_list:[],			//店铺列表
				shop_name:"",			//选中的店铺
				supplier:"",			//供应商
				ksbm:"",				//款式编码
				dataObj:{},				//返回数据
				ks_shortage_day_list:[],	//款式缺货情况对应日期数组
				feedback_day_list:[],			//缺货跟踪反馈对应日期数组
				loading:false
			}
		},
		created(){
			//店铺列表
			this.shopList();
			//获取列表
			this.getData();
		},
		methods:{
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
					shop_name:this.shop_name,
					supplier:this.supplier,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.stockList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
						this.ks_shortage_day_list = this.dataObj.ks_shortage_day_list;
						this.feedback_day_list = this.dataObj.feedback_day_list;
					}else{
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
						id:id,
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
					shop_name:this.shop_name,
					supplier:this.supplier,
				}
				for(var item in arg){
					let str = item + '=' + arg[item];
					arr.push(str);
				};
				exportUp(`stock/export?${arr.join('&')}`);
			}
		}
	}
</script>










