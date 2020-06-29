const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInfo: {},
    tabIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.fetchAcDetail(options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  async fetchAcDetail(options) {
    let {
      data
    } = await app.api.fetchAcDetail(options.id, {
      type: options.type
    })
    wx.setNavigationBarTitle({
      title: data.title
    })
    data.prizes.push(...data.prizes)
    data.activityRule = data.activityRule.split('\n')
    this.setData({
      activeInfo: data
    })
  },
  // 切换tab
  toggleTab(e) {
    console.log(e.currentTarget.dataset.index)
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  },
  //跳转到报名信息页面
  jumpToInput(e) {
    console.log(e)
    wx.navigateTo({
      url: "/pages/activity/activity-userInfo/index",
      success: function(res) {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          activitycolumn1: e.currentTarget.dataset.activitycolumn1,
          id: e.currentTarget.dataset.id
        })
      }
    })
  }
})