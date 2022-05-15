<!-- 共享码页面 -->

<style scoped>
	.share-code-label{
		font-size: 1.25rem;
	}
	.share-code-block{
		padding: 0.75rem;
		box-shadow:black 0px 0px 1.875rem;
		border-radius: 0.5625rem;
	}
</style>


<template>
	<el-row class="fill-screen background-white vertical-center" style="text-align: center;">
		<el-col :xs="{span:22,offset:1}" :sm="{span:18,offset:3}" :md="{span:12,offset:6}" :lg="{span:6,offset:9}">
			<div class="share-code-block">
				<el-row>
					<!-- 标题 -->
					<el-col :span="24" style="padding: 1.25rem;">
						<label class="share-code-label">提取文件</label>
					</el-col>
					<!-- 输入表单 -->
					<el-col :span="24">
						<el-form :model="shareInfo" status-icon :rules="shareRules" ref="shareForm">
							<el-form-item style="margin-left: 0rem !important;" prop="shareCode">
								<el-input style="text-align: center !important;" placeholder="共享码" v-model="shareInfo.shareCode" autocomplete="off"></el-input>
							</el-form-item>
						</el-form>
					</el-col>
					<!-- 提交按钮 -->
					<el-button class="fill-width" type="info" @click="shareCodeSubmit('shareForm')">提取文件</el-button>
				</el-row>
			</div>
		</el-col>
		
		<!-- 备案信息 -->
		<site-fooder></site-fooder>
	</el-row>
</template>

<script>
	import siteFooder from "../components/common/siteFooder.vue"
	
	var _this = {};
	
	export default{
		components: {
			"site-fooder": siteFooder
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//获取参数共享码
			_this.shareInfo.shareId = _this.$route.query.shareId;
		},
		data: function(){
			return {
				isMobile: _this.$util.size.checkMobile(),
				//共享信息
				shareInfo: {},
				//共享信息规则
				shareRules: {
					shareCode: [
						{ validator: _this.checkShareCode, trigger: 'blur' }
					]
				}
			}
		},
		methods: {
			checkShareCode: function(rule, value, callback){
				if (value == null || value.trim()=='') {
					return callback(new Error('共享码不能为空'));
				}
				callback();
			},
			//提取文件
			shareCodeSubmit: function(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						_this.$util.ajax.post('/share/checkShareCode', _this.shareInfo)
						.then(function (response) {
							var res = response.data;
							if(res.code==200){
								//跳转至文件页面
								_this.$router.push({
									path: "/shareFile",
									query: _this.shareInfo
								});
							} else{
								_this.$message.error("共享码不正确");
							}
						})
					}
				});
			}
		}
	}
</script>
