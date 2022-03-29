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
				<el-select v-model="reference_shop" :popper-append-to-body="false" filterable placeholder="请选择参考店铺" @change="changeShop" :disabled="closeStep1">
					<el-option v-for="item in reference_store_list" :key="item.shop_code" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="年/月：">
				<el-date-picker v-model="date" value-format="yyyy-MM" type="month" style="width: 192px" disabled>
				</el-date-picker>
			</el-form-item>
		</el-form>
		<el-button type="primary" size="small" @click="getLastYearData" v-if="closeStep1==false">查询</el-button>
		<el-button type="primary" size="small" @click="resetFun" v-else>重置</el-button>
	</div>
	<div class="table_box" v-if="closeStep1 == true">
		<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="150" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
			<el-table-column width="120" label="去年同期" align="center">
				<template slot-scope="scope">
					<div>{{scope.row.value}}{{scope.row.isPer?'%':''}}</div>
				</template>
			</el-table-column>
			<el-table-column width="160" label="本月目标参数" align="center">
				<template slot-scope="scope">
					<el-input size="small" type="number" :placeholder="scope.row.name" v-model="scope.row.new_value" v-if="scope.row.isPer" :disabled="scope.row.isAuto || closeStep2" @input="inputFun($event,scope.row.key,'1')" @change="changeInput($event,scope.row)" :ref="scope.row.key">
						<template slot="append">%</template>
					</el-input>
					<el-input size="small" type="number" :placeholder="scope.row.name" :disabled="scope.row.isAuto || closeStep2" v-model="scope.row.new_value" @input="inputFun($event,scope.row.key,'1')" @change="changeInput($event,scope.row)" :ref="scope.row.key" v-else>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column  width="160" show-overflow-tooltip label="填写建议" align="center">
				<template slot-scope="scope">
					<el-button size="small" type="text" v-if="scope.row.advice != ''" @click="clickAdvice(scope.$index)" :disabled="closeStep2">查看建议</el-button>
					<el-button size="small" type="text" v-else @click="clickAdvice(scope.$index)"  :disabled="closeStep2"><span style="color: red">{{scope.row.disabled?'*':''}}</span>填写建议</el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-button type="primary" size="small" class="table_button" @click="getBottomData" v-if="closeStep2 == false">查询</el-button>
		<el-button type="primary" size="small" @click="closeStep2 = false" v-else>重置</el-button>
	</div>
</div>
<div class="bottom_table_box" v-if="closeStep2 == true">
	<el-table size="small" :data="day_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" show-summary :summary-method="getSummaries">
		<el-table-column width="70" prop="day" label="日期" align="center"></el-table-column>
		<el-table-column width="45" prop="week" label="星期" align="center"></el-table-column>
		<el-table-column width="70" show-overflow-tooltip prop="gmv" label="日GMV" align="center"></el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="xssr" label="日销量收入" align="center"></el-table-column>
		<el-table-column width="130" prop="xssrzb" label="销售收入占比" align="center">
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
		<el-table-column width="80" show-overflow-tooltip prop="cpcb" label="产品成本" align="center"></el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="yxfyl" label="营销费用率" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.yxfyl}}%</div>
			</template>
		</el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="yxfy" label="营销费用" align="center"></el-table-column>
		<el-table-column width="90" prop="roi" label="销售ROI目标" align="center"></el-table-column>
		<el-table-column width="95" show-overflow-tooltip prop="dptdfy" label="店铺团队费用" align="center"></el-table-column>
		<el-table-column width="95" show-overflow-tooltip prop="dpqtfy" label="店铺其他费用" align="center"></el-table-column>
		<el-table-column width="105" show-overflow-tooltip prop="xmbftfy" label="项目部分摊费用" align="center"></el-table-column>
		<el-table-column width="105" show-overflow-tooltip prop="sybftfy" label="事业部分摊费用" align="center"></el-table-column>
		<el-table-column width="68" show-overflow-tooltip prop="lbfy" label="领标费用" align="center"></el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="gxmy" label="贡献毛益" align="center"></el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="wlfy" label="物流类费用" align="center"></el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="kffy" label="客服类费用" align="center"></el-table-column>
		<el-table-column width="60" show-overflow-tooltip prop="gtfy" label="公摊费" align="center"></el-table-column>
		<el-table-column width="80" show-overflow-tooltip prop="jlr" label="净利润额" align="center"></el-table-column>
		<el-table-column width="68" show-overflow-tooltip prop="jlrl" label="净利润率" align="center">
			<template slot-scope="scope">
				<div>{{scope.row.jlrl}}%</div>
			</template>
		</el-table-column>
	</el-table>
	<el-button type="primary" size="small" class="submit" @click="comfirm">提交</el-button>
