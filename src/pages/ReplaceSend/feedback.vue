<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="状态：">
				<el-select v-model="status" clearable placeholder="请选择订单状态">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handlePageChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex jse mb-10" v-if="button_list.export == 1">
			<el-button type="primary" plain size="small" @click="commitExport">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<custom-table :show_index="true" :table_data="table_data" :title_list="title_list" :is_setting="true" max_height="860px" :button_list="button_list" @detailFn="detailFn" @handleFn="handleFn"/>
		<page-widget :page="page" :pagesize="pagesize" :total="total" @handleSizeChange="handleSizeChange" @handlePageChange="handlePageChange"/>
		<el-dialog :title="`${dialog_type == '1'?'详情':'处理'}`" :visible.sync="show_dialog" width="45%">
			<el-form size="small">
				<el-form-item label="供应商：">
					{{supplier_name}}
				</el-form-item>
				<el-form-item label="款号：">
					{{ksbm}}
				</el-form-item>
				<el-form-item label="反馈时间：">
					{{add_time}}
				</el-form-item>
				<el-form-item label="反馈人：">
					{{username}}
				</el-form-item>
				<el-form-item label="反馈原因：">
					{{feedback_remark}}
				</el-form-item>
				<el-form-item label="处理结果：" required>
					<el-input
					style="width: 200px"
					type="textarea"
					:disabled="dialog_type == '1'"
					size="small"
					:rows="3"
					placeholder="请输入内容"
					v-model="handle_remark">
				</el-input>
			</el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button size="small" @click="show_dialog = false">关闭</el-button>
			<el-button type="primary" size="small" @click="commitFn" v-if="dialog_type == '2'">提交</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import resource from '../../api/replaceSend.js'

	import CustomTable from '../../components/custom_table.vue'
	import PageWidget from '../../components/pagination_widget.vue' 

	import {exportPost} from '../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return {
				page:1,
				pagesize:10,
				status_list:[{
					id:'1',
					name:'已处理'
				},{
					id:'0',
					name:'未处理'
				}],								//处理状态
				status:'',						//选中的处理状态
				table_data:[],
				title_list:[],
				button_list:{},
				total:0,
				id:"",
				show_dialog:false,
				dialog_type:'1',	//弹窗类型（1:详情；2:处理）
				dialog_title:"",
				supplier_name:"",
				ksbm:"",
				add_time:"",
				username:"",
				feedback_remark:"",
				handle_remark:"",
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				let arg = {
					page:this.page,
					pagesize:this.pagesize
				}
				if(this.status !== ''){
					arg['status'] = this.status;
				}
				resource.ksbmFeedbackList(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.button_list = data.button_list;
						this.title_list = data.title_list;
						this.table_data = data.table_data.data;
						this.table_data.map(item => {
							//详情
							item['detail'] = item.status == 1 && this.button_list.detail == 1;
							//处理
							item['handle'] = item.status == 0 && this.button_list.handle == 1;
						})
						this.total = data.table_data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取详情
			detailFn(id){
				this.id = id;
				this.dialog_type = '1';
				//获取详情
				this.getDetail();
			},
			//点击处理
			handleFn(id){
				this.id = id;
				this.dialog_type = '2';
				//获取详情
				this.getDetail();
			},
			//获取详情
			getDetail(){
				resource.getFeedbackInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.supplier_name = data.supplier_name;
						this.ksbm = data.ksbm;
						this.add_time = data.add_time;
						this.username = data.username;
						this.feedback_remark = data.feedback_remark;
						this.handle_remark = data.handle_remark?data.handle_remark:'';
						this.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交处理
			commitFn(){
				if(this.handle_remark == ''){
					this.$message.warning('请输入处理结果！');
					return;
				}
				let arg = {
					id:this.id,
					remark:this.handle_remark
				}
				resource.handleKsbmFeedback(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.show_dialog = false;
						//获取列表
						this.getList();
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
					let arg = {}
					if(this.status !== ''){
						arg['status'] = this.status;
					}
					resource.ksbmFeedbackExport(arg).then(res => {
						exportPost("\ufeff" + res.data,'分仓反馈');
					})
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getList();
			},
			handlePageChange(val) {
				this.page = val;
				//获取列表
				this.getList();
			},
		},
		components:{
			CustomTable,
			PageWidget
		}
	}
</script>
<style lang="less" scoped>

</style>