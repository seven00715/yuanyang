import __config from '../config/env'

const request = (url, method, data, showLoading) => {
  let _url = __config.basePath + url
  return new Promise((resolve, reject) => {
    if (showLoading) {
      wx.showLoading({
        title: '加载中',
      })
    }
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'app-id': wx.getAccountInfoSync().miniProgram.appId,
        'third-session': getApp().globalData.thirdSession != null ? getApp().globalData.thirdSession : ''
      },
      success(res) {
        if (res.statusCode == 200) {
          if (res.data.code != 0) {
            console.log(res.data)
            wx.showModal({
              title: '提示',
              content: res.data.msg + '',
              success() {

              },
              complete() {
                if (res.data.code == 60001) {
                  //session过期，则清除过期session，并重新加载当前页
                  getApp().globalData.thirdSession = null
                  wx.reLaunch({
                    url: getApp().getCurrentPageUrlWithArgs()
                  })
                }
              }
            })
            reject(res.data.msg)
          }
          resolve(res.data)
        } else if (res.statusCode == 404) {
          wx.showModal({
            title: '提示',
            content: '接口请求出错，请检查手机网络',
            success(res) {

            }
          })
          reject()
        } else {
          console.log(res)
          wx.showModal({
            title: '提示',
            content: res.errMsg + ':' + res.data.message + ':' + res.data.msg,
            success(res) {

            }
          })
          reject()
        }
      },
      fail(error) {
        console.log(error)
        wx.showModal({
          title: '提示',
          content: '接口请求出错：' + error.errMsg,
          success(res) {

          }
        })
        reject(error)
      },
      complete(res) {
        wx.hideLoading()
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 * todo 修改了finally为finally1以后可以改回来 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally1 = function(callback) {
  var Promise = this.constructor;
  return this.then(
    function(value) {
      Promise.resolve(callback()).then(
        function() {
          return value;
        }
      );
    },
    function(reason) {
      Promise.resolve(callback()).then(
        function() {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  LiveRoomList: 'https://aj7t40tldsyi.firefac.cn/openapi/' + 'live/list', //直播房间列表
  LiveRoomStatusUpdate: 'https://aj7t40tldsyi.firefac.cn/openapi/' + 'live/status/update', //直播房间列表
  request,
  login: (data) => { //小程序登录接口
    return request('/weixin/api/ma/wxuser/login', 'post', data, false)
  },
  wxUserGet: (data) => { //微信用户查询
    return request('/mall/api/ma/wxuser', 'get', null, false)
  },
  wxUserSave: (data) => { //微信用户新增
    return request('/mall/api/ma/wxuser', 'post', data, true)
  },
  goodsCategoryGet: (data) => { //商品分类查询
    return request('/mall/api/ma/goodscategory/tree', 'get', data, true)
  },
  //---------------
  // 立即报名
  signActive: (data) => { // type
    return request('/mall/api/ma/yyactivity/signUp', 'post', data, false)
  },
  // 邀请
  inviteJoin: (data) => {
    return request(`/api/ma/yyactivity/getInviteDetail`, 'get', data, false)
  },
  fetchTypeList: (data) => { // type
    return request('/mall/api/ma/yyproject/page', 'get', data, false)
  },
  fetchAcList: (data) => { //活动列表
    return request('/mall/api//ma/yyactivity/page', 'get', data, false)
  },
  fetchAcDetail: (id, data) => { //活动详情
    return request(`/mall/api//ma/yyactivity/detail/${id}`, 'get', data, false)
  },
  fetchNewsList: (data) => { // 0:资讯，1:交付展示，2:工程进度
    return request('/mall/api/ma/yyfreshnews/page', 'get', data, false)
  },
  fetchLiveList: (data) => { // 直播列表
    return request('/mall/api/ma/yylivebroadcast/page', 'get', data, false)
  },
  fetchNewsTypes: (id) => { // 工程进度类目(id)
    return request('/mall/api/ma/yyproject/' + id, 'get', false)
  },
  goodsPage: (data) => { //商品列表
    return request('/mall/api/ma/goodsspu/page', 'get', data, false)
  },
  goodsGet: (id) => { //商品查询
    return request('/mall/api/ma/goodsspu/' + id, 'get', null, false)
  },
  goodsSpecGet: (data) => { //商品规格查询
    return request('/mall/api/ma/goodsspuspec/tree', 'get', data, true)
  },
  shoppingCartPage: (data) => { //购物车列表
    return request('/mall/api/ma/shoppingcart/page', 'get', data, false)
  },
  shoppingCartAdd: (data) => { //购物车新增
    return request('/mall/api/ma/shoppingcart', 'post', data, true)
  },
  shoppingCartEdit: (data) => { //购物车修改
    return request('/mall/api/ma/shoppingcart', 'put', data, true)
  },
  shoppingCartDel: (data) => { //购物车删除
    return request('/mall/api/ma/shoppingcart/del', 'post', data, false)
  },
  shoppingCartCount: (data) => { //购物车数量
    return request('/mall/api/ma/shoppingcart/count', 'get', data, false)
  },
  orderSub: (data) => { //订单提交
    return request('/mall/api/ma/orderinfo', 'post', data, true)
  },
  orderPage: (data) => { //订单列表
    return request('/mall/api/ma/orderinfo/page', 'get', data, false)
  },
  orderGet: (id) => { //订单详情查询
    return request('/mall/api/ma/orderinfo/' + id, 'get', null, false)
  },
  orderCancel: (id) => { //订单确认取消
    return request('/mall/api/ma/orderinfo/cancel/' + id, 'put', null, true)
  },
  orderReceive: (id) => { //订单确认收货
    return request('/mall/api/ma/orderinfo/receive/' + id, 'put', null, true)
  },
  orderDel: (id) => { //订单删除
    return request('/mall/api/ma/orderinfo/' + id, 'delete', null, false)
  },
  orderCountAll: (data) => { //订单计数
    return request('/mall/api/ma/orderinfo/countAll', 'get', data, false)
  },
  orderLogisticsGet: (logisticsId) => { //订单物流查询
    return request('/mall/api/ma/orderinfo/orderlogistics/' + logisticsId, 'get', null, false)
  },
  unifiedOrder: (data) => { //下单接口
    return request('/mall/api/ma/orderinfo/unifiedOrder', 'post', data, true)
  },
  userAddressPage: (data) => { //用户收货地址列表
    return request('/mall/api/ma/useraddress/page', 'get', data, false)
  },
  userAddressSave: (data) => { //用户收货地址新增
    return request('/mall/api/ma/useraddress', 'post', data, true)
  },
  userAddressDel: (id) => { //用户收货地址删除
    return request('/mall/api/ma/useraddress/' + id, 'delete', null, false)
  },
  userCollectAdd: (data) => { //用户收藏新增
    return request('/mall/api/ma/usercollect', 'post', data, true)
  },
  userCollectDel: (id) => { //用户收藏删除
    return request('/mall/api/ma/usercollect/' + id, 'delete', null, false)
  },
  userCollectPage: (data) => { //用户收藏列表
    return request('/mall/api/ma/usercollect/page', 'get', data, false)
  },
  goodsAppraisesAdd: (data) => { //商品评价新增
    return request('/mall/api/ma/goodsappraises', 'post', data, true)
  },
  goodsAppraisesPage: (data) => { //商品评价列表
    return request('/mall/api/ma/goodsappraises/page', 'get', data, false)
  },
  qrCodeUnlimited: (data) => { //获取小程序二维码
    return request('/weixin/api/ma/wxqrcode/unlimited', 'post', data, true)
  },
  noticeGet: (data) => { //查询商城通知
    return request('/mall/api/ma/notice', 'get', data, true)
  },
  orderItemGet: (id) => { //查询订单详情
    return request('/mall/api/ma/orderitem/' + id, 'get', null, false)
  },
  orderRefundsSave: (data) => { //发起退款
    return request('/mall/api/ma/orderrefunds', 'post', data, true)
  },
  userInfoGet: () => { //查询商城用户信息
    return request('/mall/api/ma/userinfo', 'get', null, false)
  },
  pointsRecordPage: (data) => { //查询积分记录
    return request('/mall/api/ma/pointsrecord/page', 'get', data, false)
  },
  pointsConfigGet: () => { //查询积分配置
    return request('/mall/api/ma/pointsconfig', 'get', null, false)
  },
  couponUserSave: (data) => { //电子券用户领取
    return request('/mall/api/ma/couponuser', 'post', data, true)
  },
  couponUserPage: (data) => { //电子券用户列表
    return request('/mall/api/ma/couponuser/page', 'get', data, false)
  },
  couponInfoPage: (data) => { //电子券列表
    return request('/mall/api/ma/couponinfo/page', 'get', data, false)
  },
  bargainInfoPage: (data) => { //砍价列表
    return request('/mall/api/ma/bargaininfo/page', 'get', data, false)
  },
  bargainInfoGet: (data) => { //砍价详情
    return request('/mall/api/ma/bargaininfo', 'get', data, true)
  },
  bargainUserSave: (data) => { //发起砍价
    return request('/mall/api/ma/bargainuser', 'post', data, true)
  },
  bargainCutPage: (data) => { //帮砍记录
    return request('/mall/api/ma/bargaincut/page', 'get', data, true)
  },
  bargainUserGet: (id) => { //砍价记录详情
    return request('/mall/api/ma/bargainuser/' + id, 'get', null, false)
  },
  bargainUserPage: (data) => { //砍价记录列表
    return request('/mall/api/ma/bargainuser/page', 'get', data, true)
  },
  bargainCutSave: (data) => { //砍一刀
    return request('/mall/api/ma/bargaincut', 'post', data, true)
  },
  listEnsureBySpuId: (data) => { //通过spuID，查询商品保障
    return request('/mall/api/ma/ensuregoods/listEnsureBySpuId', 'get', data, true)
  },
  grouponInfoPage: (data) => { //拼团列表
    return request('/mall/api/ma/grouponinfo/page', 'get', data, false)
  },
  grouponInfoGet: (id) => { //拼团详情
    return request('/mall/api/ma/grouponinfo/' + id, 'get', null, true)
  },
  grouponUserPageGrouponing: (data) => { //拼团中分页列表
    return request('/mall/api/ma/grouponuser/page/grouponing', 'get', data, true)
  },
  grouponUserPage: (data) => { //拼团记录列表
    return request('/mall/api/ma/grouponuser/page', 'get', data, true)
  },
  grouponUserGet: (id) => { //拼团记录详情
    return request('/mall/api/ma/grouponuser/' + id, 'get', null, false)
  },
  wxTemplateMsgList: (data) => { //订阅消息列表
    return request('/weixin/api/ma/wxtemplatemsg/list', 'post', data, false)
  },
  liveRoomInfoList: (data) => { //获取直播房间列表
    return request('/weixin/api/ma/wxmalive/roominfo/list', 'get', data, true)
  },
}