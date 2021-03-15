<template>
	<div class="welcome_container">
		<div class="welcome_text">{{menu_list.length > 0?'全心全意为您提供数据支持，希望您能满意哦！':'亲：请联系管理员为您设置权限哦！'}}</div>
		<img class="welcome_icon" src="../static/welcome_icon.png">
		<div class="welcome_text">全心全意为您提供数据支持，希望您能满意哦！</div>
	</div>
</template>
<style lang="less" scoped>
.welcome_container{
	padding-top: 50px;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-around;
	.welcome_text{
		margin-top: 80px;
		color: #5575EB;
		font-size: 36px;
		font-weight: 600;
	}
	.welcome_icon{
		width: 624px;
		height: 372px;
	}
}

</style>
<script>
	export default{
		computed:{
			menu_list(){
				return this.$store.state.menu_list;
			}
		},
	}
</script>