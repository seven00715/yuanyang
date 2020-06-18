// pages/news/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsListHot: [],
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
    // this.goodsNew()
    // this.goodsHot()
    // this.goodsPage()
  },
  fetchNewsList() {
    app.api.fetchNewsList({
      type: 2,
    })
      .then(res => {
        let goodsListHot = res.data.records
        this.setData({
          goodsListHot: goodsListHot
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