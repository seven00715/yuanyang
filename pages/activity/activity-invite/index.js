const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInfo:{},
    id: null,
    type:null,
    optData: {},
    shareData: {
      path: '',
      imageUrl: '',
      title: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options", options)
    this.optData = options
    this.setData({
      id: options.id,
      type:options.type
    })
    this.fetchAcDetail(options)
    this.onInvite()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage () {
    const shareData = this.data.shareData
    return {
      title: shareData.title,
      path: shareData.path,
      imageUrl: shareData.imageUrl,
      success: function (res) {
        console.log('share res', res)
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(res.errMsg)
          wx.showToast({
            title: '分享成功',
            icon: 'succes',
            mask: true
          })
        }
      },
      fail: function (res) {
        console.log('fail res', res)
        // 转发失败
      }
    }
    
  },
  async fetchAcDetail(options){
    let { data } = await app.api.fetchAcDetail(options.id, { type: options.type})
    // data.prizes.push(...data.prizes)
    data.content = data.content.split("\n")
    data.activityRule=data.activityRule.split('\n')
    data.yyActivityCalls.push(...data.yyActivityCalls)
    wx.setNavigationBarTitle({
      title: data.title
    })
    this.setData({
      activeInfo:data
    })
  },

  async onInvite() {
    const res = await app.api.inviteJoin({
      activityId: this.optData.id
    })
    if (res.code === 0) {
      const { data } = res
      this.setData({
        shareData: data
      })
    
    } else {
      // wx.showToast({
      //   title: "报名失败，请重试",
      //   icon: 'succes',
      //   mask: true
      // })
    }
  }
})