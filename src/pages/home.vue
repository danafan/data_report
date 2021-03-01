<template>
	<div>
		<el-container class="box">
			<el-header class="header">
				<div class="gxk">德儿网络数据中心</div>
				<div class="user_set">
					<img class="message_icon" src="../static/message_icon.png">
					<div class="header_text">消息</div>
					<div class="line"></div>
					<img class="admin_logo" src="../static/admin_logo.png">
					<div class="header_text">admin</div>
					<div class="line"></div>
					<div class="header_text exit" @click="exit">退出</div>
				</div>
			</el-header>
			<el-container class="content_box">
				<div class="left_box">
					<el-menu
					@select="handleSelect" 
					:router="true" 
					:unique-opened="true" 
					:collapse="isCollapse" 
					:default-active="activeIndex"
					background-color="#363D66"
					text-color="#ffffff"
					active-text-color="#ffffff"
					:collapse-transition="false"
					>
					<div class="dd" :class="{'start_dd':isCollapse}">
						<i class="el-icon-s-unfold collapse_icon" v-if="isCollapse" @click="isCollapse = !isCollapse"></i>
						<i class="el-icon-s-fold collapse_icon" v-else @click="isCollapse = !isCollapse"></i>
					</div>
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
							<el-menu-item index="/performance">个人绩效</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
					<el-submenu index="2">
						<template slot="title">
							<i class="el-icon-s-data"></i>
							<span>系统管理</span>
						</template>
						<el-menu-item-group>     
							<el-menu-item index="/permssions_index">权限管理</el-menu-item>
						</el-menu-item-group>
					</el-submenu>
				</el-menu>
			</div>
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
	.header{
		background:#fff !important;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.gxk{
			margin-left: 20px;
			font-size: 18px;
			color: #333;
			font-weight: 600;
		}
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
	}
	.is-active {
		background:#008DFF !important;
	}
	.el-menu{
		border: none !important;
	}
	.content_box{
		height: 600px;
		.left_box{
			background: #363D66;
			display: flex;
			flex-direction: column;
			height: 100%;
			.dd{
				height: 35px;
				display: flex;
				align-items: flex-end;
				justify-content: flex-end;
				padding-right: 18px;
				.collapse_icon{
					color: #fff;
					font-size:20px;
				}
			}
			.start_dd{
				justify-content: flex-start;
				padding-left: 24px;
			}
		}
		.main{
			background: #ECEFF8;
			height: 100%;
			.el_card{
				height: 100%;
				overflow-y: scroll;
			}
			.el_card::-webkit-scrollbar {
				display: none; 
			}
			.demo {
				scrollbar-width: none; 
				-ms-overflow-style: none; 
				overflow-x: auto;
				overflow-y: hidden;
			}
		}
	}
}
</style>
<script>
	// import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				isCollapse:false,
				activeIndex:"",
				crumb:""
			}
		},
		created(){
			let tab = sessionStorage.getItem("tab");
			console.log(tab)
			if(!tab){
				this.activeIndex = '/permissions';
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




















