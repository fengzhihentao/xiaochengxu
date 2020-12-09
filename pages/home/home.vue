<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item class="list" v-for="(item, i) in swiperList" :key="i">
        <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id" class="swiper-item"><image :src="item.image_src" class="img"></image></navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="bg">分类导航区域
    <view class="fl-box" v-for="(itme,i) in navList" :key="i">
       <image :src="item.image_src"></image>
    </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.getSwiperList();
    this.getFloorList()
  },
  data() {
    return {
      // 获取轮播图列表
      swiperList: [],
      // 获取分类导航列表
      navList:[]
    };
  },
  methods: {
    // 获取轮播图列表
    async getSwiperList() {
      try {
        const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata');
        if (res.meta.status === 200) {
          this.swiperList = res.message;
        }
      } catch (e) {
        return uni.$myShowtoast()
      }
    },
   // 获取分类导航
   async getFloorList(){
     try{
       let {data:res} = await uni.$http.get("/api/public/v1/home/catitems")
       if(res.meta.status === 200){
          this.navList=  res.message
       }
       console.log(res.message)
     }catch(e){
       return uni.$myShowtoast()
     }
   }
  }
};
</script>

<style lang="scss">
navigator {
  height: 330rpx;
  width: 100%;
  image {
    width: 100%;
    height: 100%;
  }
}
.bg {
  background-color: skyblue;
  height: 100px;
}
</style>
