// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//引入公共的css
import './css/common.css'
import Vue from 'vue'
import App from './App'
import router from './router'
//引入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//移入VueClipboard
import VueClipboard from 'vue-clipboard2'
//引入工具
import util from './libs/util.js'
import properties from '../config/properties.js'

/**
 * prototype其实是全局变量作用域,将对象绑定在上面,则在每个组件中调用this,都能引用绑定的对象
 */
Vue.prototype.$util = util;
Vue.prototype.$properties = properties;
/**
 * Vue.use方法的作用在于引用的组件定义了默认的install方法,Vue.use将执行install方法,完成初始化的操作
 */
Vue.use(ElementUI)
Vue.use(VueClipboard)
Vue.config.productionTip = false


/**
 * 拦截配置页面标题
 */
router.beforeEach((to, from, next) => {
	/* 路由发生变化修改页面title */
	if (to.meta.title) {
		document.title = properties.siteName + "-" + to.meta.title;
	}
	next();
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

/**
 * 去除网站所有默认右键菜单
 */
document.oncontextmenu = () => false;