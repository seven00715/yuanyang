// pages/news/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeList: [],
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
        let goodsListHot = res.data.records
        this.setData({
          goodsListHot: goodsListHot
        })
      })
  },
  // 活动列表
  fetchNewsList() {
    app.api.fetchAcList({
      current: 1,
       size: 20
    })
      .then(res => {
        let activeList = res.data.records
        this.setData({
          activeList: activeList
        })
      })
  },

  jumpToactive(e){
    const item = e.target.dataset.item
      wx.navigateTo({
        url: `/pages/activity/activity-invite/index?id=${item.id}&type=${item.type}`
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