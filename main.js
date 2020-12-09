import Vue from 'vue'
import App from './App'
// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'
Vue.config.productionTip = false
// 在 uni-app 项目中，可以把 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http
$http.baseUrl = 'https://www.uinav.com'
// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  wx.showLoading({
    title: '数据加载中...',
  })
}
// 请求完成之后做一些事情
$http.afterRequest = function () {
  wx.hideLoading()
}
uni.$myShowtoast = function(title='请求数据失败',duration=1500, ){
  uni.showToast({
           title,
           duration,
           icon: 'none'
  });
}
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
