
const app = getApp()

Component({
  properties: {
    couponInfo: {
      type: Object,
      value: {}
    },
    toUse: {
      type: Boolean,
      value: true
    }
  },
  data: {
    
  },
  methods: {
    couponUserSave(){
      app.api.couponUserSave({
        couponId: this.data.couponInfo.id
      })
        .then(res => {
          wx.showToast({
            title: '领取成功',
            icon: 'success',
            duration: 2000
          })
          let couponInfo = this.data.couponInfo
          couponInfo.couponUser = res.data
          this.setData({
            couponInfo: couponInfo
          })
          this.triggerEvent('receiveCoupon', couponInfo)
        })
    }
  }
})