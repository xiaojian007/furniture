const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false, // 是否授权登录
    isFirstProxy: 1, // 二级代理
    moblie: '',
    orderCount: {
      payment: 9
    },
    modalName: '' // 登录弹出
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
          isFirstProxy: app.globalData.userInfo.discountNum,
          moblie: app.globalData.userInfo.moblie || ''
        })
      })
    }, false)
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let that = this;
    app._get('user.index/detail', {}, result => {
      that.setData(result.data);
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    let that = this;
    if (that.data.isLogin) {
      let urls = {
        all: '/pages/order/index?type=all',
        payment: '/pages/order/index?type=payment',
        delivery: '/pages/order/index?type=delivery',
        received: '/pages/order/index?type=received'
      };
      // 转跳指定的页面
      wx.navigateTo({
        url: urls[app.getEventDataset(e).type]
      })
    } else {
      that.setData({
        modalName: 'DialogModal1'
      })
    }
  },
  /**
   * 我的粉丝导航跳转
   */
  toMyFan(e) {
    let that = this;
    if (that.data.isLogin) {
      let type = app.getEventDataset(e).type
      // 转跳指定的页面
      wx.navigateTo({
        url: '/pages/my/fans?type=' + type
      })
    } else {
      that.setData({
        modalName: 'DialogModal1'
      })
    }
  },
  //授权弹出显示
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  //授权弹出关闭
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 授权后回调
  successBack() {
    this.onShow()
  },

  // 前往收货地址
  toAdress() {
    let that = this;
    if (that.data.isLogin) {
      // 转跳指定的页面
      wx.navigateTo({
        url: '/pages/address/index'
      })
    } else {
      that.setData({
        modalName: 'DialogModal1'
      })
    }
  },
  toVisit() {
    let that = this;
    if (that.data.isLogin) {
      // 转跳指定的页面
      wx.navigateTo({
        url: '/pages/my/visit'
      })
    } else {
      that.setData({
        modalName: 'DialogModal1'
      })
    }
  },
  // 预约
  toReservation() {
    let that = this;
    if (that.data.isLogin) {
      // 转跳指定的页面
      wx.navigateTo({
        url: '/pages/reservation/list',
      })
    } else {
      that.setData({
        modalName: 'DialogModal1'
      })
    }
  },
  // 会员权益
  toVip() {
    let that = this;
    if (that.data.isLogin) {
      // 转跳指定的页面
      if(that.data.isFirstProxy == 1) {
        wx.navigateTo({
          url: '/pages/reservation/index',
        })
      } else {
        wx.navigateTo({
          url: '/pages/share/index',
        })
      }
      
    } else {
      that.setData({
        modalName: 'DialogModal1'
      })
    }
  },
  // 我的钱包
  myWallet() {
    wx.navigateTo({
      url: '/pages/commission/myWallet',
    })
  }
})