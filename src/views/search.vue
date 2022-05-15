<!-- 查询页面 -->
<style scoped>
	.search-info{
		padding: 1.875rem 0.375rem 1.25rem 1.875rem;
	}
	
	.search-list{
		
	}
	
	.search-count{
		font-size: 1.375rem;
		font-weight: bold;
	}
	
	.search-time{
		font-weight: bold;
		margin-left: 1rem;
		color: lawngreen;
	}
</style>

<template>
	<div class="fill-screen">
		<!-- 导航栏 -->
		<site-header :content="searchContent"></site-header>
		<!-- 内容区 -->
		<div class="content">
			<el-row class="fill-height">
				<!-- 搜索结果信息 -->
				<el-col class="search-info" :span="isMobile?22:18" :offset="isMobile?1:3">
					<label class="search-count">搜索到{{files.length}}个文件</label>
					<label class="search-time">共计用了{{useTime/1000}}秒</label>
				</el-col>
				<!-- 文件列表 -->
				<el-col class="search-list scroll" :span="isMobile?22:18" :offset="isMobile?1:3">
					<el-row>
						<el-col :span="isMobile?8:3" v-for="file in files" :key="file.fileId">
							<div @click="itemClick(file)">
								<file-item-matrix :file="file"></file-item-matrix>
							</div>
						</el-col>
					</el-row>
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
	import fileItemMatrix from '../components/file/item/fileItemMatrix.vue';
	
	var _this = {};
	
	export default{
		components: {
			'site-header': siteHeader,
			'site-fooder': siteFooder,
			'file-item-matrix': fileItemMatrix
		},
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			//初始化设备信息
			_this.isMobile = _this.$util.size.checkMobile();
			//获取到查询信息
			_this.searchContent = _this.$route.query.searchContent;
			//查询文件信息
			_this.initFiles();
		},
		data: function(){
			return {
				//移动端标识
				isMobile: false,
				//查询内容
				searchContent: '',
				//查询到的文件列表
				files: [],
				//使用查询时间
				useTime: 0
			}
		},
		methods: {
			initFiles: function(){
				_this.$util.ajax.get('/file/searchByName/'+_this.searchContent)
				.then(function (response) {
					var res = response.data;
					if(res.code==200){
						//文件图标转换
						res.data.forEach(function(file){
							file.fileIcon = file.fileIcon[0]=='/'?_this.$properties.env[_this.$properties.env.name].baseUrl + file.fileIcon : file.fileIcon;
						})
						
						_this.files = res.data;
						_this.useTime = res.useTime;
					} else{
						_this.$message.error(data.msg);
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

