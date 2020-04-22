// pages/find/index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    H5_URL: app.globalData.H5_URL,
    QINIU_DOWNLOAD: app.globalData.QINIU_DOWNLOAD,
    thumbnail: '?',
    list: []
  },

  /**
   * 查询参数
   */
  params: {
    currentPage: 1,
    pageSize: 15
  },

  showDetail: false, //是否打开详情页

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.isShowNewPage) {
      app.isShowNewPage = false
    } else {
      app.loginCheck(this, () => {
        if (!this.showDetail) {
          this.getList(false, true)
        }
        this.showDetail = false
      }, false)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () { },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (options) { },

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    app.shareRecord()
    const code = app.getInviteCode()
    app.isShowNewPage = true
    return {
      title: '微供资讯创造价值',
      imageUrl: app.globalData.QINIU_DOWNLOAD + app.globalData.SHARE_IMAGE,
      path: '/pages/find/index?invitCode=' + code
    }
  },

  /**
   * 点击 tab 时触发
   */
  onTabItemTap: function () {
    this.getList()
  },

  /**
   * 打开详情
   */
  openDetail: function (e) {
    this.showDetail = true
    let dataset = app.getEventDataset(e)
    wx.navigateTo({
      url: '/pages/find/detail?newsId=' + dataset.newsId
    })
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
      that.params.currentPage += 1
    } else {
      that.params.currentPage = 1
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
    app.request({
      url: app.globalData.API_NEWS_URL + 'message/article/not_login_article',
      data: that.params,
      method: 'GET',
      success(res) {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        let list = res.list || []
        list.forEach(item => {
          item.tags = util.jsonParse(item.tag) || []
        })
        that.setData({
          loading: false,
          list: nextPage ? [...that.data.list, ...list] : list,
          total: res.totalCount || 0
        })
      },
      fail(err) {
        wx.stopPullDownRefresh()
        wx.hideLoading()
        that.setData({
          loading: false
        })
        console.log('资讯列表报错原因:', err)
        wx.showToast({
          title: err.resultMsg || '系统繁忙',
          icon: 'none'
        })
      }
    }, false)
  }
})