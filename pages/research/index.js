const app = getApp()
Page({
  data: {
    pickerHidden: true,
    chosen: '',
    formData: [],
    mockData: [{
      "option": ["100元", "1000的优惠券"],
      "question": "你想要100还是1个1000的优惠券",
      "question_type": "2"
    }, {
      "option": ["石榴", "猕猴桃", "其他"],
      "question": "给你100块你想买哪些东西",
      "question_type": "3"
    }, {
      "question": "你想对小编说什么",
      "question_type": "1"
    }]
  },

  onLoad: function(options) {
    this.signActive()
  },

  async signActive(id) {
    console.log('signActive activeInfo', this.activeInfo)
    const res = await app.api.research()
    if(res.code === 0){
      this.setData({
        formData : res.data.survey_form
      })
    }
    console.log('res', res)
  },
  onShareAppMessage() {
    return {
      title: 'form',
      path: 'page/component/pages/form/form'
    }
  },

  // 

 

  pickerConfirm(e) {
    this.setData({
      pickerHidden: true
    })
    this.setData({
      chosen: e.detail.value
    })
  },

  pickerCancel() {
    this.setData({
      pickerHidden: true
    })
  },

  pickerShow() {
    this.setData({
      pickerHidden: false
    })
  },

  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})