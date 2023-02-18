<template>
	<div>
		<div class="top_content flex ac jsa">
			<div class="top_item background_color relative height-100 flex fc ac">
				<img class="today_icon absolute" src="../../static/today_icon.png">
				<div class="color_item relative flex fc ac jc fw-500 f16 dfdds" @click="$emit('callback','111')">
					<div class="mb-17">代发订单数</div>
					<div>1000</div>
					<div class="l_line absolute"></div>
					<div class="r_line absolute"></div>
				</div>
				<div class="c_c_line"></div>
				<div class="width-100 flex jsb">
					<div class="color_item flex fc ac jc fw-500 f16 wsh">
						<div class="mb-17">代发订单未审核</div>
						<div>1000</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 fhs">
						<div class="mb-17">代发订单发货数</div>
						<div>1000</div>
					</div>
					<div class="color_item flex fc ac jc fw-500 f16 ysh">
						<div class="mb-17">代发订单已审核</div>
						<div>1000</div>
					</div>
				</div>
			</div>
			<div class="top_item background_color height-100 flex fc ac">
				<div class="r_item relative flex ac pl-14 mb-40">
					<img class="send_view_icon mr-14" src="../../static/send_view_03.png">
					<div class="r_content flex fc as jsb">
						<div class="dark_color f16">48小时内未发货</div>
						<div class="bold f22">200</div>
					</div>
					<div class="r_l_line absolute"></div>
					<div class="r_r_line absolute"></div>
				</div>
				<div class="width-100 flex jsb">
					<div class="r_item flex ac pl-14">
						<img class="send_view_icon mr-14" src="../../static/send_view_02.png">
						<div class="r_content flex fc as jsb">
							<div class="dark_color f16">代发今日未发货</div>
							<div class="bold f22">200</div>
						</div>
					</div>
					<div class="r_item flex ac pl-14">
						<img class="send_view_icon mr-14" src="../../static/send_view_04.png">
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
		padding: 22px 10px; 
		border-radius: 8px;
		width: 480px;
	}
	.today_icon{
		top: 14px;
		left: 14px;
		width: 29px;
		height: 27px;
	}
	.background_color{
		background-color: #ffffff;
	}
	.color_item{
		border-radius: 8px;
		width: 144px;
		height: 100px;
		.l_line{
			left:-85px;
			top:50px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
			width: 85px;
			height: 110px;
		}
		.r_line{
			right:-85px;
			top:50px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
			width: 85px;
			height: 110px;
		}
	}
	.c_c_line{
		height: 68px;
		width: 1px;
		background-color:#5288F8; 
	}
	.r_item{
		width: 210px;
		height: 116px;
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
		.r_l_line{
			left: -22px;
			top: 55px;
			width: 22px;
			height: 89px;
			border-top:1px solid #5288F8;
			border-left:1px solid #5288F8;
		}
		.r_r_line{
			right: -22px;
			top: 55px;
			width: 22px;
			height: 89px;
			border-top:1px solid #5288F8;
			border-right:1px solid #5288F8;
		}
	}
	.dfdds{
		background-color: #E3ECFF;
	}
	.wsh{
		background-color: #FFE0E0;
	}
	.fhs{
		background-color: #FFF9E3;
	}
	.ysh{
		background-color: #E8F8E8;
	}
}
</style>