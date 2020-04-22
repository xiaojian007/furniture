const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {},
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
    app.loginCheck(this, () => {
      // this.getUserDetail()
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

  /**
   * 跳转到登录页
   */
  onLogin() {
    wx.navigateTo({
      url: '../login/login',
    });
  },

  /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },


})