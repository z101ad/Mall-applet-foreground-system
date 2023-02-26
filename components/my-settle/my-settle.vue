<template>
	<view class="my-settle-container">
		<!-- 全选区域 -->
		<label class="radio" @click="changeAllState">
			<radio :checked="isFullCheck" color="#C00000" /><text>全选</text>
		</label>
		
		<!-- 合计区域 -->
		<view class="amount-box">
			合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
		</view>
		
		<!-- 结算区域 -->
		<view class="btn-settle" @click="settlement">
			结算({{checkedCount}})
		</view>
	</view>
</template>

<script>
	import {mapGetters,mapMutations,mapState} from 'vuex'
	export default {
		name:"my-settle",
		data() {
			return {
				// 倒计时的秒数
				seconds:3,
				// 定时器的id
				timer:null
			};
		},
		computed:{
			...mapGetters('m_cart',['checkedCount','total','checkedGoodsAmount']),
			...mapGetters('m_user',['addstr']),
			...mapState('m_user',['token']),
			...mapState('m_cart',['cart']),
			// 是否全选
			isFullCheck(){
				return this.total === this.checkedCount
			}
		},
		methods:{
			...mapMutations('m_cart',['updateAllGoodsState']),
			...mapMutations('m_user',['updateRedirectInfo']),
			changeAllState(){
				this.updateAllGoodsState(!this.isFullCheck)
			},
			// 点击了结算按钮
			settlement(){
				if(!this.checkedCount) return uni.$showMsg('请选中要结算的商品！')
				
				if(!this.addstr) return uni.$showMsg('请选择收货地址！')
				if(!this.token) return this.delayNavigate()
				
				// 实现微信支付的功能
				this.payOrder()
			},
			async payOrder(){
				 // 1. 创建订单
				 // 1.1 组织订单的信息对象
				 const orderInfo = {
					 order_price:0.01,
					 consignee_addr:this.addstr,
					 goods:this.cart.filter(x => x.goods_state).map(x=>({
						 goods_id:x.goods_id,
						 goods_number:x.goods_count,
						 goods_price:x.goods_price
					 }))
				 }
				 // 1.2 发起请求创建订单
				 const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)

				 // token是假的 会创建失败
				 // if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
				 // 1.3 得到服务器响应的“订单编号”
				 // const orderNumber = res.message.order_number
				 const orderNumber = 'HMDD2020091000000001949'
				 
				 // 订单预支付
				 // 2.1 发起请求获取订单的支付信息
				 const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
				  // 2.2 预付订单生成失败
				 // if (res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
				 console.log(res2)   
				// 2.3 得到订单支付相关的必要参数
				 // const payInfo = res2.message.pay
				 const payInfo = {
					 nonceStr: "IYK1c5iscUgZIfxj",
					 package: "prepay_id=wx011604003115645ec1be4d48174ea7080e",
					 paySign: "AD04ED5A386852864E176A5DF26CF436",
					 signType:"MD5",
					 timeStamp: "1598947444"
				}
				 // console.log(payInfo,111) 
				// 3. 发起微信支付
				   // 3.1 调用 uni.requestPayment() 发起微信支付
				   const [err, succ] = await uni.requestPayment(payInfo)
				   // 3.2 未完成支付
				   // if (err) return uni.$showMsg('订单未支付！')
				   // 3.3 完成了支付，进一步查询支付的结果
				   const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
				   console.log(res3)
				   // 3.4 检测到订单未支付
				   // if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
				   // 3.5 检测到订单支付完成
				   uni.showToast({
				     title: '支付完成！',
				     icon: 'success'
				   })
			},
			// 展示倒计时的提示消息
			showTips(n){
				uni.showToast({
					icon:'none',
					title:'请登陆后再结算！' + n + '秒后自动跳转到登录页',
					mask:true,
					duration:1500
				})
			},
			// 延迟导航到 my 页面
			delayNavigate(){
				// 把 data 中的秒数重置成 3 秒
				this.seconds = 3
				this.showTips(this.seconds)
				// 1. 将定时器的 Id 存储到 timer 中
				this.timer = setInterval(() =>{
					this.seconds--
					if(this.seconds <= 0){
						clearInterval(this.timer)
						
						uni.switchTab({
							url:'/pages/my/my',
							success:()=>{
								this.updateRedirectInfo({
									openType:'switchTab',
									from:'/pages/cart/cart'
								})
							}
						})
						 // 终止后续代码的运行（当秒数为 0 时，不再展示 toast 提示消息）
						return
					}
					this.showTips(this.seconds)
				},1000)
			}
		}
	}
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  // 将背景色从 cyan 改为 white
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;

  .radio {
    display: flex;
    align-items: center;
  }

  .amount {
    color: #c00000;
  }

  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>
