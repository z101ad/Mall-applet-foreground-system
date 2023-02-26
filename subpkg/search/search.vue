<template>
	<view>
		<view class="search-box">
		  <!-- 使用 uni-ui 提供的搜索组件 -->
		  <uni-search-bar @input="input" @clear="clear" placeholder="请输入搜索内容" :radius="100" cancelButton="none"></uni-search-bar>
		</view>
		<!-- 搜素建议列表 -->
		<view class="sugg-list" v-if="searchResults.length !== 0">
			<view class="sugg-item" v-for="(item,i) in searchResults" :key="i" @click="gotoDetail(item)">
				<view class="goods-name">
					{{item.goods_name}}
				</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		<!-- 搜索历史记录 -->
		<view class="history-box" v-else>
			<!-- 标题区域 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
			</view>
			<!-- 列表区域 -->
			<view class="history-list">
				<uni-tag :text="item" type="error" v-for="(item,i) in historys" :key="i" @click="gotoGoodsList(item)"></uni-tag>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器的timerId
				timer:null,
				// 搜索关键字
				kw:'',
				// 搜索建议列表
				searchResults: [],
				// 搜索关键字的历史记录(假数据)
				historyList:[]
				
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		methods:{
			input(e) {
				clearTimeout(this.timer)
				this.timer = setTimeout(()=>{
					this.kw = e,
					// 根据关键字 查询搜索建议列表
					this.getSearchList()					
				},500)
			   
			  },
			  async getSearchList(){
				  // 判断关键字是否为空
				  if(this.kw.length === 0){
					  this.searchResults = []
					  return
				  }
				  const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})				  
				  if(res.meta.status !== 200 && this.kw.length !== 0){
					  // console.log(123)
					  return uni.$showMsg()
				  }				  
				  this.searchResults = res.message
				  // 调用方法保存搜索建议
				  this.saveSearchHistory()
			  },
			  gotoDetail(item){
				  uni.navigateTo({
				  	url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
				  })
			  },
			  saveSearchHistory(){
				  // this.historyList.unshift(this.kw)
				  const set = new Set(this.historyList)
				  set.delete(this.kw)
				  set.add(this.kw)
				  this.historyList = Array.from(set)
				// 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
				  uni.setStorageSync('kw',JSON.stringify(this.historyList))
			  },
			  // 清除本地搜索记录
			  cleanHistory(){
				  this.historyList = []
				  uni.setStorageSync("kw",'[]')
			  },
			  // 点击跳转到商品详情
			  gotoGoodsList(item){
				uni.navigateTo({
					url:'/subpkg/goods_list/goods_list?query='+item
				})  
			  }
		},
		computed:{
			historys(){
				  // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
				// 而是应该新建一个内存无关的数组，再进行 reverse 反转
				return [...this.historyList].reverse()
			}
		}
	}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list{
	padding: 0 5px;
	.sugg-item{
		font-size: 13px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.goods-name{
		// 文字不允许换行
		white-space: nowrap;
		overflow: hidden;
		// 文本溢出后 使用...代替
		text-overflow: ellipsis;
		margin-right: 3px;
	}
}
.history-box{
	padding: 0 5px;
	.history-title{
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 40px;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list{
		display: flex;
		flex-wrap: wrap;
		.uni-tag{
			margin-top: 5px;
			margin-right: 5px;
		}
	}
}
</style>
