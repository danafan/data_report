<template>
	<div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="年份：">
				<el-date-picker v-model="year" value-format="yyyy" :clearable="false" type="year" placeholder="选择年">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="周数：">
				<el-select v-model="week" placeholder="全部" @change="changeWeek">
					<el-option v-for="item in week_list" :key="item.weeks" :label="item.weeks" :value="item.weeks">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item v-if="start_date != '' && end_date != ''">
				{{start_date}} 至 {{end_date}}
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="flex jsb mb30">
			<div class="view_table flex fcol">
				<div class="table_title">
					<PopoverWidget class="margin_bottom" title="销售收入" keys="zjyjb_xssr"/>
				</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 wrap jsb" v-else>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{xssr_info.week_target}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{xssr_info.week_actual}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">周目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{xssr_info.week_rate}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{xssr_info.month_target}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{xssr_info.month_actual}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">月目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{xssr_info.month_rate}}%</div>
					</div>
				</div>
			</div>
			<div class="movement_table flex fcol">
				<div class="table_title">最近四周数据走势</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 as jc" v-loading="content_loading" v-else>
					<div class="four_table">
						<div class="four_row flex" v-for="item in xssr_four_week">
							<div class="row_label tc">{{item.weeks}}周</div>
							<div class="row_value tc">{{item.xssr}}万</div>
						</div>
					</div>
				</div>
			</div>
			<div class="chart flex-1" id="xssr_chart" v-loading="content_loading"></div>
		</div>
		<div class="flex jsb mb30">
			<div class="view_table flex fcol">
				<div class="table_title">
					<PopoverWidget class="margin_bottom" title="营销费用" keys="zjyjb_yxfy"/>
				</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 wrap jsb" v-else>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{yxfy_info.week_target}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{yxfy_info.week_actual}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">周目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{yxfy_info.week_rate}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{yxfy_info.month_target}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{yxfy_info.month_actual}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">月目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{yxfy_info.month_rate}}%</div>
					</div>
				</div>
			</div>
			<div class="movement_table flex fcol">
				<div class="table_title">最近四周数据走势</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 as jc" v-loading="content_loading" v-else>
					<div class="four_table">
						<div class="four_row flex" v-for="item in yxfy_four_week">
							<div class="row_label tc">{{item.weeks}}周</div>
							<div class="row_value tc">{{item.yxfy}}万</div>
						</div>
					</div>
				</div>
			</div>
			<div class="chart flex-1" id="yxfy_chart" v-loading="content_loading"></div>
		</div>
		<div class="flex jsb mb30">
			<div class="view_table flex fcol">
				<div class="table_title">
					<PopoverWidget class="margin_bottom" title="贡献毛益" keys="zjyjb_gxmy"/>
				</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 wrap jsb" v-else>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxml_info.week_target}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxml_info.week_actual}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">周目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxml_info.week_rate}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxml_info.month_target}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxml_info.month_actual}}万</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">月目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxml_info.month_rate}}%</div>
					</div>
				</div>
			</div>
			<div class="movement_table flex fcol">
				<div class="table_title">最近四周数据走势</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 as jc" v-loading="content_loading" v-else>
					<div class="four_table">
						<div class="four_row flex" v-for="item in gxml_four_week">
							<div class="row_label tc">{{item.weeks}}周</div>
							<div class="row_value tc">{{item.gx_ml}}万</div>
						</div>
					</div>
				</div>
			</div>
			<div class="chart flex-1" id="gxml_chart" v-loading="content_loading"></div>
		</div>
		<div class="flex jsb mb30">
			<div class="view_table flex fcol">
				<div class="table_title">
					<PopoverWidget class="margin_bottom" title="贡献毛益率" keys="zjyjb_gxmyl"/>
				</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 wrap jsb" v-else>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxmyl_info.week_target}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本周实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxmyl_info.week_actual}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">周目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxmyl_info.week_rate}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月目标</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxmyl_info.month_target}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">本月实际</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxmyl_info.month_actual}}%</div>
					</div>
					<div class="view_item flex fcol" v-loading="content_loading">
						<div class="view_item_title flex-1 flex ac jc">月目标完成率</div>
						<div class="view_item_value flex-1 flex ac jc">{{gxmyl_info.month_rate}}%</div>
					</div>
				</div>
			</div>
			<div class="movement_table flex fcol">
				<div class="table_title">最近四周数据走势</div>
				<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
				<div class="table_content flex flex-1 as jc" v-loading="content_loading" v-else>
					<div class="four_table">
						<div class="four_row flex" v-for="item in gxmyl_four_week">
							<div class="row_label tc">{{item.weeks}}周</div>
							<div class="row_value tc">{{item.gxmyl}}%</div>
						</div>
					</div>
				</div>
			</div>
			<div class="chart flex-1" id="gxmyl_chart" v-loading="content_loading"></div>
		</div>
		<div class="flex jsb mb30">
			<div class="view_table flex fcol">
				<div class="table_title">
					<PopoverWidget class="margin_bottom" title="预估净利" keys="zjyjb_ygjl"/></div>
					<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
					<div class="table_content flex flex-1 wrap jsb" v-else>
						<div class="view_item flex fcol" v-loading="content_loading">
							<div class="view_item_title flex-1 flex ac jc">本周目标</div>
							<div class="view_item_value flex-1 flex ac jc">{{jlr_info.week_target}}万</div>
						</div>
						<div class="view_item flex fcol" v-loading="content_loading">
							<div class="view_item_title flex-1 flex ac jc">本周实际</div>
							<div class="view_item_value flex-1 flex ac jc">{{jlr_info.week_actual}}万</div>
						</div>
						<div class="view_item flex fcol" v-loading="content_loading">
							<div class="view_item_title flex-1 flex ac jc">周目标完成率</div>
							<div class="view_item_value flex-1 flex ac jc">{{jlr_info.week_rate}}%</div>
						</div>
						<div class="view_item flex fcol" v-loading="content_loading">
							<div class="view_item_title flex-1 flex ac jc">本月目标</div>
							<div class="view_item_value flex-1 flex ac jc">{{jlr_info.month_target}}万</div>
						</div>
						<div class="view_item flex fcol" v-loading="content_loading">
							<div class="view_item_title flex-1 flex ac jc">本月实际</div>
							<div class="view_item_value flex-1 flex ac jc">{{jlr_info.month_actual}}万</div>
						</div>
						<div class="view_item flex fcol" v-loading="content_loading">
							<div class="view_item_title flex-1 flex ac jc">月目标完成率</div>
							<div class="view_item_value flex-1 flex ac jc">{{jlr_info.month_rate}}%</div>
						</div>
					</div>
				</div>
				<div class="movement_table flex fcol">
					<div class="table_title">最近四周数据走势</div>
					<div class="empty flex flex-1 ac jc" v-if="is_empty">暂无数据</div>
					<div class="table_content flex flex-1 as jc" v-loading="content_loading" v-else>
						<div class="four_table">
							<div class="four_row flex" v-for="item in jlr_four_week">
								<div class="row_label tc">{{item.weeks}}周</div>
								<div class="row_value tc">{{item.jlr}}万</div>
							</div>
						</div>
					</div>
				</div>
				<div class="chart flex-1" id="jlr_chart" v-loading="content_loading"></div>
			</div>
			<div class="flex jsb">
				<div class="width-50 mr30">
					<div class="title">月度</div>
					<div class="top_title">店铺盈利Top10</div>
					<el-table :data="month_yl_data" size="small" style="width: 100%" :header-cell-style="{'background':'#A1161B','color':'#ffffff','text-align': 'center'}" v-loading="month_yl_loading">
						<el-table-column :label="i.label" :prop="i.prop" v-for="i in column_list" show-overflow-tooltip align="center" :width="i.width">
							<template slot-scope="scope">
								<div v-if="i.prop == 'sort'">{{scope.$index + 1}}</div>
								<div v-else>{{scope.row[i.prop]}}{{i.unit?i.unit:""}}</div>
							</template>
						</el-table-column>
					</el-table>
					<div class="top_title">店铺亏损Top10</div>
					<el-table :data="month_ks_data" size="small" style="width: 100%" :header-cell-style="{'background':'#409C45','color':'#333333','text-align': 'center'}" v-loading="month_ks_loading">
						<el-table-column :label="i.label" :prop="i.prop" v-for="i in column_list" show-overflow-tooltip align="center" :width="i.width">
							<template slot-scope="scope">
								<div v-if="i.prop == 'sort'">{{scope.$index + 1}}</div>
								<div v-else>{{scope.row[i.prop]}}{{i.unit?i.unit:""}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="width-50">
					<div class="title">单周</div>
					<div class="top_title">店铺盈利Top10</div>
					<el-table :data="week_yl_data" size="small" style="width: 100%" :header-cell-style="{'background':'#A1161B','color':'#ffffff','text-align': 'center'}" v-loading="week_yl_loading">
						<el-table-column :label="i.label" :prop="i.prop" v-for="i in column_list" show-overflow-tooltip align="center" :width="i.width">
							<template slot-scope="scope">
								<div v-if="i.prop == 'sort'">{{scope.$index + 1}}</div>
								<div v-else>{{scope.row[i.prop]}}{{i.unit?i.unit:""}}</div>
							</template>
						</el-table-column>
					</el-table>
					<div class="top_title">店铺亏损Top10</div>
					<el-table :data="week_ks_data" size="small" style="width: 100%" :header-cell-style="{'background':'#409C45','color':'#333333','text-align': 'center'}" v-loading="week_ks_loading">
						<el-table-column :label="i.label" :prop="i.prop" v-for="i in column_list" show-overflow-tooltip align="center" :width="i.width">
							<template slot-scope="scope">
								<div v-if="i.prop == 'sort'">{{scope.$index + 1}}</div>
								<div v-else>{{scope.row[i.prop]}}{{i.unit?i.unit:""}}</div>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
	</template>
	<script>
		import resource from '../../../api/resource.js'

		import { getCurrentYear } from '../../../api/nowMonth.js'

		import PopoverWidget from '../../../components/popover_widget.vue'
		export default{
			components:{
				PopoverWidget
			},
			data(){
				return{
				year:getCurrentYear(),			//选中的年份
				week_list:[],					//周数列表
				week:"",						//选中的周数
				start_date:"",					//开始日期
				end_date:"",					//结束日期
				content_loading:false,
				xssr_info:{},					//销售收入看板
				xssr_four_week:[],				//销售收入最近四周数据走势
				xssrChart:null,					//销售收入图标
				yxfy_info:{},					//营销费用看板
				yxfy_four_week:[],				//营销费用最近四周数据走势
				yxfyChart:null,					//营销费用图标
				gxml_info:{},					//贡献毛利看板
				gxml_four_week:[],				//贡献毛利最近四周数据走势
				gxmlChart:null,					//贡献毛利图标
				gxmyl_info:{},					//贡献毛利率看板
				gxmyl_four_week:[],				//贡献毛利率最近四周数据走势
				gxmylChart:null,				//贡献毛利率图标
				jlr_info:{},					//贡献毛利率看板
				jlr_four_week:[],				//贡献毛利率最近四周数据走势
				jlrChart:null,					//贡献毛利率图标
				column_list:[{
					label:'排序',
					prop:'sort',
					width:"80"
				},{
					label:'店铺名称',
					prop:'shop_name'
				},{
					label:'预估净利润',
					prop:'jlr',
					width:"120",
					unit:"万"
				}],
				month_yl_data:[],				//月度列表（盈利）
				month_yl_loading:false,			
				month_ks_data:[],				//月度列表（亏损）
				month_ks_loading:false,	
				week_yl_data:[],				//单周列表（盈利）
				week_yl_loading:false,			
				week_ks_data:[],				//单周列表（亏损）
				week_ks_loading:false,			
				is_empty:false,
				empty_option:{
					title: {
						text: '暂无数据~',
						x: 'center',
						y: 'center',
						textStyle: {
							fontSize: 14,
							fontWeight: 'normal',
						}
					}
				},
			}
		},
		watch:{
			//切换年份
			year:function(n,o){
				//获取筛选条件
				this.briefSelect();
			}
		},
		created(){
			//获取筛选条件
			this.briefSelect(true);
		},
		methods:{
			//获取筛选条件
			briefSelect(type){
				resource.briefSelect({year:this.year}).then(res => {
					if(res.data.code == 1){
						this.week_list = res.data.data;
						this.week = this.week_list.length == 0?"":this.week_list[0].weeks;
						this.start_date = this.week_list.length == 0?"":this.week_list[0].start_time;
						this.end_date = this.week_list.length == 0?"":this.week_list[0].end_time;
						if(type){
							//简报内容
							this.briefContent();
							//月度排行(盈利)
							this.briefMonthRank(1)
							//月度排行(亏损)
							this.briefMonthRank(2)
							//单周排行(盈利)
							this.briefWeekRank(1)
							//单周排行(亏损)
							this.briefWeekRank(2)
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换周数
			changeWeek(e){
				let new_arr = this.week_list.filter(item => {
					return item.weeks == e;
				})
				this.start_date = new_arr[0].start_time;
				this.end_date = new_arr[0].end_time;
			},
			//点击搜索
			searchFn(){
				//简报内容
				this.briefContent();
				//月度排行(盈利)
				this.briefMonthRank(1)
				//月度排行(亏损)
				this.briefMonthRank(2)
				//单周排行(盈利)
				this.briefWeekRank(1)
				//单周排行(亏损)
				this.briefWeekRank(2)
			},
			//简报内容
			briefContent(){
				let arg = {
					week:this.week,
					day:this.end_date
				}
				this.content_loading = true;
				resource.briefContent(arg).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						let data = res.data.data;
						this.content_loading = false;
						this.is_empty = data.length == 0;
						// 销售收入
						let xssr_a_axis = [];
						let xssr_series = [];
						if(!this.is_empty){
							let xssr = data.xssr;
							this.xssr_info = {
								week_target:xssr.week.target,
								week_actual:xssr.week.actual,
								week_rate:xssr.week.rate,
								month_target:xssr.month.target,
								month_actual:xssr.month.actual,
								month_rate:xssr.month.rate,
							}
							this.xssr_four_week = xssr.four_week;
							this.xssr_four_week.map(item => {
								xssr_a_axis.push(item.weeks + '周');
								xssr_series.push(item.xssr);
							})
						}
						var xssr_chart = document.getElementById('xssr_chart');
						this.xssrChart = echarts.getInstanceByDom(xssr_chart)
						if (this.xssrChart) { 
							this.xssrChart.clear();
						}
						this.xssrChart = echarts.init(xssr_chart);
						this.xssrChart.setOption(this.setOptions(xssr_a_axis,xssr_series,'万'));
						//营销费用
						let yxfy_a_axis = [];
						let yxfy_series = [];
						if(!this.is_empty){
							let yxfy = data.yxfy;
							this.yxfy_info = {
								week_target:yxfy.week.target,
								week_actual:yxfy.week.actual,
								week_rate:yxfy.week.rate,
								month_target:yxfy.month.target,
								month_actual:yxfy.month.actual,
								month_rate:yxfy.month.rate,
							}
							this.yxfy_four_week = yxfy.four_week;
							this.yxfy_four_week.map(item => {
								yxfy_a_axis.push(item.weeks + '周');
								yxfy_series.push(item.yxfy);
							})
						}
						
						var yxfy_chart = document.getElementById('yxfy_chart');
						this.yxfyChart = echarts.getInstanceByDom(yxfy_chart)
						if (this.yxfyChart) { 
							this.yxfyChart.clear();
						}
						this.yxfyChart = echarts.init(yxfy_chart);
						this.yxfyChart.setOption(this.setOptions(yxfy_a_axis,yxfy_series,'万'));
						//贡献毛利
						let gxml_a_axis = [];
						let gxml_series = [];
						if(!this.is_empty){
							let gxml = data.gx_ml;
							this.gxml_info = {
								week_target:gxml.week.target,
								week_actual:gxml.week.actual,
								week_rate:gxml.week.rate,
								month_target:gxml.month.target,
								month_actual:gxml.month.actual,
								month_rate:gxml.month.rate,
							}
							this.gxml_four_week = gxml.four_week;

							this.gxml_four_week.map(item => {
								gxml_a_axis.push(item.weeks + '周');
								gxml_series.push(item.gx_ml);
							})
						}
						
						var gxml_chart = document.getElementById('gxml_chart');
						this.gxmlChart = echarts.getInstanceByDom(gxml_chart)
						if (this.gxmlChart) { 
							this.gxmlChart.clear();
						}
						this.gxmlChart = echarts.init(gxml_chart);
						this.gxmlChart.setOption(this.setOptions(gxml_a_axis,gxml_series,'万'));
						//贡献毛利率
						let gxmyl_a_axis = [];
						let gxmyl_series = [];
						if(!this.is_empty){
							let gxmyl = data.gxmyl;
							this.gxmyl_info = {
								week_target:gxmyl.week.target,
								week_actual:gxmyl.week.actual,
								week_rate:gxmyl.week.rate,
								month_target:gxmyl.month.target,
								month_actual:gxmyl.month.actual,
								month_rate:gxmyl.month.rate,
							}
							this.gxmyl_four_week = gxmyl.four_week;

							this.gxmyl_four_week.map(item => {
								gxmyl_a_axis.push(item.weeks + '周');
								gxmyl_series.push(item.gxmyl);
							})
						}
						
						var gxmyl_chart = document.getElementById('gxmyl_chart');
						this.gxmylChart = echarts.getInstanceByDom(gxmyl_chart)
						if (this.gxmylChart) { 
							this.gxmylChart.clear();
						}
						this.gxmylChart = echarts.init(gxmyl_chart);
						this.gxmylChart.setOption(this.setOptions(gxmyl_a_axis,gxmyl_series,'%'));
						//预估净利
						let jlr_a_axis = [];
						let jlr_series = [];
						if(!this.is_empty){
							let jlr = data.jlr;
							this.jlr_info = {
								week_target:jlr.week.target,
								week_actual:jlr.week.actual,
								week_rate:jlr.week.rate,
								month_target:jlr.month.target,
								month_actual:jlr.month.actual,
								month_rate:jlr.month.rate,
							}
							this.jlr_four_week = jlr.four_week;

							this.jlr_four_week.map(item => {
								jlr_a_axis.push(item.weeks + '周');
								jlr_series.push(item.jlr);
							})
						}
						
						var jlr_chart = document.getElementById('jlr_chart');
						this.jlrChart = echarts.getInstanceByDom(jlr_chart)
						if (this.jlrChart) { 
							this.jlrChart.clear();
						}
						this.jlrChart = echarts.init(jlr_chart);
						this.jlrChart.setOption(this.setOptions(jlr_a_axis,jlr_series,'万'));
						window.addEventListener('resize',() => {
							this.xssrChart.resize();
							this.yxfyChart.resize();
							this.gxmlChart.resize();
							this.gxmylChart.resize();
							this.jlrChart.resize();
						});
					}else{
						this.$message.warning(res.data.msg);
					}
				})
},
			//柱状图配置
			setOptions(x_axis,series_data,unit){
				if(series_data.length == 0){
					return this.empty_option;
				}else{
					return {
						xAxis: {
							type: 'category',
							data: x_axis
						},
						yAxis: {
							type: 'value',
							axisLabel: {
								formatter: '{value}' + unit
							}
						},
						grid:{
							y2:60
						},
						series: [
						{
							data: series_data,
							label: {
								show: true,
								fontSize:14,
								fontWeight:'bold',
								position: 'top',
								formatter: '{c}' + unit
							},
							itemStyle:{
								color:"green"
							},
							type: 'bar'
						}
						]
					}
				}
			},
			//月度排行
			briefMonthRank(type){
				let arg = {
					day:this.end_date,
					type:type
				}
				if(type == 1){
					this.month_yl_loading = true;
				}else{
					this.month_ks_loading = true;
				}
				resource.briefMonthRank(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						if(type == 1){
							this.month_yl_data = data;
							this.month_yl_loading = false;
						}else{
							this.month_ks_data = data;
							this.month_ks_loading = false;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			briefWeekRank(type){
				let arg = {
					day:this.end_date,
					type:type
				}
				if(type == 1){
					this.week_yl_loading = true;
				}else{
					this.week_ks_loading = true;
				}
				resource.briefWeekRank(arg).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						if(type == 1){
							this.week_yl_data = data;
							this.week_yl_loading = false;
						}else{
							this.week_ks_data = data;
							this.week_ks_loading = false;
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		}
	}
</script>
<style lang="less" scoped>
.flex{
	display: flex;
}
.ac{
	align-items: center;
}
.as{
	align-items: flex-start;
}
.jc{
	justify-content:center;
}
.fcol{
	flex-direction: column;
}
.wrap{
	flex-wrap: wrap;
}
.jsa{
	justify-content:space-around;
}
.jsb{
	justify-content: space-between;
}
.flex-1{
	flex:1;
}
.tc{
	text-align: center;
}
.width-50{
	width: 50%;
}
.mb30{
	margin-bottom: 30px;
}
.mr30{
	margin-right: 30px;
}
.view_table{
	width:480px;
	height: 280px;
}

.view_item{
	margin-bottom: 15px;
	border:1px solid #dcdcdc;
	border-radius: 4px;
	color: #333333;
	width: 140px;
	height: 90px;
	.view_item_title{
		border-radius: 4px 4px 0 0;
		background: #91C2F9;
		font-size: 16px;
		font-weight: bold;
	}
	.view_item_value{
		font-size: 18px;
	}
}

.movement_table{
	margin-right: 15px;
	width: 360px;
	height: 280px;
}

.table_content{
	padding: 15px 15px 0 15px;
}
.empty{
	font-size: 14px;
	color: #666666;
}
.table_title{
	background: #D6E9EF;
	width: 100%;
	height: 50px;
	display: flex;
	align-items: center;
	justify-content: center;
}
.four_table{
	width: 280px;
	border-top: 1px solid #dcdcdc;
	border-left: 1px solid #dcdcdc;
	border-right: 1px solid #dcdcdc;
	.four_row{
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #dcdcdc;
		color: #333333;
		font-size: 16px;
		.row_label{
			border-right: 1px solid #dcdcdc;
			width: 80px;
			font-weight: bold;
		}
		.row_value{
			width: 200px;
		}
	}
}
.chart{
	width:500px;
	height: 280px;
}
.title{
	font-size: 24px;
	color: #333333;
	font-weight: bold;
}
.top_title{
	margin-top: 10px;
	margin-bottom: 10px;
	font-size: 16px;
	color: #666666;
	font-weight: bold;
}
</style>