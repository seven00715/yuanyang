const app = getApp()

Page({
  data: {
    wxUser: null,
    userInfo: null,
    orderCountAll: [],
    activeList: []
  },
  onShow() {
    //更新tabbar购物车数量
    wx.setTabBarBadge({
      index: 2,
      text: app.globalData.shoppingCartCount + ''
    })

    let wxUser = app.globalData.wxUser
    this.setData({
      wxUser: wxUser
    })
    this.userInfoGet()
    this.fetchNewsList()
    // this.orderCountAll()
  },
  onLoad() {},
  /**
   * 小程序设置
   */
  settings: function() {
    wx.openSetting({
      success: function(res) {
        console.log(res.authSetting)
      }
    })
  },
  // 活动列表
  fetchNewsList() {
    app.api.fetchAcList({
        current: 1,
        size: 20
      })
      .then(res => {
        let activeList = res.data.records.slice(0, 2)
        this.setData({
          activeList: activeList
        })
      })
  },

  jumpToactive(e) {
    console.log('center e', e)
    const item = e.target.dataset.item
    const type = e.target.dataset.item.type
    if (item.type === 1) {
      wx.navigateTo({
        url: `/pages/activity/activity-signUp/index?id=${item.id}&type=${item.type}`
      })
    } else if (item.type === 2) {
      wx.navigateTo({
        url: `/pages/activity/activity-invite/index?id=${item.id}&type=${item.type}`
      })
    }
  },
  agreeGetUser(e) {
    if (e.detail.errMsg == 'getUserInfo:ok') {
      app.api.wxUserSave(e.detail)
        .then(res => {
          let wxUser = res.data
          this.setData({
            wxUser: wxUser
          })
          app.globalData.wxUser = wxUser
          this.userInfoGet()
        })
    }
  },
  //获取商城用户信息
  userInfoGet() {
    app.api.userInfoGet()
      .then(res => {
        this.setData({
          userInfo: res.data
        })
      })
  },
  orderCountAll() {
    app.api.orderCountAll()
      .then(res => {
        this.setData({
          orderCountAll: res.data
        })
      })
  }
})