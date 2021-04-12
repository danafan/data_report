<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="统计日期：">
				<el-date-picker
				v-model="tjrq"
				type="date"
				value-format="yyyy-MM-dd"
				placeholder="选择日期"
				:append-to-body="false"
				>
			</el-date-picker>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="getList">搜索</el-button>
		</el-form-item>
	</el-form>
	<div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">UA价值</div>
				<div class="sub_label">{{view_obj.uvjz}}</div>
				<div class="small_text">环比：{{view_obj.uvjz_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.uvjz_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">GMV</div>
				<div class="sub_label">{{view_obj.zfje}}</div>
				<div class="small_text">环比：{{view_obj.zfje_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zfje_tb}}</span></div>
				<div class="column_line"></div>
				<div class="long_row_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">成功退款</div>
				<div class="sub_label">{{view_obj.cgtkje}}</div>
				<div class="small_text">环比：{{view_obj.cgtkje_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.cgtkje_tb}}</span></div>
				<div class="long_row_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">推广支出</div>
				<div class="sub_label">{{view_obj.tgzc}}</div>
				<div class="small_text">环比：{{view_obj.tgzc_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.tgzc_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
		</div>
		<div class="cate_row">
			<div class="cate_item">
				<div class="item_label">访客数</div>
				<div class="sub_label">{{view_obj.cgtkje}}</div>
				<div class="small_text">环比：{{view_obj.fks_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.fks_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">客单价</div>
				<div class="sub_label">{{view_obj.kdj}}</div>
				<div class="small_text">环比：{{view_obj.kdj_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.kdj_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">支付转化率</div>
				<div class="sub_label">{{view_obj.zfzhl}}</div>
				<div class="small_text">环比：{{view_obj.zfzhl_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zfzhl_tb}}</span></div>
				<div class="long_column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">直通车消耗</div>
				<div class="sub_label">{{view_obj.ztcxh}}</div>
				<div class="small_text">环比：{{view_obj.ztcxh_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ztcxh_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">钻展消耗</div>
				<div class="sub_label">{{view_obj.zszwxh}}</div>
				<div class="small_text">环比：{{view_obj.zszwxh_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zszwxh_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">超级推荐</div>
				<div class="sub_label">{{view_obj.cjtjxh}}</div>
				<div class="small_text">环比：{{view_obj.cjtjxh_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.cjtjxh_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">淘客佣金</div>
				<div class="sub_label">{{view_obj.tbkyj}}</div>
				<div class="small_text">环比：{{view_obj.tbkyj_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.tbkyj_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">鱼塘支付</div>
				<div class="sub_label">{{view_obj.ytzfje}}</div>
				<div class="small_text">环比：{{view_obj.ytzfje_hb}}</div>
				<div class="small_text">同比(周)：<span>-{{view_obj.ytzfje_tb}}</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item">
				<div class="item_label">老访客数</div>
				<div class="sub_label">{{view_obj.lfks}}</div>
				<div class="small_text">环比：{{view_obj.lfks_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.lfks_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">连带率</div>
				<div class="sub_label">{{view_obj.ldl}}</div>
				<div class="small_text">环比：{{view_obj.ldl_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ldl_tb}}</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.ztctcb}}</div>
				<div class="small_text">环比：{{view_obj.ztctcb_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ztctcb_tb}}</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.zztcb}}</div>
				<div class="small_text">环比：{{view_obj.zztcb_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zztcb_tb}}</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.cjtjtcb}}</div>
				<div class="small_text">环比：{{view_obj.cjtjtcb_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.cjtjtcb_tb}}</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.tkyjtcb}}</div>
				<div class="small_text">环比：{{view_obj.tkyjtcb_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.tkyjtcb_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">支付买家数</div>
				<div class="sub_label">{{view_obj.ytzfmjs}}</div>
				<div class="small_text">环比：{{view_obj.ytzfmjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ytzfmjs_tb}}</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item">
				<div class="item_label">新访客数</div>
				<div class="sub_label">{{view_obj.xfks}}</div>
				<div class="small_text">环比：{{view_obj.xfks_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.xfks_tb}}</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">确认收货金额</div>
				<div class="sub_label">{{view_obj.tbk_je}}</div>
				<div class="small_text">环比：{{view_obj.tbk_je_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.tbk_je_tb}}</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">支付单量</div>
				<div class="sub_label">{{view_obj.ytdl}}</div>
				<div class="small_text">环比：{{view_obj.ytdl_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ytdl_tb}}</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">加购率</div>
				<div class="sub_label">{{view_obj.jgl}}</div>
				<div class="small_text">环比：{{view_obj.jgl_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.jgl_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">买家数</div>
				<div class="sub_label">{{view_obj.zfmjs}}</div>
				<div class="small_text">环比：{{view_obj.zfmjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zfmjs_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">评价数</div>
				<div class="sub_label">{{view_obj.pjs}}</div>
				<div class="small_text">环比：{{view_obj.pjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.pjs_tb}}</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">描述相符</div>
				<div class="sub_label">{{view_obj.msxfpf}}</div>
				<div class="small_text">环比：{{view_obj.msxfpf_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.msxfpf_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">鱼塘佣金</div>
				<div class="sub_label">{{view_obj.ytyj}}</div>
				<div class="small_text">环比：{{view_obj.ytyj_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ytyj_tb}}</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">收藏率</div>
				<div class="sub_label">{{view_obj.scl}}</div>
				<div class="small_text">环比：{{view_obj.scl_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.scl_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">老买家数</div>
				<div class="sub_label">{{view_obj.zflmjs}}</div>
				<div class="small_text">环比：{{view_obj.zflmjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zflmjs_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">有图评价数</div>
				<div class="sub_label">{{view_obj.ytpjs}}</div>
				<div class="small_text">环比：{{view_obj.ytpjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ytpjs_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">服务态度</div>
				<div class="sub_label">{{view_obj.fwtdpf}}</div>
				<div class="small_text">环比：{{view_obj.fwtdpf_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.fwtdpf_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">鱼塘快递费</div>
				<div class="sub_label">{{view_obj.ytkdf}}</div>
				<div class="small_text">环比：{{view_obj.ytkdf_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.ytkdf_tb}}</span></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">跳失率</div>
				<div class="sub_label">{{view_obj.tsl}}</div>
				<div class="small_text">环比：{{view_obj.tsl_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.tsl_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">新买家数</div>
				<div class="sub_label">{{view_obj.zfxmjs}}</div>
				<div class="small_text">环比：{{view_obj.zfxmjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zfxmjs_tb}}</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">正面评价数</div>
				<div class="sub_label">{{view_obj.zmpjs}}</div>
				<div class="small_text">环比：{{view_obj.zmpjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.zmpjs_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">物流服务</div>
				<div class="sub_label">{{view_obj.wlfwpf}}</div>
				<div class="small_text">环比：{{view_obj.wlfwpf_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.wlfwpf_tb}}</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">访问深度</div>
				<div class="sub_label">{{view_obj.fwsd}}</div>
				<div class="small_text">环比：{{view_obj.fwsd_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.fwsd_tb}}</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">负面评价数</div>
				<div class="sub_label">{{view_obj.fmpjs}}</div>
				<div class="small_text">环比：{{view_obj.fmpjs_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.fmpjs_tb}}</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">停留时长</div>
				<div class="sub_label">{{view_obj.pjtlsc}}</div>
				<div class="small_text">环比：{{view_obj.pjtlsc_hb}}</div>
				<div class="small_text">同比(周)：<span>{{view_obj.pjtlsc_tb}}</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
		</div>
	</div>
</div>
</template>
<style lang="less" scoped>
.cate_row{
	margin-top: 15px;
	width: 1142px;
	display: flex;
	justify-content: space-between;
	.cate_item{
		border-radius: 6px;
		border:1px solid #8a8a8a;
		width: 116px;
		height: 116px;
		display:flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;
		padding-top: 10px;
		padding-bottom: 10px;
		position: relative;
		.item_label{
			font-weight: bold;
			color: #333;
			font-size: 14px;
		}
		.sub_label{
			color: #1296db;
			font-size: 12px;
			font-weight: bold;
		}
		.small_text{
			color: #8a8a8a;
			font-size: 12px;
		}
		.column_line{
			background: #8a8a8a;
			position: absolute;
			height: 15px;
			width: 1px;	
			bottom: -16px;
			left: 50%;
			transform: translate(-50%);
		}
		.long_column_line{
			background: #8a8a8a;
			position: absolute;
			height: 278px;
			width: 1px;	
			bottom: -278px;
			left: 50%;
			transform: translate(-50%);
		}
		.row_line{
			background: #8a8a8a;
			position: absolute;
			height: 1px;
			width: 13px;	
			right: -20px;
			top: 50%;
			transform: translate(-50%);
		}
		.long_row_line{
			background: #8a8a8a;
			position: absolute;
			height: 1px;
			width: 141px;	
			right: -212px;
			top: 50%;
			transform: translate(-50%);
		}
	}
	.border_none{
		border:none;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				tjrq:"",
				view_obj:{},
			}
		},
		props:{
			shop_id:{
				type:String,
				default:""
			}
		},
		watch:{
			shop_id:function(n,o){
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
					tjrq:this.tjrq,
					shop_id:this.shop_id
				}
				resource.boardShop(req).then(res => {
					if(res.data.code == 1){
						this.view_obj = res.data.data;
					}else{
						this.$message.warning(res.data.msg)
					}
				})
			}
		}
	}
</script>