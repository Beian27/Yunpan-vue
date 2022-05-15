import Vue from 'vue'
import Router from 'vue-router'
import index from '@/views/index'

Vue.use(Router)

/**
 * 重写路由的push方法,防止重复的路由不跳转
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}


export default new Router({
	routes: [
		{
			path: '/',
			name: 'index',
			component: (resolve) => require(['../views/index.vue'], resolve),
			meta: {
				title: '首页'
			}
		},{
			path: '/login',
			name: 'login',
			component: (resolve) => require(['../views/login.vue'], resolve),
			meta: {
				title: '登录'
			}
		},{
			path: '/search',
			name: 'search',
			component: (resolve) => require(['../views/search.vue'], resolve),
			meta: {
				title: '搜索'
			}
		},{
			path: '/share',
			name: 'share',
			component: (resolve) => require(['../views/share.vue'], resolve),
			meta: {
				title: '共享'
			}
		},{
			path: '/shareCode',
			name: 'shareCode',
			component: (resolve) => require(['../views/shareCode.vue'], resolve),
			meta: {
				title: '共享码'
			}
		},{
			path: '/shareFile',
			name: 'shareFile',
			component: (resolve) => require(['../views/shareFile.vue'], resolve),
			meta: {
				title: '提取文件'
			}
		},{
			path: '/garbage',
			name: 'garbage',
			component: (resolve) => require(['../views/garbage.vue'], resolve),
			meta: {
				title: '回收站'
			}
		}
	]
})
