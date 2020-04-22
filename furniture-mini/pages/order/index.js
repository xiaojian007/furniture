let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 'all',
    list: [{
      goods: [{
        image: {
          file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png'
        }
      },{
        image: {
          file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png'
        }
      },{
        image: {
          file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png'
        }
      },{
        image: {
          file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png'
        }
      },{
        image: {
          file_path: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png'
        }
      }],
      order_no: 555666444,
      create_time: '2020-12-12 12:12:12',
      delivery_status: {
        text: '你好'
      },
      order_status:{
        text: '你奶奶'
      }
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.dataType = options.type || 'all';
    this.setData({ dataType: this.data.dataType });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList(this.data.dataType);
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (dataType) {
    let _this = this;
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ dataType: e.target.dataset.type });
    // 获取订单列表
    this.getOrderList(e.target.dataset.type);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', { order_id }, function (result) {
            _this.getOrderList(_this.data.dataType);
          });
        }
      }
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/receipt', { order_id }, function (result) {
            _this.getOrderList(_this.data.dataType);
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('user.order/pay', { order_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          // 跳转到已付款订单
          wx.navigateTo({
            url: '../order/detail?order_id=' + order_id
          });
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 跳转订单详情页
   */
  detail: function (e) {
    let order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail?order_id=' + order_id
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }


});