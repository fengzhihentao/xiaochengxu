<template>
  <view>
    <view class="search-box">
      <my-search :bgColor="'#f00'" :radius="18" @click="goToSearch"></my-search>
    </view>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="swiper-box">
      <swiper-item class="list" v-for="(item, i) in swiperList" :key="i">
        <navigator :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id" class="swiper-item"><image :src="item.image_src" class="img"></image></navigator>
      </swiper-item>
    </swiper>
    <!-- 分类导航区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item.name)"><image :src="item.image_src" class="nav-img"></image></view>
    </view>
    <!-- 楼层列表区域 -->
    <view class="floor-list">
      <view class="floor-item" v-for="(item, i) in floorList" :key="i">
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class="floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{ width: item.product_list[0].image_width + 'rpx' }" mode="widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class="right-img-box">
            <navigator :url="item2.url" class="right-img-item" v-for="(item2, i2) in item.product_list" :key="i2" v-if="i2 !== 0">
              <image :src="item2.image_src" mode="widthFix" :style="{ width: item2.image_width + 'rpx' }"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  onLoad() {
    this.getSwiperList();
    this.getNavList();
    this.getFloorList();
  },
  data() {
    return {
      // 获取轮播图列表
      swiperList: [],
      // 获取分类导航列表
      navList: [],
      // 获取楼层列表
      floorList: []
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
        return uni.$myShowtoast();
      }
    },
    // 获取分类导航
    async getNavList() {
      try {
        let { data: res } = await uni.$http.get('/api/public/v1/home/catitems');
        if (res.meta.status === 200) {
          this.navList = res.message;
        }
      } catch (e) {
        return uni.$myShowtoast();
      }
    },
    // 点击跳转分类页面
    navClickHandler(name) {
      if (name !== '分类') return;
      wx.switchTab({
        url: '../cate/cate'
      });
    },
    goToSearch(){
      uni.navigateTo({
        url:"../../subpkg/search/search"
      })
    },
    // 获取楼层列表
    async getFloorList() {
      const { data: res } = await uni.$http.get('/api/public/v1/home/floordata');
      if (res.meta.status === 200) {
        res.message.forEach((item, i) => {
          item.product_list.forEach((item2, i2) => {
            item2.url = '/subpkg/goods_list/goods_list?' + item2.navigator_url.split('?')[1];
          });
        });
        this.floorList = res.message;
      }
    }
  }
};
</script>

<style lang="scss">
  .search-box{
    position: sticky;
    top: 0;
    z-index: 999;
  }
.swiper-box {
  height: 330rpx;
  width: 100%;
  .swiper-item {
    width: 100%;
    height: 100%;
    image{
      width: 100%;
    }
  }
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
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
</style>
