<template>
	<el-row class="fill-screen background-black vertical-center" style="text-align: center;">
		<el-col :xs="{span:22,offset:1}" :sm="{span:18,offset:3}" :md="{span:12,offset:6}" :lg="{span:6,offset:9}">
			<div class="login-frame">
				<el-tabs v-model="active" :stretch="true">
				    <el-tab-pane label="账号登陆" name="first">
						<el-form :model="user" ref="userForm" :rules="userRules" label-width="3.5rem" v-loading="loading" status-icon>
							<!-- 用户名 -->
							<el-form-item label="用户名" prop="username">
								<el-input v-model="user.username"><i slot="prefix" class="el-input__icon el-icon-user"></i></el-input>
							</el-form-item>
							<!-- 密码 -->
							<el-form-item label="密  码" prop="password">
								<el-input type="password" v-model="user.password"><i slot="prefix" class="el-input__icon el-icon-unlock"></i></el-input>
							</el-form-item>
							<!-- 验证码 -->
							<el-form-item label="验证码" prop="codeInp">
								<el-row>
									<el-col :xs="{span:12}" :sm="{span:16}" :md="{span:14}" :lg="{span:13}">
										<el-input v-model="user.codeInp"><i slot="prefix" class="el-input__icon el-icon-mobile"></i></el-input>
									</el-col>
									<el-col :xs="{span:12}" :sm="{span:8}" :md="{span:10}" :lg="{span:11}">
										<img @click="getCode" style="height: 100%;" :src="codeImg"/>
									</el-col>
								</el-row>
							</el-form-item>
							<!-- 登陆按钮 -->
							<el-row>
								<el-col :span="24">
									<el-button size="large" class="fill-width" :round="true" icon="el-icon-upload" type="primary" @click="onSubmit('userForm')">
										登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;陆
									</el-button>
								</el-col>
							</el-row>
						</el-form>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-col>
		
		<!-- 备案信息 -->
		<site-fooder></site-fooder>
	</el-row>
</template>

<script>
	// 组件引入
	import siteFooder from "../components/common/siteFooder.vue"
	
	var _this = {};
	export default{
		components:{
			"site-fooder": siteFooder
		},
		
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			this.getCode();
		},
		data: function(){
			return {
				active: 'first',
				loading: false,
				codeImg: '',
				user: {
					username: '测试账户',
					password: '123456',
					code: '',
					codeInp: ''
				},
				userRules: {
					username: [{ validator: _this.checkUsername, trigger: 'blur' }],
					password: [{ validator: _this.checkPassword, trigger: 'blur' }],
					codeInp: [{ validator: _this.checkCodeInp, trigger: 'blur' }]
				}
			};
		},
		methods: {
			//获取验证码
			getCode: function(){
				//获取新的验证码
				this.$util.ajax.get('/kaptcha')
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						_this.codeImg = res.data.img;
						_this.user.code = res.data.text;
					} else{
						_this.$message.error(data.msg);
					}
				})
			},
			// 用户名验证
			checkUsername: (rule, value, callback) => {
				if (value == null || value == '') {
					return callback(new Error('用户名不能为空'));
				}
				callback();
			},
			// 密码验证
			checkPassword: (rule, value, callback) => {
				if (value == null || value == '') {
					return callback(new Error('密码不能为空'));
				}
				callback();
			},
			// 验证码验证
			checkCodeInp: (rule, value, callback) => {
				if (value == null || value == '') {
					return callback(new Error('验证码不能为空'));
				}
				if (_this.user.codeInp != _this.user.code) {
					_this.getCode();
					return callback(new Error('验证码错误'));
				}
				callback();
			},
			onSubmit: function(formName){
				// 表单验证
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 开启加载遮罩
						this.loading = true;
						//ajax提交数据
						this.$util.ajax.post('/authenticationFront', this.user)
						.then(function (response) {
							var data = response.data;
							if(data.code==200){
								_this.$util.token.setToken(data.Authorization);
								_this.$util.toIndex();
							} else{
								_this.$message.error(data.msg);
								_this.getCode();
								//清空当前输入验证码
								_this.user.codeInp = "";
							}
							_this.loading = false;
						})
					}
				});
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.login-frame{
		background-color: white;
		padding: 1.75rem;
		border-radius: 0.75rem;
		box-shadow:white 0px 0px 1.875rem;
	}
</style>