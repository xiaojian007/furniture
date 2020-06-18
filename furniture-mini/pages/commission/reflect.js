let app = getApp();
// pages/commission/reflect.js.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    amount: '',
    bankCardNo: '',
    bankName: '',
    mobile: '',
    name: '',
    availableMoney: '' // 可提收益
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let availableMoney = options.money
    this.setData({ availableMoney })
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
   * 表单验证
   */
  validation: function (values) {

    if (values.amount === '') {
      this.data.error = '提现金额不能为空';
      return false;
    }
    // if (Number(values.amount) < 5) {
    //   this.data.error = '提现金额必须大于5';
    //   return false;
    // }
    if (Number(values.amount) > Number(this.data.availableMoney || 0)) {
      this.data.error = '提现金额必须小于可提金额';
      return false;
    }
    if (values.name === '') {
      this.data.error = '开户人名称不能为空';
      return false;
    }

    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (values.bankName === '') {
      this.data.error = '开户银行不能为空';
      return false;
    }
    if (values.bankCardNo === '') {
      this.data.error = '银行卡号不能为空';
      return false;
    }
    return true
  },
  saveData(e) {
    let that = this,
      values = e.detail.value

    // 表单验证
    if (!that.validation(values)) {
      app.showError(that.data.error);
      return false;
    }

    // 按钮禁用
    that.setData({
      disabled: true
    });

    let params = {
      amount: values.amount,
      bankCardNo: values.bankCardNo,
      bankName: values.bankName,
      mobile: values.phone,
      name: values.name,
      userId: app.globalData.userInfo.userId,
      userName: app.globalData.userInfo.nickName
    }
    wx.showLoading()
    app.request({
      method: 'POST',
      url: 'userdiscountcash/save',
      data: params,
      success: (data) => {
        wx.hideLoading()
        this.setData({
          loading: false,
        })
        wx.showToast({
          title: '已提交审核！',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  }
})