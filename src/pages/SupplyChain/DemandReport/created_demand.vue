<template>
	<div>
		<el-button type="primary" plain size='mini' icon="el-icon-arrow-left" @click="$router.go(-1)">返回</el-button>
		<div class="form_content">
			<div class="page_title">{{this.id?'编辑':'新建'}}外采需求</div>
			<div class="form_box">
				<el-form size="small">
					<el-form-item label="店铺：" required>
						<el-select v-model="store_code" clearable filterable :popper-append-to-body="false" placeholder="全部">
							<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="店铺链接：" required>
						<el-input style="width:200px" clearable v-model="store_url" placeholder="店铺链接"></el-input>
					</el-form-item>
					<el-form-item label="一级类目：" required>
						<el-select v-model="level_1_cate" :popper-append-to-body="false" placeholder="全部" @change="checkCate">
							<el-option v-for="item in cate_1_list" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="二级类目：" required>
						<el-select v-model="level_2_cate" :popper-append-to-body="false" placeholder="全部">
							<el-option v-for="item in cate_2_list" :key="item" :label="item" :value="item">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="版型、面料、工艺、颜色图片：" required>
					</el-form-item>
					<div class="img_list">
						<div class="dialog_img" v-for="(item,index) in show_img" @mouseenter="item.is_del = true" @mouseleave="item.is_del = false">
							<img class="img" :src="item.domain + item.urls">
							<div class="modal" v-if="item.is_del == true">
								<img src="../../../static/deleteImg.png" @click="deteleFile(item.urls,index,'show_img')">
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
								<img src="../../../static/deleteImg.png" @click="deteleFile(item.urls,index,'ck_store_cp_img')">
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
							<el-option label="是" :value="1"></el-option>
							<el-option label="否" :value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					placeholder="请填写是否有需要定制下单款"
					:rows="7"
					v-model="tsyq_remark"
					maxlength="100"
					show-word-limit v-if="tsyq == 1"></el-input>
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
							<el-option label="引流款" :value="1"></el-option>
							<el-option label="利润款" :value="2"></el-option>
							<el-option label="形象款" :value="3"></el-option>
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
						<el-select v-model="hzms_ids" clearable :popper-append-to-body="false" multiple placeholder="全部">
							<el-option label="现结" value="1"></el-option>
							<el-option label="代销" value="2"></el-option>
							<el-option label="下单备货" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="接受最晚达成时间：" required>
						<el-date-picker v-model="zwdcsj" style="width:200px" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="计划上新时间：" required>
						<el-date-picker v-model="jhsxsj" type="month" clearable value-format="yyyy-MM" placeholder="选择月">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="备注：">
					</el-form-item>
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					placeholder="请输入备注"
					:rows="7"
					v-model="operation_remark"
					maxlength="100"
					show-word-limit></el-input>
				</el-form>
			</div>
			<el-button size="small" type="primary" @click="save">提交</el-button>
		</div>
	</div>
