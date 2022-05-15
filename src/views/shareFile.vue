<!-- 文件提取页 -->
<style scoped>
	.share-file-block{
		padding: 1.875rem 0.75rem 1.875rem 0.75rem;
		box-shadow:black 0px 0px 1.875rem;
		border-radius: 0.5625rem;
	}
	.share-file-label{
		font-size: 1.375rem;
	}
</style>

<template>
	<el-row class="fill-screen background-white vertical-center" style="text-align: center;">
		<el-col :xs="{span:22,offset:1}" :sm="{span:18,offset:3}" :md="{span:12,offset:6}" :lg="{span:6,offset:9}">
			<div class="share-file-block">
				<el-row>
					<!-- 无文件 -->
					<el-col v-if="!enable" :span="24">
						<label class="share-file-label">
							抱歉，共享的文件无效
						</label>
					</el-col>
					<!-- 文件信息 -->
					<el-col v-if="enable" :span="24">
						<el-row class="fill-width">
							<el-col :span="24">
								<file-item-matrix :file="file"></file-item-matrix>
							</el-col>
							<el-col :span="16" :offset="4">
								<el-button class="fill-width" @click="download">下载文件</el-button>
							</el-col>
						</el-row>
					</el-col>
				</el-row>
			</div>
		</el-col>
		
		<!-- 备案信息 -->
		<site-fooder></site-fooder>
	</el-row>
</template>

<script>
	import siteFooder from "../components/common/siteFooder.vue"
	import fileItemMatrix from '../components/file/item/fileItemMatrix.vue';
	
	var _this = {};
	
	export default{
		components: {
			"site-fooder": siteFooder,
			"file-item-matrix": fileItemMatrix
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//获取共享ID与共享码
			_this.shareId = _this.$route.query.shareId;
			_this.shareCode = _this.$route.query.shareCode;
			if(_this.shareId==null||_this.shareCode==null)
				_this.enable = false;
			//获取共享文件信息
			_this.initFile();
		},
		data: function(){
			return {
				//共享ID
				shareId: null,
				//共享码
				shareCode: null,
				//是否文件有效
				enable: true,
				//共享的文件信息
				file: {}
			}
		},
		methods: {
			initFile: function(){
				_this.$util.ajax.get('/share/getShareFile/'+_this.shareId)
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						if(res.data != null){
							//图标转换
							res.data.fileIcon = res.data.fileIcon[0]=='/'?_this.$properties.env[_this.$properties.env.name].baseUrl + res.data.fileIcon : res.data.fileIcon;
							_this.file = res.data;
							_this.enable = true;
						}else{
							_this.enable = false;
						}
					} else{
						_this.enable = false;
					}
				})
			},
			//下载文件
			download: function(){
				_this.$util.ajax.get('/share/download/'+_this.shareId)
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						window.open(_this.file.fileUrl);
					} else{
						_this.$message.error(res.msg);
					}
				})
			}
		}
	}
</script>
