<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="搜索：">
				<el-input v-model="req.search" placeholder="部门/岗位/姓名/工号"></el-input>
			</el-form-item>
			<el-form-item label="考核月份：">
				<el-date-picker
				v-model="req.date"
				type="month"
				:clearable="false"
				value-format="yyyy-MM"
				placeholder="选择月">
			</el-date-picker>
		</el-form-item>
		<el-form-item label="绩效状态：">
			<el-select v-model="req.status" clearable :popper-append-to-body="false" placeholder="全部">
				<el-option v-for="item in performance_list" :key="item._id" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="getData">搜索</el-button>
		</el-form-item>
	</el-form>
	<div class="table_setting">
		<el-button type="primary" plain size="small" @click="downLoad">打印<i class="el-icon-printer el-icon--right"></i></el-button>
	</div>
	<el-table :data="dataObj.data" size="small" stripe style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}">
		<el-table-column prop="kpi_id" label="序号" align="center">
		</el-table-column>
		<el-table-column prop="dept_names" label="部门" align="center">
		</el-table-column>
		<el-table-column prop="position" label="岗位" align="center">
		</el-table-column>
		<el-table-column prop="ding_user_name" label="姓名" align="center">
		</el-table-column>
		<el-table-column prop="date" label="考核月份" align="center">
		</el-table-column>
		<el-table-column prop="status_name" label="绩效状态" align="center">
		</el-table-column>
		<el-table-column prop="score" label="分值" align="center">
		</el-table-column>
		<el-table-column prop="grade" label="评级" align="center">
		</el-table-column>
		<el-table-column prop="evaluation_grade" label="员工等级" align="center">
		</el-table-column>
		<el-table-column width="220" label="操作" align="center">
			<template slot-scope="scope">
				<el-button type="text" size="small" v-if="isShow('1',scope.row.type,scope.row.status)" @click="addKpiGet(scope.row.kpi_id)">添加</el-button>
				<el-button type="text" size="small" v-if="isShow('2',scope.row.type,scope.row.status)" @click="editItem(scope.row.kpi_id)">编辑</el-button>
				<el-button type="text" size="small" v-if="isShow('3',scope.row.type,scope.row.status)" @click="kpiDetail('2',scope.row.kpi_id)">查看</el-button>
				<el-button type="text" size="small" v-if="isShow('4',scope.row.type,scope.row.status)" @click="kpiDetail('4',scope.row.kpi_id)">评分</el-button>
				<el-button type="text" size="small" v-if="isShow('5',scope.row.type,scope.row.status)">打印</el-button>
			</template>
		</el-table-column>
	</el-table>
	<div class="page">
		<el-pagination
		@size-change="handleSizeChange"
		@current-change="handleCurrentChange"
		:current-page="req.page"
		:pager-count="11"
		:page-sizes="[5, 10, 15, 20]"
		layout="total, sizes, prev, pager, next, jumper"
		:total="dataObj.total"
		>
	</el-pagination>
