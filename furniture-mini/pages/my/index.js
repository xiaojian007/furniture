const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    todayCount: 0, //今日粉丝数
    monthCount: 0, //本月粉丝数
    allCount: 0, // 全部粉丝数
    totalAmount: 0, // 总佣金
    ongoingAmount: 0, // 待发放金额
    grandAmount: 0, // 已提现佣金
    countNoPay: 0, // 未支付数量
    isLogin: false, // 是否授权登录
    isFirstProxy: 1, // 二级代理
    moblie: '',
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
        that.query()
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

  query() {
    let that = this;
    let params = {
      userId: app.globalData.userInfo.userId
    }
    app.request({
      url: 'userdiscount/center-count',
      data: params,
      method: 'POST',
      success(res) {
        wx.hideLoading()
        that.setData({
          todayCount: res.todayCount || 0,
          monthCount: res.monthCount || 0,
          allCount: res.allCount || 0,
          totalAmount: res.totalAmount || 0,
          ongoingAmount: res.ongoingAmount || 0,
          grandAmount: res.grandAmount || 0,
          countNoPay: res.countNoPay || 0
        })
      },
      fail(err) {
        wx.hideLoading()
        console.log('个人中心获取失败:', err)
        wx.showToast({
          title: err.message || '系统繁忙',
          icon: 'none'
        })
      }
    }, false)
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
      let type = 3
      if (app.getEventDataset(e).type === 'today') {
        type = 1;
      } else if ((app.getEventDataset(e).type === 'month')) {
        type = 2;
      }
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
      if (that.data.isFirstProxy == 1) {
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