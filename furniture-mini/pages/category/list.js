let App = getApp();

Page({
  data: {
    searchColor: "rgba(0,0,0,0.4)",
    searchSize: "15",
    searchName: "搜索商品",

    scrollHeight: null,
    showView: false,
    arrange: "",

    sortType: 'all',    // 排序类型
    sortPrice: false,   // 价格从低到高

    option: {},
    list: {},

    noList: true,
    no_more: false,

    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this;

    // 设置商品列表高度
    that.setListHeight();

    // 记录option
    that.setData({ option }, function () {
      // 获取商品列表
      that.getGoodsList(true);
    });

  },

  /**
   * 获取商品列表
   */
  getGoodsList: function (is_super, page) {
    let that = this;
    
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight - 90,
        });
      }
    });
  },

  /**
   * 切换排序方式
   */
  switchSortType: function (e) {
    let _this = this
      , newSortType = e.currentTarget.dataset.type
      , newSortPrice = newSortType === 'price' ? !_this.data.sortPrice : true;

    _this.setData({
      list: {},
      page: 1,
      sortType: newSortType,
      sortPrice: newSortPrice
    }, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });
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
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({ no_more: true });
      return false;
    }
    this.getGoodsList(false, ++this.data.page);
  },

  /**
   * 设置分享内容
   */
  onShareAppMessage: function () {
    return {
      title: "全部分类",
      desc: "",
      path: "/pages/category/index"
    };
  },

});
