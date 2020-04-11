// pages/my/index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()

// pages/home/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234
    }],
    scrollLeft: 0,
    swiperAutoplay: false,
    swiperIndicatorDots: false,
    currentTab: 0,
    tabList: [{
      id: 0,
      name: '精选'
    }, {
      id: 1,
      name: '情感'
    }, {
      id: 2,
      name: '情感'
    }, {
      id: 3,
      name: '情感'
    }, {
      id: 4,
      name: '情感'
    }, {
      id: 5,
      name: '情感'
    }, {
      id: 6,
      name: '情感'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(calc)
        that.setData({
          winHeight: calc
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    app.loginCheck(this, () => {})
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 搜索
   */
  search() {
    console.log(2222)
  },
  // 滚动切换标签样式
  switchTab(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
    // 触发子级调用数据
    if (e.detail.current > 0) {
      this.selectComponent("#homeList" + e.detail.current).query()
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  // 点击标题切换当前页时改变样式
  swichNav(e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
})