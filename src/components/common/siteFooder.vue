<!-- 尾部备案信息 -->
<style scoped>
	.site-fooder{
		z-index: 99999999999;
		position: absolute;
		text-align: center;
		width: 100%;
		bottom: 0rem;
		color: #A9A9A9;
	}
	
	.site-fooder a{
		color: #D2691E;
	}
</style>

<template>
	<div class="site-fooder" v-if="!isMobile">
		©2019-2020 <a href="http://www.pan.baidu.com">www.pan.baidu.com</a> 版权所有：<a href="http://www.beian.miit.gov.cn">豫ICP备21028165号</a>
	</div>
</template>

<script>
	var _this = {};
	
	export default{
		beforeCreate: function(){
			_this = this;
		},
		created: function(){
			_this.isMobile = _this.$util.size.checkMobile();
		},
		data: function(){
			return {
				isMobile: false
			}
		}
	}
</script>

