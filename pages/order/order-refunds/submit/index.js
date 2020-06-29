
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
          orderItem: orderItem
        })
      })
  },
  resonInput(e) {
    this.setData({
      [`orderRefunds.refundReson`]: e.detail.value
    })
  },
  radioChange(e){
    this.setData({
      [`orderRefunds.status`]: e.detail.value
    })
  },
  subRefunds(){
    if (!this.data.orderRefunds.status) {
      wx.showToast({
        title: '请选择退款类型',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.orderRefunds.refundReson){
      wx.showToast({
        title: '请输入退款原因',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let that = this
    wx.showModal({
      content: '确认提交退款申请吗？',
      cancelText: '我再想想',
      confirmColor: '#ff0000',
      success(res) {
        if (res.confirm) {
          app.api.orderRefundsSave(
            that.data.orderRefunds
          )
            .then(res => {
              wx.redirectTo({
                url: '/pages/order/order-refunds/form/index?orderItemId=' + that.data.orderItemId
              })
            })
        }
      }
    })
  }
})