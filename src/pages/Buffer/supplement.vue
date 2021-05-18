<template>
	<div>
		<condition page_type="2" @callBack="searchFun"/>
		<div class="table_setting">
			<div class="buts">
				<el-popover
				placement="right-start"
				:append-to-body="false"
				width="150"
				trigger="click">
				<div class="setStyle">
					<el-button type="primary" size="small" plain @click="setKs('1','试')" v-if="button_list.try == 1">试</el-button>
				</div>
				<div class="setStyle">
					<el-button type="warning" size="small" plain @click="setKs('3','停')" v-if="button_list.stop == 1">停</el-button>
					<el-button type="danger" size="small" plain @click="setKs('4','清')" v-if="button_list.clear == 1">清</el-button>
				</div>
				<el-button type="primary" size="small" slot="reference">批量设置</el-button>
			</el-popover>
			<el-button style="margin-left: 10px" type="primary" size="small" @click="show_sup = true">供应商报价</el-button>
			<el-button type="primary" size="small" @click="show_match = true">档口配齐时间</el-button>
			<el-button type="primary" size="small" @click="show_zng = true">转内供款式</el-button>
			<el-button type="primary" plain size="small" style="margin-left: 10px" @click="showSearch = true">批量查询款式编码<i class="el-icon-search el-icon--right"></i></el-button>
		</div>
		<div class="buts">
			<el-button type="primary" size="small" @click="customFun">自定义列表</el-button>
			<el-button type="primary" plain size="small" @click="exportFile" v-if="button_list.export == 1">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
	</div>
	<el-table ref="multipleTable" size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
		<el-table-column :label="item.row_name" :prop="item.row_field_name" :width="(item.row_field_name == 'bd' || item.row_field_name == 'sjxjrq' || item.row_field_name == 'nbhj' || item.row_field_name == 'xds')?260:120" :sortable="item.row_field_name == 'qtxl' || item.row_field_name == 'stxl' || item.row_field_name == 'replenish_num'?'custom':false" align="center" v-for="item in dataObj.title_list" show-overflow-tooltip :fixed="isFixed(item.row_field_name)">
			<template slot-scope="scope">
				<!-- 内部核价 -->
				<el-input v-model="scope.row[item.row_field_name]" size="small" type="number" style='width: 100px' placeholder="请输入价格" v-if="item.row_field_name == 'nbhj'" @change="nuclearPrice($event,scope.row.ksbm)" :disabled="button_list.setprice != 1"></el-input>
				<!-- 下钻 -->
				<el-tooltip placement="top-end" v-else-if="item.row_field_name == 'ksbm' && button_list.detail == 1">
					<div slot="content">
						<el-button type="text" size="small" @click="getDetail(scope.row.ksbm,scope.row.sjxrrq)">下钻</el-button>
					</div>
					<div style="color: #1890FF">{{scope.row[item.row_field_name]}}</div>
				</el-tooltip>
				<!--  实际下架日期 -->
				<el-date-picker
				@change="changeTime($event,scope.row.ksbm)"
				v-else-if="item.row_field_name == 'sjxjrq'"
				v-model="scope.row.sjxjrq"
				type="date"
				clearable
				 :disabled="button_list.setxjrq != 1"
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				size="small"
				></el-date-picker>
				<!-- 图片 -->
				<img style="width: 80px;height: 80px" :src="scope.row.tp" v-else-if="item.row_field_name == 'tp'" @click="bigImg(scope.row.tp)">
				<div v-else>{{scope.row[item.row_field_name]}}</div>
			</template>
		</el-table-column>
		<el-table-column label="操作" align="center" width="180" fixed="right">
			<template slot-scope="scope">
				<el-button type="text" size="small" @click="setKs('1','试',scope.row.ksbm)" v-if="button_list.try == 1">试</el-button>
				<el-button type="text" size="small" @click="setKs('3','停',scope.row.ksbm)" v-if="button_list.stop == 1">停</el-button>
				<el-button type="text" size="small" @click="setKs('4','清',scope.row.ksbm)" v-if="button_list.clear == 1">清</el-button>
				<el-button type="text" size="small" @click="updateNum(scope.row.ksbm,scope.row.replenish_num,scope.row.sjxrrq)" v-if="button_list.modifynum == 1">修正数量</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="dataObj.total"
		>
	</el-pagination>
