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

  onShow: function () {
    app.loginCheck(this, () => {
      this.getOrderDetail(this.orderId);
    }, false)
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
      data: { orderId: orderId },
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
            url: 'order/cancel',
            method: 'POST',
            data: params,
            success: (data) => {
              wx.hideLoading()
              that.onShow()
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
  payOrder(e) {
    let orderItem = app.getEventDataset(e).value
    this.generateOrder(orderItem.totalRealAmount, orderItem.orderId, orderItem.orderNo)
  },


  // 生成商户订单
  generateOrder(totalPrice, orderId, orderNo) {
    let that = this
    let params = {
      totalFee: totalPrice,
      openId: app.globalData.userInfo.openId,
      orderId: orderId,
      orderNo: orderNo
    }
    app.request({
      method: 'POST',
      url: 'wechat/pay',
      data: params,
      success: (data) => {
        wx.hideLoading()
        let pay = data
        if (data) {
          //发起支付
          let packages = pay.package
          let paySign = pay.sign
          let nonceStr = pay.nonceStr
          let timeStamp = pay.timeStamp
          let signType = pay.signType
          let param = {
            timeStamp: timeStamp,
            package: packages,
            paySign: paySign,
            signType: signType,
            nonceStr: nonceStr
          }
          that.payMoney(param, orderId)
        } else {
          wx.showToast({
            title: '支付失败，请稍后重试！',
            icon: 'none',
            duration: 1000
          })
        }
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
  },
  payMoney(param, orderId) {
    // 调起支付
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: (res) => {
        this.payOK(orderId)
      },
      fail: (res) => {
        wx.showLoading({
          title: '支付失败！',
        })
      },
      complete: (res) => {
      }
    })
  },
  // 支付完成后修改订单状态
  payOK(orderId) {
    let that = this;
    let params = {
      orderId: orderId,
      orderStatus: 1
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
        wx.showToast({
          title: '支付成功！',
          icon: 'success'
        })
        that.onShow()
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
  },

  // 确认收货
  confirmReceive(e) {
    let that = this;
    let orderId = app.getEventDataset(e).value;
    wx.showModal({
      title: "提示",
      content: "是否确认收货？",
      success: function (o) {
        if (o.confirm) {
          let params = {
            orderId: orderId,
            orderStatus: 3
          }
          wx.showLoading({
            title: '确认中',
          })
          app.request({
            url: 'order/update',
            method: 'POST',
            data: params,
            success: (data) => {
              wx.hideLoading()
              that.onShow()
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

  //回首页
  goHome(e) {
    wx.switchTab({
      url: '/pages/home/index'
    })
  }

});