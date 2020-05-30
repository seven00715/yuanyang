
Component({
  properties: {
    value: {
      type: Number,
      value: 0
    },
    size: {
      type: String,
      value: 'xxl'
    }
  },
  data: {

  },
  methods: {
    redeHander(e){
      let value = e.currentTarget.dataset.index + 1
      this.setData({
        value: value
      })
      this.triggerEvent('onChange', value)
    }
  }
})