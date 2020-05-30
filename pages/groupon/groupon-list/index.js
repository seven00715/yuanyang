
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: 'sort',//升序字段
      descs: ''
    },
    parameter: {},
    loadmore: true,
    grouponInfoList: []
  },
  onShow() {
    
  },
  onLoad: function (options) {
    app.initPage()
      .then(res => {
        this.grouponInfoPage()
      })
  },
  grouponInfoPage() {
    app.api.grouponInfoPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let grouponInfoList = res.data.records
        this.setData({
          grouponInfoList: [...this.data.grouponInfoList, ...grouponInfoList]
        })
        if (grouponInfoList.length < this.data.page.size) {
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
      this.grouponInfoPage()
    }
  },
  refresh(){
    this.setData({
      loadmore: true,
      grouponInfoList: [],
      ['page.current']: 1
    })
    this.grouponInfoPage()
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