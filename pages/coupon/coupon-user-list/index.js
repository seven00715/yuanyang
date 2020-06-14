
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    tabCur: 0,
    couponStatus: [
      {
        value: '全部',
        key: '0'
      },
      {
        value: '已使用',
        key: '1'
      }, {
        value: '已过期',
        key: '2'
      }
    ],
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {
      status: '0'
    },
    loadmore: true,
    couponUserList: []
  },
  onShow() {
    
  },
  onLoad: function (options) {
    app.initPage()
      .then(res => {
        this.couponUserPage()
      })
  },
  couponUserPage() {
    app.api.couponUserPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let couponUserList = res.data.records
        this.setData({
          couponUserList: [...this.data.couponUserList, ...couponUserList]
        })
        if (couponUserList.length < this.data.page.size) {
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
      this.couponUserPage()
    }
  },
  refresh(){
    this.setData({
      loadmore: true,
      couponUserList: [],
      ['page.current']: 1
    })
    this.couponUserPage()
  },
  onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading()
    this.refresh()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading()
    // 停止下拉动作
    wx.stopPullDownRefresh()
  },
  tabSelect(e) {
    let dataset = e.currentTarget.dataset
    if (dataset.index != this.data.tabCur){
      this.setData({
        tabCur: dataset.index,
        ['parameter.status']: dataset.key
      })
      this.refresh()
    }
  }
})