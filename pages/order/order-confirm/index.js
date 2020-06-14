
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
    userInfo: null,
    pointsConfig: null,
    totalPointsDeduct: 0,
    totalPointsDeductPriceTemp: 0,
    totalPointsDeductPrice: 0,
    modalCoupon: '',
    spuIds: [],
    couponUserList: [],
    couponUser: null,
    totalCouponDeductPrice: 0,
    pointsCheckedValue: null,
    couponCheckedValue: null,
    freightMap: null//各运费模块计数
  },
  onShow() {
    
  },
  onLoad: function () {
    this.userAddressPage()
    this.pointsConfigGet()
    this.userInfoGet()
    this.orderConfirmDo()
    this.couponUserPage()
  },
  //获取订阅消息列表
  wxTemplateMsgList(id){
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
          complete(){
            wx.redirectTo({
              url: '/pages/order/order-detail/index?callPay=true&id=' + id
            })
          }
        })
      })
  },
  deliveryWayChange(e){
    this.setData({
      [`orderSubParm.deliveryWay`]: e.detail.value,
      freightMap: null
    })
    this.orderConfirmDo()
  },
  orderConfirmDo(){
    // 本地获取参数信息
    let that = this
    wx.getStorage({
      key: 'param-orderConfirm',
      success: function (res) {
        let orderConfirmData = res.data
        let salesPrice = 0 //订单金额
        let totalPointsDeduct = 0 //最多可用积分数
        let totalPointsDeductPriceTemp = 0 //最多可用积分数抵扣金额
        let freightPrice = 0 //运费
        let spuIds = null
        orderConfirmData.forEach((orderConfirm, index) => {
          if (spuIds) {
            spuIds = spuIds + ',' + orderConfirm.spuId
          } else {
            spuIds = orderConfirm.spuId
          }
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
          //计算积分抵扣
          if (orderConfirm.pointsDeductSwitch == '1') {
            let pointsDeductPrice = Math.floor(orderConfirm.salesPrice * orderConfirm.pointsDeductScale / 100 * orderConfirm.quantity)
            let pointsDeduct = pointsDeductPrice / orderConfirm.pointsDeductAmount
            orderConfirm.paymentPointsPrice2 = pointsDeductPrice
            orderConfirm.paymentPrice2 = (orderConfirm.salesPrice * orderConfirm.quantity).toFixed(2) - pointsDeductPrice
            if (pointsDeductPrice >= 1) {
              orderConfirm.paymentPoints2 = pointsDeduct
              totalPointsDeductPriceTemp = Number(totalPointsDeductPriceTemp) + Number(pointsDeductPrice)
              totalPointsDeduct = Number(totalPointsDeduct) + Number(pointsDeduct)
            }
          }
        })
        if (that.data.orderSubParm.deliveryWay == '2') {//自提不算运费
          freightPrice = 0
        }
        that.setData({
          orderConfirmData: orderConfirmData,
          salesPrice: salesPrice,
          freightPrice: freightPrice,
          paymentPrice: salesPrice,
          totalPointsDeduct: totalPointsDeduct,
          totalPointsDeductPriceTemp: totalPointsDeductPriceTemp,
          spuIds: spuIds
        })
        if (that.data.pointsCheckedValue){
          that.pointsCheckedChange({
            detail: {
              value: that.data.pointsCheckedValue
            }
          })
        }
        if (that.data.couponCheckedValue) {
          that.couponUserChange({
            detail: {
              value: that.data.couponCheckedValue
            }
          })
        }
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
        if (records && records.length > 0){
          this.setData({
            userAddress: records[0]
          })
        }
      })
  },
  //获取积分设置
  pointsConfigGet() {
    app.api.pointsConfigGet()
      .then(res => {
        this.setData({
          pointsConfig: res.data
        })
      })
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
  userMessageInput(e){
    this.setData({
      [`orderSubParm.userMessage`]: e.detail.value
    })
  },
  //提交订单
  orderSub(){
    let that = this
    let userAddress = that.data.userAddress
    if (that.data.orderSubParm.deliveryWay == '1' && userAddress == null){
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
    orderSubParm.skus = that.data.orderConfirmData
    app.api.orderSub(Object.assign(
      {},
      { userAddressId: that.data.orderSubParm.deliveryWay == '1' ? userAddress.id : null},
      orderSubParm
    ))
      .then(res => {
        that.wxTemplateMsgList(res.data.id)
      }).catch(() => {
        that.setData({
          loading: false
        })
      })
  },
  //选择使用积分
  pointsCheckedChange(e) {
    if (e.detail.value == 'true'){
      let orderConfirmData = this.data.orderConfirmData
      let that = this
      orderConfirmData.forEach(function (orderConfirm) {
        if (orderConfirm.pointsDeductSwitch == '1') {
          orderConfirm.paymentPrice = orderConfirm.paymentPrice2 - that.data.totalCouponDeductPrice
          orderConfirm.paymentPoints = orderConfirm.paymentPoints2
          orderConfirm.paymentPointsPrice = orderConfirm.paymentPointsPrice2
        }
      })
      this.setData({
        pointsCheckedValue: e.detail.value,
        totalPointsDeductPrice: this.data.totalPointsDeductPriceTemp,
        paymentPrice: (Number(this.data.salesPrice) - Number(this.data.totalCouponDeductPrice) - Number(this.data.totalPointsDeductPriceTemp)).toFixed(2),
        orderConfirmData: orderConfirmData
      })
    }else{
      let orderConfirmData = this.data.orderConfirmData
      let that = this
      orderConfirmData.forEach(function (orderConfirm) {
        if (orderConfirm.pointsDeductSwitch == '1') {
          orderConfirm.paymentPrice = (orderConfirm.salesPrice * orderConfirm.quantity - that.data.totalCouponDeductPrice).toFixed(2)
          orderConfirm.paymentPoints = 0
          orderConfirm.paymentPointsPrice = 0
        }
      })
      this.setData({
        pointsCheckedValue: e.detail.value,
        totalPointsDeductPrice: 0,
        paymentPrice: (Number(this.data.salesPrice) - Number(this.data.totalCouponDeductPrice)).toFixed(2),
        orderConfirmData: orderConfirmData
      })
    }
  },
  //查询可用电子券
  couponUserPage() {
    app.api.couponUserPage({
      searchCount: false,
      current: 1,
      size: 50,
      descs: 'create_time',
      spuIds: this.data.spuIds
    })
      .then(res => {
        let couponUserList = res.data.records
        this.setData({
          couponUserList: couponUserList
        })
      })
  },
  showModalCoupon(e) {
    this.setData({
      modalCoupon: 'show'
    })
  },
  hideModalCoupon() {
    this.setData({
      modalCoupon: ''
    })
  },
  //选择电子券
  couponUserChange(e){
    let couponUser = this.data.couponUserList[e.detail.value]
    let orderConfirmData = this.data.orderConfirmData
    //计算优惠金额
    if (couponUser.suitType == '1') {//1、全部商品适用，默认优惠第一个商品
      let orderConfirm = orderConfirmData[0]
      this.setPaymentCouponPrice(orderConfirm, couponUser)
      let temp = "orderConfirmData[0]"
      this.setData({
        [temp]: orderConfirm,
        totalCouponDeductPrice: orderConfirm.paymentCouponPrice
      })
    } else if (couponUser.suitType == '2') {//2、指定商品可用，默认优惠第一个指定商品
      try {
        orderConfirmData.forEach((orderConfirm, index) => {
          if (orderConfirm.spuId == couponUser.goodsSpu.id) {
            this.setPaymentCouponPrice(orderConfirm, couponUser)
            this.setData({
              totalCouponDeductPrice: orderConfirm.paymentCouponPrice
            })
            throw("")
          }
        })
      } catch (e) { }
      this.setData({
        orderConfirmData: orderConfirmData
      })
    }
    this.setData({
      couponCheckedValue: e.detail.value,
      couponUser: couponUser,
      paymentPrice: (Number(this.data.salesPrice) - Number(this.data.totalCouponDeductPrice) - Number(this.data.totalPointsDeductPrice)).toFixed(2)
    })
  },
  setPaymentCouponPrice(orderConfirm, couponUser){
    orderConfirm.couponUserId = couponUser.id
    let salesPrice = orderConfirm.salesPrice * orderConfirm.quantity
    if (couponUser.type == '1') {//代金券
      orderConfirm.paymentPrice = Number(salesPrice - couponUser.reduceAmount - this.data.totalPointsDeductPrice).toFixed(2)
      orderConfirm.paymentCouponPrice = couponUser.reduceAmount
    }
    if (couponUser.type == '2') {//折扣券
      let paymentCouponPrice = Number(salesPrice * (1 - couponUser.discount / 10)).toFixed(2)
      orderConfirm.paymentPrice = Number(salesPrice - paymentCouponPrice - this.data.totalPointsDeductPrice).toFixed(2)
      orderConfirm.paymentCouponPrice = paymentCouponPrice
    }
  }
})