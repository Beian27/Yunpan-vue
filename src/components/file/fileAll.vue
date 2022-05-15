<!-- 所有文件文件夹 -->

<style scoped>
	.file-tool{
		padding: 0.75rem;
	}
	.file-list{
	}
	.el-avatar{
		background: transparent;
	}
	.operator-btn{
		margin: 0.375rem;
	}
</style>

<template>
	<el-row>
		<!-- 文件上传 -->
		<el-upload
			v-show="false"
			class="upload-demo"
			action=""
			:http-request="uploadFile">
			<el-button ref="fileSubmit"></el-button>
		</el-upload>
		
		<!-- 功能按钮 -->
		<el-col :span="24" class="file-tool">
			<el-button type="success" size="small" @click="back" plain round><i class="el-icon-caret-left el-icon--left"></i>返回上一级</el-button>
			<el-button type="success" size="small" @click="create" plain round><i class="el-icon-folder-add el-icon--left"></i>创建文件夹</el-button>
			<el-button type="success" size="small" @click="fileCheck('fileSubmit')" plain round><i class="el-icon-upload el-icon--left"></i>上传文件</el-button>
			<el-button type="danger" size="small" @click="moveGarbageBat" plain round><i class="el-icon-error el-icon--left"></i>批量删除</el-button>
		</el-col>
		<el-col :span="4" class="file-tool">
			<el-button type="success" size="mini" @click="isList=!isList" :icon="isList?'el-icon-menu':'el-icon-s-operation'"></el-button>
		</el-col>
		<el-col :span="20" class="file-tool">
			<label>当前：</label>
			<label v-for="folder in folderStock" v-text="folder.fileName+'—'" :key="folder.fileId"></label>
			<label v-text="currentFolder.fileName"></label>
		</el-col>

		<!-- 文件区域 -->
			<!-- 列表样式 -->
			<el-col :span="24" class="file-list" v-if="isList">
				<el-table
					:data="files"
					@row-click="rowClick"
					@row-contextmenu="rowContextmenu"
					@selection-change="selectionChange">
					<el-table-column
						  type="selection"
						  width="55">
					</el-table-column>
					<el-table-column
						label=""
						width="66">
						<template slot-scope="scope">
							<el-avatar shape="square" size="small" :src="scope.row.fileIcon"></el-avatar>
						</template>
					</el-table-column>
					<el-table-column
						label="文件名"
						prop="fileName">
					</el-table-column>
					<el-table-column
						label="文件大小"
						prop="fileSize">
					</el-table-column>
					<el-table-column
						label="类型"
						prop="fileType">
					</el-table-column>
					<el-table-column
						v-if="!isMobile"
						label="创建时间">
						<template slot-scope="scope">
							<i class="el-icon-time"></i>
							<span style="margin-left: 10px" v-text="scope.row.createTime"></span>
						</template>
					</el-table-column>
				</el-table>
			</el-col>
			<!-- 矩阵样式 -->
			<el-col :span="24" v-if="!isList">
				<el-row>
					<el-col v-show="files.length<=0">
						<div class="text-center" style="color: #A9A9A9;padding-top: 0.75rem;">无内容</div>
					</el-col>
					<el-col v-show="files.length>0" :span="isMobile?8:2" v-for="file in files" :key="file.isFolder?file.fileId:(0-file.fileId)">
						<file-item-matrix 
							:file="file"
							@itemclick="rowClick($event)"
							@contextmenu="rowContextmenu($event)"></file-item-matrix>
					</el-col>
				</el-row>
			</el-col>
		
		
		<!-- 文件操作弹框 -->
		<el-dialog :title="clickFile.fileName" :visible.sync="fileOperator">
			<el-row>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="download" type="info"><i class="el-icon-download el-icon-caret-left"></i>查看</el-button>
				</el-col>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="rename" type="info"><i class="el-icon-edit-outline el-icon--left"></i>重命名</el-button>
				</el-col>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="moveShow" type="info"><i class="el-icon-folder-remove el-icon--left"></i>移动</el-button>
				</el-col>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="shareShow" type="info"><i class="el-icon-share el-icon--left"></i>共享</el-button>
				</el-col>
				<el-col :span="24" class="operator-btn">
					<el-button class="fill-width" @click="moveGarbage" type="danger"><i class="el-icon-error el-icon--left"></i>删除</el-button>
				</el-col>
			</el-row>
		</el-dialog>
		
		<!-- 目录选择弹框 -->
		<el-dialog :title="'\''+clickFile.fileName+'\''+'移动到'" :visible.sync="chooseFolder">
			<el-table
				:data="folderTree"
				row-key="folderId"
				default-expand-all
				@row-click="folderClick"
				:tree-props="{children: 'folders'}">
				<el-table-column
					width="160">
					<template slot-scope="scope">
						<el-avatar shape="square" size="small" :src="folderIcon"></el-avatar>
					</template>
				</el-table-column>
				<el-table-column
					prop="folderName"
					label="文件夹名称">
				</el-table-column>
			</el-table>
		</el-dialog>
		
		<!-- 共享弹框 -->
		<el-dialog :title="'共享文件\''+clickFile.fileName+'\''" :visible.sync="shareFile">
			<el-form ref="shareForm" :rules="shareRules" :model="share" label-width="80px">
				<el-form-item label="有效期" prop="activeDuration">
					<el-select v-model="share.activeDuration" placeholder="请选择有效期" class="fill-width">
						<el-option label="永久" value="0"></el-option>
						<el-option label="3天" value="3"></el-option>
						<el-option label="7天" value="7"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="共享码">
					<el-input v-model="share.shareCode" placeholder="无填充则由系统自动生成"></el-input>
				</el-form-item>
				<el-button type="primary" class="fill-width" @click="shareInfo('shareForm')"><i class="el-icon-share el-icon--left"></i>共享</el-button>
			</el-form>
		</el-dialog>
	</el-row>
