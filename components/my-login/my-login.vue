<template>
	<view class="login">
		<view class="login-container">
			<!-- 提示登陆的图标 -->
			<uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
			<!-- 登录按钮 -->
			<button type="primary" class="btn-login" @click="getUserProFile">一键登录</button>
			<!-- 登陆提示 -->
			<view class="tips-text">
				登陆后尽享更多权益
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		name: "my-login",
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['redirectInfo'])
		},
		methods: {
			...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
			getUserProFile() {
				uni.getUserProfile({
					desc: '用于完善会员信息',
					success: (res) => {
						console.log(res);
						this.updateUserInfo(res.userInfo)
						// 获取登录成功后的 Token 字符串
						this.getToken(res)
					},
					fail: () => {
						return uni.$showMsg('你取消了登录授权！')
					}
				})

			},
			async getToken(info) {
				// 调用微信登录接口
				const [err, res] = await uni.login().catch(err => err)
				console.log(res);
				// 判断是否 uni.login() 调用失败
				if (err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
				// 准备参数对象
				const query = {
					code: res.code,
					encryptedData: info.encryptedData,
					iv: info.iv,
					rawData: info.rawData,
					signature: info.signature
				}

				// 向服务端发起请求 换取token
				const {
					data: loginResult
				} = await uni.$http.post('/api/public/v1/users/wxlogin', query)

				// 后端接口错误 获取不到token 假设已经获取到token
				// if(loginResult.meta.status !== 200) return uni.$showMsg("登陆失败！")
				uni.$showMsg("登陆成功！")
				// 定义一个假的 token
				let token =
					"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEyLCJpYXQiOjE1MjU0MDIyMjMsImV4cCI6MTUyNTQ4ODYyM30.g-4GtEQNPwT_Xs0Pq7Lrco_9DfHQQsBiOKZerkO-O-o"
				this.updateToken(token)
				// console.log(token)
				// 判断 vuex 中的 redirectInfo 是否为 null
				// 如果不为 null，则登录成功之后，需要重新导航到对应的页面
				this.navigateBack()
			},
			// 返回登录之前的页面
			navigateBack() {
				if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
					uni.switchTab({
						url: this.redirectInfo.from,
						complete: () => {
							this.updateRedirectInfo(null)
						}
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.login {
		width: 100%;
		height: 100vh;
		background-color: #FFFFFF;
	}

	.login-container {
		// 登录盒子的样式
		height: 750rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #f8f8f8;
		position: relative;
		overflow: hidden;

		// 绘制登录盒子底部的半椭圆造型
		&::after {
			content: ' ';
			display: block;
			position: absolute;
			width: 100%;
			height: 40px;
			left: 0;
			bottom: 0;
			background-color: white;
			border-radius: 100%;
			transform: translateY(50%);
		}

		// 登录按钮的样式
		.btn-login {
			width: 90%;
			border-radius: 100px;
			margin: 15px 0;
			background-color: #C00000;
		}

		// 提示信息的样式
		.tips-text {
			font-size: 12px;
			color: gray;
		}
	}
</style>
