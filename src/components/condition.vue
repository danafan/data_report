<template>
	<div>
		<el-form :inline="true" size="small" class="demo-form-inline">
			<el-form-item label="项目部：">
				<el-cascader
				ref="cascader"
				:options="dept_list"
				:props="props"
				filterable
				@change="getIds"
				@remove-tag="getIds"
				clearable></el-cascader>
			</el-form-item>
			<el-form-item label="店铺：">
				<el-select v-model="select_store_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in shop_list" :key="item.dept_id" :label="item.dept_name" :value="item.dept_id">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商：">
				<el-select v-model="select_gys_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商" :remote-method="getGys" collapse-tags >
					<el-option v-for="item in gys_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="供应商货号：">
				<el-select v-model="select_gyshh_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入供应商货号" :remote-method="getGyshh" collapse-tags>
					<el-option v-for="item in gyshh_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品类：">
				<el-select v-model="select_pl_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in pl_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="款式：">
				<el-select v-model="select_ks_ids" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入款式" :remote-method="getKsbm" collapse-tags>
					<el-option v-for="item in ks_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="品牌：" v-if="isShow('pp')">
				<el-select v-model="select_pp_list" clearable :popper-append-to-body="false" multiple filterable remote reserve-keyword placeholder="请输入品牌" :remote-method="ajaxPp" collapse-tags>
					<el-option v-for="item in pp_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="季节：" v-if="isShow('jj')">
				<el-select v-model="select_jj_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option label="春" value="春"></el-option>
					<el-option label="夏" value="夏"></el-option>
					<el-option label="秋" value="秋"></el-option>
					<el-option label="冬" value="冬"></el-option>
					<el-option label="四季" value="四季"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="预警值：" v-if="isShow('yjz')">
				<el-select v-model="select_yjs_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="小于等于0" value="0"></el-option>
					<el-option label="大于0" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="建议货品性质：" v-if="isShow('jyhpxz')">
				<el-select v-model="select_jyhpxz_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="试" value="试"></el-option>
					<el-option label="补" value="补"></el-option>
					<el-option label="停" value="停"></el-option>
					<el-option label="清" value="清"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="实际货品性质：" v-if="isShow('sjhpxz')">
				<el-select v-model="select_sjhpxz_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="试" value="1"></el-option>
					<el-option label="补" value="2"></el-option>
					<el-option label="停" value="3"></el-option>
					<el-option label="清" value="4"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="店铺销售性质：" v-if="isShow('dpxsxz')">
				<el-select v-model="select_xsxz_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="爆" value="5"></el-option>
					<el-option label="畅" value="4"></el-option>
					<el-option label="平" value="3"></el-option>
					<el-option label="滞" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="公司销售性质：" v-if="isShow('gsxsxz')">
				<el-select v-model="select_xsxz_gs_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="爆" value="5"></el-option>
					<el-option label="畅" value="4"></el-option>
					<el-option label="平" value="3"></el-option>
					<el-option label="滞" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="波段：">
				<el-select v-model="select_bd_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in bd_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="买手：" v-if="isShow('ms')">
				<el-select v-model="select_ms_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in ms_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购员：" v-if="isShow('cgy')">
				<el-select v-model="select_cgy_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cgy_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购性质：" v-if="isShow('cgxz')">
				<el-select v-model="select_cgxz_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in cgxz_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="建议运营决策：" v-if="isShow('yyjc')">
				<el-select v-model="select_yyjc_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in yyjc_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采购决策：" v-if="isShow('cgjc')">
				<el-select v-model="select_cgjc_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option v-for="item in cgjc_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="确认状态：" v-if="isShow('qrzt')">
				<el-select v-model="select_status_id" :popper-append-to-body="false" clearable placeholder="全部">
					<el-option label="未确认" value="0"></el-option>
					<el-option label="已确认" value="1"></el-option>
					<el-option :label="page_type == '7'?'已取消':'已修正'" value="2"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否可退：">
				<el-select v-model="select_sfkt_id" :popper-append-to-body="false" clearable placeolder="全部">
					<el-option label="不可退" value="0"></el-option>
					<el-option label="可退" value="1"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否内供：">
				<el-select v-model="select_sfng_id" :popper-append-to-body="false" clearable placeholder="全部">
					<el-option label="是" value="1"></el-option>
					<el-option label="否" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="自有货品：" v-if="isShow('sfzzk')">
					<el-select v-model="select_sfzzk_id" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option label="CHRISUNO" value="CHRISUNO"></el-option>
					<el-option label="白坯" value="白坯"></el-option>
					<el-option label="自主款" value="自主款"></el-option>
					<el-option label="海外" value="海外"></el-option>
					<el-option label="VASCO" value="VASCO"></el-option>
					<el-option label="其他" value="其他"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="性别：" v-if="isShow('xb')">
				<el-select v-model="select_xb_id" clearable :popper-append-to-body="false" placeholder="全部">
					<el-option label="男" value="男"></el-option>
					<el-option label="女" value="女"></el-option>
					<el-option label="通用" value="通用"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="选款方式：" v-if="isShow('xkfs')">
				<el-select v-model="select_xkfs_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in xkfs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="设计师：" v-if="isShow('sjs')">
				<el-select v-model="select_sjs_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in sjs_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="跟单员：" v-if="isShow('gdy')">
				<el-select v-model="select_gdy_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in gdy_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="价格带：" v-if="isShow('jgd')">
				<el-select v-model="select_jgd_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in jgd_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="负数库存：" v-if="isShow('fskc')">
				<el-input style="width:100px" clearable type="number" v-model="operator1" clearable placeholder="大于等于"></el-input>
				--
				<el-input style="width:100px" clearable type="number" v-model="operator2" clearable placeholder="小于"></el-input>
			</el-form-item>
			<el-form-item label="首卖日期:" v-if="isShow('smrq')">
				<el-date-picker v-model="sm_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="建档日期:" v-if="isShow('jdrq')">
				<el-date-picker v-model="jd_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="上架日期：" v-if="isShow('sjrq')">
				<el-date-picker v-model="sj_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="写入日期：" v-if="isShow('xrrq')">
				<el-date-picker v-model="xr_start_time" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="缓冲会议决策日期:" v-if="isShow('hchyjcrq')">
				<el-date-picker v-model="hchyjc_date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :append-to-body="false" :picker-options="pickerOptions">
				</el-date-picker>
			</el-form-item>
			<el-form-item label="操作人：" v-if="isShow('czr')">
				<el-select v-model="select_operator_ids" clearable :popper-append-to-body="false" multiple filterable collapse-tags placeholder="全部">
					<el-option v-for="item in operator_list" :key="item" :label="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" size="small" @click="searchFun">搜索</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<style lang="less" scoped>

