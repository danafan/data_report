<template>
	<div>
		<div class="top_content flex ac jsa">
			<div class="top_item background_color height-100 flex fc ac jc">
				<div class="color_item relative flex fc ac jc fw-500 f16 mb-20 dfdds">
					<div class="mb-17">代发订单数</div>
					<div>1000</div>
					<div class="l_line absolute"></div>
					<div class="r_line absolute"></div>
				</div>
				<div class="width-100 flex jsb">
					<div class="color_item flex fc ac jc fw-500 f16 wsh">
						<div class="mb-17">代发订单未审核</div>
						<div>1000</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 ysh">
						<div class="mb-17">代发订单已审核</div>
						<div>1000</div>
					</div>
				</div>
			</div>
			<div class="top_item height-100 flex ac">
				<div class="height-100 flex fc jsb">
					<div class="r_item flex ac pl-20">
						<img class="send_view_icon mr-18" src="../../static/send_view_01.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">代发今日已发货</div>
							<div class="bold f22">200</div>
						</div>
					</div>
					<div class="r_item flex ac pl-20">
						<img class="send_view_icon mr-18" src="../../static/send_view_03.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">48小时内未发货</div>
							<div class="bold f22">200</div>
						</div>
					</div>
				</div>
				<div class="c_l_line">&nbsp&nbsp&nbsp&nbsp&nbsp</div>
				<div class="c_r_line">&nbsp&nbsp&nbsp&nbsp&nbsp</div>
				<div class="height-100 flex fc jsb">
					<div class="r_item flex ac pl-20">
						<img class="send_view_icon mr-18" src="../../static/send_view_02.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">代发今日未发货</div>
							<div class="bold f22">200</div>
						</div>
					</div>
					<div class="r_item flex ac pl-20">
						<img class="send_view_icon mr-18" src="../../static/send_view_04.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">超48小时内发货</div>
							<div class="bold f22">200</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default{

	}
</script>
<style lang="less" scoped>
.top_content{
	height: 332px;
	background-color: #ECEFF8;
	padding: 14px 24px;
	.top_item{
		padding: 14px 34px; 
		border-radius: 8px;
		width: 548px;
	}
	.background_color{
		background-color: #ffffff;
	}
	.color_item{
		border-radius: 8px;
		width: 200px;
		height: 128px;
		.l_line{
			left:-42px;
			bottom:-20px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
			width: 42px;
			height: 85px;
		}
		.r_line{
			right:-42px;
			bottom:-20px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
			width: 42px;
			height: 85px;
		}
	}
	.r_item{
		width: 240px;
		height: 128px;
		background: #FFFFFF;
		box-shadow: 0px 0px 8px 0px #E2EBFF;
		border-radius: 8px;
		.send_view_icon{
			width: 54px;
			height: 54px;
		}
		.r_content{
			height: 54px;
		}
	}
	.c_l_line{
		width: 22px;
		height: 156px;
		border-right:1px solid #5288F8;
		border-bottom:1px solid #5288F8;
	}
	.c_r_line{
		width: 22px;
		height: 156px;
		border-top:1px solid #5288F8;
	}
	.dfdds{
		background-color: #E3ECFF;
	}
	.wsh{
		background-color: #FFE0E0;
	}
	.ysh{
		background-color: #E8F8E8;
	}
}
</style>