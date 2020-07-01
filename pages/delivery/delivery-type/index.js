// pages/news/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectList: [],
    page: {
      current: 1,
      size: 10,
    },
    loadmore: true,
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
    this.fetchTypeList()
  },
  fetchTypeList() {
      app.api.fetchTypeList({
        ...this.data.page,
    })
      .then(res => {
        let projectList = res.data.records
        this.setData({
          projectList: [...this.data.projectList, ...projectList]
        })
        if (projectList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
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
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.fetchTypeList()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})