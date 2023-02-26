<template>
	<view>
		<!-- 自定义搜索栏 -->
		<view class="search-box">
			<my-search @click="gotoSearch"></my-search>
		</view>

		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular="true">
			<swiper-item v-for="(item,i) in swiperList" :key="i">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>

		</swiper>

		<!-- 分类导航 -->
		<view class="nav-list">
			<view class="nav-item" v-for="(item,i) in navList" :key="i" @click="navClickHandler(item)">
				<image :src="item.image_src" class="nav-img"></image>
			</view>
		</view>

		<!-- 楼层区域 -->
		<view class="floor-list">
			<view class="floor-item" v-for="(item,i) in floorList" :key="i">
				<image :src="item.floor_title.image_src" class="floor-title"></image>
				<!-- 楼层图片区域 -->
				<view class="floor-img-box">
					<!-- 左侧 -->
					<navigator class="left-img-box" :url="item.product_list[0].url">
						<image :src="item.product_list[0].image_src" mode="widthFix"
							:style="{width:item.product_list[0].image_width+'rpx'}"></image>
					</navigator>
					<!-- 右侧 -->
					<view class="right-img-box">
						<navigator class="right-img-item" v-for="(item2,i2) in item.product_list" :key="i2"
							v-if="i2 !== 0" :url="item2.url">
							<image :src="item2.image_src" mode="widthFix" :style="{width:item2.image_width+'rpx'}">
							</image>
						</navigator>
					</view>
				</view>
			</view>
		</view>
		<!--  -->
	</view>
</template>

<script>
	// 导入自己封装的mixin模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		// 将badgeMix混入当前页面使用
		mixins: [badgeMix],
		data() {
			return {
				// 1.轮播图的数据列表
				swiperList: [],
				// 分类导航的数据
				navList: [],
				// 楼层的数据列表
				floorList: []
			};
		},
		onLoad() {
			// 2. 在小程序页面刚加载的时候，调用获取轮播图数据的方法
			this.getSwiperList()
			// 调用获取分类导航数据的方法
			this.getNavList()
			// 调用获取楼层数据的方法
			this.getFloorList()
			uni.getSetting({
				success(res) {
					console.log(res.authSetting)
				}
			})
		},
		methods: {
			// 3. 获取轮播图数据的方法
			async getSwiperList() {
				// 3.1 发起请求
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 3.2 请求失败
				console.log(res)
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				// 3.3 请求成功
				this.swiperList = res.message

			},
			// 定义获取分类导航数据的方法
			async getNavList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				this.navList = res.message
			},
			// nav-item 项被点击时候的事件处理函数
			async navClickHandler(item) {
				if (item.name === "分类") {
					uni.switchTab({
						url: '../cate/cate'
					})
				} else {
					uni.$showMsg("功能开发中！")
				}
			},
			// 定义获取楼层导航数据的方法
			async getFloorList() {
				const {
					data: res
				} = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) {
					return uni.$showMsg()
				}
				// 通过双层for循环，处理url地址
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	swiper {
		height: 330rpx;

		.swiper-item,
		image {
			width: 100%;
			height: 100%;
		}
	}

	.nav-list {
		display: flex;
		justify-content: space-around;
		margin: 15rpx 0;

		.nav-img {
			width: 128rpx;
			height: 140rpx;
		}
	}

	.floor-title {
		height: 60rpx;
		width: 100%;
		display: flex;
	}

	.right-img-box {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}

	.floor-img-box {
		display: flex;
		padding-left: 10rpx;
	}

	.search-box {
		position: sticky;
		top: 0;
		z-index: 999;
	}
</style>
