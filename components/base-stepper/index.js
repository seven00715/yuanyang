
Component({
  properties: {
    max: {
      type: Number,
      value: 0
    },
    min: {
      type: Number,
      value: 0
    },
    stNum: {
      type: Number,
      value: 0
    },
    customClass:{
      type: String,
      value: ''
    }
  },
  data: {

  },
  methods: {
    stNumMinus() {
      this.setData({
        stNum: this.data.stNum - 1
      })
      this.triggerEvent('numChange', this.data.stNum)
    },
    stNumAdd() {
      this.setData({
        stNum: this.data.stNum + 1
      })
      this.triggerEvent('numChange', this.data.stNum)
    },
    numChange(e){
      this.triggerEvent('numChange', val)
    }
  }
})