<template>
	<div>
		<div class="top_content">
			<div class="form_widget">
				<el-form size="small" label-width="95px" label-position="left">
					<el-form-item label="一级部门：">
						<el-input v-model="dept_1_name" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="二级部门：">
						<el-input v-model="dept_2_name" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="店铺名称：">
						<el-input v-model="shop_name" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="主账号ID：">
						<el-input placeholder="选择店铺名称获取" v-model="shop_id" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="平台：">
						<el-input placeholder="选择店铺名称获取" v-model="platform" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="店铺类别：">
						<el-input placeholder="店铺类别" v-model="shop_type" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="店长：">
						<el-select
						v-model="shopowner_id"
						:popper-append-to-body="false"
						remote
						filterable
						placeholder="请选择店长"
						@change="changeUser"
						:remote-method="getAjaxUser"
						:disabled="closeStep1"
						>
						<el-option
						v-for="item in manager_list"
						:key="item.ding_user_id"
						:label="item.ding_user_name"
						:value="item.ding_user_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="参考店铺：">
				<el-select v-model="reference_jst_code" :popper-append-to-body="false" filterable placeholder="请选择参考店铺" @change="changeShop" :disabled="closeStep1">
					<el-option v-for="item in reference_store_list" :key="item.shop_code" :label="item.shop_code" :value="item.jst_code">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="参考年份：">
				<el-date-picker v-model="reference_year" :clearable="false" value-format="yyyy" type="year" placeholder="选择年份" style="width: 192px" :picker-options="pickerOptionsYear" :disabled="closeStep1">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="年/月：">
				<el-date-picker v-model="date" value-format="yyyy-MM" type="month" style="width: 192px" disabled>
				</el-date-picker>
			</el-form-item>
		</el-form>
		<el-button type="primary" size="small" @click="getLastYearData('2')" v-if="closeStep1==false">查询</el-button>
		<el-button type="primary" size="small" @click="resetFun" v-else>重置</el-button>
	</div>
	<div class="table_box" v-if="closeStep1 == true">
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading_one">
			<el-table-column width="150" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
			<el-table-column width="120" :label="`${reference_year}年同期`" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="160" label="本月目标参数" align="center">
				<template slot-scope="scope">
					<el-input size="small" type="number" :placeholder="scope.row.name" v-model="scope.row.new_value" v-if="scope.row.isPer" :disabled="scope.row.isAuto || closeStep2" @input="inputFun($event,'1',scope.$index)" @change="changeInput($event,scope.row)" :ref="scope.row.key">
						<template slot="append">%</template>
					</el-input>
					<el-input size="small" type="number" :placeholder="scope.row.name" :disabled="scope.row.isAuto || closeStep2" v-model="scope.row.new_value" @input="inputFun($event,'1',scope.$index)" @change="changeInput($event,scope.row)" :ref="scope.row.key" v-else>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column  width="160" show-overflow-tooltip label="备注" align="center">
				<template slot-scope="scope">
					<el-input
					type="textarea"
					placeholder="请输入内容"
					v-model="scope.row.advice"
					maxlength="50"
					show-word-limit
					>
				</el-input>
			</template>
		</el-table-column>
	</el-table>
	<el-button type="primary" size="small" class="table_button" @click="getBottomData" v-if="closeStep2 == false">查询</el-button>
	<el-button type="primary" size="small" @click="closeStep2 = false" v-else>重置</el-button>
