var numbers = 1;
var bool = true;
Page({
  data: {
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
    // list: [],               // 购物车列表
    // hasList: false,          // 列表是否有数据
    // 默认展示数据
    hasList: true,
    // 商品列表数据
    list: [{
      id: 1,
      title: '园艺大师抗皱精华露园艺大师抗皱精华露园艺大师抗皱精华露',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "30ml",
      num: 1,
      price: 180,
      selected: true
    },
    {
      id: 2,
      title: '伊芙琳玫瑰护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "25g",
      num: 1,
      price: 62,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    },
    {
      id: 2,
      title: '燕麦山羊乳舒缓护手霜',
      image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586600782721&di=98630207a9dd72bf14dd816c5d526888&imgtype=0&src=http%3A%2F%2Fm.tuniucdn.com%2Ffb2%2Ft1%2FG2%2FM00%2FAF%2F3F%2FCii-T1gA04iIcXfZABp5vaXUmGYAADY2wOtpLIAGnnV994_w500_h280_c1_t0.png',
      pro_name: "75ml",
      num: 1,
      price: 175,
      selected: true
    }
    ],
    // 金额
    totalPrice: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: true, // 全选状态，默认全选


    startX: 0, //开始坐标
    startY: 0
  },

  onShow() {
    wx.showToast({
      title: '加载中',
      icon: "loading",
      duration: 1000
    })

    // 价格方法
    this.count_price();
  },
  /**
   * 当前商品选中事件
   */
  selectList(e) {
    var that = this;
    // 获取选中的radio索引
    var index = e.currentTarget.dataset.index;
    // 获取到商品列表数据
    var list = that.data.list;
    // 默认全选
    that.data.selectAllStatus = true;
    // 循环数组数据，判断----选中/未选中[selected]
    list[index].selected = !list[index].selected;
    // 如果数组数据全部为selected[true],全选
    for (var i = list.length - 1; i >= 0; i--) {
      if (!list[i].selected) {
        that.data.selectAllStatus = false;
        break;
      }
    }
    // 重新渲染数据
    that.setData({
      list: list,
      selectAllStatus: that.data.selectAllStatus
    })
    // 调用计算金额方法
    that.count_price();
  },
  // 编辑
  btn_edit: function () {
    var that = this;
    if (bool) {
      that.setData({
        edit_show: "block",
        edit_name: "取消",
        show_edit: "none"
      })
      bool = false;
    } else {
      that.setData({
        edit_show: "none",
        edit_name: "编辑",
        show_edit: "block"
      })
      bool = true;
    }

  },
  // 删除
  deletes: function (e) {
    var that = this;
    // 获取索引
    const index = e.currentTarget.dataset.index;
    // 获取商品列表数据
    let list = this.data.list;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          // 删除索引从1
          list.splice(index, 1);
          // 页面渲染数据
          that.setData({
            list: list
          });
          // 如果数据为空
          if (!list.length) {
            that.setData({
              hasList: false
            });
          } else {
            // 调用金额渲染数据
            that.count_price();
          }
        } else {
          console.log(res);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },



  /**
   * 购物车全选事件
   */
  selectAll(e) {
    // 全选ICON默认选中
    let selectAllStatus = this.data.selectAllStatus;
    // true  -----   false
    selectAllStatus = !selectAllStatus;
    // 获取商品数据
    let list = this.data.list;
    // 循环遍历判断列表中的数据是否选中
    for (let i = 0; i < list.length; i++) {
      list[i].selected = selectAllStatus;
    }
    // 页面重新渲染
    this.setData({
      selectAllStatus: selectAllStatus,
      list: list
    });
    // 计算金额方法
    this.count_price();
  },

  /**
   * 绑定加数量事件
   */
  btn_add(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 点击递增
    num = num + 1;
    list[index].num = num;
    // 重新渲染 ---显示新的数量
    this.setData({
      list: list
    });
    // 计算金额方法
    this.count_price();
  },

  /**
   * 绑定减数量事件
   */
  btn_minus(e) {
    //   // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // const obj = e.currentTarget.dataset.obj;
    // console.log(obj);
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    // 判断num小于等于1  return; 点击无效
    if (num <= 1) {
      return false;
    }
    // else  num大于1  点击减按钮  数量--
    num = num - 1;
    list[index].num = num;
    // 渲染页面
    this.setData({
      list: list
    });
    // 调用计算金额方法
    this.count_price();
  },
  // 提交订单
  btn_submit_order: function () {
    var that = this;
    console.log(that.data.totalPrice);

    // 调起支付
    // wx.requestPayment(
    //   {
    //     'timeStamp': '',
    //     'nonceStr': '',
    //     'package': '',
    //     'signType': 'MD5',
    //     'paySign': '',
    //     'success': function (res) { },
    //     'fail': function (res) { },
    //     'complete': function (res) { }
    //   })
    wx.showModal({
      title: '提示',
      content: '合计金额-' + that.data.totalPrice + "暂未开发",
    })
  },
  // 收藏
  btn_collert: function () {
    wx.showToast({
      title: '收藏暂未开发',
      duration: 2000
    })
  },
  /**
   * 计算总价
   */
  count_price() {
    // 获取商品列表数据
    let list = this.data.list;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 判断选中计算价格
      if (list[i].selected) {
        // 所有价格加起来 count_money
        total += list[i].num * list[i].price;
      }
    }
    // 最后赋值到data中渲染到页面
    this.setData({
      list: list,
      totalPrice: total.toFixed(2)
    });
  },
  //手指触摸动作开始 记录起点X坐标

  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.list.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      list: this.data.list
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
    that.data.list.forEach((v, i) => {
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
      list: that.data.list
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
    let list = that.data.list;
    wx.showModal({
      title: '温馨提示！',
      content: '你确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('444')
          list.splice(index, 1)
          that.setData({
            list: list
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })


  },

})