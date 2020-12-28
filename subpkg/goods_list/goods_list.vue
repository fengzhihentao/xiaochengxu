<template>
	<view>
		<view class="goods-list">
		  <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
        <view class="goods-item">
          <!-- 商品左侧图片区域 -->
          <view class="goods-item-left">
            <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
          </view>
          <!-- 商品右侧信息区域 -->
          <view class="goods-item-right">
          <!-- 商品标题 -->
          <view class="goods-name">
            {{goods.goods_name}}
          </view>
          <!-- 商品价格 -->
          <view class="goods-info-box">
            <view class="goods-price">￥{{goods.goods_price|tofixed}}</view>
          </view>
          </view>
        </view>
      </view>
		</view>
	</view>
</template>

<script>
	export default {
    onLoad:function(optine){
      this.queryObj.query = optine.query || ''
      this.queryObj.cid = optine.cid || ''
      this.getGoodsList()
    },
    // 触底事件
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pageSize >= this.total) return uni.$myShowtoast('数据加载完毕!')
      if(this.isloading) return
      this.queryObj.pagenum += 1
      console.log(this.queryObj.pagenum)
      console.log(this.total)
      this.getGoodsList()
    },
    // 下拉刷新的事件
    onPullDownRefresh() {
      // 1.重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false 
      this.goodsList = []
      // 2.重新发起请求
      this.getGoodsList(()=>uni.stopPullDownRefresh())
    },
		data() {
			return {
        // 是否正在请求数据
        isloading: false,
				queryObj:{
          query:'',
          cid:"",
          pagenum:1,
          pageSize:10,
        },
        total:'',
        goodsList:[],
       // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
         };
		},
    methods:{
        async getGoodsList(cd){
          this.isloading = true
          const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
          this.isloading = false
          cd && cd()
          if(res.meta.status !== 200) return uni.$myShowtoast()
          this.goodsList = [...this.goodsList,...res.message.goods]
          this.queryObj.pageNum =  res.message.pagenum
          this.total =  res.message.total
      },
      gotoDetail(goods){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+goods.goods_id
        })
      }
    },
    filters:{
      tofixed(num){
        return Number(num).toFixed(2)
      }
    }
	}
</script>

<style lang="scss">
.goods-item{
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-start;
  .goods-item-left{
    .goods-pic{
      margin-right: 5px;
      display: block;
      width: 100px;
      height: 100px;
    }
  }
  .goods-item-right{
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .goods-name{
      font-size: 12px;
    }
    .goods-info-box{
      .goods-price{
        color: red;
      }
    }
  }
}
</style>
