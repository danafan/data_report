<template>
	<div @contextmenu="showMenu">
		<el-container class="box">
			<el-header class="header">
				<div class="gxk">德儿网络数据中心</div>
				<div class="user_set">
					<el-button type="primary" size="small" icon="el-icon-document-add" circle style="margin-right: 15px" @click="newWindow"></el-button>
					<el-popover @show="getList" placement="bottom" width="460" trigger="hover">
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
				class="el-menu-vertical-demo"
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
				<template v-for="(item,index) in menu_list">
					<el-submenu :index="`/${item.web_url}`" v-if="item.show_type == 2">
						<template slot="title">
							<i :class="`el-icon-${item.icon}`"></i>
							<span>{{item.menu_name}}</span>
						</template>
						<div v-for="child in item.list">
							<div v-if="child.show_type == 1">
								<el-menu-item :index="`/${child.web_url}`">{{child.menu_name}}</el-menu-item>
							</div>
							<div v-if="child.show_type == 2">
								<el-submenu :index="`/${child.web_url}`">
									<template slot="title">{{child.menu_name}}</template>
									<el-menu-item :index="`/${ziItem.web_url}`" v-for="ziItem in child.list">{{ziItem.menu_name}}</el-menu-item>
								</el-submenu>
							</div>
						</div>
					</el-submenu>
					<el-menu-item :index="`/${item.web_url}`" v-else>
						<i :class="`el-icon-${item.icon}`"></i>
						<span slot="title">{{item.menu_name}}</span>
					</el-menu-item>
				</template>
				<el-menu-item index="/supplier_data_index">
					<i class="el-icon-s-finance"></i>
					<span slot="title">供应商数据管理</span>
				</el-menu-item>
				<!-- <el-menu-item index="/refund_status">
					<i class="el-icon-s-finance"></i>
					<span slot="title">退款情况看板</span>
				</el-menu-item> -->
			</el-menu>
		</div>
		<el-main class="main">
			<img class="welcome_icon" :class="{'width_style':is_phone == true}" src="../static/welcome_img.png" v-if="show_welcome">
			<el-card class="el_card" :class="{'width_style':is_phone == true}" id='scroll_content' v-else>
				<keep-alive>
					<router-view v-if="$route.meta.keepAlive"></router-view>
				</keep-alive>
				<router-view v-if="!$route.meta.keepAlive"></router-view>
			</el-card>
		</el-main>
	</el-container>
