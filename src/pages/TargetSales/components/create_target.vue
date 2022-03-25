<template>
	<div>
		<div class="top_content">
			<div class="form_widget">
				<el-form size="small" label-width="95px" label-position="left">
					<el-form-item label="一级部门：" required>
						<el-select v-model="active_level1" clearable :popper-append-to-body="false" filterable placeholder="请选择一级部门" @change="changeDept">
							<el-option v-for="item in level1_dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="二级部门：" required>
						<el-select v-model="active_level2" clearable :popper-append-to-body="false" filterable placeholder="请选择二级部门">
							<el-option v-for="item in level2_dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="店铺名称：" required>
						<el-select v-model="active_store_id" clearable :popper-append-to-body="false" filterable placeholder="请选择店铺" @change="changeStore">
							<el-option v-for="item in store_list" :key="item.shop_code" :label="item.shop_name" :value="item.shop_name">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="主账号ID：">
						<el-input placeholder="选择店铺名称获取" v-model="shop_code" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="平台：">
						<el-input placeholder="选择店铺名称获取" v-model="platform" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="店铺类别：">
						<el-input placeholder="选择店铺名称获取" v-model="shop_type" disabled style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="店长：" required>
						<el-input placeholder="请选择店长" v-model="manager" style="width: 192px">
						</el-input>
					</el-form-item>
					<el-form-item label="参考店铺：" required>
						<el-select v-model="reference_store_id" clearable :popper-append-to-body="false" filterable placeholder="请选择参考店铺">
							<el-option v-for="item in reference_store_list" :key="item.shop_code" :label="item.shop_name" :value="item.shop_code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="年/月：" required>
						<el-date-picker v-model="active_date" value-format="yyyy-MM" type="month" placeholder="选择年月"style="width: 192px">
						</el-date-picker>
					</el-form-item>
				</el-form>
				<el-button type="primary" size="small" @click="getLastYearData">查询</el-button>
			</div>
			<div class="table_box">
				<el-table size="small" :data="table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
					<el-table-column width="150" show-overflow-tooltip prop="name" label="分类" align="center"></el-table-column>
					<el-table-column width="120" label="去年同期" align="center">
						<template slot-scope="scope">
							<div>{{scope.row.value}}{{scope.row.isPer?'%':''}}</div>
						</template>
					</el-table-column>
					<el-table-column width="160" label="本月目标参数" align="center">
						<template slot-scope="scope">
							<el-input size="small" type="number" :placeholder="scope.row.name" v-model="scope.row.new_value" v-if="scope.row.isPer" :disabled="scope.row.isAuto" @input="inputFun($event,scope.row.key)" @change="changeInput($event,scope.row)" :ref="scope.row.key">
								<template slot="append">%</template>
							</el-input>
							<el-input size="small" type="number" :placeholder="scope.row.name" :disabled="scope.row.isAuto" v-model="scope.row.new_value" @input="inputFun($event,scope.row.key)" @change="changeInput($event,scope.row)" :ref="scope.row.key" v-else>
							</el-input>
						</template>
					</el-table-column>
					<el-table-column  width="160" show-overflow-tooltip label="填写建议" align="center">
						<template slot-scope="scope">
							<el-button size="small" type="text" v-if="scope.row.advice != ''" @click="clickAdvice(scope.$index)">查看建议</el-button>
							<el-button size="small" type="text" v-else @click="clickAdvice(scope.$index)"><span style="color: red">{{scope.row.disabled?'*':''}}</span>填写建议</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button type="primary" size="small" class="table_button" @click="getBottomData">查询</el-button>
			</div>
		</div>
		<el-table size="small" :data="day_table_data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
			<el-table-column width="60" prop="date" label="日期" align="center"></el-table-column>
			<el-table-column width="45" prop="week" label="星期" align="center"></el-table-column>
			<el-table-column width="60" prop="gmv" label="日GMV" align="center"></el-table-column>
			<el-table-column width="80" prop="xssr" label="日销量收入" align="center"></el-table-column>
			<el-table-column width="130" prop="xssrzb" label="销售收入占比" align="center">
				<template slot-scope="scope">
					<el-input size="mini" placeholder="占比" v-model="scope.row.xssrzb">
						<template slot="append">%</template>
					</el-input>
				</template>
			</el-table-column>
			<el-table-column width="60" prop="mll" label="毛利率" align="center"></el-table-column>
			<el-table-column width="68" prop="cpcb" label="产品成本" align="center"></el-table-column>
			<el-table-column width="80" prop="yxfyl" label="营销费用率" align="center"></el-table-column>
			<el-table-column width="68" prop="yxfy" label="营销费用" align="center"></el-table-column>
			<el-table-column width="90" prop="roi" label="销售ROI目标" align="center"></el-table-column>
			<el-table-column width="95" prop="dptdfy" label="店铺团队费用" align="center"></el-table-column>
			<el-table-column width="95" prop="dpqtfy" label="店铺其他费用" align="center"></el-table-column>
			<el-table-column width="105" prop="xmbftfy" label="项目部分摊费用" align="center"></el-table-column>
			<el-table-column width="105" prop="sybftfy" label="事业部分摊费用" align="center"></el-table-column>
			<el-table-column width="68" prop="lbfy" label="领标费用" align="center"></el-table-column>
			<el-table-column width="68" prop="gxmy" label="贡献毛益" align="center"></el-table-column>
			<el-table-column width="80" prop="wlfy" label="物流类费用" align="center"></el-table-column>
			<el-table-column width="80" prop="kffy" label="客服类费用" align="center"></el-table-column>
			<el-table-column width="60" prop="gtfy" label="公摊费" align="center"></el-table-column>
			<el-table-column width="68" prop="jlr" label="净利润额" align="center"></el-table-column>
			<el-table-column width="68" prop="jlrl" label="净利润率" align="center"></el-table-column>
		</el-table>
		<!-- 填写建议 -->
		<el-dialog title="建议" width="30%" :visible.sync="adviceModel">
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
	.table_box{
		flex:1;
		.table_button{
			margin-top: 20px;
			margin-left: 250px;
		}
	}
}
</style>
<script>
	import resource from '../../../api/targetSales.js'
	export default{
		data(){
			return{
				active_level1:"",		//选中的一级部门
				level1_dept_list:[],	//一级部门列表
				active_level2:"",		//选中的二级部门
				level2_dept_list:[],	//二级部门列表
				active_store_id:"",		//选中的普通店铺
				store_list:[],			//普通店铺列表
				reference_store_id:"",	//选中的参考店铺
				reference_store_list:[],//参考店铺列表
				shop_code:"",			//主账号ID
				platform:"",			//平台名称
				shop_type:"",			//店铺类别
				manager:"",				//店长
				active_date:"",			//选择的年月
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
					key:'gmw',
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
					key:'xmbfftfyl',
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
				day_table_data:[],		//日数据表格
			}
		},
		created(){
			//获取部门列表
			this.getDepts();
			//获取店铺列表
			this.getShops();
			//获取去年同期数据
			this.getLastYearData();
		},
		methods:{
			//获取部门列表
			getDepts(dept_id){
				let arg = {};
				if(dept_id){
					arg.dept_id = dept_id;
				}
				resource.getDepts(arg).then(res => {
					if(res.data.code == 1){
						if(dept_id){
							this.level2_dept_list = res.data.data;
						}else{
							this.level1_dept_list = res.data.data;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换一级部门
			changeDept(v){
				//获取部门列表
				this.getDepts(v);
			},
			//获取店铺列表
			getShops(){
				resource.getShops().then(res => {
					if(res.data.code == 1){
						let data_list = res.data.data;
						data_list.map(item => {
							if(item.is_reference == 0){
								this.store_list.push(item);
							}else{
								this.reference_store_list.push(item);
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换店铺获取店铺详情
			changeStore(v){
				resource.getShopInfo({shop_name:v}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data[0];
						this.shop_code = data.shop_code;			
						this.platform = data.platform;			
						this.shop_type = data.shop_type;			
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取去年同期数据
			getLastYearData(){
				let arg = {
					shop_code:"mystery8090",
					date:'2021-1'
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
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//监听输入框输入
			inputFun(e,key){
				this.table_data.map(item => {
					if(item.key == key){
						//最多两位小数
						item.new_value = (e.match(/^\d*(\.?\d{0,2})/g)[0]) || null;
					}
				})
			},
			//输入框回车或失去焦点触发
			changeInput(v,item){
				if(item.key == 'xssr'||item.key == 'mll'||item.key == 'yxfyl'||item.key == 'dptdfyl'||item.key == 'xmbfftfyl'||item.key == 'sybftfyl'||item.key == 'lbfyl'||item.key == 'dpqtfyl'||item.key == 'wlfyl'||item.key == 'kffyl'||item.key == 'gtfyl'){	//销售收入变化
					// 预估发货单数（本月销售收入/（历年同期销售收入/历年同期预估发货单数））
					this.table_data[0].new_value = !this.table_data[3].new_value?'':Math.round(this.table_data[3].new_value/(this.lastYearData.xssr/this.lastYearData.ygfhds));
					// GMV（本月销售收入/（1-本月退款率））
					this.table_data[1].new_value = !this.table_data[3].new_value?'':(this.table_data[3].new_value/(100 - this.lastYearData.tkl)).toFixed(2);
					//贡献毛益率(毛利率-营销费用率-店铺团队费用率-项目部分摊费用率-事业部分摊费用率-领标费用率-店铺其他费用率)
					if(this.table_data[4].new_value && this.table_data[5].new_value && this.table_data[6].new_value && this.table_data[7].new_value && this.table_data[8].new_value && this.table_data[9].new_value && this.table_data[10].new_value){
						
						this.table_data[11].new_value = (this.table_data[4].new_value - this.table_data[5].new_value - this.table_data[6].new_value - this.table_data[7].new_value - this.table_data[8].new_value - this.table_data[9].new_value - this.table_data[10].new_value).toFixed(2);
					}else{
						this.table_data[11].new_value = "";
					}
					//贡献毛益（本月销售收入*本月贡献毛益率）
					if(this.table_data[3].new_value||this.table_data[11].new_value != ""){
						this.table_data[12].new_value = (this.table_data[3].new_value*this.table_data[11].new_value).toFixed(2);
					}
					//净利润(销售收入*（贡献毛益率-物流费用率-客服费用率-公摊费用率))
					this.table_data[16].new_value = !this.table_data[3].new_value||this.table_data[11].new_value == ''||!this.table_data[13].new_value||!this.table_data[14].new_value||!this.table_data[15].new_value?'':(this.table_data[3].new_value*(this.table_data[11].new_value - this.table_data[13].new_value - this.table_data[14].new_value - this.table_data[15].new_value)).toFixed(2);
					//净利润率(毛利率-营销费用率-店铺团队费用率-项目部分摊费用率-物流费用率-客服费用率-公摊费用率)
					this.table_data[17].new_value = !this.table_data[4].new_value || !this.table_data[5].new_value ||!this.table_data[6].new_value ||!this.table_data[7].new_value||!this.table_data[13].new_value||!this.table_data[14].new_value||!this.table_data[15].new_value?'':(this.table_data[4].new_value-this.table_data[5].new_value-this.table_data[6].new_value-this.table_data[7].new_value-this.table_data[13].new_value-this.table_data[14].new_value-this.table_data[15].new_value).toFixed(2);
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
				// for(let i = 0;i < this.table_data.length;i++){
				// 	if(!this.table_data[i].new_value && !this.table_data[i].isAuto){
				// 		this.$message.warning(`请输入${this.table_data[i].name}`);
				// 		this.$refs[this.table_data[i].key].focus();
				// 		return;
				// 	}
				// 	if(this.table_data[i].disabled && !this.table_data[i].advice){
				// 		this.$message.warning(`请填写${this.table_data[i].name}建议`);
				// 		return;
				// 	}
				// }
				//获取第三个表格数据
				this.getMonthList();
				console.log(this.table_data);
			},
			// 获取月份内的数据
    		getMonthList(time){
    			let MonthDayNum = 0;
    			var date = new Date();
    			let y = date.getFullYear();
    			let m = date.getMonth();
      			let m_zf = Number(m+1);
      			MonthDayNum = this.mGetDate(y,m_zf);
      			var rxssr = this.table_data[3].new_value/MonthDayNum;
      			//销售收入占比平均数
      			var average = Math.floor((100/MonthDayNum) * 100)/100;
      			//销售收入占比最后一个
      			let toast_num = 0;
      			for(let i = 0;i < MonthDayNum - 1;i ++){
      				toast_num += average;
      			}
      			var last_average = Math.floor((100 - toast_num) * 100)/100;
      			var menu = [];
      			for(var i=1;i<=MonthDayNum;i++){
      				let i_zf = i;
      				let info = {
      					date:m_zf+'月'+i_zf+'日',
      					week:this.getWeek(date,y+'-'+m_zf+'-'+i_zf),
      					gmv:(this.table_data[1].new_value/MonthDayNum).toFixed(2),
      					xssr:rxssr.toFixed(2),
      					xssrzb:i < MonthDayNum?average:last_average,
      					mll:this.table_data[4].new_value,
      					cpcb:(rxssr*(100-this.table_data[4].new_value)).toFixed(2),
      					yxfyl:this.table_data[5].new_value,
      					yxfy:(rxssr*this.table_data[5].new_value).toFixed(2),
      					roi:(rxssr/(rxssr/MonthDayNum*this.table_data[5].new_value)).toFixed(2),
      					dptdfy:(rxssr*this.table_data[6].new_value).toFixed(2),
      					dpqtfy:(rxssr*this.table_data[10].new_value).toFixed(2),
      					xmbftfy:(rxssr*this.table_data[7].new_value).toFixed(2),
      					sybftfy:(rxssr*this.table_data[8].new_value).toFixed(2),
      					lbfy:(rxssr*this.table_data[9].new_value).toFixed(2),
      					gxmy:(rxssr*this.table_data[11].new_value).toFixed(2),
      					wlfy:(rxssr*this.table_data[13].new_value).toFixed(2),
      					kffy:(rxssr*this.table_data[14].new_value).toFixed(2),
      					gtfy:(rxssr*this.table_data[15].new_value).toFixed(2),
      					jlr:(rxssr-(rxssr*(100-this.table_data[4].new_value))-(rxssr*this.table_data[6].new_value)-(rxssr*this.table_data[7].new_value)-(rxssr*this.table_data[13].new_value)-(rxssr*this.table_data[14].new_value)-(rxssr*this.table_data[15].new_value)).toFixed(2),
      					jlrl:((rxssr-(rxssr*(100-this.table_data[4].new_value))-(rxssr*this.table_data[6].new_value)-(rxssr*this.table_data[7].new_value)-(rxssr*this.table_data[13].new_value)-(rxssr*this.table_data[14].new_value)-(rxssr*this.table_data[15].new_value))/rxssr).toFixed(2)
      				}
      				menu.push(info);
      			}
      			this.day_table_data = menu;
      			console.log(this.day_table_data);
      		},
      		// 获取月份数据
			mGetDate(y,m){
				var date = new Date(y,m);
				var year = date.getFullYear();
				var month = date.getMonth();
				var d = new Date(year, month, 0);
				return d.getDate();
			},
    		// 获取星期
    		getWeek(date,dateString) {
    			var dateArray = dateString.split("-");
    			date = new Date(dateArray[0], parseInt(dateArray[1] - 1), dateArray[2]);
        		return "日一二三四五六".charAt(date.getDay());
        	},
		}
	}
</script>

















