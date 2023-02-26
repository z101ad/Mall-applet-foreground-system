<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
			<button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress1">请选择收货地址+</button>
		</view>

		<!-- 收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress1">
			<view class="row1">
				<view class="row1-left">
					<view class="username">
						收货人：<text>{{address.userName}}</text>
					</view>
				</view>
				<view class="row1-right">
					<view class="phone">
						电话：<text>{{address.telNumber}}</text>
					</view>
					<uni-icons type="arrowright" size="16"></uni-icons>
				</view>
			</view>
			<view class="row2">
				<view class="row2-left">
					收货地址：
				</view>
				<view class="row2-right">
					{{addstr}}
				</view>
			</view>
		</view>
		<!-- 底部的边框线 -->
		<image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations,
		mapGetters
	} from 'vuex'
	export default {
		name: "my-address",
		data() {
			return {
				// 收货地址
				// address:{}
			};
		},
		methods: {
			...mapMutations('m_user', ['updateAddress']),
			async chooseAddress1() {
				// 调用小程序提供的 chooseAddress() 方法
				const [err, succ] = await uni.chooseAddress().catch(err => err)
				console.log(err, succ);
				if (err === null && succ.errMsg === "chooseAddress:ok") {
					// 为 data 里面的收货地址对象赋值
					// this.address = succ
					console.log(succ)
					this.updateAddress(succ)
				}
			}
		},
		computed: {
			...mapState('m_user', ['address']),
			// 收货详细地址的计算属性
			...mapGetters('m_user', ['addstr'])
		},
		// async onLoad(){
		// 	const [err, succ] = await uni.chooseAddress().catch(err => err)
		// 	console.log(err,succ);
		// }
	}
</script>

<style lang="scss">
	.address-choose-box {
		height: 90px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.address-border {
		display: block;
		width: 100%;
		height: 5px;
	}

	// 渲染收货信息的盒子
	.address-info-box {
		font-size: 12px;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 5px;

		// 第一行
		.row1 {
			display: flex;
			justify-content: space-between;

			.row1-right {
				display: flex;
				align-items: center;

				.phone {
					margin-right: 5px;
				}
			}
		}

		// 第二行
		.row2 {
			display: flex;
			align-items: center;
			margin-top: 10px;

			.row2-left {
				white-space: nowrap;
			}
		}
	}
</style>
