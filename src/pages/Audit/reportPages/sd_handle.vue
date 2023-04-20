<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="转交处理状态：">
				<el-select v-model="handle_status" clearable placeholder="转交处理状态">
					<el-option label="待处理" :value="1"></el-option>
					<el-option label="待审核" :value="2"></el-option>
					<el-option label="已审核" :value="3"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="追回状态：">
				<el-select v-model="arg_recover_status" clearable placeholder="追回状态">
					<el-option label="已追回" :value="1"></el-option>
					<el-option label="未追回" :value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="handleCurrentChange(1)">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
			<el-table-column prop="fhrq" label="日期" width="100" align="center"></el-table-column>
			<el-table-column prop="xsddh" label="线上订单号" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="ysxsddh" label="原始线上订单号" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="nbddh" label="内部订单号" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="shop_name" label="店铺名称" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="shop_code" label="店铺ID" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="xsje" label="付款金额" width="100" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="note" label="便笺" width="80" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="is_after_sale" label="是否售后" width="80" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="is_weight" label="是否称重" width="80" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="remarks" label="线下备注" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="is_warehousing" label="是否进仓" show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="ykbdh" label="易快报单号" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="apply_user_name" label="申请人" width="100" show-overflow-tooltip align="center"></el-table-column>
			<el-table-column label="转交处理状态" width="100" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.is_weight == '是'">{{scope.row.handle_status | handleStatus}}</div>
				</template>
			</el-table-column>
			<el-table-column label="追回状态" width="100" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.recover_status | recoverStatus}}</div>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="160" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.is_weight == '是'">
						<el-button type="text" size="small" v-if="scope.row.handle_status == 1" @click="getDetail(scope.row.id)">处理</el-button>
						<el-button type="text" size="small" v-if="scope.row.handle_status == 2 || scope.row.handle_status == 3" @click="getDetail(scope.row.id)">查看</el-button>
					</div>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 转交结果查看和处理 -->
		<el-dialog :title="info.handle_status == 1?'待处理':info.handle_status == 2?'待审核':'已审核'" :visible.sync="handleDialog" @close="closeDialog" width="45%">
			<div>
				<el-form size="mini">
					<el-form-item label="线上订单号：">
						<div>{{info.xsddh}}</div>
					</el-form-item>
					<el-form-item label="转交时间：">
						<div>{{info.add_time}}</div>
					</el-form-item>
					<el-form-item label="委托人：">
						<div>{{info.add_user_name}}</div>
					</el-form-item>
					<el-divider></el-divider>
					<!-- 拒绝列表 -->
				<div v-for="item in refund_list">
					<el-form-item label="凭证：">
						<uploads-file :onlyView="true" :current_images="item.current_images"/>
					</el-form-item>
					<el-form-item label="处理结果：">
						<div>{{item.handle_remark}}</div>
					</el-form-item>
					<el-form-item label="处理时间：">
						<div>{{item.handle_time}}</div>
					</el-form-item>
					<el-form-item label="处理人：">
						<div>{{item.handle_user_name}}</div>
					</el-form-item>
					<el-form-item label="拒绝状态：">
						<div>已拒绝</div>
					</el-form-item>
					<el-form-item label="拒绝原因：">
						<div>{{item.refund_reason}}</div>
					</el-form-item>
					<el-form-item label="审核人：">
						<div>{{item.audit_user_name}}</div>
					</el-form-item>
					<el-form-item label="审核时间：">
						<div>{{item.audit_time}}</div>
					</el-form-item>
					<el-divider></el-divider>
				</div>
					<div v-if="info.handle_status == 1">
						<div class="f12 red_color mb-10">提示：请将您的处理情况进行上传反馈</div>
						<el-form-item label="上传凭证(最多9张)：" required>
							<uploads-file :max_num="9" :current_images="current_images" @callback="uploadCallBack"/>
						</el-form-item>
						<el-form-item label="处理结果：">
							<el-input
							style="width: 200px"
							type="textarea"
							:autosize="{ minRows: 2, maxRows: 5}"
							placeholder="最多150字"
							maxlength="150"
							show-word-limit
							v-model="remark">
						</el-input>
					</el-form-item>
					<el-form-item label="追回状态：">
						<el-radio-group v-model="recover_status">
							<el-radio :label="1">已追回</el-radio>
							<el-radio :label="2">未追回</el-radio>
						</el-radio-group>
					</el-form-item>
				</div>
				<div v-if="info.handle_status == 2 || info.handle_status == 3">
					<el-form-item label="凭证：">
						<uploads-file :onlyView="true" :current_images="current_images"/>
					</el-form-item>
					<el-form-item label="处理结果：">
						<div>{{info.handle_remark}}</div>
					</el-form-item>
					<el-form-item label="处理时间：">
						<div>{{info.handle_time}}</div>
					</el-form-item>
					<el-form-item label="处理人：">
						<div>{{info.handle_user_name}}</div>
					</el-form-item>
					<el-form-item label="追回状态：">
						<div>{{info.recover_status == 1?'已追回':'未追回'}}</div>
					</el-form-item>
				</div>
				<div v-if="info.handle_status == 3">
					<el-divider></el-divider>
					<el-form-item label="审核人：" v-if="info.handle_status == 3">
						<div>{{info.audit_user_name}}</div>
					</el-form-item>
					<el-form-item label="审核时间：" v-if="info.handle_status == 3">
						<div>{{info.audit_time}}</div>
					</el-form-item>
				</div>
			</el-form>
		</div>
		<div slot="footer" class="dialog-footer" v-if="info.handle_status == 1">
			<el-button size="small" type="primary" @click="handleCommit">提交</el-button>
		</div>
	</el-dialog>
