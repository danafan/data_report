<template>
	<div>
		<div class="buts">
			<el-button type="primary" plain size="small" @click="allDeal">批量处理</el-button>
			<div class="right_buts">
				<el-button type="primary" plain size="small">导出<i class="el-icon-download el-icon--right"></i></el-button>
				<el-button type="primary" plain size="small" @click="$router.push('/created_demand')">新建<i class="el-icon-circle-plus-outline el-icon--right"></i></el-button>
			</div>
		</div>
		<el-table size="small" ref="multipleTable" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" @selection-change="handleSelectionChange">
			<el-table-column type="selection" width="55" fixed="left"></el-table-column>
			<el-table-column label="操作" align="center" width="120" fixed="left">
				<template slot-scope="scope">
					<el-button type="text" size="small" @click="$router.push('/procurement_info')">详情</el-button>
					<el-button type="text" size="small">处理</el-button>
				</template>
			</el-table-column>
			<el-table-column prop="date" label="提报日期" align="center" width="120">
			</el-table-column>
			<el-table-column prop="dept_store" label="项目部/店铺" align="center" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="店铺链接" align="center" width="150" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="提报人" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="一级类目" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="二级类目" align="center" width="100" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="版型、面料、工艺、颜色" align="center" width="180">
				<template slot-scope="scope">
					<el-image style="width: 160px; height: 80px" :src="scope.row.srcList[0]" :preview-src-list="scope.row.srcList">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="dept_store" label="参考店铺链接" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="参看店铺图片" align="center" width="180">
				<template slot-scope="scope">
					<el-image style="width: 160px; height: 80px" :src="scope.row.srcList[0]" :preview-src-list="scope.row.srcList">
					</el-image>
				</template>
			</el-table-column>
			<el-table-column prop="dept_store" label="参考店铺描述" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="特殊要求" align="center" width="100">
				<template slot-scope="scope">
					<div>
						是
						<el-tooltip class="item" effect="dark" content="特殊要求说明" placement="top-start">
							<i class="el-icon-warning" style="color: #FFE58F"></i>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="dept_store" label="销售价格区间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="成本区间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="款式定位" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="款式需要数量" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="制定供货商" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="供应商地域要求" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="供应商合作模式" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="最晚达成时间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="计划上新时间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column label="是否接受" align="center" width="100">
				<template slot-scope="scope">
					<div>
						是
						<el-tooltip class="item" effect="dark" content="接受说明" placement="top-start">
							<i class="el-icon-warning" style="color: #FFE58F"></i>
						</el-tooltip>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="dept_store" label="预计达成时间" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="不接受原因" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="dept_store" label="备注" align="center" width="120" show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="status" label="状态" align="center" width="120" fixed="right">
			</el-table-column>
		</el-table>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
			</el-pagination>
		</div>
		<!-- 批量处理弹窗 -->
		<el-dialog title="批量处理弹窗" center @close="closeDialog" width="45%" :close-on-click-modal="false" :visible.sync="dealDialog">
			<el-form size="small">
				<el-form-item label="合理性评估：" required>
					<el-select v-model="hlxpg" :popper-append-to-body="false">
						<el-option label="接受" value="1"></el-option>
						<el-option label="不接受" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-input style="width:360px;margin-bottom: 15px" type="textarea"
				placeholder="请填写不接受原因"
				:rows="7"
				v-model="hlxpg_remark"
				maxlength="100"
				show-word-limit v-if="hlxpg == '0'"></el-input>
				<el-form-item label="预计达成时间：" required>
					<el-date-picker v-model="yjdcsj" type="date" clearable value-format="yyyy-MM-dd" placeholder="选择日期" :append-to-body="false">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="备注：">
					<el-input style="width:360px;margin-bottom: 15px" type="textarea"
					placeholder="备注"
					:rows="7"
					v-model="remark"
					maxlength="100"
					show-word-limit></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" size="small" @click="dealDialog = false">取消</el-button>
				<el-button type="primary" size="small" @click="commitFn">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				dataObj:{
					data:[{
						id:'1',
						date:'2022-03-02',
						dept_store:"项目二部/胖胖哥",
						status:"待处理",
						srcList: [
						'https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg',
						'https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg'
						]
					}]
				},	
				multipleSelection:[],		//选中的列表	
				dealDialog:false,			//处理弹窗	
				hlxpg:'1',			//选中的合理性评估
				hlxpg_remark:"",	//不接受的合理性评估的原因
				yjdcsj:"",			//预计达成时间
				remark:"",			//备注
			}
		},
		methods:{
			//获取列表数据
			getData(){

			},
			//切换多选
			handleSelectionChange(val) {
				this.multipleSelection = val;
				console.log(this.multipleSelection)
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.getData();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.getData();
			},
			//点击批量处理
			allDeal(){
				if(this.multipleSelection.length == 0){
					this.$message.warning('请至少勾选一条记录!')
				}else{
					this.dealDialog = true;
				}
			},
			//关闭批量修改弹窗
			closeDialog(){
				this.hlxpg = '1';
				this.hlxpg_remark = '';
				this.yjdcsj = '';
				this.remark = '';
			},
			//提交批量处理
			commitFn(){
				if(this.hlxpg == '0' && this.hlxpg_remark == ''){
					this.$message.warning('请输入不接受的原因！');
				}else if(!this.yjdcsj){
					this.$message.warning('请选择预计达成时间！');
				}else{
					var ids = [];
					this.multipleSelection.map(item => {
						ids.push(item.id);
					});
					let arg = {
						ids:ids.join(','),
						hlxpg:this.hlxpg,
						yjdcsj:this.yjdcsj,
						remark:this.remark
					}
					if(this.hlxpg == '0'){
						arg.hlxpg_remark = this.hlxpg_remark;
					}
					console.log(arg)
				}
			}
		}
	}
</script>
<style lang="less" scoped>
.buts{
	margin-bottom: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.right_buts{
		display: flex;
		align-items: center;
	}
}
</style>







