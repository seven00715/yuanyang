
const WxParse = require('../../../public/wxParse/wxParse.js')
import Poster from '../../../components/wxa-plugin-canvas/poster/poster'
const { base64src } = require('../../../utils/base64src.js')
const app = getApp()

Page({
  data: {
    goodsSpu: null,
    goodsSpecData: [],
    goodsAppraises: [],
    currents: 1,
    modalSku: false,
    modalSkuType: '',
    shoppingCartCount: 0,
    shareShow: '',
    ensureList:[],
    modalService: '',
    modalCoupon: '',
    couponInfoList: []
  },
  onLoad(options) {
    let id
    if (options.scene){//接受二维码中参数
      id = decodeURIComponent(options.scene)
    }else{
      id = options.id
    }
    this.setData({
      id: id
    })
    app.initPage()
      .then(res => {
        this.goodsGet(id)
        this.goodsSpecGet(id)
        this.couponInfoPage(id)
        this.shoppingCartCount()
        this.goodsAppraisesPage()
        this.listEnsureBySpuId(id)
      })
  },
  onShareAppMessage: function () {
    let goodsSpu = this.data.goodsSpu
    let title = goodsSpu.name
    let imageUrl = goodsSpu.picUrls[0]
    let path = 'pages/goods/goods-detail/index?id=' + goodsSpu.id
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
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
  goodsGet(id) {
    app.api.goodsGet(id)
      .then(res => {
        let goodsSpu = res.data
        this.setData({
          goodsSpu: goodsSpu
        })
        //html转wxml
        WxParse.wxParse('description', 'html', goodsSpu.description, this, 0)
      })
  },
  goodsSpecGet(spuId){
    app.api.goodsSpecGet({
      spuId: spuId
    })
      .then(res => {
        let goodsSpecData = res.data
        this.setData({
          goodsSpecData: goodsSpecData
        })
      })
  },
  goodsAppraisesPage() {
    app.api.goodsAppraisesPage({
      current: 1,
      size: 3,
      descs: 'create_time',
      spuId: this.data.id
    })
      .then(res => {
        let goodsAppraises = res.data
        this.setData({
          goodsAppraises: goodsAppraises
        })
      })
  },
  //查询商品可用电子券
  couponInfoPage(spuId) {
    app.api.couponInfoPage({
      current: 1,
      size: 50,
      descs: 'create_time',
      spuId: spuId
    })
      .then(res => {
        let couponInfoList = res.data.records
        this.setData({
          couponInfoList: couponInfoList
        })
      })
  },
  //获取商品保障
  listEnsureBySpuId(spuId){
    app.api.listEnsureBySpuId({
      spuId: spuId
    })
      .then(res => {
        let ensureList = res.data
        this.setData({
          ensureList: ensureList
        })
      })
  },
  change: function (e) {
    this.setData({
      currents: e.detail.current + 1
    })
  },
  showModalService() {
    this.setData({
      modalService: 'show'
    })
  },
  hideModalService() {
    this.setData({
      modalService: ''
    })
  },
  showModalCoupon(){
    this.setData({
      modalCoupon: 'show'
    })
  },
  hideModalCoupon() {
    this.setData({
      modalCoupon: ''
    })
  },
  showModalSku(e) {
    this.setData({
      modalSku: true,
      modalSkuType: e.target.dataset.type ? e.target.dataset.type : ''
    })
  },
  shoppingCartCount(){
    app.api.shoppingCartCount()
      .then(res => {
        let shoppingCartCount = res.data
        this.setData({
          shoppingCartCount: shoppingCartCount
        })
        //设置TabBar购物车数量
        app.globalData.shoppingCartCount = shoppingCartCount + ''
      })
  },
  operateCartEvent(){
    this.shoppingCartCount()
  },
  changeSpec(e) {
    this.setData({
      goodsSpecData: e.detail.goodsSpecData
    })
  },
  //收藏
  userCollect(){
    let goodsSpu = this.data.goodsSpu
    let collectId = goodsSpu.collectId
    if (collectId){
      app.api.userCollectDel(collectId)
        .then(res => {
          wx.showToast({
            title: '已取消收藏',
            icon: 'success',
            duration: 2000
          })
          goodsSpu.collectId = null
          this.setData({
            goodsSpu: goodsSpu
          })
        })
    }else{
      app.api.userCollectAdd({
        type: '1',
        relationIds: [goodsSpu.id]
      })
        .then(res => {
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 2000
          })
          goodsSpu.collectId = res.data[0].id
          this.setData({
            goodsSpu: goodsSpu
          })
        })
    }
  },

  shareShow(){
    this.setData({
      shareShow: 'show'
    })
  },
  shareHide(){
    this.setData({
      shareShow: ''
    })
  },
  onPosterSuccess(e) {
    const { detail } = e
    this.setData({
      posterUrl: detail
    })
  },
  onPosterFail(err) {
    console.error(err);
  },
  hidePosterShow(){
    this.setData({
      posterShow: false,
      shareShow: ''
    })
  },
  /**
   * 异步生成海报
   */
  onCreatePoster() {
    app.api.qrCodeUnlimited({
      page: 'pages/goods/goods-detail/index',
      scene: this.data.goodsSpu.id
    })
      .then(res => {
        let base64 = res.data
        base64src(base64 , res => {
          let qrCode = res
          //海报配置请参考 https://github.com/jasondu/wxa-plugin-canvas
          let posterConfig = {
            width: 750,
            height: 1280,
            backgroundColor: '#fff',
            debug: false,
            blocks: [
              {
                width: 690,
                height: 808,
                x: 30,
                y: 183,
                borderWidth: 2,
                borderColor: '#f0c2a0',
                borderRadius: 20,
              },
              {
                width: 634,
                height: 74,
                x: 59,
                y: 770,
                backgroundColor: '#fff',
                opacity: 0.5,
                zIndex: 100,
              },
            ],
            texts: [
              {
                x: 30,
                y: 113,
                baseLine: 'top',
                text: '发现一个好物，推荐给你呀',
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 92,
                y: 810,
                fontSize: 38,
                baseLine: 'middle',
                text: this.data.goodsSpu.name,
                width: 570,
                lineNum: 1,
                color: '#080808',
                zIndex: 200,
              },
              {
                x: 59,
                y: 895,
                baseLine: 'middle',
                text: [
                  {
                    text: '只需',
                    fontSize: 28,
                    color: '#ec1731',
                  },
                  {
                    text: '¥' + this.data.goodsSpu.priceDown,
                    fontSize: 36,
                    color: '#ec1731',
                    marginLeft: 30,
                  }
                ]
              },
              {
                x: 522,
                y: 895,
                baseLine: 'middle',
                text: '已售' + this.data.goodsSpu.saleNum,
                fontSize: 28,
                color: '#929292',
              },
              {
                x: 59,
                y: 945,
                baseLine: 'middle',
                text: [
                  {
                    text: this.data.goodsSpu.sellPoint,
                    fontSize: 28,
                    color: '#929292',
                    width: 570,
                    lineNum: 1,
                  }
                ]
              },
              {
                x: 360,
                y: 1065,
                baseLine: 'top',
                text: '长按识别小程序码',
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 360,
                y: 1123,
                baseLine: 'top',
                text: '超值好货快来购买',
                fontSize: 28,
                color: '#929292',
              },
            ],
            images: [
              {
                width: 634,
                height: 634,
                x: 59,
                y: 210,
                url: this.data.goodsSpu.picUrls[0],
              },
              {
                width: 220,
                height: 220,
                x: 92,
                y: 1020,
                url: qrCode,
              }
            ]
          }
          let wxUser = app.globalData.wxUser
          if (wxUser && wxUser.headimgUrl){//如果有头像则显示
            posterConfig.images.push({
              width: 62,
              height: 62,
              x: 30,
              y: 30,
              borderRadius: 62,
              url: wxUser.headimgUrl,
            })
            posterConfig.texts.push({
              x: 113,
              y: 61,
              baseLine: 'middle',
              text: wxUser.nickName,
              fontSize: 32,
              color: '#8d8d8d',
            })
          }
          this.setData({
            posterConfig: posterConfig,
            posterShow: true
          }, () => {
            Poster.create(false);    // 入参：true为抹掉重新生成
          })
        })
      })
  },
  //点击保存到相册
  savePoster: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.posterUrl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              /* 该隐藏的隐藏 */
              that.setData({
                shareShow: ''
              })
            }
          }, fail: function (res) {
            console.log(res)
          }
        })
      }
    })
  },
  handleContact(e) {
    console.log(e)
  }
})
