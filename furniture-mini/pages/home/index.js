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
    floorShow: false, // 返回顶部是否显示
    isShow: false, // 轮播切换是否已经从第一条切换
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
    params: {
      currentPage: 1,
      pageSize: 10
    },
    scrollLeft: 0,
    swiperAutoplay: false,
    currentTab: 0,
    tabList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
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
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.loginCheck(this, () => {
      this.query()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 获取滚动条当前位置
  scrollToupper(e) {
    let scrollTop = e.detail.detail.scrollTop
    if (scrollTop > 100) {
      this.setData({
        floorShow: true
      });
    } else {
      this.setData({
        floorShow: false
      });
    }
  },
  //回到顶部
  goTop(e) {  // 一键回到顶部
    let currentTab = this.data.currentTab
    this.selectComponent("#homeList" + currentTab).toTop()
  },
  // 预约
  goReservation() {
    wx.navigateTo({
      url: '/pages/shopping-cart/index',
    })
  },
  /**
   * 搜索
   */
  search() {
    console.log(2222)
  },
  query() {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      loading: true
    })
    let params = {
      hasSecond: false
    }
    app.request({
      method: 'GET',
      url: 'producttype/list',
      data: params,
      success: (data) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.setData({
          loading: false,
        })
        let list = data || []
        let tabList = [{
          id: 0,
          name: '精选'
        }]
        list.forEach((item) => {
          tabList.push({
            id: item.typeId,
            name: item.typeName
          })
        })
        this.setData({
          tabList
        })
        // 调用子组件
        this.selectComponent("#homeList0").query()
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },
  // 滚动切换标签样式
  switchTab(e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();

    // if (this.data.currentTab === 0) {
    //   this.setData({
    //     isShow: true
    //   })
    // }
    // if (this.data.isShow) {
    //   return
    // }
    // 触发子级调用数据
    this.selectComponent("#homeList" + e.detail.current).query()
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