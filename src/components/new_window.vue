<template>
	<div @contextmenu="showMenu">
		<slot name="child"></slot>
		<vue-context-menu :contextMenuData="contextMenuData"
		@home="newWindow"></vue-context-menu>
	</div>
</template>
<style type="text/css">
.btn-wrapper-simple{
	height: 24px !important;
}
</style>
<script>
	export default{
		data(){
			return{
				level2_url:"",
				level3_url:"",
				contextMenuData: {
					menuName: 'demo',
         			//菜单显示的位置
         			axis: {
         				x: null,
         				y: null
         			},
         			//菜单选项
         			menulists: [{
         				fnHandler: 'home', 
         				btnName: '打开新窗口' 
         			}]
         		}
         	}
         },
         props:{
         	arg:{
         		type:Object,
         		default:{}
         	}
         },
         methods:{
         	showMenu () {
         		event.preventDefault();
         		var x = event.clientX;
         		var y = event.clientY;
         		this.contextMenuData.axis = {
         			x, y
         		};
         		this.level2_url = this.arg.level2_url;
         		this.level3_url = this.arg.level3_url;
         		console.log(this.level2_url)
         	},
         	newWindow(){
         		console.log(this.level2_url)
         		// let level2_url = this.arg.level2_url;
         		// let level3_url = this.arg.level3_url;
         		// console.log(this.level2_url);
         		// console.log(this.level3_url);
    //      		if(!this.$store.state.is_ding_talk){  //浏览器
				// 	window.open(`${window.location.href}?level2_url=${level2_url}&level3_url=${level3_url}`);
				// }else{	//钉钉
				// 	dd.ready(() => {
				// 		dd.runtime.permission.requestAuthCode({
				// 			corpId: "ding7828fff434921f5b",
				// 			onSuccess: res =>{
    //            			 		//获取钉钉用户信息
    //            			 		let code = res.code;
    //            			 		window.open(`${location.origin}/code_login?code=${code}&level2_url=${level2_url}&level3_url=${level3_url}`);
    //            			 	},
    //            			 	onFail : err => {
    //            			 		alert('dd error: ' + JSON.stringify(err));
    //            			 	}
    //            			 });
				// 	});
				// }
			}
		}
	}
</script>