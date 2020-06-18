// pages/my/index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
// components/homelist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 类型id
    typeId: {
      type: Number | String,
      value: 0
    },
    // 是否是首页
    isHome: {
      type: Boolean,
      value: true
    },
    isAuthorize: {
      type: Boolean,
      value: false
    },
    discount: {
      type: Number | String,
      value: 1
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
    topNumber: 0,
    isShow: false, // 是否已加载
    params: {
      pageNum: 0,
      pageSize: 10
    },
    typeList: [], // 二级类别
    list: [], // 类型页商品数据
    total: 20, // 总条数
    home: [], // 首页商品数据
    tabList: [], // 首页悦物
    recommendList: [], // 首页专题推荐
    imgUrls: [], // 类型页轮播图
    homeImgUrls: [], // 首页轮播
    autoplay: true,
    interval: 5000,
    duration: 600,
    current: 0
  },
  observers: {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 置顶
    toTop() {
      let topNumber = 0;
      this.setData({
        topNumber
      })
    },
    // 轮播回调
    homeSwiperChange(e) {
      var that = this;
      if (e.detail.source == 'touch') {
        that.setData({
          current: e.detail.current,
        })
      }
    },

    pageScroll(e) {
      this.triggerEvent('scrollToupper', e)
    },
    // 下拉到底触发
    scrollTolower() {
      if (this.data.isHome) {
        return
      }
      this.getTypeProduct()
    },
    query(bool = false) { // bool true 首页下拉刷新的时候
      if (!bool) {
        if (this.data.isShow) {
          return
        }
      }
      console.log(this.data.typeId, this.data.isShow)
      this.setData({
        isShow: true
      })
      if (this.data.typeId === 0) {
        this.getFeatured()
        this.getFirstList()
        this.getFirstTypeList()
        this.getFeaturedImgDetail()
      } else {
        this.getTypeDetail(this.data.typeId)
        this.getTypeProduct()
      }
      console.log('请求数据')

    },
    // 精选
    getFeatured() {
      if (this.data.list.length > 0 && this.data.total === this.data.list.length) {
        return
      }
      // 精选传值
      let paramsFeatured = {
        isPerfect: 1,
        pageNum: 1,
        pageSize: 20
      }
      app.request({
        method: 'GET',
        url: 'product/page',
        data: paramsFeatured,
        success: (data) => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          this.setData({
            loading: false,
          })
          let dataList = data.list || []
          let list = []
          dataList.forEach((item) => {
            let discount = ''
            // let rate = util.calculator.div(this.data.discount, 10)
            let rate = util.calculator.sub(1, this.data.discount)
            if (item.price) {
              let priceList = item.price.split('-')
              discount = util.calculator.mul(priceList[0], rate) + "-" + util.calculator.mul(priceList[1], rate)
            }
            list.push({
              productId: item.productId,
              smallImage: item.smallImage,
              name: item.name,
              typeSecondName: item.typeSecondName,
              price: item.price,
              sale: item.sale,
              discount: discount
            })
          })
          let total = data.total || 0
          this.setData({
            total,
            list: [...list, ...this.data.list]
          })
        },
        fail: (err) => {
          wx.hideLoading()
          this.setData({
            loading: false
          })
          wx.showToast({
            title: err.message || app.globalData.msgUnknown,
            icon: 'none'
          })
        }
      })
    },

    // 专题推荐下面三个板块
    getFirstTypeList() {
      let params = {
        pageNum: 1,
        pageSize: 20,
        dictCode: 'recommend'
      }
      app.request({
        method: 'GET',
        url: 'dict/page',
        data: params,
        success: (data) => {
          let recommendList = []
          let list = data.list || []
          list.forEach(item => {
            let type = JSON.parse(item.dictValue);
            let typeSecondId = type.typeSecondId
            let typeFirstId = type.typeFirstId
            recommendList.push({
              image: item.dictValueExtra1,
              typeFirstId: typeFirstId,
              typeSecondId: typeSecondId
            })
          })
          this.setData({
            recommendList
          })
        },
        fail: (err) => {
          wx.hideLoading()
          this.setData({
            loading: false
          })
          wx.showToast({
            title: err.message || app.globalData.msgUnknown,
            icon: 'none'
          })
        }
      })
    },
    // 获取一级列表  悦物使用
    getFirstList() {
      let params = {
        hasSecond: false
      }
      app.request({
        method: 'GET',
        url: 'producttype/list',
        data: params,
        success: (data) => {
          wx.hideLoading()
          wx.stopPullDownRefresh()
          this.setData({
            loading: false,
          })
          let list = data || []
          let tabList = []
          list.forEach((item) => {
            tabList.push({
              id: item.typeId,
              name: item.typeName
            })
          })
          this.setData({
            tabList
          })
        },
        fail: (err) => {
          wx.hideLoading()
          this.setData({
            loading: false
          })
          wx.showToast({
            title: err.message || app.globalData.msgUnknown,
            icon: 'none'
          })
        }
      })
    },

    // 获取轮播图和二级类别
    getFeaturedImgDetail() {
      // 精选传值
      let params = {
        pageNum: 1,
        pageSize: 20,
        dictCode: 'banner_image'
      }
      app.request({
        method: 'GET',
        url: 'dict/page',
        data: params,
        success: (data) => {
          let homeImgUrls = []
          let imgList = data.list || []
          imgList.forEach(item => {
            homeImgUrls.push(item.dictValue)
          })
          this.setData({
            homeImgUrls
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
          this.setData({
            loading: false,
          })
        },
        fail: (err) => {
          wx.hideLoading()
          this.setData({
            loading: false
          })
          wx.showToast({
            title: err.message || app.globalData.msgUnknown,
            icon: 'none'
          })
        }
      })
    },
    // 获取轮播图和二级类别
    getTypeDetail(typeId) {
      // 精选传值
      let params = {
        typeId: typeId
      }
      app.request({
        method: 'GET',
        url: 'producttype/list-second',
        data: params,
        success: (data) => {
          let typeList = data.typeVoList || []
          let imgUrls = data.bannerImage ? data.bannerImage.split(',') : []
          this.setData({
            imgUrls,
            typeList
          })
          wx.hideLoading()
          wx.stopPullDownRefresh()
          this.setData({
            loading: false,
          })
        },
        fail: (err) => {
          wx.hideLoading()
          this.setData({
            loading: false
          })
          wx.showToast({
            title: err.message || app.globalData.msgUnknown,
            icon: 'none'
          })
        }
      })
    },
    // 获取商品
    getTypeProduct() {
      let pageNum = this.data.params.pageNum
      if (this.data.list.length > 0 && this.data.total === this.data.list.length) {
        return
      } else {
        pageNum += 1
        this.setData({
          params: {
            pageNum: pageNum,
            pageSize: this.data.params.pageSize
          }
        })
      }
      let params = {
        typeFirstId: this.data.typeId,
        pageNum: pageNum,
        pageSize: this.data.params.pageSize
      }

      app.request({
        method: 'GET',
        url: 'product/page',
        data: params,
        success: (data) => {
          wx.hideLoading()
          this.setData({
            loading: false,
          })
          let dataList = data.list || []
          let list = []
          dataList.forEach((item) => {
            let discount = ''
            let rate = util.calculator.sub(1, this.data.discount)
            // let rate = util.calculator.div(this.data.discount, 10)
            if (item.price) {
              let priceList = item.price.split('-')
              discount = util.calculator.mul(priceList[0], rate) + "-" + util.calculator.mul(priceList[1], rate)
            }
            list.push({
              productId: item.productId,
              smallImage: item.smallImage,
              name: item.name,
              typeSecondName: item.typeSecondName,
              price: item.price,
              sale: item.sale,
              discount: discount
            })
          })
          let total = data.total || 0
          this.setData({
            total,
            list: [...list, ...this.data.list]
          })
        },
        fail: (err) => {
          wx.hideLoading()
          this.setData({
            loading: false
          })
          wx.showToast({
            title: err.message || app.globalData.msgUnknown,
            icon: 'none'
          })
        }
      })
    },
    toSearch(e) {
      let item = app.getEventDataset(e).item
      wx.navigateTo({
        url: '/pages/search/index?typeSecondId=' + item.typeId + '&typeFirstId=' + item.parentId,
      })
    },
    titleToSeach(e) {
      let typeSecondId = app.getEventDataset(e).secondId;
      let typeFirstId = app.getEventDataset(e).firstId;
      wx.navigateTo({
        url: '/pages/search/index?typeSecondId=' + typeSecondId + '&typeFirstId=' + typeFirstId,
      })
    }
  }
})