
const app = getApp()

Page({
  data: {
    orderLogistics: [],
    id: null
  },
  onShow() {
    
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    app.initPage()
      .then(res => {
        this.orderLogisticsGet(this.data.id)
      })
  },
  orderLogisticsGet(id){
    let that = this
    app.api.orderLogisticsGet(id)
      .then(res => {
        let orderLogistics = res.data
        this.setData({
          orderLogistics: orderLogistics
        })
      })
  },
  //复制内容
  copyData(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.data
    })
  },
})