let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null,
    order: {},
    receiveAddress: {}
  },
  orderId: null,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.orderId = options.orderId;
  },

  onShow: function() {
    this.getOrderDetail(this.orderId);
  },
  /**
   * 获取订单详情
   */
  getOrderDetail(orderId) {
    let that = this;
    wx.showLoading({
      title: '加载中',
    })
    app.request({
      url: 'order/detail',
      method: 'POST',
      data: {orderId: orderId},
      success: (data) => {
        let receiveAddress = data.receiveAddress || {}
        that.setData({
          order: data || {},
          receiveAddress
        })
        wx.hideLoading()
      },
      fail: (err) => {
        debugger
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: err.message || app.globalData.msgUnknown,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

  /**
   * 跳转到商品详情
   */
  toProductDetail(e) {
    let productId = app.getEventDataset(e).id
    wx.navigateTo({
      url: '/pages/goods/index?productId=' + productId,
    })
  },

   /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let that = this;
    let orderId = app.getEventDataset(e).value;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          let params = {
            orderId: orderId,
            orderStatus: 4
          }
          wx.showLoading({
            title: '取消中',
          })
          app.request({
            url: 'order/update',
            method: 'POST',
            data: params,
            success: (data) => {
              wx.hideLoading()
              that.getOrderList(true)
            },
            fail: (err) => {
              wx.hideLoading()
              this.setData({
                loading: false
              })
              wx.showToast({
                title: err.message || app.globalData.msgUnknown,
                icon: 'none',
                duration: 1000
              })
            }
          })
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let orderId = _this.data.orderId;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('user.order/pay', { orderId }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          _this.getOrderDetail(orderId);
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let orderId = _this.data.orderId;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/receipt', { orderId }, function (result) {
            _this.getOrderDetail(orderId);
          });
        }
      }
    });
  },


});