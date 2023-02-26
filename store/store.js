// 导入Vue和Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// 1. 导入购物车的 vuex 模块
import moduleCart from './cart.js'
// 导入用户的 vuex 模块
import moduleUser from './user.js'
// 将Vuex安装为Vue的插件
Vue.use(Vuex)

// 创建Store的实例对象
const store = new Vuex.Store({
	// 挂载store模块
	modules:{
		// 2. 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
		//    购物车模块中 cart 数组的访问路径是 m_cart/cart
		m_cart: moduleCart,
		m_user:moduleUser
	}
})

// 向外共享Store的实例对象
export default store