const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
Page({
  data: {
    scrollHeight: null,
    showView: false,
    arrange: "",
    searchKey: '',
    sortType: 'all',    // 排序类型
    sortPrice: false,   // 价格从低到高

    option: {},
    list: [],
    total: 0,

    typeSecondId: 0,
    currentTab: 0, // 滚动
    scrollLeft: 0, //tab标题的滚动条位置
  },

  params: {
    name: '',
    orderType: 1,
    typeSecondId: '',
    pageNum: 1,
    pageSize: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let typeFirstId = option.typeFirstId || ''
    let typeSecondId = option.typeSecondId || ''
    this.params.typeSecondId = typeSecondId

    let that = this;
    app.loginCheck(this, () => {
      // 设置商品列表高度
      that.setListHeight();
      // 记录option
      that.setData({ option, typeSecondId: typeSecondId }, function () {
        // 获取商品列表
        that.getGoodsList(false, true);
        that.getTypeDetail(typeFirstId)
      });
    }, false)

  },
  searchInput(e) {
    let name = e.detail.value
    this.params.name = name
    this.setData({
      searchKey: name
    })
  },
  search(e) {
    if (e.detail.value) {
      let name = e.detail.value
      this.params.name = name
    }
    this.getGoodsList(false)
  },
  /**
   * 获取商品列表
   */
  getGoodsList: function (nextPage = false, show = false) {
    let that = this;
    if (that.data.loading) return
    if (nextPage) {
      if (that.data.list.length > 0 && that.data.list.length === that.data.total) {
        wx.stopPullDownRefresh()
        return
      }
      that.params.pageNum += 1
    } else {
      that.params.pageNum = 1
    }
    if (show) {
      wx.showLoading()
    }
    that.setData({
      loading: true
    })
    if (show) {
      wx.showLoading({
        title: '加载中'
      })
    }
    app.request({
      url: 'product/page',
      data: that.params,
      method: 'GET',
      success(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let list = res.list || []
        that.setData({
          loading: false,
          list: nextPage ? [...that.data.list, ...list] : list,
          total: res.total || 0
        })
      },
      fail(err) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        that.setData({
          loading: false
        })
        console.log('资讯列表报错原因:', err)
        wx.showToast({
          title: err.resultMsg || '系统繁忙',
          icon: 'none'
        })
      }
    }, false)
  },

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
        this.setData({
          typeList
        })
        wx.hideLoading()
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.navigateBack({
          delta: 1,
        })
        wx.showToast({
          title: err.message || app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 137,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let that = this;
    let newSortType = e.currentTarget.dataset.type;
    let newSortPrice = newSortType === 'price' ? !that.data.sortPrice : true;
    if (newSortType === 'new') {
      that.params = {
        name: that.params.name,
        typeSecondId: that.params.typeSecondId,
        isPerfect: 1,
        pageNum: 1,
        pageSize: 10
      }
    } else if (newSortType === 'all') {
      that.params = {
        name: that.params.name,
        typeSecondId: that.params.typeSecondId,
        orderType: 1,
        pageNum: 1,
        pageSize: 10
      }
    } else if (newSortType === 'sales') {
      that.params = {
        name: that.params.name,
        typeSecondId: that.params.typeSecondId,
        orderType: 3,
        pageNum: 1,
        pageSize: 10
      }
    } else if (newSortPrice) {
      that.params = {
        name: that.params.name,
        typeSecondId: that.params.typeSecondId,
        pageNum: 1,
        orderType: 2,
        pageSize: 10
      }
    } else if (newSortPrice) {
      that.params = {
        name: that.params.name,
        typeSecondId: that.params.typeSecondId,
        pageNum: 1,
        orderType: 2,
        pageSize: 10
      }
    }
    that.setData({
      sortType: newSortType,
      sortPrice: newSortPrice
    })
    // 获取商品列表
    that.getGoodsList(false);
  },

  /**
   * 跳转筛选
   */
  toSynthesize: function (t) {
    wx.navigateTo({
      url: "../category/screen?objectId="
    });
  },

  /**
   * 切换列表显示方式
   */
  onChangeShowState: function () {
    let that = this;
    that.setData({
      showView: !that.data.showView,
      arrange: that.data.arrange ? "" : "arrange"
    });
  },

  /**
   * 下拉到底加载数据
   */
  bindDownLoad: function () {
    this.getGoodsList(true);
  },

  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  // 点击标题切换当前页时改变样式
  swichNav(e) {
    let cur = e.target.dataset.current;
    let typeSecondId = e.target.dataset.typeId;
    if (this.data.currentTab == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur,
        typeSecondId
      })
    }
    this.checkCor()
    this.params.typeSecondId = typeSecondId
    this.getGoodsList(false)
  }
});
