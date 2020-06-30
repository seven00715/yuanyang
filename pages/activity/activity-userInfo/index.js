const app = getApp()
// pages/activity/activity-userInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data)
      this.setData({
        activitycolumn1: data.activitycolumn1,
        id: data.id
      })
    })
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
  bindInput(e) {
    console.log(e.currentTarget.dataset.index , e.detail.value)
    if (e.detail.value) {
      let index = e.currentTarget.dataset.index

      let value = 'activitycolumn1[' + index +'].value';
      console.log(value)
      this.setData({
        [value]: e.detail.value
      })
    }

  },
  async formSubmit(){
    const res = await app.api.signActive({ id: this.data.id, externInfo: this.data.activitycolumn1})
    if (res.code === 0) {
      wx.showToast({
        title: res.data,
        icon: 'succes',
        mask: true
      })
    } else {
      wx.showToast({
        title: "报名失败，请重试",
        icon: 'succes',
        mask: true
      })
    }
  }
})