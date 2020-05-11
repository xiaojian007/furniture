// components/skulist/sku.js
//获取应用实例
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detail: {
      type: Object,
      value: {}
    },
    isShowSku: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.setValue()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodDetail: {},
    productId: 0,
    typeName: '',
    name: '',
    goodsNum: 1, // 数量
    skuId: '', // skuid  购物车 使用
    skuIdList: [], // 选中的id
    skuGroup: [], // 规格数据
    skuList: [], // sku数据
  },
  ready: function () {
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setValue() {
      let productDetail = this.data.detail
      let goodDetail = {
        pic: productDetail.smallImage,
        attributePrice: productDetail.price,
        stock: productDetail.stock
      }
      let productId = productDetail.productId // 商品id
      let typeName = productDetail.typeFirstName + '/' + productDetail.typeSecondName
      let name = productDetail.name
      let skuGroup = []
      let skuList = []
      let allAttrList = productDetail.allAttrList || []
      let attrList = productDetail.attrList || []
      allAttrList.forEach(item => {
        skuList.push(
          {
            id: item.id,
            skuId: item.attributeIds,
            attributeIds: item.attributeIds,
            attributeNameList: item.attributeNameList,
            attributePrice: item.attributePrice,
            pic: productDetail.smallImage,
            stocks: item.attributeStock,
            skuName: item.attributeNameList,
          }
        )
      })
      let skuIdList = []
      attrList.forEach(item => {
        let skuGroupItem = {
          id: item.skuId,
          name: item.skuName,
          child: []
        }
        let childSku = item.productSkuAttrList || []
        childSku.forEach(itemChild => {
          let productSkuAttrList = {
            id: itemChild.skuId,
            check: false,
            name: itemChild.skuName
          }
          skuGroupItem.child.push(productSkuAttrList)
        })
        skuGroup.push(skuGroupItem)
        skuIdList.push('')
      })

      this.setData({
        goodDetail,
        skuGroup,
        skuList,
        skuIdList,
        typeName,
        name,
        productId
      })
    },
    /**
     * 增加商品数量
     */
    up() {
      this.setData({
        goodsNum: ++this.data.goodsNum
      })
    },

    /**
     * 减少商品数量
     */
    down() {
      if (this.data.goodsNum > 1) {
        this.setData({
          goodsNum: --this.data.goodsNum
        });
      }
    },
    /**
     * 商品sku时触发
     */
    choiseType(e) {
      let id = app.getEventDataset(e).id
      let index = app.getEventDataset(e).index
      let childIndex = app.getEventDataset(e).childIndex
      let skuGroup = this.data.skuGroup
      skuGroup[index].child.forEach((item, skuIndex) => {
        skuGroup[index].child[skuIndex].check = false
      })
      skuGroup[index].child[childIndex].check = true
      let skuIdList = this.data.skuIdList
      skuIdList[index] = id
      this.setData({
        skuGroup,
        skuIdList
      })
      this.getSkuPriceAndStock()
    },
    /**
     * 获取sku库存和价格
     */
    getSkuPriceAndStock() {
      let skuList = this.data.skuList
      let skuIdList = this.data.skuIdList
      // 判断是否全部sku都选择了
      let isAllcheck = skuIdList.some((item) => {
        return item === ""
      })
      if (!isAllcheck) {
        let checkSkuIdString = skuIdList.join(',')
        skuList.forEach((skuItem) => {
          if (skuItem == checkSkuIdString) {
            console.log(skuItem)
          }
          let skuIds = skuItem.skuId.split(',')
          if (skuIds.length == skuIdList.length) {
            let skuFind = []
            skuIds.forEach((idItem) => {
              let hasSkuId = skuIdList.some((skuId) => {
                return skuId == idItem
              })
              skuFind.push(hasSkuId)
            })

            let isSkuItem = skuFind.every((bool) => {
              return bool
            })
            if (isSkuItem) {
              console.log(skuItem)
              let goodDetail = {
                id: skuItem.id,
                skuId: skuItem.attributeIds,
                attributeNameList: skuItem.attributeNameList,
                attributeIds: skuItem.attributeIds,
                attributePrice: skuItem.attributePrice,
                stock: skuItem.stocks,
                pic: skuItem.pic
              }
              console.log(goodDetail)
              let skuId = skuItem.skuId
              this.setData({
                goodDetail,
                skuId
              })
            }

          }
        })
      } else {
        console.log('做库存没有不可选')
      }
    },
    /**
     * 添加购物车
     */
    addCar() {
      let that = this
      if (that.data.goodDetail.attributeIds) {
        if (that.data.goodDetail.stock <= 0) {
          wx.showToast({
            title: '库存不足，请联系管理员',
            icon: 'none',
            duration: 1000
          })
          return
        }
        wx.showLoading({
          title: '添加中',
        })
        let params = {
          userId: app.globalData.userInfo.userId,
          productId: that.data.productId,
          productName: that.data.name,
          productSkuId: that.data.goodDetail.id,
          productSkuIds: that.data.goodDetail.attributeIds,
          productSkuName: that.data.goodDetail.attributeNameList,
          price: that.data.goodDetail.attributePrice,
          quantity: that.data.goodsNum
        }
        app.request({
          method: 'POST',
          url: 'ordershopcart/save',
          data: params,
          success: (data) => {
            wx.hideLoading()
            wx.stopPullDownRefresh()
            this.setData({
              loading: false,
            })
            wx.showToast({
              title: '已加入购物车',
              duration: 1000
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
      } else {
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 1000
        })
      }
    }
  }
})
