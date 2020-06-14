
const app = getApp()

Page({
  data: {
    orderItem: {},
    orderRefunds:{}
  },
  onShow() {
    
  },
  onLoad(options) {
    this.setData({
      orderItemId: options.orderItemId,
      [`orderRefunds.orderItemId`]: options.orderItemId
    })
    app.initPage()
      .then(res => {
        this.orderItemGet(this.data.orderItemId)
      })
  },
  orderItemGet(id){
    let that = this
    app.api.orderItemGet(id)
      .then(res => {
        let orderItem = res.data
        this.setData({
          orderItem: orderItem,
          orderRefunds: orderItem.listOrderRefunds[0]
        })
      })
  }
})