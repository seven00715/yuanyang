
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    roomList: [],
  },
  onLoad(options) {
    app.initPage()
      .then(res => {
        this.liveRoomInfoList()
      })
  },
  liveRoomInfoList() {
    app.api.liveRoomInfoList()
      .then(res => {
        let roomList = res.data
        this.setData({
          roomList: roomList
        })
      })
  }
})
