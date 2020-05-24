let app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    totalPrice: 0,
    expressPrice: 0,
    actualPrice: 0,
    coupon: {
      id: "",
      title: "",
      discount: 0
    },
    productList: [
    ],
    memo: '', //备注
    agree: true,
    allTotal: 0 // 一共多少件
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.from == "product") {
      // 直接购买
      let product = wx.getStorageSync("checkoutProduct");
      let sku = wx.getStorageSync("checkoutProductSku");
      this.setData({
        productList: [{
          id: product.id,
          checked: true,
          picUrl: product.picUrl,
          title: product.title,
          spec: sku.specTextNoCount,
          count: sku.count,
          maxNum: sku.quota,
          price: product.price
        }],
        totalPrice: product.price * sku.count
      })
      // 判断运费
      if (product.price >= 88) {
        this.setData({
          expressPrice: 0
        })
      } else {
        this.setData({
          expressPrice: 10
        })
      }
      // 实际价格总计
      let actualPrice = this.data.totalPrice + this.data.expressPrice - this.data.coupon.discount
      this.setData({
        actualPrice: actualPrice
      })
    } else {
      // 购物车结算
      let cartList = wx.getStorageSync("cartList");
      let totalPrice = options.totalPrice;
      let allTotal = 0;
      cartList.forEach(item=>{
        allTotal += Number(item.num)
      })
      this.setData({
        productList: cartList,
        actualPrice: Number(totalPrice),
        allTotal,
        expressPrice: 0  // 运费 为0
      })
      this.getAddressList()
      // 判断运费
      // if (wx.getStorageSync("isExpressFree") == "true") {
      //   this.setData({
      //     expressPrice: 0
      //   })
      // } else {
      //   this.setData({
      //     expressPrice: 10
      //   })
      // }
      // 实际价格总计
      // let actualPrice = this.data.totalPrice + this.data.expressPrice - this.data.coupon.discount
      // this.setData({
      //   actualPrice: actualPrice
      // })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
 * 获取收货地址列表
 */
  getAddressList: function () {
    let that = this
    let params = {
      pageNum: 1,
      userId: app.globalData.userInfo.userId,
      pageSize: 100
    }
    app.request({
      method: 'GET',
      url: 'receiveaddress/page',
      data: params,
      success: (data) => {
        wx.hideLoading()
        this.setData({
          loading: false,
        })
        let addressList = data.list || []
        let address = {}
        addressList.forEach(item => {
          if (item.isDefault == 1) {
            let areaName = !item.areaName ? [] : item.areaName.split('-')
            address = {
              name: item.receiver,
              phone: item.receiverPhone,
              isDefault: item.isDefault,
              adress: {
                city: areaName[1],
                region: areaName[2],
                province: areaName[0],
                detail: item.addressName,
              },
              addressId: item.addressId
            }
          }
        })
        that.setData({
          address
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
  changeAgree: function (e) {
    this.setData({
      agree: e.detail
    })
  },
  chooseAddress: function () {
    wx.navigateTo({
      url: '/pages/address/index?addressId=' + this.data.address.addressId + '&isShopping=1',
    })
  },
  // 订单备注
  orderMemo(e) {
    this.setData({
      memo: e.detail.value
    })
  },
  // 去付款
  submitOrder: function () {
    let that = this
    if (!this.data.agree) {
      return;
    }
    let actualPrice = that.data.actualPrice;
    let addressId = that.data.address.addressId;
    let memo = that.data.memo || '';
    let shopIds = [];
    that.data.productList.forEach(item => {
      shopIds.push(item.shopId)
    })
    let params = {
      totalPrice: actualPrice,
      shopIds: shopIds,
      userId: app.globalData.userInfo.userId,
      addressId: addressId,
      memo: memo // 备注
    }
    // wx.navigateTo({
    //   url: './pay-result',
    // })
    app.request({
      method: 'POST',
      url: 'order/save',
      data: params,
      success: (data) => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '已下单成功，请确认金额后点击支付',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              that.generateOrder(params.totalPrice)
            } else {
              wx.showToast({
                title: '请前往我的订单进行支付',
                icon: 'none',
                duration: 1000
              })
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1,
                })
              }, 1000)
            }
          }
        })
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
  // 生成商户订单
  generateOrder(totalPrice) {
    let that = this
    let params = {
      totalFee: totalPrice,
      openId: app.globalData.userInfo.openId
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
          that.payMoney(param)
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
  payMoney(param) {
    // 调起支付
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: (res) => { 
        wx.navigateTo({
          url: './pay-result?status=' + 1,
        })
      },
      fail: (res) => {
        wx.navigateTo({
          url: './pay-result?status=' + 0,
        })
       },
      complete: (res) => { }
    })
  }
})