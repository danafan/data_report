<template>
	<div>
		<div class="title">当天完成情况：{{view_obj.today.title}}</div>
		<div class="cate_row">
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="today_xssryg"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">销售收入预估</div>
						<div class="row_item">销售收入日目标</div>
						<div class="row_item">销售收入日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.today.xssryg}}</div>
						<div class="row_item border_bottom">{{view_obj.today.rmb_xssr}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.today.rmb_xssrwcl}}%</div>
					</div>
				</div>
			</div>
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="today_gxmyyg"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">贡献毛益预估</div>
						<div class="row_item">贡献毛益日目标</div>
						<div class="row_item">贡献毛益日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.today.gxmyyg}}</div>
						<div class="row_item border_bottom">{{view_obj.today.rmb_gxmy}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.today.rmb_gxmywcl}}%</div>
					</div>
				</div>
			</div>
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="today_yxfy"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">营销费用预估</div>
						<div class="row_item">营销费用日目标</div>
						<div class="row_item">营销费用日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.today.yxfy}}</div>
						<div class="row_item border_bottom">{{view_obj.today.rmb_yxfy}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.today.yxfyrwcl}}%</div>
					</div>
				</div>
			</div>
		</div>
		<div class="title">当周完成情况：{{view_obj.week.title}}</div>
		<div class="cate_row">
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="week_xssryg"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">销售收入预估</div>
						<div class="row_item">销售收入日目标</div>
						<div class="row_item">销售收入日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.week.xssryg}}</div>
						<div class="row_item border_bottom">{{view_obj.week.rmb_xssr}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.week.rmb_xssrwcl}}%</div>
					</div>
				</div>
			</div>
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="week_gxmyyg"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">贡献毛益预估</div>
						<div class="row_item">贡献毛益日目标</div>
						<div class="row_item">贡献毛益日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.week.gxmyyg}}</div>
						<div class="row_item border_bottom">{{view_obj.week.rmb_gxmy}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.week.rmb_gxmywcl}}%</div>
					</div>
				</div>
			</div>
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="week_yxfy"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">营销费用预估</div>
						<div class="row_item">营销费用日目标</div>
						<div class="row_item">营销费用日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.week.yxfy}}</div>
						<div class="row_item border_bottom">{{view_obj.week.rmb_yxfy}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.week.yxfyrwcl}}%</div>
					</div>
				</div>
			</div>
		</div>
		<div class="title">当月完成情况：{{view_obj.month.title}}月</div>
		<div class="cate_row">
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="month_xssryg"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">销售收入预估</div>
						<div class="row_item">销售收入日目标</div>
						<div class="row_item">销售收入日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.month.xssryg}}</div>
						<div class="row_item border_bottom">{{view_obj.month.rmb_xssr}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.month.rmb_xssrwcl}}%</div>
					</div>
				</div>
			</div>
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="month_gxmyyg"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">贡献毛益预估</div>
						<div class="row_item">贡献毛益日目标</div>
						<div class="row_item">贡献毛益日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.month.gxmyyg}}</div>
						<div class="row_item border_bottom">{{view_obj.month.rmb_gxmy}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.month.rmb_gxmywcl}}%</div>
					</div>
				</div>
			</div>
			<div class="cate_item" v-loading="loading">
				<div class="echarts_box" id="month_yxfy"></div>
				<div class="item_table">
					<div class="table_header">
						<div class="row_item">营销费用预估</div>
						<div class="row_item">营销费用日目标</div>
						<div class="row_item">营销费用日完成预估率</div>
					</div>
					<div class="table_content">
						<div class="row_item border_bottom border_top">{{view_obj.month.yxfy}}</div>
						<div class="row_item border_bottom">{{view_obj.month.rmb_yxfy}}</div>
						<div class="row_item border_bottom green_color">{{view_obj.month.yxfyrwcl}}%</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.title{
	font-weight: bold;
	color: #FD7B08;
}
.cate_row{
	border-bottom:1px solid #dcdcdc;
	margin-bottom: 50px;
	display: flex;
	justify-content: space-around;
	.cate_item{
		width: 340px;
		display:flex;
		flex-direction: column;
		align-items: center;
		.echarts_box{
			width: 320px;
			height: 300px;
		}
		.item_table{
			width: 340px;
			display:flex;
			font-size: 14px;
			.table_header{
				width: 180px;
				background: #FD7B08;
				color: #fff;
			}
			.table_content{
				background: #EFEFEF;
				flex: 1;
				color: #333;
			}
			.row_item{
				height: 40px;
				line-height: 40px;
				padding-left: 10px;
			}
			.border_bottom{
				border-bottom: 1px solid #dcdcdc;
			}
			.border_top{
				border-top: 1px solid #dcdcdc;
			}
			.green_color{
				color: green;
			}
		}
	}

}
</style>
<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				today_xssrygChart:null,
				view_obj:{
					today: {},
					week: {},
					month: {}
				},
				loading:false
			}
		},
		props:{
			dept_id:{
				type:String,
				default:""
			},
			shop_id:{
				type:String,
				default:""
			},
			tjrq:{
				type:String,
				default:""
			},
			platform:{
				type:String,
				default:""
			}
		},
		watch:{
			dept_id:function(n,o){
				//获取列表
				this.getList();
			},
			shop_id:function(n,o){
				//获取列表
				this.getList();
			},
			tjrq:function(n,o){
				//获取列表
				this.getList();
			},
			platform:function(n,o){
				//获取列表
				this.getList();
			}
		},
		created(){
			//获取列表
			this.getList();
		},
		methods:{
			//获取列表
			getList(){
				let req = {
					dept_id:this.dept_id,
					shop_id:this.shop_id,
					tjrq:this.tjrq,
					platform:this.platform
				}
				this.loading = true;
				resource.targetFinish(req).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.view_obj = res.data.data;
						var echarts = require("echarts");

						//日-销售收入预估
						var today_xssryg = document.getElementById('today_xssryg');
						this.today_xssrygChart = echarts.init(today_xssryg);
						this.today_xssrygChart.setOption(this.option(this.view_obj.today.rmb_xssrwcl));
						var _this = this;
						//日-贡献毛益预估
						var today_gxmyyg = document.getElementById('today_gxmyyg');
						this.today_gxmyygChart = echarts.init(today_gxmyyg);
						this.today_gxmyygChart.setOption(this.option(this.view_obj.today.rmb_gxmywcl));
						//日-营销费用预估
						var today_yxfy = document.getElementById('today_yxfy');
						this.today_yxfyChart = echarts.init(today_yxfy);
						this.today_yxfyChart.setOption(this.option(this.view_obj.today.yxfyrwcl));
						//周-销售收入预估
						var week_xssryg = document.getElementById('week_xssryg');
						this.week_xssrygChart = echarts.init(week_xssryg);
						this.week_xssrygChart.setOption(this.option(this.view_obj.week.rmb_xssrwcl));
						//周-贡献毛益预估
						var week_gxmyyg = document.getElementById('week_gxmyyg');
						this.week_gxmyygChart = echarts.init(week_gxmyyg);
						this.week_gxmyygChart.setOption(this.option(this.view_obj.week.rmb_gxmywcl));
						//周-营销费用预估
						var week_yxfy = document.getElementById('week_yxfy');
						this.week_yxfyChart = echarts.init(week_yxfy);
						this.week_yxfyChart.setOption(this.option(this.view_obj.week.yxfyrwcl));
						//月-销售收入预估
						var month_xssryg = document.getElementById('month_xssryg');
						this.month_xssrygChart = echarts.init(month_xssryg);
						this.month_xssrygChart.setOption(this.option(this.view_obj.month.rmb_xssrwcl));
						//月-贡献毛益预估
						var month_gxmyyg = document.getElementById('month_gxmyyg');
						this.month_gxmyygChart = echarts.init(month_gxmyyg);
						this.month_gxmyygChart.setOption(this.option(this.view_obj.month.rmb_gxmywcl));
						//月-营销费用预估
						var month_yxfy = document.getElementById('month_yxfy');
						this.month_yxfyChart = echarts.init(month_yxfy);
						this.month_yxfyChart.setOption(this.option(this.view_obj.month.yxfyrwcl));
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			},
			//仪表盘
			option(value){
				return {
					series: [{
						type: 'gauge',
								center: ["50%", "60%"], // 仪表位置
                   				radius: "100%", //仪表大小
                   				startAngle: 215,
                   				endAngle: -35,
                   				min: 0,
                   				max: 100,
                   				splitNumber: 2,
                   				itemStyle: {
                   					color: '#FD7B08',
                   				},
                   				progress: {
                   					show: true,
                   					roundCap: true,
                   					width: 18
                   				},
                   				pointer: {
                   					icon: 'path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z',
                   					length: '75%',
                   					width: 16,
                   					offsetCenter: [0, '5%']
                   				},
                   				axisLine: {
                   					roundCap: true,
                   					lineStyle: {
                   						width: 18
                   					}
                   				},
                   				axisTick: {
                   					splitNumber: 2,
                   					lineStyle: {
                   						width: 2,
                   						color: '#999'
                   					}
                   				},
                   				splitLine: {
                   					length: 12,
                   					lineStyle: {
                   						width: 3,
                   						color: '#999'
                   					}
                   				},
                   				axisLabel: {
                   					distance: 20,
                   					color: '#999',
                   					formatter: '{value} %'
                   				},
                   				title: {
                   					show: false
                   				},
                   				detail: {
                   					backgroundColor: '#fff',
                   					borderColor: '#999',
                   					width: '60%',
                   					lineHeight: 40,
                   					height: 40,
                   					borderRadius: 8,
                   					offsetCenter: [0, '35%'],
                   					valueAnimation: true,
                   					formatter: function (value) {
                   						return '{value|' + value.toFixed(2) + '}{unit|%}';
                   					},
                   					rich: {
                   						value: {
                   							fontSize: 20,
                   							fontWeight: 'bolder',
                   							color: '#333'
                   						},
                   						unit: {
                   							fontSize: 20,
                   							fontWeight: 'bolder',
                   							color: '#333',
                   						}
                   					}
                   				},
                   				data: [{
                   					value: value
                   				}]
                   			}]
                   		}
                   	}
                   }
               }
           </script>