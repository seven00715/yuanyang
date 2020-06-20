// pages/news/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.initPage()
      .then(res => {
        this.loadData()
      })
  },
  loadData() {
    this.fetchNewsList()
    // this.fetchTypeList()
    // this.goodsNew()
    // this.goodsHot()
    // this.goodsPage()
  },
  
  fetchTypeList() {
      app.api.fetchTypeList({
    })
      .then(res => {
        let newsList = res.data.records
        this.setData({
          newsList: newsList
        })
      })
  },
  // 资讯
  fetchNewsList() {
    app.api.fetchNewsList({
      type: 0
    })
      .then(res => {
        let newsList = res.data.records
        this.setData({
          newsList: newsList
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