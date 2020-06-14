
const WxParse = require('../../../public/wxParse/wxParse.js')
const util = require('../../../utils/util.js')
import Poster from '../../../components/wxa-plugin-canvas/poster/poster'
const { base64src } = require('../../../utils/base64src.js')
const app = getApp()

Page({
  data: {
    page: {
      searchCount: false,
      current: 1,
      size: 100,
      ascs: '',//升序字段
      descs: 'create_time'
    },
    parameter: {},
    grouponUser: null,
    grouponUserList: [],
    grouponInfo: null,
    shareShow: '',
    wxUser: null,
    modalRule: ''
  },
  onShow() {
    app.initPage()
      .then(res => {
        this.setData({
          grouponUserList: []
        })
        this.grouponUserGet()
        this.grouponUserPage()
      })
  },
  onLoad(options) {
    let id
    if (options.scene) {//接受二维码中参数
      id = decodeURIComponent(options.scene)
    } else {
      id = options.id
    }
    this.setData({
      id: id,
      wxUser: app.globalData.wxUser
    })
  },
 
  onShareAppMessage: function () {
    let grouponInfo = this.data.grouponInfo
    let title = grouponInfo.shareTitle
    let imageUrl = grouponInfo.picUrl
    let path = ''
    path = 'pages/groupon/groupon-user-detail/index?id=' + this.data.grouponUser.id
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

  //查询拼团记录信息
  grouponUserGet() {
    app.api.grouponUserGet(this.data.id)
      .then(res => {
        let grouponUser = res.data
        let grouponInfo = grouponUser.grouponInfo
        let goodsSku = grouponInfo.goodsSku
        let specInfo = ''
        goodsSku.specs.forEach(function (specItem, index) {
          specInfo = specInfo + specItem.specValueName
          if (goodsSku.specs.length != index + 1) {
            specInfo = specInfo + ';'
          }
        })
        if (!this.data.grouponInfo){
          //html转wxml
          WxParse.wxParse('description', 'html', grouponInfo.goodsSpu.description, this, 0)
        }
        this.setData({
          grouponUser: grouponUser,
          grouponInfo: grouponInfo,
          specInfo: specInfo
        })
      })
  },
  grouponUserPage() {
    app.api.grouponUserPage(Object.assign(
      {
        groupId: this.data.id
      },
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let grouponUserList = res.data.records
        this.setData({
          grouponUserList: [...this.data.grouponUserList, ...grouponUserList]
        })
        if (grouponUserList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  //参与拼团
  toGroupon(e){
    let grouponInfo = this.data.grouponInfo
    let goodsSpu = grouponInfo.goodsSpu
    let goodsSku = grouponInfo.goodsSku
    if (goodsSku.stock > 0){
      /* 把参数信息异步存储到缓存当中 */
      wx.setStorage({
        key: 'param-orderConfirm',
        data: [{
          spuId: goodsSpu.id,
          skuId: goodsSku.id,
          quantity: 1,
          salesPrice: grouponInfo.grouponPrice,
          spuName: goodsSpu.name,
          specInfo: this.data.specInfo,
          picUrl: goodsSku.picUrl ? goodsSku.picUrl : goodsSpu.picUrls[0],
          freightTemplat: goodsSpu.freightTemplat,
          weight: goodsSku.weight,
          volume: goodsSku.volume,
          orderType: '2',
          marketId: grouponInfo.id,
          relationId: this.data.grouponUser.id
        }]
      })
      wx.navigateTo({
        url: '/pages/groupon/groupon-order-confirm/index'
      })
    }else{
      wx.showToast({
        title: '拼团商品库存不足',
        icon: 'none',
        duration: 2000
      })
    }
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
      page: 'pages/groupon/groupon-user-detail/index',
      scene: this.data.grouponUser.id
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
                text: this.data.grouponInfo.shareTitle,
                fontSize: 38,
                color: '#080808',
              },
              {
                x: 92,
                y: 810,
                fontSize: 38,
                baseLine: 'middle',
                text: this.data.grouponInfo.goodsSpu.name,
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
                    text: '拼团价',
                    fontSize: 28,
                    color: '#ec1731',
                  },
                  {
                    text: '¥' + this.data.grouponInfo.grouponPrice,
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
                text: '原价 ¥' + this.data.grouponInfo.goodsSku.salesPrice,
                fontSize: 28,
                color: '#929292',
              },
              {
                x: 59,
                y: 945,
                baseLine: 'middle',
                text: [
                  {
                    text: this.data.grouponInfo.goodsSpu.sellPoint,
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
                text: '快来和我一起拼一单吧！',
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
                url: this.data.grouponInfo.picUrl,
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
  countDownDone() {
    this.onLoad()
  }
})
