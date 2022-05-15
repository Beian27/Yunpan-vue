<!-- 回收站 -->

<style scoped>
	.garbage-content{
		margin-top: 1.625rem;
	}
	.operator-btn{
		margin: 0.375rem;
	}
</style>

<template>
	<div class="fill-screen">
		<!-- 导航栏 -->
		<site-header :active="'3'"></site-header>
		<!-- 内容区 -->
		<div class="content">
			<el-row class="garbage-content">
				<el-col :span="isMobile?24:16" :offset="isMobile?0:4">
					<!-- 无内容 -->
					<div class="fill-height horizontal-center vertical-center" v-if="timeDatas.length<=0">
						<i class="el-icon-s-release" style="font-size: 7.5rem;"></i>
						<label style="font-size: 1.25rem;font-weight:bold;">垃圾箱真干净，居然是空的</label>
					</div>
					<!-- 文件列表 -->
					<el-timeline v-if="timeDatas.length>0">
						<el-timeline-item v-for="d in timeDatas" :key="d.time" :timestamp="d.time" placement="top">
							<el-card>
								<el-row>
									<el-col :span="isMobile?12:3" v-for="resource in d.resources" :key="resource.resourceId">
										<div 
											@click="itemClick(resource)"
											@contextmenu="contextMenu(resource)">
											<file-item-matrix :file="resource" ></file-item-matrix>
										</div>
									</el-col>
								</el-row>
							</el-card>
						</el-timeline-item>
					</el-timeline>
				</el-col>
			</el-row>
		</div>
		
		
		<!-- 文件操作弹框 -->
		<el-dialog :title="clickRes.fileName" :visible.sync="garbageOperator">
			<el-row>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="resume" type="info"><i class="el-icon-refresh-left el-icon--left"></i>恢复文件</el-button>
				</el-col>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="del" type="danger"><i class="el-icon-error el-icon--left"></i>彻底删除</el-button>
				</el-col>
			</el-row>
		</el-dialog>
		
		<!-- 备案信息 -->
		<site-fooder></site-fooder>
	</div>
</template>

<script>
	import siteHeader from "../components/common/siteHeader.vue";
	import siteFooder from "../components/common/siteFooder.vue";
	import fileItemMatrix from '../components/file/item/fileItemMatrix.vue';
	
	var _this = {};
	
	export default{
		components: {
			"site-header": siteHeader,
			"site-fooder": siteFooder,
			"file-item-matrix": fileItemMatrix
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//初始化垃圾信息
			_this.initGarbages();
		},
		data: function(){
			return {
				//移动端标识
				isMobile: _this.$util.size.checkMobile(),
				//文件夹图标路径
				folderIcon: _this.$properties.env[_this.$properties.env.name].baseUrl + "/img/file_icon/dir.png",
				//垃圾数据
				timeDatas: [],
				//点击的垃圾资源
				clickRes: {},
				//垃圾操作对话框显示
				garbageOperator: false
			};
		},
		methods: {
			//获取所有垃圾数据
			initGarbages: function(){
				_this.$util.ajax.get('/garbage/getGarbagesTimeData')
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						var tds = [];
						res.data.forEach(function(timeData){
							//获取时间
							var time = timeData.time;
							//获取资源列表
							var resources = [];
							timeData.data.forEach(function(garbage){
								var resource = {};
								if(garbage.resourceType === '01'){ //文件
									resource = {
										garbageId: garbage.garbageId,
										fileId: garbage.file.fileId,
										fileName: garbage.file.fileName,
										fileIcon: garbage.file.fileIcon[0]=='/'?_this.$properties.env[_this.$properties.env.name].baseUrl + garbage.file.fileIcon : garbage.file.fileIcon,
										fileUrl: garbage.file.fileUrl,
										isFolder: false
									};
								} else if(garbage.resourceType === '00'){ //文件夹
									resource = {
										garbageId: garbage.garbageId,
										fileId: garbage.folder.folderId,
										fileName: garbage.folder.folderName,
										fileIcon: _this.folderIcon,
										fileUrl: '',
										isFolder: true
									};
								}
								resources.push(resource);
							});
							//添加到集合中
							tds.push({
								time: time,
								resources: resources
							});
						});
						_this.timeDatas = tds;
					}else{
						_this.$message.error(res.msg);
					}
				})
			},
			//单元项点击
			itemClick: function(resource){
				_this.clickRes = resource;
				_this.garbageOperator = true;
			},
			//单元项右键点击
			contextMenu: function(resource){
				_this.itemClick(resource);
			},
			//恢复文件
			resume: function(){
				this.$confirm('确定将\''+_this.clickRes.fileName+'\'文件恢复吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.$util.ajax.get('/garbage/garbageResume/'+_this.clickRes.garbageId)
					.then(function (response) {
						var res = response.data;
						if(res.code==200){
							_this.$message.success("恢复成功");
							//页面文件列表更新
							_this.initGarbages();
							//关闭对话框
							_this.garbageOperator = false;
						}else{
							_this.$message.error(res.msg);    
						}
					})
				}).catch(() => {
					this.$message({type: 'info',message: '已取消'});          
				});
			},
			//彻底删除文件
			del: function(){
				var title = ""
				if(_this.clickRes.isFolder){
					title = "确定删除\'"+_this.clickRes.fileName+"\'吗？文件夹下的所有资源将都会被永久性删除";
				} else{
					title = "确定删除\'"+_this.clickRes.fileName+"\'吗？此文件将会被永久性删除";
				}
				//删除
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.$util.ajax.get('/garbage/garbageDelete/'+_this.clickRes.garbageId)
					.then(function (response) {
						var res = response.data;
						if(res.code==200){
							_this.$message.success("删除成功");
							//页面文件列表更新
							_this.initGarbages();
							//关闭对话框
							_this.garbageOperator = false;
						}else{
							_this.$message.error(res.msg);    
						}
					})
				}).catch(() => {
					this.$message({type: 'info',message: '已取消'});          
				});
			}
		}
	}
</script>