</div>
<!-- 自定义列表 -->
<el-dialog title="自定义列表（点击取消列表名保存直接修改）" :visible.sync="show_custom">
	<div class="select_box">
		<el-checkbox-group v-model="row_ids">
			<el-checkbox style="width:28%;margin-bottom: 15px" :label="item.row_id" :key="item.row_id" v-for="item in dataObj.view_row">{{item.row_name}}</el-checkbox>
		</el-checkbox-group>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="Restore">恢复默认</el-button>
		<el-button size="small" @click="show_custom = false">取消</el-button>
		<el-button size="small" type="primary" @click="setColumns">保存</el-button>
	</div>
</el-dialog>
<!-- 修正数量 -->
<el-dialog title="修正数量" @close="closeDialog" :visible.sync="updeteDialog">
	<el-form size="small" label-width="100px">
		<el-form-item label="修正数量：" label-width="100px" required>
			<el-input v-model="num" type="number" style='width: 300px' placeholder="请输入数量"></el-input>
		</el-form-item>
		<el-form-item label="修正原因：" label-width="100px">
			<el-input v-model="remark" type="textarea"
			:rows="3" style='width: 300px;' placeholder="请输入修正原因"></el-input>
		</el-form-item>
	</el-form>
	<span slot="footer" class="dialog-footer">
		<el-button size="small" @click="updeteDialog = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitUpdate">确 定</el-button>
	</span>
</el-dialog>
<!-- 下钻 -->
<el-dialog title="款式信息" @close="closeDetail" :visible.sync="detailDialog">
	<el-table :data="detailData.data" @sort-change="sortDetail" size="small">
		<el-table-column width="160" align="center" property="spbm" label="商品编码"></el-table-column>
		<el-table-column width="120" align="center" property="ys" label="颜色"></el-table-column>
		<el-table-column width="120" align="center" property="cm" label="尺码"></el-table-column>
		<el-table-column width="120" align="center" property="stxl" label="三天销量"></el-table-column>
		<el-table-column width="120" align="center" property="sgstxl" label="上个三天销量"></el-table-column>
		<el-table-column width="120" align="center" property="strjhb" label="三天日均环比"></el-table-column>
		<el-table-column width="120" align="center" property="xjqxbh" label="下架前需补货"></el-table-column>
		<el-table-column width="120" align="center" property="jsfhdqtxl" label="七天销量" sortable="custom"></el-table-column>
		<el-table-column width="120" align="center" property="kys" label="可用库存" sortable="custom"></el-table-column>
		<el-table-column align="center" property="zts" label="在途数"></el-table-column>
		<el-table-column align="center" property="bhts" label="备货天数"></el-table-column>
		<el-table-column align="center" property="qzxs" label="权重系数"></el-table-column>
		<el-table-column width="160" align="center" property="xds" label="根据销量建议下单数"></el-table-column>
		<el-table-column width="120" align="center" property="replenish_num" label="实际补货数量"></el-table-column>
		<el-table-column align="center" label="操作">
			<template slot-scope="scope">
				<el-button type="text" size="small" v-if="scope.$index > 0 && button_list.modifyskunum == 1" @click="updateSku(scope.row.spbm,scope.row.replenish_num)">修改数量</el-button>
			</template>
		</el-table-column>
	</el-table>
	<el-dialog width="30%" title="修改SKU数量" @close="closeDialog" :visible.sync="innerVisible" append-to-body>
		<el-form size="small" label-width="100px">
			<el-form-item label="修正数量：" label-width="100px" required>
				<el-input v-model="num" type="number" style='width: 300px' placeholder="请输入数量"></el-input>
			</el-form-item>
			<el-form-item label="修正原因：" label-width="100px">
				<el-input v-model="remark" type="textarea"
				:rows="3" style='width: 300px;' placeholder="请输入修正原因"></el-input>
			</el-form-item>
		</el-form>
		<span slot="footer" class="dialog-footer">
			<el-button size="small" @click="innerVisible = false">取消</el-button>
			<el-button size="small" type="primary" @click="submitSku">确 定</el-button>
		</span>
	</el-dialog>
	<div class="page">
		<el-pagination
		@size-change="detailSizeChange"
		@current-change="detailCurrentChange"
		:current-page="detail_page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="detailData.total"
		>
	</el-pagination>
