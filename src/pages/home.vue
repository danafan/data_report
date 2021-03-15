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
					<div class="header_text">{{ding_user_name}}</div>
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
					<el-submenu :index="index.toString()" v-for="(item,index) in menu_list">
						<template slot="title">
							<i :class="`el-icon-${item.icon}`"></i>
							<span>{{item.menu_name}}</span>
						</template>
						<el-menu-item-group>     
							<el-menu-item :index="`/${menu.web_url}`" v-for="menu in item.list">{{menu.menu_name}}</el-menu-item>
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
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				isCollapse:false,
				activeIndex:"",
				ding_user_name:""
			}
		},
		mounted(){
			this.ding_user_name = localStorage.getItem('ding_user_name');
			//获取菜单列表
			this.getMenuList();
			// let tab = sessionStorage.getItem("tab");
			// if(!tab){
			// 	this.activeIndex = '/welcome';
			// }else{
			// 	this.activeIndex = tab;
			// }
		},	
		computed:{
			menu_list(){
				return this.$store.state.menu_list;
			}
		},
		watch:{
			$route(n){
				this.handleSelect(n.path);
			}
		},
		methods:{
			//获取菜单列表
			getMenuList(){
				resource.getMenu().then(res => {
					if(res.data.code == 1){
						let menu_list = res.data.data;
						this.$store.commit('menuList',menu_list);
            		}else{
            			this.$message.warning(res.data.msg);
            		}
            	})
            },
			//切换导航
			handleSelect(index){
				this.activeIndex = index;
			},
			//点击退出
			exit(){
				this.$confirm('当前退出没啥用哦！', '提示', {
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




















