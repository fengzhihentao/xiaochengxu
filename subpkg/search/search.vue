<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar class="search-item"
                      @input="input"
                      :bgColor="'#fff'"
                      :radius="100"
                      :cancelButton="none"
                      @cancel="add"></uni-search-bar>
    </view>
    <!-- 搜索历史 -->
    <view class="history-box"
          v-if="msg ? false:true">
      <!-- 搜索标题 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash"
                   size="17"
                   @click="deleteMsg"></uni-icons>
      </view>
      <!-- 搜索列表 -->
      <view class="history-list">
        <uni-tag class="icon-box"
                 :text="item"
                 v-for="(item,i) in list"
                 :key="i"
                 size="small"
                 @click="add(item)"></uni-tag>
      </view>
    </view>
    <!-- 搜索列表区域 -->
    <view class="search-list"
          v-for="(item,i) in searchList"
          :key="i"
          @click="gotolist(item.goods_id)">
      <text class="search-item">{{item.goods_name}}</text>
      <uni-icons type="arrowright"
                 size="18"></uni-icons>
    </view>
  </view>
</template>

<script>
export default {
  onLoad () {
    this.historyList = JSON.parse(uni.getStorageSync('msg') || "[]")
  },
  data () {
    return {
      timer: null,
      msg: '',
      searchList: [],
      historyList: []
    };
  },
  methods: {
    add (item) {
      console.log(item)
      uni.navigateTo({
        url: '../goods_list/goods_list?query=' + item
      })
    },
    input (e) {
      console.log(this)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.msg = e.value
        this.getSearchList(this.msg)
      }, 500)
    },
    deleteMsg () {
      this.historyList = []
      uni.setStorageSync("msg", "[]")
    },
    gotolist (goods_id) {
      wx.navigateTo({
        url: '../goods_detail/goods_detail?goods_id=' + goods_id
      })
    },
    saveSearchHistory () {
      const set = new Set(this.historyList)
      set.delete(this.msg)
      set.add(this.msg)
      this.historyList = Array.from(set)
      // 持久化存储
      uni.setStorageSync('msg', JSON.stringify(this.historyList))
      console.log(this.historyList)
    },
    async getSearchList (id) {
      const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: id })
      console.log(id)
      if (res.meta.status !== 200) return this.searchList = []
      this.searchList = res.message
      console.log(this.searchList)
      this.saveSearchHistory()
    },
  },
  computed: {
    list () {
      return [...this.historyList].reverse()
    }
  }
}
</script>

<style lang="scss">
.search-box {
  background-color: #f00000;
  position: sticky;
  top: 0;
  z-index: 999;
  /deep/.uni-searchbar {
    background-color: red !important;
    position: relative;
  }
}
.history-title {
  margin: 0px 10px;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
}
.search-list {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .search-item {
    border-bottom: 1px solid #eee;
    overflow: hidden; /*溢出的部分隐藏*/
    white-space: nowrap; /*文本不换行*/
    text-overflow: ellipsis; /*ellipsis:文本溢出显示省略号（...）；clip：不显示省略标记（...），而是简单的裁切*/
    padding: 5px 0;
  }
}
.history-list {
  display: flex;
  justify-content: flex-start;
  /deep/.icon-box {
    margin: 10px;
  }
}
</style>
