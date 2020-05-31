const app = getApp();
// pages/share/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    time: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    app.loginCheck(this, () => {
      app.authSettingCheck((bool) => {
        this.query()
      })
    }, false)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  query() {
    let that = this;
    let params = {
      openid: app.globalData.userInfo.openId,
      userId: app.globalData.userInfo.userId
    }
    wx.showLoading()
    app.request({
      method: 'POST',
      url: 'wechat/saveUserInfo',
      data: params,
      success: (data) => {
        wx.hideLoading()
        that.setData({
          name: data.nickName,
          time: data.createTime,
          loading: false,
        })
      },
      fail: (err) => {
        wx.hideLoading()
        wx.showToast({
          title: app.globalData.msgUnknown,
          icon: 'none',
          duration: 1000
        })
      }
    })
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

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
})