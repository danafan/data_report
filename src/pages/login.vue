<template>
	<div class="login_container">
		<div class="login_back_box relative">
			<img class="absolute top-0 left-0 width-100 height-100" src="../static/login_back.png">
			<div class="deer absolute">德儿网络数据中心</div>
		</div>
		<div class="flex-1 flex ac jc">
			<div class="qrcode_box flex fc ac">
				<div class="qr_title f28 bold">扫码登录</div>
				<div id="container"></div>
			</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
	.login_container{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		.login_back_box{
			width: 859px;
			height: 100%;
			.deer{
				left: 50%;
				transform:translate(-50%);
				bottom: 120px;
				font-size: 48px;
				color: #0087FA;
				font-weight: 500;
			}
		}
		.qrcode_box{
			width: 477px;
			height: 470px;
			background: #FFFFFF;
			box-shadow: 0px 0px 29px 6px rgba(121,177,255,0.15);
			border-radius: 10px;
			.qr_title{
				margin-top: 40px;
				color: #0087FA;
			}
		}
	}
</style>
<script>
	import resource from '../api/resource.js'
	export default{
		data() {
			return {

			}
		},
		created(){
			this.getAppKey();
		},
		methods: {
			getAppKey() {
				resource.getConfig().then((res) => {
					if (res.data.code == 1) {
						let appKey = res.data.data.appkey;
						this.ddLoginInit(appKey);
					} else {
						this.$message.warning(res.data.msg);
					}
				});
			},
			ddLoginInit(appKey) {
				let url = `${location.origin}/api/scan_login`;
				const goto = encodeURIComponent(
					`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}`
					);
				window.DDLogin({
					id: "container",
					goto: goto,
					style: "border:none;background-color:#FFFFFF;margin:0 auto;",
	        		width: "100%", //官方参数 365
	        		height: "300", //官方参数 400
	        	});
				let handleMessage = (event) => {
					let origin = event.origin;
					if (origin == "https://login.dingtalk.com") {
						const loginTmpCode = event.data;
						window.location.href = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${appKey}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${url}&loginTmpCode=${loginTmpCode}`;
					}
				};
				if (typeof window.addEventListener != "undefined") {
					window.addEventListener("message", handleMessage, false);
				} else if (typeof window.attachEvent != "undefined") {
					window.attachEvent("onmessage", handleMessage);
				}
			}
		}
	}
</script>