</div>
<!-- 考核评分表 -->
<el-dialog title="考核评分表（月度）" center width="68%" @close="closeDialog" :close-on-click-modal="false" :visible.sync="show_progress">
	<div class="review_box">
		<div class="user_content border_bottom">
			<div class="user_name font_weight">姓名</div>
			<div class="user_item">{{user_info.ding_user_name}}</div>
			<div class="user_name font_weight">岗位</div>
			<div class="user_item">{{user_info.position}}</div>
			<div class="user_name font_weight">考核时间</div>
			<div class="user_item">{{user_info.date}}</div>
		</div>
		<div class="performance_item border_bottom">
			<div class="item_label font_weight">业绩绩效</div>
			<div class="item_content">
				<div class="content_row border_bottom">
					<div class="column_item min_width font_weight">序号</div>
					<div class="column_item max_width font_weight">考核项目</div>
					<div class="column_item min_width font_weight">权重</div>
					<div class="column_item max_width font_weight">指标要求</div>
					<div class="column_item max_width font_weight">评分标准</div>
					<div class="column_item min_width font_weight" v-if="is_score">得分</div>
					<div class="column_item min_width font_weight" v-if="is_setting">操作</div>
				</div>
				<div class="content_row" :class="{'border_bottom':index < achievement.length - 1}" v-for="(item,index) in achievement">
					<div class="column_item min_width">{{index + 1}}</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.project" :readonly="is_readonly" type="textarea" autosize placeholder="输入考核项目"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit widget_input" type="number" v-model="item.weight" :readonly="is_readonly"></el-input>
						<div class="bai">%</div>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.requirements" :readonly="is_readonly" type="textarea" autosize placeholder="输入指标要求"></el-input>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.criteria" :readonly="is_readonly" type="textarea" autosize placeholder="输入评分标准"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_score">
						<el-input class="rule-input-edit" type="number" v-model="item.score" :readonly="is_score_readonly" placeholder="输入得分"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_setting">
						<el-button type="text" size="small" @click="addItem('1',index)">插入</el-button>
						<el-button type="text" size="small" @click="deleteItem('1',index)">删除</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="performance_item border_bottom">
			<div class="item_label font_weight">行为考核</div>
			<div class="item_content">
				<div class="content_row border_bottom">
					<div class="column_item min_width font_weight">序号</div>
					<div class="column_item max_width font_weight">考核项目</div>
					<div class="column_item min_width font_weight">权重</div>
					<div class="column_item max_width font_weight">指标要求</div>
					<div class="column_item max_width font_weight">评分标准</div>
					<div class="column_item min_width font_weight" v-if="is_score">得分</div>
					<div class="column_item min_width font_weight" v-if="is_setting">操作</div>
				</div>
				<div class="content_row" :class="{'border_bottom':index < action.length - 1}" v-for="(item,index) in action">
					<div class="column_item min_width">{{index + 1}}</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.project" :readonly="is_readonly" type="textarea" autosize placeholder="输入考核项目"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit widget_input" type="number" v-model="item.weight" :readonly="is_readonly"></el-input>
						<div class="bai">%</div>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.requirements" :readonly="is_readonly" type="textarea" autosize placeholder="输入指标要求"></el-input>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.criteria" :readonly="is_readonly" type="textarea" autosize placeholder="输入评分标准"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_score">
						<el-input class="rule-input-edit" type="number" v-model="item.score" :readonly="is_score_readonly" placeholder="输入得分"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_setting">
						<el-button type="text" size="small" @click="addItem('2',index)">插入</el-button>
						<el-button type="text" size="small" @click="deleteItem('2',index)">删除</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="performance_item border_bottom">
			<div class="item_label font_weight">加分项</div>
			<div class="item_content">
				<div class="content_row border_bottom">
					<div class="column_item min_width font_weight">序号</div>
					<div class="column_item max_width font_weight">考核项目</div>
					<div class="column_item min_width font_weight">权重</div>
					<div class="column_item max_width font_weight">指标要求</div>
					<div class="column_item max_width font_weight">评分标准</div>
					<div class="column_item min_width font_weight" v-if="is_score">得分</div>
					<div class="column_item min_width font_weight" v-if="is_setting">操作</div>
				</div>
				<div class="content_row" :class="{'border_bottom':index < bonus_items.length - 1}" v-for="(item,index) in bonus_items">
					<div class="column_item min_width">{{index + 1}}</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.project" :readonly="is_readonly" type="textarea" autosize placeholder="输入考核项目"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit widget_input" type="number" v-model="item.weight" :readonly="is_readonly"></el-input>
						<div class="bai">%</div>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.requirements" :readonly="is_readonly" type="textarea" autosize placeholder="输入指标要求"></el-input>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.criteria" :readonly="is_readonly" type="textarea" autosize placeholder="输入评分标准"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_score">
						<el-input class="rule-input-edit" type="number" v-model="item.score" :readonly="is_score_readonly" placeholder="输入得分"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_setting">
						<el-button type="text" size="small" @click="addItem('3',index)">插入</el-button>
						<el-button type="text" size="small" @click="deleteItem('3',index)">删除</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="total_score border_bottom" v-if="is_score">
			<div class="item_label font_weight">总分</div>
			<div class="score_value">{{user_info.score}}分</div>
		</div>
		<div class="total_score">
			<div class="item_label font_weight">审批</div>
			<div class="examination_content">
				<div class="examination_item border_bottom">
					<div class="examination_label font_weight">考核人</div>
					<div class="examination_value">
						<el-select v-model="assessment_id" size="small" :disabled="is_disabled" clearable filterable placeholder="请选择">
							<el-option
							v-for="item in user_list"
							:key="item.ding_user_id"
							:label="item.ding_user_name"
							:value="item.ding_user_id">
						</el-option>
					</el-select>
				</div>
			</div>
			<div class="examination_item">
				<div class="examination_label font_weight">抄送人</div>
				<div class="examination_value">
					<el-select v-model="cc_people_ids" size="small" :disabled="is_disabled" clearable filterable multiple placeholder="请选择">
						<el-option
						v-for="item in user_list"
						:key="item.ding_user_id"
						:label="item.ding_user_name"
						:value="item.ding_user_id">
					</el-option>
				</el-select>
			</div>
		</div>
	</div>
