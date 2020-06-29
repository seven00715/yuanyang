const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInfo:{},
    id:null,
    type:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id:options.id,
      type:options.type
    })
    this.fetchAcDetail(options)
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
  onShareAppMessage: function () {
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
  }
})