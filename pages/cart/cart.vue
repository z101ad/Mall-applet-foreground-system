<template>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收货地址组件 -->
		<my-address></my-address>
		<!-- 购物车商品的标题区域 -->
		<view class="cart-title">
			<!-- 左侧的图标 -->
			<uni-icons type="shop" size="18"></uni-icons>
			<!-- 描述文本 -->
			<text class="cart-title-text">购物车</text>
		</view>

		<!-- 商品列表区域 -->
		<uni-swipe-action>
			<block v-for="(goods,i) in cart" :key='i'>
				<uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChangeHandler"
						@num-change="numberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		<!-- 商品结算区域 -->
		<my-settle></my-settle>
	</view>
	
	<!-- 空白购物车区域 -->
	<view class="empty-cart" v-else>
		<image src="/static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也~</text>
	</view>
</template>

<script>
	// 导入自己封装的mixin模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	// 按需导入mapState这个辅助函数
	import {
		mapState,
		mapMutations,
		} from 'vuex'
	export default {
		// 将badgeMix混入当前页面使用
		mixins: [badgeMix],
		data() {
			return {
				options: [{
					text: "删除",
					style: {
						backgroundColor: "#C00000"
					}
				}]
			};
		},
		computed: {
			// 将 m_cart 模块中的 cart 数组映射到当前页面中使用
			...mapState('m_cart', ['cart']),
		},
		methods: {
			...mapMutations('m_cart', ['updataGoodsState', 'updateGoodsCount','removeGoodsById']),
			// 选中按钮发送变化
			radioChangeHandler(e) {
				this.updataGoodsState(e)
			},
			// 商品数量发生变化
			numberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			// 点击了滑动按钮操作
			swipeActionClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cart-container{
	padding-bottom: 50px;
}
.cart-title {
	height: 40px;
	display: flex;
	align-items: center;
	font-size: 14px;
	padding-left: 15px;
	border-bottom: 1px solid #efefef;

	.cart-title-text {
		margin-left: 10px;
	}
}
.empty-cart{
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 150px;
	
	.empty-img{
		width: 90px;
		height: 90px;
	}
	
	.tip-text{
		font-size: 12px;
		color: grey;
		margin-top: 15px;
	}
}
</style>
