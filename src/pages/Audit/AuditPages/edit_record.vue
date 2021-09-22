<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="款式编码：">
				<el-select v-model="select_ksbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column prop="id" label="序号" width="50" align="center" fixed="left"></el-table-column>
			<el-table-column prop="supplier" label="供应商" width="120" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" width="120" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" width="120" align="center"></el-table-column>
			<el-table-column prop="batch_price" label="批发价" width="120" align="center">
			</el-table-column>
			<el-table-column prop="cb_price" label="原成本价" width="120" align="center"></el-table-column>
			<el-table-column prop="edit_price" label="更新成本价" width="120" align="center"></el-table-column>
			<el-table-column label="起始/结束时间" width="210">
				<template slot-scope="scope">
					<div>开始时间：{{scope.row.start_date}}</div>
					<div>结束时间：{{scope.row.end_date}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="opreater_name" label="提交人" width="120" align="center">
			</el-table-column>
			<el-table-column prop="add_time" label="提交时间" width="140" align="center">
			</el-table-column>
			<el-table-column label="审核状态" width="120" align="center">
				<template slot-scope="scope">
					<div v-if="scope.row.status == '0'">默认状态</div>
					<div v-if="scope.row.status == '1'">待审批</div>
					<div v-if="scope.row.status == '2'">审批拒绝</div>
					<div v-if="scope.row.status == '3'">审批通过</div>
				</template>
			</el-table-column>
			<el-table-column prop="approver_time" label="审核时间" width="140" align="center">
			</el-table-column>
			<el-table-column prop="approver" label="审核人" width="120" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="getDetail(scope.row.id)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 详情弹框 -->
		<el-dialog title="基本信息" center :visible.sync="detailDialog">
			<div class="dialog_content">
				<div class="content_left">
					<div class="content_row">
						<div class="label">原供应商：</div>
						<div>{{detailObj.supplier}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 2}">
						<div class="label">更新供应商：</div>
						<div>{{detailObj.edit_supplier}}</div>
					</div>
					<div class="content_row">
						<div class="label">供应商款号：</div>
						<div>{{detailObj.supplier_ksbm}}</div>
					</div>
					<div class="content_row">
						<div class="label">新编码：</div>
						<div>{{detailObj.ksbm}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 1}">
						<div class="label">批发价：</div>
						<div>{{detailObj.batch_price}}</div>
					</div>
					<div class="content_row">
						<div class="label">原成本价：</div>
						<div>{{detailObj.cb_price}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 0}">
						<div class="label">更新成本价：</div>
						<div>{{detailObj.edit_price}}</div>
					</div>
					<div class="content_row">
						<div class="label">文件附图：</div>
						<div class="img_list">
							<img class="img" :src="item" v-for="item in detailObj.pictures">
						</div>
					</div>
					<div class="content_row">
						<div class="label">备注：</div>
						<div>{{detailObj.remark}}</div>
					</div>
					<div class="content_row">
						<div class="label">拒绝原因：</div>
						<div>{{detailObj.refuse_reason}}</div>
					</div>
				</div>
				<div class="content_right">
					<div class="content_row">
						<div class="label">开始时间：</div>
						<div>{{detailObj.start_date}}</div>
					</div>
					<div class="content_row">
						<div class="label">结束时间：</div>
						<div>{{detailObj.end_date}}</div>
					</div>
					<div class="content_row">
						<div class="label">提交人：</div>
						<div>{{detailObj.opreater_name}}</div>
					</div>
					<div class="content_row">
						<div class="label">提交时间：</div>
						<div>{{detailObj.add_time}}</div>
					</div>
					<div class="content_row">
						<div class="label">审核状态：</div>
						<div v-if="detailObj.status == '0'">默认状态</div>
						<div v-if="detailObj.status == '1'">待审批</div>
						<div v-if="detailObj.status == '2'">审批拒绝</div>
						<div v-if="detailObj.status == '3'">审批通过</div>
					</div>
					<div class="content_row">
						<div class="label">审核时间：</div>
						<div>{{detailObj.approver_time}}</div>
					</div>
					<div class="content_row">
						<div class="label">审核人：</div>
						<div>{{detailObj.approver}}</div>
					</div>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="detailDialog = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<style lang="less" scoped>
.dialog_content{
	display: flex;
	justify-content: space-around;
	color: #333;
	.content_row{
		display:flex;
		margin-bottom: 10px;
		.label{
			font-weight: bold;
		}
		.img_list{
			width: 300px;
			display:flex;
			flex-wrap: wrap;
			.img{
				margin-right: 10px;
				width: 120px;
				height: 120px;
			}
		}
	}
	.is_red{
		color: red;
	}
}
</style>
<script>
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				ksbm_list:[],			//所有款式编码
				select_ksbm_ids:[],		//选中的款式编码
				dataObj:{},				//返回数据
				detailDialog:false,		//基本信息弹框
				detailObj:{},			//详情列表
			}
		},
		created(){
			//获取列表
			this.getData();
		},
		methods:{
			//款式编码列表
			ajaxKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e}).then(res => {
						if(res.data.code == 1){
							this.ksbm_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
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
					ksbm:this.select_ksbm_ids.join('_'),
					page:this.page,
					pagesize:this.pagesize
				}
				resource.auditLogs(arg).then(res => {
					if(res.data.code == 1){
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
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//获取详情
			getDetail(id){
				resource.logDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.detailObj = res.data.data;
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
		}
	}
</script>










