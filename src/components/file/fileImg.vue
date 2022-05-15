<!-- 图片文件 -->
<style scoped>
	.file-img{
		padding-top: 1rem;
	}
</style>

<template>
	<div class="file-img fill-height">
		<!-- 无内容 -->
		<div class="fill-height horizontal-center vertical-center" v-if="timeData.length<=0">
			<i class="el-icon-s-release" style="font-size: 7.5rem;"></i>
			<label style="font-size: 1.25rem;font-weight:bold;">哦豁，您没有上传图片文件呦</label>
		</div>
		<!-- 文件列表 -->
		<el-timeline v-if="timeData.length>0">
			<el-timeline-item v-for="d in timeData" :key="d.time" :timestamp="d.time" placement="top">
				<el-card>
					<el-row>
						<el-col :span="isMobile?12:3" v-for="file in d.data" :key="file.fileId">
							<div @click="itemClick(file)">
								<file-item-matrix :file="file" ></file-item-matrix>
							</div>
						</el-col>
					</el-row>
				</el-card>
			</el-timeline-item>
		</el-timeline>
	</div>
</template>

<script>
	var _this = {};
	
	import fileItemMatrix from './item/fileItemMatrix.vue';
	
	export default{
		components:{
			'file-item-matrix': fileItemMatrix
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			_this.initFiles();
		},
		data: function(){
			return {
				isMobile: _this.$util.size.checkMobile(),
				fileType: 'img',
				timeData: []
			}
		},
		methods: {
			initFiles: function(){
				_this.$util.ajax.get('/file/getTimeDataByType/'+_this.fileType)
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						//icon图标转换
						res.data.forEach(function(d){
							d.data.forEach(function(file){
								file.fileIcon = file.fileIcon[0]=='/'?_this.$properties.env[_this.$properties.env.name].baseUrl + file.fileIcon : file.fileIcon;
							})
						})
						_this.timeData = res.data;
					}else{
						_this.$message.error(res.msg);
					}
				})
			},
			itemClick: function(file){
				this.$confirm('确定下载\''+file.fileName+'\'吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					window.open(file.fileUrl);
				}).catch(() => {
					this.$message({
					type: 'info',
					message: '已取消'
					});          
				});
			}
		}
	}
</script>

