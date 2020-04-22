//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuthorize: false,
    goods_list: [{
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,
      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,
      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }, {
      goods_id: 1,
      goods_sku_id: 2,
      total_num: 2,
      checked: true,
      file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      goods_price: 2222,

      goods_sku: {
        id: '1,2',
        goods_attr: '黑色，180',
      },
      goods_name: '小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强小强',
    }], // 商品列表
    order_total_num: 0,
    order_total_price: 1333.33,


    startX: 0, //开始坐标
    startY: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this;
    app.loginCheck(that, () => {
      app.authSettingCheck((boolean) => {
        that.setData({
          isAuthorize: boolean
        })
      })
    }, false)
  },

  /**
   * 获取购物车列表
   */
  getCartList() {
    let _this = this;
    App._get('cart/lists', {}, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 递增指定的商品数量
   */
  addCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list[index],
      order_total_price = _this.data.order_total_price;
    // 后端同步更新
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    App._post_form('cart/add', {
      goods_id: goods.goods_id,
      goods_num: 1,
      goods_sku_id: goodsSkuId
    }, () => {
      goods.total_num++;
      _this.setData({
        ['goods_list[' + index + ']']: goods,
        order_total_price: _this.mathadd(order_total_price, goods.goods_price)
      });
    });
  },

  /**
   * 递减指定的商品数量
   */
  minusCount(e) {
    let _this = this,
      index = e.currentTarget.dataset.index,
      goodsSkuId = e.currentTarget.dataset.skuId,
      goods = _this.data.goods_list[index],
      order_total_price = _this.data.order_total_price;

    if (goods.total_num > 1) {
      // 后端同步更新
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      App._post_form('cart/sub', {
        goods_id: goods.goods_id,
        goods_sku_id: goodsSkuId
      }, () => {
        goods.total_num--;
        goods.total_num > 0 &&
          _this.setData({
            ['goods_list[' + index + ']']: goods,
            order_total_price: _this.mathsub(order_total_price, goods.goods_price)
          });
      });

    }
  },

  /**
   * 购物车结算
   */
  submit(t) {
    wx.navigateTo({
      url: '../flow/checkout?order_type=cart'
    });
  },

  /**
   * 加法
   */
  mathadd(arg1, arg2) {
    return (Number(arg1) + Number(arg2)).toFixed(2);
  },

  /**
   * 减法
   */
  mathsub(arg1, arg2) {
    return (Number(arg1) - Number(arg2)).toFixed(2);
  },

  /**
   * 去购物
   */
  goShopping() {
    wx.switchTab({
      url: '/pages/home/index',
    });
  },

  //手指触摸动作开始 记录起点X坐标

  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.goods_list.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      goods_list: this.data.goods_list
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
    that.data.goods_list.forEach((v, i) => {
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
      goods_list: that.data.goods_list
    })
  },

  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */

  angle (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除商品

  remove (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    wx.showModal({
      title: '温馨提示！',
      content: '你确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('444')
          goods_list.splice(index, 1)
          that.setData({
            goods_list: goods_list
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })


  },

  //选择商品
  checkboxChange(e) {
    console.log(e)
    debugger
  }

})