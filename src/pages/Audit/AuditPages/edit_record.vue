<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="新编码：">
				<el-select v-model="select_ksbm_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入新编码" :remote-method="ajaxKsbm" collapse-tags>
					<el-option v-for="item in ksbm_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态：">
				<el-select v-model="status" :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in status_list" :key="item.id" :label="item.name" :value="item.id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="getList">搜索</el-button>
			</el-form-item>
		</el-form>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column type="index" label="序号" align="center"></el-table-column>
			<el-table-column prop="ksbm" label="新编码" align="center"></el-table-column>
			<el-table-column prop="supplier" label="供应商" align="center"></el-table-column>
			<el-table-column prop="supplier_ksbm" label="供应商款号" align="center"></el-table-column>
			<el-table-column prop="opreater_name" label="提交人" align="center">
			</el-table-column>
			<el-table-column prop="batch_price" label="原批发价" align="center">
			</el-table-column>
			<el-table-column prop="edit_batch_price" label="更新批发价" align="center">
			</el-table-column>
			<el-table-column prop="cb_price" label="原成本价" align="center">
			</el-table-column>
			<el-table-column prop="edit_cb_price" label="更新成本价" align="center">
			</el-table-column>
			<el-table-column prop="add_time" label="提交时间" align="center">
			</el-table-column>
			<el-table-column label="操作" align="center">
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
		<el-dialog :title="dialog_title" center :visible.sync="detailDialog">
			<div class="dialog_content">
				<div class="content_left">
					<div class="content_row is_red" v-if="detailObj.type == 3 || detailObj.type == 4">
						<div class="label" v-if="detailObj.type == 3">下架款</div>
						<div class="label" v-if="detailObj.type == 4">上架款</div>
					</div>
					<div class="content_row">
						<div class="label">供应商：</div>
						<div>{{detailObj.supplier}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 2}" v-if="detailObj.type == '2'">
						<div class="label">更新供应商：</div>
						<div>{{detailObj.edit_supplier}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0' || detailObj.type == '1' || detailObj.type == 3 || detailObj.type == 4">
						<div class="label">供应商款号：</div>
						<div>{{detailObj.supplier_ksbm}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == 4">
						<div class="label">店铺：</div>
						<div>{{detailObj.kjs_shop_name}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == 4">
						<div class="label">平台：</div>
						<div>{{detailObj.platform}}</div>
					</div>
					<div class="content_row" v-if="(detailObj.type == '0' || detailObj.type == '1' || detailObj.type == 3 || detailObj.type == 4) || (detailObj.type == 2 && detailObj.ksbm != '')">
						<div class="label">新编码：</div>
						<div>{{detailObj.ksbm}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == 4">
						<div class="label">是否特批：</div>
						<div>{{detailObj.is_special == 0?'否':'是'}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0' || detailObj.type == '1' || detailObj.type == 4">
						<div class="label">原成本价：</div>
						<div>{{detailObj.cb_price}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 0}" v-if="detailObj.type == '0' || detailObj.type == '1'">
						<div class="label">更新成本价：</div>
						<div>{{detailObj.edit_cb_price}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == 1 || detailObj.type == 4">
						<div class="label">原批发价：</div>
						<div>{{detailObj.batch_price}}</div>
					</div>
					<div class="content_row" :class="{'is_red':detailObj.type == 1}" v-if="detailObj.type == '0' || detailObj.type == '1'">
						<div class="label">更新批发价：</div>
						<div>{{detailObj.edit_batch_price}}</div>
					</div>
				</div>
				<div class="content_right">
					<div class="content_row">
						<div class="label">提交人：</div>
						<div>{{detailObj.opreater_name}}</div>
					</div>
					<div class="content_row">
						<div class="label">提交时间：</div>
						<div>{{detailObj.add_time}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0'">
						<div class="label">开始时间：</div>
						<div>{{detailObj.start_date}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0'">
						<div class="label">结束时间：</div>
						<div>{{detailObj.end_date}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0' || detailObj.type == '3'">
						<div class="label">审核状态：</div>
						<div v-if="detailObj.status == '0'">默认状态</div>
						<div v-if="detailObj.status == '1'">待审批</div>
						<div v-if="detailObj.status == '2'">审批通过</div>
						<div v-if="detailObj.status == '3'">审批拒绝</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0' || detailObj.type == '3'">
						<div class="label">审核时间：</div>
						<div>{{detailObj.approver_time}}</div>
					</div>
					<div class="content_row" v-if="detailObj.type == '0' || detailObj.type == '3'">
						<div class="label">审核人：</div>
						<div>{{detailObj.approver}}</div>
					</div>
				</div>
			</div>
			<div class="content_row" v-if="detailObj.type == '0'">
				<div class="label">文件附图：</div>
				<div class="img_list">
					<el-image class="img" :src="item" v-for="item in big_img_list" :preview-src-list="big_img_list">
					</el-image>
				</div>
			</div>
			<div class="content_row" v-if="detailObj.type != '3' && detailObj.type != '4'">
				<div class="label">下载附件：</div>
				<el-button type="text" size="small" v-if="detailObj.excel_file != ''" @click="downCsv(detailObj.excel_file)">
					{{detailObj.excel_file}}
					<i class="el-icon-download el-icon--right"></i>
				</el-button>
			</div>
			<div class="content_row" v-if="detailObj.type == '0' || detailObj.type == '3'">
				<div class="label">备注：</div>
				<div>{{detailObj.remark}}</div>
			</div>
			<div class="content_row" v-if="detailObj.status == '3' || detailObj.type == '3'">
				<div class="label">拒绝原因：</div>
				<div>{{detailObj.refuse_reason}}</div>
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
	justify-content: space-between;
	color: #333;
	.is_red{
		color: red;
	}
}
.content_row{
	display:flex;
	margin-bottom: 10px;
	.label{
		font-weight: bold;
		width: 90px;
	}
	.img_list{
		width: 400px;
		display:flex;
		flex-wrap: wrap;
		.img{
			margin-right: 10px;
			width: 120px;
			height: 120px;
		}
	}
}
.el-dialog__body{
	color: #ffffff!important;
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
				status:'0',				//选中的状态
				status_list:[{
					id:'0',
					name:'全部'
				},{
					id:'1',
					name:'待审核'
				},{
					id:'2',
					name:'审核通过'
				},{
					id:'3',
					name:'审核拒绝'
				},{
					id:'4',
					name:'批发价'
				},{
					id:'5',
					name:'换挡口'
				},{
					id:'6',
					name:'下架'
				},{
					id:'7',
					name:'上架'
				}],					//状态列表
				dataObj:{},				//返回数据
				detailDialog:false,		//基本信息弹框
				detailObj:{},			//详情列表
				dialog_title:"",		//详情弹窗标题
				big_img_list:[]
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
					ksbm:this.select_ksbm_ids.join(','),
					status:this.status,
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
						if(this.detailObj.type == 0){
							this.dialog_title = '调价信息';
						}else if(this.detailObj.type == 3){
							this.dialog_title = '下架信息';
						}else{
							this.dialog_title = '基本信息';
						}
						this.big_img_list = [];
						this.detailObj.pictures.map(item => {
							let img_url = this.detailObj.domain + item;
							this.big_img_list.push(img_url);
						})
						this.detailDialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//下载表格
			downCsv(csv_url){
				window.open(this.detailObj.domain + csv_url);
			},
		}
	}
</script>










