<!-- 共享信息页面 -->
<style scoped>
	.share-content{
		margin-top: 1rem;
		overflow:auto;
	}
</style>

<template>
	<div class="fill-screen">
		<!-- 导航栏 -->
		<site-header :active="'2'"></site-header>
		<!-- 内容区 -->
		<div class="content">
			<el-row >
				<el-col :span="isMobile?24:18" :offset="isMobile?0:3">
					<div class="share-content text-center">
						<el-table
							:data="shares"
							style="width: 100%">
							<el-table-column
								label="文件名">
								<template slot-scope="scope">
									<i class="el-icon-document"></i>
									{{scope.row.file.fileName}}
								</template>
							</el-table-column>
							<el-table-column
								label="有效状态">
								<template slot-scope="scope">
									<el-tag :type="scope.row.activeFlag ==='01'?'success':'danger'">
										{{scope.row.activeFlag==='01'?'有效':'无效'}}
									</el-tag>
								</template>
							</el-table-column>
							<el-table-column
								prop="shareCode"
								label="共享码">
							</el-table-column>
							<el-table-column
								prop="download"
								label="下载量(次)">
							</el-table-column>
							<el-table-column
								label="有效期(天)">
								<template slot-scope="scope">
									{{scope.row.activeDuration <= 0?'永久':scope.row.activeDuration}}
								</template>
							</el-table-column>
							<el-table-column
								label="共享时间">
								<template slot-scope="scope">
									<i class="el-icon-time"></i>
									{{scope.row.createTime}}
								</template>
							</el-table-column>
							<el-table-column
								label=""
								prop="qrcode"
								width="180">
								<template slot-scope="scope">
									<!-- 二维码 -->
									<el-tooltip placement="top">
										<div slot="content">
											<img style="width: 100px; height: 100px" :src="scope.row.qrcode"></img>
										</div>
										<el-button type="primary" icon="el-icon-menu" size="mini" circle></el-button>
									</el-tooltip>
									<!-- 共享链接 -->
									<el-tooltip placement="top">
										<div slot="content">
											<el-link :href="scope.row.shareUrl" type="success">{{scope.row.shareUrl}}</el-link>
										</div>
										<el-button type="primary" icon="el-icon-paperclip" size="mini" circle></el-button>
									</el-tooltip>
									<!-- 拷贝共享文字 -->
									<el-button type="primary" @click="copyShare(scope.row)" icon="el-icon-document-copy" size="mini" circle></el-button>
									<!-- 恢复共享 -->
									<el-button v-if="scope.row.activeFlag ==='00'" type="primary" @click="resumeShare(scope.row)" icon="el-icon-refresh-right" size="mini" circle></el-button>
									<!-- 取消共享 -->
									<el-button v-if="scope.row.activeFlag ==='01'" type="primary" @click="cancelShare(scope.row)" icon="el-icon-close" size="mini" circle></el-button>
								</template>
							</el-table-column>
						</el-table>
						<!-- 分页 -->
						<el-pagination
						style="margin: 0.75rem;"
							background
							layout="total, sizes, prev, pager, next, jumper"
							:total="pageInfo.total"
							:page-size="pageInfo.limit"
							:page-sizes="[10, 15, 20, 30]"
							:current-page.sync="pageInfo.page"
							@size-change="sizeChange"
							@current-change="pageChange">
						</el-pagination>
					</div>
				</el-col>
			</el-row>
		</div>
		
		<!-- 备案信息 -->
		<site-fooder></site-fooder>
	</div>
</template>

<script>
	import siteHeader from "../components/common/siteHeader.vue";
	import siteFooder from "../components/common/siteFooder.vue";
	
	var _this = {};
	
	export default{
		components: {
			'site-header': siteHeader,
			'site-fooder': siteFooder
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//初始化设备信息
			_this.isMobile = _this.$util.size.checkMobile();
			//初始化共享文件信息
			_this.initShares();
		},
		data: function(){
			return {
				//移动端标识
				isMobile: false,
				//当前用户的所有共享信息
				shares: [],
				//分页信息
				pageInfo: {page:1, limit: 10, total: 0},
				//共享码页面的根路径
				baseShareUrl: _this.$properties.env[_this.$properties.env.name].localUrl + "shareCode"
			}
		},
		methods: {
			//初始化查询当前用户的共享信息
			initShares: function(){
				_this.$util.ajax.post('/share/getCurrentShares', _this.pageInfo)
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						//过去二维码以及共享链接
						res.data.forEach(function(share){
							//获取共享链接
							share.shareUrl = _this.baseShareUrl + "?shareId="+share.shareId;
							//阻塞获取获取base64二维码，防止表格不动态刷新
							share.qrcode = "";
							_this.getQRCode(share);
						})
						//刷新表格
						_this.shares = res.data;
						//获取分页信息
						_this.pageInfo.total = res.pageInfo.total;
						_this.pageInfo.limit = res.pageInfo.limit;
						_this.pageInfo.page = res.pageInfo.page.current;
						
					}else{
						_this.$message.error(res.msg);
					}
				})
			},
			//获取共享页面二维码base64
			getQRCode: async function(share){
				await _this.$util.ajax.post('/getQRCode',{
					content: share.shareUrl
				})
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						share.qrcode = res.data;
					}
				})
			},
			//恢复共享
			resumeShare: function(share){
				this.$confirm('确定将\''+share.file.fileName+'\'恢复共享吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.info(share.file);
				}).catch(() => {
					this.$message({type: 'info',message: '已取消'});          
				});
			},
			//取消共享
			cancelShare: function(share){
				this.$confirm('确定将\''+share.file.fileName+'\'取消共享吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.$util.ajax.get('/share/cancelShare/'+share.shareId)
					.then(function (response) {
						var res = response.data;
						if(res.code==200){
							_this.$message({type: 'success',message: '\''+share.file.fileName+'\'已取消共享'});      
							_this.initShares();
						}else{
							_this.$message.error(res.msg);
						}
					})
				}).catch(() => {
					_this.$message({type: 'info',message: '取消操作'});          
				});
			},
			//拷贝共享信息
			copyShare: function(share){
				var copyContent = "我分享了'"+share.file.fileName+"'，快点来看看吧！共享码："+share.shareCode+"，链接："+share.shareUrl+"";
				
				_this.$copyText(copyContent).then(function (e) {
					_this.$message({type: 'success',message: '复制成功，共享给你的好友吧'});    
				}, function (e) {
					_this.$message({type: 'error',message: '因不可抗力，复制失败了'});     
				})
			},
			//页码改变
			pageChange: function(){
				_this.initShares();
			},
			sizeChange: function(val) {
				_this.pageInfo.limit = val;
				_this.initShares();
			}
		}
	}
</script>

