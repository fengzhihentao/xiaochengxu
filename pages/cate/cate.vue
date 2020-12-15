<template>
  <view>
    <my-search :bgColor="'#f00'" :radius="18" @click="goToSearch"></my-search>
    <view class="scroll-view-container">
      <!-- 左侧滑动区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height:wh+'px'}">
        <block  v-for="(item,i) in cateList" :key="i" >
          <view :class="['left-scroll-view-item',i === active ? 'active':'']" @click="activeChanged(i)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view  :scroll-top="scrollTop" class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view class="cate-lv2" v-for="(item2, i2) in cateLevel2" :key="i2">
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 动态渲染三级分类的列表数据 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 Item 项 -->
            <view class="cate-lv3-item" v-for="(item3, i3) in item2.children" :key="i3" @click="goToGoods_list(item3.cat_id)">
              <!-- 图片 -->
              <image :src="item3.cat_icon"></image>
              <!-- 文本 -->
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
	export default {
    onLoad() {
       // 获取当前系统的信息
        const sysInfo = uni.getSystemInfoSync()
        // 为 wh 窗口可用高度动态赋值
        this.wh = sysInfo.windowHeight - 50
        this.getCateList()
    },
		data() {
			return {
				// 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
				wh: 0,
        // 左侧滑动菜单列表
        cateList :[],
        // 点击切换样式
        active:0,
        // 第二列数据
        cateLevel2:[],
        // 第三列数据
        cateLevel3:[],
        scrollTop:0,
        bgColor : "skyblue"
			};
		},
    methods:{
      // 左侧滑动菜单
     async  getCateList () {
       const {data:res} = await uni.$http.get('/api/public/v1/categories')
       if(res.meta.status !== 200) return
      this.cateList = res.message
      // 为二级分类赋值
        this.cateLevel2 = res.message[0].children
        // 为三级分类赋值
        this.cateLevel3 = res.message[0].children[0].children || []
     },
     // 点击切换样式
     activeChanged(i){
       this.active = i
      // 为二级分类列表重新赋值
      this.cateLevel2 = this.cateList[i].children
      this.cateLevel3 = this.cateList[i].children[i] ? this.cateList[i].children[i].children  : [],
      console.log(this.cateLevel2)
      this.scrollTop = this.scrollTop === "0" ? "1" : "0"
     },
     goToGoods_list(cid){
       wx.navigateTo({
         url:"/subpkg/goods_list/goods_list?cid="+cid
       })
     },
     goToSearch(){
       uni.navigateTo({
         url:"../../subpkg/search/search"
       })
     },
    },
	}
</script>

<style lang="scss">
  .scroll-view-container{
    display: flex;
    .left-scroll-view{
      width: 120px;
      .left-scroll-view-item{
        background-color: #f7f7f7;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        &.active{
          position: relative;
          background-color: #fff;
          &::before{
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            content: " ";
            display: block;
            width: 3px;
            height: 30px;
            background-color: #c00000;
          }
        }
      }
    }
    .right-scroll-view{
    }
    .cate-lv2-title{
      text-align: center;
      font-weight: 700;
      line-height: 60rpx;
      }
    .cate-lv3-list {
      display: flex;
      flex-wrap: wrap;
    
      .cate-lv3-item {
        width: 33.33%;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
    
        image {
          width: 60px;
          height: 60px;
        }
    
        text {
          font-size: 12px;
        }
      }
    }
  }
</style>