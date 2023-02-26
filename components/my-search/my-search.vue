<template>
	<view class="my-search-container" :style="{'background':bgcolor}">
		<view class="my-search-box" :style="{'border-radius':redius+'px'}" @click="searchBoxHandler">
			<uni-icons type="search" size="17"></uni-icons>
			<text class="placeholder">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		data() {
			return {
				
			};
		},
		props:{
			// 背景颜色
			bgcolor:{
				type:String,
				default:'#C00000'
			},
			// 圆角尺寸
			redius:{
				type:Number,
				default:18
			}
			
		},
		methods:{
			searchBoxHandler(){
				this.$emit('click')
			}
		}
	}
</script>

<style lang="scss">
	.my-search-container{
		// background-color: #C00000;
		height: 50px;
		padding: 0 10px;
		display: flex;
		align-items: center;
	}
	.my-search-box{
		height: 36px;
		background-color: #FFFFFF;
		width: 100%;
		// border-radius: 15px;
		display: flex;
		justify-content: center;
		align-items: center;
		.placeholder{
			font-size: 15px;
			margin-left: 5px;
		}
	}
</style>
