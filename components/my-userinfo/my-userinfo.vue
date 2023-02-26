<template>
	<view class="my-userinfo-container">
		<!-- 头像昵称区域 -->
		<view class="top-box">
			<image :src="userinfo.avatarUrl" mode="" class="avatar"></image>
			<view class="nickname">
				{{userinfo.nickName}}
			</view>
		</view>

		<!-- 面板的列表区域 -->
		<view class="panel-list">
			<!-- 第一个面板 -->
			<view class="panel">
				<view class="panel-body">
					<view class="panel-item">
						<text>20</text>
						<text>收藏的店铺</text>
					</view>
					<view class="panel-item">
						<text>22</text>
						<text>收藏的商品</text>
					</view>
					<view class="panel-item">
						<text>1</text>
						<text>关注的商品</text>
					</view>
					<view class="panel-item">
						<text>17</text>
						<text>足迹</text>
					</view>
				</view>
			</view>
			<!-- 第二个面板 -->
			<view class="panel">
				<!-- 面板的标题 -->
				<view class="panel-title">我的订单</view>
				<!-- 面板的主体 -->
				<view class="panel-body">
					<!-- 面板主体中的 item 项 -->
					<view class="panel-item">
						<image src="/static/my-icons/icon1.png" class="icon"></image>
						<text>待付款</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon2.png" class="icon"></image>
						<text>待收货</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon3.png" class="icon"></image>
						<text>退款/退货</text>
					</view>
					<view class="panel-item">
						<image src="/static/my-icons/icon4.png" class="icon"></image>
						<text>全部订单</text>
					</view>
				</view>
			</view>
			<!-- 第三个面板 -->
			<view class="panel three-panel">
				<button class="panel-list-item" @click="chooseAddress">
					<text>收货地址</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</button>
				<button class="panel-list-item" open-type="contact">
					<text>联系客服</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</button>
				<button class="panel-list-item" @click="logout">
					<text>退出登录</text>
					<uni-icons type="arrowright" size="15"></uni-icons>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState, mapMutations
	} from 'vuex'
	
	export default {
		name: "my-userinfo",
		data() {
			return {

			};
		},
		computed: {
			...mapState('m_user', ['userinfo'])
		},
		methods:{
			...mapMutations('m_user',['updateUserInfo','updateToken','updateAddress']),
			// 退出登录
			async logout(){
				const [err, succ] = await uni.showModal({
					title:'提示',
					content:'确认退出登录吗？'
				}).catch(err => err)
				
				if(succ && succ.confirm){
					// 用户确认了退出登录的操作
					// 需要清空 vuex 中的 userinfo、token 和 address
					this.updateUserInfo({})
					this.updateToken('')
					this.updateAddress({})
				}
			},
			
			// 修改收货地址
			
			async chooseAddress(){
				// 调用小程序提供的 chooseAddress() 方法
				const [err, succ] = await uni.chooseAddress().catch(err => err)
				if(err === null && succ.errMsg === "chooseAddress:ok"){
					// 为 data 里面的收货地址对象赋值
					// this.address = succ
					console.log(succ)
					this.updateAddress(succ)
				}
			},
			
			// 联系客服
			
			
		}
	}
</script>

<style lang="scss">
	.my-userinfo-container {
		height: 100%;
		background-color: #f4f4f4;

		.top-box {
			height: 400rpx;
			background-color: #C00000;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.avatar {
				display: block;
				width: 90px;
				height: 90px;
				border-radius: 50%;
				border: 2px solid white;
				box-shadow: 0 1px 5px black;
			}

			.nickname {
				color: white;
				font-weight: bold;
				font-size: 16px;
				margin-top: 10px;
			}
		}
	}

	// 面板区域
	.panel-list {
		padding: 0 10px;
		position: relative;
		top: -10px;

		.panel {
			background-color: white;
			border-radius: 3px;
			margin-bottom: 8px;

			.panel-title {
				line-height: 45px;
				padding-left: 10px;
				font-size: 15px;
				border-bottom: 1px solid #f4f4f4;
			}
			
			.panel-list-item {
			  height: 45px;
			  display: flex;
			  justify-content: space-between;
			  align-items: center;
			  font-size: 15px;
			  padding: 0 10px;
			  background-color: #FFFFFF;
			  
			}
			
			.panel-body {
				display: flex;
				justify-content: space-around;

				.panel-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-around;
					font-size: 13px;
					padding: 10px 0;

					.icon {
						width: 35px;
						height: 35px;
					}
				}
			}
		}
	}
	.three-panel{
		background-color: #F5F5F5!important;
	}
</style>