</div>
</div>
<el-dialog width="30%" title="反馈意见" @close="closeFeedBack" :visible.sync="show_feedback" append-to-body>
	<el-input v-model="feedback" :readonly="feedback_readonly" type="textarea" :autosize="{ minRows: 3}" placeholder="输入反馈意见"></el-input>
	<div slot="footer" class="dialog-footer" v-if="!feedback_readonly">
		<el-button size="small" @click="show_feedback = false">取消</el-button>
		<el-button size="small" type="primary" @click="submitFeedBack">确认</el-button>
	</div>
</el-dialog>
<!-- 添加、编辑、评分 -->
<div slot="footer" class="dialog-footer" v-if="dialog_type == '1' || dialog_type == '3' || dialog_type == '4'">
	<el-button size="small" @click="show_progress = false">取 消</el-button>
	<el-button size="small" type="primary" @click="submit">提交</el-button>
</div>
<!-- 查看 -->
<div slot="footer" class="dialog-footer" v-if="dialog_type == '2'">
	<!-- 审核人&&已确认 || 自己&&已添加 -->
	<el-button size="small" type="primary" v-if="(user_info.type == '2' && user_info.status == '2') || (user_info.type == '4' && user_info.status == '1')" @click="show_feedback = true">反馈</el-button>
	<!-- （审核人 || 自己）&& 已反馈 -->
	<el-button size="small" type="primary" v-if="(user_info.type == '1' || user_info.type == '2' || user_info.type == '4') && user_info.status == '3'" @click="lookFeedBack">查看反馈</el-button>
	<!-- 自己&&已添加 -->
	<el-button size="small" type="primary" @click="confirmKpi" v-if="user_info.type == '4' && user_info.status == '1'">确认</el-button>
	<!-- 审核人&&已确认 -->
	<el-button size="small" type="primary" @click="passKpi" v-if="user_info.type == '2' && user_info.status == '2'">通过</el-button>
