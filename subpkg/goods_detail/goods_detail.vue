<template>
	<view>
		<!-- 商品详情页 -->
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box" v-if="goods_info.goods_name">
      <!-- 商品价格 -->
      <view class="price" >￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">
          {{goods_info.goods_name}}
        </view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">
        快递:免运费
      </view>
    </view>
    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    <!-- 购物车 -->
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
	</view>
</template>

<script>
	export default {
    props:{
      _id:{
        type:String,
      },
      goods_id:{
        type:Number,
      }
    },
    onLoad(options) {
      console.log(options)
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
		data() {
			return {
        // 商品详情对象
				goods_info:{},
        options: [{
                    icon: 'headphones',
                    text: '客服'
                }, {
                    icon: 'shop',
                    text: '店铺',
                    info: 2,
                    infoBackgroundColor:'#007aff',
                    infoColor:"red"
                }, {
                    icon: 'cart',
                    text: '购物车',
                    info: 2
                }],
                buttonGroup: [{
                  text: '加入购物车',
                  backgroundColor: '#ff0000',
                  color: '#fff'
                },
                {
                  text: '立即购买',
                  backgroundColor: '#ffa200',
                  color: '#fff'
                }
         ]
			};
		},
    methods:{
     async getGoodsDetail(goods_id){
        const {data:res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
        console.log(res)
        if(res.meta.status !== 200) uni.$myShowtoast()
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;" ').replace(/webp/g, 'jpg')
       this.goods_info = res.message
       console.log(this.goods_info)
      },
      preview(i){
        uni.previewImage({
          current:i,
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      onClick (e) {
        if(e.content.text === '购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
       },
       buttonClick (e) {
         console.log(e)
         this.options[2].info++
       }
    }
	}
</script>

<style lang="scss">
swiper{
  height: 750rpx;
  image{
    width: 100%;
    height: 100%;
  }
}
.goods-info-box{
  .price{
    padding: 20px 0px;
    color: red;
    font-weight: 700;
  }
  .goods-info-body{
    display: flex;
    justify-content: space-between;
    .goods-name{
      font-size: 15px;
    }
    .favi{
      margin-left: 10px;
      border-left: 2px solid #eee;
      display: flex;
      flex-direction: column;
      align-items:center;
      justify-content:center;
      text{
        width: 100rpx;
        text-align: center;
      }
    }
  }
  .yf{
    padding: 10px 0px;
    font-size: 12px;
    color: #666;
  }
}
.goods-detail-container {
  // 给页面外层的容器，添加 50px 的内padding，
  // 防止页面内容被底部的商品导航组件遮盖
  padding-bottom: 50px;
}
.goods_nav{
// 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
