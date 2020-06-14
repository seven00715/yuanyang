
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {
      
    },
    loadmore: true,
    couponInfoList: []
  },
  onShow() {
    
  },
  onLoad: function (options) {
    app.initPage()
      .then(res => {
        this.couponInfoPage()
      })
  },
  couponInfoPage() {
    app.api.couponInfoPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let couponInfoList = res.data.records
        this.setData({
          couponInfoList: [...this.data.couponInfoList, ...couponInfoList]
        })
        if (couponInfoList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.couponInfoPage()
    }
  },
  refresh(){
    this.setData({
      loadmore: true,
      couponInfoList: [],
      ['page.current']: 1
    })
    this.couponInfoPage()
  },
  onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading()
    this.refresh()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading()
    // 停止下拉动作
    wx.stopPullDownRefresh()
  }
})