</div>
</div>
<div class="bottom_table_box" v-if="closeStep2 == true">
	<div class="set_row">
		<div class="red_toast">*以下【店铺日目标】表格涉及到金额的都是以“百”为单位</div>
		<div class="upload_box">
			<el-button type="primary" size="small">
				一键上传销售收入占比
				<i class="el-icon-upload2 el-icon--right"></i>
			</el-button>
			<input type="file" ref="csvUpload" class="upload_file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" @change="uploadCsv">
		</div>
	</div>
	<el-table size="small" :data="day_table_data" max-height="650" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" show-summary :summary-method="getSummaries">
		<el-table-column width="75" prop="day" label="日期" align="center"></el-table-column>
		<el-table-column width="45" prop="week" label="星期" align="center"></el-table-column>
		<el-table-column width="100" prop="gmv" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="日GMV(百)" placement="top-start">
					<div class="text_content">日GMV(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.gmv}}</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="xssr" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="日销量收入(百)" placement="top-start">
					<div class="text_content">日销量收入(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.xssr}}</div>
			</template>
		</el-table-column>
		<el-table-column width="70" show-overflow-tooltip prop="qntqsrzb" align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" :content="`${reference_year}年同期收入占比`" placement="top-start">
					<div class="text_content">{{reference_year}}年同期收入占比</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.qntqsrzb}}%</div>
			</template>
		</el-table-column>
		<el-table-column width="130" prop="xssrzb" label="销售收入占比" show-overflow-tooltip align="center">
			<template slot-scope="scope">
				<el-input size="mini" placeholder="占比" @input="inputFun($event,'xssrzb','2',scope.$index)" @change="changeZb($event,scope.$index)" v-model="scope.row.xssrzb" :ref="'zb_' + scope.$index">
					<template slot="append">%</template>
				</el-input>
			</template>
		</el-table-column>
		<el-table-column width="70" show-overflow-tooltip prop="mll" label="毛利率" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.mll}}%</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="cpcb" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="产品成本(百)" placement="top-start">
					<div class="text_content">产品成本(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.cpcb}}</div>
			</template>
		</el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="yxfyl" label="营销费用率" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.yxfyl}}%</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="yxfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="营销费用(百)" placement="top-start">
					<div class="text_content">营销费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.yxfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="90" prop="roi" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="销售ROI目标" placement="top-start">
					<div class="text_content">销售ROI目标</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.roi}}%</div>
			</template>
		</el-table-column>
		<el-table-column width="95" prop="dptdfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="店铺团队费用(百)" placement="top-start">
					<div class="text_content">店铺团队费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.dptdfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="95" prop="dpqtfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="店铺其他费用(百)" placement="top-start">
					<div class="text_content">店铺其他费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.dpqtfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="105" prop="xmbftfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="项目部分摊费用(百)" placement="top-start">
					<div class="text_content">项目部分摊费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.xmbftfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="105" prop="sybftfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="事业部分摊费用(百)" placement="top-start">
					<div class="text_content">事业部分摊费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.sybftfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="68" prop="lbfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="领标费用(百)" placement="top-start">
					<div class="text_content">领标费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.lbfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="gxmy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="贡献毛益(百)" placement="top-start">
					<div class="text_content">贡献毛益(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.gxmy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="wlfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="物流类费用(百)" placement="top-start">
					<div class="text_content">物流类费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.wlfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="kffy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="客服类费用(百)" placement="top-start">
					<div class="text_content">客服类费用(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.kffy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="60"prop="gtfy" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="公摊费(百)" placement="top-start">
					<div class="text_content">公摊费(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.gtfy}}</div>
			</template>
		</el-table-column>
		<el-table-column width="80" prop="jlr" show-overflow-tooltip align="center">
			<template slot="header" slot-scope="scope">
				<el-tooltip effect="dark" content="净利润额(百)" placement="top-start">
					<div class="text_content">净利润额(百)</div>
				</el-tooltip>
			</template>
			<template slot-scope="scope">
				<div>{{scope.row.jlr}}</div>
			</template>
		</el-table-column>
		<el-table-column width="68" show-overflow-tooltip prop="jlrl" label="净利润率" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.jlrl}}%</div>
			</template>
		</el-table-column>
	</el-table>
	<el-button type="primary" size="small" class="submit" @click="comfirm">提交</el-button>
