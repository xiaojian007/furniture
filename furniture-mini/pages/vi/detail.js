// pages/news/detail.js
const util = require('../../utils/util.js')
// 富文本解析器
const richText = require('../../wxParse/wxParse.js')
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vrId: '',
    detail: {},
    hasInvitCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      vrId: e.id || '',
    })
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
        this.getDetail()
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
  onUnload: function () { },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },

  /**
   * 网页向小程序 postMessage 时，会在特定时机（小程序后退、组件销毁、分享）触发并收到消息。e.detail = { data }
   */
  onBindMessage: function (e) {
    let detail = {}
    if (e && e.detail && e.detail.data) {
      detail = e.detail.data[0]
    }
    this.setData({
      detail: detail
    })
  },
  getDetail() {
    const vrId = this.data.vrId
    wx.showLoading({
      title: '加载中'
    })
    app.request({
      method: 'POST',
      url: 'vrnews/detail',
      data: {
        vrId: vrId
      },
      success: res => {
        wx.hideLoading()
        this.setData({
          detail: res
        })

      },
      fail: err => {
        console.log('资讯详情报错原因:', err)
        wx.hideLoading()
      }
    }, false)
  }
})