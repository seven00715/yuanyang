
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    projectList: [],
    clickCode: '',
    projectInfo: [],
    page: {
      current: 1,
      size: 10,
    },
    parameter: {},
    loadmore: true,
    goodsList: [],
    viewType: true,
    price: '',
    sales: '',
    createTime: '',
    title: ''
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.fetchNewsList()
    }
  },
  onLoad() {
    this.fetchNewsList()
    this.fetchNewsTypes()
  },
  clickStyle(item) {
    console.log(item.currentTarget.dataset.index.id)
    var code = item.currentTarget.dataset.index.id
    this.setData({
      clickCode: code,
      projectInfo: []
    })
    this.fetchNewsList(code)
  },
  // 获取工程进度数据
  async fetchNewsList(code) {
    let p = {}
      if(code) {
        p = { type: 2, projectType: code, ...this.data.page }
      } else {
        p = { type: 2, ...this.data.page }
      }
      const res = await app.api.fetchNewsList(p)
      if (res.code === 0) {
        let projectInfo = res.data.records
        projectInfo.forEach((item) => {
          item.abstractText = item.abstractText.split()
        })
        this.setData({
          projectInfo: [...this.data.projectInfo, ...projectInfo]
        })
        if (projectInfo.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      }
  },
  // 获取项目类目
  async fetchNewsTypes() {
    let { data: { records } } = await app.api.fetchTypeList()
    // console.log(records, '------')
    records.unshift({ name: '全部', id: '' })
    this.setData({
      projectList: records
    })
  }
})