</div>
<!-- 填写建议 -->
<el-dialog title="建议" width="30%" :visible.sync="adviceModel" append-to-body>
	<el-input
	size="small"
	type="textarea"
	:rows="3"
	placeholder="请输入建议"
	v-model="adviceValue">
</el-input>
<div slot="footer" class="dialog-footer">
	<el-button size="small" @click="adviceModel = false">取 消</el-button>
	<el-button size="small" type="primary" @click="confirmAdvice">确 定</el-button>
</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
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
</style>
<script>
	import resource from '../../../api/targetSales.js'
	import {getMonthInfo,getWeek} from '../../../api/nowMonth.js'
	export default{
		inject:['reload'],
		data(){
			return{
				dept_1_id:"",			//选中的一级部门id
				dept_1_name:"",			//选中的一级部门名称
				dept_2_id:"",			//选中的二级部门ID
				dept_2_name:"",			//选中的二级部门名称
				jst_code:"",			//店铺jst_code
				shop_name:"",			//店铺名称
				shop_id:"",				//主账号ID
				platform:"",			//平台名称
				shop_type:"",			//店铺类别
				reference_shop:"",		//选中的参考店铺名称
				shop_code:"",			//选中的参考店铺shop_code
				reference_store_list:[],//参考店铺列表
				shopowner_id:"",		//店长ID
				shopowner_name:"",		//店长姓名
				manager_list:[],		//店长列表
				date:"",				//选择的年月
				closeStep1:true,		//第一级是否禁用
				lastYearData:{},		//去年同期返回数据
				table_data:[{
					name:'预估发货单数',
					key:'ygfhds',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:true,
					advice:"",
					disabled:false
				},{
					name:'GMV',
					key:'gmv',
					value:0,
					new_value:"",
					isPer:false,
					isAuto:true,
					advice:"",
					disabled:false
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
					name:'销售收入',
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
					name:'贡献毛益',
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
					name:'净利润',
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
				adviceModel:false,		//是否显示建议弹窗
				adviceValue:"",			//临时存放的建议
				currentAdviceIndex:"",	//点击的建议下标
				closeStep2:true,		//第二级是否禁用
				day_table_data:[],		//日数据表格
			}
		},
		created(){
			//获取店铺列表
			this.getShops();
			//获取店长列表
			this.getAjaxUser();
			
		},
		mounted(){
			//引用组件
			if(this.month != '' && this.day != ''){
				//左侧筛选条件
				let month_obj = JSON.parse(this.month);
				this.dept_1_id = month_obj.dept_1_id;			//选中的一级部门id
				this.dept_1_name = month_obj.dept_1_name;			//选中的一级部门名称
				this.dept_2_id = month_obj.dept_2_id;			//选中的二级部门ID
				this.dept_2_name = month_obj.dept_2_name;			//选中的二级部门名称
				this.jst_code = month_obj.jst_code;			//店铺jst_code
				this.shop_name = month_obj.shop_name;			//店铺名称
				this.shop_id = month_obj.shop_id;				//主账号ID
				this.platform = month_obj.platform;		//平台名称
				this.shop_type = month_obj.shop_type;			//店铺类别
				this.reference_shop = month_obj.reference_shop;	//选中的参考店铺名称
				this.shop_code = month_obj.reference_shop_id;		//选中的参考店铺shop_code
				this.shopowner_id = month_obj.shopowner_id;		//店长ID
				this.shopowner_name = month_obj.shopowner_name;	//店长姓名
				this.date = month_obj.date;				//选择的年月
				// 去年同期
				this.getLastYearData();
				this.table_data.map(item => {
					item.new_value = month_obj[item.key];
					item.advice = month_obj[item.key + '_remark'];
				});
				// 获取第三个表格数据
				let day_arr = JSON.parse(this.day);
				this.getMonthList(day_arr);
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
			//获取店铺列表
			getShops(){
				resource.getShops().then(res => {
					if(res.data.code == 1){
						let data_list = res.data.data;
						data_list.map(item => {
							if(item.is_reference == 1){
								this.reference_store_list.push(item);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换参考店铺
			changeShop(v){
				let item = this.reference_store_list.filter(item => {return item.shop_name == v});
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
			getLastYearData(){
				let arg = {
					shop_code:this.shop_code,
					date:this.date
				}
				resource.lastYearData(arg).then(res => {
					if(res.data.code == 1){
						this.lastYearData = res.data.data;
						for(var k in this.lastYearData){
							for(let i = 0;i < this.table_data.length;i ++){
								if(this.table_data[i].key == k){
									this.table_data[i].value = this.lastYearData[k];
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
			//第一块的重置
			resetFun(){
				this.closeStep1 = false;
				this.closeStep2 = false;
			},
			//监听输入框输入
			inputFun(e,key,type,index){
				if(type == '1'){	//上面表格
					this.table_data.map(item => {
						if(item.key == key){
							if(key == 'xssr'){
								item.new_value = e.replace(/[^0-9]/g, '')
							}else{
								//最多两位小数
								item.new_value = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
							}
						}
					})
				}else{	//下面表格
					this.day_table_data[index].xssrzb = e.replace(/[^0-9]/g, '');
				}
			},
			//输入框回车或失去焦点触发
			changeInput(v,item){
				if(item.key == 'xssr'||item.key == 'mll'||item.key == 'yxfyl'||item.key == 'dptdfyl'||item.key == 'xmbftfyl'||item.key == 'sybftfyl'||item.key == 'lbfyl'||item.key == 'dpqtfyl'||item.key == 'wlfyl'||item.key == 'kffyl'||item.key == 'gtfyl'){	//销售收入变化
					// 预估发货单数（本月销售收入/（历年同期销售收入/历年同期预估发货单数））
					this.table_data[0].new_value = this.table_data[3].new_value === ''?'':Math.round(this.table_data[3].new_value/(this.lastYearData.xssr/this.lastYearData.ygfhds));
					// GMV（本月销售收入/（1-本月退款率））
					this.table_data[1].new_value = this.table_data[3].new_value === ''?'':(this.table_data[3].new_value/(1 - (this.table_data[2].new_value)/100)).toFixed(2);
					//贡献毛益率(毛利率-营销费用率-店铺团队费用率-项目部分摊费用率-事业部分摊费用率-领标费用率-店铺其他费用率)
					if(this.table_data[4].new_value !== '' && this.table_data[5].new_value!== '' && this.table_data[6].new_value !== '' && this.table_data[7].new_value !== '' && this.table_data[8].new_value !== '' && this.table_data[9].new_value !== '' && this.table_data[10].new_value !== ''){
						
						this.table_data[11].new_value = (this.table_data[4].new_value - this.table_data[5].new_value - this.table_data[6].new_value - this.table_data[7].new_value - this.table_data[8].new_value - this.table_data[9].new_value - this.table_data[10].new_value).toFixed(2);
					}else{
						this.table_data[11].new_value = "";
					}
					//贡献毛益（本月销售收入*本月贡献毛益率）
					if(this.table_data[3].new_value !== '' && this.table_data[11].new_value  !== ''){
						this.table_data[12].new_value = parseInt(this.table_data[3].new_value*(this.table_data[11].new_value)/100);
					}
					//净利润(销售收入*（贡献毛益率-物流费用率-客服费用率-公摊费用率))
					this.table_data[16].new_value = this.table_data[3].new_value === ''||this.table_data[11].new_value  === ''||this.table_data[13].new_value === ''||this.table_data[14].new_value === ''||this.table_data[15].new_value === ''?'':parseInt(this.table_data[3].new_value*((this.table_data[11].new_value)/100 - (this.table_data[13].new_value)/100 - (this.table_data[14].new_value)/100 - (this.table_data[15].new_value)/100));
					//净利润率(毛利率-营销费用率-店铺团队费用率-项目部分摊费用率-物流费用率-客服费用率-公摊费用率)
					this.table_data[17].new_value = this.table_data[4].new_value === '' || this.table_data[5].new_value === '' ||this.table_data[6].new_value === '' ||this.table_data[7].new_value === ''||this.table_data[13].new_value === ''||this.table_data[14].new_value === ''||this.table_data[15].new_value === ''?'':(this.table_data[4].new_value-this.table_data[5].new_value-this.table_data[6].new_value-this.table_data[7].new_value-this.table_data[13].new_value-this.table_data[14].new_value-this.table_data[15].new_value).toFixed(2);
				}
			},
			//点击建议（编辑或填写）
			clickAdvice(i){
				this.currentAdviceIndex = i;
				this.adviceValue = this.table_data[i].advice;
				this.adviceModel = true;
			},
			//提交建议
			confirmAdvice(){
				if(this.adviceValue == ""){
					this.$message.warning('请输入建议');
				}else{
					this.table_data[this.currentAdviceIndex].advice = this.adviceValue;
					this.adviceModel = false;
				}
			},
			//点击第二个查询
			getBottomData(){
				for(let i = 0;i < this.table_data.length;i++){
					if(this.table_data[i].new_value === '' && this.table_data[i].new_value != 0 && !this.table_data[i].isAuto){
						this.$message.warning(`请输入${this.table_data[i].name}`);
						this.$refs[this.table_data[i].key].focus();
						return;
					}
					if(this.table_data[i].disabled && !this.table_data[i].advice){
						this.$message.warning(`请填写${this.table_data[i].name}建议`);
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
					
      				//销售收入占比平均数
      				var average = parseInt(100/monthInfo.monthDayNum);
      				//销售收入占比最后一个
      				var last_average = 100 - average*(monthInfo.monthDayNum - 1)
      				for(var i=1;i<=monthInfo.monthDayNum;i++){
      					let info = {
      						day:monthInfo.month+'月'+i+'日',
      						week:getWeek(monthInfo.year+'-'+monthInfo.month+'-'+i),
      						mll:this.table_data[4].new_value,
      						yxfyl:this.table_data[5].new_value,
      						xssrzb:i < monthInfo.monthDayNum?average:last_average
      					}
      					menu.push(this.setInfo(info));
      				}
      			}else{	//获取详情
      				for(var i=0;i<type.length;i++){
      					let info = {
      						day:monthInfo.month+'月'+(i+1)+'日',
      						week:getWeek(monthInfo.year+'-'+monthInfo.month+'-'+i),
      						mll:this.table_data[4].new_value,
      						yxfyl:this.table_data[5].new_value,
      						xssrzb:type[i].xssrzb
      					}
      					menu.push(this.setInfo(info));
      				}
      			}


      			
      			this.day_table_data = menu;
      			// 第二块禁用
      			this.closeStep2 = true;
      		},
      		//改变下面表格某一条的占比
      		changeZb(v,i){
      			this.day_table_data[i] = this.setInfo(this.day_table_data[i])
      		},
      		//计算每一行
      		setInfo(info){
      			// 日销售收入
      			info.xssr = ((info.xssrzb/100)*this.table_data[3].new_value).toFixed(2);
      			//日GMV
      			info.gmv = ((info.xssrzb/100)*this.table_data[1].new_value).toFixed(2);
      			//产品成本
      			info.cpcb = (info.xssr*(1-this.table_data[4].new_value/100)).toFixed(2);
      			//营销费用
      			info.yxfy = (info.xssr*(this.table_data[5].new_value/100)).toFixed(2);
      			//销售ROI目标
      			info.roi = (info.xssr/info.yxfy).toFixed(2);
      			//店铺团队费用
      			info.dptdfy = (info.xssr*(this.table_data[6].new_value/100)).toFixed(2);
      			//项目部分摊费用
      			info.xmbftfy = (info.xssr*(this.table_data[7].new_value/100)).toFixed(2);
      			//物流类费用
      			info.wlfy = (info.xssr*(this.table_data[13].new_value/100)).toFixed(2);
      			//客服类费用
      			info.kffy = (info.xssr*(this.table_data[14].new_value/100)).toFixed(2);
      			//公摊费
      			info.gtfy = (info.xssr*(this.table_data[15].new_value/100)).toFixed(2);
      			//事业部分摊费用
      			info.sybftfy = (info.xssr*(this.table_data[8].new_value/100)).toFixed(2);
      			//店铺其他费用
      			info.dpqtfy = (info.xssr*(this.table_data[10].new_value/100)).toFixed(2);
      			//领标费用
      			info.lbfy = (info.xssr*(this.table_data[9].new_value/100)).toFixed(2);
      			//贡献毛益
      			info.gxmy = (info.xssr*(this.table_data[11].new_value/100)).toFixed(2);
      			//净利润额
      			info.jlr = (info.xssr-info.cpcb-info.dptdfy-info.xmbftfy-info.wlfy-info.kffy-info.gtfy-info.yxfy).toFixed(2);
      			//净利润率
      			info.jlrl = (info.jlr/info.xssr).toFixed(2);
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
					if (index === 4) {	//销售收入占比
						sums[index] = parseInt(sums[index]) + '%';
					}
					if (index === 5) {	//毛利率=月毛利率
						let mll = this.table_data[4].new_value;
						sums[index] = mll + '%';
					}
					if (index === 7) {	//营销费用率=月营销费用率
						let yxfyl = this.table_data[5].new_value;
						sums[index] = yxfyl + '%';
					}
					if (index === 20) {	//净利润率=总日净利润额/总日销售收入
						let jlrl = (sums[19]/sums[3]).toFixed(2);
						sums[index] = jlrl + '%';
					}
				});
      			return sums;
      		},
      		//总提交
      		comfirm(){
      			var zb_num = 0
      			for(let i = 0;i < this.day_table_data.length;i++){
      				zb_num += parseInt(this.day_table_data[i].xssrzb);
      				if(!this.day_table_data[i].xssrzb){
      					this.$message.warning("销售收入占比不能为空");
      					this.$refs['zb_' + i].focus();
      					return;
      				}
      			}
      			if(zb_num != 100){
      				this.$message.warning("销售收入占比总和必须是100");
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
      					date:this.date,
      				};
      				this.table_data.map(item => {
      					month[item.key] = item.new_value;
      					month[item.key + '_remark'] = item.advice;
      				});
      				let data = {
      					month:month,
      					day:this.day_table_data
      				}
      				let arg = {
      					data:JSON.stringify(data),
      					shop_target_id:this.shop_target_id
      				}
      				resource.editShopTargetPost(arg).then(res => {
      					if (res.data.code == 1) {
      						this.$message.success(res.data.msg);
      						this.reload();
      					}else{
      						this.$message.warning(res.data.msg)
      					}
      				})
      			}).catch(() => {
      				this.$message({
      					type: 'info',
      					message: '已取消删除'
      				});          
      			});
      			
      		}
      	}
      }
  </script>

















