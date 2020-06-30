// pages/live/live-new.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveList: [],
    replayList: []
  },

  /**
   * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    app.initPage()
      .then(res => {
        console.log('initPage')
        this.loadData()
      })
  },
  loadData(){
    this.fetchLiveList()
    this.fetchReplayList()
  },
  
  fetchReplayList() {
    app.api.fetchReplayList({
      current: 1,
      size: 20
    })
      .then(res => {
        let replayList = res.data.records
        this.setData({
          replayList: replayList
        })
      })
  },
  fetchLiveList() {
    app.api.fetchLiveList({
      current: 1,
      size: 20
    })
      .then(res => {
        let liveList = res.data.records
        this.setData({
          liveList: liveList
        })
      })
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

  }
})