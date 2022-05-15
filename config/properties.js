let properties = {};

/**
 * 站点名称
 */
properties.siteName = "YAN云盘";

//开发环境配置
properties.env = {
	name: 'dev',
	//开发环境
	dev: {
		//此处是后端服务器地址,开发时最好不要写localhost,因为在移动端加载到此地址再经行请求,就无法访问到后台主机了
		baseUrl: 'http://127.0.0.1:8080' ,
		localUrl: 'http://127.0.0.1/#/' //当前前端项目根地址,为共享提供路径
	},
	//生产环境
	prod: {
		baseUrl: 'http://39.108.122.170:8080/DISK',
		localUrl: 'http://39.108.122.170/#/' //当前前端项目根地址,为共享提供路径
	},
	//测试环境
	test: {
		baseUrl: 'http://localhost:8080',
		localUrl: 'http://192.168.1.35/#/' //当前前端项目根地址,为共享提供路径
	}
}

//URL配置
properties.url = {
	index: '/',
	login: 'login'
}


export default properties;