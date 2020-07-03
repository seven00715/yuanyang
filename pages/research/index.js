const app = getApp()
Page({
  data: {
    pickerHidden: true,
    chosen: '',
    formData: []
  },

  onLoad: function(options) {
    this.signActive()
  },

  async signActive(id) {
    console.log('signActive activeInfo', this.activeInfo)
    const res = await app.api.research()
    if(res.code === 0){
      this.setData({
        formData : res.data.survey_form,
        surveyId: res.data.id
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

  async formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    let value = e.detail.value
    console.log(value)
    for (let key in value){
      console.log(key, value[key])
      this.data.formData.forEach((item,index)=>{
        let data = `formData[${index}].value`
        if (item.question === key){
          console.log(data)
          this.setData({
            [data]:value[key]
          })
        }
      })
    }

    let res = await app.api.saveUserSurvey({ surveyId: this.data.surveyId, answer_form:this.data.formData })
    if(res.code === 0){
      wx.showToast({
        title: '问卷提交成功',
        icon: 'succes',
        mask: true
      })
      wx.navigateBack()
    }
  },

  formReset(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)

    this.setData({
      chosen: ''
    })
  }
})