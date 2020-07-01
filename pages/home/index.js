const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 10
    },
    loadmore: true,
    goodsList: [],
    goodsListNew: [],
    newsList: [],
    swiperData: [],
    noticeData: [],
    projectList: [],
    activeList: []
  },
  async signActive(id) {
    console.log('signActive activeInfo', this.activeInfo)
    const res = await app.api.research()
    if (res.code === 0) {
      const { isJoin } = res.data
      if (isJoin === 1) {
        wx.showToast({
          title: "您已参加过此问卷",
          icon: 'error',
          mask: true
        })
      } else {
        wx.navigateTo({
          url: '/pages/research/index',
        })
      }
    }
  },
  goHouse() {
      wx.navigateToMiniProgram({
          appId: 'wx389b61b4be61cf31'
      })
  },
  goHotLine() {
    wx.makePhoneCall({
      phoneNumber: '18686168810' //仅为示例，并非真实的电话号码
    })
  },
  onLoad() {
    app.initPage()
      .then(res => {
        this.loadData()
      })
  },
  onShow() {
    //更新tabbar购物车数量
    wx.setTabBarBadge({
      index: 2,
      text: app.globalData.shoppingCartCount + ''
    })
  },
  loadData() {
    this.fetchAcList()
    this.swiperGet()
    this.fetchNewsList()
    this.fetchProjectList()
    // this.goodsNew()
    // this.goodsHot()
    // this.goodsPage()
  },
  onShareAppMessage: function () {
    let title = '悦生活'
    let path = 'pages/home/index'
    return {
      title: title,
      path: path,
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          console.log(res.errMsg)
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //获取轮播图
  swiperGet() {
    app.api.noticeGet({
      type: '1',
      enable: '1'
    })
      .then(res => {
        let notice = res.data
        if (notice) {
          this.setData({
            swiperData: notice.listNoticeItem
          })
        }
      })
  },

  fetchNewsList() {
    app.api.fetchNewsList({
      type: 0,
    })
      .then(res => {
        let newsList = res.data.records
        this.setData({
          newsList: newsList
        })
      })
  },
  fetchProjectList() {
    app.api.fetchNewsList({
      type: 2,
    })
      .then(res => {
        let projectList = res.data.records
        this.setData({
          projectList: projectList
        })
      })
  },
  //新品首发
  goodsNew() {
    app.api.goodsPage({
      searchCount: false,
      current: 1,
      size: 5,
      descs: 'create_time'
    })
      .then(res => {
        let goodsListNew = res.data.records
        this.setData({
          goodsListNew: goodsListNew
        })
      })
  },




  //   //  活动详情
  // fetchAcDetail() {
  //   app.api.fetchAcDetail('1272159987784531970')
  //     .then(res => {
  //       // let goodsListHot = res.data.records
  //       // this.setData({
  //       //   goodsListHot: goodsListHot
  //       // })
  //     })
  // },
  //  活动接口
  fetchAcList() {
    app.api.fetchAcList({
      current: 1,
      size: 20
    })
      .then(res => {
        let activeList = res.data.records.slice(0, 2)
        this.setData({
          activeList: activeList
        })
      })
  },
  goodsHot() {
    app.api.goodsPage({
      searchCount: false,
      current: 1,
      size: 5,
      descs: 'sale_num'
    })
      .then(res => {
        let goodsListHot = res.data.records
        this.setData({
          goodsListHot: goodsListHot
        })
      })
  },
  goodsPage(e) {
    app.api.goodsPage(this.data.page)
      .then(res => {
        let goodsList = res.data.records
        this.setData({
          goodsList: [...this.data.goodsList, ...goodsList]
        })
        if (goodsList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  refresh() {
    this.setData({
      loadmore: true,
      ['page.current']: 1,
      goodsList: [],
      goodsListNew: [],
      goodsListHot: []
    })
    this.loadData()
  },
  onPullDownRefresh() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading()
    this.refresh()
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading()
    // 停止下拉动作
    wx.stopPullDownRefresh()
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.goodsPage()
    }
  },
  jumpPage(e) {
    let page = e.currentTarget.dataset.page
    if (page) {
      wx.navigateTo({
        url: page
      })
    }
  },
  jumpToactive(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item

    if (item.type === 1) {
      wx.navigateTo({
        url: `/pages/activity/activity-signUp/index?id=${item.id}&type=${item.type}`
      })
    } else if (item.type === 2) {
      wx.navigateTo({
        url: `/pages/activity/activity-invite/index?id=${item.id}&type=${item.type}`
      })
    }

  }
})