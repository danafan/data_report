<template>
	<div>
		<el-table size="small" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @sort-change="sortChange">
			<el-table-column prop="lvl1" label="省份" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="qx" label="市区" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="rq" label="日期" sortable show-overflow-tooltip align="center"></el-table-column>
			<el-table-column prop="zgw" label="最高温" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div :class="{'zgw_color':scope.row.is_max == '1'}">{{scope.row.zgw}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="zdw" label="最低温" sortable show-overflow-tooltip align="center">
				<template slot-scope="scope">
					<div :class="{'zdw_color':scope.row.is_min == '1'}">{{scope.row.zdw}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="pjw" label="平均温" sortable show-overflow-tooltip align="center">
			</el-table-column>
			<el-table-column prop="fl" label="最高风速" sortable show-overflow-tooltip align="center">
			</el-table-column>
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
				dataObj:{},			//底部表格数据
			}
		},
		methods:{
			//分页
			handleSizeChange(val) {
				this.req.page = 1;
				this.req.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.req.page = val;
				//获取列表
				this.getData();
			},
			setReq(req){
				this.req = req;
				delete this.req.city;
				this.getData();
			},
			//单品分析—-指标汇总排序
			sortChange(column){
				this.req.sort = column.prop;
				this.req.sort_type = column.order == 'ascending'?'0':'1';
				this.getData();
			},
			//获取列表
			getData(){
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
				})
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