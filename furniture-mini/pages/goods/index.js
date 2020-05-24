let app = getApp(),
  wxParse = require("../../wxParse/wxParse.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalName: null, // sku弹出
    shareLoginModal: null, // 分享弹出
    nav_select: false, // 快捷导航

    isCanDraw: false, // 分享
    isShowSku: false, // 显示sku
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: true, // 显示商品规格

    detail: {}, // 商品详情信息
    goods_price: 1200, // 商品价格
    line_price: 0, // 划线价格
    stock_num: 10, // 库存数量

    goods_num: 1, // 商品数量
    goods_sku_id: 0, // 规格id
    cart_total_num: 0, // 购物车商品总数量
    specData: {}, // 多规格信息
  },
  productId: 0,
  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    // 商品id
    that.data.productId = options.productId;
    that.productId = options.productId;
  },

  onShow() {
    let that = this;
    // 获取商品信息
    that.getGoodsDetail(that.productId);
  },

  /**
   * 获取商品信息
   */
  getGoodsDetail(id) {
    let that = this;
    let params = {
      productId: id
    }
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      method: 'POST',
      url: 'product/detail',
      data: params,
      success: (data) => {
        wx.hideLoading()
        let productDetail = data || {}
        wxParse.wxParse('content', 'html', productDetail.detail, that, 0);
        let detail = {
          productImage: !productDetail.productImage
            ? []
            : productDetail.productImage.split(","), // 商品图片 轮播,
          smallImage: productDetail.smallImage,
          productId: productDetail.productId,
          sale: productDetail.sale || 0,
          name: productDetail.name,
          content: productDetail.detail,
          attrList: productDetail.attrList,
          allAttrList: productDetail.allAttrList,
          typeSecondName: productDetail.typeSecondName,
          typeFirstName: productDetail.typeFirstName,
          shortName: productDetail.shortName,
          price: productDetail.price,
          stock: productDetail.stock
        }

        let goods_price = productDetail.price // 商品价格
        let line_price = productDetail.price // 划线价格
        let stock_num = productDetail.stock // 库存数量
        this.setData({
          loading: false,
          detail,
          line_price,
          stock_num,
          goods_price
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
  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState(e) {
    this.setData({
      isShowSku: !this.data.isShowSku,
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * 返回顶部
   */
  goTop(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  up() {
    this.setData({
      goods_num: ++this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  down() {
    if (this.data.goods_num > 1) {
      this.setData({
        goods_num: --this.data.goods_num
      });
    }
  },

  /**
   * 跳转购物车页面
   */
  flowCart: function () {
    wx.switchTab({
      url: "../shopping-cart/shopping"
    });
  },


  /**
   * 分享当前页面
   */
  onShareAppMessage: function () {
    // 构建页面参数
    let that = this;
    return {
      title: that.data.detail.goods_name,
      path: "/pages/goods/index?goods_id=" + that.data.goods_id
    };
  },
  // 点击轮播图 放大预览
  handlePreviewImg(e) {
    // console.log("我最喜欢的女明星:摁住啦 baby");
    // console.log(e.currentTarget.dataset.src);
    // 当前被点击的大图片路径
    const current = e.currentTarget.dataset.src;
    // 要预览的整个图片列表
    const urls = this.data.detail.productImage;
    // 开始预览
    wx.previewImage({
      current,
      urls
    });
  },
  // 分享生成图片
  createShareImage(e) {
    let that = this;
    app.authSettingCheck((boolean) => {
      if (boolean) {
        that.setData({
          isCanDraw: !that.data.isCanDraw
        })
      } else {
        that.setData({
          shareLoginModal: 'DialogModal1'
        })
      }
    })
  },
  // 回首页
  toHome() {
    wx.switchTab({
      url: "/pages/home/index",
    })
  },


  hideLogin(e) {
    this.setData({
      shareLoginModal: null
    })
  },
  successBack() {
    this.onShow()
  }
})