const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBeiPerson: false,
    isEnd: false,
    activeInfo: {},
    optData: {
      type: null,
      activityId: '',
      userId: "",
      imageUrl: '',
      title: ''
    },
    hasUserId: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 进入详情： activityId:活动id  type
    // 被邀请人进入： activityId  userId
    console.log("邀请options=====", options)
    const tempOpt = this.data.optData
    Object.assign(tempOpt, options)
    if (options.hasOwnProperty("userId")){
      this.setData({
        optData: tempOpt,
        isBeiPerson: true
      })
    } else {
      this.setData({
        optData: tempOpt,
        isBeiPerson: false
      })
    }
    // app.initPage()
    //   .then(res => {
    this.loadData()
    // })

  },
  loadData() {
    this.fetchAcDetail()
    this.onInvite()
    if(this.data.isBeiPerson){
      this.onFetchBeiInvite()
    }
  },

  async onFetchBeiInvite() {
    const res = await app.api.fetchBeiInvite({
      userId: this.data.optData.userId,
      activityId: this.data.optData.activityId,
    })
    if (res.code === 0) {
      wx.showToast({
        title: res.data,
        icon: 'succes',
        mask: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: this.data.optData.title,
      path: `pages/activity/activity-invite/index?userId=${this.data.optData.userId}&activityId=${this.data.optData.activityId}`,
      imageUrl: this.data.optData.imageUrl,
      success: function(res) {
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
      fail: function(res) {
        console.log('fail res', res)
        // 转发失败
      }
    }

  },
  async fetchAcDetail() {
    console.log('fetchAcDetail',this.data.optData)
    let {
      data
    } = await app.api.fetchAcDetail(this.data.optData.activityId)
    // data.prizes.push(...data.prizes)
    data.content = data.content.split("\n")
    data.activityRule = data.activityRule.split('\n')
    data.yyActivityCalls.push(...data.yyActivityCalls)
    wx.setNavigationBarTitle({
      title: data.title
    })
    let isEnd = data.isEnd
    if(isEnd){
      this.setData({
        activeInfo: data,
        isEnd: true
      })
    }else {
      this.setData({
        activeInfo: data,
        isEnd:false
      })
    }
 
  
  },

  async onInvite() {
    const res = await app.api.inviteJoin({
      activityId: this.data.optData.activityId
    })
    if (res.code === 0) {
      const {
        data
      } = res
      console.log("onInvite res", data)
      const resOpt = {
        activityId: data.activityId,
        userId: data.userId,
        imageUrl: data.img[0],
        title: data.title
      }
      const tempOpt = this.data.optData
      Object.assign(tempOpt, resOpt)
      this.setData({
        optData: tempOpt
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