//测试
// const API_URL = 'http://192.168.1.103:8080/'
//const H5_URL = ''
//正式
const API_URL = 'http://47.101.209.229:8080/'
const H5_URL = ''
/**
 * tabBar页面路径列表 (用于链接跳转时判断)
 * tabBarLinks为常量, 无需修改
 */
const tabBarLinks = [
  'pages/home/index',
  'pages/find/index',
  'pages/shopping-cart/shopping',
  'pages/my/index'
];
const util = require('utils/util.js')
//app.js
App({
  loginChecking: false, //登录检查完毕
  isShowNewPage: false, //是否是弹出页面
  parentUserId: 0,
  onLaunch: function (options) {
    // this.clearAuth() // 清除缓存
    if (options.query.userId) {
      this.parentUserId = options.query.userId
    }
    console.log('app.onLaunch', options)
  },
  /**
   * 设置表单数据
   */
  setFormData(form, data) {
    form = form || {}
    data = data || {}
    Object.keys(form).forEach((key) => {
      let val = data[key]
      let type = typeof val
      if (typeof (val) === 'string') {
        val = val.trim()
      }
      if (typeof (val) !== 'object') {
        if (val === null) {
          form[key] = null
        } else if (type !== 'undefined') {
          form[key] = val
        }
      }
    })
    return form
  },
  /**
   * 获取表单参数
   */
  getEventFormData(e) {
    let data = {}
    if (e && e.detail) {
      let formData = e.detail.value || {}
      Object.keys(formData).forEach((key) => {
        if (typeof formData[key] === 'string') {
          data[key] = formData[key].trim()
        } else {
          data[key] = formData[key]
        }
      })
    }
    return data
  },
  /**
 * 获取tabBar页面路径列表
 */
  getTabBarLinks() {
    return tabBarLinks;
  },

  /**
   * 获取事件参数
   */
  getEventDataset(e) {
    let data = {}
    if (e && e.currentTarget) {
      data = e.currentTarget.dataset
    }
    return data
  },


  /**
   * 设置登录信息
   * @params {Object} data 用户信息
   */
  setAuth(data) {
    this.loginChecking = true
    data = data || {}
    this.globalData.token = data.openid || ''
    this.setFormData(this.globalData.userInfo, data)
    this.globalData.userInfo.userId = data.userId || ''
    this.globalData.userInfo.openId = data.openid || ''
    this.setStorage(this.globalData.STORAGE_KEY_TOKEN, data)
  },


  /**
   * 清除登录信息
   */
  clearAuth() {
    this.setStorage(this.globalData.STORAGE_KEY_TOKEN, {}, () => {
      this.globalData.token = ''
    })
    this.globalData.token = ''
  },


  /**
   * 发送请求
   */
  request: function (opts, isCheckToken = true) {
    let that = this
    console.log('token=>', this.globalData.token)
    if (isCheckToken && !this.globalData.token) {
      wx.hideNavigationBarLoading()
      wx.hideLoading()
    } else {
      let header = {}
      if (this.globalData.token) {
        header['X-Auth-Token'] = this.globalData.token
      }
      header['content-type'] = 'application/json'
      Object.assign(header, opts.header)
      opts.header = header
      let options = Object.assign({}, opts)
      if (opts.url.indexOf('https://') === -1) {
        options.url = API_URL + opts.url
      }
      options.data = options.data || {}
      options.success = function (res) {
        if (res.data.code === '200') {
          opts.success && opts.success(res.data.body)
        } else if (res.data.code === '404') {
          that.setAuth()
          that.setStorage(that.globalData.STORAGE_KEY_TOKEN, () => {
            opts.fail && opts.fail(res.data)
          })
        } else if (res.data.code === '500') {
          opts.fail && opts.fail(res.data)
        } else {
          opts.fail && opts.fail(res.data)
        }
      }
      options.fail = function (res) {
        opts.fail && opts.fail(res)
      }
      options.complete = function (res) {
        opts.complete && opts.complete(res)
        wx.hideNavigationBarLoading()
      }
      wx.showNavigationBarLoading()
      wx.request(options)
    }
  },

  /**
   * 登录检查
   * @param {pageObj} 组件页面的this
   * @param {callback} 回调函数
   * @param {isUser} 是否从分享进来的
   * 登录检查
   */
  loginCheck(pageObj, callback, isUser = true) {
    let that = this
    that.getStorage(that.globalData.STORAGE_KEY_TOKEN, (data) => {
      // 写死的用户信息
      // data = {
      //   token: "cc8290fe-1e83-4fd3-91c5-4be4746025a2",
      //   openid: "cc8290fe-1e83-4fd3-91c5-4be4746025a2",
      //   userId: "cc8290fe-1e83-4fd3-91c5-4be4746025a2",
      // }
      if (data && data.openid) {
        const setUserInfo = (() => {
          that.setAuth(data)
          pageObj.setData({
            loginChecking: that.loginChecking
          })
          callback()
        })
        if (isUser) {
          that.request({
            url: 'wechat/saveUserInfo',
            method: 'POST',
            data: {
              userId: that.globalData.userInfo.userId,
              openid: that.globalData.token
            },
            success: ((res) => {
              data = res
              setUserInfo()
            }),
            fail: ((err) => {
              debugger
              console.log('获取用户信息报错原因', err)
            })
          })
        } else {
          setUserInfo()
        }
      } else {
        that.wxLogin(() => {
          pageObj.setData({
            loginChecking: that.loginChecking
          })
          callback()
        })
      }
    })
  },


  /**
   * 授权检查
   */
  authSettingCheck(callback) {
    let that = this
    wx.getSetting({
      success(res) {
        console.log('authSetting 授权检查' + res.authSetting['scope.userInfo'])
        if (res.authSetting && res.authSetting['scope.userInfo']) {
          callback(true)
        } else {
          callback(false)
        }
      },
      fail(err) {
        console.log('authSetting 授权检查失败' + err)
        callback(false)
      }
    })
  },

  /**
   * 登录
   */
  wxLogin(callback) {
    wx.showLoading({
      title: '加载中'
    })
    this.loginChecking = false
    wx.login({
      success: (res) => {
        if (res.code) {
          this.request({
            method: 'POST',
            url: 'wechat/getOpenId',
            data: {
              code: res.code,
              fromUserId: this.globalData.shareCode,
              platform: 'MINI_PROGRAM'
            },
            success: (data) => {
              let loginData = {
                token: data.openid,
                openid: data.openid,
                userId: data.userId
              }
              // 是否是分享进来的
              if(this.parentUserId !== 0) {
                this.userGrade(data.userId)
              }
              this.setAuth(loginData)
              wx.hideLoading()
              console.log('登录成功', data)
              callback(data)
            },
            fail: (err) => {
              console.log('登录失败', err)
              this.loginFail(err)
              callback(err)
            }
          }, false)
        } else {
          this.loginFail(res)
          callback({})
        }
      },
      fail: (err) => {
        console.log(err)
        this.loginFail(err)
        callback({})
      }
    })
  },
  /**
   * 分享进入绑定登记
   */
  userGrade(childUserId) {
    this.request({
      method: 'POST',
      url: 'usergrade/save',
      data: {
        childUserId: childUserId,
        parentUserId: this.parentUserId
      },
      success: (data) => {
        console.log(data)
      },
      fail: (err) => {
        console.log('登录失败', err)
      }
    }, false)
  },
  /**
   * 更新用户信息
   */
  updateUserInfo(info, callback) {
    let params = {
      avatarUrl: info.avatarUrl,
      city: info.city,
      language: info.language,
      nickName: info.nickName,
      province: info.province,
      country: info.country,
      openid: this.globalData.userInfo.openId,
      userId: this.globalData.userInfo.userId
    }
    wx.showLoading()
    this.request({
      method: 'POST',
      url: 'wechat/saveUserInfo',
      data: params,
      success: (data) => {
        // this.globalData.userInfo.avatarUrl = data.avatarUrl || ''
        // this.globalData.userInfo.city = data.city || ''
        // this.globalData.userInfo.province = data.province || ''
        // this.globalData.userInfo.country = data.country || ''
        // this.globalData.userInfo.nickName = data.nickName || ''
        // this.globalData.userInfo.language = data.language || ''
        wx.hideLoading()
        this.setAuth(data)
        console.log('修改成功', data)
        callback(data)
      },
      fail: (err) => {
        console.log('修改失败', err)
        callback(err)
      }
    }, false)
  },
  /**
   * 检查是否通过分享进入
   */
  checkInviteCode(invitCode) {
    return invitCode != '' && invitCode != null
  },

  /**
   * 获取登录用户邀请码(用户id)
   */
  getInviteCode() {
    if (this.globalData.user) {
      return this.globalData.user.userId || 0 // 0 为自己
    }
    return 0
  },
  /**
   * 登录失败
   */
  loginFail() {
    wx.hideLoading()
    this.showError('系统维护中...', () => { })
    this.loginChecking = false
  },
  /**
   * 显示成功提示框
   * @params {string} msg 成功的文字
   * callback 回调
   */
  showSuccess(msg, callback) {
    wx.showToast({
      title: msg,
      icon: 'success',
      success() {
        callback && (setTimeout(() => {
          callback();
        }, 1500));
      }
    });
  },
  /**
   * 显示失败提示框
   */
  showError(msg, callback) {
    wx.showModal({
      title: '友情提示',
      content: msg,
      showCancel: false,
      success(res) {
        callback && callback();
      }
    });
  },


  /**
   * 验证登录 . todo
   */
  checkIsLogin() {
    return this.globalData.token ? true : false
    // return wx.getStorageSync('token') != '' && wx.getStorageSync('user_id') != '';
  },

  /**
   * 设置本地缓存
   * @param {key} 缓存名
   * @param {value} 缓存名纯存的缓存内容
   * @return {Object} 回调
   */
  setStorage(key, value, callback) {
    wx.setStorage({
      key: key,
      data: value,
      complete: () => {
        if (typeof callback === 'function') {
          callback(key, value)
        }
      }
    })
  },

  /**
   * 获取本地缓存
   * @param {key} 缓存名
   * @return {Object} 缓存名下缓存内容
   */
  getStorage(key, callback) {
    wx.getStorage({
      key: key,
      complete: (res) => {
        if (typeof callback === 'function') {
          callback(res.data)
        }
      }
    })
  },

  globalData: {
    STORAGE_KEY_TOKEN: 'tps-token', //登录信息本地缓存KEY
    token: '', //登录标识
    userInfo: {
      userId: '',
      openId: '',
      avatarUrl: "",
      city: "",
      country: "",
      gender: 0,
      language: "",
      discountNum: 0,
      nickName: "",
      province: "",
      unionid: "",
      moblie: ''
    },
    msgUnknown: '网络不稳定，请稍后重试！'
  }
})