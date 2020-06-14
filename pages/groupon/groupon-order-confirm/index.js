
const app = getApp()

Page({
  data: {
    orderConfirmData: [],
    salesPrice: 0,
    paymentPrice: 0,
    freightPrice: 0,
    userAddress: null,
    orderSubParm: {
      paymentType: '1',
      deliveryWay: '1'
    },
    loading: false,
    freightMap: null//各运费模块计数
  },
  onShow() {

  },
  onLoad: function () {
    this.userAddressPage()
    this.orderConfirmDo()
  },
  //获取订阅消息列表
  wxTemplateMsgList(id) {
    app.api.wxTemplateMsgList({
      enable: '1',
      useTypeList: ['2', '3']
    })
      .then(res => {
        let tmplIds = []
        res.data.forEach(item => {
          tmplIds.push(item.priTmplId)
        })
        wx.requestSubscribeMessage({
          tmplIds: tmplIds,
          success(res) {
            console.log(res)
          },
          complete() {
            wx.redirectTo({
              url: '/pages/order/order-detail/index?callPay=true&id=' + id
            })
          }
        })
      })
  },
  deliveryWayChange(e) {
    this.setData({
      [`orderSubParm.deliveryWay`]: e.detail.value,
      freightMap: null
    })
    this.orderConfirmDo()
  },
  orderConfirmDo() {
    // 本地获取参数信息
    let that = this
    wx.getStorage({
      key: 'param-orderConfirm',
      success: function (res) {
        let orderConfirmData = res.data
        let salesPrice = 0 //订单金额
        let freightPrice = 0 //运费
        orderConfirmData.forEach((orderConfirm, index) => {
          salesPrice = (Number(salesPrice) + orderConfirm.salesPrice * orderConfirm.quantity).toFixed(2)
          orderConfirm.paymentPrice = (orderConfirm.salesPrice * orderConfirm.quantity).toFixed(2)
          //计算运费
          let freightTemplat = orderConfirm.freightTemplat
          if (freightTemplat) {
            if (freightTemplat.type == '1') {//模板类型1、买家承担运费
              let quantity = orderConfirm.quantity
              if (freightTemplat.chargeType == '1') {//1、按件数；
                that.countFreight(orderConfirm, freightTemplat, quantity)
              } else if (freightTemplat.chargeType == '2') {//2、按重量
                let weight = orderConfirm.weight
                that.countFreight(orderConfirm, freightTemplat, (weight * quantity))
              } else if (freightTemplat.chargeType == '3') {//3、按体积
                let volume = orderConfirm.volume
                that.countFreight(orderConfirm, freightTemplat, (volume * quantity))
              }
            } else {
              orderConfirm.freightPrice = 0
            }
          } else {
            orderConfirm.freightPrice = 0
          }
          freightPrice = (Number(freightPrice) + Number(orderConfirm.freightPrice)).toFixed(2)
        })
        if (that.data.orderSubParm.deliveryWay == '2') {//自提不算运费
          freightPrice = 0
        }
        that.setData({
          orderConfirmData: orderConfirmData,
          salesPrice: salesPrice,
          freightPrice: freightPrice,
          paymentPrice: salesPrice
        })
      }
    })
  },
  //计算运费
  countFreight(orderConfirm, freightTemplat, quantity){
    let freightMap = new Map(this.data.freightMap)
    let freightMapValue = 0
    if(freightMap.has(freightTemplat.id)){
      freightMapValue = freightMap.get(freightTemplat.id)
    }
    quantity = quantity + freightMapValue
    freightMap.set(freightTemplat.id,quantity)
    this.setData({
      freightMap: freightMap
    })
    let firstNum = freightTemplat.firstNum
    let firstFreight = freightTemplat.firstFreight
    let continueNum = freightTemplat.continueNum
    let continueFreight = freightTemplat.continueFreight
    if (quantity <= firstNum) {//首件之内数量
      orderConfirm.freightPrice = firstFreight
      if(freightMapValue > 0){//同一运费模板已有商品算了运算，并在首件之内，当前商品不算运费
        orderConfirm.freightPrice = 0
      }
    } else {//首件之外数量
      let num = quantity - firstNum
      orderConfirm.freightPrice = (Number(firstFreight) + Math.ceil(num / continueNum) * continueFreight).toFixed(2)
      if(freightMapValue > 0){//同一运费模板已有商品算了运算，并超过了首件数量，当前商品只算超出运费
        if(freightMapValue >= firstNum){
					num = quantity - freightMapValue - (freightMapValue - firstNum) % continueNum
				}else{
					num = quantity - freightMapValue - (firstNum - freightMapValue)
				}
        orderConfirm.freightPrice = (Math.ceil(num / continueNum) * continueFreight).toFixed(2)
      }
    }
  },
  //获取默认收货地址
  userAddressPage() {
    app.api.userAddressPage(
      {
        searchCount: false,
        current: 1,
        size: 1,
        isDefault: '1'
      })
      .then(res => {
        let records = res.data.records
        if (records && records.length > 0) {
          this.setData({
            userAddress: records[0]
          })
        }
      })
  },
  userMessageInput(e) {
    this.setData({
      [`orderSubParm.userMessage`]: e.detail.value
    })
  },
  //提交订单
  orderSub() {
    let that = this
    let userAddress = that.data.userAddress
    if (that.data.orderSubParm.deliveryWay == '1' && userAddress == null) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    that.setData({
      loading: true
    })
    let orderSubParm = that.data.orderSubParm
    let orderConfirmData = that.data.orderConfirmData
    orderSubParm.skus = orderConfirmData
    orderSubParm.orderType = orderConfirmData[0].orderType
    orderSubParm.marketId = orderConfirmData[0].marketId
    orderSubParm.relationId = orderConfirmData[0].relationId
    app.api.orderSub(Object.assign(
      {},
      { userAddressId: that.data.orderSubParm.deliveryWay == '1' ? userAddress.id : null },
      orderSubParm
    ))
      .then(res => {
        that.wxTemplateMsgList(res.data.id)
      }).catch(() => {
        that.setData({
          loading: false
        })
      })
  }
})