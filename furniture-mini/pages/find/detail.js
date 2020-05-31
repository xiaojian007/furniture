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
    modalName: '', // 登录弹出
    isCanDraw: false, // 分享
    articleId: '',
    detail: {},
    hasInvitCode: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      articleId: e.articleId || '',
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
    const articleId = this.data.articleId
    wx.showLoading({
      title: '加载中'
    })
    app.request({
      method: 'POST',
      url: 'article/detail',
      data: {
        articleId: articleId
      },
      success: res => {
        wx.hideLoading()
        res.updateTimeText = util.format(new Date(res.updateTime), 'yyyy-MM-dd')
        res.contentText = util.getBody(res.articleContent)
        // console.log(res.contentText)

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
        wx.setNavigationBarTitle({
          title: res.articleTitle    // 其他页面传过来的标题名
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
  },
  /**
   * 回到首页
   */
  handleToHome() {
    wx.switchTab({
      url: '/pages/news/index'
    })
  },

  // 分享
  share() {
    let that = this
    app.authSettingCheck((boolean) => {
      if (boolean) {
        that.setData({
          isCanDraw: !that.data.isCanDraw
        })
      } else {
        that.setData({
          modalName: 'DialogModal1'
        })
      }
    })
  },
  // 显示弹出
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  // 关闭弹出
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // 授权手回调
  successBack() {
    this.onShow()
  },
  //调用弹出生成分享图片
  createShareImage(){}
})