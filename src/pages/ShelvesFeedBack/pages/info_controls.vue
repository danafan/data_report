<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="事业部：">
				<el-select v-model="dept_name_ids" clearable :popper-append-to-body="false" placeholder="全部" @change="getStoreList">
					<el-option v-for="item in dept_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="shop_name_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺ID：">
				<el-select v-model="shop_code_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="违规类型：">
				<el-select v-model="violations_type" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in violations_type_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="违规情况：">
				<el-select v-model="violations_impact" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in violations_impact_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="平台处理状态：">
				<el-select v-model="state" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in state_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="status" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="违规时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="shop_name" label="店铺名称" width="120" show-overflow-tooltip align="center" fixed="left"></el-table-column>
			<el-table-column prop="shop" show-overflow-tooltip label="店铺ID"  width="120" align="center"></el-table-column>
			<el-table-column prop="violations_time" show-overflow-tooltip label="违规时间" width="120" align="center"></el-table-column>
			<el-table-column prop="violations_type" label="违规类型" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="violations_why" show-overflow-tooltip width="120" label="违规原因" align="center"></el-table-column>
			<el-table-column prop="violations_impact" show-overflow-tooltip width="120" label="违规影响" align="center"></el-table-column>
			<el-table-column prop="severity" show-overflow-tooltip width="120" label="违规情况" align="center"></el-table-column>
			<el-table-column prop="goods_link" show-overflow-tooltip width="120" label="商品链接" align="center"></el-table-column>
			<el-table-column label="违规截图" width="120" align="center">
				<template slot-scope="scope">
					<img style="width: 30px;height: 30px" :src="scope.row.violations_img" @click="bigImg(scope.row.violations_img)">
				</template>
			</el-table-column>
			<el-table-column label="处理结果" width="120" align="center">
				<template slot-scope="scope">
					<img style="width: 30px;height: 30px" :src="scope.row.result" @click="bigImg(scope.row.result)">
				</template>
			</el-table-column>
			<el-table-column prop="deal" label="是否需要处理" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="status" label="状态" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column prop="note" label="审核备注" show-overflow-tooltip width="120" align="center"></el-table-column>
			<el-table-column label="操作" width="320" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="uploadImg('1')">上传违规截图</el-button>
					<el-button type="text" size="small" @click="uploadImg('2')">上传处理结果</el-button>
					<el-button type="text" size="small">审核</el-button>
					<el-button type="text" size="small">查看</el-button>
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
	<!-- 图片放大 -->
	<el-dialog title="图片" :visible.sync="imageDialog" width="30%" center>
		<img class="big_img" :src="big_img_url">
		<span slot="footer" class="dialog-footer">
			<el-button type="primary" @click="imageDialog = false">关闭</el-button>
		</span>
	</el-dialog>
	<!-- 上传违规截图或处理结果 -->
	<el-dialog title="同意" center @close="closeDialog" width="45%" :visible.sync="imgDialog">
		<el-form size="small">
			<el-form-item label="违规截图：">
				<div class="img_list">
					<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
						<img class="img" :src="item.domain + item.urls">
						<div class="modal" v-if="item.is_del == true">
							<img src="../../../static/deleteImg.png" @click="deteleFile(item.urls,index)">
						</div>
					</div>
					<UploadFile @callbackFn="uploadFile" :current_num="show_img.length" :max_num="1" v-if="show_img.length == 0"/>
				</div>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="agreeDialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitFn('1')">提交</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import auditResource from '../../../api/auditResource.js'
	import resource from '../../../api/resource.js'
	import shelvesResource from '../../../api/shelvesResource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate,getNowDate} from '../../../api/nowMonth.js'
	import UploadFile from '../../../components/upload_file.vue'
	export default{
		data(){
			return{
				dept_list:[{
					id:'442802518',
					name:'事业二部'
				},{
					id:'443780108',
					name:'事业四部'
				}],					//事业部列表
				dept_name_ids:[],	//选中的事业部列表
				store_list:[],		//店铺列表
				shop_name_ids:[],	//选中的店铺名称列表
				shop_code_ids:[],	//选中的店铺ID列表
				violations_type_list:[],	//违规类型列表
				violations_type:"",			//选中的违规类型
				violations_impact_list:[],	//违规情况列表
				violations_impact:"",		//选中的违规情况
				state_list:[],				//平台处理状态列表
				state:"",					//选中的平台处理状态
				status_list:[{
					id:'1',
					name:'待上传'
				},{
					id:'2',
					name:'处理中'
				},{
					id:'3',
					name:'待审核'
				},{
					id:'4',
					name:'已拒绝'
				},{
					id:'5',
					name:'已完成'
				}],							//状态列表
				status:"",					//选中的状态
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
				date:[],		//违规时间
				page:1,
				pagesize:10,
				dataObj:{},
				imageDialog:false,
				big_img_url:"",
				imgDialog:false,			//上传图片弹窗
				show_img:[],			//显示的图片
			}
		},
		created(){
			// 获取店铺
			this.getStoreList();
			//违规类型列表
			this.searchList('violations_type');
			//违规情况列表
			this.searchList('violations_impact');
			//平台处理状态列表
			this.searchList('state');
			//获取列表
			this.getData();
		},
		methods:{
			//放大图片
			bigImg(big_img_url){
				this.imageDialog = true;
				this.big_img_url = big_img_url;
			},
			// 获取店铺
			getStoreList(){
				let arg = {
					dept_id:this.dept_name_ids.length > 0?this.dept_name_ids.join(','):'442802518,443780108'
				}
				resource.ajaxViewStore(arg).then(res => {
					if(res.data.code == 1){
						this.shop_name_ids = [];	//选中的店铺名称列表
						this.shop_code_ids = [];	//选中的店铺ID列表
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取查询条件
			searchList(field){
				let arg = {
					field:field,
					field_value:''
				}
				shelvesResource.searchList(arg).then(res => {
					if(res.data.code == 1){
						if(field == 'violations_type'){
							this.violations_type_list = res.data.data;
						}
						if(field == 'violations_impact'){
							this.violations_impact_list = res.data.data;
						}
						if(field == 'state'){
							this.state_list = res.data.data;
						}
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
			//获取列表
			getData(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize,
					violations_type:this.violations_type,
					violations_impact:this.violations_impact,
					status:this.status,
					state:this.state,
					start_time:this.date && this.date.length > 0?this.date[0]:"",
					end_time:this.date && this.date.length > 0?this.date[1]:"",
					dept_name:this.dept_name_ids.join(','),
					shop_name:this.shop_name_ids.join(','),
					shop_code:this.shop_code_ids.join(',')	
				}
				shelvesResource.violationList(arg).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data.list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击上传图片
			uploadImg(type){
				console.log(type)
			},
			//关闭上传图片弹窗
			closeDialog(){

			},
			//上传照片
			uploadFile(arg){
				arg.file.is_del = false;
				this.show_img.push(arg.file);
			},
			//删除文件
			deteleFile(url,index){
				auditResource.delImage({url:url}).then(res => {
					if(res.data.code == 1){
						this.show_img.splice(index,1);
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
		},
		components:{
			UploadFile
		}
	}
</script>
<style lang="less" scoped>
.big_img{
	width: 100%;
}
.img_list{
	display:flex;
	flex-wrap: wrap;
	.dialog_img{
		margin-right: 10px;
		margin-bottom: 10px;
		position: relative;
		width: 120px;
		height: 120px;
		.img{
			width: 100%;
			height: 100%;
		}
		.modal{
			background: rgba(0,0,0,.6);
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			img{
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				display:block;
				width: 30px;
				height: 30px;
			}
		}
	}
}
</style>















