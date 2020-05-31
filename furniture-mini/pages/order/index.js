let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 'all',
    orderList: [],
    total: 0
  },

  params: {
    pageNum: 1,
    pageSize: 10,
    searchKey: '',
    orderStatus: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let dataType = options.type || 'all';
    this.setData({
      dataType
    });
    this.getOrderStatus(options.type)

  },
  // 获取订单类型
  getOrderStatus(type) {
    if (type == 'all') {
      this.params.orderStatus = ''
    } else if (type == 'payment') {
      this.params.orderStatus = 0
    } else if (type == 'delivery') {
      this.params.orderStatus = 1
    } else if (type == 'received') {
      this.params.orderStatus = 2
    } else if (type == 'successd') {
      this.params.orderStatus = 3
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList(false, true);
  },
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.getOrderList(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList(true)
  },

  /**
   * 获取订单列表
   */
  getOrderList(nextPage = false, show = false) {
    let that = this;
    if (that.data.loading) return
    if (nextPage) {
      if (that.data.orderList.length > 0 && that.data.orderList.length === that.data.total) {
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
    let params = {
      userId: app.globalData.userInfo.userId,
      pageNum: this.params.pageNum,
      pageSize: this.params.pageSize,
      orderStatus: this.params.orderStatus
    }
    app.request({
      method: 'GET',
      url: 'order/page',
      data: params,
      success: (data) => {
        let orderList = data.list || []
        wx.hideLoading()
        this.setData({
          loading: false,
          orderList: nextPage ? [...that.data.orderList, ...orderList] : orderList,
          total: data.total || 0
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
   * 切换标签
   */
  bindHeaderTap: function (e) {
    let dataType = app.getEventDataset(e).type
    this.setData({
      dataType
    });
    this.getOrderStatus(dataType)
    // 获取订单列表
    this.getOrderList(false);
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
              that.getOrderList(false)
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
      orderNo: orderNo,
      orderId: orderId
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
        that.getOrderList(false)
      },
      fail: (res) => {
        wx.showModal({
          title: '支付失败',
          icon: 'none'
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
        that.getOrderList(false)
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
              that.getOrderList(false)
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
   * 跳转订单详情页
   */
  detail: function (e) {
    let order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail?order_id=' + order_id
    });
  },

  searchInput(e) {
    this.params.searchKey = e.detail.value
  },
  /**
   * 搜索
   */
  search(e) {
    if (e.detail.value) {
      let searchKey = e.detail.value
      this.params.searchKey = searchKey
    }
    this.getOrderList(true)
  },
  // 点击订单图片进入商品详情
  toProductDetail(e) {
    let productId = app.getEventDataset(e).id
    wx.navigateTo({
      url: '/pages/goods/index?productId=' + productId,
    })
  },

  toOrderDetail(e) {
    let orderId = app.getEventDataset(e).id;
    wx.navigateTo({
      url: '/pages/order/detail?orderId=' + orderId,
    })
  }


});