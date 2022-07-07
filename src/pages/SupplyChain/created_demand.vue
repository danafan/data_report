<template>
	<div>
		<el-button type="primary" plain size='mini' icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
		<div class="form_content">
			<div class="page_title">新建外采需求</div>
			<el-form size="small" class="form_box">
				<el-form-item label="店铺：" required>
					<el-select v-model="store_id" clearable :popper-append-to-body="false" placeholder="全部">
						<el-option v-for="item in store_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="店铺链接：" required>
					<el-input style="width:200px" clearable v-model="store_url" placeholder="店铺链接"></el-input>
				</el-form-item>
				<el-form-item label="一级类目：" required>
					<el-select v-model="level_1_cate" clearable :popper-append-to-body="false" placeholder="全部">
						<el-option v-for="item in store_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="二级类目：" required>
					<el-select v-model="level_2_cate" clearable :popper-append-to-body="false" placeholder="全部">
						<el-option v-for="item in store_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="版型、面料、工艺、颜色图片：" required>
				</el-form-item>
				<div class="img_list">
					<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
						<img class="img" :src="item.domain + item.urls">
						<div class="modal" v-if="item.is_del == true">
							<img src="../../static/deleteImg.png" @click="deteleFile(item.urls,index,'show_img')">
						</div>
					</div>
					<UploadFile :is_max="false" @callbackFn="uploadFile($event,'show_img')"/>
				</div>
				<el-form-item label="版型、面料、工艺、颜色描述：" required>
				</el-form-item>
				<el-input style="width:360px;margin-bottom: 15px" type="textarea"
				placeholder="请输入文字描述"
				:rows="7"
				v-model="bmgy_remark"
				maxlength="100"
				show-word-limit></el-input>
				<el-form-item label="参考店铺链接：">
					<el-input style="width:200px" clearable v-model="ck_store_url" placeholder="参考店铺链接"></el-input>
				</el-form-item>
				<el-form-item label="参考店铺产品图片：">
				</el-form-item>
				<div class="img_list">
					<div class="dialog_img" v-for="(item,index) in ck_store_cp_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
						<img class="img" :src="item.domain + item.urls">
						<div class="modal" v-if="item.is_del == true">
							<img src="../../static/deleteImg.png" @click="deteleFile(item.urls,index,'ck_store_cp_img')">
						</div>
					</div>
					<UploadFile :is_max="false" @callbackFn="uploadFile($event,'ck_store_cp_img')"/>
				</div>
				<el-form-item label="参考店铺产品描述：">
				</el-form-item>
				<el-input style="width:360px;margin-bottom: 15px" type="textarea"
				placeholder="请输入参考店铺产品描述"
				:rows="7"
				v-model="ckdpcp_remark"
				maxlength="100"
				show-word-limit></el-input>
				<el-form-item label="特殊要求：" required>
					<el-select v-model="tsyq" :popper-append-to-body="false">
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-input style="width:360px;margin-bottom: 15px" type="textarea"
				placeholder="请填写是否有需要定制下单款"
				:rows="7"
				v-model="tsyq_remark"
				maxlength="100"
				show-word-limit v-if="tsyq == '1'"></el-input>
				<el-form-item label="销售价格区间：" required>
					<el-input style="width:100px" type="number" v-model="xsjg_start"></el-input>
					~
					<el-input style="width:100px" type="number" v-model="xsjg_end"></el-input>
				</el-form-item>
				<el-form-item label="成本区间：" required>
					<el-input style="width:100px" type="number" v-model="cb_start"></el-input>
					~
					<el-input style="width:100px" type="number" v-model="cb_end"></el-input>
				</el-form-item>
				<el-form-item label="款式定位：">
					<el-select v-model="ksdw" clearable placeholder="全部" :popper-append-to-body="false">
						<el-option label="引流款" value="1"></el-option>
						<el-option label="利润款" value="2"></el-option>
						<el-option label="形象款" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="款式需要数量：" required>
					<el-input style="width:200px" type="number" clearable v-model="ksxysl" placeholder="款式需要数量"></el-input>
				</el-form-item>
				<el-form-item label="供货商：">
					<el-input style="width:200px" clearable v-model="ghs" placeholder="供货商"></el-input>
				</el-form-item>
				<el-form-item label="供货商地域要求：">
					<el-input style="width:200px" clearable v-model="ghsdyyq" placeholder="供货商地域要求"></el-input>
				</el-form-item>
				<el-form-item label="可接受供应商合作模式：">
					<el-select v-model="hzms_ids" clearable :popper-append-to-body="false" multiple collapse-tags placeholder="全部">
						<el-option label="现结" value="1"></el-option>
						<el-option label="代销" value="2"></el-option>
						<el-option label="下单备货" value="3"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="接受最晚达成时间：" required>
					<el-date-picker v-model="zwdcsj" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="计划上新时间：" required>
					<el-date-picker v-model="jhsxsj" type="month" clearable value-format="yyyy-MM" placeholder="选择月">
					</el-date-picker>
				</el-form-item>
			</el-form>

			<el-button size="small" type="primary" @click="save">保存</el-button>
		</div>
	</div>
