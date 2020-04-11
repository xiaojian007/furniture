// components/homelist/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    typeId: {
      type: Number | String,
      value: 0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    params: {
      currentPage: 1,
      pageSize: 10
    },
    list: []
  },
  observers: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    scrollTolower() {
      let currentPage = this.data.params.currentPage
      currentPage = currentPage + 1
      this.setData({
        params: {
          currentPage: currentPage
        }
      })
      console.log(this.data.params.currentPage)
    },
    query() {
      if (this.data.list.length > 0) {
        return
      }
      console.log(this.data.typeId)
      let list = [{
        id: 0,
        name: '情感'
      }, {
        id: 1,
        name: '情感'
      }, {
        id: 2,
        name: '情感'
      }, {
        id: 3,
        name: '情感'
      }, {
        id: 4,
        name: '情感'
      }, {
        id: 5,
        name: '情感'
      }, {
        id: 6,
        name: '情感'
      }]
      console.log(222222)
      setTimeout(() => {
        this.setData({
          list
        })
      }, 200)
    }
  }
})