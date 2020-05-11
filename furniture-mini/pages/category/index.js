const app = getApp();

Page({
  data: {

    // 列表高度
    scrollHeight: 0,

    // 一级分类：指针
    curNav: true,
    curIndex: 0,

    // 分类列表
    list: [],
    // 轮播图
    autoplay: false,
    interval: 5000,
    duration: 600,
    // show
    notcont: false
  },

  onLoad: function () {
    let that = this;
    // 设置分类列表高度
    that.setListHeight();
    // 获取分类列表
    that.getCategoryList();
  },

  /**
   * 设置分类列表高度
   */
  setListHeight: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - 47,
        });
      }
    });
  },

  /**
   * 获取分类列表
   */
  getCategoryList() {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    let params = {
      hasSecond: true
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
        let typeList = []
        let list = data || []
        list.forEach((item) => {
          let typeItem = {
            bannerImageList: item.bannerImage ? item.bannerImage.split(',') : [],
            typeId: item.typeId,
            typeName: item.typeName,
            typeVoList: item.typeVoList
          }
          typeList.push(typeItem)
        })
        that.setData({
          list: typeList,
          curNav: list.length > 0 ? list[0].category_id : true,
          notcont: !list.length
        });
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 一级分类：选中分类
   */
  selectNav: function (t) {
    let curNav = t.target.dataset.id,
      curIndex = parseInt(t.target.dataset.index);
    this.setData({
      curNav,
      curIndex,
      scrollTop: 0
    });
  }

});