<template>
	<div>
		<div class="custom_title mb-15">人效看板</div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item>
				<el-radio-group v-model="day_type">
					<el-radio-button :label="1">本月</el-radio-button>
					<el-radio-button :label="2">本周</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="查询日期:">
				<el-date-picker v-model="date" type="daterange" :clearable="false" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="mini" @click="humanEffectData">搜索</el-button>
			</el-form-item>
		</el-form>
		<!-- <div>
			<el-switch v-model="horizontal" :width="50" active-text="横排" inactive-text="竖排" style="margin-top:8px;"/>
		</div> -->
		<vue2-org-tree
		v-loading="loading"
		:data="newData"
		:horizontal="!horizontal"
		:collapsable="collapsable"
		:render-content="renderContent"
		name="organ"
		@on-expand="onExpand"
		/>
	</div>
</template>
<script>
	import resource from '../../api/resource.js'
	import {getMonthStartDate,getWeekStartDate,getNowDate} from '../../api/nowMonth.js'
	export default {
		data() {
			return {
				day_type:1,
				date:[getMonthStartDate(),getNowDate()],
				newData:{},
			    horizontal: false, //横版 竖版
			    collapsable: true,
			    expandAll: true, //是否全部展开
			    loading:false,
			}
		},
		watch:{
			day_type:function(n,o){
				switch(n){
					case 1:
					this.date.splice(0,1)
					this.date.unshift(getMonthStartDate());
					break;
					case 2:
					this.date.splice(0,1)
					this.date.unshift(getWeekStartDate());
					break;
				}
			}
		},
		created(){
			//获取数据
			this.humanEffectData();
		},
		methods: {
			//获取数据
			humanEffectData() {
				let arg = {
					start_date:this.date[0],
					end_date:this.date[1],
				}
				this.loading = true;
				resource.humanEffectData(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = JSON.parse(JSON.stringify(res.data.data).replace(/list/g, 'children'))
						this.newData = data[0];
						this.toggleExpand(this.newData, this.expandAll)
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
    		//渲染节点
    		renderContent(h, data) {
    			return (
    				<div>
    				<div class="dept_name">{data.dept_name}（{data.user_num}人）</div>
    				<div class="flex jsa">
    				<div class="f12 pp">
    				<div class="flex">
    				<div class="bold">GMV：</div>
    				<div>{data.gmv}</div>
    				</div>
    				<div class="red_color">{data.gmv_rx}</div>
    				</div>
    				<div class="line"></div>
    				<div class="f12 pp">
    				<div class="flex">
    				<div class="bold">营销费用：</div>
    				<div>{data.yxfy}</div>
    				</div>
    				<div class="green_color">{data.yxfy_rx}</div>
    				</div>
    				</div>
    				</div>
    				);
    		},
    		//默认展开
    		toggleExpand(data, val) {
    			this.$set(data, "expand", val);
    			if (data.children) {
    				this.toggleExpand(data.children, val);
    			}
    		},
    		collapse(children) {
    			children.forEach(child => {
    				if (child.expand) {
    					child.expand = false;
    				}
    				child.children && this.collapse(child.children);
    			});
    		},
    		//展开
    		onExpand(e, data) {
    			if ("expand" in data) {
    				data.expand = !data.expand;
    				if (!data.expand && data.children) {
    					this.collapse(data.children);
    				}
    			} else {
    				this.$set(data, "expand", true);
    			}
    		}

    	}

    }
</script>
<style lang="less">
.custom_title{
	font-weight: bold;
	color: #333333;
}
.org-tree-node-label .org-tree-node-label-inner{
	padding:0!important;
}
.dept_name{
	border-bottom:1px solid #dcdcdc;
	font-size: 13px;
	font-weight: bold;
	padding:5px 0;
}
.line{
	background-color: #dcdcdc;
	width: 1px;
	height: 44px;
}
.pp{
	padding:5px 10px;
}
</style>

