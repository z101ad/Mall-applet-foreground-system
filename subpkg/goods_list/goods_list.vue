<template>
	<view>
		<view class="goods-list" style="background-color: #FFFFFF;">
			<view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
				<!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
			    <my-goods :goods="goods"></my-goods>    
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 是否正在请求数据
				isLoading:false,
				// 请求参数
				queryObj:{
					// 查询关键字
					query:'',
					// 商品分类id
					cid:'',
					// 页码值
					pagenum:1,
					// 每页显示多少条数据
					pagesize:10,
				},
				// 商品列表数据
				goodsList:[],
				// 总数量
				total:0,
				// 默认的空图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		onLoad(options) {
			// 将页面参数转存到 this.queryObj 对象中
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			// 调用获取商品列表数据的方法
			this.getGoodsList()
			
		},
		methods:{		
			async getGoodsList(cb){
				// 打开节流阀
				this.isLoading = true
				const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
				// 关闭节流阀
				this.isLoading = false
				// 只要数据请求完毕，就立即按需调用 cb 回调函数
				cb && cb()
				if(res.meta.status !== 200) return uni.$showMsg()
				// 为数据赋值
				// console.log(res.message.goods)
				this.goodsList = [...this.goodsList,...res.message.goods]
				this.total = res.message.total
			},
			gotoDetail(item){
				uni.navigateTo({
					url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
				})
			}
		},
		// 触底的事件
		onReachBottom() {
			// 判断是否还有下一页数据
			if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("我是有底线的！")
			// 判断是否正在请求其它数据，如果是，则不发起额外的请求
			if(this.isLoading) return
			this.queryObj.pagenum ++
			this.getGoodsList()
		},
		// 下拉刷新事件
		onPullDownRefresh() {
			// 重置数据
			this.queryObj.pagenum = 1
			this.total = 0
			this.isLoading = false
			this.goodsList = []
			// 重新发起请求
			this.getGoodsList(()=>uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
