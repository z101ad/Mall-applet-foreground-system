export default{
	namespaced:true,
	state: {
	    // 收货地址
	    address: JSON.parse(uni.getStorageSync('address') || '{}'),
		// 登陆成功后的 token 字符串
		token: uni.getStorageSync('token') || '',
		// 用户的基本信息
		userinfo:JSON.parse(uni.getStorageSync('userinfo') || '{}'),
		// 重定向的object对象
		redirectInfo:null
		
	  },
	mutations:{
		// 更新 token 字符串
		updateToken(state, token){
			state.token = token
			// 通过 this.commit() 方法，调用 m_user 模块下的 saveTokenToStorage 方法，将 token 字符串持久化存储到本地
			this.commit('m_user/saveTokenToStorage')
		},
		// 将 token 字符串持久化存储到本地
		saveTokenToStorage(state){
			uni.setStorageSync('token',state.token)
		},
		updateAddress(state,address){
			state.address = address
			this.commit('m_user/saveAddressToStorage')
		},
		saveAddressToStorage(state){
			uni.setStorageSync('address',JSON.stringify(state.address))
		},
		// 更新用户的基本信息
		updateUserInfo(state,userinfo){
			state.userinfo = userinfo
			this.commit('m_user/saveUserInfoToStorage')
		},
		// 将useinfo持久化存储本地
		saveUserInfoToStorage(state){
			uni.setStorageSync('userinfo',JSON.stringify(state.userinfo))
		},
		
		// 更新重定向的信息对象
		updateRedirectInfo(state, info){
			state.redirectInfo = info
		}
		
		
	},
	// 数据包装器
	getters:{
		addstr(state){
			if(!state.address.cityName) return ''
			// 拼接 省，市，区，详细地址 的字符串并返回给用户
			return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		}
	}
}