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
      currentPage: 1,
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
      let currentPage = this.data.params.currentPage
      currentPage = currentPage + 1
      this.setData({
        params: {
          currentPage: currentPage
        }
      })
      setTimeout(() => {
        this.setData({
          list: [...this.data.list, ...this.data.list]
        })
      }, 200)
      console.log(this.data.params.currentPage)
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

      }
      let list = [{
        id: 0,
        name: '情感'
      }, {
        id: 1,
        name: '情感'
      }, {
        id: 2,
        name: '情感'
      }, {
        id: 3,
        name: '情感'
      }, {
        id: 4,
        name: '情感'
      }, {
        id: 5,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }]
      let imgUrls = [
        'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
        'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
        'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
      ]
      let homeImgUrls = imgUrls
      console.log('请求数据')
      this.setData({
        loading: true
      })
      setTimeout(() => {
        this.setData({
          list,
          imgUrls,
          homeImgUrls,
          loading: false
        })
      }, 2000)
    }
  }
})