</template>

<script>
	var _this = {};
	
	import fileItemMatrix from './item/fileItemMatrix.vue';
	
	export default{
		components: {
			'file-item-matrix': fileItemMatrix
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//设备适配信息
			_this.isMobile = _this.$util.size.checkMobile();
			//初始化当前目录信息
			_this.initFiles();
		},
		data: function(){
			return {
				isMobile: false,
				//文件列表样式
				isList: false,
				//当前文件夹
				currentFolder: {fileId:0,fileName:'/',isFolder:true},
				//层级栈
				folderStock: [],
				//文件夹图标路径
				folderIcon: _this.$properties.env[_this.$properties.env.name].baseUrl + "/img/file_icon/dir.png",
				//文件数据
				files: [],
				//点击的文件
				clickFile: {},
				//当前用户目录树
				folderTree: [],
				//选中文件数据
				filesSelection: [],
				//文件操作弹框
				fileOperator: false,
				//移动目录对话框
				chooseFolder: false,
				//共享文件对话框
				shareFile: false,
				//共享信息
				share: {},
				shareRules: {
					activeDuration: [
						{ required: true, message: '请选择有效期', trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			//初始化当前目录
			initFiles: function(){
				_this.$util.ajax.get('/file/getCurrentFile/'+_this.currentFolder.fileId)
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						//数据转换
						var fs = [];
						res.folders.forEach(function(folder){
							fs.push({
								fileId:folder.folderId,
								fileName: folder.folderName,
								fileIcon: _this.folderIcon,
								fileSize: '-',
								fileType: '文件夹',
								createTime: folder.createTime,
								isFolder: true
							})
						});
						res.files.forEach(function(file){
							fs.push({
								fileId:file.fileId,
								fileName: file.fileName,
								fileUrl: file.fileUrl,
								fileIcon: file.fileIcon[0]=='/'?_this.$properties.env[_this.$properties.env.name].baseUrl + file.fileIcon : file.fileIcon,
								fileSize: (file.fileSize/1024)>1024?(file.fileSize/1024/1024).toFixed(2)+'MB':(file.fileSize/1024).toFixed(2)+'KB',
								fileType: file.fileType,
								createTime: file.createTime,
								isFolder: false
							})
						});
						//当前文件列表更新
						_this.files = fs;
						//当前文件夹
						_this.currentFolder = {
							fileId:res.currentfolder.folderId,
							fileName: res.currentfolder.folderName,
							fileIcon: _this.$properties.env[_this.$properties.env.name].baseUrl + "/img/file_icon/dir.png",
							fileSize: '-',
							fileType: "文件夹",
							createTime: res.currentfolder.createTime,
							isFolder: true
						}
					}
				})
			},
			//初始化目录树信息
			initFolderTree: function(){
				_this.$util.ajax.get('/folder/getCurrentFolderTree')
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						if(_this.clickFile.isFolder){
							//点击的时目录，则去除当前点击的文件夹
							_this.folderTree = _this.removeClickFolder(res.data);
						}else{
							//是文件，则文件随意移动
							_this.folderTree = res.data;
						}
					}else{
						_this.$message.error(res.msg);
					}
				})
			},
			//去除当前点击的文件夹
			removeClickFolder: function(folderTree){
				var result = [];
				for(var i = 0; i < folderTree.length; i++){
					var folder = folderTree[i];
					if(_this.clickFile.fileId != folder.folderId){
						result.push(folder);
						//挂载子目录
						if(folder.folders.length>0)
							folder.folders = _this.removeClickFolder(folder.folders);
					}
				}
				return result;
			},
			//文件目录行点击
			rowClick: function(row, column, event){
				if(row.isFolder){//文件夹点击
					//入栈
					_this.folderStock.push(_this.currentFolder);
					//当前目录变化
					_this.currentFolder = row;
					//页面文件列表更新
					_this.initFiles();
				}else{ //文件点击
					_this.clickFile = row;
					_this.fileOperator = true;
				}
			},
			//文件目录右键点击
			rowContextmenu: function(row, column, event){
				_this.clickFile = row;
				_this.fileOperator = true;
			},
			//移动进行时目录行点击
			folderClick: function(row, column, event){
				this.$confirm('确定将\''+_this.clickFile.fileName+'\''+'放入到\''+row.folderName+'\'文件夹中吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(_this.clickFile.isFolder){//文件夹移动
						_this.$util.ajax.get('/folder/move/'+_this.clickFile.fileId+'/'+row.folderId)
						.then(function (response) {
							var res = response.data;
							if(res.code==200){
								_this.$message.success("移动成功");
								//页面文件列表更新
								_this.initFiles();
								//关闭对话框
								_this.chooseFolder = false;
								_this.fileOperator = false;
							}else{
								_this.$message.error(res.msg);    
							}
						})
					}else{//文件移动
						_this.$util.ajax.get('/file/move/'+_this.clickFile.fileId+'/'+row.folderId)
						.then(function (response) {
							var res = response.data;
							if(res.code==200){
								_this.$message.success("移动成功");
								//页面文件列表更新
								_this.initFiles();
								//关闭对话框
								_this.chooseFolder = false;
								_this.fileOperator = false;
							}else{
								_this.$message.error(res.msg);    
							}
						})
					}
				}).catch(() => {
					this.$message({type: 'info',message: '已取消'});          
				});
			},
			//返回上一级
			back: function(){
				//出栈
				var folder = _this.folderStock.pop();
				if(folder!=null){
					//当前ID变化
					_this.currentFolder = folder;
					//页面文件列表更新
					_this.initFiles();
				}else{
					_this.$message.success("当前顶级目录");
				}
			},
			//创建文件夹
			create: function(){
				this.$prompt('请输入文件夹名称', '创建文件夹', {
					confirmButtonText: '创建',
					cancelButtonText: '取消',
					inputPattern: /\S{1,}/,
					inputErrorMessage: '格式不正确'
				}).then(({ value }) => {
					_this.$util.ajax.get('/folder/create/'+_this.currentFolder.fileId+'/'+value.trim())
					.then(function (response) {
						var res = response.data;
						if(res.code==200){
							_this.$message.success("创建成功");
							//页面文件列表更新
							_this.initFiles();
						}else{
							_this.$message.error(res.msg);    
						}
					})
				}).catch(() => {
					_this.$message.success("取消");    
				});
			},
			//文件选择
			fileCheck: function(refName){
				_this.$refs[refName].$el.click();
			},
			//文件上传
			uploadFile: function(content){
				var file = content.file;
				//单次限制上传文件小于50M
				const isLt2M = file.size / 1024 / 1024 < 50;
				if (!isLt2M) {
					this.$message.error('单次上传文件不能大于50M，请重新选择');
					return ;
				}
				//开启遮罩
				var loading= _this.$loading({
					lock: true,
					text: '文件上传中',
					spinner: 'el-icon-loading',
					background: 'rgba(0, 0, 0, 0.7)',
				})
				//构建FormData
				let formData = new FormData();
				formData.append("file", file);
				formData.append("folderId", _this.currentFolder.fileId);
				//文件上传
				_this.$util.ajax.post("/file/upload", formData,{transformRequest: data => data})//防止转换成json，文件无法传送到后台
				.then(function (response) {
					var res = response.data;
					if (res.code == 200) {
						_this.initFiles();
				    }else{
						_this.$message.error(res.msg);
					}
					//关闭遮罩
					loading.close();
				})
			},
			//表格选中记录
			selectionChange: function(val){
				_this.filesSelection = val;
			},
			//批量删除文件
			moveGarbageBat: function(){
				if(_this.filesSelection.length<=0){
					_this.$message.error("请选中要删除的文件或文件夹");
				} else{
					this.$confirm('确定将选中的文件和文件夹放入回收站吗?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						//隔离文件夹与文件
						var fileIds = [];
						var folderIds = [];
						_this.filesSelection.forEach(function(selection){
							if(selection.isFolder){
								folderIds.push(selection.fileId);
							}else{
								fileIds.push(selection.fileId);
							}
						})
						//分别将文件与文件夹移入回收站
						//将文件夹放入回收站
						if(folderIds.length>0){
							_this.$util.ajax.get("/folder/moveGarbageBat/"+folderIds.join(','))
							.then(function (response) {
								var res = response.data;
								if (res.code == 200) {
									_this.$message.success("删除成功，可在回收站中查看");
									_this.initFiles();
									_this.fileOperator = false;
							    }else{
									_this.$message.error(res.msg);
								}
							})
						}
						//将文件放入回收站
						if(fileIds.length>0){
							_this.$util.ajax.get("/file/moveGarbageBat/"+fileIds.join(','))
							.then(function (response) {
								var res = response.data;
								if (res.code == 200) {
									_this.$message.success("删除成功，可在回收站中查看");
									_this.initFiles();
									_this.fileOperator = false;
							    }else{
									_this.$message.error(res.msg);
								}
							})
						}
					}).catch(() => {
						this.$message({type: 'info',message: '已取消'});          
					});
				}
			},
			//下载文件
			download: function(){
				if(_this.clickFile.isFolder){
					_this.$message.error("抱歉，文件夹暂不支持下载");
				} else{
					window.open(_this.clickFile.fileUrl);
				}
			},
			//重命名
			rename: function(){
				_this.$prompt('请输入新名称', _this.clickFile.fileName+'-重命名', {
					confirmButtonText: '重命名',
					cancelButtonText: '取消',
					inputPattern: /\S{1,}/,
					inputValue: _this.clickFile.fileName,
					inputErrorMessage: '格式不正确'
				}).then(({ value }) => {
					//发起重命名请求
					if(_this.clickFile.isFolder){//文件夹重命名
						_this.$util.ajax.get("/folder/rename/"+_this.clickFile.fileId+"/"+value)
						.then(function (response) {
							var res = response.data;
							if (res.code == 200) {
								_this.$message.success("修改成功");
								_this.initFiles();
								_this.fileOperator = false;
						    }else{
								_this.$message.error(res.msg);
							}
						})
					} else{//文件重命名
						_this.$util.ajax.get("/file/rename/"+_this.clickFile.fileId+"/"+value)
						.then(function (response) {
							var res = response.data;
							if (res.code == 200) {
								_this.$message.success("修改成功");
								_this.initFiles();
								_this.fileOperator = false;
						    }else{
								_this.$message.error(res.msg);
							}
						})
					}
				}).catch(() => {
					_this.$message.success("取消");    
				});
			},
			//移动
			moveShow: function(){
				//初始化目录树
				_this.initFolderTree();
				//显示对话框
				_this.chooseFolder = true;
			},
			//共享对话框显示
			shareShow: function(){
				if(_this.clickFile.isFolder){
					_this.$message.error("抱歉，文件夹暂不支持共享哦");
				} else{
					_this.shareFile = true;
				}
			},
			//共享
			shareInfo: function(formName){
				_this.$refs[formName].validate((valid) => {
					if (valid) {
						//装在文件信息
						_this.share.fileId = _this.clickFile.fileId;
						//发送共享请求
						_this.$util.ajax.post("/share/add", _this.share)
						.then(function (response) {
							var res = response.data;
							if (res.code == 200) {
								var share = res.data;
								_this.$message({
									showClose: true,
									message:"共享成功，共享码为\'"+share.shareCode+"\'",
								});
								_this.shareFile = false;
						    }else{
								_this.$message.error(res.msg);
							}
						})
					}
				});
			},
			//删除
			moveGarbage: function(){
				this.$confirm('确定将此文件放入回收站吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//发起放入回收站请求
					if(_this.clickFile.isFolder){//文件夹
						_this.$util.ajax.get("/folder/moveGarbage/"+_this.clickFile.fileId)
						.then(function (response) {
							var res = response.data;
							if (res.code == 200) {
								_this.$message.success("删除成功，可在回收站中查看");
								_this.initFiles();
								_this.fileOperator = false;
						    }else{
								_this.$message.error(res.msg);
							}
						})
					} else{//文件
						_this.$util.ajax.get("/file/moveGarbage/"+_this.clickFile.fileId)
						.then(function (response) {
							var res = response.data;
							if (res.code == 200) {
								_this.$message.success("删除成功，可在回收站中查看");
								_this.initFiles();
								_this.fileOperator = false;
						    }else{
								_this.$message.error(res.msg);
							}
						})
					}
				}).catch(() => {
					this.$message({type: 'info',message: '已取消'});          
				});
			}
		}
	}
</script>