</div>
</el-dialog>
<!-- 供应商报价 -->
<SupplierQuotation v-if="show_sup" @callback="closeSup"/>
<!-- 档口配齐时间表 -->
<MatchTime v-if="show_match" @callback="closeMatch"/>
<!-- 转内供列表 -->
<ZngPage v-if="show_zng" @callback="show_zng = false"/>
<!-- 图片放大 -->
<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
	<img style="width: 100%" :src="big_img_url">
	<span slot="footer" class="dialog-footer">
		<el-button type="primary" @click="imageDialog = false">关闭</el-button>
	</span>
</el-dialog>
<!-- 批量查询商品编码 -->
<el-dialog title="数据查询" :visible.sync="showSearch">
	<div>
		<div>导入编辑好的Excel表格</div>
		<div class="toast_text">请以"款式编码"为第一行，在第一列填写相应编码</div>
		<img class="model_img" src="../../static/model_img.png">
		<div>
			<div class="imgBox" v-if="filename == ''">
				<div class="text">请选择上传文件</div>
				<input type="file" ref="fileUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadFn" v-if="isMac">
				<input type="file" ref="fileUpload" class="upload_file" accept="application/vnd.ms-excel" @change="uploadFn" v-else/>
			</div>
			<div class="file_name_box" v-else>
				<div class="file_name">{{filename}}</div>
				<i class="el-icon-circle-close" @click="deleteFile"></i>
			</div>
		</div>
	</div>
	<div slot="footer" class="dialog-footer">
		<el-button size="small" @click="showSearch = false">取消</el-button>
		<el-button size="small" type="primary" @click="allSearch">批量查询</el-button>
	</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 10px;
	display: flex;
	justify-content: space-between;
	.buts{
		display: flex;
	}
}
.setStyle{
	height: 50px;
	display:flex;
	align-items: center;
	justify-content:space-around;
}
.imgBox{
	margin-top: 8px;
	background: #fff;
	display: flex;
	align-items:center;
	justify-content:center;
	width: 106px;
	height: 30px;
	border-radius: 2px;
	border: 1px solid #E0E0E0;
	position: relative;
	.text{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 30px;
		font-size: 13px;
		color: #666666;
	}
	.upload_file {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
	}
}
.file_name_box{
	display: flex;
	align-items: center;
	border-radius: 2px;
	border: 1px solid #E0E0E0;
	width: 206px;
	height: 30px;
	padding-left: 10px;
	padding-right: 10px;
	.file_name{
		margin-right: 10px;
		width: 100%;
		text-align: center;
		height: 100%;
		line-height: 30px;
		font-size: 13px;
		color: #666666;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
	}
}
.toast_text{
	margin-top: 10px;
	color: red;
}
.model_img{
	margin-top: 10px;
	margin-bottom: 30px;
	width: 160px;
}
</style>
<script>
	import resource from '../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import SupplierQuotation from './supplement_pages/supplier_quotation.vue'
	import MatchTime from './supplement_pages/match_time.vue'
	import ZngPage from './supplement_pages/zng_page.vue'
	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	import condition from '../../components/condition.vue'
	export default{
		data(){
			return{
				pagesize:10,
				page:1,
				req:{},									//请求参数
				dataObj:{},									//列表数据
				show_custom:false,							//自定义列表是否显示
				row_ids:[],									//选择的自定义列表id
				updeteDialog:false,							//修正数量不显示
				ks:"",
				num:"",
				remark:"",
				detailData:[],								//下钻信息
				sjxrrq:"",
				spbm:"",
				ksbm:"",
				detailDialog:false,			
				detail_page:1,
				detail_page_size:10,
				show_sup:false,								//供应商报价
				show_match:false,							//档口配齐时间
				show_zng:false,
				innerVisible:false,							//修改sku数量
				sort:"",
				sort_type:"",
				imageDialog:false,							//是否显示放大图片弹框
				big_img_url:"",								//放大的图片地址
				showSearch:false,							//批量查询弹框是否显示
				filename:'',								//已上传的文件名
				file:null,
				isMac:true,									//判断系统
				all_search:false,							//是否是批量查询
				button_list:{}
			}
		},
		created(){
			let query = this.$route.query;
			if(JSON.stringify(query) != "{}"){
				for(var item in query){
					this.[item] = query[item];
				}
			}
			//获取列表
			this.getList();
		},
		watch:{
			$route() {
				let query = this.$route.query;
				if(JSON.stringify(query) != "{}"){
					for(var item in query){
						this.[item] = query[item];
					}
				}
				//获取列表
				this.getList();
			},
		},
		methods:{
			//图片放大
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
			},
			//排序
			sortChange(column){
				this.sort = column.prop;
				this.sort_type = column.order == 'ascending'?'0':'1';
				this.getList();
			},
			//修改实际下架日期
			changeTime(e,ksbm){
				let req = {
					ks:ksbm,
					xjrq:!e?'':e
				}
				resource.setXjrq(req).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			// 上传文件
			uploadFn(){
				if (this.$refs.fileUpload.files.length > 0) {
					var file = this.$refs.fileUpload.files[0];
					this.filename = file.name;
					this.file = file;
				}
			},
			//删除文件
			deleteFile(){
				this.filename = '';
				this.file = null;
			},
			//导出
			exportFile(){
				this.req.flag = this.all_search == true?1:0;
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.replenishExport(this.req).then(res => {
						exportPost("\ufeff" + res.data,'补货管理');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//按条件查询
			searchFun(req){
				this.page = 1;
				this.all_search = false;
				this.req = req;
				//获取列表
				this.getList();
			},
			//批量查询
			allSearch(){
				if(!this.file){
					this.$message.warning('请先上传文件');
					return;
				}
				this.page = 1;
				this.all_search = true;
				this.req = {
					file:this.file
				}
				//获取列表
				this.getList();
			},
			//获取列表
			getList(){		
				this.req.flag = this.all_search == true?1:0;
				this.req.pagesize = this.pagesize;
				this.req.page = this.page;
				this.req.sort = this.sort;
				this.req.sort_type = this.sort_type;
				resource.replenishList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						this.row_ids = this.dataObj.selected_ids;
						this.button_list = this.dataObj.button_list;
						this.showSearch = false;
						this.show_custom = false;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//设置自定义列
			setColumns(){
				resource.setColumns({menu_id:'19',row_ids:this.row_ids.join(',')}).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//设置
			setKs(type,title,ksbm){
				var req = {};
				if(!ksbm){
					let allSet = JSON.parse(JSON.stringify(this.req));
					allSet.flag = this.all_search?'3':'1';
					allSet.from = '2';
					req = allSet;
				}else{
					req.ks = ksbm;
					req.flag = '2';
				}
				//1:试；3:停；4:清
				this.$prompt('请输入原因', `货品性质确定转为${title}么？想好哦！`, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({ value }) => {
					if(!value){
						this.$message.warning('请输入原因');
						return;
					}
					req.remark = value;
					if(type == '1'){
						resource.replenishTry(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList(this.all_search == true?'3':'');
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '3'){
						resource.replenishStop(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList(this.all_search == true?'3':'');
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(type == '4'){
						resource.replenishClear(req).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.select_ids = [];
								//获取列表
								this.getList(this.all_search == true?'3':'');
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});       
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
			//自定义列表
			customFun(){
				this.show_custom = true;
				this.row_ids = this.dataObj.selected_ids;
			},
			//恢复默认
			Restore(){
				this.row_ids = [];
				this.dataObj.view_row.map(item => {
					this.row_ids.push(item.row_id)
				})
			},
			//修正sku数量
			updateSku(spbm,replenish_num){
				this.num = replenish_num;
				this.spbm = spbm;
				this.innerVisible = true;
			},
			//修正sku数量
			submitSku(){
				if(this.num == ""){
					this.$message.warning('请输入修正数量');
				}else{
					let req = {
						spbm:this.spbm,
						sjxrrq:this.sjxrrq,
						num:this.num,
						remark:this.remark
					}
					resource.modifySkuNum(req).then(res => {
						if(res.data.code == 1){
							this.innerVisible = false;
							this.$message.success(res.data.msg);
							//获取列表
							this.getDetailList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//修正数量
			updateNum(ks,replenish_num,sjxrrq){
				this.sjxrrq = sjxrrq;
				this.ks = ks;
				this.num = replenish_num;
				this.updeteDialog = true;
			},
			//关闭修正数量
			closeDialog(){
				this.innerVisible = false;
				this.updeteDialog = false;
				this.num = "";
				this.remark = "";
			},
			//确认修正
			submitUpdate(){
				if(this.num == ""){
					this.$message.warning('请输入修正数量');
				}else{
					let req = {
						ks:this.ks,
						num:this.num,
						sjxrrq:this.sjxrrq,
						remark:this.remark
					}
					resource.modify(req).then(res => {
						if(res.data.code == 1){
							this.updeteDialog = false;
							this.$message.success(res.data.msg);
							//获取列表
							this.getList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//内部核价
			nuclearPrice(e,v){
				if(e == ''){
					this.$message.warning('请输入价格');
				}else{
					let req = {
						ks:v,
						price:e
					}
					resource.replenishSet(req).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//下钻
			getDetail(ksbm,sjxrrq){
				this.ksbm = ksbm;
				this.sjxrrq = sjxrrq;
				let sort_obj = {
					page:this.detail_page,
					pagesize:this.detail_page_size
				}
				//获取下钻内容
				this.getDetailList(sort_obj);
			},
			//下钻内容排序
			sortDetail(column){
				let sort_obj = {
					page:this.detail_page,
					pagesize:this.detail_page_size,
					sort:column.prop,
					sort_type:column.order == 'ascending'?'0':'1'
				}
				this.getDetailList(sort_obj);
			},
			//获取下钻内容
			getDetailList(sort_obj){
				let req = {...{
					day:this.sjxrrq,
					ks:this.ksbm
				},...sort_obj}
				resource.replenishDetail(req).then(res => {
					if(res.data.code == 1){
						this.detailData = res.data.data;
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭
			closeDetail(){
				this.detail_page_size = 10;
				this.detail_page = 1;
			},
			//分页
			detailSizeChange(val) {
				this.detail_page_size = val;
				//获取列表
				this.getDetailList();
			},
			detailCurrentChange(val) {
				this.detail_page = val;
				//获取列表
				this.getDetailList();
			},
			//取消或保存供应商报价
			closeSup(req){
				if(req.type == '1'){
					resource.addGp({list:req.req_list}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.show_sup = false;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.show_sup = false;
				}
			},
			//档口配齐时间表
			closeMatch(req){
				if(req.type == '1'){
					resource.addMatch({list:req.req_list}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.show_match = false;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.show_match = false;
				}
			},
			isFixed(row_field_name){
				if(row_field_name == 'ksbm' || row_field_name == 'gyshh' || row_field_name == 'xb'){
					return true;
				}
			}
		},
		components:{
			condition,
			SupplierQuotation,
			MatchTime,
			ZngPage
		}
	}
</script>