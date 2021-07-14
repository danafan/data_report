<template>
	<div>
		<div class="table_setting">
			<el-tooltip placement="bottom-start">
				<div slot="content">
					穿衣气象指数解析：<br/>
					穿衣气象指数共分8级，指数越小，穿衣的厚度越薄。<br/>
					1-2级: 夏季着装，指短款衣类，衣服厚度，在4毫米以下；<br/>
					3-5级: 春秋过渡季节着装，从单衣、夹衣、风衣到毛衣类，
					服装厚度在4-15毫米；<br/>
					6-8级: 冬季服装，主要指棉服，羽绒服类，
					其服装厚度在15毫米以上<br/>
					1级: 轻棉织物制作的短衣、短裙、薄短裙、短裤<br/>
					2级: 棉麻面料的衬衫、薄长裙、薄T恤<br/>
					3级: 单层棉麻面料的短套装、T恤衫、薄牛仔衫裤、休闲服、职业套装<br/>
					4级: 套装、夹衣、风衣、休闲装、夹克衫、西装、薄毛衣<br/>
					5级: 风衣、大衣、夹大衣、外套、毛衣、毛套装、西装、防寒服<br/>
					6级: 棉衣、冬大衣、皮夹克、外罩大衣、厚毛衣、皮帽皮手套、皮袄<br/>
					7级: 棉衣、冬大衣、皮夹克、厚呢外套、呢帽、手套、羽绒服、皮袄<br/>
					8级: 棉衣、冬大衣、皮夹克、厚呢外套、呢帽、手套、羽绒服、裘皮大衣<br/>
				</div>
				<el-button size="small" type="text">穿衣指数说明</el-button>
			</el-tooltip>
			<el-button type="primary" plain size="small" @click="Export">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table :data="table_content" style="width: 100%" height="600" tooltip-effect="dark" :header-cell-style="{'background':'#f4f4f4'}" :cell-style="columnStyle">
			<el-table-column :prop="'value_' + item" :label="item" :fixed="index == 0" width="120" show-overflow-tooltip align="center" v-for="(item,index) in day_list">
				<template slot-scope="scope">
					<!-- 最高温 -->
					<div class="zgw_box" v-if="scope.$index == 0 || (scope.$index)%6 == 0">
						<div :class="{'zgw_color':scope.row['value_' + item] == scope.row.zgw_max}">{{scope.row['value_' + item]}}</div>
						<div class="city_text" v-if="index == 0">（{{scope.row.city_name}}）</div>
					</div>
					<!-- 最低温 -->
					<div :class="{'zdw_color':scope.row['value_' + item] == scope.row.zdw_min}" v-else-if="scope.$index == 1 || (scope.$index - 1)%6 == 0">
						<div :class="{'zdw_color':scope.row['value_' + item] == scope.row.zdw_min}">{{scope.row['value_' + item]}}</div>
					</div>
					<!-- 穿衣指数 -->
					<div class="content_item" v-else-if="(scope.$index + 1)%6 == 0">
						<div class="tag" :style="cyzsColor(scope.row['value_' + item])"></div>
						<div>{{scope.row['value_' + item]}}</div>
					</div>
					<div v-else>{{scope.row['value_' + item]}}</div>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>
<style lang="less" scoped>
.table_setting{
	width: 100%;
	margin-bottom: 10px;
	display:flex;
	justify-content: flex-end;
	align-items: center;
}
.zgw_box{
	display:flex;
	justify-content: center;
	.city_text{
		color:red;
		font-size: 12px;
	}
}
.content_item{
	display:flex;
	align-items: center;
	justify-content: center;
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
.qufen{
	background:;
}
</style>

<script>
	import resource from '../../../../api/resource.js'
	import {exportExcel} from '../../../../api/export.js'
	export default{
		data(){
			return{
				table_content:[],
				day_list:[],
				field_name_list:[],
			}
		},
		methods:{
			setReq(req){
				this.getData();
			},
			//获取列表
			getData(){
				resource.weatherTableList({from:'3'}).then(res => {
					if(res.data.code == 1){
						var dataObj = res.data.data;
						dataObj.day_list.unshift('分类');
						this.day_list = dataObj.day_list;
						dataObj.table_list.map((item,ii) => {
							var add_obj = {
								zgw:'最高温',
								cyzs: '穿衣指数',
								fl: '最高风速',
								pjw: '平均温',
								tq: "天气",
								zdw: '最低温',
							}
							item.list.unshift(add_obj);
							var key_list = ['zgw','zdw','pjw','fl','tq','cyzs'];
							var key_arr = [];
							key_list.map(key_item => {
								var dd = {};
								item.list.map((i,index) => {
									dd['value_' + this.day_list[index]] = i[key_item];
									dd['index'] = (ii + 1)%2 == 0? '1':'0';
								});
								//最高温
								if(key_item == 'zgw'){
									var zgw_arr = [];
									for(var kk in dd){
										zgw_arr.push(dd[kk]);
									}
									zgw_arr.splice(0,1);
									var zgw_max = Math.max.apply(Math, zgw_arr.map((i) => {
										return i;
									}));
									dd['zgw_max'] = zgw_max;
								}
								//最低温
								if(key_item == 'zdw'){
									var zdw_arr = [];
									for(var kk in dd){
										zdw_arr.push(dd[kk]);
									}
									zdw_arr.splice(0,1);
									var zdw_min = Math.min.apply(Math, zdw_arr.map((i) => {
										return i;
									}));
									dd['zdw_min'] = zdw_min;
								}
								//城市
								dd['city_name'] = item.name;
								key_arr.push(dd);
							})
							this.table_content = [...this.table_content,...key_arr];
						})
						//导出的字段名
						for(var k_title in this.table_content[0]){
							if(k_title != 'zgw_max' && k_title != 'zdw_min'){
								this.field_name_list.push(k_title);
							}	
						}
						console.log(this.table_content);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//导出
			Export(){
				var data_obj = {
					table_title:"热门天气",
					table_title_list:this.day_list,
					field_name_list:this.field_name_list,
					data_list:this.table_content
				};
				exportExcel(data_obj);
			},
			//周末行的样式
			columnStyle({ row, column, rowIndex, columnIndex }) {
				if(row.index == '1'){
					return 'background:#F2F5F9';
				}
			},
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