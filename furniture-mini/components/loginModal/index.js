// components/loginModal/index.js
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        newVal && this.showModal()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalName: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal() {
      this.setData({
        modalName: 'DialogModal1'
      })
    },
    hideModal(e) {

      this.triggerEvent('cancel')
      this.setData({
        modalName: null
      })
    },

    // 授权登录
    bindGetUserInfo() {
      var that = this;
      //获取用户信息
      wx.getUserInfo({
        success: function (res) {
          app.updateUserInfo(res.userInfo, (data) => {
            if (data.openid) {
              that.triggerEvent('confirm')
              that.setData({
                modalName: null
              })
            } else {
              console.log('更新用户信息失败')
            }
          })
        }
      })
    }
  }
})
