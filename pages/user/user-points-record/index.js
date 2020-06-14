
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 15,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {
      
    },
    loadmore: true,
    pointsRecord: [],
    userInfo: null
  },
  onLoad(options) {
    app.initPage()
      .then(res => {
        this.userInfoGet()
        this.pointsRecordPage()
      })
  },
  onShow(options) {
    
  },
  //获取商城用户信息
  userInfoGet() {
    app.api.userInfoGet()
      .then(res => {
        this.setData({
          userInfo: res.data
        })
      })
  },
  pointsRecordPage() {
    app.api.pointsRecordPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let pointsRecord = res.data.records
        this.setData({
          pointsRecord: [...this.data.pointsRecord, ...pointsRecord]
        })
        if (pointsRecord.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.pointsRecordPage()
    }
  }
})
