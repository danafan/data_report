<template>
	<div>
		<el-button type="primary" plain size='mini' icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
		<div class="form_content">
			<div class="page_title">运营外采信息</div>
			<el-form size="small" class="form_box">
				<el-form-item label="提报日期：">
					2022-07-05 13:34:12
				</el-form-item>
				<el-form-item label="事业部：">
					事业一部
				</el-form-item>
				<el-form-item label="项目部：">
					新兴事业部
				</el-form-item>
				<el-form-item label="店铺：">
					拼多多店铺
				</el-form-item>
				<el-form-item label="店铺链接：">
					www.zhuanqian.com
				</el-form-item>
				<el-form-item label="提报人：">
					刁德一
				</el-form-item>
				<el-form-item label="一级类目：">
					休闲裤
				</el-form-item>
				<el-form-item label="二级类目：">
					休闲短裤
				</el-form-item>
				<el-form-item label="版型、面料、工艺、颜色图片：">
				</el-form-item>
				<div class="img_list">
					<el-image class="img" :src="item" :preview-src-list="srcList" v-for="item in srcList">
					</el-image>
				</div>
				<el-form-item label="版型、面料、工艺、颜色说明：">
				</el-form-item>
				<div class="remark">云想衣裳花想容，春风拂槛露华浓。若非群玉山头见，会向瑶台月下逢。</div>
				<el-form-item label="参看店铺链接：">
					www.chaojizhuanqian.com.
				</el-form-item>
				<el-form-item label="参看店铺产品图片：">
				</el-form-item>
				<div class="img_list">
					<el-image class="img" :src="item" :preview-src-list="srcList" v-for="item in srcList">
					</el-image>
				</div>
				<el-form-item label="参考店铺产品描述：">
				</el-form-item>
				<div class="remark">云想衣裳花想容，春风拂槛露华浓。若非群玉山头见，会向瑶台月下逢。</div>
				<el-form-item label="特殊要求：">
					是：（是否有需要定制下单款（有的话写上要求，没有则写“无”））
				</el-form-item>
				<el-form-item label="销售价格区间：">
					89-169
				</el-form-item>
				<el-form-item label="成本区间：">
					89-169
				</el-form-item>
				<el-form-item label="款式定位：">
					引流款
				</el-form-item>
				<el-form-item label="款式需要数量：">
					28
				</el-form-item>
				<el-form-item label="供应商：">
					小王八蛋
				</el-form-item>
				<el-form-item label="地域要求：">
					河南
				</el-form-item>
				<el-form-item label="供应商合作模式：">
					代销/现接/下单备货
				</el-form-item>
				<el-form-item label="接受最晚达成时间：">
					2022-05-31 15:00
				</el-form-item>
				<el-form-item label="计划上新时间：">
					2022年12月
				</el-form-item>
				<el-form-item label="当前状态：">
					待处理
				</el-form-item>
				<el-divider></el-divider>
				<div class="page_title">供应链回复：</div>
				<el-form-item label="合理性评估：" required>
					<el-select v-model="hlxpg" :popper-append-to-body="false">
						<el-option label="接受" value="1"></el-option>
						<el-option label="不接受" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注：" :required="hlxpg == '0'">
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					:placeholder="hlxpg == '0'?'请输入不接受的原因':'请输入备注（选填）'"
					:rows="7"
					v-model="remark"
					maxlength="100"
					show-word-limit></el-input>
				</el-form-item>
				<el-form-item label="预计达成时间：" required>
					<el-date-picker v-model="yjdcsj" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
					</el-date-picker>
				</el-form-item>
				<div class="button_row">
					<el-button size="small" type="primary" @click="commitFn">提交</el-button>
				</div>
				
			</el-form>
		</div>
	</div>
</template>
<script>
	import resource from '../../../api/auditResource.js'
	export default{
		data(){
			return{
				srcList: [
				'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
				'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
				],					//临时使用的图片列表
				hlxpg:'1',			//选中的合理性评估
				yjdcsj:"",			//预计达成时间
				remark:"",			//备注
			}
		},
		methods:{
			//提交
			commitFn(){
				if(this.hlxpg == '0' && this.hlxpg_remark == ''){
					this.$message.warning('请输入不接受的原因！');
				}else if(!this.yjdcsj){
					this.$message.warning('请选择预计达成时间！');
				}else{
					let arg = {
						hlxpg:this.hlxpg,
						yjdcsj:this.yjdcsj,
						remark:this.remark
					}
					console.log(arg)
				}
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
		max-height: 700px;
		width: 500px;
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