</el-container>
<vue-context-menu :contextMenuData="contextMenuData"
@home="newWindow"></vue-context-menu>
</div>
</template>
<style type="text/css">
.el-menu-vertical-demo{
	height: 100%;
	overflow-y: scroll !important;
}
</style>
<style lang="less" scoped>
.box{
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display:flex;
	flex-direction: column;
	.header{
		height: 120px;
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
				position: relative;
				height: 100%;
				overflow-y: scroll;
			}
			.width_style{
				width: 1680px;
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
<style type="text/css">
.btn-wrapper-simple{
	height: 24px !important;
}
</style>
<script>
	import watermark from '../api/watermark.js'
	import resource from '../api/resource.js'
	import * as dd from 'dingtalk-jsapi';
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
				messageObj:{},
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
         		},
         		breadcrumb_list:[],
         		is_phone:false
         	}
         },
         created(){
         	//判断是否是移动端
         	if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
         		this.is_phone = true;
         	}
			if(!this.$store.state.is_ding_talk){  //浏览器
        		//获取浏览器用户信息()
        		this.GetUserInfo();
      		}else{  //钉钉
         		//获取code
         		this.GetCode();
         	}
         },
         computed:{
         	menu_list(){
         		return this.$store.state.menu_list;
         	}
         },
         watch:{
         	$route(n){
         		if(n.path != '/'){
         			this.show_welcome = false;
         			if(n.path == '/data_management' || n.path == '/commit_data'){
         				this.activeIndex = '/data_fill';
         			}
         		};
         	}
         },
         methods:{
			//获取code
			GetCode(){
				dd.ready(() => {
					dd.runtime.permission.requestAuthCode({
						corpId: "ding7828fff434921f5b",
						onSuccess: res =>{
                			//获取钉钉用户信息
                			let code = res.code;
                			this.GetDingUserInfo(code);
                		},
                		onFail : err => {
                			alert('dd error: ' + JSON.stringify(err));
                		}
                	});
				});
			},
      		//钉钉获取用户信息
      		GetDingUserInfo(code){
      			resource.dingLogin({code:code}).then(res => {
      				if(res.data.code == 1){
      					this.localStorageData(res.data.data);
      				}else{
      					this.$message.warning(res.data.msg);
      				}
      			})
      		},
      		//获取浏览器用户信息
      		GetUserInfo(){
      			resource.login().then(res => {
      				if(res.data.code == 1){
      					this.localStorageData(res.data.data);
      				}else{
      					this.$message.warning(res.data.msg);
      				}
      			})
      		},
      		//浏览器缓存数据
      		localStorageData(data){
      			localStorage.setItem('login_token',data.login_token);
      			localStorage.setItem('ding_user_name',data.ding_user_name);
      			this.ding_user_name = localStorage.getItem('ding_user_name');
      			localStorage.setItem('ding_user_id',data.ding_user_id);
      			watermark.set(data.ding_user_name,data.ding_user_id);
      			localStorage.setItem('secret_key',data.secret_key);
      			localStorage.setItem('user_type',data.user_type);
      			//未读消息数
      			this.unreadnum();
				//获取菜单列表
				this.getMenuList();
			},
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
				this.$router.push('/' + row.web_url);
			},
			//获取菜单列表
			getMenuList(){
				resource.getMenu().then(res => {
					if(res.data.code == 1){
						let menu_list = res.data.data;
						this.$store.commit('menuList',menu_list);
						var query = this.$route.query;
						if(!!query.level2_url){
							this.activeIndex = `/${query.level2_url}`;
							this.$router.push(`/${query.level2_url}`);
							this.$store.commit('currentTab',query.level3_url);
						}else{
							if(this.$route.path != '/'){
								this.show_welcome = false;
							}
							//数据填报-数据管理
							if(this.$route.path == '/data_management' || this.$route.path == 'commit_data'){
								this.activeIndex = '/data_fill';
							}else{
								this.activeIndex = `${this.$route.path}`;
							}
							var query_list = [];
							for(let k in query){
								let s = k + '=' + query[k];
								query_list.push(s);
							}
							if(query_list.length > 0){
								this.$router.push(`${this.$route.path}?${query_list.join('&')}`);
							}else{
								this.$router.push(`${this.$route.path}`);
							}
						}
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			showMenu () {
				event.preventDefault();
				var x = event.clientX;
				var y = event.clientY;
				this.contextMenuData.axis = {
					x, y
				};
			},
			//打开新窗口
			newWindow(){
				var level2_url = window.location.hash.split('/')[1];
				var level3_url = this.$store.state.current_tab;
				if(!this.$store.state.is_ding_talk){  //浏览器
					window.open(`${window.location.href}?level2_url=${level2_url}&level3_url=${level3_url}`);
				}else{	//钉钉
					dd.ready(() => {
						dd.runtime.permission.requestAuthCode({
							corpId: "ding7828fff434921f5b",
							onSuccess: res =>{
               			 		//获取钉钉用户信息
               			 		let code = res.code;
               			 		window.open(`${location.origin}/code_login?code=${code}&level2_url=${level2_url}&level3_url=${level3_url}`);
               			 	},
               			 	onFail : err => {
               			 		alert('dd error: ' + JSON.stringify(err));
               			 	}
               			 });
					});
				}
			},
			//切换导航
			handleSelect(index){
				this.activeIndex = index;
				this.$store.commit('currentTab','');
			}
		}
	}
</script>




















