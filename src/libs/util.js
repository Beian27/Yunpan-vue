//引用依赖模块
import properties from '../../config/properties.js';
import router from '../router';
import axios from 'axios';
import Qs from 'qs';

let util = {};


//封装localStorage存储
util.storage = {
	storageSet: function(key, value){
		if(window.localStorage){
			window.localStorage.setItem(key,value);
		}
	},
	storageGet: function(key){
		if(window.localStorage){
			return window.localStorage.getItem(key);
		}
		return null;
	},
	storageRemove: function(key){
		if(window.localStorage){
			window.localStorage.removeItem(key);
		}
	}
}

//token操作
util.token = {
	getToken: function(){
		var token = util.storage.storageGet('yan_cloud_disk_token');
		return token;
	},
	setToken: function(token){
		util.storage.storageSet('yan_cloud_disk_token', token);
	},
	clearToken: function(){
		util.storage.storageRemove('yan_cloud_disk_token');
	}
}

//es6箭头函数,函数定义简便写法
//(x)=>return x+1;
//等效于
//function (x){
//	return x+1;
//}



//封装AJAX
util.ajax = axios.create({
	baseURL: properties.env[properties.env.name].baseUrl,
	headers: {
		'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
		'Request-Type': "client" //前端标识
	},
	transformRequest: [function transformRequest(data, headers) {//转换Json数据
		return Qs.stringify(data);
	}]
});

//AJAX请求前拦截器
util.ajax.interceptors.request.use(
	config => {
		var token = util.token.getToken();
		if (token!=null) { // 判断是否存在token，如果存在的话，则每个http header都加上token
			config.headers.Authorization = token;  //请求头加上token
	    }
	    return config;
	},
	err => {
		return Promise.reject(err)
	}
)

//AJAX请求后拦截器(注意token失效,token重置)
util.ajax.interceptors.response.use(
	response => {
		//未登陆
		if(response.data.code==401){
			util.token.setToken(response.data.Authorization);
			util.toLogin();
		}
		//没有权限
		if(response.data.code==403){
			alert("权限不足");
		}
		
		return response;
	},
	//接口错误状态处理，也就是说无响应时的处理
	error => {
		console.info("请求错误");
		return Promise.reject(error) // 返回接口返回的错误信息
	}
)

/**
 * 页面跳转
 */
util.toIndex = function(){
	router.push(properties.url.index);
}
util.toLogin = function(){
	router.push(properties.url.login);
}
util.logout = function(){
	util.token.clearToken();
	util.toLogin();
}

/**
 * 页面尺寸操作
 */
util.size = {
	getWidth: function(){
		return document.body.clientWidth;
	},
	getHeight: function(){
		return document.body.clientHeight;
	},
	checkMobile: function(){
		return this.getWidth() < 992;
	}
}

//对象拷贝
util.copy = function(obj){
	var result = {};
	for(var prop in obj){
		result[prop] = obj[prop];
	}
	
	return result;
}

export default util;