let app = getApp();

Page({
  data: {
    list: [{
      name: '李健',
      phone: '16622221111',
      default: 1,
      fff: {
        city: '合肥市',
        region: '明行情',
        province: '安徽省',
      },
      address_id: '2',
      detail: '看到沙发上看的很疯狂世界的',
    }, {
      name: '李健',
      default: 2,
      phone: '16622221111',
      fff: {
        city: '合肥市',
        region: '明行情',
        province: '安徽省',
      },
      address_id: '1',
      detail: '看到沙发上看的很疯狂世界的',
    }, {
      name: '李健',
      phone: '16622221111',
      fff: {
        city: '合肥市',
        region: '明行情',
        province: '安徽省',
      },
      address_id: '3',
      detail: '看到沙发上看的很疯狂世界的',
    }, {
      name: '李健',
      phone: '16622221111',
      fff: {
        city: '合肥市',
        region: '明行情',
        province: '安徽省',
      },
      address_id: '4',
      detail: '看到沙发上看的很疯狂世界的',
    }],
    default_id: null,
  },

  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
  },

  onShow: function () {
    // 获取收货地址列表
    // this.getAddressList();
  },

  /**
   * 获取收货地址列表
   */
  getAddressList: function () {
    let _this = this;
    app._get('address/lists', {}, function (result) {
      _this.setData(result.data);
    });
  },

  /**
   * 添加新地址
   */
  createAddress: function () {
    wx.navigateTo({
      url: './create'
    });
  },

  /**
   * 编辑地址
   */
  editAddress: function (e) {
    wx.navigateTo({
      url: "./detail?address_id=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function (e) {
    let _this = this,
      address_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function (o) {
        o.confirm && App._post_form('address/delete', {
          address_id
        }, function (result) {
          _this.getAddressList();
        });
      }
    });
  }

});