</div>
</div>
</template>
<style lang="less" scoped>
.set_row{
	width: 100%;
	display:flex;
	align-items: center;
	justify-content: space-between;
	.red_toast{
		margin-top: 15px;
		color: red;
		font-size: 12px;
	}
	.upload_box{
		margin-right: 10px;
		position: relative;
		.upload_file{
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
}
.top_content{
	display: flex;
	.form_widget{
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
}
.table_box{
	flex:1;
	.table_button{
		margin-top: 20px;
		margin-left: 250px;
	}
}

.bottom_table_box{
	width: 100%;
	display:flex;
	flex-direction: column;
	align-items: center;
	.submit{
		margin-top: 20px;
	}
}

.text_content{
	overflow: hidden;/*超出部分隐藏*/
	white-space: nowrap;/*不换行*/
	text-overflow:ellipsis;/*超出部分文字以...显示*/
}
</style>
<script>
	import resource from '../../../../api/targetSales.js'
	import {getMonthInfo,getWeek} from '../../../../api/nowMonth.js'
	import excel from "../../../../api/excel.js";
	export default{
		inject:['reload'],
		data(){
			return{
				dept_1_id:"",			//选中的一级部门id
				dept_1_name:"",			//选中的一级部门名称
				dept_2_id:"",			//选中的二级部门ID
				dept_2_name:"",			//选中的二级部门名称
				jst_code:"",			//店铺jst_code
				reference_jst_code:"",	//参考店铺jst_code
				shop_name:"",			//店铺名称
				shop_id:"",				//主账号ID
				platform:"",			//平台名称
				shop_type:"",			//店铺类别
				reference_shop:"",		//选中的参考店铺名称
				shop_code:"",			//选中的参考店铺shop_code
				reference_year:"",		//参考年份
				pickerOptionsYear:{
					disabledDate(time) {
						const date = new Date()
						const year = date.getFullYear()
						const currentdate = year.toString()
						const timeyear = time.getFullYear()
						const timedate = timeyear.toString()
						return currentdate < timedate + 1
					}
				},
				reference_store_list:[],//参考店铺列表
				shopowner_id:"",		//店长ID
				shopowner_name:"",		//店长姓名
				manager_list:[],		//店长列表
				date:"",				//选择的年月
				closeStep1:true,		//第一级是否禁用
				lastYearData:{},		//去年同期返回数据
				day_percent:[],			//去年同期收入占比
				table_data:[{
					name:'预估发货单数（万）',
					key:'ygfhds',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:true,
					advice:"",
					disabled:false
				},{
					name:'GMV（万）',
					key:'gmv',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:true,
					advice:"",
					disabled:false
				},{
					name:'客单价（元）',
					key:'kdj',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:false,
					advice:"",
					disabled:true
				},{
					name:'退款率',
					key:'tkl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:true
				},{
					name:'销售收入（万）',
					key:'xssr',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:false,
					advice:"",
					disabled:true
				},{
					name:'毛利率',
					key:'mll',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:true
				},{
					name:'营销费用率',
					key:'yxfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:true
				},{
					name:'店铺团队费用率',
					key:'dptdfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'项目部分摊费用率',
					key:'xmbftfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'事业部分摊费用率',
					key:'sybftfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'领标费用率',
					key:'lbfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'店铺其他费用率',
					key:'dpqtfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'贡献毛益率',
					key:'gxmyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:true,
					advice:"",
					disabled:false
				},{
					name:'贡献毛益（万）',
					key:'gxmy',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:true,
					advice:"",
					disabled:false
				},{
					name:'物流费用率',
					key:'wlfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'客服费用率',
					key:'kffyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'公摊费用率',
					key:'gtfyl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:false,
					advice:"",
					disabled:false
				},{
					name:'净利润（万）',
					key:'jlr',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:true,
					advice:"",
					disabled:false
				},{
					name:'净利润率',
					key:'jlrl',
					value:0,
					new_value:"",
					isPer:true,
					isAuto:true,
					advice:"",
					disabled:false
				}],						//右侧表格数据
				closeStep2:true,		//第二级是否禁用
				day_table_data:[],		//日数据表格
				loading_one:false
			}
		},
		created(){
			//获取店长列表
			this.getAjaxUser();
			
		},
		mounted(){
			//引用组件
			if(this.month != '' && this.day != ''){
				//左侧筛选条件
				let month_obj = JSON.parse(this.month);
				this.dept_1_id = month_obj.dept_1_id;			//选中的一级部门id
				this.dept_1_name = month_obj.dept_1_name;		//选中的一级部门名称
				this.dept_2_id = month_obj.dept_2_id;			//选中的二级部门ID
				this.dept_2_name = month_obj.dept_2_name;		//选中的二级部门名称
				this.jst_code = month_obj.jst_code;				//店铺jst_code
				this.shop_name = month_obj.shop_name;			//店铺名称
				this.shop_id = month_obj.shop_id;				//主账号ID
				this.platform = month_obj.platform;				//平台名称
				this.shop_type = month_obj.shop_type;			//店铺类别
				this.reference_shop = month_obj.reference_shop;	//选中的参考店铺名称
				this.reference_year = month_obj.reference_year.toString();
				this.shopowner_id = month_obj.shopowner_id;		//店长ID
				this.shopowner_name = month_obj.shopowner_name;	//店长姓名
				this.date = month_obj.date;						//选择的年月
				//获取参考店铺列表（处理参考店铺）
				this.getReferenceShops(month_obj.reference_shop_id);
				//第一次进来获取本月目标参数和备注
				this.setMbRemark(month_obj);
			}
		},
		props:{
			month:{
				type:String,
				default:""
			},
			day:{
				type:String,
				default:""
			},
			shop_target_id:{
				type:String,
				default:""
			}
		},
		methods:{
			//获取参考店铺列表
			getReferenceShops(reference_shop_id){
				if(this.date == '' || this.jst_code ==""){
					return;
				}	
				let arg = {
					shop_code:this.jst_code,
					date:this.date
				}
				resource.getReferenceShops(arg).then(res => {
					if(res.data.code == 1){
						this.reference_store_list = res.data.data;
						this.shop_code = reference_shop_id;
						this.reference_store_list.map(item => {
							if(item.shop_code == reference_shop_id){
								this.reference_jst_code = item.jst_code;
								return;
							}
						});
						// 去年同期
						this.getLastYearData('1');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换参考店铺
			changeShop(v){
				let item = this.reference_store_list.filter(item => {return item.jst_code == v});
				this.reference_shop = item[0].shop_name;
				this.shop_code = item[0].shop_code;
			},
			//获取店长列表
			getAjaxUser(v){
				resource.ajaxUser({username:v?v:'',from:17}).then(res => {
					if(res.data.code == 1){
						this.manager_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换店长
			changeUser(v){
				let item = this.manager_list.filter(item => {return item.ding_user_id == v});
				this.shopowner_name = item[0].ding_user_name;
			},
			//获取去年同期数据
			getLastYearData(type){
				let arg = {
					shop_code:this.reference_jst_code,
					date:this.date
				}
				this.loading_one = true;
				resource.lastYearData(arg).then(res => {
					//去年同期收入占比
					this.day_percent = res.data.data.day_percent;	
					if(res.data.code == 1){
						this.loading_one = false;
						if(type == '1'){		//刚进入获取详情
							this.lastYearData = res.data.data.last_year_info;
							for(var k in this.lastYearData){
								for(let i = 0;i < this.table_data.length;i ++){
									if(this.table_data[i].key == k){
										this.table_data[i].value = this.lastYearData[k];
									}
								}
							}
							// 获取第三个表格数据
							let day_arr = JSON.parse(this.day);
							this.getMonthList(day_arr);
						}else{	//点击第一个查询获取默认
							// 去年同期返回数据
							this.lastYearData = res.data.data.last_year_info;
							for(var k in this.lastYearData){
								for(let i = 0;i < this.table_data.length;i ++){
									if(this.table_data[i].key == k){
										this.table_data[i].value = this.lastYearData[k];
										if(this.table_data[i].key == 'tkl' || this.table_data[i].key == 'xssr' || this.table_data[i].key == 'mll' || this.table_data[i].key == 'yxfyl'){
											this.table_data[i].new_value = "";
										}else{
											this.table_data[i].new_value = 0;
										}

									}
								}
							}
							//备注列表
							let remark_lists = res.data.data.remark_lists;
							for(var j in remark_lists){
								for(let i = 0;i < this.table_data.length;i ++){
									if(j.split('_')[0] == this.table_data[i].key){
										this.table_data[i].advice = remark_lists[j];
									}
								}
							}
						}
						//第一块禁用
						this.closeStep1 = true;
					}else{
						this.$message.warning(res.data.msg);
					}
					
				})
			},
			//第一次进来获取本月目标参数和备注
			setMbRemark(month_obj){
				for(let i = 0;i < this.table_data.length;i ++){
					for(var k in month_obj){
						if(this.table_data[i].key == k){
							this.table_data[i].new_value = month_obj[k];
							if(k.split('_')[0] == this.table_data[i].key){
								this.table_data[i].advice = month_obj[k.split('_')[0] + '_remark'];
							}
						}
					}
				}
			},
			//第一块的重置
			resetFun(){
				this.closeStep1 = false;
				this.closeStep2 = false;
			},
			//监听输入框输入
			inputFun(e,type,index){
				if(type == '1'){	//上面表格
					this.table_data[index].new_value = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
				}else{	//下面表格
					this.day_table_data[index].xssrzb = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
				}
			},
			//输入框回车或失去焦点触发
			changeInput(v,item){
				if(item.key == 'kdj'){
					// 预估发货单数（本月销售收入/客单价）
					this.table_data[0].new_value = this.table_data[2].new_value === '' || this.table_data[4].new_value === ''?'':(this.table_data[4].new_value/this.table_data[2].new_value).toFixed(2);
				}else if(item.key == 'xssr'||item.key == 'mll'||item.key == 'yxfyl'||item.key == 'dptdfyl'||item.key == 'xmbftfyl'||item.key == 'sybftfyl'||item.key == 'lbfyl'||item.key == 'dpqtfyl'||item.key == 'wlfyl'||item.key == 'kffyl'||item.key == 'gtfyl'){	//销售收入变化
					// 预估发货单数（本月销售收入/客单价）
					this.table_data[0].new_value = this.table_data[2].new_value === '' || this.table_data[4].new_value === ''?'':(this.table_data[4].new_value/this.table_data[2].new_value).toFixed(2);
					// GMV（本月销售收入/（1-本月退款率））
					this.table_data[1].new_value = this.table_data[4].new_value === ''?'':(this.table_data[4].new_value/(1 - (this.table_data[3].new_value)/100)).toFixed(2);
					//贡献毛益率(毛利率-营销费用率-店铺团队费用率-项目部分摊费用率-事业部分摊费用率-领标费用率-店铺其他费用率)
					if(this.table_data[5].new_value !== '' && this.table_data[6].new_value !== '' && this.table_data[7].new_value !== '' && this.table_data[8].new_value !== '' && this.table_data[9].new_value !== '' && this.table_data[10].new_value !== '' && this.table_data[11].new_value !== ''){
						this.table_data[12].new_value = (this.table_data[5].new_value - this.table_data[6].new_value - this.table_data[7].new_value - this.table_data[8].new_value - this.table_data[9].new_value - this.table_data[10].new_value - this.table_data[11].new_value).toFixed(2);
					}else{
						this.table_data[12].new_value = "";
					}
					//贡献毛益（本月销售收入*本月贡献毛益率）
					if(this.table_data[4].new_value !== ''||this.table_data[12].new_value  !== ''){
						this.table_data[13].new_value = (this.table_data[4].new_value*(this.table_data[12].new_value)/100).toFixed(2);
					}
					// 净利润率
					this.table_data[18].new_value = (this.table_data[5].new_value - this.table_data[6].new_value - this.table_data[7].new_value - this.table_data[8].new_value - this.table_data[9].new_value - this.table_data[14].new_value - this.table_data[15].new_value - this.table_data[16].new_value).toFixed(2);
					//净利润(销售收入*（贡献毛益率-物流费用率-客服费用率-公摊费用率))
					this.table_data[17].new_value = (this.table_data[4].new_value*(this.table_data[18].new_value/100)).toFixed(2);
					// //净利润(销售收入*（贡献毛益率-物流费用率-客服费用率-公摊费用率))
					// this.table_data[17].new_value = this.table_data[4].new_value === ''||this.table_data[12].new_value  === ''||this.table_data[14].new_value === ''||this.table_data[14].new_value === ''||this.table_data[16].new_value === ''?'':(this.table_data[4].new_value*((this.table_data[12].new_value)/100 - (this.table_data[14].new_value)/100 - (this.table_data[15].new_value)/100 - (this.table_data[16].new_value)/100)).toFixed(2);
					// //净利润率（日净利润额/日销售收入）
					// this.table_data[18].new_value = ((this.table_data[17].new_value/this.table_data[4].new_value)*100).toFixed(2);
				}
			},
			//点击第二个查询
			getBottomData(){
				for(let i = 0;i < this.table_data.length;i++){
					if((this.table_data[i].new_value === '' || this.table_data[i].new_value === null) && !this.table_data[i].isAuto){
						this.$message.warning(`请输入${this.table_data[i].name}`);
						this.$refs[this.table_data[i].key].focus();
						return;
					}
				}
				//获取第三个表格数据
				this.getMonthList('1');
			},
			// 获取第三个表格数据
			getMonthList(type){
				var menu = [];
				//当前月信息
				var monthInfo = getMonthInfo(this.date.split('-')[0],this.date.split('-')[1]);
				if(type == '1'){			//点击第二个查询按钮
					//当前月信息
					let monthInfo = getMonthInfo(this.date.split('-')[0],this.date.split('-')[1]);
					//销售收入占比平均数
					var average = parseInt(100/monthInfo.monthDayNum);
      				//销售收入占比最后一个
      				var last_average = 100 - average*(monthInfo.monthDayNum - 1)

      				let is_arr = this.day_percent.filter(item => {
      					return item == 0;
      				})
      				for(var i=1;i<=monthInfo.monthDayNum;i++){
      					var d = i < 10?'0'+i:i;
      					let info = {
      						day:monthInfo.month+'月'+d+'日',
      						week:getWeek(monthInfo.year+'-'+monthInfo.month+'-'+i),
      						mll:this.table_data[5].new_value,
      						yxfyl:this.table_data[6].new_value,
      						qntqsrzb:this.day_percent[i-1],
      						xssrzb:is_arr.length >10?(i < monthInfo.monthDayNum?average:last_average):this.day_percent[i-1]
      					}
      					menu.push(this.setInfo(info));
      				}
      			}else{	//获取详情
      				type.map((item,index) => {
      					item.qntqsrzb = this.day_percent[index];
      				});
      				menu = type;
      			}
      			this.day_table_data = menu;
      			// 第二块禁用
      			this.closeStep2 = true;
      		},
      		//改变下面表格某一条的占比
      		changeZb(v,i){
      			this.day_table_data[i] = this.setInfo(this.day_table_data[i])
      		},
      		// 粘贴日销售收入占比
      		uploadCsv(e){
      			const files = e.target.files;
      			let file=files[0];
      			const fileExt = file.name.split('.').pop().toLocaleLowerCase()
      			if (fileExt === 'xlsx' || fileExt === 'xls') {
      				const reader = new FileReader();
      				reader.readAsArrayBuffer(file);
      				reader.onerror = (e) => {
      					this.$message.warning("文件读取出错");
      					this.$refs.csvUpload.value = ''
      				};
      				reader.onload = (e) => {
      					const data = e.target.result;
      					const { header, results } = excel.read(data, "array");
      					var new_xssrzb = [];
      					var isx = true;
      					results.map((item,index) => {
      						if(!isx){
      							return;
      						}
      						for(var k in item){
      							if(k == '销售收入占比'){
      								if(!this.isNumber.test(item[k])){
      									this.$message.warning("销售收入占比必须是数字类型并且大于等于0！");
      									isx = false;
      									return;
      								}else{
      									new_xssrzb.push((item[k]*100).toFixed(2));
      									break;
      								}
      							}
      						}
      					});
      					this.$refs.csvUpload.value = ''
      					if(!isx){
      						return;
      					}
      					if(new_xssrzb.length == 0){
      						this.$message.warning("表格内没有“销售收入占比”的列名!");
      						return;
      					}else if(new_xssrzb.length != this.day_table_data.length){
      						this.$message.warning("表格数据行数不等于日目标行数!");
      						return;
      					}
      					new_xssrzb.map((item,index) => {
      						this.day_table_data[index].xssrzb = item;
      						this.day_table_data[index] = this.setInfo(this.day_table_data[index])
      					})
      					this.$message.success("上传成功!");
      				};
      			} else {
      				this.$refs.csvUpload.value = ''
      				this.$message.warning("文件类型错误,请选择后缀为.xlsx或者.xls的EXCEL文件");
      			}
      		},
      		//计算每一行
      		setInfo(info){
      			// 日销售收入（日销售收入占比*本月销售收入）
      			info.xssr = ((info.xssrzb/100)*(this.table_data[4].new_value*100)).toFixed(2);
      			//日GMV（日销售收入占比*本月gmv）
      			info.gmv = ((info.xssrzb/100)*(this.table_data[1].new_value*100)).toFixed(2);
      			//产品成本（日销售收入*（1-月毛利率））
      			info.cpcb = (info.xssr*(1-this.table_data[5].new_value/100)).toFixed(2);
      			//营销费用（日销售收入*月营销费用率）
      			info.yxfy = (info.xssr*(this.table_data[6].new_value/100)).toFixed(2);
      			//销售ROI目标（日销售收入/日营销费用）
      			if(info.yxfy == 0){
      				info.roi = 0;
      			}else{
      				info.roi = ((info.xssr/info.yxfy)*100).toFixed(2);
      			}
      			//店铺团队费用（日销售收入*月店铺团队费用率）
      			info.dptdfy = (info.xssr*(this.table_data[7].new_value/100)).toFixed(2);
      			//项目部分摊费用（日销售收入*月项目部分摊费用率）
      			info.xmbftfy = (info.xssr*(this.table_data[8].new_value/100)).toFixed(2);
      			//物流类费用（日销售收入*当月物流费用率）
      			info.wlfy = (info.xssr*(this.table_data[14].new_value/100)).toFixed(2);
      			//客服类费用（日销售收入*客服费用率）
      			info.kffy = (info.xssr*(this.table_data[15].new_value/100)).toFixed(2);
      			//公摊费（日销售收入*公摊费用率）
      			info.gtfy = (info.xssr*(this.table_data[16].new_value/100)).toFixed(2);
      			//事业部分摊费用
      			info.sybftfy = (info.xssr*(this.table_data[9].new_value/100)).toFixed(2);
      			//店铺其他费用
      			info.dpqtfy = (info.xssr*(this.table_data[11].new_value/100)).toFixed(2);
      			//领标费用
      			info.lbfy = (info.xssr*(this.table_data[10].new_value/100)).toFixed(2);
      			//贡献毛益
      			info.gxmy = (info.xssr*(this.table_data[12].new_value/100)).toFixed(2);
      			//净利润额
      			info.jlr = (info.xssr-info.cpcb-info.dptdfy-info.xmbftfy-info.wlfy-info.kffy-info.gtfy-info.yxfy-info.sybftfy).toFixed(2);
      			//净利润率
      			if(info.xssr == 0){
      				info.jlrl = 0;
      			}else{
      				info.jlrl = ((info.jlr/info.xssr)*100).toFixed(2);
      			}
      			return info;
      		},
      		// 表尾合计行处理
      		getSummaries(param) {
      			const { columns, data } = param;
      			const sums = [];
      			columns.forEach((column, index) => {
      				if (index === 0) {
      					sums[index] = '合计';
      					return;
      				}
      				const values = data.map(item => Number(item[column.property]));
      				sums[index] = values.reduce((prev, curr) => {
      					return prev + curr;
      				}, 0);
      				sums[index] = sums[index].toFixed(2);
					if (index === 1) {	//星期
						sums[index] = '';
					}
					if (index === 4 || index === 5) {	//去年同期销售收入占比
						sums[index] = sums[index] + '%';
					}
					if (index === 6) {	//毛利率=月毛利率
						let mll = this.table_data[5].new_value;
						sums[index] = mll + '%';
					}
					if (index === 8) {	//营销费用率=月营销费用率
						let yxfyl = this.table_data[6].new_value;
						sums[index] = yxfyl + '%';
					}
					if (index === 10) {	//销售ROI目标=日销售收入/日营销费用
						let roi = sums[3] == 0 || sums[9] == 0?0:((sums[3]/sums[9])*100).toFixed(2);
						sums[index] = roi + '%';
					}
					if (index === 21) {	//净利润率=总日净利润额/总日销售收入
						let jlrl = sums[20] == 0 || sums[3] == 0?0:((sums[20]/sums[3])*100).toFixed(2);
						sums[index] = jlrl + '%';
					}
				});
      			return sums;
      		},
      		//总提交
      		comfirm(){
      			var zb_num = 0
      			for(let i = 0;i < this.day_table_data.length;i++){
      				zb_num += parseFloat(this.day_table_data[i].xssrzb);
      				if(this.day_table_data[i].xssrzb === ''){
      					this.$message.warning("销售收入占比不能为空");
      					this.$refs['zb_' + i].focus();
      					return;
      				}
      			}
      			if(zb_num.toFixed(2) != '100.00'){
      				this.$message.warning("销售收入占比总和必须是100%");
      				return;
      			}
      			this.$confirm('确认提交', '提示', {
      				confirmButtonText: '确定',
      				cancelButtonText: '取消',
      				type: 'warning'
      			}).then(() => {
      				let month = {
      					dept_1_id:this.dept_1_id,
      					dept_1_name:this.dept_1_name,
      					dept_2_id:this.dept_2_id,
      					dept_2_name:this.dept_2_name,
      					jst_code:this.jst_code,
      					shop_name:this.shop_name,
      					shop_id:this.shop_id,
      					platform:this.platform,
      					shop_type:this.shop_type,
      					shopowner_id:this.shopowner_id,
      					shopowner_name:this.shopowner_name,
      					reference_shop:this.reference_shop,
      					reference_shop_id:this.shop_code,
      					date:this.date,
      					reference_year:this.reference_year
      				};
      				this.table_data.map(item => {
      					month[item.key] = item.new_value;
      					month[item.key + '_remark'] = item.advice;
      				});
      				//处理去年同期销售收入占比
      				let new_day_table_data = JSON.parse(JSON.stringify(this.day_table_data));
      				new_day_table_data.map(item => {
      					delete item.qntqsrzb
      				});
      				let data = {
      					month:month,
      					day:new_day_table_data
      				}

      				let arg = {
      					data:JSON.stringify(data),
      					shop_target_id:this.shop_target_id
      				}
      				resource.editShopTargetPost(arg).then(res => {
      					if (res.data.code == 1) {
      						this.$message.success(res.data.msg);
      						this.$emit('callback')
      					}else{
      						this.$message.warning(res.data.msg)
      					}
      				})
      			}).catch(() => {
      				this.$message({
      					type: 'info',
      					message: '已取消'
      				});          
      			});
      			
      		}
      	}
      }
  </script>

