</template>
<script>
	import resource from '../../api/auditResource.js'
	import UploadFile from '../../components/upload_file.vue'
	export default{
		data(){
			return{
				store_list:[{
					id:'1',
					name:'店铺1'
				}],						//店铺列表
				store_id:"",			//选中的店铺
				store_url:"",			//店铺链接
				level_1_cate:"",		//选中的一级类目
				level_2_cate:"",		//选中的二级类目
				show_img:[],			//版型、面料、工艺、颜色图片
				bmgy_remark:"",			//版型、面料、工艺、颜色描述
				ck_store_url:"",		//参考店铺链接
				ck_store_cp_img:[],		//参考店铺产品图片
				ckdpcp_remark:"",		//参考店铺产品描述
				tsyq:'1',				//是否特殊要求
				tsyq_remark:"",			//特殊要求说明
				xsjg_start:"",
				xsjg_end:"",			//销售价格区间
				cb_start:"",
				cb_end:"",				//成本区间
				ksdw:"",				//选中的款式定位
				ksxysl:"",				//款式需要数量
				ghs:"",					//供货商
				ghsdyyq:"",				//供货商地域要求
				hzms_ids:[],			//选中的可接受供应商合作模式
				zwdcsj:"",				//接受最晚达成时间
				jhsxsj:"",				//计划上新时间
			}
		},
		methods:{
			//上传照片
			uploadFile(arg,img_type){
				arg.file.is_del = false;
				if(img_type == 'show_img'){
					this.show_img.push(arg.file);
				}else{
					this.ck_store_cp_img.push(arg.file);
				}
			},
			//删除图片
			deteleFile(url,index,img_type){
				resource.delImage({url:url}).then(res => {
					if(res.data.code == 1){
						if(img_type == 'show_img'){
							this.show_img.splice(index,1);
						}else{
							this.ck_store_cp_img.splice(index,1);
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//点击保存
			save(){
				// 店铺
				if(this.store_id == ''){
					this.$message.warning('请选择店铺');
					return;
				}
				// 店铺链接
				if(this.store_url == ''){
					this.$message.warning('请填写店铺链接');
					return;
				}
				// 一级类目
				if(this.level_1_cate == ''){
					this.$message.warning('请选择一级类目');
					return;
				}
				// 二级类目
				if(this.level_2_cate == ''){
					this.$message.warning('请选择二级类目');
					return;
				}
				//版型、面料、工艺、颜色图片
				if(this.show_img.length == 0){
					this.$message.warning('请上传版型、面料、工艺、颜色图片');
					return;
				}
				// 版型、面料、工艺、颜色描述
				if(this.bmgy_remark == ''){
					this.$message.warning('版型、面料、工艺、颜色描述');
					return;
				}
				//特殊要求说明
				if(this.tsyq == '1' && this.tsyq_remark == ''){
					this.$message.warning('请输入特殊要求说明');
					return;
				}
				//销售价格
				if(this.xsjg_start == '' || this.xsjg_end == ''){
					this.$message.warning('销售价格区间不能为空');
					return;
				}else if(!this.isPrice.test(this.xsjg_start) || !this.isPrice.test(this.xsjg_end)){
					this.$message.warning('请输入正确的销售价格区间');
					return;
				}else if(parseFloat(this.xsjg_end) < parseFloat(this.xsjg_start)){
					this.$message.warning('销售价格结束金额不能小于起始金额');
					return;
				}
				//成本
				if(this.cb_start == '' || this.cb_end == ''){
					this.$message.warning('成本区间不能为空');
					return;
				}else if(!this.isPrice.test(this.cb_start) || !this.isPrice.test(this.cb_end)){
					this.$message.warning('请输入正确的成本区间');
					return;
				}else if(parseFloat(this.cb_end) < parseFloat(this.cb_start)){
					this.$message.warning('成本结束金额不能小于起始金额');
					return;
				}
				//款式需要数量
				if(!this.isZzs.test(this.ksxysl)){
					this.$message.warning('款式需要数量不能为空且必须是正整数');
					return;
				}
				//接受最晚达成时间
				if(!this.zwdcsj){
					this.$message.warning('请选择最晚达成时间');
					return;
				}
				//计划上新时间
				if(!this.jhsxsj){
					this.$message.warning('请选择计划上新时间');
					return;
				}
			}
		},
		components:{
			UploadFile
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
		text-align: center;
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
	}
}
</style>