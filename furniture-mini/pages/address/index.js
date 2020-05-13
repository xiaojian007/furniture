let app = getApp();

Page({
  data: {
    list: [],
    total: 0,
    default_id: null,
  },
  params: {
    pageNum: 1,
    userId: app.globalData.userInfo.userId,
    pageSize: 10
  },
  onLoad: function (options) {
    // 当前页面参数
    this.data.options = options;
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    this.getAddressList(true)
  },

  onShow: function () {
    // 获取收货地址列表
    app.loginCheck(this, () => {
      this.getAddressList(false, true);
    }, false)
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    this.getList(false)
  },
  /**
   * 获取收货地址列表
   */
  getAddressList: function (nextPage = false, show = false) {
    let that = this
    if (that.data.loading) return
    if (nextPage) {
      if (that.data.list.length > 0 && that.data.list.length === that.data.total) {
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
      url: 'receiveAddress/page',
      data: that.params,
      success: (data) => {
        wx.hideLoading()
        wx.stopPullDownRefresh()
        this.setData({
          loading: false,
        })
        let addressList = data.list || []
        let list = []
        addressList.forEach(item => {
          let areaName = !item.areaName ? [] : item.areaName.split('-')
          list.push({
            name: item.receiver,
            phone: item.receiverPhone,
            isDefault: item.isDefault,
            adress: {
              city: areaName[1],
              region: areaName[2],
              province: areaName[0],
              detail: item.addressName,
            },
            addressId: item.addressId
          })
        })
        that.setData({
          list: nextPage ? [...that.data.list, ...list] : list,
          total: data.total
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
      url: "./create?addressId=" + e.currentTarget.dataset.id
    });
  },

  /**
   * 移除收货地址
   */
  removeAddress: function (e) {
    let that = this;
    console.log(app.getEventDataset(e))
    let addressId = app.getEventDataset(e).id;
    wx.showModal({
      title: "提示",
      content: "您确定要移除当前收货地址吗?",
      success: function (o) {
        if (o.confirm) {
          let params = {
            addressId: addressId,
            userId: app.globalData.userInfo.userId
          }
          wx.showLoading()
          app.request({
            method: 'POST',
            url: 'receiveAddress/delete',
            data: params,
            success: (data) => {
              wx.hideLoading()
              wx.stopPullDownRefresh()
              that.setData({
                loading: false,
              })
              wx.showToast({
                title: '删除成功！',
                icon: 'none',
                duration: 1000
              })
              that.onShow()
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
        } else {
          console.log('取消删除地址')
        }
      }
    });
  }

});