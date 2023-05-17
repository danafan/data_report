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
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="handlePageChange(1)">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="flex ac jse mb-15">
		<el-button type="primary" size="small" @click="addFn" v-if="button_list.add == 1">
			添加
			<i class="el-icon-circle-plus-outline el-icon--right"></i>
		</el-button>
		<el-button type="primary" plain size="small" v-if="button_list.export == 1" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		<import-button ref="importButton" tempUrl="工商违规导入模板.xlsx" @importFn="importFn" v-if="button_list.import == 1"/>
	</div>
	<custom-table v-loading="loading" max_height="9999" :button_list="button_list" :table_data="table_list" :title_list="title_list" :is_setting="true" @editFn="editFn" @deleteFn="deleteFn"/>
	<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
	<!-- 添加或编辑 -->
	<el-dialog :title="`${dialog_type == '1'?'添加':'编辑'}违规店铺`" @close="closeDialog" width="45%" :visible.sync="showDialog">
		<el-form size="small" label-width="100px">
			<el-form-item label="店铺名称：" required>
				<el-input v-model="info.shop_name" style="width: 192px" placeholder="店铺名称"></el-input>
			</el-form-item>
			<el-form-item label="订单编号：" required>
				<el-input v-model="info.order_no" style="width: 192px" placeholder="订单编号"></el-input>
			</el-form-item>
			<el-form-item label="类型：" required>
				<el-select v-model="info.type" clearable placeholder="请选择类型">
					<el-option v-for="item in type_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="内容：" required>
				<el-input type="textarea" style="width: 192px" :rows="3" v-model="info.content" placeholder="请输入内容"></el-input>
			</el-form-item>
			<el-form-item label="投诉单：" required>
				<uploads-file :multiple="false" :current_images="current_images" @callback="uploadCallBack" v-if="showDialog"/>
			</el-form-item>
			<el-form-item label="投诉日期：" required>
				<el-date-picker v-model="info.date" value-format="yyyy-MM-dd" type="date" placeholder="投诉日期">
				</el-date-picker>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary" size="small" @click="showDialog = false">取消</el-button>
			<el-button type="primary" size="small" @click="commitDialog">提交</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import {getNowDate,getCurrentDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../api/nowMonth.js'
	import resource from '../../api/shelvesResource.js'
	import {exportPost} from '../../api/export.js'

	import ImportButton from '../../components/import_button.vue'
	import PageWidget from '../../components/pagination_widget.vue'
	import CustomTable from '../../components/custom_table.vue'
	import UploadsFile from '../../components/uploads_file.vue'

	import { MessageBox,Message } from 'element-ui';
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
				date:[],	//统计日期
				order_no:"",					//订单编号
				shop_list:[],					//店铺列表
				shop_list_ids:[],				//选中的店铺列表
				type_list:[],					//类型列表
				type_list_ids:[],				//选中的类型列表
				page:1,
				pagesize:10,				
				total:0,
				loading:false,
				table_list:[],					//数据列表
				title_list:[],					//头部列表
				button_list:{},					//按钮权限
				dialog_type:'1',				//1:添加；2:编辑
				showDialog:false,
				id:"",							//当前选中的ID
				info:{
					shop_name:"",					
					order_no:"",
					type:"",
					image:"",
					content:"",
					date:""
				},
				current_images:[],				//获取详情的当前图片列表
			}
		},
		created(){
			//获取店铺列表
			this.gsViolationSearch('shop_name');
			//获取违规类型列表
			this.gsViolationSearch('type');
			//获取列表
			this.getData();
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
			//导入
			importFn(file){
				resource.gsViolationImport({file:file}).then(res => {
					this.$refs.importButton.clearValue();
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.page = 1;
						//获取列表
						this.getData();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			commitExport(){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						shop_name:this.shop_list_ids.join(','),
						order_no:this.order_no,
						type:this.type_list_ids.join(','),
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:"",
					}
					resource.gsViolationExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'工商违规记录');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//获取列表
			getData(){
				let arg = {
					shop_name:this.shop_list_ids.join(','),
					order_no:this.order_no,
					type:this.type_list_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.gsViolation(arg).then(res => {
					this.loading = false;
					if(res.data.code == 1){
						let data = res.data.data;
						this.table_list = data.table_data.data;
						this.table_list.map(item => {
							item['pic'] = data.domain + item.pic;
						})
						this.title_list = data.title_list;
						this.total = data.table_data.total;
						this.button_list = data.button_list;
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
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//点击添加
			addFn(){
				this.dialog_type = '1';
				this.showDialog = true;
			},
			//点击编辑
			editFn(id){
				resource.editGsViolationGet({id:id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						for(let k in this.info){
							this.info[k] = data[k];
						}
						this.id = data.id;
						let o = {
							domain:data.domain,
							urls:data.image,
							is_del:false
						}
						this.current_images.push(o);
						this.dialog_type = '2';
						this.showDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击删除
			deleteFn(id){
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delGsViolation({id:id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.getData();
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
			//关闭弹窗
			closeDialog(){
				this.info = {
					shop_name:"",					
					order_no:"",
					type:"",
					image:"",
					content:"",
					date:""
				};
				this.current_images = [];
			},
			//监听图片变化并赋值
			uploadCallBack(v){
				this.info.image = v.length > 0?v[0]:'';
			},
			//弹窗提交
			commitDialog(){
				if(this.info.shop_name == ''){
					this.$message.warning('请输入店铺名称!');
					return;
				}else if(this.info.order_no == ''){
					this.$message.warning('请输入订单编号!');
					return;
				}else if(this.info.type == ''){
					this.$message.warning('请选择类型!');
					return;
				}else if(this.info.content == ''){
					this.$message.warning('请输入内容!');
					return;
				}else if(this.info.image == ''){
					this.$message.warning('请上传投诉单!');
					return;
				}else if(!this.info.date){
					this.$message.warning('请选择投诉日期!');
					return;
				}
				if(this.dialog_type == '1'){	//创建
					resource.addGsViolation(this.info).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.showDialog = false;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{					//编辑
					this.info['id'] = this.id;
					resource.editGsViolationPost(this.info).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.showDialog = false;
							//获取列表
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
				
			}
		},
		components:{
			ImportButton,
			PageWidget,
			CustomTable,
			UploadsFile
		}
	}
</script>
<style lang="less" scoped>

</style>








