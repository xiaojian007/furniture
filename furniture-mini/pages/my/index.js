const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    moblie: '',
    orderCount: {
      payment: 9
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    app.loginCheck(that, () => {
      app.authSettingCheck((boolean) => {
        that.setData({
          isLogin: boolean,
          moblie: app.globalData.userInfo.moblie || ''
        })
      })
    }, false)
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    app._get('user.index/detail', {}, result => {
      _this.setData(result.data);
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    let that = this;
    if (app.loginChecking) {
      let urls = {
        all: '/pages/order/index?type=all',
        payment: '/pages/order/index?type=payment',
        delivery: '/pages/order/index?type=delivery',
        received: '/pages/order/index?type=received'
      };
      // 转跳指定的页面
      wx.navigateTo({
        url: urls[e.currentTarget.dataset.type]
      })
    } else {
      return false;
    }
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 授权登录
  bindGetUserInfo() {
    var that = this;
    //获取用户信息
    wx.getUserInfo({
      success: function (res) {
        app.updateUserInfo(res.userInfo, (data) => {
          if (openid.openid) {
            that.onShow()
            this.setData({
              modalName: null
            })
          } else {
            console.log('更新用户信息失败')
          }
        })
      }
    })
  }
})