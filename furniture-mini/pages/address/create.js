let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false, // 快捷导航
    defaultAddress: false, // 是否默认地址
    switchColor: '#000',
    name: '',
    region: [],
    areaId: '',
    phone: '',
    detail: '',
    addressId: '',
    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.addressId) {
      this.setData({
        addressId: options.addressId
      })

      app.loginCheck(this, () => {
        // 获取当前地址信息
        this.getAddressDetail(options.addressId);
      }, false)
    }
  },
  /**
   * 获取当前地址信息
   */
  getAddressDetail: function (addressId) {
    let that = this;
    wx.showLoading()
    let params = {
      addressId: addressId,
      userId: app.globalData.userInfo.userId
    }
    app.request({
      method: 'POST',
      url: 'receiveaddress/detail',
      data: params,
      success: (data) => {
        wx.hideLoading()
        that.setData({
          loading: false,
          defaultAddress: data.isDefault == 1 ? true : false, // 是否默认地址
          name: data.receiver,
          region: data.areaName.split('-'),
          phone: data.receiverPhone,
          detail: data.addressName,
          addressId: data.addressId
        })
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
  /**
   * 表单提交
   */
  saveData: function (e) {
    let that = this,
      values = e.detail.value
    values.region = that.data.region;


    // 表单验证
    if (!that.validation(values)) {
      app.showError(that.data.error);
      return false;
    }

    // 按钮禁用
    that.setData({
      disabled: true
    });

    let params = {
      addressName: values.detail,
      areaName: this.data.region.join('-'),
      areaId: this.data.areaId,
      receiverPhone: values.phone,
      isDefault: this.data.defaultAddress ? 1 : 0,
      receiver: values.name,
      userId: app.globalData.userInfo.userId,
      openid: app.globalData.openid
    }
    wx.showLoading()
    if (this.data.addressId) {
      params['addressId'] = this.data.addressId
    }
    app.request({
      method: 'POST',
      url: this.data.addressId ? 'receiveaddress/update' : 'receiveaddress/save',
      data: params,
      success: (data) => {
        wx.hideLoading()
        this.setData({
          loading: false,
        })
        wx.showToast({
          title: this.data.addressId ? '修改成功' : '添加成功',
          duration: 1000
        })
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1000)
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

  /**
   * 表单验证
   */
  validation: function (values) {
    if (values.name === '') {
      this.data.error = '收件人不能为空';
      return false;
    }
    if (values.phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (!this.data.region) {
      this.data.error = '省市区不能空';
      return false;
    }
    if (values.detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    return true
  },

  /**
   * 修改地区
   */
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      areaId: e.detail.postcode
    })
  },

  switchDefault(e) {
    this.setData({
      defaultAddress: e.detail.value
    })
  }
})