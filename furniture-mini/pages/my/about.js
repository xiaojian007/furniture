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
    detail: {}
  },

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
    this.getDetail()
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

  getDetail() {
    wx.showLoading({
      title: '加载中'
    })
    app.request({
      method: 'POST',
      url: 'dict/detail',
      data: {
        dictId: 18
      },
      success: res => {
        wx.hideLoading()
        res.contentText = util.getBody(res.dictValue)

        /*** WxParse.wxParse(bindName , type, data, target,imagePadding)
         * 1.bindName绑定的数据名(必填)
         * 2.type可以为html或者md(必填)
         * 3.data为传入的具体数据(必填)
         * 4.target为Page对象,一般为this(必填)
         * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)*/
        let temp = richText.wxParse('article', 'html', res.contentText, this, 5)
        this.setData({
          detail: res
        })

      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          title: err.message || '系统繁忙',
          icon: 'none'
        })
      }
    }, false)
  }
})