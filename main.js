
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
// 导入store的实例对象
import store from './store/store.js'

// 把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 配置请求根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 请求开始之前做一些事情
$http.beforeRequest = function(options){
	uni.showLoading({
		title:'数据加载中...'
	})
	
	// 判断请求的是否为有权限的 API 接口
	if(options.url.indexOf('/my/') !== -1){
		// 为请求头添加身份认证字段
		options.headers = {
			// 字段的值可以直接从 vuex 中进行获取
			Authorization:store.state.m_user.token
		}
	}
}
// 请求之后做一些事情
$http.afterRequest = function(){
	uni.hideLoading({
	})
}

// 封装弹窗的方法
uni.$showMsg = function(title="数据请求失败！",duration=1500){
	uni.showToast({
		title,
		duration,
		icon:'none'
	})
}
// 关闭生产提示
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	// 将store挂载到Vue实例上
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif