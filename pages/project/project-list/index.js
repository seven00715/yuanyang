
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    projectList: [],
    clickCode: '',
    projectInfo: [
      { createTime: '2020年05月27日', title: '远洋未来城项目信息', abstractText: ['B5#一层墙柱模板安排', 'C1#地下室顶层钢筋完成80%'] },
      { createTime: '2020-05-27', title: '远洋悦·光年项目信息', abstractText: ['C1#一段一层墙柱墙柱钢筋绑扎', 'C2#二段一层钢筋绑扎'] },
      { createTime: '2020-05-27', title: '远洋·万和司机项目信息', abstractText: ['A5#地下室顶板模板安装', 'A3#地下室钢筋绑扎30%'] },
      { createTime: '2020-05-27', title: '远洋·光年项目信息', abstractText: ['C2#一段一层墙柱墙柱钢筋绑扎', 'C2#一段一层钢筋绑扎'] },
      { createTime: '2020-05-27', title: '远洋·光年项目信息', abstractText: ['C2#一段一层墙柱墙柱钢筋绑扎', 'C2#一段一层钢筋绑扎'] },
    ],
    page: {
      searchCount: false,
      current: 1,
      size: 10,
      ascs: '',//升序字段
      descs: ''
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

  // onLoad(options) {
  //   let title = options.title ? decodeURI(options.title) : '默认'
  //   this.setData({
  //     title: title
  //   })
  //   if (options.categorySecond){
  //     this.setData({
  //       ['parameter.categorySecond']: options.categorySecond
  //     })
  //   }
  //   if (options.name) {
  //     this.setData({
  //       ['parameter.name']: options.name
  //     })
  //   }
  //   if (options.type) {
  //     if (options.type == '1'){
  //       this.setData({
  //         title: '新品首发',
  //         ['page.descs']: 'create_time'
  //       })
  //     }
  //     if (options.type == '2') {
  //       this.setData({
  //         title: '热销单品',
  //         ['page.descs']: 'sale_num'
  //       })
  //     }
  //   }
  //   if (options.couponUserId) {
  //     this.setData({
  //       ['parameter.couponUserId']: options.couponUserId
  //     })
  //   }
  //   app.initPage()
  //     .then(res => {
  //       this.goodsPage()
  //     })
  // },
  // goodsPage() {
  //   app.api.goodsPage(Object.assign(
  //     {},
  //     this.data.page,
  //     util.filterForm(this.data.parameter)
  //   ))
  //     .then(res => {
  //       let goodsList = res.data.records
  //       this.setData({
  //         goodsList: [...this.data.goodsList, ...goodsList]
  //       })
  //       if (goodsList.length < this.data.page.size) {
  //         this.setData({
  //           loadmore: false
  //         })
  //       }
  //     })
  // },
  // viewTypeEdit(){
  //   this.setData({
  //     viewType: !this.data.viewType
  //   })
  // },
  // onReachBottom() {
  //   if (this.data.loadmore) {
  //     this.setData({
  //       ['page.current']: this.data.page.current + 1
  //     })
  //     this.goodsPage()
  //   }
  // },
  // sortHandle(e){
  //   let type = e.target.dataset.type
  //   switch (type) {
  //     case 'price':
  //       if (this.data.price == ''){
  //         this.setData({
  //           price: 'asc',
  //           ['page.descs']: '',
  //           ['page.ascs']: 'price_down'
  //         })
  //       } else if (this.data.price == 'asc'){
  //         this.setData({
  //           price: 'desc',
  //           ['page.descs']: 'price_down',
  //           ['page.ascs']: ''
  //         })
  //       } else if (this.data.price == 'desc'){
  //         this.setData({
  //           price: '',
  //           ['page.ascs']: '',
  //           ['page.descs']: ''
  //         })
  //       }
  //       this.setData({
  //         sales: '',
  //         createTime: ''
  //       })
  //       break
  //     case 'sales':
  //       if (this.data.sales == ''){
  //         this.setData({
  //           sales: 'desc',
  //           ['page.descs']: 'sale_num',
  //           ['page.ascs']: ''
  //         })
  //       }else if (this.data.sales == 'desc'){
  //         this.setData({
  //           sales: 'asc',
  //           ['page.descs']: '',
  //           ['page.ascs']: 'sale_num'
  //         })
  //       }else if (this.data.sales == 'asc'){
  //         this.setData({
  //           sales: '',
  //           ['page.ascs']: '',
  //           ['page.descs']: ''
  //         })
  //       }
  //       this.setData({
  //         price: '',
  //         createTime: ''
  //       })
  //       break
  //     case 'createTime':
  //       if (this.data.createTime == ''){
  //         this.setData({
  //           createTime: 'desc',
  //           ['page.descs']: 'create_time',
  //           ['page.ascs']: ''
  //         })
  //       }else if (this.data.createTime == 'desc'){
  //         this.setData({
  //           createTime: '',
  //           ['page.ascs']: '',
  //           ['page.descs']: ''
  //         })
  //       }
  //       this.setData({
  //         price: '',
  //         sales: ''
  //       })
  //       break
  //   }
  //   this.relod()
  // },
  // relod(){
  //   this.setData({
  //     loadmore: true,
  //     goodsList: [],
  //     ['page.current']: 1
  //   })
  //   this.goodsPage()
  // },
  onLoad() {
    this.fetchNewsList()
    this.fetchNewsTypes()
  },
  clickStyle(item) {
    console.log(item.currentTarget.dataset.index.id)
    var code = item.currentTarget.dataset.index.id
    this.setData({
      clickCode: code
    })
    this.fetchNewsList(code)
  },
  // 获取工程进度数据
  async fetchNewsList(code) {
    let projectInfo = []
    if (code) {
      let { data: { records } } = await app.api.fetchNewsList({ type: 2, id: code })
      projectInfo = records
    } else {
      let { data: { records } } = await app.api.fetchNewsList({ type: 2 })
      projectInfo = records
    }

    // console.log(records)
    projectInfo.forEach((item) => {
      item.abstractText = item.abstractText.split()
      // console.log(item)
    })
    console.log(projectInfo)
    this.setData({
      projectInfo: projectInfo
    })
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
