<template>
	<div>
		<div class="custom_title mb-15">人效看板</div>
		<el-form :inline="true" size="mini" class="demo-form-inline">
			<el-form-item label="查询月份:">
                <el-date-picker v-model="date" :clearable="false" type="month" value-format="yyyy-MM" placeholder="选择月份">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" @click="humanEffectData">搜索</el-button>
            </el-form-item>
        </el-form>
        <div style="width:100%;overflow-x: scroll">
            <vue2-org-tree
            v-loading="loading"
            :data="newData"
            :horizontal="true"
            :collapsable="true"
            :render-content="renderContent"
            name="organ"
            @on-expand="onExpand"
            />
        </div>

    </div>
</template>
<script>
	import resource from '../../api/resource.js'
	import {getLastMonth} from '../../api/nowMonth.js'
	export default {
		data() {
			return {
                date:getLastMonth(),                     //上月
                newData:{},
                loading:false,
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
					date:this.date
				}
				this.loading = true;
				resource.humanEffectData(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = JSON.parse(JSON.stringify(res.data.data).replace(/list/g, 'children'))
						this.newData = data[0];
						this.toggleExpand(this.newData, true)
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
    		//渲染节点
    		renderContent(h, data) {
                console.log(data);
                if(data.type == 1){
                    return (
                        <div>
                        <div class="dept_name">{data.dept_name}（{data.user_num}人）</div>
                        <div class="flex jsa bottom_line">
                        <div class="f12 pp">
                        <div class="flex">
                        <div class="bold space-nowrap">GMV：</div>
                        <div class="space-nowrap">{data.gmv}</div>
                        </div>
                        <div class="gmv_color">{data.gmv_rx}</div>
                        <div class="flex ac">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.gmv_hb>0?'red_color':data.gmv_hb==0?'':'green_color'}>{data.gmv_hb>0?'+':''}{data.gmv_hb}%</div>
                        </div>
                        </div>
                        <div class="line"></div>
                        <div class="f12 pp">
                        <div class="flex">
                        <div class="bold space-nowrap">营销费用：</div>
                        <div class="space-nowrap">{data.yxfy}</div>
                        </div>
                        <div class="huang_color">{data.yxfy_rx}</div>
                        <div class="flex ac">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.yxfy_hb>0?'red_color':data.yxfy_hb==0?'':'green_color'}>{data.yxfy_hb>0?'+':''}{data.yxfy_hb}%</div>
                        </div>
                        </div>
                        <div class="line"></div>
                        <div class="f12 pp">
                        <div class="flex">
                        <div class="bold space-nowrap">销售收入：</div>
                        <div class="space-nowrap">{data.xssr}</div>
                        </div>
                        <div class="yxfy_color">{data.xssr_rx}</div>
                        <div class="flex ac">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.xssr_hb>0?'red_color':data.xssr_hb==0?'':'green_color'}>{data.xssr_hb>0?'+':''}{data.xssr_hb}%</div>
                        </div>
                        </div>
                        <div class="line"></div>
                        <div class="f12 pp">
                        <div class="flex">
                        <div class="bold space-nowrap">贡献毛益额：</div>
                        <div class="space-nowrap">{data.gxmy}</div>
                        </div>
                        <div class="lan_color">{data.gxmy_rx}</div>
                        <div class="flex ac">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.gxmy_hb>0?'red_color':data.gxmy_hb==0?'':'green_color'}>{data.gxmy_hb>0?'+':''}{data.gxmy_hb}%</div>
                        </div>
                        </div>
                        <div class="line"></div>
                        <div class="f12 pp">
                        <div class="flex">
                        <div class="bold space-nowrap">付款订单量：</div>
                        <div class="space-nowrap">{data.dl}</div>
                        </div>
                        <div class="fkddl">{data.dl_rx}</div>
                        <div class="flex ac">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.dl_hb>0?'red_color':data.dl_hb==0?'':'green_color'}>{data.dl_hb>0?'+':''}{data.dl_hb}%</div>
                        </div>
                        </div>
                        </div>

                        <div class="flex jsa">
                        <div class="flex fc ac jc">
                        <div class="flex f12 mb-3">
                        <div class="bold space-nowrap">每单公摊费用：</div>
                        <div class="space-nowrap">¥{data.mdgtfy}</div>
                        </div>

                        <div class="flex f12">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.mdgtfy_hb>0?'red_color':data.mdgtfy_hb==0?'':'green_color'}>{data.mdgtfy_hb>0?'+':''}{data.mdgtfy_hb}%</div>
                        </div>
                        </div>
                        <div class="line"></div>
                        <div class="flex fc ac jc">
                        <div class="flex f12 mb-3">
                        <div class="bold space-nowrap">每单综合成本：</div>
                        <div class="space-nowrap">¥{data.mdzhcb}</div>
                        </div>
                        <div class="flex f12">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.mdzhcb_hb>0?'red_color':data.mdzhcb_hb==0?'':'green_color'}>{data.mdzhcb_hb>0?'+':''}{data.mdzhcb_hb}%</div>
                        </div>
                        </div>
                        <div class="line"></div>
                        <div class="flex fc ac jc">
                        <div class="flex f12 mb-3">
                        <div class="bold space-nowrap">团队人均费用(工资)：</div>
                        <div class="space-nowrap">¥{data.tdrjfy_rx}</div>
                        </div>
                        <div class="flex f12">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.tdrjfy_hb>0?'red_color':data.tdrjfy_hb==0?'':'green_color'}>{data.tdrjfy_hb>0?'+':''}{data.tdrjfy_hb}%</div>
                        </div>
                        </div>
                        </div>
                        </div>
                        );
                }else{
                    if(data.dept_id == "72341529"){
                        return (
                        <div>
                            <div class="dept_name">{data.dept_name}（{data.user_num}人）</div>
                            <div class="flex jsa bottom_line">
                            <div class="flex f12 fc ac pp right_line">
                                <div class="flex mb-3">
                                    <div class="bold space-nowrap">团队人均费用：</div>
                                    <div class="space-nowrap">¥{data.tdrjfy_rx}</div>
                                </div>
                                <div class="flex ac">
                                    <div class="bold space-nowrap">环比上月：</div>
                                   <div class={data.tdrjfy_hb>0?'red_color':data.tdrjfy_hb==0?'':'green_color'}>{data.tdrjfy_hb>0?'+':''}{data.tdrjfy_hb}%</div>
                                </div>
                            </div>
                            <div class="flex f12 fc ac pp">
                                <div class="flex mb-3">
                                    <div class="bold space-nowrap">邀约面试：</div>
                                    <div class="space-nowrap">{data.msyy_rx}</div>
                                </div>
                                <div class="flex ac">
                                    <div class="bold space-nowrap">环比上月：</div>
                                   <div class={data.msyy_hb>0?'red_color':data.msyy_hb==0?'':'green_color'}>{data.msyy_hb>0?'+':''}{data.msyy_hb}%</div>
                                </div>
                            </div>
                            </div>
                        </div>
                        )
                    }else{
                        return (
                        <div>
                        <div class="dept_name">{data.dept_name}（{data.user_num}人）</div>
                        <div class="flex fc ac pp">
                        <div class="flex f12 mb-3">
                        <div class="bold space-nowrap">团队人均费用：</div>
                        <div class="space-nowrap">¥{data.tdrjfy_rx}</div>
                        </div>
                        <div class="flex f12">
                        <div class="bold space-nowrap">环比上月：</div>
                        <div class={data.tdrjfy_hb>0?'red_color':data.tdrjfy_hb==0?'':'green_color'}>{data.tdrjfy_hb>0?'+':''}{data.tdrjfy_hb}%</div>
                        </div>
                        </div>
                        </div>
                        )
                    }
                    
                }
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
.bottom_line{
    border-bottom:1px solid #dcdcdc;
}
.right_line{
    border-right:1px solid #dcdcdc;
}
.line{
	background-color: #dcdcdc;
	width: 1px;
	height: 64px;
}
.pp{
	padding:5px 10px;
}
.gmv_color{
	color:#dd2cc7;
}
.fkddl{
    color: #13227a;
}
.yxfy_color{
	color:#872cdd;
}
.huang_color{
	color: #F3B214;
}
.lan_color{
	color: #1296db;
}
</style>

