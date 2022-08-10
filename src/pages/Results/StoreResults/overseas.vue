<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="发货时间：">
				<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="店铺名称：">
				<el-select v-model="dpmc_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.shop_name" :value="item.shop_name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFn">搜索</el-button>
			</el-form-item>
		</el-form>
		<div class="buts">
			<div class="title">海外店铺日数据</div>
			<el-button type="primary" plain size="small" @click="commitExport('daydata')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="daydataData.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="day_loading">
			<el-table-column prop="dpmc" width="120" show-overflow-tooltip label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="rq" label="日期" width="120" align="center"></el-table-column>
			<el-table-column prop="xq" label="星期" align="center"></el-table-column>
			<el-table-column prop="rbhd" label="日本活动" align="center"></el-table-column>
			<el-table-column prop="hd" label="活动" align="center"></el-table-column>
			<el-table-column prop="jhfks" width="100" label="计划-访客数" align="center"></el-table-column>
			<el-table-column prop="sjfks" width="100" label="实际-访客数" align="center"></el-table-column>
			<el-table-column prop="jhzhl" width="100" label="计划-转化率" align="center"></el-table-column>
			<el-table-column prop="sjzhl" width="100" label="实际-转化率" align="center"></el-table-column>
			<el-table-column prop="jhkdj" width="100" label="计划-客单价" align="center"></el-table-column>
			<el-table-column prop="sjkdj" width="100" label="实际-客单价" align="center"></el-table-column>
			<el-table-column prop="jhdds" width="100" label="计划-订单数" align="center"></el-table-column>
			<el-table-column prop="sjdds" width="100" label="实际-订单数" align="center"></el-table-column>
			<el-table-column prop="jhgmv" width="100" label="计划-GMV" align="center"></el-table-column>
			<el-table-column prop="sjGMV" width="100" label="实际-GMV" align="center"></el-table-column>
			<el-table-column prop="jhzchy" width="100" label="计划-注册会员" align="center"></el-table-column>
			<el-table-column prop="sjzchy" width="100" label="实际-注册会员" align="center"></el-table-column>
			<el-table-column prop="dghkcb" width="100" label="单个获客成本" align="center"></el-table-column>
			<el-table-column prop="jhINSzf" width="110" label="计划-INS涨粉数" align="center"></el-table-column>
			<el-table-column prop="sjINSzfs" width="110" label="实际-INS涨粉数" align="center"></el-table-column>
			<el-table-column prop="tiktokfss" width="100" label="tiktok粉丝数" align="center"></el-table-column>
			<el-table-column prop="sjttfss" width="120" label="实际-推特粉丝数" align="center"></el-table-column>
			<el-table-column prop="jhtgfy" width="120" label="计划-推广费用" align="center"></el-table-column>
			<el-table-column prop="sjtgfy" width="120" label="实际-推广费用" align="center"></el-table-column>
			<el-table-column prop="FB" label="FB" align="center"></el-table-column>
			<el-table-column prop="Google" label="Google" align="center"></el-table-column>
			<el-table-column prop="TWITTER" label="TWITTER" align="center"></el-table-column>
			<el-table-column prop="yahoo" label="yahoo" align="center"></el-table-column>
			<el-table-column prop="tiktok" label="tiktok" align="center"></el-table-column>
			<el-table-column prop="whzscb" width="100" label="网红赠送成本" align="center"></el-table-column>
			<el-table-column prop="jhfs" label="计划-费损" align="center"></el-table-column>
			<el-table-column prop="sjfs" label="实际-费损" align="center"></el-table-column>
			<el-table-column prop="jhfd" width="100" label="计划返点(5%)" align="center"></el-table-column>
			<el-table-column prop="sjfd" width="100" label="实际返点(5%)" align="center"></el-table-column>
			<el-table-column prop="jhwlfy" width="100" label="计划-物流费用" align="center"></el-table-column>
			<el-table-column prop="sjwlfy" width="100" label="实际-物流费用" align="center"></el-table-column>
			<el-table-column prop="jhyxfy" width="100" label="计划-营销费用" align="center"></el-table-column>
			<el-table-column prop="sjyxfy" width="100" label="实际-营销费用" align="center"></el-table-column>
			<el-table-column prop="jhyxfyzb" width="130" label="计划-营销费用占比" align="center"></el-table-column>
			<el-table-column prop="sjyxfyzb" width="130" label="实际-营销费用占比" align="center"></el-table-column>
			<el-table-column prop="jhROI" label="计划-ROI" align="center"></el-table-column>
			<el-table-column prop="sjROI" label="实际-ROI" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="daydataPageSize" @current-change="daydataPage" :current-page="daydata_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="daydataData.total">
			</el-pagination>
		</div>
		<div class="buts">
			<div class="title">海外店铺销售数据</div>
			<el-button type="primary" plain size="small" @click="commitExport('giftcard')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="giftcardData.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="gift_loading">
			<el-table-column prop="dpmc" width="120" show-overflow-tooltip label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="rq" label="日期" align="center"></el-table-column>
			<el-table-column prop="zfkry" label="总付款(日元)" align="center"></el-table-column>
			<el-table-column prop="lpkry" label="礼品卡(日元)" align="center"></el-table-column>
			<el-table-column prop="xssrry" label="销售收入(日元)" align="center"></el-table-column>
			<el-table-column prop="ryhl" label="日元汇率" align="center"></el-table-column>
			<el-table-column prop="xssrrmb" label="销售收入(人民币)" align="center"></el-table-column>
			<el-table-column prop="xyk" label="信用卡" align="center"></el-table-column>
			<el-table-column prop="paypal" label="Paypal" align="center"></el-table-column>
			<el-table-column prop="bld" label="便利店" align="center"></el-table-column>
			<el-table-column prop="dds" label="订单数" align="center"></el-table-column>
			<el-table-column prop="lpkdd" label="礼品卡订单" align="center"></el-table-column>
			<el-table-column prop="tkds" label="退款单数" align="center"></el-table-column>
			<el-table-column prop="tkje" label="退款金额" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="giftcardPageSize" @current-change="giftcardPage" :current-page="giftcard_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="giftcardData.total">
			</el-pagination>
		</div>
		<div class="buts">
			<div class="title">海外店铺广告数据</div>
			<el-button type="primary" plain size="small" @click="commitExport('adv')">导出<i class="el-icon-download el-icon--right"></i></el-button>
		</div>
		<el-table size="small" :data="advData.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="adv_loading">
			<el-table-column prop="dpmc" width="120" show-overflow-tooltip label="店铺名称" align="center"></el-table-column>
			<el-table-column prop="rq" width="120" label="日期" align="center"></el-table-column>
			<el-table-column prop="hbdhmy" width="100" label="货币兑换(美元)" align="center"></el-table-column>
			<el-table-column prop="hbdhry" width="100" label="货币兑换(日元)" align="center"></el-table-column>
			<el-table-column prop="dpll" label="店铺流量" width="80" align="center">
			</el-table-column>
			<el-table-column prop="dpxse" label="店铺销售额" width="90" align="center">
			</el-table-column>
			<el-table-column prop="dpdds" width="90" label="店铺订单数" align="center"></el-table-column>
			<el-table-column prop="googleggylldjcs" width="180" label="google广告引流量(点击次数)" align="center"></el-table-column>
			<el-table-column prop="googleggdcdjhf" width="160" label="google广告单次点击花费" align="center"></el-table-column>
			<el-table-column prop="googleggzb" width="120" label="google广告占比" align="center"></el-table-column>
			<el-table-column prop="googleggdds" width="120" label="google广告订单数" align="center"></el-table-column>
			<el-table-column prop="googletghfUSD" width="140" label="google推广花费(USD)" align="center"></el-table-column>
			<el-table-column prop="googletghf" width="120" label="google推广花费" align="center"></el-table-column>
			<el-table-column prop="googleROAS" width="120" label="google ROAS" align="center"></el-table-column>
			<el-table-column prop="googleddszb" width="120" label="google订单数占比" align="center"></el-table-column>
			<el-table-column prop="googlezhl" width="120" label="google转化率" align="center"></el-table-column>
			<el-table-column prop="googlexseUSD" width="130" label="google销售额(USD)" align="center"></el-table-column>
			<el-table-column prop="googlexse" width="120" label="google销售额" align="center"></el-table-column>
			<el-table-column prop="googlexsezb" width="120" label="google销售额占比" align="center"></el-table-column>
			<el-table-column prop="twitterggyllwzfw" width="180" label="twitter广告引流量(网站访问)" align="center"></el-table-column>
			<el-table-column prop="twitterggzb" width="120" label="twitter广告占比" align="center"></el-table-column>
			<el-table-column prop="twitterggdds" width="120" label="twitter广告订单数" align="center"></el-table-column>
			<el-table-column prop="twitterddzb" width="120" label="twitter订单占比" align="center"></el-table-column>
			<el-table-column prop="twittertghfUSD" width="140" label="twitter推广花费(USD)" align="center"></el-table-column>
			<el-table-column prop="twittertghf" width="120" label="twitter推广花费" align="center"></el-table-column>
			<el-table-column prop="twitterxseUSD" width="140" label="twitter销售额(USD)" align="center"></el-table-column>
			<el-table-column prop="twitterxse" width="120" label="twitter销售额" align="center"></el-table-column>
			<el-table-column prop="twitterxsezb" width="120" label="twitter销售额占比" align="center"></el-table-column>
			<el-table-column prop="facebookggyll" width="140" label="facebook广告引流量" align="center"></el-table-column>
			<el-table-column prop="facebookggdcdjfy" width="180" label="facebook广告单次点击费用" align="center"></el-table-column>
			<el-table-column prop="facebookggzb" width="130" label="facebook广告占比" align="center"></el-table-column>
			<el-table-column prop="facebookggdds" width="140" label="facebook广告订单数" align="center"></el-table-column>
			<el-table-column prop="facebookddzb" width="130" label="facebook订单占比" align="center"></el-table-column>
			<el-table-column prop="facebookzhl" width="130" label="facebook转化率" align="center"></el-table-column>
			<el-table-column prop="facebooktghfUSD" width="160" label="facebook推广花费(USD)" align="center"></el-table-column>
			<el-table-column prop="facebooktghf" width="130" label="facebook推广花费" align="center"></el-table-column>
			<el-table-column prop="facebookROAS" width="120" label="facebook ROAS" align="center"></el-table-column>
			<el-table-column prop="facebookxseUSD" width="150" label="facebook销售额(USD)" align="center"></el-table-column>
			<el-table-column prop="facebookxse" width="120" label="facebook销售额" align="center"></el-table-column>
			<el-table-column prop="facebookxsezb" width="140" label="facebook销售额占比" align="center"></el-table-column>
			<el-table-column prop="yahooll" width="100" label="yahoo流量" align="center"></el-table-column>
			<el-table-column prop="yahoozb" width="100" label="yahoo占比" align="center"></el-table-column>
			<el-table-column prop="tiktokll" width="100" label="tiktok流量" align="center"></el-table-column>
			<el-table-column prop="tiktokzb" width="100" label="tiktok占比" align="center"></el-table-column>
			<el-table-column prop="ffllzj" width="100" label="付费流量总计" align="center"></el-table-column>
			<el-table-column prop="ffllzb" width="100" label="付费流量占比" align="center"></el-table-column>
			<el-table-column prop="zrll" width="80" label="自然流量" align="center"></el-table-column>
			<el-table-column prop="zrllzb" width="100" label="自然流量占比" align="center"></el-table-column>
			<el-table-column prop="zrcjdds" width="110" label="自然成交订单数" align="center"></el-table-column>
			<el-table-column prop="zrcjddzb" width="120" label="自然成交订单占比" align="center"></el-table-column>
			<el-table-column prop="zrcjzhl" width="120" label="自然成交转化率" align="center"></el-table-column>
			<el-table-column prop="zrxse" width="120" label="自然销售额" align="center"></el-table-column>
			<el-table-column prop="zrcjxszb" width="120" label="自然成交销售占比" align="center"></el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="advPageSize" @current-change="advPage" :current-page="adv_page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="advData.total">
			</el-pagination>
		</div>
	</div>
