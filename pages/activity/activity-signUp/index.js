const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeInfo:{},
    tabIndex:0,
    acOptions: {},
    isEnd:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      acOptions:options
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
  //跳转到报名信息页面
  jumpToInput(e) {
    console.log(e,'传递的e')
    console.log("this.data.acOptions", this.data.acOptions)
    wx.navigateTo({
      url: "/pages/activity/activity-userInfo/index",
      success:  (res) => {
        // 通过eventChannel向被打开页面传送数据
        res.eventChannel.emit('acceptDataFromOpenerPage', {
          activitycolumn1: e.currentTarget.dataset.activitycolumn1,
          id: e.currentTarget.dataset.id,
          option: this.data.acOptions
        })
      }
    })
  },
  // 直接报名
  async signActive(id){
    console.log('signActive activeInfo', this.activeInfo)
   const res =await app.api.signActive({
     activityId: this.data.acOptions.id
    })
    console.log('res---',res)
    if(res.code === 0) {
      wx.showToast({
        title: res.data,
        icon: 'succes',
        mask: true
      })
    }else{
      wx.showToast({
        title: "报名失败，请重试",
        icon: 'succes',
        mask: true
      })
    }
    console.log('signActive',res)
  },
  async fetchAcDetail(options){
    let { data } = await app.api.fetchAcDetail(options.id, { type: options.type})
    wx.setNavigationBarTitle({
      title: data.title
    })
    data.prizes.push(...data.prizes)
    data.activityRule=data.activityRule.split('\n')
    const isEnd = data.isEnd
    if (isEnd === 1){
      this.setData({
        activeInfo: data,
        isEnd: true
      })
    }else {
      this.setData({
        activeInfo: data,
        isEnd: false
      })
    }
  
  },
  // 切换tab
  toggleTab(e){
    console.log(e.currentTarget.dataset.index)
    this.setData({
      tabIndex: e.currentTarget.dataset.index
    })
  }
})