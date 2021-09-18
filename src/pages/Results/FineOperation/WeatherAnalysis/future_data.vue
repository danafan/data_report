<template>
	<div>
		<div class="time_toast">有效日期：{{effective_date.start_date}} 至 {{effective_date.end_date}}，共计15天</div>
		<div id="temperature" class="line_box"></div>
		<div id="wind_speed" class="line_box"></div>
		<div class="clothes_box">
			<div id="bar_content" class="bar_content"></div>
			<div id="pie_content" class="pie_content"></div>
		</div>
		<div class="parsing">
			<div class="row_item">
				<div class="row_item_title">穿衣气象指数解析：</div>
				<div>穿衣气象指数共分8级，指数越小，穿衣的厚度越薄。</div>
				<div>1-2级: 夏季着装，指短款衣类，衣服厚度，在4毫米以下；</div>
				<div>3-5级: 春秋过渡季节着装，从单衣、夹衣、风衣到毛衣类，
				服装厚度在4-15毫米；</div>
				<div>6-8级: 冬季服装，主要指棉服，羽绒服类，
				其服装厚度在15毫米以上</div>
			</div>
			<div style="width: 30px"></div>
			<div class="row_item">
				<div>1级: 轻棉织物制作的短衣、短裙、薄短裙、短裤</div>
				<div>2级: 棉麻面料的衬衫、薄长裙、薄T恤</div>
				<div>3级: 单层棉麻面料的短套装、T恤衫、薄牛仔衫裤、休闲服、职业套装</div>
				<div>4级: 套装、夹衣、风衣、休闲装、夹克衫、西装、薄毛衣</div>
				<div>5级: 风衣、大衣、夹大衣、外套、毛衣、毛套装、西装、防寒服</div>
				<div>6级: 棉衣、冬大衣、皮夹克、外罩大衣、厚毛衣、皮帽皮手套、皮袄</div>
				<div>7级: 棉衣、冬大衣、皮夹克、厚呢外套、呢帽、手套、羽绒服、皮袄</div>
				<div>8级: 棉衣、冬大衣、皮夹克、厚呢外套、呢帽、手套、羽绒服、裘皮大衣
				</div>
			</div>
		</div>
		<div class="table_title">未来15天天气预报</div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
			<el-table-column prop="lvl1" label="省份" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="qx" label="市区" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="rq" label="日期" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="zgw" label="最高温" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div :class="{'zgw_color':scope.row.is_max == '1'}">{{scope.row.zgw}}°C</div>
				</template>
			</el-table-column>
			<el-table-column prop="zdw" label="最低温" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div :class="{'zdw_color':scope.row.is_min == '1'}">{{scope.row.zdw}}°C</div>
				</template>
			</el-table-column>
			<el-table-column prop="tq" label="天气" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="yw" label="不良天气" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div :class="{'yw_color':scope.row.yw == 1}">{{scope.row.yw == 1?'有':'无'}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="cyzs" label="穿衣指数" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div class="cyzs">
						<div class="tag" :style="cyzsColor(scope.row.cyzs)"></div>
						<div>{{scope.row.cyzs}}</div>
					</div>
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
</div>
</template>
<style lang="less" scoped>
.time_toast{
	margin-top: 30px;
	margin-bottom: 30px;
	font-size: 16px;
	color: red;
}
.line_box{
	width: 100%;
	height: 320px;
}
.clothes_box{
	display: flex;
	.bar_content{
		width: 70%;
		height: 320px;
	}
	.pie_content{
		width: 30%;
		height: 320px;
	}
}
.parsing{
	padding: 20px 30px;
	border-radius: 5px;
	background: #FEDB6F;
	width: 100%;
	display:flex;
	.row_item{
		flex: 1;
		font-size: 14px;
		.row_item_title{
			font-size: 16px;
			font-weight: bold;
		}
	}
}
.table_title{
	height: 60px;
	line-height: 60px;
	width: 100%;
	text-align: center;
}
.cyzs{
	display:flex;
	justify-content: center;
	align-items: center;
	.tag{
		margin-right: 5px;
		width: 18px;
		height: 18px;
		border-radius: 9px;
	}
}
.zgw_color{
	font-size: 18px;
	color: #D3100A;
	font-weight: bold;
}
.zdw_color{
	font-size: 18px;
	color: #2D37C3;
	font-weight: bold;
}
.yw_color{
	font-size: 18px;
	color: #FD7B08;
	font-weight: bold;
}
</style>

<script>
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				req:{},
				day_list:[],			//日期
				temperatureChart:null,
				wind_speedChart:null,
				bar_contentChart:null,
				dataObj:{},			//底部表格数据
				effective_date:{},		//有效日期
			}
		},
		methods:{
			//分页
			handleSizeChange(val) {
				this.req.page = 1;
				this.req.pagesize = val;
				//获取列表
				this.weatherTableList();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.weatherTableList();
			},
			setReq(req){
				this.req = req;
				this.getData();
				this.weatherTableList();
			},
			getData(){
				resource.weatherData(this.req).then(res => {
					if(res.data.code == 1){
						var echarts = require("echarts");
						var data = res.data.data;
						this.day_list = data.day;				//日期
						
						//未来每日气温
						var zgw = data.day_weather.zgw;			//最高温
						var zdw = data.day_weather.zdw;			//最低温
						var avg_wd = data.day_weather.avg_wd;	//平均温度

						var temperature = document.getElementById('temperature');
						if(this.temperatureChart){
							this.temperatureChart.dispose();
						}
						this.temperatureChart = echarts.init(temperature);
						this.temperatureChart.setOption(this.temperatureOptions(zgw,zdw,avg_wd));

						//未来每日风量
						var fl = data.day_weather.fl;			//风量
						var wind_speed = document.getElementById('wind_speed');
						if(this.wind_speedChart){
							this.wind_speedChart.dispose();
						}
						this.wind_speedChart = echarts.init(wind_speed);
						this.wind_speedChart.setOption(this.flOptions(fl));

						//穿衣气象指数
						var left_legend = [];
						var left_series = [];
						for(var k in data.cyqxzs.left){
							left_legend.push(k);
							data.cyqxzs.left[k].map((item,index) => {
								item.date = this.day_list[index];
							})
							let bar_item = {
								name: k,
								type: 'bar',
								stack: 'total',
								data: data.cyqxzs.left[k]
							}
							left_series.push(bar_item)
						}
						var bar_content = document.getElementById('bar_content');
						if(this.bar_contentChart){
							this.bar_contentChart.dispose();
						}
						this.bar_contentChart = echarts.init(bar_content);
						this.bar_contentChart.setOption(this.barOptions(left_legend,left_series));

						//穿衣气象指数统计环形图
						var pie_content = document.getElementById('pie_content');
						if(this.pie_contentChart){
							this.pie_contentChart.dispose();
						}
						this.pie_contentChart = echarts.init(pie_content);
						this.pie_contentChart.setOption(this.pieOptions(data.cyqxzs.right));

						//有效日期
						this.effective_date = data.effective_date;

						window.addEventListener('resize',() => {
							this.temperatureChart.resize();
							this.wind_speedChart.resize();
							this.bar_contentChart.resize();
							this.pie_contentChart.resize();
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//单品分析—-指标汇总排序
			sortChange(column){
				this.req.sort = column.prop;
				this.req.sort_type = column.order == 'ascending'?'0':'1';
				this.weatherTableList();
			},
			//底部天气数据表格
			weatherTableList(){
				resource.weatherTableList(this.req).then(res => {
					if(res.data.code == 1){
						this.dataObj = res.data.data;
						var zgw_max = Math.max.apply(Math, this.dataObj.data.map((item) => {return item.zgw}));
						var zdw_max = Math.min.apply(Math, this.dataObj.data.map((item) => {return item.zdw}));
						this.dataObj.data.map(item => {
							if(item.zgw == zgw_max){
								item.is_max = '1';
							}
							if(item.zdw == zdw_max){
								item.is_min = '1';
							}
						})
					}else{
						this.$message.warning(res.data.msg);
					}
				});
			},
			//气温折线图
			temperatureOptions(zgw,zdw,avg_wd){
				return {
					title: {
						text: '未来每日气温'
					},
					color:['#E06009','#FDD139', '#ED8166'],
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = params[0].axisValue
							for (var i = 0; i < params.length; i++) {
								relVal += '</br>' + params[i].data.name + '：'
								+ params[i].data.value + '℃';
							}
							return relVal
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
						axisPointer: {            
							type: 'shadow'        
						}
					},
					xAxis: {
						type: 'category',
						data: this.day_list
					},
					yAxis: {
						type: 'value',
						min: 'dataMin',
						axisLabel: {
							formatter: '{value}℃'
						}
					},
					series: [
					{
						type: 'line',
						label:{
							show:true,
							formatter (params) {
								return params.value + '℃'
							}
						},
						lineStyle:{
							width:3.6
						},
						data: zgw
					},
					{
						type: 'line',
						label:{
							show:true,
							formatter (params) {
								return params.value + '℃'
							}
						},
						lineStyle:{
							width:3.6
						},
						data: zdw
					},
					{
						type: 'line',
						label:{
							show:true,
							formatter (params) {
								return params.value + '℃'
							}
						},
						lineStyle:{
							width:3.6
						},
						data: avg_wd
					}
					]
				};
			},
			//风量
			flOptions(fl){
				return {
					title: {
						text: '未来平均风速'
					},
					color:['#6FC0B7'],
					tooltip: {
						trigger: 'axis',
						formatter (params) {
							var relVal = params[0].axisValue
							relVal += '</br>' + '平均风速：'
							+ params[0].value + '级';
							return relVal
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
						axisPointer: {            
							type: 'shadow'        
						}
					},
					xAxis: {
						type: 'category',
						data: this.day_list
					},
					yAxis: {
						type: 'value',
						min: 'dataMin',
						axisLabel: {
							formatter: '{value}级'
						}
					},
					series: [
					{
						type: 'line',
						label:{
							show:true,
							formatter (params) {
								return params.value + '级'
							}
						},
						lineStyle:{
							width:3.6
						},
						data: fl
					}]
				};
			},
			//柱状图堆叠
			barOptions(left_legend,left_series){
				return {
					title: {
						text: '所有地区未来穿衣指数分布'
					},
					tooltip: {
						trigger: 'item',
						formatter (params) {
							var relVal = params.data.date;
							relVal += '</br>' + '穿衣气象指数：'
							+ params.name + '</br>' + '区域数量：'
							+ params.value;
							return relVal
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
						axisPointer: {            
							type: 'shadow'        
						}
					},
					color:['#D3100A','#FD7B08','#FEC020','#C5DC58','#63D05F','#A0AFFF','#6077FD','#2D37C3'],
					legend: {
						data: left_legend
					},
					xAxis: {
						type: 'category',
						data: this.day_list
					},
					yAxis: {
						type: 'value',
						name:'区域数量'
					},
					series: left_series
				}
			},
			//环形图配置
			pieOptions(data){
				return {
					title: {
						text: '所有地区未来穿衣指数统计'
					},
					tooltip: {
						trigger: 'item',
						formatter: (params) => {
							return "穿衣气象指数：" + params.data.name + '</br>' 
							+ "记录数：" + params.data.num + '</br>'
							+ "[记录数]的总额百分比：" + params.data.value + '%';
						},
						backgroundColor:"rgba(0,0,0,.8)",
						textStyle:{
							color:"#ffffff"
						},
						borderColor:"rgba(0,0,0,0.7)",
						axisPointer: {            
							type: 'shadow'        
						}
					},
					color:['#D3100A','#FD7B08','#FEC020','#C5DC58','#63D05F','#A0AFFF','#6077FD','#2D37C3'],
					series: [
					{
						type: 'pie',
						radius: ['40%', '70%'],
						label:{
							formatter: (params) => {
								return params.data.value + '%';
							},
						},
						data: data
					}
					]
				}
			},
			//穿衣指数背景色
			cyzsColor(v){
				switch(v){
					case 1:
					return 'background:#D3100A';
					case 2:
					return 'background:#FD7B08';
					case 3:
					return 'background:#FEC020'
					case 4:
					return 'background:#C5DC58'
					case 5:
					return 'background:#63D05F'
					case 6:
					return 'background:#A0AFFF'
					case 7:
					return 'background:#6077FD'
					case 8:
					return 'background:#2D37C3'
				}
			}
		}
	}
</script>