</template>
<script>
	import demandResource from '../../../api/demandResource.js'
	import resource from '../../../api/resource.js'
	import auditResource from '../../../api/auditResource.js'
	import UploadFile from '../../../components/upload_file.vue'
	export default{
		data(){
			return{
				id:"",					//页面ID
				store_list:[],			//店铺列表
				store_code:"",			//选中的店铺
				store_url:"",			//店铺链接
				level_1_cate:"",		//选中的一级类目
				cate_1_list:[],			//一级类目列表
				level_2_cate:"",		//选中的二级类目
				cate_2_list:[],			//二级类目列表
				show_img:[],			//版型、面料、工艺、颜色图片
				bmgy_remark:"",			//版型、面料、工艺、颜色描述
				ck_store_url:"",		//参考店铺链接
				ck_store_cp_img:[],		//参考店铺产品图片
				ckdpcp_remark:"",		//参考店铺产品描述
				tsyq:1,					//是否特殊要求
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
				operation_remark:"",	//备注
			}
		},
		created(){
			this.id = this.$route.query.id;
			//初始化同步方法
			this.initFn();
		},
		methods:{
			//初始化方法
			async initFn(){
				//获取店铺列表
				await this.getStoreList();
				//获取一级类目列表
				await this.supplyChainCate({level:'1'});
				if(this.id){
					//获取二级类目列表
					await this.supplyChainCate({level:'2'});
					//获取详情
					await this.supplyChainInfo();
				}
			},
			//获取店铺列表
			getStoreList(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换一级类目
			checkCate(){
				this.level_2_cate = "";
				//获取二级类目列表
				this.supplyChainCate({level:'2',cate_1:this.level_1_cate});
			},
			//获取类目列表
			supplyChainCate(arg){
				demandResource.supplyChainCate(arg).then(res => {
					if(res.data.code == 1){
						if(arg.level == '1'){
							this.cate_1_list = res.data.data;
						}else{
							this.cate_2_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取详情
			supplyChainInfo(){
				demandResource.supplyChainInfo({id:this.id}).then(res => {
					if(res.data.code == 1){
						let info = res.data.data;
						this.store_code = info.shop_code;
						this.store_url = info.shop_link;
						this.level_1_cate = info.cate_1;
						this.level_2_cate = info.cate_2;
						//版型、面料、工艺、颜色图片
						info.version_image.map(item => {
							let img_obj = {
								is_del:false
							}
							img_obj.domain = item.split('com/')[0] + 'com/';
							img_obj.urls = item.split('com/')[1];
							this.show_img.push(img_obj);
						})
						this.bmgy_remark = info.version_describe;
						this.tsyq = info.is_special;
						this.tsyq_remark = !info.special_content?'':info.special_content;
						this.xsjg_start = info.sale_min_price;
						this.xsjg_end = info.sale_max_price;
						this.cb_start = info.min_price;
						this.cb_end = info.max_price;
						this.ksdw = info.style;
						this.ksxysl = info.style_num;
						this.zwdcsj = info.done_time;
						this.jhsxsj = info.put_time;
						this.operation_remark = info.operation_remark;
						this.ck_store_url = info.without_link;
						// 参考店铺产品图片
						if(info.without_image.length > 0){
							info.without_image.map(item => {
								let img_obj = {
									is_del:false
								}
								img_obj.domain = item.split('com/')[0] + 'com/';
								img_obj.urls = item.split('com/')[1];
								this.ck_store_cp_img.push(img_obj);
							})
						}
						this.ckdpcp_remark = info.without_describe;
						this.ghs = info.gys;
						this.ghsdyyq = info.gys_area;
						this.hzms_ids = info.gys_model == ''?[]:info.gys_model.split(',');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
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
				auditResource.delImage({url:url}).then(res => {
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
				var version_image = [];	//版型、面料、工艺图片
				var without_image = [];	//参考店铺图片

				// 店铺
				if(!this.store_code){
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
				}else{
					this.show_img.map(item => {
						version_image.push(item.urls);
					})
				}
				// 版型、面料、工艺、颜色描述
				if(this.bmgy_remark == ''){
					this.$message.warning('版型、面料、工艺、颜色描述');
					return;
				}
				//特殊要求说明
				if(this.tsyq == 1 && this.tsyq_remark == ''){
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
				//参考店铺图片
				this.ck_store_cp_img.map(item => {
					without_image.push(item.urls);
				})

				let arg = {
					shop_code:this.store_code,
					shop_link:this.store_url,
					cate_1:this.level_1_cate,
					cate_2:this.level_2_cate,
					version_image:version_image.join(','),
					version_describe:this.bmgy_remark,
					is_special:this.tsyq,
					sale_min_price:this.xsjg_start,
					sale_max_price:this.xsjg_end,
					min_price:this.cb_start,
					max_price:this.cb_end,
					style:this.ksdw,
					style_num:this.ksxysl,
					done_time:this.zwdcsj,
					put_time:this.jhsxsj,
					operation_remark:this.operation_remark,
					without_link:this.ck_store_url,
					without_image:without_image.join(','),
					without_describe:this.ckdpcp_remark,
					gys:this.ghs,
					gys_area:this.ghsdyyq,
					gys_model:this.hzms_ids.join(',')
				}
				//特殊要求
				if(this.tsyq == '1'){
					arg.special_content = this.tsyq_remark
				}

				//保存
				if(this.id){
					//编辑
					this.supplyChainEdit(arg);
				}else{
					//创建
					this.supplyChainAdd(arg);
				}
				
			},
			//创建
			supplyChainAdd(arg){
				demandResource.supplyChainAdd(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.$router.go(-1);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//编辑
			supplyChainEdit(arg){
				arg.id = this.id;
				demandResource.supplyChainEdit(arg).then(res => {
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
		display: flex;
		justify-content: center;
		height: 720px;
		width: 100%;
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