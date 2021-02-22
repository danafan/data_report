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
				<el-button type="text" size="small" v-if="isShow('1',scope.row.type,scope.row.status)" @click="addKpi(scope.row.kpi_id)">添加</el-button>
				<el-button type="text" size="small" v-if="isShow('2',scope.row.type,scope.row.status)">编辑</el-button>
				<el-button type="text" size="small" v-if="isShow('3',scope.row.type,scope.row.status)" @click="kpiDetail(scope.row.kpi_id)">查看</el-button>
				<el-button type="text" size="small" v-if="isShow('4',scope.row.type,scope.row.status)">评分</el-button>
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
					<div class="column_item min_width font_weight">得分</div>
					<div class="column_item min_width font_weight" v-if="is_setting">操作</div>
				</div>
				<div class="content_row" :class="{'border_bottom':index < achievement.length - 1}" v-for="(item,index) in achievement">
					<div class="column_item min_width">{{index + 1}}</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.project" :readonly="is_readonly" type="textarea" autosize placeholder="输入考核项目"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit widget_input" v-model="item.weight" :readonly="is_readonly"></el-input>
						<div class="bai">%</div>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.requirements" :readonly="is_readonly" type="textarea" autosize placeholder="输入指标要求"></el-input>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.criteria" :readonly="is_readonly" type="textarea" autosize placeholder="输入评分标准"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit" type="number" v-model="item.score" :readonly="is_score_readonly" placeholder="输入得分"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_setting">
						<el-button type="text" size="small">插入</el-button>
						<el-button type="text" size="small">删除</el-button>
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
					<div class="column_item min_width font_weight">得分</div>
					<div class="column_item min_width font_weight" v-if="is_setting">操作</div>
				</div>
				<div class="content_row" :class="{'border_bottom':index < action.length - 1}" v-for="(item,index) in action">
					<div class="column_item min_width">{{index + 1}}</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.project" :readonly="is_readonly" type="textarea" autosize placeholder="输入考核项目"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit widget_input" v-model="item.weight" :readonly="is_readonly"></el-input>
						<div class="bai">%</div>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.requirements" :readonly="is_readonly" type="textarea" autosize placeholder="输入指标要求"></el-input>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.criteria" :readonly="is_readonly" type="textarea" autosize placeholder="输入评分标准"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit" type="number" v-model="item.score" :readonly="is_score_readonly" placeholder="输入得分"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_setting">
						<el-button type="text" size="small">插入</el-button>
						<el-button type="text" size="small">删除</el-button>
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
					<div class="column_item min_width font_weight">得分</div>
					<div class="column_item min_width font_weight" v-if="is_setting">操作</div>
				</div>
				<div class="content_row" :class="{'border_bottom':index < bonus_items.length - 1}" v-for="(item,index) in bonus_items">
					<div class="column_item min_width">{{index + 1}}</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.project" :readonly="is_readonly" type="textarea" autosize placeholder="输入考核项目"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit widget_input" v-model="item.weight" :readonly="is_readonly"></el-input>
						<div class="bai">%</div>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.requirements" :readonly="is_readonly" type="textarea" autosize placeholder="输入指标要求"></el-input>
					</div>
					<div class="column_item max_width">
						<el-input class="rule-input-edit" v-model="item.criteria" :readonly="is_readonly" type="textarea" autosize placeholder="输入评分标准"></el-input>
					</div>
					<div class="column_item min_width">
						<el-input class="rule-input-edit" type="number" v-model="item.score" :readonly="is_score_readonly" placeholder="输入得分"></el-input>
					</div>
					<div class="column_item min_width" v-if="is_setting">
						<el-button type="text" size="small">插入</el-button>
						<el-button type="text" size="small">删除</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="total_score border_bottom">
			<div class="item_label font_weight">总分</div>
			<div class="score_value">89分</div>
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
<el-dialog width="30%" title="反馈意见" :visible.sync="show_feedback" append-to-body>
</el-dialog>
<div slot="footer" class="dialog-footer">
	<el-button size="small" @click="show_progress = false">取 消</el-button>
	<!-- <el-button size="small" type="primary" @click="show_feedback = true">反馈</el-button> -->
	<el-button size="small" type="primary" @click="submit">提交</el-button>
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
				show_feedback:false,				//反馈意见
				is_readonly:false,					//内容输入框是否只读
				is_score_readonly:false,			//等分输入框是否只读
				is_disabled:false,					//审批是否禁用
				is_setting:true,					//是否显示操作栏
				user_list:[],						//用户列表（审批）
				user_info:{},						//用户信息
				achievement: [],					//业绩绩效
				action: [],							//行为考核
				bonus_items: [],					//加分项
				total_score:"",						//总分
				assessment_id:'',					//选中的考核人id
				cc_people_ids:[],					//选中的抄送人id列表
			}
		},
		created(){
			//获取列表数据
			// this.getData();
			//获取所有用户
			// this.getUserList();
			this.addKpi();
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
			//弹框关闭
			closeDialog(){
				this.user_info = {};						//用户信息
				this.achievement = [];					//业绩绩效
				this.action = [];							//行为考核
				this.bonus_items = [];					//加分项
				this.total_score = "";						//总分
				this.assessment_id = '';					//选中的考核人id
				this.cc_people_ids = [];					//选中的抄送人id列表
			},
			//查看kpi详情
			kpiDetail(id){
				resource.kpiDetail({id:id}).then(res => {
					if(res.data.code == 1){
						this.show_progress = true;
						this.is_readonly = true;					
						this.is_score_readonly = true;
						this.is_disabled = true;
						this.is_setting = false;
						this.achievement = res.data.data.achievement;
						this.action = res.data.data.action;
						this.bonus_items = res.data.data.bonus_items;
						this.user_info = res.data.data.info;
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
			//添加kpi
			addKpi(){
				this.show_progress = true;
				let obj = {
					criteria: '',
					project: '',
					requirements: '',
					score: '',
					weight: '100'
				}
				let pushObj1 = JSON.parse(JSON.stringify(obj));
				this.achievement.push(pushObj1);
				let pushObj2 = JSON.parse(JSON.stringify(obj));
				this.action.push(pushObj2);
				let pushObj3 = JSON.parse(JSON.stringify(obj));
				this.bonus_items.push(pushObj3);
				// resource.addKpi({id:kpi_id}).then(res => {
				// 	if(res.data.code == 1){
				// 		this.user_info = res.data.data.info;
				// 		this.show_progress = true;
				// 		let obj = {
				// 			criteria: '',
				// 			project: '',
				// 			requirements: '',
				// 			score: '',
				// 			weight: ''
				// 		}
				// 		let pushObj1 = JSON.parse(JSON.stringify(obj));
				// 		this.achievement.push(pushObj1);
				// 		let pushObj2 = JSON.parse(JSON.stringify(obj));
				// 		this.action.push(pushObj2);
				// 		// this.bonus_items.push(pushObj);
				// 	}else{
				// 		this.$message.warning(res.data.msg);
				// 	}
				// })
			},
			//确认提交
			submit(){

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