</style>
<script>
	import resource from '../api/resource.js'
	import {getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../api/nowMonth.js'
	export default{
		data(){
			return{
				dept_list:[],								//部门列表
				select_dept_ids:[],							//选中的部门列表
				props:{
					multiple:true,
					value:'dept_id',
					label:'dept_name',
					children:'list',
				},
				shop_list:[],								//店铺列表
				select_store_ids:[],						//选中的店铺列表
				gys_list:[],								//供应商列表
				select_gys_ids:[],							//选中的供应商
				gyshh_list:[],								//供应商货号
				select_gyshh_ids:[],						//选中的供应商货号
				pl_list:[],									//品类列表
				select_pl_ids:[],							//选中的品类列表
				pp_list:[],									//品牌列表
				select_pp_list:[],							//选中的品牌列表
				ks_list:[],									//款式编码列表
				select_ks_ids:[],							//选中的款式编码列表
				select_jyhpxz_id:"",						//选中的建议货品性质
				select_sjhpxz_id:"",						//选中的实际货品性质
				bd_list:["四季（0101-1231）",
				"初春（1225-0207）",
				"立春（0208-0331）",
				"初夏（0222-0331）",
				"仲夏（0401-0528）",
				"夏末（0529-0721）",
				"初秋（0715-0812）",
				"深秋（0822-1031）",
				"初冬（0922-1107）",
				"深冬（1108-1231）"],									//波段列表
				select_bd_ids:[],							//选中的波段列表
				select_jy_id:"",							//建议
				select_sfkt_id:"",							//是否可退
				select_sfng_id:"",							//是否内供
				select_sfzzk_id:[],							//是否自主款
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
				},	 										//时间区间
				sj_date:[],									//上架日期
				sj_start_time:"",							//上架日期（开始时间）
				sj_end_time:"",								//上架日期（结束时间）
				xr_start_time:"",							//写入日期
				select_yjs_id:"",							//预警值
				select_xsxz_id:"",							//店铺销售性质
				select_xsxz_gs_id:"",						//公司销售性质
				select_status_id:"",						//确认状态
				operator1:"",								//负数库存1
				operator2:"",								//负数库存2
				yyjc_list:['转正','运营调整策略','下架'],								//运营决策列表
				select_yyjc_id:"",							//选中的运营决策
				cgjc_list:['退供应商'],								//采购决策列表
				select_cgjc_id:"",							//选中的采购决策
				select_jj_ids:[],							//选中的季节
				ms_list:[],									//买手列表
				select_ms_ids:[],							//选中的买手列表
				cgy_list:[],								//采购员列表
				select_cgy_ids:[],							//选中的采购员列表
				cgxz_list:[],								//采购性质
				select_cgxz_ids:[],							//选中的采购性质列表
				sm_date:[],									//首卖日期
				start_first_fkrq:"",						//首卖日期（开始时间）
				end_first_fkrq:"",							//首卖日期（结束时间）
				jd_date:[],									//建档日期
				start_cjrq:"",								//建档日期（开始时间）
				end_cjrq:"",								//建档日期（结束时间）
				select_xb_id:"",							//选中的性别			
				xkfs_list:[],								//选款方式列表	
				select_xkfs_ids:[],							//选中的选款方式
				sjs_list:[],								//设计师列表		
				select_sjs_ids:[],							//选中的设计师列表		
				gdy_list:[],								//跟单员列表
				select_gdy_ids:[],							//选中的跟单员列表	
				jgd_list:[
				"0-10",
				"10-20",
				"20-30",
				"30-40",
				"40-50",
				"50-60",
				"60-70",
				"70-80",
				"80-90",
				"90-100",
				"100-110",
				"110-120",
				"120-130",
				"130-140",
				"140-150",
				"150-160",
				"160-170",
				"170-180",
				"180-190",
				"190-200",
				"200-210",
				"210-220",
				"220-230",
				"230-240",
				"240-250",
				"250-260",
				"260-270",
				"270-280",
				"280-290",
				"290-300",
				"300-"
				],								//价格带列表
				select_jgd_ids:[],							//选中的价格带列表
				hchyjc_date:[],								//缓冲会议决策日期
				start_decision_rq:"",						//缓冲会议决策日期（开始时间）
				end_decision_rq:"",							//缓冲会议决策日期（结束时间）
				operator_list:[],							//操作人列表
				select_operator_ids:[],						//选中的操作人列表
				req_list:[{
					name:'pp',
					data_name:'select_pp_list',
					is_arr:true,
					tags:['5','6']
				},{
					name:'jj',
					data_name:'select_jj_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'yjs',
					data_name:'select_yjs_id',
					is_arr:false,
					tags:['2','5']
				},{
					name:'jyhpxz',
					data_name:'select_jyhpxz_id',
					is_arr:false,
					tags:['1','2','3','4','5']
				},{
					name:'sjhpxz',
					data_name:'select_sjhpxz_id',
					is_arr:false,
					tags:['1','5','6','7']
				},{
					name:'xsxz',
					data_name:'select_xsxz_id',
					is_arr:false,
					tags:['2','3','4']
				},{
					name:'xsxz_gs',
					data_name:'select_xsxz_gs_id',
					is_arr:false,
					tags:['2','3','4','5','6','7']
				},{
					name:'ms',
					data_name:'select_ms_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'cgy',
					data_name:'select_cgy_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'cgxz',
					data_name:'select_cgxz_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'yyjc',
					data_name:'select_yyjc_id',
					is_arr:false,
					tags:['1','4']
				},{
					name:'cgjc',
					data_name:'select_cgjc_id',
					is_arr:false,
					tags:['4']
				},{
					name:'status',
					data_name:'select_status_id',
					is_arr:false,
					tags:['2','5','7']
				},{
					name:'sfzzk',
					data_name:'select_sfzzk_id',
					is_arr:true,
					tags:['1','2','3','4','5','6']
				},{
					name:'xb',
					data_name:'select_xb_id',
					is_arr:false,
					tags:['6','7']
				},{
					name:'xkfs',
					data_name:'select_xkfs_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'sjs',
					data_name:'select_sjs_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'gdy',
					data_name:'select_gdy_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'jgd',
					data_name:'select_jgd_ids',
					is_arr:true,
					tags:['6','7']
				},{
					name:'operator_value1',
					data_name:'operator1',
					is_arr:false,
					tags:['2','3','4','5']
				},{
					name:'operator_value2',
					data_name:'operator2',
					is_arr:false,
					tags:['2','3','4','5']
				},{
					name:'start_first_fkrq',
					data_name:'start_first_fkrq',
					is_arr:false,
					tags:['6','7']
				},{
					name:'end_first_fkrq',
					data_name:'end_first_fkrq',
					is_arr:false,
					tags:['6','7']
				},{
					name:'start_cjrq',
					data_name:'start_cjrq',
					is_arr:false,
					tags:['6','7']
				},{
					name:'end_cjrq',
					data_name:'end_cjrq',
					is_arr:false,
					tags:['6','7']
				},{
					name:'sj_start_time',
					data_name:'sj_start_time',
					is_arr:false,
					tags:['1','2','3','4','5']
				},{
					name:'sj_end_time',
					data_name:'sj_end_time',
					is_arr:false,
					tags:['1','2','3','4','5']
				},{
					name:'xr_start_time',
					data_name:'xr_start_time',
					is_arr:false,
					tags:['1','2','3','4','5']
				},{
					name:'start_decision_rq',
					data_name:'start_decision_rq',
					is_arr:false,
					tags:['7']
				},{
					name:'end_decision_rq',
					data_name:'end_decision_rq',
					is_arr:false,
					tags:['7']
				},{
					name:'operator',
					data_name:'select_operator_ids',
					is_arr:true,
					tags:['7']
				}],
			}
		},
		props:{
			//1:试；2:补3；3:停；4:清；5:货品性质管理；6:商品信息管理；7:决策管理
			page_type:{
				type:String,
				default:''
			},
		},
		created(){
			//部门列表
			this.getDept();
			//店铺列表
			this.getStore();
			//品类列表
			this.getPl();
			if(this.page_type == '6' || this.page_type == '7'){
				//买手列表
				this.getMs();
				//采购员列表
				this.getCgy();
				//采购性质列表
				this.getCgxz();
				//选款方式
				this.getXkfs();
				//设计师列表
				this.getSjs();
				//跟单员列表
				this.getGdy();
			}
			if(this.page_type == '7'){
				//操作人列表
				this.getPerator();
			}

		},
		watch:{
			xr_start_time:function(n){
				this.xr_start_time = n?n:''
			},
			//上架日期
			sj_date:function(n){
				this.sj_start_time = n && n.length> 0?n[0]:"";
				this.sj_end_time = n && n.length> 0?n[1]:"";
			},
			//首卖日期
			sm_date:function(n){
				this.start_first_fkrq = n && n.length> 0?n[0]:"";
				this.end_first_fkrq = n && n.length> 0?n[1]:"";
			},
			//建档日期
			jd_date:function(n){
				this.start_cjrq = n && n.length> 0?n[0]:"";
				this.end_cjrq = n && n.length> 0?n[1]:"";
			},
			//缓冲会议决策日期
			hchyjc_date:function(n){
				this.start_decision_rq = n && n.length> 0?n[0]:"";
				this.end_decision_rq = n && n.length> 0?n[1]:"";
			}
		},
		methods:{
			//部门列表
			getDept(){
				if(this.$store.state.dept_list.length == 0){  
					resource.ajaxViewDept({from:1}).then(res => {
						if(res.data.code == 1){
							this.dept_list = res.data.data;
							this.$store.commit('setDeptList',this.dept_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.dept_list = this.$store.state.dept_list;
				}
			},
			//切换部门
			getIds(){
				this.$nextTick(()=>{
					var arr = [];
					var select_department = this.$refs.cascader.getCheckedNodes({leafOnly:true});
					select_department.map(s => {
						if(!!s.parent){	//最后一层有父级
							var m = s.parent;
							if(!!m.checked){ //倒数第二层被全选了
								if(!!m.parent){ //倒数第二层有父级
									var d = m.parent;
									if(!!d.checked){ //倒数第三层被全选了
										if(arr.indexOf(d.value) == -1){
											arr.push(d.value);
										}
									}else{
										if(arr.indexOf(m.value) == -1){
											arr.push(m.value);
										}
									}
								}else{
									if(arr.indexOf(m.value) == -1){
										arr.push(m.value);
									}
								}
							}else{
								arr.push(s.value);
							}
						}else{	//只有一层
							arr.push(s.value);
						}
					})
					this.select_dept_ids = arr;
					//店铺列表
					this.getStore();
				});
			},
			//店铺列表
			getStore(){
				this.select_store_ids = [];
				let dept_id = this.select_dept_ids.join(',');
				resource.ajaxViewStore({dept_id:dept_id,from:1}).then(res => {
					if(res.data.code == 1){
						this.shop_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			
			//供应商列表
			getGys(e){
				if(e != ''){
					resource.ajaxGys({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.gys_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//供应商货号
			getGyshh(e){
				if(e != ''){
					resource.ajaxGyshh({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.gyshh_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//品类列表
			getPl(){
				if(this.$store.state.pl_list.length == 0){  //品类列表是空的
					resource.ajaxPl({from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.pl_list = res.data.data;
							this.$store.commit('setPlList',this.pl_list);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{
					this.pl_list = this.$store.state.pl_list;
				}
			},
			//品牌列表
			ajaxPp(e){
				if(e != ''){
					resource.ajaxPp({name:e}).then(res => {
						if(res.data.code == 1){
							this.pp_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//款式编码
			getKsbm(e){
				if(e != ''){
					resource.ajaxKsbm({name:e,from:this.page_type}).then(res => {
						if(res.data.code == 1){
							this.ks_list = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//买手列表
			getMs(){
				resource.ajaxMs({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.ms_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//采购员列表
			getCgy(){
				resource.ajaxCgy({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.cgy_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//采购性质列表
			getCgxz(){
				resource.ajaxCgxz({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.cgxz_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//选款方式
			getXkfs(){
				resource.ajaxXkfs({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.xkfs_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//设计师列表
			getSjs(){
				resource.ajaxSjs({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.sjs_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//跟单员列表
			getGdy(){
				resource.ajaxGdy({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.gdy_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//操作人列表
			getPerator(){
				resource.commonoPerator({from:this.page_type}).then(res => {
					if(res.data.code == 1){
						this.operator_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//查询
			searchFun(){
				let req = {
					dept_id:this.select_dept_ids.join(','),
					shop_id:this.select_store_ids.join(','),
					gys:this.select_gys_ids.join(','),
					gyshh:this.select_gyshh_ids.join(','),
					pl:this.select_pl_ids.join(','),
					ks:this.select_ks_ids.join(','),
					bd:this.select_bd_ids.join(','),
					sfng:this.select_sfng_id,
					sfkt:this.select_sfkt_id,
				};
				this.req_list.map(item => {
					if(item.tags.indexOf(this.page_type) > -1){
						req[item.name] = item.is_arr?this[item.data_name].join(','):this[item.data_name];
					}
				})
				this.$emit('callBack',req);
			},
			//判断条件是否显示
			isShow(type){
				if(type == 'pp'){			//品牌
					if(this.page_type == '5' || this.page_type == '6'){
						return true;
					}
				}
				if(type == 'jj'){			//季节
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'yjz'){			//预警值
					if(this.page_type == '2' || this.page_type == '5'){
						return true;
					}
				}
				if(type == 'jyhpxz'){		//建议货品性质
					if(this.page_type == '1' || this.page_type == '2' || this.page_type == '3' || this.page_type == '4' || this.page_type == '5'){
						return true;
					}
				}
				if(type == 'sjhpxz'){		//实际货品性质
					if(this.page_type == '1' || this.page_type == '5' || this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'dpxsxz'){		//店铺销售性质
					if(this.page_type == '2' || this.page_type == '3' || this.page_type == '4'){
						return true;
					}
				}
				if(type == 'gsxsxz'){		//公司销售性质
					if(this.page_type == '2' || this.page_type == '3' || this.page_type == '4' || this.page_type == '5' || this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'ms'){			//买手
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'cgy'){			//采购员
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'cgxz'){			//采购性质
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'yyjc'){			//建议运营决策
					if(this.page_type == '1' || this.page_type == '4'){
						return true;
					}
				}
				if(type == 'cgjc'){			//采购决策
					if(this.page_type == '4'){
						return true;
					}
				}
				if(type == 'qrzt'){			//确认状态
					if(this.page_type == '2' || this.page_type == '5' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'sfzzk'){		//是否自主款
					if(this.page_type == '1' || this.page_type == '2' || this.page_type == '3' || this.page_type == '4' || this.page_type == '5' || this.page_type == '6'){
						return true;
					}
				}	
				if(type == 'xb'){			//性别
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}	
				if(type == 'xkfs'){			//选款方式
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'sjs'){			//设计师
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'gdy'){			//跟单员
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}	
				if(type == 'jgd'){			//价格带
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}	
				if(type == 'fskc'){			//负数库存
					if(this.page_type == '2' || this.page_type == '3' || this.page_type == '4' || this.page_type == '5'){
						return true;
					}
				}	
				if(type == 'smrq'){			//首卖日期
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}
				if(type == 'jdrq'){			//建档日期
					if(this.page_type == '6' || this.page_type == '7'){
						return true;
					}
				}	
				if(type == 'sjrq'){			//上架日期
					if(this.page_type == '1' || this.page_type == '2' || this.page_type == '3' || this.page_type == '4' || this.page_type == '5'){
						return true;
					}
				}
				if(type == 'xrrq'){			//写入日期
					if(this.page_type == '1' || this.page_type == '2' || this.page_type == '3' || this.page_type == '4' || this.page_type == '5'){
						return true;
					}
				}
				if(type == 'hchyjcrq'){		//缓冲会议决策日期
					if(this.page_type == '7'){
						return true;
					}
				}
				if(type == 'czr'){			//操作人
					if(this.page_type == '7'){
						return true;
					}
				}	
			}
		}
	}
</script>













