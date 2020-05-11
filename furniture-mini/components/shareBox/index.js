Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    },
    detail: {
      type: Object,
      value: {}
    }
  },
  data: {
    isModal: false, //是否显示拒绝保存图片后的弹窗
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    visible: false
  },
  methods: {
    handlePhotoSaved() {
      this.savePhoto(this.data.sharePath)
    },
    handleClose() {
      this.setData({
        visible: false
      })
    },
    drawPic() {
      
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData')
        return
      }
      wx.showLoading({
        title: '生成中'
      })
      let detail = this.data.detail || {}
      this.setData({
        imgDraw: {
          width: '750rpx',
          height: '1324rpx',
          background: 'http://cloud.pack.ininin.com/1ce12d663a9ce4ae1b6eb2bd614f8a44',
          views: [
            {
              type: 'image',
              url: detail.smallImage ? detail.smallImage : 'https://qiniu-image.qtshe.com/1560248372315_467.jpg',
              css: {
                top: '205rpx',
                left: '125rpx',
                right: '67rpx',
                width: '558rpx',
                height: '561rpx',
                borderRadius: '2rpx'
              },
            },
            {
              type: 'image',
              url: wx.getStorageSync('avatarUrl') || 'https://qiniu-image.qtshe.com/default-avatar20170707.png',
              css: {
                top: '1004rpx',
                left: '125rpx',
                width: '46rpx',
                height: '46rpx',
                borderRadius: '46rpx'
              }
            },
            {
              type: 'text',
              text: '¥ '+detail.price,
              css: {
                top: '877rpx',
                fontSize: '34rpx',
                left: '130rpx',
                align: 'left',
                color: '#F0563C'
              }
            },
            {
              type: 'text',
              text: detail.name ? detail.name : `汀·西海岸/Capture One16919实木双...`,
              css: {
                top: '806rpx',
                left: '125rpx',
                align: 'left',
                fontSize: '28rpx',
                color: '#333333'
              }
            },
            {
              type: 'text',
              text: `汀·西海岸微商城`,
              css: {
                top: '1028rpx',
                left: '205rpx',
                maxLines: 1,
                align: 'left',
                fontSize: '20rpx',
                color: '#fff'
              }
            },
            {
              type: 'image',
              url: 'https://qiniu-image.qtshe.com/20190605index.jpg', // 二维码
              css: {
                top: '1010rpx',
                right: '67rpx',
                width: '120rpx',
                height: '120rpx'
              }
            }
          ]
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
    },
    onImgOK(e) {
      console.log(e.detail.path)
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData')
    },
    preventDefault() { },
    // 保存图片
    savePhoto(path) {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      this.setData({
        isDrawImage: false
      })
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
          }, 300)
        },
        fail: (res) => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting['scope.writePhotosAlbum']) {
                this.setData({
                  isModal: true
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
          }, 300)
        }
      })
    }
  }
})