</template>
<style lang="less" scoped>
.buts{
	display: flex;
	justify-content: space-between;
	margin-top: 15px;
	margin-bottom: 15px;
	.title{
		font-size:14px;
		color: #333333;
		font-weight: bold;
	}
}
</style>
<script>
	import resource from '../../../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../../api/nowMonth.js'
	import {exportPost} from '../../../api/export.js'
	import { MessageBox,Message } from 'element-ui';
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 					//时间区间
				date:[],				//日期
				shop_list:[],			//店铺列表
				dpmc_ids:[],			//选中的店铺名称
				adv_page:1,				//海外店铺广告分页
				adv_pagesize:10,
				advData:{},				//海外店铺广告数据
				giftcard_page:1,		//海外店铺销售数据分页
				giftcard_pagesize:10,
				giftcardData:{},		//海外店铺销售数据
				daydata_page:1,			//海外店铺日数据分页
				daydata_pagesize:10,
				daydataData:{},			//海外店铺日数据
				day_loading:false,
				gift_loading:false,
				adv_loading:false

			}
		},
		created(){
			//获取店铺列表
			this.ajaxShops();
			//海外店铺广告数据
			this.getAdvData();
			//海外店铺销售数据
			this.overseasGiftcard();
			//海外店铺日数据
			this.overseasDaydata();
		},
		methods:{
			//获取店铺列表
			ajaxShops(){
				resource.ajaxViewStore().then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//搜索
			searchFn(){
				this.adv_page = 1;
				this.giftcard_page = 1;
				this.daydata_page = 1;
				//海外店铺广告数据
				this.getAdvData();
				//海外店铺销售数据
				this.overseasGiftcard();
				//海外店铺日数据
				this.overseasDaydata();
			},
			//海外店铺广告数据
			getAdvData(){
				let arg = {
					dpmc:this.dpmc_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					page:this.adv_page,
					pagesize:this.adv_pagesize
				}
				this.adv_loading = true;
				resource.overseasAdv(arg).then(res => {
					if(res.data.code == 1){
						this.adv_loading = false;
						this.advData = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			advPage(val) {
				this.adv_page = val;
				//海外店铺广告数据
				this.getAdvData();
			},
			advPageSize(val) {
				this.adv_pagesize = val;
				//海外店铺广告数据
				this.getAdvData();
			},
			//海外店铺销售数据
			overseasGiftcard(){
				let arg = {
					dpmc:this.dpmc_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					page:this.giftcard_page,
					pagesize:this.giftcard_pagesize
				}
				this.gift_loading = true;
				resource.overseasGiftcard(arg).then(res => {
					if(res.data.code == 1){
						this.gift_loading = false;
						this.giftcardData = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			giftcardPage(val) {
				this.giftcard_page = val;
				//海外店铺销售数据
				this.overseasGiftcard();
			},
			giftcardPageSize(val) {
				this.giftcard_pagesize = val;
				//海外店铺销售数据
				this.overseasGiftcard();
			},
			//海外店铺日数据
			overseasDaydata(){
				let arg = {
					dpmc:this.dpmc_ids.join(','),
					start_date:this.date && this.date.length> 0?this.date[0]:"",
					end_date:this.date && this.date.length> 0?this.date[1]:"",
					page:this.daydata_page,
					pagesize:this.daydata_pagesize
				}
				this.day_loading = true;
				resource.overseasDaydata(arg).then(res => {
					if(res.data.code == 1){
						this.day_loading = false;
						this.daydataData = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			daydataPage(val) {
				this.daydata_page = val;
				//海外店铺日数据
				this.overseasDaydata();
			},
			daydataPageSize(val) {
				this.daydata_pagesize = val;
				//海外店铺日数据
				this.overseasDaydata();
			},
			//导出
			commitExport(type){
				MessageBox.confirm('确认导出?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						dpmc:this.dpmc_ids.join(','),
						start_date:this.date && this.date.length> 0?this.date[0]:"",
						end_date:this.date && this.date.length> 0?this.date[1]:""
					}
					if(type == 'daydata'){
						resource.daydataExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'海外店铺日数据');
							}
						})
					}else if(type == 'giftcard'){
						resource.giftcardExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'海外店铺销售数据');
							}
						})
					}else{
						resource.advExport(arg).then(res => {
							if(res){
								exportPost("\ufeff" + res.data,'海外店铺广告数据');
							}
						})
					}
					
				}).catch(() => {
					Message({
						type: 'info',
						message: '取消导出'
					});          
				});
			},
		}
	}
</script>










