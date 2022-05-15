<!-- 站点公共头 -->
<style scoped>
	.navigation{
		height: 3.75rem;
		box-shadow:darkgray 0px 0px 0.375rem;
		border: none;
	}
	.logo{
		font-size: 1.375rem;
		font-weight: bold;
		margin-left: 4.5rem;
		margin-right: 1.875rem;
	}
	.username{
		font-size: 1.1875rem;
	}
	.user-photo{
		border-radius: 50%;
		width: 10rem;
		height: 10rem;
	}
	
</style>

<template>
	<div>
		<el-menu class="navigation" :default-active="active" text-color="black" active-text-color="black" mode="horizontal">
			<el-menu-item class="logo" v-if="!isMobile"><a href="/">云盘</a></el-menu-item>
			<el-menu-item index="1"><router-link to="/">我的云盘</router-link></el-menu-item>
			<el-menu-item index="2"><router-link to="/share">共享文件</router-link></el-menu-item>
			<el-menu-item index="3"><router-link to="/garbage">回收站</router-link></el-menu-item>
			<!-- 移动端用户信息 -->
			<el-menu-item v-if="isMobile" class="float-right" @click="showUserInfo=!showUserInfo">
				<el-avatar shape="square" :src="user.photo"></el-avatar>
			</el-menu-item>
			<!-- 用户信息 -->
			<el-menu-item v-if="!isMobile" class="float-right">
				<el-dropdown :hide-on-click="false">
					<span class="el-dropdown-link">
						<label class="username" v-text="user.username"></label>
						<el-avatar size="large" :src="user.photo"></el-avatar>
						<i class="el-icon-arrow-down el-icon--right"></i>
					</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item icon="el-icon-user"><a @click="showUserInfo=!showUserInfo">个人信息</a></el-dropdown-item>
						<el-dropdown-item icon="el-icon-unlock"><a @click="logout">注销</a></el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-menu-item>
			<!-- 搜索工具栏 -->
			<el-menu-item v-if="!isMobile" class="float-right">
				<el-input placeholder="请输入文件名" class="input-with-select" v-model="searchContent">
				<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
				</el-input>
			</el-menu-item>
		</el-menu>
		
		<!-- 用户信息对话框 -->
		<el-dialog 
			v-loading="loading"
			element-loading-text="拼命修改中"
			element-loading-spinner="el-icon-loading"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			:title="user.username+'的个人信息'" 
			:visible.sync="showUserInfo">
			<!-- 用户头像 -->
			<el-row class="horizontal-center">
				<el-upload
					:action="uploadUrl"
					:with-credentials="true"
					:show-file-list="false"
					:http-request="uploadPhoto">
					<img v-if="user.photo" :src="user.photo" class="user-photo">
					<i v-else class="el-icon-plus avatar-uploader-icon"></i>
				</el-upload>
			</el-row>
			<!-- 用户基本信息 -->
			<el-form 
				:model="user"
				:rules="rulesUser" 
				ref="userForm"
				label-width="80px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="用户名" prop="username">
							<el-input v-model="user.username"><i slot="prefix" class="el-input__icon el-icon-user"></i></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别" prop="gender" class="fill-width">
						    <el-select v-model="user.gender" placeholder="请选择性别" class="fill-width">
								<el-option label="男" value="01"></el-option>
								<el-option label="女" value="00"></el-option>
						    </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出生日期" prop="birthday" class="fill-width">
						    <el-date-picker
								class="fill-width"
								v-model="user.birthday"
								type="datetime"
								placeholder="选择出生日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="QQ" class="fill-QQwidth">
						    <el-input v-model="user.qq"><i slot="prefix" class="el-input__icon el-icon-user"></i></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱" class="fill-width">
						    <el-input v-model="user.email"><i slot="prefix" class="el-input__icon el-icon-truck"></i></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<!-- 按钮 -->
			<el-row :gutter="9">
				<el-col :span="12">
					<el-button type="primary" class="fill-width" @click="updateInfo('userForm')">修改信息</el-button>
				</el-col>
				<el-col :span="12">
					<el-button type="primary" class="fill-width" @click="showPassword = true">修改密码</el-button>
				</el-col>
			</el-row>
			<el-row style="margin-top: 0.375rem;">
					<el-button type="danger" @click="logout" class="fill-width">注销</el-button>
			</el-row>
		</el-dialog>
		
		<!-- 密码修改对话框 -->
		<el-dialog
			title="修改密码"
			:visible.sync="showPassword">
			<el-form
				:model="user"
				label-width="80px"
				:rules="rulesPassword"
				ref="passwordForm">
				<el-row>
					<el-col :span="24">
						<el-form-item label="原密码" prop="oldPassword">
							<el-input type="password" v-model="user.oldPassword"><i slot="prefix" class="el-input__icon el-icon-key"></i></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="新密码" prop="newPassword">
							<el-input type="password" v-model="user.newPassword"><i slot="prefix" class="el-input__icon el-icon-key"></i></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="再次输入" prop="newPasswordRep">
							<el-input type="password" v-model="user.newPasswordRep"><i slot="prefix" class="el-input__icon el-icon-key"></i></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showPassword = false">取 消</el-button>
				<el-button type="primary" @click="updatePassword('passwordForm')">修改</el-button>
			</span>
		</el-dialog>
		
	</div>
