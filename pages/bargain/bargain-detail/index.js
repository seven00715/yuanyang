
const WxParse = require('../../../public/wxParse/wxParse.js')
const util = require('../../../utils/util.js')
import Poster from '../../../components/wxa-plugin-canvas/poster/poster'
const { base64src } = require('../../../utils/base64src.js')
const app = getApp()

Page({
  data: {
    bargainInfo: null,
    disabled: false,
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {},
    loadmore: true,
    bargainCutList: [],
    shareShow: '',
    wxUser: null,
    modalRule: ''
  },
  onLoad(options) {
    let id
    let bargainUserId
    if (options.scene) {//接受二维码中参数
      bargainUserId = decodeURIComponent(options.scene)
    } else if (options.bargainUserId) {//分享
      bargainUserId = options.bargainUserId
    } else {
      id = options.id
    }
    app.initPage()
      .then(res => {
        this.setData({
          wxUser: app.globalData.wxUser
        })
        if (bargainUserId){
          app.api.bargainUserGet(bargainUserId)
            .then(res => {
              let bargainUser = res.data
              let id = bargainUser.bargainId
              this.setData({
                id: id
              })
              this.bargainInfoGet({
                bargainId: this.data.id,
                id: bargainUser.id
              })
            })
        }else{
          this.setData({
            id: id
          })
          this.bargainInfoGet({
            bargainId: id
          })
        }
      })
  },
  onShareAppMessage: function () {
    let bargainInfo = this.data.bargainInfo
    let title = bargainInfo.shareTitle
    let imageUrl = bargainInfo.picUrl
    let path = ''
    if (bargainInfo.bargainUser){
      path = 'pages/bargain/bargain-detail/index?bargainUserId=' + bargainInfo.bargainUser.id
    }else{
      path = 'pages/bargain/bargain-detail/index?id=' + bargainInfo.id
    }
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
  //查询砍价信息
  bargainInfoGet(data) {
    app.api.bargainInfoGet(data)
      .then(res => {
        let bargainInfo = res.data
        let goodsSku = bargainInfo.goodsSku
        let specInfo = ''
        goodsSku.specs.forEach(function (specItem, index) {
          specInfo = specInfo + specItem.specValueName
          if (goodsSku.specs.length != index + 1) {
            specInfo = specInfo + ';'
          }
        })
        if (!this.data.bargainInfo) {
          //html转wxml
          WxParse.wxParse('description', 'html', bargainInfo.goodsSpu.description, this, 0)
        }
        this.setData({
          bargainInfo: bargainInfo,
          specInfo: specInfo
        })
        if (bargainInfo.bargainUser){
          let canCutPrice = bargainInfo.goodsSku.salesPrice - bargainInfo.bargainPrice//可砍
          let havCutPrice = bargainInfo.bargainUser.havBargainAmount//已砍
          let cutPercent = Number((havCutPrice / canCutPrice) * 100).toFixed(2)+'%'
          this.setData({
            bargainInfo: bargainInfo,
            ['parameter.bargainUserId']: bargainInfo.bargainUser.id,
            cutPercent: cutPercent,
            canCutPrice: canCutPrice,
            havCutPrice: havCutPrice,
            bargainCutList: []
          })
          this.bargainCutPage()
        }
      })
  },
  //帮砍记录列表
  bargainCutPage(){
    app.api.bargainCutPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let bargainCutList = res.data.records
        this.setData({
          bargainCutList: [...this.data.bargainCutList, ...bargainCutList]
        })
        if (bargainCutList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  //发起砍价
  bargainUserSave(){
    this.setData({
      disabled: true
    })
    app.api.bargainUserSave({
      bargainId: this.data.bargainInfo.id
    })
      .then(res => {
        this.bargainInfoGet({
          bargainId: this.data.id
        })
      })
  },
  loadMore(){
    this.setData({
      ['page.current']: this.data.page.current + 1
    })
    this.bargainCutPage()
  },
  shareShow() {
    this.setData({
      shareShow: 'show'
    })
  },
  shareHide() {
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
  hidePosterShow() {
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
      page: 'pages/bargain/bargain-detail/index',
      scene: this.data.bargainInfo.bargainUser.id
    })
      .then(res => {
        let base64 = res.data
        base64src(base64, res => {
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
                text: this.data.bargainInfo.shareTitle,
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 92,
                y: 810,
                fontSize: 38,
                baseLine: 'middle',
                text: this.data.bargainInfo.goodsSpu.name,
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
                    text: '底价',
                    fontSize: 28,
                    color: '#ec1731',
                  },
                  {
                    text: '¥' + this.data.bargainInfo.bargainPrice,
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
                text: '原价 ¥' + this.data.bargainInfo.goodsSku.salesPrice,
                fontSize: 28,
                color: '#929292',
              },
              {
                x: 59,
                y: 945,
                baseLine: 'middle',
                text: [
                  {
                    text: this.data.bargainInfo.goodsSpu.sellPoint,
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
                text: '快来帮好友砍一刀',
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
                url: this.data.bargainInfo.picUrl,
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
          if (wxUser && wxUser.headimgUrl) {//如果有头像则显示
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
  //砍一刀
  bargainCutSave(){
    this.setData({
      disabled: true
    })
    let bargainUserId = this.data.bargainInfo.bargainUser.id
    app.api.bargainCutSave({
      bargainUserId: bargainUserId
    })
      .then(res => {
        let bargainCut = res.data
        let that = this
        wx.showModal({
          content: '恭喜为好友砍下' + bargainCut.cutPrice.toFixed(2) +'元',
          confirmColor: '#ff0000',
          success(res) {
            that.bargainInfoGet({
              bargainId: that.data.id,
              id: bargainUserId
            })
          }
        })
      })
  },
  ruleShow(){
    this.setData({
      modalRule: 'show'
    })
  },
  ruleHide(){
    this.setData({
      modalRule: ''
    })
  },
  //前去购买
  toBuy(){
    let bargainInfo = this.data.bargainInfo
    let bargainUser = bargainInfo.bargainUser
    let goodsSpu = bargainInfo.goodsSpu
    let goodsSku = bargainInfo.goodsSku
    /* 把参数信息异步存储到缓存当中 */
    wx.setStorage({
      key: 'param-orderConfirm',
      data: [{
        spuId: goodsSpu.id,
        skuId: goodsSku.id,
        quantity: 1,
        salesPrice: (goodsSku.salesPrice - this.data.havCutPrice).toFixed(2),
        spuName: goodsSpu.name,
        specInfo: this.data.specInfo,
        picUrl: goodsSku.picUrl ? goodsSku.picUrl : goodsSpu.picUrls[0],
        freightTemplat: goodsSpu.freightTemplat,
        weight: goodsSku.weight,
        volume: goodsSku.volume,
        orderType: '1',
        marketId: bargainInfo.id,
        relationId: bargainUser.id
      }]
    })
    wx.navigateTo({
      url: '/pages/bargain/bargain-order-confirm/index'
    })
  },
  countDownDone() {
    this.onLoad()
  }
})
