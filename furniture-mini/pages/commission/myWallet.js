// pages/my/fans.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grandAmount: 0, // 已提现佣金
    ongoingAmount: 0, // 待发放金额
    totalAmount: 0 // 总佣金
  },
  /**
   * 查询参数
   */
  params: {
    userId: 0
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
    app.loginCheck(this, () => {
      if (!this.showDetail) {
        this.getList(false, true)
      }
    }, false)
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
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },
  /**
    * 获取列表
    * @param {Boolean} nextPage 是否为查询下一页
    * @param {Boolean} show 是否为show加载
    */
  getList: function () {
    let that = this
    app.request({
      url: 'userdiscount/center-count',
      data: {
        userId: app.globalData.userInfo.userId
      },
      method: 'POST',
      success(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let grandAmount = res.grandAmount
        let ongoingAmount = res.ongoingAmount
        let totalAmount = res.totalAmount
        that.setData({
          loading: false,
          grandAmount,
          ongoingAmount,
          totalAmount
        })
      },
      fail(err) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        that.setData({
          loading: false
        })
        wx.showToast({
          title: err.message || '系统繁忙',
          icon: 'none'
        })
      }
    }, false)
  }
})