let app = getApp();
// pages/invite/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qrImage: 'https://cloud.pack.ininin.com/0e73483adb24bbec07070ffaa6f741a0',
    name: '',
    avatarUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.query()
    this.setData({
      avatarUrl: app.globalData.userInfo.avatarUrl,
      name: app.globalData.userInfo.nickName

    })
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
  query(){
    let params = {
      userId: app.globalData.userInfo.userId,
      path: '/pages/home/index'
    }
    app.request({
      method: 'GET',
      url: 'wechat/createQrCode',
      data: params,
      success: (data) => {
        if (data) {
          this.setData({
            qrImage: data
          })
        } else {
          wx.showToast({
            title: '分享图片获取失败！',
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
          title: app.globalData.msgUnknown,
          icon: 'none',
          duration: 1000
        })
      }
    })
  }
})