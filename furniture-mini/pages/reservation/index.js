const app = getApp()
// pages/reservation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  formSubmit(e) {
    console.log(e.detail.value)
    let value = e.detail.value
    if (value.name === '') {
      wx.showToast({
        title: '姓名不能为空!',
        icon: 'none'
      })
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(value.phone)) {
      wx.showToast({
        title: '请输入正确的手机号!',
        icon: 'none'
      })
      return false;
    }

    let params = {
      subscribeNickName: value.name,
      mobile: value.phone,
      userId: app.globalData.userInfo.userId
    }
    app.request({
      method: 'POST',
      url: 'subscribe/save',
      data: params,
      success: (data) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        wx.showToast({
          title: '提交成功！'
        })
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
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
  }
})