</div>
</template>
<script>
	import resource from '../../../api/auditResource.js'
	import UploadsFile from '../../../components/uploads_file.vue'
	export default{
		data(){
			return{
				handle_status:"",							//处理状态
				arg_recover_status:"",							//追回状态
				page:1,
				pagesize:10,
				dataObj:{},									//列表数据
				loading:false,
				id:"",
				info:{},								//详情数据
				refund_list:[],							//拒绝记录
				handleDialog:false,
				current_images:[],						//当前图片列表
				remark:"",								//处理结果
				recover_status:1,						//追回状态
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//监听图片变化并赋值
			uploadCallBack(v){
				this.current_images = v;
			},
			//获取列表
			getList(){
				let arg = {
					handle_status:this.handle_status,						
					recover_status:this.arg_recover_status,	
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.ytHandleList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
			//点击查看获取详情
			getDetail(id){
				this.id = id;
				let arg = {
					id:id,
					type:'2'
				}
				resource.ytHandleDetail(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.info = data.info;
						this.current_images = [];
						if(this.info.images != ''){
							let dd = this.info.images.split(',');
							dd.map(item => {
								let o = {
									domain:data.domain,
									urls:item
								}
								this.current_images.push(o)
							})
						}
						
						this.refund_list = data.refund_list;
						this.refund_list.map(item => {
							let n_current_images = [];
							if(item.images != ''){
								let cc = item.images.split(',');
								cc.map(i => {
									let g = {
										domain:data.domain,
										urls:i
									}
									n_current_images.push(g)
								})
							}
							item['current_images'] = n_current_images
						})
						this.handleDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交
			handleCommit(){
				if(this.current_images.length == 0){
					this.$message.warning('至少上传一个凭证！');
					return;
				}
				let arg = {
					id:this.id,
					recover_status:this.recover_status,
					remark:this.remark,
					image:this.current_images.join(',')
				}
				resource.ytHandle(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.handleDialog = false;
						//获取列表
						this.getList();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭弹窗
			closeDialog(){
				this.info = {};								//详情数据
				this.refund_list = [];							//拒绝记录
				this.handleDialog = false;
				this.current_images = [];						//当前图片列表
				this.remark = "";								//处理结果
				this.recover_status = 1;						//追回状态
			}
		},
		filters:{
			//转交处理状态
			handleStatus:function(v){
				switch(v){
					case 0:
					return '待转交';
					case 1:
					return '待处理';
					case 2:
					return '待审核';
					case 3:
					return '已审核';
					default:
					return;
				}
			},
			//追回状态
			recoverStatus:function(v){
				switch(v){
					case 1:
					return '已追回';
					case 2:
					return '未追回';
					default:
					return;
				}
			},
		},
		components:{
			UploadsFile
		}
	}
</script>
<style lang="less" scoped>

</style>