<template>
	<div class="container">
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部:" style="margin-right: 20px">
				<el-select v-model="select_department_ids" :popper-append-to-body="false" @change="GetStoreList" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in dept_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺:">
				<el-select v-model="select_store_ids" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in store_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类:">
				<el-select v-model="select_cate_names" :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cate_name_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="付款日期:" style="margin-right: 20px">
				<el-date-picker
				v-model="date"
				type="daterange"
				:clearable="false"
				unlink-panels
				value-format="yyyy-MM-dd"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
				:append-to-body="false"
				:picker-options="pickerOptions">
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="fishList">搜索</el-button>
		</el-form-item>
		<el-form-item>
			<el-button type="info" @click="ClearReq">清空</el-button>
		</el-form-item>
	</el-form>
	<div class="tab_container">
		<div class="tab_item" :class="{'active_tab_item':tab_index == '1'}" @click="tab_index = '1'">单量统计</div>
		<div class="tab_item" :class="{'active_tab_item':tab_index == '2'}" @click="tab_index = '2'">金额统计</div>
	</div>
	<!-- 每日鱼塘单量/每日鱼塘金额 -->
	<div class="single_box">
		<!-- 每日鱼塘单量 -->
		<div id="single_date" class="single_date" v-show="tab_index == '1'"></div>
		<div id="single_total" class="single_total" v-show="tab_index == '1'"></div>
		<!-- 每日鱼塘金额 -->
		<div id="money_date" class="single_date" v-show="tab_index == '2'"></div>
		<div id="money_total" class="single_total" v-show="tab_index == '2'"></div>
	</div>
	<!-- 各店铺鱼塘单量占比 -->
	<div id="accounted" class="accounted" v-show="tab_index == '1'"></div>
	<!-- 各店铺鱼塘金额占比 -->
	<div id="amount" class="accounted" v-show="tab_index == '2'"></div>
	<!-- 鱼塘目标完成情况 -->
	<div id="over_state" class="over_state" v-show="tab_index == '1'"></div>