</template>

<script>
	var _this = {};
	export default{
		props: ['active','content'],
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//设备适配信息
			_this.isMobile = _this.$util.size.checkMobile();
			//获取当前用户信息
			_this.currentUser();
			
			_this.searchContent = _this.content;
		},
		data: function(){
			return {
				// 适配信息
				isMobile: false,
				user: {},
				//用户字段验证规则
				rulesUser: {
					username: [
						{ required: true, message: '请输入用户名称', trigger: 'blur' }
					],
					gender: [
						{ required: true, message: '请选择性别', trigger: 'change' }
					],
					birthday: [
						{ required: true, message: '请选择出生日期', trigger: 'blur' }
					]
				},
				rulesPassword: {
					oldPassword: [
						{ validator: _this.checkOldPassword, trigger: 'blur' }
					],
					newPassword: [
						{ validator: _this.checkNewPassword, trigger: 'blur' }
					],
					newPasswordRep: [
						{ validator: _this.checkNewPasswordRep, trigger: 'blur' }
					]
				},
				showUserInfo: false,
				//文件上传接口
				uploadUrl: _this.$properties.env[_this.$properties.env.name].baseUrl + "/sys/upload",
				//遮罩标志
				loading: false,
				showPassword: false,
				//查询内容
				searchContent: ''
			}
		},
		methods: {
			// 当前用户信息
			currentUser: function(){
				_this.$util.ajax.get('/user/getCurrentUser')
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						_this.user = res.data;
					} else{
						_this.$message.error(data.msg);
					}
				})
			},
			//更改用户信息
			updateUser: function(){
				//关闭开启
				_this.loading = false;
				//发送更改请求
				_this.$util.ajax.post("/user/updateInfo", _this.user)
				.then(function (response) {
					var res = response.data;
					if (res.code == 200) {
						_this.$message.success("修改成功");
				    }else{
						_this.$message.error(res.msg);
					}
					//关闭遮罩
					_this.loading = false;
				})
			},
			//头像上传前响应，手上传文件，解决Upload组件产生的跨域以及无token问题
			uploadPhoto: function(content){
				//开启遮罩
				_this.loading = true;
				//文件过滤
				var file = content.file;
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
					_this.loading = false;
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
					_this.loading = false;
				}
				//构建FormData
				let formData = new FormData();
				formData.append("file", file);
				//文件上传请求
				_this.$util.ajax.post("/sys/upload", formData,{transformRequest: data => data})//防止转换成json，文件无法传送到后台
				.then(function (response) {
					var res = response.data;
					if (res.code == 200) {
						_this.user.photo = res.data;
						_this.updateUser();
				    }else{
						_this.$message.error(res.msg);
					}
					//关闭遮罩
					_this.loading = false;
				})
			},
			//注销
			logout: function(){
				//发送请求注销
				_this.$util.ajax.get('/logout')
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						//前端清空token
						_this.$util.logout();
					} else{
						_this.$message.error(data.msg);
					}
				})
			},
			//更新基本信息
			updateInfo: function(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//开启遮罩
						_this.loading = true;
						//信息更新
						_this.updateUser();
						//关闭遮罩
						_this.loading = false;
					}
				});
			},
			//更新密码
			updatePassword: function(formName){
				_this.$refs[formName].validate((valid) => {
					if (valid) {
						//开启遮罩
						_this.loading = true;
						//密码修改
						_this.$util.ajax.post("/user/userUpdatePassword", _this.user)
						.then(function (response) {
							var res = response.data;
							if (res.code == 200) {
								_this.$message.success("修改成功");
								//注销
								_this.logout();
						    }else{
								_this.$message.error(res.msg);
							}
							//关闭遮罩
							_this.loading = false;
						})
					}
				});
			},
			
			//密码验证规则
			checkOldPassword: (rule, value, callback) => {
				if (value == null || value == '') {
					callback(new Error('旧密码不能为空'));
				} else {
					callback();
				}
			},
			checkNewPassword: (rule, value, callback) => {
				if (value == null || value == '') {
					callback(new Error('新密码不能为空'));
				} else {
					callback();
				}
			},
			checkNewPasswordRep: (rule, value, callback) => {
				if (value == null || value == '') {
					callback(new Error('重复新密码不能为空'));
				} else if (value !== _this.user.newPassword) {
					callback(new Error('两次新密码不一致'));
				} else {
					callback();
				}
			},
			search: function(){
				if(_this.searchContent==null||_this.searchContent.trim()==''){
					_this.$message.error("查询内容不能为空");
				} else{
					_this.$router.push({
						path: "/search",
						query: {
							searchContent: _this.searchContent
						}
					});
				}
			}
		}
	}
</script>
