<template>
	<div class="box">
		<el-container style="height:100%">
			<el-aside>
				<div class="gxk">德儿网络数据中心</div>
				<el-menu
				:default-active="activeIndex"
				background-color="#363D66"
				text-color="#ffffff"
				active-text-color="#ffffff"
				:unique-opened="true"
				:router="true"
				@select="handleSelect"
				>
				<el-submenu index="0">
					<template slot="title">
						<i class="el-icon-s-platform"></i>
						<span>业务参考</span>
					</template>
					<el-menu-item-group>     
						<el-menu-item index="/store_data">店铺日数据</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
				<el-submenu index="1">
					<template slot="title">
						<i class="el-icon-s-data"></i>
						<span>业绩指标</span>
					</template>
					<el-menu-item-group>     
						<el-menu-item index="/store_results">店铺业绩</el-menu-item>
						<el-menu-item index="/run_weekly">运营周报</el-menu-item>
					</el-menu-item-group>
				</el-submenu>
			</el-menu>
		</el-aside>
		<el-container>
			<el-header class="header">
				<div class="user_set">
					<img class="message_icon" src="../static/message_icon.png">
					<div class="header_text">消息</div>
					<div class="line"></div>
					<img class="admin_logo" src="../static/admin_logo.png">
					<div class="header_text">admin</div>
					<div class="line"></div>
					<div class="header_text exit" @click="exit">退出</div>
				</div>
				<div class="breadcrumb">{{crumb}}</div>
			</el-header>
			<el-main class="main">
				<el-card class="el_card">
					<keep-alive>
						<router-view v-if="$route.meta.keepAlive"></router-view>
					</keep-alive>
					<router-view v-if="!$route.meta.keepAlive"></router-view>
				</el-card>
			</el-main>
		</el-container>
	</el-container>
</div>
</template>
<style lang="less" scoped>
.box{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	.el-aside{
		background:#363D66;
		width: 256px !important;
	}
	.gxk{
		background: #363D66;
		width: 256px;
		height: 120px;
		display:flex;
		align-items: center;
		justify-content: center;
		font-size: 18px;
		color: #fff;
	}
	.header{
		width: 100%;
		height: 128px !important;
		background:#fff !important;
		.user_set{
			border-bottom: 1px solid #ECEFF8;
			height: 64px;
			display: flex;
			align-items: center; 
			justify-content: flex-end;
			.line{
				margin-right: 8px;
				margin-left: 8px;
				border-right: 1px solid #363D66;
				height:13px;
			}
			.message_icon{
				margin-right: 8px;
				width: 20px;
				height: 17px;
			}
			.admin_logo{
				margin-right: 8px;
				width: 21px;
				height: 21px;
			}
			.header_text{
				font-size: 14px;
				color: #000;
			}
			.exit{
				color: #333333;
			}
		}
		.breadcrumb{
			height: 64px;
			line-height: 64px;
			font-size: 18px;
			color: #333333;
			font-weight:600;
		}
	}
	.is-active {
		background:#008DFF !important;
	}
	.el-menu{
		border: none !important;
	}
	.main{
		background: #ECEFF8;
		.el_card{
			height: 100%;
			overflow-y: scroll;
		}
	}
}
</style>
<script>
	// import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				activeIndex:"",
				crumb:""
			}
		},
		created(){
			let tab = sessionStorage.getItem("tab");
			if(!tab){
				this.activeIndex = '/store_results';
			}else{
				this.activeIndex = tab;
			}
			this.crumb = this.$route.name;
		},	
		watch:{
			$route(n){
				this.crumb = n.name;
				this.handleSelect(n.path);
			}
		},
		methods:{
			//切换导航
			handleSelect(index){
				this.activeIndex = index;
			},
			//点击退出
			exit(){
				this.$confirm('确认退出当前账户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// resource.quit().then(res => {
					// 	if(res.data.code == 1){
					// 		localStorage.clear();
					// 		this.$message.success(res.data.msg);
					// 		this.$router.push('/login');
					// 	}else{
					// 		this.$message.warning(res.data.msg);
					// 	}
					// })
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消退出'
					});          
				});
			}
		}
	}
</script>




















