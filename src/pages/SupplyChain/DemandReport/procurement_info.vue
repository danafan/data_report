<template>
	<div>
		<el-button type="primary" plain size='mini' icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
		<div class="form_content">
			<div class="page_title">运营外采信息</div>
			<div class="form_box">
				<el-form size="small">
					<el-form-item label="提报日期：">
						{{detail_info.create_time}}
					</el-form-item>
					<el-form-item label="事业部：">
						{{detail_info.dept_name}}
					</el-form-item>
					<el-form-item label="项目部：">
						{{detail_info.dept_2}}
					</el-form-item>
					<el-form-item label="店铺：">
						{{detail_info.shop_name}}
					</el-form-item>
					<el-form-item label="店铺链接：">
						{{detail_info.shop_link}}
					</el-form-item>
					<el-form-item label="提报人：">
						{{detail_info.create_name}}
					</el-form-item>
					<el-form-item label="一级类目：">
						{{detail_info.cate_1}}
					</el-form-item>
					<el-form-item label="二级类目：">
						{{detail_info.cate_2}}
					</el-form-item>
					<el-form-item label="版型、面料、工艺、颜色图片：">
					</el-form-item>
					<div class="img_list">
						<el-image class="img" :src="item" :preview-src-list="detail_info.version_image" v-for="item in detail_info.version_image">
						</el-image>
					</div>
					<el-form-item label="版型、面料、工艺、颜色说明：">
					</el-form-item>
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					placeholder="请填写是否有需要定制下单款"
					disabled
					:rows="7"
					v-model="detail_info.version_describe"
					maxlength="100"
					show-word-limit></el-input>
					<el-form-item label="参考店铺链接：">
						{{detail_info.without_link}}
					</el-form-item>
					<el-form-item label="参考店铺产品图片：">
					</el-form-item>
					<div class="img_list">
						<el-image class="img" :src="item" :preview-src-list="detail_info.without_image" v-for="item in detail_info.without_image">
						</el-image>
					</div>
					<el-form-item label="参考店铺产品描述：">
					</el-form-item>
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					placeholder="参考店铺产品描述"
					disabled
					:rows="7"
					v-model="detail_info.without_describe"
					maxlength="100"
					show-word-limit></el-input>
					<el-form-item label="特殊要求：">
						<div class="remark">
							{{detail_info.is_special == '1'?'是':'否'}}
						</div>
					</el-form-item>
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					placeholder="参考店铺产品描述"
					disabled
					:rows="7"
					v-model="'特殊要求说明：' + detail_info.special_content"
					maxlength="100"
					show-word-limit v-if="detail_info.is_special == '1'"></el-input>
					<el-form-item label="销售价格区间：">
						{{detail_info.sale_min_price}}-{{detail_info.sale_max_price}}
					</el-form-item>
					<el-form-item label="成本区间：">
						{{detail_info.min_price}}-{{detail_info.max_price}}
					</el-form-item>
					<el-form-item label="款式定位：">
						<div v-if="detail_info.style == '1'">引流款</div>
						<div v-if="detail_info.style == '2'">利润款</div>
						<div v-if="detail_info.style == '3'">形象款</div>
					</el-form-item>
					<el-form-item label="款式需要数量：">
						{{detail_info.style_num}}
					</el-form-item>
					<el-form-item label="供应商：">
						{{detail_info.gys}}
					</el-form-item>
					<el-form-item label="地域要求：">
						{{detail_info.gys_area}}
					</el-form-item>
					<el-form-item label="供应商合作模式：">
						{{detail_info.gys_model_str}}
					</el-form-item>
					<el-form-item label="接受最晚达成时间：">
						{{detail_info.done_time}}
					</el-form-item>
					<el-form-item label="计划上新时间：">
						{{detail_info.put_time}}
					</el-form-item>
					<el-form-item label="当前状态：">
						<div v-if="detail_info.is_accept == '0'">待处理</div>
						<div v-if="detail_info.is_accept == '1'">接受</div>
						<div v-if="detail_info.is_accept == '2'">不接受</div>
					</el-form-item>
					<el-form-item label="备注：">
						<el-input style="width:360px;margin-bottom: 15px" type="textarea"
						:rows="7"
						v-model="detail_info.operation_remark"
						disabled
						maxlength="100"
						show-word-limit></el-input>
					</el-form-item>
					<!-- 处理 -->
					<div v-if="detail_info.is_accept != '0' || (detail_info.is_accept == '0' && type == '2')">
						<el-divider></el-divider>
						<div class="page_title">供应链回复：</div>
						<el-form-item label="合理性评估：" required>
							<el-select v-model="hlxpg" :popper-append-to-body="false" :disabled="detail_info.is_accept != '0'">
								<el-option label="接受" :value="1"></el-option>
								<el-option label="不接受" :value="2"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注：" :required="hlxpg == '2'">
							<el-input style="width:360px;margin-bottom: 15px" type="textarea"
							:placeholder="hlxpg == '2'?'请输入不接受的原因':'请输入备注（选填）'"
							:rows="7"
							v-model="remark"
							:disabled="detail_info.is_accept != '0'"
							maxlength="100"
							show-word-limit></el-input>
						</el-form-item>
						<el-form-item label="预计达成时间：" required v-if="hlxpg == 1">
							<el-date-picker v-model="yjdcsj" type="date" clearable :disabled="detail_info.is_accept != '0'" value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="处理人：" v-if="detail_info.is_accept != '0'">
							{{detail_info.done_name}}
						</el-form-item>
						<div class="button_row" v-if="type == '2'">
							<el-button size="small" type="primary" @click="commitFn">提交</el-button>
						</div>
					</div>
					<!-- 延期解决 -->
					<div v-if="detail_info.delay_date">
						<el-divider></el-divider>
						<div class="page_title">延期解决：</div>
						<el-form-item label="延期解决时间：">
							{{detail_info.delay_date}}
						</el-form-item>
						<el-form-item label="延期备注：">
							{{detail_info.delay_remark}}
						</el-form-item>
						<el-form-item label="延期记录：">
							<el-button type="text" size="small" @click="yqlb_dialog = true">点击查看</el-button>
						</el-form-item>
						<el-form-item label="延期操作人：">
							{{detail_info.done_name}}
						</el-form-item>
					</div>
					<!-- 转接负责人 -->
					<div v-if="detail_info.turn_name">
						<el-divider></el-divider>
						<div class="page_title">转接负责人：</div>
						<el-form-item label="负责人：">
							余宝玉
						</el-form-item>
						<el-form-item label="转接人：">
							{{detail_info.turn_name}}
						</el-form-item>
						<el-form-item label="转接备注：">
							{{detail_info.turn_remark}}
						</el-form-item>
					</div>
					<!-- 确认状态 -->
					<div v-if="detail_info.confirm_image">
						<el-divider></el-divider>
						<div class="page_title">确认状态：</div>
						<el-form-item label="是否完成：">
							已完成
						</el-form-item>
						<el-form-item label="确认凭证：">
							<div class="img_list">
								<el-image class="img" :src="item" :preview-src-list="detail_info.confirm_image" v-for="item in detail_info.confirm_image">
								</el-image>
							</div>
						</el-form-item>
					</div>
					<!-- 负责人回复 -->
					<div v-if="type == '3' || detail_info.is_accept == 6">
						<el-divider></el-divider>
						<div class="page_title">负责人回复：</div>
						<el-form-item label="负责人回复：" required>
							<el-input style="width:360px;margin-bottom: 15px" type="textarea"
							placeholder="请输入负责人回复"
							:rows="5"
							v-model="turn_reply"
							:disabled="is_empty != ''"
							maxlength="100"
							show-word-limit></el-input>
						</el-form-item>
						<div class="button_row">
							<el-button size="small" type="primary" @click="replyFn">提交</el-button>
						</div>
					</div>
				</el-form>
			</div>
		</div>
		<!-- 延期列表 -->
		<el-dialog title="延期列表" width="60%" center :close-on-click-modal="false" :visible.sync="yqlb_dialog">
			<el-table size="small" :data="detail_info.delay_list" tooltip-effect="dark" style="width: 100%" max-height="630px" :header-cell-style="{'background':'#f4f4f4'}">
				<el-table-column label="更改次数" align="center">
					<template slot-scope="scope">
						<div>第 {{scope.$index + 1}} 次</div>
					</template>
				</el-table-column>
				<el-table-column prop="old_date" label="原预计达成时间" align="center">
				</el-table-column>
				<el-table-column prop="delay_date" label="延期后预计达成时间" align="center">
				</el-table-column>
				<el-table-column prop="delay_name" label="延期人" align="center">
				</el-table-column>
				<el-table-column prop="create_time" label="延期时间" align="center">
				</el-table-column>
				<el-table-column prop="delay_remark" label="延期备注" align="center" width="100" show-overflow-tooltip>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="yqlb_dialog = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import demandResource from '../../../api/demandResource.js'
	export default{
		data(){
			return{
				id:"",		
				type:"1",			//1:详情；2:处理；3:回复
				detail_info:{
					gys_model:''
				},		//详情数据
				hlxpg:1,			//选中的合理性评估
				yjdcsj:"",			//预计达成时间
				remark:"",			//备注
				yqlb_dialog:false,	//延期列表
				turn_reply:"",		//负责人回复内容
				is_empty:'',			//负责人回复内容返回是否是空
			}
		},
		created(){
			this.id = this.$route.query.id;	
			this.type = this.$route.query.type;
			//获取详情
			this.supplyChainInfo();
		},
		methods:{
			//获取详情
			supplyChainInfo(){
				demandResource.supplyChainInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						this.detail_info = res.data.data;
						if(this.type == '1'){
							this.yjdcsj = this.detail_info.arrival_time;
							this.hlxpg = this.yjdcsj?1:2;
							this.remark = this.detail_info.remark;
							this.turn_reply = this.detail_info.turn_reply?this.detail_info.turn_reply:'已知晓';
							this.is_empty = this.detail_info.turn_reply;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//提交
			commitFn(){
				if(this.hlxpg == '2' && this.remark == ''){
					this.$message.warning('请输入不接受的原因！');
				}else if(this.hlxpg == '1' && !this.yjdcsj){
					this.$message.warning('请选择预计达成时间！');
				}else{
					let arg = {
						id:this.id,
						is_accept:this.hlxpg,
						arrival_time:this.yjdcsj,
						remark:this.remark
					}
					demandResource.supplyChainAudit(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.$router.go(-1);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//提交回复
			replyFn(){
				if(this.turn_reply == ''){
					this.$message.warning('请输入回复内容！');
					return;
				}
				let arg = {
					id:this.detail_info.id,
					turn_reply:this.turn_reply
				}
				demandResource.turnReply(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.$router.go(-1);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			
		}
	}
</script>
<style lang="less" scoped>
.form_content{
	display: flex;
	flex-direction: column;
	align-items: center;
	.page_title{
		margin-top: 10px;
		margin-bottom: 15px;
		font-size: 18px;
		font-weight: bold;
		color: #333333;
	}
	.form_box{
		display: flex;
		justify-content: center;
		height: 720px;
		width: 100%;
		overflow-y: scroll;
		.img_list{
			margin-bottom: 10px;
			display:flex;
			flex-wrap: wrap;
			.img{
				margin-right: 10px;
				margin-bottom: 10px;
				width: 120px;
				height: 120px;
			}
		}
		.remark{
			width: 500px;
			word-wrap:break-word;
			margin-bottom: 10px;
			font-size: 14px;
			color:#333333;
		}
		.button_row{
			display: flex;
			justify-content: center;
		}
	}
}
</style>