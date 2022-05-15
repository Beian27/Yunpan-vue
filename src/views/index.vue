<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.file-category{
	}
	.file-category ul{border: none;}
	.file-content{
		padding-top: 0.75rem;
		border-right: solid 1px #e6e6e6;
		border-left: solid 1px #e6e6e6;
	}
	.file-use{
	}

</style>


<template>
	<div class="fill-screen">
		<!-- 导航栏 -->
		<site-header :active="'1'"></site-header>
		<!-- 内容区 -->
		<div class="content">
			<el-row class="fill-height">
				<!-- 左侧文件分类 -->
				<el-col :span="plot[0]" class="file-category fill-height scroll">
				    <el-menu
					default-active="key"
						v-if="isShowMenu"
						:collapse="isMobile"
						@select="handleSelect">
						<el-menu-item index="all" class="text-center">
							<i class="el-icon-s-grid"></i>
							<span slot="title">全部文件</span>
						</el-menu-item>
						<el-menu-item index="img" class="text-center">
							<i class="el-icon-picture"></i>
							<span slot="title">图片</span>
						</el-menu-item>
						<el-menu-item index="video" class="text-center">
							<i class="el-icon-video-camera-solid"></i>
							<span slot="title">视频</span>
						</el-menu-item>
						<el-menu-item index="audio" class="text-center">
							<i class="el-icon-s-opportunity"></i>
							<span slot="title">音频</span>
						</el-menu-item>
						<el-menu-item index="text" class="text-center">
							<i class="el-icon-s-order"></i>
							<span slot="title">文本</span>
						</el-menu-item>
						<el-menu-item index="other" class="text-center">
							<i class="el-icon-s-ticket"></i>
							<span slot="title">其他</span>
						</el-menu-item>
						<!-- 存储比例 -->
						<el-progress  :percentage="storage.percentage"  style="position:fixed; left:0px; bottom:0px;width: 10%;margin: 1.25rem;"></el-progress>
					</el-menu>
				</el-col>
				<!-- 文件区域 -->
				<el-col :span="plot[1]" class="file-content fill-height scroll">
					<!-- 折叠查询等功能按钮 -->
					<el-row class="vertical-center">
						<el-col :span="6" :offset="1">
							<el-button @click="changeMenu" :icon="isShowMenu?'el-icon-d-arrow-left':'el-icon-d-arrow-right'" size="mini" round></el-button>
						</el-col>
						<el-col :span="17" v-if="isMobile">
							<el-input placeholder="请输入文件名" class="input-with-select" v-model="searchContent">
							<el-button slot="append" icon="el-icon-search"  @click="search"></el-button>
							</el-input>
						</el-col>
					</el-row>
					<el-row >
						<!-- 所有文件 -->
						<file-all v-if="key=='all'"></file-all>
						<!-- 图片文件 -->
						<file-img v-if="key=='img'"></file-img>
						<!-- 视频文件 -->
						<file-video v-if="key=='video'"></file-video>
						<!-- 音频文件 -->
						<file-audio v-if="key=='audio'"></file-audio>
						<!-- 文本文件 -->
						<file-text v-if="key=='text'"></file-text>
						<!-- 其他文件 -->
						<file-other v-if="key=='other'"></file-other>
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
import fileAll from "../components/file/fileAll.vue";
import fileImg from "../components/file/fileImg.vue";
import fileVideo from "../components/file/fileVideo.vue";
import fileAudio from "../components/file/fileAudio.vue";
import fileText from "../components/file/fileText.vue";
import fileOther from "../components/file/fileOther.vue";
	
//防止在别的对象中使用不到全局的this指针
var _this = {};
export default {
	components: {
		'site-header': siteHeader,
		'site-fooder': siteFooder,
		'file-all': fileAll,
		'file-img': fileImg,
		'file-video': fileVideo,
		'file-audio': fileAudio,
		'file-text': fileText,
		'file-other': fileOther,
	},
	beforeCreate: function(){
		_this = this;
	},
	created: function(){
		//获取当前用户信息
		_this.currentUser();
		//获取当前用户存储信息
		_this.currentStorage();
		//适配问题
		_this.isMobile = _this.$util.size.checkMobile();
		_this.isShowMenu = !_this.isMobile;
		if(_this.isMobile){ //移动端
			_this.plot = [0,24];
		} else { //PC端
			_this.plot = [3,21];
		}
	},
	data: function() {
		return {
			//选中文件类型
			key: 'all',
			//当前用户
			user: {},
			//当前用户存储信息
			storage: {capacityUse: 0, capacityTotal: 100, percentage: 0},
			//是否为移动端
			isMobile: false,
			isShowMenu: true,
			//响应式布局
			plot: {},
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
		// 当前用户的存储信息
		currentStorage: function(){
			_this.$util.ajax.get('/storage/getCurrentStorage')
			.then(function (response) {
				var res = response.data;
				if(res.code==200){
					_this.storage = res.data;
					_this.storage.percentage = parseFloat((_this.storage.capacityUse / _this.storage.capacityTotal).toFixed(2));
				} else{
					_this.$message.error(data.msg);
				}
			})
		},
		changeMenu: function(){
			//文件类别菜单转换
			if(_this.plot[0]==0)
				_this.plot[0] = 3;
			else
				_this.plot[0] = 0;
			//其他部分填充
			_this.plot[1] = 24 - _this.plot[0];
			_this.isShowMenu = !_this.isShowMenu;
		},
		handleSelect: function(key) {
			_this.key = key;
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