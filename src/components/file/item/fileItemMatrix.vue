<!-- 矩阵格式文件单元项 -->

<style scoped>
	.matrix-item{
		padding: 1rem;
		font-size: 0.875rem;
	}
	.matrix-item:hover{
		cursor: pointer;
	}
	
	.matrix-item-name{	
		white-space: nowrap;   //规定段落中的文本不进行换行
		text-overflow:ellipsis;
		overflow:hidden;
	}
	.matrix-item-name:hover{
		overflow: visible;
		font-weight: bold;
	}

</style>

<template>
	<div 
		class="matrix-item text-center"
		@contextmenu.prevent="$emit('contextmenu',file)"
		@click="$emit('itemclick',file)">
		<!-- 图标 -->
		<el-image
		      style="width: 100px; height: 100px"
		      :src="file.fileIcon"
			  fit="contain"></el-image>
		<!-- 文件名称 -->
		<div class="text-center matrix-item-name">
			{{file.fileName}}
		</div>
	</div>
</template>

<script>
	var _this = {};
	
	export default{
		props: ['file'],
		beforeCreate: function(){
			_this = this;
		},
		methods: {
			//点击事件
			click: function(){
				_this.$message.success("点击");
			},
			//右键事件
			contextMenu: function(){
				_this.$message.success("右键点击");
			}
		}
	}
</script>
