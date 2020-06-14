
const util = require('../../../utils/util.js')
const app = getApp()

Page({
  data: {
    projectList:[
      {name:'全部',code:'01'},
      { name: '远洋悦·光年', code: '02' },
      { name: '远洋·未来城', code: '03' },
      { name: '远洋·简宫', code: '04' },
      { name: '远洋·万和四季', code: '05' },
      { name: '远洋·鲲栖符', code: '06' },
      {name:'远洋·天著春秋',code:'07'},
      {name:'更多',code:'08'},
    ],
    clickCode:'01',
    projectInfo:[
      { time: '2020-05-27', title: '远洋未来城项目信息', progress: ['B5#一层墙柱模板安排','C1#地下室顶层钢筋完成80%']},
      { time: '2020-05-27', title: '远洋悦·光年项目信息', progress: ['C1#一段一层墙柱墙柱钢筋绑扎', 'C2#二段一层钢筋绑扎']},
      { time: '2020-05-27', title: '远洋·万和司机项目信息', progress: ['A5#地下室顶板模板安装', 'A3#地下室钢筋绑扎30%']},
      { time: '2020-05-27', title: '远洋·光年项目信息', progress: ['C2#一段一层墙柱墙柱钢筋绑扎', 'C2#一段一层钢筋绑扎']},
      { time: '2020-05-27', title: '远洋·光年项目信息', progress: ['C2#一段一层墙柱墙柱钢筋绑扎', 'C2#一段一层钢筋绑扎']},
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
  onLoad(options) {
    let title = options.title ? decodeURI(options.title) : '默认'
    this.setData({
      title: title
    })
    if (options.categorySecond){
      this.setData({
        ['parameter.categorySecond']: options.categorySecond
      })
    }
    if (options.name) {
      this.setData({
        ['parameter.name']: options.name
      })
    }
    if (options.type) {
      if (options.type == '1'){
        this.setData({
          title: '新品首发',
          ['page.descs']: 'create_time'
        })
      }
      if (options.type == '2') {
        this.setData({
          title: '热销单品',
          ['page.descs']: 'sale_num'
        })
      }
    }
    if (options.couponUserId) {
      this.setData({
        ['parameter.couponUserId']: options.couponUserId
      })
    }
    app.initPage()
      .then(res => {
        this.goodsPage()
      })
  },
  goodsPage() {
    app.api.goodsPage(Object.assign(
      {},
      this.data.page,
      util.filterForm(this.data.parameter)
    ))
      .then(res => {
        let goodsList = res.data.records
        this.setData({
          goodsList: [...this.data.goodsList, ...goodsList]
        })
        if (goodsList.length < this.data.page.size) {
          this.setData({
            loadmore: false
          })
        }
      })
  },
  viewTypeEdit(){
    this.setData({
      viewType: !this.data.viewType
    })
  },
  onReachBottom() {
    if (this.data.loadmore) {
      this.setData({
        ['page.current']: this.data.page.current + 1
      })
      this.goodsPage()
    }
  },
  sortHandle(e){
    let type = e.target.dataset.type
    switch (type) {
      case 'price':
        if (this.data.price == ''){
          this.setData({
            price: 'asc',
            ['page.descs']: '',
            ['page.ascs']: 'price_down'
          })
        } else if (this.data.price == 'asc'){
          this.setData({
            price: 'desc',
            ['page.descs']: 'price_down',
            ['page.ascs']: ''
          })
        } else if (this.data.price == 'desc'){
          this.setData({
            price: '',
            ['page.ascs']: '',
            ['page.descs']: ''
          })
        }
        this.setData({
          sales: '',
          createTime: ''
        })
        break
      case 'sales':
        if (this.data.sales == ''){
          this.setData({
            sales: 'desc',
            ['page.descs']: 'sale_num',
            ['page.ascs']: ''
          })
        }else if (this.data.sales == 'desc'){
          this.setData({
            sales: 'asc',
            ['page.descs']: '',
            ['page.ascs']: 'sale_num'
          })
        }else if (this.data.sales == 'asc'){
          this.setData({
            sales: '',
            ['page.ascs']: '',
            ['page.descs']: ''
          })
        }
        this.setData({
          price: '',
          createTime: ''
        })
        break
      case 'createTime':
        if (this.data.createTime == ''){
          this.setData({
            createTime: 'desc',
            ['page.descs']: 'create_time',
            ['page.ascs']: ''
          })
        }else if (this.data.createTime == 'desc'){
          this.setData({
            createTime: '',
            ['page.ascs']: '',
            ['page.descs']: ''
          })
        }
        this.setData({
          price: '',
          sales: ''
        })
        break
    }
    this.relod()
  },
  relod(){
    this.setData({
      loadmore: true,
      goodsList: [],
      ['page.current']: 1
    })
    this.goodsPage()
  },
  clickStyle(item){
    console.log(item.currentTarget.dataset.index.code)
    var code = item.currentTarget.dataset.index.code
    this.setData({
      clickCode: code
    })
    
  }
})
