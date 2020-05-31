// pages/my/fans.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    total: 0
  },
  /**
   * 查询参数
   */
  params: {
    pageNum: 1,
    pageSize: 10,
    parentUserId: 0
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
    this.getList(false)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList(true)
  },
 /**
   * 获取列表
   * @param {Boolean} nextPage 是否为查询下一页
   * @param {Boolean} show 是否为show加载
   */
  getList: function (nextPage = false, show = false) {
    let that = this
    if (that.data.loading) return
    if (nextPage) {
      if (that.data.list.length > 0 && that.data.list.length === that.data.total) {
        wx.stopPullDownRefresh()
        return
      }
      that.params.pageNum += 1
    } else {
      that.params.pageNum = 1
    }
    if (show) {
      wx.showLoading()
    }
    that.setData({
      loading: true
    })
    if (show) {
      wx.showLoading({
        title: '加载中'
      })
    }
    that.params.parentUserId = app.globalData.userInfo.userId
    app.request({
      url: 'usergrade/pageVisitor',
      data: that.params,
      method: 'GET',
      success(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let list = res.list || []
        that.setData({
          loading: false,
          list: nextPage ? [...that.data.list, ...list] : list,
          total: res.total || 0
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