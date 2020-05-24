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
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    loading: false,
    topNumber: 0,
    isShow: false,
    params: {
      pageNum: 0,
      pageSize: 10
    },
    productYuewu: [{
      id: 1,
      name: '汀·西海岸系列'
    }, {
      id: 2,
      name: '汀·西米娅系列'
    }, {
      id: 3,
      name: '汀·HOUSE系列'
    }, {
      id: 4,
      name: '全屋定制'
    }], // 悦物数据
    typeList: [], // 二级类别
    list: [], // 类型页商品数据
    total: 20, // 总条数
    home: [], // 首页商品数据
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
    query() {
      if (this.data.isShow) {
        return
      }
      console.log(this.data.typeId, this.data.isShow)
      this.setData({
        isShow: true
      })
      if (this.data.typeId === 0) {
        this.getFeatured()
        this.getFeaturedImgDetail()
      } else {
        this.getTypeDetail(this.data.typeId)
        this.getTypeProduct()
      }
      // let imgUrls = [
      //   'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      //   'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      //   'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
      // ]
      // let homeImgUrls = imgUrls
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
          let list = data.list || []
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
          let homeImgUrls =[]
          let imgList = data.list || []
          imgList.forEach(item=>{
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
          let list = data.list || []
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
    }
  }
})