</div>
</template>
<style lang="less" scoped>
.container{
	.tab_container{
		margin-bottom: 30px;
		margin-top: 10px;
		display:flex;
		.tab_item{
			background: #EFEFEF;
			width:160px;
			text-align: center;
			height: 40px;
			line-height: 40px;
			font-size: 18px;
			color: #8a8a8a;
		}
		.active_tab_item{
			background:#008DFF;
			color: #fff;
		}
	}
	.single_box{
		margin-bottom: 50px;
		width: 100%;
		display: flex;
		.single_date{
			min-width:70%;
			min-height: 300px;
		}
		.single_total{
			min-width:30%;
			min-height: 300px;
		}
	}
	.accounted{
		margin-bottom: 50px;
		min-width: 100%;
		min-height: 600px;
	}
	.over_state{
		min-width: 100%;
		min-height: 600px;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 										//时间区间
				date:[getCurrentDate(),getCurrentDate()],	//付款日期
				start_time:getCurrentDate(),				//开始日期
				end_time:getCurrentDate(),					//结束日期
				dept_list: [],								//部门列表	
				select_department_ids:[],					//选中的部门id列表
				store_list: [],								//店铺列表	
				select_store_ids:[],						//选中的店铺id列表
				cate_name_list:[],							//品类列表
				select_cate_names:[],						//选中的品类列表
				tab_index:'1',								//表格导航
				single_dateChart:null,						//每日鱼塘单量
				single_totalChart:null,						//累计鱼塘单量
				money_dateChart:null,						//每日鱼塘金额
				money_totalChart:null,						//累计鱼塘金额
				accountedChart:null,						//各店铺鱼塘单量占比
				amountChart:null,							//各店铺鱼塘金额占比
				over_stateChart:null,						//鱼塘目标完成情况
			}
		},
		created(){
			//部门列表
			this.AjaxViewDept();
			//店铺列表
			this.GetStoreList();
			//品类列表
			this.ajaxCpfl();
		},
		mounted(){
            //获取列表
            this.fishList();
        },
        watch:{
			//发货时间
			date:function(n){
				this.start_time = n && n.length> 0?n[0]:"";
				this.end_time = n && n.length> 0?n[1]:"";
			},
			tab_index:function(n){
				this.$nextTick(() => {
					this.single_dateChart.resize();
					this.single_totalChart.resize();
					this.money_dateChart.resize();
					this.money_totalChart.resize();
					this.accountedChart.resize();
					this.amountChart.resize();
					this.over_stateChart.resize();
				})
			}
		},
		methods:{
        	//部门列表
        	AjaxViewDept(){
        		resource.ajaxViewDept().then(res => {
        			if(res.data.code == 1){
        				this.dept_list = res.data.data;
        			}else{
        				this.$message.warning(res.data.msg);
        			}
        		})
        	},	
			//店铺列表
			GetStoreList(){
				let dept_id = this.select_department_ids.join(',');
				this.select_store_ids = [];
				resource.ajaxViewStore({dept_id:dept_id}).then(res => {
					if(res.data.code == 1){
						this.store_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//品类列表
			ajaxCpfl(){
				resource.ajaxCpfl().then(res => {
					if(res.data.code == 1){
						this.cate_name_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			fishList(){
				let req = {
					dept_id:this.select_department_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					start_time:this.start_time,
					end_time:this.end_time,
					cate_name:this.select_cate_names.join(',')
				}
				resource.fishList(req).then(res => {
					if(res.data.code == '1'){
						var echarts = require("echarts");
						var day_ytdl_obj = {
							fkrq:[],
							sjdl:[],
							ytdl:[],
							ytmbz:[]
						};							//每日鱼塘单量
						var total_ljytdl_obj = {
							ytdl:[],
							sjdl:[],
							ytmbz:"",
							total_dl:0
						};							//累计鱼塘单量
						var day_ytje_obj ={
							fkrq:[],
							sjje:[],
							ytje:[]
						};							//每日鱼塘金额
						var total_ljytje_obj = {
							sjje:[],
							ytje:[],
							total_je:0
						};							//累计鱼塘金额
						var shop_ytdlzb_obj ={
							dpid:[],
							sjdl:[],
							ytdl:[],
							ytdlzb:[]
						};							//各店铺鱼塘单量占比
						var shop_ytjezb_obj ={
							dpid:[],
							ytje:[],
							sjje:[],
							ytjezb:[]
						};							//各店铺鱼塘金额占比
						var shop_target_obj ={
							dpid:[],
							target:[],
							ytdl:[],
							ytwcl:[]
						};							//鱼塘目标完成情况
						//每日鱼塘单量
						let day_ytdl_list = res.data.data.day_ytdl_list;
						day_ytdl_list.map((item,index) => {
							day_ytdl_obj.fkrq.push(item.fkrq);		//付款日期
							day_ytdl_obj.ytdl.push(item.ytdl);		//鱼塘单量
							day_ytdl_obj.sjdl.push(item.sjdl);		//实际单量
							day_ytdl_obj.ytmbz.push(item.ytmbz);	//鱼塘目标值
						});
						var single_date = document.getElementById('single_date');
						this.single_dateChart = echarts.init(single_date);
						this.single_dateChart.setOption({
							title: {
								text: '每日鱼塘单量'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = "付款日期：" + params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>"
											+ params[2].seriesName + "：" + params[2].value + "万</br>" 
											+ "鱼塘单量占比：" + ((params[0].value/(parseFloat(params[0].value) + parseFloat(params[1].value)))*100).toFixed(2) + "%</br>"
											+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
										}
									}
									return tip;
								},
								backgroundColor:"rgba(0,0,0,.8)",
								textStyle:{
									color:"#ffffff"
								},
								borderColor:"rgba(0,0,0,0.7)",
							},
							color:['#5AD8A6','#F6BD16', '#5B8FF9'],
							legend: {
								data: ['鱼塘单量', '实际单量', '鱼塘目标值']
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: day_ytdl_obj.fkrq
							},
							yAxis: {
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value} 万'
								}
							},
							series: [
							{
								name: '鱼塘单量',
								type: 'line',
								stack: '1',
								lineStyle: { 
									 width:3.6
								}, 
								data: day_ytdl_obj.ytdl
							},
							{
								name: '实际单量',
								type: 'line',
								stack: '2',
								lineStyle: { 
									 width:3.6
								},
								data: day_ytdl_obj.sjdl
							},
							{
								name: '鱼塘目标值',
								type: 'line',
								stack: '3',
								lineStyle: { 
									 width:3.6
								},
								data: day_ytdl_obj.ytmbz
							}]
						});
						//累计鱼塘单量
						let total_ljytdl_list = res.data.data.total_ljytdl_list; 
						total_ljytdl_obj.ytdl.push(total_ljytdl_list[0].ytdl);	//鱼塘单量
						total_ljytdl_obj.sjdl.push(total_ljytdl_list[0].sjdl);	//实际单量
						total_ljytdl_obj.total_dl = total_ljytdl_list[0].total_dl;	//总单量
						total_ljytdl_obj.ytmbz = total_ljytdl_list[0].ytmbz;	//鱼塘目标值
						var single_total = document.getElementById('single_total');
						this.single_totalChart = echarts.init(single_total);
						this.single_totalChart.setOption({
							title: {
								text: '累计鱼塘单量',
								subtext:`总单量：${total_ljytdl_obj.total_dl}万`,
								itemGap:38,
								subtextStyle:{
									color:"#DE5636"
								} 
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>"
											+ "鱼塘目标值：" + `${total_ljytdl_obj.ytmbz}` + "万</br>" 
											+ "鱼塘单量占比：" + ((params[0].value/(parseFloat(params[0].value) + parseFloat(params[1].value)))*100).toFixed(2) + "%</br>"
											+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
										}
									}
									return tip;
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
							color:['#5AD8A6','#F6BD16'],
							grid:{
								top:'30%'
							},
							legend: {
								data: ['鱼塘单量', '实际单量'],
								top:"10%",
								left:0
							},
							xAxis: [{
								type: 'category',
								data: ['']
							}],
							yAxis:[{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series: [{
								name: '鱼塘单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}万'
								},
								data: total_ljytdl_obj.ytdl,
							},{
								name: '实际单量',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}万'
								},
								data: total_ljytdl_obj.sjdl
							}]
						});
						//每日鱼塘金额
						let day_ytje_list = res.data.data.day_ytje_list; 
						day_ytje_list.map(item => {
							day_ytje_obj.fkrq.push(item.fkrq);		//付款日期
							day_ytje_obj.sjje.push(item.sjje);		//实际金额
							day_ytje_obj.ytje.push(item.ytje);		//鱼塘金额
						});

						var money_date = document.getElementById('money_date');
						this.money_dateChart = echarts.init(money_date);
						this.money_dateChart.setOption({
							title: {
								text: '每日鱼塘金额'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = "付款日期：" + params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>" 
											+ "鱼塘金额占比：" + ((params[0].value/(parseFloat(params[0].value) + parseFloat(params[1].value)))*100).toFixed(2) + "%</br>"
											+ "总金额：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
										}
									}
									return tip;
								},
								backgroundColor:"rgba(0,0,0,.8)",
								textStyle:{
									color:"#ffffff"
								},
								borderColor:"rgba(0,0,0,0.7)",
							},
							color:['#5AD8A6','#F6BD16'],
							legend: {
								data: ['鱼塘金额', '实际金额']
							},
							xAxis: {
								type: 'category',
								boundaryGap: false,
								data: day_ytje_obj.fkrq
							},
							yAxis: {
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value} 万'
								}
							},
							series: [
							{
								name: '鱼塘金额',
								type: 'line',
								stack: '1',
								areaStyle: {},
								lineStyle: { 
									 width:3.6
								}, 
								data: day_ytje_obj.ytje
							},
							{
								name: '实际金额',
								type: 'line',
								stack: '1',
								areaStyle: {},
								lineStyle: { 
									 width:3.6
								},
								data: day_ytje_obj.sjje
							}]
						});
						//累计鱼塘金额
						let total_ljytje_list = res.data.data.total_ljytje_list; 
						total_ljytje_obj.ytje.push(total_ljytje_list.ytje);	//鱼塘金额
						total_ljytje_obj.sjje.push(total_ljytje_list.sjje);	//实际金额
						total_ljytje_obj.total_je = total_ljytje_list.total_je;	//总金额
						var money_total = document.getElementById('money_total');
						this.money_totalChart = echarts.init(money_total);
						this.money_totalChart.setOption({
							title: {
								text: '累计鱼塘金额',
								subtext:`总金额：${total_ljytje_obj.total_je}万`,
								itemGap:38,
								subtextStyle:{
									color:"#DE5636"
								} 
							},
							tooltip: {
								trigger: 'axis',
								formatter: (params) => {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>" 
											+ "鱼塘金额占比：" + ((params[0].value/(parseFloat(params[0].value) + parseFloat(params[1].value)))*100).toFixed(2) + "%</br>"
											+ "总金额：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
										}
									}
									return tip;
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
							color:['#5AD8A6','#F6BD16'],
							grid:{
								top:'30%'
							},
							legend: {
								data: ['鱼塘金额', '实际金额'],
								top:"10%",
								left:0
							},
							xAxis: [{
								type: 'category',
								data: ['']
							}],
							yAxis:[{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value}万'
								}
							}],
							series: [{
								name: '鱼塘金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}万'
								},
								data: total_ljytje_obj.ytje,
							},{
								name: '实际金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								label:{
									show:true,
									formatter: '{c}万'
								},
								data: total_ljytje_obj.sjje
							}]
						});
						//各店铺鱼塘单量占比
						let shop_ytdlzb_list = res.data.data.shop_ytdlzb_list;
						shop_ytdlzb_list.map(item => {
							shop_ytdlzb_obj.dpid.push(item.dpid);		//店铺名称
							shop_ytdlzb_obj.ytdl.push(item.ytdl);		//鱼塘单量
							shop_ytdlzb_obj.sjdl.push(item.sjdl);		//实际单量
							shop_ytdlzb_obj.ytdlzb.push(item.ytdlzb);	//鱼塘店铺占比
						}); 
						var accounted = document.getElementById('accounted');
						this.accountedChart = echarts.init(accounted);
						this.accountedChart.setOption({
							title: {
								text: '各店铺鱼塘单量占比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>"
											+ params[2].seriesName + "：" + params[2].value + "%</br>" 
											+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2)+"万";
										}
									}
									return tip;
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
							color:['#5AD8A6','#F6BD16', '#5B8FF9'],
							legend: {
								data: ['鱼塘单量', '实际单量', '鱼塘单量占比']
							},
							grid:{
								y2:300
							},
							xAxis: [{
								type: 'category',
								data: shop_ytdlzb_obj.dpid,
								axisLabel: {
									color: '#333',
									interval: 2,
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								axisLabel: {
									formatter: '{value} 万'
								}
							},{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value} %'
								}
							}],
							series: [{
								name: '鱼塘单量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: shop_ytdlzb_obj.ytdl
							},{
								name: '实际单量',
								type: 'bar',
								stack: '1',
								yAxisIndex:0,
								emphasis: {
									focus: 'series'
								},
								data: shop_ytdlzb_obj.sjdl
							},{
								name: '鱼塘单量占比',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: shop_ytdlzb_obj.ytdlzb
							}]
						});
						//各店铺鱼塘金额占比
						let shop_ytjezb_list = res.data.data.shop_ytjezb_list;
						shop_ytjezb_list.map(item => {
							shop_ytjezb_obj.dpid.push(item.dpid);		//店铺名称
							shop_ytjezb_obj.ytje.push(item.ytje);		//鱼塘金额
							shop_ytjezb_obj.sjje.push(item.sjje);		//实际金额
							shop_ytjezb_obj.ytjezb.push(item.ytjezb);	//鱼塘金额占比
						}); 
						var amount = document.getElementById('amount');
						this.amountChart = echarts.init(amount);
						this.amountChart.setOption({
							title: {
								text: '各店铺鱼塘金额占比'
							},
							tooltip: {
								trigger: 'axis',
								formatter: function (params) {
									let tip = "";
									if(params != null && params.length > 0) {
										for(let i =0; i < params.length; i++) {
											tip = params[0].axisValueLabel + "</br>"
											+ params[0].seriesName + "：" + params[0].value + "万</br>"
											+ params[1].seriesName + "：" + params[1].value + "万</br>"
											+ params[2].seriesName + "：" + params[2].value + "%</br>" 
											+ "总金额：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2) + "万";
										}
									}
									return tip;
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
							color:['#5AD8A6','#F6BD16', '#5B8FF9'],
							legend: {
								data: ['鱼塘金额', '实际金额', '鱼塘金额占比']
							},
							grid:{
								y2:300
							},
							xAxis: [{
								type: 'category',
								data: shop_ytjezb_obj.dpid,
								axisLabel: {
									color: '#333',
									interval: 2,
									rotate:70
								}
							}],
							yAxis:[{
								type: 'value',
								axisLabel: {
									formatter: '{value} 万'
								}
							},{
								type: 'value',
								min: 0,
								axisLabel: {
									formatter: '{value} %'
								}
							}],
							series: [{
								name: '鱼塘金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								data: shop_ytjezb_obj.ytje
							},{
								name: '实际金额',
								type: 'bar',
								stack: '1',
								emphasis: {
									focus: 'series'
								},
								data: shop_ytjezb_obj.sjje
							},{
								name: '鱼塘金额占比',
								type: 'line',
								yAxisIndex:1,
								lineStyle: { 
									 width:3.6
								},
								emphasis: {
									focus: 'series'
								},
								data: shop_ytjezb_obj.ytjezb
							}]
						});
						//鱼塘目标完成情况
						let shop_target_list = res.data.data.shop_target_list;
						shop_target_list.map(item => {
							shop_target_obj.dpid.push(item.dpid);			//店铺名称
							shop_target_obj.target.push(item.target);		//鱼塘目标值
							shop_target_obj.ytdl.push(item.ytdl);			//鱼塘单量
							shop_target_obj.ytwcl.push(item.ytwcl);		//鱼塘完成率
						})
						var over_state = document.getElementById('over_state');
						if (this.over_stateChart != null && this.over_stateChart != "" && this.over_stateChart != undefined) {
        						this.over_stateChart.dispose();//销毁
        					};
        					this.over_stateChart = echarts.init(over_state);
        					this.over_stateChart.setOption({
        						title: {
        							text: '鱼塘目标完成情况'
        						},
        						tooltip: {
        							trigger: 'axis',
        							formatter: function (params) {
        								let tip = "";
        								if(params != null && params.length > 0) {
        									for(let i =0; i < params.length; i++) {
        										tip = params[0].axisValueLabel + "</br>"
        										+ params[0].seriesName + "：" + params[0].value + "万</br>"
        										+ params[1].seriesName + "：" + params[1].value + "万</br>"
        										+ params[2].seriesName + "：" + params[2].value + "%</br>" 
        										+ "总单量：" + (parseFloat(params[0].value) + parseFloat(params[1].value)).toFixed(2) + "万";
        									}
        								}
        								return tip;
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
        						color:['#5AD8A6','#F6BD16', '#5B8FF9'],
        						legend: {
        							data: ['鱼塘目标值', '鱼塘单量', '鱼塘完成率']
        						},
        						grid:{
        							y2:300
        						},
        						xAxis: [{
        							type: 'category',
        							data: shop_target_obj.dpid,
        							axisLabel: {
        								color: '#333',
        								interval: 2,
        								rotate:70
        							}
        						}],
        						yAxis:[{
        							type: 'value',
        							axisLabel: {
        								formatter: '{value} 万'
        							}
        						},{
        							type: 'value',
        							min: 0,
        							axisLabel: {
        								formatter: '{value} %'
        							}
        						}],
        						series: [{
        							name: '鱼塘目标值',
        							type: 'bar',
        							stack: '2',
        							emphasis: {
        								focus: 'series'
        							},
        							data: shop_target_obj.target
        						},{
        							name: '鱼塘单量',
        							type: 'bar',
        							stack: '1',
        							barGap: '-120%',
        							barMaxWidth:"60%",
        							emphasis: {
        								focus: 'series'
        							},
        							data: shop_target_obj.ytdl
        						},{
        							name: '鱼塘完成率',
        							type: 'line',
        							yAxisIndex:1,
        							lineStyle: { 
        								 width:3.6
        							},
        							emphasis: {
        								focus: 'series'
        							},
        							data: shop_target_obj.ytwcl
        						}]
        					});
        					var _this = this;
        					window.addEventListener('resize',() => {
        						_this.single_dateChart.resize();
        						_this.single_totalChart.resize();
        						_this.money_dateChart.resize();
        						_this.money_totalChart.resize();
        						_this.accountedChart.resize();
        						_this.amountChart.resize();
        						_this.over_stateChart.resize();
        					})
        				}else{
        					this.$message.warning(res.data.msg);
        				}
        			})
},
			//清空查询条件
			ClearReq(){
				this.select_department_ids = [];
				this.select_store_ids = [];
				this.select_cate_names = [];
				this.date = [];
			},
		}
	}
</script>