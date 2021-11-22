<template>
	<div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">UV价值</div>
				<div class="sub_label">{{view_obj.uvjz}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.uvjz_hb > 0,'green_color': view_obj.uvjz_hb < 0}">{{view_obj.uvjz_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.uvjz_tb > 0,'green_color': view_obj.uvjz_tb < 0}">{{view_obj.uvjz_tb}}%</span></div>
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
				<div class="t_v">
					<div class="t">实际GMV</div>
					<div class="v">{{view_obj.sj_gmw}}</div>
				</div>
				<div class="item_label">GMV</div>
				<div class="sub_label">{{view_obj.zfje}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zfje_hb > 0,'green_color': view_obj.zfje_hb < 0}">{{view_obj.zfje_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zfje_tb > 0,'green_color': view_obj.zfje_tb < 0}">{{view_obj.zfje_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="long_row_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">成功退款</div>
				<div class="sub_label">{{view_obj.cgtkje}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.cgtkje_hb > 0,'green_color': view_obj.cgtkje_hb < 0}">{{view_obj.cgtkje_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.cgtkje_tb > 0,'green_color': view_obj.cgtkje_tb < 0}">{{view_obj.cgtkje_tb}}%</span></div>
				<div class="long_row_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="t_v">
					<div class="t">实际GMV占比</div>
					<div class="v">{{view_obj.sj_gmw_zb}}</div>
				</div>
				<div class="item_label">推广支出</div>
				<div class="sub_label">{{view_obj.tgzc}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.tgzc_hb > 0,'green_color': view_obj.tgzc_hb < 0}">{{view_obj.tgzc_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.tgzc_tb > 0,'green_color': view_obj.tgzc_tb < 0}">{{view_obj.tgzc_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
		</div>
		<div class="cate_row">
			<div class="cate_item">
				<div class="item_label">访客数</div>
				<div class="sub_label">{{view_obj.fks}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.fks_hb > 0,'green_color': view_obj.fks_hb < 0}">{{view_obj.fks_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.fks_tb > 0,'green_color': view_obj.fks_tb < 0}">{{view_obj.fks_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">客单价</div>
				<div class="sub_label">{{view_obj.kdj}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.kdj_hb > 0,'green_color': view_obj.kdj_hb < 0}">{{view_obj.kdj_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.kdj_tb > 0,'green_color': view_obj.kdj_tb < 0}">{{view_obj.kdj_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">支付转化率</div>
				<div class="sub_label">{{view_obj.zfzhl}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zfzhl_hb > 0,'green_color': view_obj.zfzhl_hb < 0}">{{view_obj.zfzhl_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zfzhl_tb > 0,'green_color': view_obj.zfzhl_tb < 0}">{{view_obj.zfzhl_tb}}%</span></div>
				<div class="long_column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="zb">{{view_obj.ztcxhzb}}</div>
				<div class="item_label">直通车消耗</div>
				<div class="sub_label">{{view_obj.ztcxh}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ztcxh_hb > 0,'green_color': view_obj.ztcxh_hb < 0}">{{view_obj.ztcxh_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ztcxh_tb > 0,'green_color': view_obj.ztcxh_tb < 0}">{{view_obj.ztcxh_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="zb">{{view_obj.zzxhzb}}</div>
				<div class="item_label">钻展消耗</div>
				<div class="sub_label">{{view_obj.zszwxh}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zszwxh_hb > 0,'green_color': view_obj.zszwxh_hb < 0}">{{view_obj.zszwxh_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zszwxh_tb > 0,'green_color': view_obj.zszwxh_tb < 0}">{{view_obj.zszwxh_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="zb">{{view_obj.cjtjzb}}</div>
				<div class="item_label">超级推荐</div>
				<div class="sub_label">{{view_obj.cjtjxh}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.cjtjxh_hb > 0,'green_color': view_obj.cjtjxh_hb < 0}">{{view_obj.cjtjxh_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.cjtjxh_tb > 0,'green_color': view_obj.cjtjxh_tb < 0}">{{view_obj.cjtjxh_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="zb">{{view_obj.tkyjzb}}</div>
				<div class="item_label">淘客佣金</div>
				<div class="sub_label">{{view_obj.tbkyj}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.tbkyj_hb > 0,'green_color': view_obj.tbkyj_hb < 0}">{{view_obj.tbkyj_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.tbkyj_tb > 0,'green_color': view_obj.tbkyj_tb < 0}">{{view_obj.tbkyj_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="zb">{{view_obj.ytxhzb}}</div>
				<div class="item_label">鱼塘支付</div>
				<div class="sub_label">{{view_obj.ytzfje}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ytzfje_hb > 0,'green_color': view_obj.ytzfje_hb < 0}">{{view_obj.ytzfje_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ytzfje_tb > 0,'green_color': view_obj.ytzfje_tb < 0}">{{view_obj.ytzfje_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item">
				<div class="item_label">老访客数</div>
				<div class="sub_label">{{view_obj.lfks}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.lfks_hb > 0,'green_color': view_obj.lfks_hb < 0}">{{view_obj.lfks_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.lfks_tb > 0,'green_color': view_obj.lfks_tb < 0}">{{view_obj.lfks_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">连带率</div>
				<div class="sub_label">{{view_obj.ldl}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ldl_hb > 0,'green_color': view_obj.ldl_hb < 0}">{{view_obj.ldl_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ldl_tb > 0,'green_color': view_obj.ldl_tb < 0}">{{view_obj.ldl_tb}}%</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.ztctcb}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ztctcb_hb > 0,'green_color': view_obj.ztctcb_hb < 0}">{{view_obj.ztctcb_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ztctcb_tb > 0,'green_color': view_obj.ztctcb_tb < 0}">{{view_obj.ztctcb_tb}}%</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.zztcb}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zztcb_hb > 0,'green_color': view_obj.zztcb_hb < 0}">{{view_obj.zztcb_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zztcb_tb > 0,'green_color': view_obj.zztcb_tb < 0}">{{view_obj.zztcb_tb}}%</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.cjtjtcb}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.cjtjtcb_hb > 0,'green_color': view_obj.cjtjtcb_hb < 0}">{{view_obj.cjtjtcb_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.cjtjtcb_tb > 0,'green_color': view_obj.cjtjtcb_tb < 0}">{{view_obj.cjtjtcb_tb}}%</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">投产比</div>
				<div class="sub_label">{{view_obj.tkyjtcb}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.tkyjtcb_hb > 0,'green_color': view_obj.tkyjtcb_hb < 0}">{{view_obj.tkyjtcb_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.tkyjtcb_tb > 0,'green_color': view_obj.tkyjtcb_tb < 0}">{{view_obj.tkyjtcb_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">支付买家数</div>
				<div class="sub_label">{{view_obj.ytzfmjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ytzfmjs_hb > 0,'green_color': view_obj.ytzfmjs_hb < 0}">{{view_obj.ytzfmjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ytzfmjs_tb > 0,'green_color': view_obj.ytzfmjs_tb < 0}">{{view_obj.ytzfmjs_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item">
				<div class="item_label">新访客数</div>
				<div class="sub_label">{{view_obj.xfks}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.xfks_hb > 0,'green_color': view_obj.xfks_hb < 0}">{{view_obj.xfks_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.xfks_tb > 0,'green_color': view_obj.xfks_tb < 0}">{{view_obj.xfks_tb}}%</span></div>
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
				<div class="small_text">环比：<span :class="{'red_color': view_obj.tbk_je_hb > 0,'green_color': view_obj.tbk_je_hb < 0}">{{view_obj.tbk_je_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.tbk_je_tb > 0,'green_color': view_obj.tbk_je_tb < 0}">{{view_obj.tbk_je_tb}}%</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">支付单量</div>
				<div class="sub_label">{{view_obj.ytdl}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ytdl_hb > 0,'green_color': view_obj.ytdl_hb < 0}">{{view_obj.ytdl_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ytdl_tb > 0,'green_color': view_obj.ytdl_tb < 0}">{{view_obj.ytdl_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">加购率</div>
				<div class="sub_label">{{view_obj.jgl}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.jgl_hb > 0,'green_color': view_obj.jgl_hb < 0}">{{view_obj.jgl_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.jgl_tb > 0,'green_color': view_obj.jgl_tb < 0}">{{view_obj.jgl_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">买家数</div>
				<div class="sub_label">{{view_obj.zfmjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zfmjs_hb > 0,'green_color': view_obj.zfmjs_hb < 0}">{{view_obj.zfmjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zfmjs_tb > 0,'green_color': view_obj.zfmjs_tb < 0}">{{view_obj.zfmjs_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">评价数</div>
				<div class="sub_label">{{view_obj.pjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.pjs_hb > 0,'green_color': view_obj.pjs_hb < 0}">{{view_obj.pjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.pjs_tb > 0,'green_color': view_obj.pjs_tb < 0}">{{view_obj.pjs_tb}}%</span></div>
				<div class="column_line"></div>
				<div class="row_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">描述相符</div>
				<div class="sub_label">{{view_obj.msxfpf}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.msxfpf_hb > 0,'green_color': view_obj.msxfpf_hb < 0}">{{view_obj.msxfpf_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.msxfpf_tb > 0,'green_color': view_obj.msxfpf_tb < 0}">{{view_obj.msxfpf_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">鱼塘佣金</div>
				<div class="sub_label">{{view_obj.ytyj}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ytyj_hb > 0,'green_color': view_obj.ytyj_hb < 0}">{{view_obj.ytyj_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ytyj_tb > 0,'green_color': view_obj.ytyj_tb < 0}">{{view_obj.ytyj_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">收藏率</div>
				<div class="sub_label">{{view_obj.scl}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.scl_hb > 0,'green_color': view_obj.scl_hb < 0}">{{view_obj.scl_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.scl_tb > 0,'green_color': view_obj.scl_tb < 0}">{{view_obj.scl_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">老买家数</div>
				<div class="sub_label">{{view_obj.zflmjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zflmjs_hb > 0,'green_color': view_obj.zflmjs_hb < 0}">{{view_obj.zflmjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zflmjs_tb > 0,'green_color': view_obj.zflmjs_tb < 0}">{{view_obj.zflmjs_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">有图评价数</div>
				<div class="sub_label">{{view_obj.ytpjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ytpjs_hb > 0,'green_color': view_obj.ytpjs_hb < 0}">{{view_obj.ytpjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ytpjs_tb > 0,'green_color': view_obj.ytpjs_tb < 0}">{{view_obj.ytpjs_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">服务态度</div>
				<div class="sub_label">{{view_obj.fwtdpf}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.fwtdpf_hb > 0,'green_color': view_obj.fwtdpf_hb < 0}">{{view_obj.fwtdpf_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.fwtdpf_tb > 0,'green_color': view_obj.fwtdpf_tb < 0}">{{view_obj.fwtdpf_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">鱼塘快递费</div>
				<div class="sub_label">{{view_obj.ytkdf}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.ytkdf_hb > 0,'green_color': view_obj.ytkdf_hb < 0}">{{view_obj.ytkdf_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.ytkdf_tb > 0,'green_color': view_obj.ytkdf_tb < 0}">{{view_obj.ytkdf_tb}}%</span></div>
			</div>
		</div>
		<div class="cate_row">
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">跳失率</div>
				<div class="sub_label">{{view_obj.tsl}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.tsl_hb > 0,'green_color': view_obj.tsl_hb < 0}">{{view_obj.tsl_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.tsl_tb > 0,'green_color': view_obj.tsl_tb < 0}">{{view_obj.tsl_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">新买家数</div>
				<div class="sub_label">{{view_obj.zfxmjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zfxmjs_hb > 0,'green_color': view_obj.zfxmjs_hb < 0}">{{view_obj.zfxmjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zfxmjs_tb > 0,'green_color': view_obj.zfxmjs_tb < 0}">{{view_obj.zfxmjs_tb}}%</span></div>
			</div>
			<div class="cate_item">
				<div class="item_label">正面评价数</div>
				<div class="sub_label">{{view_obj.zmpjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.zmpjs_hb > 0,'green_color': view_obj.zmpjs_hb < 0}">{{view_obj.zmpjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.zmpjs_tb > 0,'green_color': view_obj.zmpjs_tb < 0}">{{view_obj.zmpjs_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item">
				<div class="item_label">物流服务</div>
				<div class="sub_label">{{view_obj.wlfwpf}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.wlfwpf_hb > 0,'green_color': view_obj.wlfwpf_hb < 0}">{{view_obj.wlfwpf_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.wlfwpf_tb > 0,'green_color': view_obj.wlfwpf_tb < 0}">{{view_obj.wlfwpf_tb}}%</span></div>
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
				<div class="small_text">环比：<span :class="{'red_color': view_obj.fwsd_hb > 0,'green_color': view_obj.fwsd_hb < 0}">{{view_obj.fwsd_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.fwsd_tb > 0,'green_color': view_obj.fwsd_tb < 0}">{{view_obj.fwsd_tb}}%</span></div>
				<div class="column_line"></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item">
				<div class="item_label">负面评价数</div>
				<div class="sub_label">{{view_obj.fmpjs}}</div>
				<div class="small_text">环比：<span :class="{'red_color': view_obj.fmpjs_hb > 0,'green_color': view_obj.fmpjs_hb < 0}">{{view_obj.fmpjs_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.fmpjs_tb > 0,'green_color': view_obj.fmpjs_tb < 0}">{{view_obj.fmpjs_tb}}%</span></div>
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
				<div class="small_text">环比：<span :class="{'red_color': view_obj.pjtlsc_hb > 0,'green_color': view_obj.pjtlsc_hb < 0}">{{view_obj.pjtlsc_hb}}%</span></div>
				<div class="small_text">同比(年)：<span :class="{'red_color': view_obj.pjtlsc_tb > 0,'green_color': view_obj.pjtlsc_tb < 0}">{{view_obj.pjtlsc_tb}}%</span></div>
			</div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
			<div class="cate_item border_none"></div>
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
		.zb{
			position: absolute;
			top: -20px;
			height: 20px;
			width: 100%;
			display:flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
			color: #FD7B08;
		}
		.t_v{
			position: absolute;
			top: -36px;
			height: 36px;
			width: 100%;
			display:flex;
			flex-direction: column;
			align-items: center;
			font-size: 12px;
			.t{
				color: #333;
			}
			.v{
				color: #FD7B08;
			}
		}
		.item_label{
			font-weight: bold;
			color: #333;
			font-size: 14px;
		}
		.sub_label{
			color: #1296db;
			font-size: 18px;
			font-weight: bold;
		}
		.small_text{
			font-size: 12px;
			color: #8a8a8a;
			.red_color{
				color: red;
			}
			.green_color{
				color: green;
			}
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
	import resource from '../../../../api/resource.js'
	export default{
		data(){
			return{
				view_obj:{},
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
				type:Array,
				default:[]
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
					start_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[0],
					end_tjrq:!this.tjrq || this.tjrq.length == 0?'':this.tjrq[1],
					platform:this.platform
				}
				resource.boardPeriodShop(req).then(res => {
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