// pages/my/index.js
const util = require('../../utils/util.js')
//获取应用实例
const app = getApp()
var bool = true;
Page({
  data: {
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
    // 默认展示数据
    hasList: false,
    // 商品列表数据
    list: [],
    isAuthorize: false, // 是否授权
    // 金额
    totalPrice: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认全选

    productList: [],
    productTotal: 0,
    startX: 0, //开始坐标
    startY: 0
  },
  params: {
    isPerfect: 1,
    pageNum: 1,
    pageSize: 10
  },
  carParams: {
    userId: app.globalData.userInfo.userId,
    pageSize: 10,
    pageNum: 1,
  },
  onLoad() {
  },
  onShow() {
    app.loginCheck(this, () => {
      this.setData({
        selectAllStatus: false,
        totalPrice: 0,
        productList: []
      })
      this.query(false, true)
      // 价格方法
      this.countPrice();
    }, false)
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    if (this.data.list.length > 0) {
      this.query(false)
    } else {
      this.getFeatured(false)
    }
  },
  query(nextPage = false, show = false) {
    let that = this
    if (that.data.loading) return
    if (nextPage) {
      if (that.data.list.length > 0 && that.data.list.length === that.data.total) {
        wx.stopPullDownRefresh()
        return
      }
      that.carParams.pageNum += 1
    } else {
      that.carParams.pageNum = 1
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
    this.carParams.userId = app.globalData.userInfo.userId
    app.request({
      method: 'GET',
      url: 'ordershopcart/page',
      data: this.carParams,
      success: (data) => {
        let carList = data.list || []
        if (carList.length == 0) {
          this.getFeatured(false, true)
        } else {
          wx.hideLoading()
          this.setData({
            loading: false,
          })
          let list = []
          carList.forEach(item => {
            list.push({
              id: item.shopId,
              productId: item.productId,
              shopId: item.shopId,
              title: item.productName,
              image: item.smallImage,
              pro_name: item.productSkuName,
              productSkuId: item.productSkuId,
              productSkuIds: item.productSkuIds,
              num: item.quantity,
              price: item.currentPrice,
              selected: false
            })
          })
          this.setData({
            list,
            hasList: true
          })
        }
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: err.message || app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    var that = this;
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    // 获取到商品列表数据
    var list = that.data.list;
    // 默认全选
    that.data.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    list[index].selected = !list[index].selected;
    // 如果数组数据全部为selected[true],全选
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    that.setData({
      list: list,
      selectAllStatus: that.data.selectAllStatus
    })
    // 调用计算金额方法
    that.countPrice();
  },
  // 编辑
  btn_edit: function () {
    var that = this;
    if (bool) {
      that.setData({
        edit_show: "block",
        edit_name: "取消",
        show_edit: "none"
      })
      bool = false;
    } else {
      that.setData({
        edit_show: "none",
        edit_name: "编辑",
        show_edit: "block"
      })
      bool = true;
    }

  },
  // 删除
  deletes: function (e) {
    var that = this;
    // 获取索引
    const index = e.currentTarget.dataset.index;
    const shopId = e.currentTarget.dataset.shopId;
    // 获取商品列表数据
    let list = this.data.list;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading()
          let params = {
            userId: app.globalData.userInfo.userId,
            shopId: shopId
          }
          app.request({
            method: 'POST',
            url: 'ordershopcart/delete',
            data: params,
            success: (data) => {
              wx.hideLoading()
              wx.stopPullDownRefresh()
              that.setData({
                loading: false,
              })
              // 删除索引从1
              list.splice(index, 1);
              // 页面渲染数据
              that.setData({
                list: list
              });
              // 如果数据为空
              if (!list.length) {
                that.setData({
                  hasList: false
                });
              } else {
                // 调用金额渲染数据
                that.countPrice();
              }
            },
            fail: (err) => {
              wx.hideLoading()
              this.setData({
                loading: false
              })
              wx.showToast({
                title: err.message || app.globalData.msgUnknown,
                icon: 'none'
              })
            }
          })
        } else {
          console.log('用户点击取消')
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },



  /**
   * 购物车全选事件
   */
  selectAll(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    // 获取商品数据
    let list = this.data.list;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      list: list
    });
    // 计算金额方法
    this.countPrice();
  },

  /**
   * 绑定加数量事件
   */
  btn_add(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 点击递增
    num = num + 1;
    list[index].num = num;
    // 重新渲染 ---显示新的数量
    this.setData({
      list: list
    });
    wx.showLoading()
    let goodDetail = this.data.list[index]
    let params = {
      userId: app.globalData.userInfo.userId,
      productId: goodDetail.productId,
      shopId: goodDetail.shopId,
      productName: goodDetail.title,
      productSkuId: goodDetail.id,
      productSkuIds: goodDetail.productSkuIds,
      productSkuName: goodDetail.pro_name,
      price: goodDetail.price,
      quantity: num
    }
    app.request({
      method: 'POST',
      url: 'ordershopcart/update',
      data: params,
      success: (data) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.setData({
          loading: false,
        })
        // 计算金额方法
        this.countPrice();
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: err.message || app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },

  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    //   // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // const obj = e.currentTarget.dataset.obj;
    // console.log(obj);
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 判断num小于等于1  return; 点击无效
    if (num <= 1) {
      return false;
    }
    // else  num大于1  点击减按钮  数量--
    num = num - 1;
    list[index].num = num;
    // 渲染页面
    this.setData({
      list: list
    });
    let goodDetail = this.data.list[index]
    wx.showLoading()
    let params = {
      userId: app.globalData.userInfo.userId,
      productId: goodDetail.productId,
      shopId: goodDetail.shopId,
      productName: goodDetail.title,
      productSkuId: goodDetail.id,
      productSkuIds: goodDetail.productSkuIds,
      productSkuName: goodDetail.pro_name,
      price: goodDetail.price,
      quantity: num
    }
    app.request({
      method: 'POST',
      url: 'ordershopcart/update',
      data: params,
      success: (data) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.setData({
          loading: false,
        })
        // 计算金额方法
        this.countPrice();
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: err.message || app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },
  // 提交订单
  btnSubmitOrder: function () {
    var that = this;
    console.log(that.data.totalPrice);
    let list = that.data.list || []
    let choiceList = []
    list.forEach(item => {
      if (item.selected) {
        choiceList.push(item)
      }
    })
    wx.setStorageSync('cartList', choiceList)
    if (choiceList.length > 0 && that.data.totalPrice > 0) {
      wx.navigateTo({
        url: './checkout?totalPrice=' + that.data.totalPrice,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: "请至少选中一个商品",
      })
    }
    // 调起支付
    // wx.requestPayment(
    //   {
    //     'timeStamp': '',
    //     'nonceStr': '',
    //     'package': '',
    //     'signType': 'MD5',
    //     'paySign': '',
    //     'success': function (res) { },
    //     'fail': function (res) { },
    //     'complete': function (res) { }
    //   })
  },
  // 收藏
  btn_collert: function () {
    wx.showToast({
      title: '收藏暂未开发',
      duration: 2000
    })
  },
  /**
   * 计算总价
   */
  countPrice() {
    // 获取商品列表数据
    let list = this.data.list;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].num * list[i].price;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      list: list,
      totalPrice: total.toFixed(2)
    });
  },
  //手指触摸动作开始 记录起点X坐标

  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.list.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
    })

  },

  //滑动事件处理

  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.list.forEach((v, i) => {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) { //右滑
          v.isTouchMove = false
        } else { //左滑
          v.isTouchMove = true
        }
      }
    })
    //更新数据
    that.setData({
      list: that.data.list
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */

  angle(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  // 精选
  getFeatured(nextPage = false, show = false) {
    let that = this
    if (nextPage) {
      if (that.data.productList.length > 0 && that.data.productList.length === that.data.productTotal) {
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
    app.request({
      method: 'GET',
      url: 'product/page',
      data: this.params,
      success: (data) => {
        wx.hideLoading()
        this.setData({
          loading: false,
          hasList: false
        })
        let list = data.list || []
        this.setData({
          productList: [...list, ...this.data.productList],
          productTotal: data.total
        })
      },
      fail: (err) => {
        wx.hideLoading()
        this.setData({
          loading: false
        })
        wx.showToast({
          title: err.message || app.globalData.msgUnknown,
          icon: 'none'
        })
      }
    })
  },
  goShopping() {
    wx.switchTab({
      url: '/pages/home/index'
    })
  }
})