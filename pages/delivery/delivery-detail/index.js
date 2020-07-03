const WxParse = require('../../../public/wxParse/wxParse.js')
const app = getApp()
// pages/news/news-detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('news-detail options', options)
    this.data.id = options.id
    app.initPage()
      .then(res => {
        this.loadData()
      })
  },
  loadData() {
    //html转wxml
    // WxParse.wxParse('description', 'html', goodsSpu.description, this, 0)
    this.fetchDetail()
  },
  fetchDetail() {
    app.api.fetchDetailById(this.data.id)
      .then(res => {
        const { content } = res.data
        console.log('fetchDetail',res)
        WxParse.wxParse('description', 'html', content, this, 0)
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