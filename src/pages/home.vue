<template>
	<div>
		<el-container class="box">
			<el-header class="header">
				<div class="gxk">德儿网络数据中心</div>
				<div class="user_set">
					<el-popover
					@show="getList"
					placement="bottom"
					width="460"
					trigger="hover">
					<div>
						<el-form :inline="true" size="small" class="demo-form-inline">
							<el-form-item label="状态：">
								<el-select v-model="message_req.status" clearable :popper-append-to-body="false" size="small" placeholder="全部">
									<el-option label="已读" :value="1">
									</el-option>
									<el-option label="未读" :value="0">
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" size="small" @click="getList">搜索</el-button>
							</el-form-item>
						</el-form>
						<el-table :data="messageObj.data" size="small">
							<el-table-column align="center" prop="type" label="消息类型"></el-table-column>
							<el-table-column width="150" align="center" prop="title" label="标题">
							</el-table-column>
							<el-table-column width="100" align="center" prop="add_time" label="消息时间"></el-table-column>
							<el-table-column align="center" label="状态">
								<template slot-scope="scope">
									<el-button type="text" size="small" @click="messageDetail(scope.row)">{{scope.row.status == 1?'已读':'未读'}}</el-button>
								</template>
							</el-table-column>
						</el-table>
						<div class="page">
							<el-pagination
							@current-change="pageChange"
							:current-page="message_req.page"
							:pager-count="5"
							layout="total, prev, pager, next"
							:total="messageObj.total"
							>
						</el-pagination>
					</div> 
				</div>
				<el-button slot="reference" type="text">
					<div class="message_box">
						<img class="message_icon" src="../static/message_icon.png">
						<div class="num" v-if="readnum > 0">{{readnum}}</div>
					</div>
				</el-button>
			</el-popover>
			<div class="line"></div>
			<img class="admin_logo" src="../static/admin_logo.png">
			<div class="header_text">{{ding_user_name}}</div>
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
		<img class="welcome_icon" src="../static/welcome_img.png" v-if="show_welcome">
		<el-card class="el_card" v-else>
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
			.message_box{
				margin-right: 8px;
				position: relative;
				width: 22px;
				height: 17px;
				.message_icon{
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
				}
				.num{
					position: absolute;
					top: -10px;
					right: -18px;
					border-radius: 8px;
					background: red;
					width: 24px;
					text-align: center;
					height: 16px;
					line-height: 16px;
					font-size: 8px;
					color: #fff;
				}
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
			.welcome_icon{
				width: 100%;
				height: 100%;
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
				show_welcome:true,
				activeIndex:"",
				ding_user_name:"",
				readnum:0,
				message_req:{
					page:1,
					pagesize:10,
					type:"",
					status:0
				},
				messageObj:{

				}
			}
		},
		created(){
			//未读消息数
			this.unreadnum();
		},
		mounted(){
			this.ding_user_name = localStorage.getItem('ding_user_name');
			//获取菜单列表
			this.getMenuList();
		},	
		computed:{
			menu_list(){
				return this.$store.state.menu_list;
			}
		},
		watch:{
			$route(n){
				if(n.path != '/home'){
					this.show_welcome = false;
					this.activeIndex = n.path;
					this.$router.push(n.path)
				};
			}
		},
		methods:{
			//未读消息数
			unreadnum(){
				resource.unreadnum().then(res => {
					if(res.data.code == 1){
						this.readnum = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取消息列表
			getList(){
				resource.messageList(this.message_req).then(res => {
					if(res.data.code == 1){
						this.messageObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			pageChange(val) {
				this.message_req.page = val;
				//获取列表
				this.getList();
			},
			//跳转消息详情
			messageDetail(row){
					if(row.status == 0){
						resource.messageRead({id:row.message_id}).then(res => {
							if(res.data.code == 1){
								//未读消息数
								this.unreadnum();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
					if(row.web_url == 'show_sup' || row.web_url == 'show_match' || row.web_url == 'show_zng'){
						this.$router.push('/supplement?type' + row.web_url);
					}else{
						this.$router.push('/' + row.web_url);
					}
					
				},
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
			}
		}
	}
</script>




















