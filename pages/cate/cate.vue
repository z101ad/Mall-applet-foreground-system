<template>
	<view>
		<!-- 自定义搜索栏 -->
		<my-search @click="gotoSearch"></my-search>
		<!-- 分类 -->
		<view class="scroll-view-container">
			<!-- 左侧的滚动视图区域 -->
			<scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">	
			<block v-for="(item,i) in cateList" :key='i'>
				<view :class="['left-scroll-view-item',i === active ? 'active':'']" @click="activeChanged(i)">{{item.cat_name}}</view>
			</block>
				
			</scroll-view>
			
			<!-- 右侧的滚动视图区域 -->
			<scroll-view scroll-y class="right-sroll-view" :style="{height: wh + 'px'}" :scroll-top="scrollTop">
				<view class="cate-lv2" v-for="(item2,i2) in catelevel2" :key="i2">
					<view class="cate-lv2-title">/{{item2.cat_name}}/</view>
					<!-- 动态渲染三级分类的列表数据 -->
					<view class="cate-lv3-list">
						<view class="cate-lv3-item" v-for="(item3,i3) in item2.children" :key="i3" @click="gotoGoodsList(item3)">
							<image :src="item3.cat_icon"></image>
							<text>{{item3.cat_name}}</text>
						</view>
					</view>	
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
// 导入自己封装的mixin模块
	import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
		// 将badgeMix混入当前页面使用
		mixins:[badgeMix],
		data() {
			return {
				// 窗口的可视高度
				wh:0,
				cateList:[],
				active:0,
				// 二级分类列表
				catelevel2:[],
				// 滚动条距离顶部的位置
				scrollTop:0
			};
		},
		onLoad() {
			// 获取当前系统的信息
			const sysInfo = uni.getSystemInfoSync();
			// console.log(sysInfo)
			// 为wh窗口赋值
			this.wh = sysInfo.windowHeight - 50
			console.log(this.wh)
			// 调用获取分类列表数据的方法
			this.getCateList()
		},
		methods:{
			async getCateList(){
				// 发起请求
				const {data:res} = await uni.$http.get('/api/public/v1/categories')
				if(res.meta.status !== 200){
					return uni.$showMsg()
				}
				// 后端数据有问题 处理一下数据
				let a = res.message[0];
				res.message[0] = res.message[1];
				res.message[1] = a;
				// 转存数据
				this.cateList = res.message
				// 为二级分类赋值
				this.catelevel2 = res.message[0].children
			},
			activeChanged(i){
				this.active = i
				// 为二级分类重新赋值
				this.catelevel2 = this.cateList[i].children
				// 改变滚动条的位置
				this.scrollTop = this.scrollTop === 1 ? 0 : 1
			},
			gotoGoodsList(item){
				uni.navigateTo({
					url:'../../subpkg/goods_list/goods_list?cid='+item.cat_id
				})
			},
			// 点击搜索栏 跳转到搜索页面
			gotoSearch(){
				uni.navigateTo({
					url:'/subpkg/search/search'
				})
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-container {
	    display: flex;
	
	    .left-scroll-view {
	      width: 120px;
	      .left-scroll-view-item {
	        background-color: #F7F7F7;
			height: 60px;
	        line-height: 60px;
	        text-align: center;
	        font-size: 12px;
	
	        &.active {
	          background-color: #FFFFFF;
	          position: relative;
			  font-size: 14px;
			  font-weight: bold;
	          &::before {
	            content: ' ';
	            display: block;
	            width: 3px;
	            height: 30px;
	            background-color: #C00000;
	            position: absolute;
	            top: 50%;
	            left: 0;
	            transform: translateY(-50%);
	          }
	        }
	      }
	    }
		.right-sroll-view{
			background-color: #FFFFFF;
		}
	  }
	.cate-lv2-title{
		font-size: 12px;
		font-weight: bold;
		text-align: center;
		padding: 15px 0;
	}
	.cate-lv3-list{
		display: flex;
		flex-wrap: wrap;
		.cate-lv3-item{
			width: 33.33%;
			margin-bottom: 10px;
			display: flex;
			flex-direction: column;
			align-items: center;
			image{
				width: 60px;
				height: 60px;
			}
			text{
				font-size: 12px;
			}
		}
	}  
</style>