</div>
</el-dialog>
</div>
</template>
<style lang="less" scoped>
.table_setting{
	margin-bottom: 14px;
	display: flex;
	justify-content: flex-end;
}
.review_box{
	border-top:1px solid #D8D8D8;
	border-left:1px solid #D8D8D8;
	border-bottom:1px solid #D8D8D8;
	font-size:14px;
	color: #333;
	.user_content{
		display: flex;
		.user_item{
			border-right:1px solid #D8D8D8;
			flex: 1;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.user_name{
			width:150px;
			border-right:1px solid #D8D8D8;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.performance_item{
		display: flex;
		.item_content{
			flex: 1;
			.content_row{
				display: flex;
				.column_item{
					border-right:1px solid #D8D8D8;
					min-height: 40px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.min_width{
					width:120px;
				}
				.max_width{
					flex: 1;
				}
				.bai{
					position: relative;
					right: 15px;
				}
			}
		}
	}
	.item_label{
		border-right:1px solid #D8D8D8;
		width:150px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.total_score{
		display: flex;
		.score_value{
			border-right:1px solid #D8D8D8;
			height: 40px;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.examination_content{
			border-right:1px solid #D8D8D8;
			flex: 1;
			.examination_item{
				display: flex;
				.examination_label{
					border-right:1px solid #D8D8D8;
					min-height: 50px;
					width:240px;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.examination_value{
					padding-left: 24px;
					flex: 1;
					display: flex;
					align-items: center;
				}
			}
		}
	}
}
.border_bottom{
	border-bottom:1px solid #D8D8D8;
}
.font_weight{
	font-weight:700;
}
.rule-input-edit ::v-deep {
	.el-input__inner {
		border: 0;
		border-radius: 0px;
		text-align: center;
	}
	.el-textarea__inner{
		border: 0;
		border-radius: 0px;
		text-align: center;
		resize: none;
	}
}
.widget_input{
	width:60px;
}
/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
	-webkit-appearance: none !important;
}
/deep/ input[type='number'] {
	-moz-appearance: textfield !important;
}
</style>
<script>
	import {getCurrentMonth} from '../../api/nowMonth.js'
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				req:{
					search:"",
					date:getCurrentMonth(),
					status:"0",
					page:1,
					pagesize:10
				},
				performance_list:[{
					id:"0",
					name:"未添加"
				},{
					id:"1",
					name:"已添加"
				},{
					id:"2",
					name:"已确认"
				},{
					id:"3",
					name:"已反馈"
				},{
					id:"4",
					name:"通过"
				},{
					id:"5",
					name:"已打分"
				}],									//绩效状态					
				dataObj:{},							//列表数据
				show_progress:false,				//考核评分表
				dialog_type:'1',					//1:添加；2:查看；3:编辑；4:评分
				show_feedback:false,				//反馈意见
				is_readonly:false,					//内容输入框是否只读
				is_score_readonly:false,			//得分输入框是否只读
				is_disabled:false,					//审批是否禁用
				is_setting:true,					//是否显示操作栏
				is_score:true,						//是否显示得分栏
				user_list:[],						//用户列表（审批）
				user_info:{},						//用户信息
				achievement: [],					//业绩绩效
				action: [],							//行为考核
				bonus_items: [],					//加分项
				total_score:"",						//总分
				assessment_id:'',					//选中的考核人id
				cc_people_ids:[],					//选中的抄送人id列表
				feedback:"",						//反馈内容
				feedback_readonly:false,			//反馈只读
			}
		},
		created(){
			//获取列表数据
			this.getData();
			//获取所有用户
			this.getUserList();
		},
		methods:{
			//获取列表数据
			getData(){
				resource.kpiList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取所有用户
			getUserList(){
				resource.ajaxUser().then(res => {
					if(res.data.code == 1){
						this.user_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//大弹框关闭
			closeDialog(){
				this.show_feedback = false;					//反馈弹框
				this.is_setting = true;						//操作栏
				this.is_score = true;						//得分栏
				this.is_readonly = false;					//其他信息只读
				this.is_score_readonly = false;				//分数只读
				this.is_disabled = false;					//审批下拉框禁用
				this.user_info = {};						//用户信息
				this.achievement = [];						//业绩绩效
				this.action = [];							//行为考核
				this.bonus_items = [];						//加分项
				this.total_score = "";						//总分
				this.assessment_id = '';					//选中的考核人id
				this.cc_people_ids = [];					//选中的抄送人id列表
			},
			//反馈弹框关闭
			closeFeedBack(){
				this.feedback = "";						//反馈内容
				this.feedback_readonly = false;			//反馈只读
			},
			//查看kpi详情
			kpiDetail(type,id){
				resource.kpiDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.dialog_type = type;
						this.show_progress = true;
						this.is_readonly = true;					
						this.is_disabled = true;
						this.is_setting = false;
						this.achievement = res.data.data.achievement;
						this.action = res.data.data.action;
						this.bonus_items = res.data.data.bonus_items;
						this.user_info = res.data.data.info;
						this.is_score = this.user_info.status == 4&&this.dialog_type == '4'?true:false;
						this.is_score_readonly = this.user_info.status == 4?false:true;
						this.assessment_id = res.data.data.copyer[0].ding_user_id;
						this.cc_people_ids = [];
						res.data.data.copyer.map(item => {
							this.cc_people_ids.push(item.ding_user_id);
						})
						this.cc_people_ids.shift();
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//确认
			confirmKpi(){
				this.$confirm('确认后考核人要开始考核了，是否确认?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.confirmKpi({id:this.user_info.kpi_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success('已确认');
							this.show_progress = false;
							//获取列表数据
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//通过
			passKpi(){
				this.$confirm('确认通过?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.passKpi({id:this.user_info.kpi_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success('已通过');
							this.show_progress = false;
							//获取列表数据
							this.getData();
						}else{
							this.$message.warning(res.data.msg);
						}
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消'
					});          
				});
			},
			//添加kpi
			addKpiGet(kpi_id){
				resource.addKpiGet({id:kpi_id}).then(res => {
					if(res.data.code == 1){
						this.dialog_type = '1';
						this.user_info = res.data.data.info;
						this.show_progress = true;
						this.is_score = false;
						let obj = {
							criteria: '',
							project: '',
							requirements: '',
							weight: ''
						}
						let pushObj1 = JSON.parse(JSON.stringify(obj));
						this.achievement.push(pushObj1);
						let pushObj2 = JSON.parse(JSON.stringify(obj));
						this.action.push(pushObj2);
						let pushObj3 = JSON.parse(JSON.stringify(obj));
						this.bonus_items.push(pushObj3);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//向某一考核项增加子项
			addItem(type,index){
				//type=1,业绩绩效；type=2,行为考核；type=3,加分项
				let obj = {
					criteria: '',
					project: '',
					requirements: '',
					weight: ''
				}
				if(type == '1'){
					this.achievement.splice(index+1, 0, obj);
				}else if(type == '2'){
					this.action.splice(index+1, 0, obj);
				}else if(type == '3'){
					this.bonus_items.splice(index+1, 0, obj);
				}
			},
			//删除某一考核项的子项
			deleteItem(type,index){
				if(type == '1'){
					if(this.achievement.length > 1){
						this.achievement.splice(index, 1);
					}else{
						this.$message.warning('至少保留一条');
					}
				}else if(type == '2'){
					if(this.action.length > 1){
						this.action.splice(index, 1);
					}else{
						this.$message.warning('至少保留一条');
					}
				}else if(type == '3'){
					if(this.bonus_items.length > 1){
						this.bonus_items.splice(index, 1);
					}else{
						this.$message.warning('至少保留一条');
					}
				}
			},
			//确认（评分/添加/编辑）
			submit(){
				if(this.dialog_type == '4'){		//评分
					this.scores();
				}else{
					var achievement_total = 0;			//业绩绩效总权重
					var action_total = 0;				//行为考核总权重
					var bonus_items_total = 0;			//加分项总权重
					//业绩绩效
					for(var i = 0;i < this.achievement.length;i ++){
						if(this.achievement[i].project == '' || this.achievement[i].weight == '' || this.achievement[i].requirements == '' || this.achievement[i].criteria == ''){
							this.$message.warning('业绩绩效内有未完善的考核项！');
							return;
						}
						delete this.achievement[i].score;
						delete this.achievement[i].type;
						achievement_total += parseFloat(this.achievement[i].weight);
					}
					if(achievement_total != 100){
						this.$message.warning('业绩绩效权重总和必须是100%！');
						return;
					}
					//行为考核
					for(var i = 0;i < this.action.length;i ++){
						if(this.action[i].project == '' || this.action[i].weight == '' || this.action[i].requirements == '' || this.action[i].criteria == ''){
							this.$message.warning('行为考核内有未完善的考核项！');
							return;
						}
						delete this.action[i].score;
						delete this.action[i].type;
						action_total += parseFloat(this.action[i].weight);
					}
					if(action_total != 100){
						this.$message.warning('行为考核权重总和必须是100%！');
						return;
					}
					//加分项
					var unnull_bonus_items = 0;	//不为空的条数
					for(var i = 0;i < this.bonus_items.length;i ++){
						if(this.bonus_items[i].project != '' && this.bonus_items[i].weight != '' && this.bonus_items[i].requirements != '' && this.bonus_items[i].criteria != ''){
							unnull_bonus_items += 1;
							delete this.bonus_items[i].score;
							delete this.bonus_items[i].type;
							bonus_items_total += parseFloat(this.bonus_items[i].weight);
						}
					}
					if(unnull_bonus_items > 0){
						for(var i = 0;i < this.bonus_items.length;i ++){
							if(this.bonus_items[i].project == '' || this.bonus_items[i].weight == '' || this.bonus_items[i].requirements == '' || this.bonus_items[i].criteria == ''){
								this.$message.warning('加分项内有未完善的考核项！');
								return;
							}
						}
						if(bonus_items_total != 100){
							this.$message.warning('加分项权重总和必须是100%！');
							return;
						}
					}
					//审批人
					var Assessor = [];
					if(this.assessment_id == ''){
						this.$message.warning('请选择考核人');
						return;
					}else{
						this.user_list.map(item => {
							if(item.ding_user_id == this.assessment_id){
								Assessor.push(item);
							}
						})
					}
					if(this.cc_people_ids.length < 1){
						this.$message.warning('至少选择一个抄送人');
						return;
					}else{
						this.cc_people_ids.map(id => {
							this.user_list.map(item => {
								if(item.ding_user_id == id){
									Assessor.push(item);
								}
							})
						})
					}
					let req = {
						id:this.user_info.kpi_id,
						achievement:JSON.stringify(this.achievement),
						action:JSON.stringify(this.action),
						bonus_items:JSON.stringify(this.bonus_items),
						Assessor:JSON.stringify(Assessor)
					}
					if(this.dialog_type == '1'){		//添加
						resource.addKpiPost(req).then(res => {
							if(res.data.code == 1){
								this.$message.success('添加成功');
								this.show_progress = false;
								//获取列表数据
								this.getData();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else if(this.dialog_type == '3'){	//编辑
						resource.editKpiPost(req).then(res => {
							if(res.data.code == 1){
								this.$message.success('编辑成功');
								this.show_progress = false;
								//获取列表数据
								this.getData();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
			//评分
			scores(){
				var achievement_scores = [];
				var action_scores = [];
				var bonus_items_scores = [];
				for(var i = 0;i < this.achievement.length;i ++){
					if(this.achievement[i].score && (parseFloat(this.achievement[i].score) >= 0 && parseFloat(this.achievement[i].score) <= 100)){
						let obj = {
							score:this.achievement[i].score,
							id:this.achievement[i].id
						}
						achievement_scores.push(obj);
					}else if(parseFloat(this.achievement[i].score) > 100){
						this.$message.warning('单项考核分数不能低于0或高于100！');
						return;
					}else if(parseFloat(this.achievement[i].score) < 0){
						this.$message.warning('单项考核分数不能低于0或高于100！');
						return;
					}else{
						this.$message.warning('业绩绩效内有未完成的评分！');
						return;
					}
				}
				for(var i = 0;i < this.action.length;i ++){
					if(this.action[i].score){
						let obj = {
							score:this.action[i].score,
							id:this.action[i].id
						}
						action_scores.push(obj);
					}else if(this.action[i].score > 100 || this.action[i].score < 0){
						this.$message.warning('单项考核分数不能低于0或高于100！');
						return;
					}else{
						this.$message.warning('行为考核内有未完成的评分！');
						return;
					}
				}
				for(var i = 0;i < this.bonus_items.length;i ++){
					if(this.bonus_items[i].score){
						let obj = {
							score:this.bonus_items[i].score,
							id:this.bonus_items[i].id
						}
						bonus_items_scores.push(obj);
					}else if(this.bonus_items[i].score > 100 || this.bonus_items[i].score < 0){
						this.$message.warning('单项考核分数不能低于0或高于100！');
						return;
					}else{
						this.$message.warning('加分项内有未完成的评分！');
						return;
					}
				}
				console.log(scores);
					// resource.addKpiPost(req).then(res => {
					// 	if(res.data.code == 1){
					// 		this.$message.success('添加成功');
					// 		this.show_progress = false;
					// 		//获取列表数据
					// 		this.getData();
					// 	}else{
					// 		this.$message.warning(res.data.msg);
					// 	}
					// })
				},
			//提交反馈
			submitFeedBack(){
				if(this.feedback == ''){
					this.$message.warning('请输入反馈内容！');
				}else{
					let req = {
						id:this.user_info.kpi_id,
						remark:this.feedback
					}
					resource.feedBack(req).then(res => {
						if(res.data.code == 1){
							this.$message.success('反馈已提交');
							this.show_progress = false;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//查看反馈
			lookFeedBack(){
				this.feedback = this.user_info.remark;
				this.feedback_readonly = true;
				this.show_feedback = true;
			},
			//编辑
			editItem(kpi_id){
				resource.editKpiGet({id:kpi_id}).then(res => {
					if(res.data.code == 1){
						this.dialog_type = '3',
						this.achievement = res.data.data.achievement,
						this.action = res.data.data.action,
						this.bonus_items = res.data.data.bonus_items,
						this.user_info = res.data.data.info;
						this.is_score = false;
						this.assessment_id = res.data.data.copyer[0].ding_user_id;
						this.cc_people_ids = [];
						res.data.data.copyer.map(item => {
							this.cc_people_ids.push(item.ding_user_id);
						})
						this.cc_people_ids.shift();
						this.show_progress = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//判断列表按钮是否显示
			isShow(tag,type,status){
				if(tag == '1' && type == '1' && status == '0'){	//添加
					return true;
				}else if(tag == '2' && type == '1' && (status == '1' || status == '3')){//编辑
					return true;
				}else if(tag == '3' && status != '0'){//查看
					return true;
				}else if(tag == '4' && type == '1' && status == '4'){//评分
					return true;
				}else if(tag == '5' && (type == '1' || type == '3') && (status == '4' || status == '5')){//打印
					return true;
				}
			},
			//打印
			downLoad(){

			},
			//分页
			handleSizeChange(val) {
				this.req.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getData();
			},
		}
	}
</script>










